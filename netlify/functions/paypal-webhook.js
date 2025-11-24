/**
 * PayPal Webhook Handler Function
 * Netlify Function: Processes PayPal subscription events
 *
 * Endpoint: /.netlify/functions/paypal-webhook
 * Method: POST
 * Auth: PayPal webhook signature verification
 *
 * Handles:
 * - BILLING.SUBSCRIPTION.ACTIVATED
 * - BILLING.SUBSCRIPTION.CANCELLED
 * - BILLING.SUBSCRIPTION.EXPIRED
 * - PAYMENT.CAPTURE.COMPLETED
 * - PAYMENT.CAPTURE.FAILED
 */

const axios = require('axios')
const crypto = require('crypto')
const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

/**
 * Verify PayPal webhook signature
 * https://developer.paypal.com/docs/api/webhooks/v1/#verify-webhook-signature
 */
async function verifyWebhookSignature(event, headers) {
  try {
    const baseUrl = process.env.PAYPAL_SANDBOX === 'true'
      ? 'https://api-sandbox.paypal.com'
      : 'https://api.paypal.com'

    const response = await axios.post(
      `${baseUrl}/v1/notifications/verify-webhook-signature`,
      {
        transmission_id: headers['paypal-transmission-id'],
        transmission_time: headers['paypal-transmission-time'],
        cert_url: headers['paypal-cert-url'],
        auth_algo: headers['paypal-auth-algo'],
        webhook_id: process.env.PAYPAL_WEBHOOK_ID,
        webhook_event: event
      },
      {
        auth: {
          username: process.env.PAYPAL_CLIENT_ID,
          password: process.env.PAYPAL_CLIENT_SECRET
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    return response.data.verification_status === 'SUCCESS'
  } catch (err) {
    console.error('[PayPal Webhook] Verification failed:', err.message)
    return false
  }
}

/**
 * Handle subscription activated event
 */
async function handleSubscriptionActivated(event) {
  const { id: paypalSubscriptionId, custom_id: userId } = event.resource || {}

  if (!paypalSubscriptionId || !userId) {
    console.warn('[PayPal Webhook] Missing subscription or user ID')
    return false
  }

  try {
    console.log(`[PayPal Webhook] Activating subscription for user: ${userId}`)

    // Get payer ID from resource
    const payerId = event.resource?.subscriber?.payer_id

    if (!payerId) {
      console.warn('[PayPal Webhook] Missing payer ID')
    }

    // Update subscription in database
    const { error } = await supabase
      .from('subscriptions')
      .update({
        tier: 'premium',
        status: 'active',
        paypal_subscription_id: paypalSubscriptionId,
        paypal_payer_id: payerId || null,
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)

    if (error) {
      console.error('[PayPal Webhook] Failed to update subscription:', error)
      return false
    }

    console.log(`[PayPal Webhook] Subscription activated: ${paypalSubscriptionId}`)
    return true
  } catch (err) {
    console.error('[PayPal Webhook] Error handling activation:', err.message)
    return false
  }
}

/**
 * Handle subscription cancelled event
 */
async function handleSubscriptionCancelled(event) {
  const { id: paypalSubscriptionId, custom_id: userId } = event.resource || {}

  if (!paypalSubscriptionId || !userId) {
    console.warn('[PayPal Webhook] Missing subscription or user ID')
    return false
  }

  try {
    console.log(`[PayPal Webhook] Cancelling subscription for user: ${userId}`)

    // Update subscription in database
    const { error } = await supabase
      .from('subscriptions')
      .update({
        tier: 'free',
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('paypal_subscription_id', paypalSubscriptionId)

    if (error) {
      console.error('[PayPal Webhook] Failed to cancel subscription:', error)
      return false
    }

    console.log(`[PayPal Webhook] Subscription cancelled: ${paypalSubscriptionId}`)
    return true
  } catch (err) {
    console.error('[PayPal Webhook] Error handling cancellation:', err.message)
    return false
  }
}

/**
 * Handle subscription expired event
 */
async function handleSubscriptionExpired(event) {
  const { id: paypalSubscriptionId, custom_id: userId } = event.resource || {}

  if (!paypalSubscriptionId || !userId) {
    console.warn('[PayPal Webhook] Missing subscription or user ID')
    return false
  }

  try {
    console.log(`[PayPal Webhook] Expiring subscription for user: ${userId}`)

    // Update subscription in database
    const { error } = await supabase
      .from('subscriptions')
      .update({
        tier: 'free',
        status: 'expired',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('paypal_subscription_id', paypalSubscriptionId)

    if (error) {
      console.error('[PayPal Webhook] Failed to expire subscription:', error)
      return false
    }

    console.log(`[PayPal Webhook] Subscription expired: ${paypalSubscriptionId}`)
    return true
  } catch (err) {
    console.error('[PayPal Webhook] Error handling expiration:', err.message)
    return false
  }
}

/**
 * Handle payment completed event
 */
async function handlePaymentCompleted(event) {
  const { id: paymentId, supplementary_data: { related_ids } } = event.resource || {}
  const subscriptionId = related_ids?.subscription_id

  if (!paymentId) {
    console.warn('[PayPal Webhook] Missing payment ID')
    return false
  }

  try {
    console.log(`[PayPal Webhook] Payment completed: ${paymentId}`)

    // TODO: Record payment in payments table
    // This could be extended to track revenue per month

    return true
  } catch (err) {
    console.error('[PayPal Webhook] Error handling payment completion:', err.message)
    return false
  }
}

/**
 * Handle payment failed event
 */
async function handlePaymentFailed(event) {
  const { id: paymentId } = event.resource || {}

  if (!paymentId) {
    console.warn('[PayPal Webhook] Missing payment ID')
    return false
  }

  try {
    console.error(`[PayPal Webhook] Payment failed: ${paymentId}`)

    // TODO: Send notification to user
    // TODO: Mark subscription for renewal attempt

    return true
  } catch (err) {
    console.error('[PayPal Webhook] Error handling payment failure:', err.message)
    return false
  }
}

/**
 * Main handler
 */
exports.handler = async function(event) {
  // Only POST allowed
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  // Parse webhook body
  let webhookEvent
  try {
    webhookEvent = JSON.parse(event.body)
  } catch (err) {
    console.error('[PayPal Webhook] Invalid JSON')
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON' })
    }
  }

  // Verify webhook signature
  const isValid = await verifyWebhookSignature(webhookEvent, event.headers)

  if (!isValid) {
    console.error('[PayPal Webhook] Signature verification failed')
    // Return 200 to acknowledge receipt (don't retry)
    return {
      statusCode: 200,
      body: JSON.stringify({ error: 'Invalid signature' })
    }
  }

  console.log(`[PayPal Webhook] Processing event: ${webhookEvent.event_type}`)

  // Handle specific event types
  let handled = false

  try {
    switch (webhookEvent.event_type) {
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
        handled = await handleSubscriptionActivated(webhookEvent)
        break

      case 'BILLING.SUBSCRIPTION.CANCELLED':
        handled = await handleSubscriptionCancelled(webhookEvent)
        break

      case 'BILLING.SUBSCRIPTION.EXPIRED':
        handled = await handleSubscriptionExpired(webhookEvent)
        break

      case 'PAYMENT.CAPTURE.COMPLETED':
        handled = await handlePaymentCompleted(webhookEvent)
        break

      case 'PAYMENT.CAPTURE.FAILED':
        handled = await handlePaymentFailed(webhookEvent)
        break

      default:
        console.log(`[PayPal Webhook] Ignoring event type: ${webhookEvent.event_type}`)
        handled = true // Don't retry for unknown events
    }
  } catch (err) {
    console.error('[PayPal Webhook] Error processing event:', err.message)
    // Return 200 to acknowledge (we logged the error)
    return {
      statusCode: 200,
      body: JSON.stringify({ error: 'Processing error', message: err.message })
    }
  }

  // Return 200 to acknowledge receipt
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      success: true,
      eventId: webhookEvent.id,
      handled: handled
    })
  }
}
