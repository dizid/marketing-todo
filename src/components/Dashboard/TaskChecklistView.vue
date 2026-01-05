<template>
  <div class="space-y-4">
    <!-- Accordion Task Categories -->
    <ChecklistCategory
      v-for="category in filteredCategories"
      :key="category.name"
      :category="category"
      :tasks="projectTasks"
      :initial-expanded="category.name === currentPhaseCategory"
      @task-checked="$emit('task-checked', $event)"
      @task-removed="$emit('task-removed', $event)"
      @task-opened="$emit('task-opened', $event)"
      @show-add-tasks="$emit('show-add-tasks', $event)"
    />

    <!-- Locked Tasks Teaser (for beginners) -->
    <div
      v-if="hiddenTaskCount > 0 && experienceLevel === 'beginner'"
      class="mt-6 p-4 rounded-lg bg-gray-800/50 border border-gray-700"
    >
      <div class="flex items-center gap-2 mb-2">
        <span class="text-lg">🔒</span>
        <span class="text-sm font-medium text-gray-300">
          {{ hiddenTaskCount }} more tasks available in Intermediate mode
        </span>
      </div>
      <p class="text-xs text-gray-500 mb-3">
        {{ hiddenTaskPreview.join(', ') }}{{ hiddenTaskCount > 3 ? ', and more...' : '' }}
      </p>
      <button
        @click="$emit('upgrade-to-intermediate')"
        class="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
      >
        Upgrade to Intermediate →
      </button>
    </div>
  </div>
</template>

<script setup>
/**
 * TaskChecklistView Component (Accordion UX)
 *
 * Renders task categories with accordion-style collapsible sections.
 * Current phase category is expanded by default, others collapsed.
 */

import ChecklistCategory from '../ChecklistCategory.vue'

const props = defineProps({
  filteredCategories: {
    type: Array,
    required: true
  },
  projectTasks: {
    type: Object,
    required: true
  },
  currentPhaseCategory: {
    type: String,
    default: ''
  },
  hiddenTaskCount: {
    type: Number,
    default: 0
  },
  hiddenTaskPreview: {
    type: Array,
    default: () => []
  },
  experienceLevel: {
    type: String,
    default: 'beginner'
  }
})

defineEmits(['task-checked', 'task-removed', 'task-opened', 'show-add-tasks', 'upgrade-to-intermediate'])
</script>
