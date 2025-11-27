<template>
  <div class="card mb-6 animate-fade-in-up">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-lg font-semibold font-display text-primary">Overall Progress</h3>
      <span class="text-3xl font-bold text-highlight">{{ percentage }}%</span>
    </div>
    <!-- Progress Bar -->
    <div class="w-full bg-surface-light h-2 overflow-hidden border border-border">
      <div
        class="h-full transition-all duration-500"
        :style="{
          background: 'linear-gradient(90deg, var(--cyberpunk-primary), var(--cyberpunk-accent))',
          width: percentage + '%'
        }"
      ></div>
    </div>
    <p class="text-sm text-secondary mt-4">
      {{ completed }} of {{ total }} tasks completed
    </p>
  </div>
</template>

<script setup>
/**
 * ProgressCard Component
 *
 * Displays overall project progress with visual progress bar.
 * Single responsibility: Show progress metrics only.
 */

defineProps({
  percentage: {
    type: Number,
    required: true
  },
  completed: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
})
</script>
