<template>
  <MiniAppShell
    :task-config="config"
    :task-data="taskData"
    @save="handleSave"
    ref="miniAppShell"
  >
    <template #ai-output="{ output }">
      <!-- Email format with subject line -->
      <div v-if="output && output.type === 'email'" class="space-y-3">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="text-xs font-semibold text-blue-900 mb-2">SUBJECT:</div>
          <p class="text-sm text-blue-900 font-medium">{{ output.subject }}</p>
        </div>
        <div class="bg-white border border-gray-200 rounded-lg p-4">
          <div class="text-xs font-semibold text-gray-600 mb-2">MESSAGE BODY:</div>
          <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ output.body }}</p>
        </div>
        <!-- Save button for generated message -->
        <button
          @click="saveGeneratedMessage(output)"
          class="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
        >
          ✓ Save to Outreach List
        </button>
      </div>

      <!-- Generic message format -->
      <div v-else-if="output && output.type === 'message'" class="space-y-3">
        <div class="bg-white border border-gray-200 rounded-lg p-4">
          <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ output.content }}</p>
        </div>
        <button
          @click="saveGeneratedMessage(output)"
          class="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
        >
          ✓ Save to Outreach List
        </button>
      </div>
    </template>

    <!-- Custom Saved Messages Section -->
    <template #content>
      <div v-if="savedMessages.length > 0" class="space-y-4 mt-8 pt-8 border-t border-gray-200">
        <h4 class="font-semibold text-gray-900">Saved Messages</h4>

        <div v-for="(msg, idx) in savedMessages" :key="idx" class="border border-gray-200 rounded-lg p-4 space-y-3">
          <!-- Show message preview -->
          <div v-if="msg.type === 'email'" class="space-y-2">
            <div class="bg-gray-50 p-2 rounded">
              <div class="text-xs font-semibold text-gray-600">SUBJECT:</div>
              <p class="text-sm text-gray-800 font-medium">{{ msg.subject }}</p>
            </div>
            <div class="text-xs text-gray-600">Preview:</div>
            <p class="text-sm text-gray-700 line-clamp-2">{{ msg.body }}</p>
          </div>

          <div v-else class="text-sm text-gray-700 line-clamp-2">{{ msg.content }}</div>

          <!-- Action buttons -->
          <div class="flex gap-2 pt-2">
            <button
              @click="copyMessage(msg)"
              class="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium transition"
            >
              📋 Copy
            </button>
            <button
              @click="removeMessage(idx)"
              class="flex-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded text-sm font-medium transition"
            >
              🗑️ Remove
            </button>
          </div>
        </div>
      </div>
    </template>
  </MiniAppShell>
</template>

<script setup>
import { ref, computed } from 'vue'
import MiniAppShell from './core/MiniAppShell.vue'
import { outreachConfig } from './configs/outreach.config.js'

const props = defineProps({
  taskId: String,
  taskData: Object,
  taskConfig: Object  // May receive task config from TaskModal
})

const emit = defineEmits(['save'])

// Always use the mini-app config, not the task config
const config = computed(() => outreachConfig)

// Saved messages list
const savedMessages = ref(props.taskData?.savedItems || [])

// Local task data - initialize once
const taskData = ref(props.taskData || {
  formData: {},
  aiOutput: null,
  savedItems: []
})

// Save a generated message to the list
const saveGeneratedMessage = (message) => {
  savedMessages.value.push(message)

  // Also update taskData
  taskData.value = {
    ...taskData.value,
    savedItems: savedMessages.value
  }

  // Emit save event
  handleSave(taskData.value)
}

// Copy message to clipboard
const copyMessage = (message) => {
  let text = ''

  if (message.type === 'email') {
    text = `SUBJECT: ${message.subject}\n\n${message.body}`
  } else {
    text = message.content || message.fullMessage
  }

  navigator.clipboard.writeText(text).then(() => {
    alert('Message copied to clipboard!')
  }).catch(err => {
    console.error('Failed to copy:', err)
  })
}

// Remove a saved message
const removeMessage = (idx) => {
  savedMessages.value.splice(idx, 1)

  // Update taskData
  taskData.value = {
    ...taskData.value,
    savedItems: savedMessages.value
  }

  // Emit save event
  handleSave(taskData.value)
}

// Save handler - just emit, don't update local state
const handleSave = (data) => {
  emit('save', data)
}
</script>
