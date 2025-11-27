# COMPREHENSIVE DATA CONSOLIDATION PLAN: LAUNCHPILOT

## Executive Summary

**Goal**: Reduce 85-95 user-facing data points down to ~45-50 by consolidating 10 semantic duplicate groups into a unified, inheritance-based data model.

**Timeline**: 8-12 hours of focused work (can be done in 2-3 days, 1-2 hours per phase)

**Risk Level**: LOW to MEDIUM (fully backward compatible, can rollback at any phase)

**Key Concept**: Make `ProjectContext` (Supabase table) the single source of truth, then gradually migrate components to use it while keeping old data paths available as fallbacks.

---

## PART 1: THE 12 PHASES (Quick Reference)

| Phase | Name | Duration | Complexity | Risk | Status |
|-------|------|----------|-----------|------|--------|
| 1 | Establish ProjectContext as Source of Truth | 1-2h | Low | Low | PENDING |
| 2 | Create Field Registry System | 1-2h | Medium | Low | PENDING |
| 3 | Implement Field Inheritance & Override Pattern | 1.5h | Medium | Medium | PENDING |
| 4 | Migrate Onboarding Data to ProjectContext | 1-1.5h | Medium | Medium | PENDING |
| 5 | Consolidate Mini-App Form Schemas | 1.5-2h | Medium | Medium | PENDING |
| 6 | Implement ProjectContextRepository Full CRUD | 1-1.5h | Medium | Low | PENDING |
| 7 | Update Project Forms & Settings UI | 1h | Medium | Low | PENDING |
| 8 | Refactor Mini-Apps to Use Inheritance | 1h | Medium | Medium | PENDING |
| 9 | Refactor Task & Project Stores for Context | 1h | Low | Low | PENDING |
| 10 | Create Field Value Mapper Service | 1-1.5h | Medium | Low | PENDING |
| 11 | Implement Data Integrity Verification | 1h | Low | Low | PENDING |
| 12 | Comprehensive Testing & Rollout | 1.5-2h | High | Medium | PENDING |

**Total Effort**: 14-18 hours (realistic 2-3 days of part-time work)

---

## PART 2: DETAILED PHASE BREAKDOWN

### Phase 1: ProjectContext Model (1-2 hours)
**What**: Create new `ProjectContext` domain model + Supabase table as the single source of truth

**Database Schema**:
- `project_contexts` table with fields:
  - product_name, product_type, product_description
  - target_audience, target_audience_details
  - primary_goal, goal_description
  - target_timeline, deadline_date
  - marketing_budget, team_size, current_stage
  - tech_stack, created_at, updated_at

**Why First**: Establishes the foundation; everything else builds on this

**Testing**: Create → Read → Update queries work correctly

**Risk**: LOW (additive, no deletes)

---

### Phase 2: Field Registry (1-2 hours)
**What**: Create a centralized registry that maps all field sources to canonical names

**Includes**:
- FIELD_REGISTRY: "target_audience" → lists all 5 places it appears
- Helper functions: getCanonicalName(), getSourcesFor(), isInheritable()
- FIELD_CATEGORIES: Groups fields by purpose (product_identity, audience, goals, etc.)
- FIELD_VALIDATION: Rules for each field type

**Why Here**: Enables identification of all duplicates; supports migration tools

**Testing**: All 85-95 data points registered; 10 duplicate groups identified

**Risk**: LOW (configuration/documentation only)

---

### Phase 3: Field Inheritance Pattern (1.5 hours)
**What**: Composable system for inheriting project fields in tasks (with override capability)

**Components**:
- `useFieldInheritance()` composable: Get inherited or overridden value
- `useFieldInheritance(taskId, 'target_audience')` returns:
  - `value`: Effective value (override or inherited)
  - `isInherited`: Boolean
  - `isOverridden`: Boolean
  - `setOverride()`: Save task-specific override
  - `clearOverride()`: Revert to inherited

**Pattern**:
```
Project Context: "Design startups"
  ↓ (inherited)
Task 1: null (uses inherited)
Task 2: "Enterprise CTOs" (override)
```

**Why Here**: Enables tasks to reuse project data; foundation for consolidation

**Testing**: Override persists; reverting shows inherited; sync works

**Risk**: MEDIUM (new data layer) but fully backward compatible

---

### Phase 4: Migrate Onboarding → ProjectContext (1-1.5 hours)
**What**: Transfer onboarding wizard data → ProjectContext on project creation

**Logic**:
- When project created from onboarding → auto-populate ProjectContext
- Map wizard field names to ProjectContext canonical names
- Bulk migration for existing projects (optional)
- Keep old wizard data; new table is copy

**Why Here**: Ensures new projects have ProjectContext from day 1

**Testing**: New project has full context; bulk migration doesn't duplicate

**Risk**: MEDIUM (data movement) but original data remains

---

### Phase 5: Mini-App Schema Consolidation (1.5-2 hours)
**What**: Refactor all 25+ mini-app configs to remove duplicate field definitions

**Changes**:
- Before: Each app defines `audience`, `budget`, `timeline` fields
- After: Apps declare `inheritedFields: ['target_audience', 'marketing_budget']`
- Task-specific fields stay in config

**Example**:
```javascript
// BEFORE (duplicate)
formFields: [{id: 'audience', type: 'textarea', label: 'Audience'}]

// AFTER (inherited)
inheritedFields: ['target_audience']
formFields: [{id: 'industry', type: 'text', label: 'Industry'}]
```

**Why Here**: Reduces redundancy; largest data point reduction happens here

**Testing**: All 25+ apps have inheritedFields; duplicate fields removed; logic intact

**Risk**: MEDIUM (touches many files) but changes are additive

---

### Phase 6: ProjectContextRepository Complete (1-1.5 hours)
**What**: Full CRUD operations for ProjectContext

**Methods**:
- `getByProjectId(projectId)`
- `getAllForUser(userId)`
- `update(projectId, updates)`
- `updateField(projectId, fieldName, value)`
- `upsert(projectId, userId, data)`
- `delete(projectId)`
- `validate(data)`

**Why Here**: Unifies all access to source of truth

**Testing**: All methods work; validation catches errors

**Risk**: LOW (data layer only)

---

### Phase 7: Project Forms Refactoring (1 hour)
**What**: Update ProjectForm/ProjectSetup to use ProjectContext

**Changes**:
- Load from ProjectContext instead of scattered fields
- Display inherited vs. editable fields clearly
- Save updates to both project table + project_contexts

**UI Pattern**:
```
✏️ ALWAYS EDITABLE:
  - Project Name
  - Description

📌 PROJECT CONTEXT (shared across tasks):
  - Target Audience
  - Primary Goal
  - Timeline
  - Budget
  ↳ Info: "These are inherited by tasks"
```

**Testing**: Form loads/saves correctly; no data loss

**Risk**: LOW (UI changes only)

---

### Phase 8: Mini-App Refactoring (1 hour)
**What**: Update all 25+ mini-apps to display inherited fields

**UI Pattern**:
```
[Inherited Fields Panel]
  "Your Project's Target Audience"
  → [value from ProjectContext]
  🔄 [Override for this task button]

[Task-Specific Form]
  → Fields unique to this task
```

**Changes**:
- Show inherited field with "inherited from project" badge
- Option to override inline
- Show effective value (inherited or override)
- Ability to revert override

**Testing**: Inherited fields display; override works; reverts to inherited

**Risk**: MEDIUM (UI changes across many components) but non-breaking

---

### Phase 9: Store Updates (1 hour)
**What**: Update Pinia stores to load/expose ProjectContext

**Changes**:
- `selectProject()` also loads ProjectContext
- Add `currentProjectContext` state
- Add `inheritedFields` computed property
- Expose helper methods

**Testing**: Store loads context; fields accessible; sync with DB

**Risk**: LOW (store layer only)

---

### Phase 10: Field Mapping Service (1-1.5 hours)
**What**: Utility for mapping old → new field names (backward compat)

**Functions**:
- `getCanonicalName('onboarding.targetAudience')` → `'target_audience'`
- `migrateSettingsToContext(oldSettings)` → converts old format
- `getFieldValue(projectId, fieldName)` → finds in old or new location
- `createFieldQuery()` → search across all field sources

**Why Here**: Enables components to work with old code/data during transition

**Testing**: All mappings correct; migration preserves values

**Risk**: LOW (compatibility layer)

---

### Phase 11: Data Integrity Verification (1 hour)
**What**: Tools to detect and fix data inconsistencies

**Features**:
- `verifyAllProjects()`: Scan all user's projects
- `verifyProject()`: Check single project
- Detect: missing ProjectContext, conflicts, orphaned data
- `reconcileConflicts()`: Merge conflicting data

**Why Here**: Safety net before production; builds confidence

**Testing**: Detection works; reconciliation correct; reports clear

**Risk**: LOW (verification only, not data modification by default)

---

### Phase 12: Testing & Rollout (1.5-2 hours)
**What**: Comprehensive testing before production deployment

**Test Coverage**:
- Unit tests: 90%+ coverage of new code
- Integration tests: Full data flow onboarding → project → tasks
- E2E tests: Complete user journeys
- Smoke tests: No visual regressions
- Performance tests: <100ms for common queries
- Migration verification: Data integrity on staging

**Rollout Strategy**:
1. Staging deployment + full test suite
2. Production canary: 10% of users for 48h
3. Feature flag: Can disable ProjectContext reads if issues
4. Monitoring: Integrity checks on schedule

**Rollback**: If critical issues, revert to project_data reads (data remains intact)

**Testing**: All tests green; no performance degradation; user acceptance positive

**Risk**: MEDIUM (touches production) but mitigated by feature flag + rollback plan

---

## PART 3: DATA POINT REDUCTION BREAKDOWN

### Current State (Before)
- **Total Data Points**: 85-95
- **Duplicate Groups**: 10
- **Storage Layers**: 3 (localStorage, Supabase project_data, scattered configs)
- **Source of Truth**: Unclear (multiple authoritative locations)

### After Consolidation
- **Total Data Points**: ~45-50 (47% reduction)
- **Core Fields**: 15-20 in ProjectContext
- **Task Overrides**: Field names (not duplicates)
- **Mini-App Specific**: ~25-30 truly unique fields
- **Source of Truth**: ProjectContext (single, clear)

### Duplicate Groups Eliminated

| Group | Before | After | Reduction |
|-------|--------|-------|-----------|
| Target Audience | 5 instances | 1 field + overrides | 80% |
| Product Name/Desc | 4 instances | 2 fields + overrides | 75% |
| Main Goal | 4 instances | 1 field + overrides | 75% |
| Timeline | 3 instances | 1 field + overrides | 67% |
| Product Type | 2 instances | 1 field + overrides | 50% |
| Budget | 3 instances | 1-2 fields (context-specific) | 50% |
| Other duplicates | ~10 instances | Consolidated | 60% avg |

---

## PART 4: CRITICAL SUCCESS FACTORS

### Order of Operations (Dependencies)
```
1. ProjectContext Model → Registry → Inheritance Pattern
   ↓
2. Migrate Onboarding → Mini-App Consolidation
   ↓
3. Complete Repository → Update UI Components → Update Stores
   ↓
4. Field Mapping → Data Integrity
   ↓
5. Testing & Rollout
```

**Cannot skip phases** - each builds on previous

### Backward Compatibility Strategy
- Old `project_data` table stays intact (never deleted)
- Components read from ProjectContext when available
- Fallback to project_data if ProjectContext missing
- Field Mapping Service handles old → new name translation
- **Result**: Zero breaking changes to existing code

### Data Safety Guarantees
- Phase 1-6: No data modifications, additive only
- Phase 7-9: Reading from new source, old source unchanged
- Phase 10-11: Compatibility layer + verification
- Phase 12: Full backup + dry-run on staging before prod

---

## PART 5: EXECUTION CHECKLIST

### Before Starting
- [ ] Read through all 12 phases
- [ ] Understand ProjectContext concept
- [ ] Ensure staging environment available
- [ ] Backup production database

### Per Phase Checklist
- [ ] Create branch: `feature/data-consolidation-phase-X`
- [ ] Write code according to plan
- [ ] Run tests: `npm run test:unit -- [files]`
- [ ] Manual testing: Test feature in browser
- [ ] Code review: Get approval
- [ ] Commit with descriptive message
- [ ] Merge to develop
- [ ] Update progress document

### After All Phases
- [ ] All tests passing
- [ ] Staging data matches production structure
- [ ] Performance verified (<100ms)
- [ ] Documentation updated
- [ ] Team trained on new model
- [ ] Rollback procedure documented and tested
- [ ] Feature flag deployed
- [ ] Monitoring/alerts configured
- [ ] Deploy to production with feature flag disabled
- [ ] Enable feature flag for 10% of traffic
- [ ] Monitor for 48 hours
- [ ] Gradually roll out to 100%

---

## PART 6: KEY FILES TO CREATE/MODIFY

### New Files (Phase 1-3)
```
src/domain/models/ProjectContext.js
src/domain/repositories/ProjectContextRepository.js
src/shared/registry/fieldRegistry.js
src/shared/registry/fieldSchemas.js
src/composables/useFieldInheritance.js
src/composables/useMiniAppInheritedFields.js
```

### New Files (Phase 4-6)
```
src/services/migrations/onboardingToProjectContextMigration.js
src/services/fieldMappingService.js
src/services/dataIntegrityService.js
```

### Modified Files (Phase 7-9)
```
src/components/Project/ProjectForm.vue
src/components/Project/ProjectSetup.vue
src/application/stores/projectStore.js
src/application/stores/taskStore.js
src/components/TaskMiniApps/*/[25+ files]
```

### Database Changes
```sql
CREATE TABLE project_contexts (
  id UUID PRIMARY KEY,
  project_id UUID UNIQUE NOT NULL,
  user_id UUID NOT NULL,
  product_name TEXT,
  product_type TEXT,
  target_audience TEXT,
  primary_goal TEXT,
  target_timeline TEXT,
  marketing_budget NUMERIC,
  team_size TEXT,
  current_stage TEXT,
  tech_stack JSONB,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

ALTER TABLE project_data ADD COLUMN field_overrides JSONB;
```

---

## PART 7: RISK MITIGATION

### High Risk Areas & Mitigations

**Risk**: Data loss in migration
- **Mitigation**: Keep old data; verify integrity checks pass

**Risk**: Components break due to missing ProjectContext
- **Mitigation**: Fallback to project_data; Field Mapping Service

**Risk**: Performance degradation from extra queries
- **Mitigation**: Add indexes; test on staging; cache ProjectContext

**Risk**: Conflicts between old and new data
- **Mitigation**: Phase 11 integrity service; reconciliation tools

**Risk**: User confusion about inheritance
- **Mitigation**: Clear UI labeling; info boxes; documentation

### Rollback Procedure
1. If critical issues detected: Disable ProjectContext reads (feature flag)
2. Components fall back to project_data automatically
3. No data loss (ProjectContext records remain)
4. Investigate issue; fix; re-test on staging
5. Re-enable with canary deployment

---

## EXPECTED OUTCOMES

### Quantitative
- ✅ 85-95 → 45-50 data points (47% reduction)
- ✅ 10 duplicate groups → 0 (all consolidated)
- ✅ Query time < 100ms
- ✅ Test coverage > 90%
- ✅ 0 data loss
- ✅ 100% backward compatibility

### Qualitative
- ✅ Cleaner, more maintainable data model
- ✅ Single source of truth (ProjectContext)
- ✅ Consistent field definitions across app
- ✅ Better UX for field inheritance/overrides
- ✅ Improved reliability (integrity checks)
- ✅ Foundation for future features

---

## Next Steps

1. **Review & Approve**: Read through plan; identify concerns
2. **Adjust Timeline**: Fit phases into your available time
3. **Setup Tracking**: Create tickets for each phase
4. **Start Phase 1**: Create ProjectContext domain model
5. **Iterate**: Complete each phase; test; move to next

---

**Questions Before Starting?**
- Need clarification on any phase?
- Timeline constraints?
- Resource availability?
- Staging environment ready?
