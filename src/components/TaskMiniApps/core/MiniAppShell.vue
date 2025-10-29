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
      :generateFn="generateAIOutput"
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
import { generateAIContent } from '../../../services/aiGeneration.js'
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

// Generate AI output using centralized service
const generateAIOutput = async () => {
  console.log('[MiniAppShell] Generate clicked, using AI generation service')
  console.log('[MiniAppShell] formData:', formData.value)

  try {
    // Use centralized AI generation service
    const output = await generateAIContent(props.taskConfig, formData.value)
    console.log('[MiniAppShell] AI generation completed, output:', output)
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
