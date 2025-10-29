<template>
  <!-- Checklist Item Component
       Individual task item with checkbox, description, notes, and AI generation button
       Features: Toggle state, edit notes, AI content generation
  -->
  <div class="px-6 py-4 hover:bg-gray-50 transition">
    <!-- Task Header Row -->
    <div class="flex items-start gap-3">
      <!-- Checkbox -->
      <input
        type="checkbox"
        :id="`task-${item.id}`"
        :checked="taskData.checked"
        @change="handleCheckChange"
        class="mt-1 w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
      />

      <!-- Task Content -->
      <div class="flex-1 min-w-0">
        <!-- Task Name and Description -->
        <label :for="`task-${item.id}`" class="cursor-pointer block">
          <h4
            class="font-semibold text-gray-900 transition"
            :class="{ 'line-through text-gray-400': taskData.checked }"
          >
            {{ item.name }}
          </h4>
          <p class="text-sm text-gray-600 mt-1">{{ item.description }}</p>
        </label>

        <!-- Notes Section -->
        <div class="mt-3">
          <label class="text-xs font-medium text-gray-700 block mb-1">
            Notes (optional)
          </label>
          <textarea
            :value="taskData.notes || ''"
            @input="handleNotesChange"
            placeholder="Add notes for this task..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
            rows="2"
          ></textarea>
        </div>

        <!-- Action Buttons -->
        <div class="mt-3 flex gap-2 items-center justify-between">
          <div class="flex gap-2">
            <!-- Special Button for Landing Page Builder -->
            <button
              v-if="item.id === 'setup-2'"
              @click="handleOpenMiniApp"
              class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold rounded transition shadow-md hover:shadow-lg"
              title="Start the landing page builder wizard"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              ✨ Start Landing Page Builder
            </button>

            <!-- Standard Button for Other Mini-Apps -->
            <button
              v-else-if="item.miniAppId"
              @click="handleOpenMiniApp"
              class="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded transition"
              title="Open full mini-app with form and AI generation"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
              Open Full Form
            </button>

            <button
              v-if="item.hasAI && !item.miniAppId"
              @click="handleGenerateAI"
              :disabled="isGenerating"
              class="inline-flex items-center gap-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded transition"
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

            <p v-if="item.hasAI && !item.miniAppId" class="text-xs text-gray-500 self-center">
              Uses your app description in the prompt
            </p>
          </div>

          <button
            @click="handleRemoveTask"
            class="inline-flex items-center gap-2 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded transition"
            title="Remove this task from the project (won't count toward progress)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            Remove
          </button>
        </div>
      </div>
    </div>

    <!-- AI Output Modal -->
    <div v-if="showAIModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click.self="showAIModal = false">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-900">
            AI-Generated Content: {{ item.name }}
          </h3>
          <button
            @click="showAIModal = false"
            class="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <!-- Modal Content -->
        <div class="px-6 py-4">
          <div v-if="aiError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p class="text-sm text-red-800">{{ aiError }}</p>
          </div>

          <textarea
            :value="aiOutput"
            @input="handleAIOutputChange"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition min-h-[200px] resize-vertical font-mono text-sm"
          ></textarea>

          <p class="text-xs text-gray-500 mt-2">
            Edit the generated content as needed, then copy to use elsewhere
          </p>
        </div>

        <!-- Modal Actions -->
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button
            @click="copyAIOutput"
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition font-medium text-sm"
          >
            📋 Copy to Clipboard
          </button>
          <button
            @click="showAIModal = false"
            class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-lg transition font-medium text-sm"
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

import { ref } from 'vue'

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
const emit = defineEmits(['task-checked', 'notes-updated', 'task-removed', 'task-opened'])

// State
const isGenerating = ref(false)
const showAIModal = ref(false)
const aiOutput = ref('')
const aiError = ref('')
const appDescription = ref('')

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

/**
 * Load app description from local storage
 */
const loadAppDescription = () => {
  const stored = localStorage.getItem('marketing-app-data')
  if (stored) {
    const data = JSON.parse(stored)
    appDescription.value = data.appDescription || ''
  }
}

/**
 * Handle checkbox change
 */
const handleCheckChange = (event) => {
  emit('task-checked', { checked: event.target.checked })
}

/**
 * Handle notes textarea change
 */
const handleNotesChange = (event) => {
  emit('notes-updated', { notes: event.target.value })
}

/**
 * Handle AI generation button click
 * Constructs prompt and calls proxy/API
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
    // Construct the prompt by replacing placeholder
    const prompt = props.item.aiPrompt.replace('[app desc]', appDescription.value)

    // Show modal with loading state
    showAIModal.value = true
    aiOutput.value = 'Generating content with Grok AI...'

    // Call grok-proxy API
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
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `API error: ${response.status}`)
    }

    const data = await response.json()
    const generatedContent = data.choices?.[0]?.message?.content

    if (!generatedContent) {
      throw new Error('No content received from AI')
    }

    aiOutput.value = generatedContent
  } catch (error) {
    console.error('AI generation error:', error)
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
    setTimeout(() => {
      button.textContent = originalText
    }, 2000)
  }).catch(err => {
    console.error('Failed to copy:', err)
    aiError.value = 'Failed to copy to clipboard'
  })
}

// Initialize on mount
loadAppDescription()
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
