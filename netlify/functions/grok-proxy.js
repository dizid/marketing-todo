// netlify/functions/grok-proxy.js
// Netlify serverless function to proxy requests to Grok AI API
// Handles authentication and LLM-style API communication securely

export const handler = async (event) => {
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

    // Validate required fields for LLM API format
    const { model, messages, temperature, max_tokens } = requestBody

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
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    let grokResponse
    try {
      grokResponse = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model || 'grok-beta',
          messages: messages,
          temperature: temperature || 0.7,
          max_tokens: max_tokens || 2000
        }),
        signal: controller.signal
      })
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
