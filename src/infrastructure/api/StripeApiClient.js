/**
 * Stripe API Client
 * Handles Stripe.js initialization and payment processing
 *
 * Supports multiple payment methods via Payment Element:
 * - Credit/Debit Cards (Visa, Mastercard, Amex, etc.)
 * - Google Pay (auto-detected on supported devices)
 * - Apple Pay (auto-detected on Safari/iOS)
 * - PayPal (when enabled in Stripe Dashboard)
 *
 * Payment methods shown depend on Stripe Dashboard configuration.
 * Enable additional methods: Dashboard → Settings → Payment Methods
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
   * Uses Payment Element to support multiple payment methods:
   * - Credit/Debit Cards
   * - Google Pay
   * - Apple Pay
   * - PayPal (if enabled in Stripe Dashboard)
   * @param {string} clientSecret - Payment intent client secret from server
   * @returns {HTMLElement} Payment element
   */
  async initializePaymentElement(clientSecret, appearance = {}) {
    if (!this.stripe) {
      throw new Error('Stripe not initialized. Call initialize() first.')
    }

    // Create elements with appearance options and client secret
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

    // Initialize elements WITH clientSecret for Payment Element
    this.elements = this.stripe.elements({
      clientSecret,
      appearance: { ...defaultAppearance, ...appearance }
    })

    // Use Payment Element for multi-payment method support
    // Automatically includes Card, Google Pay, Apple Pay based on Stripe Dashboard config
    this.paymentElement = this.elements.create('payment', {
      layout: 'tabs',
      // Payment methods shown are controlled by Stripe Dashboard settings
      // Enable PayPal, Google Pay, Apple Pay in Dashboard → Settings → Payment Methods
      wallets: {
        applePay: 'auto',
        googlePay: 'auto'
      }
    })

    // Store client secret for later use
    this.clientSecret = clientSecret

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
   * Confirm payment with Payment Element
   * Supports multiple payment methods: Cards, Google Pay, Apple Pay, PayPal
   * @param {string} clientSecret - Payment intent client secret (optional if already set)
   * @param {string} returnUrl - URL to return to after payment (for redirect-based methods)
   * @returns {Object} Confirmation result
   */
  async confirmPayment(clientSecret, returnUrl) {
    if (!this.stripe) {
      throw new Error('Stripe not initialized')
    }

    if (!this.elements) {
      throw new Error('Payment elements not initialized. Call initializePaymentElement() first.')
    }

    // Use confirmPayment with Payment Element for multi-payment method support
    // redirect: 'if_required' handles both redirect (PayPal, some cards with 3DS) and non-redirect flows
    const { error, paymentIntent } = await this.stripe.confirmPayment({
      elements: this.elements,
      confirmParams: {
        return_url: returnUrl || window.location.href
      },
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
