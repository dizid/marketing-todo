/**
 * Logger Utility - Environment-aware logging with security
 * Prevents logging of sensitive data in production
 * Integrates with Sentry for error tracking
 */

import * as Sentry from '@sentry/vue'

/**
 * Production error tracking via Sentry
 * @param {string} message - Error message
 * @param {Error} err - Error object
 * @param {object} context - Additional context (safe data only)
 */
function trackErrorInService(message, err, context = {}) {
  if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.captureException(err || new Error(message), {
      extra: {
        message,
        ...context
      }
    })
  }
}

export const logger = {
  /**
   * Log info messages (dev only)
   * @param {string} message - Message to log
   * @param {*} data - Optional data to log
   */
  info: (message, data = null) => {
    if (import.meta.env.DEV) {
      const timestamp = new Date().toISOString().split('T')[1]
      console.log(`[${timestamp}] [INFO] ${message}`, data || '')
    }
  },

  /**
   * Log error messages (dev: console, prod: error tracking service)
   * @param {string} message - Error message
   * @param {Error} err - Error object
   * @param {object} context - Additional context (safe data only)
   */
  error: (message, err = null, context = {}) => {
    if (import.meta.env.DEV) {
      const timestamp = new Date().toISOString().split('T')[1]
      console.error(`[${timestamp}] [ERROR] ${message}`, err, context)
    }

    // In production, send to error tracking service (safe context only)
    if (import.meta.env.PROD) {
      const safeContext = {
        ...context,
        // Never include sensitive data like passwords, tokens, payment info
      }
      trackErrorInService(message, err, safeContext)
    }
  },

  /**
   * Log warning messages (dev only)
   * @param {string} message - Warning message
   */
  warn: (message) => {
    if (import.meta.env.DEV) {
      const timestamp = new Date().toISOString().split('T')[1]
      console.warn(`[${timestamp}] [WARN] ${message}`)
    }
  },

  /**
   * Log debug messages (dev + debug mode only)
   * Enable with: VITE_DEBUG=true
   * @param {string} message - Debug message
   * @param {*} data - Optional data to log
   */
  debug: (message, data = null) => {
    if (import.meta.env.DEV && import.meta.env.VITE_DEBUG === 'true') {
      const timestamp = new Date().toISOString().split('T')[1]
      console.log(`[${timestamp}] [DEBUG] ${message}`, data || '')
    }
  },

  /**
   * Measure and log performance timing
   * @param {string} label - Performance label
   * @param {function} fn - Function to measure
   * @returns {*} Result of function
   */
  perf: (label, fn) => {
    const start = performance.now()
    const result = fn()
    const duration = performance.now() - start

    if (import.meta.env.DEV) {
      const timestamp = new Date().toISOString().split('T')[1]
      console.log(`[${timestamp}] [PERF] ${label}: ${duration.toFixed(2)}ms`)
    }

    return result
  },

  /**
   * Async version of performance measurement
   * @param {string} label - Performance label
   * @param {function} fn - Async function to measure
   * @returns {Promise<*>} Promise of function result
   */
  perfAsync: async (label, fn) => {
    const start = performance.now()
    const result = await fn()
    const duration = performance.now() - start

    if (import.meta.env.DEV) {
      const timestamp = new Date().toISOString().split('T')[1]
      console.log(`[${timestamp}] [PERF] ${label}: ${duration.toFixed(2)}ms`)
    }

    return result
  },

  /**
   * Create a child logger with a namespace prefix
   * @param {string} namespace - The namespace for the child logger
   * @returns {object} A new logger with prefixed messages
   */
  child: (namespace) => {
    const createChildLogger = (ns) => ({
      info: (message, data = null) => {
        if (import.meta.env.DEV) {
          const timestamp = new Date().toISOString().split('T')[1]
          console.log(`[${timestamp}] [${ns}] [INFO] ${message}`, data || '')
        }
      },
      error: (message, err = null, context = {}) => {
        if (import.meta.env.DEV) {
          const timestamp = new Date().toISOString().split('T')[1]
          console.error(`[${timestamp}] [${ns}] [ERROR] ${message}`, err, context)
        }
        if (import.meta.env.PROD) {
          trackErrorInService(`[${ns}] ${message}`, err, context)
        }
      },
      warn: (message) => {
        if (import.meta.env.DEV) {
          const timestamp = new Date().toISOString().split('T')[1]
          console.warn(`[${timestamp}] [${ns}] [WARN] ${message}`)
        }
      },
      debug: (message, data = null) => {
        if (import.meta.env.DEV && import.meta.env.VITE_DEBUG === 'true') {
          const timestamp = new Date().toISOString().split('T')[1]
          console.log(`[${timestamp}] [${ns}] [DEBUG] ${message}`, data || '')
        }
      },
      // Allow nested child loggers
      child: (childNamespace) => createChildLogger(`${ns}:${childNamespace}`)
    })
    return createChildLogger(namespace)
  }
}
