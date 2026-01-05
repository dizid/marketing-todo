<template>
  <div class="brief-form-step">
    <div class="form-container">
      <h2 class="form-title">Design Your Graphics</h2>
      <p class="form-subtitle">Tell us what you want to create, and we'll generate AI designs in seconds</p>

      <form @submit.prevent="handleSubmit" class="form">
        <!-- Design Purpose Select -->
        <div class="form-group">
          <label for="purpose" class="form-label">What are you designing?</label>
          <select
            id="purpose"
            v-model="formData.designPurpose"
            class="form-select"
            required
          >
            <option value="">Choose a design type...</option>
            <option
              v-for="purpose in designPurposes"
              :key="purpose.id"
              :value="purpose.id"
            >
              {{ purpose.emoji }} {{ purpose.name }} ({{ purpose.specs }})
            </option>
          </select>
          <p class="form-help">
            Different sizes optimized for social, web, ads, and more
          </p>
        </div>

        <!-- Design Style Select -->
        <div class="form-group">
          <label for="style" class="form-label">What's your vibe?</label>
          <select
            id="style"
            v-model="formData.designStyle"
            class="form-select"
            required
          >
            <option value="">Choose a style...</option>
            <option
              v-for="style in designStyles"
              :key="style.id"
              :value="style.id"
            >
              {{ style.name }} — {{ style.description }}
            </option>
          </select>
          <p class="form-help">
            Sets the overall look and feel of your design
          </p>
        </div>

        <!-- Key Message Input -->
        <div class="form-group">
          <label for="message" class="form-label">What's your key message?</label>
          <input
            id="message"
            v-model="formData.keyMessage"
            type="text"
            class="form-input"
            placeholder="e.g., &quot;50% Off Launch Week&quot; or &quot;Start Your Free Trial&quot;"
            maxlength="100"
            required
          />
          <p class="form-help">
            The main message or CTA you want the design to communicate ({{ formData.keyMessage.length }}/100)
          </p>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="btn-submit"
          :disabled="isSubmitting || !isFormValid"
        >
          <span v-if="!isSubmitting" class="btn-text">Generate Designs</span>
          <span v-else class="btn-text">Generating...</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { designPurposes, designStyles } from '../../../configs/designGraphics.config'

const props = defineProps({
  isSubmitting: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit'])

const formData = ref({
  designPurpose: '',
  designStyle: '',
  keyMessage: ''
})

const isFormValid = computed(() => {
  return (
    formData.value.designPurpose &&
    formData.value.designStyle &&
    formData.value.keyMessage.trim().length > 0
  )
})

const handleSubmit = () => {
  if (!isFormValid.value) return

  emit('submit', {
    designPurpose: formData.value.designPurpose,
    designStyle: formData.value.designStyle,
    keyMessage: formData.value.keyMessage.trim()
  })
}
</script>

<style scoped>
.brief-form-step {
  width: 100%;
  padding: 2rem;
}

.form-container {
  max-width: 600px;
  margin: 0 auto;
}

.form-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.form-subtitle {
  font-size: 1rem;
  color: #6b7280;
  margin: 0 0 2rem 0;
  line-height: 1.5;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.form-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1f2937;
}

.form-select,
.form-input {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  font-family: inherit;
  transition: border-color 0.2s;
  color: #1f2937;
  background-color: white;
}

.form-select::placeholder,
.form-input::placeholder {
  color: #d1d5db;
}

.form-select:focus,
.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input {
  min-height: 2.75rem;
}

.form-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  background-color: white;
  padding-right: 2.5rem;
}

.form-select option {
  color: #1f2937;
  background-color: white;
  padding: 0.5rem;
}

.form-help {
  font-size: 0.85rem;
  color: #9ca3af;
  margin: 0;
}

.btn-submit {
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 0.5rem;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
</style>
