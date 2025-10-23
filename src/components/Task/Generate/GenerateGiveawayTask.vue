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

    <!-- Campaign Settings -->
    <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <h4 class="font-semibold text-gray-900 mb-4">Giveaway Campaign Settings</h4>

      <!-- Giveaway Type -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Giveaway Type</label>
        <select
          v-model="giveawayType"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
        >
          <option value="product">Product Giveaway</option>
          <option value="discount">Discount/Coupon</option>
          <option value="exclusive">Exclusive Access</option>
          <option value="bundle">Product Bundle</option>
          <option value="subscription">Subscription/Service</option>
        </select>
      </div>

      <!-- Prize Description -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Prize Description</label>
        <textarea
          v-model="prizeDescription"
          placeholder="e.g., 1-year premium subscription, $500 gift card, exclusive early access..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-vertical min-h-[80px]"
        ></textarea>
      </div>

      <!-- Entry Mechanics -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Entry Mechanics</label>
        <div class="space-y-2">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="entryMechanics"
              type="checkbox"
              value="email"
              class="w-4 h-4 text-indigo-600 border-gray-300 rounded"
            />
            <span class="text-sm text-gray-700">Email Signup</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="entryMechanics"
              type="checkbox"
              value="social"
              class="w-4 h-4 text-indigo-600 border-gray-300 rounded"
            />
            <span class="text-sm text-gray-700">Social Media Follow/Share</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="entryMechanics"
              type="checkbox"
              value="referral"
              class="w-4 h-4 text-indigo-600 border-gray-300 rounded"
            />
            <span class="text-sm text-gray-700">Referral Program</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="entryMechanics"
              type="checkbox"
              value="ugc"
              class="w-4 h-4 text-indigo-600 border-gray-300 rounded"
            />
            <span class="text-sm text-gray-700">User Generated Content</span>
          </label>
        </div>
      </div>

      <!-- Duration -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Campaign Duration</label>
        <select
          v-model="duration"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
        >
          <option value="3">3 Days (Flash Campaign)</option>
          <option value="7">7 Days (Standard)</option>
          <option value="14">14 Days (Extended)</option>
          <option value="30">30 Days (Month-long)</option>
        </select>
      </div>

      <!-- Target Audience -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
        <input
          v-model="targetAudience"
          type="text"
          placeholder="e.g., newsletter subscribers, social media followers, new customers..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
        />
      </div>

      <!-- Generate Button -->
      <button
        @click="generateCampaign"
        :disabled="isGenerating || !prizeDescription.trim() || entryMechanics.length === 0"
        class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-lg transition font-medium text-sm flex items-center justify-center gap-2"
      >
        <svg v-if="!isGenerating" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
        <svg v-else class="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ isGenerating ? 'Generating Campaign...' : 'Generate with Grok AI' }}
      </button>
    </div>

    <!-- Generated Campaign -->
    <div v-if="generatedCampaign">
      <div class="flex justify-between items-center mb-3">
        <h4 class="font-semibold text-gray-900">Generated Campaign Strategy</h4>
        <div class="flex gap-2">
          <button
            @click="copyCampaign"
            class="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition"
          >
            {{ campaignCopied ? '✓ Copied!' : '📋 Copy' }}
          </button>
          <button
            @click="saveCampaign"
            :disabled="isSaving"
            class="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white rounded transition"
          >
            {{ isSaving ? '⏳' : '✓' }} Save
          </button>
        </div>
      </div>

      <div class="bg-white border border-gray-200 rounded-lg p-4">
        <textarea
          v-model="generatedCampaign"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-vertical min-h-[400px] font-mono text-xs"
        ></textarea>
      </div>
    </div>

    <!-- Campaign History -->
    <div v-if="campaignHistory.length > 0">
      <h4 class="font-semibold text-gray-900 mb-3">Campaign History</h4>
      <div class="space-y-2">
        <div
          v-for="(history, idx) in campaignHistory.slice(0, 5)"
          :key="idx"
          class="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm"
        >
          <div class="flex justify-between items-start">
            <div>
              <p class="font-medium text-gray-900">{{ history.type }} - {{ history.duration }} days</p>
              <p class="text-xs text-gray-600 mt-1">
                {{ formatTimestamp(history.timestamp) }} • {{ history.mechanics }}
              </p>
            </div>
            <button
              @click="loadCampaign(idx)"
              class="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Load
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Additional Notes -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Campaign Notes</label>
      <textarea
        v-model="formData.notes"
        placeholder="Add notes about your giveaway strategy, legal considerations, promotional plans..."
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
  campaigns: [],
  campaignHistory: []
})

const giveawayType = ref('product')
const prizeDescription = ref('')
const entryMechanics = ref(['email', 'social'])
const duration = ref('7')
const targetAudience = ref('')

const isGenerating = ref(false)
const isSaving = ref(false)
const error = ref('')
const successMessage = ref('')
const generatedCampaign = ref('')
const campaignHistory = ref([])
const campaignCopied = ref(false)

// Load existing data
watch(
  () => props.taskData,
  (newData) => {
    if (newData && Object.keys(newData).length > 0) {
      formData.value = {
        notes: newData.notes || '',
        campaigns: newData.campaigns || [],
        campaignHistory: newData.campaignHistory || []
      }
      campaignHistory.value = newData.campaignHistory || []
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

// Generate campaign with Grok AI
const generateCampaign = async () => {
  if (!prizeDescription.value.trim()) {
    error.value = 'Please enter a prize description'
    return
  }

  if (entryMechanics.value.length === 0) {
    error.value = 'Please select at least one entry mechanic'
    return
  }

  if (!appDescription.value || appDescription.value.trim().length < 10) {
    error.value = 'Please fill in your app description first (minimum 10 characters)'
    return
  }

  isGenerating.value = true
  error.value = ''
  successMessage.value = ''
  generatedCampaign.value = ''

  try {
    const mechanicsList = entryMechanics.value.join(', ')

    const prompt = `Generate a complete giveaway campaign strategy with the following specifications:

Product/Company Context: ${appDescription.value}

Campaign Details:
- Giveaway Type: ${giveawayType.value}
- Prize: ${prizeDescription.value}
- Entry Mechanics: ${mechanicsList}
- Duration: ${duration.value} days
- Target Audience: ${targetAudience.value || 'General audience'}

Please provide a comprehensive campaign plan including:

[CAMPAIGN OVERVIEW]
- Campaign name/title
- Key objectives
- Target metrics (entries, shares, conversions)

[OFFICIAL RULES & TERMS]
- Eligibility requirements
- Entry period dates
- Winner selection method
- Prize claim process
- Legal disclaimers

[ENTRY INSTRUCTIONS]
- Clear step-by-step entry process
- Multiple entry opportunities
- Bonus entries for extra actions

[PROMOTIONAL STRATEGY]
- Launch announcement copy
- Daily/weekly promotional posts
- Email marketing messages
- Social media tactics
- Influencer outreach ideas

[TIMELINE & MILESTONES]
- Day-by-day promotional schedule
- Key checkpoints and reminders
- Winner announcement plan

[ASSETS NEEDED]
- Graphics/images required
- Landing page content
- Email templates
- Social media templates

[POST-CAMPAIGN FOLLOW-UP]
- Winner announcement strategy
- Participant nurturing plan
- Conversion tactics for non-winners
- Future campaign insights

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

    generatedCampaign.value = responseText

    // Add to history
    campaignHistory.value.unshift({
      timestamp: new Date().toISOString(),
      type: giveawayType.value,
      prize: prizeDescription.value,
      mechanics: mechanicsList,
      duration: duration.value,
      content: responseText
    })

    successMessage.value = 'Campaign strategy generated successfully!'
  } catch (err) {
    console.error('Generation error:', err)
    error.value = err.message || 'Failed to generate campaign. Please try again.'
    generatedCampaign.value = ''
  } finally {
    isGenerating.value = false
  }
}

// Copy campaign to clipboard
const copyCampaign = async () => {
  try {
    await navigator.clipboard.writeText(generatedCampaign.value)
    campaignCopied.value = true
    setTimeout(() => {
      campaignCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Copy failed:', err)
    error.value = 'Failed to copy to clipboard'
  }
}

// Save campaign
const saveCampaign = async () => {
  isSaving.value = true

  try {
    formData.value.campaigns = [
      ...(formData.value.campaigns || []),
      {
        type: giveawayType.value,
        prize: prizeDescription.value,
        mechanics: entryMechanics.value.join(', '),
        duration: duration.value,
        content: generatedCampaign.value,
        timestamp: new Date().toISOString()
      }
    ]

    formData.value.campaignHistory = campaignHistory.value

    emit('save', formData.value)

    successMessage.value = 'Campaign saved successfully!'
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err) {
    console.error('Save error:', err)
    error.value = 'Failed to save campaign. Please try again.'
  } finally {
    isSaving.value = false
  }
}

// Load campaign from history
const loadCampaign = (index) => {
  const history = campaignHistory.value[index]
  generatedCampaign.value = history.content
  successMessage.value = 'Campaign loaded from history'
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
