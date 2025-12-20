// Onboarding Wizard Store
// Manages wizard state, localStorage persistence, and validation

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'onboarding_wizard_data'
const STORAGE_EXPIRY_DAYS = 7

export const useOnboardingStore = defineStore('onboarding', () => {
  // State
  const currentStep = ref(1)
  const startTime = ref(Date.now())

  const wizardData = ref({
    // Step 1: Product type
    productType: null,
    productName: '',
    productDescription: '',

    // Step 2: Experience level
    experienceLevel: null, // 'beginner' or 'intermediate'

    // Step 3: Target audience
    targetAudience: '',

    // Step 4: Goals
    mainGoal: null,
    timeline: null,

    // Step 5: Optional details
    budget: null,
    teamSize: 'solo',
    techStack: [],
    currentStage: 'building',
    launchDate: null
  })

  // Load from localStorage on initialization
  const loadFromStorage = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) return false

      const parsed = JSON.parse(saved)

      // Check expiry
      const savedAt = new Date(parsed.savedAt)
      const expiryDate = new Date(savedAt)
      expiryDate.setDate(expiryDate.getDate() + STORAGE_EXPIRY_DAYS)

      if (new Date() > expiryDate) {
        localStorage.removeItem(STORAGE_KEY)
        return false
      }

      // Restore data
      wizardData.value = { ...wizardData.value, ...parsed.data }
      currentStep.value = parsed.currentStep || 1
      startTime.value = parsed.startTime || Date.now()

      return true
    } catch (e) {
      console.error('Failed to load wizard data:', e)
      return false
    }
  }

  // Save to localStorage
  const saveToStorage = () => {
    try {
      const dataToSave = {
        data: wizardData.value,
        currentStep: currentStep.value,
        startTime: startTime.value,
        savedAt: new Date().toISOString()
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
    } catch (e) {
      console.error('Failed to save wizard data:', e)
    }
  }

  // Clear wizard data
  const clearWizard = () => {
    localStorage.removeItem(STORAGE_KEY)
    currentStep.value = 1
    startTime.value = Date.now()
    wizardData.value = {
      productType: null,
      productName: '',
      productDescription: '',
      experienceLevel: null,
      targetAudience: '',
      mainGoal: null,
      timeline: null,
      budget: null,
      teamSize: 'solo',
      techStack: [],
      currentStage: 'building',
      launchDate: null
    }
  }

  // Navigation
  const nextStep = () => {
    if (currentStep.value < 6) {
      currentStep.value++
      saveToStorage()
    }
  }

  const prevStep = () => {
    if (currentStep.value > 1) {
      currentStep.value--
      saveToStorage()
    }
  }

  const goToStep = (step) => {
    if (step >= 1 && step <= currentStep.value) {
      currentStep.value = step
    }
  }

  // Update data
  const updateField = (field, value) => {
    wizardData.value[field] = value
    saveToStorage()
  }

  const updateMultiple = (updates) => {
    Object.assign(wizardData.value, updates)
    saveToStorage()
  }

  // Validation per step
  const isStepValid = computed(() => {
    switch (currentStep.value) {
      case 1:
        return !!(wizardData.value.productType && wizardData.value.productName?.trim())
      case 2:
        return !!(wizardData.value.experienceLevel) // Experience level selection
      case 3:
        return !!(wizardData.value.targetAudience?.trim())
      case 4:
        return !!(wizardData.value.mainGoal && wizardData.value.timeline)
      case 5:
        return true // Optional step
      case 6:
        return true // Validation in component
      default:
        return false
    }
  })

  // Progress
  const progressPercentage = computed(() => {
    return Math.round((currentStep.value / 6) * 100)
  })

  // Time spent
  const timeSpentMinutes = computed(() => {
    const elapsed = Date.now() - startTime.value
    return Math.round(elapsed / 60000)
  })

  // Required fields summary for step 5
  const wizardSummary = computed(() => {
    return {
      productType: wizardData.value.productType,
      productName: wizardData.value.productName,
      targetAudience: wizardData.value.targetAudience,
      mainGoal: wizardData.value.mainGoal,
      timeline: wizardData.value.timeline,
      hasOptionalDetails: !!(
        wizardData.value.budget ||
        wizardData.value.techStack?.length ||
        wizardData.value.launchDate
      )
    }
  })

  // Sync wizard data to Supabase (called on wizard completion)
  const syncToSupabase = async (projectId) => {
    try {
      if (!projectId) throw new Error('No project ID provided')

      // Import dynamically to avoid circular dependencies
      const { useProjectStore } = await import('./projectStore.js')
      const projectStore = useProjectStore()

      // Map onboarding fields to project settings
      const settingsToSync = {
        productType: wizardData.value.productType,
        productName: wizardData.value.productName,
        productDescription: wizardData.value.productDescription,
        experienceLevel: wizardData.value.experienceLevel,
        targetAudience: wizardData.value.targetAudience,
        mainGoal: wizardData.value.mainGoal,
        timeline: wizardData.value.timeline,
        budget: wizardData.value.budget,
        teamSize: wizardData.value.teamSize,
        techStack: wizardData.value.techStack,
        currentStage: wizardData.value.currentStage,
        launchDate: wizardData.value.launchDate
      }

      // Save to Supabase via project store
      await projectStore.updateProjectSettings(settingsToSync)
    } catch (e) {
      console.error('Failed to sync wizard data to Supabase:', e)
      throw e
    }
  }

  // Initialize on store creation
  loadFromStorage()

  return {
    // State
    currentStep,
    wizardData,
    startTime,

    // Computed
    isStepValid,
    progressPercentage,
    timeSpentMinutes,
    wizardSummary,

    // Actions
    nextStep,
    prevStep,
    goToStep,
    updateField,
    updateMultiple,
    clearWizard,
    saveToStorage,
    loadFromStorage,
    syncToSupabase
  }
})
