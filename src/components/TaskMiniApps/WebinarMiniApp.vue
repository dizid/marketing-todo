<template>
  <MiniAppShell
    :task-config="config"
    :task-data="taskData"
    @save="handleSave"
    ref="miniAppShell"
  >
    <!-- Custom content area with guides and templates -->
    <template #content>
      <!-- Guides Section -->
      <div class="space-y-6 mt-8 pt-8 border-t border-gray-200">
        <!-- Pre-Webinar Checklist -->
        <div class="space-y-3">
          <h3 class="text-lg font-semibold text-gray-900">{{ config.guides.preWebinar.title }}</h3>
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
            <div v-for="(item, idx) in config.guides.preWebinar.items" :key="`pre-${idx}`" class="text-sm text-gray-700">
              {{ item }}
            </div>
          </div>
        </div>

        <!-- During Webinar Tips -->
        <div class="space-y-3">
          <h3 class="text-lg font-semibold text-gray-900">{{ config.guides.duringWebinar.title }}</h3>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <div v-for="(item, idx) in config.guides.duringWebinar.items" :key="`during-${idx}`" class="text-sm text-gray-700">
              {{ item }}
            </div>
          </div>
        </div>

        <!-- Post-Webinar Follow-Up -->
        <div class="space-y-3">
          <h3 class="text-lg font-semibold text-gray-900">{{ config.guides.postWebinar.title }}</h3>
          <div class="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
            <div v-for="(item, idx) in config.guides.postWebinar.items" :key="`post-${idx}`" class="text-sm text-gray-700">
              {{ item }}
            </div>
          </div>
        </div>
      </div>

      <!-- Templates Section -->
      <div class="space-y-6 mt-8 pt-8 border-t border-gray-200">
        <h2 class="text-xl font-bold text-gray-900">📄 Email & Script Templates</h2>

        <!-- Pre-Webinar Email -->
        <div class="space-y-2 bg-white border border-gray-200 rounded-lg p-4">
          <h4 class="font-semibold text-gray-900">Pre-Webinar Invitation Email</h4>
          <div class="bg-gray-50 p-3 rounded text-sm text-gray-700 whitespace-pre-wrap font-mono">{{ config.templates.preWebinarEmail.body }}</div>
          <button @click="copyToClipboard(config.templates.preWebinarEmail.body)" class="text-xs text-blue-600 hover:text-blue-700">
            📋 Copy Template
          </button>
        </div>

        <!-- Opening Remarks -->
        <div class="space-y-2 bg-white border border-gray-200 rounded-lg p-4">
          <h4 class="font-semibold text-gray-900">{{ config.templates.openingRemarks.title }}</h4>
          <div class="bg-gray-50 p-3 rounded text-sm text-gray-700 whitespace-pre-wrap font-mono">{{ config.templates.openingRemarks.content }}</div>
          <button @click="copyToClipboard(config.templates.openingRemarks.content)" class="text-xs text-blue-600 hover:text-blue-700">
            📋 Copy Template
          </button>
        </div>

        <!-- Q&A Prompts -->
        <div class="space-y-2 bg-white border border-gray-200 rounded-lg p-4">
          <h4 class="font-semibold text-gray-900">{{ config.templates.qaPrompts.title }}</h4>
          <div class="bg-gray-50 p-3 rounded text-sm text-gray-700 whitespace-pre-wrap font-mono">{{ config.templates.qaPrompts.content }}</div>
          <button @click="copyToClipboard(config.templates.qaPrompts.content)" class="text-xs text-blue-600 hover:text-blue-700">
            📋 Copy Template
          </button>
        </div>

        <!-- Post-Webinar Email -->
        <div class="space-y-2 bg-white border border-gray-200 rounded-lg p-4">
          <h4 class="font-semibold text-gray-900">Post-Webinar Thank You Email</h4>
          <div class="bg-gray-50 p-3 rounded text-sm text-gray-700 whitespace-pre-wrap font-mono">{{ config.templates.postWebinarEmail.body }}</div>
          <button @click="copyToClipboard(config.templates.postWebinarEmail.body)" class="text-xs text-blue-600 hover:text-blue-700">
            📋 Copy Template
          </button>
        </div>
      </div>

      <!-- Tools Recommendations (Compact) -->
      <div class="space-y-3 mt-8 pt-8 border-t border-gray-200">
        <h3 class="font-semibold text-gray-900">🛠️ Recommended Tools</h3>

        <div v-for="toolCategory in config.toolSuggestions" :key="toolCategory.category" class="space-y-1">
          <div class="text-xs font-semibold text-gray-600 uppercase">{{ toolCategory.category }}</div>
          <div class="flex flex-wrap gap-2">
            <a v-for="tool in toolCategory.tools" :key="tool.name" :href="tool.link" target="_blank" rel="noopener" class="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs rounded transition">
              {{ tool.name }}
            </a>
          </div>
        </div>
      </div>

      <!-- Save Plan Button -->
      <div class="mt-8 flex gap-2">
        <button
          @click="savePlan"
          class="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
        >
          ✓ Save Webinar Plan
        </button>
      </div>

      <!-- Saved Plans -->
      <div v-if="savedPlans.length > 0" class="space-y-4 mt-8 pt-8 border-t border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Saved Webinar Plans</h3>

        <div v-for="(plan, idx) in savedPlans" :key="idx" class="border border-gray-200 rounded-lg p-4 space-y-2">
          <div class="font-semibold text-gray-900">{{ plan.webinar_title }}</div>
          <div class="text-sm text-gray-600 space-y-1">
            <p>📅 <strong>Date:</strong> {{ plan.webinar_date }}</p>
            <p>👥 <strong>Attendees:</strong> {{ plan.expected_attendees }}</p>
            <p>⏱️ <strong>Duration:</strong> {{ plan.duration_minutes }} minutes</p>
            <p>🎯 <strong>Audience:</strong> {{ plan.target_audience }}</p>
          </div>
          <div class="flex gap-2 pt-2">
            <button
              @click="downloadPlan(plan, idx)"
              class="flex-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm font-medium transition"
            >
              📥 Download Checklist
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
import { webinarConfig } from './configs/webinar.config.js'

const props = defineProps({
  taskId: String,
  taskData: Object,
  taskConfig: Object
})

const emit = defineEmits(['save'])

// Always use the mini-app config
const config = computed(() => webinarConfig)

// Saved plans list
const savedPlans = ref(props.taskData?.savedItems || [])

// Local task data
const taskData = ref(props.taskData || {
  formData: {},
  aiOutput: null,
  savedItems: []
})

// Save a webinar plan
const savePlan = () => {
  // Get current form data
  const formData = taskData.value.formData || {}

  // Silently return if title is missing (don't show alert)
  if (!formData.webinar_title) {
    return
  }

  savedPlans.value.push({
    webinar_title: formData.webinar_title,
    target_audience: formData.target_audience,
    webinar_date: formData.webinar_date,
    duration_minutes: formData.duration_minutes,
    expected_attendees: formData.expected_attendees,
    key_topics: formData.key_topics,
    platform_choice: formData.platform_choice,
    co_hosts: formData.co_hosts,
    notes: formData.notes,
    saved_at: new Date().toLocaleString()
  })

  // Update taskData
  taskData.value = {
    ...taskData.value,
    savedItems: savedPlans.value
  }

  // Emit save event (no alert)
  handleSave(taskData.value)
}

// Download plan as text
const downloadPlan = (plan, idx) => {
  const checklist = `
WEBINAR PLAN: ${plan.webinar_title}
${plan.saved_at}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 WEBINAR DETAILS
Date & Time: ${plan.webinar_date}
Duration: ${plan.duration_minutes} minutes
Expected Attendees: ${plan.expected_attendees}
Platform: ${plan.platform_choice}

🎯 AUDIENCE
${plan.target_audience}

👥 CO-HOSTS
${plan.co_hosts || 'None specified'}

📝 KEY TOPICS
${plan.key_topics}

💡 NOTES
${plan.notes || 'None'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PRE-WEBINAR CHECKLIST (1-2 weeks before)
${webinarConfig.guides.preWebinar.items.join('\n')}

DURING WEBINAR - KEY TIPS
${webinarConfig.guides.duringWebinar.items.join('\n')}

POST-WEBINAR FOLLOW-UP
${webinarConfig.guides.postWebinar.items.join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated at: ${new Date().toLocaleString()}
  `.trim()

  // Download as text file
  const blob = new Blob([checklist], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `Webinar-Plan-${plan.webinar_title.replace(/\s+/g, '-')}.txt`
  link.click()
  URL.revokeObjectURL(url)
}

// Copy text to clipboard (silent, no alert)
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).catch(err => {
    console.error('Failed to copy:', err)
  })
}

// Remove a saved plan
const removePlan = (idx) => {
  savedPlans.value.splice(idx, 1)

  // Update taskData
  taskData.value = {
    ...taskData.value,
    savedItems: savedPlans.value
  }

  // Emit save event
  handleSave(taskData.value)
}

// Save handler
const handleSave = (data) => {
  emit('save', data)
}
</script>
