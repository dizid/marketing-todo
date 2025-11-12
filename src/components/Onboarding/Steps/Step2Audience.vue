<template>
  <div class="bg-white rounded-xl shadow-lg p-8">
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">🎯 Who's your ideal customer?</h2>
      <p class="text-gray-600">Be specific - this powers your AI marketing assistant</p>
    </div>

    <!-- Target audience input -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">Describe in one sentence:</label>
      <textarea
        v-model="wizardData.targetAudience"
        rows="3"
        placeholder="Example: Freelance designers who need client contracts"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
        @input="onboardingStore.saveToStorage()"
      ></textarea>
      <p class="text-sm text-gray-500 mt-2">
        💡 Tip: Include who they are, what problem they have, and their context
      </p>
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
        Next: Your Goals →
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

const handleNext = () => {
  if (isStepValid.value) {
    onboardingStore.nextStep()
  }
}
</script>
