<template>
  <div class="space-y-6">
    <!-- Flat Task List with Category Headers (non-collapsible) -->
    <div
      v-for="category in filteredCategories"
      :key="category.name"
      class="bg-surface rounded-lg overflow-hidden border border-border animate-fade-in-up"
    >
      <!-- Category Header (non-clickable, just visual) -->
      <div
        class="px-6 py-4 flex items-center justify-between bg-surface-light"
        style="border-bottom: 1px solid var(--cyberpunk-border)"
      >
        <div class="flex items-center gap-3">
          <span class="text-xl">{{ getCategoryIcon(category.name) }}</span>
          <h3 class="font-semibold text-lg font-display text-primary">{{ category.label }}</h3>
        </div>
        <div class="text-right flex items-center gap-3">
          <span class="text-sm font-medium text-secondary">
            {{ getCategoryCompletedCount(category) }}/{{ getCategoryActiveCount(category) }}
          </span>
          <div class="w-20 h-2 bg-surface border border-border rounded overflow-hidden">
            <div
              class="h-full transition-all duration-300"
              style="background: linear-gradient(90deg, var(--cyberpunk-primary), var(--cyberpunk-accent))"
              :style="{ width: getCategoryProgress(category) + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Tasks in this category (sorted: incomplete first, completed dimmed at bottom) -->
      <div class="divide-y" style="divide-color: var(--cyberpunk-border)">
        <div
          v-for="item in getSortedItems(category)"
          :key="item.id"
          :class="{ 'opacity-60': projectTasks[item.id]?.checked }"
        >
          <ChecklistItem
            :item="item"
            :task-data="projectTasks[item.id] || {}"
            @task-checked="(updates) => handleTaskChecked(item.id, updates)"
            @task-removed="handleTaskRemoved(item.id)"
            @task-opened="(data) => $emit('task-opened', data)"
          />
        </div>
      </div>

      <!-- Empty State (all tasks removed) -->
      <div v-if="getSortedItems(category).length === 0" class="px-6 py-8 text-center">
        <div v-if="hasOnlyRemovedTasks(category)">
          <p class="text-sm text-muted mb-4">All tasks in this category have been archived.</p>
          <button
            @click="$emit('show-add-tasks', { categoryLabel: category.label, categoryName: category.name })"
            class="btn-highlight text-xs sm:text-sm"
          >
            + Restore Tasks
          </button>
        </div>
        <div v-else class="text-muted">
          <p>No tasks in this category</p>
        </div>
      </div>
    </div>

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
 * TaskChecklistView Component (Flattened UX)
 *
 * Renders task categories with flat, always-visible task lists.
 * No accordions - all tasks visible immediately.
 * Completed tasks sorted to bottom with reduced opacity.
 */

import ChecklistItem from '../ChecklistItem.vue'

const props = defineProps({
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

const emit = defineEmits(['task-checked', 'task-removed', 'task-opened', 'show-add-tasks', 'upgrade-to-intermediate'])

// Category icons for visual distinction
const getCategoryIcon = (categoryName) => {
  const icons = {
    setup: '⚙️',
    social: '📱',
    content: '✍️',
    acquisition: '🎯',
    feedback: '💬',
    analytics: '📊',
    advertising: '📢',
    sales: '💰',
    growth: '🚀'
  }
  return icons[categoryName] || '📋'
}

// Get visible (non-removed) items sorted: incomplete first, completed at bottom
const getSortedItems = (category) => {
  const visibleItems = category.items.filter(item => !props.projectTasks[item.id]?.removed)

  // Sort: unchecked first, checked at bottom
  return visibleItems.sort((a, b) => {
    const aChecked = props.projectTasks[a.id]?.checked || false
    const bChecked = props.projectTasks[b.id]?.checked || false
    if (aChecked === bChecked) return 0
    return aChecked ? 1 : -1
  })
}

// Check if category has only removed tasks
const hasOnlyRemovedTasks = (category) => {
  const visibleCount = category.items.filter(item => !props.projectTasks[item.id]?.removed).length
  const removedCount = category.items.filter(item => props.projectTasks[item.id]?.removed).length
  return visibleCount === 0 && removedCount > 0
}

// Category progress calculations
const getCategoryActiveCount = (category) => {
  return category.items.filter(item => !props.projectTasks[item.id]?.removed).length
}

const getCategoryCompletedCount = (category) => {
  return category.items.filter(
    item => !props.projectTasks[item.id]?.removed && props.projectTasks[item.id]?.checked
  ).length
}

const getCategoryProgress = (category) => {
  const total = getCategoryActiveCount(category)
  if (total === 0) return 0
  return (getCategoryCompletedCount(category) / total) * 100
}

// Event handlers
const handleTaskChecked = (taskId, updates) => {
  const newTaskData = JSON.parse(JSON.stringify(props.projectTasks))
  newTaskData[taskId] = {
    ...newTaskData[taskId],
    ...updates
  }
  emit('task-checked', newTaskData)
}

const handleTaskRemoved = (taskId) => {
  emit('task-removed', { taskId })
}
</script>
