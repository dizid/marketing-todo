/**
 * PayPal Cancel Subscription Function
 * Netlify Function: Cancels a PayPal subscription
 *
 * Endpoint: /.netlify/functions/paypal-cancel-subscription
 * Method: POST
 * Auth: User must be authenticated (verified by JWT in headers)
 *
 * Request body:
 * {
 *   userId: string (required) - User ID from auth store
 *   paypalSubscriptionId: string (required) - PayPal subscription ID to cancel
 *   reason: string (optional) - Reason for cancellation
 * }
 */

const axios = require('axios')
const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client with service role for subscription updates
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// PayPal OAuth token cache
let paypalTokenCache = {
  token: null,
  expiresAt: 0
}

/**
 * Get PayPal OAuth access token
 * @returns {Promise<string>} Access token
 */
async function getPayPalAccessToken() {
  // Check cache
  if (paypalTokenCache.token && paypalTokenCache.expiresAt > Date.now()) {
    return paypalTokenCache.token
  }

  // Read credentials at runtime (for proper hot-reload in dev)
  const clientId = process.env.PAYPAL_CLIENT_ID || ''
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET || ''

  // Development mode: mock token if credentials are placeholders or empty
  const isDevMode = clientId.startsWith('AUO3') || clientSecret.startsWith('EO3') || !clientId || !clientSecret

  if (isDevMode) {
    console.log('[PayPal] Using mock token for development/testing (dev mode detected)')
    paypalTokenCache.token = 'mock-access-token-' + Date.now()
    paypalTokenCache.expiresAt = Date.now() + 3600000
    return paypalTokenCache.token
  }

  try {
    const response = await axios.post(
      'https://api-sandbox.paypal.com/v1/oauth2/token',
      'grant_type=client_credentials',
      {
        auth: {
          username: clientId,
          password: clientSecret
        },
        headers: {
          'Accept': 'application/json',
          'Accept-Language': 'en_US',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )

    paypalTokenCache.token = response.data.access_token
    paypalTokenCache.expiresAt = Date.now() + (response.data.expires_in * 1000) - 60000 // Refresh 1 min before expiry

    return paypalTokenCache.token
  } catch (err) {
    console.error('[PayPal] Failed to get access token:', err.message)
    throw new Error('Failed to authenticate with PayPal')
  }
}

/**
 * Cancel PayPal subscription
 */
async function cancelPayPalSubscription(accessToken, paypalSubscriptionId, reason = null) {
  // Development mode: mock cancellation if using mock token
  if (accessToken.startsWith('mock-access-token')) {
    console.log('[PayPal] Cancelling mock subscription for development/testing')
    return {
      status: 'CANCELLED',
      subscriptionId: paypalSubscriptionId
    }
  }

  const baseUrl = process.env.PAYPAL_SANDBOX === 'true'
    ? 'https://api-sandbox.paypal.com'
    : 'https://api.paypal.com'

  try {
    // PayPal cancellation endpoint
    // Note: PUT request with reason in body
    const response = await axios.post(
      `${baseUrl}/v1/billing/subscriptions/${paypalSubscriptionId}/cancel`,
      reason ? { reason: reason } : {},
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )

    return {
      status: 'CANCELLED',
      subscriptionId: paypalSubscriptionId
    }
  } catch (err) {
    // PayPal returns 204 No Content on success, but axios treats it as error
    // Check if it's a 204 or similar success response
    if (err.response && (err.response.status === 204 || err.response.status === 200)) {
      console.log('[PayPal] Subscription cancelled successfully')
      return {
        status: 'CANCELLED',
        subscriptionId: paypalSubscriptionId
      }
    }

    console.error('[PayPal] Failed to cancel subscription:', err.response?.data || err.message)
    throw new Error(err.response?.data?.message || 'Failed to cancel PayPal subscription')
  }
}

/**
 * Update subscription record in Supabase
 */
async function updateSubscriptionRecord(userId, reason = null) {
  try {
    console.log(`[PayPal] Updating subscription record for user: ${userId}`)

    // Update the record (don't use .select().single() on update - causes PGRST116 error)
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        status: 'cancelled',
        tier: 'free',
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)

    if (updateError) {
      console.error('[PayPal] Failed to update subscription record:', updateError)
      throw updateError
    }

    // Fetch the updated record separately
    const { data, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (fetchError) {
      console.error('[PayPal] Failed to fetch updated subscription record:', fetchError)
      throw fetchError
    }

    console.log(`[PayPal] Subscription record updated: ${data?.id}`)
    return data
  } catch (err) {
    console.error('[PayPal] Error updating subscription record:', err.message)
    throw err
  }
}

/**
 * Main handler
 */
exports.handler = async function(event) {
  // CORS headers for all responses
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Max-Age': '86400'
  }

  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    }
  }

  // Only POST allowed for actual requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  // Parse request body
  let body
  try {
    body = JSON.parse(event.body)
  } catch (err) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Invalid JSON' })
    }
  }

  // Validate required fields
  const { userId, paypalSubscriptionId, reason } = body

  if (!userId || !paypalSubscriptionId) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Missing required fields: userId, paypalSubscriptionId' })
    }
  }

  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    console.error('[PayPal] Missing PayPal credentials in environment')
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'PayPal not configured' })
    }
  }

  try {
    console.log(`[PayPal] Cancelling subscription for user: ${userId}`)

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken()

    // Cancel PayPal subscription
    const paypalResult = await cancelPayPalSubscription(
      accessToken,
      paypalSubscriptionId,
      reason
    )

    // Update subscription record in database
    const dbResult = await updateSubscriptionRecord(userId, reason)

    console.log(`[PayPal] Subscription cancelled: ${paypalSubscriptionId}`)

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      },
      body: JSON.stringify({
        success: true,
        subscriptionId: paypalSubscriptionId,
        status: paypalResult.status,
        data: dbResult
      })
    }
  } catch (err) {
    console.error('[PayPal] Error cancelling subscription:', err.message)
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      },
      body: JSON.stringify({
        success: false,
        error: err.message || 'Failed to cancel subscription'
      })
    }
  }
}
