/**
 * useTaskFormData - Vue composable for task form data management
 *
 * SSOT Phase 4: Provides reactive form data management with automatic
 * persistence to Supabase normalized tables.
 *
 * Features:
 * - Reactive form data with Vue refs
 * - Auto-save on changes with debouncing
 * - Field-level persistence (no blob storage)
 * - Backward compatible with existing MiniAppShell
 * - Does NOT store AI responses (regenerate on demand)
 */

import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue'
import {
  getTaskData,
  saveFormData,
  saveSavedItems,
  saveFormField
} from '@/services/taskDataService'
import { logger } from '@/utils/logger'

/**
 * Composable for managing task form data with auto-persistence
 *
 * @param {string} projectId - Project UUID
 * @param {string} taskId - Task identifier (e.g., 'define-audience')
 * @param {object} options - Configuration options
 * @param {number} options.debounceMs - Debounce delay in ms (default: 500)
 * @param {object} options.initialData - Initial form data (from props)
 * @param {boolean} options.autoSave - Enable auto-save on changes (default: true)
 * @returns {object} Reactive form data and methods
 */
export function useTaskFormData(projectId, taskId, options = {}) {
  const {
    debounceMs = 500,
    initialData = {},
    autoSave = true
  } = options

  // Reactive state
  const formData = ref({ ...initialData.formData || {} })
  const savedItems = ref([...(initialData.savedItems || [])])
  const isLoading = ref(false)
  const isSaving = ref(false)
  const error = ref(null)
  const lastSaveTime = ref(null)
  const isDirty = ref(false)

  // Internal state
  let saveTimeout = null
  let pendingFieldUpdates = {}
  let isInitialized = false

  // Computed
  const hasUnsavedChanges = computed(() => isDirty.value)

  /**
   * Load task data from database
   */
  const loadData = async () => {
    if (!projectId || !taskId) {
      logger.warn('[useTaskFormData] Missing projectId or taskId')
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const data = await getTaskData(projectId, taskId)

      // Merge with initial data (initial takes precedence for undefined fields)
      formData.value = {
        ...data.formData,
        ...formData.value
      }
      savedItems.value = data.savedItems.length > 0 ? data.savedItems : savedItems.value

      isInitialized = true
      isDirty.value = false
      logger.debug(`[useTaskFormData] Loaded data for task ${taskId}`)
    } catch (err) {
      logger.error('[useTaskFormData] Error loading data:', err)
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Save form data to database
   * Called after debounce delay
   */
  const saveData = async () => {
    if (!projectId || !taskId) {
      logger.warn('[useTaskFormData] Missing projectId or taskId')
      return
    }

    if (Object.keys(pendingFieldUpdates).length === 0 && !isDirty.value) {
      return
    }

    isSaving.value = true
    error.value = null

    try {
      // Save form data
      await saveFormData(projectId, taskId, formData.value)

      // Clear pending updates
      pendingFieldUpdates = {}
      isDirty.value = false
      lastSaveTime.value = new Date()

      logger.debug(`[useTaskFormData] Saved data for task ${taskId}`)
    } catch (err) {
      logger.error('[useTaskFormData] Error saving data:', err)
      error.value = err.message
      throw err
    } finally {
      isSaving.value = false
    }
  }

  /**
   * Save saved items to database
   */
  const saveSavedItemsToDb = async () => {
    if (!projectId || !taskId) return

    try {
      await saveSavedItems(projectId, taskId, savedItems.value)
      logger.debug(`[useTaskFormData] Saved ${savedItems.value.length} items for task ${taskId}`)
    } catch (err) {
      logger.error('[useTaskFormData] Error saving items:', err)
      error.value = err.message
    }
  }

  /**
   * Debounced save - schedules a save after delay
   */
  const debouncedSave = () => {
    if (saveTimeout) {
      clearTimeout(saveTimeout)
    }

    saveTimeout = setTimeout(() => {
      saveData()
      saveTimeout = null
    }, debounceMs)
  }

  /**
   * Update a single field value
   * Triggers debounced auto-save if enabled
   *
   * @param {string} fieldName - Field identifier
   * @param {any} value - New field value
   */
  const updateField = (fieldName, value) => {
    formData.value[fieldName] = value
    pendingFieldUpdates[fieldName] = value
    isDirty.value = true

    if (autoSave && isInitialized) {
      debouncedSave()
    }
  }

  /**
   * Update multiple fields at once
   *
   * @param {object} updates - Object with field names as keys
   */
  const updateFields = (updates) => {
    for (const [fieldName, value] of Object.entries(updates)) {
      formData.value[fieldName] = value
      pendingFieldUpdates[fieldName] = value
    }
    isDirty.value = true

    if (autoSave && isInitialized) {
      debouncedSave()
    }
  }

  /**
   * Set entire form data object
   * Used when replacing all form data at once
   *
   * @param {object} newFormData - Complete form data object
   */
  const setFormData = (newFormData) => {
    formData.value = { ...newFormData }
    isDirty.value = true

    if (autoSave && isInitialized) {
      debouncedSave()
    }
  }

  /**
   * Add a saved item
   *
   * @param {object} item - Item to save
   */
  const addSavedItem = (item) => {
    savedItems.value.push({
      ...item,
      timestamp: item.timestamp || new Date().toISOString()
    })

    if (autoSave && isInitialized) {
      saveSavedItemsToDb()
    }
  }

  /**
   * Remove a saved item by index
   *
   * @param {number} index - Index of item to remove
   */
  const removeSavedItem = (index) => {
    savedItems.value.splice(index, 1)

    if (autoSave && isInitialized) {
      saveSavedItemsToDb()
    }
  }

  /**
   * Clear all saved items
   */
  const clearSavedItems = () => {
    savedItems.value = []

    if (autoSave && isInitialized) {
      saveSavedItemsToDb()
    }
  }

  /**
   * Force immediate save (bypass debounce)
   */
  const saveNow = async () => {
    if (saveTimeout) {
      clearTimeout(saveTimeout)
      saveTimeout = null
    }

    await Promise.all([
      saveData(),
      saveSavedItemsToDb()
    ])
  }

  /**
   * Reset form to last saved state
   */
  const resetToSaved = async () => {
    await loadData()
    isDirty.value = false
    pendingFieldUpdates = {}
  }

  /**
   * Get data in format compatible with old save event
   * Used for backward compatibility with existing components
   *
   * @returns {object} { formData, savedItems }
   */
  const getCompatibleData = () => ({
    formData: formData.value,
    savedItems: savedItems.value
    // Note: aiOutput not included - regenerate on demand
  })

  // Watch for external formData changes (from props)
  watch(
    () => formData.value,
    () => {
      if (!isDirty.value && isInitialized) {
        isDirty.value = true
        if (autoSave) {
          debouncedSave()
        }
      }
    },
    { deep: true }
  )

  // Load data on mount
  onMounted(() => {
    loadData()
  })

  // Cleanup on unmount
  onBeforeUnmount(() => {
    if (saveTimeout) {
      clearTimeout(saveTimeout)
      saveTimeout = null
    }

    // Force save any pending changes
    if (isDirty.value && Object.keys(pendingFieldUpdates).length > 0) {
      saveData().catch(err => {
        logger.error('[useTaskFormData] Error saving on unmount:', err)
      })
    }
  })

  return {
    // Reactive state
    formData,
    savedItems,
    isLoading,
    isSaving,
    error,
    lastSaveTime,
    isDirty,
    hasUnsavedChanges,

    // Methods
    loadData,
    saveNow,
    resetToSaved,
    updateField,
    updateFields,
    setFormData,
    addSavedItem,
    removeSavedItem,
    clearSavedItems,
    getCompatibleData
  }
}

/**
 * Simplified composable for field-level auto-save
 * Use this when you just need basic form persistence
 *
 * @param {string} projectId - Project UUID
 * @param {string} taskId - Task identifier
 * @param {object} initialFormData - Initial form values
 * @returns {object} { formData, savedItems, isSaving }
 */
export function useAutoSaveTaskForm(projectId, taskId, initialFormData = {}) {
  return useTaskFormData(projectId, taskId, {
    initialData: { formData: initialFormData },
    autoSave: true,
    debounceMs: 500
  })
}

export default useTaskFormData
