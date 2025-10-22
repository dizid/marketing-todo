// netlify/functions/grok-proxy.js
// Netlify serverless function to proxy requests to Grok AI API
// Handles authentication and API communication securely

exports.handler = async (event) => {
  console.log('Function invoked at:', new Date().toISOString())
  console.log('Raw event:', JSON.stringify(event, null, 2))

  console.log('Environment variables:', {
    GROK_API_KEY: process.env.GROK_API_KEY ? 'present' : 'missing',
  })

  const sendResponse = (statusCode, body) => {
    console.log('Sending response:', { statusCode, body })
    return {
      statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify(body),
    }
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: ''
    }
  }

  if (event.httpMethod !== 'POST') {
    console.error('Invalid method:', event.httpMethod)
    return sendResponse(405, { error: 'Method Not Allowed' })
  }

  try {
    if (!event.body) {
      console.error('Request body is empty or undefined')
      return sendResponse(400, { error: 'Request body is empty' })
    }

    let requestBody
    try {
      console.log('Raw request body:', event.body)
      requestBody = JSON.parse(event.body)
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError.message)
      return sendResponse(400, { error: 'Invalid request body format' })
    }

    if (!process.env.GROK_API_KEY) {
      console.error('GROK_API_KEY environment variable is missing')
      return sendResponse(500, { error: 'Server configuration error: Missing API key' })
    }

    const { userData, requestType } = requestBody
    if (!requestType) {
      return sendResponse(400, { error: 'Missing requestType' })
    }

    // Create dynamic prompt based on request type
    const prompt = `Provide personalized ${requestType} based on the following data:
- Triggers: ${JSON.stringify(userData.triggers || [])}
- Historical Data: ${JSON.stringify(userData.historicalDrinkingPatterns || {})}
- Context Frequencies: ${JSON.stringify(userData.contextFrequencies || {})}
- Reflections: ${JSON.stringify(userData.reflections || [])}

Structure the advice in short paragraphs (1-2 sentences each) with clear sections.
Keep it encouraging, concise, and supportive.`

    console.log('Sending prompt to API:', prompt)

    // Use grok-3 model for faster responses
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-3',
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Grok API error:', response.status, errorText)
      return sendResponse(500, { error: `Grok API error: ${response.status} - ${errorText}` })
    }

    let data
    try {
      const responseText = await response.text()
      console.log('Raw Grok API response:', responseText)
      data = JSON.parse(responseText)
      console.log('Parsed Grok API response:', JSON.stringify(data, null, 2))
    } catch (parseError) {
      console.error('Failed to parse Grok API response:', parseError.message)
      return sendResponse(500, { error: 'Invalid response format from Grok API' })
    }

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid Grok API response structure:', JSON.stringify(data, null, 2))
      return sendResponse(500, { error: 'Invalid response structure from Grok API' })
    }

    const aiResponse = data.choices[0].message.content || 'No specific response generated; please try again.'
    if (!data.choices[0].message.content) {
      console.warn('Grok API returned empty content:', data)
    }

    return sendResponse(200, {
      [requestType === 'mainAdvice' ? 'advice' : 'response']: aiResponse
    })
  } catch (error) {
    console.error('Error in Grok proxy:', error.message, error.stack)
    return sendResponse(500, { error: `Failed to get AI response: ${error.message}` })
  }
}
