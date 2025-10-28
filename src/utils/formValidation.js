/**
 * Form Validation Utilities
 *
 * Centralized validation functions for all form fields.
 * Each validator returns true if valid, or an error message if invalid.
 */

/**
 * Required field validator
 * @param {any} value - Field value
 * @param {string} fieldName - Field name for error message
 * @returns {boolean|string}
 */
export function validateRequired(value, fieldName = 'This field') {
  if (value === null || value === undefined || value === '') {
    return `${fieldName} is required`
  }
  if (Array.isArray(value) && value.length === 0) {
    return `${fieldName} must have at least one selection`
  }
  return true
}

/**
 * Text field validator
 * @param {string} value - Field value
 * @param {Object} options - Validation options
 * @returns {boolean|string}
 */
export function validateText(value, options = {}) {
  const { minLength, maxLength, fieldName = 'This field', pattern, customMessage } = options

  if (minLength && value && value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`
  }

  if (maxLength && value && value.length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`
  }

  if (pattern && value && !pattern.test(value)) {
    return customMessage || `${fieldName} format is invalid`
  }

  return true
}

/**
 * Email field validator
 * @param {string} value - Email value
 * @returns {boolean|string}
 */
export function validateEmail(value) {
  if (!value) return true // Allow empty if not required
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(value)) {
    return 'Please enter a valid email address'
  }
  return true
}

/**
 * Number field validator
 * @param {number} value - Number value
 * @param {Object} options - Validation options
 * @returns {boolean|string}
 */
export function validateNumber(value, options = {}) {
  const { min, max, fieldName = 'This field', isInteger = false } = options

  if (isInteger && !Number.isInteger(value)) {
    return `${fieldName} must be a whole number`
  }

  if (typeof min === 'number' && value < min) {
    return `${fieldName} must be at least ${min}`
  }

  if (typeof max === 'number' && value > max) {
    return `${fieldName} must not exceed ${max}`
  }

  return true
}

/**
 * Textarea field validator
 * @param {string} value - Textarea value
 * @param {Object} options - Validation options
 * @returns {boolean|string}
 */
export function validateTextarea(value, options = {}) {
  const { minLines, maxLines, fieldName = 'This field' } = options

  if (!value) return true // Allow empty if not required

  const lineCount = value.split('\n').length

  if (minLines && lineCount < minLines) {
    return `${fieldName} must have at least ${minLines} lines`
  }

  if (maxLines && lineCount > maxLines) {
    return `${fieldName} must not exceed ${maxLines} lines`
  }

  return true
}

/**
 * Select field validator
 * @param {string} value - Selected value
 * @param {Array} validOptions - Array of valid option values
 * @param {string} fieldName - Field name for error message
 * @returns {boolean|string}
 */
export function validateSelect(value, validOptions = [], fieldName = 'This field') {
  if (validOptions.length > 0 && value && !validOptions.includes(value)) {
    return `${fieldName} has an invalid selection`
  }
  return true
}

/**
 * Checkboxes field validator
 * @param {Array} values - Selected values
 * @param {Object} options - Validation options
 * @returns {boolean|string}
 */
export function validateCheckboxes(values, options = {}) {
  const { min, max, fieldName = 'This field', validOptions = [] } = options

  if (!Array.isArray(values)) {
    return `${fieldName} must be an array`
  }

  if (min && values.length < min) {
    return `${fieldName} requires at least ${min} selection(s)`
  }

  if (max && values.length > max) {
    return `${fieldName} allows maximum ${max} selection(s)`
  }

  if (validOptions.length > 0) {
    const invalidValues = values.filter(v => !validOptions.includes(v))
    if (invalidValues.length > 0) {
      return `${fieldName} contains invalid selections`
    }
  }

  return true
}

/**
 * URL field validator
 * @param {string} value - URL value
 * @returns {boolean|string}
 */
export function validateURL(value) {
  if (!value) return true // Allow empty if not required

  try {
    new URL(value)
    return true
  } catch {
    return 'Please enter a valid URL (e.g., https://example.com)'
  }
}

/**
 * Validate entire form against field definitions
 * @param {Object} formData - Form data object
 * @param {Array} fields - Field definitions from task config
 * @returns {Object} Map of field errors (empty if all valid)
 */
export function validateForm(formData, fields) {
  const errors = {}

  for (const field of fields) {
    const value = formData[field.id]
    const fieldError = validateField(field, value)

    if (fieldError !== true) {
      errors[field.id] = fieldError
    }
  }

  return errors
}

/**
 * Validate a single field
 * @param {Object} field - Field definition
 * @param {any} value - Field value
 * @returns {boolean|string} true if valid, error message if invalid
 */
export function validateField(field, value) {
  // Check required
  if (field.required && value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
    return `${field.label} is required`
  }

  // Skip validation if empty and not required
  if (!field.required && (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0))) {
    return true
  }

  // Field-type specific validation
  switch (field.type) {
    case 'email':
      return validateEmail(value)

    case 'url':
      return validateURL(value)

    case 'text':
      return validateText(value, { fieldName: field.label })

    case 'textarea':
      return validateTextarea(value, { fieldName: field.label })

    case 'number':
      return validateNumber(value, {
        min: field.min,
        max: field.max,
        fieldName: field.label,
        isInteger: field.isInteger
      })

    case 'select':
      const selectOptions = field.options?.map(o => o.value) || []
      return validateSelect(value, selectOptions, field.label)

    case 'checkboxes':
      const checkboxOptions = field.options?.map(o => o.value) || []
      return validateCheckboxes(value, {
        min: field.minSelections,
        max: field.maxSelections,
        fieldName: field.label,
        validOptions: checkboxOptions
      })

    case 'radio':
      const radioOptions = field.options?.map(o => o.value) || []
      return validateSelect(value, radioOptions, field.label)

    default:
      return true
  }

  // Custom validation function
  if (field.validate && typeof field.validate === 'function') {
    try {
      const customResult = field.validate(value)
      if (customResult !== true) {
        return customResult || 'Validation failed'
      }
    } catch (err) {
      return `Validation error: ${err.message}`
    }
  }

  return true
}

/**
 * Get validation error message
 * @param {Object} errors - Errors object from validateForm
 * @returns {string} Formatted error message
 */
export function getFormErrorMessage(errors) {
  const errorList = Object.values(errors).filter(Boolean)
  if (errorList.length === 0) return null

  if (errorList.length === 1) {
    return errorList[0]
  }

  return `Please correct the following errors:\n- ${errorList.join('\n- ')}`
}

/**
 * Check if form has any errors
 * @param {Object} errors - Errors object from validateForm
 * @returns {boolean}
 */
export function hasFormErrors(errors) {
  return Object.values(errors).some(error => error !== true && error !== '')
}
