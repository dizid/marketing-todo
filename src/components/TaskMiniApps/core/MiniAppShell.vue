<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="mb-6">
      <h3 class="text-lg font-bold text-gray-900">{{ taskConfig.title }}</h3>
      <p v-if="taskConfig.description" class="text-sm text-gray-600 mt-1">{{ taskConfig.description }}</p>
    </div>

    <!-- Help Panel -->
    <HelpPanel
      v-if="taskConfig.help"
      :help="taskConfig.help"
      :taskId="taskConfig.id"
      @help-viewed="handleHelpViewed"
      @feedback="handleHelpFeedback"
    />

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
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { generateAIContent } from '../../../services/aiGeneration.js'
import { useFormFieldInheritance } from '../../../composables/useFormFieldInheritance'
import FormBuilder from '../shared/FormBuilder.vue'
import AIPanel from '../shared/AIPanel.vue'
import OutputSection from '../shared/OutputSection.vue'
import HelpPanel from '../shared/HelpPanel.vue'
import { useProjectStore } from '@/stores/projectStore'

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

const projectStore = useProjectStore()
const route = useRoute()

// State
const formBuilder = ref(null)
const formData = ref({ ...props.taskData.formData || {} })
const inheritanceMetadata = ref({})

// Initialize field inheritance if fieldMappings are configured
const initializeInheritance = async () => {
  if (!props.taskConfig.fieldMappings) return

  const projectId = projectStore.currentProject?.id
  const taskId = route.params.taskId

  if (!projectId || !taskId) return

  try {
    // Use new useFormFieldInheritance adapter composable
    const fieldInheritance = useFormFieldInheritance(projectId, {
      fieldMappings: props.taskConfig.fieldMappings,
      requiredFields: []
    })

    // Initialize the composable
    await fieldInheritance.initialize()

    // Merge inherited values with current form data (current values take precedence)
    const currentData = formData.value
    const inheritedFields = fieldInheritance.inheritedFields
    const mergedData = { ...currentData }

    // Apply inherited fields that aren't already in form data
    Object.entries(inheritedFields.value).forEach(([fieldId, fieldInfo]) => {
      if (!(fieldId in mergedData) || mergedData[fieldId] === null || mergedData[fieldId] === undefined) {
        mergedData[fieldId] = fieldInfo.value
      }
    })
    formData.value = mergedData

    // Store inheritance metadata for UI indicators
    inheritanceMetadata.value = fieldInheritance.getSummary
  } catch (err) {
    console.error('[MiniAppShell] Error initializing field inheritance:', err)
    // Silently fail - inheritance is optional enhancement
  }
}
const aiOutput = ref(null)
const savedItems = ref([...(props.taskData.savedItems || [])])

// Computed
const isFormValid = computed(() => {
  if (!formBuilder.value) return true
  return formBuilder.value.validate()
})

// Debouncing for form save - prevents database overload from rapid typing
// Each keystroke delays the save by 500ms. If user types again within 500ms,
// the previous save is cancelled and a new 500ms timer starts.
// This ensures: 5 characters typed in 500ms = 1 save (not 5 saves)
let saveTimeout = null

const emitSave = (newData) => {
  emit('save', {
    formData: newData,
    aiOutput: aiOutput.value,
    savedItems: savedItems.value
  })
}

const debouncedSave = (newData) => {
  // Cancel previous save if still pending
  if (saveTimeout) {
    clearTimeout(saveTimeout)
  }

  // Schedule new save after 500ms of inactivity
  saveTimeout = setTimeout(() => {
    emitSave(newData)
    saveTimeout = null
  }, 500)
}

// Initialize inheritance on mount
onMounted(() => {
  initializeInheritance()
})

// Watch for changes to taskConfig fieldMappings
watch(
  () => props.taskConfig?.fieldMappings,
  () => {
    initializeInheritance()
  }
)

// Watch form data changes with debouncing
// CRITICAL: Deep watch triggers on ANY nested property change
// Without debouncing: typing one character = 1 watch fire = 1 database save
// With debouncing: typing 5 characters in 500ms = 1 database save
watch(
  () => formData.value,
  (newData) => {
    debouncedSave(newData)
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

// Handle help panel viewed event
const handleHelpViewed = (data) => {
  console.log(`[MiniAppShell] Help panel viewed for task: ${data.taskId}`)
}

// Handle help feedback event
const handleHelpFeedback = (data) => {
  console.log(`[MiniAppShell] Help feedback received for task: ${data.taskId}, helpful: ${data.helpful}`)
}

// Cleanup debounce timer on unmount
// Critical: Prevents orphaned timers from trying to emit after component destroyed
onBeforeUnmount(() => {
  if (saveTimeout) {
    clearTimeout(saveTimeout)
    saveTimeout = null
  }
})

// Expose methods
defineExpose({
  formData,
  aiOutput,
  savedItems,
  isFormValid,
  inheritanceMetadata
})
</script>

<style scoped>
</style>
