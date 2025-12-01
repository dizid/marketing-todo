<template>
  <div class="design-graphics-app">
    <!-- Header -->
    <div class="app-header">
      <h2 class="app-title">🎨 Design Graphics</h2>
      <p class="app-subtitle">
        AI-powered design generation. Create professional graphics in seconds.
      </p>
    </div>

    <!-- Step Indicator -->
    <div class="step-indicator">
      <div
        v-for="(step, idx) in steps"
        :key="idx"
        :class="['step', { active: currentStep === idx, completed: currentStep > idx }]"
      >
        <div class="step-number">
          <span v-if="currentStep > idx" class="step-check">✓</span>
          <span v-else>{{ idx + 1 }}</span>
        </div>
        <p class="step-label">{{ step }}</p>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="content-area">
      <!-- Step 1: Brief Form -->
      <BriefFormStep
        v-if="currentStep === 0"
        :isSubmitting="isGenerating"
        @submit="handleBriefSubmit"
      />

      <!-- Step 2: Image Generation -->
      <ImageGenerationStep
        v-if="currentStep === 1"
        :images="generatedImages"
        :selectedImageIndex="selectedImageIndex"
        :loading="isGenerating"
        :error="generationError"
        :progress="generationProgress"
        @select-image="selectImage"
        @continue="currentStep = 2"
        @regenerate="regenerateImages"
        @retry="regenerateImages"
      />

      <!-- Step 3: Export -->
      <ExportStep
        v-if="currentStep === 2"
        :selectedImage="selectedImage"
        :designPurpose="formData.designPurpose"
        :designStyle="formData.designStyle"
        :keyMessage="formData.keyMessage"
        @back="currentStep = 1"
        @new-design="resetWorkflow"
        @save-to-history="saveToHistory"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import BriefFormStep from './AIImageGeneration/BriefFormStep.vue'
import ImageGenerationStep from './AIImageGeneration/ImageGenerationStep.vue'
import ExportStep from './AIImageGeneration/ExportStep.vue'
import { useImageGeneration } from './AIImageGeneration/composables/useImageGeneration'
import { useDesignHistory } from './AIImageGeneration/composables/useDesignHistory'

// Composables
const {
  images: generatedImages,
  selectedImageIndex,
  selectedImage,
  loading: isGenerating,
  error: generationError,
  progress: generationProgress,
  generateImages,
  clearImages,
  clearError
} = useImageGeneration()

const { saveDesign } = useDesignHistory()

// State
const currentStep = ref(0)
const steps = ['Create Brief', 'Generate Images', 'Export & Save']

const formData = reactive({
  designPurpose: '',
  designStyle: '',
  keyMessage: ''
})

/**
 * Handle brief form submission - starts image generation
 */
const handleBriefSubmit = async (briefData) => {
  // Save form data
  Object.assign(formData, briefData)

  // Move to generation step
  currentStep.value = 1

  // Start image generation
  await generateImages(
    briefData.designPurpose,
    briefData.designStyle,
    briefData.keyMessage
  )
}

/**
 * Regenerate images with same parameters
 */
const regenerateImages = async () => {
  clearError()
  await generateImages(
    formData.designPurpose,
    formData.designStyle,
    formData.keyMessage
  )
}

/**
 * Select image from gallery
 */
const selectImage = (index) => {
  selectedImageIndex.value = index
}

/**
 * Save design to history and emit completion
 */
const saveToHistory = (designData) => {
  saveDesign({
    ...designData,
    timestamp: new Date().toISOString()
  })

  // Emit save event for parent component
  emit('save', {
    image: selectedImage.value,
    ...formData,
    timestamp: new Date().toISOString()
  })
}

/**
 * Reset to step 1 for new design
 */
const resetWorkflow = () => {
  currentStep.value = 0
  clearImages()
  clearError()
  Object.assign(formData, {
    designPurpose: '',
    designStyle: '',
    keyMessage: ''
  })
}

const emit = defineEmits(['save'])
</script>

<style scoped>
.design-graphics-app {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.app-header {
  text-align: center;
  margin-bottom: 3rem;
}

.app-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.app-subtitle {
  font-size: 1.05rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

.step-indicator {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 3rem;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  position: relative;
}

.step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 1.25rem;
  left: 50%;
  width: 100%;
  height: 2px;
  background: #e5e7eb;
  z-index: 0;
}

.step.completed:not(:last-child)::after {
  background: #10b981;
}

.step-number {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: #f3f4f6;
  border: 2px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #6b7280;
  font-size: 1rem;
  z-index: 1;
}

.step.active .step-number {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-color: #2563eb;
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.step.completed .step-number {
  background: #10b981;
  border-color: #10b981;
  color: white;
}

.step-check {
  font-size: 1.2rem;
}

.step-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  margin: 0;
  text-align: center;
}

.step.active .step-label {
  color: #3b82f6;
}

.content-area {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-height: 400px;
}

@media (max-width: 768px) {
  .design-graphics-app {
    padding: 1rem;
  }

  .app-header {
    margin-bottom: 2rem;
  }

  .app-title {
    font-size: 1.5rem;
  }

  .app-subtitle {
    font-size: 0.95rem;
  }

  .step-indicator {
    gap: 0.5rem;
  }

  .step-label {
    font-size: 0.75rem;
  }

  .step-number {
    width: 2rem;
    height: 2rem;
    font-size: 0.9rem;
  }

  .step:not(:last-child)::after {
    top: 1rem;
  }
}

@media (max-width: 640px) {
  .app-title {
    font-size: 1.25rem;
  }

  .step-indicator {
    margin-bottom: 2rem;
  }
}
</style>
