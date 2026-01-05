/**
 * Field Inheritance Composable
 *
 * Manages field inheritance from ProjectContext to Tasks with override capability.
 * Provides unified interface for accessing inherited and local field values.
 *
 * Features:
 * 1. Automatic inheritance of inheritable fields from ProjectContext
 * 2. Task-level override detection and application
 * 3. Computed reactive values for field access
 * 4. Override management (set/clear overrides)
 * 5. Inheritance chain inspection and debugging
 * 6. Batch field operations
 * 7. Field mapping support (miniApp field → canonical field mapping)
 * 8. Required fields tracking and validation
 * 9. Field-specific validation with validateField() and validateRequired()
 *
 * Usage (single field):
 * const { fieldValue, hasOverride, setOverride, clearOverride, getSource } = useFieldInheritance(
 *   projectId,
 *   taskId,
 *   fieldName,
 *   logger
 * )
 *
 * Usage (batch with mappings):
 * const { getAllFieldValues, setOverride, validateRequired } = useFieldInheritanceBatch(
 *   projectId,
 *   taskId,
 *   fieldNames,
 *   { fieldMappings: { 'audience_field': 'target_audience' }, requiredFields: ['audience_field'] }
 * )
 */

import { ref, computed, watch, inject } from 'vue'
import { ProjectContextRepository } from '@/domain/repositories/index.js'
import { FieldValidationService } from '@/shared/services/fieldValidationService.js'
import { CANONICAL_FIELDS, isInheritable } from '@/shared/registry/fieldRegistry.js'

export function useFieldInheritance(projectId, taskId, fieldName, logger = null) {
  // Injected dependencies (from provider or fallback)
  const injectedRepository = inject('projectContextRepository', null)
  const injectedValidationService = inject('fieldValidationService', null)

  const repository = injectedRepository || new ProjectContextRepository(logger)
  const validationService = injectedValidationService || new FieldValidationService(logger)

  // State
  const projectContext = ref(null)
  const taskFieldOverride = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  /**
   * Load ProjectContext for the given project
   */
  const loadProjectContext = async () => {
    if (!projectId) return

    isLoading.value = true
    error.value = null

    try {
      projectContext.value = await repository.getByProjectId(projectId)
      if (logger) {
        logger.debug(`[useFieldInheritance] Loaded ProjectContext for project: ${projectId}`)
      }
    } catch (err) {
      error.value = err.message
      if (logger) {
        logger.error(`[useFieldInheritance] Error loading ProjectContext: ${err.message}`)
      }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Get the current value of a field considering inheritance and overrides
   * Returns: { value, source: 'override' | 'inherited' | 'default' | null }
   */
  const getFieldValue = computed(() => {
    // Check for task-level override first
    if (taskFieldOverride.value !== null && taskFieldOverride.value !== undefined) {
      return {
        value: taskFieldOverride.value,
        source: 'override'
      }
    }

    // Check if field is inheritable
    if (!isInheritable(fieldName)) {
      return {
        value: null,
        source: null
      }
    }

    // Check ProjectContext for inherited value
    if (projectContext.value && projectContext.value.hasField?.(fieldName)) {
      return {
        value: projectContext.value.getField?.(fieldName),
        source: 'inherited'
      }
    }

    // Return default/null
    return {
      value: null,
      source: null
    }
  })

  /**
   * Check if field has a task-level override
   */
  const hasOverride = computed(() => {
    return taskFieldOverride.value !== null && taskFieldOverride.value !== undefined
  })

  /**
   * Check if field can be inherited
   */
  const canInherit = computed(() => {
    return isInheritable(fieldName)
  })

  /**
   * Get source of current field value
   */
  const getSource = computed(() => {
    return getFieldValue.value.source
  })

  /**
   * Get the actual field value
   */
  const fieldValue = computed(() => {
    return getFieldValue.value.value
  })

  /**
   * Set a task-level override for this field
   * @param {*} value - Override value
   * @returns {Object} Validation result
   */
  const setOverride = (value) => {
    const validation = validationService.validateField(fieldName, value)

    if (!validation.isValid) {
      error.value = validation.error
      if (logger) {
        logger.warn(`[useFieldInheritance] Override validation failed: ${validation.error}`)
      }
      return validation
    }

    taskFieldOverride.value = value
    error.value = null

    if (logger) {
      logger.debug(`[useFieldInheritance] Set override for field ${fieldName}: ${String(value).substring(0, 50)}`)
    }

    return { isValid: true }
  }

  /**
   * Clear task-level override for this field
   */
  const clearOverride = () => {
    taskFieldOverride.value = null
    error.value = null

    if (logger) {
      logger.debug(`[useFieldInheritance] Cleared override for field ${fieldName}`)
    }
  }

  /**
   * Get detailed inheritance chain information
   * @returns {Object} Inheritance details
   */
  const getInheritanceChain = () => {
    return {
      fieldName,
      isInheritable: canInherit.value,
      current: {
        value: fieldValue.value,
        source: getSource.value
      },
      override: {
        hasOverride: hasOverride.value,
        value: taskFieldOverride.value
      },
      inherited: {
        value: projectContext.value?.getField?.(fieldName),
        available: !!projectContext.value?.hasField?.(fieldName)
      },
      projectId,
      taskId
    }
  }

  /**
   * Initialize the composable by loading ProjectContext
   */
  const initialize = async () => {
    await loadProjectContext()
  }

  /**
   * Watch projectId changes and reload context
   */
  watch(
    () => projectId,
    () => {
      loadProjectContext()
    },
    { immediate: false }
  )

  return {
    // State
    projectContext,
    taskFieldOverride,
    isLoading,
    error,

    // Computed values
    fieldValue,
    hasOverride,
    canInherit,
    getSource,

    // Methods
    loadProjectContext,
    setOverride,
    clearOverride,
    getFieldValue: getFieldValue.value,
    getInheritanceChain,
    initialize
  }
}

/**
 * Batch Field Inheritance Composable
 *
 * Manage multiple fields at once with inheritance support.
 * Supports field mappings (miniApp field ID → canonical field name) and required field validation.
 *
 * @param {string} projectId - Project ID
 * @param {string} taskId - Task ID
 * @param {string[]} fieldNames - Array of canonical field names to manage
 * @param {Object} options - Optional configuration
 * @param {Object} options.fieldMappings - Map of miniApp field IDs to canonical field names
 * @param {string[]} options.requiredFields - Array of field names (canonical) that are required
 * @param {Object} logger - Optional logger instance
 */
export function useFieldInheritanceBatch(projectId, taskId, fieldNames = [], options = {}, logger = null) {
  // Handle backward compatibility: if options is a logger, shift parameters
  if (typeof options === 'object' && options.debug && !options.fieldMappings && !options.requiredFields) {
    logger = options
    options = {}
  }

  const injectedRepository = inject('projectContextRepository', null)
  const injectedValidationService = inject('fieldValidationService', null)

  const repository = injectedRepository || new ProjectContextRepository(logger)
  const validationService = injectedValidationService || new FieldValidationService(logger)

  // Options
  const fieldMappings = options.fieldMappings || {}
  const requiredFieldsList = options.requiredFields || []

  // State
  const projectContext = ref(null)
  const taskFieldOverrides = ref({})
  const isLoading = ref(false)
  const error = ref(null)
  const validationErrors = ref({})

  /**
   * Load ProjectContext for the given project
   */
  const loadProjectContext = async () => {
    if (!projectId) return

    isLoading.value = true
    error.value = null

    try {
      projectContext.value = await repository.getByProjectId(projectId)
      if (logger) {
        logger.debug(`[useFieldInheritanceBatch] Loaded ProjectContext for project: ${projectId}`)
      }
    } catch (err) {
      error.value = err.message
      if (logger) {
        logger.error(`[useFieldInheritanceBatch] Error loading ProjectContext: ${err.message}`)
      }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Get inherited value for a specific field
   */
  const getInheritedValue = (fieldName) => {
    if (!isInheritable(fieldName)) return null
    if (!projectContext.value?.hasField?.(fieldName)) return null
    return projectContext.value.getField?.(fieldName)
  }

  /**
   * Get current value for a field (override or inherited)
   */
  const getFieldValue = (fieldName) => {
    // Check override first
    if (taskFieldOverrides.value[fieldName] !== null && taskFieldOverrides.value[fieldName] !== undefined) {
      return {
        value: taskFieldOverrides.value[fieldName],
        source: 'override'
      }
    }

    // Check inherited
    const inherited = getInheritedValue(fieldName)
    if (inherited !== null && inherited !== undefined) {
      return {
        value: inherited,
        source: 'inherited'
      }
    }

    return {
      value: null,
      source: null
    }
  }

  /**
   * Get all field values with their sources
   */
  const getAllFieldValues = computed(() => {
    const result = {}
    fieldNames.forEach((name) => {
      result[name] = getFieldValue(name)
    })
    return result
  })

  /**
   * Set overrides for multiple fields
   * @param {Object} overrides - Object with fieldName: value pairs
   * @returns {Object} Validation results per field
   */
  const setOverrides = (overrides) => {
    const results = {}
    const validationErrors = {}

    Object.entries(overrides).forEach(([fieldName, value]) => {
      const validation = validationService.validateField(fieldName, value)

      if (!validation.isValid) {
        validationErrors[fieldName] = validation.error
        results[fieldName] = { isValid: false, error: validation.error }
      } else {
        taskFieldOverrides.value[fieldName] = value
        results[fieldName] = { isValid: true }
      }
    })

    if (Object.keys(validationErrors).length > 0) {
      error.value = validationErrors
      if (logger) {
        logger.warn(`[useFieldInheritanceBatch] Validation errors:`, validationErrors)
      }
    } else {
      error.value = null
    }

    return results
  }

  /**
   * Set override for single field
   */
  const setOverride = (fieldName, value) => {
    return setOverrides({ [fieldName]: value })[fieldName]
  }

  /**
   * Clear override for a field
   */
  const clearOverride = (fieldName) => {
    taskFieldOverrides.value[fieldName] = null
    if (logger) {
      logger.debug(`[useFieldInheritanceBatch] Cleared override for field ${fieldName}`)
    }
  }

  /**
   * Clear all overrides
   */
  const clearAllOverrides = () => {
    taskFieldOverrides.value = {}
    error.value = null
    if (logger) {
      logger.debug(`[useFieldInheritanceBatch] Cleared all overrides`)
    }
  }

  /**
   * Get all overrides
   */
  const getOverrides = computed(() => {
    return { ...taskFieldOverrides.value }
  })

  /**
   * Get fields that have overrides
   */
  const getOverriddenFields = computed(() => {
    return Object.keys(taskFieldOverrides.value).filter(
      (name) => taskFieldOverrides.value[name] !== null && taskFieldOverrides.value[name] !== undefined
    )
  })

  /**
   * Get inheritance summary for all fields
   */
  const getInheritanceSummary = () => {
    const summary = {
      totalFields: fieldNames.length,
      overriddenFields: getOverriddenFields.value.length,
      inheritedFields: fieldNames.filter((name) => !getOverrides.value[name] && isInheritable(name)).length,
      inheritableFields: fieldNames.filter((name) => isInheritable(name)).length,
      nonInheritableFields: fieldNames.filter((name) => !isInheritable(name)).length,
      fields: {}
    }

    fieldNames.forEach((name) => {
      const fieldValue = getFieldValue(name)
      summary.fields[name] = {
        value: fieldValue.value,
        source: fieldValue.source,
        inheritable: isInheritable(name),
        overridden: !!taskFieldOverrides.value[name]
      }
    })

    return summary
  }

  /**
   * Validate a single field value
   * @param {string} fieldName - Canonical field name to validate
   * @param {*} value - Value to validate
   * @returns {Object} { isValid: boolean, error?: string }
   */
  const validateField = (fieldName, value) => {
    try {
      const validation = validationService.validateField(fieldName, value)
      return validation
    } catch (err) {
      return { isValid: false, error: err.message }
    }
  }

  /**
   * Check if a field is required
   * @param {string} fieldName - Canonical field name
   * @returns {boolean} True if field is required
   */
  const isFieldRequired = (fieldName) => {
    return requiredFieldsList.includes(fieldName)
  }

  /**
   * Validate all required fields have values
   * @returns {Object} { isValid: boolean, errors: Object }
   */
  const validateRequired = () => {
    const errors = {}
    let isValid = true

    requiredFieldsList.forEach((fieldName) => {
      const fieldData = getFieldValue(fieldName)
      const value = fieldData.value

      if (value === null || value === undefined || value === '') {
        errors[fieldName] = `${fieldName} is required`
        isValid = false
      }
    })

    validationErrors.value = errors

    if (logger) {
      if (isValid) {
        logger.debug(`[useFieldInheritanceBatch] All required fields validated successfully`)
      } else {
        logger.warn(`[useFieldInheritanceBatch] Required field validation failed:`, errors)
      }
    }

    return { isValid, errors }
  }

  /**
   * Get canonical field name for a miniApp field ID
   * Used when field mappings are provided
   * @param {string} miniAppFieldId - The miniApp-specific field ID
   * @returns {string|null} The canonical field name or null if not mapped
   */
  const getCanonicalFieldName = (miniAppFieldId) => {
    return fieldMappings[miniAppFieldId] || null
  }

  /**
   * Get all validation errors from last validation
   * @returns {Object} Map of field names to error messages
   */
  const getValidationErrors = computed(() => {
    return { ...validationErrors.value }
  })

  /**
   * Initialize
   */
  const initialize = async () => {
    await loadProjectContext()
  }

  return {
    // State
    projectContext,
    taskFieldOverrides,
    isLoading,
    error,

    // Computed
    getAllFieldValues,
    getOverrides,
    getOverriddenFields,
    getValidationErrors,

    // Methods
    loadProjectContext,
    getFieldValue,
    getInheritedValue,
    setOverride,
    setOverrides,
    clearOverride,
    clearAllOverrides,
    getInheritanceSummary,

    // Validation methods
    validateField,
    validateRequired,
    isFieldRequired,
    getCanonicalFieldName,

    // Initialization
    initialize
  }
}
