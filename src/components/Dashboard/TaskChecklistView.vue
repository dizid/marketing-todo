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
    />
  </div>
</template>

<script setup>
/**
 * TaskChecklistView Component
 *
 * Renders filtered task categories with ChecklistCategory components.
 * Single responsibility: Display organized task list.
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
  }
})

defineEmits(['task-checked', 'task-removed', 'task-opened'])
</script>
