/**
 * GrokApiClient
 *
 * HTTP client for calling Grok AI API via Netlify Functions proxy.
 * Handles: request building, error handling, retry logic, logging.
 * Key security: Proxy prevents exposing API key to client.
 */

import { APIError, wrapError, logger as defaultLogger } from '@/shared/utils'
import { API_CONFIG, GROK_CONFIG, NETLIFY_FUNCTIONS } from '@/shared/config'

export class GrokApiClient {
  constructor(logger = defaultLogger) {
    this.logger = logger.child('GrokApiClient')
    this.baseUrl = NETLIFY_FUNCTIONS.GROK_PROXY
  }

  /**
   * Generate AI content
   */
  async generate(prompt, options = {}) {
    const config = {
      temperature: options.temperature ?? GROK_CONFIG.DEFAULT_TEMPERATURE,
      maxTokens: options.maxTokens ?? GROK_CONFIG.DEFAULT_MAX_TOKENS,
      ...options
    }

    try {
      this.logger.debug('Generating content', { promptLength: prompt.length, config })

      const response = await this._callWithRetry(
        '/generate',
        {
          prompt,
          temperature: config.temperature,
          maxTokens: config.maxTokens,
          model: GROK_CONFIG.MODEL
        },
        {
          taskId: options.taskId,
          userId: options.userId
        }
      )

      this.logger.info('Content generated', {
        responseLength: response.text?.length,
        tokensUsed: response.tokens
      })

      return {
        text: response.text,
        tokens: response.tokens,
        model: response.model
      }
    } catch (error) {
      const wrappedError = wrapError(error, APIError, {
        endpoint: 'generate',
        promptLength: prompt.length
      })
      this.logger.logError(wrappedError)
      throw wrappedError
    }
  }

  /**
   * Call API with retry logic
   */
  async _callWithRetry(endpoint, payload, context = {}) {
    let lastError

    for (let attempt = 0; attempt < API_CONFIG.RETRY_ATTEMPTS; attempt++) {
      try {
        if (attempt > 0) {
          const delayMs = API_CONFIG.RETRY_DELAY * Math.pow(API_CONFIG.BASE_BACKOFF, attempt - 1)
          this.logger.debug(`Retry attempt ${attempt} after ${delayMs}ms`)
          await new Promise(resolve => setTimeout(resolve, delayMs))
        }

        return await this._fetch(endpoint, payload, context)
      } catch (error) {
        lastError = error

        // Don't retry on client errors (4xx)
        if (error.statusCode >= 400 && error.statusCode < 500) {
          throw error
        }

        this.logger.warn(`Request failed, will retry`, {
          attempt,
          error: error.message
        })
      }
    }

    throw lastError
  }

  /**
   * Make HTTP request to Netlify Function
   */
  async _fetch(endpoint, payload, context = {}) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.REQUEST_TIMEOUT)

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requestType: endpoint,
          ...payload,
          context
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new APIError(
          errorData.message || `API error: ${response.status}`,
          {
            statusCode: response.status,
            code: `GROK_${response.status}`,
            context: { endpoint, ...errorData }
          }
        )
      }

      const data = await response.json()

      if (data.error) {
        throw new APIError(data.error.message || 'Grok API error', {
          code: 'GROK_ERROR',
          context: { endpoint, ...data.error }
        })
      }

      return data.response || data
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof APIError) throw error

      // Handle network errors
      if (error.name === 'AbortError') {
        throw new APIError('Request timeout', {
          code: 'REQUEST_TIMEOUT',
          statusCode: 408
        })
      }

      throw wrapError(error, APIError, {
        endpoint,
        context
      })
    }
  }

  /**
   * Check API health
   */
  async health() {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestType: 'health' })
      })

      return response.ok
    } catch {
      return false
    }
  }
}
