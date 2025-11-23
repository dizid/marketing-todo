/**
 * useAsync Composable
 *
 * Generic async operation handler with loading, error, and data states.
 * Simplifies async/await patterns in components.
 */

import { ref, computed } from 'vue'
import { logger } from '@/shared/utils'

const childLogger = logger.child('useAsync')

export function useAsync(asyncFn, options = {}) {
  const {
    onSuccess = null,
    onError = null,
    immediate = false
  } = options

  // STATE
  const data = ref(null)
  const error = ref(null)
  const isLoading = ref(false)

  // COMPUTED
  const isSuccess = computed(() => data.value !== null && !error.value)
  const isFailed = computed(() => !!error.value)

  /**
   * Execute async function
   */
  async function execute(...args) {
    isLoading.value = true
    error.value = null
    data.value = null

    try {
      childLogger.debug('Executing async operation')
      const result = await asyncFn(...args)
      data.value = result

      if (onSuccess) {
        onSuccess(result)
      }

      childLogger.info('Async operation completed')
      return result
    } catch (err) {
      error.value = err
      childLogger.error('Async operation failed', { error: err.message })

      if (onError) {
        onError(err)
      }

      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Reset to initial state
   */
  function reset() {
    data.value = null
    error.value = null
    isLoading.value = false
  }

  /**
   * Initialize if immediate flag set
   */
  if (immediate && typeof asyncFn === 'function') {
    execute()
  }

  return {
    // State
    data,
    error,
    isLoading,

    // Computed
    isSuccess,
    isFailed,

    // Actions
    execute,
    reset
  }
}
