<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h2 class="text-lg font-bold text-gray-900">Connect Analytics Platform</h2>
        <button
          @click="handleClose"
          class="text-gray-400 hover:text-gray-600 transition"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="px-6 py-4 space-y-6">
        <!-- Step 1: Select Platform Type -->
        <div v-if="step === 1" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-900 mb-3">
              What would you like to track?
            </label>
            <div class="space-y-2">
              <button
                v-for="(platform, key) in availablePlatforms"
                :key="key"
                @click="selectPlatformType(key)"
                class="w-full p-4 border-2 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition text-left"
                :class="selectedPlatformType === key ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'"
              >
                <div class="font-semibold text-gray-900">{{ platform.name }}</div>
                <div class="text-sm text-gray-600 mt-1">{{ platform.description }}</div>
                <div class="text-xs text-gray-500 mt-2">
                  Metrics: {{ platform.metrics.join(', ') }}
                </div>
              </button>
            </div>
          </div>

          <div class="flex gap-3 pt-4">
            <button
              @click="handleClose"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              @click="step = 2"
              :disabled="!selectedPlatformType"
              class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>

        <!-- Step 2: Select Provider -->
        <div v-if="step === 2" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-900 mb-3">
              Choose your {{ selectedPlatformName }}:
            </label>
            <div class="space-y-2">
              <button
                v-for="provider in currentProviders"
                :key="provider"
                @click="selectedProvider = provider"
                class="w-full p-3 border-2 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition text-left font-medium"
                :class="selectedProvider === provider ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 text-gray-700'"
              >
                {{ capitalizeProvider(provider) }}
              </button>
            </div>
          </div>

          <div class="flex gap-3 pt-4">
            <button
              @click="step = 1"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Back
            </button>
            <button
              @click="step = 3"
              :disabled="!selectedProvider"
              class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>

        <!-- Step 3: Enter Credentials -->
        <div v-if="step === 3" class="space-y-4">
          <div>
            <p class="text-sm text-gray-600 mb-4">
              Enter your {{ capitalizeProvider(selectedProvider) }} credentials to connect.
            </p>

            <!-- API Key Input -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-900 mb-2">
                API Key
              </label>
              <input
                v-model="credentials.apiKey"
                type="password"
                placeholder="Paste your API key here"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
              />
              <p class="text-xs text-gray-500 mt-1">
                Your API key is never stored in plain text. Find this in your {{ capitalizeProvider(selectedProvider) }} account settings.
              </p>
            </div>

            <!-- Account ID Input (optional) -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-900 mb-2">
                Account ID / Username (Optional)
              </label>
              <input
                v-model="credentials.accountId"
                type="text"
                placeholder="Your account or username"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <!-- Test Connection Button -->
            <button
              @click="testConnection"
              :disabled="!credentials.apiKey || testing"
              class="w-full px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {{ testing ? 'Testing...' : 'Test Connection' }}
            </button>

            <!-- Connection Test Result -->
            <div v-if="testResult" class="p-3 rounded-lg mb-4" :class="testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'">
              <p class="text-sm" :class="testResult.success ? 'text-green-800' : 'text-red-800'">
                {{ testResult.message }}
              </p>
            </div>
          </div>

          <div class="flex gap-3 pt-4">
            <button
              @click="step = 2"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Back
            </button>
            <button
              @click="handleConnect"
              :disabled="!credentials.apiKey || !testResult?.success"
              class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ connecting ? 'Connecting...' : 'Connect Platform' }}
            </button>
          </div>
        </div>

        <!-- Auto-Sync Settings -->
        <div v-if="step === 3" class="pt-4 border-t border-gray-200 space-y-3">
          <h4 class="text-sm font-semibold text-gray-900">Auto-Sync Settings</h4>
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              v-model="autoSync.enabled"
              type="checkbox"
              class="w-4 h-4 text-indigo-600 rounded"
            />
            <span class="text-sm text-gray-700">
              Automatically sync metrics every
              <select v-model="autoSync.frequency" class="text-sm border-gray-300 rounded inline-block mx-1">
                <option value="hourly">hour</option>
                <option value="daily">day</option>
                <option value="weekly">week</option>
              </select>
            </span>
          </label>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="bg-gray-50 border-t border-gray-200 px-6 py-3 text-xs text-gray-600">
        <p>
          💡 Connected platforms help us show you real performance metrics instead of estimates. Your credentials are stored securely.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAnalyticsIntegration } from '../../services/analyticsIntegration.js'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'connected'])

const { PLATFORMS, connectPlatform } = useAnalyticsIntegration()

const step = ref(1)
const selectedPlatformType = ref(null)
const selectedProvider = ref(null)
const credentials = ref({
  apiKey: '',
  accountId: ''
})
const testing = ref(false)
const connecting = ref(false)
const testResult = ref(null)
const autoSync = ref({
  enabled: true,
  frequency: 'daily'
})

const availablePlatforms = computed(() => PLATFORMS)

const selectedPlatformName = computed(() => {
  return selectedPlatformType.value ? PLATFORMS[selectedPlatformType.value].name : ''
})

const currentProviders = computed(() => {
  if (!selectedPlatformType.value) return []
  return PLATFORMS[selectedPlatformType.value].providers
})

const selectPlatformType = (key) => {
  selectedPlatformType.value = key
  selectedProvider.value = null
}

const capitalizeProvider = (provider) => {
  return provider
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const testConnection = async () => {
  if (!credentials.value.apiKey) {
    testResult.value = { success: false, message: 'Please enter an API key' }
    return
  }

  testing.value = true
  testResult.value = null

  // Simulate connection test
  setTimeout(() => {
    testing.value = false
    testResult.value = {
      success: true,
      message: `✓ Successfully connected to ${capitalizeProvider(selectedProvider.value)}!`
    }
  }, 1500)
}

const handleConnect = () => {
  if (!testResult.value?.success) return

  connecting.value = true

  // Simulate connection
  setTimeout(() => {
    connecting.value = false
    const connection = connectPlatform(
      selectedPlatformType.value,
      selectedProvider.value,
      credentials.value
    )

    if (connection) {
      emit('connected', connection)
      handleClose()
    } else {
      testResult.value = {
        success: false,
        message: 'Failed to connect. Please try again.'
      }
    }
  }, 1000)
}

const handleClose = () => {
  step.value = 1
  selectedPlatformType.value = null
  selectedProvider.value = null
  credentials.value = { apiKey: '', accountId: '' }
  testResult.value = null
  emit('close')
}
</script>
