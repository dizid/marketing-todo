<template>
  <div class="space-y-6">
    <!-- SMART Goals Framework Intro -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <p class="text-sm text-blue-900">
        <strong>SMART Goals:</strong> Specific, Measurable, Achievable, Relevant, Time-bound.
        Add 2-3 key marketing goals using this framework.
      </p>
    </div>

    <!-- Goals List -->
    <div>
      <div class="flex justify-between items-center mb-3">
        <h4 class="text-sm font-semibold text-gray-900">Marketing Goals</h4>
        <button
          @click="addGoal"
          class="px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded transition"
        >
          + Add Goal
        </button>
      </div>

      <div class="space-y-3">
        <div v-for="(goal, index) in formData.goals" :key="index" class="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div class="flex justify-between items-start mb-4">
            <h5 class="font-medium text-gray-900">Goal {{ index + 1 }}</h5>
            <button
              @click="removeGoal(index)"
              class="text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          </div>

          <div class="space-y-3">
            <!-- Specific: What -->
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">📍 What (Specific)</label>
              <input
                v-model="goal.what"
                type="text"
                placeholder="e.g., Acquire new users through organic channels"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
            </div>

            <!-- Measurable: Metric -->
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">📊 How Much (Measurable)</label>
              <div class="flex gap-2">
                <input
                  v-model="goal.metric"
                  type="number"
                  placeholder="e.g., 150"
                  min="0"
                  class="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                />
                <input
                  v-model="goal.unit"
                  type="text"
                  placeholder="e.g., users, signups, visits"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                />
              </div>
            </div>

            <!-- Achievable: Strategy -->
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">✅ How (Achievable)</label>
              <textarea
                v-model="goal.howToAchieve"
                placeholder="What's your strategy to achieve this? (e.g., content marketing, paid ads, partnerships)"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-vertical min-h-[50px]"
              ></textarea>
            </div>

            <!-- Relevant: Why -->
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">🎯 Why (Relevant)</label>
              <textarea
                v-model="goal.why"
                placeholder="Why is this goal important for your business?"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-vertical min-h-[50px]"
              ></textarea>
            </div>

            <!-- Time-bound: Deadline -->
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">⏰ When (Time-bound)</label>
              <div class="flex gap-2">
                <input
                  v-model="goal.days"
                  type="number"
                  placeholder="30"
                  min="1"
                  class="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                />
                <span class="self-center text-sm text-gray-600">days from now</span>
              </div>
            </div>

            <!-- Priority -->
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Priority</label>
              <select
                v-model="goal.priority"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              >
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>

            <!-- Tracking Method -->
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">How to Track</label>
              <input
                v-model="goal.trackingMethod"
                type="text"
                placeholder="e.g., Google Analytics, app dashboard, manual tracking"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
            </div>
          </div>
        </div>

        <div v-if="formData.goals.length === 0" class="text-center py-6 text-gray-500 text-sm">
          No goals yet. Click "Add Goal" to create one.
        </div>
      </div>
    </div>

    <!-- Overall Timeline -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Marketing Campaign Timeline</label>
      <textarea
        v-model="formData.timeline"
        placeholder="Describe your overall marketing timeline (e.g., 30-day sprint, 90-day program)"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-vertical min-h-[60px]"
      ></textarea>
    </div>

    <!-- Budget -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Marketing Budget</label>
      <div class="flex items-center gap-2">
        <span>$</span>
        <input
          v-model="formData.budget"
          type="number"
          placeholder="0"
          min="0"
          step="100"
          class="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
        />
      </div>
    </div>

    <!-- Success Metrics Summary -->
    <div v-if="formData.goals.length > 0" class="bg-green-50 border border-green-200 rounded-lg p-4">
      <h5 class="font-semibold text-green-900 mb-2">Goals Summary</h5>
      <ul class="space-y-1 text-sm text-green-900">
        <li v-for="(goal, idx) in formData.goals" :key="idx">
          • {{ goal.metric }} {{ goal.unit }} - {{ goal.what }} ({{ goal.days }}d)
        </li>
      </ul>
    </div>

    <!-- Additional Notes -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
      <textarea
        v-model="formData.notes"
        placeholder="Any constraints, dependencies, or other considerations..."
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
  goals: [],
  timeline: '',
  budget: '',
  notes: ''
})

// Load existing data on mount
watch(
  () => props.taskData,
  (newData) => {
    if (newData && Object.keys(newData).length > 0) {
      formData.value = {
        goals: newData.goals || [],
        timeline: newData.timeline || '',
        budget: newData.budget || '',
        notes: newData.notes || ''
      }
    }
  },
  { immediate: true }
)

// Add new goal with SMART structure
const addGoal = () => {
  formData.value.goals.push({
    what: '',
    metric: '',
    unit: '',
    howToAchieve: '',
    why: '',
    days: 30,
    priority: 'medium',
    trackingMethod: '',
    status: 'in-progress',
    progress: 0
  })
  emitSave()
}

// Remove goal
const removeGoal = (index) => {
  formData.value.goals.splice(index, 1)
  emitSave()
}

// Helper function to emit save
const emitSave = () => {
  emit('save', { ...formData.value })
}

// Auto-save on changes
watch(formData, emitSave, { deep: true })
</script>
