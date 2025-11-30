<template>
  <div v-if="help" class="help-panel">
    <!-- Help Header with Toggle -->
    <div class="help-header">
      <button @click="isExpanded = !isExpanded" class="help-toggle">
        <span class="help-icon">💡</span>
        <span class="help-title">Examples & Tips</span>
        <span class="help-chevron" :class="{ expanded: isExpanded }">▼</span>
      </button>
    </div>

    <!-- Expanded Content -->
    <transition name="help-expand">
      <div v-if="isExpanded" class="help-content">
        <!-- Examples Section -->
        <div v-if="help.examples && help.examples.length > 0" class="help-section">
          <h4 class="help-section-title">📋 Examples</h4>
          <div class="examples-list">
            <div
              v-for="(example, idx) in help.examples"
              :key="`example-${idx}`"
              class="example-item"
            >
              <button @click="selectedExampleIdx = selectedExampleIdx === idx ? null : idx" class="example-header">
                <span class="example-scenario">{{ example.scenario }}</span>
                <span class="example-chevron" :class="{ expanded: selectedExampleIdx === idx }">▼</span>
              </button>

              <transition name="help-expand">
                <div v-if="selectedExampleIdx === idx" class="example-details">
                  <div class="example-section">
                    <div class="example-label">Input Example:</div>
                    <div class="example-text">{{ formatExample(example.input) }}</div>
                  </div>
                  <div class="example-section">
                    <div class="example-label">Expected Output:</div>
                    <div class="example-text">{{ example.output }}</div>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>

        <!-- Common Mistakes Section -->
        <div v-if="help.commonMistakes && help.commonMistakes.length > 0" class="help-section">
          <h4 class="help-section-title">⚠️ Common Mistakes</h4>
          <ul class="mistakes-list">
            <li v-for="(mistake, idx) in help.commonMistakes" :key="`mistake-${idx}`" class="mistake-item">
              {{ mistake }}
            </li>
          </ul>
        </div>

        <!-- Feedback Section -->
        <div class="help-feedback">
          <p class="feedback-label">Was this helpful?</p>
          <div class="feedback-buttons">
            <button @click="recordFeedback(true)" class="feedback-btn helpful" title="Yes, this helped">
              👍 Helpful
            </button>
            <button @click="recordFeedback(false)" class="feedback-btn not-helpful" title="No, I need more help">
              👎 Not helpful
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Props
const props = defineProps({
  help: {
    type: Object,
    default: null
  },
  taskId: {
    type: String,
    default: ''
  }
})

// State
const isExpanded = ref(false)
const selectedExampleIdx = ref(null)

// Emit events for parent to handle
const emit = defineEmits(['help-viewed', 'feedback'])

// Format example input for display
const formatExample = (inputObj) => {
  if (typeof inputObj === 'string') {
    return inputObj
  }
  return Object.entries(inputObj)
    .map(([key, value]) => `${key}: "${value}"`)
    .join(', ')
}

// Record feedback via gtag
const recordFeedback = (wasHelpful) => {
  // Track via Google Analytics if gtag is available
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'help_feedback', {
      event_category: 'help_system',
      event_label: props.taskId,
      helpful: wasHelpful
    })
  }

  emit('feedback', { taskId: props.taskId, helpful: wasHelpful })

  // Show confirmation
  const message = wasHelpful ? '✓ Thanks for the feedback!' : '✗ We\'ll improve this'
  // Could emit a toast notification here
  console.log(`[HelpPanel] ${props.taskId}: ${message}`)
}

// Track when examples are viewed
const trackExampleView = (exampleIdx) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'help_example_viewed', {
      event_category: 'help_system',
      event_label: props.taskId,
      example_index: exampleIdx
    })
  }
}

// Track when help panel is expanded
const trackHelpExpanded = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'help_panel_opened', {
      event_category: 'help_system',
      event_label: props.taskId
    })
  }
  emit('help-viewed', { taskId: props.taskId })
}

// Watch for expansion and track it
const originalIsExpanded = isExpanded.value
if (isExpanded) {
  trackHelpExpanded()
}
</script>

<style scoped>
.help-panel {
  background: linear-gradient(135deg, #f0f4f8 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.help-header {
  padding: 0;
}

.help-toggle {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 1rem;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  color: #1e293b;
  transition: background-color 0.2s ease;
  text-align: left;
}

.help-toggle:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.help-icon {
  font-size: 1.2rem;
}

.help-title {
  flex: 1;
}

.help-chevron {
  font-size: 0.75rem;
  color: #64748b;
  transition: transform 0.2s ease;
}

.help-chevron.expanded {
  transform: rotateZ(180deg);
}

.help-content {
  padding: 0 1rem 1rem 1rem;
  border-top: 1px solid #e2e8f0;
}

.help-section {
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
}

.help-section-title {
  margin: 0 0 0.75rem 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #334155;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Examples Section */
.examples-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.example-item {
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: white;
  overflow: hidden;
}

.example-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  color: #475569;
  transition: background-color 0.15s ease;
  text-align: left;
}

.example-header:hover {
  background-color: #f1f5f9;
}

.example-scenario {
  flex: 1;
  font-weight: 500;
}

.example-chevron {
  font-size: 0.6rem;
  color: #94a3b8;
  transition: transform 0.2s ease;
}

.example-chevron.expanded {
  transform: rotateZ(180deg);
}

.example-details {
  padding: 0.75rem;
  background-color: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.example-section {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.example-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.example-text {
  font-size: 0.8rem;
  color: #334155;
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
  background: white;
  padding: 0.5rem;
  border-radius: 4px;
  border-left: 3px solid #3b82f6;
  word-break: break-word;
}

/* Common Mistakes Section */
.mistakes-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mistake-item {
  padding: 0.75rem;
  background: white;
  border-left: 3px solid #ef4444;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #334155;
  line-height: 1.4;
}

/* Feedback Section */
.help-feedback {
  padding: 1rem;
  background-color: #f1f5f9;
  border-top: 1px solid #e2e8f0;
  border-radius: 0 0 8px 8px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
}

.feedback-label {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 500;
  color: #64748b;
}

.feedback-buttons {
  display: flex;
  gap: 0.5rem;
}

.feedback-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  color: #475569;
  transition: all 0.2s ease;
}

.feedback-btn:hover {
  border-color: #94a3b8;
  background-color: #f8fafc;
}

.helpful:hover {
  border-color: #10b981;
  color: #10b981;
}

.not-helpful:hover {
  border-color: #ef4444;
  color: #ef4444;
}

/* Animations */
.help-expand-enter-active,
.help-expand-leave-active {
  transition: all 0.2s ease;
}

.help-expand-enter-from,
.help-expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.help-expand-enter-to,
.help-expand-leave-from {
  opacity: 1;
  max-height: 1000px;
}
</style>
