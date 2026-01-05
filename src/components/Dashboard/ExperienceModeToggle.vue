<template>
  <!-- Only render if we have valid project data -->
  <div v-if="isReady" class="card p-4 mb-6">
    <div class="flex items-center justify-between">
      <!-- Left side: Label and description -->
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-gray-300">Experience Mode</span>
          <span
            v-if="currentLevel === 'beginner'"
            class="px-2 py-0.5 text-xs font-medium rounded-full bg-green-500/20 text-green-400"
          >
            {{ taskCounts.beginner?.taskCount || 0 }} tasks
          </span>
          <span
            v-else-if="currentLevel === 'intermediate'"
            class="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-500/20 text-blue-400"
          >
            {{ taskCounts.intermediate?.taskCount || 0 }} tasks
          </span>
        </div>
        <p class="text-xs text-gray-500 mt-1">
          {{ levelDescription }}
        </p>
      </div>

      <!-- Right side: Toggle buttons -->
      <div class="flex rounded-lg bg-gray-800 p-1">
        <button
          @click="setLevel('beginner')"
          :class="[
            'px-4 py-2 text-sm font-medium rounded-md transition-all duration-200',
            currentLevel === 'beginner'
              ? 'bg-green-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          ]"
        >
          Beginner
        </button>
        <button
          @click="setLevel('intermediate')"
          :class="[
            'px-4 py-2 text-sm font-medium rounded-md transition-all duration-200',
            currentLevel === 'intermediate'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          ]"
        >
          Intermediate
        </button>
        <!-- Advanced coming soon -->
        <button
          disabled
          class="px-4 py-2 text-sm font-medium rounded-md text-gray-600 cursor-not-allowed"
          title="Coming soon"
        >
          Advanced
        </button>
      </div>
    </div>

    <!-- Level change feedback -->
    <transition name="fade">
      <div
        v-if="showFeedback"
        class="mt-3 p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20"
      >
        <p class="text-sm text-indigo-300">
          <span v-if="currentLevel === 'beginner'">
            Beginner mode focuses on {{ taskCounts.beginner?.taskCount || 0 }} essential tasks across 3 phases.
            Perfect for getting started with marketing fundamentals.
          </span>
          <span v-else>
            Intermediate mode unlocks {{ taskCounts.intermediate?.taskCount || 0 }} tasks including Phase 4 (Optimization).
            Includes analytics, A/B testing, and advanced strategies.
          </span>
        </p>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { getTaskCountsByExperienceLevel } from '@/services/taskRecommendationEngine'

const projectStore = useProjectStore()

// State
const taskCounts = ref({})
const showFeedback = ref(false)
const isChanging = ref(false)

// Computed - Only render if we have valid project settings and no critical errors
const isReady = computed(() => {
  return projectStore.currentProject &&
         projectStore.currentProjectSettings &&
         !projectStore.isLoading
})

const currentLevel = computed(() => projectStore.experienceLevel)

const levelDescription = computed(() => {
  const descriptions = {
    beginner: 'Essential tasks for those new to sales & marketing (Phases 1-3)',
    intermediate: 'Full toolkit with analytics & optimization (Phases 1-4)',
    advanced: 'Expert-level optimization and scaling (coming soon)'
  }
  return descriptions[currentLevel.value] || descriptions.beginner
})

// Methods
const setLevel = async (level) => {
  if (level === currentLevel.value || isChanging.value) return

  isChanging.value = true
  try {
    await projectStore.setExperienceLevel(level)

    // Show feedback briefly
    showFeedback.value = true
    setTimeout(() => {
      showFeedback.value = false
    }, 5000)
  } catch (error) {
    console.error('Failed to set experience level:', error)
  } finally {
    isChanging.value = false
  }
}

const loadTaskCounts = () => {
  try {
    const productType = projectStore.currentProjectSettings?.productType
    taskCounts.value = getTaskCountsByExperienceLevel(productType) || {}
  } catch (err) {
    console.warn('Failed to load task counts:', err)
    taskCounts.value = {}
  }
}

// Lifecycle
onMounted(() => {
  loadTaskCounts()
})

// Watch for project changes to reload counts
watch(
  () => projectStore.currentProjectSettings?.productType,
  () => loadTaskCounts(),
  { immediate: true }
)
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
