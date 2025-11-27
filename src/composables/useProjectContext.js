/**
 * useProjectContext
 *
 * Vue 3 composable for managing ProjectContext data in components.
 * Provides simple read/write access to project-level canonical fields.
 * Keeps form UI simple - hides repository complexity.
 *
 * Usage:
 * const { context, loading, error, loadContext, saveContext } = useProjectContext()
 * await loadContext(projectId, userId)
 * await saveContext(projectId, userId, { productName: 'My App', targetAudience: 'Developers' })
 */

import { ref, computed } from 'vue'
import { ProjectContextRepository } from '@/domain/repositories'
import { ProjectContext } from '@/domain/models'

export function useProjectContext() {
  let repository = null

  // Lazy load repository to avoid circular dependencies
  const getRepository = async () => {
    if (!repository) {
      const { supabase } = await import('@/utils/supabase')
      repository = new ProjectContextRepository(supabase)
    }
    return repository
  }

  const context = ref(null)
  const loading = ref(false)
  const error = ref('')

  const hasContext = computed(() => context.value !== null)

  /**
   * Load context from database
   * @param {string} projectId - Project UUID
   * @returns {Promise<ProjectContext|null>}
   */
  const loadContext = async (projectId) => {
    loading.value = true
    error.value = ''

    try {
      const repo = await getRepository()
      const loaded = await repo.getByProjectId(projectId)
      context.value = loaded
      return loaded
    } catch (err) {
      error.value = err.message || 'Failed to load project context'
      console.error('Error loading context:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Save context to database
   * Creates new context if doesn't exist, updates if it does
   * @param {string} projectId - Project UUID
   * @param {string} userId - User UUID
   * @param {Object} data - ProjectContext fields to save
   * @returns {Promise<ProjectContext|null>}
   */
  const saveContext = async (projectId, userId, data) => {
    loading.value = true
    error.value = ''

    try {
      const repo = await getRepository()

      // Create or get existing context
      let ctx = context.value || new ProjectContext(projectId, userId)

      // Update fields
      if (data) {
        ctx.updateFields(data)
      }

      // Save to database
      const saved = await repo.upsertByProjectId(projectId, userId, {
        productName: ctx.productName,
        productType: ctx.productType,
        productDescription: ctx.productDescription,
        targetAudience: ctx.targetAudience,
        primaryGoal: ctx.primaryGoal,
        targetTimeline: ctx.targetTimeline,
        marketingBudget: ctx.marketingBudget,
        teamSize: ctx.teamSize,
        currentStage: ctx.currentStage,
        techStack: ctx.techStack
      })

      context.value = saved
      return saved
    } catch (err) {
      error.value = err.message || 'Failed to save project context'
      console.error('Error saving context:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Get a specific field value from context
   * @param {string} fieldName - Field name (camelCase)
   * @returns {*}
   */
  const getField = (fieldName) => {
    if (!context.value) return null
    return context.value[fieldName]
  }

  /**
   * Update a single field in context
   * Doesn't save to database - just updates local state
   * @param {string} fieldName - Field name (camelCase)
   * @param {*} value - Field value
   */
  const setField = (fieldName, value) => {
    if (!context.value) {
      context.value = new ProjectContext()
    }
    context.value[fieldName] = value
  }

  /**
   * Clear context from memory
   */
  const clear = () => {
    context.value = null
    error.value = ''
  }

  return {
    context,
    loading,
    error,
    hasContext,
    loadContext,
    saveContext,
    getField,
    setField,
    clear
  }
}
