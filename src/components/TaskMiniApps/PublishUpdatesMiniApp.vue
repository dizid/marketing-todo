<template>
  <MiniAppShell
    :task-config="config"
    :task-data="taskData"
    ref="miniAppShell"
  >
    <!-- Custom content area with guides and templates -->
    <template #content>
      <!-- Guides Section -->
      <div class="space-y-6 mt-8 pt-8 border-t border-gray-200">
        <!-- Pre-Launch Checklist -->
        <div class="space-y-3">
          <h3 class="text-lg font-semibold text-gray-900">{{ config.guides.preLaunch.title }}</h3>
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
            <div v-for="(item, idx) in config.guides.preLaunch.items" :key="`pre-${idx}`" class="text-sm text-gray-700">
              {{ item }}
            </div>
          </div>
        </div>

        <!-- During Launch -->
        <div class="space-y-3">
          <h3 class="text-lg font-semibold text-gray-900">{{ config.guides.duringLaunch.title }}</h3>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <div v-for="(item, idx) in config.guides.duringLaunch.items" :key="`during-${idx}`" class="text-sm text-gray-700">
              {{ item }}
            </div>
          </div>
        </div>

        <!-- Post-Launch -->
        <div class="space-y-3">
          <h3 class="text-lg font-semibold text-gray-900">{{ config.guides.postLaunch.title }}</h3>
          <div class="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
            <div v-for="(item, idx) in config.guides.postLaunch.items" :key="`post-${idx}`" class="text-sm text-gray-700">
              {{ item }}
            </div>
          </div>
        </div>
      </div>

      <!-- Templates Section -->
      <div class="space-y-6 mt-8 pt-8 border-t border-gray-200">
        <h2 class="text-xl font-bold text-gray-900">📝 Announcement Templates</h2>

        <div v-for="(template, key) in config.templates" :key="key" class="space-y-2 bg-white border border-gray-200 rounded-lg p-4">
          <h4 class="font-semibold text-gray-900">{{ template.title }}</h4>
          <div class="bg-gray-50 p-3 rounded text-sm text-gray-700 whitespace-pre-wrap font-mono text-xs max-h-48 overflow-y-auto">
            {{ template.content }}
          </div>
          <button @click="copyToClipboard(template.content)" class="text-xs text-blue-600 hover:text-blue-700">
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

      <!-- Save Launch Plan Button -->
      <div class="mt-8 flex gap-2">
        <button
          @click="savePlan"
          class="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
        >
          ✓ Save Launch Plan
        </button>
      </div>

      <!-- Saved Plans -->
      <div v-if="savedPlans.length > 0" ref="savedPlansSection" class="space-y-4 mt-8 pt-8 border-t border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">✓ Saved Launch Plans</h3>

        <div v-for="(plan, idx) in savedPlans" :key="idx" class="border border-gray-200 rounded-lg p-4 space-y-2 transition-all" :class="idx === lastSavedIndex ? 'bg-green-50 border-green-300 ring-2 ring-green-200' : 'hover:border-gray-300'">
          <div class="font-semibold text-gray-900">{{ plan.update_title }}</div>
          <div class="text-sm text-gray-600 space-y-1">
            <p>📅 <strong>Release Date:</strong> {{ plan.release_date || 'Not specified' }}</p>
            <p>📢 <strong>Channels:</strong> {{ plan.target_channels }}</p>
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
import { publishUpdatesConfig } from './configs/publishUpdates.config.js'

const props = defineProps({
  taskId: String,
  taskData: Object,
  taskConfig: Object
})

const emit = defineEmits(['save'])

// Always use the mini-app config
const config = computed(() => publishUpdatesConfig)

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

// Save a launch plan
const savePlan = () => {
  // Get formData from MiniAppShell ref (where the form data actually lives)
  const formData = miniAppShell.value?.formData || {}

  // Silent validation
  if (!formData.update_title) {
    return
  }

  const newPlan = {
    update_title: formData.update_title,
    key_features: formData.key_features,
    release_date: formData.release_date,
    target_channels: formData.target_channels,
    additional_notes: formData.additional_notes,
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
PRODUCT UPDATE LAUNCH PLAN
${plan.saved_at}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 UPDATE TITLE
${plan.update_title}

📌 KEY FEATURES / CHANGES
${plan.key_features}

📅 RELEASE DATE
${plan.release_date || 'Not specified'}

📢 TARGET CHANNELS
${plan.target_channels}

💡 ADDITIONAL NOTES
${plan.additional_notes || 'None'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PRE-LAUNCH CHECKLIST
${publishUpdatesConfig.guides.preLaunch.items.join('\n')}

DURING LAUNCH - DISTRIBUTION
${publishUpdatesConfig.guides.duringLaunch.items.join('\n')}

POST-LAUNCH - FOLLOW-UP
${publishUpdatesConfig.guides.postLaunch.items.join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated at: ${new Date().toLocaleString()}
  `.trim()

  const blob = new Blob([planText], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `Launch-Plan-${plan.update_title.slice(0, 30).replace(/\s+/g, '-')}.txt`
  link.click()
  URL.revokeObjectURL(url)
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
