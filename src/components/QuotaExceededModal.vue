<template>
  <!-- Quota Exceeded Error Modal -->
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden">
      <!-- Modal Header -->
      <div class="bg-gradient-to-r from-red-500 to-orange-500 px-6 py-8 text-white text-center">
        <div class="text-6xl mb-3">🔴</div>
        <h2 class="text-2xl font-bold">Quota Exhausted</h2>
        <p class="text-sm text-red-100 mt-1">You've reached your monthly AI generation limit</p>
      </div>

      <!-- Modal Content -->
      <div class="px-6 py-6">
        <!-- Tier-Specific Message -->
        <div class="mb-6">
          <div v-if="quotaStore.isFree" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p class="text-sm font-semibold text-blue-900 mb-2">🎯 Free Tier Limit Reached</p>
            <p class="text-sm text-blue-800">
              You have used your 40 free AI generations this month. Your quota resets on
              <span class="font-semibold">{{ quotaStore.formattedResetDate }}</span>
              , or upgrade to Premium now to continue.
            </p>
          </div>
          <div v-else class="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p class="text-sm font-semibold text-purple-900 mb-2">⭐ Premium Tier Limit Reached</p>
            <p class="text-sm text-purple-800">
              You have used your 400 premium AI generations this month. Your quota resets on
              <span class="font-semibold">{{ quotaStore.formattedResetDate }}</span>
              .
            </p>
          </div>
        </div>

        <!-- Quota Details -->
        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <div class="flex justify-between items-center mb-3">
            <span class="text-sm font-medium text-gray-700">Your Usage</span>
            <span class="text-lg font-bold text-gray-900">
              {{ quotaStore.currentMonthUsage }} / {{ quotaStore.currentQuotaLimit }}
            </span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div class="bg-red-500 h-full rounded-full" style="width: 100%"></div>
          </div>
          <p class="text-xs text-gray-600 mt-2">
            You have {{ quotaStore.remainingQuota }} generations remaining
          </p>
        </div>

        <!-- Benefits Comparison -->
        <div v-if="quotaStore.isFree" class="mb-6">
          <p class="text-sm font-semibold text-gray-900 mb-3">✨ Upgrade to Premium & Get:</p>
          <ul class="space-y-2">
            <li class="flex items-center gap-2 text-sm text-gray-700">
              <span class="text-lg">📈</span>
              <span><span class="font-semibold">10x more generations</span> - 400 per month</span>
            </li>
            <li class="flex items-center gap-2 text-sm text-gray-700">
              <span class="text-lg">⚡</span>
              <span><span class="font-semibold">Faster processing</span> - Priority queue</span>
            </li>
            <li class="flex items-center gap-2 text-sm text-gray-700">
              <span class="text-lg">🎯</span>
              <span><span class="font-semibold">Better models</span> - Grok-2 vs Grok-4-fast</span>
            </li>
            <li class="flex items-center gap-2 text-sm text-gray-700">
              <span class="text-lg">🛡️</span>
              <span><span class="font-semibold">Email support</span> - Dedicated help</span>
            </li>
          </ul>
        </div>

        <!-- Pricing Note -->
        <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-3 mb-6">
          <p class="text-xs text-indigo-900">
            <span class="font-semibold">💰 Premium Plan:</span> $19/month billed monthly, cancel anytime
          </p>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col gap-3">
        <!-- Upgrade Button (using PremiumUpgradeButton component) -->
        <PremiumUpgradeButton
          variant="primary"
          text="✨ Upgrade to Premium - $19/month"
          @success="handleUpgradeSuccess"
          @error="handleUpgradeError"
        />

        <!-- Close/Later Button -->
        <button
          @click="handleClose"
          class="w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition text-sm"
        >
          Wait for Reset ({{ quotaStore.formattedResetDate }})
        </button>
      </div>

      <!-- Footer Note -->
      <div class="px-6 py-3 bg-gray-100 text-center">
        <p class="text-xs text-gray-600">
          Questions? <a href="#" class="text-indigo-600 hover:text-indigo-700 font-medium">Contact support</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useQuotaStore } from '@/stores/quotaStore'
import PremiumUpgradeButton from './PremiumUpgradeButton.vue'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['close', 'upgrade', 'upgrade-success', 'upgrade-error'])

// Store
const quotaStore = useQuotaStore()

// Computed
const remainingDays = computed(() => {
  const today = new Date()
  const resetDate = new Date(today.getFullYear(), today.getMonth() + 1, 1)
  const diffTime = resetDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 'tomorrow'
})

// Methods
const handleUpgradeSuccess = () => {
  console.log('[QuotaExceededModal] Upgrade successful')
  emit('upgrade-success')
  // Modal will stay open while payment processes
}

const handleUpgradeError = (err) => {
  console.error('[QuotaExceededModal] Upgrade error:', err)
  emit('upgrade-error', err)
  // Modal stays open to show error message from PremiumUpgradeButton
}

const handleClose = () => {
  emit('close')
}
</script>

<style scoped>
/* Modal animation */
@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

div:has(.bg-white.rounded-lg) {
  animation: slideUp 0.3s ease-out;
}

/* Button hover effects */
button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

button:active {
  transform: translateY(0);
}
</style>
