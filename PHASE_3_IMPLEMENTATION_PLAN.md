# Phase 3: Add Save Safeguards - Implementation Plan

**Status**: Ready to Start (Phase 2 Tests Passed ✓)
**Risk Level**: MEDIUM
**Duration**: 1 week
**Priority**: CRITICAL - Core data safety features

---

## Overview

Phase 3 adds critical safeguards to prevent data loss, race conditions, and provide user feedback during save operations.

**Key Goals**:
1. ✅ Prevent save race conditions (debouncing)
2. ✅ Show user save status (feedback)
3. ✅ Validate before saving (quality gate)
4. ✅ Detect concurrent edits (conflict resolution)
5. ✅ Protect unsaved work (navigation warning)

---

## Pre-Phase 3 Critical Actions

### ACTION 1: Fix 23 Component Unmount Memory Leaks
**Priority**: MEDIUM
**Time**: 30-45 minutes
**Risk**: LOW

**Components to Fix** (add `onBeforeUnmount` cleanup):
1. DefineBusinessMiniApp.vue (line 286)
2. IterateFeaturesMiniApp.vue (lines 249, 256)
3. PublishUpdatesMiniApp.vue (lines 181, 188)
4. FeedbackCollectionMiniApp.vue (lines 274, 281)
5. PaidAdsLaunchMiniApp.vue (line 622)
6. PaidAdsOptimizeMiniApp.vue (line 525)
7. AnalyticsSetupMiniApp.vue (line 778)
8. LandingPageCreatorAssistant.vue (line 346)
9. ChannelOptimizerMiniApp.vue
10. AnalyticsSetupMiniApp.vue
11. + 13 more files

**Pattern to Add**:
```javascript
onBeforeUnmount(() => {
  if (saveTimeout) clearTimeout(saveTimeout)
  // Any other timer cleanup
})
```

**Impact**: Prevents memory accumulation, improves app stability

---

### ACTION 2: Move OAuth Tokens to Database (SECURITY)
**Priority**: CRITICAL ⚠️
**Time**: 1-2 hours
**Risk**: MEDIUM (schema change)

**File**: `src/services/analyticsIntegration.js` (lines 50, 64, 84)

**Current**:
```javascript
localStorage.setItem('analytics-connections', JSON.stringify({
  token: "gho_abc123def456xyz"  // ← PLAINTEXT OAUTH TOKEN
}))
```

**After**:
```javascript
// Supabase encrypted storage with:
await supabase
  .from('analytics_connections')
  .upsert({
    user_id: userId,
    provider: 'google-analytics',
    encrypted_token: encryptToken(token),  // ← ENCRYPTED
    created_at: new Date()
  })
```

**Steps**:
1. Add `analytics_connections` table to Supabase schema
2. Add encryption/decryption logic
3. Update analyticsIntegration.js to use Supabase
4. Remove plaintext localStorage storage
5. Migrate existing tokens (if any)

**Impact**: Secures OAuth tokens, improves security posture

---

### ACTION 3: Document Polling Coordination Strategy
**Priority**: HIGH
**Time**: 30 minutes
**Risk**: LOW (design only)

**Files Affected**:
- `src/components/Dashboard/ABTestResultsDashboard.vue` (polling)
- `src/services/realTimeUpdatesService.js` (polling)

**Design Decision**:
```javascript
// When save starts: pause polling
pausePolling(testId)

// During save
await saveToDatabase()

// When save completes: resume polling
resumePolling(testId)
```

**Implementation**:
1. Add `isPausedForSave` flag to polling service
2. Add `pausePolling()` / `resumePolling()` methods
3. Call pause/resume from save handler
4. Document in code comments

**Impact**: Prevents A/B test data race conditions

---

## Phase 3 Implementation Tasks

### Task 3.1: Add Debouncing to Form Save

**File**: `src/components/TaskMiniApps/core/MiniAppShell.vue` (lines 152-162)

**Current**:
```javascript
watch(
  () => formData.value,
  (newData) => {
    emit('save', { formData: newData, aiOutput, savedItems })
  },
  { deep: true }  // Fires on every property change
)
```

**After**:
```javascript
const debouncedSave = debounce((newData) => {
  emit('save', { formData: newData, aiOutput, savedItems })
}, 500)  // Wait 500ms before emitting

watch(
  () => formData.value,
  (newData) => {
    debouncedSave(newData)
  },
  { deep: true }
)
```

**Implementation Steps**:
1. Import debounce utility (from lodash or create custom)
2. Wrap emit function with debounce(500ms)
3. Test: typing "hello" should emit only 1 save, not 5
4. Commit: "refactor: Add debouncing to form save"

**Expected Result**:
- 1-5 characters typed = 1 save event
- No more keystroke-per-save pattern

---

### Task 3.2: Add Save State Tracking

**File**: `src/components/UnifiedTaskComponent.vue` (or parent component)

**Create New Composable**:
```javascript
// src/composables/useSaveState.js
export function useSaveState() {
  const isSaving = ref(false)
  const saveError = ref(null)
  const lastSaveTime = ref(null)

  const setSaving = (value) => {
    isSaving.value = value
  }

  const setSaveError = (error) => {
    saveError.value = error
    if (error) isSaving.value = false
  }

  const clearError = () => {
    saveError.value = null
  }

  return {
    isSaving,
    saveError,
    lastSaveTime,
    setSaving,
    setSaveError,
    clearError
  }
}
```

**Use in Parent Component**:
```javascript
const { isSaving, saveError, setSaving, setSaveError } = useSaveState()

const handleSave = async (data) => {
  setSaving(true)
  try {
    await projectStore.updateTaskData(taskId, data)
    lastSaveTime.value = new Date()
    setSaveError(null)
  } catch (error) {
    setSaveError(error)
  } finally {
    setSaving(false)
  }
}
```

**UI Feedback**:
```vue
<div v-if="isSaving" class="saving-indicator">
  Saving... <Spinner />
</div>

<div v-if="saveError" class="error-toast">
  ❌ {{ saveError.message }}
  <button @click="retry">Retry</button>
</div>

<div v-if="lastSaveTime" class="save-status">
  ✓ Saved {{ formatTime(lastSaveTime) }}
</div>
```

**Implementation Steps**:
1. Create `src/composables/useSaveState.js`
2. Import and use in parent component
3. Add UI elements for save feedback
4. Test: See "Saving..." during save, error on failure
5. Commit: "feat: Add save state tracking and user feedback"

---

### Task 3.3: Add Validation Gate

**File**: `src/components/TaskMiniApps/core/MiniAppShell.vue`

**Current**: Saves even if form invalid

**After**:
```javascript
const isFormValid = computed(() => {
  // Check required fields
  const requiredFields = taskConfig.formFields.filter(f => f.required)
  return requiredFields.every(f => formData.value[f.id])
})

const handleSave = () => {
  if (!isFormValid.value) {
    // Show validation error, don't save
    validationError.value = 'Please fill all required fields'
    return
  }

  emit('save', { formData: formData.value, ... })
}
```

**UI Validation Feedback**:
```vue
<FormField
  :value="formData.fieldId"
  :error="validationErrors.fieldId"
  @input="updateField"
/>

<!-- Field error -->
<div v-if="validationErrors.fieldId" class="field-error">
  {{ validationErrors.fieldId }}
</div>
```

**Implementation Steps**:
1. Add form-level validation check
2. Add field-level validation display
3. Prevent save if validation fails
4. Show clear error messages
5. Test: Invalid form doesn't save
6. Commit: "feat: Add validation gate to prevent invalid saves"

---

### Task 3.4: Add Conflict Detection

**Database**: Add version field to `project_tasks` table

```sql
ALTER TABLE project_tasks ADD COLUMN version INTEGER DEFAULT 1;
```

**Implementation**:

```javascript
// In projectStore
const updateTaskData = async (taskId, newData, currentVersion) => {
  try {
    const response = await supabase
      .from('project_data')
      .update({
        value: newData,
        version: currentVersion + 1
      })
      .eq('id', taskId)
      .eq('version', currentVersion)  // Optimistic lock

    if (response.status === 409) {
      // Conflict: someone else edited this task
      throw new ConflictError('This task was edited by someone else')
    }

    return response.data
  } catch (error) {
    if (error instanceof ConflictError) {
      // Show conflict UI
      showConflictDialog(error)
      // Reload latest data
      await reloadTaskData(taskId)
    }
    throw error
  }
}
```

**UI Conflict Handling**:
```vue
<div v-if="hasConflict" class="conflict-dialog">
  <p>🔄 This task was edited by someone else</p>
  <button @click="reloadForm">Reload & Keep My Edits</button>
  <button @click="reloadForm(true)">Reload (Discard My Changes)</button>
</div>
```

**Implementation Steps**:
1. Add `version` field to database
2. Include version in save API calls
3. Detect 409 Conflict responses
4. Show conflict dialog
5. Implement reload logic
6. Test: Simulate concurrent edits
7. Commit: "feat: Add conflict detection for concurrent edits"

---

### Task 3.5: Add Unsaved Changes Warning

**Track Dirty State**:
```javascript
const isDirty = ref(false)

watch(
  () => formData.value,
  (newData) => {
    isDirty.value = true
  },
  { deep: true }
)

const handleSave = async () => {
  // ... save logic ...
  isDirty.value = false  // Clear dirty flag after successful save
}

const handleCancel = () => {
  formData.value = lastSavedData
  isDirty.value = false
}
```

**Navigation Guard**:
```javascript
// In router or parent component
const beforeLeave = (next) => {
  if (isDirty.value) {
    const confirmed = confirm(
      'You have unsaved changes. Leave without saving?'
    )
    if (!confirmed) return false
  }
  next()
}
```

**Vue Router Integration**:
```javascript
router.beforeEach((to, from, next) => {
  if (activeTask.isDirty) {
    const confirmed = confirm(
      'You have unsaved changes. Leave without saving?'
    )
    if (confirmed) next()
    // else: stay on current route
  } else {
    next()
  }
})
```

**Implementation Steps**:
1. Add `isDirty` tracking to form state
2. Set dirty on form changes
3. Clear dirty on successful save
4. Add router guard for navigation
5. Add "Cancel" button to discard changes
6. Test: Edit form → click back → see warning
7. Commit: "feat: Add unsaved changes protection"

---

## Testing Strategy

### Unit Tests to Add

**File**: `tests/integration/form-save.integration.test.js`

Enable these tests as features are implemented:

```javascript
// Currently marked as .todo, enable them:
it('should debounce rapid form field updates', () => { ... })
it('should prevent concurrent saves', () => { ... })
it('should validate before save', () => { ... })
it('should detect conflict on concurrent edit', () => { ... })
it('should warn on unsaved changes', () => { ... })
```

### Manual Testing Checklist

- [ ] Type quickly in form → Only 1 save event emitted
- [ ] See "Saving..." indicator during API call
- [ ] See error toast on save failure
- [ ] Cannot save invalid form (required fields empty)
- [ ] See validation error under field
- [ ] Simulate slow network → "Saving..." shows longer
- [ ] Simulate network error → Error message appears
- [ ] Edit form in 2 windows → Second save shows conflict message
- [ ] Edit form → Click back → Warning appears
- [ ] Click "Stay" → Form still open with changes
- [ ] Click "Leave" → Navigate away, changes discarded
- [ ] Edit form → Save → No warning when leaving

---

## Implementation Order

1. **Fix memory leaks** (quick win, improves stability)
2. **Move OAuth tokens** (security critical, must do early)
3. **Add debouncing** (prevents race conditions, enables other features)
4. **Add save state tracking** (UX improvement)
5. **Add validation gate** (data quality)
6. **Add conflict detection** (concurrent edit safety)
7. **Add unsaved changes warning** (user protection)

---

## Success Criteria

Phase 3 is complete when:

- ✅ All 32 integration tests related to save behavior pass
- ✅ Typing quickly produces only 1 save event
- ✅ User sees "Saving..." feedback during save
- ✅ Invalid forms cannot be saved
- ✅ Concurrent edits detected and handled
- ✅ Unsaved changes warning works
- ✅ No save-related errors in console
- ✅ Build passes: `npm run build`
- ✅ Tests pass: `npm test`

---

## Risk Mitigation

**High Risk Areas**:
- Database schema change (version field) → Backup before migrating
- Conflict detection changes save API contract → Test with old/new API
- Navigation guard could break existing routing → Test all routes

**Testing Before Commit**:
1. Test all save scenarios locally
2. Run full test suite
3. Test with simulated slow network
4. Test concurrent edits (2 windows)
5. Manual testing checklist complete

---

## Git Commits

Phase 3 will create 7 commits:
1. "refactor: Fix 23 component unmount memory leaks"
2. "feat: Move OAuth tokens to database (security)"
3. "feat: Add debouncing to form save"
4. "feat: Add save state tracking and user feedback"
5. "feat: Add validation gate to prevent invalid saves"
6. "feat: Add conflict detection for concurrent edits"
7. "feat: Add unsaved changes protection"

---

## Timeline

**Day 1**: Fix memory leaks + move OAuth tokens (quick wins)
**Day 2**: Add debouncing (core safeguard)
**Day 3**: Add save state tracking (UX)
**Day 4**: Add validation gate (quality)
**Day 5**: Add conflict detection (advanced)
**Day 6**: Add unsaved changes warning (polish)
**Day 7**: Testing, bug fixes, final verification

---

**Status**: Ready to implement
**Next**: Start with pre-Phase 3 actions, then execute Phase 3 tasks

