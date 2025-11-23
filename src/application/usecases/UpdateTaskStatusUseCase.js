/**
 * UpdateTaskStatusUseCase
 *
 * Handles task status updates (completion, removal).
 * Supports: mark complete, mark incomplete, remove, restore.
 */

import { validateTaskId, wrapError, logger as defaultLogger } from '@/shared/utils'
import { DatabaseError } from '@/shared/utils'

export class UpdateTaskStatusUseCase {
  /**
   * @param {TaskRepository} taskRepository - Task data access
   * @param {Logger} logger - Logging utility
   */
  constructor(taskRepository, logger = defaultLogger) {
    this.taskRepository = taskRepository
    this.logger = logger.child('UpdateTaskStatusUseCase')
  }

  /**
   * Mark task as complete
   */
  async markComplete(userId, projectId, taskId) {
    try {
      validateTaskId(taskId)
      this.logger.debug('Marking task complete', { projectId, taskId })

      await this.taskRepository.markComplete(projectId, userId, taskId)

      this.logger.info('Task marked complete', { projectId, taskId })
      return { taskId, checked: true }
    } catch (error) {
      this.logger.logError(error)
      throw error
    }
  }

  /**
   * Mark task as incomplete
   */
  async markIncomplete(userId, projectId, taskId) {
    try {
      validateTaskId(taskId)
      this.logger.debug('Marking task incomplete', { projectId, taskId })

      await this.taskRepository.markIncomplete(projectId, userId, taskId)

      this.logger.info('Task marked incomplete', { projectId, taskId })
      return { taskId, checked: false }
    } catch (error) {
      this.logger.logError(error)
      throw error
    }
  }

  /**
   * Remove task from main view (hide it)
   */
  async remove(userId, projectId, taskId) {
    try {
      validateTaskId(taskId)
      this.logger.debug('Removing task', { projectId, taskId })

      await this.taskRepository.remove(projectId, userId, taskId)

      this.logger.info('Task removed', { projectId, taskId })
      return { taskId, removed: true }
    } catch (error) {
      this.logger.logError(error)
      throw error
    }
  }

  /**
   * Restore task to main view
   */
  async restore(userId, projectId, taskId) {
    try {
      validateTaskId(taskId)
      this.logger.debug('Restoring task', { projectId, taskId })

      await this.taskRepository.restore(projectId, userId, taskId)

      this.logger.info('Task restored', { projectId, taskId })
      return { taskId, removed: false }
    } catch (error) {
      this.logger.logError(error)
      throw error
    }
  }
}
