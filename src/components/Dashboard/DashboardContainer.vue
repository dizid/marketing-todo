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
        <!-- Task Recommendation Card (Task DNA) -->
        <NextTaskCard
          v-if="showRecommendation && taskRecommendation"
          :recommendation="taskRecommendation"
          @start-task="handleStartRecommendedTask"
          @view-roadmap="handleViewRoadmap"
          @select-alternative="handleSelectAlternative"
          @close="showRecommendation = false"
        />

        <!-- Progress Card -->
        <ProgressCard
          :percentage="progressPercentage"
          :completed="completedTasks"
          :total="totalTasks"
        />

        <!-- Search and Filter -->
        <SearchFilterBar
          :search-query="searchQuery"
          :selected-category="selectedCategory"
          :selected-status="selectedStatus"
          @search="searchQuery = $event"
          @category-change="selectedCategory = $event"
          @status-change="selectedStatus = $event"
        />

        <!-- Task Checklist -->
        <TaskChecklistView
          :filtered-categories="filteredCategories"
          :project-tasks="projectStore.currentProjectTasks"
          @task-checked="handleTaskUpdate"
          @task-removed="handleTaskRemoved"
          @task-opened="handleTaskOpened"
          @show-add-tasks="handleShowAddTasks"
        />

        <!-- Executive Summary Section -->
        <ExecutiveSummarySection
          :summary="executiveSummary"
          :is-generating="isGeneratingSummary"
          :error="summaryError"
          @generate="generateExecutiveSummary"
        />

        <!-- Action Buttons -->
        <ActionButtonsSection
          @export="exportAsMarkdown"
          @reset="resetProjectTasks"
        />
      </template>
    </div>

    <!-- Task Modal -->
    <TaskModal
      :is-open="showTaskModal"
      :task-id="selectedTaskId"
      @close="handleTaskModalClosed"
    />

    <!-- Add Tasks Modal (for empty categories) -->
    <AddTasksModal
      :is-open="showAddTasksModal"
      :category-name="selectedCategoryName"
      @close="showAddTasksModal = false"
    />
  </div>
</template>

<script setup>
/**
 * DashboardContainer Component (Refactored)
 *
 * Orchestrates dashboard sections and manages state.
 * Responsibilities:
 * - Project loading and selection
 * - State management (filters, summary, modal)
 * - Event handling and coordination
 * - Business logic (progress calculation, export, reset)
 *
 * Child components handle UI rendering only.
 */

import { ref, computed, onMounted } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { useSubscriptionStore } from '@/stores/subscriptionStore'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { generateAIContent } from '@/services/aiGeneration.js'
import { executiveSummaryConfig } from '@/configs/executiveSummary.config.js'

// Child components
import ProjectHeader from '../Project/ProjectHeader.vue'
import QuotaStatusCard from '../QuotaStatusCard.vue'
import ProgressCard from './ProgressCard.vue'
import SearchFilterBar from './SearchFilterBar.vue'
import TaskChecklistView from './TaskChecklistView.vue'
import ExecutiveSummarySection from './ExecutiveSummarySection.vue'
import ActionButtonsSection from './ActionButtonsSection.vue'
import TaskModal from '../Task/TaskModal.vue'
import AddTasksModal from '../Project/AddTasksModal.vue'
import NextTaskCard from '../TaskRecommendation/NextTaskCard.vue'

// Stores
const projectStore = useProjectStore()
const subscriptionStore = useSubscriptionStore()
const onboardingStore = useOnboardingStore()

// STATE - Filters
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')

// STATE - Summary Generation
const executiveSummary = ref(null)
const isGeneratingSummary = ref(false)
const summaryError = ref('')

// STATE - Task Modal
const showTaskModal = ref(false)
const selectedTaskId = ref(null)

// STATE - Add Tasks Modal
const showAddTasksModal = ref(false)
const selectedCategoryName = ref(null)

// STATE - Task Recommendation (Task DNA)
const showRecommendation = ref(false)
const taskRecommendation = ref(null)
const recommendationDismissTimer = ref(null)

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
  },
  {
    name: 'sales',
    label: 'Sales Optimization',
    items: [
      {
        id: 'sales-1',
        name: 'Sales Funnel Blueprint',
        description: 'Design your complete sales funnel with proven conversion stages and psychology tactics.',
        miniAppId: 'funnel-blueprint',
        hasAI: true
      },
      {
        id: 'sales-2',
        name: 'High-Converting Offer Builder',
        description: 'Build a compelling offer including bonuses, guarantee, positioning, and pricing psychology.',
        miniAppId: 'offer-builder',
        hasAI: true
      },
      {
        id: 'sales-3',
        name: 'Objection Handling',
        description: 'Create powerful responses to every objection. Pre-emptively address common buyer hesitations.',
        miniAppId: 'objection-handling',
        hasAI: true
      },
      {
        id: 'sales-4',
        name: 'Email Sequence Designer',
        description: 'Write an automated email funnel that nurtures leads and drives conversions.',
        miniAppId: 'email-sequence',
        hasAI: true
      },
      {
        id: 'sales-5',
        name: 'Sales Page Audit',
        description: 'Get a conversion-focused audit of your sales page with specific optimization recommendations.',
        miniAppId: 'sales-page-audit',
        hasAI: true
      }
    ]
  },
  {
    name: 'growth',
    label: 'Growth Strategy',
    items: [
      {
        id: 'growth-1',
        name: 'Lead Magnet Builder',
        description: 'Create an irresistible lead magnet to build your email list 10x faster.',
        miniAppId: 'lead-magnet',
        hasAI: true
      },
      {
        id: 'growth-2',
        name: 'Cold Outreach Campaigns',
        description: 'Design personalized cold outreach campaigns that get responses and build relationships.',
        miniAppId: 'cold-outreach',
        hasAI: true
      },
      {
        id: 'growth-3',
        name: 'Competitor Analysis',
        description: 'Analyze competitors\' strategies, positioning, and vulnerabilities to find your competitive edge.',
        miniAppId: 'competitor-analysis',
        hasAI: true
      },
      {
        id: 'growth-4',
        name: 'A/B Testing Ideas',
        description: 'Generate powerful testing hypotheses to improve every metric that matters.',
        miniAppId: 'ab-test-ideas',
        hasAI: true
      },
      {
        id: 'growth-5',
        name: 'Positioning Map',
        description: 'Map your unique position in the market and craft positioning statements that stand out.',
        miniAppId: 'positioning-map',
        hasAI: true
      }
    ]
  }
])

// COMPUTED - Filtered categories based on search and filters
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

// COMPUTED - Task progress metrics
const totalTasks = computed(() => {
  return taskCategories.value.reduce((sum, cat) => {
    const activeItems = cat.items.filter(item => !projectStore.currentProjectTasks[item.id]?.removed)
    return sum + activeItems.length
  }, 0)
})

const completedTasks = computed(() => {
  return Object.entries(projectStore.currentProjectTasks)
    .filter(([taskId, taskData]) => taskData.checked && !taskData.removed)
    .length
})

const progressPercentage = computed(() => {
  if (totalTasks.value === 0) return 0
  return Math.round((completedTasks.value / totalTasks.value) * 100)
})

// EVENT HANDLERS

/**
 * Handle task status update (with Task DNA recommendation)
 */
const handleTaskUpdate = async (updatedTasks) => {
  try {
    await projectStore.updateProjectTasks(updatedTasks)

    // Get task recommendation after update (Task DNA feature)
    try {
      const recommendation = await projectStore.getTaskRecommendation()
      if (recommendation && recommendation.nextTask) {
        taskRecommendation.value = recommendation
        showRecommendation.value = true
        // Recommendation stays visible indefinitely until user interacts or manually closes
        // No auto-dismiss - this is a key guidance card users should see
        clearTimeout(recommendationDismissTimer.value)
      }
    } catch (err) {
      // Silently fail - recommendation is a nice-to-have feature
      console.warn('Could not fetch task recommendation:', err)
    }
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
 * Handle task opened - show TaskModal
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
  // Note: Don't dismiss recommendation here - let it stay visible or auto-dismiss naturally
}

/**
 * Handle start recommended task
 */
const handleStartRecommendedTask = (task) => {
  if (task && task.id) {
    selectedTaskId.value = task.id
    showTaskModal.value = true
    // Cancel the auto-dismiss timer since user is actively engaging
    clearTimeout(recommendationDismissTimer.value)
  }
}

/**
 * Handle view roadmap button
 */
const handleViewRoadmap = () => {
  // TODO: Implement in v1.1 - for now just show a toast
  console.log('[Task DNA] Roadmap view requested - implement in v1.1')
  // Show toast: "Roadmap view coming in v1.1"
}

/**
 * Handle select alternative task
 */
const handleSelectAlternative = (taskId) => {
  if (taskId) {
    selectedTaskId.value = taskId
    showTaskModal.value = true
  }
}

/**
 * Handle show add tasks for category
 */
const handleShowAddTasks = (data) => {
  selectedCategoryName.value = data.categoryName
  showAddTasksModal.value = true
}

/**
 * Generate Executive Summary with Priority Tasks
 */
const generateExecutiveSummary = async () => {
  if (isGeneratingSummary.value) return
  isGeneratingSummary.value = true
  summaryError.value = ''

  try {
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

    const result = await generateAIContent(
      executiveSummaryConfig,
      formData,
      { skipQuotaCheck: false }
    )

    executiveSummary.value = result
  } catch (error) {
    console.error('Error generating executive summary:', error)
    summaryError.value = error.message || 'Failed to generate executive summary. Please try again.'
  } finally {
    isGeneratingSummary.value = false
  }
}

/**
 * Handle upgrade button click
 */
const handleUpgradeClick = () => {
  console.log('[Dashboard] Upgrade button clicked')
}

/**
 * Export project data as Markdown
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
 * Reset all project tasks
 */
const resetProjectTasks = () => {
  if (confirm('Are you sure you want to reset all tasks for this project? This cannot be undone.')) {
    projectStore.updateProjectTasks({})
    alert('All tasks have been reset!')
  }
}

/**
 * Lifecycle - Initialize on mount
 */
onMounted(async () => {
  if (projectStore.projects.length === 0) {
    await projectStore.fetchProjects()
  }

  // Hydrate onboarding store with current project settings (multi-device sync)
  if (projectStore.currentProjectSettings && Object.keys(projectStore.currentProjectSettings).length > 0) {
    onboardingStore.updateMultiple({
      productType: projectStore.currentProjectSettings.productType,
      productName: projectStore.currentProjectSettings.productName,
      productDescription: projectStore.currentProjectSettings.productDescription,
      targetAudience: projectStore.currentProjectSettings.targetAudience,
      mainGoal: projectStore.currentProjectSettings.mainGoal,
      timeline: projectStore.currentProjectSettings.timeline,
      budget: projectStore.currentProjectSettings.budget,
      teamSize: projectStore.currentProjectSettings.teamSize,
      techStack: projectStore.currentProjectSettings.techStack,
      currentStage: projectStore.currentProjectSettings.currentStage,
      launchDate: projectStore.currentProjectSettings.launchDate
    })
  }
})
</script>

<style scoped>
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
