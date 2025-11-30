<template>
  <div class="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
    <!-- Header -->
    <div class="mb-6">
      <h3 class="text-lg font-bold text-gray-900">{{ taskTitle }}</h3>
      <p class="mt-1 text-sm text-gray-600">{{ description }}</p>
    </div>

    <!-- Readiness Score Section -->
    <div class="flex items-center gap-8 mb-8 pb-8 border-b border-gray-200">
      <!-- Circular Progress -->
      <div class="flex flex-col items-center">
        <div class="relative inline-flex items-center justify-center">
          <svg class="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <!-- Background circle -->
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#e5e7eb"
              stroke-width="8"
            />
            <!-- Progress circle -->
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              :stroke="readinessColor"
              stroke-width="8"
              stroke-linecap="round"
              :style="{
                strokeDasharray: `${readinessScore * 3.4} 340`,
                transition: 'stroke-dasharray 0.5s ease'
              }"
            />
          </svg>
          <!-- Center text -->
          <div class="absolute text-center">
            <div class="text-4xl font-bold" :class="textColorClass">{{ readinessScore }}%</div>
            <div class="text-xs text-gray-500 mt-1">Ready</div>
          </div>
        </div>
        <div class="text-xs text-gray-600 mt-4 text-center">
          {{ readinessLabel }}
        </div>
      </div>

      <!-- Tier Status -->
      <div class="flex-1 space-y-4">
        <!-- Required Tiers -->
        <div>
          <h4 class="text-sm font-semibold text-gray-900 mb-2">Required Tiers</h4>
          <div class="space-y-2">
            <div
              v-for="tier in requiredTiers"
              :key="tier.name"
              class="flex items-center gap-2"
            >
              <div
                class="flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center"
                :class="tier.complete
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 bg-white'"
              >
                <svg
                  v-if="tier.complete"
                  class="w-3 h-3 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-900">{{ tier.label }}</div>
                <div class="text-xs text-gray-500">{{ tier.completion }}% complete</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Optional Tiers -->
        <div>
          <h4 class="text-sm font-semibold text-gray-900 mb-2">Optional Tiers</h4>
          <div class="space-y-2">
            <div
              v-for="tier in optionalTiers"
              :key="tier.name"
              class="flex items-center gap-2"
            >
              <div
                class="flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center"
                :class="tier.complete
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-300 bg-white'"
              >
                <svg
                  v-if="tier.complete"
                  class="w-3 h-3 text-indigo-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span v-else class="text-xs text-gray-400">+</span>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-900">{{ tier.label }}</div>
                <div class="text-xs text-gray-500">{{ tier.completion }}% complete</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recommendation Section -->
    <div
      v-if="recommendation"
      class="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6"
    >
      <div class="flex gap-3">
        <div class="flex-shrink-0 mt-0.5">
          <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 100-2 1 1 0 000 2zm5 0a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="flex-1">
          <h4 class="text-sm font-semibold text-blue-900">{{ recommendation.label }}</h4>
          <p class="mt-1 text-sm text-blue-800">
            {{ recommendation.message }}
          </p>
          <div class="mt-2 text-sm text-blue-700 font-medium">
            {{ recommendation.message }}
          </div>
          <div class="mt-3 flex items-center gap-2">
            <div class="flex-1 bg-blue-200 h-2 rounded-full overflow-hidden">
              <div
                class="bg-green-500 h-full rounded-full transition-all"
                :style="{ width: `${recommendation.estimatedQualityImprovement}%` }"
              />
            </div>
            <span class="text-xs font-semibold text-blue-900">
              +{{ recommendation.estimatedQualityImprovement }}% quality
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-3">
      <button
        @click="completeTier"
        class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
      >
        Complete {{ recommendation?.label || 'Profile' }}
      </button>
      <button
        @click="viewDetails"
        class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
      >
        View Details
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useTaskOrchestrator } from '../../services/taskOrchestrator.js'

const props = defineProps({
  taskId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['complete-tier', 'view-details'])

const { calculateTierCompletion, calculateTaskReadiness, getTaskMapping, getRecommendedNextTier } = useTaskOrchestrator()

const readinessScore = ref(0)
const requiredTiers = ref([])
const optionalTiers = ref([])
const recommendation = ref(null)
const taskTitle = ref('')
const description = ref('')

// Load tier data
const loadTierData = async () => {
  try {
    const taskMapping = getTaskMapping(props.taskId)
    if (!taskMapping) return

    taskTitle.value = taskMapping.title
    description.value = 'Complete your profile tiers to unlock full potential of this task'

    // Get readiness score
    readinessScore.value = await calculateTaskReadiness(props.taskId)

    // Load required tiers
    requiredTiers.value = await Promise.all(
      (taskMapping.tiersRequired || []).map(async (tierName) => ({
        name: tierName,
        label: getTierLabel(tierName),
        completion: await calculateTierCompletion(tierName),
        complete: await calculateTierCompletion(tierName) >= 70
      }))
    )

    // Load optional tiers
    optionalTiers.value = await Promise.all(
      (taskMapping.tiersOptional || []).map(async (tierName) => ({
        name: tierName,
        label: getTierLabel(tierName),
        completion: await calculateTierCompletion(tierName),
        complete: await calculateTierCompletion(tierName) >= 70
      }))
    )

    // Get next tier recommendation
    const recommended = await getRecommendedNextTier()
    if (recommended.recommendation) {
      recommendation.value = {
        label: recommended.label,
        message: `Completing ${recommended.label} will improve this task`,
        estimatedQualityImprovement: recommended.estimatedQualityImprovement
      }
    }
  } catch (error) {
    console.error('Error loading tier data:', error)
  }
}

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

const readinessColor = computed(() => {
  if (readinessScore.value >= 75) return '#10b981' // green
  if (readinessScore.value >= 50) return '#f59e0b' // amber
  return '#ef4444' // red
})

const readinessLabel = computed(() => {
  if (readinessScore.value >= 75) return 'Ready to use!'
  if (readinessScore.value >= 50) return 'Almost ready'
  return 'Needs profile completion'
})

const textColorClass = computed(() => {
  if (readinessScore.value >= 75) return 'text-green-600'
  if (readinessScore.value >= 50) return 'text-amber-600'
  return 'text-red-600'
})

const completeTier = () => {
  if (recommendation.value) {
    emit('complete-tier', recommendation.value)
  }
}

const viewDetails = () => {
  emit('view-details', props.taskId)
}

onMounted(() => {
  loadTierData()
})
</script>
