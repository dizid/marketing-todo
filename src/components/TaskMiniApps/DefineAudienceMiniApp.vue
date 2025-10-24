<template>
  <MiniAppShell
    :task-config="config"
    :task-data="taskData"
    @save="handleSave"
  >
    <template #ai-output="{ output }">
      <div v-if="output" class="prose prose-sm max-w-none">
        <p class="whitespace-pre-wrap text-sm text-gray-700">{{ output }}</p>
      </div>
    </template>
  </MiniAppShell>
</template>

<script setup>
import { ref, watch } from 'vue'
import MiniAppShell from './core/MiniAppShell.vue'
import { defineAudienceConfig } from './configs/defineAudience.config.js'

const props = defineProps({
  taskId: String,
  taskData: Object
})

const emit = defineEmits(['save'])

// Use the config
const config = ref(defineAudienceConfig)

// Local task data
const taskData = ref(props.taskData || {
  formData: {},
  aiOutput: null,
  savedItems: []
})

// Watch for changes
watch(
  () => props.taskData,
  (newData) => {
    if (newData) {
      taskData.value = { ...newData }
    }
  }
)

// Save handler
const handleSave = (data) => {
  taskData.value = data
  emit('save', data)
}
</script>
