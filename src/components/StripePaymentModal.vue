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
        @click="handleCancel"
      >
        Cancel
      </button>

      <!-- Payment Methods Info -->
      <div class="mt-6 rounded-lg bg-blue-50 p-3">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-sm">💳</span>
          <span class="text-xs font-medium text-blue-900">Accepted Payment Methods</span>
        </div>
        <div class="flex flex-wrap items-center gap-3 mb-2">
          <span class="text-xs text-blue-800">Cards</span>
          <span class="text-xs text-blue-800">Google Pay</span>
          <span class="text-xs text-blue-800">Apple Pay</span>
          <span class="text-xs text-blue-800">PayPal</span>
        </div>
        <p class="text-xs text-blue-700">
          Your payment is secured by Stripe. Payment options shown depend on your device and region.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { StripeApiClient } from '@/infrastructure/api/StripeApiClient'
import { StripeService } from '@/services/stripeService'
import { useQuotaStore } from '@/stores/quotaStore'
import { logger } from '@/utils/logger'

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

// Stores
const quotaStore = useQuotaStore()

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
      logger.debug('[StripePaymentModal] Modal opened, initializing payment...')
      isProcessing.value = false
      errorMessage.value = ''
      await initializePayment()
    } else {
      logger.debug('[StripePaymentModal] Modal closed, resetting state')
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
 * Handle cancel button click
 */
function handleCancel() {
  cleanup()
  emit('close')
}

/**
 * Initialize payment element
 */
async function initializePayment() {
  try {
    isLoading.value = true
    errorMessage.value = ''

    // Invalidate cache to ensure fresh subscription status after payment
    quotaStore.invalidateCache()
    logger.debug('[StripePaymentModal] Cache invalidated for fresh status fetch after payment')

    // Create subscription and get client secret
    const response = await stripeService.createSubscription(
      props.userId,
      import.meta.env.VITE_STRIPE_PRICE_ID
    )
    clientSecret = response.clientSecret
    logger.debug('[StripePaymentModal] Got client secret, initializing payment element')

    // Initialize payment element
    await stripeService.initializePayment(clientSecret)

    // Set loading to false to render DOM element
    isLoading.value = false

    // Now that DOM is rendered, mount the payment element
    // Use nextTick to ensure DOM has been updated
    await new Promise(resolve => setTimeout(resolve, 0))
    stripeService.stripeApiClient.mountPaymentElement('stripe-payment-element')

    logger.debug('[StripePaymentModal] Payment element mounted successfully')
  } catch (error) {
    logger.error('Error initializing payment:', error)
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
        // Payment Element handles validation automatically
        logger.debug('[StripePaymentModal] Confirming payment with Payment Element...')
        const returnUrl = `${import.meta.env.VITE_APP_URL}/app/subscription?payment_success=true`

        // Confirm payment with Stripe Payment Element
        // Supports Cards, Google Pay, Apple Pay, PayPal based on dashboard config
        const paymentStatus = await stripeService.confirmPayment(
          clientSecret,
          props.userId
        )

        if (!paymentStatus.success) {
          const error = paymentStatus.error
          // Check if error is retryable
          if (error.code && ['card_declined', 'processing_error', 'rate_limit'].includes(error.code) && retries < maxRetries) {
            retries++
            logger.debug(`[StripePaymentModal] Retryable error (${error.code}), attempt ${retries + 1}/${maxRetries + 1}`)
            errorMessage.value = `${error.message}. Retrying... (${retries}/${maxRetries})`
            // Wait 2 seconds before retrying
            await new Promise(resolve => setTimeout(resolve, 2000))
            return attemptPayment()
          }
          throw new Error(error.message || 'Payment failed')
        }

        logger.debug('[StripePaymentModal] Payment successful:', paymentStatus.paymentIntent.id)

        // Emit success immediately - don't wait for webhook
        // The webhook will update the subscription status in the background
        // We invalidate cache so next fetch gets the updated status
        quotaStore.invalidateCache()
        logger.debug('[StripePaymentModal] Cache invalidated, webhook will update subscription status in background')

        // Reset processing state
        isProcessing.value = false
        logger.debug('[StripePaymentModal] Payment processing complete, closing modal')

        // Emit success
        emit('success', {
          paymentIntentId: paymentStatus.paymentIntent.id,
          status: paymentStatus.paymentIntent.status
        })

        // Close modal immediately - don't wait for subscription status update
        // The subscription store will fetch updated status on next access
        emit('close')
      } catch (error) {
        throw error
      }
    }

    await attemptPayment()
  } catch (error) {
    logger.error('Error processing payment:', error)
    errorMessage.value = error.message || 'Payment failed. Please try again.'
    isProcessing.value = false
    emit('error', error)
  }
}
</script>
