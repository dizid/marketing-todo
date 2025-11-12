<template>
  <div class="bg-white rounded-xl shadow-lg p-8">
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">💰 What's your main goal?</h2>
      <p class="text-gray-600">This helps us prioritize your tasks by impact</p>
    </div>

    <!-- Goal selection -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">Select your primary goal:</label>
      <div class="space-y-2">
        <button
          v-for="goal in goals"
          :key="goal.value"
          @click="selectGoal(goal.value)"
          :class="[
            'w-full p-4 border-2 rounded-lg text-left transition hover:border-indigo-400',
            wizardData.mainGoal === goal.value
              ? 'border-indigo-600 bg-indigo-50'
              : 'border-gray-200 bg-white'
          ]"
        >
          <div class="font-medium text-gray-900">{{ goal.label }}</div>
        </button>
      </div>
    </div>

    <!-- Timeline selection -->
    <div class="mb-8">
      <label class="block text-sm font-medium text-gray-700 mb-3">When do you want to achieve this?</label>
      <div class="space-y-2">
        <button
          v-for="time in timelines"
          :key="time.value"
          @click="selectTimeline(time.value)"
          :class="[
            'w-full p-3 border-2 rounded-lg text-left transition hover:border-indigo-400',
            wizardData.timeline === time.value
              ? 'border-indigo-600 bg-indigo-50'
              : 'border-gray-200 bg-white'
          ]"
        >
          {{ time.label }}
        </button>
      </div>
    </div>

    <!-- Navigation -->
    <div class="flex justify-between">
      <button
        @click="onboardingStore.prevStep()"
        class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition"
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
        Next: Optional Details →
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useOnboardingStore } from '@/stores/onboardingStore'

const onboardingStore = useOnboardingStore()
const wizardData = computed(() => onboardingStore.wizardData)
const isStepValid = computed(() => onboardingStore.isStepValid)

const goals = [
  { value: 'first_100', label: '💵 Make my first $100' },
  { value: '1k_mrr', label: '🚀 Get to $1K MRR' },
  { value: '10k_mrr', label: '📈 Grow to $10K MRR' },
  { value: 'audience', label: '👥 Build an audience' },
  { value: 'validate', label: '🎯 Validate my idea' }
]

const timelines = [
  { value: '1_month', label: 'In 1 month' },
  { value: '3_months', label: 'In 3 months' },
  { value: '6_months', label: 'In 6 months' },
  { value: 'no_timeline', label: 'No specific timeline' }
]

const selectGoal = (goal) => {
  onboardingStore.updateField('mainGoal', goal)
}

const selectTimeline = (timeline) => {
  onboardingStore.updateField('timeline', timeline)
}

const handleNext = () => {
  if (isStepValid.value) {
    onboardingStore.nextStep()
  }
}
</script>
