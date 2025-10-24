<template>
  <MiniAppShell
    :task-config="config"
    :task-data="taskData"
    @save="handleSave"
  >
    <template #ai-output="{ output }">
      <div v-if="output && Array.isArray(output)" class="space-y-3">
        <div
          v-for="(post, index) in output"
          :key="index"
          class="bg-white border border-gray-200 rounded-lg p-3"
        >
          <div class="flex justify-between items-start gap-2 mb-2">
            <h5 class="font-semibold text-gray-900 text-sm">{{ post.platform }}</h5>
            <span class="text-xs text-gray-500">
              {{ post.content.length }}/{{ getCharLimit(post.platform) }} chars
            </span>
          </div>
          <p class="text-xs text-gray-700 whitespace-pre-wrap bg-gray-50 p-2 rounded border border-gray-100">
            {{ post.content }}
          </p>
          <div v-if="getCharLimit(post.platform) && post.content.length > getCharLimit(post.platform)" class="text-xs text-red-600 mt-2">
            ⚠️ Exceeds character limit by {{ post.content.length - getCharLimit(post.platform) }}
          </div>
        </div>
      </div>
      <div v-else-if="output" class="prose prose-sm max-w-none">
        <p class="whitespace-pre-wrap text-sm text-gray-700">{{ output }}</p>
      </div>
    </template>
  </MiniAppShell>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import MiniAppShell from './core/MiniAppShell.vue'
import { generatePostsConfig } from './configs/generatePosts.config.js'

const props = defineProps({
  taskId: String,
  taskData: Object
})

const emit = defineEmits(['save'])

// Use the config
const config = ref(generatePostsConfig)

// Local task data
const taskData = ref(props.taskData || {
  formData: {},
  aiOutput: null,
  savedItems: []
})

// Watch for changes
watch(
  () => props.taskData,
  (newData) => {
    if (newData) {
      taskData.value = { ...newData }
    }
  }
)

// Save handler
const handleSave = (data) => {
  taskData.value = data
  emit('save', data)
}

// Get character limit for platform
const getCharLimit = (platform) => {
  if (platform.includes('Twitter') || platform.includes('X')) return 280
  return null
}
</script>
