<template>
  <!-- AI Generation Quota Status Card -->
  <div class="bg-white rounded-lg shadow-md p-6 mb-6">
    <!-- Header with Tier Badge -->
    <div class="flex justify-between items-start mb-4">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">AI Generation Quota</h3>
        <p class="text-sm text-gray-600 mt-1">Monthly limit for AI-powered features</p>
      </div>
      <!-- Tier Badge -->
      <span
        :class="[
          'px-3 py-1 rounded-full text-xs font-semibold',
          subscriptionStore.isPremium
            ? 'bg-purple-100 text-purple-800'
            : 'bg-blue-100 text-blue-800'
        ]"
      >
        {{ subscriptionStore.isPremium ? '✨ Premium' : 'Free' }}
      </span>
    </div>

    <!-- Quota Display with Numbers -->
    <div class="mb-4">
      <div class="flex justify-between items-baseline mb-2">
        <span class="text-sm font-medium text-gray-700">Generations Used</span>
        <span class="text-2xl font-bold text-gray-900">
          {{ subscriptionStore.currentMonthUsage }} / {{ subscriptionStore.currentQuotaLimit }}
        </span>
      </div>

      <!-- Progress Bar with Color Coding -->
      <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          :class="[
            'h-full transition-all duration-300 rounded-full',
            quotaPercentage <= 50
              ? 'bg-green-500'
              : quotaPercentage <= 80
                ? 'bg-yellow-500'
                : quotaPercentage >= 100
                  ? 'bg-red-500'
                  : 'bg-orange-500'
          ]"
          :style="{ width: Math.min(quotaPercentage, 100) + '%' }"
        ></div>
      </div>

      <!-- Percentage and Remaining Text -->
      <div class="flex justify-between mt-2">
        <span class="text-xs text-gray-600">{{ quotaPercentage }}% used</span>
        <span
          :class="[
            'text-xs font-medium',
            quotaPercentage >= 100
              ? 'text-red-600'
              : quotaPercentage >= 80
                ? 'text-orange-600'
                : 'text-green-600'
          ]"
        >
          {{ subscriptionStore.remainingQuota }} remaining
        </span>
      </div>
    </div>

    <!-- Status Message -->
    <div v-if="statusMessage" :class="['p-3 rounded-md mb-4', statusMessageClasses]">
      <p class="text-sm font-medium">{{ statusMessage }}</p>
    </div>

    <!-- Reset Date -->
    <div class="bg-gray-50 rounded-md p-3 mb-4">
      <p class="text-xs text-gray-600">
        <span class="font-semibold">Quota resets:</span> {{ subscriptionStore.formattedResetDate }}
      </p>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-3">
      <!-- Upgrade Button (for free tier) -->
      <button
        v-if="subscriptionStore.isFree"
        @click="$emit('upgrade-clicked')"
        class="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium rounded-lg transition shadow-sm hover:shadow-md"
      >
        ✨ Upgrade to Premium
      </button>

      <!-- Refresh Button -->
      <button
        @click="refreshQuota"
        :disabled="isRefreshing"
        class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 font-medium rounded-lg transition"
      >
        <span v-if="!isRefreshing">🔄 Refresh</span>
        <span v-else>Refreshing...</span>
      </button>
    </div>

    <!-- AI Features Note -->
    <p class="text-xs text-gray-500 mt-4 text-center">
      Each AI generation uses 1 quota. Premium tier provides 10x more generations per month.
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSubscriptionStore } from '@/stores/subscriptionStore'

// Emit events
const emit = defineEmits(['upgrade-clicked'])

// Store
const subscriptionStore = useSubscriptionStore()

// Local state
const isRefreshing = ref(false)

// Computed properties
const quotaPercentage = computed(() => {
  return subscriptionStore.quotaPercentage
})

const statusMessage = computed(() => {
  const remaining = subscriptionStore.remainingQuota

  if (remaining === 0) {
    return subscriptionStore.isFree
      ? '❌ Free tier quota exhausted. Upgrade to continue generating.'
      : '⚠️ Premium quota exhausted this month.'
  }

  if (remaining <= 3) {
    return subscriptionStore.isFree
      ? `⚠️ Only ${remaining} free generation${remaining !== 1 ? 's' : ''} remaining!`
      : `⚠️ Only ${remaining} generation${remaining !== 1 ? 's' : ''} remaining this month.`
  }

  if (remaining <= 5) {
    return `📊 ${remaining} generation${remaining !== 1 ? 's' : ''} remaining.`
  }

  return null
})

const statusMessageClasses = computed(() => {
  if (subscriptionStore.remainingQuota === 0) {
    return 'bg-red-50 border border-red-200'
  }

  if (subscriptionStore.remainingQuota <= 3) {
    return 'bg-orange-50 border border-orange-200'
  }

  return 'bg-blue-50 border border-blue-200'
})

// Methods
const refreshQuota = async () => {
  isRefreshing.value = true
  try {
    await subscriptionStore.fetchAIUsage()
    // Also refresh subscription status to catch any upgrades
    await subscriptionStore.fetchSubscriptionStatus(true)
  } catch (err) {
    console.error('Failed to refresh quota:', err)
  } finally {
    isRefreshing.value = false
  }
}
</script>

<style scoped>
/* Smooth transitions */
div {
  transition: all 0.2s ease-in-out;
}

button:active {
  transform: scale(0.98);
}
</style>
