/**
 * Social Media Post Function
 *
 * Posts content to social media platforms (Twitter/X, LinkedIn).
 * Requires OAuth tokens stored in user's database record.
 *
 * Supported platforms:
 * - Twitter/X (via Twitter API v2)
 * - LinkedIn (via LinkedIn Share API) - future
 *
 * Environment variables required:
 * - TWITTER_CLIENT_ID: Twitter OAuth 2.0 Client ID
 * - TWITTER_CLIENT_SECRET: Twitter OAuth 2.0 Client Secret
 * - SUPABASE_URL: Supabase project URL
 * - SUPABASE_SERVICE_KEY: Supabase service role key (for reading user tokens)
 */

const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Twitter API v2 base URL
const TWITTER_API_BASE = 'https://api.twitter.com/2'

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  }

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
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
    // Parse request body
    const body = JSON.parse(event.body || '{}')
    const { platform, content, userId, accessToken } = body

    if (!platform || !content) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields: platform, content' })
      }
    }

    // Validate content length
    if (platform === 'twitter' && content.length > 280) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Tweet exceeds 280 character limit' })
      }
    }

    // Route to appropriate platform handler
    let result
    switch (platform.toLowerCase()) {
      case 'twitter':
      case 'x':
        result = await postToTwitter(content, accessToken, userId)
        break
      case 'linkedin':
        result = await postToLinkedIn(content, accessToken, userId)
        break
      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: `Unsupported platform: ${platform}` })
        }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    }

  } catch (error) {
    console.error('Social post error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message || 'Failed to post to social media',
        code: error.code || 'UNKNOWN_ERROR'
      })
    }
  }
}

/**
 * Post to Twitter/X using API v2
 * @param {string} content - The tweet text
 * @param {string} accessToken - User's OAuth 2.0 access token
 * @param {string} userId - User ID for token lookup if not provided
 */
async function postToTwitter(content, accessToken, userId) {
  // If no access token provided, try to get from database
  let token = accessToken
  if (!token && userId) {
    const { data, error } = await supabase
      .from('social_connections')
      .select('access_token, refresh_token, expires_at')
      .eq('user_id', userId)
      .eq('platform', 'twitter')
      .single()

    if (error || !data) {
      throw new Error('Twitter not connected. Please connect your Twitter account first.')
    }

    // Check if token is expired and refresh if needed
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      token = await refreshTwitterToken(userId, data.refresh_token)
    } else {
      token = data.access_token
    }
  }

  if (!token) {
    throw new Error('No Twitter access token available. Please connect your Twitter account.')
  }

  // Post to Twitter API v2
  const response = await fetch(`${TWITTER_API_BASE}/tweets`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: content
    })
  })

  const responseData = await response.json()

  if (!response.ok) {
    console.error('Twitter API error:', responseData)
    throw new Error(responseData.detail || responseData.title || 'Failed to post tweet')
  }

  return {
    success: true,
    platform: 'twitter',
    postId: responseData.data?.id,
    postUrl: `https://twitter.com/i/web/status/${responseData.data?.id}`
  }
}

/**
 * Refresh Twitter OAuth 2.0 token
 */
async function refreshTwitterToken(userId, refreshToken) {
  const clientId = process.env.TWITTER_CLIENT_ID
  const clientSecret = process.env.TWITTER_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('Twitter API credentials not configured')
  }

  const response = await fetch('https://api.twitter.com/2/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error('Failed to refresh Twitter token')
  }

  // Update tokens in database
  const expiresAt = new Date(Date.now() + data.expires_in * 1000).toISOString()
  await supabase
    .from('social_connections')
    .update({
      access_token: data.access_token,
      refresh_token: data.refresh_token || refreshToken,
      expires_at: expiresAt
    })
    .eq('user_id', userId)
    .eq('platform', 'twitter')

  return data.access_token
}

/**
 * Post to LinkedIn (placeholder for future implementation)
 */
async function postToLinkedIn(content, accessToken, userId) {
  // LinkedIn requires app approval for posting
  // This is a placeholder for future implementation
  throw new Error('LinkedIn posting is coming soon! For now, copy your content and post directly.')
}
