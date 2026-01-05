<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
    <div class="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
        <p class="text-gray-600">Enter your new password below</p>
      </div>

      <!-- Error Alert -->
      <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-sm font-medium text-red-800">{{ error }}</p>
      </div>

      <!-- Success Message -->
      <div v-if="message" class="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <p class="text-sm font-medium text-green-800">{{ message }}</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleReset" class="space-y-4" v-if="!resetSuccess">
        <!-- New Password -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="At least 6 characters"
            required
            :disabled="isLoading"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
          />
        </div>

        <!-- Confirm Password -->
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            required
            :disabled="isLoading"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
          />
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full px-4 py-2 rounded-lg font-semibold transition-colors duration-200 bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400 mt-6"
        >
          {{ isLoading ? '⏳ Resetting...' : '✨ Reset Password' }}
        </button>
      </form>

      <!-- Success State -->
      <div v-else class="text-center">
        <p class="text-lg font-semibold text-green-600 mb-4">✅ Password reset successfully!</p>
        <p class="text-gray-600 mb-6">You can now login with your new password</p>
        <router-link
          to="/auth"
          class="inline-block px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition font-medium"
        >
          Back to Login
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase.js'

const router = useRouter()
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const message = ref('')
const isLoading = ref(false)
const resetSuccess = ref(false)

// Timeout tracking
let redirectTimeout = null

/**
 * Handle password reset
 */
const handleReset = async () => {
  error.value = ''

  // Validation
  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  isLoading.value = true

  try {
    // Update password in Supabase
    const { error: resetError } = await supabase.auth.updateUser({
      password: password.value
    })

    if (resetError) {
      throw resetError
    }

    resetSuccess.value = true
    message.value = 'Password reset successfully!'

    // Redirect to login after 2 seconds
    redirectTimeout = setTimeout(() => {
      router.push('/auth')
    }, 2000)
  } catch (err) {
    error.value = err.message || 'Failed to reset password. Please try again.'
  } finally {
    isLoading.value = false
  }
}

/**
 * Check if user has a valid reset session
 */
onMounted(async () => {
  // Check if there's a reset session from the email link
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    error.value = 'Invalid or expired reset link. Please request a new password reset.'
    isLoading.value = true
  }
})

// Cleanup timeout on unmount
onBeforeUnmount(() => {
  if (redirectTimeout) clearTimeout(redirectTimeout)
})
</script>

<style scoped>
/* Component styles */
</style>
