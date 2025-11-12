<template>
  <div class="bg-white rounded-xl shadow-lg p-8">
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">🎉 Your launch plan is ready!</h2>
      <p class="text-gray-600">Create a free account to save your personalized plan</p>
    </div>

    <!-- Value preview -->
    <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-6">
      <h3 class="font-semibold text-gray-900 mb-3">📊 Your personalized plan includes:</h3>
      <ul class="space-y-2 text-sm text-gray-700">
        <li>✓ {{ taskCount }} high-impact marketing tasks</li>
        <li>✓ AI-powered content generator</li>
        <li>✓ Progress tracking dashboard</li>
        <li>✓ Export & share capabilities</li>
      </ul>

      <div class="mt-4 pt-4 border-t border-indigo-200">
        <p class="text-sm text-gray-600">
          ⏱️ <span class="font-medium">You've invested {{ timeSpent }} {{ timeSpent === 1 ? 'minute' : 'minutes' }}</span> planning - don't lose your work!
        </p>
      </div>
    </div>

    <!-- Signup form -->
    <div v-if="!isSigningUp" class="mb-6">
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Email:</label>
        <input
          v-model="email"
          type="email"
          placeholder="you@example.com"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          @keyup.enter="handleSignup"
        />
      </div>

      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Password:</label>
        <input
          v-model="password"
          type="password"
          placeholder="••••••••"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          @keyup.enter="handleSignup"
        />
        <p class="text-xs text-gray-500 mt-1">At least 6 characters</p>
      </div>

      <!-- Error message -->
      <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
        {{ errorMessage }}
      </div>

      <!-- Terms checkbox -->
      <label class="flex items-start mb-6 cursor-pointer">
        <input
          v-model="agreedToTerms"
          type="checkbox"
          class="mt-1 mr-3"
        />
        <span class="text-sm text-gray-600">
          I agree to the <a href="#" class="text-indigo-600 hover:underline">Terms of Service</a> and <a href="#" class="text-indigo-600 hover:underline">Privacy Policy</a>
        </span>
      </label>
    </div>

    <!-- Loading state -->
    <div v-if="isSigningUp" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
      <p class="text-gray-600">Creating your account...</p>
    </div>

    <!-- Navigation -->
    <div v-if="!isSigningUp" class="flex justify-between">
      <button
        @click="onboardingStore.prevStep()"
        class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition"
      >
        ← Back
      </button>
      <button
        @click="handleSignup"
        :disabled="!isFormValid"
        :class="[
          'px-6 py-3 rounded-lg font-medium transition',
          isFormValid
            ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        ]"
      >
        Create Account & Start →
      </button>
    </div>

    <!-- Already have account link -->
    <div v-if="!isSigningUp" class="text-center mt-6">
      <router-link to="/auth?mode=login" class="text-sm text-indigo-600 hover:underline">
        Already have an account? Sign in
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { useAuthStore } from '@/stores/authStore'
import { useProjectStore } from '@/stores/projectStore'
import { supabase } from '@/utils/supabase'

const router = useRouter()
const onboardingStore = useOnboardingStore()
const authStore = useAuthStore()
const projectStore = useProjectStore()

const email = ref('')
const password = ref('')
const agreedToTerms = ref(false)
const isSigningUp = ref(false)
const errorMessage = ref('')

const timeSpent = computed(() => onboardingStore.timeSpentMinutes)
const taskCount = computed(() => {
  // Estimate based on product type
  const baseTasks = 18
  return baseTasks
})

const isFormValid = computed(() => {
  return (
    email.value.includes('@') &&
    password.value.length >= 6 &&
    agreedToTerms.value
  )
})

const handleSignup = async () => {
  if (!isFormValid.value) return

  isSigningUp.value = true
  errorMessage.value = ''

  try {
    // 1. Sign up user
    const { data: authData, error: signupError } = await supabase.auth.signUp({
      email: email.value,
      password: password.value
    })

    if (signupError) {
      // Check if user already exists
      if (signupError.message?.includes('already registered')) {
        errorMessage.value = 'This email is already registered. Please sign in instead.'
        isSigningUp.value = false
        return
      }
      throw signupError
    }

    if (!authData.user) {
      throw new Error('Signup failed - no user returned')
    }

    // 2. Check if email confirmation is required
    if (!authData.session) {
      // Email confirmation required - keep wizard data in localStorage
      errorMessage.value = '✉️ Please check your email to confirm your account. After confirmation, sign in to access your personalized plan.'
      isSigningUp.value = false
      // Wizard data stays in localStorage for use after email confirmation + login
      return
    }

    // 3. Session is available - proceed with project creation
    await authStore.initializeAuth()

    // Wait a moment to ensure session is fully propagated
    await new Promise(resolve => setTimeout(resolve, 300))

    // 4. Create project with wizard data
    const wizardData = onboardingStore.wizardData
    const projectName = wizardData.productName || 'My Product Launch'

    const projectDescription = `
${wizardData.productDescription || ''}
Target Audience: ${wizardData.targetAudience}
Goal: ${formatGoal(wizardData.mainGoal)}
Timeline: ${formatTimeline(wizardData.timeline)}
    `.trim()

    // Verify auth state before creating project
    if (!authStore.isAuthenticated) {
      throw new Error('Authentication state not ready. Please refresh and try again.')
    }

    const newProject = await projectStore.createProject(projectName, projectDescription)

    // 5. Save wizard data to project settings
    await projectStore.updateProjectSettings({
      productType: wizardData.productType,
      targetAudience: wizardData.targetAudience,
      mainGoal: wizardData.mainGoal,
      timeline: wizardData.timeline,
      budget: wizardData.budget,
      teamSize: wizardData.teamSize,
      currentStage: wizardData.currentStage
    })

    // 6. Clear wizard data
    onboardingStore.clearWizard()

    // 7. Redirect to dashboard
    router.push('/app')

  } catch (error) {
    console.error('Signup error:', error)

    // Provide specific error messages
    if (error.message?.includes('not authenticated') || error.message?.includes('JWT')) {
      errorMessage.value = 'Session expired. Please refresh the page and try again.'
    } else if (error.message?.includes('already registered')) {
      errorMessage.value = 'This email is already registered. Please sign in instead.'
    } else {
      errorMessage.value = error.message || 'Failed to create account. Please try again.'
    }

    isSigningUp.value = false
  }
}

const formatGoal = (goal) => {
  const goals = {
    first_100: 'Make first $100',
    '1k_mrr': 'Reach $1K MRR',
    '10k_mrr': 'Reach $10K MRR',
    audience: 'Build an audience',
    validate: 'Validate idea'
  }
  return goals[goal] || goal
}

const formatTimeline = (timeline) => {
  const timelines = {
    '1_month': '1 month',
    '3_months': '3 months',
    '6_months': '6 months',
    no_timeline: 'No specific timeline'
  }
  return timelines[timeline] || timeline
}
</script>
