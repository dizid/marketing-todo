/**
 * Shared authentication middleware for Netlify Functions
 * Verifies Supabase JWT from Authorization header
 */

const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client with service role key
let supabase = null
try {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.VITE_SUPABASE_URL) {
    supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  }
} catch (err) {
  console.warn('[auth] Failed to initialize Supabase:', err.message)
}

/**
 * Allowed CORS origins
 */
const ALLOWED_ORIGINS = [
  'https://launchpilot.marketing',
  'https://www.launchpilot.marketing',
  'http://localhost:3000',
  'http://localhost:3001'
]

/**
 * Get CORS origin from request
 * Returns the request origin if allowed, otherwise returns primary domain
 */
function getCorsOrigin(event) {
  const origin = event.headers?.origin || event.headers?.Origin || ''
  return ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
}

/**
 * Verify authentication from Supabase JWT token
 * Extracts Bearer token from Authorization header and verifies with Supabase
 *
 * @param {Object} event - Netlify function event object
 * @returns {Promise<Object>} - { userId, user } on success
 * @throws {Error} - If auth fails
 */
async function verifyAuth(event) {
  // Check Supabase is initialized
  if (!supabase) {
    console.error('[auth] Supabase not initialized - missing env vars')
    throw new Error('Authentication service not configured')
  }

  // Extract Authorization header
  const authHeader = event.headers?.authorization || event.headers?.Authorization
  if (!authHeader) {
    throw new Error('Missing authorization header')
  }

  // Extract Bearer token
  const tokenMatch = authHeader.match(/^Bearer (.+)$/)
  if (!tokenMatch || !tokenMatch[1]) {
    throw new Error('Invalid authorization header format')
  }

  const token = tokenMatch[1]

  // Verify token with Supabase
  try {
    const { data, error } = await supabase.auth.getUser(token)

    if (error) {
      console.error('[auth] Token verification failed:', error.message)
      throw new Error('Invalid or expired token')
    }

    if (!data?.user) {
      throw new Error('No user found for token')
    }

    return {
      userId: data.user.id,
      user: data.user
    }
  } catch (err) {
    console.error('[auth] Auth verification error:', err.message)
    throw new Error('Authentication failed')
  }
}

module.exports = {
  verifyAuth,
  getCorsOrigin,
  ALLOWED_ORIGINS
}
