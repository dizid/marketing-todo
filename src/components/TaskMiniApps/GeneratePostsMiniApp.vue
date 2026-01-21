<template>
  <MiniAppShell
    :task-config="config"
    :task-data="taskData"
    @save="handleSave"
    ref="miniAppShell"
  >
    <template #ai-output="{ output }">
      <div v-if="output && Array.isArray(output)" class="space-y-4">
        <div class="space-y-3">
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

            <!-- Action Buttons -->
            <div class="flex items-center gap-2 mt-3 pt-2 border-t border-gray-100">
              <!-- Copy Button -->
              <button
                @click="copyToClipboard(post.content, index)"
                class="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition"
              >
                <svg v-if="copiedIndex !== index" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <svg v-else class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ copiedIndex === index ? 'Copied!' : 'Copy' }}
              </button>

              <!-- Open in Twitter/X (pre-filled) -->
              <a
                v-if="isTwitterPost(post.platform)"
                :href="getTwitterIntentUrl(post.content)"
                target="_blank"
                class="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Open in X
              </a>
            </div>
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
import { ref, watch } from 'vue'
import MiniAppShell from './core/MiniAppShell.vue'
import { generatePostsConfig } from './configs/generatePosts.config.js'
import { useMilestoneStore } from '@/stores/milestoneStore'

const props = defineProps({
  taskId: String,
  taskData: Object
})

const emit = defineEmits(['save'])

const milestoneStore = useMilestoneStore()

// Use the config
const config = ref(generatePostsConfig)

// Local task data
const taskData = ref(props.taskData || {
  formData: {},
  aiOutput: null,
  savedItems: []
})

// Copy state
const copiedIndex = ref(null)

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

  // Trigger first-content milestone when content is saved
  if (data.aiOutput && !milestoneStore.isAchieved('first-content')) {
    milestoneStore.achieveMilestone('first-content')
  }
}

// Get character limit for platform
const getCharLimit = (platform) => {
  if (platform.includes('Twitter') || platform.includes('X')) return 280
  return null
}

// Check if post is for Twitter/X
const isTwitterPost = (platform) => {
  return platform.includes('Twitter') || platform.includes('X')
}

// Get Twitter intent URL (opens Twitter with pre-filled text)
const getTwitterIntentUrl = (content) => {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}`
}

// Copy to clipboard
const copyToClipboard = async (content, index) => {
  try {
    await navigator.clipboard.writeText(content)
    copiedIndex.value = index
    setTimeout(() => {
      copiedIndex.value = null
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>
