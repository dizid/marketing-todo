/**
 * Authentication Store (Pinia)
 *
 * Manages global authentication state including:
 * - Current user information
 * - Session status
 * - Loading and error states
 * - Authentication actions (sign in, sign up, sign out)
 *
 * Usage:
 * import { useAuthStore } from '@/stores/authStore'
 * const auth = useAuthStore()
 * auth.user // Current user data
 * auth.isLoading // Loading state
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  onAuthStateChanged
} from '@/utils/supabase'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const session = ref(null)
  const isLoading = ref(true)
  const error = ref(null)

  // Computed
  const isAuthenticated = computed(() => !!user.value)

  /**
   * Initialize auth state by checking for existing session
   */
  const initializeAuth = async () => {
    try {
      isLoading.value = true
      error.value = null

      // Get current session
      const currentSession = await getCurrentUser()
      session.value = currentSession
      user.value = currentSession?.user || null
    } catch (err) {
      console.error('Auth initialization error:', err)
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Subscribe to auth state changes
   */
  const subscribeToAuthChanges = () => {
    return onAuthStateChanged((event, newSession) => {
      session.value = newSession
      user.value = newSession?.user || null
    })
  }

  /**
   * Handle user sign up
   * @param {string} email - User email
   * @param {string} password - User password
   */
  const handleSignUp = async (email, password) => {
    try {
      isLoading.value = true
      error.value = null
      const result = await signUp(email, password)
      return {
        success: true,
        requiresConfirmation: result.requiresConfirmation,
        message: result.message
      }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Handle user sign in
   * @param {string} email - User email
   * @param {string} password - User password
   */
  const handleSignIn = async (email, password) => {
    try {
      isLoading.value = true
      error.value = null
      await signIn(email, password)

      // Update user session after successful login
      const currentSession = await getCurrentUser()
      session.value = currentSession
      user.value = currentSession?.user || null

      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Handle user sign out
   */
  const handleSignOut = async () => {
    try {
      isLoading.value = true
      error.value = null

      await signOut()

      user.value = null
      session.value = null

      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Clear error message
   */
  const clearError = () => {
    error.value = null
  }

  return {
    // State
    user,
    session,
    isLoading,
    error,

    // Computed
    isAuthenticated,

    // Methods
    initializeAuth,
    subscribeToAuthChanges,
    handleSignUp,
    handleSignIn,
    handleSignOut,
    clearError
  }
})
