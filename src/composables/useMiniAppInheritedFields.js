/**
 * Mini-App Inherited Fields Composable
 *
 * Specialized composable for mini-app integration with ProjectContext field inheritance.
 * Simplifies field access for mini-apps that need to inherit project-level context.
 *
 * Features:
 * 1. Pre-loaded mini-app specific fields (audience, goal, timeline, budget, etc.)
 * 2. Simplified API for common mini-app operations
 * 3. Form-friendly value getters and setters
 * 4. Override persistence management
 * 5. Auto-detection of which fields are relevant to a mini-app
 *
 * Usage:
 * const miniApp = useMiniAppInheritedFields(projectId, miniAppName)
 * const audienceValue = miniApp.getField('target_audience')
 * miniApp.setOverride('target_audience', 'new value')
 */

import { ref, computed, watch } from 'vue'
import { useFieldInheritanceBatch } from './useFieldInheritance.js'
import { CANONICAL_FIELDS, isInheritable } from '@/shared/registry/fieldRegistry.js'

/**
 * Mini-app field requirements mapping
 * Defines which fields each mini-app uses and whether they're required
 */
const MINIAPP_FIELD_MAPPINGS = {
  blog: {
    fields: [
      CANONICAL_FIELDS.PRODUCT_NAME,
      CANONICAL_FIELDS.PRODUCT_DESCRIPTION,
      CANONICAL_FIELDS.TARGET_AUDIENCE,
      CANONICAL_FIELDS.PRIMARY_GOAL
    ],
    required: [CANONICAL_FIELDS.PRODUCT_NAME, CANONICAL_FIELDS.TARGET_AUDIENCE]
  },

  webinar: {
    fields: [
      CANONICAL_FIELDS.PRODUCT_NAME,
      CANONICAL_FIELDS.TARGET_AUDIENCE,
      CANONICAL_FIELDS.PRIMARY_GOAL,
      CANONICAL_FIELDS.TARGET_TIMELINE,
      CANONICAL_FIELDS.TEAM_SIZE
    ],
    required: [CANONICAL_FIELDS.PRODUCT_NAME, CANONICAL_FIELDS.TARGET_AUDIENCE]
  },

  paidAds: {
    fields: [
      CANONICAL_FIELDS.PRODUCT_NAME,
      CANONICAL_FIELDS.PRODUCT_DESCRIPTION,
      CANONICAL_FIELDS.TARGET_AUDIENCE,
      CANONICAL_FIELDS.PRIMARY_GOAL,
      CANONICAL_FIELDS.MARKETING_BUDGET
    ],
    required: [CANONICAL_FIELDS.PRODUCT_NAME, CANONICAL_FIELDS.TARGET_AUDIENCE, CANONICAL_FIELDS.PRIMARY_GOAL]
  },

  landingPage: {
    fields: [
      CANONICAL_FIELDS.PRODUCT_NAME,
      CANONICAL_FIELDS.PRODUCT_DESCRIPTION,
      CANONICAL_FIELDS.TARGET_AUDIENCE,
      CANONICAL_FIELDS.PRIMARY_GOAL
    ],
    required: [CANONICAL_FIELDS.PRODUCT_NAME, CANONICAL_FIELDS.PRODUCT_DESCRIPTION]
  },

  projectForm: {
    fields: Object.values(CANONICAL_FIELDS),
    required: []
  }
}

export function useMiniAppInheritedFields(projectId, miniAppName, logger = null) {
  // Get mini-app specific fields
  const miniAppConfig = MINIAPP_FIELD_MAPPINGS[miniAppName] || {
    fields: Object.values(CANONICAL_FIELDS),
    required: []
  }

  // Use batch composable for multi-field support
  const batchComposable = useFieldInheritanceBatch(projectId, null, miniAppConfig.fields, logger)

  // State
  const selectedFields = ref(new Set(miniAppConfig.fields))
  const requiredFields = ref(new Set(miniAppConfig.required))
  const isValidated = ref(false)
  const validationErrors = ref({})

  /**
   * Get a field value
   */
  const getField = (fieldName) => {
    const fieldData = batchComposable.getFieldValue(fieldName)
    return fieldData.value
  }

  /**
   * Get field with full details (value and source)
   */
  const getFieldDetails = (fieldName) => {
    return batchComposable.getFieldValue(fieldName)
  }

  /**
   * Set a field override
   */
  const setField = (fieldName, value) => {
    return batchComposable.setOverride(fieldName, value)
  }

  /**
   * Set field override (alias for setField)
   */
  const setOverride = (fieldName, value) => {
    return batchComposable.setOverride(fieldName, value)
  }

  /**
   * Clear field override
   */
  const clearField = (fieldName) => {
    batchComposable.clearOverride(fieldName)
  }

  /**
   * Clear all overrides
   */
  const clearAllFields = () => {
    batchComposable.clearAllOverrides()
  }

  /**
   * Get all inherited field values as object
   */
  const getInheritedFields = computed(() => {
    const result = {}
    Array.from(selectedFields.value).forEach((fieldName) => {
      result[fieldName] = batchComposable.getFieldValue(fieldName).value
    })
    return result
  })

  /**
   * Get all overridden field values
   */
  const getOverriddenFields = computed(() => {
    const result = {}
    batchComposable.getOverriddenFields.value.forEach((fieldName) => {
      result[fieldName] = batchComposable.getFieldValue(fieldName).value
    })
    return result
  })

  /**
   * Check if a field is using inherited value
   */
  const isInherited = (fieldName) => {
    const fieldData = batchComposable.getFieldValue(fieldName)
    return fieldData.source === 'inherited'
  }

  /**
   * Check if a field has override
   */
  const isOverridden = (fieldName) => {
    return batchComposable.getOverrides.value[fieldName] !== null && batchComposable.getOverrides.value[fieldName] !== undefined
  }

  /**
   * Check if a field is required for this mini-app
   */
  const isRequired = (fieldName) => {
    return requiredFields.value.has(fieldName)
  }

  /**
   * Check if a field can be inherited (inheritable from ProjectContext)
   */
  const canInherit = (fieldName) => {
    return isInheritable(fieldName)
  }

  /**
   * Get field source (inherited, override, or null)
   */
  const getFieldSource = (fieldName) => {
    return batchComposable.getFieldValue(fieldName).source
  }

  /**
   * Validate all required fields are filled
   * @returns {Object} { isValid: boolean, errors: object }
   */
  const validateRequired = () => {
    validationErrors.value = {}
    let isValid = true

    Array.from(requiredFields.value).forEach((fieldName) => {
      const value = getField(fieldName)
      if (value === null || value === undefined || value === '') {
        validationErrors.value[fieldName] = `${fieldName} is required`
        isValid = false
      }
    })

    isValidated.value = isValid
    return {
      isValid,
      errors: validationErrors.value
    }
  }

  /**
   * Get validation status
   */
  const getValidationStatus = computed(() => {
    return {
      isValidated: isValidated.value,
      isValid: Object.keys(validationErrors.value).length === 0,
      errors: validationErrors.value,
      requiredFieldsCount: requiredFields.value.size,
      filledRequiredFields: Array.from(requiredFields.value).filter((f) => {
        const value = getField(f)
        return value !== null && value !== undefined && value !== ''
      }).length
    }
  })

  /**
   * Get summary of all fields in mini-app
   */
  const getSummary = computed(() => {
    const summary = {
      miniAppName,
      projectId,
      totalFields: selectedFields.value.size,
      requiredFields: requiredFields.value.size,
      overriddenFields: batchComposable.getOverriddenFields.value.length,
      inheritedFields: Array.from(selectedFields.value).filter((f) => isInherited(f)).length,
      filledRequiredFields: Array.from(requiredFields.value).filter((f) => {
        const value = getField(f)
        return value !== null && value !== undefined && value !== ''
      }).length,
      fields: {}
    }

    Array.from(selectedFields.value).forEach((fieldName) => {
      summary.fields[fieldName] = {
        value: getField(fieldName),
        source: getFieldSource(fieldName),
        required: isRequired(fieldName),
        inheritable: canInherit(fieldName),
        overridden: isOverridden(fieldName)
      }
    })

    return summary
  })

  /**
   * Export all field data (useful for saving/API calls)
   * @param {boolean} includeNull - Include null/undefined values
   * @returns {Object} Field data object
   */
  const exportFieldData = (includeNull = false) => {
    const data = {}

    Array.from(selectedFields.value).forEach((fieldName) => {
      const value = getField(fieldName)
      if (includeNull || (value !== null && value !== undefined)) {
        data[fieldName] = value
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
      logger.debug(`[useMiniAppInheritedFields] Reset ${miniAppName} to inherited values`)
    }
  }

  /**
   * Initialize the composable
   */
  const initialize = async () => {
    await batchComposable.initialize()
    if (logger) {
      logger.debug(`[useMiniAppInheritedFields] Initialized ${miniAppName} mini-app`)
    }
  }

  return {
    // State
    selectedFields,
    requiredFields,
    isValidated,
    validationErrors,

    // Mini-app config
    miniAppName,
    miniAppConfig,

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
    canInherit,
    getFieldSource,

    // Validation
    validateRequired,

    // Data export
    exportFieldData,

    // Reset & initialization
    resetToInherited,
    initialize,

    // Underlying batch composable (for advanced use)
    _batchComposable: batchComposable
  }
}
