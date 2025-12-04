// Project Store - Pinia state management for projects
// Manages: current project, all projects, project data

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './authStore'
import { logger } from '@/utils/logger'
import { useConflictDetection } from '@/composables/useConflictDetection'
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

export const useProjectStore = defineStore('project', () => {
  // State
  const projects = ref([])
  const currentProjectId = ref(null)
  const currentProject = ref(null)
  const projectData = ref({})
  const isLoading = ref(false)
  const error = ref(null)

  // Phase 3 Task 3.4: Conflict detection state
  const taskDataVersions = ref({}) // Track version of each task's data
  const conflictDetection = useConflictDetection()

  // Get auth store for user info
  const authStore = useAuthStore()

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
  const selectProject = async (projectId) => {
    isLoading.value = true
    error.value = null
    try {
      const project = await getProject(projectId)
      if (!project) throw new Error('Project not found')

      currentProjectId.value = projectId
      currentProject.value = project

      // Load all project data
      let allData = await getAllProjectData(projectId)
      projectData.value = allData

      // Initialize if first time
      if (!allData.settings) {
        await initializeProject(projectId)
        allData = await getAllProjectData(projectId)
        projectData.value = allData
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
   * Phase 3 Task 3.4: Includes conflict detection for concurrent edits
   */
  const updateTaskData = async (taskId, taskData) => {
    if (!currentProjectId.value) throw new Error('No project selected')

    try {
      if (!projectData.value.taskData) {
        projectData.value.taskData = {}
      }

      projectData.value.taskData[taskId] = {
        ...projectData.value.taskData[taskId],
        ...taskData
      }

      // Get current version for optimistic locking
      const currentVersion = taskDataVersions.value[taskId] || 1

      // Save to database with version tracking
      await saveProjectTaskData(currentProjectId.value, projectData.value.taskData, currentVersion, taskId)

      // Update version on successful save
      if (!taskDataVersions.value[taskId]) {
        taskDataVersions.value[taskId] = currentVersion
      }
    } catch (err) {
      // Phase 3 Task 3.4: Detect conflicts
      if (err?.status === 409 || err?.response?.status === 409) {
        const conflictError = err?.data?.error || err?.response?.data?.error || {}
        conflictDetection.detectConflict(err, taskId, taskDataVersions.value[taskId] || 1)
        error.value = `Conflict: ${conflictDetection.getConflictMessage()}`
        console.warn('[ProjectStore] Conflict detected on task:', taskId, conflictError)
      } else {
        error.value = err.message
        console.error('Error updating task data:', err)
      }
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
   * Save all task data to database
   * Phase 3 Task 3.4: Includes optimistic locking with version parameter
   * Helper function
   */
  const saveProjectTaskData = async (projectId, taskData, version = 1, taskId = null) => {
    // Use Supabase to save with optimistic locking
    const { data, error: err, status } = await import('@/utils/supabase').then(mod =>
      mod.supabase
        .from('project_data')
        .upsert({
          project_id: projectId,
          key: 'taskData',
          value: taskData,
          version: version // Include version for optimistic locking
        }, { onConflict: 'project_id,key' })
        .select()
    )

    // Handle conflict detection
    if (status === 409 || err?.code === '409') {
      const conflictError = new Error('Concurrent edit conflict')
      conflictError.status = 409
      conflictError.taskId = taskId
      conflictError.localVersion = version
      throw conflictError
    }

    if (err) throw err
    return data
  }

  /**
   * Phase 3 Task 3.4: Reload task data from server to resolve conflicts
   */
  const reloadTaskData = async (taskId) => {
    if (!currentProjectId.value) throw new Error('No project selected')

    try {
      const allData = await getAllProjectData(currentProjectId.value)
      if (allData?.taskData) {
        projectData.value.taskData = allData.taskData
        // Reset version to server version
        taskDataVersions.value[taskId] = 1
        conflictDetection.clearConflict()
      }
    } catch (err) {
      error.value = err.message
      console.error('Error reloading task data:', err)
      throw err
    }
  }

  /**
   * Phase 3 Task 3.4: Clear conflict state
   */
  const clearConflict = () => {
    conflictDetection.clearConflict()
  }

  /**
   * Get next task recommendation based on user context and completed tasks
   */
  const getTaskRecommendation = async () => {
    if (!currentProjectId.value) throw new Error('No project selected')

    try {
      const { getNextTaskRecommendation } = await import('@/services/taskRecommendationEngine.js')

      // Get user context from settings
      const userContext = {
        productType: currentProjectSettings.value?.productType
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

  return {
    // State
    projects,
    currentProjectId,
    currentProject,
    projectData,
    isLoading,
    error,
    // Phase 3 Task 3.4: Conflict detection state
    taskDataVersions,
    hasConflict: () => conflictDetection.hasConflict,
    conflictInfo: () => conflictDetection.conflictInfo,

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
    // Phase 3 Task 3.4: Conflict resolution actions
    reloadTaskData,
    clearConflict
  }
})
