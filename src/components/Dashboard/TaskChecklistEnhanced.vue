<template>
  <div class="space-y-4">
    <!-- Tier Recommendation Banner (always shown at top) -->
    <TierRecommendationBanner
      @complete-tier="handleCompleteTier"
      @dismiss="handleDismiss"
    />

    <!-- Task Readiness Summary -->
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div class="p-4 bg-white border border-gray-200 rounded-lg">
        <div class="text-sm text-gray-600">Ready Now</div>
        <div class="mt-2 text-3xl font-bold text-green-600">{{ readinessSummary.readyNow }}</div>
        <div class="text-xs text-gray-500 mt-1">75%+ readiness</div>
      </div>
      <div class="p-4 bg-white border border-gray-200 rounded-lg">
        <div class="text-sm text-gray-600">Almost Ready</div>
        <div class="mt-2 text-3xl font-bold text-amber-600">{{ readinessSummary.almostReady }}</div>
        <div class="text-xs text-gray-500 mt-1">50-75% readiness</div>
      </div>
      <div class="p-4 bg-white border border-gray-200 rounded-lg">
        <div class="text-sm text-gray-600">Needs Work</div>
        <div class="mt-2 text-3xl font-bold text-gray-600">{{ readinessSummary.needsWork }}</div>
        <div class="text-xs text-gray-500 mt-1">&lt;50% readiness</div>
      </div>
    </div>

    <!-- Original task list with readiness overlays -->
    <ChecklistCategory
      v-for="category in filteredCategories"
      :key="category.name"
      :category="category"
      :tasks="projectTasks"
      @task-checked="$emit('task-checked', $event)"
      @task-removed="$emit('task-removed', $event)"
      @task-opened="$emit('task-opened', $event)"
      @show-add-tasks="$emit('show-add-tasks', $event)"
    >
      <!-- Use scoped slot to inject readiness badges if available -->
    </ChecklistCategory>

    <!-- Readiness Cards for Quick Access -->
    <div v-if="showReadinessCards" class="mt-8 space-y-4">
      <h3 class="text-lg font-bold text-gray-900">Task Readiness Details</h3>

      <div v-if="readinessByTask && readinessByTask.length > 0" class="space-y-3">
        <div
          v-for="task in readinessByTask"
          :key="task.id"
          class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
        >
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-semibold text-gray-900">{{ task.title }}</h4>
            <div
              class="px-3 py-1 rounded text-sm font-medium"
              :class="getReadinessBadgeClass(task.readinessScore)"
            >
              {{ task.readinessScore }}%
            </div>
          </div>

          <!-- Progress bar -->
          <div class="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-2">
            <div
              class="h-full transition-all"
              :class="getProgressBarColor(task.readinessScore)"
              :style="{ width: task.readinessScore + '%' }"
            />
          </div>

          <!-- Tier status -->
          <div class="text-sm text-gray-600">
            <span v-if="task.readinessScore >= 75" class="text-green-700">✓ Ready to use</span>
            <span v-else-if="task.readinessScore >= 50" class="text-amber-700">⚠ Almost ready - complete {{ task.nextTier }}</span>
            <span v-else class="text-gray-700">• Needs profile completion</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ChecklistCategory from '../ChecklistCategory.vue'
import TierRecommendationBanner from './TierRecommendationBanner.vue'
import { useTaskOrchestrator } from '../../services/taskOrchestrator.js'

const props = defineProps({
  filteredCategories: {
    type: Array,
    required: true
  },
  projectTasks: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['task-checked', 'task-removed', 'task-opened', 'show-add-tasks'])

const { getSuggestedTasks, getAllTasksReadiness } = useTaskOrchestrator()

const readinessSummary = ref({ readyNow: 0, almostReady: 0, needsWork: 0 })
const readinessByTask = ref([])
const showReadinessCards = ref(false)

const loadReadinessData = async () => {
  try {
    const suggested = await getSuggestedTasks()

    // Count readiness categories
    readinessSummary.value = {
      readyNow: suggested.readyNow.length,
      almostReady: suggested.almostReady.length,
      needsWork: suggested.needsWork.length
    }

    // Get all tasks readiness
    const allReadiness = await getAllTasksReadiness()
    const taskIds = Object.keys(allReadiness)

    readinessByTask.value = taskIds.map(taskId => {
      const task = allReadiness[taskId]
      return {
        id: taskId,
        title: task.title,
        readinessScore: task.readinessScore,
        nextTier: getNextTierLabel(task.tiersRequired)
      }
    }).sort((a, b) => b.readinessScore - a.readinessScore)

    showReadinessCards.value = readinessByTask.value.length > 0
  } catch (error) {
    console.error('Error loading readiness data:', error)
  }
}

const getReadinessBadgeClass = (score) => {
  if (score >= 75) return 'bg-green-100 text-green-800'
  if (score >= 50) return 'bg-amber-100 text-amber-800'
  return 'bg-gray-100 text-gray-800'
}

const getProgressBarColor = (score) => {
  if (score >= 75) return 'bg-green-500'
  if (score >= 50) return 'bg-amber-500'
  return 'bg-gray-500'
}

const getNextTierLabel = (tiers) => {
  if (!tiers || tiers.length === 0) return 'more tiers'
  const tierLabels = {
    tier1_business: 'Tier 1',
    tier2_market: 'Tier 2',
    tier3_brand: 'Tier 3',
    tier4_goals: 'Tier 4',
    tier5_marketing: 'Tier 5'
  }
  return tierLabels[tiers[0]] || 'next tier'
}

const handleCompleteTier = (tierData) => {
  emit('complete-tier', tierData)
}

const handleDismiss = () => {
  // Banner was dismissed
}

onMounted(() => {
  loadReadinessData()
})
</script>
