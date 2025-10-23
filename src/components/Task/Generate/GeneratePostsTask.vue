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

    <!-- Generation Settings -->
    <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <h4 class="font-semibold text-gray-900 mb-4">Generation Settings</h4>

      <!-- Platform Selection -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Select Platforms</label>
        <div class="space-y-2">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="selectedPlatforms"
              type="checkbox"
              value="twitter"
              class="w-4 h-4 text-indigo-600 border-gray-300 rounded"
            />
            <span class="text-sm text-gray-700">X / Twitter (280 char limit)</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="selectedPlatforms"
              type="checkbox"
              value="linkedin"
              class="w-4 h-4 text-indigo-600 border-gray-300 rounded"
            />
            <span class="text-sm text-gray-700">LinkedIn (professional tone)</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="selectedPlatforms"
              type="checkbox"
              value="instagram"
              class="w-4 h-4 text-indigo-600 border-gray-300 rounded"
            />
            <span class="text-sm text-gray-700">Instagram (visual-focused)</span>
          </label>
        </div>
      </div>

      <!-- Tone Selection -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Tone/Style</label>
        <select
          v-model="tone"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
        >
          <option value="professional">Professional</option>
          <option value="casual">Casual & Friendly</option>
          <option value="technical">Technical & Detailed</option>
          <option value="storytelling">Storytelling</option>
        </select>
      </div>

      <!-- CTA Selection -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Call-to-Action</label>
        <select
          v-model="cta"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
        >
          <option value="signup">Sign Up</option>
          <option value="learn">Learn More</option>
          <option value="join">Join Community</option>
          <option value="try">Try Now</option>
          <option value="none">No CTA</option>
        </select>
      </div>

      <!-- Post Count -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Number of Posts</label>
        <div class="flex gap-2">
          <input
            v-model.number="postCount"
            type="number"
            min="1"
            max="10"
            class="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          />
          <span class="text-sm text-gray-600 self-center">per platform</span>
        </div>
      </div>

      <!-- Generate Button -->
      <button
        @click="generateWithAI"
        :disabled="isGenerating || selectedPlatforms.length === 0"
        class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-lg transition font-medium text-sm flex items-center justify-center gap-2"
      >
        <svg v-if="!isGenerating" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
        <svg v-else class="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ isGenerating ? 'Generating...' : 'Generate with Grok AI' }}
      </button>
    </div>

    <!-- Generated Posts -->
    <div v-if="generatedPosts.length > 0">
      <div class="flex justify-between items-center mb-3">
        <h4 class="font-semibold text-gray-900">Generated Posts ({{ generatedPosts.length }})</h4>
        <button
          @click="saveGeneratedPosts"
          :disabled="isSaving || generatedPosts.filter(p => p.selected).length === 0"
          class="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white text-sm rounded transition"
        >
          {{ isSaving ? '⏳' : '✓' }} Save Selected
        </button>
      </div>

      <div class="space-y-3">
        <div
          v-for="(post, index) in generatedPosts"
          :key="index"
          class="bg-white border border-gray-200 rounded-lg p-4"
        >
          <!-- Post Header -->
          <div class="flex items-start gap-3 mb-3">
            <input
              v-model="post.selected"
              type="checkbox"
              class="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded"
            />
            <div class="flex-1">
              <div class="flex justify-between items-start gap-2">
                <div>
                  <h5 class="font-semibold text-gray-900">{{ post.platform }}</h5>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ post.content.length }}/{{ getCharLimit(post.platform) }} characters
                  </p>
                </div>
                <button
                  @click="removePost(index)"
                  class="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          <!-- Post Content -->
          <textarea
            v-model="post.content"
            :placeholder="`Enter post content for ${post.platform}...`"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-vertical min-h-[80px] font-mono text-xs mb-3"
          ></textarea>

          <!-- Character Warning -->
          <div v-if="getCharLimit(post.platform) && post.content.length > getCharLimit(post.platform)" class="text-xs text-red-600 mb-2">
            ⚠️ Exceeds {{ post.platform }} character limit by {{ post.content.length - getCharLimit(post.platform) }} characters
          </div>

          <!-- Copy Button -->
          <button
            @click="copyToClipboard(index)"
            class="text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition"
          >
            {{ copiedIndex === index ? '✓ Copied!' : '📋 Copy' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Generation History -->
    <div v-if="generationHistory.length > 0">
      <h4 class="font-semibold text-gray-900 mb-3">Generation History</h4>
      <div class="space-y-2">
        <div
          v-for="(history, idx) in generationHistory.slice(0, 5)"
          :key="idx"
          class="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm"
        >
          <div class="flex justify-between items-start">
            <div>
              <p class="font-medium text-gray-900">
                {{ formatTimestamp(history.timestamp) }}
              </p>
              <p class="text-xs text-gray-600 mt-1">
                {{ history.platforms }} • {{ history.count }} posts • {{ history.tone }} • {{ history.cta }}
              </p>
            </div>
            <span class="text-xs text-gray-500">{{ history.count }} posts</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Additional Notes -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Notes & Strategy</label>
      <textarea
        v-model="formData.notes"
        placeholder="Add notes about your social media strategy, campaigns, or any special instructions..."
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-vertical min-h-[80px]"
      ></textarea>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useProjectStore } from '@/stores/projectStore'

const props = defineProps({
  taskId: String,
  taskData: Object
})

const emit = defineEmits(['save'])
const projectStore = useProjectStore()

// State
const formData = ref({
  notes: '',
  generatedPosts: [],
  generationHistory: []
})

const selectedPlatforms = ref(['twitter'])
const tone = ref('professional')
const cta = ref('signup')
const postCount = ref(3)
const isGenerating = ref(false)
const isSaving = ref(false)
const error = ref('')
const successMessage = ref('')
const generatedPosts = ref([])
const generationHistory = ref([])
const copiedIndex = ref(-1)

// Load existing data
watch(
  () => props.taskData,
  (newData) => {
    if (newData && Object.keys(newData).length > 0) {
      formData.value = {
        notes: newData.notes || '',
        generatedPosts: newData.generatedPosts || [],
        generationHistory: newData.generationHistory || []
      }
      generatedPosts.value = newData.generatedPosts || []
      generationHistory.value = newData.generationHistory || []
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

// Get character limit for platform
const getCharLimit = (platform) => {
  if (platform.includes('Twitter') || platform.includes('X')) return 280
  return null // LinkedIn and Instagram have no strict limit
}

// Generate posts with Grok AI
const generateWithAI = async () => {
  if (!appDescription.value || appDescription.value.trim().length < 10) {
    error.value = 'Please fill in your app description first (minimum 10 characters)'
    return
  }

  if (selectedPlatforms.value.length === 0) {
    error.value = 'Please select at least one platform'
    return
  }

  isGenerating.value = true
  error.value = ''
  successMessage.value = ''
  generatedPosts.value = []

  try {
    // Build platform list
    const platformLabels = {
      twitter: 'X (Twitter)',
      linkedin: 'LinkedIn',
      instagram: 'Instagram'
    }
    const platformList = selectedPlatforms.value
      .map(p => platformLabels[p])
      .join(', ')

    // Construct detailed prompt
    const prompt = `Generate exactly ${postCount.value} social media posts for each of these platforms: ${platformList}.

Target Audience & Product: ${appDescription.value}

Requirements:
- Tone: ${tone.value}
- Call-to-Action: ${cta.value}
- Each post should be platform-optimized
- X/Twitter: Max 280 characters, include hashtags, emojis
- LinkedIn: Professional tone, industry insights, company voice
- Instagram: Visual-focused descriptions, hashtags, call for engagement
- All posts should drive ${cta.value} action

Format your response EXACTLY like this, with clear separators:
[PLATFORM: X (Twitter)]
Post 1 content here
---
Post 2 content here
---
[PLATFORM: LinkedIn]
Post 1 content here
---
[PLATFORM: Instagram]
Post 1 content here
---

Important: Use [PLATFORM: ...] headers and --- separators between posts.`

    // Call Grok API through our proxy
    const grokUrl = `${import.meta.env.VITE_FUNCTIONS_URL}/grok-proxy`; const response = await fetch(grokUrl, {
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

    // Parse response by platform blocks
    const posts = parsePostsFromResponse(responseText, selectedPlatforms.value)

    if (posts.length === 0) {
      throw new Error('Could not parse posts from response. Please try again.')
    }

    generatedPosts.value = posts.map(p => ({
      ...p,
      selected: true
    }))

    // Add to history
    generationHistory.value.unshift({
      timestamp: new Date().toISOString(),
      platforms: platformList,
      count: generatedPosts.value.length,
      tone: tone.value,
      cta: cta.value
    })

    successMessage.value = `Generated ${generatedPosts.value.length} posts! Review and select which ones to save.`
  } catch (err) {
    console.error('Generation error:', err)
    error.value = err.message || 'Failed to generate posts. Please try again.'
    generatedPosts.value = []
  } finally {
    isGenerating.value = false
  }
}

// Parse posts from Grok response
const parsePostsFromResponse = (responseText, platforms) => {
  const posts = []
  const platformLabels = {
    twitter: 'X (Twitter)',
    linkedin: 'LinkedIn',
    instagram: 'Instagram'
  }

  // Split by platform sections
  const platformBlocks = responseText.split('[PLATFORM:')

  for (let i = 1; i < platformBlocks.length; i++) {
    const block = platformBlocks[i]
    const platformMatch = block.match(/([^]\n]+)/)?.[1]?.trim()

    if (!platformMatch) continue

    // Get posts for this platform (split by ---)
    const postTexts = block
      .split('---')
      .slice(1) // Skip the platform header line
      .map(p => p.trim())
      .filter(p => p.length > 0)

    // Add each post
    for (const postText of postTexts) {
      posts.push({
        platform: platformMatch,
        content: postText,
        selected: true
      })
    }
  }

  return posts
}

// Copy post to clipboard
const copyToClipboard = async (index) => {
  try {
    await navigator.clipboard.writeText(generatedPosts.value[index].content)
    copiedIndex.value = index
    setTimeout(() => {
      copiedIndex.value = -1
    }, 2000)
  } catch (err) {
    console.error('Copy failed:', err)
    error.value = 'Failed to copy to clipboard'
  }
}

// Remove a generated post
const removePost = (index) => {
  generatedPosts.value.splice(index, 1)
}

// Save selected posts
const saveGeneratedPosts = async () => {
  isSaving.value = true

  try {
    const selectedPosts = generatedPosts.value.filter(p => p.selected)

    formData.value.generatedPosts = selectedPosts
    formData.value.generationHistory = generationHistory.value

    // Save to store
    emit('save', formData.value)

    successMessage.value = `Saved ${selectedPosts.length} post(s) successfully!`
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err) {
    console.error('Save error:', err)
    error.value = 'Failed to save posts. Please try again.'
  } finally {
    isSaving.value = false
  }
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
  (newNotes) => {
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
