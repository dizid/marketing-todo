<template>
  <div class="wizard-step">
    <!-- Step Title & Guide -->
    <div class="step-header">
      <h3 class="step-title">{{ step.title }}</h3>
      <p v-if="step.guide" class="step-guide">
        💡 {{ step.guide }}
      </p>
    </div>

    <!-- Form Fields for This Step -->
    <div class="step-fields">
      <div v-for="field in step.fields" :key="field.id" class="form-field">
        <!-- Section Title -->
        <div v-if="field.type === 'section-title'" class="section-divider">
          <div class="divider-line"></div>
          <h4 class="section-label">{{ field.label }}</h4>
          <div class="divider-line"></div>
        </div>

        <!-- Text Input -->
        <div v-else-if="field.type === 'text'" class="field-wrapper">
          <label class="field-label">
            {{ field.label }}
            <span v-if="field.required" class="required">*</span>
            <span v-if="field.tip" class="tip" @click.stop="showTip[field.id] = !showTip[field.id]">
              ❓
            </span>
          </label>

          <div v-if="showTip[field.id]" class="tip-box">
            {{ field.tip }}
          </div>

          <input
            type="text"
            :value="formData[field.id] || field.default || ''"
            :placeholder="field.placeholder"
            @input="$emit('update:formData', { ...formData, [field.id]: $event.target.value })"
            class="field-input"
          />

          <p v-if="field.description" class="field-description">
            {{ field.description }}
          </p>
        </div>

        <!-- Textarea -->
        <div v-else-if="field.type === 'textarea'" class="field-wrapper">
          <label class="field-label">
            {{ field.label }}
            <span v-if="field.required" class="required">*</span>
            <span v-if="field.tip" class="tip" @click.stop="showTip[field.id] = !showTip[field.id]">
              ❓
            </span>
          </label>

          <div v-if="showTip[field.id]" class="tip-box">
            {{ field.tip }}
          </div>

          <textarea
            :value="formData[field.id] || field.default || ''"
            :placeholder="field.placeholder"
            :rows="field.rows || 3"
            @input="$emit('update:formData', { ...formData, [field.id]: $event.target.value })"
            class="field-input field-textarea"
          ></textarea>

          <p v-if="field.description" class="field-description">
            {{ field.description }}
          </p>
        </div>

        <!-- Emoji/Icon Picker -->
        <div v-else-if="field.type === 'emoji-picker'" class="field-wrapper">
          <label class="field-label">
            {{ field.label }}
            <span v-if="field.tip" class="tip" @click.stop="showTip[field.id] = !showTip[field.id]">
              ❓
            </span>
          </label>

          <div v-if="showTip[field.id]" class="tip-box">
            {{ field.tip }}
          </div>

          <div class="emoji-grid">
            <button
              v-for="emoji in emojiOptions"
              :key="emoji"
              class="emoji-btn"
              :class="{ active: formData[field.id] === emoji }"
              @click="$emit('update:formData', { ...formData, [field.id]: emoji })"
            >
              {{ emoji }}
            </button>
          </div>

          <input
            type="text"
            :value="formData[field.id] || field.default || ''"
            :placeholder="field.placeholder"
            @input="$emit('update:formData', { ...formData, [field.id]: $event.target.value })"
            class="field-input"
            maxlength="2"
          />
        </div>

        <!-- Color Picker -->
        <div v-else-if="field.type === 'color'" class="field-wrapper">
          <label class="field-label">
            {{ field.label }}
            <span v-if="field.required" class="required">*</span>
            <span v-if="field.tip" class="tip" @click.stop="showTip[field.id] = !showTip[field.id]">
              ❓
            </span>
          </label>

          <div v-if="showTip[field.id]" class="tip-box">
            {{ field.tip }}
          </div>

          <div class="color-input-group">
            <input
              type="color"
              :value="formData[field.id] || field.default || '#6366f1'"
              @input="$emit('update:formData', { ...formData, [field.id]: $event.target.value })"
              class="color-picker"
            />
            <input
              type="text"
              :value="formData[field.id] || field.default || '#6366f1'"
              @input="$emit('update:formData', { ...formData, [field.id]: $event.target.value })"
              class="field-input color-text"
              placeholder="#6366f1"
            />
          </div>

          <p v-if="field.description" class="field-description">
            {{ field.description }}
          </p>
        </div>

        <!-- AI Improve Button -->
        <button
          v-if="field.aiTip"
          class="btn-ai-improve"
          @click="$emit('generate-ai', field.id)"
          title="Get AI suggestions for this field"
        >
          ✨ Get AI Suggestions
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  step: {
    type: Object,
    required: true
  },
  stepNumber: {
    type: Number,
    required: true
  },
  formData: {
    type: Object,
    required: true
  }
})

defineEmits(['update:formData', 'generate-ai'])

const showTip = ref({})

const emojiOptions = [
  '✨',
  '⚡',
  '🚀',
  '🎯',
  '💡',
  '🔒',
  '👥',
  '📊',
  '🎨',
  '🔗',
  '💬',
  '✅'
]
</script>

<style scoped>
.wizard-step {
  width: 100%;
}

.step-header {
  margin-bottom: 30px;
}

.step-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #111;
  margin: 0 0 10px 0;
}

.step-guide {
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
  margin: 0;
  background: #f0f7ff;
  padding: 12px;
  border-left: 4px solid #6366f1;
  border-radius: 4px;
}

/* Fields */
.step-fields {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.section-divider {
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 30px 0 20px 0;
}

.divider-line {
  flex: 1;
  height: 2px;
  background: #e0e0e0;
}

.section-label {
  font-size: 1rem;
  font-weight: 600;
  color: #666;
  margin: 0;
  white-space: nowrap;
}

.form-field {
  position: relative;
}

.field-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-weight: 600;
  color: #111;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.required {
  color: #ef4444;
}

.tip {
  font-size: 0.85rem;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.tip:hover {
  opacity: 1;
}

.tip-box {
  background: #fffbeb;
  border: 1px solid #fcd34d;
  border-radius: 6px;
  padding: 10px;
  font-size: 0.9rem;
  color: #92400e;
  line-height: 1.5;
  margin-bottom: 5px;
}

.field-input {
  padding: 10px 14px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.95rem;
  font-family: inherit;
  transition: all 0.3s;
}

.field-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.field-textarea {
  resize: vertical;
  min-height: 100px;
}

.field-description {
  font-size: 0.85rem;
  color: #999;
  margin: 0;
}

/* Emoji Picker */
.emoji-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  margin-bottom: 10px;
}

.emoji-btn {
  background: #f5f5f5;
  border: 2px solid transparent;
  border-radius: 6px;
  padding: 10px;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
}

.emoji-btn:hover {
  background: #e8e8e8;
  transform: scale(1.1);
}

.emoji-btn.active {
  border-color: #6366f1;
  background: #f0f7ff;
}

/* Color Picker */
.color-input-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

.color-picker {
  width: 50px;
  height: 42px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.color-picker:hover {
  border-color: #6366f1;
}

.color-text {
  flex: 1;
  text-transform: uppercase;
}

/* AI Improve Button */
.btn-ai-improve {
  margin-top: 10px;
  padding: 8px 14px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  width: 100%;
}

.btn-ai-improve:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(99, 102, 241, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .step-title {
    font-size: 1.5rem;
  }

  .emoji-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .color-input-group {
    flex-direction: column;
  }

  .color-picker {
    width: 100%;
  }
}
</style>
