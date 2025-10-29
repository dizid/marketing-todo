<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Header with Project Navigation -->
    <ProjectHeader />

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- No Project State -->
      <div v-if="!projectStore.currentProject" class="bg-white rounded-lg shadow-md p-12 text-center">
        <p class="text-gray-600 mb-4">No project selected. Create a new project to get started.</p>
      </div>

      <!-- Project Content -->
      <template v-else>
        <!-- Project Progress Section -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Overall Progress</h3>
            <span class="text-2xl font-bold text-indigo-600">{{ progressPercentage }}%</span>
          </div>
          <!-- Progress Bar -->
          <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              class="bg-indigo-600 h-full transition-all duration-300 rounded-full"
              :style="{ width: progressPercentage + '%' }"
            ></div>
          </div>
          <p class="text-sm text-gray-600 mt-3">
            {{ completedTasks }} of {{ totalTasks }} tasks completed
          </p>
        </div>

        <!-- Search and Filter Section -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Search Input -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Search Tasks</label>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by task name..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>

            <!-- Category Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
              <select
                v-model="selectedCategory"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              >
                <option value="">All Categories</option>
                <option value="setup">Setup Basics</option>
                <option value="social">Social Media Marketing</option>
                <option value="content">Content Creation</option>
                <option value="acquisition">User Acquisition & Engagement</option>
                <option value="feedback">Feedback & Iteration</option>
                <option value="analytics">Analytics & Optimization</option>
              </select>
            </div>

            <!-- Status Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <select
                v-model="selectedStatus"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              >
                <option value="">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Checklist Categories -->
        <div class="space-y-4">
          <ChecklistCategory
            v-for="category in filteredCategories"
            :key="category.name"
            :category="category"
            :tasks="projectStore.currentProjectTasks"
            @task-checked="handleTaskUpdate"
            @notes-updated="handleTaskUpdate"
            @task-removed="handleTaskRemoved"
            @task-opened="handleTaskOpened"
          />
        </div>

        <!-- AI Advice Section -->
        <div class="bg-white rounded-lg shadow-md p-6 mt-8">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold text-gray-900">🤖 Grok AI Advice</h2>
            <button
              @click="generateGrokAdvice"
              :disabled="isGenerating"
              class="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg transition font-medium text-sm"
            >
              {{ isGenerating ? '⏳ Generating...' : '✨ Generate Advice' }}
            </button>
          </div>

          <p class="text-gray-600 text-sm mb-4">
            Get AI-powered suggestions tailored to your project.
          </p>

          <div v-if="aiError" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-800">{{ aiError }}</p>
          </div>

          <div v-if="grokAdvice" class="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div class="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
              {{ grokAdvice }}
            </div>
          </div>

          <div v-if="!grokAdvice && !isGenerating" class="text-gray-500 text-sm italic">
            Click "Generate Advice" to get personalized recommendations from Grok AI
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="bg-white rounded-lg shadow-md p-6 mt-8 flex flex-wrap gap-3">
          <button
            @click="exportAsMarkdown"
            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium text-sm"
          >
            📄 Export as Markdown
          </button>
          <button
            @click="exportAsJSON"
            class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium text-sm"
          >
            💾 Export as JSON
          </button>
          <button
            @click="resetProjectTasks"
            class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium text-sm ml-auto"
          >
            🔄 Reset All Tasks
          </button>
        </div>
      </template>
    </div>

    <!-- Task Modal -->
    <TaskModal
      :is-open="showTaskModal"
      :task-id="selectedTaskId"
      @close="handleTaskModalClosed"
    />
  </div>
</template>

<script setup>
/**
 * Dashboard Component - Project-aware main interface
 *
 * Features:
 * - Project-based task management
 * - Progress tracking
 * - Search and filtering
 * - AI advice generation
 * - Data export
 */

import { ref, computed, onMounted } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import ChecklistCategory from './ChecklistCategory.vue'
import ProjectHeader from './Project/ProjectHeader.vue'
import TaskModal from './Task/TaskModal.vue'
import { getGrokAdvice } from '@/services/grok.js'

const projectStore = useProjectStore()

// State
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')
const grokAdvice = ref('')
const isGenerating = ref(false)
const aiError = ref('')
const showTaskModal = ref(false)
const selectedTaskId = ref(null)

// Task categories data (global template - applies to all projects)
const taskCategories = ref([
  {
    name: 'setup',
    label: 'Setup Basics',
    items: [
      {
        id: 'setup-1',
        name: 'Define Audience & Goals',
        description: 'Profile ideal users and set acquisition targets.',
        aiPrompt: 'Suggest 3 personas and a 30-day plan for [app desc] to get 150 users.',
        hasAI: true,
        miniAppId: 'define-audience'
      },
      {
        id: 'setup-2',
        name: 'Set Up Landing Page',
        description: 'Build a simple site with features, screenshots, and sign-up form.',
        aiPrompt: 'Generate headline, 5 bullets, and CTA copy for landing page on [app desc].',
        hasAI: true
      },
      {
        id: 'setup-3',
        name: 'Connect Accounts',
        description: 'Link social (X, LinkedIn, Reddit), email (Mailchimp), and analytics.',
        aiPrompt: '',
        hasAI: false,
        miniAppId: 'connect-accounts'
      },
      {
        id: 'setup-4',
        name: 'Prepare Assets',
        description: 'Create demo video/screenshots and basic branding.',
        aiPrompt: '',
        hasAI: false,
        miniAppId: 'prepare-assets'
      },
      {
        id: 'setup-5',
        name: 'Set Up Tracking Sheet',
        description: 'Use Google Sheets for logging sign-ups and sources.',
        aiPrompt: '',
        hasAI: false,
        miniAppId: 'tracking-sheet'
      }
    ]
  },
  {
    name: 'social',
    label: 'Social Media Marketing',
    items: [
      {
        id: 'social-1',
        name: 'Schedule Posts',
        description: 'Plan and queue 4-6 updates on X/LinkedIn/Instagram.',
        aiPrompt: 'Generate 10 posts for [app desc] with hashtags, emojis, and sign-up links.',
        hasAI: true,
        miniAppId: 'generate-posts'
      },
      {
        id: 'social-2',
        name: 'Engage Followers',
        description: 'Template responses for common interactions. Build community by engaging followers.',
        miniAppId: 'engage-followers',
        hasAI: false
      },
      {
        id: 'social-3',
        name: 'Run Giveaway/Contest',
        description: 'Launch a giveaway in 5 steps. Offer free access for shares and engagement.',
        miniAppId: 'giveaway',
        hasAI: false
      }
    ]
  },
  {
    name: 'content',
    label: 'Content Creation',
    items: [
      {
        id: 'content-1',
        name: 'Write Blog Post',
        description: 'Create a compelling blog post with AI-guided structure and research',
        miniAppId: 'write-blog',
        hasAI: true
      },
      {
        id: 'content-2',
        name: 'Create Video Tutorial',
        description: 'Script a 2-minute product demo. Section-by-section guidance with timing targets.',
        miniAppId: 'video-script',
        hasAI: false
      },
      {
        id: 'content-3',
        name: 'Design Graphics',
        description: 'Create graphics with AI-guided design briefs and step-by-step tutorials',
        miniAppId: 'design-graphics',
        hasAI: true
      }
    ]
  },
  {
    name: 'acquisition',
    label: 'User Acquisition & Engagement',
    items: [
      {
        id: 'acq-1',
        name: 'Post in Communities',
        description: 'Share on Reddit, Indie Hackers, Product Hunt, HackerNews, Dev.to. Community-specific tone guides.',
        miniAppId: 'community-posts',
        hasAI: false
      },
      {
        id: 'acq-2',
        name: 'Personalized Outreach',
        description: 'Email/DM 20-50 potential users. 5 proven cold outreach templates.',
        miniAppId: 'outreach',
        hasAI: false
      },
      {
        id: 'acq-3',
        name: 'Host Webinar/Q&A',
        description: 'Plan a 30-minute webinar. Structure, topics, and Q&A guidance.',
        miniAppId: 'webinar',
        hasAI: false
      }
    ]
  },
  {
    name: 'feedback',
    label: 'Feedback & Iteration',
    items: [
      {
        id: 'feedback-1',
        name: 'Collect User Feedback',
        description: 'Send surveys or interviews to 10+ users. 5 survey type templates.',
        miniAppId: 'feedback-collection',
        hasAI: false
      },
      {
        id: 'feedback-2',
        name: 'Publish Product Updates',
        description: 'Share improvements and bug fixes. Track changelog across channels.',
        miniAppId: 'changelog',
        hasAI: false
      },
      {
        id: 'feedback-3',
        name: 'Iterate on Features',
        description: 'Prioritize user requests and refine product. Feature matrix with impact/effort.',
        miniAppId: 'feature-prioritization',
        hasAI: false
      }
    ]
  },
  {
    name: 'analytics',
    label: 'Analytics & Optimization',
    items: [
      {
        id: 'analytics-1',
        name: 'Set Up Analytics',
        description: 'Track sign-ups, retention, engagement metrics. Setup guides for 5 tools.',
        miniAppId: 'analytics-setup',
        hasAI: false
      },
      {
        id: 'analytics-2',
        name: 'Optimize Channels',
        description: 'Analyze metrics by channel. Double down on high-performers.',
        miniAppId: 'channel-analyzer',
        hasAI: false
      },
      {
        id: 'analytics-3',
        name: 'Review ROI',
        description: 'Calculate cost-per-user and track ROI metrics. 5 key metrics to monitor.',
        miniAppId: 'roi-calculator',
        hasAI: false
      }
    ]
  }
])

// Computed properties
const filteredCategories = computed(() => {
  return taskCategories.value
    .filter(cat => !selectedCategory.value || cat.name === selectedCategory.value)
    .map(category => ({
      ...category,
      items: category.items
        .filter(item => {
          // Search filter
          if (searchQuery.value) {
            const query = searchQuery.value.toLowerCase()
            if (!item.name.toLowerCase().includes(query) &&
                !item.description.toLowerCase().includes(query)) {
              return false
            }
          }

          // Status filter
          if (selectedStatus.value) {
            const isCompleted = projectStore.currentProjectTasks[item.id]?.checked || false
            if (selectedStatus.value === 'completed' && !isCompleted) return false
            if (selectedStatus.value === 'pending' && isCompleted) return false
          }

          return true
        })
    }))
    .filter(cat => cat.items.length > 0)
})

const totalTasks = computed(() => {
  // Count only active (non-removed) tasks
  return taskCategories.value.reduce((sum, cat) => {
    const activeItems = cat.items.filter(item => !projectStore.currentProjectTasks[item.id]?.removed)
    return sum + activeItems.length
  }, 0)
})

const completedTasks = computed(() => {
  // Count only completed, non-removed tasks
  return Object.entries(projectStore.currentProjectTasks)
    .filter(([taskId, taskData]) => taskData.checked && !taskData.removed)
    .length
})

const progressPercentage = computed(() => {
  if (totalTasks.value === 0) return 0
  return Math.round((completedTasks.value / totalTasks.value) * 100)
})

/**
 * Handle task updates from child components
 */
const handleTaskUpdate = async (updatedTasks) => {
  try {
    await projectStore.updateProjectTasks(updatedTasks)
  } catch (error) {
    console.error('Error updating tasks:', error)
    aiError.value = 'Failed to save task changes'
  }
}

/**
 * Handle task removal
 */
const handleTaskRemoved = async (data) => {
  try {
    await projectStore.removeTask(data.taskId)
  } catch (error) {
    console.error('Error removing task:', error)
    aiError.value = 'Failed to remove task'
  }
}

/**
 * Handle task opened (open TaskModal)
 */
const handleTaskOpened = (data) => {
  selectedTaskId.value = data.taskId
  showTaskModal.value = true
}

/**
 * Handle task modal closed
 */
const handleTaskModalClosed = () => {
  showTaskModal.value = false
  selectedTaskId.value = null
}

/**
 * Generate Grok AI advice
 */
const generateGrokAdvice = async () => {
  if (isGenerating.value) return
  isGenerating.value = true
  aiError.value = ''

  try {
    const userData = {
      appDescription: projectStore.currentProjectSettings.targetAudience || '',
      projectGoals: projectStore.currentProjectSettings.goals || '',
      techStack: projectStore.currentProjectSettings.techStack || '',
      completedTasks: completedTasks.value,
      totalTasks: totalTasks.value,
      progress: progressPercentage.value,
      checklist: taskCategories.value.map(cat => ({
        category: cat.label,
        completedCount: cat.items.filter(item => projectStore.currentProjectTasks[item.id]?.checked).length,
        totalCount: cat.items.length
      }))
    }

    const advice = await getGrokAdvice(userData)
    grokAdvice.value = advice
  } catch (error) {
    console.error('Error generating Grok advice:', error)
    aiError.value = error.message || 'Failed to generate AI advice. Please try again.'
  } finally {
    isGenerating.value = false
  }
}

/**
 * Export data as Markdown format
 */
const exportAsMarkdown = () => {
  let markdown = '# Project Progress\n\n'
  markdown += `**Project:** ${projectStore.currentProject.name}\n`
  markdown += `**Progress:** ${progressPercentage.value}% (${completedTasks.value}/${totalTasks.value} tasks)\n\n`

  if (projectStore.currentProjectSettings.targetAudience) {
    markdown += `**Target Audience:** ${projectStore.currentProjectSettings.targetAudience}\n`
  }

  if (projectStore.currentProjectSettings.goals) {
    markdown += `**Goals:** ${projectStore.currentProjectSettings.goals}\n\n`
  }

  filteredCategories.value.forEach(category => {
    markdown += `## ${category.label}\n`
    category.items.forEach(item => {
      const taskData = projectStore.currentProjectTasks[item.id] || {}
      const checked = taskData.checked ? '✅' : '☐'
      markdown += `- ${checked} ${item.name}\n`
      if (taskData.notes) {
        markdown += `  - Notes: ${taskData.notes}\n`
      }
    })
    markdown += '\n'
  })

  copyToClipboard(markdown)
  alert('Markdown copied to clipboard!')
}

/**
 * Export data as JSON format
 */
const exportAsJSON = () => {
  const exportData = {
    exportedAt: new Date().toISOString(),
    project: {
      name: projectStore.currentProject.name,
      settings: projectStore.currentProjectSettings
    },
    progress: {
      completed: completedTasks.value,
      total: totalTasks.value,
      percentage: progressPercentage.value
    },
    tasks: projectStore.currentProjectTasks
  }

  const jsonString = JSON.stringify(exportData, null, 2)
  copyToClipboard(jsonString)
  alert('JSON data copied to clipboard!')
}

/**
 * Copy text to clipboard
 */
const copyToClipboard = (text) => {
  if (!text) {
    console.warn('Nothing to copy')
    return
  }
  navigator.clipboard.writeText(text).catch(err => {
    console.error('Failed to copy:', err)
  })
}

/**
 * Reset all tasks in project
 */
const resetProjectTasks = () => {
  if (confirm('Are you sure you want to reset all tasks for this project? This cannot be undone.')) {
    projectStore.updateProjectTasks({})
    alert('All tasks have been reset!')
  }
}

/**
 * Initialize on mount
 */
onMounted(async () => {
  if (projectStore.projects.length === 0) {
    await projectStore.fetchProjects()
  }
})
</script>

<style scoped>
/* Smooth transitions for interactive elements */
button {
  transition: all 0.2s ease-in-out;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

textarea:focus {
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}
</style>
