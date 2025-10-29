/**
 * AI Generation Service - update for NEt lify, 2x   
 *
 * Unified service for all AI generation operations.
 * Handles template variable substitution, API calls, response parsing, and error handling.
 */

/**
 * Generate AI content based on configuration
 * @param {Object} config - Task configuration with aiConfig
 * @param {Object} formData - Form data from user input
 * @returns {Promise<string|object>} Generated content (string or parsed object)
 */
export async function generateAIContent(config, formData) {
  if (!config.aiConfig) {
    throw new Error('No aiConfig found in task configuration')
  }

  const { aiConfig } = config

  // Build prompt by replacing placeholders
  let prompt = buildPrompt(aiConfig.promptTemplate, formData, aiConfig.contextProvider)

  // Call Grok API
  const responseText = await callGrokAPI(prompt, aiConfig)

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
 * @returns {Promise<string>} Response text from AI
 * @throws {Error} If API call fails
 */
async function callGrokAPI(prompt, aiConfig) {
  try {
    console.log('[AIGeneration] Calling Grok API with prompt length:', prompt.length)

    const response = await fetch('/.netlify/functions/grok-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'grok-2',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: aiConfig.temperature || 0.8,
        max_tokens: aiConfig.maxTokens || 2000
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

    console.log('[AIGeneration] Response text obtained, length:', responseText.length)
    return responseText
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
