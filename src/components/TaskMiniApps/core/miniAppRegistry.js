/**
 * Mini-App Registry
 *
 * Central registry of all available mini-app configurations.
 * Import and add new configs here to register them.
 */

import { defineAudienceConfig } from '../configs/defineAudience.config.js'
import { generatePostsConfig } from '../configs/generatePosts.config.js'

export const miniAppRegistry = {
  'define-audience': defineAudienceConfig,
  'generate-posts': generatePostsConfig
  // Add more configs here as we build them
}

/**
 * Get a mini-app configuration by ID
 * @param {string} taskId - The task ID to look up
 * @returns {object|null} - The config object or null if not found
 */
export function getMiniAppConfig(taskId) {
  return miniAppRegistry[taskId] || null
}

/**
 * Get all registered mini-app IDs
 * @returns {array} - Array of all registered task IDs
 */
export function getRegisteredMiniApps() {
  return Object.keys(miniAppRegistry)
}

/**
 * Check if a task has a mini-app configuration
 * @param {string} taskId - The task ID to check
 * @returns {boolean} - True if mini-app exists
 */
export function hasMiniApp(taskId) {
  return taskId in miniAppRegistry
}
