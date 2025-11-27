/**
 * useLoadingState Composable
 *
 * Manages loading states for multiple concurrent operations.
 * Useful for tracking multiple async operations simultaneously.
 */

import { ref, computed } from 'vue'

export function useLoadingState() {
  // STATE
  const loadingStates = ref({})

  // COMPUTED
  const isLoading = computed(() => {
    return Object.values(loadingStates.value).some(state => state === true)
  })

  const loadingCount = computed(() => {
    return Object.values(loadingStates.value).filter(state => state === true).length
  })

  /**
   * Start loading for operation
   */
  function startLoading(operationName) {
    loadingStates.value[operationName] = true
  }

  /**
   * Stop loading for operation
   */
  function stopLoading(operationName) {
    loadingStates.value[operationName] = false
  }

  /**
   * Toggle loading state
   */
  function toggleLoading(operationName) {
    loadingStates.value[operationName] = !loadingStates.value[operationName]
  }

  /**
   * Check if specific operation is loading
   */
  function isOperationLoading(operationName) {
    return loadingStates.value[operationName] === true
  }

  /**
   * Start multiple operations
   */
  function startMultiple(operationNames) {
    operationNames.forEach(name => {
      loadingStates.value[name] = true
    })
  }

  /**
   * Stop multiple operations
   */
  function stopMultiple(operationNames) {
    operationNames.forEach(name => {
      loadingStates.value[name] = false
    })
  }

  /**
   * Reset all loading states
   */
  function reset() {
    loadingStates.value = {}
  }

  return {
    // State
    loadingStates,

    // Computed
    isLoading,
    loadingCount,

    // Actions
    startLoading,
    stopLoading,
    toggleLoading,
    isOperationLoading,
    startMultiple,
    stopMultiple,
    reset
  }
}
