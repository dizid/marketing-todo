/**
 * Project Domain Model
 *
 * Represents a user's marketing project with its tasks and settings.
 * Encapsulates project-specific business logic (task management, progress calculation).
 */

import { validateProjectName, validateUUID } from '@/shared/utils'
import { Task } from './Task.js'

export class Project {
  /**
   * Create a new Project instance
   *
   * @param {string} id - Unique project UUID
   * @param {string} userId - Owner user UUID
   * @param {string} name - Project name
   * @param {string} description - Project description
   * @param {Object} settings - Project settings (targetAudience, goals, timeline, etc.)
   * @param {Map<string, Task>} tasks - Map of task ID to Task instances
   */
  constructor(id, userId, name, description = '', settings = {}, tasks = new Map()) {
    validateUUID(id)
    validateUUID(userId)
    validateProjectName(name)

    this.id = id
    this.userId = userId
    this.name = name
    this.description = description
    this.settings = settings
    this.tasks = tasks // Map<taskId, Task>
    this.createdAt = new Date().toISOString()
    this.updatedAt = new Date().toISOString()
  }

  /**
   * Get all tasks
   */
  getTasks() {
    return Array.from(this.tasks.values())
  }

  /**
   * Get visible tasks (not removed)
   */
  getVisibleTasks() {
    return this.getTasks().filter(task => task.isVisible())
  }

  /**
   * Get removed tasks
   */
  getRemovedTasks() {
    return this.getTasks().filter(task => task.isRemoved())
  }

  /**
   * Get completed tasks
   */
  getCompletedTasks() {
    return this.getTasks().filter(task => task.isCompleted())
  }

  /**
   * Get tasks by category
   */
  getTasksByCategory(categoryName) {
    return this.getTasks().filter(task => task.config?.category === categoryName)
  }

  /**
   * Get visible tasks by category
   */
  getVisibleTasksByCategory(categoryName) {
    return this.getVisibleTasks().filter(task => task.config?.category === categoryName)
  }

  /**
   * Get task by ID
   */
  getTask(taskId) {
    return this.tasks.get(taskId) || null
  }

  /**
   * Add or update task
   */
  setTask(taskId, task) {
    if (!(task instanceof Task)) {
      throw new Error('Invalid task instance')
    }
    this.tasks.set(taskId, task)
    this.updatedAt = new Date().toISOString()
    return this
  }

  /**
   * Remove task
   */
  deleteTask(taskId) {
    this.tasks.delete(taskId)
    this.updatedAt = new Date().toISOString()
    return this
  }

  /**
   * Check if project has a specific task
   */
  hasTask(taskId) {
    return this.tasks.has(taskId)
  }

  /**
   * Update project metadata
   */
  updateMetadata(name, description) {
    if (name) validateProjectName(name)
    if (name) this.name = name
    if (description !== undefined) this.description = description
    this.updatedAt = new Date().toISOString()
    return this
  }

  /**
   * Update project settings
   */
  updateSettings(settings) {
    this.settings = { ...this.settings, ...settings }
    this.updatedAt = new Date().toISOString()
    return this
  }

  /**
   * Get project settings
   */
  getSettings() {
    return this.settings
  }

  /**
   * Calculate total tasks
   */
  getTaskCount() {
    return this.getTasks().length
  }

  /**
   * Calculate visible tasks count
   */
  getVisibleTaskCount() {
    return this.getVisibleTasks().length
  }

  /**
   * Calculate completed tasks count
   */
  getCompletedTaskCount() {
    return this.getCompletedTasks().length
  }

  /**
   * Calculate completion percentage
   */
  getCompletionPercentage() {
    const visibleTasks = this.getVisibleTasks()
    if (visibleTasks.length === 0) return 0
    const completed = visibleTasks.filter(task => task.isCompleted()).length
    return Math.round((completed / visibleTasks.length) * 100)
  }

  /**
   * Get tasks grouped by category and status
   */
  getTasksByStatusAndCategory() {
    const grouped = {}

    this.getTasks().forEach(task => {
      const category = task.config?.category || 'uncategorized'
      if (!grouped[category]) {
        grouped[category] = {
          visible: [],
          removed: [],
          completed: []
        }
      }

      if (task.isRemoved()) {
        grouped[category].removed.push(task)
      } else {
        grouped[category].visible.push(task)
        if (task.isCompleted()) {
          grouped[category].completed.push(task)
        }
      }
    })

    return grouped
  }

  /**
   * Check if project is empty
   */
  isEmpty() {
    return this.getTasks().length === 0
  }

  /**
   * Check if all visible tasks are completed
   */
  isComplete() {
    const visibleTasks = this.getVisibleTasks()
    if (visibleTasks.length === 0) return false
    return visibleTasks.every(task => task.isCompleted())
  }

  /**
   * Check if project has any progress
   */
  hasProgress() {
    return this.getCompletedTaskCount() > 0
  }

  /**
   * Get project summary (for display)
   */
  getSummary() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      totalTasks: this.getTaskCount(),
      visibleTasks: this.getVisibleTaskCount(),
      completedTasks: this.getCompletedTaskCount(),
      completionPercentage: this.getCompletionPercentage(),
      isComplete: this.isComplete(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }

  /**
   * Serialize project to plain object (for storage/API)
   */
  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
      description: this.description,
      settings: this.settings,
      tasks: Array.from(this.tasks.entries()).reduce((obj, [id, task]) => {
        obj[id] = task.toJSON()
        return obj
      }, {}),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }

  /**
   * Create Project from plain object (hydrate from storage/API)
   */
  static fromJSON(json, taskConfigs = {}) {
    const tasks = new Map()

    if (json.tasks) {
      Object.entries(json.tasks).forEach(([taskId, taskData]) => {
        const taskConfig = taskConfigs[taskId]
        const task = Task.fromJSON(taskData, taskConfig)
        tasks.set(taskId, task)
      })
    }

    return new Project(
      json.id,
      json.userId,
      json.name,
      json.description,
      json.settings,
      tasks
    )
  }
}
