/**
 * Project Store (Refactored)
 *
 * Focused responsibility: Project CRUD operations
 * Data: List of projects, current project selection
 * Does NOT: Task state, content, quota (separate stores)
 *
 * Uses: ProjectRepository for data access
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ProjectRepository } from '@/domain/repositories'
import { getSupabaseClient } from '@/utils/supabase'
import { logger } from '@/shared/utils'

const childLogger = logger.child('projectStore')

export const useProjectStore = defineStore('project', () => {
  const supabaseClient = getSupabaseClient()
  const projectRepository = new ProjectRepository(supabaseClient, {}, childLogger)

  // STATE
  const projects = ref([])
  const currentProjectId = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  // COMPUTED
  const currentProject = computed(() => {
    if (!currentProjectId.value) return null
    return projects.value.find(p => p.id === currentProjectId.value)
  })

  const projectList = computed(() => {
    return projects.value.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      createdAt: p.created_at,
      updatedAt: p.updated_at
    }))
  })

  // ACTIONS

  /**
   * Fetch all projects for current user
   */
  async function fetchProjects(userId) {
    isLoading.value = true
    error.value = null

    try {
      childLogger.debug('Fetching projects', { userId })
      const data = await projectRepository.getAll(userId)
      projects.value = data
      childLogger.info('Projects fetched', { count: data.length })
    } catch (err) {
      error.value = err.message
      childLogger.logError(err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Select a project
   */
  function selectProject(projectId) {
    const project = projects.value.find(p => p.id === projectId)
    if (!project) {
      error.value = `Project ${projectId} not found`
      return false
    }

    currentProjectId.value = projectId
    childLogger.debug('Project selected', { projectId })
    return true
  }

  /**
   * Create new project
   */
  async function createProject(userId, name, description = '') {
    isLoading.value = true
    error.value = null

    try {
      childLogger.debug('Creating project', { name })
      const projectData = await projectRepository.create(userId, name, description)

      // Initialize with defaults
      await projectRepository.initializeWithDefaults(projectData.id, {})

      projects.value.push(projectData)
      currentProjectId.value = projectData.id

      childLogger.info('Project created', { projectId: projectData.id })
      return projectData
    } catch (err) {
      error.value = err.message
      childLogger.logError(err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Update project metadata
   */
  async function updateProject(projectId, updates) {
    isLoading.value = true
    error.value = null

    try {
      childLogger.debug('Updating project', { projectId })
      const updatedData = await projectRepository.update(projectId, updates)

      const index = projects.value.findIndex(p => p.id === projectId)
      if (index >= 0) {
        projects.value[index] = updatedData
      }

      childLogger.info('Project updated', { projectId })
      return updatedData
    } catch (err) {
      error.value = err.message
      childLogger.logError(err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Delete project
   */
  async function deleteProject(projectId) {
    isLoading.value = true
    error.value = null

    try {
      childLogger.debug('Deleting project', { projectId })
      await projectRepository.delete(projectId)

      projects.value = projects.value.filter(p => p.id !== projectId)

      if (currentProjectId.value === projectId) {
        currentProjectId.value = projects.value.length > 0 ? projects.value[0].id : null
      }

      childLogger.info('Project deleted', { projectId })
    } catch (err) {
      error.value = err.message
      childLogger.logError(err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Reset store
   */
  function reset() {
    projects.value = []
    currentProjectId.value = null
    error.value = null
  }

  return {
    // State
    projects,
    currentProjectId,
    isLoading,
    error,

    // Computed
    currentProject,
    projectList,

    // Actions
    fetchProjects,
    selectProject,
    createProject,
    updateProject,
    deleteProject,
    reset
  }
})
