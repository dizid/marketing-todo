<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
        <h2 class="text-2xl font-bold text-gray-900">Project Settings</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 text-2xl">
          ✕
        </button>
      </div>

      <!-- Tab Bar -->
      <div class="px-6 pt-4 flex gap-1 border-b border-gray-200 flex-shrink-0">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="px-4 py-2 text-sm font-medium rounded-t-lg transition -mb-px"
          :class="activeTab === tab.id
            ? 'bg-white border border-gray-200 border-b-white text-indigo-600'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Scrollable Content -->
      <div class="flex-1 overflow-y-auto px-6 py-6">
        <!-- Tab 1: Project -->
        <div v-if="activeTab === 'project'" class="space-y-6">
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
              placeholder="My Awesome Product"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              v-model="form.description"
              rows="2"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
              placeholder="Brief description of your product..."
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
              placeholder="e.g., Small business owners, developers, designers..."
            />
          </div>

          <!-- Product Type - Pill Selector -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">Product Type</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="option in productTypeOptions"
                :key="option.value"
                type="button"
                @click="form.productType = option.value"
                class="px-4 py-2 rounded-full text-sm font-medium transition border-2"
                :class="form.productType === option.value
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-300'"
              >
                {{ option.icon }} {{ option.label }}
              </button>
            </div>
          </div>

          <!-- Primary Goal - Pill Selector -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">Primary Goal</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="option in goalOptions"
                :key="option.value"
                type="button"
                @click="form.mainGoal = option.value"
                class="px-4 py-2 rounded-full text-sm font-medium transition border-2"
                :class="form.mainGoal === option.value
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-300'"
              >
                {{ option.icon }} {{ option.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Tab 2: Links -->
        <div v-if="activeTab === 'links'" class="space-y-6">
          <p class="text-sm text-gray-500">Add your online presence to get more personalized AI recommendations.</p>

          <!-- Social Links Grid -->
          <div class="grid grid-cols-3 gap-3">
            <div
              v-for="link in socialLinks"
              :key="link.key"
              @click="toggleLinkExpand(link.key)"
              class="relative p-4 rounded-xl border-2 cursor-pointer transition-all"
              :class="getLinkCardClass(link.key)"
            >
              <!-- Icon & Label -->
              <div class="text-center">
                <div class="text-2xl mb-1">{{ link.icon }}</div>
                <div class="text-xs font-medium text-gray-700">{{ link.label }}</div>
                <!-- Status indicator -->
                <div v-if="form[link.key]" class="absolute top-2 right-2 text-green-500 text-sm">✓</div>
              </div>

              <!-- Expanded Input (shows below the card content) -->
              <div
                v-if="expandedLink === link.key"
                class="mt-3 pt-3 border-t border-gray-200"
                @click.stop
              >
                <input
                  :ref="el => { if (el) linkInputRefs[link.key] = el }"
                  v-model="form[link.key]"
                  type="text"
                  class="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  :placeholder="link.placeholder"
                  @keydown.enter="expandedLink = null"
                  @keydown.esc="expandedLink = null"
                />
              </div>
            </div>
          </div>

          <p class="text-xs text-gray-400 text-center">Click a card to add or edit the URL</p>
        </div>

        <!-- Tab 3: Details -->
        <div v-if="activeTab === 'details'" class="space-y-6">
          <!-- 2-Column Grid -->
          <div class="grid grid-cols-2 gap-6">
            <!-- Experience Level -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">Experience Level</label>
              <div class="space-y-2">
                <label
                  v-for="option in experienceOptions"
                  :key="option.value"
                  class="flex items-center p-3 rounded-lg border-2 cursor-pointer transition"
                  :class="form.experienceLevel === option.value
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'"
                >
                  <input
                    type="radio"
                    v-model="form.experienceLevel"
                    :value="option.value"
                    class="sr-only"
                  />
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ option.label }}</div>
                    <div class="text-xs text-gray-500">{{ option.desc }}</div>
                  </div>
                </label>
              </div>
            </div>

            <!-- Timeline -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">Timeline</label>
              <div class="space-y-2">
                <label
                  v-for="option in timelineOptions"
                  :key="option.value"
                  class="flex items-center p-3 rounded-lg border-2 cursor-pointer transition"
                  :class="form.timeline === option.value
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'"
                >
                  <input
                    type="radio"
                    v-model="form.timeline"
                    :value="option.value"
                    class="sr-only"
                  />
                  <span class="text-sm text-gray-900">{{ option.label }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Team Size & Stage - 2 Column -->
          <div class="grid grid-cols-2 gap-6">
            <!-- Team Size - Inline Pills -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">Team Size</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="option in teamSizeOptions"
                  :key="option.value"
                  type="button"
                  @click="form.teamSize = option.value"
                  class="px-3 py-1.5 rounded-lg text-sm font-medium transition border-2"
                  :class="form.teamSize === option.value
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-300'"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>

            <!-- Current Stage - Inline Pills -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">Current Stage</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="option in stageOptions"
                  :key="option.value"
                  type="button"
                  @click="form.currentStage = option.value"
                  class="px-3 py-1.5 rounded-lg text-sm font-medium transition border-2"
                  :class="form.currentStage === option.value
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-300'"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>
          </div>

          <!-- Marketing Budget -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Marketing Budget <span class="text-gray-400 text-xs">(optional)</span>
            </label>
            <div class="relative max-w-xs">
              <span class="absolute left-4 top-2.5 text-gray-500">$</span>
              <input
                v-model.number="form.budget"
                type="number"
                class="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <!-- Error -->
        <div v-if="error" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-800">{{ error }}</p>
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p class="text-sm text-green-800">{{ successMessage }}</p>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="px-6 py-4 border-t border-gray-200 flex gap-3 justify-between flex-shrink-0">
        <button
          type="button"
          @click="handleDelete"
          :disabled="isLoading"
          class="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition font-medium text-sm"
        >
          Delete Project
        </button>
        <div class="flex gap-3">
          <button
            type="button"
            @click="$emit('close')"
            class="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition font-medium"
          >
            Cancel
          </button>
          <button
            @click="handleSubmit"
            :disabled="isLoading"
            class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg transition font-medium"
          >
            {{ isLoading ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/projectStore'
import { useProjectContext } from '@/composables/useProjectContext'

const emit = defineEmits(['close'])
const router = useRouter()
const projectStore = useProjectStore()
const { saveContext } = useProjectContext()

// Tab configuration
const tabs = [
  { id: 'project', label: 'Project' },
  { id: 'links', label: 'Links' },
  { id: 'details', label: 'Details' }
]

const activeTab = ref('project')
const expandedLink = ref(null)
const linkInputRefs = reactive({})

// Options for pill selectors
const productTypeOptions = [
  { value: 'saas', label: 'SaaS', icon: '💻' },
  { value: 'service', label: 'Service', icon: '🤝' },
  { value: 'info-product', label: 'Course', icon: '📚' },
  { value: 'ecommerce', label: 'E-commerce', icon: '🛒' }
]

const goalOptions = [
  { value: 'awareness', label: 'Awareness', icon: '📢' },
  { value: 'leads', label: 'Leads', icon: '🎯' },
  { value: 'sales', label: 'Sales', icon: '💰' },
  { value: 'community', label: 'Community', icon: '👥' }
]

const experienceOptions = [
  { value: 'beginner', label: 'Beginner', desc: 'Phases 1-3, essential tasks' },
  { value: 'intermediate', label: 'Intermediate', desc: 'All 4 phases, full task set' }
]

const timelineOptions = [
  { value: '1-month', label: '1 month' },
  { value: '3-months', label: '3 months' },
  { value: '6-months', label: '6 months' },
  { value: 'flexible', label: 'Flexible' }
]

const teamSizeOptions = [
  { value: 'solo', label: 'Solo' },
  { value: '2-5', label: '2-5' },
  { value: '6-10', label: '6-10' },
  { value: '10+', label: '10+' }
]

const stageOptions = [
  { value: 'idea', label: 'Idea' },
  { value: 'building', label: 'Building' },
  { value: 'beta', label: 'Beta' },
  { value: 'launched', label: 'Launched' }
]

const socialLinks = [
  { key: 'websiteUrl', label: 'Website', icon: '🌐', placeholder: 'https://yoursite.com' },
  { key: 'twitterUrl', label: 'Twitter/X', icon: '𝕏', placeholder: '@handle or URL' },
  { key: 'linkedinUrl', label: 'LinkedIn', icon: '💼', placeholder: 'linkedin.com/in/you' },
  { key: 'instagramUrl', label: 'Instagram', icon: '📷', placeholder: '@handle or URL' },
  { key: 'youtubeUrl', label: 'YouTube', icon: '▶️', placeholder: 'youtube.com/@you' },
  { key: 'productHuntUrl', label: 'Product Hunt', icon: '🚀', placeholder: 'producthunt.com/...' }
]

const form = ref({
  // Basic info
  name: '',
  description: '',
  productType: '',
  experienceLevel: 'beginner',
  targetAudience: '',
  mainGoal: '',
  timeline: '',
  // URLs
  websiteUrl: '',
  twitterUrl: '',
  linkedinUrl: '',
  instagramUrl: '',
  youtubeUrl: '',
  productHuntUrl: '',
  // Additional details
  teamSize: 'solo',
  currentStage: 'building',
  budget: null
})

const isLoading = ref(false)
const error = ref('')
const successMessage = ref('')

// Toggle link card expansion
const toggleLinkExpand = async (key) => {
  if (expandedLink.value === key) {
    expandedLink.value = null
  } else {
    expandedLink.value = key
    await nextTick()
    if (linkInputRefs[key]) {
      linkInputRefs[key].focus()
    }
  }
}

// Get link card styling
const getLinkCardClass = (key) => {
  const hasValue = !!form.value[key]
  const isExpanded = expandedLink.value === key

  if (isExpanded) {
    return 'border-indigo-500 bg-indigo-50'
  } else if (hasValue) {
    return 'border-green-300 bg-green-50 hover:border-green-400'
  } else {
    return 'border-gray-200 hover:border-gray-300 bg-white'
  }
}

// Load current project data
onMounted(async () => {
  const project = projectStore.currentProject
  const settings = projectStore.currentProjectSettings

  if (project) {
    form.value.name = project.name || ''
    form.value.description = project.description || ''
  }

  if (settings) {
    form.value.productType = settings.productType || ''
    form.value.experienceLevel = settings.experienceLevel || 'beginner'
    form.value.targetAudience = settings.targetAudience || ''
    form.value.mainGoal = settings.mainGoal || ''
    form.value.timeline = settings.timeline || ''
    form.value.teamSize = settings.teamSize || 'solo'
    form.value.currentStage = settings.currentStage || 'building'
    form.value.budget = settings.budget || null
    // URLs
    form.value.websiteUrl = settings.websiteUrl || ''
    form.value.twitterUrl = settings.twitterUrl || ''
    form.value.linkedinUrl = settings.linkedinUrl || ''
    form.value.instagramUrl = settings.instagramUrl || ''
    form.value.youtubeUrl = settings.youtubeUrl || ''
    form.value.productHuntUrl = settings.productHuntUrl || ''
  }
})

const handleSubmit = async () => {
  if (!form.value.name.trim()) {
    error.value = 'Project name is required'
    activeTab.value = 'project'
    return
  }

  if (!form.value.targetAudience.trim()) {
    error.value = 'Target audience is required'
    activeTab.value = 'project'
    return
  }

  isLoading.value = true
  error.value = ''
  successMessage.value = ''

  try {
    // Update basic project info
    await projectStore.updateProject({
      name: form.value.name,
      description: form.value.description
    })

    // Update all settings including new URL fields
    const settings = {
      productType: form.value.productType,
      experienceLevel: form.value.experienceLevel,
      targetAudience: form.value.targetAudience,
      mainGoal: form.value.mainGoal,
      timeline: form.value.timeline,
      teamSize: form.value.teamSize,
      currentStage: form.value.currentStage,
      budget: form.value.budget,
      // URLs
      websiteUrl: form.value.websiteUrl,
      twitterUrl: form.value.twitterUrl,
      linkedinUrl: form.value.linkedinUrl,
      instagramUrl: form.value.instagramUrl,
      youtubeUrl: form.value.youtubeUrl,
      productHuntUrl: form.value.productHuntUrl
    }

    await projectStore.updateProjectSettings(settings)

    // Save to ProjectContext for AI prompts
    const userId = projectStore.currentUser?.id
    const projectId = projectStore.currentProjectId
    if (userId && projectId) {
      await saveContext(projectId, userId, {
        productName: form.value.name,
        productDescription: form.value.description,
        productType: form.value.productType,
        targetAudience: form.value.targetAudience,
        primaryGoal: form.value.mainGoal,
        targetTimeline: form.value.timeline,
        websiteUrl: form.value.websiteUrl,
        socialLinks: {
          twitter: form.value.twitterUrl,
          linkedin: form.value.linkedinUrl,
          instagram: form.value.instagramUrl,
          youtube: form.value.youtubeUrl,
          productHunt: form.value.productHuntUrl
        }
      })
    }

    successMessage.value = 'Settings saved successfully!'
    setTimeout(() => {
      emit('close')
    }, 1000)
  } catch (err) {
    error.value = err.message || 'Failed to save settings'
    console.error('Error saving project settings:', err)
  } finally {
    isLoading.value = false
  }
}

const handleDelete = async () => {
  const project = projectStore.currentProject
  if (!project) return

  const confirmDelete = confirm(
    `Delete "${project.name}"?\n\nThis will permanently delete the project and all its data. This cannot be undone.`
  )

  if (!confirmDelete) return

  isLoading.value = true
  error.value = ''

  try {
    await projectStore.deleteProject(project.id)
    emit('close')

    // If no projects remain, redirect
    if (projectStore.projects.length === 0) {
      router.push('/onboarding')
    }
  } catch (err) {
    error.value = err.message || 'Failed to delete project'
    console.error('Error deleting project:', err)
  } finally {
    isLoading.value = false
  }
}
</script>
