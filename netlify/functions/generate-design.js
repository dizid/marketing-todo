/**
 * Netlify Function: Generate Design Images via Replicate API
 *
 * Proxy endpoint for image generation using Replicate's SDXL Turbo model
 * API Key stored in Netlify environment variables (REPLICATE_API_KEY)
 */

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_KEY
const REPLICATE_API_URL = 'https://api.replicate.com/v1/predictions'

// Image generation models (in order of preference/availability)
// Try SDXL first (best quality), fall back to turbo if needed
const MODELS_TO_TRY = [
  'stability-ai/sdxl',           // Best quality
  'stability-ai/sdxl-turbo',     // Faster
  'runwayml/stable-diffusion-v1-5',  // Classic, widely available
  'prompthero/openjourney-v4'    // Alternative style
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

  // Create concurrent requests for multiple images
  for (let i = 0; i < count; i++) {
    const seed = Math.floor(Math.random() * 1000000)

    const response = await fetch(REPLICATE_API_URL, {
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
          num_inference_steps: 25, // Good balance of quality and speed
          guidance_scale: 7.5,
          seed: seed
        }
      })
    })

    if (!response.ok) {
      const error = await response.text()

      // If it's a permission/access error, throw a specific error
      if (response.status === 422) {
        console.warn('⚠️ 422 Model Access Error - Replicate account needs verification')
        const err = new Error('Model access limited - Replicate account needs billing verification')
        err.status = 422
        throw err
      }

      throw new Error(`Replicate API error: ${response.status} ${error}`)
    }

    const prediction = await response.json()
    predictions.push(prediction)
  }

  // Poll for completion
  const maxAttempts = 60 // 120 seconds with 2s intervals
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
        throw new Error(`Image generation failed: ${pred.error}`)
      } else {
        allComplete = false

        // Poll this prediction
        const pollResponse = await fetch(`${REPLICATE_API_URL}/${pred.id}`, {
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
          model: 'sdxl-turbo',
          dimensions: { width, height },
          count: images.length
        }
      })
    }
  } catch (error) {
    console.error('Image generation error:', error)

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
        error: error.message || 'Image generation failed'
      })
    }
  }
}
