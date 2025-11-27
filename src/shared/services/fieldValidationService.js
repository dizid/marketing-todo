/**
 * Field Validation Service
 *
 * Comprehensive validation service for ProjectContext fields.
 * Validates individual fields, entire contexts, and provides detailed error reporting.
 *
 * Features:
 * 1. Field-level validation (type, constraints, patterns)
 * 2. Context-level validation (required fields, interdependencies)
 * 3. Batch validation
 * 4. Detailed error messages
 * 5. Warning detection
 * 6. Validation summary reports
 */

import { FIELD_SCHEMAS, validateFieldValue, getFieldDefaultValue } from '@/shared/registry/fieldSchemas.js'
import { CANONICAL_FIELDS, getAllCanonicalFields, isInheritable } from '@/shared/registry/fieldRegistry.js'

export class FieldValidationService {
  constructor(logger = null) {
    this.logger = logger
  }

  /**
   * Validate a single field value
   * @param {string} fieldName - Canonical field name
   * @param {*} value - Value to validate
   * @returns {Object} { isValid, error?, warnings? }
   */
  validateField(fieldName, value) {
    if (!FIELD_SCHEMAS[fieldName]) {
      return {
        isValid: false,
        error: `Unknown field: ${fieldName}`
      }
    }

    return validateFieldValue(fieldName, value)
  }

  /**
   * Validate entire ProjectContext object
   * @param {Object} contextData - Context data to validate
   * @returns {Object} { isValid, errors: [], warnings: [] }
   */
  validateContext(contextData) {
    const errors = []
    const warnings = []

    if (!contextData || typeof contextData !== 'object') {
      return {
        isValid: false,
        errors: ['Context data must be an object'],
        warnings: []
      }
    }

    // Validate each field in the context
    Object.entries(contextData).forEach(([fieldName, value]) => {
      // Skip internal fields
      if (fieldName.startsWith('_') || fieldName === 'id' || fieldName === 'projectId' || fieldName === 'userId' || fieldName === 'createdAt' || fieldName === 'updatedAt') {
        return
      }

      if (!FIELD_SCHEMAS[fieldName]) {
        warnings.push(`Unknown field: ${fieldName}`)
        return
      }

      const result = validateFieldValue(fieldName, value)
      if (!result.isValid) {
        errors.push(result.error)
      }

      if (result.warnings) {
        warnings.push(...result.warnings)
      }
    })

    // Check for consistency
    if (contextData.primaryGoal && contextData.targetTimeline) {
      // If goal is set, timeline should also be set (recommendations only)
      if (!contextData.targetTimeline) {
        warnings.push('Primary goal is set but target timeline is not. Consider adding a timeline.')
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  /**
   * Validate partial update (for PATCH operations)
   * @param {Object} updates - Fields being updated
   * @returns {Object} { isValid, errors: [], warnings: [] }
   */
  validatePartialUpdate(updates) {
    const errors = []
    const warnings = []

    if (!updates || typeof updates !== 'object') {
      return {
        isValid: false,
        errors: ['Updates must be an object'],
        warnings: []
      }
    }

    Object.entries(updates).forEach(([fieldName, value]) => {
      const result = this.validateField(fieldName, value)
      if (!result.isValid) {
        errors.push(result.error)
      }

      if (result.warnings) {
        warnings.push(...result.warnings)
      }
    })

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  /**
   * Validate batch of contexts
   * @param {Array} contexts - Array of context objects
   * @returns {Array} Array of validation results
   */
  validateBatch(contexts) {
    if (!Array.isArray(contexts)) {
      return [{ isValid: false, error: 'Input must be an array' }]
    }

    return contexts.map((context, index) => {
      const result = this.validateContext(context)
      return {
        ...result,
        index,
        contextId: context?.id || 'unknown'
      }
    })
  }

  /**
   * Get all validation errors for a field
   * @param {string} fieldName - Canonical field name
   * @param {*} value - Value to validate
   * @returns {Array} Array of error strings
   */
  getFieldErrors(fieldName, value) {
    const result = this.validateField(fieldName, value)
    return result.isValid ? [] : [result.error]
  }

  /**
   * Check if a field is inheritable
   * @param {string} fieldName - Canonical field name
   * @returns {boolean} True if field is inheritable
   */
  isFieldInheritable(fieldName) {
    return isInheritable(fieldName)
  }

  /**
   * Get fields that can be set on a context
   * @returns {Array} Array of canonical field names
   */
  getValidatableFields() {
    return getAllCanonicalFields()
  }

  /**
   * Get validation report for debugging
   * @param {Object} contextData - Context data
   * @returns {Object} Detailed validation report
   */
  getValidationReport(contextData) {
    const result = this.validateContext(contextData)

    const report = {
      timestamp: new Date().toISOString(),
      isValid: result.isValid,
      errorCount: result.errors.length,
      warningCount: result.warnings.length,
      errors: result.errors,
      warnings: result.warnings,
      fieldsValidated: Object.keys(contextData).filter(
        (k) => !k.startsWith('_') && !['id', 'projectId', 'userId', 'createdAt', 'updatedAt'].includes(k)
      ).length,
      fieldDetails: {}
    }

    // Add per-field details
    Object.entries(contextData).forEach(([fieldName, value]) => {
      if (!FIELD_SCHEMAS[fieldName]) return

      const validation = this.validateField(fieldName, value)
      report.fieldDetails[fieldName] = {
        value: value === null ? null : `${typeof value} (${String(value).substring(0, 50)})`,
        isValid: validation.isValid,
        error: validation.error,
        inheritable: isInheritable(fieldName)
      }
    })

    return report
  }

  /**
   * Suggest fixes for invalid values
   * @param {string} fieldName - Canonical field name
   * @param {*} value - Current value
   * @returns {Array} Array of suggestions
   */
  getSuggestions(fieldName, value) {
    const schema = FIELD_SCHEMAS[fieldName]
    if (!schema) return ['Field not found']

    const suggestions = []

    switch (schema.type) {
      case 'string':
        if (typeof value !== 'string') {
          suggestions.push(`Convert to string: "${String(value)}"`)
        }

        if (schema.validation.maxLength && value?.length > schema.validation.maxLength) {
          suggestions.push(
            `Truncate to ${schema.validation.maxLength} characters: "${value.substring(0, schema.validation.maxLength)}"`
          )
        }

        if (schema.validation.minLength && (!value || value.length < schema.validation.minLength)) {
          suggestions.push(`Must be at least ${schema.validation.minLength} characters`)
        }

        break

      case 'select':
      case 'number':
        if (schema.validation.enum || schema.validation.enum) {
          const validOptions = schema.validation.enum
          suggestions.push(`Use one of: ${validOptions.join(', ')}`)
        }
        break
    }

    return suggestions.length > 0 ? suggestions : ['No suggestions available']
  }

  /**
   * Sanitize context data (remove invalid/unknown fields)
   * @param {Object} contextData - Context data to sanitize
   * @returns {Object} Sanitized context data
   */
  sanitizeContext(contextData) {
    const sanitized = {}

    Object.entries(contextData).forEach(([fieldName, value]) => {
      // Keep internal fields and valid schema fields
      if (fieldName.startsWith('_') || ['id', 'projectId', 'userId', 'createdAt', 'updatedAt'].includes(fieldName)) {
        sanitized[fieldName] = value
      } else if (FIELD_SCHEMAS[fieldName]) {
        // Only include fields that pass validation
        const validation = this.validateField(fieldName, value)
        if (validation.isValid) {
          sanitized[fieldName] = value
        }
      }
      // Drop unknown/invalid fields
    })

    return sanitized
  }

  /**
   * Get field default values
   * @returns {Object} Object with default values for all fields
   */
  getFieldDefaults() {
    const defaults = {}

    Object.keys(FIELD_SCHEMAS).forEach((fieldName) => {
      defaults[fieldName] = getFieldDefaultValue(fieldName)
    })

    return defaults
  }

  /**
   * Compare two contexts for differences
   * @param {Object} context1 - First context
   * @param {Object} context2 - Second context
   * @returns {Object} Differences report
   */
  compareLookupContexts(context1, context2) {
    const differences = {
      added: {},
      removed: {},
      changed: {},
      unchanged: {}
    }

    const allFields = new Set([...Object.keys(context1), ...Object.keys(context2)])

    allFields.forEach((fieldName) => {
      const val1 = context1[fieldName]
      const val2 = context2[fieldName]

      if (!(fieldName in context1)) {
        differences.added[fieldName] = val2
      } else if (!(fieldName in context2)) {
        differences.removed[fieldName] = val1
      } else if (JSON.stringify(val1) !== JSON.stringify(val2)) {
        differences.changed[fieldName] = { from: val1, to: val2 }
      } else {
        differences.unchanged[fieldName] = val1
      }
    })

    return differences
  }
}
