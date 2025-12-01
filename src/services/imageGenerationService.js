/**
 * Image Generation Service - Pluggable adapter pattern for multiple AI APIs
 *
 * Supports different image generation providers (Replicate, DALL-E, Adobe Firefly, etc.)
 * with a unified interface.
 */

/**
 * Base adapter class - all image providers must implement this interface
 */
export class ImageGenerationAdapter {
  async generateImages(prompt, options = {}) {
    throw new Error('generateImages() must be implemented by subclass')
  }

  async checkStatus(jobId) {
    throw new Error('checkStatus() must be implemented by subclass')
  }
}

/**
 * Replicate adapter - uses Replicate API via Netlify function proxy
 * Generates images using SDXL Turbo model
 */
export class ReplicateAdapter extends ImageGenerationAdapter {
  constructor(options = {}) {
    super()
    this.apiEndpoint = options.apiEndpoint || '/.netlify/functions/generate-design'
    this.timeout = options.timeout || 120000 // 120 seconds
  }

  async generateImages(prompt, options = {}) {
    const {
      numImages = 4,
      aspectRatio = '1:1',
      style = 'professional',
      seed = null
    } = options

    try {
      const response = await this._fetchWithTimeout(this.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          numImages,
          aspectRatio,
          style,
          seed
        })
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      return {
        success: true,
        images: data.images || [],
        metadata: {
          provider: 'replicate',
          model: 'sdxl-turbo',
          generatedAt: new Date().toISOString()
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        images: []
      }
    }
  }

  async checkStatus(jobId) {
    // For Replicate via serverless, status is determined by response completion
    // Extended polling would go here if needed
    return { completed: true }
  }

  async _fetchWithTimeout(url, options) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      return await fetch(url, {
        ...options,
        signal: controller.signal
      })
    } finally {
      clearTimeout(timeoutId)
    }
  }
}

/**
 * Mock adapter for development/testing - returns placeholder images
 */
export class MockAdapter extends ImageGenerationAdapter {
  async generateImages(prompt, options = {}) {
    const { numImages = 4 } = options

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    return {
      success: true,
      images: Array.from({ length: numImages }, (_, i) => ({
        url: `https://via.placeholder.com/512x512?text=Image+${i + 1}`,
        alt: `Generated image ${i + 1}`
      })),
      metadata: {
        provider: 'mock',
        model: 'placeholder',
        generatedAt: new Date().toISOString()
      }
    }
  }

  async checkStatus(jobId) {
    return { completed: true }
  }
}

/**
 * Image Generation Service - factory for creating providers
 */
export class ImageGenerationService {
  constructor(providerName = 'replicate', options = {}) {
    this.providerName = providerName
    this.providers = {
      replicate: () => new ReplicateAdapter(options),
      mock: () => new MockAdapter(options)
      // Future providers: dalle, firefly, etc.
    }

    if (!this.providers[providerName]) {
      throw new Error(
        `Unknown image provider: ${providerName}. Available: ${Object.keys(this.providers).join(', ')}`
      )
    }

    this.adapter = this.providers[providerName]()
  }

  async generateImages(prompt, options = {}) {
    return this.adapter.generateImages(prompt, options)
  }

  async checkStatus(jobId) {
    return this.adapter.checkStatus(jobId)
  }

  /**
   * Switch to a different provider at runtime
   */
  switchProvider(providerName, options = {}) {
    if (!this.providers[providerName]) {
      throw new Error(
        `Unknown image provider: ${providerName}. Available: ${Object.keys(this.providers).join(', ')}`
      )
    }
    this.providerName = providerName
    this.adapter = this.providers[providerName](options)
  }

  getAvailableProviders() {
    return Object.keys(this.providers)
  }
}

// Export singleton instance (can be overridden for testing)
export const imageGenerationService = new ImageGenerationService(
  import.meta.env.VITE_IMAGE_PROVIDER || 'replicate'
)
