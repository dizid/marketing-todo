/**
 * Shared validation utilities for forms, data, and business rules.
 * Centralized validators to eliminate duplication across components and services.
 */

import { ValidationError } from './errors.js'

/**
 * Validate email address format
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format', {
      code: 'INVALID_EMAIL',
      context: { email }
    })
  }
  return true
}

/**
 * Validate password strength
 * Requirements: at least 8 characters, 1 uppercase, 1 lowercase, 1 number
 */
export function validatePassword(password) {
  if (!password || password.length < 8) {
    throw new ValidationError('Password must be at least 8 characters', {
      code: 'PASSWORD_TOO_SHORT',
      context: { length: password?.length }
    })
  }

  if (!/[A-Z]/.test(password)) {
    throw new ValidationError('Password must contain at least one uppercase letter', {
      code: 'PASSWORD_NO_UPPERCASE'
    })
  }

  if (!/[a-z]/.test(password)) {
    throw new ValidationError('Password must contain at least one lowercase letter', {
      code: 'PASSWORD_NO_LOWERCASE'
    })
  }

  if (!/[0-9]/.test(password)) {
    throw new ValidationError('Password must contain at least one number', {
      code: 'PASSWORD_NO_NUMBER'
    })
  }

  return true
}

/**
 * Validate project name (not empty, reasonable length)
 */
export function validateProjectName(name) {
  if (!name || !name.trim()) {
    throw new ValidationError('Project name is required', {
      code: 'PROJECT_NAME_REQUIRED'
    })
  }

  if (name.length > 100) {
    throw new ValidationError('Project name must be 100 characters or less', {
      code: 'PROJECT_NAME_TOO_LONG',
      context: { length: name.length }
    })
  }

  return true
}

/**
 * Validate form data against schema
 */
export function validateFormData(data, schema) {
  const errors = {}

  schema.forEach(field => {
    const value = data[field.id]

    // Check required fields
    if (field.required && (value === undefined || value === null || value === '')) {
      errors[field.id] = `${field.label} is required`
    }

    // Type-specific validation
    switch (field.type) {
      case 'email':
        if (value && !validateEmailFormat(value)) {
          errors[field.id] = 'Invalid email format'
        }
        break

      case 'number':
        if (value !== undefined && value !== null && value !== '') {
          if (isNaN(Number(value))) {
            errors[field.id] = `${field.label} must be a number`
          } else if (field.min !== undefined && Number(value) < field.min) {
            errors[field.id] = `${field.label} must be at least ${field.min}`
          } else if (field.max !== undefined && Number(value) > field.max) {
            errors[field.id] = `${field.label} must not exceed ${field.max}`
          }
        }
        break

      case 'url':
        if (value && !validateUrlFormat(value)) {
          errors[field.id] = 'Invalid URL format'
        }
        break
    }

    // Custom validator
    if (field.validator && value !== undefined && value !== null && value !== '') {
      try {
        field.validator(value)
      } catch (error) {
        errors[field.id] = error.message
      }
    }
  })

  if (Object.keys(errors).length > 0) {
    throw new ValidationError('Form validation failed', {
      code: 'FORM_VALIDATION_ERROR',
      context: { errors }
    })
  }

  return true
}

/**
 * Simple email format check (basic regex)
 */
export function validateEmailFormat(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Simple URL format check
 */
export function validateUrlFormat(url) {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validate UUID v4 format
 */
export function validateUUID(uuid) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

/**
 * Validate task ID format (e.g., 'sales-1', 'growth-5')
 */
export function validateTaskId(taskId) {
  if (!taskId || typeof taskId !== 'string') {
    throw new ValidationError('Invalid task ID format', {
      code: 'INVALID_TASK_ID',
      context: { taskId }
    })
  }

  // Basic format: [a-z]+-[0-9]+ or [a-z]+
  if (!/^[a-z]+([-_][a-z0-9]+)*$/.test(taskId)) {
    throw new ValidationError('Task ID must be lowercase with hyphens or underscores', {
      code: 'INVALID_TASK_ID_FORMAT',
      context: { taskId }
    })
  }

  return true
}

/**
 * Validate that a value is one of allowed options
 */
export function validateEnum(value, allowedValues) {
  if (!allowedValues.includes(value)) {
    throw new ValidationError(`Value must be one of: ${allowedValues.join(', ')}`, {
      code: 'INVALID_ENUM_VALUE',
      context: { value, allowedValues }
    })
  }
  return true
}

/**
 * Get validation error messages (safe for UI display)
 */
export function getValidationErrors(error) {
  if (error instanceof ValidationError && error.context.errors) {
    return error.context.errors
  }

  if (error instanceof ValidationError) {
    return { general: error.message }
  }

  return { general: 'An unexpected error occurred during validation' }
}

/**
 * Safely validate with fallback
 */
export function tryValidate(validatorFn, ...args) {
  try {
    return validatorFn(...args)
  } catch (error) {
    // Return false or error object instead of throwing
    return { valid: false, error }
  }
}

/**
 * Create a custom validator function
 */
export function createValidator(validateFn, errorMessage) {
  return (value) => {
    if (!validateFn(value)) {
      throw new ValidationError(errorMessage, {
        code: 'CUSTOM_VALIDATION_ERROR',
        context: { value }
      })
    }
    return true
  }
}
