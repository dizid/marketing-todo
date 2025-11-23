/**
 * Task Domain Model
 *
 * Represents a task in the application with its state and behavior.
 * Encapsulates task-specific business logic (completion, removal, status).
 * This is a pure domain entity without dependencies on frameworks or external services.
 */

import { validateTaskId } from '@/shared/utils'

export class Task {
  /**
   * Create a new Task instance
   *
   * @param {string} id - Unique task identifier (e.g., 'sales-1', 'social-2')
   * @param {string} name - Display name
   * @param {Object} config - Task configuration object
   * @param {Object} status - Task status { checked: boolean, removed: boolean }
   * @param {Object} data - Task-specific data (form inputs, AI outputs)
   */
  constructor(id, name, config, status = {}, data = {}) {
    validateTaskId(id)

    this.id = id
    this.name = name
    this.config = config
    this.status = {
      checked: status.checked ?? false,
      removed: status.removed ?? false
    }
    this.data = data
    this.createdAt = new Date().toISOString()
  }

  /**
   * Mark task as completed
   */
  complete() {
    this.status.checked = true
    return this
  }

  /**
   * Mark task as incomplete
   */
  incomplete() {
    this.status.checked = false
    return this
  }

  /**
   * Toggle completion status
   */
  toggleCompletion() {
    this.status.checked = !this.status.checked
    return this
  }

  /**
   * Move task to removed section (hidden from main dashboard)
   */
  remove() {
    this.status.removed = true
    return this
  }

  /**
   * Restore task from removed section
   */
  restore() {
    this.status.removed = false
    return this
  }

  /**
   * Check if task is hidden
   */
  isRemoved() {
    return this.status.removed === true
  }

  /**
   * Check if task is completed
   */
  isCompleted() {
    return this.status.checked === true
  }

  /**
   * Check if task is visible (not removed)
   */
  isVisible() {
    return !this.isRemoved()
  }

  /**
   * Check if task has AI generation capability
   */
  hasAI() {
    return this.config?.aiConfig !== undefined
  }

  /**
   * Get task form configuration
   */
  getFormConfig() {
    return this.config?.form || []
  }

  /**
   * Get task AI configuration
   */
  getAIConfig() {
    return this.config?.aiConfig || null
  }

  /**
   * Update task form data
   */
  setFormData(formData) {
    this.data.formData = formData
    return this
  }

  /**
   * Get task form data
   */
  getFormData() {
    return this.data?.formData || {}
  }

  /**
   * Save AI output
   */
  addAIOutput(output) {
    if (!this.data.aiOutputs) {
      this.data.aiOutputs = []
    }
    this.data.aiOutputs.push({
      text: output,
      createdAt: new Date().toISOString()
    })
    return this
  }

  /**
   * Get AI outputs
   */
  getAIOutputs() {
    return this.data?.aiOutputs || []
  }

  /**
   * Save completed item (when user accepts AI output and saves it)
   */
  addSavedItem(item) {
    if (!this.data.savedItems) {
      this.data.savedItems = []
    }
    this.data.savedItems.push({
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    })
    return this
  }

  /**
   * Get saved items
   */
  getSavedItems() {
    return this.data?.savedItems || []
  }

  /**
   * Delete saved item
   */
  deleteSavedItem(itemId) {
    if (this.data.savedItems) {
      this.data.savedItems = this.data.savedItems.filter(item => item.id !== itemId)
    }
    return this
  }

  /**
   * Clear all task data
   */
  clearData() {
    this.data = {}
    return this
  }

  /**
   * Get task status display (for UI)
   */
  getStatusLabel() {
    if (this.isRemoved()) return 'Hidden'
    if (this.isCompleted()) return 'Done'
    return 'To-do'
  }

  /**
   * Get task progress (percentage of steps completed)
   */
  getProgress() {
    const steps = this.getFormConfig().length + (this.hasAI() ? 1 : 0) + 1 // form + AI + save
    const completed = (this.getFormData() && Object.keys(this.getFormData()).length > 0 ? 1 : 0) +
                      (this.getAIOutputs().length > 0 ? 1 : 0) +
                      (this.getSavedItems().length > 0 ? 1 : 0)
    return Math.round((completed / steps) * 100)
  }

  /**
   * Serialize task to plain object (for storage/API)
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      status: this.status,
      data: this.data,
      createdAt: this.createdAt
    }
  }

  /**
   * Create Task from plain object (hydrate from storage/API)
   */
  static fromJSON(json, config) {
    return new Task(
      json.id,
      json.name,
      config,
      json.status,
      json.data
    )
  }
}
