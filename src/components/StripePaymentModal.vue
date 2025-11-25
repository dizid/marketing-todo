<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    @click.self="emit('close')"
  >
    <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
      <!-- Header -->
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Upgrade to Premium</h2>
        <p class="mt-1 text-sm text-gray-600">
          $19/month • 400 AI generations per month
        </p>
      </div>

      <!-- Payment Element Container -->
      <div
        v-if="isLoading"
        class="mb-6 flex items-center justify-center rounded-lg bg-gray-50 py-8"
      >
        <div class="text-center">
          <div class="mb-2 inline-block">
            <div
              class="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-500"
            ></div>
          </div>
          <p class="text-sm text-gray-600">Loading payment options...</p>
        </div>
      </div>

      <div v-else>
        <div
          id="stripe-payment-element"
          class="mb-6 rounded-lg border border-gray-200 p-4"
        ></div>

        <!-- Error Message -->
        <div
          v-if="errorMessage"
          class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          <div>{{ errorMessage }}</div>
          <button
            v-if="!isLoading && !isProcessing"
            @click="initializePayment"
            class="mt-2 text-xs font-semibold text-red-600 hover:text-red-700 underline"
          >
            Retry
          </button>
        </div>

        <!-- Submit Button -->
        <button
          :disabled="isProcessing || isLoading"
          :class="[
            'w-full rounded-lg px-4 py-2 font-medium text-white transition-colors',
            isProcessing || isLoading
              ? 'cursor-wait bg-gray-400'
              : 'bg-blue-600 hover:bg-blue-700'
          ]"
          @click="handlePayment"
        >
          <span v-if="isProcessing" class="flex items-center justify-center">
            <span
              class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
            ></span>
            Processing...
          </span>
          <span v-else>Subscribe for $19/month</span>
        </button>
      </div>

      <!-- Cancel Button -->
      <button
        class="mt-3 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        @click="emit('close')"
        :disabled="isProcessing"
      >
        Cancel
      </button>

      <!-- Payment Methods Info -->
      <div class="mt-6 rounded-lg bg-blue-50 p-3">
        <p class="text-xs text-blue-900">
          💳 We accept credit cards, debit cards, and PayPal. Your payment is
          secured by Stripe.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { StripeApiClient } from '@/infrastructure/api/StripeApiClient'
import { StripeService } from '@/services/stripeService'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  userId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close', 'success', 'error'])

// State
const isLoading = ref(false)
const isProcessing = ref(false)
const errorMessage = ref('')
let clientSecret = null  // Store client secret for payment confirmation

// Stripe service
let stripeService = null

// Initialize Stripe service
onMounted(() => {
  const stripeApiClient = new StripeApiClient(
    import.meta.env.VITE_STRIPE_PUBLIC_KEY
  )
  stripeService = new StripeService(stripeApiClient)
})

// Clean up on unmount
onUnmounted(() => {
  if (stripeService) {
    stripeService.cleanup()
  }
})

// Watch for modal open
watch(
  () => props.isOpen,
  async (newVal) => {
    if (newVal) {
      console.log('[StripePaymentModal] Modal opened, initializing payment...')
      isProcessing.value = false
      errorMessage.value = ''
      await initializePayment()
    } else {
      console.log('[StripePaymentModal] Modal closed, resetting state')
      cleanup()
    }
  },
  { immediate: false }
)

/**
 * Reset modal state completely
 */
function cleanup() {
  clientSecret = null
  errorMessage.value = ''
  isProcessing.value = false
  isLoading.value = false
}

/**
 * Initialize payment element
 */
async function initializePayment() {
  try {
    isLoading.value = true
    errorMessage.value = ''

    // Create subscription and get client secret
    const response = await stripeService.createSubscription(
      props.userId,
      import.meta.env.VITE_STRIPE_PRICE_ID
    )
    clientSecret = response.clientSecret
    console.log('[StripePaymentModal] Got client secret, initializing payment element')

    // Initialize payment element
    await stripeService.initializePayment(clientSecret)

    // Set loading to false to render DOM element
    isLoading.value = false

    // Now that DOM is rendered, mount the payment element
    // Use nextTick to ensure DOM has been updated
    await new Promise(resolve => setTimeout(resolve, 0))
    stripeService.stripeApiClient.mountPaymentElement('stripe-payment-element')

    console.log('[StripePaymentModal] Payment element mounted successfully')
  } catch (error) {
    console.error('Error initializing payment:', error)
    const errorMsg = error.message || 'Failed to load payment form'
    errorMessage.value = errorMsg
    isLoading.value = false

    // Emit error but don't auto-close modal - let user see the error
    emit('error', {
      message: errorMsg,
      code: error.code || 'PAYMENT_INIT_ERROR'
    })
  }
}

/**
 * Handle payment confirmation
 */
async function handlePayment() {
  try {
    if (!clientSecret) {
      throw new Error('Payment not initialized. Please reload and try again.')
    }

    isProcessing.value = true
    errorMessage.value = ''
    let retries = 0
    const maxRetries = 2

    const attemptPayment = async () => {
      try {
        // IMPORTANT: Must call submitPayment() first before confirmPayment()
        // This is a Stripe Payment Element requirement
        console.log('[StripePaymentModal] Submitting payment element...')
        await stripeService.submitPayment()

        console.log('[StripePaymentModal] Payment element submitted, confirming payment...')
        const returnUrl = `${import.meta.env.VITE_APP_URL}/app/subscription?payment_success=true`

        // Confirm payment with Stripe
        const paymentStatus = await stripeService.confirmPayment(
          clientSecret,
          returnUrl
        )

        if (!paymentStatus.success) {
          const error = paymentStatus.error
          // Check if error is retryable
          if (error.code && ['card_declined', 'processing_error', 'rate_limit'].includes(error.code) && retries < maxRetries) {
            retries++
            console.log(`[StripePaymentModal] Retryable error (${error.code}), attempt ${retries + 1}/${maxRetries + 1}`)
            errorMessage.value = `${error.message}. Retrying... (${retries}/${maxRetries})`
            // Wait 2 seconds before retrying
            await new Promise(resolve => setTimeout(resolve, 2000))
            return attemptPayment()
          }
          throw new Error(error.message || 'Payment failed')
        }

        console.log('[StripePaymentModal] Payment successful:', paymentStatus.paymentIntent.id)

        // Emit success
        emit('success', {
          paymentIntentId: paymentStatus.paymentIntent.id,
          status: paymentStatus.paymentIntent.status
        })

        // Close modal after delay
        setTimeout(() => {
          emit('close')
        }, 1500)
      } catch (error) {
        throw error
      }
    }

    await attemptPayment()
  } catch (error) {
    console.error('Error processing payment:', error)
    errorMessage.value = error.message || 'Payment failed. Please try again.'
    isProcessing.value = false
    emit('error', error)
  }
}
</script>
