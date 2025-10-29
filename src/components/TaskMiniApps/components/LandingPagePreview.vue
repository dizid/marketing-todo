<template>
  <div class="preview-container" :class="{ mobile: device === 'mobile' }">
    <div class="preview-wrapper">
      <iframe
        :srcDoc="htmlContent"
        class="preview-iframe"
        title="Landing page preview"
      ></iframe>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { generateLandingPageHTML } from '../../../services/landingPageExporter'

defineProps({
  formData: {
    type: Object,
    required: true
  },
  device: {
    type: String,
    default: 'desktop',
    validator: (value) => ['desktop', 'mobile'].includes(value)
  }
})

const htmlContent = computed(() => {
  try {
    return generateLandingPageHTML(formData.value)
  } catch (err) {
    console.error('Error generating preview:', err)
    return '<p>Error generating preview. Check your data.</p>'
  }
})
</script>

<style scoped>
.preview-container {
  width: 100%;
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
}

.preview-container.mobile {
  background: #e0e0e0;
  padding: 20px;
  display: flex;
  justify-content: center;
}

.preview-wrapper {
  width: 100%;
  height: 600px;
}

.preview-container.mobile .preview-wrapper {
  width: 375px;
  height: 667px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  border: 12px solid #333;
  overflow: hidden;
}

.preview-iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: white;
}

@media (max-width: 768px) {
  .preview-wrapper {
    height: 400px;
  }

  .preview-container.mobile .preview-wrapper {
    width: 100%;
    height: 400px;
    border-radius: 8px;
    border: none;
  }
}
</style>
