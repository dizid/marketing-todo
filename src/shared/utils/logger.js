/**
 * Centralized logging utility for consistent logging across the application.
 * Provides structured logging with levels, context, and formatting.
 * Can be extended to send logs to external services (Sentry, LogRocket, etc.)
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  SILENT: 4
}

const LOG_COLORS = {
  DEBUG: '\x1b[36m', // cyan
  INFO: '\x1b[32m',  // green
  WARN: '\x1b[33m',  // yellow
  ERROR: '\x1b[31m', // red
  RESET: '\x1b[0m'
}

/**
 * Logger class with structured logging capabilities
 */
class Logger {
  constructor(options = {}) {
    this.context = options.context || 'App'
    this.level = options.level || (import.meta.env.DEV ? LOG_LEVELS.DEBUG : LOG_LEVELS.INFO)
    this.useColors = options.useColors !== false && typeof window === 'undefined'
    this.externalHandlers = options.externalHandlers || []
  }

  /**
   * Set logging level
   */
  setLevel(level) {
    this.level = typeof level === 'string' ? LOG_LEVELS[level] : level
  }

  /**
   * Add external log handler (e.g., Sentry)
   */
  addHandler(handler) {
    this.externalHandlers.push(handler)
  }

  /**
   * Format log entry
   */
  format(level, message, data = {}) {
    const timestamp = new Date().toISOString()
    return {
      timestamp,
      level,
      context: this.context,
      message,
      data,
      url: typeof window !== 'undefined' ? window.location.href : null,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null
    }
  }

  /**
   * Send to external handlers
   */
  notifyHandlers(entry) {
    this.externalHandlers.forEach(handler => {
      try {
        handler(entry)
      } catch (err) {
        console.error('[Logger] Handler failed:', err)
      }
    })
  }

  /**
   * Core log method
   */
  log(level, message, data = {}) {
    if (LOG_LEVELS[level] < this.level) {
      return
    }

    const entry = this.format(level, message, data)

    const logFn = {
      DEBUG: console.debug,
      INFO: console.info,
      WARN: console.warn,
      ERROR: console.error
    }[level] || console.log

    const prefix = this.useColors ? `${LOG_COLORS[level]}[${entry.context}]${LOG_COLORS.RESET}` : `[${entry.context}]`
    logFn(`${prefix} ${message}`, data)

    this.notifyHandlers(entry)
  }

  // Convenience methods
  debug(message, data) { this.log('DEBUG', message, data) }
  info(message, data) { this.log('INFO', message, data) }
  warn(message, data) { this.log('WARN', message, data) }
  error(message, data) { this.log('ERROR', message, data) }

  /**
   * Create child logger with inherited context
   */
  child(contextName) {
    const childContext = `${this.context}/${contextName}`
    const child = new Logger({
      context: childContext,
      level: this.level,
      useColors: this.useColors,
      externalHandlers: this.externalHandlers
    })
    return child
  }

  /**
   * Log performance timing
   */
  time(label) {
    const start = performance.now()
    return {
      end: () => {
        const duration = performance.now() - start
        this.debug(`${label} completed`, { duration: `${duration.toFixed(2)}ms` })
        return duration
      }
    }
  }

  /**
   * Safe error logging with context
   */
  logError(error, context = {}) {
    const errorData = {
      name: error.name,
      message: error.message,
      code: error.code,
      ...context
    }

    if (error.originalError) {
      errorData.originalError = error.originalError.message
    }

    this.error(error.message, errorData)
  }
}

// Create singleton instance
const logger = new Logger({
  context: 'App',
  level: import.meta.env.DEV ? LOG_LEVELS.DEBUG : LOG_LEVELS.INFO
})

export default logger
export { LOG_LEVELS, Logger }
