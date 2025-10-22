/**
 * Application Entry Point
 *
 * Initializes Vue 3 application with:
 * - Vue instance creation
 * - Router setup
 * - Pinia store initialization
 * - Global CSS import
 * - Component mounting
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.js'
import './assets/main.css'

// Create Vue app instance
const app = createApp(App)

// Initialize Pinia for state management
app.use(createPinia())

// Initialize Vue Router
app.use(router)

// Mount app to DOM
app.mount('#app')
