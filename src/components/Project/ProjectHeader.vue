<template>
  <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Left: Project Selector -->
        <div class="flex items-center gap-4">
          <h1 class="text-2xl font-bold text-gray-900">Marketing To-Do</h1>

          <select
            v-model="selectedProjectId"
            @change="handleProjectChange"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            :disabled="isLoading"
          >
            <option value="" disabled>Select a project...</option>
            <option v-for="project in projectStore.projects" :key="project.id" :value="project.id">
              {{ project.name }}
            </option>
          </select>

          <button
            @click="showNewProjectForm = true"
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition font-medium text-sm"
          >
            + New Project
          </button>
        </div>

        <!-- Right: Actions -->
        <div class="flex items-center gap-4">
          <button
            v-if="projectStore.currentProject"
            @click="showProjectForm = true"
            class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition font-medium text-sm"
            title="Edit project details"
          >
            Edit
          </button>

          <button
            @click="handleSignOut"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition text-sm font-medium"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>

    <!-- New Project Modal -->
    <ProjectSetup
      v-if="showNewProjectForm"
      @created="handleProjectCreated"
      @close="showNewProjectForm = false"
    />

    <!-- Edit Project Modal -->
    <ProjectForm
      v-if="showProjectForm && projectStore.currentProject"
      :project="projectStore.currentProject"
      @updated="handleProjectUpdated"
      @close="showProjectForm = false"
    />
  </header>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/projectStore'
import { useAuthStore } from '@/stores/authStore'
import { signOut } from '@/utils/supabase'
import ProjectSetup from './ProjectSetup.vue'
import ProjectForm from './ProjectForm.vue'

const router = useRouter()
const projectStore = useProjectStore()
const authStore = useAuthStore()

const selectedProjectId = ref('')
const showNewProjectForm = ref(false)
const showProjectForm = ref(false)
const isLoading = ref(false)

// Watch current project and update selector
watch(() => projectStore.currentProjectId, (newId) => {
  selectedProjectId.value = newId || ''
})

// Initialize on mount
if (projectStore.projects.length === 0) {
  projectStore.fetchProjects()
}

const handleProjectChange = async (event) => {
  const projectId = event.target.value
  if (projectId) {
    isLoading.value = true
    await projectStore.selectProject(projectId)
    isLoading.value = false
  }
}

const handleProjectCreated = async (project) => {
  showNewProjectForm.value = false
  // Project store already updated
}

const handleProjectUpdated = async (project) => {
  showProjectForm.value = false
  // Project store already updated
}

const handleSignOut = async () => {
  if (confirm('Are you sure you want to sign out?')) {
    try {
      await signOut()
      authStore.user = null
      authStore.session = null
      router.push('/auth')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }
}
</script>
