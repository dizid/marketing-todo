<template>
  <div class="space-y-6">
    <!-- Status Messages -->
    <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-sm text-red-800">{{ error }}</p>
      <button
        @click="error = ''"
        class="mt-2 text-sm text-red-600 hover:text-red-800 underline"
      >
        Dismiss
      </button>
    </div>

    <div v-if="successMessage" class="p-4 bg-green-50 border border-green-200 rounded-lg">
      <p class="text-sm text-green-800">{{ successMessage }}</p>
      <button
        @click="successMessage = ''"
        class="mt-2 text-sm text-green-600 hover:text-green-800 underline"
      >
        Dismiss
      </button>
    </div>

    <!-- Webinar Planning Settings -->
    <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <h4 class="font-semibold text-gray-900 mb-4">Webinar Planning</h4>

      <!-- Topic -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Webinar Topic</label>
        <input
          v-model="topic"
          type="text"
          placeholder="e.g., Mastering Social Media Marketing for SaaS"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
        />
      </div>

      <!-- Duration -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Webinar Duration</label>
        <select
          v-model="duration"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
        >
          <option value="30">30 minutes (Quick Session)</option>
          <option value="60">60 minutes (Standard)</option>
          <option value="90">90 minutes (Deep Dive)</option>
          <option value="120">2 hours (Workshop)</option>
        </select>
      </div>

      <!-- Audience Type -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
        <select
          v-model="audienceType"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
        >
          <option value="beginners">Beginners / New Users</option>
          <option value="intermediate">Intermediate Users</option>
          <option value="advanced">Advanced / Power Users</option>
          <option value="decision-makers">Decision Makers / Executives</option>
          <option value="technical">Technical / Developers</option>
          <option value="general">General Audience</option>
        </select>
      </div>

      <!-- Key Objectives -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Key Learning Objectives</label>
        <textarea
          v-model="objectives"
          placeholder="e.g., Learn how to create engaging content, understand analytics, implement automation..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-vertical min-h-[80px]"
        ></textarea>
      </div>

      <!-- Incentive/Giveaway -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Attendance Incentive (Optional)</label>
        <input
          v-model="incentive"
          type="text"
          placeholder="e.g., Free template download, exclusive access, discount code..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
        />
      </div>

      <!-- Webinar Format -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Format Options</label>
        <div class="grid grid-cols-2 gap-3">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="includeQA"
              type="checkbox"
              class="w-4 h-4 text-indigo-600 border-gray-300 rounded"
            />
            <span class="text-sm text-gray-700">Include Q&A</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="includeDemo"
              type="checkbox"
              class="w-4 h-4 text-indigo-600 border-gray-300 rounded"
            />
            <span class="text-sm text-gray-700">Live Demo</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="includePoll"
              type="checkbox"
              class="w-4 h-4 text-indigo-600 border-gray-300 rounded"
            />
            <span class="text-sm text-gray-700">Polls/Surveys</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="includeWorksheet"
              type="checkbox"
              class="w-4 h-4 text-indigo-600 border-gray-300 rounded"
            />
            <span class="text-sm text-gray-700">Worksheet</span>
          </label>
        </div>
      </div>

      <!-- Generate Button -->
      <button
        @click="generateWebinar"
        :disabled="isGenerating || !topic.trim()"
        class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-lg transition font-medium text-sm flex items-center justify-center gap-2"
      >
        <svg v-if="!isGenerating" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
        <svg v-else class="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ isGenerating ? 'Generating Plan...' : 'Generate with Grok AI' }}
      </button>
    </div>

    <!-- Generated Webinar Plan -->
    <div v-if="generatedPlan">
      <div class="flex justify-between items-center mb-3">
        <h4 class="font-semibold text-gray-900">Generated Webinar Plan</h4>
        <div class="flex gap-2">
          <button
            @click="copyPlan"
            class="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition"
          >
            {{ planCopied ? '✓ Copied!' : '📋 Copy' }}
          </button>
          <button
            @click="savePlan"
            :disabled="isSaving"
            class="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white rounded transition"
          >
            {{ isSaving ? '⏳' : '✓' }} Save
          </button>
        </div>
      </div>

      <div class="bg-white border border-gray-200 rounded-lg p-4">
        <textarea
          v-model="generatedPlan"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-vertical min-h-[500px] font-mono text-xs"
        ></textarea>
      </div>
    </div>

    <!-- Webinar History -->
    <div v-if="webinarHistory.length > 0">
      <h4 class="font-semibold text-gray-900 mb-3">Webinar Planning History</h4>
      <div class="space-y-2">
        <div
          v-for="(history, idx) in webinarHistory.slice(0, 5)"
          :key="idx"
          class="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm"
        >
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <p class="font-medium text-gray-900">{{ history.topic }}</p>
              <p class="text-xs text-gray-600 mt-1">
                {{ formatTimestamp(history.timestamp) }} • {{ history.duration }}min • {{ history.audience }}
              </p>
            </div>
            <button
              @click="loadPlan(idx)"
              class="text-xs text-blue-600 hover:text-blue-800 font-medium ml-2"
            >
              Load
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Additional Notes -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Webinar Strategy Notes</label>
      <textarea
        v-model="formData.notes"
        placeholder="Add notes about your webinar strategy, speaker bios, technical requirements, follow-up plans..."
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-vertical min-h-[80px]"
      ></textarea>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  taskId: String,
  taskData: Object
})

const emit = defineEmits(['save'])

// State
const formData = ref({
  notes: '',
  webinarPlans: [],
  webinarHistory: []
})

const topic = ref('')
const duration = ref('60')
const audienceType = ref('general')
const objectives = ref('')
const incentive = ref('')
const includeQA = ref(true)
const includeDemo = ref(true)
const includePoll = ref(false)
const includeWorksheet = ref(false)

const isGenerating = ref(false)
const isSaving = ref(false)
const error = ref('')
const successMessage = ref('')
const generatedPlan = ref('')
const webinarHistory = ref([])
const planCopied = ref(false)

// Load existing data
watch(
  () => props.taskData,
  (newData) => {
    if (newData && Object.keys(newData).length > 0) {
      formData.value = {
        notes: newData.notes || '',
        webinarPlans: newData.webinarPlans || [],
        webinarHistory: newData.webinarHistory || []
      }
      webinarHistory.value = newData.webinarHistory || []
    }
  },
  { immediate: true }
)

// Get app description from local storage
const appDescription = computed(() => {
  try {
    const stored = localStorage.getItem('marketing-app-data')
    if (stored) {
      const data = JSON.parse(stored)
      return data.appDescription || ''
    }
  } catch (e) {
    console.error('Error loading app description:', e)
  }
  return ''
})

// Generate webinar plan with Grok AI
const generateWebinar = async () => {
  if (!topic.value.trim()) {
    error.value = 'Please enter a webinar topic'
    return
  }

  if (!appDescription.value || appDescription.value.trim().length < 10) {
    error.value = 'Please fill in your app description first (minimum 10 characters)'
    return
  }

  isGenerating.value = true
  error.value = ''
  successMessage.value = ''
  generatedPlan.value = ''

  try {
    const formatOptions = []
    if (includeQA.value) formatOptions.push('Q&A session')
    if (includeDemo.value) formatOptions.push('Live demo')
    if (includePoll.value) formatOptions.push('Interactive polls')
    if (includeWorksheet.value) formatOptions.push('Downloadable worksheet')

    const prompt = `Generate a comprehensive webinar plan with the following specifications:

Product/Company Context: ${appDescription.value}

Webinar Details:
- Topic: "${topic.value}"
- Duration: ${duration.value} minutes
- Target Audience: ${audienceType.value}
- Learning Objectives: ${objectives.value || 'General product education'}
${incentive.value ? `- Attendance Incentive: ${incentive.value}` : ''}
- Format Elements: ${formatOptions.join(', ') || 'Standard presentation'}

Please provide a complete webinar plan including:

[WEBINAR OVERVIEW]
- Compelling title and subtitle
- Target audience description
- Key takeaways (3-5 bullet points)
- Registration page copy

[DETAILED TIMELINE]
Break down the ${duration.value} minutes into a minute-by-minute schedule:
- Welcome & Introduction (timing)
- Main content sections with specific topics (timing for each)
${includeDemo.value ? '- Live demo segment (timing)' : ''}
${includePoll.value ? '- Interactive polls (timing)' : ''}
${includeQA.value ? '- Q&A session (timing)' : ''}
- Closing & Call-to-Action (timing)

[TALKING POINTS]
For each main section, provide:
- Key messages to cover
- Example explanations or stories
- Transition statements

[SLIDE BREAKDOWN]
Suggest slide titles and content for a ${Math.ceil(parseInt(duration.value) / 3)}-slide deck:
- Opening slide
- Problem/context slides
- Solution/demo slides
- Benefits/features slides
- Social proof/case study slides
- Call-to-action slide

[ENGAGEMENT TACTICS]
- Questions to ask the audience
${includePoll.value ? '- Poll questions with answer options' : ''}
- Interactive elements throughout
- Ways to maintain energy and attention

[CALLS-TO-ACTION]
- Primary CTA for the end
- Secondary CTAs throughout
- Post-webinar follow-up strategy

[PROMOTIONAL MATERIALS]
- Email invitation copy
- Social media posts (3 variations)
- Reminder email templates

${includeWorksheet.value ? '[WORKSHEET OUTLINE]\nSections and exercises for attendee worksheet\n\n' : ''}[TECHNICAL CHECKLIST]
- Pre-webinar preparation
- Equipment/software needed
- Backup plans for technical issues

Format the response clearly with all sections above.`

    // Using Vite proxy configured in vite.config.js
    const response = await fetch('/.netlify/functions/grok-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 4000
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `API error: ${response.status}`)
    }

    const data = await response.json()
    const responseText = data.choices?.[0]?.message?.content

    if (!responseText) {
      throw new Error('No content received from AI')
    }

    generatedPlan.value = responseText

    // Add to history
    webinarHistory.value.unshift({
      timestamp: new Date().toISOString(),
      topic: topic.value,
      duration: duration.value,
      audience: audienceType.value,
      plan: responseText
    })

    successMessage.value = 'Webinar plan generated successfully!'
  } catch (err) {
    console.error('Generation error:', err)
    error.value = err.message || 'Failed to generate webinar plan. Please try again.'
  } finally {
    isGenerating.value = false
  }
}

// Copy plan to clipboard
const copyPlan = async () => {
  try {
    await navigator.clipboard.writeText(generatedPlan.value)
    planCopied.value = true
    setTimeout(() => {
      planCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Copy failed:', err)
    error.value = 'Failed to copy to clipboard'
  }
}

// Save webinar plan
const savePlan = async () => {
  isSaving.value = true

  try {
    formData.value.webinarPlans = [
      ...(formData.value.webinarPlans || []),
      {
        topic: topic.value,
        duration: duration.value,
        audience: audienceType.value,
        objectives: objectives.value,
        incentive: incentive.value,
        plan: generatedPlan.value,
        timestamp: new Date().toISOString()
      }
    ]

    formData.value.webinarHistory = webinarHistory.value

    emit('save', formData.value)

    successMessage.value = 'Webinar plan saved successfully!'
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err) {
    console.error('Save error:', err)
    error.value = 'Failed to save plan. Please try again.'
  } finally {
    isSaving.value = false
  }
}

// Load plan from history
const loadPlan = (index) => {
  const history = webinarHistory.value[index]
  generatedPlan.value = history.plan
  topic.value = history.topic
  duration.value = history.duration
  audienceType.value = history.audience
  successMessage.value = 'Webinar plan loaded from history'
}

// Format timestamp
const formatTimestamp = (isoString) => {
  try {
    const date = new Date(isoString)
    const now = new Date()
    const diffMinutes = Math.floor((now - date) / 60000)

    if (diffMinutes < 1) return 'Just now'
    if (diffMinutes < 60) return `${diffMinutes}m ago`

    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours < 24) return `${diffHours}h ago`

    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString()
  } catch (e) {
    return 'Unknown'
  }
}

// Auto-save notes
watch(
  () => formData.value.notes,
  () => {
    emit('save', formData.value)
  }
)
</script>

<style scoped>
button {
  transition: all 0.2s ease-in-out;
}

textarea {
  transition: all 0.2s ease-in-out;
}

textarea:focus {
  border-color: #e0e7ff;
}
</style>
