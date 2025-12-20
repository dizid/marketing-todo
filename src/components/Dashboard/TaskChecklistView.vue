<template>
  <div class="space-y-4">
    <ChecklistCategory
      v-for="category in filteredCategories"
      :key="category.name"
      :category="category"
      :tasks="projectTasks"
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
 * TaskChecklistView Component
 *
 * Renders filtered task categories with ChecklistCategory components.
 * Single responsibility: Display organized task list.
 * Also shows a teaser for locked tasks when in beginner mode.
 */

import ChecklistCategory from '../ChecklistCategory.vue'

defineProps({
  filteredCategories: {
    type: Array,
    required: true
  },
  projectTasks: {
    type: Object,
    required: true
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
