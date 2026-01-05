<template>
  <div class="image-gallery">
    <!-- Main Image Display -->
    <div class="main-image-container">
      <img
        v-if="images[selectedIndex]"
        :src="images[selectedIndex].url"
        :alt="images[selectedIndex].alt"
        class="main-image"
      />
      <div v-else class="empty-state">
        <p>No image selected</p>
      </div>
      <div class="image-counter">
        {{ selectedIndex + 1 }}/{{ images.length }}
      </div>
    </div>

    <!-- Thumbnail Grid -->
    <div class="thumbnail-grid">
      <button
        v-for="(image, index) in images"
        :key="image.id"
        @click="emit('select', index)"
        :class="['thumbnail', { active: index === selectedIndex }]"
        :aria-label="`Select image ${index + 1}`"
      >
        <img :src="image.url" :alt="image.alt" class="thumbnail-image" />
      </button>
    </div>

    <!-- Navigation -->
    <div class="navigation">
      <button
        @click="previousImage"
        :disabled="selectedIndex === 0"
        class="nav-btn"
        aria-label="Previous image"
      >
        ← Previous
      </button>
      <button
        @click="nextImage"
        :disabled="selectedIndex === images.length - 1"
        class="nav-btn"
        aria-label="Next image"
      >
        Next →
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  },
  selectedIndex: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['select'])

const previousImage = () => {
  if (props.selectedIndex > 0) {
    emit('select', props.selectedIndex - 1)
  }
}

const nextImage = () => {
  if (props.selectedIndex < props.images.length - 1) {
    emit('select', props.selectedIndex + 1)
  }
}
</script>

<style scoped>
.image-gallery {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
}

.main-image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: #f3f4f6;
  border-radius: 0.75rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.empty-state {
  color: #9ca3af;
  font-size: 1rem;
}

.image-counter {
  position: absolute;
  bottom-1rem: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.thumbnail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 0.75rem;
  width: 100%;
}

.thumbnail {
  position: relative;
  aspect-ratio: 1;
  border: 3px solid transparent;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #f3f4f6;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
}

.thumbnail:hover {
  border-color: #bfdbfe;
  transform: scale(1.05);
}

.thumbnail.active {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px white, 0 0 8px rgba(59, 130, 246, 0.5);
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.navigation {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.nav-btn {
  padding: 0.625rem 1.25rem;
  background: white;
  color: #3b82f6;
  border: 2px solid #3b82f6;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-btn:hover:not(:disabled) {
  background: #f0f9ff;
  transform: translateY(-2px);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .image-gallery {
    gap: 1.5rem;
  }

  .thumbnail-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .image-counter {
    bottom: 0.75rem;
    right: 0.75rem;
    font-size: 0.75rem;
    padding: 0.375rem 0.75rem;
  }
}
</style>
