/**
 * Stripe API Client
 * Handles Stripe.js initialization and payment processing
 * Mirrors pattern of GrokApiClient for consistency
 */

export class StripeApiClient {
  constructor(publishableKey) {
    if (!publishableKey) {
      throw new Error('Stripe publishable key is required')
    }
    this.publishableKey = publishableKey
    this.stripe = null
    this.elements = null
    this.paymentElement = null
    this.initialized = false
  }

  /**
   * Initialize Stripe.js library
   * Must be called before any payment operations
   */
  async initialize() {
    if (this.initialized) {
      return this.stripe
    }

    // Load Stripe.js library dynamically
    if (!window.Stripe) {
      const script = document.createElement('script')
      script.src = 'https://js.stripe.com/v3/'
      script.async = true

      return new Promise((resolve, reject) => {
        script.onload = () => {
          this.stripe = window.Stripe(this.publishableKey)
          this.initialized = true
          resolve(this.stripe)
        }
        script.onerror = () => {
          reject(new Error('Failed to load Stripe.js library'))
        }
        document.head.appendChild(script)
      })
    }

    this.stripe = window.Stripe(this.publishableKey)
    this.initialized = true
    return this.stripe
  }

  /**
   * Initialize Payment Element for subscription creation
   * Uses Card Element instead of Payment Element to avoid showing Stripe Link
   * @param {string} clientSecret - Payment intent client secret from server
   * @returns {HTMLElement} Card element DOM element
   */
  async initializePaymentElement(clientSecret, appearance = {}) {
    if (!this.stripe) {
      throw new Error('Stripe not initialized. Call initialize() first.')
    }

    // Create elements with appearance options
    // NOTE: Do NOT pass clientSecret here - Card Element doesn't support it
    // clientSecret is only used with confirmPayment() later
    const defaultAppearance = {
      theme: 'stripe',
      variables: {
        colorPrimary: '#3b82f6', // Tailwind blue-500
        colorBackground: '#ffffff',
        colorText: '#1f2937', // Tailwind gray-900
        borderRadius: '0.5rem',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }
    }

    this.elements = this.stripe.elements({
      appearance: { ...defaultAppearance, ...appearance }
    })

    // Use Card Element for card-only payments, no Link/wallets
    // Payment Element automatically includes Link which we don't want
    // Card Element is simpler and avoids confusion between payment methods
    this.paymentElement = this.elements.create('card', {
      hidePostalCode: true,
      style: {
        base: {
          fontSize: '16px',
          color: '#424242',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          '::placeholder': {
            color: '#cfcfcf'
          }
        },
        invalid: {
          color: '#fa755a'
        }
      }
    })
    return this.paymentElement
  }

  /**
   * Mount payment element to DOM
   * @param {string} elementId - DOM element ID to mount to
   */
  mountPaymentElement(elementId) {
    if (!this.paymentElement) {
      throw new Error('Payment element not initialized')
    }
    const container = document.getElementById(elementId)
    if (!container) {
      throw new Error(`DOM element with id '${elementId}' not found`)
    }
    this.paymentElement.mount(`#${elementId}`)
  }

  /**
   * Submit payment element (must be called before confirmPayment)
   * Note: With card element, this just validates the form
   * @returns {Object} Submission result with error if any
   */
  async submitPayment() {
    // Card element doesn't require explicit submission
    // Validation happens during confirmPayment
    return {
      success: true
    }
  }

  /**
   * Confirm payment for subscription with Card Element
   * Uses confirmCardPayment instead of confirmPayment (which requires Payment Element)
   * @param {string} clientSecret - Payment intent client secret
   * @param {string} returnUrl - URL to return to after payment
   * @returns {Object} Confirmation result
   */
  async confirmPayment(clientSecret, returnUrl) {
    if (!this.stripe) {
      throw new Error('Stripe not initialized')
    }

    // Use confirmCardPayment for Card Element (not confirmPayment which needs Payment Element)
    const { error, paymentIntent } = await this.stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: this.paymentElement,
        billing_details: {
          // Can add billing details here if needed
        }
      }
    })

    if (error) {
      return {
        success: false,
        error: {
          message: error.message,
          code: error.code,
          type: error.type,
          param: error.param
        }
      }
    }

    return {
      success: true,
      paymentIntent: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        clientSecret: paymentIntent.client_secret
      }
    }
  }

  /**
   * Retrieve payment intent status
   * @param {string} clientSecret - Payment intent client secret
   * @returns {Object} Payment intent data
   */
  async retrievePaymentIntent(clientSecret) {
    if (!this.stripe) {
      throw new Error('Stripe not initialized')
    }

    const { paymentIntent, error } = await this.stripe.retrievePaymentIntent(
      clientSecret
    )

    if (error) {
      throw new Error(`Failed to retrieve payment intent: ${error.message}`)
    }

    return {
      id: paymentIntent.id,
      status: paymentIntent.status,
      clientSecret: paymentIntent.client_secret,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency
    }
  }

  /**
   * Handle Stripe errors with consistent format
   * @param {Object} error - Stripe error object
   * @returns {Object} Formatted error
   */
  handleError(error) {
    return {
      message: error.message || 'An unexpected error occurred',
      code: error.code || 'unknown_error',
      type: error.type || 'card_error',
      param: error.param || null,
      isRetryable: this._isRetryableError(error.code)
    }
  }

  /**
   * Unmount payment element (cleanup)
   */
  unmountPaymentElement() {
    if (this.paymentElement) {
      this.paymentElement.unmount()
      this.paymentElement = null
    }
  }

  /**
   * Check if error is retryable
   * @private
   */
  _isRetryableError(code) {
    const retryableCodes = [
      'card_declined',
      'expired_card',
      'incorrect_cvc',
      'processing_error',
      'rate_limit'
    ]
    return retryableCodes.includes(code)
  }
}
