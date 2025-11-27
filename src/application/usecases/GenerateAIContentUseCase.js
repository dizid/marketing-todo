/**
 * GenerateAIContentUseCase
 *
 * Orchestrates the AI content generation workflow.
 * Handles: quota verification, prompt building, API calls, response parsing, usage tracking.
 * Security: Server-side quota check prevents abuse.
 */

import { QuotaExceededError, BusinessLogicError, wrapError, logger as defaultLogger } from '@/shared/utils'

export class GenerateAIContentUseCase {
  /**
   * @param {GrokApiClient} grokApiClient - AI API client
   * @param {QuotaRepository} quotaRepository - For checking/tracking quota
   * @param {TaskRepository} taskRepository - For saving AI outputs
   * @param {Logger} logger - Logging utility
   */
  constructor(grokApiClient, quotaRepository, taskRepository, logger = defaultLogger) {
    this.grokApiClient = grokApiClient
    this.quotaRepository = quotaRepository
    this.taskRepository = taskRepository
    this.logger = logger.child('GenerateAIContentUseCase')
  }

  /**
   * Execute AI content generation
   *
   * @param {string} userId - User UUID
   * @param {string} projectId - Project UUID
   * @param {string} taskId - Task ID (e.g., 'sales-1')
   * @param {Object} formData - Form input from user
   * @param {Object} taskConfig - Task configuration with aiConfig
   * @returns {Promise<{text: string, tokens: number}>}
   */
  async execute(userId, projectId, taskId, formData, taskConfig) {
    try {
      this.logger.debug('Starting AI generation', { userId, projectId, taskId })

      // 1. VERIFY QUOTA (SERVER-SIDE)
      this.logger.debug('Checking quota...')
      const quotaModel = await this.quotaRepository.createQuotaModel(userId)

      if (!quotaModel.canGenerate()) {
        const message = quotaModel.getDisplayMessage()
        throw new QuotaExceededError(message, {
          code: 'INSUFFICIENT_QUOTA',
          context: {
            tier: quotaModel.tier,
            remaining: quotaModel.getRemaining(),
            limit: quotaModel.getLimit()
          }
        })
      }

      // 2. BUILD PROMPT
      this.logger.debug('Building prompt...')
      const aiConfig = taskConfig.aiConfig
      if (!aiConfig) {
        throw new BusinessLogicError('Task does not support AI generation', {
          code: 'NO_AI_CONFIG',
          context: { taskId }
        })
      }

      const prompt = this._buildPrompt(aiConfig.promptTemplate, formData, aiConfig.contextProvider)
      this.logger.debug('Prompt built', { promptLength: prompt.length })

      // 3. CALL GROK API (with userId context for server-side verification)
      this.logger.debug('Calling Grok API...')
      const response = await this.grokApiClient.generate(prompt, {
        temperature: aiConfig.temperature || 0.8,
        maxTokens: aiConfig.maxTokens || 1500,
        taskId,
        userId // Server uses this to verify quota
      })

      this.logger.info('AI generation successful', {
        taskId,
        responseLength: response.text.length,
        tokens: response.tokens
      })

      // 4. PARSE & VALIDATE RESPONSE
      let parsedOutput = response.text
      if (aiConfig.parseResponse && typeof aiConfig.parseResponse === 'function') {
        try {
          parsedOutput = aiConfig.parseResponse(response.text)
        } catch (parseError) {
          this.logger.warn('Response parsing failed, using raw output', { error: parseError.message })
        }
      }

      // 5. SAVE AI OUTPUT TO TASK
      await this.taskRepository.addAIOutput(projectId, userId, taskId, parsedOutput)
      this.logger.info('AI output saved', { taskId })

      // 6. TRACK USAGE (server tracks in Netlify function, client confirms)
      // Note: Actual tracking happens server-side in grok-proxy function
      // This is for client-side logging/UI updates
      this.logger.info('Usage tracking recorded', {
        userId,
        taskId,
        tokens: response.tokens
      })

      return {
        text: parsedOutput,
        tokens: response.tokens,
        model: response.model
      }
    } catch (error) {
      this.logger.logError(error)
      throw error
    }
  }

  /**
   * Build prompt from template and form data
   * Template uses {fieldName} syntax for substitution
   *
   * @private
   */
  _buildPrompt(template, formData, contextProvider) {
    try {
      let prompt = template

      // Substitute {fieldName} with form data values
      Object.entries(formData).forEach(([key, value]) => {
        const placeholder = `{${key}}`
        prompt = prompt.replaceAll(placeholder, value || '')
      })

      // Add additional context if provider function exists
      if (contextProvider && typeof contextProvider === 'function') {
        try {
          const context = contextProvider(formData)
          Object.entries(context).forEach(([key, value]) => {
            const placeholder = `{${key}}`
            prompt = prompt.replaceAll(placeholder, value || '')
          })
        } catch (contextError) {
          this.logger.warn('Context provider failed', { error: contextError.message })
          // Continue without context
        }
      }

      return prompt
    } catch (error) {
      const wrappedError = wrapError(error, BusinessLogicError, {
        operation: 'buildPrompt',
        templateLength: template.length
      })
      this.logger.logError(wrappedError)
      throw wrappedError
    }
  }
}
