/**
 * useProjectManagement Composable
 *
 * Provides high-level project management interface for components.
 * Wraps projectStore with business logic and error handling.
 * Simplifies component usage of store actions.
 */

import { computed } from 'vue'
import { useProjectStore } from '@/application/stores'
import { logger } from '@/shared/utils'

const childLogger = logger.child('useProjectManagement')

export function useProjectManagement() {
  const projectStore = useProjectStore()

  /**
   * Get current project with safe access
   */
  const currentProject = computed(() => projectStore.currentProject)

  /**
   * Get all projects
   */
  const projects = computed(() => projectStore.projects)

  /**
   * Check if loading
   */
  const isLoading = computed(() => projectStore.isLoading)

  /**
   * Get any errors
   */
  const error = computed(() => projectStore.error)

  /**
   * Load projects for user
   */
  async function loadProjects(userId) {
    try {
      await projectStore.fetchProjects(userId)
      return true
    } catch (err) {
      childLogger.logError(err)
      throw err
    }
  }

  /**
   * Create and select new project
   */
  async function createAndSelectProject(userId, name, description = '') {
    try {
      const project = await projectStore.createProject(userId, name, description)
      return project
    } catch (err) {
      childLogger.logError(err)
      throw err
    }
  }

  /**
   * Select project by ID
   */
  function selectProject(projectId) {
    const success = projectStore.selectProject(projectId)
    if (!success) {
      throw new Error(`Failed to select project: ${projectId}`)
    }
  }

  /**
   * Delete project
   */
  async function deleteCurrentProject() {
    if (!currentProject.value) {
      throw new Error('No project selected')
    }

    try {
      await projectStore.deleteProject(currentProject.value.id)
      return true
    } catch (err) {
      childLogger.logError(err)
      throw err
    }
  }

  return {
    currentProject,
    projects,
    isLoading,
    error,
    loadProjects,
    createAndSelectProject,
    selectProject,
    deleteCurrentProject
  }
}
