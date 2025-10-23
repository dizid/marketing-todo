<template>
  <div class="space-y-6">
    <!-- Status Messages -->
    <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-sm text-red-800">{{ error }}</p>
      <button @click="error = ''" class="mt-2 text-sm text-red-600 hover:text-red-800 underline">Dismiss</button>
    </div>

    <div v-if="successMessage" class="p-4 bg-green-50 border border-green-200 rounded-lg">
      <p class="text-sm text-green-800">{{ successMessage }}</p>
      <button @click="successMessage = ''" class="mt-2 text-sm text-green-600 hover:text-green-800 underline">Dismiss</button>
    </div>

    <!-- Generation Settings -->
    <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <h4 class="font-semibold text-gray-900 mb-4">Graphics Brief</h4>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Design Purpose</label>
        <select v-model="designPurpose" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm">
          <option value="social-banner">Social Media Banner</option>
          <option value="website-hero">Website Hero</option>
          <option value="product-screenshot">Product Screenshot</option>
          <option value="infographic">Infographic</option>
          <option value="presentation-slide">Presentation Slide</option>
          <option value="email-header">Email Header</option>
          <option value="ad-creative">Paid Ad Creative</option>
          <option value="thumbnail">YouTube Thumbnail</option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Design Style</label>
        <select v-model="designStyle" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm">
          <option value="modern-minimal">Modern Minimal</option>
          <option value="bold-vibrant">Bold & Vibrant</option>
          <option value="professional">Professional</option>
          <option value="playful">Playful & Fun</option>
          <option value="luxury">Luxury</option>
          <option value="tech">Tech-focused</option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Key Message / CTA</label>
        <input v-model="keyMessage" type="text" placeholder="e.g., 'Join 10K+ users' or 'Start free trial today'"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
      </div>

      <button @click="generateGraphics" :disabled="isGenerating"
        class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition font-medium text-sm flex items-center justify-center gap-2">
        <svg v-if="!isGenerating" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
        {{ isGenerating ? 'Generating...' : 'Generate Design Brief' }}
      </button>
    </div>

    <!-- Generated Brief -->
    <div v-if="generatedBrief">
      <div class="flex justify-between items-center mb-3">
        <h4 class="font-semibold text-gray-900">Design Brief</h4>
        <div class="flex gap-2">
          <button @click="copyBrief" class="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition">
            {{ copied ? '✓ Copied!' : '📋 Copy' }}
          </button>
          <button @click="saveBrief" :disabled="isSaving" class="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded transition">
            {{ isSaving ? '⏳' : '✓' }} Save
          </button>
        </div>
      </div>
      <textarea v-model="generatedBrief" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-vertical min-h-[250px] font-mono text-xs"></textarea>
    </div>

    <!-- Notes -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Design Notes & Brand Guidelines</label>
      <textarea v-model="formData.notes" placeholder="Color palette, fonts, visual guidelines, or design preferences..."
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-vertical min-h-[80px]"></textarea>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({ taskId: String, taskData: Object })
const emit = defineEmits(['save'])

const formData = ref({ notes: '', briefs: [] })
const designPurpose = ref('social-banner')
const designStyle = ref('modern-minimal')
const keyMessage = ref('')
const isGenerating = ref(false)
const isSaving = ref(false)
const error = ref('')
const successMessage = ref('')
const generatedBrief = ref('')
const copied = ref(false)

const appDescription = computed(() => {
  try {
    const stored = localStorage.getItem('marketing-app-data')
    return stored ? JSON.parse(stored).appDescription || '' : ''
  } catch (e) {
    return ''
  }
})

watch(() => props.taskData, (newData) => {
  if (newData && Object.keys(newData).length > 0) {
    formData.value = { notes: newData.notes || '', briefs: newData.briefs || [] }
  }
}, { immediate: true })

const generateGraphics = async () => {
  if (!keyMessage.value.trim() || !appDescription.value) {
    error.value = 'Please fill in app description and key message'
    return
  }

  isGenerating.value = true
  error.value = ''

  try {
    const prompt = `Create a detailed design brief for ${designPurpose.value}:
Product: ${appDescription.value}
Style: ${designStyle.value}
CTA: ${keyMessage.value}

Include: Layout, color suggestions, typography, imagery ideas, and design elements.`

    const grokUrl = `${import.meta.env.VITE_FUNCTIONS_URL}/grok-proxy`; const response = await fetch(grokUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'grok-2',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 1500
      })
    })

    if (!response.ok) throw new Error('API error')

    const data = await response.json()
    generatedBrief.value = data.choices?.[0]?.message?.content || ''
    successMessage.value = 'Design brief generated!'
  } catch (err) {
    error.value = 'Generation failed: ' + err.message
  } finally {
    isGenerating.value = false
  }
}

const copyBrief = async () => {
  try {
    await navigator.clipboard.writeText(generatedBrief.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (err) {
    error.value = 'Copy failed'
  }
}

const saveBrief = async () => {
  isSaving.value = true
  try {
    formData.value.briefs = [...(formData.value.briefs || []), { title: designPurpose.value, content: generatedBrief.value, timestamp: new Date().toISOString() }]
    emit('save', formData.value)
    successMessage.value = 'Brief saved!'
  } catch (err) {
    error.value = 'Save failed'
  } finally {
    isSaving.value = false
  }
}

watch(() => formData.value.notes, () => { emit('save', formData.value) })
</script>

<style scoped>
button { transition: all 0.2s ease-in-out; }
textarea { transition: all 0.2s ease-in-out; }
textarea:focus { border-color: #e0e7ff; }
</style>
