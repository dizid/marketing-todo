<template>
  <div class="space-y-6">
    <!-- Overview Section -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <p class="text-sm text-blue-900">
        <strong>Connect Your Tools:</strong> Link social media accounts, email platforms, and analytics tools to power your marketing.
      </p>
    </div>

    <!-- Integration Categories -->
    <div class="space-y-6">
      <!-- Social Media Platforms -->
      <div>
        <h4 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span>📱</span> Social Media Platforms
          <span class="text-xs font-normal text-gray-500">({{ socialMediaCount }}/3 connected)</span>
        </h4>
        <div class="space-y-2 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div
            v-for="platform in socialMediaPlatforms"
            :key="platform.name"
            class="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 transition"
          >
            <input
              :id="`integration-${platform.name}`"
              v-model="selectedIntegrations"
              type="checkbox"
              :value="platform.name"
              class="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded"
            />
            <label :for="`integration-${platform.name}`" class="flex-1 cursor-pointer">
              <h5 class="font-medium text-gray-900">{{ platform.name }}</h5>
              <p class="text-xs text-gray-600 mt-1">{{ platform.description }}</p>
            </label>
            <div v-if="isIntegrationConnected(platform.name)" class="flex items-center gap-1 text-green-600">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="text-xs font-medium">Connected</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Email & Marketing -->
      <div>
        <h4 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span>✉️</span> Email & Marketing
          <span class="text-xs font-normal text-gray-500">({{ emailMarketingCount }}/2 connected)</span>
        </h4>
        <div class="space-y-2 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div
            v-for="service in emailMarketingServices"
            :key="service.name"
            class="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 transition"
          >
            <input
              :id="`integration-${service.name}`"
              v-model="selectedIntegrations"
              type="checkbox"
              :value="service.name"
              class="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded"
            />
            <label :for="`integration-${service.name}`" class="flex-1 cursor-pointer">
              <h5 class="font-medium text-gray-900">{{ service.name }}</h5>
              <p class="text-xs text-gray-600 mt-1">{{ service.description }}</p>
            </label>
            <div v-if="isIntegrationConnected(service.name)" class="flex items-center gap-1 text-green-600">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="text-xs font-medium">Connected</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Analytics & Tracking -->
      <div>
        <h4 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span>📊</span> Analytics & Tracking
          <span class="text-xs font-normal text-gray-500">({{ analyticsCount }}/3 connected)</span>
        </h4>
        <div class="space-y-2 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div
            v-for="service in analyticsServices"
            :key="service.name"
            class="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 transition"
          >
            <input
              :id="`integration-${service.name}`"
              v-model="selectedIntegrations"
              type="checkbox"
              :value="service.name"
              class="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded"
            />
            <label :for="`integration-${service.name}`" class="flex-1 cursor-pointer">
              <h5 class="font-medium text-gray-900">{{ service.name }}</h5>
              <p class="text-xs text-gray-600 mt-1">{{ service.description }}</p>
            </label>
            <div v-if="isIntegrationConnected(service.name)" class="flex items-center gap-1 text-green-600">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="text-xs font-medium">Connected</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Community & Communication -->
      <div>
        <h4 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span>💬</span> Community & Communication
          <span class="text-xs font-normal text-gray-500">({{ communityCount }}/2 connected)</span>
        </h4>
        <div class="space-y-2 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div
            v-for="service in communityServices"
            :key="service.name"
            class="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 transition"
          >
            <input
              :id="`integration-${service.name}`"
              v-model="selectedIntegrations"
              type="checkbox"
              :value="service.name"
              class="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded"
            />
            <label :for="`integration-${service.name}`" class="flex-1 cursor-pointer">
              <h5 class="font-medium text-gray-900">{{ service.name }}</h5>
              <p class="text-xs text-gray-600 mt-1">{{ service.description }}</p>
            </label>
            <div v-if="isIntegrationConnected(service.name)" class="flex items-center gap-1 text-green-600">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="text-xs font-medium">Connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Connection Status Summary -->
    <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <h4 class="font-semibold text-gray-900 mb-2">Connection Status</h4>
      <div class="space-y-1 text-sm">
        <p class="text-gray-600">
          <span class="font-medium">{{ selectedIntegrations.length }}</span> out of
          <span class="font-medium">10</span> integrations connected
        </p>
        <div class="w-full h-2 bg-gray-300 rounded-full mt-2 overflow-hidden">
          <div
            class="h-full bg-indigo-600 transition-all duration-300"
            :style="{ width: (selectedIntegrations.length / 10) * 100 + '%' }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Integration Configuration -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Integration Configuration</label>
      <textarea
        v-model="formData.configuration"
        placeholder="Add API keys, webhooks, or connection details for your integrations. Keep sensitive data secure and never share actual keys in notes."
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-vertical min-h-[100px]"
      ></textarea>
      <p class="text-xs text-gray-500 mt-1">⚠️ Never paste actual API keys here. Use reference names or environment variables instead.</p>
    </div>

    <!-- Setup Instructions -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Setup Notes & Troubleshooting</label>
      <textarea
        v-model="formData.notes"
        placeholder="Document any setup issues, required permissions, or important notes for future reference..."
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-vertical min-h-[100px]"
      ></textarea>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  taskId: String,
  taskData: Object
})

const emit = defineEmits(['save'])

const socialMediaPlatforms = [
  {
    name: 'X (Twitter)',
    description: 'Connect your Twitter account for automated posting and engagement tracking.'
  },
  {
    name: 'LinkedIn',
    description: 'Link LinkedIn for professional networking and B2B content distribution.'
  },
  {
    name: 'Instagram',
    description: 'Connect Instagram for visual content sharing and audience insights.'
  }
]

const emailMarketingServices = [
  {
    name: 'Mailchimp',
    description: 'Integrate email campaigns and subscriber list management.'
  },
  {
    name: 'ConvertKit',
    description: 'Connect for email marketing to creator audiences.'
  }
]

const analyticsServices = [
  {
    name: 'Google Analytics',
    description: 'Track website traffic, conversions, and user behavior.'
  },
  {
    name: 'Mixpanel',
    description: 'Monitor in-app user events and funnel analytics.'
  },
  {
    name: 'Segment',
    description: 'Centralize data collection from all sources.'
  }
]

const communityServices = [
  {
    name: 'Slack',
    description: 'Send notifications and updates to your team workspace.'
  },
  {
    name: 'Discord',
    description: 'Engage with community and manage discussions.'
  }
]

const selectedIntegrations = ref([])

const formData = ref({
  integrations: [],
  configuration: '',
  notes: ''
})

// Load existing data
watch(
  () => props.taskData,
  (newData) => {
    if (newData && Object.keys(newData).length > 0) {
      formData.value = {
        integrations: newData.integrations || [],
        configuration: newData.configuration || '',
        notes: newData.notes || ''
      }
      selectedIntegrations.value = newData.integrations || []
    }
  },
  { immediate: true }
)

// Check if integration is connected
const isIntegrationConnected = (integrationName) => {
  return selectedIntegrations.value.includes(integrationName)
}

// Count connected integrations by category
const socialMediaCount = computed(() => {
  return socialMediaPlatforms.filter(p => selectedIntegrations.value.includes(p.name)).length
})

const emailMarketingCount = computed(() => {
  return emailMarketingServices.filter(s => selectedIntegrations.value.includes(s.name)).length
})

const analyticsCount = computed(() => {
  return analyticsServices.filter(s => selectedIntegrations.value.includes(s.name)).length
})

const communityCount = computed(() => {
  return communityServices.filter(s => selectedIntegrations.value.includes(s.name)).length
})

// Update form data when integrations change
watch(
  selectedIntegrations,
  (newIntegrations) => {
    formData.value.integrations = newIntegrations
    emit('save', formData.value)
  }
)

// Auto-save on all changes
watch(
  () => [formData.value.configuration, formData.value.notes],
  () => {
    emit('save', formData.value)
  },
  { deep: true }
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
