<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Primary Goals
      </label>
      <textarea
        v-model="formData.goals"
        placeholder="What are your main marketing goals? (e.g., 150 sign-ups, 50 beta testers, etc.)"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-vertical min-h-[80px]"
      ></textarea>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Timeline
      </label>
      <input
        v-model="formData.timeline"
        type="text"
        placeholder="e.g., 30 days, 3 months, etc."
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Key Metrics
      </label>
      <textarea
        v-model="formData.metrics"
        placeholder="How will you measure success? (sign-ups, engagement, retention, etc.)"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-vertical min-h-[80px]"
      ></textarea>
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
  goals: '',
  timeline: '',
  metrics: '',
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

// Auto-save on changes
watch(
  formData,
  (newData) => {
    emit('save', newData)
  },
  { deep: true }
)
</script>
