<template>
  <MiniAppShell
    :task-config="config"
    :task-data="taskData"
    ref="miniAppShell"
  >
    <!-- Custom content area with guides, matrix, and tools -->
    <template #content>
      <!-- Guides Section -->
      <div class="space-y-6 mt-8 pt-8 border-t border-gray-200">
        <!-- Gathering Feature Requests -->
        <div class="space-y-3">
          <h3 class="text-lg font-semibold text-gray-900">{{ config.guides.gathering.title }}</h3>
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
            <div v-for="(item, idx) in config.guides.gathering.items" :key="`gathering-${idx}`" class="text-sm text-gray-700">
              {{ item }}
            </div>
          </div>
        </div>

        <!-- Prioritization Framework -->
        <div class="space-y-3">
          <h3 class="text-lg font-semibold text-gray-900">{{ config.guides.framework.title }}</h3>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <div v-for="(item, idx) in config.guides.framework.items" :key="`framework-${idx}`" class="text-sm text-gray-700">
              {{ item }}
            </div>
          </div>
        </div>

        <!-- Building Roadmap -->
        <div class="space-y-3">
          <h3 class="text-lg font-semibold text-gray-900">{{ config.guides.roadmap.title }}</h3>
          <div class="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
            <div v-for="(item, idx) in config.guides.roadmap.items" :key="`roadmap-${idx}`" class="text-sm text-gray-700">
              {{ item }}
            </div>
          </div>
        </div>
      </div>

      <!-- Priority Matrix Explanation -->
      <div class="space-y-6 mt-8 pt-8 border-t border-gray-200">
        <div>
          <h2 class="text-xl font-bold text-gray-900">📊 {{ config.priorityMatrix.title }}</h2>
          <p class="text-sm text-gray-600 mt-1">{{ config.priorityMatrix.description }}</p>
        </div>

        <!-- Matrix Visual Grid -->
        <div class="grid grid-cols-2 gap-4">
          <div v-for="quadrant in config.priorityMatrix.quadrants" :key="quadrant.name" :style="{ backgroundColor: quadrant.color + '15', borderColor: quadrant.color }" class="border-2 rounded-lg p-4 space-y-2">
            <h4 class="font-semibold text-gray-900">{{ quadrant.name }}</h4>
            <div class="text-xs space-y-1">
              <p class="font-semibold text-gray-700">{{ quadrant.impactRange }} / {{ quadrant.effortRange }}</p>
              <p class="text-gray-600">{{ quadrant.recommendation }}</p>
              <p class="text-gray-500 italic">Examples: {{ quadrant.examples }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Evaluation Framework Templates -->
      <div class="space-y-6 mt-8 pt-8 border-t border-gray-200">
        <h2 class="text-xl font-bold text-gray-900">📋 {{ config.evaluationFramework.title }}</h2>

        <!-- Impact Scoring -->
        <div class="space-y-2 bg-white border border-gray-200 rounded-lg p-4">
          <h4 class="font-semibold text-gray-900">Impact Scoring Scale</h4>
          <div class="bg-gray-50 p-3 rounded text-sm text-gray-700 whitespace-pre-wrap font-mono text-xs max-h-40 overflow-y-auto">
            {{ config.evaluationFramework.impactScoringTemplate }}
          </div>
          <button @click="copyToClipboard(config.evaluationFramework.impactScoringTemplate)" class="text-xs text-blue-600 hover:text-blue-700">
            📋 Copy Template
          </button>
        </div>

        <!-- Effort Estimation -->
        <div class="space-y-2 bg-white border border-gray-200 rounded-lg p-4">
          <h4 class="font-semibold text-gray-900">Effort Estimation Scale</h4>
          <div class="bg-gray-50 p-3 rounded text-sm text-gray-700 whitespace-pre-wrap font-mono text-xs max-h-40 overflow-y-auto">
            {{ config.evaluationFramework.effortEstimatingTemplate }}
          </div>
          <button @click="copyToClipboard(config.evaluationFramework.effortEstimatingTemplate)" class="text-xs text-blue-600 hover:text-blue-700">
            📋 Copy Template
          </button>
        </div>

        <!-- Alignment Check -->
        <div class="space-y-2 bg-white border border-gray-200 rounded-lg p-4">
          <h4 class="font-semibold text-gray-900">Business Alignment Checklist</h4>
          <div class="bg-gray-50 p-3 rounded text-sm text-gray-700 whitespace-pre-wrap font-mono text-xs max-h-40 overflow-y-auto">
            {{ config.evaluationFramework.alignmentTemplate }}
          </div>
          <button @click="copyToClipboard(config.evaluationFramework.alignmentTemplate)" class="text-xs text-blue-600 hover:text-blue-700">
            📋 Copy Template
          </button>
        </div>
      </div>

      <!-- Tools Recommendations (Compact) -->
      <div class="space-y-3 mt-8 pt-8 border-t border-gray-200">
        <h3 class="font-semibold text-gray-900">🛠️ Recommended Tools</h3>

        <div v-for="toolCategory in config.tools" :key="toolCategory.category" class="space-y-1">
          <div class="text-xs font-semibold text-gray-600 uppercase">{{ toolCategory.category }}</div>
          <div class="flex flex-wrap gap-2">
            <a v-for="tool in toolCategory.items" :key="tool.name" :href="tool.link" target="_blank" rel="noopener" class="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs rounded transition" :title="tool.pros">
              {{ tool.name }}
            </a>
          </div>
        </div>
      </div>

      <!-- Save Prioritization Plan Button -->
      <div class="mt-8 flex gap-2">
        <button
          @click="savePlan"
          class="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
        >
          ✓ Save Prioritization Plan
        </button>
      </div>

      <!-- Saved Plans -->
      <div v-if="savedPlans.length > 0" ref="savedPlansSection" class="space-y-4 mt-8 pt-8 border-t border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">✓ Saved Prioritization Plans</h3>

        <div v-for="(plan, idx) in savedPlans" :key="idx" class="border border-gray-200 rounded-lg p-4 space-y-2 transition-all" :class="idx === lastSavedIndex ? 'bg-green-50 border-green-300 ring-2 ring-green-200' : 'hover:border-gray-300'">
          <div class="font-semibold text-gray-900">{{ plan.plan_title || 'Prioritization Plan' }}</div>
          <div class="text-sm text-gray-600 space-y-1">
            <p>📊 <strong>Features Added:</strong> {{ plan.feature_count || 0 }}</p>
            <p>🎯 <strong>Quick Wins:</strong> {{ plan.quick_wins_count || 0 }} | <strong>Major Projects:</strong> {{ plan.major_projects_count || 0 }}</p>
            <p class="text-xs text-gray-500">Saved: {{ plan.saved_at }}</p>
          </div>
          <div class="flex gap-2 pt-2">
            <button
              @click="downloadPlan(plan, idx)"
              class="flex-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm font-medium transition"
            >
              📥 Download Plan
            </button>
            <button
              @click="removePlan(idx)"
              class="flex-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded text-sm font-medium transition"
            >
              🗑️ Archive
            </button>
          </div>
        </div>
      </div>
    </template>
  </MiniAppShell>
</template>

<script setup>
import { ref, computed } from 'vue'
import MiniAppShell from './core/MiniAppShell.vue'
import { iterateFeaturesConfig } from './configs/iterateFeatures.config.js'

const props = defineProps({
  taskId: String,
  taskData: Object,
  taskConfig: Object
})

const emit = defineEmits(['save'])

// Always use the mini-app config
const config = computed(() => iterateFeaturesConfig)

// Reference to MiniAppShell component
const miniAppShell = ref(null)

// Reference to saved plans section for scrolling
const savedPlansSection = ref(null)

// Saved plans list
const savedPlans = ref(props.taskData?.savedItems || [])

// Track the last saved plan index for highlighting
const lastSavedIndex = ref(-1)

// Local task data
const taskData = ref(props.taskData || {
  formData: {},
  aiOutput: null,
  savedItems: []
})

// Features being evaluated
const features = ref([])

// Save a prioritization plan
const savePlan = () => {
  // Get formData from MiniAppShell ref
  const formData = miniAppShell.value?.formData || {}

  // Silent validation - at least one feature must be added
  // For now, we'll save the current form state as a plan
  if (!formData.feature_name) {
    return
  }

  // Add current feature to features list
  features.value.push({
    name: formData.feature_name,
    impact: formData.user_impact,
    effort: formData.implementation_effort,
    requests: formData.customer_requests || 0,
    value: formData.business_value,
    notes: formData.notes
  })

  // Count features by quadrant
  const quickWins = features.value.filter(f => f.impact === 'high' && f.effort === 'low').length
  const majorProjects = features.value.filter(f => f.impact === 'high' && f.effort === 'high').length
  const niceToHave = features.value.filter(f => f.impact === 'low' && f.effort === 'low').length
  const timeSinks = features.value.filter(f => f.impact === 'low' && f.effort === 'high').length

  const newPlan = {
    plan_title: 'Prioritization Plan',
    feature_count: features.value.length,
    quick_wins_count: quickWins,
    major_projects_count: majorProjects,
    nice_to_have_count: niceToHave,
    time_sinks_count: timeSinks,
    features: [...features.value],
    saved_at: new Date().toLocaleString()
  }

  savedPlans.value.push(newPlan)
  lastSavedIndex.value = savedPlans.value.length - 1

  // Update taskData
  const updatedData = {
    ...taskData.value,
    savedItems: savedPlans.value
  }

  taskData.value = updatedData

  // Emit save
  emit('save', updatedData)

  // Reset features list for next plan
  features.value = []

  // Scroll to saved plans section smoothly after DOM updates
  setTimeout(() => {
    if (savedPlansSection.value) {
      savedPlansSection.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, 100)

  // Clear highlight after 3 seconds
  setTimeout(() => {
    lastSavedIndex.value = -1
  }, 3000)
}

// Download plan as text
const downloadPlan = (plan, idx) => {
  const planText = `
FEATURE PRIORITIZATION PLAN
${plan.saved_at}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 PRIORITIZATION SUMMARY
Total Features: ${plan.feature_count}

Quick Wins (HIGH IMPACT, LOW EFFORT): ${plan.quick_wins_count}
  → Do these FIRST for maximum value with minimal resources

Major Projects (HIGH IMPACT, HIGH EFFORT): ${plan.major_projects_count}
  → Plan these carefully, worth the investment

Nice to Have (LOW IMPACT, LOW EFFORT): ${plan.nice_to_have_count}
  → Consider when you have spare capacity

Time Sinks (LOW IMPACT, HIGH EFFORT): ${plan.time_sinks_count}
  → AVOID or strongly reconsider

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 FEATURE DETAILS

${
  plan.features
    .map((f, i) => {
      const quadrant = getQuadrant(f.impact, f.effort)
      return `${i + 1}. ${f.name}
   Quadrant: ${quadrant}
   Impact: ${f.impact.toUpperCase()} | Effort: ${f.effort.toUpperCase()}
   Customer Requests: ${f.requests}
   Business Value: ${f.value || 'N/A'}
   Notes: ${f.notes || 'None'}
`
    })
    .join('\n')
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NEXT STEPS:
1. Start with QUICK WINS to build momentum
2. Plan MAJOR PROJECTS into quarterly roadmap
3. Batch NICE TO HAVE features as filler
4. Avoid or deprioritize TIME SINKS
5. Revisit this plan quarterly

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated at: ${new Date().toLocaleString()}
  `.trim()

  const blob = new Blob([planText], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `Prioritization-Plan-${new Date().toLocaleDateString()}.txt`
  link.click()
  URL.revokeObjectURL(url)
}

// Determine quadrant based on impact and effort
const getQuadrant = (impact, effort) => {
  if (impact === 'high' && effort === 'low') return 'Quick Wins'
  if (impact === 'high' && effort === 'high') return 'Major Projects'
  if (impact === 'low' && effort === 'low') return 'Nice to Have'
  if (impact === 'low' && effort === 'high') return 'Time Sinks'
  return 'Unknown'
}

// Copy text to clipboard (silent)
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).catch(err => {
    console.error('Failed to copy:', err)
  })
}

// Remove a saved plan
const removePlan = (idx) => {
  savedPlans.value.splice(idx, 1)

  const updatedData = {
    ...taskData.value,
    savedItems: savedPlans.value
  }

  taskData.value = updatedData
  emit('save', updatedData)
}
</script>
