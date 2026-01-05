<template>
  <div class="border-b border-slate-700 bg-slate-800/30 rounded-lg overflow-hidden">
    <nav class="flex space-x-0" role="tablist">
      <!-- A/B Testing Tab -->
      <button
        @click="selectTab('abtesting')"
        role="tab"
        :aria-selected="activeTab === 'abtesting'"
        :class="[
          'flex-1 px-6 py-4 text-center font-medium transition-all duration-200 border-b-2',
          activeTab === 'abtesting'
            ? 'text-blue-400 border-blue-500 bg-slate-700/20'
            : 'text-slate-400 border-transparent hover:text-slate-300 hover:bg-slate-700/10'
        ]"
      >
        <div class="flex items-center justify-center space-x-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>A/B Testing</span>
        </div>
      </button>

      <!-- Benchmarking Tab -->
      <button
        @click="selectTab('benchmarking')"
        role="tab"
        :aria-selected="activeTab === 'benchmarking'"
        :class="[
          'flex-1 px-6 py-4 text-center font-medium transition-all duration-200 border-b-2',
          activeTab === 'benchmarking'
            ? 'text-blue-400 border-blue-500 bg-slate-700/20'
            : 'text-slate-400 border-transparent hover:text-slate-300 hover:bg-slate-700/10'
        ]"
      >
        <div class="flex items-center justify-center space-x-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Benchmarking</span>
        </div>
      </button>

      <!-- Performance Tab -->
      <button
        @click="selectTab('performance')"
        role="tab"
        :aria-selected="activeTab === 'performance'"
        :class="[
          'flex-1 px-6 py-4 text-center font-medium transition-all duration-200 border-b-2',
          activeTab === 'performance'
            ? 'text-blue-400 border-blue-500 bg-slate-700/20'
            : 'text-slate-400 border-transparent hover:text-slate-300 hover:bg-slate-700/10'
        ]"
      >
        <div class="flex items-center justify-center space-x-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          <span>Performance</span>
        </div>
      </button>
    </nav>
  </div>
</template>

<script setup>
/**
 * AnalyticsTabNavigation Component
 *
 * Tab navigation for switching between analytics sections:
 * - A/B Testing
 * - Competitive Benchmarking
 * - Tier Performance Analysis
 */

defineProps({
  activeTab: {
    type: String,
    default: 'abtesting',
    validator: (value) => ['abtesting', 'benchmarking', 'performance'].includes(value)
  }
})

const emit = defineEmits(['tab-changed'])

const selectTab = (tab) => {
  emit('tab-changed', tab)
}
</script>

<style scoped>
button:focus {
  outline: none;
}

button:focus-visible {
  box-shadow: inset 0 0 0 2px rgba(59, 130, 246, 0.5);
}
</style>
