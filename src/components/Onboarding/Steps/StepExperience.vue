<template>
  <div class="bg-white rounded-xl shadow-lg p-8">
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">How experienced are you with marketing?</h2>
      <p class="text-gray-600">We'll customize your experience based on your level</p>
    </div>

    <!-- Experience level selection -->
    <div class="mb-8">
      <div class="space-y-4">
        <button
          v-for="level in experienceLevels"
          :key="level.value"
          @click="selectExperienceLevel(level.value)"
          :class="[
            'w-full p-5 border-2 rounded-xl text-left transition hover:border-indigo-400',
            wizardData.experienceLevel === level.value
              ? 'border-indigo-600 bg-indigo-50'
              : 'border-gray-200 bg-white'
          ]"
        >
          <div class="flex items-start gap-4">
            <div class="text-3xl">{{ level.icon }}</div>
            <div class="flex-1">
              <div class="font-semibold text-gray-900 text-lg mb-1">{{ level.label }}</div>
              <div class="text-gray-600 text-sm mb-2">{{ level.description }}</div>
              <div class="flex flex-wrap gap-2 mt-3">
                <span
                  v-for="feature in level.features"
                  :key="feature"
                  class="text-xs px-2 py-1 rounded-full"
                  :class="wizardData.experienceLevel === level.value ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'"
                >
                  {{ feature }}
                </span>
              </div>
            </div>
            <div
              v-if="wizardData.experienceLevel === level.value"
              class="text-indigo-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Info box -->
    <div class="bg-blue-50 rounded-lg p-4 mb-8">
      <div class="flex items-start gap-3">
        <div class="text-blue-500 mt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="text-sm text-blue-800">
          <span class="font-medium">You can change this later.</span>
          As you complete tasks, we'll suggest when you're ready to level up.
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <div class="flex justify-between">
      <button
        @click="handleBack"
        class="px-6 py-3 rounded-lg font-medium transition text-gray-600 hover:bg-gray-100"
      >
        ← Back
      </button>
      <button
        @click="handleNext"
        :disabled="!isStepValid"
        :class="[
          'px-6 py-3 rounded-lg font-medium transition',
          isStepValid
            ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        ]"
      >
        Next: Your Audience →
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useOnboardingStore } from '@/stores/onboardingStore'

const onboardingStore = useOnboardingStore()
const wizardData = computed(() => onboardingStore.wizardData)

const experienceLevels = [
  {
    value: 'beginner',
    label: 'Beginner',
    icon: '🌱',
    description: "I'm new to marketing or just getting started with my product",
    features: ['10 essential tasks', 'Guided experience', 'Focus on fundamentals']
  },
  {
    value: 'intermediate',
    label: 'Intermediate',
    icon: '🚀',
    description: 'I have some marketing experience and want access to more tools',
    features: ['24 tasks', 'Analytics & optimization', 'All 4 marketing phases']
  }
]

const isStepValid = computed(() => {
  return !!wizardData.value.experienceLevel
})

const selectExperienceLevel = (level) => {
  onboardingStore.updateField('experienceLevel', level)
}

const handleBack = () => {
  onboardingStore.prevStep()
}

const handleNext = () => {
  if (isStepValid.value) {
    onboardingStore.nextStep()
  }
}
</script>
