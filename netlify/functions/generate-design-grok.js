/**
 * Netlify Function: Generate Design Images via Grok API
 *
 * Uses xAI Grok's image generation API to create high-quality images
 * API Key stored in Netlify environment variables (GROK_API_KEY)
 */

import { createClient } from '@supabase/supabase-js'

const GROK_API_KEY = process.env.GROK_API_KEY
const GROK_API_URL = 'https://api.x.ai/v1/images/generations'

// Initialize Supabase for auth verification
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// CORS allowed origins
const ALLOWED_ORIGINS = [
  'https://launchpilot.marketing',
  'https://www.launchpilot.marketing',
  'http://localhost:3000',
  'http://localhost:3001'
]

function getCorsOrigin(event) {
  const origin = event.headers?.origin || event.headers?.Origin || ''
  return ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
}

/**
 * Verify authentication from Supabase JWT token
 */
async function verifyAuth(event) {
  const authHeader = event.headers?.authorization || event.headers?.Authorization
  if (!authHeader) {
    throw new Error('Missing authorization header')
  }

  const tokenMatch = authHeader.match(/^Bearer (.+)$/)
  if (!tokenMatch || !tokenMatch[1]) {
    throw new Error('Invalid authorization header format')
  }

  const token = tokenMatch[1]

  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data?.user) {
    throw new Error('Invalid or expired token')
  }

  return {
    userId: data.user.id,
    user: data.user
  }
}

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
      throw new Error(`Grok API error: ${response.status}`)
    }

    const data = await response.json()

    // Extract URLs from Grok response
    const images = data.data.map(item => item.url)

    return images
  } catch (error) {
    console.error('[generate-design-grok] Grok API call failed')
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
    'Access-Control-Allow-Origin': getCorsOrigin(event),
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
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
    // Verify authentication
    try {
      await verifyAuth(event)
      console.log('[generate-design-grok] Request authenticated')
    } catch (authError) {
      console.error('[generate-design-grok] Auth failed:', authError.message)
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized', details: authError.message })
      }
    }

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
    console.error('[generate-design-grok] Image generation error')

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Image generation failed'
      })
    }
  }
}
