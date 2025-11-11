/**
 * PayPal Create Subscription Function
 * Netlify Function: Creates a PayPal subscription and returns approval URL
 *
 * Endpoint: /.netlify/functions/paypal-create-subscription
 * Method: POST
 * Auth: User must be authenticated (verified by JWT in headers)
 */

import axios from 'axios'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client with service role for subscription creation
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
 * Create subscription record in Supabase
 */
async function createSubscriptionRecord(userId, paypalSubscriptionId, paypalPayerId) {
  try {
    console.log(`[PayPal] Creating subscription record for user: ${userId}`)

    const now = new Date().toISOString()
    const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

    const { data, error } = await supabase
      .from('subscriptions')
      .insert([{
        user_id: userId,
        tier: 'premium',
        status: 'active',
        paypal_subscription_id: paypalSubscriptionId,
        paypal_payer_id: paypalPayerId,
        current_period_start: now,
        current_period_end: periodEnd,
        created_at: now,
        updated_at: now
      }])
      .select()
      .single()

    if (error) {
      console.error('[PayPal] Failed to create subscription record:', error)
      throw error
    }

    console.log(`[PayPal] Subscription record created: ${data?.id}`)
    return data
  } catch (err) {
    console.error('[PayPal] Error creating subscription record:', err.message)
    throw err
  }
}

/**
 * Create PayPal subscription
 */
async function createPayPalSubscription(accessToken, params) {
  // Development mode: mock subscription if using mock token
  if (accessToken.startsWith('mock-access-token')) {
    console.log('[PayPal] Creating mock subscription for development/testing')
    const mockSubscriptionId = 'I-' + Math.random().toString(36).substring(2, 15).toUpperCase()
    return {
      subscriptionId: mockSubscriptionId,
      approvalUrl: params.returnUrl + '&subscription=' + mockSubscriptionId + '&payer=MOCK_PAYER',
      status: 'APPROVAL_PENDING'
    }
  }

  const baseUrl = process.env.PAYPAL_SANDBOX === 'true'
    ? 'https://api-sandbox.paypal.com'
    : 'https://api.paypal.com'

  const subscriptionData = {
    plan_id: params.planId,
    subscriber: {
      name: {
        given_name: params.userEmail.split('@')[0], // Use email prefix as name
        surname: 'User'
      },
      email_address: params.userEmail
    },
    custom_id: params.userId, // Store userId in PayPal for webhook matching
    application_context: {
      brand_name: 'Sales/Marketing Task App',
      return_url: params.returnUrl,
      cancel_url: params.cancelUrl,
      locale: 'en-US',
      user_action: 'SUBSCRIBE_NOW'
    }
  }

  try {
    const response = await axios.post(
      `${baseUrl}/v1/billing/subscriptions`,
      subscriptionData,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )

    return {
      subscriptionId: response.data.id,
      approvalUrl: response.data.links?.find(link => link.rel === 'approve')?.href,
      status: response.data.status
    }
  } catch (err) {
    console.error('[PayPal] Failed to create subscription:', err.response?.data || err.message)
    throw new Error(err.response?.data?.message || 'Failed to create PayPal subscription')
  }
}

/**
 * Main handler
 */
export async function handler(event) {
  // Only POST allowed
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
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
      body: JSON.stringify({ error: 'Invalid JSON' })
    }
  }

  // Validate required fields
  const { userId, userEmail, planId, returnUrl, cancelUrl } = body

  if (!userId || !userEmail || !planId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required fields: userId, userEmail, planId' })
    }
  }

  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    console.error('[PayPal] Missing PayPal credentials in environment')
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'PayPal not configured' })
    }
  }

  try {
    console.log(`[PayPal] Creating subscription for user: ${userId}`)

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken()

    // Create PayPal subscription
    const paypalResult = await createPayPalSubscription(accessToken, {
      userId,
      userEmail,
      planId,
      returnUrl: returnUrl || `${process.env.VITE_APP_URL}/app?subscription=pending`,
      cancelUrl: cancelUrl || `${process.env.VITE_APP_URL}/app`
    })

    if (!paypalResult.approvalUrl) {
      throw new Error('No approval URL returned from PayPal')
    }

    console.log(`[PayPal] Subscription created: ${paypalResult.subscriptionId}`)

    // Create subscription record in database (server-side with service role)
    // This allows client to skip the database INSERT when returning from PayPal
    try {
      await createSubscriptionRecord(userId, paypalResult.subscriptionId, 'MOCK_PAYER')
    } catch (dbErr) {
      console.error('[PayPal] Warning: Failed to create subscription record, will retry on return:', dbErr.message)
      // Don't fail the whole flow - client can retry if needed
    }

    // Return approval URL for redirect
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        subscriptionId: paypalResult.subscriptionId,
        approvalUrl: paypalResult.approvalUrl,
        status: paypalResult.status
      })
    }
  } catch (err) {
    console.error('[PayPal] Error creating subscription:', err.message)
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        error: err.message || 'Failed to create subscription'
      })
    }
  }
}
