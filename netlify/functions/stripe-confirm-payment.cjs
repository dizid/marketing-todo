/**
 * Netlify Function: Confirm Stripe Payment
 * Endpoint: POST /.netlify/functions/stripe-confirm-payment
 *
 * Verifies that a payment was successful in Stripe and updates the subscription status to 'active'.
 * This runs after client confirms payment with confirmCardPayment.
 * Acts as a synchronous fallback to the webhook (useful during local development when webhooks can't reach localhost).
 */

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

const jsonResponse = (statusCode, data) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' })
  }

  try {
    let userId, paymentIntentId
    try {
      const parsed = JSON.parse(event.body || '{}')
      userId = parsed.userId
      paymentIntentId = parsed.paymentIntentId
    } catch (error) {
      console.error('[stripe-confirm-payment] Failed to parse request:', error.message)
      return jsonResponse(400, { error: 'Invalid JSON in request body' })
    }

    if (!userId || !paymentIntentId) {
      console.error('[stripe-confirm-payment] Missing userId or paymentIntentId')
      return jsonResponse(400, {
        error: 'Missing userId or paymentIntentId',
        received: { userId: !!userId, paymentIntentId: !!paymentIntentId }
      })
    }

    console.log('[stripe-confirm-payment] Confirming payment for user:', userId, 'PaymentIntent:', paymentIntentId)

    // Retrieve the PaymentIntent from Stripe
    let paymentIntent
    try {
      paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
      console.log('[stripe-confirm-payment] Retrieved PaymentIntent, status:', paymentIntent.status)
    } catch (error) {
      console.error('[stripe-confirm-payment] Failed to retrieve PaymentIntent:', error.message)
      return jsonResponse(400, {
        error: 'Failed to verify payment with Stripe',
        code: 'PAYMENT_VERIFICATION_FAILED',
        details: error.message
      })
    }

    // Check if payment was successful
    if (paymentIntent.status !== 'succeeded') {
      console.warn('[stripe-confirm-payment] PaymentIntent status is not succeeded:', paymentIntent.status)
      return jsonResponse(400, {
        error: 'Payment did not succeed',
        code: 'PAYMENT_NOT_SUCCEEDED',
        details: `PaymentIntent status: ${paymentIntent.status}`
      })
    }

    console.log('[stripe-confirm-payment] Payment succeeded, updating subscription status')

    // Update subscription status to 'active'
    try {
      const { error, data } = await supabase
        .from('subscriptions')
        .update({
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('status', 'pending')
        .select()

      if (error) {
        console.error('[stripe-confirm-payment] Database update error:', error)
        throw error
      }

      console.log('[stripe-confirm-payment] Successfully updated subscription:', data)

      return jsonResponse(200, {
        success: true,
        message: 'Subscription activated',
        subscription: data?.[0] || null
      })
    } catch (dbError) {
      console.error('[stripe-confirm-payment] Database operation failed:', dbError)
      return jsonResponse(500, {
        error: 'Failed to update subscription',
        code: 'DATABASE_UPDATE_ERROR',
        details: dbError.message
      })
    }
  } catch (error) {
    console.error('[stripe-confirm-payment] Unhandled error:', error.message)
    console.error('[stripe-confirm-payment] Error stack:', error.stack)
    return jsonResponse(500, {
      error: 'Failed to confirm payment',
      code: 'INTERNAL_ERROR'
    })
  }
}
