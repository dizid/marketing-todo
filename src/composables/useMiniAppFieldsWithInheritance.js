/**
 * useMiniAppFieldsWithInheritance
 *
 * ⚠️ DEPRECATED - Phase 4 Consolidation
 * This composable is being consolidated into useFormFieldInheritance.
 * Currently this is the only one in production use (MiniAppShell.vue).
 *
 * Migration path:
 * OLD: import { useMiniAppFieldsWithInheritance } from '@/composables/useMiniAppFieldsWithInheritance'
 * NEW: import { useFormFieldInheritance } from '@/composables/useFormFieldInheritance'
 *
 * The new composable provides enhanced functionality:
 * - Better field mapping support
 * - Built-in validation
 * - Improved error handling
 * - Consistent API across all field inheritance use cases
 *
 * Migration will happen in 2-3 releases.
 *
 * ===== ORIGINAL DESCRIPTION =====
 * Composable for mini-apps to access fields with ProjectContext inheritance.
 * Provides inherited values as initial form data while allowing user overrides.
 *
 * Usage:
 * const { inheritedFields, getInitialFormData, isLoading, error } = useMiniAppFieldsWithInheritance(
 *   projectId,
 *   taskId,
 *   fieldMappings  // e.g., { 'audience_overview': 'targetAudience', 'product_title': 'productName' }
 * )
 *
 * const taskData = ref({
 *   formData: await getInitialFormData(currentFormData),
 *   aiOutput: null,
 *   savedItems: []
 * })
 */

import { ref, computed } from 'vue'
import { useFieldInheritanceBatch } from './useFieldInheritance'

export function useMiniAppFieldsWithInheritance(projectId, taskId, fieldMappings = {}) {
  const isLoading = ref(false)
  const error = ref('')

  // Get batch inheritance for all mapped canonical fields
  const canonicalFields = Object.values(fieldMappings).filter(Boolean)
  const { getAllFieldValues } = useFieldInheritanceBatch(projectId, taskId, canonicalFields)

  const inheritedFields = computed(() => {
    if (!getAllFieldValues.value) return {}

    const result = {}
    Object.entries(fieldMappings).forEach(([miniAppFieldId, canonicalFieldName]) => {
      const fieldData = getAllFieldValues.value[canonicalFieldName]
      if (fieldData && fieldData.value !== null && fieldData.value !== undefined) {
        result[miniAppFieldId] = {
          value: fieldData.value,
          source: fieldData.source, // 'override', 'inherited', or null
          isInherited: fieldData.source === 'inherited',
          isOverridden: fieldData.source === 'override'
        }
      }
    })
    return result
  })

  /**
   * Get initial form data, optionally merging with inherited values
   * Inherited values are used as defaults; current values take precedence
   *
   * @param {Object} currentFormData - Current form data from taskData
   * @param {boolean} useInheritedDefaults - Whether to use inherited values as defaults
   * @returns {Object} Merged form data
   */
  const getInitialFormData = (currentFormData = {}, useInheritedDefaults = true) => {
    if (!useInheritedDefaults) return currentFormData

    const merged = { ...currentFormData }

    Object.entries(inheritedFields.value).forEach(([fieldId, fieldInfo]) => {
      // Only use inherited value if field is not already set in currentFormData
      if (
        !(fieldId in merged) ||
        merged[fieldId] === null ||
        merged[fieldId] === undefined ||
        merged[fieldId] === ''
      ) {
        merged[fieldId] = fieldInfo.value
      }
    })

    return merged
  }

  /**
   * Get metadata about field inheritance for UI indicators
   * Returns info about which fields are inherited vs. overridden
   *
   * @returns {Object} Map of field IDs to inheritance metadata
   */
  const getInheritanceMetadata = () => {
    return Object.entries(inheritedFields.value).reduce((acc, [fieldId, fieldInfo]) => {
      acc[fieldId] = {
        isInherited: fieldInfo.isInherited,
        isOverridden: fieldInfo.isOverridden,
        source: fieldInfo.source,
        inheritedFrom: fieldInfo.source === 'inherited' ? 'ProjectContext' : null
      }
      return acc
    }, {})
  }

  return {
    inheritedFields,
    isLoading,
    error,
    getInitialFormData,
    getInheritanceMetadata
  }
}
