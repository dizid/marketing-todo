/**
 * Retry Utility with Exponential Backoff
 *
 * Retries async operations on transient failures (5xx, network errors)
 * Does NOT retry on client errors (4xx), aborts, or quota exceeded
 */

/**
 * Retry wrapper with exponential backoff
 * Only retries on 5xx errors and network failures, not 4xx
 * @param {Function} fn - Async function to execute
 * @param {Object} options - Retry configuration
 * @param {number} options.maxRetries - Maximum number of retry attempts (default: 3)
 * @param {number} options.baseBackoff - Base backoff delay in ms (default: 1000)
 * @returns {Promise<*>} Result of successful function execution
 * @throws {Error} Last error if all retries exhausted
 */
export async function withRetry(fn, options = {}) {
  const { maxRetries = 3, baseBackoff = 1000 } = options
  let lastError

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      // Don't retry on client errors (4xx), abort errors, or quota exceeded
      if (error.name === 'AbortError') {
        throw error
      }

      const status = error.status || error.statusCode
      if (status && status >= 400 && status < 500) {
        throw error
      }

      // If this was the last attempt, throw the error
      if (attempt >= maxRetries) {
        throw error
      }

      // Calculate exponential backoff delay
      const delay = baseBackoff * Math.pow(2, attempt)

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError
}
