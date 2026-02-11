// Project Store - Pinia state management for projects
// Manages: current project, all projects, project data
// Uses normalized task storage (task_form_data, task_saved_items tables)

import { defineStore } from 'pinia'
import { ref, computed, onScopeDispose } from 'vue'
import { useAuthStore } from './authStore'
import { logger } from '@/utils/logger'
import {
  getProjects,
  getProject,
  createProject as createProjectService,
  updateProject as updateProjectService,
  deleteProject as deleteProjectService,
  getAllProjectData,
  saveProjectSettings,
  saveProjectTasks,
  addProjectContent,
  initializeProject
} from '@/services/projectService.js'

// Normalized task data service
import {
  saveTaskData,
  getAllTaskData
} from '@/services/taskDataService.js'

export const useProjectStore = defineStore('project', () => {
  // State
  const projects = ref([])
  const currentProjectId = ref(null)
  const currentProject = ref(null)
  const projectData = ref({})
  const isLoading = ref(false)
  const error = ref(null)
  const lastDataFetch = ref(null)

  // Get auth store for user info
  const authStore = useAuthStore()

  // Constants for data refresh
  const STALE_DATA_THRESHOLD = 5 * 60 * 1000 // 5 minutes

  // Computed
  const currentProjectSettings = computed(() => projectData.value?.settings || {})
  const currentProjectTasks = computed(() => projectData.value?.tasks || {})
  const currentProjectContent = computed(() => projectData.value?.content || [])
  const currentProjectTaskData = computed(() => projectData.value?.taskData || {})

  // Expose current user from auth store
  const currentUser = computed(() => authStore.user)

  // ProjectContext canonical field computed properties (with fallback to projectData.settings)
  const projectName = computed(() =>
    currentProjectSettings.value?.productName ||
    currentProjectSettings.value?.name ||
    currentProject.value?.name ||
    ''
  )

  const productDescription = computed(() =>
    currentProjectSettings.value?.productDescription ||
    currentProjectSettings.value?.description ||
    currentProject.value?.description ||
    ''
  )

  const targetAudience = computed(() =>
    currentProjectSettings.value?.targetAudience ||
    ''
  )

  const primaryGoal = computed(() =>
    currentProjectSettings.value?.primaryGoal ||
    currentProjectSettings.value?.goals ||
    ''
  )

  const targetTimeline = computed(() =>
    currentProjectSettings.value?.targetTimeline ||
    currentProjectSettings.value?.timeline ||
    ''
  )

  const techStack = computed(() =>
    currentProjectSettings.value?.techStack ||
    ''
  )

  const marketingBudget = computed(() =>
    currentProjectSettings.value?.marketingBudget ||
    ''
  )

  const teamSize = computed(() =>
    currentProjectSettings.value?.teamSize ||
    ''
  )

  // Experience level for task recommendations (beginner, intermediate, advanced)
  const experienceLevel = computed(() =>
    currentProjectSettings.value?.experienceLevel || 'beginner'
  )

  // Active playbook (e.g., 'first-10-customers')
  const activePlaybook = computed(() =>
    currentProjectSettings.value?.activePlaybook || null
  )

  /**
   * Fetch all projects for current user
   */
  const fetchProjects = async () => {
    isLoading.value = true
    error.value = null
    try {
      const result = await getProjects()
      projects.value = result

      // Auto-select first project if none selected
      if (result.length > 0 && !currentProjectId.value) {
        await selectProject(result[0].id)
      }
    } catch (err) {
      error.value = err.message
      console.error('Error fetching projects:', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Select a project and load its data
   */
  const selectProject = async (projectId, forceRefresh = false) => {
    isLoading.value = true
    error.value = null
    try {
      const project = await getProject(projectId)
      if (!project) throw new Error('Project not found')

      currentProjectId.value = projectId
      currentProject.value = project

      // Check if data is stale and needs refresh
      const isStale = forceRefresh || !lastDataFetch.value ||
                     (Date.now() - lastDataFetch.value > STALE_DATA_THRESHOLD)

      if (isStale || !projectData.value.settings) {
        // Load project settings/tasks/content
        let allData = await getAllProjectData(projectId)
        projectData.value = allData

        // Initialize if first time
        if (!allData.settings) {
          await initializeProject(projectId)
          allData = await getAllProjectData(projectId)
          projectData.value = allData
        }

        // Load task form data from normalized storage
        const taskData = await getAllTaskData(projectId)
        projectData.value.taskData = taskData
        lastDataFetch.value = Date.now()
        logger.debug(`[ProjectStore] Loaded ${Object.keys(taskData).length} tasks`)
      } else {
        logger.debug('[ProjectStore] Using cached project data (not stale)')
      }
    } catch (err) {
      error.value = err.message
      logger.error('Error selecting project', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Create new project
   */
  const createProject = async (name, description = '') => {
    isLoading.value = true
    error.value = null
    try {
      const newProject = await createProjectService(name, description)

      // Initialize project with default data
      await initializeProject(newProject.id)

      // Add to projects list and select it
      projects.value.push(newProject)
      await selectProject(newProject.id)

      return newProject
    } catch (err) {
      error.value = err.message
      console.error('Error creating project:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Update project info (name, description, status)
   */
  const updateProject = async (updates) => {
    if (!currentProjectId.value) throw new Error('No project selected')

    try {
      const updated = await updateProjectService(currentProjectId.value, updates)
      currentProject.value = updated

      // Update in list
      const index = projects.value.findIndex(p => p.id === currentProjectId.value)
      if (index >= 0) projects.value[index] = updated

      return updated
    } catch (err) {
      error.value = err.message
      console.error('Error updating project:', err)
      throw err
    }
  }

  /**
   * Delete project
   */
  const deleteProject = async (projectId) => {
    try {
      await deleteProjectService(projectId)
      projects.value = projects.value.filter(p => p.id !== projectId)

      // If deleted current project, select another
      if (currentProjectId.value === projectId) {
        currentProjectId.value = null
        currentProject.value = null
        projectData.value = {}
        if (projects.value.length > 0) {
          await selectProject(projects.value[0].id)
        }
      }
    } catch (err) {
      error.value = err.message
      console.error('Error deleting project:', err)
      throw err
    }
  }

  /**
   * Update project settings
   */
  const updateProjectSettings = async (settings) => {
    if (!currentProjectId.value) throw new Error('No project selected')

    try {
      await saveProjectSettings(currentProjectId.value, settings)
      projectData.value.settings = settings
    } catch (err) {
      error.value = err.message
      console.error('Error updating settings:', err)
      throw err
    }
  }

  /**
   * Update project tasks
   */
  const updateProjectTasks = async (tasks) => {
    if (!currentProjectId.value) throw new Error('No project selected')

    try {
      await saveProjectTasks(currentProjectId.value, tasks)
      projectData.value.tasks = tasks
    } catch (err) {
      error.value = err.message
      console.error('Error updating tasks:', err)
      throw err
    }
  }

  /**
   * Update single task
   */
  const updateTask = async (taskId, taskUpdates) => {
    const tasks = { ...currentProjectTasks.value }
    tasks[taskId] = {
      ...tasks[taskId],
      ...taskUpdates
    }
    await updateProjectTasks(tasks)
  }

  /**
   * Remove task from project (doesn't count toward progress)
   */
  const removeTask = async (taskId) => {
    await updateTask(taskId, { removed: true })
  }

  /**
   * Add task back to project (makes it count toward progress again)
   */
  const addTask = async (taskId) => {
    await updateTask(taskId, { removed: false })
  }

  /**
   * Add generated content
   */
  const addContent = async (contentType, content) => {
    if (!currentProjectId.value) throw new Error('No project selected')

    try {
      const updated = await addProjectContent(currentProjectId.value, contentType, content)
      projectData.value.content = updated
    } catch (err) {
      error.value = err.message
      console.error('Error adding content:', err)
      throw err
    }
  }

  /**
   * Update task-specific data (for mini-apps)
   * Saves formData and savedItems to normalized storage
   * Note: aiOutput is NOT stored - regenerated on demand
   */
  const updateTaskData = async (taskId, taskData) => {
    if (!currentProjectId.value) throw new Error('No project selected')

    try {
      if (!projectData.value.taskData) {
        projectData.value.taskData = {}
      }

      // Only save formData and savedItems (not aiOutput)
      const dataToSave = {
        formData: taskData.formData,
        savedItems: taskData.savedItems
      }

      projectData.value.taskData[taskId] = {
        ...projectData.value.taskData[taskId],
        ...dataToSave
      }

      // Save to normalized storage
      await saveTaskData(currentProjectId.value, taskId, dataToSave)
      logger.debug(`[ProjectStore] Saved task: ${taskId}`)
    } catch (err) {
      error.value = err.message
      console.error('Error updating task data:', err)
      throw err
    }
  }

  /**
   * Get task-specific data
   */
  const getTaskData = (taskId) => {
    return projectData.value.taskData?.[taskId] || {}
  }

  /**
   * Get next task recommendation based on user context and completed tasks
   */
  const getTaskRecommendation = async () => {
    if (!currentProjectId.value) throw new Error('No project selected')

    try {
      const { getNextTaskRecommendation } = await import('@/services/taskRecommendationEngine.js')

      // Get user context from settings (including experience level)
      const userContext = {
        productType: currentProjectSettings.value?.productType,
        experienceLevel: experienceLevel.value
      }

      // Get completed task IDs
      const tasks = currentProjectTasks.value || {}
      const completedTaskIds = Object.entries(tasks)
        .filter(([_, task]) => task.checked && !task.removed)
        .map(([id, _]) => id)

      // Get recommendation
      const recommendation = getNextTaskRecommendation(userContext, completedTaskIds)

      return recommendation
    } catch (err) {
      error.value = err.message
      console.error('Error getting task recommendation:', err)
      throw err
    }
  }

  /**
   * Update experience level (beginner, intermediate, advanced)
   */
  const setExperienceLevel = async (level) => {
    if (!currentProjectId.value) throw new Error('No project selected')

    const validLevels = ['beginner', 'intermediate', 'advanced']
    if (!validLevels.includes(level)) {
      throw new Error(`Invalid experience level: ${level}. Must be one of: ${validLevels.join(', ')}`)
    }

    try {
      const updatedSettings = {
        ...currentProjectSettings.value,
        experienceLevel: level
      }
      await updateProjectSettings(updatedSettings)
      logger.info(`[ProjectStore] Experience level set to: ${level}`)
    } catch (err) {
      error.value = err.message
      console.error('Error setting experience level:', err)
      throw err
    }
  }

  /**
   * Set active playbook (or null to clear)
   * @param {string|null} playbookId - Playbook ID to activate or null to deactivate
   */
  const setActivePlaybook = async (playbookId) => {
    if (!currentProjectId.value) throw new Error('No project selected')

    try {
      const updatedSettings = {
        ...currentProjectSettings.value,
        activePlaybook: playbookId
      }
      await updateProjectSettings(updatedSettings)
      logger.info(`[ProjectStore] Active playbook set to: ${playbookId || 'none'}`)
    } catch (err) {
      error.value = err.message
      console.error('Error setting active playbook:', err)
      throw err
    }
  }

  /**
   * Force refresh project data (bypasses cache)
   */
  const refreshProjectData = async () => {
    if (!currentProjectId.value) {
      logger.warn('[ProjectStore] No project selected, cannot refresh')
      return
    }

    logger.debug('[ProjectStore] Force refreshing project data')
    await selectProject(currentProjectId.value, true)
  }

  /**
   * Check if data is stale and refresh if needed
   */
  const checkAndRefreshIfStale = async () => {
    if (!currentProjectId.value || !lastDataFetch.value) return

    const isStale = Date.now() - lastDataFetch.value > STALE_DATA_THRESHOLD
    if (isStale) {
      logger.debug('[ProjectStore] Data is stale, refreshing')
      await refreshProjectData()
    }
  }

  // Listen for visibility changes to refresh stale data when user returns
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      checkAndRefreshIfStale()
    }
  }

  // Set up visibility listener
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', handleVisibilityChange)
  }

  // Clean up listener when store is disposed
  onScopeDispose(() => {
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  })

  /**
   * Get playbook progress and next task recommendation
   * @returns {Object} Playbook progress with next task
   */
  const getPlaybookRecommendation = async () => {
    if (!currentProjectId.value) throw new Error('No project selected')
    if (!activePlaybook.value) return null

    try {
      const { getPlaybookProgress, getPlaybookNextTask } = await import('@/services/taskRecommendationEngine.js')

      // Get completed task IDs
      const tasks = currentProjectTasks.value || {}
      const completedTaskIds = Object.entries(tasks)
        .filter(([_, task]) => task.checked && !task.removed)
        .map(([id, _]) => id)

      const progress = getPlaybookProgress(activePlaybook.value, completedTaskIds)
      const nextTask = getPlaybookNextTask(activePlaybook.value, completedTaskIds)

      return {
        playbookId: activePlaybook.value,
        progress,
        nextTask
      }
    } catch (err) {
      error.value = err.message
      console.error('Error getting playbook recommendation:', err)
      throw err
    }
  }

  return {
    // State
    projects,
    currentProjectId,
    currentProject,
    projectData,
    isLoading,
    error,
    lastDataFetch,

    // Computed
    currentProjectSettings,
    currentProjectTasks,
    currentProjectContent,
    currentProjectTaskData,
    currentUser,
    projectName,
    productDescription,
    targetAudience,
    primaryGoal,
    targetTimeline,
    techStack,
    marketingBudget,
    teamSize,
    experienceLevel,
    activePlaybook,

    // Actions
    fetchProjects,
    selectProject,
    createProject,
    updateProject,
    deleteProject,
    updateProjectSettings,
    updateProjectTasks,
    updateTask,
    removeTask,
    addTask,
    updateTaskData,
    getTaskData,
    addContent,
    getTaskRecommendation,
    setExperienceLevel,
    setActivePlaybook,
    getPlaybookRecommendation,
    refreshProjectData,
    checkAndRefreshIfStale
  }
})
