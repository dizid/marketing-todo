<template>
  <header class="bg-dark border-b border-primary sticky top-0 z-40" style="background: var(--cyberpunk-dark); border-color: var(--cyberpunk-primary)">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16 gap-2 sm:gap-4">
        <!-- Left: Logo & Project Selector -->
        <div class="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <h1 class="text-lg sm:text-2xl font-bold font-display text-primary whitespace-nowrap">SalesTaskMaster</h1>

          <select
            v-model="selectedProjectId"
            @change="handleProjectChange"
            class="hidden sm:block text-sm flex-1 min-w-0"
            :disabled="isLoading"
          >
            <option value="" disabled>Select a project...</option>
            <option v-for="project in projectStore.projects" :key="project.id" :value="project.id">
              {{ project.name }}
            </option>
          </select>

          <button
            @click="showNewProjectForm = true"
            class="hidden sm:inline-block btn-primary text-xs sm:text-sm whitespace-nowrap"
          >
            + New Project
          </button>
        </div>

        <!-- Right: Desktop Actions (hidden on mobile) -->
        <div class="hidden md:flex items-center gap-2">
          <button
            v-if="projectStore.currentProject"
            @click="showAddTasksModal = true"
            class="btn-highlight text-xs sm:text-sm"
            title="Add previously removed tasks back to the project"
          >
            + Add Tasks
          </button>

          <button
            v-if="projectStore.currentProject"
            @click="showProjectForm = true"
            class="btn-ghost text-xs sm:text-sm"
            title="Edit project details"
          >
            Edit
          </button>

          <button
            @click="goToSubscription"
            class="btn-accent text-xs sm:text-sm"
            title="View subscription and billing"
          >
            💳 Subscription
          </button>

          <button
            @click="handleSignOut"
            class="btn-accent text-xs sm:text-sm"
          >
            Sign Out
          </button>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden inline-flex items-center justify-center p-2 hover:bg-surface transition"
          title="Toggle menu"
        >
          <svg v-if="!mobileMenuOpen" class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
          <svg v-else class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Mobile Menu Dropdown -->
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-primary bg-dark-secondary" style="background: var(--cyberpunk-dark-secondary); border-color: var(--cyberpunk-primary)">
        <div class="px-4 py-3 space-y-2">
          <!-- Mobile Project Selector -->
          <div class="mb-3">
            <label class="block text-xs font-semibold text-secondary mb-1">Project</label>
            <select
              v-model="selectedProjectId"
              @change="handleProjectChange"
              class="w-full text-sm"
              :disabled="isLoading"
            >
              <option value="" disabled>Select a project...</option>
              <option v-for="project in projectStore.projects" :key="project.id" :value="project.id">
                {{ project.name }}
              </option>
            </select>
          </div>

          <!-- Mobile Action Buttons -->
          <button
            @click="openAndCloseMobileMenu(showNewProjectForm = true)"
            class="w-full btn-primary text-sm"
          >
            + New Project
          </button>

          <button
            v-if="projectStore.currentProject"
            @click="openAndCloseMobileMenu(showAddTasksModal = true)"
            class="w-full btn-highlight text-sm"
          >
            + Add Tasks
          </button>

          <button
            v-if="projectStore.currentProject"
            @click="openAndCloseMobileMenu(showProjectForm = true)"
            class="w-full btn-ghost text-sm"
          >
            Edit Project
          </button>

          <button
            @click="goToSubscriptionAndCloseMobileMenu"
            class="w-full btn-accent text-sm"
          >
            💳 Subscription
          </button>

          <button
            @click="handleSignOut"
            class="w-full btn-accent text-sm"
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
      @deleted="handleProjectDeleted"
      @close="showProjectForm = false"
    />

    <!-- Add Tasks Modal -->
    <AddTasksModal
      :is-open="showAddTasksModal"
      @close="showAddTasksModal = false"
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
import AddTasksModal from './AddTasksModal.vue'

const router = useRouter()
const projectStore = useProjectStore()
const authStore = useAuthStore()

const selectedProjectId = ref('')
const showNewProjectForm = ref(false)
const showProjectForm = ref(false)
const showAddTasksModal = ref(false)
const isLoading = ref(false)
const mobileMenuOpen = ref(false)

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
    // Close mobile menu after selection
    mobileMenuOpen.value = false
  }
}

const handleProjectCreated = async (project) => {
  showNewProjectForm.value = false
  mobileMenuOpen.value = false
  // Project store already updated
}

const handleProjectUpdated = async (project) => {
  showProjectForm.value = false
  mobileMenuOpen.value = false
  // Project store already updated
}

const handleProjectDeleted = async () => {
  showProjectForm.value = false
  mobileMenuOpen.value = false
  // Project store already updated and switched to another project
  // If no projects remain, redirect to dashboard or create new project prompt
  if (projectStore.projects.length === 0) {
    router.push('/app/welcome')
  }
}

// Helper to close mobile menu when opening modals
const openAndCloseMobileMenu = (action) => {
  mobileMenuOpen.value = false
}

const goToSubscription = () => {
  router.push('/app/subscription')
}

const goToSubscriptionAndCloseMobileMenu = () => {
  mobileMenuOpen.value = false
  goToSubscription()
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
