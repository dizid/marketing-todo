<template>
  <!-- AI Generation Quota Status Card -->
  <div class="card mb-6 w-full overflow-hidden animate-fade-in-up">
    <!-- Header with Tier Badge -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 gap-2 pb-6 border-b border-border">
      <div class="flex-1">
        <h3 class="text-base sm:text-lg font-semibold font-display text-primary">AI Generation Quota</h3>
        <p class="text-xs sm:text-sm text-secondary mt-1">Monthly limit for AI-powered features</p>
      </div>
      <!-- Tier Badge -->
      <span
        :class="[
          'px-3 py-1 text-xs font-semibold whitespace-nowrap flex-shrink-0 badge',
          subscriptionStore.isPremium
            ? 'badge-highlight'
            : 'badge-primary'
        ]"
      >
        {{ subscriptionStore.isPremium ? '✨ Premium' : 'Free' }}
      </span>
    </div>

    <!-- Quota Display with Numbers -->
    <div class="mb-6">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-3 gap-1">
        <span class="text-xs sm:text-sm font-medium text-secondary">Generations Used</span>
        <span class="text-xl sm:text-2xl font-bold font-display text-text">
          {{ subscriptionStore.currentMonthUsage }} / {{ subscriptionStore.currentQuotaLimit }}
        </span>
      </div>

      <!-- Progress Bar with Color Coding -->
      <div class="w-full bg-surface border border-border h-3 overflow-hidden">
        <div
          :class="[
            'h-full transition-all duration-300',
            quotaPercentage <= 50
              ? 'bg-primary'
              : quotaPercentage <= 80
                ? 'bg-highlight'
                : quotaPercentage >= 100
                  ? 'bg-accent'
                  : 'bg-primary'
          ]"
          :style="{ width: Math.min(quotaPercentage, 100) + '%' }"
        ></div>
      </div>

      <!-- Percentage and Remaining Text -->
      <div class="flex flex-col sm:flex-row sm:justify-between mt-3 gap-2">
        <span class="text-xs text-secondary">{{ quotaPercentage }}% used</span>
        <span
          :class="[
            'text-xs font-medium',
            quotaPercentage >= 100
              ? 'text-accent'
              : quotaPercentage >= 80
                ? 'text-highlight'
                : 'text-primary'
          ]"
        >
          {{ subscriptionStore.remainingQuota }} remaining
        </span>
      </div>
    </div>

    <!-- Status Message -->
    <div v-if="statusMessage" :class="['p-2 sm:p-3 border mb-6 text-xs sm:text-sm', statusMessageClasses]">
      <p class="font-medium">{{ statusMessage }}</p>
    </div>

    <!-- Reset Date -->
    <div class="bg-surface-light border border-border p-2 sm:p-3 mb-6">
      <p class="text-xs text-secondary">
        <span class="font-semibold">Quota resets:</span> {{ subscriptionStore.formattedResetDate }}
      </p>
    </div>

    <!-- Upgrade Button (for free tier only) -->
    <div v-if="subscriptionStore.isFree" class="mb-6">
      <PremiumUpgradeButton
        variant="primary"
        text="✨ Upgrade to Premium"
        :show-price="true"
        @success="handleUpgradeSuccess"
        @error="handleUpgradeError"
      />
    </div>

    <!-- AI Features Note -->
    <p class="text-xs text-muted mt-4 text-center leading-relaxed">
      Each AI generation uses 1 quota. Premium tier provides 10x more generations per month.
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSubscriptionStore } from '@/stores/subscriptionStore'
import PremiumUpgradeButton from './PremiumUpgradeButton.vue'

// Emit events
const emit = defineEmits(['upgrade-clicked'])

// Store
const subscriptionStore = useSubscriptionStore()

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
    return 'bg-accent/20 border border-accent text-accent'
  }

  if (subscriptionStore.remainingQuota <= 3) {
    return 'bg-highlight/20 border border-highlight text-highlight'
  }

  return 'bg-primary/20 border border-primary text-primary'
})

// Methods
const handleUpgradeSuccess = () => {
  console.log('[QuotaStatusCard] Upgrade successful, redirecting to subscription page')
  // PremiumUpgradeButton handles the actual redirect
}

const handleUpgradeError = (err) => {
  console.error('[QuotaStatusCard] Upgrade error:', err)
  // Error shown in PremiumUpgradeButton component
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
