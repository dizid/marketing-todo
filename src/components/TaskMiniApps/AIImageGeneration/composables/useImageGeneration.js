/**
 * useImageGeneration - Composable for managing image generation workflow
 *
 * Handles:
 * - Image generation via pluggable service
 * - Parallel brief + image generation
 * - Loading states and error handling
 * - Image gallery management
 */

import { ref, computed, reactive } from 'vue'
import { imageGenerationService } from '../../../../services/imageGenerationService'
import { getPromptTemplate } from '../../../../configs/designGraphicsPrompts'

export function useImageGeneration() {
  // State
  const images = ref([])
  const selectedImageIndex = ref(0)
  const loading = ref(false)
  const error = ref(null)
  const progress = reactive({
    isGenerating: false,
    currentStep: 0,
    totalSteps: 4,
    message: ''
  })

  /**
   * Generate images based on brief parameters
   */
  const generateImages = async (designPurpose, designStyle, keyMessage) => {
    loading.value = true
    error.value = null
    images.value = []
    selectedImageIndex.value = 0

    try {
      progress.isGenerating = true
      progress.currentStep = 1
      progress.totalSteps = 4
      progress.message = 'Preparing design specifications...'

      // Build prompt from template
      const prompt = getPromptTemplate(designPurpose, designStyle, keyMessage)

      progress.currentStep = 2
      progress.message = 'Generating image variations (this takes 10-15 seconds)...'

      // Call image generation service
      const result = await imageGenerationService.generateImages(prompt, {
        numImages: 4,
        aspectRatio: getAspectRatioForPurpose(designPurpose),
        style: designStyle
      })

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate images')
      }

      progress.currentStep = 3
      progress.message = 'Processing results...'

      // Transform results
      images.value = result.images.map((img, idx) => ({
        url: img.url || img,
        alt: `Generated design ${idx + 1}`,
        id: `img-${idx}-${Date.now()}`
      }))

      progress.currentStep = 4
      progress.message = 'Ready to export!'

      return {
        success: true,
        images: images.value,
        metadata: result.metadata
      }
    } catch (err) {
      error.value = err.message
      progress.message = 'Generation failed'

      return {
        success: false,
        error: err.message,
        images: []
      }
    } finally {
      loading.value = false
      progress.isGenerating = false
    }
  }

  /**
   * Regenerate new variations while keeping settings
   */
  const regenerateVariations = async (designPurpose, designStyle, keyMessage) => {
    // Reset for new generation
    return generateImages(designPurpose, designStyle, keyMessage)
  }

  /**
   * Get aspect ratio for design purpose
   */
  const getAspectRatioForPurpose = (purpose) => {
    const ratios = {
      'social-banner': '1:1',
      'website-hero': '16:9',
      'infographic': '3:2',
      'ad-creative': '16:9',
      'product-screenshot': '1:1',
      'thumbnail': '16:9'
    }
    return ratios[purpose] || '1:1'
  }

  /**
   * Select an image from the gallery
   */
  const selectImage = (index) => {
    if (index >= 0 && index < images.value.length) {
      selectedImageIndex.value = index
    }
  }

  /**
   * Get currently selected image
   */
  const selectedImage = computed(() => {
    return images.value[selectedImageIndex.value] || null
  })

  /**
   * Clear all images
   */
  const clearImages = () => {
    images.value = []
    selectedImageIndex.value = 0
    error.value = null
  }

  /**
   * Set custom error message
   */
  const setError = (message) => {
    error.value = message
  }

  /**
   * Clear error
   */
  const clearError = () => {
    error.value = null
  }

  return {
    // State
    images,
    selectedImageIndex,
    selectedImage,
    loading,
    error,
    progress,

    // Methods
    generateImages,
    regenerateVariations,
    selectImage,
    clearImages,
    setError,
    clearError
  }
}
