<template>
  <div class="bg-white border border-gray-200 rounded-lg p-4">
    <!-- Status Messages -->
    <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-sm text-red-800">{{ error }}</p>
      <button
        @click="error = ''"
        class="mt-2 text-sm text-red-600 hover:text-red-800 underline"
      >
        Dismiss
      </button>
    </div>

    <div v-if="successMessage" class="mb-4 p-4 bg-green-50 border-2 border-green-500 rounded-lg">
      <p class="text-sm text-green-900 font-medium mb-4">{{ successMessage }}</p>
      <!-- SAVE/USE BUTTON -->
      <button
        @click="useOutput"
        style="display: block; width: 100%; padding: 14px 16px; margin-bottom: 10px; background-color: #22c55e; color: white; font-weight: bold; border: none; border-radius: 6px; font-size: 15px; cursor: pointer;"
        onmouseover="this.style.backgroundColor='#16a34a'"
        onmouseout="this.style.backgroundColor='#22c55e'"
      >
        ✓ Save This
      </button>
      <!-- DISMISS BUTTON -->
      <button
        @click="successMessage = ''"
        style="display: block; width: 100%; padding: 10px 16px; background-color: white; color: #15803d; border: 2px solid #22c55e; border-radius: 6px; font-size: 14px; cursor: pointer; font-weight: 500;"
        onmouseover="this.style.backgroundColor='#f0fdf4'"
        onmouseout="this.style.backgroundColor='white'"
      >
        Dismiss
      </button>
    </div>

    <!-- Generate Button -->
    <button
      @click="generate"
      :disabled="isGenerating || !isValid"
      class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-lg transition font-medium text-sm flex items-center justify-center gap-2"
    >
      <svg v-if="!isGenerating" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
      </svg>
      <svg v-else class="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      {{ isGenerating ? `Generating... (${Math.round(generationProgress)}%)` : 'Generate with AI' }}
    </button>

    <!-- Generated Output -->
    <div v-if="output" class="mt-4 border border-blue-200 rounded-lg overflow-hidden">
      <div class="flex justify-between items-center mb-3 bg-blue-50 p-3 border-b border-blue-200">
        <h5 class="font-semibold text-gray-900">Generated Output</h5>
        <button
          @click="regenerate"
          :disabled="isGenerating"
          class="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-800 rounded transition"
        >
          🔄 Regenerate
        </button>
      </div>

      <div class="bg-gray-50 border-b border-gray-200 p-4">
        <p v-if="typeof output === 'string'" class="text-sm text-gray-700 whitespace-pre-wrap">{{ output }}</p>
        <div v-else class="text-sm text-gray-700">
          <slot name="output" :output="output"></slot>
        </div>
      </div>

      <!-- Copy and Use Buttons - ALWAYS VISIBLE -->
      <div class="flex gap-2 p-3 bg-white border-t border-gray-200">
        <button
          @click="copyToClipboard"
          class="flex-1 px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 rounded font-medium transition"
        >
          {{ hasCopied ? '✓ Copied!' : '📋 Copy' }}
        </button>
        <button
          @click="useOutput"
          class="flex-1 px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded font-medium transition"
        >
          ✓ Use This
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'

const props = defineProps({
  isValid: {
    type: Boolean,
    default: true
  },
  generateFn: {
    type: Function,
    required: true
  },
  generatePrompt: Function
})

const emit = defineEmits(['output', 'use'])

const isGenerating = ref(false)
const error = ref('')
const successMessage = ref('')
const output = ref(null)
const hasCopied = ref(false)
const generationProgress = ref(0)

// Interval tracking
let progressInterval = null
let copyResetTimeout = null

const generate = async () => {
  console.log('[AIPanel] Generate button clicked')
  console.log('[AIPanel] generateFn:', props.generateFn)
  console.log('[AIPanel] isValid:', props.isValid)

  isGenerating.value = true
  error.value = ''
  successMessage.value = ''
  output.value = null
  generationProgress.value = 0

  try {
    console.log('[AIPanel] Calling generateFn...')
    // Simulate progress
    progressInterval = setInterval(() => {
      generationProgress.value = Math.min(generationProgress.value + Math.random() * 30, 90)
    }, 200)

    const result = await props.generateFn()

    if (progressInterval) clearInterval(progressInterval)
    generationProgress.value = 100

    console.log('[AIPanel] Result received:', result)
    output.value = result
    emit('output', result)
    successMessage.value = 'Generated successfully! Click "✓ Use This" to save.'
  } catch (err) {
    console.error('[AIPanel] Generation error:', err)
    error.value = err.message || 'Failed to generate. Please try again.'
    console.error('Full error details:', err)
  } finally {
    isGenerating.value = false
    generationProgress.value = 0
  }
}

const regenerate = () => {
  output.value = null
  generate()
}

const copyToClipboard = async () => {
  try {
    if (!output.value) {
      error.value = 'Nothing to copy - generate content first'
      return
    }
    const textToCopy = typeof output.value === 'string' ? output.value : JSON.stringify(output.value)
    await navigator.clipboard.writeText(textToCopy)
    hasCopied.value = true
    copyResetTimeout = setTimeout(() => {
      hasCopied.value = false
    }, 2000)
  } catch (err) {
    error.value = 'Failed to copy to clipboard'
  }
}

const useOutput = () => {
  emit('use', output.value)
  successMessage.value = 'Output saved!'
}

defineExpose({
  generate
})

// Cleanup intervals and timeouts on unmount
onBeforeUnmount(() => {
  if (progressInterval) clearInterval(progressInterval)
  if (copyResetTimeout) clearTimeout(copyResetTimeout)
})
</script>

<style scoped>
button {
  transition: all 0.2s ease-in-out;
}
</style>
