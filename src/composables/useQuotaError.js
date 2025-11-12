/**
 * Quota Error Handling Composable
 * Provides utilities for detecting and handling quota exceeded errors
 */

import { ref } from 'vue'

/**
 * Composable for handling quota exceeded errors
 * @returns {Object} Error handler utilities
 */
export function useQuotaError() {
  // State
  const showQuotaExceededModal = ref(false)
  const lastError = ref(null)

  /**
   * Check if an error is a quota exhausted error
   * @param {Error} error - The error to check
   * @returns {boolean} True if quota exhausted
   */
  const isQuotaExceededError = (error) => {
    if (!error || !error.message) return false
    return error.message.includes('quota exceeded') || error.message.includes('Quota exceeded')
  }

  /**
   * Handle AI generation error with quota checking
   * @param {Error} error - The error that occurred
   * @returns {Object} Error info with type and should show quota modal
   */
  const handleGenerationError = (error) => {
    console.error('[useQuotaError] Generation error:', error)

    if (isQuotaExceededError(error)) {
      showQuotaExceededModal.value = true
      lastError.value = error
      return {
        type: 'quota_exceeded',
        showQuotaModal: true,
        message: error.message
      }
    }

    return {
      type: 'other_error',
      showQuotaModal: false,
      message: error.message || 'Failed to generate content. Please try again.'
    }
  }

  /**
   * Handle quota modal close
   */
  const closeQuotaModal = () => {
    showQuotaExceededModal.value = false
    lastError.value = null
  }

  /**
   * Handle upgrade button click from modal
   */
  const handleUpgradeFromModal = () => {
    // Emit custom event that parent can listen to
    closeQuotaModal()
    // Parent component will handle navigation to upgrade
  }

  return {
    showQuotaExceededModal,
    lastError,
    isQuotaExceededError,
    handleGenerationError,
    closeQuotaModal,
    handleUpgradeFromModal
  }
}
