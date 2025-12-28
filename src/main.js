/**
 * Application Entry Point
 *
 * Initializes Vue 3 application with:
 * - Vue instance creation
 * - Router setup
 * - Pinia store initialization
 * - Sentry error tracking (production only)
 * - Global CSS import
 * - Component mounting
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as Sentry from '@sentry/vue'
import App from './App.vue'
import router from './router/index.js'
import './assets/main.css'

// Create Vue app instance
const app = createApp(App)

// Initialize Sentry error tracking (production only)
if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    app,
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration({ router }),
      Sentry.replayIntegration()
    ],
    // Capture 10% of transactions for performance monitoring
    tracesSampleRate: 0.1,
    // Capture 10% of sessions for session replay
    replaysSessionSampleRate: 0.1,
    // Capture 100% of sessions with errors for replay
    replaysOnErrorSampleRate: 1.0,
    environment: 'production'
  })
}

// Initialize Pinia for state management
app.use(createPinia())

// Initialize Vue Router
app.use(router)

// Mount app to DOM
app.mount('#app')
