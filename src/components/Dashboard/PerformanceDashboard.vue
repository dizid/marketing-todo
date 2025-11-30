<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-900">Content Performance</h2>
      <p class="mt-1 text-gray-600">Track how your content performs and which profile tiers drive quality</p>
    </div>

    <!-- Overall Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="p-4 bg-white border border-gray-200 rounded-lg">
        <div class="text-sm text-gray-600">Total Content Generated</div>
        <div class="mt-2 text-3xl font-bold text-gray-900">{{ stats?.totalContentGenerated || 0 }}</div>
      </div>
      <div class="p-4 bg-white border border-gray-200 rounded-lg">
        <div class="text-sm text-gray-600">Average Rating</div>
        <div class="mt-2 flex items-baseline gap-2">
          <div class="text-3xl font-bold text-gray-900">{{ stats?.averageRating || '—' }}</div>
          <div class="text-sm text-yellow-500">★</div>
        </div>
      </div>
      <div class="p-4 bg-white border border-gray-200 rounded-lg">
        <div class="text-sm text-gray-600">Total Views</div>
        <div class="mt-2 text-3xl font-bold text-gray-900">{{ formatNumber(stats?.totalViews || 0) }}</div>
      </div>
      <div class="p-4 bg-white border border-gray-200 rounded-lg">
        <div class="text-sm text-gray-600">Conversion Rate</div>
        <div class="mt-2 text-3xl font-bold text-gray-900">{{ stats?.conversionRate || '0' }}%</div>
      </div>
    </div>

    <!-- Per-Task Breakdown -->
    <div v-if="taskStats.length > 0" class="p-6 bg-white border border-gray-200 rounded-lg">
      <h3 class="text-lg font-bold text-gray-900 mb-4">Performance by Task</h3>
      <div class="space-y-4">
        <div
          v-for="task in taskStats"
          :key="task.taskId"
          class="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h4 class="font-semibold text-gray-900">{{ task.taskTitle }}</h4>
              <div class="mt-2 grid grid-cols-4 gap-4 text-sm">
                <div>
                  <span class="text-gray-500">Generated</span>
                  <div class="font-semibold text-gray-900">{{ task.totalGenerated }}</div>
                </div>
                <div>
                  <span class="text-gray-500">Avg Rating</span>
                  <div class="font-semibold text-gray-900">{{ task.averageRating || '—' }}</div>
                </div>
                <div>
                  <span class="text-gray-500">Engagement</span>
                  <div class="font-semibold text-gray-900">{{ task.engagementRate || '0' }}%</div>
                </div>
                <div>
                  <span class="text-gray-500">Conversion</span>
                  <div class="font-semibold text-gray-900">{{ task.conversionRate || '0' }}%</div>
                </div>
              </div>
            </div>
            <button
              @click="toggleTaskDetails(task.taskId)"
              class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition"
            >
              {{ expandedTask === task.taskId ? 'Hide' : 'Show' }}
            </button>
          </div>

          <!-- Task Details -->
          <div v-if="expandedTask === task.taskId" class="mt-4 pt-4 border-t border-gray-100 space-y-4">
            <!-- Tier Impact for this task -->
            <div v-if="task.performanceByTier && Object.keys(task.performanceByTier).length > 0">
              <h5 class="text-sm font-semibold text-gray-900 mb-3">Tier Impact Analysis</h5>
              <div class="space-y-2">
                <div
                  v-for="(impact, tier) in task.performanceByTier"
                  :key="tier"
                  class="p-3 bg-gray-50 rounded flex items-center justify-between"
                >
                  <div class="flex-1">
                    <div class="text-sm font-medium text-gray-900">{{ getTierLabel(tier) }}</div>
                    <div class="text-xs text-gray-500">Used {{ impact.usageCount }} times</div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-semibold text-gray-900">{{ impact.averageRating || '—' }}★</div>
                    <div class="text-xs text-gray-500">{{ impact.averageViews }} avg views</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tier Impact Analysis -->
    <div v-if="tierImpact && Object.keys(tierImpact).length > 0" class="p-6 bg-white border border-gray-200 rounded-lg">
      <h3 class="text-lg font-bold text-gray-900 mb-4">Which Tiers Drive Quality?</h3>
      <p class="text-sm text-gray-600 mb-4">
        Analyzing correlation between profile tiers and content quality
      </p>
      <div class="space-y-4">
        <div
          v-for="(impact, tier) in sortedTierImpact"
          :key="tier"
          class="p-4 border border-gray-100 rounded-lg"
        >
          <div class="flex items-center justify-between mb-3">
            <div>
              <h4 class="font-semibold text-gray-900">{{ getTierLabel(tier) }}</h4>
              <p class="text-sm text-gray-500">Used in {{ impact.usageCount }} pieces of content</p>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-gray-900">{{ impact.averageRating || '—' }}</div>
              <div class="text-xs text-gray-500">avg rating</div>
            </div>
          </div>

          <!-- Quality metrics bar -->
          <div class="grid grid-cols-3 gap-2 text-sm">
            <div class="p-2 bg-blue-50 rounded">
              <div class="text-gray-600">Avg Views</div>
              <div class="font-semibold text-gray-900">{{ impact.averageViews }}</div>
            </div>
            <div class="p-2 bg-green-50 rounded">
              <div class="text-gray-600">Avg Engagements</div>
              <div class="font-semibold text-gray-900">{{ impact.averageEngagements }}</div>
            </div>
            <div class="p-2 bg-purple-50 rounded">
              <div class="text-gray-600">Avg Conversions</div>
              <div class="font-semibold text-gray-900">{{ impact.averageConversions }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quality Improvement Recommendations -->
    <div v-if="selectedTaskId && recommendations && recommendations.length > 0" class="p-6 bg-green-50 border border-green-200 rounded-lg">
      <h3 class="text-lg font-bold text-green-900 mb-4">Quality Improvement Opportunities</h3>
      <div class="space-y-3">
        <div
          v-for="(rec, idx) in recommendations"
          :key="idx"
          class="p-3 bg-white border border-green-200 rounded flex items-start gap-3"
        >
          <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <div>
            <div class="text-sm font-medium text-gray-900">{{ rec.message }}</div>
            <div v-if="rec.potentialImprovement" class="text-xs text-green-700 mt-1">
              Potential quality improvement: +{{ rec.potentialImprovement }}%
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- A/B Testing Integration Section -->
    <div v-if="abTests && abTests.length > 0" class="p-6 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 class="text-lg font-bold text-blue-900 mb-4">Active A/B Tests</h3>
      <div class="space-y-3">
        <div
          v-for="test in abTests"
          :key="test.id"
          class="p-4 bg-white border border-blue-200 rounded"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h4 class="font-semibold text-gray-900">{{ test.name }}</h4>
              <p class="text-sm text-gray-600 mt-1">{{ test.variants.length + 1 }} variants • {{ test.traffic.totalVisitors }} visitors</p>
            </div>
            <div class="text-right">
              <div
                :class="[
                  'inline-block px-3 py-1 rounded-full text-sm font-medium',
                  test.results.statisticallySignificant
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                ]"
              >
                {{ test.results.statisticallySignificant ? '✓ Significant' : 'Running' }}
              </div>
              <div class="text-sm text-gray-600 mt-2">
                <span v-if="test.results.pValue" class="font-medium">p-value: {{ test.results.pValue }}</span>
              </div>
            </div>
          </div>
          <div v-if="test.results.winner" class="mt-2 pt-2 border-t border-blue-100">
            <p class="text-xs text-blue-800">
              <strong>Recommended winner:</strong> {{ getVariantName(test, test.results.winner) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Benchmarking Section -->
    <div v-if="benchmarkingData" class="p-6 bg-purple-50 border border-purple-200 rounded-lg">
      <h3 class="text-lg font-bold text-purple-900 mb-4">Competitive Benchmarking</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white rounded-lg p-4 border border-purple-200 text-center">
          <div class="text-3xl font-bold text-purple-600">{{ benchmarkingData.score }}</div>
          <div class="text-sm text-gray-600 mt-1">Competitiveness Score</div>
          <div class="text-xs text-purple-700 font-medium mt-1">{{ benchmarkingData.position }}</div>
        </div>
        <div class="bg-white rounded-lg p-4 border border-purple-200 text-center">
          <div class="text-3xl font-bold text-green-600">{{ benchmarkingData.metricsAboveAverage }}</div>
          <div class="text-sm text-gray-600 mt-1">Metrics Above Average</div>
          <div class="text-xs text-gray-500 mt-1">of {{ benchmarkingData.totalMetrics }} tracked</div>
        </div>
        <div class="bg-white rounded-lg p-4 border border-purple-200 text-center">
          <div class="text-3xl font-bold text-orange-600">{{ benchmarkingData.improvementPotential }}%</div>
          <div class="text-sm text-gray-600 mt-1">Improvement Potential</div>
          <div class="text-xs text-gray-500 mt-1">if recommendations implemented</div>
        </div>
      </div>
      <div v-if="benchmarkingData.recommendations && benchmarkingData.recommendations.length > 0" class="mt-4 pt-4 border-t border-purple-200">
        <p class="text-sm font-medium text-gray-900 mb-2">Top Recommendations:</p>
        <ul class="space-y-1">
          <li
            v-for="(rec, idx) in benchmarkingData.recommendations.slice(0, 3)"
            :key="idx"
            class="text-sm text-purple-800"
          >
            • {{ rec.action.substring(0, 60) }}{{ rec.action.length > 60 ? '...' : '' }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!stats" class="p-8 text-center bg-gray-50 border border-gray-200 rounded-lg">
      <p class="text-gray-600">No content generated yet. Create content using any task to start tracking performance.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useContentPerformanceTracker } from '../../services/contentPerformanceTracker.js'
import { useTaskOrchestrator } from '../../services/taskOrchestrator.js'
import { useABTestManager } from '../../services/aBTestManager.js'
import { useBenchmarkingService } from '../../services/benchmarkingService.js'

const props = defineProps({
  taskId: {
    type: String,
    default: null
  }
})

const { getOverallStats, getTaskPerformanceStats, calculateTierImpact, getAllContent, getQualityImprovementRecommendations } = useContentPerformanceTracker()
const { getTaskMapping, getAllTaskMappings } = useTaskOrchestrator()
const { getAllTests, getTestsByTask } = useABTestManager()
const { compareMetrics, getRecommendations, getCompetitivePositioning } = useBenchmarkingService()

const stats = ref(null)
const taskStats = ref([])
const tierImpact = ref({})
const expandedTask = ref(null)
const selectedTaskId = ref(props.taskId)
const recommendations = ref([])
const abTests = ref([])
const benchmarkingData = ref(null)

// Load all data
const loadData = async () => {
  try {
    // Load overall stats
    stats.value = getOverallStats()

    // Load task performance stats
    const allTasks = getAllTaskMappings()
    const allContent = getAllContent()

    taskStats.value = allTasks
      .map(task => {
        const taskPerf = getTaskPerformanceStats(task.id)
        return taskPerf ? {
          taskId: task.id,
          taskTitle: task.title,
          ...taskPerf
        } : null
      })
      .filter(Boolean)

    // Load tier impact analysis
    if (allContent.length > 0) {
      tierImpact.value = calculateTierImpact(allContent)
    }

    // Load A/B tests
    const allTests = getAllTests()
    if (selectedTaskId.value) {
      abTests.value = getTestsByTask(selectedTaskId.value) || []
    } else {
      abTests.value = allTests || []
    }

    // Load benchmarking data
    const emailMetrics = {
      avgOpenRate: 26.5,
      avgClickRate: 2.8,
      avgConversionRate: 1.1,
      avgUnsubscribeRate: 0.4
    }
    const positioning = getCompetitivePositioning('email', emailMetrics)
    if (positioning) {
      const emailRecommendations = getRecommendations('email', emailMetrics) || []
      benchmarkingData.value = {
        score: positioning.score,
        position: positioning.position,
        metricsAboveAverage: emailRecommendations.length > 0 ? Math.max(0, 4 - emailRecommendations.length) : 3,
        totalMetrics: 4,
        improvementPotential: emailRecommendations.reduce((sum, rec) => sum + parseFloat(rec.potentialGain || 0), 0).toFixed(0),
        recommendations: emailRecommendations
      }
    }

    // Load recommendations if task selected
    if (selectedTaskId.value) {
      const recs = getQualityImprovementRecommendations(selectedTaskId.value)
      recommendations.value = recs.recommendations || []
    }
  } catch (error) {
    console.error('Error loading performance data:', error)
  }
}

const sortedTierImpact = computed(() => {
  const entries = Object.entries(tierImpact.value || {})
  return Object.fromEntries(
    entries.sort((a, b) => {
      const ratingA = parseFloat(a[1].averageRating || 0)
      const ratingB = parseFloat(b[1].averageRating || 0)
      return ratingB - ratingA
    })
  )
})

const getTierLabel = (tierName) => {
  const labels = {
    tier1_business: 'Define Your Business',
    tier2_market: 'Market & Audience',
    tier3_brand: 'Brand Voice',
    tier4_goals: 'Business Goals',
    tier5_marketing: 'Marketing Channels',
    tier6_content: 'Content Library',
    tier7_integrations: 'Integrations'
  }
  return labels[tierName] || tierName
}

const getVariantName = (test, variantId) => {
  if (variantId === 'control') {
    return test.control.name
  }
  const variant = test.variants.find(v => v.id === variantId)
  return variant ? variant.name : variantId
}

const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num)
}

const toggleTaskDetails = (taskId) => {
  expandedTask.value = expandedTask.value === taskId ? null : taskId
}

onMounted(() => {
  loadData()
})

watch(() => props.taskId, (newTaskId) => {
  selectedTaskId.value = newTaskId
  loadData()
})
</script>
