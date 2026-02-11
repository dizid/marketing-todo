<template>
  <!-- Normal content slot -->
  <slot v-if="!hasError" />

  <!-- Error fallback UI with dark glass morphism -->
  <div v-else class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-gray-800">
    <div class="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
      <div class="text-center">
        <!-- Error Icon -->
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500/20 mb-6 error-icon">
          <svg class="h-8 w-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <!-- Error Message -->
        <h2 class="text-2xl font-bold text-white mb-2">
          Something went wrong
        </h2>
        <p class="text-gray-300 mb-6">
          We encountered an unexpected error. Don't worry, your data is safe.
        </p>

        <!-- Error Details (dev mode only) -->
        <div v-if="isDev && errorMessage" class="mb-6 p-4 bg-black/30 rounded-lg text-left">
          <p class="text-xs font-mono text-red-300 break-all">
            {{ errorMessage }}
          </p>
        </div>

        <!-- Actions -->
        <div class="flex flex-col gap-3">
          <button
            @click="handleRetry"
            class="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
          <button
            @click="goHome"
            class="w-full px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/20"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'

const hasError = ref(false)
const errorMessage = ref('')
const isDev = import.meta.env.DEV
const router = useRouter()

/**
 * Capture errors from child components
 * Returns false to prevent error propagation to parent
 */
onErrorCaptured((err, instance, info) => {
  hasError.value = true
  errorMessage.value = err.message || String(err)

  // Log error for debugging
  console.error('[ErrorBoundary] Caught error:', {
    error: err,
    component: instance?.$options?.name || 'Unknown',
    errorInfo: info,
    stack: err.stack
  })

  // Prevent propagation
  return false
})

/**
 * Reset error state and try to render again
 */
const handleRetry = () => {
  hasError.value = false
  errorMessage.value = ''
}

/**
 * Navigate to dashboard
 */
const goHome = () => {
  hasError.value = false
  errorMessage.value = ''
  router.push('/dashboard')
}
</script>

<style scoped>
.error-icon {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}
</style>
