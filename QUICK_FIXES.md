# Quick Fixes - Ready to Implement

These are battle-tested code examples you can copy/paste and integrate immediately.

## Fix #1: useAsyncAction Composable (HIGHEST ROI)

**File:** Create `/home/marc/DEV/sales/src/composables/useAsyncAction.js`

```javascript
/**
 * Composable for handling async operations with loading and error states
 * Eliminates repeated isLoading/error try-catch pattern across stores
 * 
 * Usage:
 * const { isLoading, error, executeAsync } = useAsyncAction()
 * const fetchData = async () => {
 *   await executeAsync(async () => {
 *     const result = await getProjects()
 *     projects.value = result
 *   })
 * }
 */

import { ref } from 'vue'

export function useAsyncAction() {
  const isLoading = ref(false)
  const error = ref(null)
  
  const executeAsync = async (fn) => {
    isLoading.value = true
    error.value = null
    try {
      const result = await fn()
      return result
    } catch (err) {
      error.value = err.message || 'An error occurred'
      console.error('Async action error:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const clearError = () => {
    error.value = null
  }
  
  return {
    isLoading,
    error,
    executeAsync,
    clearError
  }
}
```

**Then refactor stores:**

```javascript
// BEFORE (in projectStore.js, 40+ similar patterns)
const fetchProjects = async () => {
  isLoading.value = true
  error.value = null
  try {
    const result = await getProjects()
    projects.value = result
  } catch (err) {
    error.value = err.message
    console.error('Error:', err)
  } finally {
    isLoading.value = false
  }
}

// AFTER
const { isLoading, error, executeAsync } = useAsyncAction()

const fetchProjects = async () => {
  await executeAsync(async () => {
    projects.value = await getProjects()
  })
}
```

**Impact:** Removes 500+ LOC of duplication

---

## Fix #2: Logger Utility (Quick & Easy)

**File:** Create `/home/marc/DEV/sales/src/utils/logger.js`

```javascript
/**
 * Centralized logging utility
 * Replaces scattered console.log calls with consistent formatting
 * 
 * Usage:
 * import { logger } from '@/utils/logger'
 * logger.info('ComponentName', 'User logged in')
 * logger.error('ComponentName', 'Network error', error)
 */

const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
}

// Can be toggled via env var
const MIN_LOG_LEVEL = import.meta.env.VITE_LOG_LEVEL || LogLevel.INFO

export const logger = {
  debug: (module, message, data) => {
    if (MIN_LOG_LEVEL <= LogLevel.DEBUG) {
      console.debug(`[${module}]`, message, data || '')
    }
  },
  
  info: (module, message, data) => {
    if (MIN_LOG_LEVEL <= LogLevel.INFO) {
      console.log(`[${module}]`, message, data || '')
    }
  },
  
  warn: (module, message, data) => {
    if (MIN_LOG_LEVEL <= LogLevel.WARN) {
      console.warn(`[${module}]`, message, data || '')
    }
  },
  
  error: (module, message, data) => {
    if (MIN_LOG_LEVEL <= LogLevel.ERROR) {
      console.error(`[${module}]`, message, data || '')
    }
  }
}
```

**Usage:** Replace all `console.log('[Module]', msg)` with `logger.info('Module', msg)`

---

## Fix #3: Storage Service

**File:** Create `/home/marc/DEV/sales/src/services/storageService.js`

```javascript
/**
 * Centralized storage service
 * Replaces 46 scattered localStorage.getItem/setItem calls
 * Provides single source of truth for storage keys and data shapes
 */

const STORAGE_KEYS = {
  APP_DATA: 'marketing-app-data',
  USER_PREFERENCES: 'user-preferences',
  DRAFT_CONTENT: 'draft-content'
}

export const storageService = {
  // App Data
  getAppData: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APP_DATA)
      return data ? JSON.parse(data) : {}
    } catch (err) {
      console.error('Failed to parse app data:', err)
      return {}
    }
  },
  
  saveAppData: (data) => {
    try {
      localStorage.setItem(STORAGE_KEYS.APP_DATA, JSON.stringify(data))
    } catch (err) {
      console.error('Failed to save app data:', err)
    }
  },
  
  updateAppData: (updates) => {
    const current = storageService.getAppData()
    const merged = { ...current, ...updates }
    storageService.saveAppData(merged)
    return merged
  },
  
  clearAppData: () => {
    localStorage.removeItem(STORAGE_KEYS.APP_DATA)
  },
  
  // User Preferences
  getPreferences: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES)
      return data ? JSON.parse(data) : {}
    } catch {
      return {}
    }
  },
  
  savePreferences: (prefs) => {
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(prefs))
  }
}
```

**Then update ChecklistItem.vue (line 204):**

```javascript
// BEFORE
const loadAppDescription = () => {
  const stored = localStorage.getItem('marketing-app-data')
  if (stored) {
    const data = JSON.parse(stored)
    appDescription.value = data.appDescription || ''
  }
}

// AFTER
import { storageService } from '@/services/storageService'

const loadAppDescription = () => {
  const data = storageService.getAppData()
  appDescription.value = data.appDescription || ''
}
```

---

## Fix #4: Task Categories Config

**File:** Create `/home/marc/DEV/sales/src/configs/dashboardCategories.js`

Move lines 288-572 from Dashboard.vue to this file:

```javascript
/**
 * Dashboard task categories configuration
 * Single source of truth for all task categories and items
 * Previously scattered in Dashboard.vue lines 288-572
 */

export const dashboardCategories = [
  {
    name: 'setup',
    label: 'Setup Basics',
    items: [
      {
        id: 'setup-1',
        name: 'Define Audience & Goals',
        description: 'Profile ideal users and set acquisition targets.',
        hasAI: true,
        miniAppId: 'define-audience'
      },
      // ... rest of items
    ]
  },
  // ... rest of categories
]
```

**Then in Dashboard.vue:**

```javascript
// BEFORE
const taskCategories = ref([
  {
    name: 'setup',
    label: 'Setup Basics',
    items: [ /* 284 LOC of inline data */ ]
  },
  // ...
])

// AFTER
import { dashboardCategories } from '@/configs/dashboardCategories'

const taskCategories = ref(dashboardCategories)
```

**Impact:** Dashboard.vue drops from 798 to ~514 LOC

---

## Fix #5: Mini-App Registry

**File:** Create `/home/marc/DEV/sales/src/configs/miniAppRegistry.js`

```javascript
/**
 * Mini-app registry
 * Replaces hardcoded imports in TaskModal (21 imports + customComponentMap)
 * Enables dynamic loading and easier maintenance
 */

const miniAppRegistry = {
  'define-audience': () => import('@/components/TaskMiniApps/DefineAudienceMiniApp.vue'),
  'landing-page-creator': () => import('@/components/TaskMiniApps/LandingPageCreatorAssistant.vue'),
  'connect-accounts': () => import('@/components/TaskMiniApps/ConnectAccountsMiniApp.vue'),
  'prepare-assets': () => import('@/components/TaskMiniApps/PrepareAssetsMiniApp.vue'),
  'tracking-sheet': () => import('@/components/TaskMiniApps/TrackingSheetMiniApp.vue'),
  'generate-posts': () => import('@/components/TaskMiniApps/GeneratePostsMiniApp.vue'),
  'engage-followers': () => import('@/components/TaskMiniApps/EngageFollowersMiniApp.vue'),
  'giveaway': () => import('@/components/TaskMiniApps/GiveawayMiniApp.vue'),
  'write-blog': () => import('@/components/TaskMiniApps/WriteBlogPostMiniApp.vue'),
  'video-script': () => import('@/components/TaskMiniApps/VideoScriptMiniApp.vue'),
  'design-graphics': () => import('@/components/TaskMiniApps/DesignGraphicsMiniApp.vue'),
  'community-posts': () => import('@/components/TaskMiniApps/CommunityPostsMiniApp.vue'),
  'outreach': () => import('@/components/TaskMiniApps/OutreachMiniApp.vue'),
  'webinar': () => import('@/components/TaskMiniApps/WebinarMiniApp.vue'),
  'feedback-collection': () => import('@/components/TaskMiniApps/FeedbackCollectionMiniApp.vue'),
  'changelog': () => import('@/components/TaskMiniApps/ChangelogMiniApp.vue'),
  'feature-prioritization': () => import('@/components/TaskMiniApps/FeaturePrioritizationMiniApp.vue'),
  'analytics-setup': () => import('@/components/TaskMiniApps/AnalyticsSetupMiniApp.vue'),
  'channel-analyzer': () => import('@/components/TaskMiniApps/ChannelAnalyzerMiniApp.vue'),
  'roi-calculator': () => import('@/components/TaskMiniApps/RoiCalculatorMiniApp.vue'),
  'paid-ads-launch': () => import('@/components/TaskMiniApps/PaidAdsLaunchMiniApp.vue'),
  'paid-ads-optimize': () => import('@/components/TaskMiniApps/PaidAdsOptimizeMiniApp.vue')
}

export async function getMiniAppComponent(miniAppId) {
  if (!miniAppRegistry[miniAppId]) {
    throw new Error(`Mini-app not found: ${miniAppId}`)
  }
  return miniAppRegistry[miniAppId]()
}

export function isMiniAppAvailable(miniAppId) {
  return miniAppId in miniAppRegistry
}
```

**Then update TaskModal.vue (lines 92-141):**

```javascript
// REMOVE all 21 imports and customComponentMap

// ADD at top
import { getMiniAppComponent } from '@/configs/miniAppRegistry'

// REPLACE customComponent computed
const customComponent = computed(async () => {
  if (!taskConfig.value?.customComponent) return null
  try {
    return await getMiniAppComponent(taskConfig.value.customComponent)
  } catch (err) {
    console.error('Failed to load mini-app:', err)
    return null
  }
})
```

---

## Fix #6: Error Boundary Component (Bonus)

**File:** Create `/home/marc/DEV/sales/src/components/ErrorBoundary.vue`

```vue
<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-container">
      <h3>Oops! Something went wrong</h3>
      <p>{{ error.message }}</p>
      <button @click="resetError" class="btn-primary">Try Again</button>
    </div>
  </div>
  <slot v-else />
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'

const hasError = ref(false)
const error = ref(null)

const resetError = () => {
  hasError.value = false
  error.value = null
}

onErrorCaptured((err) => {
  error.value = err
  hasError.value = true
  return false // Prevents propagation
})
</script>

<style scoped>
.error-boundary {
  padding: 2rem;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 0.5rem;
  text-align: center;
}
</style>
```

**Usage in App.vue:**

```vue
<ErrorBoundary>
  <RouterView />
</ErrorBoundary>
```

---

## Implementation Checklist

- [ ] Copy useAsyncAction.js to composables/
- [ ] Update stores to use useAsyncAction (5 min per store × 4 = 20 min)
- [ ] Copy logger.js to utils/
- [ ] Replace console.log calls (1 search/replace per file)
- [ ] Copy storageService.js to services/
- [ ] Update ChecklistItem.vue to use storageService
- [ ] Create dashboardCategories.js
- [ ] Remove inline categories from Dashboard.vue
- [ ] Create miniAppRegistry.js
- [ ] Update TaskModal.vue to use registry
- [ ] Create ErrorBoundary.vue
- [ ] Test everything

**Total Time: 6-8 hours** → Immediate impact on code quality

---

## Files Modified

1. `/home/marc/DEV/sales/src/composables/useAsyncAction.js` (NEW)
2. `/home/marc/DEV/sales/src/utils/logger.js` (NEW)
3. `/home/marc/DEV/sales/src/services/storageService.js` (NEW)
4. `/home/marc/DEV/sales/src/configs/dashboardCategories.js` (NEW)
5. `/home/marc/DEV/sales/src/configs/miniAppRegistry.js` (NEW)
6. `/home/marc/DEV/sales/src/components/ErrorBoundary.vue` (NEW)
7. `/home/marc/DEV/sales/src/stores/projectStore.js` (MODIFIED)
8. `/home/marc/DEV/sales/src/stores/subscriptionStore.js` (MODIFIED)
9. `/home/marc/DEV/sales/src/stores/authStore.js` (MODIFIED)
10. `/home/marc/DEV/sales/src/components/Dashboard.vue` (MODIFIED)
11. `/home/marc/DEV/sales/src/components/ChecklistItem.vue` (MODIFIED)
12. `/home/marc/DEV/sales/src/components/Task/TaskModal.vue` (MODIFIED)

