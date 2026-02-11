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
import { useQuotaStore } from '@/stores/quotaStore'
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
  const quotaStore = useQuotaStore()

  // Wait for auth initialization to complete BEFORE proceeding
  // This prevents race conditions with quota and other downstream systems
  if (!authStore.isInitialized) {
    await new Promise((resolve, reject) => {
      const startTime = Date.now()
      const timeoutMs = 5000 // 5 second timeout

      const checkInitialized = () => {
        if (authStore.isInitialized) {
          resolve()
          return
        }

        if (Date.now() - startTime > timeoutMs) {
          reject(new Error('Auth initialization timeout after 5s'))
          return
        }

        // Check every 100ms
        setTimeout(checkInitialized, 100)
      }

      checkInitialized()
    }).catch(err => {
      logger.warn(`Auth initialization timeout: ${err.message}`)
    })
  }

  const isAuthenticated = !!authStore.user

  // Initialize quota ONLY after auth is fully initialized and user is authenticated
  // This prevents the race condition where quota defaults to free tier
  if (isAuthenticated && authStore.isInitialized && !quotaStore.subscription) {
    try {
      await quotaStore.initialize()
    } catch (err) {
      logger.warn(`Quota initialization failed: ${err.message}`)
    }
  }

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
