/**
 * Netlify Function: Generate Design Images via Replicate API
 *
 * Proxy endpoint for image generation using Replicate's FLUX 1.1 Pro model
 * API Key stored in Netlify environment variables (REPLICATE_API_KEY)
 */

import { createClient } from '@supabase/supabase-js'

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_KEY

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

// Image generation models (in order of preference/availability)
const MODELS_TO_TRY = [
  'black-forest-labs/flux-1.1-pro',
  'black-forest-labs/flux-dev',
  'stability-ai/sdxl-turbo',
  'runwayml/stable-diffusion-v1-5'
]

let MODEL = MODELS_TO_TRY[0]

/**
 * Map aspect ratio to image dimensions
 */
function getDimensions(aspectRatio) {
  const ratios = {
    '1:1': { width: 512, height: 512 },
    '16:9': { width: 576, height: 324 },
    '9:16': { width: 324, height: 576 },
    '4:3': { width: 512, height: 384 },
    '3:2': { width: 512, height: 341 }
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
  return `${prompt}, ${modifier}, high quality, professional, detailed`
}

/**
 * Call Replicate API to generate images
 */
async function callReplicateAPI(prompt, width, height, count = 1) {
  const predictions = []

  for (let i = 0; i < count; i++) {
    const seed = Math.floor(Math.random() * 1000000)

    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: MODEL,
        input: {
          prompt: prompt,
          width: width,
          height: height,
          seed: seed,
          go_fast: true
        }
      })
    })

    if (!response.ok) {
      const error = await response.text()

      if (response.status === 422) {
        console.warn('[generate-design] 422 Model Access Error - Replicate account needs verification')
        const err = new Error('Model access limited - Replicate account needs billing verification')
        err.status = 422
        throw err
      }

      throw new Error(`Replicate API error: ${response.status}`)
    }

    const prediction = await response.json()
    predictions.push(prediction)
  }

  // Poll for completion
  const maxAttempts = 60
  let attempts = 0
  const images = []

  while (attempts < maxAttempts) {
    let allComplete = true

    for (const pred of predictions) {
      if (pred.status === 'succeeded') {
        if (!images.includes(pred.id)) {
          images.push(...(pred.output || []))
        }
      } else if (pred.status === 'failed') {
        throw new Error('Image generation failed')
      } else {
        allComplete = false

        const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${pred.id}`, {
          headers: { 'Authorization': `Token ${REPLICATE_API_TOKEN}` }
        })

        if (pollResponse.ok) {
          const updated = await pollResponse.json()
          Object.assign(pred, updated)
        }
      }
    }

    if (allComplete) break

    await new Promise(resolve => setTimeout(resolve, 2000))
    attempts++
  }

  if (images.length === 0) {
    throw new Error('Image generation timeout or no results')
  }

  return images
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
      console.log('[generate-design] Request authenticated')
    } catch (authError) {
      console.error('[generate-design] Auth failed:', authError.message)
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized', details: authError.message })
      }
    }

    // Verify API key is configured
    if (!REPLICATE_API_TOKEN) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Replicate API key not configured' })
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
    const images = await callReplicateAPI(enhancedPrompt, width, height, numImages)

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        images: images.map(url => ({
          url,
          alt: prompt
        })),
        metadata: {
          model: 'FLUX Pro',
          dimensions: { width, height },
          count: images.length
        }
      })
    }
  } catch (error) {
    console.error('[generate-design] Image generation error')

    // Handle 422 model access error with proper status code
    if (error.status === 422) {
      return {
        statusCode: 422,
        headers,
        body: JSON.stringify({
          success: false,
          error: error.message || 'Model access limited',
          status: 422,
          message: 'Replicate account needs billing verification. Visit https://replicate.com/account/api'
        })
      }
    }

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
