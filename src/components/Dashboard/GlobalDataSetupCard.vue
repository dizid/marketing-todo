<template>
  <div class="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
    <div class="flex items-center justify-between mb-2">
      <h3 class="font-semibold text-indigo-900">Project Setup</h3>
      <span class="text-sm font-semibold text-indigo-700">{{ completionPercentage }}%</span>
    </div>

    <div class="w-full bg-indigo-200 rounded-full h-2 mb-2">
      <div
        class="bg-indigo-600 h-2 rounded-full transition-all duration-300"
        :style="{ width: completionPercentage + '%' }"
      ></div>
    </div>

    <p class="text-sm text-indigo-700 mb-3">
      {{ completionMessage }}
    </p>

    <router-link
      v-if="completionPercentage < 100"
      to="/setup"
      class="inline-block px-3 py-1 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 transition"
    >
      Complete Setup
    </router-link>
    <span v-else class="inline-block px-3 py-1 bg-green-600 text-white text-sm font-medium rounded">
      ✓ Setup Complete
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

defineProps({
  completionPercentage: {
    type: Number,
    default: 0
  }
})

const completionMessage = computed(() => {
  if (completionPercentage.value === 0) {
    return 'Start by filling out your project basics to unlock features across all tasks.'
  } else if (completionPercentage.value < 100) {
    return `Complete your setup (${completionPercentage.value}% done). Your data will auto-fill tasks.`
  } else {
    return 'Great! Your project setup is complete. Data will auto-fill in all task forms.'
  }
})
</script>

<style scoped>
</style>
