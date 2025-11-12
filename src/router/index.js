/**
 * Vue Router Configuration
 *
 * Handles application routing including:
 * - Authentication routes (login, signup)
 * - Protected dashboard route
 * - Route guards for session validation
 * - Redirection based on auth state
 *
 * Routes:
 * - /auth - Authentication page (login/signup)
 * - / - Dashboard (protected, requires authentication)
 */

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import AuthForm from '@/components/AuthForm.vue'
import Dashboard from '@/components/Dashboard.vue'
import ResetPassword from '@/components/ResetPassword.vue'
import OnboardingWizard from '@/components/Onboarding/OnboardingWizard.vue'

// Define routes
const routes = [
  {
    path: '/welcome',
    name: 'Onboarding',
    component: OnboardingWizard,
    meta: {
      requiresAuth: false,
      layout: 'clean'
    }
  },
  {
    path: '/auth',
    name: 'Auth',
    component: AuthForm,
    meta: {
      requiresAuth: false,
      layout: 'auth'
    }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword,
    meta: {
      requiresAuth: false,
      layout: 'auth'
    }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true,
      layout: 'default'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes
})

/**
 * Global navigation guard
 * Ensures user is authenticated before accessing protected routes
 */
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Initialize auth on first navigation
  if (!authStore.session && !authStore.isLoading) {
    await authStore.initializeAuth()
  }

  const isAuthenticated = !!authStore.user

  // Route requires authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/auth')
    return
  }

  // User is authenticated but trying to access auth page
  if (!to.meta.requiresAuth && isAuthenticated && to.path === '/auth') {
    next('/')
    return
  }

  next()
})

/**
 * Handle successful authentication
 * Redirect to dashboard when user logs in
 */
export const handleAuthSuccess = () => {
  router.push('/')
}

export default router
