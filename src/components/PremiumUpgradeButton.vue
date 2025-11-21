<template>
  <!-- Premium Upgrade Button Component -->
  <div>
    <!-- Main Upgrade Button -->
    <button
      v-if="!isLoading && !isSuccess"
      @click="handleUpgradeClick"
      :disabled="isLoading || isSuccess"
      :class="[
        'w-full inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold transition text-sm rounded-lg',
        variant === 'primary'
          ? 'bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-indigo-400'
          : 'bg-pink-600 hover:bg-pink-700 text-white disabled:bg-pink-400'
      ]"
    >
      <span v-if="!isLoading">✨ {{ buttonText }}</span>
      <span v-else>
        <svg class="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Processing...
      </span>
    </button>

    <!-- Success Message -->
    <div v-if="isSuccess" class="w-full flex flex-col sm:flex-row sm:items-center sm:gap-2 px-4 sm:px-4 py-3 sm:py-2 bg-green-100 text-green-800 border border-green-300 rounded-lg font-semibold text-sm sm:text-base">
      <span>✅ Upgrade Initiated</span>
      <span class="text-xs sm:text-sm text-green-600">(Redirecting to PayPal...)</span>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="w-full mt-2 p-3 sm:p-4 bg-red-100 border border-red-300 rounded-lg">
      <p class="text-sm sm:text-base text-red-800 font-medium">❌ {{ errorMessage }}</p>
      <p class="text-xs sm:text-sm text-red-600 mt-2">
        Please try again or
        <a href="mailto:support@example.com" class="underline hover:text-red-700">contact support</a>
      </p>
    </div>

    <!-- Loading Modal (shows PayPal redirect happening) -->
    <Teleport to="body" v-if="isLoading">
      <div class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
        <div class="bg-surface rounded-0 shadow-2xl p-6 sm:p-8 text-center w-full max-w-sm border-2 border-primary">
          <div class="mb-4">
            <svg class="animate-spin w-10 sm:w-12 h-10 sm:h-12 mx-auto text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h3 class="text-base sm:text-lg font-semibold font-display text-primary mb-2">Upgrading to Premium</h3>
          <p class="text-sm sm:text-base text-secondary mb-4">Redirecting to PayPal for payment...</p>
          <p class="text-xs text-muted">Please wait and do not close this window</p>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSubscriptionStore } from '@/stores/subscriptionStore'
import { createSubscription, getPlanInfo } from '@/services/paypalService'

// Props
const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary'].includes(value)
  },
  text: {
    type: String,
    default: 'Upgrade to Premium - $19/month'
  },
  showPrice: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['success', 'error', 'loading'])

// Router
const router = useRouter()

// Stores
const subscriptionStore = useSubscriptionStore()

// State
const isLoading = ref(false)
const isSuccess = ref(false)
const errorMessage = ref('')

// Computed
const buttonText = computed(() => {
  if (isLoading.value) return 'Processing...'
  if (isSuccess.value) return 'Upgrading...'
  return props.text
})

// Methods
const handleUpgradeClick = async () => {
  // Reset state
  isLoading.value = true
  errorMessage.value = ''
  emit('loading')

  try {
    console.log('[PremiumUpgradeButton] Starting upgrade flow')

    // Create PayPal subscription
    const approvalUrl = await createSubscription({
      returnUrl: `${window.location.origin}/app?upgrade=success`,
      cancelUrl: `${window.location.origin}/app?upgrade=cancelled`
    })

    if (!approvalUrl) {
      throw new Error('No approval URL received from PayPal')
    }

    console.log('[PremiumUpgradeButton] Redirecting to PayPal:', approvalUrl)
    isSuccess.value = true
    emit('success')

    // Redirect to PayPal after a brief delay (show success message)
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Redirect to PayPal approval
    window.location.href = approvalUrl
  } catch (err) {
    console.error('[PremiumUpgradeButton] Upgrade failed:', err)
    isLoading.value = false
    errorMessage.value = err.message || 'Failed to start upgrade. Please try again.'
    emit('error', err)
  }
}

// Handle PayPal return
const handlePayPalReturn = async () => {
  const params = new URLSearchParams(window.location.search)

  if (params.get('upgrade') === 'success') {
    console.log('[PremiumUpgradeButton] PayPal return detected - success')

    // Get subscription ID and payer ID from query params
    // Support both real PayPal format (subscription_id, payer_id) and mock format (subscription, payer)
    const subscriptionId = params.get('subscription_id') || params.get('subscription')
    const payerId = params.get('payer_id') || params.get('payer')

    if (subscriptionId && payerId) {
      try {
        // Verify subscription was created
        await subscriptionStore.upgradeToPresentation()
        console.log('[PremiumUpgradeButton] Subscription verified successfully')

        // Clear URL params
        window.history.replaceState({}, document.title, '/app')

        // Show success notification
        emit('success')
      } catch (err) {
        console.error('[PremiumUpgradeButton] Failed to activate:', err)
        emit('error', err)
      }
    }
  } else if (params.get('upgrade') === 'cancelled') {
    console.log('[PremiumUpgradeButton] User cancelled PayPal flow')
    window.history.replaceState({}, document.title, '/app')
  }
}

// Initialize on mount to check for PayPal return
const checkForPayPalReturn = () => {
  const params = new URLSearchParams(window.location.search)
  if (params.has('upgrade') || params.has('subscription_id')) {
    handlePayPalReturn()
  }
}

checkForPayPalReturn()
</script>

<style scoped>
button {
  transition: all 0.3s ease-in-out;
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
}

button:active:not(:disabled) {
  transform: translateY(0);
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Spinner animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
