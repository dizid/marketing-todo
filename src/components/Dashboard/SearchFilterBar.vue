<template>
  <div class="card mb-6 animate-fade-in-up">
    <h3 class="text-lg font-semibold font-display text-primary mb-6">Search & Filter</h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Search Input -->
      <div>
        <label class="block text-sm font-medium text-secondary mb-2">Search Tasks</label>
        <input
          :value="searchQuery"
          type="text"
          placeholder="Search by task name..."
          @input="$emit('search', $event.target.value)"
        />
      </div>

      <!-- Category Filter -->
      <div>
        <label class="block text-sm font-medium text-secondary mb-2">Filter by Category</label>
        <select
          :value="selectedCategory"
          @change="$emit('category-change', $event.target.value)"
        >
          <option value="">All Categories</option>
          <option value="setup">Setup Basics</option>
          <option value="social">Social Media Marketing</option>
          <option value="content">Content Creation</option>
          <option value="acquisition">User Acquisition & Engagement</option>
          <option value="feedback">Feedback & Iteration</option>
          <option value="analytics">Analytics & Optimization</option>
          <option value="advertising">Paid Advertising</option>
          <option value="sales">Sales Optimization</option>
          <option value="growth">Growth Strategy</option>
        </select>
      </div>

      <!-- Status Filter -->
      <div>
        <label class="block text-sm font-medium text-secondary mb-2">Filter by Status</label>
        <select
          :value="selectedStatus"
          @change="$emit('status-change', $event.target.value)"
        >
          <option value="">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * SearchFilterBar Component
 *
 * Provides search and filter UI for tasks.
 * Single responsibility: Handle user input and emit filter events.
 */

defineProps({
  searchQuery: {
    type: String,
    default: ''
  },
  selectedCategory: {
    type: String,
    default: ''
  },
  selectedStatus: {
    type: String,
    default: ''
  }
})

defineEmits(['search', 'category-change', 'status-change'])
</script>
