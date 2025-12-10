# Phase 3 SSOT - Comprehensive Testing Guide

## Overview
This guide provides detailed test cases for all Phase 3 SSOT features. Each test includes prerequisites, steps, and expected outcomes.

---

## Test 1: Debouncing (Task 3.1)

### Purpose
Verify that saves are debounced 500ms to prevent database overload.

### Prerequisites
- Dev server running
- Any task open in edit mode
- Browser DevTools open (F12)

### Test Case 1.1: Single Field Edit Debounce
```
STEPS:
1. Open any task
2. Open DevTools → Console/Network
3. Edit one field
4. Immediately edit another field (within 100ms)
5. Watch the Network tab

EXPECTED:
✅ Only ONE save request after 500ms of inactivity
✅ First request cancelled if new input arrives
✅ No rapid successive requests
✅ Console shows save happening ~500ms after last keystroke

ACTUAL RESULT: ___________
PASS/FAIL: [ ]
```

### Test Case 1.2: Rapid Multiple Edits
```
STEPS:
1. Open task with multiple fields
2. Rapidly change 5-6 fields in quick succession
3. Count the HTTP requests in Network tab
4. Wait 2 seconds and count again

EXPECTED:
✅ Only ONE final save request (not 5-6)
✅ Request happens 500ms after last keystroke
✅ All field changes included in single request
✅ No wasted requests

ACTUAL RESULT: ___________
PASS/FAIL: [ ]
```

### Test Case 1.3: Verify 500ms Timing
```
STEPS:
1. Open task
2. Edit one field and note the time
3. Watch Network tab for save request
4. Measure time between last keystroke and request

EXPECTED:
✅ Save request sent at ~500ms (±50ms acceptable)
✅ Not earlier (< 400ms)
✅ Not later (> 600ms)

ACTUAL RESULT: ___________
PASS/FAIL: [ ]
```

---

## Test 2: Save State Tracking (Task 3.2)

### Purpose
Verify that save state is properly tracked (isSaving, saveError, lastSaveTime).

### Prerequisites
- Dev task open
- Browser DevTools Console access
- Access to projectStore

### Test Case 2.1: isSaving State During Save
```
STEPS:
1. Open MiniAppShell component in DevTools
2. Edit a field
3. Immediately check component state:
   - Look for isSaving: true during save
   - Check saveError is null
4. After save completes, check isSaving: false

EXPECTED:
✅ isSaving = true during request
✅ isSaving = false after completion
✅ saveError = null on success

ACTUAL RESULT: ___________
PASS/FAIL: [ ]
```

### Test Case 2.2: Save Error Handling
```
STEPS:
1. Intentionally cause save error:
   - Disconnect internet (DevTools → Network → Offline)
   - Edit and try to save
   - Watch console for error
2. Reconnect internet and save again

EXPECTED:
✅ saveError displays in console
✅ saveError clears after successful retry
✅ Component shows error state during offline

ACTUAL RESULT: ___________
PASS/FAIL: [ ]
```

### Test Case 2.3: lastSaveTime Tracking
```
STEPS:
1. Open task and note current time
2. Edit and save
3. Check component state for lastSaveTime
4. Make another edit and save
5. Verify lastSaveTime updated

EXPECTED:
✅ lastSaveTime matches save completion time
✅ Updates with each successful save
✅ Accurate to second

ACTUAL RESULT: ___________
PASS/FAIL: [ ]
```

---

## Test 3: Validation Gate (Task 3.3)

### Purpose
Verify that invalid forms are blocked from saving.

### Prerequisites
- Task with required fields open
- DevTools Console visible

### Test Case 3.1: Required Field Validation
```
STEPS:
1. Open a task with required fields (e.g., Video Script)
2. Clear a required field
3. Try to save
4. Watch console for validation error
5. Fill field back in and save

EXPECTED:
✅ Save blocked when required field empty
✅ Validation error message appears
✅ Console shows: "Please fill all required fields"
✅ Save succeeds after field filled

ACTUAL RESULT: ___________
PASS/FAIL: [ ]
```

### Test Case 3.2: Multiple Required Fields
```
STEPS:
1. Open task with 5+ fields
2. Clear 3 required fields
3. Try to save
4. Error message should appear

EXPECTED:
✅ Validation error shown (for first required field)
✅ Save blocked
✅ All empty required fields highlighted (if UI does this)

ACTUAL RESULT: ___________
PASS/FAIL: [ ]
```

### Test Case 3.3: Error Message Clarity
```
STEPS:
1. Open task
2. Clear required field (note the field name)
3. Try to save
4. Read error message

EXPECTED:
✅ Error message is clear and actionable
✅ Specifies which field is required
✅ Message disappears when field is filled

ACTUAL RESULT: ___________
PASS/FAIL: [ ]
```

---

## Test 4: Conflict Detection (Task 3.4)

### Purpose
Verify that concurrent edits are detected and handled gracefully.

### Prerequisites
- Two browser windows open (same task)
- DevTools Network tab visible
- Supabase project accessible

### Test Case 4.1: Version Increment on Save
```
STEPS:
1. Open task and note initial version (via Network tab → Response)
2. Edit and save
3. Check version in next response

EXPECTED:
✅ version in database increments (1 → 2 → 3...)
✅ Visible in response data
✅ Increments with each save

ACTUAL RESULT: ___________
PASS/FAIL: [ ]
```

### Test Case 4.2: Basic Concurrent Edit
```
STEPS:
1. Window 1: Open task (note version = 1)
2. Window 1: Edit field A, save
3. Window 2: Edit field B, try to save
4. Observe response

EXPECTED:
✅ Window 2 save fails with 409 Conflict
✅ Conflict UI appears (not a crash)
✅ Shows who edited it (or neutral message)

ACTUAL RESULT: ___________
PASS/FAIL: [ ]
```

### Test Case 4.3: Conflict UI Message Quality
```
STEPS:
1. Trigger conflict (as in Test 4.2)
2. Read conflict message in UI
3. Check console for error details

EXPECTED:
✅ Message is friendly (not technical jargon)
✅ Suggests action: "Reload to see latest" or similar
✅ Shows timestamp of conflicting edit
✅ No crash, no 500 error

ACTUAL RESULT: ___________
PASS/FAIL: [ ]
```

### Test Case 4.4: Conflict Resolution (Reload)
```
STEPS:
1. Trigger conflict as in Test 4.2
2. Click "Reload" or similar button in conflict UI
3. Verify task reloads with latest data
4. Try to save new changes

EXPECTED:
✅ UI closes conflict dialog
✅ Task data reloads from server
✅ New edits can be saved without error
✅ Version resets to server version

ACTUAL RESULT: ___________
PASS/FAIL: [ ]
```

### Test Case 4.5: Three-Way Conflict
```
STEPS:
1. Window 1: Edit field A, save
2. Window 2: Edit field B, save (succeeds because W1 saved first)
3. Window 3: Edit field C, try to save
4. Observe response

EXPECTED:
✅ Window 3 gets 409 conflict
✅ System handles gracefully
✅ No data corruption

ACTUAL RESULT: ___________
PASS/FAIL: [ ]
```

---

## Test 5: Unsaved Changes Warning (Task 3.5)

### Purpose
Verify that users are warned about unsaved changes before navigation.

### Prerequisites
- Task open with form data
- Navigation available (router links, back button)

### Test Case 5.1: Dirty State Detection
```
STEPS:
1. Open task (clean state)
2. Edit any field
3. Check component isDirty state

EXPECTED:
✅ isDirty = false initially
✅ isDirty = true after first edit
✅ isDirty = false after save

ACTUAL RESULT: ___________
PASS/FAIL: [ ]
```

### Test Case 5.2: Warning on Navigation
```
STEPS:
1. Open task
2. Edit a field
3. Click back button or navigate away
4. Observe dialog

EXPECTED:
✅ Dialog appears: "You have unsaved changes"
✅ Options: "Discard" or "Keep Editing"
✅ Navigation blocked until choice made

ACTUAL RESULT: ___________
PASS/FAIL: [ ]
```

### Test Case 5.3: Warning Message Quality
```
STEPS:
1. Open task, make unsaved changes
2. Try to navigate away
3. Read the warning message

EXPECTED:
✅ Message is clear and non-technical
✅ Explains consequence of discard
✅ Buttons are obvious

ACTUAL RESULT: ___________
PASS/FAIL: [ ]
```

### Test Case 5.4: No Warning After Save
```
STEPS:
1. Open task, edit field
2. Wait for auto-save (500ms)
3. Navigate away

EXPECTED:
✅ No warning dialog (because isDirty cleared after save)
✅ Navigation succeeds immediately

ACTUAL RESULT: ___________
PASS/FAIL: [ ]
```

### Test Case 5.5: Browser Tab Close Warning
```
STEPS:
1. Open task, make unsaved changes
2. Try to close browser tab
3. Observe browser warning

EXPECTED:
✅ Browser shows standard "Leave site?" dialog
✅ Warns about unsaved changes (if supported)
✅ Can choose to stay or leave

ACTUAL RESULT: ___________
PASS/FAIL: [ ]
```

---

## Test 6: Edge Cases

### Test Case 6.1: Rapid Save After Conflict
```
STEPS:
1. Trigger conflict (Test 4.2)
2. Immediately make another edit
3. Try to save before reload

EXPECTED:
✅ Second edit queued/blocked
✅ Conflict error shown first
✅ Must reload before new save

ACTUAL RESULT: ___________
PASS/FAIL: [ ]
```

### Test Case 6.2: Network Timeout
```
STEPS:
1. Edit task
2. Throttle network to "Slow 3G" (DevTools → Network)
3. Try to save
4. Watch for timeout behavior

EXPECTED:
✅ Save eventually completes (or fails gracefully)
✅ Error message shows if timeout
✅ No hanging requests
✅ Can retry save

ACTUAL RESULT: ___________
PASS/FAIL: [ ]
```

### Test Case 6.3: Very Large Form Data
```
STEPS:
1. Open a task with large amount of data
2. Edit multiple large fields
3. Save and monitor Network tab

EXPECTED:
✅ Payload size reasonable (< 1MB)
✅ Save completes in < 5 seconds
✅ No timeout errors

ACTUAL RESULT: ___________
PASS/FAIL: [ ]
```

### Test Case 6.4: Rapid Tab Switching
```
STEPS:
1. Open same task in multiple tabs
2. Rapidly switch between tabs, editing each
3. Save in each tab
4. Check for data consistency

EXPECTED:
✅ Tabs handle edits independently
✅ Last save wins (not corrupted merge)
✅ Conflicts detected when expected

ACTUAL RESULT: ___________
PASS/FAIL: [ ]
```

### Test Case 6.5: Browser Back Button
```
STEPS:
1. Open task, make changes (not saved yet)
2. Click browser back button
3. Respond to unsaved warning
4. Navigate back to task

EXPECTED:
✅ Warning appears
✅ Can discard or keep
✅ If discard: goes back to previous page
✅ If keep: stays on task

ACTUAL RESULT: ___________
PASS/FAIL: [ ]
```

---

## Test 7: Integration Tests

### Test Case 7.1: Full Workflow
```
STEPS:
1. Open task (clean)
2. Edit 3 fields
3. Watch auto-save (500ms)
4. Navigate away (no warning)
5. Navigate back
6. Verify all edits persisted

EXPECTED:
✅ All edits saved and persist
✅ No manual save needed
✅ isDirty cleared after auto-save
✅ Smooth workflow

ACTUAL RESULT: ___________
PASS/FAIL: [ ]
```

### Test Case 7.2: Conflict + Retry Workflow
```
STEPS:
1. Trigger conflict (two windows)
2. Click "Reload" in conflict UI
3. Make new edits
4. Save again
5. Verify success

EXPECTED:
✅ Conflict resolved
✅ New edits save successfully
✅ Version tracking continues
✅ No data loss

ACTUAL RESULT: ___________
PASS/FAIL: [ ]
```

### Test Case 7.3: Invalid Form + Retry
```
STEPS:
1. Clear required field
2. Try to save (blocked)
3. Fill field back in
4. Save (should succeed)
5. Verify data persisted

EXPECTED:
✅ Validation works as gate
✅ After validation passes, save succeeds
✅ Data correct in database

ACTUAL RESULT: ___________
PASS/FAIL: [ ]
```

---

## Summary

### Test Results
| Feature | Passed | Failed | Notes |
|---------|--------|--------|-------|
| Debouncing | / | / | |
| Save State | / | / | |
| Validation | / | / | |
| Conflict Detection | / | / | |
| Unsaved Changes | / | / | |
| Edge Cases | / | / | |
| Integration | / | / | |

### Overall Status
- **Total Tests:** 25
- **Passed:** ___
- **Failed:** ___
- **Pass Rate:** ___%

### Critical Issues Found
(List any blocking issues here)

### Minor Issues / Improvements
(List non-blocking improvements)

### Recommendation
- [ ] Ready for production
- [ ] Ready with minor fixes
- [ ] Needs significant work

---

## How to Use This Guide

1. **Print or copy** this guide to a text editor
2. **Run each test** in order
3. **Note results** as PASS/FAIL
4. **Add details** in ACTUAL RESULT sections
5. **Report any failures** with exact reproduction steps
6. **Complete summary** at end

---

## Testing Environment Info

Please fill in:
- Browser: ________________
- OS: ________________
- Network: (Normal / Slow / Offline Simulation): ________________
- Dev Server Version: ________________
- Supabase Project: ________________
