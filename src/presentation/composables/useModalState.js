/**
 * useModalState Composable
 *
 * Manages modal visibility and state.
 * Provides clean API for showing/hiding modals with data passing.
 */

import { ref, computed } from 'vue'

export function useModalState() {
  // STATE
  const isOpen = ref(false)
  const modalData = ref(null)

  // COMPUTED
  const isClosed = computed(() => !isOpen.value)

  /**
   * Open modal
   */
  function open(data = null) {
    modalData.value = data
    isOpen.value = true
  }

  /**
   * Close modal
   */
  function close() {
    isOpen.value = false
    // Clear data after animation
    setTimeout(() => {
      modalData.value = null
    }, 300)
  }

  /**
   * Toggle modal
   */
  function toggle(data = null) {
    if (isOpen.value) {
      close()
    } else {
      open(data)
    }
  }

  /**
   * Update modal data
   */
  function updateData(newData) {
    modalData.value = newData
  }

  /**
   * Reset to initial state
   */
  function reset() {
    isOpen.value = false
    modalData.value = null
  }

  return {
    // State
    isOpen,
    modalData,

    // Computed
    isClosed,

    // Actions
    open,
    close,
    toggle,
    updateData,
    reset
  }
}
