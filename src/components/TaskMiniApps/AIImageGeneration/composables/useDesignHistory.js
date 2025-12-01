/**
 * useDesignHistory - Composable for managing design history and persistence
 *
 * Handles:
 * - Saving generated designs locally
 * - Browsing generation history
 * - Quick access to recent designs
 */

import { ref, computed } from 'vue'

const STORAGE_KEY = 'design-graphics-history'
const MAX_HISTORY_ITEMS = 20

export function useDesignHistory() {
  const history = ref([])

  /**
   * Load history from localStorage on initialization
   */
  const loadHistory = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        history.value = JSON.parse(stored)
      }
    } catch (err) {
      console.error('Failed to load history:', err)
      history.value = []
    }
  }

  /**
   * Save a design to history
   */
  const saveDesign = (designData) => {
    const {
      designPurpose,
      designStyle,
      keyMessage,
      imageUrl,
      brief = null,
      timestamp = new Date().toISOString()
    } = designData

    const design = {
      id: `design-${Date.now()}`,
      designPurpose,
      designStyle,
      keyMessage,
      imageUrl,
      brief,
      timestamp,
      // Metadata for UI display
      displayName: `${keyMessage} (${new Date(timestamp).toLocaleDateString()})`,
      thumbnail: imageUrl
    }

    // Add to beginning of history
    history.value.unshift(design)

    // Keep only recent items
    if (history.value.length > MAX_HISTORY_ITEMS) {
      history.value = history.value.slice(0, MAX_HISTORY_ITEMS)
    }

    // Persist to localStorage
    _persistHistory()

    return design
  }

  /**
   * Get a design from history by ID
   */
  const getDesign = (designId) => {
    return history.value.find(d => d.id === designId)
  }

  /**
   * Remove a design from history
   */
  const removeDesign = (designId) => {
    history.value = history.value.filter(d => d.id !== designId)
    _persistHistory()
  }

  /**
   * Clear all history
   */
  const clearHistory = () => {
    history.value = []
    localStorage.removeItem(STORAGE_KEY)
  }

  /**
   * Get recent designs (last N items)
   */
  const getRecent = (count = 5) => {
    return history.value.slice(0, count)
  }

  /**
   * Find designs by purpose
   */
  const getByPurpose = (purpose) => {
    return history.value.filter(d => d.designPurpose === purpose)
  }

  /**
   * Find designs by style
   */
  const getByStyle = (style) => {
    return history.value.filter(d => d.designStyle === style)
  }

  /**
   * Check if history is empty
   */
  const isEmpty = computed(() => history.value.length === 0)

  /**
   * Get history count
   */
  const count = computed(() => history.value.length)

  /**
   * Persist history to localStorage
   */
  const _persistHistory = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history.value))
    } catch (err) {
      console.error('Failed to persist history:', err)
    }
  }

  // Load history on initialization
  loadHistory()

  return {
    history,
    isEmpty,
    count,
    saveDesign,
    getDesign,
    removeDesign,
    clearHistory,
    getRecent,
    getByPurpose,
    getByStyle
  }
}
