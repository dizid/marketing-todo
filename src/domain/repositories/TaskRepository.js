/**
 * TaskRepository
 *
 * Abstract data access layer for Task entities.
 * Handles all Supabase operations for tasks.
 */

import { DatabaseError, wrapError, logger as defaultLogger } from '@/shared/utils'
import { SUPABASE_CONFIG } from '@/shared/config'

export class TaskRepository {
  constructor(supabaseClient, logger = defaultLogger) {
    this.supabase = supabaseClient
    this.logger = logger.child('TaskRepository')
  }

  /**
   * Get all tasks for a project
   */
  async getByProjectId(projectId) {
    try {
      this.logger.debug('Fetching tasks for project', { projectId })

      const { data, error } = await this.supabase
        .from(SUPABASE_CONFIG.TABLES.PROJECT_DATA)
        .select('value')
        .eq('project_id', projectId)
        .eq('key', SUPABASE_CONFIG.PROJECT_DATA_KEYS.TASKS)
        .single()

      if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows

      const tasks = data?.value || {}
      this.logger.debug('Tasks fetched', { projectId, count: Object.keys(tasks).length })
      return tasks
    } catch (error) {
      const wrappedError = wrapError(error, DatabaseError, { projectId })
      this.logger.logError(wrappedError)
      throw wrappedError
    }
  }

  /**
   * Update task status (checked/removed)
   */
  async updateStatus(projectId, userId, taskId, status) {
    try {
      this.logger.debug('Updating task status', { projectId, taskId, status })

      // Get current tasks
      const currentTasks = await this.getByProjectId(projectId)

      // Update the specific task
      if (currentTasks[taskId]) {
        currentTasks[taskId] = {
          ...currentTasks[taskId],
          ...status
        }
      } else {
        currentTasks[taskId] = {
          checked: status.checked ?? false,
          removed: status.removed ?? false
        }
      }

      // Save back
      await this._saveTasks(projectId, userId, currentTasks)

      this.logger.info('Task status updated', { projectId, taskId })
      return currentTasks[taskId]
    } catch (error) {
      const wrappedError = wrapError(error, DatabaseError, { projectId, taskId })
      this.logger.logError(wrappedError)
      throw wrappedError
    }
  }

  /**
   * Update task completion
   */
  async markComplete(projectId, userId, taskId) {
    return this.updateStatus(projectId, userId, taskId, { checked: true })
  }

  /**
   * Update task incomplete
   */
  async markIncomplete(projectId, userId, taskId) {
    return this.updateStatus(projectId, userId, taskId, { checked: false })
  }

  /**
   * Remove task (hide from main view)
   */
  async remove(projectId, userId, taskId) {
    return this.updateStatus(projectId, userId, taskId, { removed: true })
  }

  /**
   * Restore task
   */
  async restore(projectId, userId, taskId) {
    return this.updateStatus(projectId, userId, taskId, { removed: false })
  }

  /**
   * Save task form data
   */
  async saveFormData(projectId, userId, taskId, formData) {
    try {
      this.logger.debug('Saving task form data', { projectId, taskId })

      // Get current taskData
      const { data, error: fetchError } = await this.supabase
        .from(SUPABASE_CONFIG.TABLES.PROJECT_DATA)
        .select('value')
        .eq('project_id', projectId)
        .eq('key', SUPABASE_CONFIG.PROJECT_DATA_KEYS.TASK_DATA)
        .single()

      const currentTaskData = fetchError ? {} : (data?.value || {})

      // Update specific task data
      currentTaskData[taskId] = {
        ...currentTaskData[taskId],
        formData
      }

      // Save back
      const { error: saveError } = await this.supabase
        .from(SUPABASE_CONFIG.TABLES.PROJECT_DATA)
        .upsert(
          {
            project_id: projectId,
            user_id: userId,
            key: SUPABASE_CONFIG.PROJECT_DATA_KEYS.TASK_DATA,
            value: currentTaskData,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'project_id,key' }
        )

      if (saveError) throw saveError

      this.logger.info('Task form data saved', { projectId, taskId })
      return currentTaskData[taskId]
    } catch (error) {
      const wrappedError = wrapError(error, DatabaseError, { projectId, taskId })
      this.logger.logError(wrappedError)
      throw wrappedError
    }
  }

  /**
   * Add AI output for task
   */
  async addAIOutput(projectId, userId, taskId, output) {
    try {
      this.logger.debug('Adding AI output', { projectId, taskId })

      // Get current taskData
      const { data, error: fetchError } = await this.supabase
        .from(SUPABASE_CONFIG.TABLES.PROJECT_DATA)
        .select('value')
        .eq('project_id', projectId)
        .eq('key', SUPABASE_CONFIG.PROJECT_DATA_KEYS.TASK_DATA)
        .single()

      const currentTaskData = fetchError ? {} : (data?.value || {})

      if (!currentTaskData[taskId]) {
        currentTaskData[taskId] = {}
      }

      if (!currentTaskData[taskId].aiOutputs) {
        currentTaskData[taskId].aiOutputs = []
      }

      currentTaskData[taskId].aiOutputs.push({
        text: output,
        createdAt: new Date().toISOString()
      })

      // Save back
      const { error: saveError } = await this.supabase
        .from(SUPABASE_CONFIG.TABLES.PROJECT_DATA)
        .upsert(
          {
            project_id: projectId,
            user_id: userId,
            key: SUPABASE_CONFIG.PROJECT_DATA_KEYS.TASK_DATA,
            value: currentTaskData,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'project_id,key' }
        )

      if (saveError) throw saveError

      this.logger.info('AI output saved', { projectId, taskId })
      return currentTaskData[taskId]
    } catch (error) {
      const wrappedError = wrapError(error, DatabaseError, { projectId, taskId })
      this.logger.logError(wrappedError)
      throw wrappedError
    }
  }

  /**
   * Save task data (internal helper)
   */
  async _saveTasks(projectId, userId, tasks) {
    try {
      const { error } = await this.supabase
        .from(SUPABASE_CONFIG.TABLES.PROJECT_DATA)
        .upsert(
          {
            project_id: projectId,
            user_id: userId,
            key: SUPABASE_CONFIG.PROJECT_DATA_KEYS.TASKS,
            value: tasks,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'project_id,key' }
        )

      if (error) throw error
      return true
    } catch (error) {
      const wrappedError = wrapError(error, DatabaseError, { projectId })
      this.logger.logError(wrappedError)
      throw wrappedError
    }
  }
}
