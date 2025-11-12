<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="mb-6">
      <h3 class="text-lg font-bold text-gray-900">{{ taskConfig.name }}</h3>
      <p v-if="taskConfig.description" class="text-sm text-gray-600 mt-1">
        {{ taskConfig.description }}
      </p>
    </div>

    <!-- Form Section -->
    <div v-if="taskConfig.form && taskConfig.form.length" class="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <h4 class="font-semibold text-gray-900 mb-4">Configuration</h4>

      <div class="space-y-4">
        <div
          v-for="field in visibleFields"
          :key="field.id"
          class="form-field"
        >
          <!-- Text Input -->
          <div v-if="field.type === 'text'" class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              {{ field.label }}
              <span v-if="field.required" class="text-red-600">*</span>
            </label>
            <input
              :value="formData[field.id]"
              type="text"
              :placeholder="field.placeholder"
              @input="updateField(field.id, $event.target.value)"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            />
            <p v-if="field.description" class="text-xs text-gray-500">{{ field.description }}</p>
            <p v-if="fieldErrors[field.id]" class="text-xs text-red-600">{{ fieldErrors[field.id] }}</p>
          </div>

          <!-- Number Input -->
          <div v-else-if="field.type === 'number'" class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              {{ field.label }}
              <span v-if="field.required" class="text-red-600">*</span>
            </label>
            <div class="flex items-center gap-2">
              <input
                :value="formData[field.id]"
                type="number"
                :min="field.min || 0"
                :max="field.max"
                :placeholder="field.placeholder"
                @input="updateField(field.id, parseInt($event.target.value) || 0)"
                class="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
              <span v-if="field.suffix" class="text-sm text-gray-600">{{ field.suffix }}</span>
            </div>
            <p v-if="field.description" class="text-xs text-gray-500">{{ field.description }}</p>
            <p v-if="fieldErrors[field.id]" class="text-xs text-red-600">{{ fieldErrors[field.id] }}</p>
          </div>

          <!-- Textarea -->
          <div v-else-if="field.type === 'textarea'" class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              {{ field.label }}
              <span v-if="field.required" class="text-red-600">*</span>
            </label>
            <textarea
              :value="formData[field.id]"
              :placeholder="field.placeholder"
              :rows="field.rows || 3"
              @input="updateField(field.id, $event.target.value)"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-vertical"
            ></textarea>
            <p v-if="field.description" class="text-xs text-gray-500">{{ field.description }}</p>
            <p v-if="fieldErrors[field.id]" class="text-xs text-red-600">{{ fieldErrors[field.id] }}</p>
          </div>

          <!-- Select -->
          <div v-else-if="field.type === 'select'" class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              {{ field.label }}
              <span v-if="field.required" class="text-red-600">*</span>
            </label>
            <select
              :value="formData[field.id]"
              @change="updateField(field.id, $event.target.value)"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            >
              <option value="">Select {{ field.label }}</option>
              <option v-for="option in field.options" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
            <p v-if="field.description" class="text-xs text-gray-500">{{ field.description }}</p>
            <p v-if="fieldErrors[field.id]" class="text-xs text-red-600">{{ fieldErrors[field.id] }}</p>
          </div>

          <!-- Checkboxes -->
          <div v-else-if="field.type === 'checkboxes'" class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              {{ field.label }}
              <span v-if="field.required" class="text-red-600">*</span>
            </label>
            <div class="space-y-2">
              <label
                v-for="option in field.options"
                :key="option.value"
                class="flex items-center gap-2 cursor-pointer"
              >
                <input
                  :checked="(formData[field.id] || []).includes(option.value)"
                  type="checkbox"
                  :value="option.value"
                  @change="updateCheckboxField(field.id, option.value, $event.target.checked)"
                  class="w-4 h-4 text-indigo-600 border-gray-300 rounded"
                />
                <span class="text-sm text-gray-700">{{ option.label }}</span>
              </label>
            </div>
            <p v-if="field.description" class="text-xs text-gray-500">{{ field.description }}</p>
            <p v-if="fieldErrors[field.id]" class="text-xs text-red-600">{{ fieldErrors[field.id] }}</p>
          </div>

          <!-- Radio -->
          <div v-else-if="field.type === 'radio'" class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              {{ field.label }}
              <span v-if="field.required" class="text-red-600">*</span>
            </label>
            <div class="space-y-2">
              <label
                v-for="option in field.options"
                :key="option.value"
                class="flex items-center gap-2 cursor-pointer"
              >
                <input
                  :checked="formData[field.id] === option.value"
                  type="radio"
                  :value="option.value"
                  @change="updateField(field.id, option.value)"
                  class="w-4 h-4 text-indigo-600 border-gray-300"
                />
                <span class="text-sm text-gray-700">{{ option.label }}</span>
              </label>
            </div>
            <p v-if="field.description" class="text-xs text-gray-500">{{ field.description }}</p>
            <p v-if="fieldErrors[field.id]" class="text-xs text-red-600">{{ fieldErrors[field.id] }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- AI Generation Section -->
    <div v-if="taskConfig.ai?.enabled !== false" class="bg-white border border-gray-200 rounded-lg p-4">
      <!-- Status Messages -->
      <div v-if="aiError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-sm text-red-800">{{ aiError }}</p>
        <button
          @click="aiError = ''"
          class="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Dismiss
        </button>
      </div>

      <div v-if="aiSuccess" class="mb-4 p-4 bg-green-50 border-2 border-green-500 rounded-lg">
        <p class="text-sm text-green-900 font-medium mb-4">{{ aiSuccess }}</p>
        <!-- BUTTONS - save and copy -->
        <div class="flex gap-2">
          <button
            @click="handleSaveClick"
            style="flex: 1; padding: 14px 16px; background-color: #22c55e; color: white; font-weight: bold; border: none; border-radius: 6px; font-size: 15px; cursor: pointer;"
            onmouseover="this.style.backgroundColor='#16a34a'"
            onmouseout="this.style.backgroundColor='#22c55e'"
          >
            ✓ Save This
          </button>
          <button
            @click="copyToClipboard"
            style="flex: 1; padding: 14px 16px; background-color: #3b82f6; color: white; font-weight: bold; border: none; border-radius: 6px; font-size: 15px; cursor: pointer;"
            onmouseover="this.style.backgroundColor='#1d4ed8'"
            onmouseout="this.style.backgroundColor='#3b82f6'"
          >
            {{ hasCopied ? '✓ Copied!' : '📋 Copy' }}
          </button>
        </div>
      </div>

      <!-- Generate Button (only show if AI is configured) -->
      <button
        v-if="props.taskConfig?.ai"
        @click="generateAI"
        :disabled="isGenerating || !isFormValid"
        class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-lg transition font-medium text-sm flex items-center justify-center gap-2"
      >
        <svg v-if="!isGenerating" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
        <svg v-else class="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ isGenerating ? 'Generating...' : 'Generate with AI' }}
      </button>

      <!-- AI Output -->
      <div v-if="aiOutput" class="mt-4">
        <div class="flex justify-between items-center mb-3">
          <h5 class="font-semibold text-gray-900">Generated Output</h5>
          <button
            @click="regenerateAI"
            :disabled="isGenerating"
            class="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-800 rounded transition"
          >
            🔄 Regenerate
          </button>
        </div>

        <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div v-if="typeof aiOutput === 'string'" class="text-sm text-gray-700 whitespace-pre-wrap">
            {{ aiOutput }}
          </div>
          <div v-else-if="Array.isArray(aiOutput)" class="space-y-3">
            <div
              v-for="(item, idx) in aiOutput"
              :key="idx"
              class="bg-white border border-gray-200 rounded p-3"
            >
              <div v-if="typeof item === 'string'" class="text-sm text-gray-700">{{ item }}</div>
              <div v-else class="text-sm text-gray-700">
                <pre>{{ JSON.stringify(item, null, 2) }}</pre>
              </div>
            </div>
          </div>
          <div v-else class="text-sm text-gray-700">
            <pre>{{ JSON.stringify(aiOutput, null, 2) }}</pre>
          </div>
        </div>

        <!-- Copy and Use Buttons -->
        <div class="mt-3 flex gap-2">
          <button
            @click="copyToClipboard"
            class="flex-1 px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition"
          >
            {{ hasCopied ? '✓ Copied!' : '📋 Copy' }}
          </button>
          <button
            @click="useAIOutput"
            class="flex-1 px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded transition"
          >
            ✓ Use This
          </button>
        </div>
      </div>
    </div>

    <!-- Output/Results Section -->
    <div v-if="taskConfig.output?.enabled !== false && savedItems.length" class="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <div class="flex justify-between items-center mb-4">
        <h4 class="font-semibold text-gray-900">Saved Results</h4>
        <button
          v-if="taskConfig.output?.exportable !== false"
          @click="exportResults"
          class="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition"
        >
          📥 Export
        </button>
      </div>

      <div class="space-y-3">
        <div
          v-for="(item, idx) in savedItems"
          :key="idx"
          class="bg-white border border-gray-200 rounded-lg p-4"
        >
          <div class="flex justify-between items-start gap-4">
            <div class="flex-1 min-w-0">
              <div v-if="typeof item === 'string'" class="text-sm text-gray-700 break-words">
                {{ item }}
              </div>
              <div v-else-if="item.content" class="text-sm text-gray-700 break-words">
                {{ item.content }}
              </div>
              <div v-else class="text-sm text-gray-700 break-words">
                <pre>{{ JSON.stringify(item, null, 2) }}</pre>
              </div>
            </div>

            <div class="flex gap-2 flex-shrink-0">
              <button
                v-if="taskConfig.output?.copyable !== false"
                @click="copyItem(idx)"
                class="p-2 text-gray-500 hover:text-gray-700"
                title="Copy"
              >
                📋
              </button>
              <button
                v-if="taskConfig.output?.deletable !== false"
                @click="deleteItem(idx)"
                class="p-2 text-red-500 hover:text-red-700"
                title="Delete"
              >
                🗑
              </button>
            </div>
          </div>

          <p v-if="item.timestamp" class="text-xs text-gray-500 mt-2">
            {{ new Date(item.timestamp).toLocaleString() }}
          </p>
        </div>
      </div>

      <button
        v-if="savedItems.length"
        @click="clearResults"
        class="mt-4 w-full px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition"
      >
        Clear All
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useProjectStore } from '../stores/projectStore'
import { generateAIContent } from '@/services/aiGeneration'

const props = defineProps({
  taskId: {
    type: String,
    required: true
  },
  taskConfig: {
    type: Object,
    required: true
  },
  initialData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['save', 'update'])

const projectStore = useProjectStore()

// Form State
const formData = ref({ ...props.initialData?.formData || {} })
const fieldErrors = ref({})

// AI State
const aiOutput = ref(null)
const isGenerating = ref(false)
const aiError = ref('')
const aiSuccess = ref('')

// Results State
const savedItems = ref([...(props.initialData?.savedItems || [])])
const hasCopied = ref(false)

// Computed Properties
const visibleFields = computed(() => {
  return props.taskConfig.form?.filter(field => {
    if (!field.visibleIf) return true
    return field.visibleIf(formData.value)
  }) || []
})

const isFormValid = computed(() => {
  // Check required fields
  for (const field of props.taskConfig.form || []) {
    if (field.required && !formData.value[field.id]) {
      return false
    }
    // Run custom validation
    if (field.validate) {
      const result = field.validate(formData.value[field.id])
      if (result !== true) return false
    }
  }
  return true
})

// Methods
const updateField = (fieldId, value) => {
  formData.value[fieldId] = value
  // Clear error for this field
  if (fieldErrors[fieldId]) {
    delete fieldErrors[fieldId]
  }
  saveState()
}

const updateCheckboxField = (fieldId, optionValue, isChecked) => {
  if (!formData.value[fieldId]) {
    formData.value[fieldId] = []
  }
  if (isChecked) {
    if (!formData.value[fieldId].includes(optionValue)) {
      formData.value[fieldId].push(optionValue)
    }
  } else {
    formData.value[fieldId] = formData.value[fieldId].filter(v => v !== optionValue)
  }
  saveState()
}

const generateAI = async () => {
  console.log('[UnifiedTaskComponent] generateAI called')
  console.log('[UnifiedTaskComponent] isFormValid:', isFormValid.value)
  console.log('[UnifiedTaskComponent] taskConfig:', props.taskConfig)

  // Check if AI is configured for this task
  if (!props.taskConfig?.ai) {
    aiError.value = 'This task does not have AI generation configured'
    return
  }

  if (!isFormValid.value) {
    aiError.value = 'Please fill in all required fields'
    return
  }

  console.log('[UnifiedTaskComponent] Starting generation...')
  isGenerating.value = true
  aiError.value = ''
  aiSuccess.value = ''

  try {
    // Build prompt from template
    let prompt = props.taskConfig.ai.template

    // Replace form field placeholders
    const processedData = { ...formData.value }

    // Handle special transformations
    if (processedData.platforms && Array.isArray(processedData.platforms)) {
      const platformLabels = {
        twitter: 'X (Twitter)',
        linkedin: 'LinkedIn',
        instagram: 'Instagram',
        facebook: 'Facebook'
      }
      processedData.platforms_list = processedData.platforms
        .map(p => platformLabels[p] || p)
        .join(', ')
    }

    // Replace all placeholders
    for (const [key, value] of Object.entries(processedData)) {
      const placeholder = `{${key}}`
      if (prompt.includes(placeholder)) {
        prompt = prompt.replace(new RegExp(placeholder, 'g'), value || '')
      }
    }

    // Add context if provided
    if (props.taskConfig.ai.contextProvider) {
      const context = props.taskConfig.ai.contextProvider()
      for (const [key, value] of Object.entries(context)) {
        const placeholder = `{${key}}`
        prompt = prompt.replace(new RegExp(placeholder, 'g'), value || '')
      }
    }

    // Call AI generation service
    const config = {
      id: props.taskId,
      aiConfig: {
        promptTemplate: props.taskConfig.ai.template,
        temperature: props.taskConfig.ai.temperature || 0.8,
        maxTokens: props.taskConfig.ai.maxTokens || 2000,
        model: props.taskConfig.ai.model || 'grok-2',
        contextProvider: props.taskConfig.ai.contextProvider
      }
    }

    const responseText = await generateAIContent(config, processedData)
    console.log('[UnifiedTaskComponent] Raw responseText:', responseText.substring(0, 200) + '...')

    // Parse response if parser provided
    let output = responseText
    if (props.taskConfig.ai.responseParser) {
      console.log('[UnifiedTaskComponent] Using custom responseParser')
      output = props.taskConfig.ai.responseParser(responseText)
      console.log('[UnifiedTaskComponent] Parsed output:', output)
    } else {
      console.log('[UnifiedTaskComponent] No responseParser, using raw text')
    }

    // Validate response if validator provided
    if (props.taskConfig.ai.validateResponse) {
      const validationResult = props.taskConfig.ai.validateResponse(output)
      if (validationResult !== true) {
        throw new Error(validationResult || 'Invalid AI response')
      }
    }

    aiOutput.value = output
    console.log('[UnifiedTaskComponent] aiOutput.value set to:', aiOutput.value)

    // Automatically copy to clipboard
    if (output) {
      try {
        const textToCopy = typeof output === 'string' ? output : JSON.stringify(output, null, 2)
        await navigator.clipboard.writeText(textToCopy)
        console.log('[UnifiedTaskComponent] Auto-copied to clipboard')
        aiSuccess.value = '✓ Generated & Copied to clipboard! Click "Use This" to save.'
      } catch (err) {
        console.error('[UnifiedTaskComponent] Auto-copy failed:', err)
        aiSuccess.value = 'Generated successfully! Click "Use This" to save.'
      }
    } else {
      aiSuccess.value = 'Generated successfully! Click "Use This" to save.'
    }
  } catch (err) {
    console.error('AI generation error:', err)
    // Check if it's a quota error
    if (err.message && err.message.includes('quota')) {
      aiError.value = 'AI generation quota exceeded. Please upgrade your plan or try again later.'
    } else {
      aiError.value = err.message || 'Error generating content'
    }
  } finally {
    isGenerating.value = false
  }
}

const regenerateAI = async () => {
  aiOutput.value = null
  await generateAI()
}

const useAIOutput = () => {
  if (!aiOutput.value) return

  // Add to saved items
  if (typeof aiOutput.value === 'object' && !Array.isArray(aiOutput.value)) {
    savedItems.value.push({
      ...aiOutput.value,
      timestamp: new Date().toISOString()
    })
  } else if (Array.isArray(aiOutput.value)) {
    for (const item of aiOutput.value) {
      savedItems.value.push({
        ...item,
        timestamp: new Date().toISOString()
      })
    }
  } else {
    savedItems.value.push({
      content: aiOutput.value,
      timestamp: new Date().toISOString()
    })
  }

  aiSuccess.value = 'Saved to results!'
  saveState()
}

const handleSaveClick = async () => {
  console.log('[UnifiedTaskComponent] Save button clicked at', new Date().toISOString())
  console.log('[UnifiedTaskComponent] aiOutput.value:', aiOutput.value)
  console.log('[UnifiedTaskComponent] aiOutput type:', typeof aiOutput.value)
  if (aiOutput.value) {
    if (typeof aiOutput.value === 'string') {
      console.log('[UnifiedTaskComponent] String length:', aiOutput.value.length)
      console.log('[UnifiedTaskComponent] First 200 chars:', aiOutput.value.substring(0, 200))
    } else {
      console.log('[UnifiedTaskComponent] Is Array:', Array.isArray(aiOutput.value))
      console.log('[UnifiedTaskComponent] Object keys:', Object.keys(aiOutput.value))
    }
  }

  if (!aiOutput.value) {
    console.warn('[UnifiedTaskComponent] aiOutput is null/undefined, cannot save')
    aiError.value = 'Nothing to save - generate content first'
    return
  }

  try {
    // Copy to clipboard
    let textToCopy = ''
    if (Array.isArray(aiOutput.value)) {
      // For posts/array items, format them nicely
      textToCopy = aiOutput.value
        .map((item) => {
          if (item.platform && item.content) {
            return `[${item.platform}]\n${item.content}`
          }
          return typeof item === 'string' ? item : JSON.stringify(item, null, 2)
        })
        .join('\n\n---\n\n')
    } else {
      textToCopy = typeof aiOutput.value === 'string'
        ? aiOutput.value
        : JSON.stringify(aiOutput.value, null, 2)
    }

    // Copy to clipboard
    await navigator.clipboard.writeText(textToCopy)
    console.log('[UnifiedTaskComponent] Copied to clipboard')

    // Save to results section
    useAIOutput()

    // Update success message
    aiSuccess.value = '✓ Saved & Copied to clipboard!'

    // Clear the success message after a delay so user sees feedback
    setTimeout(() => {
      aiSuccess.value = ''
    }, 3000)
  } catch (err) {
    console.error('[UnifiedTaskComponent] Save/copy failed:', err)
    aiError.value = '❌ Error: Could not save'
    setTimeout(() => {
      aiError.value = ''
    }, 2000)
  }
}

const copyToClipboard = async () => {
  try {
    if (!aiOutput.value) {
      aiError.value = 'Nothing to copy - generate content first'
      return
    }
    const text = typeof aiOutput.value === 'string'
      ? aiOutput.value
      : JSON.stringify(aiOutput.value, null, 2)
    await navigator.clipboard.writeText(text)
    hasCopied.value = true
    setTimeout(() => { hasCopied.value = false }, 2000)
  } catch (err) {
    console.error('Copy failed:', err)
    aiError.value = 'Failed to copy to clipboard'
  }
}

const copyItem = async (idx) => {
  const item = savedItems.value[idx]
  const text = typeof item === 'string' ? item : JSON.stringify(item, null, 2)
  try {
    await navigator.clipboard.writeText(text)
    aiSuccess.value = 'Copied to clipboard!'
    setTimeout(() => { aiSuccess.value = '' }, 2000)
  } catch (err) {
    console.error('Copy failed:', err)
  }
}

const deleteItem = (idx) => {
  savedItems.value.splice(idx, 1)
  saveState()
}

const clearResults = () => {
  if (confirm('Clear all results? This cannot be undone.')) {
    savedItems.value = []
    saveState()
  }
}

const exportResults = () => {
  const filename = props.taskConfig.output?.exportFilename || props.taskId
  const json = JSON.stringify(savedItems.value, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const saveState = () => {
  emit('save', {
    formData: formData.value,
    aiOutput: aiOutput.value,
    savedItems: savedItems.value
  })

  // Auto-save to project store
  projectStore.updateTaskData(props.taskId, {
    formData: formData.value,
    savedItems: savedItems.value
  })
}

// Watchers
watch(() => props.initialData, (newData) => {
  if (newData?.formData) {
    formData.value = { ...newData.formData }
  }
  if (newData?.savedItems) {
    savedItems.value = [...newData.savedItems]
  }
}, { deep: true })
</script>

<style scoped>
pre {
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 8px;
  font-size: 12px;
  overflow-x: auto;
}
</style>
