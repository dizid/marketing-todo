/**
 * useUnsavedChanges - Tracks and manages unsaved form changes
 * Phase 3 Task 3.5: Provides dirty state tracking and warnings
 *
 * Features:
 * - Tracks if form has unsaved changes (isDirty)
 * - Provides methods to mark dirty/clean
 * - Persists unsaved state
 * - Shows warning before navigation
 * - Allows user to discard or keep changes
 */

import { ref, watch } from 'vue'

export const useUnsavedChanges = (initialData = null) => {
  // Dirty state tracking
  const isDirty = ref(false)
  const showUnsavedWarning = ref(false)
  const pendingNavigation = ref(null)

  // Store last saved state for comparison
  let lastSavedState = initialData ? JSON.stringify(initialData) : null

  /**
   * Mark form as modified (dirty)
   */
  const markDirty = () => {
    isDirty.value = true
  }

  /**
   * Mark form as clean (saved)
   */
  const markClean = () => {
    isDirty.value = false
  }

  /**
   * Check if data has actually changed from last save
   */
  const hasChanged = (currentData) => {
    const currentState = JSON.stringify(currentData)
    return currentState !== lastSavedState
  }

  /**
   * Update saved state (call after successful save)
   */
  const updateSavedState = (currentData) => {
    lastSavedState = JSON.stringify(currentData)
    markClean()
  }

  /**
   * Request navigation with unsaved changes check
   */
  const requestNavigation = (callback) => {
    if (isDirty.value) {
      showUnsavedWarning.value = true
      pendingNavigation.value = callback
      return false
    }
    callback()
    return true
  }

  /**
   * Confirm discard and navigate
   */
  const confirmDiscard = () => {
    showUnsavedWarning.value = false
    markClean()
    if (pendingNavigation.value) {
      pendingNavigation.value()
      pendingNavigation.value = null
    }
  }

  /**
   * Cancel navigation and keep editing
   */
  const cancelNavigation = () => {
    showUnsavedWarning.value = false
    pendingNavigation.value = null
  }

  /**
   * Get warning message
   */
  const getWarningMessage = () => {
    return 'You have unsaved changes. Are you sure you want to leave?'
  }

  return {
    // State
    isDirty,
    showUnsavedWarning,
    pendingNavigation,

    // Methods
    markDirty,
    markClean,
    hasChanged,
    updateSavedState,
    requestNavigation,
    confirmDiscard,
    cancelNavigation,
    getWarningMessage
  }
}
