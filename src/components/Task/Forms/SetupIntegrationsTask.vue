<template>
  <div class="space-y-4">
    <p class="text-sm text-gray-600">Select the integrations you've set up:</p>

    <div class="space-y-2">
      <label v-for="integration in integrations" :key="integration" class="flex items-center gap-2">
        <input
          type="checkbox"
          :checked="formData.integrations?.includes(integration)"
          @change="(e) => toggleIntegration(integration, e.target.checked)"
          class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
        <span class="text-sm text-gray-700">{{ integration }}</span>
      </label>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Notes
      </label>
      <textarea
        v-model="formData.notes"
        placeholder="Add any integration details or API keys info..."
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

const integrations = [
  'X (Twitter)',
  'LinkedIn',
  'Instagram',
  'Reddit',
  'Mailchimp',
  'Google Analytics',
  'Slack',
  'Discord'
]

const formData = ref({
  integrations: [],
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

const toggleIntegration = (integration, checked) => {
  if (!formData.value.integrations) {
    formData.value.integrations = []
  }
  if (checked) {
    if (!formData.value.integrations.includes(integration)) {
      formData.value.integrations.push(integration)
    }
  } else {
    formData.value.integrations = formData.value.integrations.filter(i => i !== integration)
  }
  emit('save', { ...formData.value })
}

// Auto-save on changes
watch(
  formData,
  (newData) => {
    emit('save', newData)
  },
  { deep: true }
)
</script>
