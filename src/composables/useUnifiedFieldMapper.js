/**
 * Composable: useUnifiedFieldMapper
 *
 * Vue composable wrapper around UnifiedFieldMapperService
 * Provides reactive field mapping and context building for mini-apps
 *
 * Usage:
 * const { buildContext, getResolvedFields } = useUnifiedFieldMapper(projectId, taskId)
 * const context = await buildContext(formData, fieldMappings)
 */

import { ref, computed } from 'vue'
import { unifiedFieldMapperService } from '@/services/unifiedFieldMapperService.js'

export function useUnifiedFieldMapper(projectId, taskId) {
  const isLoading = ref(false)
  const error = ref(null)
  const cachedContext = ref(null)

  /**
   * Build complete context for a task
   * Resolves ProjectContext + overrides + formData into unified object
   */
  const buildContext = async (formData = {}, fieldMappings = {}, options = {}) => {
    isLoading.value = true
    error.value = null

    try {
      const context = await unifiedFieldMapperService.buildContextForTask(
        projectId,
        taskId,
        formData,
        fieldMappings,
        { useCache: true, ...options }
      )

      cachedContext.value = context
      return context
    } catch (err) {
      error.value = err.message
      console.error('[useUnifiedFieldMapper] Error building context:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Get resolved values for specific canonical fields
   * Shows source of each value (override, inherited, default)
   */
  const getResolvedFields = async (fieldNames) => {
    isLoading.value = true
    error.value = null

    try {
      const resolved = await unifiedFieldMapperService.getResolvedFields(
        projectId,
        taskId,
        fieldNames
      )
      return resolved
    } catch (err) {
      error.value = err.message
      console.error('[useUnifiedFieldMapper] Error getting resolved fields:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Generate a context provider function for AI configs
   */
  const generateContextProvider = (desiredFields = []) => {
    return () =>
      unifiedFieldMapperService.generateContextProvider(projectId, taskId, desiredFields)()
  }

  /**
   * Clear cache for this task
   */
  const clearCache = () => {
    unifiedFieldMapperService.clearCache(projectId, taskId)
    cachedContext.value = null
  }

  /**
   * Get all available transformations
   */
  const availableTransformations = computed(() => {
    return unifiedFieldMapperService.getAvailableTransformations()
  })

  return {
    // State
    isLoading,
    error,
    cachedContext,

    // Methods
    buildContext,
    getResolvedFields,
    generateContextProvider,
    clearCache,

    // Computed
    availableTransformations
  }
}
