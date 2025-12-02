<template>
  <MiniAppShell
    :task-config="config"
    :task-data="taskData"
    ref="miniAppShell"
  >
    <!-- Custom content area -->
    <template #content>
      <!-- Guides Section -->
      <div class="space-y-6 mt-8 pt-8 border-t border-gray-200">
        <!-- Pre-Collection Checklist -->
        <div class="space-y-3">
          <h3 class="text-lg font-semibold text-gray-900">{{ config.guides.preCollection.title }}</h3>
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
            <div v-for="(item, idx) in config.guides.preCollection.items" :key="`pre-${idx}`" class="text-sm text-gray-700">
              {{ item }}
            </div>
          </div>
        </div>

        <!-- During Collection -->
        <div class="space-y-3">
          <h3 class="text-lg font-semibold text-gray-900">{{ config.guides.duringCollection.title }}</h3>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <div v-for="(item, idx) in config.guides.duringCollection.items" :key="`during-${idx}`" class="text-sm text-gray-700">
              {{ item }}
            </div>
          </div>
        </div>

        <!-- Analysis -->
        <div class="space-y-3">
          <h3 class="text-lg font-semibold text-gray-900">{{ config.guides.analysis.title }}</h3>
          <div class="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
            <div v-for="(item, idx) in config.guides.analysis.items" :key="`analysis-${idx}`" class="text-sm text-gray-700">
              {{ item }}
            </div>
          </div>
        </div>
      </div>

      <!-- Survey Templates Section -->
      <div class="space-y-6 mt-8 pt-8 border-t border-gray-200">
        <h2 class="text-xl font-bold text-gray-900">📝 Survey Templates</h2>

        <div v-for="(template, key) in config.templates" :key="key" class="space-y-2 bg-white border border-gray-200 rounded-lg p-4">
          <h4 class="font-semibold text-gray-900">{{ template.title }}</h4>
          <div class="bg-gray-50 p-3 rounded text-sm text-gray-700 whitespace-pre-wrap font-mono text-xs max-h-48 overflow-y-auto">
            {{ template.questions }}
          </div>
          <button @click="copyToClipboard(template.questions)" class="text-xs text-blue-600 hover:text-blue-700">
            📋 Copy Template
          </button>
        </div>
      </div>

      <!-- Distribution Strategies -->
      <div class="space-y-6 mt-8 pt-8 border-t border-gray-200">
        <h2 class="text-xl font-bold text-gray-900">📢 Distribution Strategies</h2>

        <div v-for="strategy in config.distributionStrategies" :key="strategy.channel" class="space-y-2 bg-white border border-gray-200 rounded-lg p-4">
          <div class="flex items-start justify-between">
            <div>
              <h4 class="font-semibold text-gray-900">{{ strategy.channel }}</h4>
              <div class="text-xs text-gray-600 mt-1 space-y-1">
                <p>Effort: <span class="font-medium">{{ strategy.effort }}</span> | Reach: <span class="font-medium">{{ strategy.reach }}</span></p>
                <p><strong>Pros:</strong> {{ strategy.pros }}</p>
                <p><strong>Cons:</strong> {{ strategy.cons }}</p>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 p-2 rounded text-xs text-gray-700 whitespace-pre-wrap font-mono">{{ strategy.template }}</div>
          <button @click="copyToClipboard(strategy.template)" class="text-xs text-blue-600 hover:text-blue-700">
            📋 Copy Template
          </button>
        </div>
      </div>

      <!-- Tools (Compact) -->
      <div class="space-y-3 mt-8 pt-8 border-t border-gray-200">
        <h3 class="font-semibold text-gray-900">🛠️ Recommended Tools</h3>

        <div v-for="toolGroup in config.tools" :key="toolGroup.category" class="space-y-1">
          <div class="text-xs font-semibold text-gray-600 uppercase">{{ toolGroup.category }}</div>
          <div class="flex flex-wrap gap-2">
            <a v-for="tool in toolGroup.items" :key="tool.name" :href="tool.link" target="_blank" rel="noopener" class="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs rounded transition" :title="tool.pros">
              {{ tool.name }}
            </a>
          </div>
        </div>
      </div>

      <!-- Tool Setup Tutorials -->
      <div class="space-y-6 mt-8 pt-8 border-t border-gray-200">
        <h2 class="text-xl font-bold text-gray-900">📚 Tool Setup Tutorials</h2>
        <p class="text-sm text-gray-600">Step-by-step guides to get started with popular feedback collection tools</p>

        <div v-for="tutorial in config.toolTutorials" :key="tutorial.tool" class="border border-gray-200 rounded-lg overflow-hidden">
          <!-- Tutorial Header -->
          <button
            @click="toggleTutorial(tutorial.tool)"
            class="w-full px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition flex items-center justify-between text-left"
          >
            <div class="flex-1">
              <div class="font-semibold text-gray-900 text-base">{{ tutorial.tool }}</div>
              <div class="text-sm text-gray-600 mt-1">{{ tutorial.tagline }}</div>
              <div class="flex gap-3 mt-2 text-xs text-gray-500">
                <span class="flex items-center gap-1">
                  <span class="font-medium">Difficulty:</span> {{ tutorial.difficulty }}
                </span>
                <span class="flex items-center gap-1">
                  <span class="font-medium">Setup time:</span> {{ tutorial.timeToSetup }}
                </span>
              </div>
            </div>
            <div class="ml-4 text-gray-400 text-xl">
              {{ expandedTutorials[tutorial.tool] ? '−' : '+' }}
            </div>
          </button>

          <!-- Tutorial Content (Expandable) -->
          <div v-show="expandedTutorials[tutorial.tool]" class="p-4 bg-white space-y-4">
            <!-- Steps -->
            <div class="space-y-3">
              <div v-for="(step, idx) in tutorial.steps" :key="idx" class="flex gap-3">
                <div class="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                  {{ idx + 1 }}
                </div>
                <div class="flex-1 pt-0.5">
                  <div class="font-semibold text-gray-900 text-sm">{{ step.title }}</div>
                  <div class="text-sm text-gray-600 mt-1">{{ step.description }}</div>
                </div>
              </div>
            </div>

            <!-- Pro Tips -->
            <div v-if="tutorial.proTips && tutorial.proTips.length > 0" class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 space-y-2">
              <div class="font-semibold text-yellow-900 text-sm flex items-center gap-2">
                💡 Pro Tips
              </div>
              <ul class="space-y-1.5 text-sm text-yellow-900">
                <li v-for="(tip, idx) in tutorial.proTips" :key="idx" class="flex gap-2">
                  <span class="text-yellow-600">•</span>
                  <span>{{ tip }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Save Collection Plan Button -->
      <div class="mt-8 flex gap-2">
        <button
          @click="savePlan"
          class="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
        >
          ✓ Save Feedback Plan
        </button>
      </div>

      <!-- Saved Plans -->
      <div v-if="savedPlans.length > 0" ref="savedPlansSection" class="space-y-4 mt-8 pt-8 border-t border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">✓ Saved Feedback Plans</h3>

        <div v-for="(plan, idx) in savedPlans" :key="idx" class="border border-gray-200 rounded-lg p-4 space-y-2 transition-all" :class="idx === lastSavedIndex ? 'bg-green-50 border-green-300 ring-2 ring-green-200' : 'hover:border-gray-300'">
          <div class="font-semibold text-gray-900">{{ plan.research_goal }}</div>
          <div class="text-sm text-gray-600 space-y-1">
            <p>🎯 <strong>Survey Type:</strong> {{ plan.survey_type }}</p>
            <p>👥 <strong>Target Responses:</strong> {{ plan.target_responses }}</p>
            <p>📅 <strong>Timeline:</strong> {{ plan.timeline }}</p>
            <p>📢 <strong>Channels:</strong> {{ plan.distribution_channels }}</p>
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
import { feedbackConfig } from './configs/feedback.config.js'

const props = defineProps({
  taskId: String,
  taskData: Object,
  taskConfig: Object
})

const emit = defineEmits(['save'])

// Always use the mini-app config
const config = computed(() => feedbackConfig)

// Reference to MiniAppShell component
const miniAppShell = ref(null)

// Reference to saved plans section for scrolling
const savedPlansSection = ref(null)

// Saved plans
const savedPlans = ref(props.taskData?.savedItems || [])

// Track the last saved plan index for highlighting
const lastSavedIndex = ref(-1)

// Expanded tutorials state (for accordion)
const expandedTutorials = ref({})

// Toggle tutorial expansion
const toggleTutorial = (toolName) => {
  expandedTutorials.value[toolName] = !expandedTutorials.value[toolName]
}

// Local task data - this gets updated by MiniAppShell via @save
const taskData = ref(props.taskData || {
  formData: {},
  aiOutput: null,
  savedItems: []
})

// Save feedback collection plan
const savePlan = () => {
  // Get formData from MiniAppShell ref (where the form data actually lives)
  const formData = miniAppShell.value?.formData || {}

  // Silent validation
  if (!formData.research_goal) {
    return
  }

  const newPlan = {
    research_goal: formData.research_goal,
    target_audience: formData.target_audience,
    survey_type: formData.survey_type,
    target_responses: formData.target_responses,
    timeline: formData.timeline,
    distribution_channels: formData.distribution_channels,
    budget: formData.budget,
    notes: formData.notes,
    saved_at: new Date().toLocaleString()
  }

  savedPlans.value.push(newPlan)
  lastSavedIndex.value = savedPlans.value.length - 1

  // Update taskData with savedItems
  const updatedData = {
    ...taskData.value,
    savedItems: savedPlans.value
  }

  taskData.value = updatedData

  // Emit save
  emit('save', updatedData)

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
FEEDBACK COLLECTION PLAN
${plan.saved_at}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 RESEARCH GOAL
${plan.research_goal}

👥 TARGET AUDIENCE
${plan.target_audience}

📊 SURVEY TYPE
${plan.survey_type}

📈 TARGET RESPONSES
${plan.target_responses} responses

📅 TIMELINE
${plan.timeline}

📢 DISTRIBUTION CHANNELS
${plan.distribution_channels}

💰 INCENTIVES BUDGET
${plan.budget}

💡 NOTES
${plan.notes || 'None'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PRE-COLLECTION CHECKLIST
${feedbackConfig.guides.preCollection.items.join('\n')}

DURING DISTRIBUTION
${feedbackConfig.guides.duringCollection.items.join('\n')}

AFTER COLLECTION - ANALYSIS
${feedbackConfig.guides.analysis.items.join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated at: ${new Date().toLocaleString()}
  `.trim()

  const blob = new Blob([planText], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `Feedback-Plan-${plan.research_goal.slice(0, 30).replace(/\s+/g, '-')}.txt`
  link.click()
  URL.revokeObjectURL(url)
}

// Copy to clipboard (silent)
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).catch(err => {
    console.error('Failed to copy:', err)
  })
}

// Remove plan
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
