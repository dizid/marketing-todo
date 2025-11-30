<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <!-- Header -->
          <div class="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex justify-between items-center border-b">
            <div>
              <h2 class="text-2xl font-bold">Create A/B Test</h2>
              <p class="text-blue-100 text-sm mt-1">Step {{ currentStep }} of {{ totalSteps }}</p>
            </div>
            <button
              @click="closeModal"
              class="text-white hover:bg-blue-800 rounded-full p-2 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Step Indicator -->
          <div class="px-6 py-4 bg-gray-50 border-b">
            <div class="flex items-center justify-between">
              <div
                v-for="step in totalSteps"
                :key="step"
                class="flex items-center flex-1"
              >
                <div
                  :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-colors',
                    step <= currentStep
                      ? 'bg-blue-600'
                      : 'bg-gray-300'
                  ]"
                >
                  {{ step }}
                </div>
                <div
                  v-if="step < totalSteps"
                  :class="[
                    'h-1 flex-1 mx-2 transition-colors',
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  ]"
                />
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="px-6 py-6">
            <!-- Step 1: Basic Information -->
            <div v-if="currentStep === 1" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Test Name *</label>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="e.g., Email Subject Line Test"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                <textarea
                  v-model="form.description"
                  placeholder="Describe what you're testing and why..."
                  rows="3"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Content Type *</label>
                <div class="grid grid-cols-2 gap-3">
                  <button
                    v-for="type in contentTypes"
                    :key="type.id"
                    @click="form.contentType = type.id"
                    :class="[
                      'p-3 border-2 rounded-lg text-left transition-colors',
                      form.contentType === type.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    ]"
                  >
                    <div class="font-medium text-gray-900">{{ type.name }}</div>
                    <div class="text-sm text-gray-600">{{ type.description }}</div>
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Associated Task (Optional)</label>
                <select
                  v-model="form.taskId"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="">Select a task...</option>
                  <option value="task1">Task 1</option>
                  <option value="task2">Task 2</option>
                  <option value="task3">Task 3</option>
                </select>
              </div>
            </div>

            <!-- Step 2: Control & Variants -->
            <div v-if="currentStep === 2" class="space-y-6">
              <!-- Control -->
              <div class="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                <h3 class="font-bold text-gray-900 mb-4 flex items-center">
                  <span class="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm mr-2">✓</span>
                  Control Variant
                </h3>

                <div class="space-y-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                      v-model="form.control.name"
                      type="text"
                      placeholder="e.g., Original Subject"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                    <textarea
                      v-model="form.control.description"
                      placeholder="Describe this variant..."
                      rows="2"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Value/Content *</label>
                    <textarea
                      v-model="form.control.value"
                      placeholder="Enter the actual content being tested (headline, subject line, etc.)"
                      rows="2"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <!-- Variants -->
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <h3 class="font-bold text-gray-900">Variants</h3>
                  <span class="text-sm text-gray-600">{{ form.variants.length }} variant(s)</span>
                </div>

                <div
                  v-for="(variant, idx) in form.variants"
                  :key="idx"
                  class="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3 relative"
                >
                  <button
                    v-if="form.variants.length > 1"
                    @click="removeVariant(idx)"
                    class="absolute top-2 right-2 text-red-600 hover:bg-red-50 rounded-full p-1 transition-colors"
                    title="Remove variant"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                      v-model="variant.name"
                      type="text"
                      placeholder="e.g., Urgency Angle"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                    <textarea
                      v-model="variant.description"
                      placeholder="Describe this variant..."
                      rows="2"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Value/Content *</label>
                    <textarea
                      v-model="variant.value"
                      placeholder="Enter the actual content being tested"
                      rows="2"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  @click="addVariant"
                  :disabled="form.variants.length >= 5"
                  class="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-700 hover:border-blue-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  + Add Variant ({{ form.variants.length }}/5)
                </button>
              </div>
            </div>

            <!-- Step 3: Test Parameters -->
            <div v-if="currentStep === 3" class="space-y-5">
              <div class="bg-blue-50 p-4 rounded-lg">
                <p class="text-sm text-gray-700">
                  Configure statistical parameters for your test. These settings determine how confident we need to be
                  in the results before declaring a winner.
                </p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Confidence Level *
                    <span class="text-gray-500 font-normal">({{ (form.confidenceLevel * 100).toFixed(0) }}%)</span>
                  </label>
                  <input
                    v-model.number="form.confidenceLevel"
                    type="range"
                    min="0.85"
                    max="0.99"
                    step="0.01"
                    class="w-full"
                  />
                  <div class="text-xs text-gray-600 mt-1">
                    <div v-if="form.confidenceLevel >= 0.95" class="text-green-600">High confidence - strict results</div>
                    <div v-else-if="form.confidenceLevel >= 0.90" class="text-yellow-600">Medium confidence - balanced</div>
                    <div v-else class="text-blue-600">Lower confidence - faster results</div>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Min Sample Size *</label>
                  <input
                    v-model.number="form.minSampleSize"
                    type="number"
                    min="50"
                    max="5000"
                    step="50"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div class="text-xs text-gray-600 mt-1">Minimum visitors needed before testing significance</div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Target Duration (Days) *</label>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    v-for="days in [7, 14, 30]"
                    :key="days"
                    @click="form.targetDuration = days"
                    :class="[
                      'p-3 border-2 rounded-lg font-medium transition-colors',
                      form.targetDuration === days
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    ]"
                  >
                    {{ days }} days
                  </button>
                </div>
              </div>

              <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 class="font-medium text-gray-900 mb-2">Test Summary</h4>
                <div class="space-y-1 text-sm">
                  <div class="flex justify-between text-gray-700">
                    <span>Variants:</span>
                    <span class="font-medium">{{ form.variants.length + 1 }} ({{ form.variants.length }} + control)</span>
                  </div>
                  <div class="flex justify-between text-gray-700">
                    <span>Confidence Level:</span>
                    <span class="font-medium">{{ (form.confidenceLevel * 100).toFixed(0) }}%</span>
                  </div>
                  <div class="flex justify-between text-gray-700">
                    <span>Min Sample Size:</span>
                    <span class="font-medium">{{ form.minSampleSize }} visitors</span>
                  </div>
                  <div class="flex justify-between text-gray-700">
                    <span>Target Duration:</span>
                    <span class="font-medium">{{ form.targetDuration }} days</span>
                  </div>
                  <div v-if="form.taskId" class="flex justify-between text-gray-700 border-t pt-1 mt-1">
                    <span>Associated Task:</span>
                    <span class="font-medium">{{ form.taskId }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 4: Review -->
            <div v-if="currentStep === 4" class="space-y-4">
              <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                <p class="text-green-800 text-sm">
                  <strong>Ready to create test!</strong> Review your configuration below and click "Create Test" to start.
                </p>
              </div>

              <div class="space-y-4">
                <!-- Test Info -->
                <div class="border-l-4 border-blue-600 bg-blue-50 p-4 rounded">
                  <h4 class="font-bold text-gray-900 mb-2">Test Information</h4>
                  <div class="space-y-1 text-sm text-gray-700">
                    <div><strong>Name:</strong> {{ form.name }}</div>
                    <div v-if="form.description"><strong>Description:</strong> {{ form.description }}</div>
                    <div><strong>Content Type:</strong> {{ getContentTypeName(form.contentType) }}</div>
                    <div v-if="form.taskId"><strong>Associated Task:</strong> {{ form.taskId }}</div>
                  </div>
                </div>

                <!-- Variants Preview -->
                <div class="border-l-4 border-purple-600 bg-purple-50 p-4 rounded">
                  <h4 class="font-bold text-gray-900 mb-3">Variants</h4>
                  <div class="space-y-2">
                    <!-- Control -->
                    <div class="bg-white p-3 rounded border border-purple-200">
                      <div class="font-medium text-gray-900">Control: {{ form.control.name }}</div>
                      <div class="text-sm text-gray-600 mt-1 line-clamp-2">{{ form.control.value }}</div>
                    </div>

                    <!-- Variants -->
                    <div v-for="(variant, idx) in form.variants" :key="idx" class="bg-white p-3 rounded border border-purple-200">
                      <div class="font-medium text-gray-900">Variant {{ idx + 1 }}: {{ variant.name }}</div>
                      <div class="text-sm text-gray-600 mt-1 line-clamp-2">{{ variant.value }}</div>
                    </div>
                  </div>
                </div>

                <!-- Parameters -->
                <div class="border-l-4 border-green-600 bg-green-50 p-4 rounded">
                  <h4 class="font-bold text-gray-900 mb-2">Test Parameters</h4>
                  <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div class="text-gray-600">Confidence Level</div>
                      <div class="font-medium text-gray-900">{{ (form.confidenceLevel * 100).toFixed(0) }}%</div>
                    </div>
                    <div>
                      <div class="text-gray-600">Min Sample Size</div>
                      <div class="font-medium text-gray-900">{{ form.minSampleSize }} visitors</div>
                    </div>
                    <div>
                      <div class="text-gray-600">Target Duration</div>
                      <div class="font-medium text-gray-900">{{ form.targetDuration }} days</div>
                    </div>
                    <div>
                      <div class="text-gray-600">Total Variants</div>
                      <div class="font-medium text-gray-900">{{ form.variants.length + 1 }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer / Navigation -->
          <div class="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-between items-center">
            <button
              @click="previousStep"
              :disabled="currentStep === 1"
              class="px-6 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← Back
            </button>

            <div class="text-sm text-gray-600">
              Step {{ currentStep }} of {{ totalSteps }}
            </div>

            <div class="flex gap-3">
              <button
                @click="closeModal"
                class="px-6 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>

              <button
                v-if="currentStep < totalSteps"
                @click="nextStep"
                :disabled="!canProceedToNextStep"
                class="px-6 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>

              <button
                v-else
                @click="createTest"
                :disabled="isCreating"
                class="px-6 py-2 bg-green-600 text-white font-medium hover:bg-green-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <svg v-if="!isCreating" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                <span v-if="isCreating" class="inline-block animate-spin">⏳</span>
                {{ isCreating ? 'Creating...' : 'Create Test' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useABTestManager } from '@/services/aBTestManager'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  taskId: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['close', 'test-created'])

const { createTest } = useABTestManager()

const currentStep = ref(1)
const totalSteps = 4
const isCreating = ref(false)

const contentTypes = [
  { id: 'headline', name: 'Headline', description: 'Test different headlines/subject lines' },
  { id: 'image', name: 'Image', description: 'Test different images or visual elements' },
  { id: 'audience', name: 'Audience', description: 'Test targeting different audience segments' },
  { id: 'offer', name: 'Offer', description: 'Test different pricing or offer structures' }
]

const form = ref({
  name: '',
  description: '',
  contentType: 'headline',
  taskId: props.taskId || '',
  control: {
    name: 'Control',
    description: '',
    value: ''
  },
  variants: [
    {
      name: 'Variant 1',
      description: '',
      value: ''
    }
  ],
  confidenceLevel: 0.95,
  minSampleSize: 100,
  targetDuration: 14
})

/**
 * Validate current step before proceeding
 */
const canProceedToNextStep = computed(() => {
  if (currentStep.value === 1) {
    return form.value.name.trim() && form.value.contentType
  }
  if (currentStep.value === 2) {
    const controlValid = form.value.control.name && form.value.control.value
    const variantsValid = form.value.variants.every(v => v.name && v.value)
    return controlValid && variantsValid && form.value.variants.length > 0
  }
  if (currentStep.value === 3) {
    return form.value.minSampleSize > 0 && form.value.targetDuration > 0
  }
  return true
})

/**
 * Get content type name by ID
 */
const getContentTypeName = (typeId) => {
  const type = contentTypes.find(t => t.id === typeId)
  return type ? type.name : typeId
}

/**
 * Add new variant
 */
const addVariant = () => {
  if (form.value.variants.length < 5) {
    form.value.variants.push({
      name: `Variant ${form.value.variants.length + 1}`,
      description: '',
      value: ''
    })
  }
}

/**
 * Remove variant by index
 */
const removeVariant = (index) => {
  if (form.value.variants.length > 1) {
    form.value.variants.splice(index, 1)
  }
}

/**
 * Move to next step
 */
const nextStep = () => {
  if (currentStep.value < totalSteps && canProceedToNextStep.value) {
    currentStep.value++
  }
}

/**
 * Move to previous step
 */
const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

/**
 * Create the A/B test
 */
const createTest = async () => {
  isCreating.value = true

  try {
    const newTest = createTest({
      name: form.value.name,
      description: form.value.description,
      taskId: form.value.taskId,
      contentType: form.value.contentType,
      confidenceLevel: form.value.confidenceLevel,
      minSampleSize: form.value.minSampleSize,
      targetDuration: form.value.targetDuration,
      control: form.value.control,
      variants: form.value.variants
    })

    if (newTest) {
      emit('test-created', newTest)
      closeModal()
    }
  } catch (error) {
    console.error('Error creating test:', error)
  } finally {
    isCreating.value = false
  }
}

/**
 * Close the modal
 */
const closeModal = () => {
  currentStep.value = 1
  form.value = {
    name: '',
    description: '',
    contentType: 'headline',
    taskId: props.taskId || '',
    control: {
      name: 'Control',
      description: '',
      value: ''
    },
    variants: [
      {
        name: 'Variant 1',
        description: '',
        value: ''
      }
    ],
    confidenceLevel: 0.95,
    minSampleSize: 100,
    targetDuration: 14
  }
  emit('close')
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
