/**
 * AI Generation Service - update for Netlify
 *
 * Unified service for all AI generation operations.
 * Handles template variable substitution, API calls, response parsing, and error handling.
 * Integrated with quota system for free/premium tier enforcement.
 *
 * NOTE: Usage tracking now happens server-side in grok-proxy function (with service role permissions)
 */

import { checkQuotaBeforeGeneration } from './aiQuotaService'
import { useAuthStore } from '@/stores/authStore'

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

  // Parse response if configured
  let output = responseText
  if (aiConfig.parseResponse) {
    output = aiConfig.parseResponse(responseText)
  }

  return output
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

  // Replace placeholders from context provider
  if (contextProvider && typeof contextProvider === 'function') {
    try {
      const context = contextProvider()
      for (const [key, value] of Object.entries(context)) {
        const placeholder = `{${key}}`
        prompt = prompt.replace(new RegExp(placeholder, 'g'), value || '')
      }
    } catch (err) {
      console.warn('[AIGeneration] Error calling contextProvider:', err)
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
  try {
    console.log('[AIGeneration] Calling Grok API with prompt length:', prompt.length)

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
        model: 'grok-2',
        messages,
        temperature: aiConfig.temperature || 0.8,
        max_tokens: aiConfig.maxTokens || 2000,
        taskId,      // Send for server-side tracking
        userId       // Send for server-side tracking
      })
    })

    console.log('[AIGeneration] API response status:', response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('[AIGeneration] API error response:', errorData)

      // Provide helpful error messages
      if (response.status === 500 && errorData.error?.includes('API key')) {
        throw new Error('Server configuration error: Grok API key is missing. Please contact the administrator.')
      } else if (response.status === 429) {
        throw new Error('Too many requests. Please wait a moment and try again.')
      } else if (response.status === 503) {
        throw new Error('Grok API is temporarily unavailable. Please try again later.')
      } else {
        throw new Error(errorData.error || `API error: ${response.status}`)
      }
    }

    const data = await response.json()
    console.log('[AIGeneration] API response received, parsing...')

    const responseText = data.choices?.[0]?.message?.content

    if (!responseText) {
      throw new Error('No content received from AI API')
    }

    // Extract token usage information
    const tokensInput = data.usage?.prompt_tokens || prompt.length / 4 // Rough estimate if not provided
    const tokensOutput = data.usage?.completion_tokens || responseText.length / 4 // Rough estimate if not provided

    console.log('[AIGeneration] Response text obtained, length:', responseText.length)
    console.log(`[AIGeneration] Token usage - Input: ${tokensInput}, Output: ${tokensOutput}`)

    return {
      responseText,
      tokensInput,
      tokensOutput
    }
  } catch (err) {
    console.error('[AIGeneration] AI generation error:', err)
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
