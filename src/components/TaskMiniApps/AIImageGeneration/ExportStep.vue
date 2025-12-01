<template>
  <div class="export-step">
    <div class="export-container">
      <h2 class="export-title">Export Your Design</h2>
      <p class="export-subtitle">Download your design or polish it in Canva</p>

      <!-- Image Preview -->
      <div class="preview-section">
        <img
          :src="selectedImage.url"
          :alt="selectedImage.alt"
          class="preview-image"
        />
      </div>

      <!-- Export Options -->
      <div class="export-options">
        <!-- Download Button -->
        <div class="export-option">
          <div class="option-icon">⬇️</div>
          <div class="option-content">
            <h3 class="option-title">Download Image</h3>
            <p class="option-description">
              Save the design as PNG and use it immediately
            </p>
          </div>
          <button @click="handleDownload" class="btn-export-primary">
            Download PNG
          </button>
        </div>

        <!-- Canva Polish -->
        <div class="export-option">
          <div class="option-icon">✨</div>
          <div class="option-content">
            <h3 class="option-title">Polish in Canva</h3>
            <p class="option-description">
              Open this image in Canva to add text, logos, or fine-tune colors
            </p>
          </div>
          <button @click="handleOpenInCanva" class="btn-export-secondary">
            Open in Canva
          </button>
        </div>

        <!-- Save to History -->
        <div class="export-option">
          <div class="option-icon">💾</div>
          <div class="option-content">
            <h3 class="option-title">Save to Library</h3>
            <p class="option-description">
              Save this design to your generation history for quick access later
            </p>
          </div>
          <button @click="handleSaveToHistory" class="btn-export-secondary">
            Save Design
          </button>
        </div>
      </div>

      <!-- Design Details -->
      <div class="design-details">
        <div class="details-grid">
          <div class="detail-item">
            <span class="detail-label">Design Type:</span>
            <span class="detail-value">{{ purposeName }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Style:</span>
            <span class="detail-value">{{ styleName }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Message:</span>
            <span class="detail-value">{{ keyMessage }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Provider:</span>
            <span class="detail-value">AI Generated (Replicate)</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="footer-buttons">
        <button @click="emit('back')" class="btn-back">
          ← Back to Designs
        </button>
        <button @click="emit('new-design')" class="btn-new">
          Create New Design
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { designPurposes, designStyles } from '../../../configs/designGraphics.config'

const props = defineProps({
  selectedImage: {
    type: Object,
    required: true
  },
  designPurpose: {
    type: String,
    required: true
  },
  designStyle: {
    type: String,
    required: true
  },
  keyMessage: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['back', 'new-design', 'save-to-history'])

const purposeName = computed(() => {
  return designPurposes.find(p => p.id === props.designPurpose)?.name || props.designPurpose
})

const styleName = computed(() => {
  return designStyles.find(s => s.id === props.designStyle)?.name || props.designStyle
})

const handleDownload = () => {
  const link = document.createElement('a')
  link.href = props.selectedImage.url
  link.download = `design-${Date.now()}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const handleOpenInCanva = () => {
  // Open image in Canva with context
  const canvaUrl = `https://www.canva.com/design/DAGNewDesign/edit?utm_content=DAGNewDesign`
  window.open(canvaUrl, '_blank')

  // Note: In production, you'd use Canva's API to create a design with the image pre-loaded
  // This is a placeholder for opening Canva
}

const handleSaveToHistory = () => {
  emit('save-to-history', {
    designPurpose: props.designPurpose,
    designStyle: props.designStyle,
    keyMessage: props.keyMessage,
    imageUrl: props.selectedImage.url
  })
}
</script>

<style scoped>
.export-step {
  width: 100%;
  padding: 2rem;
}

.export-container {
  max-width: 700px;
  margin: 0 auto;
}

.export-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
  text-align: center;
}

.export-subtitle {
  font-size: 1rem;
  color: #6b7280;
  text-align: center;
  margin: 0 0 2rem 0;
}

.preview-section {
  margin-bottom: 2rem;
  border-radius: 0.75rem;
  overflow: hidden;
  background: #f3f4f6;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.export-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.export-option {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  transition: all 0.2s;
}

.export-option:hover {
  border-color: #3b82f6;
  background: #f0f9ff;
}

.option-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.option-content {
  flex: 1;
  min-width: 0;
}

.option-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.option-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
}

.btn-export-primary,
.btn-export-secondary {
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  flex-shrink: 0;
}

.btn-export-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.btn-export-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-export-secondary {
  background: white;
  color: #3b82f6;
  border: 2px solid #3b82f6;
}

.btn-export-secondary:hover {
  background: #f0f9ff;
}

.design-details {
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 0.75rem;
  margin-bottom: 2rem;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-value {
  font-size: 0.95rem;
  color: #1f2937;
  font-weight: 500;
}

.footer-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.btn-back,
.btn-new {
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-back {
  background: white;
  color: #3b82f6;
  border: 2px solid #e5e7eb;
}

.btn-back:hover {
  border-color: #3b82f6;
  background: #f0f9ff;
}

.btn-new {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.btn-new:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

@media (max-width: 640px) {
  .export-option {
    flex-direction: column;
    text-align: center;
  }

  .btn-export-primary,
  .btn-export-secondary {
    width: 100%;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }
}
</style>
