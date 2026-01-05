<template>
  <div class="generation-step">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <GenerationProgress :progress="progress" />
    </div>

    <!-- Error State -->
    <div v-else-if="error && !images.length" class="error-container">
      <div class="error-box">
        <div class="error-icon">⚠️</div>
        <h3 class="error-title">Generation Failed</h3>
        <p class="error-message">{{ error }}</p>
        <button @click="emit('retry')" class="btn-retry">
          Try Again
        </button>
      </div>
    </div>

    <!-- Success State with Images -->
    <div v-else-if="images.length" class="success-container">
      <div class="header">
        <h2 class="title">Your AI Designs</h2>
        <p class="subtitle">
          {{ images.length }} variations generated. Choose your favorite to export.
        </p>
      </div>

      <!-- Image Gallery -->
      <ImageGallery
        :images="images"
        :selectedIndex="selectedImageIndex"
        @select="emit('select-image', $event)"
      />

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button @click="emit('regenerate')" class="btn-secondary">
          Generate New Variations
        </button>
        <button @click="emit('continue')" class="btn-primary">
          Continue to Export
        </button>
      </div>

      <!-- Error Banner (if retry failed) -->
      <div v-if="error" class="error-banner">
        <p>{{ error }}</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-container">
      <p class="empty-message">No images generated yet</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import GenerationProgress from './components/GenerationProgress.vue'
import ImageGallery from './components/ImageGallery.vue'

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  },
  selectedImageIndex: {
    type: Number,
    default: 0
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  },
  progress: {
    type: Object,
    default: () => ({
      isGenerating: false,
      currentStep: 0,
      totalSteps: 4,
      message: ''
    })
  }
})

const emit = defineEmits(['select-image', 'continue', 'regenerate', 'retry'])
</script>

<style scoped>
.generation-step {
  width: 100%;
  padding: 2rem;
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.loading-container,
.error-container,
.success-container,
.empty-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.loading-container {
  align-items: center;
  justify-content: center;
  min-height: 600px;
}

.error-container {
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.error-box {
  text-align: center;
  padding: 3rem 2rem;
  background: #fef2f2;
  border: 2px solid #fecaca;
  border-radius: 0.75rem;
  max-width: 400px;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #991b1b;
  margin: 0 0 0.5rem 0;
}

.error-message {
  color: #7f1d1d;
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
}

.btn-retry {
  padding: 0.75rem 1.5rem;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-retry:hover {
  background: #b91c1c;
}

.success-container {
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.subtitle {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn-secondary {
  background: white;
  color: #3b82f6;
  border: 2px solid #3b82f6;
}

.btn-secondary:hover {
  background: #f0f9ff;
}

.error-banner {
  margin-top: 1rem;
  padding: 1rem;
  background: #fef2f2;
  border-left: 4px solid #dc2626;
  color: #991b1b;
  border-radius: 0.25rem;
}

.error-banner p {
  margin: 0;
  font-size: 0.9rem;
}

.empty-container {
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.empty-message {
  color: #9ca3af;
  font-size: 1rem;
  margin: 0;
}
</style>
