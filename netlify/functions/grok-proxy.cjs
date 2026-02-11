// netlify/functions/grok-proxy.js
// Netlify serverless function to proxy requests to Grok AI API
// Handles authentication and LLM-style API communication securely
// Also tracks AI usage to Supabase for quota management

const { createClient } = require('@supabase/supabase-js')
const { verifyAuth, getCorsOrigin } = require('./utils/auth.cjs')

// Initialize Supabase client with service role for quota tracking
// Note: These may be undefined - we check in trackAIUsage before using
let supabase = null
try {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.VITE_SUPABASE_URL) {
    supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  }
} catch (err) {
  console.warn('[grok-proxy] Failed to initialize Supabase:', err.message)
  supabase = null
}

/**
 * Track AI usage in Supabase (server-side with service role)
 */
async function trackAIUsage(userId, taskId, model, tokensInput, tokensOutput) {
  try {
    console.log('[grok-proxy] Tracking usage for task, tokens:', tokensOutput)

    // Verify we have Supabase client initialized
    if (!supabase) {
      console.warn('[grok-proxy] Supabase not configured - skipping usage tracking')
      console.warn('[grok-proxy] Required env vars: SUPABASE_SERVICE_ROLE_KEY, VITE_SUPABASE_URL')
      return false
    }

    const { data, error } = await supabase
      .from('ai_usage')
      .insert([{
        user_id: userId,
        task_id: taskId,
        model: model,
        tokens_input: tokensInput,
        tokens_output: tokensOutput,
        cost_estimate: 0 // Calculated server-side if needed
      }])
      .select()

    if (error) {
      console.error('[grok-proxy] Failed to track usage')
      // Don't throw - usage tracking should not fail the generation
      return false
    }

    console.log('[grok-proxy] Usage tracked successfully')
    return true
  } catch (err) {
    console.error('[grok-proxy] Exception in trackAIUsage:', err.message)
    return false
  }
}

/**
 * Build a comprehensive prompt for executive summary generation
 * Analyzes project data and requests prioritized quick-win tasks
 */
function buildExecutiveSummaryPrompt(userData) {
  const {
    projectGoals = '',
    appDescription = '',
    targetAudience = '',
    techStack = '',
    progress = 0,
    completedTasks = 0,
    totalTasks = 0,
    checklist = []
  } = userData

  const categoryBreakdown = checklist
    .map(cat => `- ${cat.category}: ${cat.completedCount}/${cat.totalCount} completed`)
    .join('\n')

  return `You are an expert marketing and business strategist. Analyze the following project data and provide:

PROJECT OVERVIEW:
- Description: ${appDescription || 'N/A'}
- Target Audience: ${targetAudience || 'N/A'}
- Goals: ${projectGoals || 'N/A'}
- Tech Stack: ${techStack || 'N/A'}

PROJECT PROGRESS:
- Overall Progress: ${progress}% (${completedTasks}/${totalTasks} tasks completed)
- Category Breakdown:
${categoryBreakdown || 'No category data available'}

REQUIRED OUTPUT FORMAT:

## Executive Summary
Provide a 2-3 sentence executive summary of the project status, including:
- Current momentum and progress status
- Key strengths or completed work
- Most critical gap or next focus area

## Priority Quick-Win Tasks
Provide exactly 3-5 priority tasks ranked by "quick wins" (high impact, low effort).
Format each task as:
[Task Number]. [Task Title]
   - Impact: [High/Medium/Low]
   - Effort: [Low/Medium/High]
   - Why: [Brief explanation of why this matters]
   - Next Steps: [1-2 specific action items]

IMPORTANT: Prioritize tasks that:
1. Require minimal effort but have significant impact
2. Address the identified gaps in the project
3. Align with stated goals
4. Can be completed quickly to build momentum

Provide actionable, specific recommendations tailored to this project.`
}

exports.handler = async (event) => {
  console.log('[grok-proxy] Function invoked at:', new Date().toISOString())
  console.log('[grok-proxy] HTTP Method:', event.httpMethod)

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': getCorsOrigin(event),
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      },
      body: ''
    }
  }

  if (event.httpMethod !== 'POST') {
    console.error('[grok-proxy] Invalid HTTP method:', event.httpMethod)
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': getCorsOrigin(event) },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    }
  }

  try {
    // Verify authentication
    let verifiedUserId
    try {
      const auth = await verifyAuth(event)
      verifiedUserId = auth.userId
      console.log('[grok-proxy] Request authenticated')
    } catch (authError) {
      console.error('[grok-proxy] Auth failed:', authError.message)
      return {
        statusCode: 401,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': getCorsOrigin(event) },
        body: JSON.stringify({ error: 'Unauthorized', details: authError.message })
      }
    }

    // Parse request body
    if (!event.body) {
      console.error('[grok-proxy] Request body is empty or undefined')
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': getCorsOrigin(event) },
        body: JSON.stringify({ error: 'Request body is empty' })
      }
    }

    let requestBody
    try {
      requestBody = JSON.parse(event.body)
    } catch (parseError) {
      console.error('[grok-proxy] Failed to parse request body')
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': getCorsOrigin(event) },
        body: JSON.stringify({ error: 'Invalid request body format' })
      }
    }

    // Extract fields - use verified userId instead of client-supplied
    let { model, messages, temperature, max_tokens, userData, requestType, taskId } = requestBody
    const userId = verifiedUserId

    // Allowlist of permitted models
    const ALLOWED_MODELS = ['grok-3-fast', 'grok-3', 'grok-2-image-1212']
    if (model && !ALLOWED_MODELS.includes(model)) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': getCorsOrigin(event) },
        body: JSON.stringify({ error: `Model not allowed. Permitted: ${ALLOWED_MODELS.join(', ')}` })
      }
    }

    // Clamp temperature and max_tokens to safe ranges
    temperature = Math.max(0, Math.min(2, temperature || 0.7))
    max_tokens = Math.max(1, Math.min(4000, max_tokens || 1500))

    // Handle different request types
    if (requestType === 'executiveSummary') {
      console.log('[grok-proxy] Processing executiveSummary request')
      // Build prompt for executive summary
      const summaryPrompt = buildExecutiveSummaryPrompt(userData)
      messages = [{ role: 'user', content: summaryPrompt }]
      model = model || 'grok-3-fast'
      temperature = temperature !== undefined ? temperature : 0.5
      max_tokens = max_tokens || 1500
    } else {
      // Default behavior for other request types
      if (!model) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': getCorsOrigin(event) },
          body: JSON.stringify({ error: 'Missing required field: model' })
        }
      }

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': getCorsOrigin(event) },
          body: JSON.stringify({ error: 'Missing or invalid required field: messages' })
        }
      }
    }

    // Check for API key
    if (!process.env.GROK_API_KEY) {
      console.error('[grok-proxy] GROK_API_KEY environment variable is missing')
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': getCorsOrigin(event) },
        body: JSON.stringify({ error: 'Server configuration error: Missing API key' })
      }
    }

    // Check quota before calling Grok API
    if (userId) {
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { count, error: countError } = await supabase
        .from('ai_usage')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', startOfMonth.toISOString())

      if (!countError) {
        // Get user's tier from subscriptions table
        const { data: subData } = await supabase
          .from('subscriptions')
          .select('tier')
          .eq('user_id', userId)
          .single()

        const tier = subData?.tier || 'free'
        const limit = tier === 'premium' ? 400 : 40  // Match QUOTA_CONFIG in constants.js

        if (count >= limit) {
          return {
            statusCode: 429,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': getCorsOrigin(event) },
            body: JSON.stringify({
              error: 'Monthly AI generation quota exceeded',
              quota: { used: count, limit, tier, resetDate: startOfMonth.toISOString() }
            })
          }
        }
      }
    }

    console.log('[grok-proxy] Forwarding request to Grok API with model:', model)
    console.log('[grok-proxy] Request has', messages.length, 'message(s)')

    // Forward request to Grok API with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      console.error('[grok-proxy] Aborting request due to timeout')
      controller.abort()
    }, 60000) // 60 second timeout (increased from 30s)

    let grokResponse
    try {
      console.log('[grok-proxy] Making fetch request to Grok API...')
      const startTime = Date.now()

      grokResponse = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model || 'grok-3-fast',
          messages: messages,
          temperature: temperature || 0.7,
          max_tokens: max_tokens || 1500
        }),
        signal: controller.signal
      })

      const elapsed = Date.now() - startTime
      console.log('[grok-proxy] Grok API responded in', elapsed, 'ms with status:', grokResponse.status)
      clearTimeout(timeoutId)
    } catch (fetchError) {
      clearTimeout(timeoutId)
      if (fetchError.name === 'AbortError') {
        console.error('[grok-proxy] Grok API request timed out')
        return {
          statusCode: 504,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': getCorsOrigin(event) },
          body: JSON.stringify({ error: 'Grok API request timed out' })
        }
      }
      console.error('[grok-proxy] Failed to connect to Grok API')
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': getCorsOrigin(event) },
        body: JSON.stringify({ error: 'Failed to connect to Grok API' })
      }
    }

    if (!grokResponse.ok) {
      const errorText = await grokResponse.text()
      console.error('[grok-proxy] Grok API error:', grokResponse.status)
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': getCorsOrigin(event) },
        body: JSON.stringify({
          error: `Grok API error: ${grokResponse.status}`
        })
      }
    }

    // Parse and validate response
    let responseData
    try {
      responseData = await grokResponse.json()
    } catch (parseError) {
      console.error('[grok-proxy] Failed to parse Grok API response')
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': getCorsOrigin(event) },
        body: JSON.stringify({ error: 'Invalid response format from Grok API' })
      }
    }

    // Validate response structure
    if (!responseData.choices || !Array.isArray(responseData.choices) || responseData.choices.length === 0) {
      console.error('[grok-proxy] Invalid Grok API response structure')
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': getCorsOrigin(event) },
        body: JSON.stringify({ error: 'Invalid response structure from Grok API' })
      }
    }

    const choice = responseData.choices[0]
    if (!choice.message || !choice.message.content) {
      console.error('[grok-proxy] Missing message content in response')
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': getCorsOrigin(event) },
        body: JSON.stringify({ error: 'No content in Grok API response' })
      }
    }

    console.log('[grok-proxy] Successfully forwarded response to client')

    // Track usage if userId and taskId provided
    if (userId && taskId) {
      const tokensInput = requestBody.messages?.reduce((sum, msg) => sum + (msg.content?.length || 0) / 4, 0) || 0
      const tokensOutput = responseData.usage?.completion_tokens || responseData.choices[0].message.content.length / 4

      await trackAIUsage(userId, taskId, model, Math.ceil(tokensInput), Math.ceil(tokensOutput))
    }

    // Return the full response in OpenAI format
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': getCorsOrigin(event),
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      },
      body: JSON.stringify(responseData)
    }
  } catch (error) {
    console.error('[grok-proxy] Unexpected error:', error.message)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': getCorsOrigin(event) },
      body: JSON.stringify({ error: 'Failed to process request' })
    }
  }
}
