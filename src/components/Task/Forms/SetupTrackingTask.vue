<template>
  <div class="space-y-6">
    <!-- Overview -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <p class="text-sm text-blue-900">
        <strong>Set Up Tracking:</strong> Define metrics, configure tracking tools, and create a measurement framework for your marketing campaign.
      </p>
    </div>

    <!-- Key Metrics Builder -->
    <div>
      <div class="flex justify-between items-center mb-3">
        <h4 class="font-semibold text-gray-900">📊 Key Performance Indicators (KPIs)</h4>
        <button
          @click="addMetric"
          class="px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded transition"
        >
          + Add Metric
        </button>
      </div>

      <div v-if="metrics.length === 0" class="p-4 text-center text-gray-500 text-sm bg-gray-50 rounded-lg border border-gray-200">
        No metrics added yet. Click "Add Metric" to create KPIs to track.
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="(metric, idx) in metrics"
          :key="idx"
          class="bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition"
        >
          <div class="flex justify-between items-start mb-3">
            <h5 class="font-medium text-gray-900">Metric {{ idx + 1 }}</h5>
            <button
              @click="removeMetric(idx)"
              class="text-red-500 hover:text-red-700 text-sm font-medium"
            >
              Remove
            </button>
          </div>

          <div class="space-y-3">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Metric Name</label>
              <input
                v-model="metric.name"
                type="text"
                placeholder="e.g., Monthly Signups, DAU, Conversion Rate"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Target Value</label>
                <input
                  v-model="metric.target"
                  type="number"
                  placeholder="e.g., 500"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Unit</label>
                <input
                  v-model="metric.unit"
                  type="text"
                  placeholder="e.g., users, %, visits"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Category</label>
                <select
                  v-model="metric.category"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                >
                  <option value="">Select category</option>
                  <option value="acquisition">Acquisition</option>
                  <option value="engagement">Engagement</option>
                  <option value="retention">Retention</option>
                  <option value="revenue">Revenue</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Measurement Period</label>
                <select
                  v-model="metric.period"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                >
                  <option value="">Select period</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annual">Annual</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Description</label>
              <textarea
                v-model="metric.description"
                placeholder="How will you measure this? What data will you collect?"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-vertical min-h-[50px]"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tracking Tools -->
    <div>
      <h4 class="font-semibold text-gray-900 mb-3">🛠️ Tracking Tools & Platforms</h4>
      <div class="space-y-3">
        <div
          v-for="(tool, idx) in commonTools"
          :key="idx"
          class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 transition"
        >
          <input
            v-model="selectedTools"
            type="checkbox"
            :value="tool.name"
            :id="`tool-${idx}`"
            class="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded"
          />
          <label :for="`tool-${idx}`" class="flex-1 cursor-pointer">
            <h5 class="font-medium text-gray-900">{{ tool.name }}</h5>
            <p class="text-xs text-gray-600 mt-1">{{ tool.description }}</p>
          </label>
        </div>
      </div>

      <div class="mt-4">
        <label class="block text-sm font-medium text-gray-900 mb-2">Custom Tools / Spreadsheets</label>
        <textarea
          v-model="formData.customTools"
          placeholder="Add any custom tracking spreadsheets, dashboards, or proprietary tools..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-vertical min-h-[80px]"
        ></textarea>
      </div>
    </div>

    <!-- Data Collection Method -->
    <div>
      <label class="block text-sm font-medium text-gray-900 mb-2">📈 Data Collection & Reporting Schedule</label>
      <textarea
        v-model="formData.dataCollection"
        placeholder="How often will you collect data? How will you report on progress? (e.g., Daily in Google Sheets, Weekly email reports, Real-time dashboard)"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-vertical min-h-[80px]"
      ></textarea>
    </div>

    <!-- Dashboard & Visualization -->
    <div>
      <label class="block text-sm font-medium text-gray-900 mb-2">📊 Dashboard & Visualization Plan</label>
      <textarea
        v-model="formData.dashboard"
        placeholder="Describe your dashboard setup: What data will be visible? Who will have access? How often will it be updated? Tools: Google Data Studio, Tableau, Grafana, etc."
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-vertical min-h-[80px]"
      ></textarea>
    </div>

    <!-- Attribution & Analysis -->
    <div>
      <label class="block text-sm font-medium text-gray-900 mb-2">🔍 Attribution & Analysis Strategy</label>
      <textarea
        v-model="formData.attribution"
        placeholder="How will you track which marketing channel drove each signup or conversion? Multi-touch attribution? UTM parameters? Tracking codes?"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-vertical min-h-[80px]"
      ></textarea>
    </div>

    <!-- Additional Notes -->
    <div>
      <label class="block text-sm font-medium text-gray-900 mb-2">📝 Additional Notes</label>
      <textarea
        v-model="formData.notes"
        placeholder="Privacy considerations, data retention policies, tools setup instructions, or other important notes..."
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-vertical min-h-[80px]"
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

const commonTools = [
  {
    name: 'Google Analytics 4',
    description: 'Web traffic, user behavior, conversion tracking'
  },
  {
    name: 'Google Sheets',
    description: 'Manual data entry, custom dashboards, pivot tables'
  },
  {
    name: 'Mixpanel',
    description: 'In-app events, user cohorts, retention analysis'
  },
  {
    name: 'Segment',
    description: 'Centralized customer data platform'
  },
  {
    name: 'Amplitude',
    description: 'Product analytics, user journey mapping'
  },
  {
    name: 'Posthog',
    description: 'Open-source product analytics'
  }
]

const metrics = ref([
  {
    name: 'Monthly Signups',
    target: '',
    unit: 'users',
    category: 'acquisition',
    period: 'monthly',
    description: ''
  }
])

const selectedTools = ref([])

const formData = ref({
  customTools: '',
  dataCollection: '',
  dashboard: '',
  attribution: '',
  notes: '',
  metrics: [],
  tools: []
})

// Load existing data
watch(
  () => props.taskData,
  (newData) => {
    if (newData && Object.keys(newData).length > 0) {
      formData.value = {
        customTools: newData.customTools || '',
        dataCollection: newData.dataCollection || '',
        dashboard: newData.dashboard || '',
        attribution: newData.attribution || '',
        notes: newData.notes || '',
        metrics: newData.metrics || [],
        tools: newData.tools || []
      }
      if (newData.metrics) metrics.value = newData.metrics
      if (newData.tools) selectedTools.value = newData.tools
    }
  },
  { immediate: true }
)

// Add metric
const addMetric = () => {
  metrics.value.push({
    name: '',
    target: '',
    unit: '',
    category: '',
    period: '',
    description: ''
  })
  emitSave()
}

// Remove metric
const removeMetric = (idx) => {
  metrics.value.splice(idx, 1)
  emitSave()
}

// Emit save with all data
const emitSave = () => {
  emit('save', {
    ...formData.value,
    metrics: metrics.value,
    tools: selectedTools.value
  })
}

// Auto-save on all changes
watch(metrics, emitSave, { deep: true })
watch(selectedTools, emitSave, { deep: true })
watch(
  () => [
    formData.value.customTools,
    formData.value.dataCollection,
    formData.value.dashboard,
    formData.value.attribution,
    formData.value.notes
  ],
  () => {
    emitSave()
  }
)
</script>

<style scoped>
input[type="checkbox"] {
  transition: all 0.2s ease-in-out;
}

input[type="checkbox"]:hover {
  transform: scale(1.1);
}

textarea {
  transition: all 0.2s ease-in-out;
}

textarea:focus {
  border-color: #e0e7ff;
}
</style>
