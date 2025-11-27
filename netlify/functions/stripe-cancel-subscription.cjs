/**
 * Netlify Function: Cancel Stripe Subscription
 * Endpoint: POST /.netlify/functions/stripe-cancel-subscription
 *
 * Cancels a subscription on Stripe and downgrades user to free tier
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    console.warn('[stripe-cancel-subscription] Invalid HTTP method:', event.httpMethod)
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    let userId, subscriptionId
    try {
      const parsed = JSON.parse(event.body || '{}')
      userId = parsed.userId
      subscriptionId = parsed.subscriptionId
    } catch (parseError) {
      console.error('[stripe-cancel-subscription] Failed to parse request:', parseError.message)
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid JSON in request body' })
      }
    }

    console.log('[stripe-cancel-subscription] Request - userId:', userId, 'subscriptionId:', subscriptionId)

    // Validate input
    if (!userId || !subscriptionId) {
      console.error('[stripe-cancel-subscription] Validation failed - userId:', userId, 'subscriptionId:', subscriptionId)
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Missing userId or subscriptionId',
          received: { userId: !!userId, subscriptionId: !!subscriptionId }
        })
      }
    }

    // Cancel subscription on Stripe
    console.log('[stripe-cancel-subscription] Cancelling subscription on Stripe:', subscriptionId)
    let cancelledSubscription
    let stripeError = null
    try {
      cancelledSubscription = await stripe.subscriptions.cancel(subscriptionId)
      console.log('[stripe-cancel-subscription] Successfully cancelled subscription on Stripe, status:', cancelledSubscription.status)
    } catch (error) {
      // If subscription doesn't exist in Stripe, that's OK - likely old test data
      // We still want to update the database to mark it as cancelled
      if (error.code === 'resource_missing') {
        console.warn('[stripe-cancel-subscription] Subscription not found in Stripe (likely old test data), continuing with DB update:', subscriptionId)
        stripeError = null
      } else {
        console.error('[stripe-cancel-subscription] Failed to cancel subscription on Stripe:', error.message)
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: 'Failed to cancel subscription on Stripe',
            code: 'STRIPE_CANCEL_FAILED',
            details: error.message
          })
        }
      }
    }

    // Update database: downgrade to free tier
    console.log('[stripe-cancel-subscription] Updating database for user:', userId)
    try {
      // First, get the subscription to see its current state
      const { data: subData, error: selectError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (selectError) {
        console.error('[stripe-cancel-subscription] Failed to fetch subscription:', selectError)
        return {
          statusCode: 500,
          body: JSON.stringify({
            error: 'Subscription not found',
            code: 'SUBSCRIPTION_NOT_FOUND',
            details: selectError.message
          })
        }
      }

      console.log('[stripe-cancel-subscription] Found subscription with status:', subData?.status)

      // Update to 'cancelled' and 'free' tier
      const { error: updateError, data } = await supabase
        .from('subscriptions')
        .update({
          tier: 'free',
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()

      if (updateError) {
        console.error('[stripe-cancel-subscription] Database update error:', updateError)
        throw updateError
      }

      console.log('[stripe-cancel-subscription] Successfully updated subscription:', data)

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: 'Subscription cancelled',
          subscription: data?.[0] || null
        })
      }
    } catch (dbError) {
      console.error('[stripe-cancel-subscription] Database operation failed:', dbError)
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Failed to update subscription',
          code: 'DATABASE_UPDATE_ERROR',
          details: dbError.message
        })
      }
    }
  } catch (error) {
    console.error('[stripe-cancel-subscription] Unhandled error:', error.message)
    console.error('[stripe-cancel-subscription] Error stack:', error.stack)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to cancel subscription',
        code: 'INTERNAL_ERROR'
      })
    }
  }
}
