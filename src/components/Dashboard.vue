<template>
  <div class="min-h-screen bg-var(--cyberpunk-dark)" style="background: var(--cyberpunk-dark)">
    <!-- Header with Project Navigation -->
    <ProjectHeader />

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Quota Status Card -->
      <QuotaStatusCard @upgrade-clicked="handleUpgradeClick" />

      <!-- No Project State -->
      <div v-if="!projectStore.currentProject" class="card p-12 text-center animate-fade-in">
        <p class="text-muted mb-4">No project selected. Create a new project to get started.</p>
      </div>

      <!-- Project Content -->
      <template v-else>
        <!-- Project Progress Section -->
        <div class="card mb-6 animate-fade-in-up">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold font-display text-primary">Overall Progress</h3>
            <span class="text-3xl font-bold text-highlight">{{ progressPercentage }}%</span>
          </div>
          <!-- Progress Bar -->
          <div class="w-full bg-surface-light h-2 overflow-hidden border border-border">
            <div
              class="h-full transition-all duration-500"
              :style="{ background: 'linear-gradient(90deg, var(--cyberpunk-primary), var(--cyberpunk-accent))', width: progressPercentage + '%' }"
            ></div>
          </div>
          <p class="text-sm text-secondary mt-4">
            {{ completedTasks }} of {{ totalTasks }} tasks completed
          </p>
        </div>

        <!-- Search and Filter Section -->
        <div class="card mb-6 animate-fade-in-up">
          <h3 class="text-lg font-semibold font-display text-primary mb-6">Search & Filter</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Search Input -->
            <div>
              <label class="block text-sm font-medium text-secondary mb-2">Search Tasks</label>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by task name..."
              />
            </div>

            <!-- Category Filter -->
            <div>
              <label class="block text-sm font-medium text-secondary mb-2">Filter by Category</label>
              <select
                v-model="selectedCategory"
              >
                <option value="">All Categories</option>
                <option value="setup">Setup Basics</option>
                <option value="social">Social Media Marketing</option>
                <option value="content">Content Creation</option>
                <option value="acquisition">User Acquisition & Engagement</option>
                <option value="feedback">Feedback & Iteration</option>
                <option value="analytics">Analytics & Optimization</option>
                <option value="advertising">Paid Advertising</option>
              </select>
            </div>

            <!-- Status Filter -->
            <div>
              <label class="block text-sm font-medium text-secondary mb-2">Filter by Status</label>
              <select
                v-model="selectedStatus"
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
            @task-removed="handleTaskRemoved"
            @task-opened="handleTaskOpened"
          />
        </div>

        <!-- Executive Summary Section -->
        <div class="card mt-8 border-primary-glow animate-fade-in-up">
          <div class="flex justify-between items-start mb-6 flex-col sm:flex-row gap-4">
            <div>
              <h2 class="text-2xl font-bold font-display text-primary mb-2">📊 Executive Summary & Priority Tasks</h2>
              <p class="text-secondary text-sm">
                AI-powered strategic analysis with 3-5 priority quick-win tasks customized for your project
              </p>
            </div>
            <button
              @click="generateExecutiveSummary"
              :disabled="isGeneratingSummary"
              class="btn-primary whitespace-nowrap"
            >
              {{ isGeneratingSummary ? '⏳ Generating...' : '🎯 Generate Summary' }}
            </button>
          </div>

          <div v-if="summaryError" class="mb-4 p-4 bg-accent/20 border border-accent rounded">
            <p class="text-sm text-accent">{{ summaryError }}</p>
          </div>

          <div v-if="executiveSummary" class="space-y-6">
            <!-- Executive Summary Card -->
            <div class="bg-surface-light border-l-4 border-primary p-6">
              <h3 class="text-lg font-bold font-display text-primary mb-4 flex items-center">
                <span class="text-2xl mr-3">📈</span> Project Status Summary
              </h3>
              <div class="prose prose-sm max-w-none text-text whitespace-pre-wrap text-base leading-relaxed">
                {{ executiveSummary.summary }}
              </div>
            </div>

            <!-- Priority Tasks -->
            <div v-if="executiveSummary.tasks && executiveSummary.tasks.length > 0">
              <h3 class="text-lg font-bold font-display text-primary mb-4 flex items-center">
                <span class="text-2xl mr-3">🎯</span> Priority Quick-Win Tasks
              </h3>
              <p class="text-secondary text-sm mb-4">
                {{ executiveSummary.tasks.length }} actionable tasks ranked by impact and effort
              </p>
              <div class="space-y-4">
                <div
                  v-for="(task, idx) in executiveSummary.tasks"
                  :key="idx"
                  class="bg-surface border-2 border-primary p-5 hover:border-primary-glow hover:shadow-lg transition"
                >
                  <!-- Task Header with Impact/Effort Indicators -->
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex-1">
                      <h4 class="text-base font-bold font-display text-text">{{ idx + 1 }}. {{ task.title }}</h4>
                    </div>
                    <div class="flex gap-2 ml-3 flex-wrap justify-end">
                      <!-- Impact Badge -->
                      <span
                        :class="[
                          'badge text-xs font-bold px-3 py-1 whitespace-nowrap',
                          task.impact === 'High'
                            ? 'badge-accent'
                            : task.impact === 'Medium'
                              ? 'badge-highlight'
                              : 'badge-primary'
                        ]"
                      >
                        📊 Impact: {{ task.impact }}
                      </span>
                      <!-- Effort Badge -->
                      <span
                        :class="[
                          'badge text-xs font-bold px-3 py-1 whitespace-nowrap',
                          task.effort === 'High'
                            ? 'border-accent text-accent bg-accent/10'
                            : task.effort === 'Medium'
                              ? 'border-highlight text-highlight bg-highlight/10'
                              : 'badge-primary'
                        ]"
                      >
                        ⚡ Effort: {{ task.effort }}
                      </span>
                    </div>
                  </div>

                  <!-- Task Details -->
                  <div class="space-y-3 text-sm">
                    <!-- Why Section -->
                    <div v-if="task.why" class="bg-surface-light p-3 border-l-4 border-primary">
                      <p class="font-semibold text-primary mb-1">💡 Why This Matters</p>
                      <p class="text-secondary">{{ task.why }}</p>
                    </div>

                    <!-- Next Steps Section -->
                    <div v-if="task.nextSteps" class="bg-surface-light p-3 border-l-4 border-highlight">
                      <p class="font-semibold text-highlight mb-1">✅ Next Steps</p>
                      <p class="text-secondary">{{ task.nextSteps }}</p>
                    </div>
                  </div>

                  <!-- ROI Indicator -->
                  <div class="mt-3 pt-3 border-t border-border">
                    <p class="text-xs text-secondary">
                      <strong>Expected Outcome:</strong>
                      <span
                        :class="{
                          'text-highlight font-semibold': task.impact === 'High' && task.effort === 'Low',
                          'text-primary font-semibold': task.impact !== 'High' || task.effort !== 'Low'
                        }"
                      >
                        {{
                          task.impact === 'High' && task.effort === 'Low'
                            ? '🚀 Quick Win - High ROI'
                            : task.impact === 'High' && task.effort === 'Medium'
                              ? '⭐ Recommended Priority'
                              : task.impact === 'High' && task.effort === 'High'
                                ? '💎 Strategic Investment'
                                : '📌 Lower Priority'
                        }}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="!executiveSummary && !isGeneratingSummary" class="text-muted text-sm italic">
            Click "Generate Summary" to get an AI-powered analysis of your project with priority tasks
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="card mt-8 flex flex-wrap gap-3">
          <button
            @click="exportAsMarkdown"
            class="btn-primary"
          >
            📄 Export as Markdown
          </button>
          <button
            @click="resetProjectTasks"
            class="btn-accent ml-auto"
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
import { useSubscriptionStore } from '@/stores/subscriptionStore'
import ChecklistCategory from './ChecklistCategory.vue'
import ProjectHeader from './Project/ProjectHeader.vue'
import QuotaStatusCard from './QuotaStatusCard.vue'
import TaskModal from './Task/TaskModal.vue'
import { generateAIContent } from '@/services/aiGeneration.js'
import { executiveSummaryConfig } from '@/configs/executiveSummary.config.js'

const projectStore = useProjectStore()
const subscriptionStore = useSubscriptionStore()

// State
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')
const executiveSummary = ref(null)
const isGeneratingSummary = ref(false)
const summaryError = ref('')
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
  },
  {
    name: 'advertising',
    label: 'Paid Advertising',
    items: [
      {
        id: 'advertising-1',
        name: 'Launch Paid Ads',
        description: 'Create and launch profitable paid advertising campaigns on Facebook, Google, and Instagram with AI-guided strategy.',
        miniAppId: 'paid-ads-launch',
        hasAI: true
      },
      {
        id: 'advertising-2',
        name: 'Optimize Paid Ads',
        description: 'Analyze ad performance, optimize spend allocation, and scale winning campaigns with advanced analytics.',
        miniAppId: 'paid-ads-optimize',
        hasAI: true
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
 * Generate Executive Summary with Priority Tasks
 * Uses centralized generateAIContent() service for quota tracking
 */
const generateExecutiveSummary = async () => {
  if (isGeneratingSummary.value) return
  isGeneratingSummary.value = true
  summaryError.value = ''

  try {
    // Build form data with all project information for the AI prompt
    const formData = {
      appDescription: projectStore.currentProjectSettings.appDescription || '',
      projectGoals: projectStore.currentProjectSettings.goals || '',
      targetAudience: projectStore.currentProjectSettings.targetAudience || '',
      techStack: projectStore.currentProjectSettings.techStack || '',
      progress: progressPercentage.value.toString(),
      completedTasks: completedTasks.value.toString(),
      totalTasks: totalTasks.value.toString(),
      checklistSummary: taskCategories.value
        .map(cat => {
          const completed = cat.items.filter(item => projectStore.currentProjectTasks[item.id]?.checked).length
          const total = cat.items.length
          return `  - ${cat.label}: ${completed}/${total} completed`
        })
        .join('\n')
    }

    console.log('[Dashboard] Calling generateAIContent with project data')

    // Call centralized AI generation service (includes quota checks and tracking)
    const result = await generateAIContent(
      executiveSummaryConfig,  // Task configuration with aiConfig
      formData,                 // Form data with project information
      { skipQuotaCheck: false } // Enforce quota checking
    )

    console.log('[Dashboard] Received summary result:', result)

    // The parseResponse function from config already structured the result
    executiveSummary.value = result
  } catch (error) {
    console.error('Error generating executive summary:', error)
    summaryError.value = error.message || 'Failed to generate executive summary. Please try again.'
  } finally {
    isGeneratingSummary.value = false
  }
}

/**
 * Handle upgrade button click from quota card
 */
const handleUpgradeClick = () => {
  // TODO: Navigate to upgrade/pricing page or show upgrade modal
  console.log('[Dashboard] Upgrade button clicked')
  // This will be connected to the PayPal upgrade flow in Phase 6
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
    })
    markdown += '\n'
  })

  copyToClipboard(markdown)
  alert('Markdown copied to clipboard!')
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
