<template>
  <div class="space-y-6">
    <!-- Overview -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <p class="text-sm text-blue-900">
        <strong>Engage Followers:</strong> Build and manage response templates, set engagement targets, and develop a community interaction strategy.
      </p>
    </div>

    <!-- Engagement Metrics -->
    <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <h4 class="font-semibold text-gray-900 mb-3">📊 Engagement Goals</h4>
      <div class="space-y-3">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Daily Interactions Target</label>
            <input
              v-model.number="formData.dailyInteractions"
              type="number"
              min="0"
              placeholder="e.g., 10"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Response Time Goal</label>
            <select
              v-model="formData.responseTime"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            >
              <option value="">Select timeframe</option>
              <option value="immediate">Within 1 hour</option>
              <option value="same-day">Same day</option>
              <option value="24h">Within 24 hours</option>
              <option value="48h">Within 48 hours</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Community Focus Platforms</label>
          <div class="space-y-2">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="platformsFocus"
                type="checkbox"
                value="twitter"
                class="w-4 h-4 text-indigo-600 border-gray-300 rounded"
              />
              <span class="text-sm text-gray-700">X / Twitter</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="platformsFocus"
                type="checkbox"
                value="linkedin"
                class="w-4 h-4 text-indigo-600 border-gray-300 rounded"
              />
              <span class="text-sm text-gray-700">LinkedIn</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="platformsFocus"
                type="checkbox"
                value="instagram"
                class="w-4 h-4 text-indigo-600 border-gray-300 rounded"
              />
              <span class="text-sm text-gray-700">Instagram</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="platformsFocus"
                type="checkbox"
                value="reddit"
                class="w-4 h-4 text-indigo-600 border-gray-300 rounded"
              />
              <span class="text-sm text-gray-700">Reddit</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="platformsFocus"
                type="checkbox"
                value="discord"
                class="w-4 h-4 text-indigo-600 border-gray-300 rounded"
              />
              <span class="text-sm text-gray-700">Discord</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Reply Templates Builder -->
    <div>
      <div class="flex justify-between items-center mb-3">
        <h4 class="font-semibold text-gray-900">💬 Response Templates</h4>
        <button
          @click="addTemplate"
          class="px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded transition"
        >
          + Add Template
        </button>
      </div>

      <div v-if="templates.length === 0" class="p-4 text-center text-gray-500 text-sm bg-gray-50 rounded-lg border border-gray-200">
        No templates yet. Click "Add Template" to create response templates.
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="(template, idx) in templates"
          :key="idx"
          class="bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition"
        >
          <div class="flex justify-between items-start mb-3">
            <h5 class="font-medium text-gray-900">{{ template.name || `Template ${idx + 1}` }}</h5>
            <button
              @click="removeTemplate(idx)"
              class="text-red-500 hover:text-red-700 text-sm font-medium"
            >
              Remove
            </button>
          </div>

          <div class="space-y-3">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Template Name</label>
                <input
                  v-model="template.name"
                  type="text"
                  placeholder="e.g., Thank You Reply, Question Response"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Situation / Trigger</label>
                <input
                  v-model="template.trigger"
                  type="text"
                  placeholder="When to use this template"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Template Content</label>
              <textarea
                v-model="template.content"
                placeholder="Write your response template. Use [MENTION] for @username, [PRODUCT] for your app name..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-vertical min-h-[80px] font-mono text-xs"
              ></textarea>
              <p class="text-xs text-gray-500 mt-1">Character count: {{ template.content?.length || 0 }}</p>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Tone</label>
                <select
                  v-model="template.tone"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                >
                  <option value="">Select tone</option>
                  <option value="friendly">Friendly & Casual</option>
                  <option value="professional">Professional</option>
                  <option value="humorous">Humorous</option>
                  <option value="empathetic">Empathetic</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Platform</label>
                <select
                  v-model="template.platform"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                >
                  <option value="">All platforms</option>
                  <option value="twitter">Twitter/X</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="instagram">Instagram</option>
                  <option value="reddit">Reddit</option>
                  <option value="discord">Discord</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions & Keyboard Shortcuts -->
    <div>
      <label class="block text-sm font-medium text-gray-900 mb-2">⚡ Quick Actions & Shortcuts</label>
      <textarea
        v-model="formData.quickActions"
        placeholder="Document common shortcuts, reusable links, or quick actions you can use when engaging. Example: GitHub link, Discord invite, demo video link..."
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-vertical min-h-[100px]"
      ></textarea>
    </div>

    <!-- Engagement Strategy -->
    <div>
      <label class="block text-sm font-medium text-gray-900 mb-2">🎯 Engagement Strategy</label>
      <textarea
        v-model="formData.engagementStrategy"
        placeholder="Document your community engagement strategy: Which topics to engage with? What communities to monitor? Which types of questions to prioritize? How to balance self-promotion vs helping others?"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-vertical min-h-[100px]"
      ></textarea>
    </div>

    <!-- Community Guidelines -->
    <div>
      <label class="block text-sm font-medium text-gray-900 mb-2">📋 Community Management Guidelines</label>
      <textarea
        v-model="formData.communityGuidelines"
        placeholder="Document your guidelines: How to handle negative comments? How to deal with spam/trolls? Escalation procedures? Tone and voice consistency?"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-vertical min-h-[100px]"
      ></textarea>
    </div>

    <!-- Monitoring Tools -->
    <div>
      <label class="block text-sm font-medium text-gray-900 mb-2">🔍 Monitoring Tools & Alerts</label>
      <textarea
        v-model="formData.monitoringTools"
        placeholder="List tools you're using to monitor mentions, comments, and messages: Twitter alerts, Google Alerts, Mention.com, IFTTT recipes, etc."
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-vertical min-h-[80px]"
      ></textarea>
    </div>

    <!-- Additional Notes -->
    <div>
      <label class="block text-sm font-medium text-gray-900 mb-2">📝 Additional Notes</label>
      <textarea
        v-model="formData.notes"
        placeholder="Any other important notes about community engagement..."
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

const templates = ref([
  {
    name: 'Thank You Reply',
    trigger: 'When someone thanks or compliments',
    content: 'Thanks so much for the kind words! [MENTION] We really appreciate your support. Let us know if you have any questions!',
    tone: 'friendly',
    platform: ''
  }
])

const platformsFocus = ref(['twitter'])

const formData = ref({
  dailyInteractions: '',
  responseTime: '',
  quickActions: '',
  engagementStrategy: '',
  communityGuidelines: '',
  monitoringTools: '',
  notes: '',
  templates: []
})

// Load existing data
watch(
  () => props.taskData,
  (newData) => {
    if (newData && Object.keys(newData).length > 0) {
      formData.value = {
        dailyInteractions: newData.dailyInteractions || '',
        responseTime: newData.responseTime || '',
        quickActions: newData.quickActions || '',
        engagementStrategy: newData.engagementStrategy || '',
        communityGuidelines: newData.communityGuidelines || '',
        monitoringTools: newData.monitoringTools || '',
        notes: newData.notes || '',
        templates: newData.templates || []
      }
      if (newData.templates) templates.value = newData.templates
      if (newData.platformsFocus) platformsFocus.value = newData.platformsFocus
    }
  },
  { immediate: true }
)

// Add template
const addTemplate = () => {
  templates.value.push({
    name: '',
    trigger: '',
    content: '',
    tone: '',
    platform: ''
  })
  emitSave()
}

// Remove template
const removeTemplate = (idx) => {
  templates.value.splice(idx, 1)
  emitSave()
}

// Emit save with all data
const emitSave = () => {
  emit('save', {
    ...formData.value,
    templates: templates.value,
    platformsFocus: platformsFocus.value
  })
}

// Auto-save on all changes
watch(templates, emitSave, { deep: true })
watch(platformsFocus, emitSave, { deep: true })
watch(
  () => [
    formData.value.dailyInteractions,
    formData.value.responseTime,
    formData.value.quickActions,
    formData.value.engagementStrategy,
    formData.value.communityGuidelines,
    formData.value.monitoringTools,
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
