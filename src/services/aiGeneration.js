/**
 * AI Generation Service - update for Netlify
 *
 * Unified service for all AI generation operations.
 * Handles template variable substitution, API calls, response parsing, and error handling.
 * Integrated with quota system for free/premium tier enforcement.
 *
 * NOTE: Usage tracking now happens server-side in grok-proxy function (with service role permissions)
 */

import { logger } from '@/utils/logger'
import { checkQuotaBeforeGeneration } from './aiQuotaService'
import { useAuthStore } from '@/stores/authStore'
import { useQuotaStore } from '@/stores/quotaStore'
import { useProjectStore } from '@/stores/projectStore'

/**
 * Generate AI content based on configuration
 * @param {Object} config - Task configuration with aiConfig and id
 * @param {Object} formData - Form data from user input
 * @param {Object} options - Optional parameters
 * @param {boolean} options.skipQuotaCheck - If true, skip quota validation (admin only)
 * @returns {Promise<string|object>} Generated content (string or parsed object)
 * @throws {Error} If quota exceeded or API call fails
 */
export async function generateAIContent(config, formData, options = {}) {
  if (!config.aiConfig) {
    throw new Error('No aiConfig found in task configuration')
  }

  // Check quota before generating (unless explicitly skipped)
  if (!options.skipQuotaCheck) {
    checkQuotaBeforeGeneration(config.id)
  }

  const { aiConfig } = config

  // Build prompt by replacing placeholders
  let prompt = buildPrompt(aiConfig.promptTemplate, formData, aiConfig.contextProvider)

  // Get user ID for server-side tracking
  const authStore = useAuthStore()
  const userId = authStore.user?.id

  // Call Grok API (usage tracking happens server-side)
  const { responseText } = await callGrokAPI(
    prompt,
    aiConfig,
    config.id,  // taskId for tracking
    userId       // for tracking
  )

  // Refresh quota after successful generation (UI will update reactively)
  try {
    const quotaStore = useQuotaStore()
    await quotaStore.fetchAIUsage()
  } catch (err) {
    logger.warn('[AIGeneration] Failed to refresh quota after generation')
    // Don't throw - quota refresh is non-critical
  }

  // Parse response if configured
  let output = responseText
  if (aiConfig.parseResponse) {
    output = aiConfig.parseResponse(responseText)
  }

  return output
}

/**
 * Get project context from Pinia store (SSOT Phase 5)
 * Replaces localStorage.getItem('marketing-app-data') pattern
 * @returns {Object} Project context with common AI placeholders
 */
function getProjectContext() {
  try {
    const projectStore = useProjectStore()
    const settings = projectStore.currentProjectSettings || {}

    return {
      // Common placeholders used by AI prompts
      app_description: settings.productDescription || settings.appDescription || settings.description || '',
      company_name: settings.productName || settings.name || projectStore.projectName || '',
      target_audience: settings.targetAudience || '',
      primary_goal: settings.primaryGoal || settings.mainGoal || settings.goals || '',
      product_name: settings.productName || projectStore.projectName || '',
      product_description: settings.productDescription || settings.description || ''
    }
  } catch (err) {
    logger.warn('[AIGeneration] Error getting project context from store:', err)
    return {}
  }
}

/**
 * Build prompt by replacing placeholders with form data and context
 * @param {string} template - Prompt template with {placeholder} syntax
 * @param {Object} formData - Form data from user input
 * @param {Function} contextProvider - Optional function to provide additional context
 * @returns {string} Final prompt with placeholders replaced
 */
function buildPrompt(template, formData, contextProvider) {
  let prompt = template

  // Process form data
  const processedFormData = processFormData(formData)

  // Replace placeholders from form data
  for (const [key, value] of Object.entries(processedFormData)) {
    const placeholder = `{${key}}`
    if (prompt.includes(placeholder)) {
      prompt = prompt.replace(new RegExp(placeholder, 'g'), value || '')
    }
  }

  // SSOT Phase 5: Inject project context from store (replaces localStorage)
  // This provides common values like app_description, company_name, etc.
  const projectContext = getProjectContext()
  for (const [key, value] of Object.entries(projectContext)) {
    const placeholder = `{${key}}`
    if (prompt.includes(placeholder) && value) {
      prompt = prompt.replace(new RegExp(placeholder, 'g'), value)
    }
  }

  // Replace placeholders from context provider (can override project context)
  if (contextProvider && typeof contextProvider === 'function') {
    try {
      const context = contextProvider()
      for (const [key, value] of Object.entries(context)) {
        const placeholder = `{${key}}`
        prompt = prompt.replace(new RegExp(placeholder, 'g'), value || '')
      }
    } catch (err) {
      logger.warn('[AIGeneration] Error calling contextProvider')
      // Continue anyway - context provider is optional
    }
  }

  return prompt
}

/**
 * Process form data, applying any necessary transformations
 * @param {Object} formData - Raw form data
 * @returns {Object} Processed form data
 */
function processFormData(formData) {
  const processed = { ...formData }

  // Convert platforms array to comma-separated list
  if (processed.platforms && Array.isArray(processed.platforms)) {
    const platformLabels = {
      twitter: 'X (Twitter)',
      linkedin: 'LinkedIn',
      instagram: 'Instagram',
      facebook: 'Facebook'
    }
    processed.platforms_list = processed.platforms
      .map(p => platformLabels[p] || p)
      .join(', ')
  }

  return processed
}

/**
 * Call Grok API through Netlify proxy
 * @param {string} prompt - The prompt to send
 * @param {Object} aiConfig - AI configuration (temperature, maxTokens)
 * @param {string} taskId - Task ID for quota tracking
 * @param {string} userId - User ID for quota tracking
 * @returns {Promise<Object>} Object with responseText, tokensInput, and tokensOutput
 * @throws {Error} If API call fails
 */
async function callGrokAPI(prompt, aiConfig, taskId, userId) {
  // Client-side timeout to prevent hanging requests (90 seconds to allow for Netlify's 60s timeout)
  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    logger.warn('[AIGeneration] Request timed out after 90 seconds')
    controller.abort()
  }, 90000)

  try {
    logger.debug('[AIGeneration] Calling Grok API with prompt length:', prompt.length)

    const messages = [
      {
        role: 'user',
        content: prompt
      }
    ]

    const response = await fetch('/.netlify/functions/grok-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'grok-3',
        messages,
        temperature: aiConfig.temperature || 0.8,
        max_tokens: aiConfig.maxTokens || 2000,
        taskId,      // Send for server-side tracking
        userId       // Send for server-side tracking
      }),
      signal: controller.signal
    })

    clearTimeout(timeoutId)
    logger.debug('[AIGeneration] API response status:', response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      logger.error('[AIGeneration] API error response', errorData)

      // Provide helpful error messages
      if (response.status === 500 && errorData.error?.includes('API key')) {
        throw new Error('Server configuration error: Grok API key is missing. Please contact the administrator.')
      } else if (response.status === 429) {
        throw new Error('Too many requests. Please wait a moment and try again.')
      } else if (response.status === 503) {
        throw new Error('Grok API is temporarily unavailable. Please try again later.')
      } else if (response.status === 504) {
        throw new Error('AI generation timed out. Please try again with a shorter prompt.')
      } else {
        throw new Error(errorData.error || `API error: ${response.status}`)
      }
    }

    const data = await response.json()
    logger.debug('[AIGeneration] API response received, parsing...')

    const responseText = data.choices?.[0]?.message?.content

    if (!responseText) {
      throw new Error('No content received from AI API')
    }

    // Extract token usage information
    const tokensInput = data.usage?.prompt_tokens || prompt.length / 4 // Rough estimate if not provided
    const tokensOutput = data.usage?.completion_tokens || responseText.length / 4 // Rough estimate if not provided

    logger.debug('[AIGeneration] Response text obtained, length:', responseText.length)
    logger.debug('[AIGeneration] Token usage', { input: tokensInput, output: tokensOutput })

    return {
      responseText,
      tokensInput,
      tokensOutput
    }
  } catch (err) {
    clearTimeout(timeoutId)

    // Handle abort error with user-friendly message
    if (err.name === 'AbortError') {
      logger.error('[AIGeneration] Request was aborted (timeout)')
      throw new Error('AI generation timed out. Please try again.')
    }

    logger.error('[AIGeneration] AI generation error', err)
    throw err
  }
}

/**
 * Validate parsed AI response
 * @param {any} parsed - Parsed response from AI
 * @param {Function} validateFn - Validation function from config
 * @returns {boolean|string} true if valid, error message if invalid
 */
export function validateParsedResponse(parsed, validateFn) {
  if (!validateFn || typeof validateFn !== 'function') {
    return true
  }

  try {
    const result = validateFn(parsed)
    return result === true ? true : (result || 'Validation failed')
  } catch (err) {
    return `Validation error: ${err.message}`
  }
}
