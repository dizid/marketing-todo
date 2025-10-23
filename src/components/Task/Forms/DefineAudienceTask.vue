<template>
  <div class="space-y-6">
    <!-- Overview Section -->
    <div>
      <h4 class="text-sm font-semibold text-gray-900 mb-3">Target Audience Overview</h4>
      <textarea
        v-model="formData.audience"
        placeholder="Describe your target audience in 2-3 sentences. Who are they? What are their pain points?"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-vertical min-h-[80px]"
      ></textarea>
    </div>

    <!-- Personas Section -->
    <div>
      <div class="flex justify-between items-center mb-3">
        <h4 class="text-sm font-semibold text-gray-900">Buyer Personas</h4>
        <button
          @click="addPersona"
          class="px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded transition"
        >
          + Add Persona
        </button>
      </div>

      <div class="space-y-3">
        <div v-for="(persona, index) in formData.personas" :key="index" class="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div class="flex justify-between items-start mb-3">
            <h5 class="font-medium text-gray-900">Persona {{ index + 1 }}</h5>
            <button
              @click="removePersona(index)"
              class="text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          </div>

          <div class="space-y-3">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Name</label>
              <input
                v-model="persona.name"
                type="text"
                placeholder="e.g., Sarah, Startup Founder"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Role / Job Title</label>
              <input
                v-model="persona.role"
                type="text"
                placeholder="e.g., CTO, Marketing Manager"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Pain Points (comma-separated)</label>
              <input
                v-model="persona.painPoints"
                type="text"
                placeholder="e.g., Limited budget, Time constraints, Team coordination"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Goals / Motivations</label>
              <textarea
                v-model="persona.goals"
                placeholder="What does this persona want to achieve?"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-vertical min-h-[60px]"
              ></textarea>
            </div>
          </div>
        </div>

        <div v-if="formData.personas.length === 0" class="text-center py-6 text-gray-500 text-sm">
          No personas yet. Click "Add Persona" to create one.
        </div>
      </div>
    </div>

    <!-- Target Users Goal -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Target Users (30-day goal)</label>
      <div class="flex items-center gap-2">
        <input
          v-model="formData.targetUsers"
          type="number"
          placeholder="e.g., 150"
          min="0"
          class="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
        />
        <span class="text-sm text-gray-600">users to acquire</span>
      </div>
    </div>

    <!-- Market Size -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Estimated Market Size</label>
      <textarea
        v-model="formData.marketSize"
        placeholder="e.g., TAM (Total Addressable Market), SAM (Serviceable Available Market), SOM (Serviceable Obtainable Market)"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-vertical min-h-[60px]"
      ></textarea>
    </div>

    <!-- General Notes -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
      <textarea
        v-model="formData.notes"
        placeholder="Any additional audience insights or competitive analysis..."
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-vertical min-h-[60px]"
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
  personas: [],
  targetUsers: '',
  marketSize: '',
  notes: ''
})

// Load existing data on mount
watch(
  () => props.taskData,
  (newData) => {
    if (newData && Object.keys(newData).length > 0) {
      formData.value = {
        audience: newData.audience || '',
        personas: newData.personas || [],
        targetUsers: newData.targetUsers || '',
        marketSize: newData.marketSize || '',
        notes: newData.notes || ''
      }
    }
  },
  { immediate: true }
)

// Add new persona
const addPersona = () => {
  formData.value.personas.push({
    name: '',
    role: '',
    painPoints: '',
    goals: ''
  })
  emitSave()
}

// Remove persona
const removePersona = (index) => {
  formData.value.personas.splice(index, 1)
  emitSave()
}

// Helper function to emit save
const emitSave = () => {
  emit('save', { ...formData.value })
}

// Auto-save on changes
watch(formData, emitSave, { deep: true })
</script>
