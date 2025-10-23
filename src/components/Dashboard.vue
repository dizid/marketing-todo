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
import { getGrokAdvice } from '@/services/grok.js'

const projectStore = useProjectStore()

// State
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')
const grokAdvice = ref('')
const isGenerating = ref(false)
const aiError = ref('')

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
        hasAI: true
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
        hasAI: false
      },
      {
        id: 'setup-4',
        name: 'Prepare Assets',
        description: 'Create demo video/screenshots and basic branding.',
        aiPrompt: 'Describe 4 visual asset ideas (e.g., banners) for [app desc].',
        hasAI: true
      },
      {
        id: 'setup-5',
        name: 'Set Up Tracking Sheet',
        description: 'Use Google Sheets for logging sign-ups and sources.',
        aiPrompt: 'Create a spreadsheet template outline for tracking marketing metrics.',
        hasAI: true
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
        hasAI: true
      },
      {
        id: 'social-2',
        name: 'Engage Followers',
        description: 'Respond to comments/DMs to build community.',
        aiPrompt: 'Create 6 reply templates for common interactions on [app desc].',
        hasAI: true
      },
      {
        id: 'social-3',
        name: 'Run Giveaway/Contest',
        description: 'Offer free access for shares/retweets.',
        aiPrompt: 'Draft a giveaway announcement post and rules for [app desc].',
        hasAI: true
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
        description: 'Detail app benefits or niche tutorials.',
        aiPrompt: 'Draft 500-word blog on [app niche], including promo for [app desc].',
        hasAI: true
      },
      {
        id: 'content-2',
        name: 'Create Video Tutorial',
        description: 'Short demo of key features.',
        aiPrompt: 'Script a 2-min video walkthrough for [app desc].',
        hasAI: true
      },
      {
        id: 'content-3',
        name: 'Design Graphics',
        description: 'Social banners, infographics.',
        aiPrompt: 'Describe 5 graphic designs (colors, elements) for promoting [app desc].',
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
        description: 'Share on Reddit, Indie Hackers, Product Hunt.',
        aiPrompt: 'Write an announcement post for Reddit r/[subreddit] about [app desc].',
        hasAI: true
      },
      {
        id: 'acq-2',
        name: 'Personalized Outreach',
        description: 'Email/DM 20-50 potential users.',
        aiPrompt: 'Generate 5 cold outreach templates for devs interested in [app desc].',
        hasAI: true
      },
      {
        id: 'acq-3',
        name: 'Host Webinar/Q&A',
        description: 'Live session for demos.',
        aiPrompt: 'Outline a 30-min webinar script on [app topic].',
        hasAI: true
      }
    ]
  },
  {
    name: 'feedback',
    label: 'Feedback & Iteration',
    items: [
      {
        id: 'fb-1',
        name: 'Collect Feedback',
        description: 'Post-signup surveys or polls.',
        aiPrompt: 'Design a 6-question NPS survey for [app desc] users.',
        hasAI: true
      },
      {
        id: 'fb-2',
        name: 'Analyze Responses',
        description: 'Summarize and prioritize issues.',
        aiPrompt: 'Summarize [paste 10 feedbacks] and recommend 4 improvements.',
        hasAI: true
      },
      {
        id: 'fb-3',
        name: 'User Interviews',
        description: 'Schedule 1:1 calls with early users.',
        aiPrompt: 'Prepare 8 interview questions for [app] feedback.',
        hasAI: true
      }
    ]
  },
  {
    name: 'analytics',
    label: 'Analytics & Optimization',
    items: [
      {
        id: 'analytics-1',
        name: 'Track Metrics',
        description: 'Monitor sign-ups, traffic, engagement.',
        aiPrompt: 'Interpret [paste data] and highlight key insights.',
        hasAI: true
      },
      {
        id: 'analytics-2',
        name: 'Optimize Channels',
        description: 'Double down on high-performers.',
        aiPrompt: 'Based on [metrics], suggest a pivot plan for marketing focus.',
        hasAI: true
      },
      {
        id: 'analytics-3',
        name: 'Review ROI',
        description: 'Calculate cost-per-user (even if organic).',
        aiPrompt: '',
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
  return taskCategories.value.reduce((sum, cat) => sum + cat.items.length, 0)
})

const completedTasks = computed(() => {
  return Object.values(projectStore.currentProjectTasks).filter(t => t.checked).length
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
