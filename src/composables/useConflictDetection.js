/**
 * useConflictDetection - Handles concurrent edit conflict detection
 * Phase 3 Task 3.4: Detects when another user/session edits the same data
 *
 * Features:
 * - Tracks version of current task data
 * - Detects 409 Conflict responses from server
 * - Shows conflict resolution UI
 * - Allows reload with data merge or discard changes
 */

import { ref, reactive } from 'vue'

export const useConflictDetection = () => {
  // Conflict state
  const hasConflict = ref(false)
  const conflictInfo = reactive({
    taskId: null,
    localVersion: null,
    serverVersion: null,
    lastModifiedBy: null,
    lastModifiedAt: null,
    conflictMessage: null
  })

  /**
   * Detect conflict from HTTP 409 response
   */
  const detectConflict = (error, taskId, localVersion) => {
    if (error?.status === 409 || error?.response?.status === 409) {
      const errorData = error?.data || error?.response?.data || {}

      hasConflict.value = true
      conflictInfo.taskId = taskId
      conflictInfo.localVersion = localVersion
      conflictInfo.serverVersion = errorData.serverVersion
      conflictInfo.lastModifiedBy = errorData.lastModifiedBy
      conflictInfo.lastModifiedAt = errorData.lastModifiedAt
      conflictInfo.conflictMessage = errorData.message || 'This task was edited by another user or in another window'

      return true
    }
    return false
  }

  /**
   * Clear conflict state
   */
  const clearConflict = () => {
    hasConflict.value = false
    conflictInfo.taskId = null
    conflictInfo.localVersion = null
    conflictInfo.serverVersion = null
    conflictInfo.lastModifiedBy = null
    conflictInfo.lastModifiedAt = null
    conflictInfo.conflictMessage = null
  }

  /**
   * Get formatted conflict message
   */
  const getConflictMessage = () => {
    if (!hasConflict.value) return null

    let message = conflictInfo.conflictMessage || 'Task was edited by another user'

    if (conflictInfo.lastModifiedAt) {
      try {
        const date = new Date(conflictInfo.lastModifiedAt)
        const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        message += ` at ${time}`
      } catch (e) {
        // Silently fail if date parsing fails
      }
    }

    return message
  }

  /**
   * Check if versions match (for optimistic locking)
   */
  const isVersionMatch = (localVersion, serverVersion) => {
    return localVersion === serverVersion
  }

  return {
    // State
    hasConflict,
    conflictInfo,

    // Methods
    detectConflict,
    clearConflict,
    getConflictMessage,
    isVersionMatch
  }
}

/**
 * Global conflict detection instance
 * Shared across application for coordinated conflict handling
 */
export const globalConflictDetection = useConflictDetection()
