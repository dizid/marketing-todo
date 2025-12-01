<template>
  <div class="field-with-inheritance">
    <!-- Label with inheritance indicator -->
    <div class="field-label-wrapper">
      <label :for="fieldId" class="field-label">
        {{ label }}
        <span v-if="isRequired" class="required">*</span>
      </label>

      <!-- Inheritance badge -->
      <div v-if="inheritanceInfo" class="inheritance-badge" :class="inheritanceInfo.source">
        <svg class="inheritance-icon" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 2a1 1 0 011 1v3a1 1 0 11-2 0V3a1 1 0 011-1zM4.293 6.293a1 1 0 011.414 0L7.586 8.172A3 3 0 0010 8a3 3 0 012.414 1.172l1.879-1.879a1 1 0 011.414 1.414l-1.879 1.879A3 3 0 0113 11a3 3 0 010 6 3 3 0 01-2.414-1.172l-1.879 1.879a1 1 0 01-1.414-1.414l1.879-1.879A3 3 0 0110 14a3 3 0 01-2.414-1.172l-1.879 1.879a1 1 0 01-1.414-1.414l1.879-1.879A3 3 0 017 11a3 3 0 010-6 3 3 0 012.414 1.172l1.879-1.879a1 1 0 010-1.414 1 1 0 00-1.414 0L7.586 4.414A3 3 0 015 3a3 3 0 00-3 3 3 3 0 013 3z"/>
        </svg>
        <span class="badge-text">
          <span v-if="inheritanceInfo.source === 'inherited'" class="inherited-label">
            Inherited from {{ inheritanceInfo.sourceTask }}
          </span>
          <span v-else-if="inheritanceInfo.source === 'override'" class="override-label">
            Custom override
          </span>
          <span v-else class="default-label">
            Default value
          </span>
        </span>
        <button
          v-if="inheritanceInfo.source === 'inherited'"
          type="button"
          class="badge-action"
          @click="toggleOverride"
          :title="isOverridden ? 'Use inherited value' : 'Create custom override'"
        >
          {{ isOverridden ? 'Revert' : 'Override' }}
        </button>
        <button
          v-else-if="inheritanceInfo.source === 'override'"
          type="button"
          class="badge-action"
          @click="toggleOverride"
          title="Use inherited value"
        >
          Use Inherited
        </button>
      </div>
    </div>

    <!-- Help text -->
    <p v-if="description" class="field-description">
      {{ description }}
    </p>

    <!-- Main input field (rendered by parent or slot) -->
    <slot></slot>

    <!-- Inheritance info section -->
    <div v-if="inheritanceInfo && inheritanceInfo.source === 'inherited' && !isOverridden" class="inheritance-info">
      <svg class="info-icon" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
      </svg>
      <div class="info-content">
        <p class="info-text">
          This value is inherited from <strong>{{ inheritanceInfo.sourceTask }}</strong>.
          Click "Override" to create a task-specific variation.
        </p>
        <p v-if="inheritanceInfo.sourceTask" class="info-link">
          ← Value: <code>{{ displayValue }}</code>
        </p>
      </div>
    </div>

    <!-- Override warning section -->
    <div v-else-if="isOverridden" class="override-warning">
      <svg class="warning-icon" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
      </svg>
      <div class="warning-content">
        <p class="warning-text">
          You've created a custom override. This value will be different from the source.
        </p>
        <button
          type="button"
          class="warning-action"
          @click="syncFromSource"
        >
          Sync from {{ inheritanceInfo.sourceTask }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface InheritanceInfo {
  source: 'inherited' | 'override' | 'default'
  sourceTask: string
  sourceValue: any
}

interface Props {
  fieldId: string
  label: string
  description?: string
  value: any
  inheritanceInfo?: InheritanceInfo
  isRequired?: boolean
  displayValue?: string
}

interface Emits {
  (e: 'toggle-override', override: boolean): void
  (e: 'sync-from-source'): void
}

const props = withDefaults(defineProps<Props>(), {
  isRequired: false,
  displayValue: ''
})

const emit = defineEmits<Emits>()

const isOverridden = ref(false)

const toggleOverride = () => {
  isOverridden.value = !isOverridden.value
  emit('toggle-override', isOverridden.value)
}

const syncFromSource = () => {
  isOverridden.value = false
  emit('sync-from-source')
}
</script>

<style scoped>
.field-with-inheritance {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-label-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.field-label {
  font-weight: 500;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.required {
  color: #dc2626;
  font-weight: bold;
}

.inheritance-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: #f0f9ff;
  border: 1px solid #bfdbfe;
}

.inheritance-badge.inherited {
  background-color: #dbeafe;
  border-color: #7dd3fc;
  color: #0369a1;
}

.inheritance-badge.override {
  background-color: #fef3c7;
  border-color: #fde68a;
  color: #92400e;
}

.inheritance-badge.default {
  background-color: #f3e8ff;
  border-color: #e9d5ff;
  color: #6b21a8;
}

.inheritance-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.badge-text {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.inherited-label,
.override-label,
.default-label {
  font-size: 0.75rem;
}

.badge-action {
  margin-left: 0.5rem;
  padding: 0.25rem 0.5rem;
  border: none;
  background-color: rgba(255, 255, 255, 0.5);
  color: inherit;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.badge-action:hover {
  background-color: rgba(255, 255, 255, 0.8);
}

.field-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.inheritance-info {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  background-color: #e0f2fe;
  border: 1px solid #7dd3fc;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #0369a1;
}

.info-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-text {
  margin: 0;
  line-height: 1.5;
}

.info-link {
  margin: 0;
  font-family: monospace;
  font-size: 0.8rem;
  word-break: break-all;
  opacity: 0.8;
}

.override-warning {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  background-color: #fef3c7;
  border: 1px solid #fde68a;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #92400e;
}

.warning-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.warning-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.warning-text {
  margin: 0;
  line-height: 1.5;
}

.warning-action {
  align-self: flex-start;
  padding: 0.5rem 0.75rem;
  background-color: #f59e0b;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.warning-action:hover {
  background-color: #d97706;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .field-label {
    color: #f3f4f6;
  }

  .field-description {
    color: #d1d5db;
  }

  .inheritance-badge {
    background-color: #0f172a;
    border-color: #1e3a8a;
  }

  .inheritance-badge.inherited {
    background-color: #082f49;
    border-color: #0369a1;
    color: #7dd3fc;
  }

  .inheritance-badge.override {
    background-color: #3f3621;
    border-color: #92400e;
    color: #fde68a;
  }

  .inheritance-badge.default {
    background-color: #2d1b4e;
    border-color: #6b21a8;
    color: #e9d5ff;
  }

  .inheritance-info {
    background-color: #082f49;
    border-color: #0369a1;
    color: #7dd3fc;
  }

  .override-warning {
    background-color: #3f3621;
    border-color: #92400e;
    color: #fde68a;
  }
}
</style>
