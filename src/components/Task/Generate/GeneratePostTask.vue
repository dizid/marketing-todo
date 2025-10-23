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

    <!-- Post Optimization Settings -->
    <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <h4 class="font-semibold text-gray-900 mb-4">Post Optimization</h4>

      <!-- Original Post Input -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Original Post</label>
        <textarea
          v-model="originalPost"
          placeholder="Paste your social media post here to optimize..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-vertical min-h-[120px]"
        ></textarea>
        <p class="text-xs text-gray-500 mt-1">{{ originalPost.length }} characters</p>
      </div>

      <!-- Platform Selection -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Target Platform</label>
        <select
          v-model="platform"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
        >
          <option value="twitter">X / Twitter (280 char limit)</option>
          <option value="linkedin">LinkedIn (Professional)</option>
          <option value="instagram">Instagram (Visual-focused)</option>
          <option value="facebook">Facebook (Conversational)</option>
          <option value="threads">Threads (Casual)</option>
        </select>
      </div>

      <!-- Optimization Focus -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Optimization Focus</label>
        <select
          v-model="optimizationFocus"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
        >
          <option value="clarity">Clarity & Readability</option>
          <option value="engagement">Engagement & Interaction</option>
          <option value="ctr">Click-Through Rate (CTR)</option>
          <option value="brand">Brand Voice Consistency</option>
          <option value="hooks">Stronger Hook/Opening</option>
          <option value="cta">Clear Call-to-Action</option>
          <option value="viral">Viral Potential</option>
        </select>
      </div>

      <!-- Additional Options -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            v-model="addHashtags"
            type="checkbox"
            class="w-4 h-4 text-indigo-600 border-gray-300 rounded"
          />
          <span class="text-sm text-gray-700">Add Hashtags</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            v-model="addEmojis"
            type="checkbox"
            class="w-4 h-4 text-indigo-600 border-gray-300 rounded"
          />
          <span class="text-sm text-gray-700">Add Emojis</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            v-model="shortenPost"
            type="checkbox"
            class="w-4 h-4 text-indigo-600 border-gray-300 rounded"
          />
          <span class="text-sm text-gray-700">Make Shorter</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            v-model="addCTA"
            type="checkbox"
            class="w-4 h-4 text-indigo-600 border-gray-300 rounded"
          />
          <span class="text-sm text-gray-700">Strengthen CTA</span>
        </label>
      </div>

      <!-- Generate Button -->
      <button
        @click="optimizePost"
        :disabled="isGenerating || !originalPost.trim()"
        class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-lg transition font-medium text-sm flex items-center justify-center gap-2"
      >
        <svg v-if="!isGenerating" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
        <svg v-else class="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ isGenerating ? 'Optimizing...' : 'Optimize with Grok AI' }}
      </button>
    </div>

    <!-- Comparison View -->
    <div v-if="optimizedPost" class="space-y-4">
      <h4 class="font-semibold text-gray-900">Before & After Comparison</h4>

      <!-- Original -->
      <div class="bg-white border border-gray-200 rounded-lg p-4">
        <div class="flex justify-between items-center mb-2">
          <h5 class="text-sm font-semibold text-gray-700">Original</h5>
          <span class="text-xs text-gray-500">{{ originalPost.length }} chars</span>
        </div>
        <div class="text-sm text-gray-900 whitespace-pre-wrap p-3 bg-gray-50 rounded border border-gray-200">{{ originalPost }}</div>
      </div>

      <!-- Optimized -->
      <div class="bg-white border border-green-100 rounded-lg p-4 border-2">
        <div class="flex justify-between items-center mb-2">
          <h5 class="text-sm font-semibold text-green-700">Optimized Version</h5>
          <div class="flex gap-2 items-center">
            <span class="text-xs text-gray-500">{{ optimizedPost.length }} chars</span>
            <span v-if="platform === 'twitter' && optimizedPost.length <= 280" class="text-xs text-green-600">✓ Fits Twitter</span>
            <span v-else-if="platform === 'twitter' && optimizedPost.length > 280" class="text-xs text-red-600">⚠️ Too long</span>
          </div>
        </div>
        <textarea
          v-model="optimizedPost"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-vertical min-h-[120px]"
        ></textarea>

        <!-- Action Buttons -->
        <div class="flex gap-2 mt-3">
          <button
            @click="copyOptimized"
            class="flex-1 px-3 py-2 text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition font-medium"
          >
            {{ optimizedCopied ? '✓ Copied!' : '📋 Copy Optimized' }}
          </button>
          <button
            @click="saveOptimized"
            :disabled="isSaving"
            class="flex-1 px-3 py-2 text-xs bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white rounded transition font-medium"
          >
            {{ isSaving ? '⏳ Saving...' : '✓ Save Version' }}
          </button>
          <button
            @click="useOptimized"
            class="px-3 py-2 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition font-medium"
          >
            ↻ Re-optimize
          </button>
        </div>
      </div>

      <!-- Improvement Notes -->
      <div v-if="improvementNotes" class="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h5 class="text-sm font-semibold text-blue-900 mb-2">Optimization Notes</h5>
        <p class="text-xs text-blue-800 whitespace-pre-wrap">{{ improvementNotes }}</p>
      </div>
    </div>

    <!-- Optimization History -->
    <div v-if="optimizationHistory.length > 0">
      <h4 class="font-semibold text-gray-900 mb-3">Optimization History</h4>
      <div class="space-y-2">
        <div
          v-for="(history, idx) in optimizationHistory.slice(0, 5)"
          :key="idx"
          class="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm"
        >
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <p class="font-medium text-gray-900 capitalize">{{ history.platform }} • {{ history.focus }}</p>
              <p class="text-xs text-gray-600 mt-1 line-clamp-2">{{ history.optimized }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ formatTimestamp(history.timestamp) }}</p>
            </div>
            <button
              @click="loadHistory(idx)"
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
      <label class="block text-sm font-medium text-gray-700 mb-2">Strategy Notes</label>
      <textarea
        v-model="formData.notes"
        placeholder="Add notes about your post optimization strategy, brand voice guidelines, or best practices..."
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
  optimizedPosts: [],
  optimizationHistory: []
})

const originalPost = ref('')
const optimizedPost = ref('')
const platform = ref('twitter')
const optimizationFocus = ref('engagement')
const addHashtags = ref(false)
const addEmojis = ref(false)
const shortenPost = ref(false)
const addCTA = ref(false)

const isGenerating = ref(false)
const isSaving = ref(false)
const error = ref('')
const successMessage = ref('')
const optimizationHistory = ref([])
const optimizedCopied = ref(false)
const improvementNotes = ref('')

// Load existing data
watch(
  () => props.taskData,
  (newData) => {
    if (newData && Object.keys(newData).length > 0) {
      formData.value = {
        notes: newData.notes || '',
        optimizedPosts: newData.optimizedPosts || [],
        optimizationHistory: newData.optimizationHistory || []
      }
      optimizationHistory.value = newData.optimizationHistory || []
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

// Optimize post with Grok AI
const optimizePost = async () => {
  if (!originalPost.value.trim()) {
    error.value = 'Please enter a post to optimize'
    return
  }

  isGenerating.value = true
  error.value = ''
  successMessage.value = ''
  optimizedPost.value = ''
  improvementNotes.value = ''

  try {
    const platformGuidelines = {
      twitter: 'Max 280 characters, concise, use line breaks for readability, hashtags at end',
      linkedin: 'Professional tone, industry insights, thought leadership, longer form acceptable',
      instagram: 'Visual-focused, storytelling, multiple hashtags, emojis encouraged',
      facebook: 'Conversational, community-building, questions to drive engagement',
      threads: 'Casual, authentic, thread-style if needed, emoji-friendly'
    }

    const focusGuidelines = {
      clarity: 'Make the message crystal clear, remove jargon, simplify language',
      engagement: 'Add questions, create curiosity, encourage responses',
      ctr: 'Strong hook, clear value proposition, compelling link preview',
      brand: 'Maintain consistent voice, align with brand values and tone',
      hooks: 'Create attention-grabbing opening, use pattern interrupts',
      cta: 'Clear action step, create urgency, make next step obvious',
      viral: 'Emotional appeal, shareability, relatable content, trending elements'
    }

    const prompt = `Optimize this social media post for ${platform.value}:

ORIGINAL POST:
"${originalPost.value}"

${appDescription.value ? `BRAND CONTEXT: ${appDescription.value}` : ''}

OPTIMIZATION REQUIREMENTS:
- Platform: ${platform.value} - ${platformGuidelines[platform.value]}
- Focus: ${optimizationFocus.value} - ${focusGuidelines[optimizationFocus.value]}
${addHashtags.value ? '- Add relevant hashtags (3-5 max)' : ''}
${addEmojis.value ? '- Add strategic emojis to enhance message' : ''}
${shortenPost.value ? '- Make more concise while keeping impact' : ''}
${addCTA.value ? '- Include/strengthen call-to-action' : ''}

DELIVERABLES:
1. Provide the optimized post
2. After the post, add a separator line "---NOTES---"
3. Provide brief notes explaining key changes and why they improve the post

Format:
[Optimized post here]

---NOTES---
[Brief explanation of changes]`

    const grokUrl = `${import.meta.env.VITE_FUNCTIONS_URL}/grok-proxy`
    const response = await fetch(grokUrl, {
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
        temperature: 0.7,
        max_tokens: 1000
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

    // Parse response to separate post and notes
    const parts = responseText.split('---NOTES---')
    optimizedPost.value = parts[0].trim()
    improvementNotes.value = parts[1] ? parts[1].trim() : ''

    // Add to history
    optimizationHistory.value.unshift({
      timestamp: new Date().toISOString(),
      platform: platform.value,
      focus: optimizationFocus.value,
      original: originalPost.value,
      optimized: optimizedPost.value,
      notes: improvementNotes.value
    })

    successMessage.value = 'Post optimized successfully! Review the changes below.'
  } catch (err) {
    console.error('Optimization error:', err)
    error.value = err.message || 'Failed to optimize post. Please try again.'
  } finally {
    isGenerating.value = false
  }
}

// Copy optimized post to clipboard
const copyOptimized = async () => {
  try {
    await navigator.clipboard.writeText(optimizedPost.value)
    optimizedCopied.value = true
    setTimeout(() => {
      optimizedCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Copy failed:', err)
    error.value = 'Failed to copy to clipboard'
  }
}

// Save optimized version
const saveOptimized = async () => {
  isSaving.value = true

  try {
    formData.value.optimizedPosts = [
      ...(formData.value.optimizedPosts || []),
      {
        platform: platform.value,
        focus: optimizationFocus.value,
        original: originalPost.value,
        optimized: optimizedPost.value,
        notes: improvementNotes.value,
        timestamp: new Date().toISOString()
      }
    ]

    formData.value.optimizationHistory = optimizationHistory.value

    emit('save', formData.value)

    successMessage.value = 'Optimized post saved successfully!'
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err) {
    console.error('Save error:', err)
    error.value = 'Failed to save post. Please try again.'
  } finally {
    isSaving.value = false
  }
}

// Use optimized as new original for re-optimization
const useOptimized = () => {
  originalPost.value = optimizedPost.value
  optimizedPost.value = ''
  improvementNotes.value = ''
  successMessage.value = 'Using optimized version as input. Adjust settings and re-optimize!'
}

// Load from history
const loadHistory = (index) => {
  const history = optimizationHistory.value[index]
  originalPost.value = history.original
  optimizedPost.value = history.optimized
  improvementNotes.value = history.notes
  platform.value = history.platform
  optimizationFocus.value = history.focus
  successMessage.value = 'Loaded from history'
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

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
