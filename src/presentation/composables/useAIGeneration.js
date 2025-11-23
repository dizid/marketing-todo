/**
 * useAIGeneration Composable
 *
 * Provides AI generation interface for components.
 * Wraps GenerateAIContentUseCase with error handling and UI state.
 */

import { ref, computed } from 'vue'
import { GenerateAIContentUseCase } from '@/application/usecases'
import { GrokApiClient } from '@/infrastructure/api'
import { TaskRepository, QuotaRepository } from '@/domain/repositories'
import { getSupabaseClient } from '@/utils/supabase'
import { logger, QuotaExceededError, APIError } from '@/shared/utils'

const childLogger = logger.child('useAIGeneration')

export function useAIGeneration() {
  // Initialize dependencies
  const supabaseClient = getSupabaseClient()
  const grokApiClient = new GrokApiClient(childLogger)
  const quotaRepository = new QuotaRepository(supabaseClient, childLogger)
  const taskRepository = new TaskRepository(supabaseClient, childLogger)

  const generateUseCase = new GenerateAIContentUseCase(
    grokApiClient,
    quotaRepository,
    taskRepository,
    childLogger
  )

  // STATE
  const isGenerating = ref(false)
  const error = ref(null)
  const generatedOutput = ref(null)

  // COMPUTED
  const hasError = computed(() => !!error.value)
  const isQuotaError = computed(() => error.value instanceof QuotaExceededError)
  const isNetworkError = computed(() => error.value instanceof APIError)

  /**
   * Generate AI content
   */
  async function generate(userId, projectId, taskId, formData, taskConfig) {
    isGenerating.value = true
    error.value = null
    generatedOutput.value = null

    try {
      childLogger.debug('Starting AI generation', { userId, projectId, taskId })

      const result = await generateUseCase.execute(
        userId,
        projectId,
        taskId,
        formData,
        taskConfig
      )

      generatedOutput.value = result.text

      childLogger.info('AI generation completed', {
        taskId,
        outputLength: result.text.length,
        tokens: result.tokens
      })

      return result
    } catch (err) {
      error.value = err

      // Log with appropriate level
      if (err instanceof QuotaExceededError) {
        childLogger.warn('Quota exceeded', { taskId })
      } else if (err instanceof APIError) {
        childLogger.error('API error', { taskId, error: err.message })
      } else {
        childLogger.logError(err)
      }

      throw err
    } finally {
      isGenerating.value = false
    }
  }

  /**
   * Clear error state
   */
  function clearError() {
    error.value = null
  }

  /**
   * Clear output
   */
  function clearOutput() {
    generatedOutput.value = null
  }

  /**
   * Reset to initial state
   */
  function reset() {
    isGenerating.value = false
    error.value = null
    generatedOutput.value = null
  }

  return {
    // State
    isGenerating,
    error,
    generatedOutput,

    // Computed
    hasError,
    isQuotaError,
    isNetworkError,

    // Actions
    generate,
    clearError,
    clearOutput,
    reset
  }
}
