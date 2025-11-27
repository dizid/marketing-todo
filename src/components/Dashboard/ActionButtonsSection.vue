<template>
  <div class="card mt-8 flex flex-wrap gap-3">
    <button
      @click="$emit('export')"
      class="btn-primary"
    >
      📄 Export as Markdown
    </button>
    <button
      @click="$emit('reset')"
      class="btn-accent ml-auto"
    >
      🔄 Reset All Tasks
    </button>
  </div>
</template>

<script setup>
/**
 * ActionButtonsSection Component
 *
 * Provides action buttons for export and reset operations.
 * Single responsibility: Button UI and event emission.
 */

defineEmits(['export', 'reset'])
</script>
