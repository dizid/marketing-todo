<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-start justify-center p-4 py-8">
    <!-- Main wizard container -->
    <div class="w-full max-w-2xl">
      <!-- Progress bar -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-gray-600">Step {{ currentStep }} of 6</span>
          <span class="text-sm font-medium text-indigo-600">{{ progressPercentage }}% complete</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
      </div>

      <!-- Step content with transition -->
      <transition name="slide" mode="out-in">
        <component
          :is="currentStepComponent"
          :key="currentStep"
        />
      </transition>

      <!-- Navigation buttons (inside components for flexibility) -->
    </div>

    <!-- Restore previous session modal -->
    <div
      v-if="showRestoreModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click.self="showRestoreModal = false"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-xl font-bold text-gray-900 mb-2">Welcome back! 👋</h3>
        <p class="text-gray-600 mb-6">
          You started planning your launch before. Want to continue where you left off?
        </p>
        <div class="flex gap-3">
          <button
            @click="continueWizard"
            class="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
          >
            Continue
          </button>
          <button
            @click="startFresh"
            class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition"
          >
            Start Fresh
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useOnboardingStore } from '@/stores/onboardingStore'

// Import step components
import Step1ProductType from './Steps/Step1ProductType.vue'
import StepExperience from './Steps/StepExperience.vue'
import Step2Audience from './Steps/Step2Audience.vue'
import Step3Goals from './Steps/Step3Goals.vue'
import Step4Details from './Steps/Step4Details.vue'
import Step5Signup from './Steps/Step5Signup.vue'

const onboardingStore = useOnboardingStore()
const showRestoreModal = ref(false)

const currentStep = computed(() => onboardingStore.currentStep)
const progressPercentage = computed(() => onboardingStore.progressPercentage)

const currentStepComponent = computed(() => {
  const components = {
    1: Step1ProductType,
    2: StepExperience,
    3: Step2Audience,
    4: Step3Goals,
    5: Step4Details,
    6: Step5Signup
  }
  return components[currentStep.value] || Step1ProductType
})

const continueWizard = () => {
  showRestoreModal.value = false
}

const startFresh = () => {
  onboardingStore.clearWizard()
  showRestoreModal.value = false
}

onMounted(() => {
  // Check if there's saved wizard data
  const hasSavedData = localStorage.getItem('onboarding_wizard_data')
  if (hasSavedData && onboardingStore.currentStep > 1) {
    showRestoreModal.value = true
  }
})
</script>

<style scoped>
/* Slide transition */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
