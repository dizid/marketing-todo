// netlify/functions/grok-proxy.js
// Netlify serverless function to proxy requests to Grok AI API
// Handles authentication and LLM-style API communication securely

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

const handler = async (event) => {
  console.log('[grok-proxy] Function invoked at:', new Date().toISOString())
  console.log('[grok-proxy] HTTP Method:', event.httpMethod)

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: ''
    }
  }

  if (event.httpMethod !== 'POST') {
    console.error('[grok-proxy] Invalid HTTP method:', event.httpMethod)
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    }
  }

  try {
    // Parse request body
    if (!event.body) {
      console.error('[grok-proxy] Request body is empty or undefined')
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Request body is empty' })
      }
    }

    let requestBody
    try {
      requestBody = JSON.parse(event.body)
    } catch (parseError) {
      console.error('[grok-proxy] Failed to parse request body:', parseError.message)
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Invalid request body format' })
      }
    }

    // Extract fields
    let { model, messages, temperature, max_tokens, userData, requestType } = requestBody

    // Handle different request types
    if (requestType === 'executiveSummary') {
      console.log('[grok-proxy] Processing executiveSummary request')
      // Build prompt for executive summary
      const summaryPrompt = buildExecutiveSummaryPrompt(userData)
      messages = [{ role: 'user', content: summaryPrompt }]
      model = model || 'grok-2'
      temperature = temperature !== undefined ? temperature : 0.5
      max_tokens = max_tokens || 2500
    } else {
      // Default behavior for other request types
      if (!model) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ error: 'Missing required field: model' })
        }
      }

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ error: 'Missing or invalid required field: messages' })
        }
      }
    }

    // Check for API key
    if (!process.env.GROK_API_KEY) {
      console.error('[grok-proxy] GROK_API_KEY environment variable is missing')
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Server configuration error: Missing API key' })
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
          model: model || 'grok-2',
          messages: messages,
          temperature: temperature || 0.7,
          max_tokens: max_tokens || 2000
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
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ error: 'Grok API request timed out' })
        }
      }
      console.error('[grok-proxy] Failed to connect to Grok API:', fetchError.message)
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: `Failed to connect to Grok API: ${fetchError.message}` })
      }
    }

    if (!grokResponse.ok) {
      const errorText = await grokResponse.text()
      console.error('[grok-proxy] Grok API error:', grokResponse.status, errorText)
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          error: `Grok API error: ${grokResponse.status}`,
          details: errorText
        })
      }
    }

    // Parse and validate response
    let responseData
    try {
      responseData = await grokResponse.json()
    } catch (parseError) {
      console.error('[grok-proxy] Failed to parse Grok API response:', parseError.message)
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Invalid response format from Grok API' })
      }
    }

    // Validate response structure
    if (!responseData.choices || !Array.isArray(responseData.choices) || responseData.choices.length === 0) {
      console.error('[grok-proxy] Invalid Grok API response structure:', JSON.stringify(responseData, null, 2))
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Invalid response structure from Grok API' })
      }
    }

    const choice = responseData.choices[0]
    if (!choice.message || !choice.message.content) {
      console.error('[grok-proxy] Missing message content in response:', JSON.stringify(responseData, null, 2))
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'No content in Grok API response' })
      }
    }

    console.log('[grok-proxy] Successfully forwarded response to client')

    // Return the full response in OpenAI format
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify(responseData)
    }
  } catch (error) {
    console.error('[grok-proxy] Unexpected error:', error.message, error.stack)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: `Failed to process request: ${error.message}` })
    }
  }
}

export { handler }
