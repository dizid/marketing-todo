# SSOT (Single Source of Truth) Implementation Plan

**Created**: 2025-12-04
**Status**: Planning - Pending Approval
**Priority**: High - Critical for data consistency
**Estimated Duration**: 7-8 weeks

---

## Executive Summary

The current codebase has significant SSOT violations that create data consistency risks:
- **25+ MiniApp components** create local copies of taskData instead of using store directly
- **Deep watchers** on formData fire on every keystroke, creating race condition risks
- **No save state tracking**, causing potential data loss on concurrent edits
- **Unused deprecated composables** creating confusion and maintenance burden
- **localStorage fallbacks** could cause sync issues with database
- **No unsaved changes protection**, users can lose work

This plan systematically fixes these issues with proper safeguards to prevent breaking changes.

---

## Critical Findings from Breaking Change Analysis

### 🚨 CRITICAL ISSUES (Must Fix):
1. **Deep Watcher Race Conditions** - formData watcher fires on every keystroke, multiple concurrent saves possible
2. **No Unsaved Changes Protection** - User can lose work if navigation happens during save
3. **No Conflict Resolution** - Concurrent edits result in data loss (last write wins)
4. **localStorage Fallback Dependencies** - 14+ config files depend on localStorage, removing without migration breaks app

### ⚠️ HIGH SEVERITY (Fix First Phase):
1. Missing API in new composable (`syncToProjectContext()`, `persistOverrides()`)
2. Task config field mapping inconsistencies
3. Loose form validation - saves fire regardless of validation status
4. Unknown parent component save handling

### ℹ️ MEDIUM SEVERITY (Fix Second Phase):
1. Timing-dependent code (setTimeout/setInterval) conflicts with refactored patterns
2. 14+ task configs using deprecated patterns
3. No type safety on props
4. All components deep-copy props (memory inefficiency)

---

## Data Flow Architecture (Current)

```
User Input in MiniApp
    ↓
FormBuilder updates formData ref (LOCAL COPY)
    ↓
Deep watcher on formData (fires on EVERY keystroke)
    ↓
Emit 'save' event with full taskData object
    ↓
Parent component receives save (NO DEBOUNCE)
    ↓
Update projectStore.projectData.taskData[taskId]
    ↓
API call: saveProjectTasks(projectId, taskData) [ASYNC]
    ↓
Database update
    ↓
[Deprecated] localStorage update (FALLBACK - not used)
```

### Current Problems:
- ❌ Multiple saves fire before API completes
- ❌ User continues typing, new save fires while first save in flight
- ❌ No conflict detection
- ❌ No unsaved changes warning
- ❌ No debouncing on keystroke events

---

## Target Data Flow Architecture (After SSOT Fix)

```
User Input in MiniApp
    ↓
FormBuilder updates formData
    ↓
Watch on formData (500ms DEBOUNCE) ← NEW: Prevents race condition
    ↓
Validation check (GATE: prevent invalid save) ← NEW: Data quality
    ↓
Set saving state = true ← NEW: Prevent concurrent saves
    ↓
Emit 'save' event with validated taskData
    ↓
Parent receives save (once, debounced)
    ↓
Check for conflicts (optimistic lock) ← NEW: Concurrent edit safety
    ↓
Update projectStore.projectData.taskData[taskId] (optimistic)
    ↓
API call: saveProjectTasks() [ASYNC + ERROR HANDLING] ← ENHANCED
    ↓
Database update
    ↓
Success callback: Set saving state = false, update timestamp
    ↓
Error callback: Rollback optimistic update, show error message
```

---

## Implementation Phases

### PHASE 1: Setup & Documentation (Week 1)
**Goal**: Establish safety baseline before any refactoring

**Tasks**:
- [ ] Document parent component (UnifiedTaskComponent) save handling
- [ ] Document exact API endpoint contract for task saves
- [ ] Create TypeScript interfaces for taskData, formData structures
- [ ] Create failing integration tests for all edge cases
- [ ] Review and document setTimeout/setInterval dependencies
- [ ] Map all localStorage usage and migration path
- [ ] Set up monitoring for save errors pre-refactoring

**Deliverables**:
- `interfaces/TaskData.ts` - Type definitions
- `tests/integration/form-save.integration.test.js` - Edge case tests
- `PHASE_1_ANALYSIS.md` - Detailed findings document

**Success Criteria**:
- ✅ Parent component behavior fully documented
- ✅ API contract documented with examples
- ✅ All edge case tests written (and currently failing)
- ✅ Breaking change checklist complete

---

### PHASE 2: Remove Unused Code (Week 2)
**Goal**: Clean up deprecated code that's not actually used

**Tasks**:
- [ ] Verify `useProjectContextInjection.ts` has NO active imports
- [ ] Verify `useMiniAppFieldsWithInheritance.js` has NO active imports
- [ ] Verify `useMiniAppInheritedFields.js` has NO active imports
- [ ] Check codebase for any hidden references or dynamic imports
- [ ] Remove unused deprec composables
- [ ] Update documentation to remove references
- [ ] Commit: "refactor: Remove unused deprecated composables"

**Deliverables**:
- Removed files (3 total)
- Updated import references (0 expected)
- Updated documentation

**Success Criteria**:
- ✅ All 3 deprecated files deleted
- ✅ Build passes with no import errors
- ✅ No runtime errors from missing imports
- ✅ Tests still pass

**Risk Level**: LOW - These composables verified not in use

---

### PHASE 3: Add Save Pattern Safeguards (Week 3)
**Goal**: Prevent race conditions and data loss BEFORE refactoring prop-based patterns

**Tasks**:

#### 3.1 - Add Debouncing to Save Events
- [ ] Modify MiniAppShell.vue deep watcher to use debounce (500ms)
- [ ] Test: Typing "hello" should only fire ONE save, not 5
- [ ] Test: Rapid save events should be batched

#### 3.2 - Add Save State Tracking
- [ ] Add `saving`, `saveError`, `lastSaveTime` to parent component state
- [ ] Show "Saving..." indicator when state.saving = true
- [ ] Prevent concurrent saves (queue or ignore if already saving)
- [ ] Show error message if save fails

#### 3.3 - Add Validation Gate
- [ ] Check form validation before emitting save
- [ ] If validation fails: Show error, don't emit save
- [ ] Add visual validation feedback (red borders, error messages)

#### 3.4 - Add Conflict Detection
- [ ] Add `version` or `lastModified` field to taskData
- [ ] Include in API payload
- [ ] On API error 409 (conflict): Show "Someone else edited this, reloading..."
- [ ] Reload data and reset form

#### 3.5 - Add Unsaved Changes Warning
- [ ] Track "dirty" state (has user made changes?)
- [ ] Show warning if user navigates away with unsaved changes
- [ ] "Cancel" button should reset to last saved state

**Deliverables**:
- Modified MiniAppShell.vue
- Modified parent component (save handler)
- New `composables/useSaveState.js` - Reusable save tracking logic
- Updated integration tests
- Commit: "refactor: Add debouncing, validation gate, and unsaved changes protection"

**Success Criteria**:
- ✅ Rapid typing only fires one save (debounce working)
- ✅ Concurrent saves prevented (save button disabled while saving)
- ✅ Invalid forms don't trigger saves
- ✅ Conflicts detected and resolved
- ✅ Unsaved changes warning works
- ✅ All integration tests pass
- ✅ No data loss in edge cases

**Risk Level**: MEDIUM - Changes core save pattern, must test thoroughly

---

### PHASE 4: Standardize Component Data Access (Week 4)
**Goal**: Replace prop-copying pattern with direct store access

**Tasks**:

#### 4.1 - Refactor First MiniApp (Pilot)
Choose safest MiniApp to refactor first (minimal dependencies):
- [ ] Select pilot MiniApp (recommend: SimpleTextFormMiniApp)
- [ ] Remove local `taskData` ref
- [ ] Create computed getter from projectStore
- [ ] Replace local formData updates with direct store updates (via action)
- [ ] Remove deep watcher (no longer needed, store is source)
- [ ] Test: Form still loads and saves correctly
- [ ] Commit: "refactor: Migrate [MiniApp] to store-based data access"

#### 4.2 - Refactor Remaining MiniApps (Group by Pattern)
- [ ] Identify all MiniApps with simple prop-copying pattern
- [ ] Refactor 5-10 at a time (safer than all at once)
- [ ] Test each batch before moving to next
- [ ] Address special cases (setTimeout-dependent, complex logic)
- [ ] Commit per batch

#### 4.3 - Create Store Action for Data Updates
- [ ] Add `updateTaskFormData(taskId, formData)` action
- [ ] This action handles: validation, conflict check, API call
- [ ] Components call this instead of emitting save events
- [ ] Centralizes all data persistence logic

**Deliverables**:
- All 25+ MiniApps refactored
- New store action: `updateTaskFormData()`
- Migration completed for all components
- Commits per batch for easy rollback if needed

**Success Criteria**:
- ✅ All MiniApps use store directly (no local taskData copies)
- ✅ Tests pass for each refactored MiniApp
- ✅ No regression in functionality
- ✅ Save patterns consistent across all MiniApps
- ✅ Memory usage reduced (no deep copies)

**Risk Level**: HIGH - Affects all 25+ MiniApp components, highest risk phase

---

### PHASE 5: Migrate localStorage to Database (Week 5)
**Goal**: Eliminate localStorage fallback dependencies, use database only

**Tasks**:

#### 5.1 - Audit localStorage Usage
- [ ] Identify all active localStorage uses:
  - Task overrides (deprecated composable - not used)
  - Onboarding wizard data (ACTIVE)
  - Analytics integration state
  - Config fallbacks
- [ ] Map each to database schema

#### 5.2 - Migrate Onboarding localStorage
- [ ] Keep localStorage for 7-day recovery (multi-step wizard safety)
- [ ] But also save to database `project_wizard_state` table
- [ ] On load: Check database first, fallback to localStorage
- [ ] After successful wizard completion: Clear localStorage

#### 5.3 - Remove Config localStorage Fallback
- [ ] Find all task configs using localStorage `marketing-app-data`
- [ ] Replace with proper state management (store)
- [ ] Ensure all configs have proper error handling

#### 5.4 - Remove Deprecated Composable localStorage
- [ ] Deprecated composable is NOT USED, so safe to clean
- [ ] Verify one more time with grep
- [ ] Comment out or remove localStorage references

**Deliverables**:
- Database migration: Add `project_wizard_state` table
- Updated onboarding store to use database + localStorage fallback
- Updated task configs to use store instead of localStorage
- Commits: "refactor: Migrate localStorage to database"

**Success Criteria**:
- ✅ No data loss from localStorage removal
- ✅ Onboarding recovery still works
- ✅ Task configs work without localStorage
- ✅ All edge case tests pass

**Risk Level**: MEDIUM - localStorage removal could cause data loss if not careful

---

### PHASE 6: Enhance Field Inheritance (Week 6)
**Goal**: Ensure field inheritance patterns work correctly with refactored architecture

**Tasks**:

#### 6.1 - Verify Field Mapping Consistency
- [ ] Compare all task config field mappings with FIELD_INHERITANCE_MAP.json
- [ ] Identify any mismatches or missing mappings
- [ ] Update configs to include proper fieldMappings
- [ ] Add validation to ensure all required fields mapped

#### 6.2 - Implement ProjectContext Change Detection
- [ ] Watch for changes to projectStore.projectData.settings
- [ ] When inheritance source changes: decide on strategy:
  - Option A: Auto-refresh inherited values in open forms (risky - user confusion)
  - Option B: Show warning "Source values changed, reload to see changes" (safer)
- [ ] Implement chosen strategy
- [ ] Test: Edit project context → open task → behavior correct

#### 6.3 - Verify Inheritance in All MiniApps
- [ ] Test each MiniApp's field inheritance works correctly
- [ ] Check that inherited fields show inherited badge/styling
- [ ] Verify overrides are editable and persist
- [ ] Test: Change canonical field → inherited field updates (if auto-refresh)

**Deliverables**:
- Updated task configs with complete field mappings
- Field inheritance change detection logic
- Updated inheritance UI (if needed)
- Integration tests for inheritance scenarios
- Commits: "refactor: Enhance field inheritance patterns"

**Success Criteria**:
- ✅ All field mappings consistent
- ✅ Inheritance works in all MiniApps
- ✅ ProjectContext changes handled safely
- ✅ No unexpected behavior with field overrides

**Risk Level**: MEDIUM - Inheritance logic is complex, needs thorough testing

---

### PHASE 7: Comprehensive Testing (Week 7)
**Goal**: Validate all changes work together, no regressions

**Tasks**:

#### 7.1 - Unit Tests
- [ ] Run all existing unit tests: `npm run test`
- [ ] All tests should pass
- [ ] Fix any failures

#### 7.2 - Integration Tests
- [ ] Run integration test suite: `npm run test:integration`
- [ ] Test all form save scenarios
- [ ] Test all edge cases from PHASE 1

#### 7.3 - Manual Testing Checklist
- [ ] Edit task in each MiniApp type
- [ ] Verify data persists on page reload
- [ ] Back button shows warning if unsaved
- [ ] Multiple rapid saves don't cause errors
- [ ] AI generation works with inheritance
- [ ] Inherited fields show correctly
- [ ] Overrides persist across reopens
- [ ] Field validation prevents invalid save
- [ ] Concurrent edits (multiple windows) work safely
- [ ] slow network (DevTools throttle) doesn't lose data
- [ ] Project context changes handled correctly

#### 7.4 - Performance Testing
- [ ] Test form with large datasets
- [ ] No memory leaks in long-running edit sessions
- [ ] Save performance acceptable (< 2 seconds)

#### 7.5 - Documentation
- [ ] Update developer docs with new architecture
- [ ] Document store actions and composables
- [ ] Add migration guide for components
- [ ] Add troubleshooting guide

**Deliverables**:
- All tests passing
- Updated documentation
- Performance benchmarks
- Manual test results

**Success Criteria**:
- ✅ 100% unit tests passing
- ✅ 100% integration tests passing
- ✅ All manual tests passing
- ✅ No performance regressions
- ✅ Documentation updated

**Risk Level**: LOW - Just validation, no new code

---

### PHASE 8: Deployment & Monitoring (Week 8)
**Goal**: Deploy safely and monitor for issues

**Tasks**:

#### 8.1 - Staging Deployment
- [ ] Deploy all changes to staging environment
- [ ] Run full test suite in staging
- [ ] Manual testing in staging
- [ ] Monitor logs for errors

#### 8.2 - Production Deployment (Gradual Rollout)
- [ ] Deploy to 10% of users
- [ ] Monitor error rates, save failures, performance
- [ ] Monitor user feedback
- [ ] If issues found: Rollback to previous version

#### 8.3 - Increase Rollout
- [ ] If 10% stable for 24 hours: Increase to 50%
- [ ] Monitor again for 24 hours
- [ ] If stable: Increase to 100%

#### 8.4 - Post-Deployment Monitoring
- [ ] Monitor save failures (should be 0)
- [ ] Monitor conflict errors (should be < 1%)
- [ ] Monitor performance (save time < 2 seconds)
- [ ] Monitor user reports

**Deliverables**:
- Deployment checklist completed
- Monitoring dashboard setup
- Rollback plan prepared

**Success Criteria**:
- ✅ No increase in error rates
- ✅ No user-reported data loss
- ✅ No performance degradation
- ✅ Successful rollout to 100%

**Risk Level**: MEDIUM - Production deployment always carries risk

---

## Safeguards & Checkpoints

### Pre-Refactoring Safeguards (MUST COMPLETE):
1. ✅ **Breaking Change Analysis** - COMPLETED
2. ⏳ **Phase 1: Document everything** - Architecture, APIs, behavior
3. ⏳ **Write Edge Case Tests** - All failing, waiting for implementation
4. ⏳ **Backup Database** - Before Phase 4 starts
5. ⏳ **Create Rollback Plan** - Prepared for each phase

### Per-Phase Checkpoints:
- After each phase: All tests pass
- After each phase: Manual testing checklist complete
- After Phase 4 (highest risk): Code review by 2+ team members
- After Phase 6: Field inheritance tested in real tasks
- After Phase 7: 100% test coverage confirmed

### Build & Deployment Gates:
- ✅ TypeScript compilation passes (no type errors)
- ✅ ESLint passes (no code style issues)
- ✅ All unit tests pass (100%)
- ✅ All integration tests pass (100%)
- ✅ Performance benchmarks acceptable
- ✅ Manual testing checklist complete

---

## Rollback Plan

If critical issues found:

### For Phase 2 (Remove Deprecations):
- Re-add deleted files from git history
- Revert commits

### For Phases 3-4 (Core Refactoring):
- `git revert [commit]` for affected phase
- Return to previous working version
- Document failure and root cause
- Plan revised approach

### For Phase 5-8:
- Production rollback via feature flag or deployment
- Database rollback if migrations needed
- Notify users if necessary

---

## Success Metrics

### Data Consistency:
- ✅ 0 cases of data divergence between store and components
- ✅ 0 cases of lost data from concurrent edits
- ✅ 0 localStorage sync issues

### Performance:
- ✅ Form save response time < 2 seconds (down from unknown)
- ✅ No memory leaks in long-running sessions
- ✅ Reduced CPU usage (fewer watchers)

### Developer Experience:
- ✅ Clear single source of truth for all data
- ✅ Easier debugging with centralized store
- ✅ Type safety with interfaces
- ✅ Clear data flow patterns

### User Experience:
- ✅ No unsaved work lost
- ✅ Clear feedback on save status
- ✅ No data corruption from concurrent edits
- ✅ Inherited fields work reliably

---

## Timeline Summary

```
Week 1  ████ - Phase 1: Setup & Documentation
Week 2  ███░ - Phase 2: Remove Unused Code
Week 3  ████ - Phase 3: Add Save Safeguards
Week 4  ████ - Phase 4: Refactor Components (HIGHEST RISK)
Week 5  ████ - Phase 5: Migrate localStorage
Week 6  ███░ - Phase 6: Enhance Field Inheritance
Week 7  ██░░ - Phase 7: Comprehensive Testing
Week 8  ██░░ - Phase 8: Deployment & Monitoring
```

**Total Estimated Duration**: 8 weeks
**Parallel Work Possible**: Testing can overlap with implementation

---

## Known Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Save race condition causes data loss | CRITICAL | Add debouncing + conflict detection (Phase 3) |
| Concurrent edits cause overwrites | CRITICAL | Optimistic locking + conflict resolution (Phase 3) |
| localStorage removal breaks fallback | HIGH | Migrate to database + keep fallback for wizard (Phase 5) |
| 25+ MiniApps break during refactor | HIGH | Refactor gradually, test each batch (Phase 4) |
| Field inheritance bugs | HIGH | Comprehensive testing + careful verification (Phase 6) |
| Slow network causes timeout | MEDIUM | Add save timeout + retry logic (Phase 3) |
| User loses unsaved work | MEDIUM | Add dirty flag + navigation warning (Phase 3) |
| Test coverage insufficient | MEDIUM | Write edge case tests first (Phase 1) |
| setTimeout conflicts | MEDIUM | Document timing logic, preserve in tests (Phase 4) |
| API contract mismatch | MEDIUM | Document API first (Phase 1) |

---

## Questions / Decisions Needed

1. **ProjectContext auto-refresh**: When parent context changes, should inherited fields auto-refresh or show warning?
   - Option A: Auto-refresh (current data, but user confusion possible)
   - Option B: Show warning (safer, but more friction)
   - **RECOMMEND**: Option B for MVP, Option A in future iteration

2. **Onboarding localStorage**: Keep localStorage for multi-step recovery or use database?
   - Option A: Keep localStorage for 7-day recovery (current pattern)
   - Option B: Database only (more reliable, less complexity)
   - **RECOMMEND**: Option A (safer for multi-step forms)

3. **Conflict handling**: When concurrent edit detected, auto-reload or ask user?
   - Option A: Auto-reload (simpler, but loses user's edits)
   - Option B: Ask user to merge (complex, better UX)
   - **RECOMMEND**: Option A for MVP, Option B in future

4. **Type safety migration**: Add TypeScript now or after refactoring?
   - Option A: Add TypeScript during Phase 4 (more work, better safety)
   - Option B: After Phase 8 (faster, can be iterative)
   - **RECOMMEND**: Option A (prevent bugs during migration)

---

## Files That Will Change

### New Files:
- `interfaces/TaskData.ts` - Type definitions
- `composables/useSaveState.js` - Save state tracking
- `SSOT_PROGRESS_TRACKER.md` - This tracking file

### Modified Files (25+):
- All MiniApp components in `src/components/TaskMiniApps/`
- `src/components/TaskMiniApps/core/MiniAppShell.vue`
- `src/stores/projectStore.js`
- Parent component (UnifiedTaskComponent or equivalent)
- Various task config files

### Deleted Files:
- `src/composables/useProjectContextInjection.ts` (Phase 2)
- `src/composables/useMiniAppFieldsWithInheritance.js` (Phase 2)
- `src/composables/useMiniAppInheritedFields.js` (Phase 2)

### Database Changes:
- Add `project_wizard_state` table (Phase 5)
- Add `version` field to `project_tasks` table (Phase 3)

---

## Dependencies & Prerequisites

**Must Have Before Starting:**
- ✅ Node.js 16+
- ✅ npm or yarn
- ✅ Git (for version control)
- ✅ Database access (for migrations)
- ✅ IDE with TypeScript support

**Team Requirements:**
- 1 Primary Developer (full-time) - Coordinating phases
- Code Review: 2+ team members for Phase 4 (highest risk)
- Testing: QA team for Phase 7
- DevOps: Staging/production deployment (Phase 8)

---

## Related Documentation

- `PHASE_1_COMPLETION_SUMMARY.md` - Context on previous refactoring
- `FIELD_INHERITANCE_MAP.json` - Field mapping reference
- Breaking Change Analysis Report (included above)

---

**Status**: Ready for Approval
**Next Step**: User review and confirmation of plan + decisions
