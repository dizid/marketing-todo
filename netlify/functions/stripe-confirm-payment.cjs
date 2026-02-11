/**
 * Netlify Function: Confirm Stripe Payment
 * Endpoint: POST /.netlify/functions/stripe-confirm-payment
 *
 * Verifies that a payment was successful in Stripe and updates the subscription status to 'active'.
 * This runs after client confirms payment with confirmCardPayment.
 * Acts as a synchronous fallback to the webhook (useful during local development when webhooks can't reach localhost).
 */

const { verifyAuth, getCorsOrigin } = require('./utils/auth.cjs')

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('[stripe-confirm-payment] CRITICAL: STRIPE_SECRET_KEY not set')
  throw new Error('STRIPE_SECRET_KEY environment variable is required')
}

if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('[stripe-confirm-payment] CRITICAL: Supabase environment variables not set')
  throw new Error('Supabase environment variables required')
}

let stripe, supabase
try {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
  console.log('[stripe-confirm-payment] Stripe SDK initialized')
} catch (error) {
  console.error('[stripe-confirm-payment] Failed to initialize Stripe:', error.message)
  throw error
}

try {
  const { createClient } = require('@supabase/supabase-js')
  supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
  console.log('[stripe-confirm-payment] Supabase client initialized')
} catch (error) {
  console.error('[stripe-confirm-payment] Failed to initialize Supabase:', error.message)
  throw error
}

const jsonResponse = (statusCode, data, event) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': getCorsOrigin(event)
  },
  body: JSON.stringify(data)
})

exports.handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': getCorsOrigin(event),
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      },
      body: ''
    }
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' }, event)
  }

  try {
    // Verify authentication
    let verifiedUserId
    try {
      const auth = await verifyAuth(event)
      verifiedUserId = auth.userId
      console.log('[stripe-confirm-payment] Request authenticated')
    } catch (authError) {
      console.error('[stripe-confirm-payment] Auth failed:', authError.message)
      return jsonResponse(401, {
        error: 'Unauthorized',
        details: authError.message
      }, event)
    }

    let paymentIntentId
    try {
      const parsed = JSON.parse(event.body || '{}')
      paymentIntentId = parsed.paymentIntentId
    } catch (error) {
      console.error('[stripe-confirm-payment] Failed to parse request')
      return jsonResponse(400, { error: 'Invalid JSON in request body' }, event)
    }

    const userId = verifiedUserId

    if (!userId || !paymentIntentId) {
      console.error('[stripe-confirm-payment] Missing parameters')
      return jsonResponse(400, {
        error: 'Missing userId or paymentIntentId',
        received: { userId: !!userId, paymentIntentId: !!paymentIntentId }
      }, event)
    }

    console.log('[stripe-confirm-payment] Confirming payment')

    // Retrieve the PaymentIntent from Stripe
    let paymentIntent
    try {
      paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
      console.log('[stripe-confirm-payment] Retrieved PaymentIntent, status:', paymentIntent.status)
    } catch (error) {
      console.error('[stripe-confirm-payment] Failed to retrieve PaymentIntent')
      return jsonResponse(400, {
        error: 'Failed to verify payment with Stripe',
        code: 'PAYMENT_VERIFICATION_FAILED'
      }, event)
    }

    // Check if payment was successful
    if (paymentIntent.status !== 'succeeded') {
      console.warn('[stripe-confirm-payment] PaymentIntent status is not succeeded:', paymentIntent.status)
      return jsonResponse(400, {
        error: 'Payment did not succeed',
        code: 'PAYMENT_NOT_SUCCEEDED',
        details: `PaymentIntent status: ${paymentIntent.status}`
      }, event)
    }

    console.log('[stripe-confirm-payment] Payment succeeded, updating subscription status')

    // Update subscription status to 'active'
    try {
      // First, get the subscription to see its current state
      const { data: subData, error: selectError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (selectError) {
        console.error('[stripe-confirm-payment] Failed to fetch subscription')
        return jsonResponse(500, {
          error: 'Subscription not found',
          code: 'SUBSCRIPTION_NOT_FOUND'
        }, event)
      }

      console.log('[stripe-confirm-payment] Found subscription with status:', subData?.status)

      // Update to 'active' regardless of current status - payment succeeded in Stripe
      const { error: updateError, data } = await supabase
        .from('subscriptions')
        .update({
          status: 'active',
          tier: 'premium',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()

      if (updateError) {
        console.error('[stripe-confirm-payment] Database update error')
        throw updateError
      }

      console.log('[stripe-confirm-payment] Successfully updated subscription')

      return jsonResponse(200, {
        success: true,
        message: 'Subscription activated',
        subscription: data?.[0] || null
      }, event)
    } catch (dbError) {
      console.error('[stripe-confirm-payment] Database operation failed')
      return jsonResponse(500, {
        error: 'Failed to update subscription',
        code: 'DATABASE_UPDATE_ERROR'
      }, event)
    }
  } catch (error) {
    console.error('[stripe-confirm-payment] Unhandled error:', error.message)
    return jsonResponse(500, {
      error: 'Failed to confirm payment',
      code: 'INTERNAL_ERROR'
    }, event)
  }
}
