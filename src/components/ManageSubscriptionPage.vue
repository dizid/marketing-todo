<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Subscription & Billing</h1>
            <p class="mt-1 text-sm sm:text-base text-gray-600">Manage your account and billing settings</p>
          </div>
          <button
            @click="goBack"
            class="w-full sm:w-auto inline-flex items-center justify-center sm:justify-start px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition text-sm"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Subscription Status Card -->
      <div class="bg-white rounded-lg shadow-md p-6 sm:p-8 mb-8">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6 sm:mb-8">
          <div>
            <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Current Plan</h2>
            <div class="flex items-center gap-2 flex-wrap">
              <span
                :class="[
                  'px-3 py-1 rounded-full text-xs sm:text-sm font-semibold',
                  quotaStore.isPremium
                    ? 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800'
                    : 'bg-gray-100 text-gray-800'
                ]"
              >
                {{ quotaStore.tier === 'premium' ? '⭐ Premium' : 'Free' }}
              </span>
              <span
                v-if="quotaStore.isActive"
                class="px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-green-100 text-green-800"
              >
                ✓ Active
              </span>
              <span
                v-else
                class="px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-red-100 text-red-800"
              >
                ✗ Inactive
              </span>
            </div>
          </div>

          <!-- Upgrade Button (Mobile: full width, Desktop: right-aligned) -->
          <div v-if="quotaStore.isFree" class="w-full sm:w-auto sm:text-right">
            <p class="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">Ready for more?</p>
            <button
              @click="handleUpgrade"
              :disabled="isLoading"
              class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-blue-700 transition disabled:opacity-50 text-sm sm:text-base"
            >
              <span v-if="!isLoading">✨ Upgrade - $19/month</span>
              <span v-else>Processing...</span>
            </button>
          </div>
        </div>

        <!-- Subscription Details Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <!-- Monthly Quota -->
          <div class="border-l-4 border-indigo-500 pl-4">
            <p class="text-sm text-gray-600 mb-1">Monthly Quota</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ quotaStore.currentMonthUsage }} /
              {{ quotaStore.currentQuotaLimit }}
            </p>
            <p class="text-xs text-gray-500 mt-1">AI generations used this month</p>
          </div>

          <!-- Remaining Quota -->
          <div class="border-l-4 border-green-500 pl-4">
            <p class="text-sm text-gray-600 mb-1">Remaining Quota</p>
            <p
              :class="[
                'text-2xl font-bold',
                quotaStore.remainingQuota > 0
                  ? 'text-green-600'
                  : 'text-red-600'
              ]"
            >
              {{ quotaStore.remainingQuota }}
            </p>
            <p class="text-xs text-gray-500 mt-1">generations left</p>
          </div>

          <!-- Current Period -->
          <div class="border-l-4 border-blue-500 pl-4">
            <p class="text-sm text-gray-600 mb-1">Current Period</p>
            <p class="text-sm font-semibold text-gray-900">
              {{
                quotaStore.subscription?.current_period_start
                  ? formatDate(quotaStore.subscription.current_period_start)
                  : 'N/A'
              }}
            </p>
            <p class="text-xs text-gray-500 mt-1">starts</p>
          </div>

          <!-- Reset Date -->
          <div class="border-l-4 border-orange-500 pl-4">
            <p class="text-sm text-gray-600 mb-1">Next Reset</p>
            <p class="text-sm font-semibold text-gray-900">
              {{ quotaStore.formattedResetDate }}
            </p>
            <p class="text-xs text-gray-500 mt-1">monthly quota resets</p>
          </div>
        </div>

        <!-- Quota Progress Bar -->
        <div class="mt-8 pt-8 border-t border-gray-200">
          <p class="text-sm font-semibold text-gray-900 mb-3">Quota Usage</p>
          <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              :style="{ width: quotaStore.quotaPercentage + '%' }"
              :class="[
                'h-full transition-all duration-300',
                quotaStore.quotaPercentage < 50
                  ? 'bg-green-500'
                  : quotaStore.quotaPercentage < 75
                  ? 'bg-yellow-500'
                  : quotaStore.quotaPercentage < 90
                  ? 'bg-orange-500'
                  : 'bg-red-500'
              ]"
            ></div>
          </div>
          <p class="mt-2 text-xs text-gray-600 text-right">
            {{ quotaStore.quotaPercentage }}% used
          </p>
        </div>
      </div>

      <!-- Plans Comparison -->
      <div v-if="quotaStore.isFree" class="bg-white rounded-lg shadow-md p-6 sm:p-8 mb-8">
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Why Upgrade?</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          <!-- Free Plan -->
          <div class="border border-gray-200 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Free Plan</h3>
            <ul class="space-y-3">
              <li class="flex items-center gap-3">
                <span class="text-gray-400">✓</span>
                <span class="text-gray-700">40 AI generations/month</span>
              </li>
              <li class="flex items-center gap-3">
                <span class="text-gray-400">✓</span>
                <span class="text-gray-700">Basic task management</span>
              </li>
              <li class="flex items-center gap-3">
                <span class="text-gray-400">✓</span>
                <span class="text-gray-700">Community support</span>
              </li>
              <li class="flex items-center gap-3">
                <span class="text-gray-400">✗</span>
                <span class="text-gray-500">Premium features</span>
              </li>
            </ul>
          </div>

          <!-- Premium Plan -->
          <div class="border-2 border-purple-500 rounded-lg p-6 bg-gradient-to-br from-purple-50 to-indigo-50">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Premium Plan</h3>
              <span class="text-sm font-bold text-purple-600">BEST VALUE</span>
            </div>
            <p class="text-2xl font-bold text-purple-600 mb-4">$19/month</p>
            <ul class="space-y-3">
              <li class="flex items-center gap-3">
                <span class="text-green-500">✓</span>
                <span class="font-semibold text-gray-900">400 AI generations/month</span>
              </li>
              <li class="flex items-center gap-3">
                <span class="text-green-500">✓</span>
                <span class="font-semibold text-gray-900">Advanced features</span>
              </li>
              <li class="flex items-center gap-3">
                <span class="text-green-500">✓</span>
                <span class="font-semibold text-gray-900">Priority support</span>
              </li>
              <li class="flex items-center gap-3">
                <span class="text-green-500">✓</span>
                <span class="font-semibold text-gray-900">Early access to new features</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Danger Zone -->
      <div
        v-if="quotaStore.isPremium && quotaStore.isActive"
        class="bg-red-50 border-2 border-red-200 rounded-lg p-6 sm:p-8"
      >
        <h2 class="text-xl sm:text-2xl font-bold text-red-900 mb-2">Manage Premium Subscription</h2>
        <p class="text-sm sm:text-base text-red-800 mb-6">
          You can cancel your subscription anytime. No hidden fees or long-term contracts.
        </p>

        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <button
            @click="handleCancel"
            :disabled="isLoading || isCancelling"
            class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:opacity-50 text-sm"
          >
            <span v-if="!isCancelling">Cancel Subscription</span>
            <span v-else>Cancelling...</span>
          </button>

          <div v-if="showCancelConfirm" class="w-full sm:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <span class="text-red-900 font-semibold text-sm">Sure?</span>
            <button
              @click="confirmCancel"
              :disabled="isLoading || isCancelling"
              class="px-3 py-2 bg-red-600 text-white text-xs sm:text-sm font-semibold rounded hover:bg-red-700 transition disabled:opacity-50"
            >
              Yes, Cancel
            </button>
            <button
              @click="() => { showCancelConfirm = false; isCancelling = false }"
              class="px-3 py-2 bg-gray-300 text-gray-900 text-xs sm:text-sm font-semibold rounded hover:bg-gray-400 transition"
            >
              Keep
            </button>
          </div>
        </div>

        <p class="text-xs text-red-700 mt-4">
          ⚠️ After cancellation, you'll revert to the Free plan (40 AI generations/month)
        </p>
      </div>

      <!-- Billing History (Placeholder) -->
      <div class="mt-8 bg-white rounded-lg shadow-md p-6 sm:p-8">
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Billing History</h2>
        <div class="text-center py-12">
          <p class="text-sm text-gray-500 mb-2">📋 No billing history yet</p>
          <p class="text-xs text-gray-500">Your invoices will appear here after your first payment</p>
        </div>
      </div>
    </div>

    <!-- Stripe Payment Modal -->
    <StripePaymentModal
      :is-open="showPaymentModal"
      :user-id="authStore.user?.id || ''"
      @close="handlePaymentClose"
      @success="handlePaymentSuccess"
      @error="handlePaymentError"
    />

    <!-- Error Toast -->
    <transition name="fade">
      <div
        v-if="errorMessage"
        class="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 bg-red-600 text-white px-4 sm:px-6 py-3 rounded-lg shadow-lg z-50 text-sm sm:text-base max-w-sm"
      >
        {{ errorMessage }}
      </div>
    </transition>

    <!-- Success Toast -->
    <transition name="fade">
      <div
        v-if="successMessage"
        class="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 bg-green-600 text-white px-4 sm:px-6 py-3 rounded-lg shadow-lg z-50 text-sm sm:text-base max-w-sm"
      >
        {{ successMessage }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuotaStore } from '@/stores/quotaStore'
import { useAuthStore } from '@/stores/authStore'
import { StripeService } from '@/services/stripeService'
import { StripeApiClient } from '@/infrastructure/api/StripeApiClient'
import StripePaymentModal from '@/components/StripePaymentModal.vue'

// Router
const router = useRouter()

// Stores
const quotaStore = useQuotaStore()
const authStore = useAuthStore()

// State
const isLoading = ref(false)
const isCancelling = ref(false)
const showCancelConfirm = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const showPaymentModal = ref(false)

// Stripe service
let stripeService = null

// Lifecycle
onMounted(async () => {
  // Initialize Stripe service
  const stripeApiClient = new StripeApiClient(
    import.meta.env.VITE_STRIPE_PUBLIC_KEY
  )
  stripeService = new StripeService(stripeApiClient)

  // Ensure subscription data is loaded
  await quotaStore.fetchSubscriptionStatus(true)
})

// Methods
const goBack = () => {
  router.push('/')
}

const handleUpgrade = async () => {
  // Show payment modal instead of redirecting
  // Set loading optimistically to prevent double-clicks
  isLoading.value = true
  showPaymentModal.value = true
  // Reset loading when modal is closed
  setTimeout(() => {
    if (!showPaymentModal.value) {
      isLoading.value = false
    }
  }, 100)
}

const handlePaymentSuccess = async (details) => {
  successMessage.value = 'Payment successful! Your premium plan is now active.'
  showPaymentModal.value = false

  // Refresh subscription data
  await quotaStore.fetchSubscriptionStatus(true)

  // Clear message after 3 seconds
  setTimeout(() => {
    successMessage.value = ''
  }, 3000)
}

const handlePaymentError = (error) => {
  console.error('Payment error:', error)
  errorMessage.value = error.message || 'Payment failed. Please try again.'
}

const handlePaymentClose = () => {
  showPaymentModal.value = false
}

const handleCancel = () => {
  // Show confirmation dialog
  showCancelConfirm.value = true
}

const confirmCancel = async () => {
  isCancelling.value = true
  errorMessage.value = ''

  try {
    console.log('[ManageSubscriptionPage] Starting cancellation process...')

    if (!quotaStore.subscription?.stripe_subscription_id) {
      throw new Error('No active Stripe subscription found')
    }

    // Get current user ID from store or auth
    const userId = quotaStore.subscription?.user_id
    if (!userId) {
      throw new Error('User not authenticated')
    }

    console.log('[ManageSubscriptionPage] Cancelling subscription for user:', userId)

    // Cancel subscription via Stripe service
    const cancelResult = await stripeService.cancelSubscription(
      userId,
      quotaStore.subscription.stripe_subscription_id
    )
    console.log('[ManageSubscriptionPage] Cancellation response:', cancelResult)

    successMessage.value = 'Subscription cancelled successfully. You are now on the free plan.'
    showCancelConfirm.value = false
    isCancelling.value = false

    console.log('[ManageSubscriptionPage] Invalidating cache and fetching fresh subscription status...')

    // Invalidate cache and refresh subscription data
    quotaStore.invalidateCache()
    await quotaStore.fetchSubscriptionStatus(true)

    console.log('[ManageSubscriptionPage] Subscription status refreshed:', quotaStore.subscription)

    // Clear success message after 3 seconds (no redirect)
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err) {
    console.error('[ManageSubscriptionPage] Cancellation error:', err)
    errorMessage.value = err.message || 'Failed to cancel subscription. Please try again.'
    isCancelling.value = false
    showCancelConfirm.value = false

    // Clear error message after 5 seconds
    setTimeout(() => {
      errorMessage.value = ''
    }, 5000)
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
