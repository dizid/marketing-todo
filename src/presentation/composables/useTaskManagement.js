/**
 * useTaskManagement Composable
 *
 * Provides high-level task management interface for components.
 * Wraps taskStore with business logic.
 */

import { computed } from 'vue'
import { useTaskStore } from '@/application/stores'
import { logger } from '@/shared/utils'

const childLogger = logger.child('useTaskManagement')

export function useTaskManagement() {
  const taskStore = useTaskStore()

  /**
   * Get tasks for specific project
   */
  function getTasks(projectId) {
    return computed(() => taskStore.tasksByProject[projectId] || {})
  }

  /**
   * Get visible tasks for project
   */
  function getVisibleTasks(projectId) {
    return computed(() => {
      const tasks = taskStore.tasksByProject[projectId] || {}
      return Object.entries(tasks)
        .filter(([, task]) => !task.removed)
        .reduce((acc, [id, task]) => {
          acc[id] = task
          return acc
        }, {})
    })
  }

  /**
   * Get removed tasks for project
   */
  function getRemovedTasks(projectId) {
    return computed(() => {
      const tasks = taskStore.tasksByProject[projectId] || {}
      return Object.entries(tasks)
        .filter(([, task]) => task.removed)
        .reduce((acc, [id, task]) => {
          acc[id] = task
          return acc
        }, {})
    })
  }

  /**
   * Get progress percentage
   */
  function getProgress(projectId) {
    return computed(() => {
      const tasks = taskStore.tasksByProject[projectId] || {}
      const visible = Object.values(tasks).filter(t => !t.removed)
      if (visible.length === 0) return 0
      const completed = visible.filter(t => t.checked).length
      return Math.round((completed / visible.length) * 100)
    })
  }

  /**
   * Load tasks for project
   */
  async function loadTasks(projectId) {
    try {
      await taskStore.loadTasks(projectId)
      return true
    } catch (err) {
      childLogger.logError(err)
      throw err
    }
  }

  /**
   * Complete task
   */
  async function completeTask(projectId, userId, taskId) {
    try {
      await taskStore.markTaskComplete(projectId, userId, taskId)
      return true
    } catch (err) {
      childLogger.logError(err)
      throw err
    }
  }

  /**
   * Mark task incomplete
   */
  async function uncompleteTask(projectId, userId, taskId) {
    try {
      await taskStore.markTaskIncomplete(projectId, userId, taskId)
      return true
    } catch (err) {
      childLogger.logError(err)
      throw err
    }
  }

  /**
   * Remove task (hide)
   */
  async function hideTask(projectId, userId, taskId) {
    try {
      await taskStore.removeTask(projectId, userId, taskId)
      return true
    } catch (err) {
      childLogger.logError(err)
      throw err
    }
  }

  /**
   * Restore task (show)
   */
  async function showTask(projectId, userId, taskId) {
    try {
      await taskStore.restoreTask(projectId, userId, taskId)
      return true
    } catch (err) {
      childLogger.logError(err)
      throw err
    }
  }

  /**
   * Save form data
   */
  async function saveFormData(projectId, userId, taskId, formData) {
    try {
      await taskStore.saveFormData(projectId, userId, taskId, formData)
      return true
    } catch (err) {
      childLogger.logError(err)
      throw err
    }
  }

  /**
   * Add AI output
   */
  async function addAIOutput(projectId, userId, taskId, output) {
    try {
      await taskStore.addAIOutput(projectId, userId, taskId, output)
      return true
    } catch (err) {
      childLogger.logError(err)
      throw err
    }
  }

  return {
    // Factories for computed properties
    getTasks,
    getVisibleTasks,
    getRemovedTasks,
    getProgress,

    // Actions
    loadTasks,
    completeTask,
    uncompleteTask,
    hideTask,
    showTask,
    saveFormData,
    addAIOutput
  }
}
