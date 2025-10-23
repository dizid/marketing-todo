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

    <!-- Outreach Settings -->
    <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <h4 class="font-semibold text-gray-900 mb-4">Outreach Template Settings</h4>

      <!-- Outreach Goal -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Outreach Goal</label>
        <select
          v-model="outreachGoal"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
        >
          <option value="partnership">Partnership / Collaboration</option>
          <option value="media">Media / Press Coverage</option>
          <option value="research">User Research / Feedback</option>
          <option value="sales">Sales / Demo Request</option>
          <option value="influencer">Influencer Outreach</option>
          <option value="investor">Investor Outreach</option>
          <option value="affiliate">Affiliate Partnership</option>
        </select>
      </div>

      <!-- Recipient Type -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Recipient Type / Role</label>
        <input
          v-model="recipientType"
          type="text"
          placeholder="e.g., Marketing Director, Tech Blogger, Product Manager..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
        />
      </div>

      <!-- Context / Personalization -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Context / Personalization Details</label>
        <textarea
          v-model="context"
          placeholder="e.g., Their company, recent article they wrote, mutual connection, specific interest area..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-vertical min-h-[80px]"
        ></textarea>
      </div>

      <!-- Tone Selection -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Communication Tone</label>
        <select
          v-model="tone"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
        >
          <option value="formal">Formal & Professional</option>
          <option value="friendly">Friendly & Approachable</option>
          <option value="direct">Direct & To-the-Point</option>
          <option value="enthusiastic">Enthusiastic & Energetic</option>
          <option value="humble">Humble & Respectful</option>
        </select>
      </div>

      <!-- Message Type -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Message Type</label>
        <select
          v-model="messageType"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
        >
          <option value="email">Email</option>
          <option value="linkedin">LinkedIn DM</option>
          <option value="twitter">Twitter/X DM</option>
          <option value="cold">Cold Email</option>
        </select>
      </div>

      <!-- Generate Button -->
      <button
        @click="generateOutreach"
        :disabled="isGenerating || !recipientType.trim()"
        class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-lg transition font-medium text-sm flex items-center justify-center gap-2"
      >
        <svg v-if="!isGenerating" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
        <svg v-else class="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ isGenerating ? 'Generating Template...' : 'Generate with Grok AI' }}
      </button>
    </div>

    <!-- Generated Template -->
    <div v-if="generatedTemplate">
      <div class="flex justify-between items-center mb-3">
        <h4 class="font-semibold text-gray-900">Generated Outreach Template</h4>
        <div class="flex gap-2">
          <button
            @click="copyTemplate"
            class="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition"
          >
            {{ templateCopied ? '✓ Copied!' : '📋 Copy' }}
          </button>
          <button
            @click="saveTemplate"
            :disabled="isSaving"
            class="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white rounded transition"
          >
            {{ isSaving ? '⏳' : '✓' }} Save
          </button>
        </div>
      </div>

      <!-- Subject Line (for emails) -->
      <div v-if="subjectLine && (messageType === 'email' || messageType === 'cold')" class="mb-3">
        <label class="block text-xs font-medium text-gray-700 mb-1">Subject Line</label>
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
          <input
            v-model="subjectLine"
            type="text"
            class="w-full px-2 py-1 bg-transparent text-sm font-semibold text-gray-900 outline-none"
          />
        </div>
      </div>

      <!-- Template Body -->
      <div class="bg-white border border-gray-200 rounded-lg p-4">
        <textarea
          v-model="generatedTemplate"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-vertical min-h-[300px] font-mono text-xs"
        ></textarea>
      </div>

      <!-- Template Tips -->
      <div v-if="templateTips" class="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h5 class="text-sm font-semibold text-blue-900 mb-2">Personalization Tips</h5>
        <p class="text-xs text-blue-800 whitespace-pre-wrap">{{ templateTips }}</p>
      </div>
    </div>

    <!-- Template History -->
    <div v-if="templateHistory.length > 0">
      <h4 class="font-semibold text-gray-900 mb-3">Template History</h4>
      <div class="space-y-2">
        <div
          v-for="(history, idx) in templateHistory.slice(0, 5)"
          :key="idx"
          class="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm"
        >
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <p class="font-medium text-gray-900">{{ history.goal }} - {{ history.recipient }}</p>
              <p class="text-xs text-gray-600 mt-1">
                {{ formatTimestamp(history.timestamp) }} • {{ history.tone }} • {{ history.type }}
              </p>
              <p v-if="history.subject" class="text-xs text-gray-700 mt-1 italic">{{ history.subject }}</p>
            </div>
            <button
              @click="loadTemplate(idx)"
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
      <label class="block text-sm font-medium text-gray-700 mb-2">Outreach Strategy Notes</label>
      <textarea
        v-model="formData.notes"
        placeholder="Add notes about your outreach strategy, response rates, successful tactics, or follow-up plans..."
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
  templates: [],
  templateHistory: []
})

const outreachGoal = ref('partnership')
const recipientType = ref('')
const context = ref('')
const tone = ref('friendly')
const messageType = ref('email')

const isGenerating = ref(false)
const isSaving = ref(false)
const error = ref('')
const successMessage = ref('')
const generatedTemplate = ref('')
const subjectLine = ref('')
const templateTips = ref('')
const templateHistory = ref([])
const templateCopied = ref(false)

// Load existing data
watch(
  () => props.taskData,
  (newData) => {
    if (newData && Object.keys(newData).length > 0) {
      formData.value = {
        notes: newData.notes || '',
        templates: newData.templates || [],
        templateHistory: newData.templateHistory || []
      }
      templateHistory.value = newData.templateHistory || []
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

// Generate outreach template with Grok AI
const generateOutreach = async () => {
  if (!recipientType.value.trim()) {
    error.value = 'Please enter recipient type/role'
    return
  }

  if (!appDescription.value || appDescription.value.trim().length < 10) {
    error.value = 'Please fill in your app description first (minimum 10 characters)'
    return
  }

  isGenerating.value = true
  error.value = ''
  successMessage.value = ''
  generatedTemplate.value = ''
  subjectLine.value = ''
  templateTips.value = ''

  try {
    const goalDescriptions = {
      partnership: 'Propose a mutually beneficial partnership or collaboration opportunity',
      media: 'Request media coverage, interview, or feature in their publication',
      research: 'Request user research participation, feedback, or interview',
      sales: 'Introduce product and request a demo or sales call',
      influencer: 'Request product review, sponsorship, or promotional partnership',
      investor: 'Introduce company and request investor meeting or pitch opportunity',
      affiliate: 'Propose affiliate partnership or referral program'
    }

    const toneDescriptions = {
      formal: 'Professional, polished, respectful, business-appropriate',
      friendly: 'Warm, personable, conversational yet professional',
      direct: 'Concise, clear, no fluff, straight to the point',
      enthusiastic: 'Energetic, passionate, exciting, showing genuine interest',
      humble: 'Modest, respectful, appreciative, not pushy'
    }

    const needsSubject = messageType.value === 'email' || messageType.value === 'cold'

    const prompt = `Generate a personalized outreach ${messageType.value} template with the following specifications:

Product/Company Context: ${appDescription.value}

Outreach Details:
- Goal: ${outreachGoal.value} - ${goalDescriptions[outreachGoal.value]}
- Recipient Type: ${recipientType.value}
- Personalization Context: ${context.value || 'General outreach'}
- Tone: ${tone.value} - ${toneDescriptions[tone.value]}
- Message Type: ${messageType.value}

Requirements:
${needsSubject ? '- Create compelling subject line (under 50 characters)' : ''}
- Start with strong, personalized opening
- Clearly state the value proposition
- Include specific call-to-action
- Keep appropriate length for ${messageType.value}
- Use placeholders [NAME], [COMPANY], [SPECIFIC_DETAIL] where personalization needed
- Sound genuine, not templated or spammy
${messageType.value === 'linkedin' ? '- Keep under 300 words (LinkedIn DM limit)' : ''}
${messageType.value === 'twitter' ? '- Keep very brief (Twitter DM context)' : ''}

Format your response EXACTLY like this:

${needsSubject ? '[SUBJECT]\nSubject line here\n\n' : ''}[TEMPLATE]
Message body here...

---TIPS---
Provide 3-5 quick personalization tips to make this template even more effective.`

    const response = await fetch('/.netlify/functions/grok-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'grok-2',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000
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

    // Parse response
    let parsed = responseText

    // Extract subject if present
    if (needsSubject && responseText.includes('[SUBJECT]')) {
      const subjectMatch = responseText.match(/\[SUBJECT\]\s*\n([^\n]+)/i)
      if (subjectMatch) {
        subjectLine.value = subjectMatch[1].trim()
      }
    }

    // Extract template body
    const templateMatch = responseText.match(/\[TEMPLATE\]\s*\n([\s\S]*?)(?:---TIPS---|$)/i)
    if (templateMatch) {
      generatedTemplate.value = templateMatch[1].trim()
    } else {
      // Fallback: use everything before TIPS
      const parts = responseText.split('---TIPS---')
      generatedTemplate.value = parts[0].replace(/\[SUBJECT\][\s\S]*?\[TEMPLATE\]\s*/i, '').trim()
    }

    // Extract tips
    const tipsMatch = responseText.match(/---TIPS---\s*\n([\s\S]*)/i)
    if (tipsMatch) {
      templateTips.value = tipsMatch[1].trim()
    }

    // Add to history
    templateHistory.value.unshift({
      timestamp: new Date().toISOString(),
      goal: outreachGoal.value,
      recipient: recipientType.value,
      tone: tone.value,
      type: messageType.value,
      subject: subjectLine.value,
      template: generatedTemplate.value,
      tips: templateTips.value
    })

    successMessage.value = 'Outreach template generated! Customize placeholders before sending.'
  } catch (err) {
    console.error('Generation error:', err)
    error.value = err.message || 'Failed to generate template. Please try again.'
  } finally {
    isGenerating.value = false
  }
}

// Copy template to clipboard
const copyTemplate = async () => {
  try {
    const fullText = subjectLine.value
      ? `Subject: ${subjectLine.value}\n\n${generatedTemplate.value}`
      : generatedTemplate.value
    await navigator.clipboard.writeText(fullText)
    templateCopied.value = true
    setTimeout(() => {
      templateCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Copy failed:', err)
    error.value = 'Failed to copy to clipboard'
  }
}

// Save template
const saveTemplate = async () => {
  isSaving.value = true

  try {
    formData.value.templates = [
      ...(formData.value.templates || []),
      {
        goal: outreachGoal.value,
        recipient: recipientType.value,
        tone: tone.value,
        type: messageType.value,
        subject: subjectLine.value,
        template: generatedTemplate.value,
        tips: templateTips.value,
        timestamp: new Date().toISOString()
      }
    ]

    formData.value.templateHistory = templateHistory.value

    emit('save', formData.value)

    successMessage.value = 'Template saved successfully!'
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err) {
    console.error('Save error:', err)
    error.value = 'Failed to save template. Please try again.'
  } finally {
    isSaving.value = false
  }
}

// Load template from history
const loadTemplate = (index) => {
  const history = templateHistory.value[index]
  generatedTemplate.value = history.template
  subjectLine.value = history.subject || ''
  templateTips.value = history.tips || ''
  outreachGoal.value = history.goal
  recipientType.value = history.recipient
  tone.value = history.tone
  messageType.value = history.type
  successMessage.value = 'Template loaded from history'
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

textarea, input {
  transition: all 0.2s ease-in-out;
}

textarea:focus, input:focus {
  border-color: #e0e7ff;
}
</style>
