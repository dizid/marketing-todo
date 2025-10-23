<template>
  <!-- Task Modal Wrapper -->
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Modal Header -->
      <div class="sticky top-0 px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-white">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">
            {{ taskMetadata?.icon }} {{ taskMetadata?.name }}
          </h3>
          <p class="text-sm text-gray-600 mt-1">{{ taskMetadata?.description }}</p>
        </div>
        <button
          @click="handleClose"
          class="text-gray-500 hover:text-gray-700 text-2xl"
        >
          ✕
        </button>
      </div>

      <!-- Modal Content - Dynamic Component -->
      <div v-if="taskComponent" class="px-6 py-4">
        <Suspense>
          <template #default>
            <component
              :is="taskComponent"
              :task-id="taskId"
              :task-data="currentTaskData"
              @save="handleSave"
              @close="handleClose"
            />
          </template>
          <template #fallback>
            <div class="flex items-center justify-center py-8">
              <div class="text-center">
                <div class="animate-spin w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-2"></div>
                <p class="text-gray-600">Loading task...</p>
              </div>
            </div>
          </template>
        </Suspense>
      </div>

      <!-- Fallback: Simple Task (checkbox + notes) -->
      <div v-else class="px-6 py-4">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Notes (optional)
            </label>
            <textarea
              v-model="notes"
              placeholder="Add any notes for this task..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-vertical min-h-[100px]"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Modal Actions -->
      <div class="sticky bottom-0 px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
        <button
          @click="handleClose"
          class="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-lg transition font-medium text-sm"
        >
          Cancel
        </button>
        <button
          @click="handleSave"
          :disabled="isSaving"
          class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg transition font-medium text-sm"
        >
          {{ isSaving ? '⏳ Saving...' : '✓ Save' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * TaskModal Component
 *
 * Generic modal wrapper for task mini-apps
 * Features:
 * - Dynamic component loading from taskRegistry
 * - Save/cancel handlers
 * - Loading states
 * - Fallback for simple tasks (just notes)
 */

import { ref, computed, shallowRef, watch } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { getTaskComponent, getTaskMetadata } from '@/services/taskRegistry'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  taskId: {
    type: [String, null],
    default: null
  }
})

// Emits
const emit = defineEmits(['close', 'save'])

// Stores
const projectStore = useProjectStore()

// State
const taskComponent = shallowRef(null)
const isSaving = ref(false)
const notes = ref('')

// Computed
const taskMetadata = computed(() => getTaskMetadata(props.taskId))

const currentTaskData = computed(() => {
  if (!projectStore.projectData.taskData) {
    return {}
  }
  return projectStore.projectData.taskData[props.taskId] || {}
})

// Watch for task changes and load component
watch(
  () => props.taskId,
  async (newTaskId) => {
    if (!newTaskId) {
      taskComponent.value = null
      return
    }

    try {
      const componentFn = getTaskComponent(newTaskId)
      if (componentFn) {
        const module = await componentFn()
        // Extract the default export if it exists
        taskComponent.value = module.default || module
      } else {
        taskComponent.value = null
      }
    } catch (error) {
      console.error('Error loading task component:', error)
      taskComponent.value = null
    }
  },
  { immediate: true }
)

// Methods
const handleSave = async () => {
  isSaving.value = true
  try {
    // If custom component, it will emit save event
    // Otherwise save simple task data (notes)
    if (!taskComponent.value) {
      await projectStore.updateTask(props.taskId, { notes: notes.value })
    }

    emit('save', { taskId: props.taskId })
    handleClose()
  } catch (error) {
    console.error('Error saving task:', error)
  } finally {
    isSaving.value = false
  }
}

const handleClose = () => {
  // Reset local state
  notes.value = ''
  taskComponent.value = null
  emit('close')
}

const handleBackdropClick = (event) => {
  // Only close if clicking directly on the backdrop, not the modal content
  if (event.target === event.currentTarget) {
    console.log('[TaskModal] Backdrop clicked, closing modal')
    handleClose()
  }
}
</script>

<style scoped>
/* Modal animations */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

div[class*="fixed"] {
  animation: slideIn 0.2s ease-out;
}
</style>
