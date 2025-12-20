<template>
  <!-- Checklist Item Component
       Individual task item with checkbox, description, notes, and AI generation button
       Features: Toggle state, edit notes, AI content generation
  -->
  <div class="px-6 py-4 hover:bg-surface-light transition" style="border-bottom: 1px solid var(--cyberpunk-border)">
    <!-- Task Header Row -->
    <div class="flex items-start gap-3">
      <!-- Checkbox -->
      <input
        type="checkbox"
        :id="`task-${item.id}`"
        :checked="taskData.checked"
        @change="handleCheckChange"
        class="mt-1 w-5 h-5 cursor-pointer accent-primary"
      />

      <!-- Task Content -->
      <div class="flex-1 min-w-0">
        <!-- Task Name and Description -->
        <label :for="`task-${item.id}`" class="cursor-pointer block">
          <h4
            class="font-semibold transition font-body text-text"
            :class="{ 'line-through text-muted': taskData.checked }"
          >
            {{ item.name }}
          </h4>
          <p class="text-sm text-secondary mt-1">{{ item.description }}</p>
        </label>

        <!-- Action Buttons -->
        <div class="mt-3 flex gap-2 items-center justify-between flex-wrap">
          <div class="flex gap-2 flex-wrap">
            <!-- Special Button for Landing Page Builder -->
            <button
              v-if="item.id === 'setup-2'"
              @click="handleOpenMiniApp"
              class="inline-flex items-center gap-2 btn-primary text-xs sm:text-sm"
              title="Start the landing page builder wizard"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              ✨ Landing Page Builder
            </button>

            <!-- Standard Button for Other Mini-Apps -->
            <button
              v-else-if="item.miniAppId"
              @click="handleOpenMiniApp"
              class="inline-flex items-center gap-2 btn-highlight text-xs sm:text-sm"
              title="Open full mini-app with form and AI generation"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
              Start Task
            </button>

            <button
              v-if="item.hasAI && !item.miniAppId"
              @click="handleGenerateAI"
              :disabled="isGenerating"
              class="inline-flex items-center gap-2 btn-accent text-xs sm:text-sm disabled:opacity-50"
            >
              <svg v-if="!isGenerating" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              <svg v-else class="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isGenerating ? 'Generating...' : 'AI' }}
            </button>

            <p v-if="item.hasAI && !item.miniAppId" class="text-xs text-muted self-center">
              AI enabled
            </p>
          </div>

          <button
            @click="handleRemoveTask"
            class="inline-flex items-center gap-2 btn-accent text-xs sm:text-sm"
            title="Remove this task from the project (won't count toward progress)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            Archive
          </button>
        </div>
      </div>
    </div>

    <!-- AI Output Modal -->
    <div v-if="showAIModal" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50" @click.self="showAIModal = false">
      <div class="bg-surface rounded-0 shadow-xl max-w-2xl w-full border-2 border-primary" @click.stop>
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-border flex justify-between items-center bg-surface-light">
          <h3 class="text-lg font-semibold font-display text-primary">
            AI-Generated Content: {{ item.name }}
          </h3>
          <button
            @click="showAIModal = false"
            class="text-secondary hover:text-primary transition"
          >
            ✕
          </button>
        </div>

        <!-- Modal Content -->
        <div class="px-6 py-4" @click.stop>
          <div v-if="aiError" class="mb-4 p-3 bg-accent/20 border border-accent rounded-0">
            <p class="text-sm text-accent">{{ aiError }}</p>
            <button
              @click="handleGenerateAI"
              :disabled="isGenerating"
              class="mt-2 btn-accent text-sm"
            >
              {{ isGenerating ? 'Retrying...' : 'Retry' }}
            </button>
          </div>

          <textarea
            :value="aiOutput"
            @input="handleAIOutputChange"
            @click.stop
            class="w-full px-4 py-3 border border-border bg-surface-light text-text outline-none transition min-h-[200px] resize-vertical font-mono text-sm"
          ></textarea>

          <p class="text-xs text-muted mt-2">
            Edit the generated content as needed, then copy to use elsewhere
          </p>
        </div>

        <!-- Modal Actions -->
        <div class="px-6 py-4 bg-surface-light border-t border-border flex justify-end gap-3">
          <button
            @click="copyAIOutput"
            class="btn-primary"
          >
            📋 Copy to Clipboard
          </button>
          <button
            @click="showAIModal = false"
            class="btn-ghost"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * ChecklistItem Component
 *
 * Renders an individual task item with:
 * - Checkbox for completion state
 * - Task description
 * - Notes field for custom annotations
 * - AI content generation (if applicable)
 * - Modal for viewing/editing AI output
 */

import { ref, computed, onBeforeUnmount } from 'vue'
import { generateAIContent } from '@/services/aiGeneration'
import { useProjectStore } from '@/stores/projectStore'

// Props
const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  taskData: {
    type: Object,
    default: () => ({})
  }
})

// Emits
const emit = defineEmits(['task-checked', 'task-removed', 'task-opened'])

// State
const isGenerating = ref(false)
const showAIModal = ref(false)
const aiOutput = ref('')
const aiError = ref('')

// SSOT Phase 5: Get app description from projectStore instead of localStorage
const projectStore = useProjectStore()
const appDescription = computed(() => {
  const settings = projectStore.currentProjectSettings || {}
  return settings.productDescription || settings.appDescription || settings.description || ''
})

// Timeout tracking
let copyResetTimeout = null

/**
 * Handle opening the mini-app modal
 */
const handleOpenMiniApp = () => {
  emit('task-opened', { taskId: props.item.id })
}

/**
 * Handle task removal
 */
const handleRemoveTask = () => {
  emit('task-removed', { id: props.item.id })
}

// SSOT Phase 5: Removed loadAppDescription() - now using computed from projectStore

/**
 * Handle checkbox change
 */
const handleCheckChange = (event) => {
  emit('task-checked', { checked: event.target.checked })
}

/**
 * Handle AI generation button click
 * Uses aiGeneration service with quota checks and tracking
 */
const handleGenerateAI = async () => {
  if (!appDescription.value || appDescription.value.trim().length < 10) {
    aiError.value = 'Please fill in your app description first (minimum 10 characters)'
    return
  }

  isGenerating.value = true
  aiError.value = ''
  aiOutput.value = ''

  try {
    // Show modal with loading state
    showAIModal.value = true
    aiOutput.value = 'Generating content with Grok AI...'

    // Create a config object with the aiPrompt for generateAIContent service
    const config = {
      id: props.item.id,
      aiConfig: {
        promptTemplate: props.item.aiPrompt,
        temperature: 0.7,
        maxTokens: 2000,
        model: 'grok-4-fast'  // Use free tier model by default
      }
    }

    // Create form data with app description
    const formData = {
      'app desc': appDescription.value
    }

    // Use the service - includes quota checks and tracking
    const generatedContent = await generateAIContent(config, formData)

    aiOutput.value = generatedContent
  } catch (error) {
    console.error('[ChecklistItem] AI generation error:', error)
    aiError.value = error.message || 'Failed to generate content. Please try again.'
    aiOutput.value = ''
  } finally {
    isGenerating.value = false
  }
}

/**
 * Handle AI output textarea change
 */
const handleAIOutputChange = (event) => {
  aiOutput.value = event.target.value
}

/**
 * Copy AI output to clipboard
 */
const copyAIOutput = (e) => {
  if (!aiOutput.value) {
    aiError.value = 'Nothing to copy - generate content first'
    return
  }
  navigator.clipboard.writeText(aiOutput.value).then(() => {
    // Show temporary success message
    const button = e.target
    const originalText = button.textContent
    button.textContent = '✓ Copied!'
    copyResetTimeout = setTimeout(() => {
      button.textContent = originalText
    }, 2000)
  }).catch(err => {
    console.error('Failed to copy:', err)
    aiError.value = 'Failed to copy to clipboard'
  })
}

// SSOT Phase 5: Removed loadAppDescription() call - appDescription is now a computed from projectStore

// Cleanup timeout on unmount
onBeforeUnmount(() => {
  if (copyResetTimeout) clearTimeout(copyResetTimeout)
})
</script>

<style scoped>
/* Smooth transitions and hover effects */
input[type="checkbox"] {
  transition: all 0.2s ease-in-out;
}

input[type="checkbox"]:hover {
  transform: scale(1.1);
}

textarea {
  transition: all 0.2s ease-in-out;
}

textarea:hover {
  border-color: #c7d2fe;
}

/* Prevent text selection on repeated double-clicks */
button {
  user-select: none;
}
</style>
