<template>
  <div class="define-business-container">
    <!-- Header -->
    <div class="business-header">
      <div class="header-content">
        <div class="header-icon">🏢</div>
        <div class="header-text">
          <h2 class="header-title">{{ config.name }}</h2>
          <p class="header-subtitle">{{ config.description }}</p>
          <p class="header-time">⏱️ {{ config.estimatedTime }}</p>
        </div>
      </div>
      <div class="header-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
        </div>
        <div class="progress-text">Step {{ currentStepNumber }} of {{ totalSteps }}</div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <p>Loading your business profile...</p>
    </div>

    <!-- Main Content -->
    <div v-else-if="!completed" class="wizard-content">
      <!-- Current Step -->
      <div class="step-container">
        <div class="step-header">
          <h3 class="step-title">{{ currentStep.title }}</h3>
          <p class="step-subtitle">{{ currentStep.subtitle }}</p>
        </div>

        <!-- Form Fields -->
        <div class="step-fields">
          <div v-for="field in currentStep.fields" :key="field.id" class="form-group">
            <!-- Label with Tooltip -->
            <div class="label-wrapper">
              <label :for="field.id" class="field-label">
                {{ field.label }}
                <span v-if="field.required" class="required-indicator">*</span>
              </label>
              <div v-if="field.tooltip" class="field-tooltip-icon" :title="field.tooltip">?</div>
            </div>

            <!-- Input Fields -->
            <div v-if="field.type === 'text'" class="input-wrapper">
              <input
                :id="field.id"
                v-model="formData[field.id]"
                type="text"
                :placeholder="field.placeholder"
                class="text-input"
              />
            </div>

            <!-- Number Input -->
            <div v-else-if="field.type === 'number'" class="input-wrapper">
              <input
                :id="field.id"
                v-model.number="formData[field.id]"
                type="number"
                :placeholder="field.placeholder"
                :min="field.min"
                :max="field.max"
                class="text-input"
              />
            </div>

            <!-- Textarea -->
            <div v-else-if="field.type === 'textarea'" class="input-wrapper">
              <textarea
                :id="field.id"
                v-model="formData[field.id]"
                :placeholder="field.placeholder"
                :rows="field.rows || 3"
                class="textarea-input"
              ></textarea>
            </div>

            <!-- Select -->
            <div v-else-if="field.type === 'select'" class="input-wrapper">
              <select
                :id="field.id"
                v-model="formData[field.id]"
                class="select-input"
              >
                <option value="">{{ field.placeholder }}</option>
                <option v-for="option in field.options" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>

            <!-- Help Text -->
            <div v-if="field.help" class="field-help">
              {{ field.help }}
            </div>

            <!-- Example -->
            <div v-if="field.example" class="field-example">
              <span class="example-label">Example:</span>
              <span class="example-value">{{ field.example }}</span>
            </div>
          </div>
        </div>

        <!-- Step Info -->
        <div class="step-info">
          <div class="info-item">
            <span class="info-label">Estimated time:</span>
            <span class="info-value">{{ currentStep.estimatedMinutes }} minutes</span>
          </div>
          <div class="info-item">
            <span class="info-label">Tier:</span>
            <span class="info-value">{{ currentStep.tierName }}</span>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="wizard-navigation">
        <button
          @click="goToPreviousStep"
          :disabled="currentStepNumber === 1"
          class="nav-btn nav-btn-back"
        >
          ← Back
        </button>

        <div class="step-indicators">
          <button
            v-for="(step, idx) in steps"
            :key="step.id"
            @click="goToStep(idx)"
            class="step-indicator"
            :class="{ active: idx === currentStepIndex, completed: idx < currentStepIndex }"
            :title="`${step.title} (Step ${idx + 1})`"
          >
            {{ idx + 1 }}
          </button>
        </div>

        <button
          @click="goToNextStep"
          :disabled="!isCurrentStepValid()"
          class="nav-btn nav-btn-next"
        >
          {{ currentStepNumber === totalSteps ? 'Complete' : 'Next' }} →
        </button>
      </div>

      <!-- Save Status -->
      <div v-if="saveStatus" class="save-status" :class="saveStatus.type">
        {{ saveStatus.message }}
      </div>
    </div>

    <!-- Completion Screen -->
    <div v-else class="completion-screen">
      <div class="completion-content">
        <div class="completion-icon">✅</div>
        <h3 class="completion-title">Your Business Profile is Ready!</h3>
        <p class="completion-message">
          Your business context has been saved successfully. All future AI-generated content will be customized to your business.
        </p>

        <div class="completion-stats">
          <div class="stat">
            <div class="stat-number">{{ completionScore }}</div>
            <div class="stat-label">Profile Completion</div>
          </div>
          <div class="stat">
            <div class="stat-number">7</div>
            <div class="stat-label">Tiers Defined</div>
          </div>
        </div>

        <div class="completion-actions">
          <button @click="viewDashboard" class="action-btn primary-btn">
            View Dashboard
          </button>
          <button @click="startNewTask" class="action-btn secondary-btn">
            Start Next Task
          </button>
        </div>

        <p class="completion-note">
          You can edit this profile anytime by returning to "Define Your Business"
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useBusinessContext } from '@/composables/useBusinessContext'
import { defineBusinessConfig } from '../configs/defineBusiness.config'

// Composables
const { context, loading, getContext, setContext, updateContext, getCompletionScore } = useBusinessContext()

// Config
const config = defineBusinessConfig
const steps = config.steps
const totalSteps = steps.length

// State
const currentStepIndex = ref(0)
const formData = ref({})
const completed = ref(false)
const saveStatus = ref(null)
const completionScore = ref(0)
let saveTimeout = null

// Computed
const currentStep = computed(() => steps[currentStepIndex.value])
const currentStepNumber = computed(() => currentStepIndex.value + 1)
const progressPercentage = computed(() => (currentStepNumber.value / totalSteps) * 100)

// Methods
const isCurrentStepValid = () => {
  const requiredFields = currentStep.value.fields.filter((f) => f.required)
  return requiredFields.every((f) => {
    const value = formData.value[f.id]
    return value !== null && value !== undefined && value !== ''
  })
}

const goToPreviousStep = () => {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--
  }
}

const goToNextStep = async () => {
  if (!isCurrentStepValid()) return

  // Save current step data
  await saveStepData()

  if (currentStepNumber.value === totalSteps) {
    // Final step - mark as completed
    completed.value = true
    completionScore.value = getCompletionScore()
  } else {
    currentStepIndex.value++
  }
}

const goToStep = (stepIndex) => {
  if (stepIndex < currentStepIndex.value || isCurrentStepValid()) {
    currentStepIndex.value = stepIndex
  }
}

const saveStepData = async () => {
  try {
    const stepData = {}
    const tierName = currentStep.value.tierName
    const tierSection = currentStep.value.tierSection

    // Build the data structure for this step
    currentStep.value.fields.forEach((field) => {
      const value = formData.value[field.id]
      if (value !== null && value !== undefined && value !== '') {
        stepData[field.id] = value
      }
    })

    // Update context with this step's data
    if (Object.keys(stepData).length > 0) {
      await updateContext(tierName, tierSection, stepData)
    }

    // Show save status
    saveStatus.value = {
      type: 'success',
      message: '✓ Progress saved'
    }

    // Clear message after 2 seconds
    clearTimeout(saveTimeout)
    saveTimeout = setTimeout(() => {
      saveStatus.value = null
    }, 2000)
  } catch (err) {
    console.error('Error saving step data:', err)
    saveStatus.value = {
      type: 'error',
      message: '✗ Error saving progress. Please try again.'
    }
  }
}

const viewDashboard = () => {
  // Navigate to dashboard (would use router in real app)
  console.log('Navigate to context dashboard')
}

const startNewTask = () => {
  // Navigate to next available task
  console.log('Navigate to next task')
}

const loadExistingData = async () => {
  try {
    await getContext()

    if (context.value) {
      // Pre-fill form with existing data
      steps.forEach((step) => {
        const tierData = context.value[step.tierName]
        if (tierData) {
          const tierSection = tierData[step.tierSection]
          if (tierSection && typeof tierSection === 'object') {
            // Flatten and merge field data
            Object.keys(tierSection).forEach((key) => {
              const value = tierSection[key]
              const fieldId = `${step.tierSection}.${key}`

              // Handle nested objects
              if (typeof value === 'object' && !Array.isArray(value)) {
                Object.keys(value).forEach((subKey) => {
                  formData.value[`${fieldId}.${subKey}`] = value[subKey]
                })
              } else {
                formData.value[fieldId] = value
              }
            })
          }
        }
      })
    }
  } catch (err) {
    console.error('Error loading existing data:', err)
  }
}

// Lifecycle
onMounted(() => {
  loadExistingData()
})

onBeforeUnmount(() => {
  clearTimeout(saveTimeout)
})
</script>

<style scoped>
.define-business-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(135deg, #f0f4f8 0%, #f8fafc 100%);
  min-height: 100vh;
}

/* Header */
.business-header {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.header-content {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.header-icon {
  font-size: 3rem;
  line-height: 1;
}

.header-text {
  flex: 1;
}

.header-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.header-subtitle {
  margin: 0 0 0.5rem 0;
  font-size: 0.95rem;
  color: #64748b;
}

.header-time {
  margin: 0;
  font-size: 0.9rem;
  color: #94a3b8;
}

.header-progress {
  margin-top: 1.5rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00d9ff 0%, #4f46e5 100%);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.85rem;
  color: #64748b;
  text-align: right;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  color: #64748b;
}

/* Wizard Content */
.wizard-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Step Container */
.step-container {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.step-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #e2e8f0;
}

.step-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.step-subtitle {
  margin: 0;
  font-size: 0.95rem;
  color: #64748b;
}

/* Form Fields */
.step-fields {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label-wrapper {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.field-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  gap: 0.25rem;
}

.required-indicator {
  color: #dc2626;
}

.field-tooltip-icon {
  width: 20px;
  height: 20px;
  background: #e0e7ff;
  color: #4f46e5;
  border: 1px solid #c7d2fe;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: help;
  flex-shrink: 0;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
}

.text-input,
.textarea-input,
.select-input {
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.95rem;
  font-family: inherit;
  transition: all 0.2s ease;
  background: white;
  color: #1e293b;
}

.text-input:focus,
.textarea-input:focus,
.select-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.textarea-input {
  resize: vertical;
  min-height: 80px;
}

.field-help {
  font-size: 0.85rem;
  color: #64748b;
  line-height: 1.4;
  padding: 0.5rem 0;
}

.field-example {
  font-size: 0.8rem;
  background: #f8fafc;
  border-left: 3px solid #3b82f6;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  display: flex;
  gap: 0.5rem;
}

.example-label {
  font-weight: 600;
  color: #64748b;
}

.example-value {
  color: #334155;
  font-family: 'Monaco', 'Courier New', monospace;
}

/* Step Info */
.step-info {
  display: flex;
  gap: 2rem;
  padding: 1rem;
  background: #f1f5f9;
  border-radius: 6px;
}

.info-item {
  display: flex;
  gap: 0.5rem;
}

.info-label {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
}

.info-value {
  font-size: 0.85rem;
  color: #1e293b;
  font-weight: 600;
}

/* Navigation */
.wizard-navigation {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.nav-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #4f46e5;
  color: white;
}

.nav-btn:hover:not(:disabled) {
  background: #4338ca;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-btn-back {
  background: white;
  color: #4f46e5;
  border: 1px solid #cbd5e1;
}

.nav-btn-back:hover:not(:disabled) {
  background: #f1f5f9;
  border-color: #4f46e5;
}

/* Step Indicators */
.step-indicators {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.step-indicator {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #cbd5e1;
  background: white;
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.step-indicator:hover {
  border-color: #4f46e5;
}

.step-indicator.active {
  background: #4f46e5;
  color: white;
  border-color: #4f46e5;
}

.step-indicator.completed {
  background: #10b981;
  color: white;
  border-color: #10b981;
}

/* Save Status */
.save-status {
  padding: 1rem;
  border-radius: 6px;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 500;
  animation: slideUp 0.3s ease;
}

.save-status.success {
  background: #f0fdf4;
  color: #15803d;
  border: 1px solid #bbf7d0;
}

.save-status.error {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Completion Screen */
.completion-screen {
  background: white;
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.completion-content {
  max-width: 500px;
  margin: 0 auto;
}

.completion-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: bounce 0.6s ease;
}

@keyframes bounce {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.completion-title {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.completion-message {
  margin: 0 0 2rem 0;
  color: #64748b;
  line-height: 1.5;
}

.completion-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin: 2rem 0;
}

.stat {
  background: #f1f5f9;
  padding: 1.5rem;
  border-radius: 8px;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #4f46e5;
}

.stat-label {
  font-size: 0.85rem;
  color: #64748b;
  margin-top: 0.5rem;
}

.completion-actions {
  display: flex;
  gap: 1rem;
  margin: 2rem 0;
}

.action-btn {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.primary-btn {
  background: #4f46e5;
  color: white;
}

.primary-btn:hover {
  background: #4338ca;
}

.secondary-btn {
  background: white;
  color: #4f46e5;
  border: 1px solid #cbd5e1;
}

.secondary-btn:hover {
  background: #f1f5f9;
}

.completion-note {
  margin: 2rem 0 0 0;
  font-size: 0.85rem;
  color: #94a3b8;
}

/* Responsive */
@media (max-width: 768px) {
  .define-business-container {
    padding: 1rem;
  }

  .business-header {
    padding: 1.5rem;
  }

  .header-content {
    flex-direction: column;
  }

  .step-container {
    padding: 1.5rem;
  }

  .wizard-navigation {
    flex-direction: column;
    gap: 1rem;
  }

  .nav-btn {
    width: 100%;
  }

  .step-indicators {
    flex-wrap: wrap;
  }

  .completion-stats {
    grid-template-columns: 1fr;
  }
}
</style>
