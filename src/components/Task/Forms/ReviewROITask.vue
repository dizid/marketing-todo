<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Details</label>
      <textarea v-model="formData.details" placeholder="Enter task details..." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-vertical min-h-[100px]"></textarea>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Notes</label>
      <textarea v-model="formData.notes" placeholder="Add notes..." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-vertical min-h-[60px]"></textarea>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
const props = defineProps({ taskId: String, taskData: Object })
const emit = defineEmits(['save'])
const formData = ref({ details: '', notes: '' })
watch(() => props.taskData, (newData) => {
  if (newData) formData.value = { ...formData.value, ...newData }
}, { immediate: true })
watch(formData, (newData) => emit('save', newData), { deep: true })
</script>
