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

    <!-- Blog Generation Settings -->
    <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <h4 class="font-semibold text-gray-900 mb-4">Blog Post Settings</h4>

      <!-- Blog Topic -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Blog Topic / Title</label>
        <input
          v-model="blogTopic"
          type="text"
          placeholder="e.g., 10 Ways to Improve Your Productivity"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
        />
      </div>

      <!-- Target Audience -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
        <input
          v-model="targetAudience"
          type="text"
          placeholder="e.g., Startup founders, SaaS users, developers"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
        />
      </div>

      <!-- Writing Style -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Writing Style</label>
        <select
          v-model="writingStyle"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
        >
          <option value="educational">Educational / How-to</option>
          <option value="narrative">Narrative / Storytelling</option>
          <option value="opinion">Opinion / Thought Leadership</option>
          <option value="case-study">Case Study</option>
          <option value="list">List / Listicle</option>
          <option value="technical">Technical / Deep Dive</option>
        </select>
      </div>

      <!-- Word Count -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Word Count Target</label>
        <div class="flex gap-2 items-center">
          <select
            v-model="wordCountTarget"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          >
            <option value="short">Short (500-800 words)</option>
            <option value="medium">Medium (1000-1500 words)</option>
            <option value="long">Long (2000-3000 words)</option>
            <option value="comprehensive">Comprehensive (3000+ words)</option>
          </select>
        </div>
      </div>

      <!-- SEO Keywords -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">SEO Keywords (comma-separated)</label>
        <input
          v-model="seoKeywords"
          type="text"
          placeholder="e.g., productivity tips, time management, workflow automation"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
        />
      </div>

      <!-- Generate Options -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            v-model="includeOutline"
            type="checkbox"
            class="w-4 h-4 text-indigo-600 border-gray-300 rounded"
          />
          <span class="text-sm text-gray-700">Generate Outline</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            v-model="includeCTA"
            type="checkbox"
            class="w-4 h-4 text-indigo-600 border-gray-300 rounded"
          />
          <span class="text-sm text-gray-700">Include CTA</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            v-model="includeMeta"
            type="checkbox"
            class="w-4 h-4 text-indigo-600 border-gray-300 rounded"
          />
          <span class="text-sm text-gray-700">Meta Description</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            v-model="includeImages"
            type="checkbox"
            class="w-4 h-4 text-indigo-600 border-gray-300 rounded"
          />
          <span class="text-sm text-gray-700">Image Suggestions</span>
        </label>
      </div>

      <!-- Generate Button -->
      <button
        @click="generateBlogPost"
        :disabled="isGenerating || !blogTopic.trim()"
        class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-lg transition font-medium text-sm flex items-center justify-center gap-2"
      >
        <svg v-if="!isGenerating" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
        <svg v-else class="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ isGenerating ? 'Generating Blog Post...' : 'Generate with Grok AI' }}
      </button>
    </div>

    <!-- Generated Content -->
    <div v-if="generatedContent">
      <div class="flex justify-between items-center mb-3">
        <h4 class="font-semibold text-gray-900">📝 Generated Content</h4>
        <div class="flex gap-2">
          <button
            @click="copyContent"
            class="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition"
          >
            {{ contentCopied ? '✓ Copied!' : '📋 Copy' }}
          </button>
          <button
            @click="saveBlogPost"
            :disabled="isSaving"
            class="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white rounded transition"
          >
            {{ isSaving ? '⏳' : '✓' }} Save
          </button>
        </div>
      </div>

      <div class="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
        <textarea
          v-model="generatedContent"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-vertical min-h-[300px] font-mono text-xs"
        ></textarea>
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
              <p class="font-medium text-gray-900">{{ history.title }}</p>
              <p class="text-xs text-gray-600 mt-1">
                {{ formatTimestamp(history.timestamp) }} • {{ history.style }} • {{ history.wordCount }}
              </p>
            </div>
            <span class="text-xs text-gray-500">{{ history.words }} words</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Additional Notes -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Strategy Notes</label>
      <textarea
        v-model="formData.notes"
        placeholder="Add notes about your blog content strategy, topics to cover, editorial calendar, or other important notes..."
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-vertical min-h-[100px]"
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
  generatedPosts: [],
  generationHistory: []
})

const blogTopic = ref('')
const targetAudience = ref('')
const writingStyle = ref('educational')
const wordCountTarget = ref('medium')
const seoKeywords = ref('')
const includeOutline = ref(true)
const includeCTA = ref(true)
const includeMeta = ref(true)
const includeImages = ref(false)

const isGenerating = ref(false)
const isSaving = ref(false)
const error = ref('')
const successMessage = ref('')
const generatedContent = ref('')
const generationHistory = ref([])
const contentCopied = ref(false)

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

// Generate blog post
const generateBlogPost = async () => {
  if (!blogTopic.value.trim()) {
    error.value = 'Please enter a blog topic'
    return
  }

  if (!appDescription.value || appDescription.value.trim().length < 10) {
    error.value = 'Please fill in your app description first (minimum 10 characters)'
    return
  }

  isGenerating.value = true
  error.value = ''
  successMessage.value = ''
  generatedContent.value = ''

  try {
    const wordCountGuide = {
      short: '500-800 words',
      medium: '1000-1500 words',
      long: '2000-3000 words',
      comprehensive: '3000+ words'
    }

    const prompt = `Write a comprehensive ${wordCountTarget.value} blog post with the following specifications:

Title: "${blogTopic.value}"
Target Audience: ${targetAudience.value || 'General professionals'}
Writing Style: ${writingStyle.value}
Word Count Target: ${wordCountGuide[wordCountTarget.value]}
Company/Product Context: ${appDescription.value}

SEO Keywords to naturally incorporate: ${seoKeywords.value || 'N/A'}

Requirements:
${includeOutline ? '- Start with a clear outline section showing the main points' : ''}
- Write engaging, informative content
- Use headers and subheaders for readability
- Include practical examples and actionable insights
${includeMeta ? '- Include a meta description (160 characters max)' : ''}
${includeCTA ? '- Include a clear call-to-action at the end' : ''}
${includeImages ? '- Suggest 3-5 image ideas with descriptions' : ''}
- Optimize for search engines without keyword stuffing

Format the response clearly with:
${includeMeta ? '[META DESCRIPTION]\n...\n\n' : ''}
${includeOutline ? '[OUTLINE]\n- Point 1\n- Point 2\n...\n\n' : ''}
[BLOG POST]\n...full blog content...
${includeCTA ? '\n\n[CALL TO ACTION]\n...' : ''}
${includeImages ? '\n\n[IMAGE SUGGESTIONS]\n1. Image idea...' : ''}`

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

    generatedContent.value = responseText

    // Add to history
    const wordCount = responseText.split(/\s+/).length
    generationHistory.value.unshift({
      timestamp: new Date().toISOString(),
      title: blogTopic.value,
      style: writingStyle.value,
      wordCount: wordCountTarget.value,
      words: wordCount
    })

    successMessage.value = `Blog post generated successfully! (${wordCount} words)`
  } catch (err) {
    console.error('Generation error:', err)
    error.value = err.message || 'Failed to generate blog post. Please try again.'
    generatedContent.value = ''
  } finally {
    isGenerating.value = false
  }
}

// Copy content
const copyContent = async () => {
  try {
    await navigator.clipboard.writeText(generatedContent.value)
    contentCopied.value = true
    setTimeout(() => {
      contentCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Copy failed:', err)
    error.value = 'Failed to copy to clipboard'
  }
}

// Save blog post
const saveBlogPost = async () => {
  isSaving.value = true

  try {
    formData.value.generatedPosts = [
      ...(formData.value.generatedPosts || []),
      {
        title: blogTopic.value,
        style: writingStyle.value,
        content: generatedContent.value,
        timestamp: new Date().toISOString()
      }
    ]

    emit('save', formData.value)

    successMessage.value = 'Blog post saved successfully!'
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err) {
    console.error('Save error:', err)
    error.value = 'Failed to save blog post. Please try again.'
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
