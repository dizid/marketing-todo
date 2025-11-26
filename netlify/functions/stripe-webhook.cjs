/**
 * Netlify Function: Stripe Webhook Handler
 * Endpoint: POST /.netlify/functions/stripe-webhook
 *
 * Handles async Stripe events:
 * - customer.subscription.created
 * - customer.subscription.updated
 * - customer.subscription.deleted
 * - invoice.payment_succeeded
 * - invoice.payment_failed
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
    console.warn('[stripe-webhook] Invalid HTTP method:', event.httpMethod)
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  const signature = event.headers['stripe-signature']
  let stripeEvent

  try {
    console.log('[stripe-webhook] Verifying webhook signature...')
    // Verify webhook signature
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
    console.log('[stripe-webhook] Webhook signature verified, event type:', stripeEvent.type)
  } catch (error) {
    console.error('[stripe-webhook] Webhook signature verification failed:', error.message)
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Webhook signature verification failed' })
    }
  }

  try {
    // Route to appropriate handler
    switch (stripeEvent.type) {
      case 'customer.subscription.created':
        console.log('[stripe-webhook] Handling customer.subscription.created')
        await handleSubscriptionCreated(stripeEvent.data.object)
        break

      case 'customer.subscription.updated':
        console.log('[stripe-webhook] Handling customer.subscription.updated')
        await handleSubscriptionUpdated(stripeEvent.data.object)
        break

      case 'customer.subscription.deleted':
        console.log('[stripe-webhook] Handling customer.subscription.deleted')
        await handleSubscriptionDeleted(stripeEvent.data.object)
        break

      case 'invoice.payment_succeeded':
        console.log('[stripe-webhook] Handling invoice.payment_succeeded')
        await handlePaymentSucceeded(stripeEvent.data.object)
        break

      case 'invoice.payment_failed':
        console.log('[stripe-webhook] Handling invoice.payment_failed')
        await handlePaymentFailed(stripeEvent.data.object)
        break

      default:
        // Ignore unhandled events
        console.log('[stripe-webhook] Unhandled event type:', stripeEvent.type)
    }

    console.log('[stripe-webhook] Event processed successfully:', stripeEvent.type)
    return {
      statusCode: 200,
      body: JSON.stringify({ received: true })
    }
  } catch (error) {
    console.error('[stripe-webhook] Webhook processing error:', error.message)
    console.error('[stripe-webhook] Error stack:', error.stack)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Webhook processing failed' })
    }
  }
}

/**
 * Handle subscription created event
 */
async function handleSubscriptionCreated(subscription) {
  const userId = await getUserIdFromStripeCustomer(subscription.customer)

  if (!userId) {
    console.error(
      `Could not find user for customer ${subscription.customer}`
    )
    return
  }

  // Convert Stripe unix timestamps (in seconds) to ISO strings
  const periodStart = typeof subscription.current_period_start === 'number'
    ? new Date(subscription.current_period_start * 1000).toISOString()
    : subscription.current_period_start
  const periodEnd = typeof subscription.current_period_end === 'number'
    ? new Date(subscription.current_period_end * 1000).toISOString()
    : subscription.current_period_end

  await supabase.from('subscriptions').update({
    tier: 'premium',
    status: 'active',
    current_period_start: periodStart,
    current_period_end: periodEnd,
    updated_at: new Date().toISOString()
  }).eq('user_id', userId)
}

/**
 * Handle subscription updated event
 */
async function handleSubscriptionUpdated(subscription) {
  const userId = await getUserIdFromStripeCustomer(subscription.customer)

  if (!userId) {
    console.error(
      `Could not find user for customer ${subscription.customer}`
    )
    return
  }

  // Convert Stripe unix timestamp (in seconds) to ISO string
  const periodEnd = typeof subscription.current_period_end === 'number'
    ? new Date(subscription.current_period_end * 1000).toISOString()
    : subscription.current_period_end

  // Update period end date if renewed
  await supabase.from('subscriptions').update({
    current_period_end: periodEnd,
    updated_at: new Date().toISOString()
  }).eq('user_id', userId)
}

/**
 * Handle subscription deleted event
 */
async function handleSubscriptionDeleted(subscription) {
  const userId = await getUserIdFromStripeCustomer(subscription.customer)

  if (!userId) {
    console.error(
      `Could not find user for customer ${subscription.customer}`
    )
    return
  }

  // Downgrade to free tier
  await supabase.from('subscriptions').update({
    tier: 'free',
    status: 'cancelled',
    cancelled_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }).eq('user_id', userId)
}

/**
 * Handle payment succeeded event
 * Sets subscription from 'pending' to 'active' - confirming payment worked
 * This is the definitive event that a payment was successfully processed
 */
async function handlePaymentSucceeded(invoice) {
  console.log(`[stripe-webhook] invoice.payment_succeeded event received for customer: ${invoice.customer}`)

  const userId = await getUserIdFromStripeCustomer(invoice.customer)

  if (!userId) {
    console.error(`[stripe-webhook] Could not find user for customer ${invoice.customer}`)
    return
  }

  // Update subscription status to 'active' - payment is confirmed
  console.log(`[stripe-webhook] Payment succeeded for user ${userId}: ${invoice.id}`)

  try {
    const { data, error } = await supabase.from('subscriptions').update({
      status: 'active',
      updated_at: new Date().toISOString()
    }).eq('user_id', userId)

    if (error) {
      console.error(`[stripe-webhook] Database update error for user ${userId}:`, error)
      throw error
    }

    console.log(`[stripe-webhook] Successfully updated subscription for user ${userId}:`, data)
  } catch (error) {
    console.error(`[stripe-webhook] Failed to update subscription for user ${userId}:`, error.message)
    throw error
  }
}

/**
 * Handle payment failed event
 */
async function handlePaymentFailed(invoice) {
  const userId = await getUserIdFromStripeCustomer(invoice.customer)

  if (!userId) {
    console.error(`Could not find user for customer ${invoice.customer}`)
    return
  }

  // Log failed payment (for future dunning/retry logic)
  console.log(`Payment failed for user ${userId}: ${invoice.id}`)
}

/**
 * Get user ID from Stripe customer ID
 */
async function getUserIdFromStripeCustomer(customerId) {
  console.log(`[stripe-webhook] Looking up user for stripe_customer_id: ${customerId}`)

  const { data, error } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // Not found - this is expected if customer ID wasn't stored
      console.warn(`[stripe-webhook] No subscription found for stripe_customer_id: ${customerId}`)
    } else {
      console.error(`[stripe-webhook] Database error looking up customer ${customerId}:`, error)
    }
    return null
  }

  if (data?.user_id) {
    console.log(`[stripe-webhook] Found user ${data.user_id} for stripe_customer_id: ${customerId}`)
    return data.user_id
  }

  console.warn(`[stripe-webhook] No user_id found in subscription record for stripe_customer_id: ${customerId}`)
  return null
}
