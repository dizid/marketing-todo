<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Competitive Benchmarking</h2>
      <p class="text-gray-600 mt-1">See how your metrics stack up against industry benchmarks</p>
    </div>

    <!-- Channel Selection -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">Select Channel to Benchmark</label>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          v-for="channel in channels"
          :key="channel"
          @click="selectedChannel = channel"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors border-2',
            selectedChannel === channel
              ? 'border-blue-600 bg-blue-50 text-blue-600'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
          ]"
        >
          {{ channelLabels[channel] }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
        <p class="text-gray-600">Loading benchmarking data...</p>
      </div>
    </div>

    <!-- No Data State -->
    <div v-else-if="!userMetrics[selectedChannel] || Object.keys(userMetrics[selectedChannel]).length === 0" class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
      <svg class="w-12 h-12 text-yellow-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-yellow-800 font-medium">No metrics for this channel</p>
      <p class="text-yellow-700 text-sm mt-1">Connect an analytics platform to start benchmarking</p>
    </div>

    <!-- Main Content -->
    <div v-else class="space-y-6">
      <!-- Competitive Positioning Card -->
      <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Score -->
          <div class="flex items-center justify-center">
            <div class="text-center">
              <div class="relative w-40 h-40 mx-auto mb-4">
                <svg class="w-full h-full" viewBox="0 0 160 160">
                  <!-- Background circle -->
                  <circle cx="80" cy="80" r="70" fill="none" stroke="#E5E7EB" stroke-width="8" />
                  <!-- Progress circle -->
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    :stroke="getScoreColor(positioning.score)"
                    stroke-width="8"
                    stroke-dasharray="439.82"
                    :stroke-dashoffset="439.82 * (1 - positioning.score / 100)"
                    stroke-linecap="round"
                    style="transform: rotate(-90deg); transform-origin: 80px 80px; transition: stroke-dashoffset 0.5s ease"
                  />
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <div>
                    <div class="text-4xl font-bold text-gray-900">{{ positioning.score }}</div>
                    <div class="text-sm text-gray-600">/100</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Positioning Info -->
          <div class="flex flex-col justify-center">
            <div class="mb-4">
              <h3 class="text-2xl font-bold text-gray-900">{{ positioning.position }}</h3>
              <p class="text-gray-600 mt-1">{{ positioning.percentile }}</p>
            </div>
            <div class="bg-white rounded-lg p-4 border border-blue-200">
              <p class="text-gray-700 text-sm leading-relaxed">{{ positioning.advice }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Metrics Comparison -->
      <div>
        <h3 class="text-lg font-bold text-gray-900 mb-4">Metric Performance</h3>
        <div class="space-y-4">
          <div
            v-for="(comparison, metricKey) in comparisons"
            :key="metricKey"
            class="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div class="flex items-start justify-between mb-3">
              <div>
                <h4 class="font-semibold text-gray-900">{{ getMetricLabel(metricKey) }}</h4>
                <p class="text-sm text-gray-600 mt-1">
                  Your: <span class="font-medium">{{ comparison.userValue }}</span>
                  vs Industry: <span class="font-medium">{{ comparison.benchmarkValue }}</span>
                </p>
              </div>
              <div
                :class="[
                  'px-3 py-1 rounded-full text-sm font-medium',
                  comparison.performance === 'above'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                ]"
              >
                {{ comparison.performance === 'above' ? '↑' : '↓' }}
                {{ Math.abs(parseFloat(comparison.percentageDiff)) }}%
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="bg-gray-200 h-2 rounded-full overflow-hidden mb-2">
              <div
                :style="{ width: Math.min(100, (comparison.userValue / comparison.benchmarkValue) * 100) + '%' }"
                :class="[
                  'h-full transition-all duration-500',
                  comparison.performance === 'above'
                    ? 'bg-green-500'
                    : 'bg-orange-500'
                ]"
              />
            </div>

            <!-- Rank Badge -->
            <div class="flex items-center">
              <span class="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                {{ getRankLabel(comparison.rank) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recommendations -->
      <div v-if="recommendations.length > 0">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Improvement Opportunities</h3>
        <div class="space-y-3">
          <div
            v-for="(rec, idx) in recommendations"
            :key="idx"
            class="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border-l-4 border-orange-500"
          >
            <div class="flex items-start">
              <div class="flex-shrink-0 mt-0.5">
                <svg class="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3 flex-1">
                <h4 class="font-semibold text-gray-900">{{ getMetricLabel(rec.metric) }}</h4>
                <p class="text-sm text-gray-700 mt-1">{{ rec.issue }}</p>
                <p class="text-sm text-gray-600 mt-2">{{ rec.action }}</p>
                <div class="mt-2 inline-block px-3 py-1 bg-white rounded text-sm font-medium text-orange-800">
                  +{{ rec.potentialGain }}% potential gain
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Industry Summary -->
      <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Industry Benchmarks</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div
            v-for="(value, key) in industrySummary.benchmarks"
            :key="key"
            class="text-center p-3 bg-white rounded border border-gray-200"
          >
            <div class="text-2xl font-bold text-blue-600">{{ value }}</div>
            <div class="text-xs text-gray-600 mt-1 capitalize">{{ getMetricLabel(key) }}</div>
          </div>
        </div>
      </div>

      <!-- Goal-Based Targets -->
      <div v-if="selectedGoal" class="bg-green-50 rounded-lg p-6 border border-green-200">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Goal-Based Targets</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white rounded p-4">
            <div class="text-sm text-gray-600">Target Metric</div>
            <div class="text-xl font-bold text-gray-900 mt-1">{{ goalTargets.metric }}</div>
          </div>
          <div class="bg-white rounded p-4">
            <div class="text-sm text-gray-600">Target Value</div>
            <div class="text-xl font-bold text-green-600 mt-1">{{ goalTargets.target }}</div>
          </div>
          <div class="bg-white rounded p-4">
            <div class="text-sm text-gray-600">Timeframe</div>
            <div class="text-xl font-bold text-gray-900 mt-1">{{ goalTargets.timeframe }}</div>
          </div>
        </div>
        <div class="mt-4 p-4 bg-white rounded border border-green-200">
          <p class="text-sm text-gray-700"><strong>Strategy:</strong> {{ goalTargets.strategy }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useBenchmarkingService } from '@/services/benchmarkingService'

const props = defineProps({
  userMetrics: {
    type: Object,
    default: () => ({
      email: {
        avgOpenRate: 26.5,
        avgClickRate: 2.8,
        avgConversionRate: 1.1,
        avgUnsubscribeRate: 0.4
      },
      web: {
        avgConversionRate: 2.8,
        avgBounceRate: 42,
        avgEngagementTime: 5.2
      },
      social: {
        avgEngagementRate: 4.2,
        avgClickThroughRate: 2.1,
        avgShareRate: 0.8
      },
      ads: {
        avgCPC: 0.95,
        avgROAS: 3.2,
        avgCPA: 12.50
      }
    })
  }
})

const { compareMetrics, getRecommendations, getCompetitivePositioning, getIndustrySummary, getGoalBasedTargets } = useBenchmarkingService()

const channels = ['email', 'web', 'social', 'ads']
const channelLabels = {
  email: 'Email',
  web: 'Web',
  social: 'Social Media',
  ads: 'Paid Ads'
}

const metricLabels = {
  avgOpenRate: 'Open Rate',
  avgClickRate: 'Click Rate',
  avgConversionRate: 'Conversion Rate',
  avgUnsubscribeRate: 'Unsubscribe Rate',
  avgBounceRate: 'Bounce Rate',
  avgEngagementTime: 'Engagement Time',
  avgEngagementRate: 'Engagement Rate',
  avgClickThroughRate: 'Click-Through Rate',
  avgShareRate: 'Share Rate',
  avgCPC: 'Cost Per Click',
  avgROAS: 'Return on Ad Spend',
  avgCPA: 'Cost Per Acquisition'
}

const selectedChannel = ref('email')
const selectedGoal = ref(null)
const isLoading = ref(false)

// Computed properties
const comparisons = computed(() => {
  return compareMetrics(selectedChannel.value, props.userMetrics[selectedChannel.value] || {}) || {}
})

const positioning = computed(() => {
  return getCompetitivePositioning(selectedChannel.value, props.userMetrics[selectedChannel.value] || {})
})

const recommendations = computed(() => {
  return getRecommendations(selectedChannel.value, props.userMetrics[selectedChannel.value] || {}) || []
})

const industrySummary = computed(() => {
  return getIndustrySummary(selectedChannel.value)
})

const goalTargets = computed(() => {
  if (!selectedGoal.value) return null
  return getGoalBasedTargets(selectedGoal.value, props.userMetrics[selectedChannel.value] || {})
})

/**
 * Get color for competitive score
 */
const getScoreColor = (score) => {
  if (score >= 80) return '#10B981' // green
  if (score >= 60) return '#3B82F6' // blue
  if (score >= 40) return '#F59E0B' // amber
  return '#EF4444' // red
}

/**
 * Get rank label
 */
const getRankLabel = (rank) => {
  const labels = {
    'top-10%': 'Top 10% 🏆',
    'top-25%': 'Top 25% ⭐',
    'above-average': 'Above Average',
    'average': 'Average',
    'below-average': 'Below Average',
    'bottom-10%': 'Bottom 10%'
  }
  return labels[rank] || rank
}

/**
 * Get metric label
 */
const getMetricLabel = (key) => {
  return metricLabels[key] || key
}

onMounted(() => {
  // Data is passed via props, no need for async loading
  isLoading.value = false
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
