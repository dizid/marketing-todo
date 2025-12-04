# Polling Coordination Strategy - Phase 3 Pre-Action

**Status**: CRITICAL - Required before adding debouncing
**Risk Level**: HIGH - Race conditions can corrupt data
**Implementation Time**: 1-2 hours
**Priority**: MUST COMPLETE before Phase 3 Task 3.1 (Debouncing)

---

## Problem Statement

### A/B Test Polling + Save Race Condition

**Location**: `/src/components/Dashboard/ABTestResultsDashboard.vue:322`

**Issue**:
```
T+0ms:    Form save debounce fires
T+0ms:    ⚠️ SAME TIME: Polling fires
          Race condition: Write + Read concurrent
Result:   Data corruption or stale read
```

**Current Code Pattern**:
```javascript
// Component: ABTestResultsDashboard.vue
refreshInterval = setInterval(() => {
  loadTest() // Reads from localStorage/Supabase
}, 5000)

// Parent: UnifiedTaskComponent
const handleSave = debounce(async (data) => {
  await saveToDatabase(data) // Writes to localStorage/Supabase
}, 500)
```

**Why This Happens**:
1. Polling interval: 5000ms
2. Save debounce: 500ms
3. User edits form → save debounces → fires at T+500ms
4. Polling can fire any time (last fired at T+5000, next at T+10000)
5. If user edits at T+4500-T+5500, polling + save overlap
6. Concurrent read/write = data corruption

---

## Solution: Pause/Resume Polling During Saves

### Architecture

```
Save Flow:
  1. User types → debounce timer starts
  2. Debounce fires (T+500ms)
  3. PAUSE polling
  4. Save to database (async, ~1-2 seconds)
  5. RESUME polling
  6. Next polling cycle runs safely

Polling Flow:
  1. Check if paused
  2. If paused: skip this cycle, try next in 5000ms
  3. If active: load test data normally
  4. Update UI with fresh data
```

### Implementation Pattern

#### Step 1: Add Polling Control Composable

Create `/src/composables/usePollingControl.js`:

```javascript
import { ref } from 'vue'

export const usePollingControl = () => {
  const pausedPollingIds = new Set()

  const pausePolling = (id) => {
    pausedPollingIds.add(id)
    console.log(`[Polling] Paused: ${id}`)
  }

  const resumePolling = (id) => {
    pausedPollingIds.delete(id)
    console.log(`[Polling] Resumed: ${id}`)
  }

  const isPollingPaused = (id) => {
    return pausedPollingIds.has(id)
  }

  return {
    pausePolling,
    resumePolling,
    isPollingPaused
  }
}

// Global singleton instance
export const globalPollingControl = usePollingControl()
```

#### Step 2: Update Polling Service

File: `/src/services/realTimeUpdatesService.js`

```javascript
import { globalPollingControl } from '@/composables/usePollingControl'

export const realTimeUpdatesService = {
  poll: async (key, callback, interval = 5000) => {
    const pollId = `poll_${key}_${Date.now()}`

    const pollFn = async () => {
      // CHECK: Is polling paused for saves?
      if (globalPollingControl.isPollingPaused(key)) {
        console.log(`[Polling] Skipped: ${key} (paused for save)`)
        return
      }

      try {
        const data = await fetchData(key)
        callback(data)
      } catch (error) {
        console.error(`[Polling] Error fetching ${key}:`, error)
      }
    }

    // Run polling immediately
    await pollFn()

    // Schedule recurring polls
    const intervalId = setInterval(pollFn, interval)

    // Return cleanup function
    return () => clearInterval(intervalId)
  }
}
```

#### Step 3: Update Form Save Handler

File: `/src/components/UnifiedTaskComponent.vue` or parent

```javascript
import { globalPollingControl } from '@/composables/usePollingControl'

const debouncedSave = debounce(async (newData) => {
  const testId = props.taskId

  // PAUSE polling before save
  globalPollingControl.pausePolling(testId)

  try {
    // Save to database
    await projectStore.updateTaskData(testId, newData)
    emit('save', { success: true })
  } catch (error) {
    emit('save', { error: error.message })
  } finally {
    // RESUME polling after save completes
    globalPollingControl.resumePolling(testId)
  }
}, 500)
```

#### Step 4: Update A/B Test Dashboard Component

File: `/src/components/Dashboard/ABTestResultsDashboard.vue:322`

```javascript
import { globalPollingControl } from '@/composables/usePollingControl'

const testId = props.testId
let refreshInterval

// Start polling
const startPolling = () => {
  refreshInterval = setInterval(async () => {
    // CHECK: Is polling paused?
    if (globalPollingControl.isPollingPaused(testId)) {
      // Skip this cycle, polling will resume after save
      return
    }

    // Safe to load: polling not paused for save
    await loadTest()
  }, 5000)
}

// Cleanup on unmount
onBeforeUnmount(() => {
  if (refreshInterval) clearInterval(refreshInterval)
})

startPolling()
```

---

## Implementation Checklist

### Files to Modify

- [ ] **Create**: `/src/composables/usePollingControl.js`
  - New polling control system
  - Global singleton for pause/resume

- [ ] **Update**: `/src/services/realTimeUpdatesService.js`
  - Check `isPollingPaused()` before fetching
  - Log pause/resume events
  - Continue on next interval if paused

- [ ] **Update**: `/src/components/Dashboard/ABTestResultsDashboard.vue`
  - Import `usePollingControl`
  - Check pause status before loading test
  - Handle cleanup

- [ ] **Update**: `/src/components/UnifiedTaskComponent.vue` (or parent of MiniAppShell)
  - Pause polling before save
  - Resume polling after save completes
  - Ensure resume happens even on error (use finally)

### Testing Strategy

#### Manual Tests

- [ ] Edit A/B test name → save → see "Pausing polling"
- [ ] Polling resumes after save completes
- [ ] Rapidly edit form multiple times → polling pauses/resumes correctly
- [ ] Simulate slow network (2s save) → polling paused entire time
- [ ] Open test in 2 tabs → edit in tab A → see polling pause in tab A only (not tab B)

#### Validation Points

- [ ] Console logs show pause/resume sequence
- [ ] Poll cycle (5s) shows skipped cycles during save
- [ ] Data remains consistent (no corruption)
- [ ] No orphaned polling intervals after component unmount

---

## Safety Guarantees

### Before Implementation

❌ Race Condition Possible:
```
Save: T+0ms ─────────────> T+2000ms (write to DB)
Poll:           T+1000ms (read from DB) ← DATA RACE
```

### After Implementation

✅ Race Condition Eliminated:
```
Save: T+0ms (pause polling) ─────────────> T+2000ms (resume polling)
Poll:        [PAUSED - skipped] ──────────────────── T+5000ms (next cycle safe)
```

---

## Rollback Plan

If issues occur:

1. **Polling still paused after save**: Check `finally` block in save handler
2. **Data corruption still occurs**: Verify pause happens BEFORE save starts
3. **Performance degradation**: Check console for excessive log spam

Immediate rollback:
```bash
git revert <commit-hash>
# Falls back to current polling behavior (risky but functional)
```

---

## Future Enhancements

### Phase 4+

1. **Message Queue**: Instead of pause/skip, queue polling requests
   ```javascript
   if (isPaused) {
     queuePollingRequest(key)
     return
   }
   // After resume: process queued requests
   ```

2. **Adaptive Polling**: Increase interval during save-heavy operations
   ```javascript
   const pollInterval = isSaving ? 10000 : 5000
   ```

3. **Real-Time Updates**: Replace polling with WebSocket
   ```javascript
   // Phase 5: Supabase Realtime subscriptions
   const subscription = supabase
     .on('postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'ab_tests' },
          handleUpdate)
     .subscribe()
   ```

---

## CRITICAL: Must Complete Before Phase 3 Task 3.1

The debouncing implementation in Phase 3 Task 3.1 will fire every 500ms on form changes. Without polling coordination:

- Every save attempt pauses polling for 2+ seconds
- Stale data displayed to user
- Potential data corruption if timing unlucky
- Race conditions hard to reproduce/debug

**Timeline**:
1. ✅ Pre-Phase 3 Action 1: Memory leaks (DONE)
2. ✅ Pre-Phase 3 Action 2: OAuth tokens (DONE)
3. ⏳ Pre-Phase 3 Action 3: Polling coordination (THIS)
4. → Phase 3 Task 3.1: Add debouncing (depends on #3)

---

## References

- **Current Issue**: PHASE_1_TIMING_STORAGE_ANALYSIS.md - A/B Test Race Condition
- **Save Flow**: PHASE_3_IMPLEMENTATION_PLAN.md - Task 3.1 Debouncing
- **Architecture**: SSOT_IMPLEMENTATION_PLAN.md - Phase 3 Overview
