<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-auto">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full my-auto flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
        <h2 class="text-2xl font-bold text-gray-900">Create New Project</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 text-2xl">
          ✕
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="px-6 py-6 space-y-6 overflow-y-auto flex-1">
        <!-- Project Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Project Name <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="e.g., SaaS App Launch"
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
            placeholder="Brief description of your project..."
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
          ></textarea>
        </div>

        <!-- App Description for AI -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            App Description (for AI) <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="form.appDescription"
            required
            placeholder="Describe your app in detail (e.g., 'A SaaS task management app for distributed teams with real-time collaboration')"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">Required for AI content generation (minimum 10 characters)</p>
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
            placeholder="e.g., Indie developers, Startups"
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
            placeholder="What do you want to achieve? (e.g., 1000 signups, revenue, market share)"
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
            placeholder="e.g., React, Node.js, PostgreSQL"
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
            placeholder="e.g., 3 months, Q1 2025"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </div>

        <!-- Error -->
        <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-800">{{ error }}</p>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 justify-end pt-6 border-t border-gray-200 flex-shrink-0">
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
            {{ isLoading ? 'Creating...' : 'Create Project' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { useProjectContext } from '@/composables/useProjectContext'

const emit = defineEmits(['created', 'close'])
const projectStore = useProjectStore()
const { saveContext } = useProjectContext()

const form = ref({
  name: '',
  description: '',
  appDescription: '',
  targetAudience: '',
  goals: '',
  techStack: '',
  timeline: ''
})

const isLoading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  if (!form.value.name.trim()) {
    error.value = 'Project name is required'
    return
  }

  if (!form.value.appDescription.trim()) {
    error.value = 'App Description is required'
    return
  }

  if (form.value.appDescription.trim().length < 10) {
    error.value = 'App Description must be at least 10 characters'
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
    const project = await projectStore.createProject(form.value.name, form.value.description)

    // Save app description to localStorage for AI features
    localStorage.setItem('marketing-app-data', JSON.stringify({
      appDescription: form.value.appDescription.trim()
    }))

    // Save settings
    const settings = {
      targetAudience: form.value.targetAudience,
      goals: form.value.goals,
      techStack: form.value.techStack,
      timeline: form.value.timeline,
      description: form.value.description,
      appDescription: form.value.appDescription
    }

    await projectStore.updateProjectSettings(settings)

    // Save to ProjectContext (canonical source of truth)
    const userId = projectStore.currentUser?.id
    if (userId && project?.id) {
      await saveContext(project.id, userId, {
        productName: form.value.name,
        productDescription: form.value.description,
        targetAudience: form.value.targetAudience,
        primaryGoal: form.value.goals,
        targetTimeline: form.value.timeline,
        techStack: form.value.techStack
      })
    }

    emit('created', project)
  } catch (err) {
    error.value = err.message || 'Failed to create project'
    console.error('Error creating project:', err)
  } finally {
    isLoading.value = false
  }
}
</script>
