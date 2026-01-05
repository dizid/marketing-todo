<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <!-- Header -->
    <div class="border-b border-slate-700 bg-slate-800/50 backdrop-blur sticky top-0 z-40">
      <ProjectHeader />
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Title Section -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">Advanced Analytics</h1>
        <p class="text-slate-400">A/B Testing, Competitive Benchmarking & Performance Analysis</p>
      </div>

      <!-- Tab Navigation -->
      <AnalyticsTabNavigation
        :active-tab="activeTab"
        @tab-changed="handleTabChange"
      />

      <!-- Tab Content -->
      <div class="mt-8 animate-fade-in">
        <!-- A/B Testing Tab -->
        <template v-if="activeTab === 'abtesting'">
          <div class="space-y-6">
            <!-- A/B Test Editor Button -->
            <div class="flex justify-end">
              <button
                @click="showTestEditor = true"
                class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg"
              >
                + Create A/B Test
              </button>
            </div>

            <!-- A/B Test Results Dashboard -->
            <ABTestResultsDashboard
              :tests="abTests"
              :is-loading="isLoadingABTests"
              @refresh="loadABTests"
              @test-updated="handleTestUpdated"
            />
          </div>
        </template>

        <!-- Benchmarking Tab -->
        <template v-else-if="activeTab === 'benchmarking'">
          <BenchmarkingDashboard
            :benchmarks="benchmarks"
            :is-loading="isLoadingBenchmarks"
            :selected-channels="selectedChannels"
            @channel-changed="handleChannelChange"
            @refresh="loadBenchmarks"
          />
        </template>

        <!-- Performance Breakdown Tab -->
        <template v-else-if="activeTab === 'performance'">
          <TierPerformanceBreakdown
            :tier-data="tierData"
            :is-loading="isLoadingTiers"
            @refresh="loadTierData"
          />
        </template>
      </div>
    </div>

    <!-- A/B Test Editor Modal -->
    <ABTestEditorModal
      v-if="showTestEditor"
      @close="showTestEditor = false"
      @test-created="handleTestCreated"
    />

    <!-- Real-time Updates Setup -->
    <div v-if="realtimeStatus" class="fixed bottom-4 right-4 bg-slate-800 border border-slate-700 rounded-lg p-4 text-sm text-slate-300">
      {{ realtimeStatus }}
    </div>
  </div>
</template>

<script setup>
/**
 * AnalyticsDashboardPage Component
 *
 * Main hub for all advanced analytics features:
 * - A/B Testing (create, run, analyze tests)
 * - Competitive Benchmarking (compare against industry standards)
 * - Performance Analysis (tier-based performance breakdown)
 *
 * Real-time updates via polling/WebSocket
 * Data persistence in localStorage
 */

import { ref, reactive, onMounted, onBeforeUnmount, computed } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import ProjectHeader from '../Project/ProjectHeader.vue'
import AnalyticsTabNavigation from './AnalyticsTabNavigation.vue'
import ABTestEditorModal from './ABTestEditorModal.vue'
import ABTestResultsDashboard from './ABTestResultsDashboard.vue'
import BenchmarkingDashboard from './BenchmarkingDashboard.vue'
import TierPerformanceBreakdown from './TierPerformanceBreakdown.vue'
import { useRealTimeUpdatesService } from '@/services/realTimeUpdatesService'

// State
const activeTab = ref('abtesting')
const showTestEditor = ref(false)
const selectedChannels = reactive({
  email: true,
  web: true,
  social: true,
  ads: true
})

// Loading states
const isLoadingABTests = ref(false)
const isLoadingBenchmarks = ref(false)
const isLoadingTiers = ref(false)

// Data states
const abTests = ref([])
const benchmarks = reactive({
  email: null,
  web: null,
  social: null,
  ads: null
})
const tierData = ref([])
const realtimeStatus = ref('')

// Stores
const projectStore = useProjectStore()

// Real-time updates service
let realTimeService = null
let unsubscribe = null

/**
 * Initialize component
 * Load initial data and setup real-time updates
 */
onMounted(async () => {
  // Load initial data
  await loadABTests()
  await loadBenchmarks()
  await loadTierData()

  // Setup real-time updates
  setupRealTimeUpdates()
})

/**
 * Setup real-time updates via polling
 * Uses localStorage-based data with polling for updates
 */
const setupRealTimeUpdates = () => {
  realTimeService = useRealTimeUpdatesService()

  // Subscribe to analytics data updates
  unsubscribe = realTimeService.subscribe(
    'analytics:dashboard',
    (updates) => {
      // Handle real-time updates
      if (updates && updates.metrics) {
        // Update tier data from analytics metrics
        tierData.value = updates.metrics
      }
      realtimeStatus.value = `Updated at ${new Date().toLocaleTimeString()}`
      setTimeout(() => (realtimeStatus.value = ''), 3000)
    },
    {
      interval: 5000 // 5-second poll interval
    }
  )
}

/**
 * Load A/B Tests
 */
const loadABTests = async () => {
  isLoadingABTests.value = true
  try {
    // Get from localStorage
    const stored = localStorage.getItem('launchpilot-ab-tests')
    abTests.value = stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading A/B tests:', error)
  } finally {
    isLoadingABTests.value = false
  }
}

/**
 * Load Benchmarking Data
 */
const loadBenchmarks = async () => {
  isLoadingBenchmarks.value = true
  try {
    // Get from localStorage
    const stored = localStorage.getItem('launchpilot-benchmarks')
    const data = stored ? JSON.parse(stored) : {
      email: null,
      web: null,
      social: null,
      ads: null
    }
    Object.assign(benchmarks, data)
  } catch (error) {
    console.error('Error loading benchmarks:', error)
  } finally {
    isLoadingBenchmarks.value = false
  }
}

/**
 * Load Tier Performance Data
 */
const loadTierData = async () => {
  isLoadingTiers.value = true
  try {
    // Get from localStorage
    const stored = localStorage.getItem('launchpilot-tier-performance')
    tierData.value = stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading tier data:', error)
  } finally {
    isLoadingTiers.value = false
  }
}

/**
 * Handle tab changes
 */
const handleTabChange = (tab) => {
  activeTab.value = tab

  // Optionally reload data when switching tabs
  if (tab === 'abtesting') {
    loadABTests()
  } else if (tab === 'benchmarking') {
    loadBenchmarks()
  } else if (tab === 'performance') {
    loadTierData()
  }
}

/**
 * Handle channel changes in benchmarking
 */
const handleChannelChange = (channel) => {
  selectedChannels[channel] = !selectedChannels[channel]
}

/**
 * Handle new test creation
 */
const handleTestCreated = async (testData) => {
  // Test will be saved by editor modal
  // Reload tests to reflect changes
  await loadABTests()
  showTestEditor.value = false
}

/**
 * Handle test updates
 */
const handleTestUpdated = async (updatedTest) => {
  // Update in our local state
  const index = abTests.value.findIndex(t => t.id === updatedTest.id)
  if (index !== -1) {
    abTests.value[index] = updatedTest
  }

  // Persist to localStorage
  localStorage.setItem('launchpilot-ab-tests', JSON.stringify(abTests.value))
}

/**
 * Cleanup on unmount
 */
onBeforeUnmount(() => {
  // Stop real-time updates
  if (unsubscribe && typeof unsubscribe === 'function') {
    unsubscribe()
  }
})

// Debug: expose data to window for inspection
if (process.env.NODE_ENV === 'development') {
  window.__analyticsDashboard = {
    abTests,
    benchmarks,
    tierData,
    activeTab
  }
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-in-out;
}
</style>
