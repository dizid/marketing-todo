<template>
  <div v-if="field.description || field.tooltip" class="field-tooltip-wrapper">
    <!-- Tooltip Icon/Trigger -->
    <button
      @click="isVisible = !isVisible"
      @mouseenter="isVisible = true"
      @mouseleave="isVisible = false"
      class="tooltip-trigger"
      :aria-label="`Help for ${field.label}`"
    >
      ⓘ
    </button>

    <!-- Tooltip Content (Floating) -->
    <transition name="tooltip-fade">
      <div v-if="isVisible" class="tooltip-content">
        <!-- Tooltip Text -->
        <p class="tooltip-text">{{ field.tooltip || field.description }}</p>

        <!-- Example (if provided) -->
        <div v-if="field.example" class="tooltip-example">
          <span class="example-label">Example:</span>
          <span class="example-value">{{ field.example }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// Props
const props = defineProps({
  field: {
    type: Object,
    required: true
  },
  fieldId: {
    type: String,
    default: ''
  }
})

// State
const isVisible = ref(false)

// Track tooltip view
onMounted(() => {
  const trackTooltipView = () => {
    if (isVisible.value) {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'field_tooltip_viewed', {
          event_category: 'help_system',
          event_label: props.fieldId,
          field_name: props.field.label
        })
      }
    }
  }

  // Track after a short delay to ensure it's genuinely visible
  const timer = setInterval(() => {
    if (isVisible.value) {
      trackTooltipView()
      clearInterval(timer)
    }
  }, 500)

  onBeforeUnmount(() => clearInterval(timer))
})
</script>

<style scoped>
.field-tooltip-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Trigger Button */
.tooltip-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  padding: 0;
  background-color: #e0e7ff;
  color: #4f46e5;
  border: 1px solid #c7d2fe;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.tooltip-trigger:hover {
  background-color: #4f46e5;
  color: white;
  border-color: #4f46e5;
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
}

.tooltip-trigger:active {
  transform: scale(0.95);
}

/* Tooltip Content */
.tooltip-content {
  position: absolute;
  bottom: calc(100% + 0.75rem);
  left: 50%;
  transform: translateX(-50%);
  background-color: #1e293b;
  color: #f1f5f9;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  line-height: 1.4;
  z-index: 1000;
  max-width: 250px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  white-space: normal;
  word-break: break-word;
  border: 1px solid #334155;

  /* Arrow pointer */
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 6px;
    height: 6px;
    background-color: #1e293b;
    border: 1px solid #334155;
    border-top: none;
    border-left: none;
    border-radius: 0 0 2px 0;
    transform: translateX(-50%) rotate(45deg);
  }
}

.tooltip-text {
  margin: 0 0 0.5rem 0;
  font-weight: 500;
}

.tooltip-example {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-top: 0.5rem;
  border-top: 1px solid #475569;
}

.example-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: #cbd5e1;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.example-value {
  font-size: 0.75rem;
  color: #e2e8f0;
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
  padding: 0.25rem 0.5rem;
  background-color: #0f172a;
  border-radius: 3px;
  border-left: 2px solid #3b82f6;
}

/* Animations */
.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: opacity 0.15s ease;
}

.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
}

.tooltip-fade-enter-to,
.tooltip-fade-leave-from {
  opacity: 1;
}

/* Mobile Support - make trigger larger on small screens */
@media (max-width: 640px) {
  .tooltip-trigger {
    width: 1.5rem;
    height: 1.5rem;
    font-size: 0.85rem;
  }

  .tooltip-content {
    max-width: 200px;
    font-size: 0.75rem;
  }
}
</style>
