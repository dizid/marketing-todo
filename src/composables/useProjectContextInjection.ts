/**
 * useProjectContextInjection Composable
 * Injects ProjectContext canonical values into task forms
 * Manages field inheritance and overrides
 *
 * Phase 1D: Build useProjectContextInjection composable
 */

import { computed, ref, reactive, watch } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import type { Ref, ComputedRef } from 'vue'

export interface InheritanceInfo {
  source: 'inherited' | 'override' | 'default'
  sourceTask: string
  sourceValue: any
  canonicalField: string
}

export interface EnhancedField {
  id: string
  value: any
  inheritanceInfo?: InheritanceInfo
  isOverridden: boolean
}

export interface FormFieldMapping {
  taskFieldId: string
  canonicalField: string
  description?: string
}

/**
 * Main composable function
 * @param taskId - The task ID (e.g., 'sales-2')
 * @param formConfig - Array of form field definitions from task config
 * @param fieldMappings - Array mapping task fields to canonical fields
 * @returns Object with enhanced form with inheritance
 */
export function useProjectContextInjection(
  taskId: string,
  formConfig: any[] = [],
  fieldMappings: FormFieldMapping[] = []
) {
  // Stores
  const projectStore = useProjectStore()

  // Local state for field overrides
  const fieldOverrides = reactive<Record<string, any>>({})
  const overriddenFields = reactive<Set<string>>(new Set())

  /**
   * Get the canonical ProjectContext value for a field
   * Searches through projectStore.projectData for the canonical value
   */
  const getCanonicalValue = (canonicalField: string): any => {
    try {
      const path = canonicalField.split('.')
      let value: any = projectStore.projectData

      for (const key of path) {
        if (value && typeof value === 'object') {
          value = value[key]
        } else {
          return undefined
        }
      }

      return value
    } catch (e) {
      console.error(`Error getting canonical value for ${canonicalField}:`, e)
      return undefined
    }
  }

  /**
   * Find the mapping for a given task field ID
   */
  const getFieldMapping = (fieldId: string): FormFieldMapping | undefined => {
    return fieldMappings.find((m) => m.taskFieldId === fieldId)
  }

  /**
   * Build inheritance info for a field
   */
  const buildInheritanceInfo = (
    fieldId: string,
    currentValue: any
  ): InheritanceInfo | undefined => {
    const mapping = getFieldMapping(fieldId)
    if (!mapping) return undefined

    const canonicalValue = getCanonicalValue(mapping.canonicalField)
    const isOverridden = overriddenFields.has(fieldId)

    if (isOverridden) {
      return {
        source: 'override',
        sourceTask: taskId,
        sourceValue: fieldOverrides[fieldId],
        canonicalField: mapping.canonicalField
      }
    }

    if (canonicalValue !== undefined) {
      return {
        source: 'inherited',
        sourceTask: 'Project Context',
        sourceValue: canonicalValue,
        canonicalField: mapping.canonicalField
      }
    }

    return undefined
  }

  /**
   * Get enhanced form with inheritance information
   */
  const getEnhancedForm = (): EnhancedField[] => {
    return formConfig.map((field) => ({
      id: field.id,
      value: overriddenFields.has(field.id)
        ? fieldOverrides[field.id]
        : getCanonicalValue(getFieldMapping(field.id)?.canonicalField || ''),
      inheritanceInfo: buildInheritanceInfo(field.id, field.value),
      isOverridden: overriddenFields.has(field.id)
    }))
  }

  /**
   * Get computed value for a field (inherited or overridden)
   */
  const getFieldValue = (fieldId: string): ComputedRef<any> => {
    return computed(() => {
      if (overriddenFields.has(fieldId)) {
        return fieldOverrides[fieldId]
      }

      const mapping = getFieldMapping(fieldId)
      if (!mapping) return undefined

      return getCanonicalValue(mapping.canonicalField)
    })
  }

  /**
   * Override a field value (create task-specific variation)
   */
  const toggleOverride = (fieldId: string, value: any): void => {
    if (overriddenFields.has(fieldId)) {
      // Remove override
      overriddenFields.delete(fieldId)
      delete fieldOverrides[fieldId]
    } else {
      // Create override
      overriddenFields.add(fieldId)
      fieldOverrides[fieldId] = value
    }
  }

  /**
   * Sync field back to inherited value (remove override)
   */
  const syncFromSource = (fieldId: string): void => {
    if (overriddenFields.has(fieldId)) {
      overriddenFields.delete(fieldId)
      delete fieldOverrides[fieldId]
    }
  }

  /**
   * Sync all overrides to ProjectContext (update canonical source)
   * This is used for bidirectional sync when user updates inherited field
   */
  const syncToProjectContext = async (fieldId: string, value: any): Promise<void> => {
    const mapping = getFieldMapping(fieldId)
    if (!mapping) return

    try {
      // Update the canonical value in ProjectContext
      const path = mapping.canonicalField.split('.')
      const lastKey = path.pop()
      let target: any = projectStore.projectData

      for (const key of path) {
        if (!target[key]) target[key] = {}
        target = target[key]
      }

      if (lastKey) {
        target[lastKey] = value
      }

      // Persist to store
      projectStore.updateProjectData(projectStore.projectData)
    } catch (e) {
      console.error(`Error syncing to ProjectContext for ${fieldId}:`, e)
    }
  }

  /**
   * Get all field overrides for this task
   * Useful for debugging and understanding what's been customized
   */
  const getOverrides = (): Record<string, any> => {
    const overrides: Record<string, any> = {}
    for (const fieldId of overriddenFields) {
      overrides[fieldId] = fieldOverrides[fieldId]
    }
    return overrides
  }

  /**
   * Clear all overrides for this task
   */
  const clearAllOverrides = (): void => {
    overriddenFields.clear()
    Object.keys(fieldOverrides).forEach((key) => delete fieldOverrides[key])
  }

  /**
   * Load overrides from task_field_overrides table
   * Restores saved state when user reopens task
   */
  const loadPersistedOverrides = async (taskId: string): Promise<void> => {
    try {
      // This would call an API to fetch saved overrides from database
      // For now, we use localStorage as fallback
      const key = `task-overrides-${taskId}`
      const stored = localStorage.getItem(key)

      if (stored) {
        const overrides = JSON.parse(stored)
        for (const [fieldId, value] of Object.entries(overrides)) {
          fieldOverrides[fieldId] = value
          overriddenFields.add(fieldId)
        }
      }
    } catch (e) {
      console.error(`Error loading persisted overrides for ${taskId}:`, e)
    }
  }

  /**
   * Save overrides to persistent storage
   */
  const persistOverrides = async (taskId: string): Promise<void> => {
    try {
      const key = `task-overrides-${taskId}`
      const overrides = getOverrides()
      localStorage.setItem(key, JSON.stringify(overrides))
    } catch (e) {
      console.error(`Error persisting overrides for ${taskId}:`, e)
    }
  }

  // Auto-load persisted overrides when composable is created
  watch(
    () => projectStore.projectData,
    () => {
      loadPersistedOverrides(taskId)
    },
    { immediate: true }
  )

  return {
    // State
    fieldOverrides,
    overriddenFields,

    // Queries
    getCanonicalValue,
    getFieldMapping,
    buildInheritanceInfo,
    getEnhancedForm,
    getFieldValue,
    getOverrides,

    // Mutations
    toggleOverride,
    syncFromSource,
    syncToProjectContext,
    clearAllOverrides,

    // Persistence
    loadPersistedOverrides,
    persistOverrides
  }
}

/**
 * Hook for use in Vue components
 * Provides composable with automatic ProjectContext binding
 *
 * Usage in component:
 * ```vue
 * <script setup>
 * import { useProjectContextInjection } from '@/composables/useProjectContextInjection'
 * import { offerBuilderTask } from '@/configs/offerBuilder.config'
 * import { FIELD_INHERITANCE_MAP } from '@/config/FIELD_INHERITANCE_MAP.json'
 *
 * const { getFieldValue, toggleOverride } = useProjectContextInjection(
 *   offerBuilderTask.id,
 *   offerBuilderTask.form,
 *   FIELD_INHERITANCE_MAP.task_field_mappings['offer-builder'].mappings
 * )
 * </script>
 * ```
 */
export default useProjectContextInjection
