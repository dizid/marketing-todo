/**
 * Form Field Inheritance Composable (Adapter Pattern)
 *
 * Simplified high-level composable for mini-apps and forms that need field inheritance.
 * Wraps useFieldInheritanceBatch with a form-friendly API.
 *
 * Features:
 * 1. Mini-app field mappings (miniApp field ID → canonical field mapping)
 * 2. Required field validation
 * 3. Form-friendly value getters and setters
 * 4. Field source tracking (inherited, override, or default)
 * 5. Batch operations on multiple fields
 *
 * Usage:
 * const { getField, setField, validateRequired, isInherited } = useFormFieldInheritance(
 *   projectId,
 *   {
 *     fieldMappings: { 'audience_field': 'target_audience' },
 *     requiredFields: ['audience_field']
 *   }
 * )
 */

import { ref, computed } from 'vue'
import { useFieldInheritanceBatch } from './useFieldInheritance.js'

/**
 * Mini-app field requirements mapping
 * Defines which fields each mini-app uses and whether they're required
 *
 * @deprecated - This is kept for backward compatibility. Use fieldMappings option instead.
 */
const MINIAPP_FIELD_MAPPINGS = {
  blog: {
    fields: ['product_name', 'product_description', 'target_audience', 'primary_goal'],
    required: ['product_name', 'target_audience']
  },
  webinar: {
    fields: ['product_name', 'target_audience', 'primary_goal', 'target_timeline', 'team_size'],
    required: ['product_name', 'target_audience']
  },
  paidAds: {
    fields: ['product_name', 'product_description', 'target_audience', 'primary_goal', 'marketing_budget'],
    required: ['product_name', 'target_audience', 'primary_goal']
  },
  landingPage: {
    fields: ['product_name', 'product_description', 'target_audience', 'primary_goal'],
    required: ['product_name', 'product_description']
  }
}

/**
 * Form Field Inheritance Composable
 *
 * @param {string} projectId - Project ID
 * @param {Object} options - Configuration options
 * @param {Object} options.fieldMappings - Map of miniApp field IDs to canonical field names
 * @param {string[]} options.requiredFields - Array of field names (canonical) that are required
 * @param {string} options.miniAppName - Deprecated: mini-app name for preset mappings
 * @param {Object} logger - Optional logger instance
 * @returns {Object} Composable interface with field access methods
 */
export function useFormFieldInheritance(projectId, options = {}, logger = null) {
  // Handle backward compatibility: if options is a string (miniAppName), use preset
  let fieldMappings = options.fieldMappings || {}
  let requiredFields = options.requiredFields || []

  if (typeof options === 'string' && MINIAPP_FIELD_MAPPINGS[options]) {
    // Backward compatible: useFormFieldInheritance(projectId, 'webinar')
    const preset = MINIAPP_FIELD_MAPPINGS[options]
    fieldMappings = preset.fields.reduce((acc, field) => {
      acc[field] = field
      return acc
    }, {})
    requiredFields = preset.required
  }

  // Get canonical field names from mappings
  const canonicalFields = Object.values(fieldMappings).filter(Boolean)

  // Use batch composable with options
  const batchComposable = useFieldInheritanceBatch(
    projectId,
    null,
    canonicalFields,
    { fieldMappings, requiredFields },
    logger
  )

  // State
  const isValidated = ref(false)
  const validationErrors = ref({})

  /**
   * Get a field value by its miniApp field ID or canonical name
   * @param {string} fieldId - The miniApp field ID or canonical field name
   * @returns {*} The field value
   */
  const getField = (fieldId) => {
    const canonicalName = fieldMappings[fieldId] || fieldId
    const fieldData = batchComposable.getFieldValue(canonicalName)
    return fieldData.value
  }

  /**
   * Get field with full details (value, source, etc.)
   * @param {string} fieldId - The miniApp field ID or canonical field name
   * @returns {Object} Field data with value and source information
   */
  const getFieldDetails = (fieldId) => {
    const canonicalName = fieldMappings[fieldId] || fieldId
    return batchComposable.getFieldValue(canonicalName)
  }

  /**
   * Set a field override
   * @param {string} fieldId - The miniApp field ID or canonical field name
   * @param {*} value - The value to set
   * @returns {Object} Validation result
   */
  const setField = (fieldId, value) => {
    const canonicalName = fieldMappings[fieldId] || fieldId
    return batchComposable.setOverride(canonicalName, value)
  }

  /**
   * Set field override (alias for setField)
   * @param {string} fieldId - The miniApp field ID or canonical field name
   * @param {*} value - The value to set
   * @returns {Object} Validation result
   */
  const setOverride = (fieldId, value) => {
    const canonicalName = fieldMappings[fieldId] || fieldId
    return batchComposable.setOverride(canonicalName, value)
  }

  /**
   * Clear field override
   * @param {string} fieldId - The miniApp field ID or canonical field name
   */
  const clearField = (fieldId) => {
    const canonicalName = fieldMappings[fieldId] || fieldId
    batchComposable.clearOverride(canonicalName)
  }

  /**
   * Clear all overrides
   */
  const clearAllFields = () => {
    batchComposable.clearAllOverrides()
  }

  /**
   * Get all inherited field values as object
   * Maps canonical names back to miniApp field IDs if available
   * @returns {Object} Object with field ID keys and values
   */
  const getInheritedFields = computed(() => {
    const result = {}
    canonicalFields.forEach((canonicalName) => {
      // Find miniApp field ID for this canonical name
      const miniAppFieldId = Object.entries(fieldMappings).find(
        ([, canonical]) => canonical === canonicalName
      )?.[0] || canonicalName

      const fieldData = batchComposable.getFieldValue(canonicalName)
      result[miniAppFieldId] = fieldData.value
    })
    return result
  })

  /**
   * Get all overridden field values
   * Maps canonical names back to miniApp field IDs if available
   * @returns {Object} Object with field ID keys and override values
   */
  const getOverriddenFields = computed(() => {
    const result = {}
    batchComposable.getOverriddenFields.value.forEach((canonicalName) => {
      // Find miniApp field ID for this canonical name
      const miniAppFieldId = Object.entries(fieldMappings).find(
        ([, canonical]) => canonical === canonicalName
      )?.[0] || canonicalName

      const fieldData = batchComposable.getFieldValue(canonicalName)
      result[miniAppFieldId] = fieldData.value
    })
    return result
  })

  /**
   * Check if a field is using inherited value
   * @param {string} fieldId - The miniApp field ID or canonical field name
   * @returns {boolean} True if using inherited value
   */
  const isInherited = (fieldId) => {
    const canonicalName = fieldMappings[fieldId] || fieldId
    const fieldData = batchComposable.getFieldValue(canonicalName)
    return fieldData.source === 'inherited'
  }

  /**
   * Check if a field has override
   * @param {string} fieldId - The miniApp field ID or canonical field name
   * @returns {boolean} True if field is overridden
   */
  const isOverridden = (fieldId) => {
    const canonicalName = fieldMappings[fieldId] || fieldId
    const overrides = batchComposable.getOverrides.value
    return overrides[canonicalName] !== null && overrides[canonicalName] !== undefined
  }

  /**
   * Check if a field is required
   * @param {string} fieldId - The miniApp field ID or canonical field name
   * @returns {boolean} True if field is required
   */
  const isRequired = (fieldId) => {
    const canonicalName = fieldMappings[fieldId] || fieldId
    return batchComposable.isFieldRequired(canonicalName)
  }

  /**
   * Get field source (inherited, override, or null)
   * @param {string} fieldId - The miniApp field ID or canonical field name
   * @returns {string|null} The source of the field value
   */
  const getFieldSource = (fieldId) => {
    const canonicalName = fieldMappings[fieldId] || fieldId
    return batchComposable.getFieldValue(canonicalName).source
  }

  /**
   * Validate all required fields have values
   * @returns {Object} { isValid: boolean, errors: Object }
   */
  const validateRequired = () => {
    const result = batchComposable.validateRequired()

    // Map canonical field names back to miniApp field IDs in errors
    const mappedErrors = {}
    Object.entries(result.errors).forEach(([canonicalName, error]) => {
      const miniAppFieldId = Object.entries(fieldMappings).find(
        ([, canonical]) => canonical === canonicalName
      )?.[0] || canonicalName

      mappedErrors[miniAppFieldId] = error
    })

    validationErrors.value = mappedErrors
    isValidated.value = result.isValid

    return {
      isValid: result.isValid,
      errors: mappedErrors
    }
  }

  /**
   * Get validation status
   * @returns {Object} Current validation status with details
   */
  const getValidationStatus = computed(() => {
    const requiredCount = requiredFields.length
    const filledCount = requiredFields.filter((fieldId) => {
      const value = getField(fieldId)
      return value !== null && value !== undefined && value !== ''
    }).length

    return {
      isValidated: isValidated.value,
      isValid: Object.keys(validationErrors.value).length === 0,
      errors: validationErrors.value,
      requiredFieldsCount: requiredCount,
      filledRequiredFields: filledCount
    }
  })

  /**
   * Get summary of all fields
   * @returns {Object} Detailed summary of field inheritance state
   */
  const getSummary = computed(() => {
    const summary = {
      totalFields: canonicalFields.length,
      requiredFields: requiredFields.length,
      overriddenFields: batchComposable.getOverriddenFields.value.length,
      inheritedFields: canonicalFields.filter((name) => {
        const fieldData = batchComposable.getFieldValue(name)
        return fieldData.source === 'inherited'
      }).length,
      filledRequiredFields: requiredFields.filter((fieldId) => {
        const value = getField(fieldId)
        return value !== null && value !== undefined && value !== ''
      }).length,
      fields: {}
    }

    canonicalFields.forEach((canonicalName) => {
      const miniAppFieldId = Object.entries(fieldMappings).find(
        ([, canonical]) => canonical === canonicalName
      )?.[0] || canonicalName

      summary.fields[miniAppFieldId] = {
        value: getField(miniAppFieldId),
        source: getFieldSource(miniAppFieldId),
        required: isRequired(miniAppFieldId),
        inheritable: true, // Assume all managed fields are inheritable
        overridden: isOverridden(miniAppFieldId)
      }
    })

    return summary
  })

  /**
   * Export all field data (useful for saving/API calls)
   * Maps canonical names to miniApp field IDs in output
   * @param {boolean} includeNull - Include null/undefined values
   * @returns {Object} Field data object with miniApp field IDs as keys
   */
  const exportFieldData = (includeNull = false) => {
    const data = {}

    canonicalFields.forEach((canonicalName) => {
      const miniAppFieldId = Object.entries(fieldMappings).find(
        ([, canonical]) => canonical === canonicalName
      )?.[0] || canonicalName

      const value = getField(miniAppFieldId)
      if (includeNull || (value !== null && value !== undefined)) {
        data[miniAppFieldId] = value
      }
    })

    return data
  }

  /**
   * Reset all overrides to inherited values
   */
  const resetToInherited = () => {
    batchComposable.clearAllOverrides()
    isValidated.value = false
    validationErrors.value = {}

    if (logger) {
      logger.debug('[useFormFieldInheritance] Reset all fields to inherited values')
    }
  }

  /**
   * Initialize the composable
   */
  const initialize = async () => {
    await batchComposable.initialize()

    if (logger) {
      logger.debug('[useFormFieldInheritance] Initialized with', {
        mappings: fieldMappings,
        requiredFields: requiredFields
      })
    }
  }

  return {
    // State
    isValidated,
    validationErrors,

    // Computed
    getInheritedFields,
    getOverriddenFields,
    getValidationStatus,
    getSummary,

    // Field access methods
    getField,
    getFieldDetails,
    setField,
    setOverride,
    clearField,
    clearAllFields,

    // Status checks
    isInherited,
    isOverridden,
    isRequired,
    getFieldSource,

    // Validation
    validateRequired,

    // Data export
    exportFieldData,

    // Reset & initialization
    resetToInherited,
    initialize,

    // Access to underlying batch composable for advanced use
    _batchComposable: batchComposable
  }
}
