/**
 * Custom error classes for consistent error handling across the application.
 * Provides structured error information with context, type, and recovery suggestions.
 */

/**
 * Base application error class.
 * All custom errors should extend this class.
 */
export class AppError extends Error {
  constructor(message, options = {}) {
    super(message)
    this.name = this.constructor.name
    this.code = options.code || 'UNKNOWN_ERROR'
    this.context = options.context || {}
    this.timestamp = new Date().toISOString()

    // Preserve original error if wrapped
    this.originalError = options.originalError || null

    // Suggestion for user/developer
    this.suggestion = options.suggestion || null

    Error.captureStackTrace(this, this.constructor)
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      context: this.context,
      timestamp: this.timestamp,
      suggestion: this.suggestion
    }
  }

  isSilent() {
    // Some errors shouldn't be shown to user (logged only)
    return this.code?.startsWith('INTERNAL_')
  }
}

/**
 * Validation-related errors (form validation, schema validation, etc.)
 */
export class ValidationError extends AppError {
  constructor(message, options = {}) {
    super(message, {
      code: options.code || 'VALIDATION_ERROR',
      ...options
    })
  }
}

/**
 * Resource not found errors (project, task, file, etc.)
 */
export class NotFoundError extends AppError {
  constructor(resource, id, options = {}) {
    super(`${resource} not found: ${id}`, {
      code: options.code || 'NOT_FOUND',
      context: { resource, id, ...options.context },
      ...options
    })
  }
}

/**
 * Quota/limit exceeded errors (AI generation, storage, etc.)
 */
export class QuotaExceededError extends AppError {
  constructor(message, options = {}) {
    super(message, {
      code: options.code || 'QUOTA_EXCEEDED',
      ...options
    })
  }
}

/**
 * API/Network errors (HTTP, timeout, rate limit, etc.)
 */
export class APIError extends AppError {
  constructor(message, options = {}) {
    super(message, {
      code: options.code || 'API_ERROR',
      statusCode: options.statusCode || null,
      ...options
    })
  }
}

/**
 * Database/persistence errors (query, transaction, RLS, etc.)
 */
export class DatabaseError extends AppError {
  constructor(message, options = {}) {
    super(message, {
      code: options.code || 'DATABASE_ERROR',
      ...options
    })
  }
}

/**
 * Business logic errors (state violations, invalid operations, etc.)
 */
export class BusinessLogicError extends AppError {
  constructor(message, options = {}) {
    super(message, {
      code: options.code || 'BUSINESS_LOGIC_ERROR',
      ...options
    })
  }
}

/**
 * Helper to safely wrap external errors
 */
export function wrapError(error, ErrorClass = AppError, context = {}) {
  if (error instanceof AppError) {
    return error
  }

  return new ErrorClass(error.message || 'Unknown error', {
    originalError: error,
    context
  })
}

/**
 * Helper to parse and log errors consistently
 */
export function parseError(error) {
  if (error instanceof AppError) {
    return error.toJSON()
  }

  return {
    name: error.name || 'Error',
    message: error.message || 'Unknown error',
    code: 'UNKNOWN_ERROR',
    timestamp: new Date().toISOString()
  }
}
