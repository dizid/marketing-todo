<template>
  <div class="brief-section">
    <button @click="isOpen = !isOpen" class="brief-header">
      <span class="header-title">📋 Design Brief (Optional)</span>
      <span class="toggle-icon" :class="{ open: isOpen }">▼</span>
    </button>

    <div v-if="isOpen" class="brief-content">
      <div v-if="brief" class="brief-details">
        <div class="detail-block">
          <h4 class="block-title">Composition & Layout</h4>
          <p>{{ brief.composition || 'Not available' }}</p>
        </div>

        <div class="detail-block">
          <h4 class="block-title">Color Palette</h4>
          <div class="color-palette">
            <div
              v-for="(color, idx) in brief.colors"
              :key="idx"
              class="color-item"
              :style="{ backgroundColor: color.hex }"
              :title="`${color.name}: ${color.hex}`"
            >
              <span class="color-label">{{ color.name }}</span>
            </div>
          </div>
        </div>

        <div class="detail-block">
          <h4 class="block-title">Typography</h4>
          <p>{{ brief.typography || 'Not available' }}</p>
        </div>

        <div class="detail-block">
          <h4 class="block-title">Key Elements</h4>
          <ul class="elements-list">
            <li v-for="(element, idx) in brief.elements" :key="idx">
              {{ element }}
            </li>
          </ul>
        </div>
      </div>
      <div v-else class="no-brief">
        <p>Brief information not available for this design</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  brief: {
    type: Object,
    default: null
  }
})

const isOpen = ref(false)
</script>

<style scoped>
.brief-section {
  margin-top: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
}

.brief-header {
  width: 100%;
  padding: 1rem;
  background: #f9fafb;
  border: none;
  border-radius: 0.5rem 0.5rem 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  color: #1f2937;
  transition: background 0.2s;
}

.brief-header:hover {
  background: #f3f4f6;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toggle-icon {
  display: inline-block;
  transition: transform 0.2s;
  color: #6b7280;
}

.toggle-icon.open {
  transform: rotate(180deg);
}

.brief-content {
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.brief-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-block {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.block-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.detail-block p {
  font-size: 0.9rem;
  color: #374151;
  margin: 0;
  line-height: 1.5;
}

.color-palette {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 0.75rem;
}

.color-item {
  aspect-ratio: 1;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0.5rem;
  position: relative;
  overflow: hidden;
}

.color-label {
  font-size: 0.65rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.9);
  color: #1f2937;
  padding: 0.25rem 0.375rem;
  border-radius: 0.25rem;
  white-space: nowrap;
}

.elements-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.elements-list li {
  font-size: 0.9rem;
  color: #374151;
  padding-left: 1.5rem;
  position: relative;
}

.elements-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #3b82f6;
  font-weight: bold;
}

.no-brief {
  text-align: center;
  padding: 1rem;
  color: #9ca3af;
  font-size: 0.9rem;
}

@media (max-width: 640px) {
  .brief-content {
    padding: 1rem;
  }

  .color-palette {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
