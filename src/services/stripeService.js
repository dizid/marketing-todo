/**
 * Stripe Service
 * Client-side Stripe integration for subscription management
 * Handles communication with Stripe Netlify functions
 */

export class StripeService {
  constructor(stripeApiClient) {
    this.stripeApiClient = stripeApiClient
    this.functionsUrl = import.meta.env.VITE_FUNCTIONS_URL
  }

  /**
   * Create a subscription payment intent
   * @param {string} userId - User ID
   * @param {string} priceId - Stripe price ID
   * @returns {Object} { clientSecret, subscriptionId }
   */
  async createSubscription(userId, priceId) {
    try {
      // Generate idempotency key to prevent duplicate subscriptions if user retries
      // Stored in session storage so retries of same action use same key
      const storageKey = `idempotency_${userId}_${priceId}`
      let idempotencyKey = sessionStorage.getItem(storageKey)
      if (!idempotencyKey) {
        idempotencyKey = `${userId}-${priceId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        sessionStorage.setItem(storageKey, idempotencyKey)
      }

      console.log('[StripeService] Creating subscription for user:', userId, 'price:', priceId, 'idempotencyKey:', idempotencyKey)
      const response = await fetch(
        `${this.functionsUrl}/stripe-create-subscription`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId,
            priceId,
            idempotencyKey
          })
        }
      )

      console.log('[StripeService] Response status:', response.status)

      if (!response.ok) {
        let errorMessage = 'Failed to create subscription'
        let errorDetails = {}
        try {
          const errorBody = await response.text()
          console.log('[StripeService] Full error response:', response.status, errorBody)

          if (errorBody && errorBody.trim()) {
            const error = JSON.parse(errorBody)
            errorMessage = error.message || error.error || errorMessage
            errorDetails = error
          } else {
            // Empty response body - check response status
            errorMessage = `HTTP ${response.status}: ${response.statusText || 'Unknown error'}`
          }
        } catch (parseError) {
          console.error('[StripeService] Error parsing response:', parseError)
          errorMessage = `HTTP ${response.status}: ${response.statusText || 'Unknown error'}`
        }

        console.error('[StripeService] API Error:', { status: response.status, message: errorMessage, details: errorDetails })
        throw new Error(errorMessage)
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating subscription:', error)
      throw {
        message: error.message || 'Failed to create subscription',
        code: 'SUBSCRIPTION_CREATE_ERROR'
      }
    }
  }

  /**
   * Cancel an active subscription
   * @param {string} userId - User ID
   * @param {string} subscriptionId - Stripe subscription ID
   * @returns {Object} Cancellation confirmation
   */
  async cancelSubscription(userId, subscriptionId) {
    try {
      console.log('[StripeService] Cancelling subscription for user:', userId, 'subscriptionId:', subscriptionId)
      const response = await fetch(
        `${this.functionsUrl}/stripe-cancel-subscription`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId,
            subscriptionId
          })
        }
      )

      console.log('[StripeService] Cancel response status:', response.status)

      if (!response.ok) {
        let errorMessage = 'Failed to cancel subscription'
        let errorDetails = {}
        try {
          const errorBody = await response.text()
          console.log('[StripeService] Full error response:', response.status, errorBody)

          if (errorBody && errorBody.trim()) {
            const error = JSON.parse(errorBody)
            errorMessage = error.message || error.error || errorMessage
            errorDetails = error
          } else {
            errorMessage = `HTTP ${response.status}: ${response.statusText || 'Unknown error'}`
          }
        } catch (parseError) {
          console.error('[StripeService] Error parsing response:', parseError)
          errorMessage = `HTTP ${response.status}: ${response.statusText || 'Unknown error'}`
        }

        console.error('[StripeService] API Error:', { status: response.status, message: errorMessage, details: errorDetails })
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log('[StripeService] Subscription cancelled successfully:', data)
      return data
    } catch (error) {
      console.error('Error cancelling subscription:', error)
      throw {
        message: error.message || 'Failed to cancel subscription',
        code: 'SUBSCRIPTION_CANCEL_ERROR'
      }
    }
  }

  /**
   * Get current subscription status for user
   * @param {string} userId - User ID
   * @returns {Object} Subscription details
   */
  async getSubscriptionStatus(userId) {
    // Subscription status is managed via store and database
    // This is a placeholder for future enhancement
    // The store queries the database directly via quotaStore
    return null
  }

  /**
   * Create billing portal session for customer self-service
   * @param {string} userId - User ID
   * @param {string} stripeCustomerId - Stripe customer ID
   * @returns {Object} { url } - Redirect URL to billing portal
   */
  async createBillingPortalSession(userId, stripeCustomerId) {
    try {
      const response = await fetch(
        `${this.functionsUrl}/stripe-portal-session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId,
            stripeCustomerId
          })
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create billing portal session')
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating billing portal session:', error)
      throw {
        message: error.message || 'Failed to create billing portal session',
        code: 'BILLING_PORTAL_ERROR'
      }
    }
  }

  /**
   * Initialize payment for subscription
   * Sets up Stripe client and payment element
   * @param {string} clientSecret - Payment intent client secret
   * @returns {Object} Payment element
   */
  async initializePayment(clientSecret) {
    try {
      // Initialize Stripe if not already done
      await this.stripeApiClient.initialize()

      // Create and return payment element
      const paymentElement = await this.stripeApiClient.initializePaymentElement(
        clientSecret
      )

      return paymentElement
    } catch (error) {
      console.error('Error initializing payment:', error)
      throw {
        message: error.message || 'Failed to initialize payment',
        code: 'PAYMENT_INIT_ERROR'
      }
    }
  }

  /**
   * Submit payment element (required before confirmPayment)
   * @returns {Object} Submission result
   */
  async submitPayment() {
    try {
      const result = await this.stripeApiClient.submitPayment()

      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result
    } catch (error) {
      console.error('Error submitting payment:', error)
      throw {
        message: error.message || 'Failed to submit payment',
        code: 'PAYMENT_SUBMIT_ERROR',
        isRetryable: true
      }
    }
  }

  /**
   * Confirm and process payment
   * After successful payment, notify backend to update subscription status
   * @param {string} clientSecret - Payment intent client secret
   * @param {string} userId - User ID for subscription update
   * @returns {Object} Payment confirmation result
   */
  async confirmPayment(clientSecret, userId) {
    try {
      const returnUrl = `${import.meta.env.VITE_APP_URL}/app/subscription?session_id={CHECKOUT_SESSION_ID}`

      const result = await this.stripeApiClient.confirmPayment(
        clientSecret,
        returnUrl
      )

      if (!result.success) {
        throw new Error(result.error.message)
      }

      console.log('[StripeService] Payment confirmed, notifying backend to update subscription')

      // Notify backend to confirm payment and update subscription status
      // This ensures the subscription status is updated even if webhook doesn't fire (e.g., during local dev)
      try {
        const confirmResponse = await fetch(
          `${this.functionsUrl}/stripe-confirm-payment`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              userId,
              paymentIntentId: result.paymentIntent.id
            })
          }
        )

        if (!confirmResponse.ok) {
          console.warn('[StripeService] Backend confirmation failed, but payment succeeded in Stripe')
          // Don't throw - payment was successful, just log the issue
          // The webhook should still update the subscription eventually
        } else {
          const confirmData = await confirmResponse.json()
          console.log('[StripeService] Backend confirmed payment and updated subscription:', confirmData)
        }
      } catch (confirmError) {
        console.warn('[StripeService] Error notifying backend of payment:', confirmError)
        // Don't throw - payment was successful, just log the issue
        // The webhook should still update the subscription eventually
      }

      return result
    } catch (error) {
      console.error('Error confirming payment:', error)
      throw {
        message: error.message || 'Failed to process payment',
        code: 'PAYMENT_CONFIRM_ERROR',
        isRetryable: true
      }
    }
  }

  /**
   * Retrieve current payment intent status
   * @param {string} clientSecret - Payment intent client secret
   * @returns {Object} Payment intent details
   */
  async getPaymentStatus(clientSecret) {
    try {
      return await this.stripeApiClient.retrievePaymentIntent(clientSecret)
    } catch (error) {
      console.error('Error retrieving payment status:', error)
      throw {
        message: error.message || 'Failed to retrieve payment status',
        code: 'PAYMENT_STATUS_ERROR'
      }
    }
  }

  /**
   * Clean up payment element (unmount from DOM)
   */
  cleanup() {
    if (this.stripeApiClient) {
      this.stripeApiClient.unmountPaymentElement()
    }
  }
}
