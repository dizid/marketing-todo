<template>
  <div class="canva-fallback">
    <div class="fallback-header">
      <h3 class="fallback-title">✨ Polish in Canva</h3>
      <p class="fallback-description">
        Want to add text, logos, or fine-tune the colors? Open this design in Canva's editor.
      </p>
    </div>

    <div class="fallback-templates">
      <h4 class="templates-title">Recommended Canva Templates for {{ purposeName }}</h4>
      <div class="template-list">
        <a
          v-for="template in templates"
          :key="template.id"
          :href="template.url"
          target="_blank"
          rel="noopener noreferrer"
          class="template-link"
        >
          <div class="template-preview">
            <img :src="template.preview" :alt="template.name" />
          </div>
          <div class="template-info">
            <h5 class="template-name">{{ template.name }}</h5>
            <p class="template-desc">{{ template.description }}</p>
            <span class="template-size">{{ template.dimensions }}</span>
          </div>
          <span class="link-arrow">→</span>
        </a>
      </div>
    </div>

    <div class="fallback-info">
      <p class="info-text">
        Canva makes it easy to customize templates with your brand colors, logos, and messaging.
        No design experience needed!
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { designPurposes } from '../../../configs/designGraphics.config'
import { getTemplatesForPurpose } from '../../../configs/canvaTemplates.config'

const props = defineProps({
  designPurpose: {
    type: String,
    required: true
  }
})

const purposeName = computed(() => {
  return designPurposes.find(p => p.id === props.designPurpose)?.name || props.designPurpose
})

const templates = computed(() => {
  const allTemplates = getTemplatesForPurpose(props.designPurpose)
  // Return top 3 templates
  return allTemplates.slice(0, 3).map(t => ({
    ...t,
    preview: 'https://via.placeholder.com/200x150?text=' + encodeURIComponent(t.name)
  }))
})
</script>

<style scoped>
.canva-fallback {
  padding: 1.5rem;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 2px solid #fcd34d;
  border-radius: 0.75rem;
}

.fallback-header {
  margin-bottom: 1.5rem;
}

.fallback-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #92400e;
  margin: 0 0 0.5rem 0;
}

.fallback-description {
  font-size: 0.9rem;
  color: #b45309;
  margin: 0;
  line-height: 1.4;
}

.templates-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #92400e;
  margin: 0 0 1rem 0;
}

.template-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.template-link {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background: white;
  border: 2px solid #fcd34d;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
}

.template-link:hover {
  border-color: #f59e0b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
}

.template-preview {
  width: 100%;
  aspect-ratio: 4/3;
  background: #f3f4f6;
  border-radius: 0.375rem;
  overflow: hidden;
}

.template-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.template-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  min-width: 0;
}

.template-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #92400e;
  margin: 0;
  word-break: break-word;
}

.template-desc {
  font-size: 0.75rem;
  color: #b45309;
  margin: 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.template-size {
  font-size: 0.7rem;
  color: #d97706;
  font-weight: 500;
}

.link-arrow {
  align-self: center;
  color: #f59e0b;
  font-size: 1.25rem;
}

.fallback-info {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid rgba(253, 230, 138, 0.5);
}

.info-text {
  font-size: 0.85rem;
  color: #92400e;
  margin: 0;
  line-height: 1.4;
}

@media (max-width: 640px) {
  .canva-fallback {
    padding: 1rem;
  }

  .template-list {
    grid-template-columns: 1fr;
  }
}
</style>
