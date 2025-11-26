<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
    <div class="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          {{ isSignUp ? 'Create Account' : 'Welcome Back' }}
        </h1>
        <p class="text-gray-600">
          {{ isSignUp ? 'Sign up to manage your sales tasks' : 'Sign in to your account' }}
        </p>
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
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="you@example.com"
            required
            :disabled="isLoading"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
          />
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            :placeholder="isSignUp ? 'At least 6 characters' : '••••••••'"
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
          <span v-if="isLoading" class="inline-flex items-center gap-2">
            <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
          <span v-else>
            {{ isSignUp ? 'Create Account' : 'Sign In' }}
          </span>
        </button>
      </form>

      <!-- Toggle Mode -->
      <div class="mt-6 text-center">
        <p class="text-gray-600 text-sm">
          {{ isSignUp ? 'Already have an account?' : "Don't have an account?" }}
          <button
            @click="handleToggle"
            :disabled="isLoading"
            class="text-indigo-600 hover:text-indigo-700 font-medium disabled:cursor-not-allowed transition-colors"
          >
            {{ isSignUp ? 'Sign In' : 'Sign Up' }}
          </button>
        </p>
      </div>

      <!-- Forgot Password -->
      <div v-if="!isSignUp" class="mt-4 text-center">
        <button
          @click="showForgotPassword = true"
          :disabled="isLoading"
          class="text-sm text-gray-600 hover:text-gray-900 disabled:cursor-not-allowed transition-colors"
        >
          Forgot password?
        </button>
      </div>
    </div>

    <!-- Password Reset Modal -->
    <transition name="fade">
      <div v-if="showForgotPassword" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
        <div class="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Reset Password</h2>
          <p class="text-gray-600 mb-4">Enter your email and we'll send you a password reset link.</p>

          <input
            v-model="resetEmail"
            type="email"
            placeholder="your@example.com"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-4"
          />

          <div v-if="resetMessage" class="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p class="text-sm font-medium text-green-800">{{ resetMessage }}</p>
          </div>

          <div class="flex gap-3">
            <button
              @click="handlePasswordReset"
              :disabled="resetLoading"
              class="flex-1 px-4 py-2 rounded-lg font-semibold transition-colors duration-200 bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400"
            >
              {{ resetLoading ? 'Sending...' : 'Send Reset Link' }}
            </button>
            <button
              @click="showForgotPassword = false"
              class="flex-1 px-4 py-2 rounded-lg font-semibold transition-colors duration-200 bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useProjectStore } from '@/stores/projectStore'
import { resetPassword } from '@/utils/supabase'
import { formatGoal, formatTimeline } from '@/utils/onboardingFormatters'

const router = useRouter()

const authStore = useAuthStore()
const projectStore = useProjectStore()
const isSignUp = ref(false)
const email = ref('')
const password = ref('')
const error = ref('')
const message = ref('')
const isLoading = ref(false)

const showForgotPassword = ref(false)
const resetEmail = ref('')
const resetLoading = ref(false)
const resetMessage = ref('')

const validateEmail = (emailValue) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(emailValue)
}

const clearErrors = () => {
  error.value = ''
  message.value = ''
}

const handleToggle = () => {
  isSignUp.value = !isSignUp.value
  clearErrors()
  email.value = ''
  password.value = ''
}

/**
 * Check for wizard data after login and create project if data exists
 */
const handlePostLoginWizardData = async () => {
  try {
    // Check if there's wizard data in localStorage
    const wizardDataRaw = localStorage.getItem('onboarding_wizard_data')
    if (!wizardDataRaw) return

    const savedData = JSON.parse(wizardDataRaw)
    const wizardData = savedData.data

    // Verify we have the minimum required data
    if (!wizardData || !wizardData.productName || !wizardData.targetAudience) {
      return
    }

    // Create project with wizard data
    const projectName = wizardData.productName || 'My Product Launch'
    const projectDescription = `
${wizardData.productDescription || ''}
Target Audience: ${wizardData.targetAudience}
Goal: ${formatGoal(wizardData.mainGoal)}
Timeline: ${formatTimeline(wizardData.timeline)}
    `.trim()

    const newProject = await projectStore.createProject(projectName, projectDescription)

    // Save wizard data to project settings
    if (newProject) {
      await projectStore.updateProjectSettings({
        productType: wizardData.productType,
        targetAudience: wizardData.targetAudience,
        mainGoal: wizardData.mainGoal,
        timeline: wizardData.timeline,
        budget: wizardData.budget,
        teamSize: wizardData.teamSize,
        currentStage: wizardData.currentStage
      })
    }

    // Clear wizard data from localStorage
    localStorage.removeItem('onboarding_wizard_data')
  } catch (err) {
    console.error('Error creating project from wizard data:', err)
    // Don't block login if project creation fails
  }
}

const handleSubmit = async () => {
  clearErrors()

  if (!validateEmail(email.value)) {
    error.value = 'Please enter a valid email address'
    return
  }

  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters'
    return
  }

  isLoading.value = true

  try {
    if (isSignUp.value) {
      const result = await authStore.handleSignUp(email.value, password.value)
      if (!result.success) {
        error.value = result.error?.message || 'Sign up failed. Please check your email is valid.'
        return
      }

      // Handle both email confirmation and auto-confirmation scenarios
      if (result.requiresConfirmation) {
        message.value = '✉️ ' + result.message
      } else {
        // Auto-confirmation enabled - user can login immediately
        message.value = '✅ ' + result.message
        setTimeout(() => {
          // Auto-redirect to landing page if email confirmation is disabled
          router.push('/landing')
        }, 1500)
      }

      email.value = ''
      password.value = ''
      isSignUp.value = false
    } else {
      const result = await authStore.handleSignIn(email.value, password.value)
      if (!result.success) {
        error.value = result.error?.message || 'Invalid login credentials'
        return
      }
      // Login successful - check for wizard data
      message.value = '✅ Login successful! Redirecting...'
      setTimeout(async () => {
        await handlePostLoginWizardData()
        router.push('/app')
      }, 500)
    }
  } catch (err) {
    error.value = err.message || 'An error occurred. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const handlePasswordReset = async () => {
  if (!validateEmail(resetEmail.value)) {
    resetMessage.value = '❌ Please enter a valid email address'
    return
  }

  resetLoading.value = true
  try {
    const result = await resetPassword(resetEmail.value)

    if (!result.success) {
      resetMessage.value = '❌ ' + result.error
      return
    }

    resetMessage.value = '✅ ' + result.message
    resetEmail.value = ''
    setTimeout(() => {
      showForgotPassword.value = false
      resetMessage.value = ''
    }, 4000)
  } catch (err) {
    resetMessage.value = '❌ ' + (err.message || 'Failed to send reset link.')
  } finally {
    resetLoading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
