<template>
  <div class="bg-white rounded-xl shadow-lg p-8">
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">🔧 A few more details</h2>
      <p class="text-gray-600">Optional - skip this if you want to start right away!</p>
    </div>

    <!-- Team size -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">Team size:</label>
      <select
        v-model="wizardData.teamSize"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
        @change="onboardingStore.saveToStorage()"
      >
        <option value="solo">Just me</option>
        <option value="2-5">2-5 people</option>
        <option value="6-10">6-10 people</option>
        <option value="10+">10+ people</option>
      </select>
    </div>

    <!-- Current stage -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">Current stage:</label>
      <select
        v-model="wizardData.currentStage"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
        @change="onboardingStore.saveToStorage()"
      >
        <option value="idea">Just an idea</option>
        <option value="building">Building</option>
        <option value="beta">In beta</option>
        <option value="launched">Already launched</option>
      </select>
    </div>

    <!-- Budget -->
    <div class="mb-8">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Marketing budget (optional):
      </label>
      <div class="relative">
        <span class="absolute left-4 top-3 text-gray-500">$</span>
        <input
          v-model.number="wizardData.budget"
          type="number"
          placeholder="0"
          class="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          @input="onboardingStore.saveToStorage()"
        />
      </div>
    </div>

    <!-- Error message -->
    <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
      {{ errorMessage }}
    </div>

    <!-- Loading state (for new project mode) -->
    <div v-if="isCreating" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
      <p class="text-gray-600">Creating your project...</p>
    </div>

    <!-- Navigation -->
    <div v-if="!isCreating" class="flex justify-between">
      <button
        @click="onboardingStore.prevStep()"
        class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition"
      >
        ← Back
      </button>
      <div class="flex gap-3">
        <button
          @click="handleNext"
          class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition"
        >
          Skip →
        </button>
        <button
          @click="handleNext"
          class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
        >
          {{ isNewProjectMode ? 'Create Project →' : 'Save & Next →' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useOnboardingStore } from '@/stores/onboardingStore'
import { useProjectStore } from '@/stores/projectStore'
import { formatGoal, formatTimeline } from '@/utils/onboardingFormatters'

const router = useRouter()
const onboardingStore = useOnboardingStore()
const projectStore = useProjectStore()

const wizardData = computed(() => onboardingStore.wizardData)
const isNewProjectMode = computed(() => onboardingStore.isNewProjectMode)

const isCreating = ref(false)
const errorMessage = ref('')

const handleNext = async () => {
  // If not in new project mode, just go to next step (signup)
  if (!isNewProjectMode.value) {
    onboardingStore.nextStep()
    return
  }

  // In new project mode, create the project directly
  isCreating.value = true
  errorMessage.value = ''

  try {
    const data = wizardData.value
    const projectName = data.productName || 'My Product Launch'
    const projectDescription = `
${data.productDescription || ''}
Target Audience: ${data.targetAudience}
Goal: ${formatGoal(data.mainGoal)}
Timeline: ${formatTimeline(data.timeline)}
    `.trim()

    // Create the project
    await projectStore.createProject(projectName, projectDescription)

    // Save wizard data to project settings
    await projectStore.updateProjectSettings({
      productType: data.productType,
      experienceLevel: data.experienceLevel,
      targetAudience: data.targetAudience,
      mainGoal: data.mainGoal,
      timeline: data.timeline,
      budget: data.budget,
      teamSize: data.teamSize,
      currentStage: data.currentStage
    })

    // Clear wizard state
    onboardingStore.clearWizard()
    onboardingStore.setNewProjectMode(false)

    // Navigate to dashboard
    router.push('/app')
  } catch (error) {
    console.error('Failed to create project:', error)
    errorMessage.value = error.message || 'Failed to create project. Please try again.'
    isCreating.value = false
  }
}
</script>
