// netlify/functions/r2-publish.cjs
// Netlify serverless function to publish landing pages to Cloudflare R2
// R2 is S3-compatible, so we use the AWS SDK

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')

// Initialize R2 client (S3-compatible)
const getR2Client = () => {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error('Missing R2 configuration. Required: CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_R2_ACCESS_KEY_ID, CLOUDFLARE_R2_SECRET_ACCESS_KEY')
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey
    }
  })
}

/**
 * Generate a URL-safe slug from text
 */
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 50) // Limit length
}

/**
 * Generate a short random ID
 */
function generateId() {
  return Math.random().toString(36).substring(2, 8)
}

exports.handler = async (event) => {
  console.log('[r2-publish] Function invoked at:', new Date().toISOString())
  console.log('[r2-publish] HTTP Method:', event.httpMethod)

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
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    }
  }

  try {
    // Parse request body
    if (!event.body) {
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
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Invalid request body format' })
      }
    }

    const { html, brandName } = requestBody

    if (!html) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Missing required field: html' })
      }
    }

    // Generate filename
    const slug = slugify(brandName || 'landing-page')
    const id = generateId()
    const filename = `lp/${slug}-${id}.html`

    console.log('[r2-publish] Publishing to:', filename)

    // Get R2 client
    const r2 = getR2Client()
    const bucketName = process.env.R2_BUCKET_NAME || 'dizid-shares'
    const publicUrl = process.env.R2_PUBLIC_URL || 'https://pub-b0f91d861de44c319ebbc7452163d7cc.r2.dev'

    // Upload to R2
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: filename,
      Body: html,
      ContentType: 'text/html; charset=utf-8',
      CacheControl: 'public, max-age=31536000' // Cache for 1 year
    })

    await r2.send(command)

    const liveUrl = `${publicUrl}/${filename}`
    console.log('[r2-publish] Successfully published to:', liveUrl)

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        success: true,
        url: liveUrl,
        filename
      })
    }
  } catch (error) {
    console.error('[r2-publish] Error:', error.message, error.stack)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: `Failed to publish: ${error.message}` })
    }
  }
}
