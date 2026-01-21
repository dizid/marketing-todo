<template>
  <MiniAppShell
    :task-config="config"
    :task-data="taskData"
    @save="handleSave"
    ref="miniAppShell"
  >
    <template #ai-output="{ output }">
      <div v-if="output && Array.isArray(output)" class="space-y-4">
        <!-- Connection Status Banner -->
        <div v-if="!connectionStatus.twitter" class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span class="text-sm text-blue-800">Connect Twitter to publish directly</span>
            </div>
            <button
              @click="handleConnectTwitter"
              class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition"
            >
              Connect X/Twitter
            </button>
          </div>
        </div>

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

              <!-- Publish Button (Twitter/X) -->
              <button
                v-if="isTwitterPost(post.platform) && connectionStatus.twitter"
                @click="publishToTwitter(post.content, index)"
                :disabled="publishingIndex === index || publishedPosts.includes(index)"
                class="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded transition"
                :class="publishedPosts.includes(index)
                  ? 'bg-green-100 text-green-700'
                  : publishingIndex === index
                    ? 'bg-gray-100 text-gray-500 cursor-wait'
                    : 'bg-black hover:bg-gray-800 text-white'"
              >
                <svg v-if="publishedPosts.includes(index)" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                {{ publishedPosts.includes(index) ? 'Posted!' : publishingIndex === index ? 'Posting...' : 'Post to X' }}
              </button>

              <!-- Connect Twitter prompt for Twitter posts -->
              <button
                v-if="isTwitterPost(post.platform) && !connectionStatus.twitter"
                @click="handleConnectTwitter"
                class="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Connect to post
              </button>
            </div>

            <!-- Published link -->
            <div v-if="publishedUrls[index]" class="mt-2 text-xs">
              <a :href="publishedUrls[index]" target="_blank" class="text-blue-600 hover:underline">
                View on X →
              </a>
            </div>

            <!-- Error message -->
            <div v-if="publishError && publishingIndex === index" class="mt-2 text-xs text-red-600">
              {{ publishError }}
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
import { ref, watch, reactive, onMounted } from 'vue'
import MiniAppShell from './core/MiniAppShell.vue'
import { generatePostsConfig } from './configs/generatePosts.config.js'
import { getConnectionStatus, connectTwitter, publishPost } from '@/services/socialPublisher'
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

// Social publishing state
const connectionStatus = reactive({ twitter: false, linkedin: false })
const copiedIndex = ref(null)
const publishingIndex = ref(null)
const publishedPosts = ref([])
const publishedUrls = reactive({})
const publishError = ref('')

// Watch for changes
watch(
  () => props.taskData,
  (newData) => {
    if (newData) {
      taskData.value = { ...newData }
    }
  }
)

// Load connection status on mount
onMounted(async () => {
  try {
    const status = await getConnectionStatus()
    connectionStatus.twitter = status.twitter
    connectionStatus.linkedin = status.linkedin
  } catch (err) {
    console.warn('Could not check social connections:', err)
  }
})

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

// Check if post is for Twitter/X
const isTwitterPost = (platform) => {
  return platform.includes('Twitter') || platform.includes('X')
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

// Connect Twitter account
const handleConnectTwitter = () => {
  try {
    connectTwitter()
  } catch (err) {
    alert(err.message)
  }
}

// Publish to Twitter
const publishToTwitter = async (content, index) => {
  if (publishingIndex.value !== null) return

  publishingIndex.value = index
  publishError.value = ''

  try {
    const result = await publishPost('twitter', content)

    if (result.success) {
      publishedPosts.value.push(index)
      publishedUrls[index] = result.postUrl

      // Trigger first-content milestone
      if (!milestoneStore.isAchieved('first-content')) {
        milestoneStore.achieveMilestone('first-content')
      }
    }
  } catch (err) {
    publishError.value = err.message || 'Failed to post'
  } finally {
    publishingIndex.value = null
  }
}
</script>
