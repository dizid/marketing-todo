<template>
  <div class="bg-surface border-2 border-primary p-5 hover:border-primary-glow hover:shadow-lg transition">
    <!-- Task Header with Impact/Effort Indicators -->
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1">
        <h4 class="text-base font-bold font-display text-text">{{ index + 1 }}. {{ task.title }}</h4>
      </div>
      <div class="flex gap-2 ml-3 flex-wrap justify-end">
        <!-- Impact Badge -->
        <span
          :class="[
            'badge text-xs font-bold px-3 py-1 whitespace-nowrap',
            task.impact === 'High'
              ? 'badge-accent'
              : task.impact === 'Medium'
                ? 'badge-highlight'
                : 'badge-primary'
          ]"
        >
          📊 Impact: {{ task.impact }}
        </span>
        <!-- Effort Badge -->
        <span
          :class="[
            'badge text-xs font-bold px-3 py-1 whitespace-nowrap',
            task.effort === 'High'
              ? 'border-accent text-accent bg-accent/10'
              : task.effort === 'Medium'
                ? 'border-highlight text-highlight bg-highlight/10'
                : 'badge-primary'
          ]"
        >
          ⚡ Effort: {{ task.effort }}
        </span>
      </div>
    </div>

    <!-- Task Details -->
    <div class="space-y-3 text-sm">
      <!-- Why Section -->
      <div v-if="task.why" class="bg-surface-light p-3 border-l-4 border-primary">
        <p class="font-semibold text-primary mb-1">💡 Why This Matters</p>
        <p class="text-secondary">{{ task.why }}</p>
      </div>

      <!-- Next Steps Section -->
      <div v-if="task.nextSteps" class="bg-surface-light p-3 border-l-4 border-highlight">
        <p class="font-semibold text-highlight mb-1">✅ Next Steps</p>
        <p class="text-secondary">{{ task.nextSteps }}</p>
      </div>
    </div>

    <!-- ROI Indicator -->
    <div class="mt-3 pt-3 border-t border-border">
      <p class="text-xs text-secondary">
        <strong>Expected Outcome:</strong>
        <span
          :class="{
            'text-highlight font-semibold': task.impact === 'High' && task.effort === 'Low',
            'text-primary font-semibold': task.impact !== 'High' || task.effort !== 'Low'
          }"
        >
          {{
            task.impact === 'High' && task.effort === 'Low'
              ? '🚀 Quick Win - High ROI'
              : task.impact === 'High' && task.effort === 'Medium'
                ? '⭐ Recommended Priority'
                : task.impact === 'High' && task.effort === 'High'
                  ? '💎 Strategic Investment'
                  : '📌 Lower Priority'
          }}
        </span>
      </p>
    </div>
  </div>
</template>

<script setup>
/**
 * PriorityTaskCard Component
 *
 * Displays a single priority task with impact/effort indicators.
 * Single responsibility: Render task card UI.
 */

defineProps({
  index: {
    type: Number,
    required: true
  },
  task: {
    type: Object,
    required: true
  }
})
</script>
