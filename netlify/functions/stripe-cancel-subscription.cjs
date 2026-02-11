/**
 * Netlify Function: Cancel Stripe Subscription
 * Endpoint: POST /.netlify/functions/stripe-cancel-subscription
 *
 * Cancels a subscription on Stripe and downgrades user to free tier
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { createClient } = require('@supabase/supabase-js')
const { verifyAuth, getCorsOrigin } = require('./utils/auth.cjs')

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

exports.handler = async (event) => {
  const jsonResponse = (statusCode, data) => ({
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': getCorsOrigin(event)
    },
    body: JSON.stringify(data)
  })

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

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    console.warn('[stripe-cancel-subscription] Invalid HTTP method:', event.httpMethod)
    return jsonResponse(405, { error: 'Method not allowed' })
  }

  try {
    // Verify authentication
    let verifiedUserId
    try {
      const auth = await verifyAuth(event)
      verifiedUserId = auth.userId
      console.log('[stripe-cancel-subscription] Request authenticated')
    } catch (authError) {
      console.error('[stripe-cancel-subscription] Auth failed:', authError.message)
      return jsonResponse(401, {
        error: 'Unauthorized',
        details: authError.message
      })
    }

    let subscriptionId
    try {
      const parsed = JSON.parse(event.body || '{}')
      subscriptionId = parsed.subscriptionId
    } catch (parseError) {
      console.error('[stripe-cancel-subscription] Failed to parse request')
      return jsonResponse(400, { error: 'Invalid JSON in request body' })
    }

    const userId = verifiedUserId

    console.log('[stripe-cancel-subscription] Request received')

    // Validate input
    if (!userId || !subscriptionId) {
      console.error('[stripe-cancel-subscription] Validation failed')
      return jsonResponse(400, {
        error: 'Missing userId or subscriptionId',
        received: { userId: !!userId, subscriptionId: !!subscriptionId }
      })
    }

    // Schedule cancellation at period end on Stripe
    console.log('[stripe-cancel-subscription] Scheduling cancellation at period end on Stripe')
    let updatedSubscription
    let stripeError = null
    try {
      updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true
      })
      console.log('[stripe-cancel-subscription] Successfully scheduled cancellation, will end at:', new Date(updatedSubscription.current_period_end * 1000).toISOString())
    } catch (error) {
      // If subscription doesn't exist in Stripe, that's OK - likely old test data
      // We still want to update the database to mark it as cancelled
      if (error.code === 'resource_missing') {
        console.warn('[stripe-cancel-subscription] Subscription not found in Stripe (likely old test data), continuing with DB update')
        stripeError = null
      } else {
        console.error('[stripe-cancel-subscription] Failed to schedule cancellation on Stripe')
        return jsonResponse(400, {
          error: 'Failed to schedule cancellation on Stripe',
          code: 'STRIPE_CANCEL_FAILED'
        })
      }
    }

    // Update database: downgrade to free tier
    console.log('[stripe-cancel-subscription] Updating database')
    try {
      // First, get the subscription to see its current state
      const { data: subData, error: selectError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (selectError) {
        console.error('[stripe-cancel-subscription] Failed to fetch subscription')
        return jsonResponse(500, {
          error: 'Subscription not found',
          code: 'SUBSCRIPTION_NOT_FOUND'
        })
      }

      console.log('[stripe-cancel-subscription] Found subscription with status:', subData?.status)

      // Mark cancellation scheduled, keep tier as premium and status as active
      const { error: updateError, data } = await supabase
        .from('subscriptions')
        .update({
          cancel_at_period_end: true,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()

      if (updateError) {
        console.error('[stripe-cancel-subscription] Database update error')
        throw updateError
      }

      console.log('[stripe-cancel-subscription] Successfully scheduled cancellation at period end')

      return jsonResponse(200, {
        success: true,
        message: 'Subscription will be cancelled at the end of your billing period',
        subscription: data?.[0] || null
      })
    } catch (dbError) {
      console.error('[stripe-cancel-subscription] Database operation failed')
      return jsonResponse(500, {
        error: 'Failed to update subscription',
        code: 'DATABASE_UPDATE_ERROR'
      })
    }
  } catch (error) {
    console.error('[stripe-cancel-subscription] Unhandled error:', error.message)
    return jsonResponse(500, {
      error: 'Failed to cancel subscription',
      code: 'INTERNAL_ERROR'
    })
  }
}
