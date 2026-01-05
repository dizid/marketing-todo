<template>
  <div class="card mt-8 border-primary-glow animate-fade-in-up">
    <div class="flex justify-between items-start mb-6 flex-col sm:flex-row gap-4">
      <div>
        <h2 class="text-2xl font-bold font-display text-primary mb-2">📊 Executive Summary & Priority Tasks</h2>
        <p class="text-secondary text-sm">
          AI-powered strategic analysis with 3-5 priority quick-win tasks customized for your project
        </p>
      </div>
      <button
        @click="$emit('generate')"
        :disabled="isGenerating"
        class="btn-primary whitespace-nowrap"
      >
        {{ isGenerating ? '⏳ Generating...' : '🎯 Generate Summary' }}
      </button>
    </div>

    <div v-if="error" class="mb-4 p-4 bg-accent/20 border border-accent rounded">
      <p class="text-sm text-accent">{{ error }}</p>
    </div>

    <div v-if="summary" class="space-y-6">
      <!-- Executive Summary Card -->
      <div class="bg-surface-light border-l-4 border-primary p-6">
        <h3 class="text-lg font-bold font-display text-primary mb-4 flex items-center">
          <span class="text-2xl mr-3">📈</span> Project Status Summary
        </h3>
        <div class="prose prose-sm max-w-none text-text whitespace-pre-wrap text-base leading-relaxed">
          {{ summary.summary }}
        </div>
      </div>

      <!-- Priority Tasks -->
      <div v-if="summary.tasks && summary.tasks.length > 0">
        <h3 class="text-lg font-bold font-display text-primary mb-4 flex items-center">
          <span class="text-2xl mr-3">🎯</span> Priority Quick-Win Tasks
        </h3>
        <p class="text-secondary text-sm mb-4">
          {{ summary.tasks.length }} actionable tasks ranked by impact and effort
        </p>
        <div class="space-y-4">
          <PriorityTaskCard
            v-for="(task, idx) in summary.tasks"
            :key="idx"
            :index="idx"
            :task="task"
          />
        </div>
      </div>
    </div>

    <div v-if="!summary && !isGenerating" class="text-muted text-sm italic">
      Click "Generate Summary" to get an AI-powered analysis of your project with priority tasks
    </div>
  </div>
</template>

<script setup>
/**
 * ExecutiveSummarySection Component
 *
 * Displays AI-powered executive summary and priority tasks.
 * Single responsibility: Show summary UI and handle generation events.
 */

import PriorityTaskCard from './PriorityTaskCard.vue'

defineProps({
  summary: {
    type: Object,
    default: null
  },
  isGenerating: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

defineEmits(['generate'])
</script>
