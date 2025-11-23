/**
 * useValidation Composable
 *
 * Provides form validation interface.
 * Wraps validators with Vue reactivity for forms.
 */

import { ref, computed } from 'vue'
import { validateEmail, validatePassword, validateProjectName, validateFormData, validateEmailFormat } from '@/shared/utils/validators'
import { logger } from '@/shared/utils'

const childLogger = logger.child('useValidation')

export function useValidation() {
  // STATE
  const errors = ref({})
  const touched = ref({})
  const isDirty = ref(false)

  // COMPUTED
  const hasErrors = computed(() => Object.keys(errors.value).length > 0)
  const hasTouched = computed(() => Object.keys(touched.value).length > 0)

  /**
   * Validate email
   */
  function validateEmailField(email) {
    try {
      const isValid = validateEmailFormat(email)
      if (!isValid) {
        errors.value.email = 'Invalid email format'
        return false
      }
      delete errors.value.email
      return true
    } catch (err) {
      childLogger.error('Email validation error', { error: err.message })
      errors.value.email = err.message
      return false
    }
  }

  /**
   * Validate password
   */
  function validatePasswordField(password) {
    try {
      const result = validatePassword(password)
      if (!result.isValid) {
        errors.value.password = result.message
        return false
      }
      delete errors.value.password
      return true
    } catch (err) {
      childLogger.error('Password validation error', { error: err.message })
      errors.value.password = err.message
      return false
    }
  }

  /**
   * Validate project name
   */
  function validateProjectNameField(name) {
    try {
      const result = validateProjectName(name)
      if (!result.isValid) {
        errors.value.projectName = result.message
        return false
      }
      delete errors.value.projectName
      return true
    } catch (err) {
      childLogger.error('Project name validation error', { error: err.message })
      errors.value.projectName = err.message
      return false
    }
  }

  /**
   * Validate entire form against schema
   */
  function validateForm(data, schema) {
    try {
      errors.value = {}
      const result = validateFormData(data, schema)

      if (!result.isValid) {
        result.errors.forEach(err => {
          errors.value[err.field] = err.message
        })
        childLogger.warn('Form validation failed', { fieldCount: result.errors.length })
        return false
      }

      childLogger.debug('Form validation passed')
      return true
    } catch (err) {
      childLogger.error('Form validation error', { error: err.message })
      errors.value.form = err.message
      return false
    }
  }

  /**
   * Mark field as touched
   */
  function touchField(fieldName) {
    touched.value[fieldName] = true
  }

  /**
   * Mark form as dirty
   */
  function markDirty() {
    isDirty.value = true
  }

  /**
   * Reset validation state
   */
  function resetValidation() {
    errors.value = {}
    touched.value = {}
    isDirty.value = false
  }

  /**
   * Get error for field
   */
  function getError(fieldName) {
    return errors.value[fieldName] || null
  }

  /**
   * Check if field has error
   */
  function hasError(fieldName) {
    return !!errors.value[fieldName]
  }

  /**
   * Check if field is touched
   */
  function isTouched(fieldName) {
    return touched.value[fieldName] === true
  }

  return {
    // State
    errors,
    touched,
    isDirty,

    // Computed
    hasErrors,
    hasTouched,

    // Actions
    validateEmailField,
    validatePasswordField,
    validateProjectNameField,
    validateForm,
    touchField,
    markDirty,
    resetValidation,
    getError,
    hasError,
    isTouched
  }
}
