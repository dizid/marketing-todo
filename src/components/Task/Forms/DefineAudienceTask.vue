<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Target Audience
      </label>
      <textarea
        v-model="formData.audience"
        placeholder="Describe your target audience..."
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-vertical min-h-[80px]"
      ></textarea>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Key Personas (optional)
      </label>
      <textarea
        v-model="formData.personas"
        placeholder="Define 2-3 buyer personas..."
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-vertical min-h-[80px]"
      ></textarea>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Target Users (30-day goal)
      </label>
      <input
        v-model="formData.targetUsers"
        type="number"
        placeholder="e.g., 150"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Notes
      </label>
      <textarea
        v-model="formData.notes"
        placeholder="Add any additional notes..."
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-vertical min-h-[60px]"
      ></textarea>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  taskId: String,
  taskData: Object
})

const emit = defineEmits(['save'])

const formData = ref({
  audience: '',
  personas: '',
  targetUsers: '',
  notes: ''
})

// Load existing data
watch(
  () => props.taskData,
  (newData) => {
    if (newData) {
      formData.value = { ...formData.value, ...newData }
    }
  },
  { immediate: true }
)

// Auto-save on changes (debounced would be better for production)
watch(
  formData,
  (newData) => {
    emit('save', newData)
  },
  { deep: true }
)
</script>
