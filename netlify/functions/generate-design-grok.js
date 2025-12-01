/**
 * Netlify Function: Generate Design Images via Grok API
 *
 * Uses xAI Grok's image generation API to create high-quality images
 * API Key stored in Netlify environment variables (GROK_API_KEY)
 */

const GROK_API_KEY = process.env.GROK_API_KEY
const GROK_API_URL = 'https://api.x.ai/v1/images/generations'

/**
 * Map aspect ratio to image dimensions
 */
function getDimensions(aspectRatio) {
  const ratios = {
    '1:1': { width: 1024, height: 1024 },
    '16:9': { width: 1024, height: 576 },
    '9:16': { width: 576, height: 1024 },
    '4:3': { width: 1024, height: 768 },
    '3:2': { width: 1024, height: 683 }
  }
  return ratios[aspectRatio] || ratios['1:1']
}

/**
 * Enhance prompt with style modifiers
 */
function enhancePrompt(prompt, style = 'professional') {
  const styleModifiers = {
    'modern-minimal': 'minimal, clean, spacious, contemporary',
    'bold-vibrant': 'vibrant, energetic, bold, colorful, eye-catching',
    'professional': 'professional, corporate, business, polished',
    'playful': 'playful, friendly, fun, approachable, casual',
    'luxury': 'luxury, premium, high-end, sophisticated, elegant',
    'tech': 'tech-focused, futuristic, modern, innovation, digital'
  }

  const modifier = styleModifiers[style] || styleModifiers['professional']
  return `${prompt}, ${modifier}, high quality, detailed`
}

/**
 * Call Grok API to generate images
 */
async function callGrokAPI(prompt, width, height, count = 1) {
  try {
    const response = await fetch(GROK_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'grok-2-image-1212',
        prompt: prompt,
        n: count,
        response_format: 'url'
      })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Grok API error: ${response.status} ${error}`)
    }

    const data = await response.json()

    // Extract URLs from Grok response
    const images = data.data.map(item => item.url)

    return images
  } catch (error) {
    console.error('Grok API call failed:', error)
    throw error
  }
}

/**
 * Netlify Function Handler
 */
export const handler = async (event) => {
  // CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers }
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    // Verify API key is configured
    if (!GROK_API_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Grok API key not configured' })
      }
    }

    const body = JSON.parse(event.body)
    const { prompt, numImages = 4, aspectRatio = '1:1', style = 'professional' } = body

    // Validate input
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'prompt is required and must be non-empty string' })
      }
    }

    // Enhance prompt with style
    const enhancedPrompt = enhancePrompt(prompt.trim(), style)

    // Get dimensions from aspect ratio
    const { width, height } = getDimensions(aspectRatio)

    // Generate images
    const images = await callGrokAPI(enhancedPrompt, width, height, numImages)

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        images: images.map(url => (
          {
            url,
            alt: prompt
          }
        )),
        metadata: {
          model: 'Grok 2 Image',
          dimensions: { width, height },
          count: images.length,
          provider: 'grok'
        }
      })
    }
  } catch (error) {
    console.error('Image generation error:', error)

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message || 'Image generation failed'
      })
    }
  }
}
