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

    <!-- Video Script Settings -->
    <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <h4 class="font-semibold text-gray-900 mb-4">Video Script Generation</h4>

      <!-- Video Type -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Video Type</label>
        <select
          v-model="videoType"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
        >
          <option value="tutorial">Tutorial / How-To</option>
          <option value="demo">Product Demo</option>
          <option value="testimonial">Customer Testimonial</option>
          <option value="explainer">Explainer Video</option>
          <option value="promo">Promotional / Ad</option>
          <option value="behind-scenes">Behind the Scenes</option>
          <option value="announcement">Product Announcement</option>
        </select>
      </div>

      <!-- Target Length -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Target Video Length</label>
        <select
          v-model="targetLength"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
        >
          <option value="30">30 seconds (Short Ad)</option>
          <option value="60">60 seconds (Social Media)</option>
          <option value="120">2 minutes (Standard)</option>
          <option value="300">5 minutes (In-Depth)</option>
          <option value="600">10+ minutes (Long Form)</option>
        </select>
      </div>

      <!-- Key Message -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Key Message / Topic</label>
        <textarea
          v-model="keyMessage"
          placeholder="e.g., Show users how to set up their first campaign in under 5 minutes..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-vertical min-h-[80px]"
        ></textarea>
      </div>

      <!-- Platform -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Target Platform</label>
        <select
          v-model="platform"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
        >
          <option value="youtube">YouTube</option>
          <option value="tiktok">TikTok</option>
          <option value="instagram">Instagram Reels</option>
          <option value="linkedin">LinkedIn</option>
          <option value="facebook">Facebook</option>
          <option value="twitter">Twitter/X</option>
          <option value="website">Website / Landing Page</option>
        </select>
      </div>

      <!-- Script Elements -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Script Elements</label>
        <div class="grid grid-cols-2 gap-3">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="includeHook"
              type="checkbox"
              class="w-4 h-4 text-indigo-600 border-gray-300 rounded"
            />
            <span class="text-sm text-gray-700">Opening Hook</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="includeVoiceover"
              type="checkbox"
              class="w-4 h-4 text-indigo-600 border-gray-300 rounded"
            />
            <span class="text-sm text-gray-700">Voiceover Script</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="includeScenes"
              type="checkbox"
              class="w-4 h-4 text-indigo-600 border-gray-300 rounded"
            />
            <span class="text-sm text-gray-700">Scene Descriptions</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="includeCaptions"
              type="checkbox"
              class="w-4 h-4 text-indigo-600 border-gray-300 rounded"
            />
            <span class="text-sm text-gray-700">Text Captions</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="includeMusic"
              type="checkbox"
              class="w-4 h-4 text-indigo-600 border-gray-300 rounded"
            />
            <span class="text-sm text-gray-700">Music Cues</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="includeCTA"
              type="checkbox"
              class="w-4 h-4 text-indigo-600 border-gray-300 rounded"
            />
            <span class="text-sm text-gray-700">Call-to-Action</span>
          </label>
        </div>
      </div>

      <!-- Tone/Style -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Video Tone/Style</label>
        <select
          v-model="tone"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
        >
          <option value="professional">Professional & Polished</option>
          <option value="casual">Casual & Conversational</option>
          <option value="energetic">Energetic & Dynamic</option>
          <option value="educational">Educational & Informative</option>
          <option value="inspiring">Inspiring & Motivational</option>
          <option value="humorous">Humorous & Fun</option>
        </select>
      </div>

      <!-- Generate Button -->
      <button
        @click="generateScript"
        :disabled="isGenerating || !keyMessage.trim()"
        class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-lg transition font-medium text-sm flex items-center justify-center gap-2"
      >
        <svg v-if="!isGenerating" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
        <svg v-else class="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ isGenerating ? 'Generating Script...' : 'Generate with Grok AI' }}
      </button>
    </div>

    <!-- Generated Script -->
    <div v-if="generatedScript">
      <div class="flex justify-between items-center mb-3">
        <h4 class="font-semibold text-gray-900">Generated Video Script</h4>
        <div class="flex gap-2">
          <button
            @click="copyScript"
            class="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition"
          >
            {{ scriptCopied ? '✓ Copied!' : '📋 Copy' }}
          </button>
          <button
            @click="saveScript"
            :disabled="isSaving"
            class="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white rounded transition"
          >
            {{ isSaving ? '⏳' : '✓' }} Save
          </button>
        </div>
      </div>

      <!-- Estimated Duration -->
      <div class="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
        <span class="font-semibold text-blue-900">Target Duration:</span>
        <span class="text-blue-800 ml-2">{{ formatDuration(targetLength) }}</span>
        <span class="text-blue-600 ml-3">Platform: {{ platform }}</span>
      </div>

      <div class="bg-white border border-gray-200 rounded-lg p-4">
        <textarea
          v-model="generatedScript"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-vertical min-h-[500px] font-mono text-xs"
        ></textarea>
      </div>

      <!-- Production Notes -->
      <div v-if="productionNotes" class="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <h5 class="text-sm font-semibold text-yellow-900 mb-2">Production Notes</h5>
        <p class="text-xs text-yellow-800 whitespace-pre-wrap">{{ productionNotes }}</p>
      </div>
    </div>

    <!-- Script History -->
    <div v-if="scriptHistory.length > 0">
      <h4 class="font-semibold text-gray-900 mb-3">Script History</h4>
      <div class="space-y-2">
        <div
          v-for="(history, idx) in scriptHistory.slice(0, 5)"
          :key="idx"
          class="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm"
        >
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <p class="font-medium text-gray-900 capitalize">{{ history.type }} - {{ formatDuration(history.length) }}</p>
              <p class="text-xs text-gray-600 mt-1">
                {{ formatTimestamp(history.timestamp) }} • {{ history.platform }} • {{ history.tone }}
              </p>
              <p class="text-xs text-gray-700 mt-1 line-clamp-2">{{ history.message }}</p>
            </div>
            <button
              @click="loadScript(idx)"
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
      <label class="block text-sm font-medium text-gray-700 mb-2">Video Production Notes</label>
      <textarea
        v-model="formData.notes"
        placeholder="Add notes about your video strategy, equipment needed, shooting locations, talent, or editing requirements..."
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
  videoScripts: [],
  scriptHistory: []
})

const videoType = ref('tutorial')
const targetLength = ref('120')
const keyMessage = ref('')
const platform = ref('youtube')
const tone = ref('professional')

const includeHook = ref(true)
const includeVoiceover = ref(true)
const includeScenes = ref(true)
const includeCaptions = ref(false)
const includeMusic = ref(false)
const includeCTA = ref(true)

const isGenerating = ref(false)
const isSaving = ref(false)
const error = ref('')
const successMessage = ref('')
const generatedScript = ref('')
const productionNotes = ref('')
const scriptHistory = ref([])
const scriptCopied = ref(false)

// Load existing data
watch(
  () => props.taskData,
  (newData) => {
    if (newData && Object.keys(newData).length > 0) {
      formData.value = {
        notes: newData.notes || '',
        videoScripts: newData.videoScripts || [],
        scriptHistory: newData.scriptHistory || []
      }
      scriptHistory.value = newData.scriptHistory || []
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

// Format duration
const formatDuration = (seconds) => {
  const sec = parseInt(seconds)
  if (sec < 60) return `${sec}s`
  if (sec < 600) return `${Math.floor(sec / 60)}min ${sec % 60}s`
  return `${Math.floor(sec / 60)} minutes`
}

// Generate video script with Grok AI
const generateScript = async () => {
  if (!keyMessage.value.trim()) {
    error.value = 'Please enter a key message or topic'
    return
  }

  if (!appDescription.value || appDescription.value.trim().length < 10) {
    error.value = 'Please fill in your app description first (minimum 10 characters)'
    return
  }

  isGenerating.value = true
  error.value = ''
  successMessage.value = ''
  generatedScript.value = ''
  productionNotes.value = ''

  try {
    const platformGuidelines = {
      youtube: 'YouTube format - can be longer, SEO-optimized, chapter markers helpful',
      tiktok: 'TikTok format - fast-paced, vertical 9:16, hook in first 3 seconds, trending sounds',
      instagram: 'Instagram Reels - vertical 9:16, captions essential, trending audio',
      linkedin: 'LinkedIn format - professional tone, value-first, subtitles recommended',
      facebook: 'Facebook format - mobile-optimized, captions for sound-off viewing',
      twitter: 'Twitter/X format - concise, attention-grabbing, square or vertical',
      website: 'Website format - professional, clear CTA, optimized for conversions'
    }

    const scriptElements = []
    if (includeHook.value) scriptElements.push('attention-grabbing hook')
    if (includeVoiceover.value) scriptElements.push('detailed voiceover script')
    if (includeScenes.value) scriptElements.push('scene-by-scene visuals')
    if (includeCaptions.value) scriptElements.push('on-screen text captions')
    if (includeMusic.value) scriptElements.push('music/sound cues')
    if (includeCTA.value) scriptElements.push('strong call-to-action')

    const prompt = `Generate a detailed video script with the following specifications:

Product/Company Context: ${appDescription.value}

Video Details:
- Type: ${videoType.value}
- Target Length: ${targetLength.value} seconds
- Key Message: ${keyMessage.value}
- Platform: ${platform.value} - ${platformGuidelines[platform.value]}
- Tone: ${tone.value}
- Script Elements: ${scriptElements.join(', ')}

Please provide a production-ready script including:

[VIDEO OVERVIEW]
- Working title
- Target audience
- Core objective
- Estimated final duration

[SCRIPT FORMAT]
Use this format for each scene/segment:

SCENE [#] - [TIMING]
Visual: [What we see on screen]
${includeVoiceover.value ? 'Voiceover: [Exact words to be spoken]' : ''}
${includeCaptions.value ? 'On-Screen Text: [Text overlays/captions]' : ''}
${includeMusic.value ? 'Audio: [Music/sound effects cues]' : ''}
Action: [Any specific actions or transitions]

Break down the entire ${targetLength.value} seconds into:
${includeHook.value ? '- Opening Hook (0-5 sec): Grab attention immediately' : ''}
- Introduction (timing)
- Main Content Sections (timing for each)
- ${includeCTA.value ? 'Call-to-Action & Closing (final 5-10 sec)' : 'Closing'}

[VOICEOVER SCRIPT]
${includeVoiceover.value ? `Provide the complete voiceover script with timing marks, approximately ${Math.floor(parseInt(targetLength.value) / 2)} words (assuming 120-150 words per minute speaking pace).` : 'Brief dialogue/narration points'}

[VISUAL REQUIREMENTS]
- Shot list (wide, medium, close-ups)
- Props or screen recordings needed
- Text overlays and graphics
- Branding elements

[TECHNICAL SPECS]
- Aspect ratio for ${platform.value}
- Suggested B-roll footage
- Graphics/animation needs
- Editing notes

---PRODUCTION NOTES---
Provide practical production tips:
- Equipment recommendations
- Filming tips for best results
- Common mistakes to avoid
- Post-production considerations

Format the response clearly with timing marks throughout.`

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

    // Parse response to separate script and production notes
    const parts = responseText.split('---PRODUCTION NOTES---')
    generatedScript.value = parts[0].trim()
    productionNotes.value = parts[1] ? parts[1].trim() : ''

    // Add to history
    scriptHistory.value.unshift({
      timestamp: new Date().toISOString(),
      type: videoType.value,
      length: targetLength.value,
      message: keyMessage.value,
      platform: platform.value,
      tone: tone.value,
      script: generatedScript.value,
      notes: productionNotes.value
    })

    successMessage.value = `Video script generated for ${formatDuration(targetLength.value)} ${videoType.value}!`
  } catch (err) {
    console.error('Generation error:', err)
    error.value = err.message || 'Failed to generate script. Please try again.'
  } finally {
    isGenerating.value = false
  }
}

// Copy script to clipboard
const copyScript = async () => {
  try {
    const fullText = productionNotes.value
      ? `${generatedScript.value}\n\n---PRODUCTION NOTES---\n${productionNotes.value}`
      : generatedScript.value
    await navigator.clipboard.writeText(fullText)
    scriptCopied.value = true
    setTimeout(() => {
      scriptCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Copy failed:', err)
    error.value = 'Failed to copy to clipboard'
  }
}

// Save video script
const saveScript = async () => {
  isSaving.value = true

  try {
    formData.value.videoScripts = [
      ...(formData.value.videoScripts || []),
      {
        type: videoType.value,
        length: targetLength.value,
        message: keyMessage.value,
        platform: platform.value,
        tone: tone.value,
        script: generatedScript.value,
        notes: productionNotes.value,
        timestamp: new Date().toISOString()
      }
    ]

    formData.value.scriptHistory = scriptHistory.value

    emit('save', formData.value)

    successMessage.value = 'Video script saved successfully!'
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err) {
    console.error('Save error:', err)
    error.value = 'Failed to save script. Please try again.'
  } finally {
    isSaving.value = false
  }
}

// Load script from history
const loadScript = (index) => {
  const history = scriptHistory.value[index]
  generatedScript.value = history.script
  productionNotes.value = history.notes || ''
  videoType.value = history.type
  targetLength.value = history.length
  keyMessage.value = history.message
  platform.value = history.platform
  tone.value = history.tone
  successMessage.value = 'Script loaded from history'
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
