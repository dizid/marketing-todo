<template>
  <div class="bg-white rounded-xl shadow-lg p-8">
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">🚀 What are you launching?</h2>
      <p class="text-gray-600">This helps us personalize your marketing plan</p>
    </div>

    <!-- Product type selection -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">Choose your product type:</label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          v-for="type in productTypes"
          :key="type.value"
          @click="selectProductType(type.value)"
          :class="[
            'p-4 border-2 rounded-lg text-left transition hover:border-indigo-400',
            wizardData.productType === type.value
              ? 'border-indigo-600 bg-indigo-50'
              : 'border-gray-200 bg-white'
          ]"
        >
          <div class="text-2xl mb-2">{{ type.icon }}</div>
          <div class="font-medium text-gray-900">{{ type.label }}</div>
        </button>
      </div>
    </div>

    <!-- Product name -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">What's it called?</label>
      <input
        v-model="wizardData.productName"
        type="text"
        placeholder="My Awesome Product"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
        @input="onboardingStore.saveToStorage()"
      />
    </div>

    <!-- Product description (optional) -->
    <div class="mb-8">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        One-line description
        <span class="text-gray-400 font-normal">(optional)</span>
      </label>
      <input
        v-model="wizardData.productDescription"
        type="text"
        placeholder="A tool that helps..."
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
        @input="onboardingStore.saveToStorage()"
      />
    </div>

    <!-- Navigation -->
    <div class="flex justify-end">
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
        Next: Tell us more →
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

const productTypes = [
  { value: 'mobile_app', label: 'Mobile App', icon: '📱' },
  { value: 'saas', label: 'SaaS Product', icon: '💻' },
  { value: 'ecommerce', label: 'E-commerce Store', icon: '🛒' },
  { value: 'game', label: 'Indie Game', icon: '🎮' },
  { value: 'digital_product', label: 'Digital Product', icon: '📚' },
  { value: 'other', label: 'Other', icon: '🔧' }
]

const selectProductType = (type) => {
  onboardingStore.updateField('productType', type)
}

const handleNext = () => {
  if (isStepValid.value) {
    onboardingStore.nextStep()
  }
}
</script>
