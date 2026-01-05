/**
 * Save State Composable
 *
 * Tracks the state of save operations and provides methods to update save status.
 * Used to display user feedback during saves ("Saving...", error messages, success).
 *
 * State Tracked:
 * - isSaving: boolean, true while save is in progress
 * - saveError: string, error message if save failed (null if no error)
 * - lastSaveTime: Date, when the last successful save completed
 *
 * Usage Example:
 * ```javascript
 * import { useSaveState } from '@/composables/useSaveState'
 *
 * export default {
 *   setup() {
 *     const { isSaving, saveError, lastSaveTime, setSaving, setSaveError, clearError } = useSaveState()
 *
 *     const handleSave = async (data) => {
 *       setSaving(true)
 *       try {
 *         await projectStore.updateTaskData(taskId, data)
 *         lastSaveTime.value = new Date()
 *         clearError()
 *       } catch (error) {
 *         setSaveError(error.message)
 *       } finally {
 *         setSaving(false)
 *       }
 *     }
 *
 *     return {
 *       isSaving,
 *       saveError,
 *       lastSaveTime,
 *       handleSave
 *     }
 *   }
 * }
 * ```
 *
 * @file src/composables/useSaveState.js
 * @since 2025-12-04 (Phase 3 Task 3.2)
 */

import { ref } from 'vue'

/**
 * Save state composable
 *
 * Provides reactive references and methods to track save operation state
 * Enables UI components to show "Saving...", error messages, and success feedback
 *
 * @returns {Object} Save state object with reactive refs and methods
 */
export const useSaveState = () => {
  /**
   * Tracks whether a save operation is currently in progress
   * @type {import('vue').Ref<boolean>}
   */
  const isSaving = ref(false)

  /**
   * Stores error message from failed save operation
   * Null when no error (either no save attempted or last save successful)
   * @type {import('vue').Ref<string|null>}
   */
  const saveError = ref(null)

  /**
   * Timestamp of when the last successful save completed
   * Null if no saves have completed yet
   * @type {import('vue').Ref<Date|null>}
   */
  const lastSaveTime = ref(null)

  /**
   * Set saving state
   * Called at the start of save operation (true) and when complete (false)
   *
   * @param {boolean} value - true when save starts, false when save completes
   * @example
   * setSaving(true)
   * await saveData()
   * setSaving(false)
   */
  const setSaving = (value) => {
    isSaving.value = value
  }

  /**
   * Set save error message
   * Also automatically clears isSaving flag when error occurs
   *
   * @param {string|null} error - Error message string, or null to clear
   * @example setSaveError('Network timeout - please retry')
   * @example setSaveError(null) // Clear error
   */
  const setSaveError = (error) => {
    saveError.value = error
    // Auto-clear saving flag if error occurs
    if (error) {
      isSaving.value = false
    }
  }

  /**
   * Clear any existing error message
   * Called after successful save or when user dismisses error
   *
   * @example clearError()
   */
  const clearError = () => {
    saveError.value = null
  }

  /**
   * Clear all save state (used on component unmount or reset)
   * @example clearAll()
   */
  const clearAll = () => {
    isSaving.value = false
    saveError.value = null
    lastSaveTime.value = null
  }

  /**
   * Update last save time to current time
   * Called after successful save
   * @example recordSaveSuccess()
   */
  const recordSaveSuccess = () => {
    lastSaveTime.value = new Date()
    saveError.value = null
  }

  /**
   * Format last save time for display
   * Returns relative time like "just now", "2 minutes ago", etc.
   *
   * @returns {string} Formatted relative time
   * @example
   * "just now" // 0-30 seconds ago
   * "1 minute ago" // ~60 seconds ago
   * "2 minutes ago" // ~120 seconds ago
   * "5 minutes ago" // >300 seconds ago
   */
  const formatLastSaveTime = () => {
    if (!lastSaveTime.value) return null

    const now = new Date()
    const diff = Math.floor((now - lastSaveTime.value) / 1000) // Difference in seconds

    if (diff < 30) {
      return 'just now'
    } else if (diff < 60) {
      return '1 minute ago'
    } else if (diff < 300) {
      const minutes = Math.floor(diff / 60)
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    } else {
      // For times older than 5 minutes, show absolute time
      return lastSaveTime.value.toLocaleTimeString()
    }
  }

  return {
    // Reactive state
    isSaving,
    saveError,
    lastSaveTime,

    // Methods to update state
    setSaving,
    setSaveError,
    clearError,
    clearAll,
    recordSaveSuccess,

    // Utility methods
    formatLastSaveTime
  }
}

/**
 * Integration Pattern:
 *
 * 1. Parent Component (UnifiedTaskComponent or above)
 *    - Import useSaveState
 *    - Initialize in setup()
 *    - Call setSaving/setSaveError from save handler
 *
 * 2. MiniAppShell
 *    - Emits 'save' event with data
 *    - Parent handles the actual save + state tracking
 *
 * 3. Child Components (UI feedback)
 *    - Receive isSaving, saveError, lastSaveTime as props
 *    - Show "Saving..." spinner when isSaving is true
 *    - Show error toast when saveError has value
 *    - Show "Saved at X time" when lastSaveTime exists
 *
 * Example Flow:
 *   T+0ms   MiniAppShell emits save event → Parent receives
 *   T+0ms   Parent: setSaving(true) → UI shows "Saving..."
 *   T+0ms   Parent: pausePolling() → Prevent data race
 *   T+1000ms API response → recordSaveSuccess() or setSaveError()
 *   T+1000ms Parent: setSaving(false) → Hide spinner
 *   T+1000ms Parent: resumePolling() → Resume safe polling
 *
 * Related Composables:
 *   - useFormFieldInheritance: Field value management
 *   - usePollingControl: Pause polling during saves
 */
