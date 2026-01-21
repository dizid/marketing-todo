<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="mb-6">
      <h3 class="text-lg font-bold text-gray-900">{{ taskConfig.title }}</h3>
      <p v-if="taskConfig.description" class="text-sm text-gray-600 mt-1">{{ taskConfig.description }}</p>
    </div>

    <!-- Phase 6 Task 6.2: Inherited Fields Changed Banner -->
    <div v-if="inheritanceSourceChanged" class="p-3 bg-blue-50 border border-blue-300 rounded-lg flex items-start gap-3">
      <span class="text-lg flex-shrink-0">🔄</span>
      <div class="flex-1">
        <p class="text-sm font-medium text-blue-900">Project settings have changed</p>
        <p class="text-sm text-blue-700 mt-1">Some inherited fields may have updated values from your project context.</p>
        <button
          @click="reloadInheritedFields"
          class="mt-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Reload Inherited Values
        </button>
        <button
          @click="dismissInheritanceNotice"
          class="mt-2 ml-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>

    <!-- Validation Error Banner (Phase 3 Task 3.3) -->
    <div v-if="validationError" class="p-3 bg-amber-50 border border-amber-300 rounded-lg flex items-start gap-3">
      <span class="text-lg flex-shrink-0">⚠️</span>
      <div>
        <p class="text-sm font-medium text-amber-900">Cannot save with validation errors</p>
        <p class="text-sm text-amber-800 mt-1">{{ validationError }}</p>
      </div>
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
import { generateAIContent } from '../../../services/aiGeneration.js'
import { useUnsavedChanges } from '../../../composables/useUnsavedChanges'
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

// State
const formBuilder = ref(null)
const formData = ref({ ...props.taskData.formData || {} })
const inheritanceMetadata = ref({})
const validationError = ref(null)

// Phase 6 Task 6.2: Track if inheritance sources have changed
const inheritanceSourceChanged = ref(false)
const lastKnownSettingsSnapshot = ref(null)

// Phase 3 Task 3.5: Track unsaved changes
const unsavedChanges = useUnsavedChanges(props.taskData.formData || {})

// Simple pre-fill from project settings (replaces complex inheritance system)
// Reads directly from projectStore.currentProjectSettings for reliable data
const prefillFromProject = (forceReload = false) => {
  if (!props.taskConfig.fieldMappings) return

  const settings = projectStore.currentProjectSettings || {}
  const newFormData = { ...formData.value }

  // Map canonical field names to settings properties
  // These are the fields users fill in during onboarding
  const settingsMap = {
    'productDescription': settings.productDescription || settings.description || '',
    'targetAudience': settings.targetAudience || '',
    'primaryGoal': settings.primaryGoal || settings.goals || '',
    'productName': settings.productName || projectStore.projectName || '',
    'techStack': settings.techStack || '',
    'marketingBudget': settings.marketingBudget || '',
    'teamSize': settings.teamSize || '',
    'targetTimeline': settings.targetTimeline || settings.timeline || ''
  }

  // Pre-fill form fields based on config mappings
  Object.entries(props.taskConfig.fieldMappings).forEach(([formFieldId, canonicalField]) => {
    if (!canonicalField) return // null mapping = don't inherit this field

    const currentValue = newFormData[formFieldId]
    const inheritedValue = settingsMap[canonicalField]

    // Only fill if: forceReload OR field is empty/null/undefined
    if (forceReload || currentValue === null || currentValue === undefined || currentValue === '') {
      if (inheritedValue) {
        newFormData[formFieldId] = inheritedValue
      }
    }
  })

  formData.value = newFormData

  // Snapshot settings for change detection
  lastKnownSettingsSnapshot.value = JSON.stringify(settings)
  inheritanceSourceChanged.value = false
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
  // SSOT Phase 4: Emit save event with form data and saved items
  // NOTE: aiOutput is passed but NOT persisted to database (regenerate on demand)
  // The projectStore.updateTaskData() strips aiOutput before saving to:
  // 1. task_form_data table (normalized storage - SSOT)
  // 2. project_data blob (legacy, for migration safety)
  emit('save', {
    formData: newData,
    aiOutput: aiOutput.value,       // For UI state only, not persisted
    savedItems: savedItems.value
  })

  // Phase 3 Task 3.5: Mark as clean after save
  unsavedChanges.updateSavedState(newData)
}

const debouncedSave = (newData) => {
  // Cancel previous save if still pending
  if (saveTimeout) {
    clearTimeout(saveTimeout)
  }

  // Schedule new save after 500ms of inactivity
  saveTimeout = setTimeout(() => {
    // Phase 3 Task 3.3: Validate before saving
    if (!isFormValid.value) {
      // Get validation errors from FormBuilder
      if (formBuilder.value && formBuilder.value.errors && formBuilder.value.errors.length > 0) {
        validationError.value = formBuilder.value.errors[0]
      } else {
        validationError.value = 'Please fill all required fields before saving'
      }
      saveTimeout = null
      return
    }

    // Clear validation error if form becomes valid
    validationError.value = null
    emitSave(newData)
    saveTimeout = null
  }, 500)
}

// Pre-fill form fields from project settings on mount
onMounted(() => {
  prefillFromProject()
})

// Watch for changes to taskConfig fieldMappings
watch(
  () => props.taskConfig?.fieldMappings,
  () => {
    prefillFromProject()
  }
)

// Phase 6 Task 6.2: Watch for project settings changes
// When project context changes while a task is open, show notification
watch(
  () => projectStore.currentProjectSettings,
  (newSettings) => {
    // Only check if task has fieldMappings (uses inheritance)
    if (!props.taskConfig.fieldMappings) return

    // Skip if no previous snapshot (first load)
    if (!lastKnownSettingsSnapshot.value) return

    // Compare with snapshot to detect actual changes
    const newSnapshot = JSON.stringify(newSettings || {})
    if (newSnapshot !== lastKnownSettingsSnapshot.value) {
      // Settings have changed - show notification
      inheritanceSourceChanged.value = true
      console.log('[MiniAppShell] Project settings changed while task open')
    }
  },
  { deep: true }
)

// Reload inherited fields with new values from project settings
const reloadInheritedFields = () => {
  prefillFromProject(true) // forceReload = true
  console.log('[MiniAppShell] Form fields reloaded from project settings')
}

// Phase 6 Task 6.2: Dismiss the notification without reloading
const dismissInheritanceNotice = () => {
  // Update snapshot to current state (ignore the changes)
  lastKnownSettingsSnapshot.value = JSON.stringify(projectStore.currentProjectSettings || {})
  inheritanceSourceChanged.value = false
}

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

// Phase 3 Task 3.3: Watch form validity and clear validation error when form becomes valid
watch(
  () => isFormValid.value,
  (newValid) => {
    if (newValid) {
      validationError.value = null
    }
  }
)

// Phase 3 Task 3.5: Watch form data changes and mark as dirty (unsaved)
watch(
  () => formData.value,
  (newData) => {
    unsavedChanges.markDirty()
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
  inheritanceMetadata,
  validationError,
  // Phase 3 Task 3.5: Expose unsaved changes state
  isDirty: unsavedChanges.isDirty,
  hasUnsavedChanges: () => unsavedChanges.isDirty.value,
  getUnsavedWarning: unsavedChanges.getWarningMessage,
  // Phase 6 Task 6.2: Expose inheritance change detection
  inheritanceSourceChanged,
  reloadInheritedFields,
  dismissInheritanceNotice
})
</script>

<style scoped>
</style>
