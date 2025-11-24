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
      console.log('[StripeService] Creating subscription for user:', userId, 'price:', priceId)
      const response = await fetch(
        `${this.functionsUrl}/stripe-create-subscription`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId,
            priceId
          })
        }
      )

      console.log('[StripeService] Response status:', response.status)

      if (!response.ok) {
        let errorMessage = 'Failed to create subscription'
        try {
          const errorBody = await response.text()
          console.log('[StripeService] Error response body:', errorBody)
          const error = JSON.parse(errorBody)
          errorMessage = error.message || error.error || errorMessage
        } catch (parseError) {
          console.log('[StripeService] Could not parse error response:', response.statusText)
          errorMessage = response.statusText || errorMessage
        }
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

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to cancel subscription')
      }

      return await response.json()
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
   * Confirm and process payment
   * @param {string} clientSecret - Payment intent client secret
   * @returns {Object} Payment confirmation result
   */
  async confirmPayment(clientSecret) {
    try {
      const returnUrl = `${import.meta.env.VITE_APP_URL}/app/subscription?session_id={CHECKOUT_SESSION_ID}`

      const result = await this.stripeApiClient.confirmPayment(
        clientSecret,
        returnUrl
      )

      if (!result.success) {
        throw new Error(result.error.message)
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
