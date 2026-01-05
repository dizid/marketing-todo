<template>
  <header class="bg-dark border-b border-primary sticky top-0 z-40" style="background: var(--cyberpunk-dark); border-color: var(--cyberpunk-primary)">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16 gap-2 sm:gap-4">
        <!-- Left: Logo & Project Dropdown -->
        <div class="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <h1 class="text-lg sm:text-2xl font-bold font-display text-primary whitespace-nowrap">Launchpilot</h1>

          <!-- Unified Project Dropdown (Desktop) -->
          <div class="hidden sm:block relative" ref="dropdownRef">
            <button
              @click="dropdownOpen = !dropdownOpen"
              class="flex items-center gap-2 px-3 py-2 bg-surface hover:bg-surface-hover border border-primary rounded-lg text-sm transition min-w-[200px] max-w-[300px]"
              :disabled="isLoading"
            >
              <span class="truncate flex-1 text-left">
                {{ projectStore.currentProject?.name || 'Select Project' }}
              </span>
              <svg class="w-4 h-4 text-primary flex-shrink-0 transition-transform" :class="{ 'rotate-180': dropdownOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <div
              v-if="dropdownOpen"
              class="absolute left-0 mt-2 w-64 bg-dark-secondary border border-primary rounded-lg shadow-xl overflow-hidden z-50"
              style="background: var(--cyberpunk-dark-secondary); border-color: var(--cyberpunk-primary)"
            >
              <!-- Actions Section -->
              <div class="border-b border-primary/30 py-1">
                <button
                  @click="handleNewProject"
                  class="w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-primary/10 transition"
                >
                  <span class="text-primary">+</span>
                  <span>New Project</span>
                </button>
                <button
                  v-if="projectStore.currentProject"
                  @click="handleAddTasks"
                  class="w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-primary/10 transition"
                >
                  <span class="text-highlight">+</span>
                  <span>Add Tasks</span>
                </button>
              </div>

              <!-- Projects List -->
              <div class="max-h-48 overflow-y-auto py-1">
                <div class="px-3 py-1 text-xs font-semibold text-secondary uppercase tracking-wide">Projects</div>
                <button
                  v-for="project in projectStore.projects"
                  :key="project.id"
                  @click="handleSelectProject(project.id)"
                  class="w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-primary/10 transition"
                  :class="{ 'bg-primary/20': project.id === projectStore.currentProjectId }"
                >
                  <span v-if="project.id === projectStore.currentProjectId" class="text-primary">✓</span>
                  <span v-else class="w-4"></span>
                  <span class="truncate">{{ project.name }}</span>
                </button>
                <div v-if="projectStore.projects.length === 0" class="px-4 py-2 text-sm text-muted italic">
                  No projects yet
                </div>
              </div>

              <!-- Settings Section -->
              <div v-if="projectStore.currentProject" class="border-t border-primary/30 py-1">
                <button
                  @click="handleProjectSettings"
                  class="w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-primary/10 transition"
                >
                  <span class="text-secondary">⚙</span>
                  <span>Project Settings</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Desktop Actions -->
        <div class="hidden md:flex items-center gap-2">
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
              @change="handleProjectChangeMobile"
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
            @click="handleNewProject"
            class="w-full btn-primary text-sm"
          >
            + New Project
          </button>

          <button
            v-if="projectStore.currentProject"
            @click="handleAddTasks"
            class="w-full btn-highlight text-sm"
          >
            + Add Tasks
          </button>

          <button
            v-if="projectStore.currentProject"
            @click="handleProjectSettings"
            class="w-full btn-ghost text-sm"
          >
            ⚙ Project Settings
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

    <!-- Add Tasks Modal -->
    <AddTasksModal
      :is-open="showAddTasksModal"
      @close="showAddTasksModal = false"
    />

    <!-- Project Settings Panel -->
    <ProjectSettings
      v-if="showProjectSettings"
      @close="showProjectSettings = false"
    />
  </header>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/projectStore'
import { useAuthStore } from '@/stores/authStore'
import { signOut } from '@/utils/supabase'
import AddTasksModal from './AddTasksModal.vue'
import ProjectSettings from './ProjectSettings.vue'

const router = useRouter()
const projectStore = useProjectStore()
const authStore = useAuthStore()

const selectedProjectId = ref('')
const showAddTasksModal = ref(false)
const showProjectSettings = ref(false)
const dropdownOpen = ref(false)
const dropdownRef = ref(null)
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

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    dropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleSelectProject = async (projectId) => {
  if (projectId && projectId !== projectStore.currentProjectId) {
    isLoading.value = true
    await projectStore.selectProject(projectId)
    isLoading.value = false
  }
  dropdownOpen.value = false
}

const handleProjectChangeMobile = async (event) => {
  const projectId = event.target.value
  if (projectId) {
    isLoading.value = true
    await projectStore.selectProject(projectId)
    isLoading.value = false
    mobileMenuOpen.value = false
  }
}

const handleNewProject = () => {
  dropdownOpen.value = false
  mobileMenuOpen.value = false
  // Navigate to onboarding wizard in new project mode
  router.push('/onboarding?mode=new-project')
}

const handleAddTasks = () => {
  dropdownOpen.value = false
  mobileMenuOpen.value = false
  showAddTasksModal.value = true
}

const handleProjectSettings = () => {
  dropdownOpen.value = false
  mobileMenuOpen.value = false
  showProjectSettings.value = true
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
