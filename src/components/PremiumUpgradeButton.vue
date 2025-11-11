<template>
  <!-- Premium Upgrade Button Component -->
  <div>
    <!-- Main Upgrade Button -->
    <button
      v-if="!isLoading && !isSuccess"
      @click="handleUpgradeClick"
      :disabled="isLoading || isSuccess"
      :class="[
        'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition',
        variant === 'primary'
          ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg'
          : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg'
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
    <div v-if="isSuccess" class="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg font-semibold">
      <span>✅ Upgrade Initiated</span>
      <span class="text-sm text-green-700">(Redirecting to PayPal...)</span>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-sm text-red-800 font-medium">❌ {{ errorMessage }}</p>
      <p class="text-xs text-red-700 mt-1">
        Please try again or
        <a href="mailto:support@example.com" class="underline hover:text-red-900">contact support</a>
      </p>
    </div>

    <!-- Loading Modal (shows PayPal redirect happening) -->
    <Teleport to="body" v-if="isLoading">
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-2xl p-8 text-center max-w-sm">
          <div class="mb-4">
            <svg class="animate-spin w-12 h-12 mx-auto text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Upgrading to Premium</h3>
          <p class="text-gray-600 mb-4">Redirecting to PayPal for payment...</p>
          <p class="text-xs text-gray-500">Please wait and do not close this window</p>
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
        // Activate subscription
        await subscriptionStore.upgradeToPresentation(subscriptionId, payerId)
        console.log('[PremiumUpgradeButton] Subscription activated successfully')

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
