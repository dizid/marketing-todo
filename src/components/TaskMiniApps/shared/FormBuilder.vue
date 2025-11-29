<template>
  <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
    <h4 class="font-semibold text-gray-900 mb-4">{{ title || 'Configuration' }}</h4>

    <div class="space-y-4">
      <div v-for="field in fields" :key="field.id" class="form-field">
        <!-- Text Input -->
        <div v-if="field.type === 'text'" class="space-y-2">
          <label class="text-sm font-medium text-gray-700">{{ field.label }}</label>
          <input
            :value="formData[field.id]"
            type="text"
            :placeholder="field.placeholder"
            @input="updateField(field.id, $event.target.value)"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          />
        </div>

        <!-- Number Input -->
        <div v-else-if="field.type === 'number'" class="space-y-2">
          <label class="text-sm font-medium text-gray-700">{{ field.label }}</label>
          <div class="flex items-center gap-2">
            <input
              :value="formData[field.id]"
              type="number"
              :min="field.min || 0"
              :max="field.max"
              :placeholder="field.placeholder"
              @input="updateField(field.id, parseInt($event.target.value) || 0)"
              class="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            />
            <span v-if="field.suffix" class="text-sm text-gray-600">{{ field.suffix }}</span>
          </div>
        </div>

        <!-- Textarea -->
        <div v-else-if="field.type === 'textarea'" class="space-y-2">
          <label class="text-sm font-medium text-gray-700">{{ field.label }}</label>
          <textarea
            :value="formData[field.id]"
            :placeholder="field.placeholder"
            :rows="field.rows || 3"
            @input="updateField(field.id, $event.target.value)"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-vertical"
          ></textarea>
        </div>

        <!-- Select -->
        <div v-else-if="field.type === 'select'" class="space-y-2">
          <label class="text-sm font-medium text-gray-700">{{ field.label }}</label>
          <select
            :value="formData[field.id]"
            @change="updateField(field.id, $event.target.value)"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          >
            <option value="">Select {{ field.label }}</option>
            <option v-for="option in field.options" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <!-- Checkbox Group -->
        <div v-else-if="field.type === 'checkboxes'" class="space-y-2">
          <label class="text-sm font-medium text-gray-700">{{ field.label }}</label>
          <div class="space-y-2">
            <label v-for="option in field.options" :key="option.value" class="flex items-center gap-2 cursor-pointer">
              <input
                :checked="(formData[field.id] || []).includes(option.value)"
                type="checkbox"
                :value="option.value"
                @change="updateCheckboxField(field.id, option.value, $event.target.checked)"
                class="w-4 h-4 text-indigo-600 border-gray-300 rounded"
              />
              <span class="text-sm text-gray-700">{{ option.label }}</span>
            </label>
          </div>
        </div>

        <!-- Radio Group -->
        <div v-else-if="field.type === 'radio'" class="space-y-2">
          <label class="text-sm font-medium text-gray-700">{{ field.label }}</label>
          <div class="space-y-2">
            <label v-for="option in field.options" :key="option.value" class="flex items-center gap-2 cursor-pointer">
              <input
                :checked="formData[field.id] === option.value"
                type="radio"
                :value="option.value"
                @change="updateField(field.id, option.value)"
                class="w-4 h-4 text-indigo-600 border-gray-300"
              />
              <span class="text-sm text-gray-700">{{ option.label }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Errors -->
    <div v-if="errors.length > 0" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
      <p v-for="error in errors" :key="error" class="text-sm text-red-700">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  title: String,
  fields: {
    type: Array,
    required: true
  },
  initialData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:data', 'change'])

const formData = ref({ ...props.initialData })
const errors = ref([])

// Watch initial data changes
watch(
  () => props.initialData,
  (newData) => {
    formData.value = { ...newData }
  }
)

// Update individual field
const updateField = (fieldId, value) => {
  formData.value[fieldId] = value
  emit('update:data', { ...formData.value })
  emit('change')
}

// Update checkbox field (array)
const updateCheckboxField = (fieldId, value, isChecked) => {
  if (!formData.value[fieldId]) {
    formData.value[fieldId] = []
  }

  if (isChecked) {
    if (!formData.value[fieldId].includes(value)) {
      formData.value[fieldId].push(value)
    }
  } else {
    formData.value[fieldId] = formData.value[fieldId].filter(v => v !== value)
  }

  emit('update:data', { ...formData.value })
  emit('change')
}

// Validate form
const validate = () => {
  errors.value = []

  for (const field of props.fields) {
    if (field.required && !formData.value[field.id]) {
      errors.value.push(`${field.label} is required`)
    }
  }

  return errors.value.length === 0
}

// Expose validation method
defineExpose({
  validate,
  data: formData
})
</script>

<style scoped>
.form-field {
  animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
