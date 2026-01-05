<template>
  <div class="min-h-screen bg-var(--cyberpunk-dark)" style="background: var(--cyberpunk-dark)">
    <!-- Header with Project Navigation -->
    <ProjectHeader />

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Experience Mode Toggle (Beginner/Intermediate) -->
      <ExperienceModeToggle v-if="projectStore.currentProject" />

      <!-- Playbook Selector (First 10 Customers, etc.) -->
      <PlaybookSelector v-if="projectStore.currentProject" @task-opened="handleTaskOpened" />

      <!-- Welcome Banner (for beginners) -->
      <WelcomeBanner v-if="projectStore.currentProject" />

      <!-- No Project State -->
      <div v-if="!projectStore.currentProject" class="card p-12 text-center animate-fade-in">
        <p class="text-muted mb-4">No project selected. Create a new project to get started.</p>
      </div>

      <!-- Project Content -->
      <template v-else>
        <!-- Task Recommendation Card (Task DNA) - hidden when playbook is active -->
        <NextTaskCard
          v-if="showRecommendation && taskRecommendation && !projectStore.activePlaybook"
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

        <!-- Task Checklist (Accordion) -->
        <TaskChecklistView
          :filtered-categories="filteredCategories"
          :project-tasks="projectStore.currentProjectTasks"
          :current-phase-category="currentPhaseCategory"
          :hidden-task-count="hiddenTaskCount"
          :hidden-task-preview="hiddenTaskPreview"
          :experience-level="projectStore.experienceLevel"
          @task-checked="handleTaskUpdate"
          @task-removed="handleTaskRemoved"
          @task-opened="handleTaskOpened"
          @show-add-tasks="handleShowAddTasks"
          @upgrade-to-intermediate="handleUpgradeToIntermediate"
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
      :is-saving="isSaving"
      :save-error="saveError"
      :last-save-time="lastSaveTime"
      @close="handleTaskModalClosed"
      @save="handleTaskSave"
      @complete="handleTaskComplete"
    />

    <!-- Add Tasks Modal (for empty categories) -->
    <AddTasksModal
      :is-open="showAddTasksModal"
      :category-name="selectedCategoryName"
      @close="showAddTasksModal = false"
    />

    <!-- Level Up Notification (when upgrading to intermediate) -->
    <LevelUpNotification
      :is-visible="showLevelUpNotification"
      :unlocked-tasks="unlockedTasksForNotification"
      @dismiss="showLevelUpNotification = false"
    />

    <!-- Graduation Prompt (when all beginner tasks completed) -->
    <GraduationPrompt
      :is-visible="showGraduationPrompt"
      :completed-tasks="completedBeginnerTasks"
      @stay-beginner="handleStayBeginner"
      @upgrade="handleGraduationUpgrade"
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

import { ref, computed, onMounted, watch } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { useQuotaStore } from '@/stores/quotaStore'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { generateAIContent } from '@/services/aiGeneration.js'
import { executiveSummaryConfig } from '@/configs/executiveSummary.config.js'
import { useSaveState } from '@/composables/useSaveState'
import { globalPollingControl } from '@/composables/usePollingControl'
import { getTaskCountsByExperienceLevel } from '@/services/taskRecommendationEngine'

// Child components
import ProjectHeader from '../Project/ProjectHeader.vue'
import ProgressCard from './ProgressCard.vue'
import TaskChecklistView from './TaskChecklistView.vue'
import ExecutiveSummarySection from './ExecutiveSummarySection.vue'
import ActionButtonsSection from './ActionButtonsSection.vue'
import TaskModal from '../Task/TaskModal.vue'
import AddTasksModal from '../Project/AddTasksModal.vue'
import NextTaskCard from '../TaskRecommendation/NextTaskCard.vue'
import ExperienceModeToggle from './ExperienceModeToggle.vue'
import PlaybookSelector from './PlaybookSelector.vue'
import LevelUpNotification from './LevelUpNotification.vue'
import GraduationPrompt from './GraduationPrompt.vue'
import WelcomeBanner from './WelcomeBanner.vue'

// Stores
const projectStore = useProjectStore()
const quotaStore = useQuotaStore()
const onboardingStore = useOnboardingStore()

// STATE - Summary Generation
const executiveSummary = ref(null)
const isGeneratingSummary = ref(false)
const summaryError = ref('')

// STATE - Task Modal
const showTaskModal = ref(false)
const selectedTaskId = ref(null)

// STATE - Save tracking
const { isSaving, saveError, lastSaveTime, setSaving, setSaveError, clearError, recordSaveSuccess } = useSaveState()

// STATE - Add Tasks Modal
const showAddTasksModal = ref(false)
const selectedCategoryName = ref(null)

// STATE - Task Recommendation (Task DNA)
const showRecommendation = ref(false)
const taskRecommendation = ref(null)
const recommendationDismissTimer = ref(null)

// STATE - Level Up Notification
const showLevelUpNotification = ref(false)
const unlockedTasksForNotification = ref([])

// STATE - Graduation Prompt (when all beginner tasks completed)
const showGraduationPrompt = ref(false)
const hasShownGraduationPrompt = ref(false)

// Task categories data (global template - applies to all projects)
// experienceLevels: 'beginner' = 10 essential tasks, 'intermediate' = all 24+ tasks
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
        miniAppId: 'define-audience',
        experienceLevels: ['beginner', 'intermediate']
      },
      {
        id: 'setup-2',
        name: 'Set Up Landing Page',
        description: 'Build a simple site with features, screenshots, and sign-up form.',
        aiPrompt: 'Generate headline, 5 bullets, and CTA copy for landing page on [app desc].',
        hasAI: true,
        experienceLevels: ['beginner', 'intermediate']
      },
      {
        id: 'setup-3',
        name: 'Connect Accounts',
        description: 'Link social (X, LinkedIn, Reddit), email (Mailchimp), and analytics.',
        aiPrompt: '',
        hasAI: false,
        miniAppId: 'connect-accounts',
        experienceLevels: ['beginner', 'intermediate']
      },
      {
        id: 'setup-4',
        name: 'Prepare Assets',
        description: 'Create demo video/screenshots and basic branding.',
        aiPrompt: '',
        hasAI: false,
        miniAppId: 'prepare-assets',
        experienceLevels: ['beginner', 'intermediate']
      },
      {
        id: 'setup-5',
        name: 'Set Up Tracking Sheet',
        description: 'Use Google Sheets for logging sign-ups and sources.',
        aiPrompt: '',
        hasAI: false,
        miniAppId: 'tracking-sheet',
        experienceLevels: ['beginner', 'intermediate']
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
        miniAppId: 'generate-posts',
        experienceLevels: ['beginner', 'intermediate']
      },
      {
        id: 'social-2',
        name: 'Engage Followers',
        description: 'Template responses for common interactions. Build community by engaging followers.',
        miniAppId: 'engage-followers',
        hasAI: false,
        experienceLevels: ['intermediate']
      },
      {
        id: 'social-3',
        name: 'Run Giveaway/Contest',
        description: 'Launch a giveaway in 5 steps. Offer free access for shares and engagement.',
        miniAppId: 'giveaway',
        hasAI: false,
        experienceLevels: ['intermediate']
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
        hasAI: true,
        experienceLevels: ['beginner', 'intermediate']
      },
      {
        id: 'content-2',
        name: 'Create Video Tutorial',
        description: 'Script a 2-minute product demo. Section-by-section guidance with timing targets.',
        miniAppId: 'video-script',
        hasAI: false,
        experienceLevels: ['intermediate']
      },
      {
        id: 'content-3',
        name: 'Design Graphics',
        description: 'Create graphics with AI-guided design briefs and step-by-step tutorials',
        miniAppId: 'design-graphics',
        hasAI: true,
        experienceLevels: ['intermediate']
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
        hasAI: false,
        experienceLevels: ['beginner', 'intermediate']
      },
      {
        id: 'acq-2',
        name: 'Personalized Outreach',
        description: 'Email/DM 20-50 potential users. 5 proven cold outreach templates.',
        miniAppId: 'outreach',
        hasAI: false,
        experienceLevels: ['intermediate']
      },
      {
        id: 'acq-3',
        name: 'Host Webinar/Q&A',
        description: 'Plan a 30-minute webinar. Structure, topics, and Q&A guidance.',
        miniAppId: 'webinar',
        hasAI: false,
        experienceLevels: ['intermediate']
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
        hasAI: false,
        experienceLevels: ['beginner', 'intermediate']
      },
      {
        id: 'feedback-2',
        name: 'Publish Product Updates',
        description: 'Share improvements and bug fixes. Track changelog across channels.',
        miniAppId: 'changelog',
        hasAI: false,
        experienceLevels: ['intermediate']
      },
      {
        id: 'feedback-3',
        name: 'Iterate on Features',
        description: 'Prioritize user requests and refine product. Feature matrix with impact/effort.',
        miniAppId: 'feature-prioritization',
        hasAI: false,
        experienceLevels: ['intermediate']
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
        hasAI: false,
        experienceLevels: ['intermediate']
      },
      {
        id: 'analytics-2',
        name: 'Optimize Channels',
        description: 'Analyze metrics by channel. Double down on high-performers.',
        miniAppId: 'channel-analyzer',
        hasAI: false,
        experienceLevels: ['intermediate']
      },
      {
        id: 'analytics-3',
        name: 'Review ROI',
        description: 'Calculate cost-per-user and track ROI metrics. 5 key metrics to monitor.',
        miniAppId: 'roi-calculator',
        hasAI: false,
        experienceLevels: ['intermediate']
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
        hasAI: true,
        experienceLevels: ['intermediate']
      },
      {
        id: 'advertising-2',
        name: 'Optimize Paid Ads',
        description: 'Analyze ad performance, optimize spend allocation, and scale winning campaigns with advanced analytics.',
        miniAppId: 'paid-ads-optimize',
        hasAI: true,
        experienceLevels: ['intermediate']
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
        hasAI: true,
        experienceLevels: ['intermediate']
      },
      {
        id: 'sales-2',
        name: 'High-Converting Offer Builder',
        description: 'Build a compelling offer including bonuses, guarantee, positioning, and pricing psychology.',
        miniAppId: 'offer-builder',
        hasAI: true,
        experienceLevels: ['beginner', 'intermediate']
      },
      {
        id: 'sales-3',
        name: 'Objection Handling',
        description: 'Create powerful responses to every objection. Pre-emptively address common buyer hesitations.',
        miniAppId: 'objection-handling',
        hasAI: true,
        experienceLevels: ['intermediate']
      },
      {
        id: 'sales-4',
        name: 'Email Sequence Designer',
        description: 'Write an automated email funnel that nurtures leads and drives conversions.',
        miniAppId: 'email-sequence',
        hasAI: true,
        experienceLevels: ['intermediate']
      },
      {
        id: 'sales-5',
        name: 'Sales Page Audit',
        description: 'Get a conversion-focused audit of your sales page with specific optimization recommendations.',
        miniAppId: 'sales-page-audit',
        hasAI: true,
        experienceLevels: ['intermediate']
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
        hasAI: true,
        experienceLevels: ['beginner', 'intermediate']
      },
      {
        id: 'growth-2',
        name: 'Cold Outreach Campaigns',
        description: 'Design personalized cold outreach campaigns that get responses and build relationships.',
        miniAppId: 'cold-outreach',
        hasAI: true,
        experienceLevels: ['intermediate']
      },
      {
        id: 'growth-3',
        name: 'Competitor Analysis',
        description: 'Analyze competitors\' strategies, positioning, and vulnerabilities to find your competitive edge.',
        miniAppId: 'competitor-analysis',
        hasAI: true,
        experienceLevels: ['intermediate']
      },
      {
        id: 'growth-4',
        name: 'A/B Testing Ideas',
        description: 'Generate powerful testing hypotheses to improve every metric that matters.',
        miniAppId: 'ab-test-ideas',
        hasAI: true,
        experienceLevels: ['intermediate']
      },
      {
        id: 'growth-5',
        name: 'Positioning Map',
        description: 'Map your unique position in the market and craft positioning statements that stand out.',
        miniAppId: 'positioning-map',
        hasAI: true,
        experienceLevels: ['beginner', 'intermediate']
      }
    ]
  }
])

// COMPUTED - Filtered categories based on experience level only (simplified UX)
const filteredCategories = computed(() => {
  const currentLevel = projectStore.experienceLevel || 'beginner'

  return taskCategories.value
    .map(category => ({
      ...category,
      items: category.items.filter(item => {
        // Experience level filter - hide tasks not available for current level
        if (item.experienceLevels && !item.experienceLevels.includes(currentLevel)) {
          return false
        }
        return true
      })
    }))
    .filter(cat => cat.items.length > 0)
})

// COMPUTED - Current phase category (first category with incomplete tasks - for accordion auto-expand)
const currentPhaseCategory = computed(() => {
  const tasks = projectStore.currentProjectTasks || {}
  for (const category of filteredCategories.value) {
    const hasIncomplete = category.items.some(item => {
      const taskData = tasks[item.id]
      return !taskData?.checked && !taskData?.removed
    })
    if (hasIncomplete) {
      return category.name
    }
  }
  // All complete - return first category
  return filteredCategories.value[0]?.name || ''
})

// COMPUTED - Hidden tasks (only for beginners - shows what's available in intermediate)
// Uses JSON-based task counts for accuracy (from TASK_DEPENDENCY_MAP.json)
const hiddenTasks = computed(() => {
  const currentLevel = projectStore.experienceLevel || 'beginner'
  if (currentLevel !== 'beginner') return []

  const hidden = []
  taskCategories.value.forEach(category => {
    category.items.forEach(item => {
      if (item.experienceLevels && !item.experienceLevels.includes('beginner')) {
        hidden.push({
          id: item.id,
          name: item.name,
          category: category.label
        })
      }
    })
  })
  return hidden
})

// Use JSON-based task counts for accurate hidden task count
const hiddenTaskCount = computed(() => {
  const currentLevel = projectStore.experienceLevel || 'beginner'
  if (currentLevel !== 'beginner') return 0

  try {
    const productType = projectStore.currentProjectSettings?.productType
    const counts = getTaskCountsByExperienceLevel(productType)
    const beginnerCount = counts['beginner']?.taskCount || 0
    const intermediateCount = counts['intermediate']?.taskCount || 0
    return intermediateCount - beginnerCount
  } catch (err) {
    // Fallback to legacy count if JSON-based count fails
    return hiddenTasks.value.length
  }
})

const hiddenTaskPreview = computed(() => {
  return hiddenTasks.value.slice(0, 3).map(t => t.name)
})

// COMPUTED - Task progress metrics (only counts visible tasks for current experience level)
const totalTasks = computed(() => {
  const currentLevel = projectStore.experienceLevel || 'beginner'
  return taskCategories.value.reduce((sum, cat) => {
    const activeItems = cat.items.filter(item => {
      // Must be visible for current experience level
      if (item.experienceLevels && !item.experienceLevels.includes(currentLevel)) {
        return false
      }
      // Must not be removed
      return !projectStore.currentProjectTasks[item.id]?.removed
    })
    return sum + activeItems.length
  }, 0)
})

const completedTasks = computed(() => {
  const currentLevel = projectStore.experienceLevel || 'beginner'

  // Get all visible task IDs for current experience level
  const visibleTaskIds = new Set()
  taskCategories.value.forEach(cat => {
    cat.items.forEach(item => {
      if (!item.experienceLevels || item.experienceLevels.includes(currentLevel)) {
        visibleTaskIds.add(item.id)
      }
    })
  })

  return Object.entries(projectStore.currentProjectTasks)
    .filter(([taskId, taskData]) => {
      return taskData.checked && !taskData.removed && visibleTaskIds.has(taskId)
    })
    .length
})

const progressPercentage = computed(() => {
  if (totalTasks.value === 0) return 0
  return Math.round((completedTasks.value / totalTasks.value) * 100)
})

// COMPUTED - Beginner tasks for graduation detection
const beginnerTasks = computed(() => {
  const tasks = []
  taskCategories.value.forEach(cat => {
    cat.items.forEach(item => {
      if (item.experienceLevels && item.experienceLevels.includes('beginner')) {
        tasks.push({
          id: item.id,
          name: item.name,
          category: cat.label
        })
      }
    })
  })
  return tasks
})

const completedBeginnerTasks = computed(() => {
  return beginnerTasks.value.filter(task => {
    const taskData = projectStore.currentProjectTasks[task.id]
    return taskData?.checked && !taskData?.removed
  })
})

const allBeginnerTasksCompleted = computed(() => {
  if (beginnerTasks.value.length === 0) return false
  return completedBeginnerTasks.value.length >= beginnerTasks.value.length
})

// Watch for beginner task completion to show graduation prompt
watch(allBeginnerTasksCompleted, (isComplete) => {
  // Only show if:
  // 1. All beginner tasks are completed
  // 2. User is still in beginner mode
  // 3. We haven't already shown the prompt in this session
  if (isComplete &&
      projectStore.experienceLevel === 'beginner' &&
      !hasShownGraduationPrompt.value) {
    showGraduationPrompt.value = true
    hasShownGraduationPrompt.value = true
  }
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
 * Handle task save
 * Called when MiniAppShell emits save event (after debounce)
 */
const handleTaskSave = async (saveData) => {
  try {
    const { taskId, data } = saveData
    if (!taskId || !data) {
      console.warn('[DashboardContainer] Invalid save data', saveData)
      return
    }

    // Pause polling before save
    globalPollingControl.pausePolling(taskId)

    setSaving(true)
    clearError()

    // Save to database via projectStore
    await projectStore.updateTaskData(taskId, data)

    recordSaveSuccess()
  } catch (error) {
    setSaveError(error.message || 'Failed to save task')
    console.error('[DashboardContainer] Save error:', error)
  } finally {
    setSaving(false)

    // Resume polling after save
    if (saveData?.taskId) {
      globalPollingControl.resumePolling(saveData.taskId)
    }
  }
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
 * Handle task marked complete from TaskModal
 */
const handleTaskComplete = async ({ taskId }) => {
  if (!taskId) return

  try {
    // Mark the task as checked
    const updatedTasks = {
      ...projectStore.currentProjectTasks,
      [taskId]: {
        ...projectStore.currentProjectTasks[taskId],
        checked: true
      }
    }
    await projectStore.updateProjectTasks(updatedTasks)

    // Get task recommendation after completion (Task DNA feature)
    try {
      const recommendation = await projectStore.getTaskRecommendation()
      if (recommendation && recommendation.nextTask) {
        taskRecommendation.value = recommendation
        showRecommendation.value = true
        clearTimeout(recommendationDismissTimer.value)
      }
    } catch (err) {
      console.warn('Could not fetch task recommendation:', err)
    }
  } catch (error) {
    console.error('Error marking task complete:', error)
  }
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
  // TODO: Implement in v1.1
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
 * Handle upgrade to intermediate experience level
 */
const handleUpgradeToIntermediate = async () => {
  try {
    // Capture hidden tasks before level change (since hiddenTasks depends on current level)
    unlockedTasksForNotification.value = [...hiddenTasks.value]

    await projectStore.setExperienceLevel('intermediate')

    // Show level-up notification after successful upgrade
    showLevelUpNotification.value = true
  } catch (error) {
    console.error('Error upgrading experience level:', error)
    showLevelUpNotification.value = false
    unlockedTasksForNotification.value = []
  }
}

/**
 * Handle staying on beginner mode from graduation prompt
 */
const handleStayBeginner = () => {
  showGraduationPrompt.value = false
}

/**
 * Handle upgrade from graduation prompt
 */
const handleGraduationUpgrade = async () => {
  showGraduationPrompt.value = false
  await handleUpgradeToIntermediate()
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
