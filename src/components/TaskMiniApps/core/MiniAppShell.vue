<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="mb-6">
      <h3 class="text-lg font-bold text-gray-900">{{ taskConfig.title }}</h3>
      <p v-if="taskConfig.description" class="text-sm text-gray-600 mt-1">{{ taskConfig.description }}</p>
    </div>

    <!-- Form Section -->
    <FormBuilder
      v-if="taskConfig.formFields"
      ref="formBuilder"
      :title="taskConfig.formTitle || 'Configuration'"
      :fields="taskConfig.formFields"
      :initial-data="formData"
      @update:data="formData = $event"
    />

    <!-- AI Generation Section -->
    <AIPanel
      v-if="taskConfig.aiConfig"
      :is-valid="isFormValid"
      :generate-fn="generateAIOutput"
      @output="aiOutput = $event"
      @use="useAIOutput"
    >
      <template #output="{ output }">
        <slot name="ai-output" :output="output">
          <p class="whitespace-pre-wrap">{{ output }}</p>
        </slot>
      </template>
    </AIPanel>

    <!-- Output Section -->
    <OutputSection
      v-if="taskConfig.showOutput"
      :items="savedItems"
      :export-filename="taskConfig.exportFilename || taskConfig.id"
      @update:items="savedItems = $event"
      @remove="handleRemoveItem"
      @clear="handleClear"
    />

    <!-- Additional Content Slot -->
    <slot name="content"></slot>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import FormBuilder from '../shared/FormBuilder.vue'
import AIPanel from '../shared/AIPanel.vue'
import OutputSection from '../shared/OutputSection.vue'

const props = defineProps({
  taskConfig: {
    type: Object,
    required: true
  },
  taskData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['save', 'output'])

// State
const formBuilder = ref(null)
const formData = ref({ ...props.taskData.formData || {} })
const aiOutput = ref(null)
const savedItems = ref([...(props.taskData.savedItems || [])])

// Computed
const isFormValid = computed(() => {
  if (!formBuilder.value) return true
  return formBuilder.value.validate()
})

// Watch form data changes
watch(
  () => formData.value,
  (newData) => {
    emit('save', {
      formData: newData,
      aiOutput: aiOutput.value,
      savedItems: savedItems.value
    })
  },
  { deep: true }
)

// Watch initial task data changes
watch(
  () => props.taskData,
  (newData) => {
    if (newData.formData) {
      formData.value = { ...newData.formData }
    }
    if (newData.savedItems) {
      savedItems.value = [...newData.savedItems]
    }
  },
  { deep: true }
)

// Generate AI output
const generateAIOutput = async () => {
  console.log('[MiniAppShell] Generate clicked')
  console.log('[MiniAppShell] formData:', formData.value)
  console.log('[MiniAppShell] taskConfig:', props.taskConfig)

  const { aiConfig } = props.taskConfig
  console.log('[MiniAppShell] aiConfig:', aiConfig)

  if (!aiConfig) {
    throw new Error('No aiConfig found in taskConfig')
  }

  // Build prompt
  let prompt = aiConfig.promptTemplate
  console.log('[MiniAppShell] Original prompt template:', prompt)

  // Prepare form data with any transformations
  const processedFormData = { ...formData.value }
  console.log('[MiniAppShell] Processed form data:', processedFormData)

  // Convert platforms array to comma-separated list
  if (processedFormData.platforms && Array.isArray(processedFormData.platforms)) {
    const platformLabels = {
      twitter: 'X (Twitter)',
      linkedin: 'LinkedIn',
      instagram: 'Instagram',
      facebook: 'Facebook'
    }
    processedFormData.platforms_list = processedFormData.platforms
      .map(p => platformLabels[p] || p)
      .join(', ')
  }

  // Replace placeholders
  console.log('[MiniAppShell] Replacing placeholders...')
  for (const [key, value] of Object.entries(processedFormData)) {
    const placeholder = `{${key}}`
    if (prompt.includes(placeholder)) {
      console.log('[MiniAppShell] Replacing', placeholder, 'with', value)
      prompt = prompt.replace(new RegExp(placeholder, 'g'), value || '')
    }
  }
  console.log('[MiniAppShell] Final prompt:', prompt)

  // Add context
  if (aiConfig.contextProvider) {
    const context = aiConfig.contextProvider()
    for (const [key, value] of Object.entries(context)) {
      const placeholder = `{${key}}`
      prompt = prompt.replace(new RegExp(placeholder, 'g'), value || '')
    }
  }

  try {
    console.log('[MiniAppShell] Calling Grok API...')
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
        temperature: aiConfig.temperature || 0.8,
        max_tokens: aiConfig.maxTokens || 2000
      })
    })

    console.log('[MiniAppShell] API response status:', response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('[MiniAppShell] API error response:', errorData)
      throw new Error(errorData.error || `API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('[MiniAppShell] API response data:', data)

    const responseText = data.choices?.[0]?.message?.content

    if (!responseText) {
      throw new Error('No content received from AI')
    }

    console.log('[MiniAppShell] Response text:', responseText)

    // Parse response if needed
    let output = responseText
    if (aiConfig.parseResponse) {
      console.log('[MiniAppShell] Parsing response...')
      output = aiConfig.parseResponse(responseText)
    }

    console.log('[MiniAppShell] Final output:', output)
    return output
  } catch (err) {
    console.error('[MiniAppShell] AI generation error:', err)
    throw err
  }
}

// Use AI output
const useAIOutput = (output) => {
  if (!output) return

  // Add to saved items if it's a structured output
  if (typeof output === 'object' && !Array.isArray(output)) {
    savedItems.value.push({
      ...output,
      timestamp: new Date().toISOString()
    })
  } else if (Array.isArray(output)) {
    savedItems.value.push(...output)
  } else {
    // For string outputs
    savedItems.value.push({
      content: output,
      label: `Output - ${new Date().toLocaleString()}`,
      timestamp: new Date().toISOString()
    })
  }

  emit('save', {
    formData: formData.value,
    aiOutput: output,
    savedItems: savedItems.value
  })
}

const handleRemoveItem = (index) => {
  emit('save', {
    formData: formData.value,
    aiOutput: aiOutput.value,
    savedItems: savedItems.value
  })
}

const handleClear = () => {
  emit('save', {
    formData: formData.value,
    aiOutput: aiOutput.value,
    savedItems: savedItems.value
  })
}

// Expose methods
defineExpose({
  formData,
  aiOutput,
  savedItems,
  isFormValid
})
</script>

<style scoped>
</style>
