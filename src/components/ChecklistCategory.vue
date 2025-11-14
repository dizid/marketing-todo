<template>
  <!-- Checklist Category Component
       Accordion-style category container with expandable task items
       Features: Task list, checkboxes, notes, progress indicator
  -->
  <div class="bg-surface rounded-0 overflow-hidden border border-border animate-fade-in-up">
    <!-- Category Header / Toggle -->
    <button
      @click="isExpanded = !isExpanded"
      class="w-full px-6 py-4 flex items-center justify-between bg-surface-light hover:bg-surface hover:border-l-4 hover:border-primary transition border-l-4 border-border"
      style="border-bottom: 1px solid var(--cyberpunk-border)"
    >
      <div class="flex items-center gap-4">
        <svg
          class="w-6 h-6 transition-transform text-primary"
          :class="{ 'rotate-90': isExpanded }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
        <div class="text-left">
          <h3 class="font-semibold text-lg font-display text-primary">{{ category.label }}</h3>
        </div>
      </div>
      <div class="text-right">
        <span class="text-sm font-medium text-secondary">
          {{ categoryCompletedCount }}/{{ activeCategoryCount }}
        </span>
        <div class="w-24 h-2 bg-surface border border-border rounded-0 mt-2 overflow-hidden">
          <div
            class="h-full transition-all duration-300"
            style="background: linear-gradient(90deg, var(--cyberpunk-primary), var(--cyberpunk-accent))"
            :style="{ width: categoryProgressPercentage + '%' }"
          ></div>
        </div>
      </div>
    </button>

    <!-- Category Items (Expanded) -->
    <div v-if="isExpanded" class="divide-y" style="divide-color: var(--cyberpunk-border)">
      <ChecklistItem
        v-for="item in category.items.filter(i => !tasks[i.id]?.removed)"
        :key="item.id"
        :item="item"
        :task-data="tasks[item.id] || {}"
        @task-checked="(updates) => updateTask(item.id, updates)"
        @notes-updated="(updates) => updateTask(item.id, updates)"
        @task-removed="(data) => removeTask(item.id)"
        @task-opened="(data) => emit('task-opened', data)"
      />
    </div>

    <!-- Empty State -->
    <div v-if="isExpanded && category.items.length === 0" class="px-6 py-8 text-center text-muted">
      <p>No items to display</p>
    </div>
  </div>
</template>

<script setup>
/**
 * ChecklistCategory Component
 *
 * Renders an expandable category section with:
 * - Category header with progress indicator
 * - List of checklist items
 * - Completion tracking
 * - Task state management
 */

import { ref, computed } from 'vue'
import ChecklistItem from './ChecklistItem.vue'

// Props
const props = defineProps({
  category: {
    type: Object,
    required: true
  },
  tasks: {
    type: Object,
    default: () => ({})
  }
})

// Emits
const emit = defineEmits(['task-checked', 'notes-updated', 'task-removed', 'task-opened'])

// State
const isExpanded = ref(false)

/**
 * Update task state and emit changes
 */
const updateTask = (taskId, updates) => {
  const newTaskData = JSON.parse(JSON.stringify(props.tasks))
  newTaskData[taskId] = {
    ...newTaskData[taskId],
    ...updates
  }

  // Emit the entire updated tasks object back to parent
  if (updates.checked !== undefined) {
    emit('task-checked', newTaskData)
  }
  if (updates.notes !== undefined) {
    emit('notes-updated', newTaskData)
  }
}

/**
 * Remove task from project
 */
const removeTask = (taskId) => {
  emit('task-removed', { taskId })
}

/**
 * Computed: Count of completed tasks in this category (excluding removed)
 */
const categoryCompletedCount = computed(() => {
  return props.category.items.filter(
    item => !props.tasks[item.id]?.removed && props.tasks[item.id]?.checked
  ).length
})

/**
 * Computed: Count of active (non-removed) tasks in this category
 */
const activeCategoryCount = computed(() => {
  return props.category.items.filter(
    item => !props.tasks[item.id]?.removed
  ).length
})

/**
 * Computed: Progress percentage for this category (only for active tasks)
 */
const categoryProgressPercentage = computed(() => {
  if (activeCategoryCount.value === 0) return 0
  return (categoryCompletedCount.value / activeCategoryCount.value) * 100
})
</script>

<style scoped>
/* Smooth transitions and animations */
.rotate-90 {
  transform: rotate(90deg);
}

button {
  transition: all 0.2s ease-in-out;
}
</style>
