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
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { userId, subscriptionId } = JSON.parse(event.body)

    // Validate input
    if (!userId || !subscriptionId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing userId or subscriptionId' })
      }
    }

    // Cancel subscription on Stripe
    await stripe.subscriptions.del(subscriptionId)

    // Update database: downgrade to free tier
    const { data, error } = await supabase
      .from('subscriptions')
      .update({
        tier: 'free',
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()

    if (error) {
      throw error
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Subscription cancelled',
        subscription: data?.[0] || null
      })
    }
  } catch (error) {
    console.error('Error cancelling subscription:', error)
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: error.message || 'Failed to cancel subscription'
      })
    }
  }
}
