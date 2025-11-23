/**
 * Task Store (Refactored)
 *
 * Focused responsibility: Task state management
 * Data: Task statuses (checked, removed), form data per task
 * Does NOT: Project CRUD, content storage, quota (separate stores)
 *
 * Uses: TaskRepository for data access
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { TaskRepository } from '@/domain/repositories'
import { getSupabaseClient } from '@/utils/supabase'
import { logger } from '@/shared/utils'

const childLogger = logger.child('taskStore')

export const useTaskStore = defineStore('task', () => {
  const supabaseClient = getSupabaseClient()
  const taskRepository = new TaskRepository(supabaseClient, childLogger)

  // STATE
  const tasksByProject = ref({}) // projectId -> { taskId: { checked, removed, formData, aiOutputs, savedItems } }
  const isLoading = ref(false)
  const error = ref(null)

  // HELPERS
  function _ensureProjectData(projectId) {
    if (!tasksByProject.value[projectId]) {
      tasksByProject.value[projectId] = {}
    }
  }

  // COMPUTED
  const getTasksByProject = (projectId) => {
    return computed(() => {
      return tasksByProject.value[projectId] || {}
    })
  }

  const getVisibleTasks = (projectId) => {
    return computed(() => {
      const tasks = tasksByProject.value[projectId] || {}
      return Object.entries(tasks)
        .filter(([, task]) => !task.removed)
        .reduce((acc, [id, task]) => {
          acc[id] = task
          return acc
        }, {})
    })
  }

  const getRemovedTasks = (projectId) => {
    return computed(() => {
      const tasks = tasksByProject.value[projectId] || {}
      return Object.entries(tasks)
        .filter(([, task]) => task.removed)
        .reduce((acc, [id, task]) => {
          acc[id] = task
          return acc
        }, {})
    })
  }

  const getTaskProgress = (projectId) => {
    return computed(() => {
      const tasks = tasksByProject.value[projectId] || {}
      const completed = Object.values(tasks).filter(t => t.checked && !t.removed).length
      const visible = Object.values(tasks).filter(t => !t.removed).length
      return visible > 0 ? Math.round((completed / visible) * 100) : 0
    })
  }

  // ACTIONS

  /**
   * Load tasks for a project
   */
  async function loadTasks(projectId) {
    isLoading.value = true
    error.value = null

    try {
      childLogger.debug('Loading tasks', { projectId })
      const tasks = await taskRepository.getByProjectId(projectId)

      _ensureProjectData(projectId)
      tasksByProject.value[projectId] = tasks

      childLogger.info('Tasks loaded', { projectId, count: Object.keys(tasks).length })
    } catch (err) {
      error.value = err.message
      childLogger.logError(err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Mark task as complete
   */
  async function markTaskComplete(projectId, userId, taskId) {
    try {
      childLogger.debug('Marking complete', { projectId, taskId })
      _ensureProjectData(projectId)

      await taskRepository.markComplete(projectId, userId, taskId)

      if (tasksByProject.value[projectId][taskId]) {
        tasksByProject.value[projectId][taskId].checked = true
      }

      childLogger.info('Task marked complete', { projectId, taskId })
    } catch (err) {
      error.value = err.message
      childLogger.logError(err)
      throw err
    }
  }

  /**
   * Mark task as incomplete
   */
  async function markTaskIncomplete(projectId, userId, taskId) {
    try {
      childLogger.debug('Marking incomplete', { projectId, taskId })
      _ensureProjectData(projectId)

      await taskRepository.markIncomplete(projectId, userId, taskId)

      if (tasksByProject.value[projectId][taskId]) {
        tasksByProject.value[projectId][taskId].checked = false
      }

      childLogger.info('Task marked incomplete', { projectId, taskId })
    } catch (err) {
      error.value = err.message
      childLogger.logError(err)
      throw err
    }
  }

  /**
   * Remove task (hide from main view)
   */
  async function removeTask(projectId, userId, taskId) {
    try {
      childLogger.debug('Removing task', { projectId, taskId })
      _ensureProjectData(projectId)

      await taskRepository.remove(projectId, userId, taskId)

      if (tasksByProject.value[projectId][taskId]) {
        tasksByProject.value[projectId][taskId].removed = true
      }

      childLogger.info('Task removed', { projectId, taskId })
    } catch (err) {
      error.value = err.message
      childLogger.logError(err)
      throw err
    }
  }

  /**
   * Restore task (show in main view)
   */
  async function restoreTask(projectId, userId, taskId) {
    try {
      childLogger.debug('Restoring task', { projectId, taskId })
      _ensureProjectData(projectId)

      await taskRepository.restore(projectId, userId, taskId)

      if (tasksByProject.value[projectId][taskId]) {
        tasksByProject.value[projectId][taskId].removed = false
      }

      childLogger.info('Task restored', { projectId, taskId })
    } catch (err) {
      error.value = err.message
      childLogger.logError(err)
      throw err
    }
  }

  /**
   * Save form data for task
   */
  async function saveFormData(projectId, userId, taskId, formData) {
    try {
      childLogger.debug('Saving form data', { projectId, taskId })
      _ensureProjectData(projectId)

      await taskRepository.saveFormData(projectId, userId, taskId, formData)

      if (!tasksByProject.value[projectId][taskId]) {
        tasksByProject.value[projectId][taskId] = {}
      }

      tasksByProject.value[projectId][taskId].formData = formData

      childLogger.info('Form data saved', { projectId, taskId })
    } catch (err) {
      error.value = err.message
      childLogger.logError(err)
      throw err
    }
  }

  /**
   * Add AI output for task
   */
  async function addAIOutput(projectId, userId, taskId, output) {
    try {
      childLogger.debug('Adding AI output', { projectId, taskId })
      _ensureProjectData(projectId)

      await taskRepository.addAIOutput(projectId, userId, taskId, output)

      if (!tasksByProject.value[projectId][taskId]) {
        tasksByProject.value[projectId][taskId] = {}
      }

      if (!tasksByProject.value[projectId][taskId].aiOutputs) {
        tasksByProject.value[projectId][taskId].aiOutputs = []
      }

      tasksByProject.value[projectId][taskId].aiOutputs.push({
        text: output,
        createdAt: new Date().toISOString()
      })

      childLogger.info('AI output added', { projectId, taskId })
    } catch (err) {
      error.value = err.message
      childLogger.logError(err)
      throw err
    }
  }

  /**
   * Reset store
   */
  function reset() {
    tasksByProject.value = {}
    error.value = null
  }

  return {
    // State
    tasksByProject,
    isLoading,
    error,

    // Computed factories
    getTasksByProject,
    getVisibleTasks,
    getRemovedTasks,
    getTaskProgress,

    // Actions
    loadTasks,
    markTaskComplete,
    markTaskIncomplete,
    removeTask,
    restoreTask,
    saveFormData,
    addAIOutput,
    reset
  }
})
