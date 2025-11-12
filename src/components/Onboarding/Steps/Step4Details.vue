<template>
  <div class="bg-white rounded-xl shadow-lg p-8">
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">🔧 A few more details</h2>
      <p class="text-gray-600">Optional - skip this if you want to start right away!</p>
    </div>

    <!-- Team size -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">Team size:</label>
      <select
        v-model="wizardData.teamSize"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
        @change="onboardingStore.saveToStorage()"
      >
        <option value="solo">Just me</option>
        <option value="2-5">2-5 people</option>
        <option value="6-10">6-10 people</option>
        <option value="10+">10+ people</option>
      </select>
    </div>

    <!-- Current stage -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">Current stage:</label>
      <select
        v-model="wizardData.currentStage"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
        @change="onboardingStore.saveToStorage()"
      >
        <option value="idea">Just an idea</option>
        <option value="building">Building</option>
        <option value="beta">In beta</option>
        <option value="launched">Already launched</option>
      </select>
    </div>

    <!-- Budget -->
    <div class="mb-8">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Marketing budget (optional):
      </label>
      <div class="relative">
        <span class="absolute left-4 top-3 text-gray-500">$</span>
        <input
          v-model.number="wizardData.budget"
          type="number"
          placeholder="0"
          class="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          @input="onboardingStore.saveToStorage()"
        />
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
      <div class="flex gap-3">
        <button
          @click="onboardingStore.nextStep()"
          class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition"
        >
          Skip →
        </button>
        <button
          @click="onboardingStore.nextStep()"
          class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
        >
          Save & Next →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useOnboardingStore } from '@/stores/onboardingStore'

const onboardingStore = useOnboardingStore()
const wizardData = computed(() => onboardingStore.wizardData)
</script>
