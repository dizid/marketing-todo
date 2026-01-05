/**
 * Vue Router Configuration
 *
 * Handles application routing including:
 * - Public landing page (marketing)
 * - Onboarding wizard (new user signup flow)
 * - Authentication routes (login, signup)
 * - Protected dashboard & subscription routes
 * - Route guards for session validation
 * - Redirection based on auth state
 *
 * Routes:
 * - / (public) - Landing page (public marketing page)
 * - /welcome (public) - Onboarding wizard for new users
 * - /landing (public) - Landing page alias
 * - /auth - Authentication page (login/signup, public)
 * - /app (protected) - Dashboard
 * - /app/subscription (protected) - Subscription management
 *
 * Auth Guards:
 * - Unauthenticated users: / → LandingPage
 * - Unauthenticated users: /app → /auth
 * - Authenticated users: / → /app
 * - Authenticated users: /auth → /app
 * - Authenticated users can still access /landing for pricing info
 */

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { logger } from '@/utils/logger'
import AuthForm from '@/components/AuthForm.vue'
import { DashboardContainer } from '@/components/Dashboard'
import AnalyticsDashboardPage from '@/components/Dashboard/AnalyticsDashboardPage.vue'
import ResetPassword from '@/components/ResetPassword.vue'
import OnboardingWizard from '@/components/Onboarding/OnboardingWizard.vue'
import LandingPage from '@/components/LandingPage.vue'
import ManageSubscriptionPage from '@/components/ManageSubscriptionPage.vue'

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
    path: '/onboarding',
    name: 'OnboardingNewProject',
    component: OnboardingWizard,
    meta: {
      requiresAuth: true, // Requires auth for new project mode
      layout: 'clean'
    },
    props: route => ({
      isNewProject: route.query.mode === 'new-project'
    })
  },
  {
    path: '/landing',
    name: 'Landing',
    component: LandingPage,
    meta: {
      requiresAuth: false,
      layout: 'blank'
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
    name: 'Home',
    component: LandingPage,
    meta: {
      requiresAuth: false,
      layout: 'blank'
    }
  },
  {
    path: '/app',
    name: 'Dashboard',
    component: DashboardContainer,
    meta: {
      requiresAuth: true,
      layout: 'default'
    }
  },
  {
    path: '/app/subscription',
    name: 'ManageSubscription',
    component: ManageSubscriptionPage,
    meta: {
      requiresAuth: true,
      layout: 'default'
    }
  },
  {
    path: '/app/analytics',
    name: 'Analytics',
    component: AnalyticsDashboardPage,
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

  // ALWAYS initialize auth, even if session exists (to ensure session is fresh)
  // This is critical for payment redirect flows where user is already logged in
  if (authStore.isLoading) {
    // Wait for auth to finish loading with timeout
    await new Promise((resolve, reject) => {
      const startTime = Date.now()
      const timeoutMs = 5000 // 5 second timeout

      const checkAuth = () => {
        if (!authStore.isLoading) {
          resolve()
          return
        }

        if (Date.now() - startTime > timeoutMs) {
          reject(new Error('Auth initialization timeout after 5s'))
          return
        }

        // Check every 100ms instead of 50ms for better performance
        setTimeout(checkAuth, 100)
      }

      checkAuth()
    }).catch(err => {
      logger.warn(`Auth loading timeout: ${err.message}`)
    })
  } else if (!authStore.session) {
    // Only initialize if we don't have a session yet
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
    next('/app')
    return
  }

  // User is authenticated and trying to go to home page, redirect to app
  if (isAuthenticated && to.path === '/') {
    next('/app')
    return
  }

  // Authenticated users can still access /landing to see pricing
  // (redirect handled by LandingPage component if needed)

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
