<template>
  <div v-if="recommendation && !dismissed" class="mb-6">
    <div class="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg shadow-sm">
      <div class="flex items-start justify-between gap-4">
        <div class="flex items-start gap-3 flex-1">
          <!-- Icon -->
          <div class="flex-shrink-0 mt-1">
            <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>

          <!-- Content -->
          <div class="flex-1">
            <h3 class="text-sm font-bold text-indigo-900">
              Level Up Your Content Quality
            </h3>
            <p class="mt-1 text-sm text-indigo-800">
              {{ recommendation.message }}
            </p>

            <!-- Quality Impact Visualizer -->
            <div class="mt-3 space-y-2">
              <div class="flex items-center gap-3 text-sm">
                <div class="flex-1 bg-indigo-200 h-2 rounded-full overflow-hidden">
                  <div
                    class="bg-indigo-600 h-full rounded-full transition-all"
                    :style="{ width: '60%' }"
                  />
                </div>
                <span class="font-semibold text-indigo-900">Current</span>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <div class="flex-1 bg-green-200 h-2 rounded-full overflow-hidden">
                  <div
                    class="bg-green-600 h-full rounded-full transition-all"
                    :style="{ width: improvement + '%' }"
                  />
                </div>
                <span class="font-semibold text-green-900">+{{ recommendation.estimatedQualityImprovement }}%</span>
              </div>
            </div>

            <!-- Tasks affected -->
            <div class="mt-3 text-xs text-indigo-700">
              <strong>{{ recommendation.tasksAffected }}</strong> {{ recommendation.tasksAffected === 1 ? 'task' : 'tasks' }} will improve
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-2 flex-shrink-0">
          <button
            @click="completeTier"
            class="px-4 py-2 bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700 transition whitespace-nowrap"
          >
            Complete {{ recommendation.label }}
          </button>
          <button
            @click="dismiss"
            class="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-100 rounded transition"
            title="Dismiss"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTaskOrchestrator } from '../../services/taskOrchestrator.js'

const emit = defineEmits(['complete-tier', 'dismiss'])

const { getRecommendedNextTier } = useTaskOrchestrator()

const recommendation = ref(null)
const dismissed = ref(false)

const improvement = ref(0)

const loadRecommendation = async () => {
  try {
    const rec = await getRecommendedNextTier()
    if (rec.recommendation) {
      recommendation.value = {
        label: rec.label,
        message: `Completing "${rec.label}" will improve ${rec.tasksAffected} task${rec.tasksAffected !== 1 ? 's' : ''} by an average of ${rec.estimatedQualityImprovement}%`,
        estimatedQualityImprovement: rec.estimatedQualityImprovement,
        tasksAffected: rec.tasksAffected,
        tierName: rec.recommendation,
        completion: rec.completion
      }
      // Animate improvement bar
      setTimeout(() => {
        improvement.value = 60 + rec.estimatedQualityImprovement
      }, 100)
    }
  } catch (error) {
    console.error('Error loading recommendation:', error)
  }
}

const completeTier = () => {
  if (recommendation.value) {
    emit('complete-tier', recommendation.value)
  }
}

const dismiss = () => {
  dismissed.value = true
  emit('dismiss')
}

onMounted(() => {
  loadRecommendation()
})
</script>
