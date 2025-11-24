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
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  const signature = event.headers['stripe-signature']
  let stripeEvent

  try {
    // Verify webhook signature
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error.message)
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Webhook signature verification failed' })
    }
  }

  try {
    // Route to appropriate handler
    switch (stripeEvent.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(stripeEvent.data.object)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(stripeEvent.data.object)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(stripeEvent.data.object)
        break

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(stripeEvent.data.object)
        break

      case 'invoice.payment_failed':
        await handlePaymentFailed(stripeEvent.data.object)
        break

      default:
        // Ignore unhandled events
        console.log(`Unhandled event type: ${stripeEvent.type}`)
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true })
    }
  } catch (error) {
    console.error('Webhook processing error:', error)
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
 */
async function handlePaymentSucceeded(invoice) {
  const userId = await getUserIdFromStripeCustomer(invoice.customer)

  if (!userId) {
    console.error(`Could not find user for customer ${invoice.customer}`)
    return
  }

  // Log successful payment (for future analytics)
  console.log(`Payment succeeded for user ${userId}: ${invoice.id}`)
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
  const { data } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single()

  return data?.user_id || null
}
