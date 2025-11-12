<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-900">Edit Project</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 text-2xl">
          ✕
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="px-6 py-6 space-y-6">
        <!-- Project Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Project Name <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
          ></textarea>
        </div>

        <!-- Target Audience -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Target Audience <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.targetAudience"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </div>

        <!-- Goals -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Primary Goals <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="form.goals"
            required
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
          ></textarea>
        </div>

        <!-- Tech Stack (optional) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Tech Stack <span class="text-gray-500 text-xs">(optional)</span>
          </label>
          <input
            v-model="form.techStack"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </div>

        <!-- Timeline (optional) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Timeline <span class="text-gray-500 text-xs">(optional)</span>
          </label>
          <input
            v-model="form.timeline"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </div>

        <!-- Error -->
        <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-800">{{ error }}</p>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 justify-end pt-6 border-t border-gray-200">
          <button
            type="button"
            @click="$emit('close')"
            class="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isLoading"
            class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg transition font-medium"
          >
            {{ isLoading ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useProjectStore } from '@/stores/projectStore'

const props = defineProps({
  project: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['updated', 'close'])
const projectStore = useProjectStore()

/**
 * Extract target audience from project description
 * Looks for common patterns like "target audience:", "for:", "aimed at:"
 */
const extractTargetAudienceFromDescription = (description) => {
  if (!description) return ''

  // Pattern 1: "target audience: [text]"
  const targetMatch = description.match(/target\s+audience:\s*(.+?)(?:\.|,|$)/i)
  if (targetMatch) return targetMatch[1].trim()

  // Pattern 2: "for: [text]"
  const forMatch = description.match(/for:\s*(.+?)(?:\.|,|$)/i)
  if (forMatch) return forMatch[1].trim()

  // Pattern 3: "aimed at: [text]"
  const aimedMatch = description.match(/aimed\s+at:\s*(.+?)(?:\.|,|$)/i)
  if (aimedMatch) return aimedMatch[1].trim()

  // Pattern 4: First sentence (if no pattern found)
  const sentences = description.split(/[.!?]+/)
  if (sentences.length > 0 && sentences[0].length > 10) {
    return sentences[0].trim()
  }

  return ''
}

const form = ref({
  name: props.project.name,
  description: props.project.description,
  targetAudience: extractTargetAudienceFromDescription(props.project.description),
  goals: '',
  techStack: '',
  timeline: ''
})

const isLoading = ref(false)
const error = ref('')

// Load settings from store
watch(() => projectStore.currentProjectSettings, (settings) => {
  if (settings) {
    form.value = {
      name: props.project.name,
      description: props.project.description,
      // Use stored settings or extract from description as fallback
      targetAudience: settings.targetAudience || extractTargetAudienceFromDescription(props.project.description),
      goals: settings.goals || '',
      techStack: settings.techStack || '',
      timeline: settings.timeline || ''
    }
  }
}, { immediate: true })

const handleSubmit = async () => {
  if (!form.value.name.trim()) {
    error.value = 'Project name is required'
    return
  }

  if (!form.value.targetAudience.trim()) {
    error.value = 'Target audience is required'
    return
  }

  if (!form.value.goals.trim()) {
    error.value = 'Primary goals are required'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    // Update project info
    await projectStore.updateProject({
      name: form.value.name,
      description: form.value.description
    })

    // Update settings
    const settings = {
      targetAudience: form.value.targetAudience,
      goals: form.value.goals,
      techStack: form.value.techStack,
      timeline: form.value.timeline,
      description: form.value.description
    }

    await projectStore.updateProjectSettings(settings)

    emit('updated')
  } catch (err) {
    error.value = err.message || 'Failed to save project'
    console.error('Error saving project:', err)
  } finally {
    isLoading.value = false
  }
}
</script>
