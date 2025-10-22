<template>
  <!-- Checklist Category Component
       Accordion-style category container with expandable task items
       Features: Task list, checkboxes, notes, progress indicator
  -->
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <!-- Category Header / Toggle -->
    <button
      @click="isExpanded = !isExpanded"
      class="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white transition"
    >
      <div class="flex items-center gap-4">
        <svg
          class="w-6 h-6 transition-transform"
          :class="{ 'rotate-90': isExpanded }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
        <div class="text-left">
          <h3 class="font-semibold text-lg">{{ category.label }}</h3>
        </div>
      </div>
      <div class="text-right">
        <span class="text-sm font-medium">
          {{ categoryCompletedCount }}/{{ category.items.length }}
        </span>
        <div class="w-24 h-2 bg-indigo-400 rounded-full mt-2 overflow-hidden">
          <div
            class="h-full bg-white transition-all duration-300"
            :style="{ width: categoryProgressPercentage + '%' }"
          ></div>
        </div>
      </div>
    </button>

    <!-- Category Items (Expanded) -->
    <div v-if="isExpanded" class="divide-y divide-gray-200">
      <ChecklistItem
        v-for="item in category.items"
        :key="item.id"
        :item="item"
        :task-data="tasks[item.id] || {}"
        @task-checked="(updates) => updateTask(item.id, updates)"
        @notes-updated="(updates) => updateTask(item.id, updates)"
      />
    </div>

    <!-- Empty State -->
    <div v-if="isExpanded && category.items.length === 0" class="px-6 py-8 text-center text-gray-500">
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
const emit = defineEmits(['task-checked', 'notes-updated'])

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
 * Computed: Count of completed tasks in this category
 */
const categoryCompletedCount = computed(() => {
  return props.category.items.filter(item => props.tasks[item.id]?.checked).length
})

/**
 * Computed: Progress percentage for this category
 */
const categoryProgressPercentage = computed(() => {
  if (props.category.items.length === 0) return 0
  return (categoryCompletedCount.value / props.category.items.length) * 100
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
