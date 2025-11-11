/**
 * PayPal Subscription Service
 * Orchestrates subscription creation, updates, and cancellation via PayPal
 *
 * Features:
 * - Create subscriptions ($19/month premium plan)
 * - Manage subscription status
 * - Handle webhook notifications
 * - Track payment events
 * - Provide subscription URLs for client redirection
 */

import { useSubscriptionStore } from '@/stores/subscriptionStore'
import { useAuthStore } from '@/stores/authStore'

// PayPal Plan ID - Premium Plan ($19/month)
const PAYPAL_PLAN_ID = process.env.VITE_PAYPAL_PLAN_ID || 'P-PREMIUM-MONTHLY-19USD'

// PayPal API endpoint
const PAYPAL_API_BASE = process.env.VITE_PAYPAL_API_URL || '/.netlify/functions'

// Subscription status enum
export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
  PAUSED: 'paused'
}

/**
 * Create a PayPal subscription for the user
 * Initiates the PayPal approval flow
 * @param {Object} options - Subscription options
 * @param {string} options.returnUrl - URL to return to after approval
 * @param {string} options.cancelUrl - URL if user cancels
 * @returns {Promise<string>} Approval redirect URL
 * @throws {Error} If subscription creation fails
 */
export async function createSubscription(options = {}) {
  const authStore = useAuthStore()
  const subscriptionStore = useSubscriptionStore()

  if (!authStore.user) {
    throw new Error('User not authenticated')
  }

  if (!authStore.user.email) {
    throw new Error('User email is required for subscription')
  }

  try {
    console.log('[PayPalService] Creating subscription for user:', authStore.user.id)

    const response = await fetch(`${PAYPAL_API_BASE}/paypal-create-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: authStore.user.id,
        userEmail: authStore.user.email,
        planId: PAYPAL_PLAN_ID,
        returnUrl: options.returnUrl || window.location.href,
        cancelUrl: options.cancelUrl || window.location.href
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Failed to create subscription: ${response.status}`)
    }

    const data = await response.json()

    if (!data.approvalUrl) {
      throw new Error('No approval URL returned from PayPal')
    }

    console.log('[PayPalService] Subscription created, redirecting to approval:', data.approvalUrl)
    return data.approvalUrl
  } catch (err) {
    console.error('[PayPalService] Failed to create subscription:', err)
    throw err
  }
}

/**
 * Activate subscription after PayPal approval
 * Called after user is redirected back from PayPal
 * @param {Object} params - Query parameters from PayPal
 * @param {string} params.subscriptionId - PayPal subscription ID
 * @param {string} params.payerId - PayPal payer ID
 * @returns {Promise<Object>} Updated subscription data
 * @throws {Error} If activation fails
 */
export async function activateSubscription(params = {}) {
  const authStore = useAuthStore()
  const subscriptionStore = useSubscriptionStore()

  if (!authStore.user) {
    throw new Error('User not authenticated')
  }

  if (!params.subscriptionId || !params.payerId) {
    throw new Error('Missing subscription or payer ID')
  }

  try {
    console.log('[PayPalService] Activating subscription:', params.subscriptionId)

    // Update database via service
    const updatedSubscription = await subscriptionStore.upgradeToPresentation(
      params.subscriptionId,
      params.payerId
    )

    console.log('[PayPalService] Subscription activated successfully')
    return updatedSubscription
  } catch (err) {
    console.error('[PayPalService] Failed to activate subscription:', err)
    throw err
  }
}

/**
 * Cancel user's premium subscription
 * @param {string} reason - Reason for cancellation (optional)
 * @returns {Promise<Object>} Updated subscription data
 * @throws {Error} If cancellation fails
 */
export async function cancelSubscription(reason = null) {
  const authStore = useAuthStore()
  const subscriptionStore = useSubscriptionStore()

  if (!authStore.user) {
    throw new Error('User not authenticated')
  }

  if (!subscriptionStore.subscription?.paypal_subscription_id) {
    throw new Error('No active subscription to cancel')
  }

  try {
    console.log('[PayPalService] Cancelling subscription')

    // Call PayPal API to cancel
    const response = await fetch(`${PAYPAL_API_BASE}/paypal-cancel-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: authStore.user.id,
        paypalSubscriptionId: subscriptionStore.subscription.paypal_subscription_id,
        reason: reason
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Failed to cancel subscription: ${response.status}`)
    }

    // Update local subscription status
    const updatedSubscription = await subscriptionStore.cancelSubscription(reason)

    console.log('[PayPalService] Subscription cancelled successfully')
    return updatedSubscription
  } catch (err) {
    console.error('[PayPalService] Failed to cancel subscription:', err)
    throw err
  }
}

/**
 * Get subscription status
 * @returns {Promise<Object>} Current subscription status
 */
export async function getSubscriptionStatus() {
  const subscriptionStore = useSubscriptionStore()

  try {
    // Refresh from database
    await subscriptionStore.fetchSubscriptionStatus(true)

    return {
      tier: subscriptionStore.tier,
      status: subscriptionStore.subscriptionStatus,
      isPremium: subscriptionStore.isPremium,
      isActive: subscriptionStore.isActive,
      currentPeriodEnd: subscriptionStore.subscription?.current_period_end,
      paypalSubscriptionId: subscriptionStore.subscription?.paypal_subscription_id
    }
  } catch (err) {
    console.error('[PayPalService] Failed to get subscription status:', err)
    throw err
  }
}

/**
 * Verify PayPal webhook signature and process event
 * @param {string} webhookId - Webhook ID from PayPal
 * @param {string} transmissionId - Transmission ID from headers
 * @param {string} transmissionTime - Transmission time from headers
 * @param {string} certUrl - Certificate URL from headers
 * @param {string} signatureHeader - Signature from headers
 * @param {string} webhookBody - Raw webhook body
 * @returns {Promise<boolean>} True if webhook is valid
 */
export async function verifyWebhookSignature(
  webhookId,
  transmissionId,
  transmissionTime,
  certUrl,
  signatureHeader,
  webhookBody
) {
  try {
    const response = await fetch(`${PAYPAL_API_BASE}/paypal-verify-webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        webhookId,
        transmissionId,
        transmissionTime,
        certUrl,
        signatureHeader,
        webhookBody
      })
    })

    if (!response.ok) {
      console.error('[PayPalService] Webhook verification failed:', response.status)
      return false
    }

    const data = await response.json()
    return data.isValid === true || data.valid === true
  } catch (err) {
    console.error('[PayPalService] Error verifying webhook:', err)
    return false
  }
}

/**
 * Handle PayPal webhook event
 * @param {Object} event - PayPal webhook event
 * @returns {Promise<void>}
 */
export async function handleWebhookEvent(event) {
  if (!event || !event.event_type) {
    console.warn('[PayPalService] Invalid webhook event')
    return
  }

  console.log('[PayPalService] Processing webhook event:', event.event_type)

  try {
    switch (event.event_type) {
      case 'BILLING.SUBSCRIPTION.CREATED':
        await handleSubscriptionCreated(event)
        break

      case 'BILLING.SUBSCRIPTION.ACTIVATED':
        await handleSubscriptionActivated(event)
        break

      case 'BILLING.SUBSCRIPTION.UPDATED':
        await handleSubscriptionUpdated(event)
        break

      case 'BILLING.SUBSCRIPTION.CANCELLED':
        await handleSubscriptionCancelled(event)
        break

      case 'BILLING.SUBSCRIPTION.EXPIRED':
        await handleSubscriptionExpired(event)
        break

      case 'PAYMENT.CAPTURE.COMPLETED':
        await handlePaymentCompleted(event)
        break

      case 'PAYMENT.CAPTURE.FAILED':
        await handlePaymentFailed(event)
        break

      default:
        console.log('[PayPalService] Ignoring event type:', event.event_type)
    }
  } catch (err) {
    console.error('[PayPalService] Error handling webhook event:', err)
    throw err
  }
}

/**
 * Handle BILLING.SUBSCRIPTION.CREATED event
 */
async function handleSubscriptionCreated(event) {
  console.log('[PayPalService] Subscription created:', event.resource?.id)
  // Subscription created but not yet activated
  // User will be redirected to approve payment
}

/**
 * Handle BILLING.SUBSCRIPTION.ACTIVATED event
 */
async function handleSubscriptionActivated(event) {
  const subscriptionId = event.resource?.id
  const customId = event.resource?.custom_id

  console.log('[PayPalService] Subscription activated:', subscriptionId)

  // customId should contain userId
  // Update database to reflect activation
  // This is backup in case client-side activation fails
}

/**
 * Handle BILLING.SUBSCRIPTION.UPDATED event
 */
async function handleSubscriptionUpdated(event) {
  const subscriptionId = event.resource?.id
  const status = event.resource?.status

  console.log('[PayPalService] Subscription updated:', subscriptionId, 'status:', status)
  // Update subscription status in database
}

/**
 * Handle BILLING.SUBSCRIPTION.CANCELLED event
 */
async function handleSubscriptionCancelled(event) {
  const subscriptionId = event.resource?.id

  console.log('[PayPalService] Subscription cancelled:', subscriptionId)
  // Update database to reflect cancellation
  // Downgrade user to free tier
}

/**
 * Handle BILLING.SUBSCRIPTION.EXPIRED event
 */
async function handleSubscriptionExpired(event) {
  const subscriptionId = event.resource?.id

  console.log('[PayPalService] Subscription expired:', subscriptionId)
  // Update database to reflect expiration
  // Downgrade user to free tier
}

/**
 * Handle PAYMENT.CAPTURE.COMPLETED event
 */
async function handlePaymentCompleted(event) {
  const paymentId = event.resource?.id

  console.log('[PayPalService] Payment completed:', paymentId)
  // Record payment in database
}

/**
 * Handle PAYMENT.CAPTURE.FAILED event
 */
async function handlePaymentFailed(event) {
  const paymentId = event.resource?.id

  console.error('[PayPalService] Payment failed:', paymentId)
  // Record payment failure in database
  // Notify user
}

/**
 * Format price for display
 * @param {number} cents - Price in cents
 * @returns {string} Formatted price string
 */
export function formatPrice(cents) {
  return '$' + (cents / 100).toFixed(2)
}

/**
 * Get plan information
 * @returns {Object} Plan details
 */
export function getPlanInfo() {
  return {
    id: PAYPAL_PLAN_ID,
    name: 'Premium Plan',
    price: 1900, // $19.00 in cents
    currency: 'USD',
    billingCycle: 'monthly',
    quotaLimit: 200,
    description: '200 AI generations per month + priority support'
  }
}
