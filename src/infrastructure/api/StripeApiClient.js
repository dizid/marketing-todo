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
   * @param {string} clientSecret - Payment intent client secret from server
   * @returns {HTMLElement} Payment element DOM element
   */
  async initializePaymentElement(clientSecret, appearance = {}) {
    if (!this.stripe) {
      throw new Error('Stripe not initialized. Call initialize() first.')
    }

    // Create elements with appearance options
    const defaultAppearance = {
      theme: 'stripe',
      variables: {
        colorPrimary: '#3b82f6', // Tailwind blue-500
        colorBackground: '#ffffff',
        colorText: '#1f2937', // Tailwind gray-900
        borderRadius: '0.5rem',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      },
      rules: {
        '.Focused': {
          boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)'
        }
      }
    }

    this.elements = this.stripe.elements({
      clientSecret,
      appearance: { ...defaultAppearance, ...appearance }
    })

    this.paymentElement = this.elements.create('payment')
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
   * @returns {Object} Submission result with error if any
   */
  async submitPayment() {
    if (!this.elements) {
      throw new Error('Payment elements not initialized')
    }

    const { error } = await this.elements.submit()

    if (error) {
      return {
        success: false,
        error: {
          message: error.message,
          code: error.code,
          type: error.type
        }
      }
    }

    return {
      success: true
    }
  }

  /**
   * Confirm payment for subscription
   * @param {string} clientSecret - Payment intent client secret
   * @param {string} returnUrl - URL to return to after payment
   * @returns {Object} Confirmation result
   */
  async confirmPayment(clientSecret, returnUrl) {
    if (!this.stripe) {
      throw new Error('Stripe not initialized')
    }

    const { error, paymentIntent } = await this.stripe.confirmPayment({
      elements: this.elements,
      clientSecret,
      redirect: 'if_required'
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
