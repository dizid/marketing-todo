// Project Store - Pinia state management for projects
// Manages: current project, all projects, project data

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
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

  // Computed
  const currentProjectSettings = computed(() => projectData.value?.settings || {})
  const currentProjectTasks = computed(() => projectData.value?.tasks || {})
  const currentProjectContent = computed(() => projectData.value?.content || [])

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
      const allData = await getAllProjectData(projectId)
      projectData.value = allData

      // Initialize if first time
      if (!allData.settings) {
        await initializeProject(projectId)
        const allData = await getAllProjectData(projectId)
        projectData.value = allData
      }
    } catch (err) {
      error.value = err.message
      console.error('Error selecting project:', err)
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

  return {
    // State
    projects,
    currentProjectId,
    currentProject,
    projectData,
    isLoading,
    error,

    // Computed
    currentProjectSettings,
    currentProjectTasks,
    currentProjectContent,

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
    addContent
  }
})
