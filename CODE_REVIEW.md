# Sales App - Comprehensive Code Quality & Architecture Review

## Executive Summary

**Codebase Stats:**
- Components: 29,220 LOC (25 mini-apps, 70+ components)
- Services: 2,290 LOC (centralized API/business logic)
- Stores: 1,064 LOC (Pinia state management)
- Configurations: 11,291 LOC (40+ config files)
- **Total: ~44,000 LOC**

**Overall Assessment:** The codebase has a SOLID architectural foundation with good separation of concerns and a config-driven system. However, there are clear opportunities to reduce duplication, improve consistency, and increase modularity.

---

## 1. DUPLICATE CODE DETECTION

### 1.1 High-Impact Duplications

#### A. Mini-App Boilerplate Patterns (CRITICAL)
**Pattern:** All 25 mini-apps follow nearly identical structures
- Setup form → Generate output → Display results
- Error handling (loading, error states)
- Save/export functionality
- Total affected: ~12,000 LOC across mini-apps

**Examples:**
- PaidAdsLaunchMiniApp.vue (2,038 LOC)
- PaidAdsOptimizeMiniApp.vue (1,878 LOC)
- AnalyticsSetupMiniApp.vue (1,699 LOC)
- DesignGraphicsMiniApp.vue (1,386 LOC)

**Issues:**
- Each mini-app re-implements: form handling, validation, error display, loading states
- 31 instances of `isLoading` state patterns
- 13 instances of `handleSave` logic
- Inconsistent error handling across components

**Recommended Fix:** Extract to reusable composition or utilities

---

#### B. Store Error/Loading Patterns (HIGH)
**Location:** All 4 stores (auth, subscription, project, onboarding)

**Pattern found (repeated 40+ times):**
```javascript
// In each store action:
const fetchProjects = async () => {
  isLoading.value = true
  error.value = null
  try {
    const result = await getProjects()
    // ...
  } catch (err) {
    error.value = err.message
    console.error('Error:', err)
  } finally {
    isLoading.value = false
  }
}
```

**Affected Files:**
- `/home/marc/DEV/sales/src/stores/projectStore.js` (317 LOC)
- `/home/marc/DEV/sales/src/stores/subscriptionStore.js` (80+ LOC)
- `/home/marc/DEV/sales/src/stores/authStore.js` (80+ LOC)

**Issues:**
- 100% code duplication in async action patterns
- No centralized async handler wrapper
- Inconsistent error message handling

---

#### C. Form Field Rendering (MEDIUM)
**Locations:**
- FormBuilder.vue (80+ lines)
- UnifiedTaskComponent.vue (similar)
- Multiple mini-apps (WriteBlogPostMiniApp, DesignGraphicsMiniApp, etc.)

**Pattern Duplication:** Text, number, textarea, select, checkbox field rendering duplicated 3+ times

**Code duplicated:**
```javascript
// Pattern repeated in multiple files:
<div v-if="field.type === 'text'" class="space-y-2">
  <label>{{ field.label }}</label>
  <input :value="formData[field.id]" @input="updateField(field.id, $event.target.value)" />
</div>
```

---

#### D. API Error Handling (MEDIUM)
**Locations:**
- paypalService.js (lines 40-86, 123-165)
- projectService.js (multiple functions)
- Services use similar fetch/error patterns

**Pattern:**
```javascript
if (!response.ok) {
  const errorData = await response.json().catch(() => ({}))
  throw new Error(errorData.error || `Failed: ${response.status}`)
}
```

**Duplication Count:** 8+ instances

---

#### E. Configuration Console Logging (LOW but widespread)
**Count:** 64 instances of `console.log('[Module] ...')`
**Files:** 13 files
**Pattern:** `console.log('[TaskName] Message')` for debugging

**Issues:**
- Not centralized
- Inconsistent formatting
- No log levels (info vs error vs warn)

---

### 1.2 Duplicate Code Summary Table

| Pattern | Count | Severity | LOC Impact | Files |
|---------|-------|----------|------------|-------|
| Mini-app boilerplate | 25 | CRITICAL | 12,000 | All mini-apps |
| Store async patterns | 40+ | HIGH | 500 | 4 store files |
| Form field rendering | 3+ | MEDIUM | 300 | 3 files |
| API error handling | 8+ | MEDIUM | 200 | Services |
| Console logging | 64 | LOW | 100 | 13 files |

**Total Duplicate LOC: ~13,000 (30% of codebase)**

---

## 2. ARCHITECTURE CORRECTNESS

### 2.1 Positive Findings

✓ **Excellent Separation of Concerns:**
- UI components properly separated from business logic
- Services centralize API calls (/services directory)
- Pinia stores manage state cleanly
- Configurations separate from components (unifiedTasks.js is well-designed)

✓ **Good Task Registry Pattern:**
- `/home/marc/DEV/sales/src/services/taskRegistry.js` (329 LOC) - excellent central mapping
- Metadata, components, and configurations properly linked
- Supports dynamic component loading

✓ **Composition API Best Practices:**
- Proper use of `ref`, `computed`, `watch`
- Good prop/emit patterns in components
- UnifiedTaskComponent is well-structured (composition-based)

✓ **Store Architecture:**
- Proper use of Pinia stores (auth, subscription, project)
- State, computed, and actions properly separated
- No direct mutations (uses Supabase service layer)

---

### 2.2 Architecture Issues

#### Issue A: Mini-App Component Registry Maintenance
**File:** `/home/marc/DEV/sales/src/components/Task/TaskModal.vue` (lines 116-141)

**Problem:** Hard-coded customComponentMap with 21 imports
```javascript
const customComponentMap = {
  'LandingPageCreatorAssistant': LandingPageCreatorAssistant,
  'ConnectAccountsMiniApp': ConnectAccountsMiniApp,
  // ... 19 more
}
```

**Issues:**
1. Not DRY - mini-app names defined in:
   - TaskModal.vue customComponentMap (21 entries)
   - taskRegistry.js metadata (21 entries)
   - unifiedTasks.js config (21 entries)
2. New mini-app requires 3 file updates
3. Brittle: string references prone to typos
4. Doesn't scale well

**Recommendation:** Use a centralized mini-app registry

---

#### Issue B: Mixed Approaches for Task Configuration
**Files Involved:**
- `/home/marc/DEV/sales/src/configs/unifiedTasks.js` - config-driven
- `/home/marc/DEV/sales/src/components/Dashboard.vue` (lines 288-572) - inline JSON

**Problem:** Task definitions exist in 2 places
- Dashboard hardcodes category/items structure
- Configs define the same tasks differently
- This causes drift risk

**Example:** 'setup-1' is defined in:
1. Dashboard.vue as part of taskCategories
2. taskRegistry.js as metadata
3. unifiedTasks.js as defineAudienceTask config

---

#### Issue C: Task Status/Completion Logic Scattered
**Locations:**
- Dashboard.vue (lines 604-622): progressPercentage, completedTasks
- ChecklistCategory.vue (lines 123-144): categoryCompletedCount
- projectStore.js: updateTask, removeTask, addTask
- Multiple mini-apps with local "saved" state

**Problem:** Task completion logic is split across:
1. Store actions (updateProjectTasks, updateTask)
2. Component computations (categoryProgressPercentage)
3. Mini-app local state (savedItems arrays)

**Risk:** Inconsistent state if logic changes

---

#### Issue D: Inconsistent Data Flow in Mini-Apps
**Pattern 1 - Some mini-apps:**
- TrackingSheetMiniApp, PrepareAssetsMiniApp
- Local state (items, notes)
- Manual save to parent

**Pattern 2 - Others:**
- UnifiedTaskComponent with MiniAppShell
- Auto-save via service
- Different callback patterns

**Problem:** No consistent pattern for:
- When to save
- Where data is stored
- How to emit changes

---

### 2.3 Task Loading: Config-Driven vs Component-Driven

**Current System:**
1. **Config-driven:** unifiedTasks.js defines schema
2. **Component-driven:** TaskModal.vue routes based on customComponent
3. **Registry:** taskRegistry.js maps IDs to components

**Issue:** Three separate mappings to maintain
- Change mini-app name? Update 3 places
- New mini-app? 3 file edits
- Inconsistent naming conventions

---

## 3. MODULARITY ASSESSMENT

### 3.1 Strengths

✓ **Good Service Layer:**
- `projectService.js`: Clean CRUD operations
- `paypalService.js`: Well-organized subscription flow
- `aiGeneration.js`: Centralized AI operations
- `aiQuotaService.js`: Proper quota enforcement

✓ **Configuration Modularity:**
- Each task has its own .config.js file
- Easy to add/remove tasks
- Configs are reusable

✓ **Shared Components:**
- FormBuilder.vue (shared form rendering)
- AIPanel.vue (shared AI generation UI)
- OutputSection.vue (shared output handling)
- MiniAppShell.vue (shared mini-app wrapper)

---

### 3.2 Modularity Issues

#### Issue A: Tight Coupling in TaskModal
**File:** `/home/marc/DEV/sales/src/components/Task/TaskModal.vue` (204 LOC)

**Problems:**
1. **Direct imports of 21 mini-apps** (lines 92-114)
   - Not lazy-loaded
   - Tight coupling
   - Hard to maintain

2. **Hard-coded component map** (lines 117-141)
   - Brittle string matching
   - No type safety
   - Manual synchronization required

**Better approach:** Use dynamic imports + registry

---

#### Issue B: Storage Abstraction Leak
**Locations:**
- ChecklistItem.vue (line 204): `localStorage.getItem('marketing-app-data')`
- Multiple mini-apps access localStorage directly
- No centralized storage service

**Issues:**
1. No abstraction layer
2. Hard-coded storage keys spread across codebase
3. Data shape changes require multiple file updates
4. No single source of truth

**Count:** 46 instances of localStorage/sessionStorage direct access

---

#### Issue C: Mini-App Independence Questionable
**Examples - DesignGraphicsMiniApp.vue (1,386 LOC):**

```javascript
// Line 1: Imports for styles/functionality
// Lines 10-500: Form and brief generation
// Lines 500-1000: Step 2 interface
// Lines 1000-1300: Guide selection
```

**Problems:**
1. Each mini-app is a monolith
2. Repeated form patterns (20+ form fields per app)
3. Hard to test individual features
4. Styling slightly different in each
5. No shared form components actually used in many

**Better approach:** Break into smaller composable pieces

---

#### Issue D: AI Panel Reusability Limited
**File:** `/home/marc/DEV/sales/src/components/TaskMiniApps/shared/AIPanel.vue`

**Current Usage:**
- MiniAppShell.vue references it
- But 10+ mini-apps don't use it (have inline AI logic)

**Problem:** Inconsistent AI UX across app
- Some use AIPanel
- Some have custom AI implementations
- No unified quota/loading feedback

---

### 3.3 Modularity Recommendations Priority

| Issue | Type | Severity | Effort |
|-------|------|----------|--------|
| Mini-app registry decoupling | Refactor | HIGH | Medium |
| Storage service abstraction | New Feature | MEDIUM | Small |
| Mini-app decomposition | Refactor | MEDIUM | Large |
| Unified mini-app template | Template | MEDIUM | Medium |

---

## 4. MAINTAINABILITY ISSUES

### 4.1 Long Files (>1000 LOC) - CODE SMELL

**Affected Files:**
```
PaidAdsLaunchMiniApp.vue         2,038 LOC
PaidAdsOptimizeMiniApp.vue       1,878 LOC
AnalyticsSetupMiniApp.vue        1,699 LOC
DesignGraphicsMiniApp.vue        1,386 LOC
ChannelOptimizerMiniApp.vue      1,273 LOC
WriteBlogPostMiniApp.vue         1,084 LOC
CommunityPostsMiniApp.vue        1,069 LOC
```

**Risk:** Large components are:
- Hard to test
- Difficult to understand
- Prone to bugs
- Resistant to change
- Not reusable

**Impact:** 7 files with >1000 LOC = ~9,000 LOC in monoliths

---

### 4.2 Complex Components Without Documentation

**File:** `/home/marc/DEV/sales/src/components/Dashboard.vue` (798 LOC)

**Issues:**
1. Lines 288-572: 284 LOC of inline task categories
2. No explanation of category structure
3. Magic category names (setup, social, content, etc.)
4. Filtering logic (lines 575-602) is inline
5. Multiple responsibilities:
   - Task rendering
   - Filtering
   - Progress calculation
   - AI summary generation
   - Export functionality

**Better:** Extract to separate files/composables

---

### 4.3 Magic Numbers & Hard-Coded Values

**Found:**
- `CACHE_DURATION = 5 * 60 * 1000` (subscriptionStore.js) ✓ Good
- `FREE_TIER_QUOTA = 20` (subscriptionStore.js) ✓ Good
- `PREMIUM_TIER_QUOTA = 200` (subscriptionStore.js) ✓ Good
- `PAYPAL_PLAN_ID` (paypalService.js line 17) ✓ Good (from env)

**Issues Found:**
1. Category filter options (Dashboard.vue lines 56-66) - hard-coded select options
2. Form field validations - scattered across components
3. Timeout values in UI (ChecklistItem.vue line 287: `2000`)
4. Z-index values (various, e.g., `z-50`, `z-10`)

---

### 4.4 Inconsistent Naming Conventions

**Issues:**

1. **Store naming inconsistency:**
   - `currentProjectId` vs `projectData.taskData`
   - `currentProjectTasks` (shorthand) vs full access pattern
   - No consistent prefix for "current"

2. **Configuration property names:**
   - unifiedTasks.js uses: `form`, `ai`, `what`, `why`, `how`
   - Mini-apps use: `formData`, `taskConfig`, `generatedPlan`
   - No consistent structure

3. **Event naming:**
   - `@task-checked` (Dashboard.vue)
   - `@save` (TaskModal.vue)
   - `@update:data` (MiniAppShell.vue)
   - Inconsistent patterns (dash vs camelCase, verb differences)

4. **Mini-app IDs:**
   - `define-audience` (task ID)
   - `DefineAudienceMiniApp` (component name)
   - `defineAudienceTask` (config export)
   - No consistent transformation pattern

---

### 4.5 Missing or Unclear Documentation

**Critical Missing Docs:**
1. No JSDoc comments on complex functions
2. Task config schema undefined (infer from examples)
3. Mini-app development guide missing
4. Store action contracts undocumented
5. API endpoint conventions not documented
6. Error handling strategy unclear

**Examples:**
- `/home/marc/DEV/sales/src/configs/unifiedTasks.js` - good comments but no schema definition
- Mini-app patterns not documented
- Task lifecycle not explained

---

### 4.6 Configuration vs Hardcoding Inconsistency

**Problem Areas:**

1. **Dashboard categories** (lines 288-572):
   - Should be in config file
   - Currently hardcoded in component
   - Difficult to update

2. **Task descriptions:**
   - Dashboard.vue has them
   - taskRegistry.js has them
   - unifiedTasks.js might have them
   - Inconsistent content

3. **Form fields:**
   - Mini-apps define forms inline
   - No reusable field definitions
   - Each app copies similar patterns

---

### 4.7 Error Handling Strategy

**Current State:**
- ✓ API errors caught and logged
- ✓ User feedback via error states
- ✓ Quota errors handled specifically
- ✗ No centralized error handler
- ✗ Error messages inconsistent
- ✗ No error boundary component

**Issues:**
1. Error messages repeated across components
2. No recovery suggestions
3. Silent failures in some places
4. Inconsistent error UI

---

### 4.8 Loading States Consistency

**Found 31 instances of loading state patterns**

**Inconsistencies:**
1. Different state variable names:
   - `isLoading`
   - `isGenerating`
   - `isPending`
   - `loading`

2. Different UI patterns:
   - Some show spinner
   - Some disable button
   - Some show text change
   - Some combine multiple

3. No loading state in:
   - Some async operations
   - Some data fetches

---

## 5. SPECIFIC AREA INVESTIGATIONS

### 5.1 How Tasks Are Loaded & Displayed

**Current Flow:**
```
1. Dashboard.vue renders taskCategories (lines 288-572)
2. ChecklistCategory maps items to ChecklistItem
3. ChecklistItem emits task-opened with taskId
4. Dashboard opens TaskModal with taskId
5. TaskModal looks up taskConfig from unifiedTasksMap
6. TaskModal finds customComponent mapping
7. Component renders or UnifiedTaskComponent used
```

**Issues:**
1. Task definition in 3+ places (Dashboard, taskRegistry, unifiedTasks)
2. Desktop list (288-572) not synced with config
3. customComponentMap must be manually maintained
4. No validation that taskId exists in all 3 places

---

### 5.2 Task Completion/Status Logic

**Files Involved:**
- `/home/marc/DEV/sales/src/stores/projectStore.js` (lines 177-215)
- `/home/marc/DEV/sales/src/components/Dashboard.vue` (lines 604-622)
- `/home/marc/DEV/sales/src/components/ChecklistCategory.vue` (lines 123-144)
- Various mini-app files with local state

**Flow:**
```
User clicks checkbox
  → ChecklistItem emits task-checked
  → Dashboard handles (line 627)
  → Calls projectStore.updateProjectTasks
  → Store saves to Supabase
  → Component updates reactively
```

**Issues:**
1. Completion calculation in 3 places (Dashboard, Category, Store)
2. Mini-app "savedItems" not synced with task.checked
3. Mini-app completion not reflected in dashboard
4. Task state can diverge (mini-app thinks completed, dashboard doesn't)

---

### 5.3 API Endpoint Handling

**Files:** `/home/marc/DEV/sales/src/services/`

**Pattern:**
```javascript
// paypalService.js
const PAYPAL_API_BASE = import.meta.env.VITE_PAYPAL_API_URL || '/.netlify/functions'

// aiGeneration.js (via grok service)
// projectService.js (via supabase)
```

**Good:**
- ✓ API base URL configurable
- ✓ Env variables used
- ✓ Error handling present

**Issues:**
1. No centralized API client
2. Each service does own fetch/error handling
3. No request/response interceptors
4. No request retry logic
5. No rate limiting handling

---

### 5.4 Quota System Flow

**Files:**
- `/home/marc/DEV/sales/src/services/aiQuotaService.js`
- `/home/marc/DEV/sales/src/stores/subscriptionStore.js`
- `/home/marc/DEV/sales/src/services/aiGeneration.js`

**Flow:**
```
1. Component calls generateAIContent
2. aiGeneration checks quota via checkQuotaBeforeGeneration
3. If exceeded, throws error
4. Component catches and shows error
5. After generation, quota refreshed
```

**Good:**
- ✓ Quota checks implemented
- ✓ Free vs Premium tiers enforced
- ✓ Usage tracking server-side

**Issues:**
1. No proactive quota warnings
2. Users hit error, not ideal UX
3. Quota not displayed prominently
4. No quota warnings before hitting limit

---

## 6. QUICK WINS (Immediate Implementation)

### 6.1 Priority 1 - Implement This Week

#### 1. Extract Async Action Handler
**File:** Create `/home/marc/DEV/sales/src/composables/useAsyncAction.js`

```javascript
export function useAsyncAction() {
  const isLoading = ref(false)
  const error = ref(null)
  
  const executeAsync = async (fn) => {
    isLoading.value = true
    error.value = null
    try {
      return await fn()
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  return { isLoading, error, executeAsync }
}
```

**Impact:** Reduces 500+ LOC of duplication in stores

**Time:** 30 minutes

---

#### 2. Centralize Console Logging
**Create:** `/home/marc/DEV/sales/src/utils/logger.js`

```javascript
const LogLevel = { INFO: 0, WARN: 1, ERROR: 2 }

export function log(module, message, level = LogLevel.INFO) {
  const prefix = `[${module}]`
  if (level === LogLevel.ERROR) console.error(prefix, message)
  else if (level === LogLevel.WARN) console.warn(prefix, message)
  else console.log(prefix, message)
}
```

**Impact:** Consistent logging, easier debugging

**Time:** 45 minutes

---

#### 3. Create Storage Service
**File:** `/home/marc/DEV/sales/src/services/storageService.js`

```javascript
export const storageService = {
  getAppData: () => {
    try {
      return JSON.parse(localStorage.getItem('marketing-app-data') || '{}')
    } catch { return {} }
  },
  saveAppData: (data) => {
    localStorage.setItem('marketing-app-data', JSON.stringify(data))
  }
}
```

**Impact:** Replace 46 direct localStorage calls

**Time:** 1 hour

---

#### 4. Fix Task Definition Duplication
**Action:** Move Dashboard taskCategories (lines 288-572) to config

**Create:** `/home/marc/DEV/sales/src/configs/taskCategories.js`

**Impact:** Single source of truth for task structure

**Time:** 1.5 hours

---

### 6.2 Priority 2 - This Sprint

#### 5. Extract Mini-App Boilerplate to Composable
**Create:** `/home/marc/DEV/sales/src/composables/useMiniApp.js`

Provides:
- Form handling
- Error management
- Save/export
- Loading states

**Impact:** ~5,000 LOC reduction in mini-apps

**Time:** 4-6 hours

---

#### 6. Create Mini-App Registry
**Decouple:** Mini-app names from TaskModal hardcoding

**Files to Create:**
- `/home/marc/DEV/sales/src/configs/miniAppRegistry.js`
- Update TaskModal to use registry

**Impact:** Remove 21-import dependency nightmare

**Time:** 2 hours

---

#### 7. Implement Error Boundary Component
**File:** `/home/marc/DEV/sales/src/components/ErrorBoundary.vue`

**Provides:**
- Graceful error handling
- Error recovery UI
- Consistent error display

**Time:** 2 hours

---

### 6.3 Priority 3 - Next Sprint

#### 8. Add Schema Validation
**Create:** `/home/marc/DEV/sales/src/schemas/taskConfigSchema.js`

Validate all task configs at load time

**Impact:** Catch config errors early

---

#### 9. Extract Form Field Components
**Create:** Individual field type components

Replace repeated code in FormBuilder

---

## 7. RECOMMENDATIONS WITH PRIORITY LEVELS

### 7.1 Architecture Improvements

| Priority | Issue | Recommendation | Effort | Impact |
|----------|-------|-----------------|--------|--------|
| HIGH | Mini-app monoliths | Extract to composables + smaller components | 8h | 25% code reduction |
| HIGH | Duplicate store patterns | Create useAsyncAction composable | 1h | 10% code reduction |
| HIGH | Task definition drift | Single source of truth (config-only) | 2h | Maintainability |
| HIGH | Hardcoded component map | Registry-based dynamic import | 2h | Maintainability |
| MEDIUM | localStorage access | Create storage service abstraction | 1h | 5% code reduction |
| MEDIUM | Form field duplication | Extract to field components | 4h | Maintainability |
| MEDIUM | Error handling | Centralized error handler | 2h | Consistency |
| MEDIUM | Mini-app inconsistency | Unified template pattern | 6h | Consistency |
| LOW | Console logging | Centralized logger | 1h | Debuggability |
| LOW | Z-index management | CSS variable strategy | 1h | Maintainability |

---

### 7.2 Modularity Improvements

| Priority | Action | Benefit |
|----------|--------|---------|
| HIGH | Break mini-apps into 200-400 LOC components | Testability, reusability |
| MEDIUM | Create MiniAppTemplate base component | Consistency, faster development |
| MEDIUM | Extract field builders to utilities | Reusability |
| LOW | Create mini-app style system | Design consistency |

---

## 8. SUMMARY

### Key Metrics
- **Code Duplication:** ~13,000 LOC (30% of components)
- **Files >1000 LOC:** 7 files (need breaking down)
- **Missing Abstractions:** 3 major (async handler, storage, logger)
- **Inconsistent Patterns:** 4 areas (form rendering, error handling, loading states, naming)

### Recommendation Summary

**Immediate (Next 2 Weeks):**
1. Extract async action handler → 500 LOC reduction
2. Centralize logging
3. Create storage service
4. Fix task definition duplication

**Short Term (This Month):**
1. Break down large mini-apps
2. Create mini-app composable
3. Implement mini-app registry
4. Add error boundary

**Medium Term (Next 2 Months):**
1. Refactor form field patterns
2. Unify mini-app template
3. Add schema validation
4. Improve documentation

### Investment vs Return

- **High-Impact Quick Wins:** 6-8 hours → 20-25% code reduction
- **Medium-Impact Refactors:** 20-30 hours → Better maintainability, consistency
- **Long-term Benefits:** Easier feature additions, faster onboarding, fewer bugs

---

## Appendix: File-Level Findings

### Most Complex Files (by LOC)
1. PaidAdsLaunchMiniApp.vue - 2,038 LOC
2. PaidAdsOptimizeMiniApp.vue - 1,878 LOC
3. AnalyticsSetupMiniApp.vue - 1,699 LOC
4. DesignGraphicsMiniApp.vue - 1,386 LOC
5. Dashboard.vue - 798 LOC

### Configuration Files (Total: 11,291 LOC)
- 40+ individual task config files
- unifiedTasks.js combines them
- Each 100-400 LOC

### Services (Total: 2,290 LOC)
- projectService.js - clean and focused
- aiGeneration.js - well-structured
- paypalService.js - good organization
- Good candidates for best practices reference

### Stores (Total: 1,064 LOC)
- projectStore.js - good, some async duplication
- subscriptionStore.js - well-structured
- authStore.js - simple and clean
- Stores are a model for proper Vue 3 Pinia usage

