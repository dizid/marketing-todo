<template>
  <!-- Root Application Component
       Handles routing and auth state management
  -->
  <div id="app">
    <!-- Route Views wrapped in ErrorBoundary -->
    <ErrorBoundary>
      <router-view />
    </ErrorBoundary>
  </div>
</template>

<script setup>
/**
 * App.vue - Root Component
 *
 * Responsibilities:
 * - Initialize authentication state on app load
 * - Subscribe to auth state changes
 * - Render router views
 * - Handle app-level state
 */

import { onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import ErrorBoundary from '@/components/ErrorBoundary.vue'
import { logger } from '@/utils/logger'

const authStore = useAuthStore()
let unsubscribe = null

/**
 * Initialize app on mount
 * - Check for existing sessions
 * - Handle email confirmation redirect
 * - Subscribe to auth state changes
 */
onMounted(async () => {
  // Initialize authentication
  await authStore.initializeAuth()

  // Handle email confirmation - if user just confirmed, auto-login
  const hash = window.location.hash
  if (hash && (hash.includes('type=recovery') || hash.includes('type=signup'))) {
    // User just confirmed email or reset password
    // They should be logged in automatically
    logger.info('Email confirmation detected, user should be authenticated')
  }

  // Subscribe to future auth state changes
  unsubscribe = authStore.subscribeToAuthChanges()
})

/**
 * Cleanup on unmount
 * - Remove auth state change listener
 */
onBeforeUnmount(() => {
  if (unsubscribe && typeof unsubscribe === 'function') {
    unsubscribe()
  }
})
</script>

<style>
/* App-level styling */
#app {
  width: 100%;
  max-width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
}
</style>
