/**
 * Polling Control Composable
 *
 * Coordinates polling operations with form saves to prevent data race conditions.
 *
 * Problem Solved:
 * - A/B test polling (5s) + form save (debounced 500ms) can occur simultaneously
 * - Concurrent read/write causes data corruption
 *
 * Solution:
 * - Pause polling before save
 * - Resume polling after save completes
 * - Polling checks pause status and skips cycles if paused
 *
 * Usage:
 * ```javascript
 * import { usePollingControl } from '@/composables/usePollingControl'
 *
 * const polling = usePollingControl()
 *
 * // In save handler:
 * polling.pausePolling('testId')
 * await saveData()
 * polling.resumePolling('testId')
 *
 * // In polling loop:
 * if (polling.isPollingPaused('testId')) {
 *   return // Skip this cycle
 * }
 * // Safe to poll
 * ```
 *
 * @file src/composables/usePollingControl.js
 * @since 2025-12-04 (Phase 3 Pre-Action 3)
 */

import { ref } from 'vue'

/**
 * Global polling state
 * Maps polling IDs (testId, userId, etc.) to pause status
 * @type {Set<string>}
 */
const pausedPollingIds = new Set()

/**
 * Polling control composable
 *
 * Provides methods to pause and resume polling operations
 * Prevents race conditions between polling and save operations
 */
export const usePollingControl = () => {
  /**
   * Pause polling for a specific resource
   * Used before starting a save operation
   *
   * @param {string} id - Polling ID (usually testId, userId, etc.)
   * @example pausePolling('test_123')
   */
  const pausePolling = (id) => {
    pausedPollingIds.add(id)
    console.log(`[Polling Control] ⏸️ Paused polling: ${id} (before save)`)
  }

  /**
   * Resume polling for a specific resource
   * Used after save operation completes (successfully or with error)
   * Always use in finally block to ensure resume even on error
   *
   * @param {string} id - Polling ID (must match pausePolling id)
   * @example resumePolling('test_123')
   */
  const resumePolling = (id) => {
    const wasRemoved = pausedPollingIds.delete(id)
    if (wasRemoved) {
      console.log(`[Polling Control] ▶️ Resumed polling: ${id} (after save)`)
    }
  }

  /**
   * Check if polling is paused for a resource
   * Called in polling loop before fetching data
   *
   * @param {string} id - Polling ID to check
   * @returns {boolean} true if polling is paused, false if active
   * @example
   * if (isPollingPaused('test_123')) {
   *   return // Skip this poll cycle
   * }
   */
  const isPollingPaused = (id) => {
    return pausedPollingIds.has(id)
  }

  /**
   * Get count of currently paused polling operations
   * Useful for debugging
   *
   * @returns {number} Number of paused polling operations
   */
  const getPausedCount = () => {
    return pausedPollingIds.size
  }

  /**
   * Clear all paused polling (emergency reset)
   * ONLY use if polling is stuck in paused state
   * Better to fix the save handler to always resume
   */
  const clearAllPaused = () => {
    const count = pausedPollingIds.size
    pausedPollingIds.clear()
    console.warn(`[Polling Control] ⚠️ Cleared ${count} paused polling operations`)
  }

  /**
   * Get all paused IDs (debugging)
   * @returns {string[]} List of paused polling IDs
   */
  const getPausedIds = () => {
    return Array.from(pausedPollingIds)
  }

  return {
    pausePolling,
    resumePolling,
    isPollingPaused,
    getPausedCount,
    clearAllPaused,
    getPausedIds
  }
}

/**
 * Global singleton instance for polling control
 * Use this in services that need global access
 *
 * @type {ReturnType<usePollingControl>}
 */
export const globalPollingControl = usePollingControl()

/**
 * Integration Points:
 *
 * 1. realTimeUpdatesService.js
 *    - Import globalPollingControl
 *    - In poll loop: if (globalPollingControl.isPollingPaused(key)) return
 *
 * 2. ABTestResultsDashboard.vue
 *    - Import globalPollingControl
 *    - In refreshInterval: check isPollingPaused before loadTest()
 *
 * 3. UnifiedTaskComponent.vue or parent
 *    - Import globalPollingControl
 *    - In debouncedSave:
 *      pausePolling(taskId)
 *      try { await save() }
 *      finally { resumePolling(taskId) }
 *
 * Timeline:
 * - Phase 3 Pre-Action 3: Created this composable (Dec 4, 2025)
 * - Phase 3 Task 3.1: Integrate with debouncing
 * - Phase 3 Task 3.2: Add save state tracking
 */
