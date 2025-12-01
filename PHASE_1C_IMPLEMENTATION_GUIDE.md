# Phase 1C: Activate Inheritance in Top 10 Tasks - Implementation Guide

**Status:** Ready for implementation
**Completed Artifacts:**
- ✅ Task 1A: FieldWithInheritance.vue (350+ lines)
- ✅ Task 1B: FIELD_INHERITANCE_MAP.json (250+ lines)
- ✅ Task 1D: useProjectContextInjection.ts composable (300+ lines)
- ⏳ Task 1C: Awaiting field activation in configs and UnifiedTaskComponent

---

## Overview

Phase 1C activates field inheritance in the top 10 priority tasks. When activated, these tasks will:

1. **Auto-populate fields** from ProjectContext canonical values
2. **Show inheritance status** via colored badges (blue=inherited, yellow=override, purple=default)
3. **Allow overrides** for task-specific variations
4. **Reduce duplication** by 40-50% across all task entry

---

## Top 10 Priority Tasks (By Impact)

| Priority | Task ID | Task Name | Config File | Inheritance Fields |
|----------|---------|-----------|-------------|-------------------|
| 1 | sales-2 | High-Converting Offer Builder | offerBuilder.config.js | core_product→productName, customer_outcome→primaryGoal |
| 2 | growth-1 | Paid Ads Strategy | paidAds.config.js | product_positioning→productName, audience_targeting→targetAudience, primary_goal→primaryGoal, monthly_budget→marketingBudget, campaign_timeline→targetTimeline |
| 3 | growth-3 | Webinar Planning Checklist | webinar.config.js | product_name→productName, target_audience→targetAudience, primary_goal→primaryGoal, launch_date→targetTimeline |
| 4 | sales-5 | Sales Page Audit & Optimizer | salesPageAudit.config.js | product_price→marketingBudget |
| 5 | sales-3 | Cold Outreach Templates | coldOutreach.config.js | target_audience→targetAudience, product_description→productDescription, key_value_propositions→primaryGoal, campaign_duration→targetTimeline |
| 6 | sales-4 | Email Sales Sequence Builder | emailSequence.config.js | product_description→productDescription, audience_context→targetAudience, sequence_goal→primaryGoal |
| 7 | setup-2 | Landing Page Creator | landingPageCreatorAssistant.config.js | brand_name→productName, product_details→productDescription, target_audience_detail→targetAudience, main_benefit→primaryGoal |
| 8 | growth-2 | Community Engagement Strategy | communityPosts.config.js | audience_segment→targetAudience, key_messages→productDescription, engagement_goal→primaryGoal |
| 9 | growth-6 | Lead Magnet Ideas | leadMagnet.config.js | target_audience→targetAudience, product_positioning→productName, primary_goal→primaryGoal, budget_for_promotion→marketingBudget |
| 10 | growth-5 | Positioning & Messaging Map | positioningMap.config.js | product_description→productDescription, target_audience→targetAudience, primary_goal→primaryGoal, market_stage→currentStage |

---

## Implementation Strategy

### Step 1: Update FIELD_INHERITANCE_MAP.json (Already Done ✅)

The mapping document at `src/config/FIELD_INHERITANCE_MAP.json` already contains:
- All 10 canonical fields from ProjectContext
- Field mappings for top 10 tasks
- Inheritance rules
- Implementation priority

**No action needed** - this is complete.

### Step 2: Integration Points (3 locations to modify)

#### 2A: UnifiedTaskComponent.vue

Modify `src/components/UnifiedTaskComponent.vue` to:

1. **Import the composable and FieldWithInheritance component:**

```typescript
import { useProjectContextInjection } from '@/composables/useProjectContextInjection'
import FieldWithInheritance from '@/components/Form/FieldWithInheritance.vue'
import FIELD_INHERITANCE_MAP from '@/config/FIELD_INHERITANCE_MAP.json'
```

2. **In the template section**, wrap inherited fields with FieldWithInheritance:

```vue
<!-- Current form rendering loop -->
<div v-for="field in taskConfig.form" :key="field.id" class="form-group">
  <!-- Check if field should inherit -->
  <FieldWithInheritance
    v-if="shouldInherit(field.id)"
    :field-id="field.id"
    :label="field.label"
    :description="field.description"
    :value="getFieldValue(field.id)"
    :inheritance-info="getInheritanceInfo(field.id)"
    :is-required="field.required"
    :display-value="getDisplayValue(field.id)"
    @toggle-override="handleToggleOverride"
    @sync-from-source="handleSyncFromSource"
  >
    <!-- Render actual form field inside slot -->
    <input
      v-if="field.type === 'text'"
      :id="field.id"
      :value="getFieldValue(field.id)"
      @input="updateField(field.id, $event.target.value)"
      class="form-input"
    />
  </FieldWithInheritance>

  <!-- Fallback for non-inherited fields -->
  <div v-else class="form-group">
    <!-- Existing form field rendering -->
  </div>
</div>
```

3. **In the script section**, add composition logic:

```typescript
const projectStore = useProjectStore()
const injector = useProjectContextInjection(
  props.taskId,
  taskConfig.value?.form || [],
  getMappingsForTask(props.taskId)
)

const shouldInherit = (fieldId: string) => {
  const mapping = getMappingForField(fieldId)
  return !!mapping && !!FIELD_INHERITANCE_MAP.task_field_mappings[props.taskId]
}

const getFieldValue = (fieldId: string) => {
  return injector.getFieldValue(fieldId).value
}

const getInheritanceInfo = (fieldId: string) => {
  return injector.buildInheritanceInfo(fieldId, formData[fieldId])
}

const handleToggleOverride = (fieldId: string) => {
  injector.toggleOverride(fieldId, formData[fieldId])
}

const handleSyncFromSource = (fieldId: string) => {
  injector.syncFromSource(fieldId)
}
```

#### 2B: Task Config Files (10 files)

Add inheritance metadata to each task config's form field definitions:

```javascript
// Example: offerBuilder.config.js
export const offerBuilderTask = {
  // ... existing config ...
  form: [
    {
      id: 'core_product',
      type: 'textarea',
      label: 'What\'s Your Core Product?',
      // ADD THIS:
      inherit_from: 'productName',  // Maps to canonical field
      inherit_source: 'projectContext', // Where to inherit from
      // ... rest of field config ...
    },
    // ... other fields ...
  ]
}
```

**For each of the 10 task configs**, add `inherit_from` to fields that appear in FIELD_INHERITANCE_MAP.json.

#### 2C: Pinia Store (projectStore)

Ensure projectStore has proper sync method:

```typescript
// In src/stores/projectStore.ts
import { defineStore } from 'pinia'

export const useProjectStore = defineStore('project', () => {
  // Existing state...
  const projectData = reactive({
    projectContext: {},
    taskData: {}
  })

  // ADD THIS METHOD:
  const updateProjectData = (newData: any) => {
    Object.assign(projectData, newData)
    // Optional: Persist to localStorage
    localStorage.setItem('launchpilot-project-data', JSON.stringify(projectData))
  }

  return {
    projectData,
    updateProjectData,
    // ... other methods ...
  }
})
```

### Step 3: Activation Sequence

**For each of the 10 priority tasks**, perform these steps:

#### Task 1: High-Converting Offer Builder (sales-2)

1. Edit `src/configs/offerBuilder.config.js`
2. Add inheritance mappings to fields:
   - `core_product` → inherit from `projectName`
   - `customer_outcome` → inherit from `primaryGoal`
3. Update UnifiedTaskComponent to recognize this task has inheritance
4. Test in UI: Open task, verify inherited values populate automatically

#### Task 2: Paid Ads Strategy (growth-1)

1. Edit `src/configs/paidAds.config.js`
2. Add inheritance mappings:
   - `product_positioning` → productName
   - `audience_targeting` → targetAudience
   - `primary_goal` → primaryGoal
   - `monthly_budget` → marketingBudget
   - `campaign_timeline` → targetTimeline
3. Test all 5 fields auto-populate

#### Task 3-10: Repeat for remaining 8 tasks

Same pattern - identify fields in FIELD_INHERITANCE_MAP, add `inherit_from` metadata, test.

### Step 4: Testing Checklist

For each activated task:

- [ ] Task opens without errors
- [ ] Inherited fields show blue "Inherited from Project Context" badge
- [ ] Inherited values populate from previous entries
- [ ] User can click "Override" to create task-specific variation
- [ ] Override badge changes to yellow "Custom override"
- [ ] User can click "Revert" to sync back to inherited value
- [ ] Overrides persist when task is saved and reopened
- [ ] Form data saved correctly to projectStore

### Step 5: Performance Considerations

1. **Lazy load mappings**: Load FIELD_INHERITANCE_MAP only in UnifiedTaskComponent
2. **Cache inheritance info**: Don't recalculate on every render
3. **Debounce updates**: When syncing changes to ProjectContext, debounce to avoid excessive updates
4. **Monitor localStorage**: Inherited data stored locally may grow large with many tasks

---

## Key Files to Modify

### Must Modify (Core Implementation)
- [ ] `src/components/UnifiedTaskComponent.vue` - Main form renderer
- [ ] `src/components/Form/FieldWithInheritance.vue` - Already exists ✅
- [ ] `src/composables/useProjectContextInjection.ts` - Already exists ✅
- [ ] `src/config/FIELD_INHERITANCE_MAP.json` - Already exists ✅

### Config Files to Update (10 total)
- [ ] `src/configs/offerBuilder.config.js`
- [ ] `src/configs/paidAds.config.js`
- [ ] `src/configs/webinar.config.js`
- [ ] `src/configs/salesPageAudit.config.js`
- [ ] `src/configs/coldOutreach.config.js`
- [ ] `src/configs/emailSequence.config.js`
- [ ] `src/configs/landingPageCreatorAssistant.config.js`
- [ ] `src/configs/communityPosts.config.js`
- [ ] `src/configs/leadMagnet.config.js`
- [ ] `src/configs/positioningMap.config.js`

### Store Updates
- [ ] `src/stores/projectStore.ts` - Add updateProjectData method (if not exists)

---

## Expected Outcomes

**After Phase 1C completion:**

✅ Top 10 tasks have field inheritance activated
✅ Users see inherited values automatically populate
✅ 40-50% reduction in form duplication
✅ Task workflows faster - less re-entry of same data
✅ Network effects start - each task enriches data for others
✅ Foundation laid for Phase 2 (Task Dependency Graph)

**User Experience:**
- User fills out "Offer Builder" task with productName, targetAudience, primaryGoal
- User opens "Paid Ads Strategy" task
- It automatically shows productName, targetAudience, primaryGoal from previous entry
- User can override if needed for this specific task
- User opens "Email Sequence Builder" - same automatic population
- Data flows through the system reducing friction

---

## Time Estimate

**Total time for Phase 1C: 2-4 hours**
- UnifiedTaskComponent integration: 1 hour
- Update 10 config files: 1-2 hours (10-15 min each)
- Testing and bug fixes: 30 min - 1 hour
- Documentation updates: 15-30 min

---

## Next Phase

After 1C completion, proceed to **Phase 2: Task Dependency Graph**
- Analyze which tasks depend on which data
- Show "Next logical task" suggestions
- Enable smart task recommendations
- Build task sequencing system

---

## Troubleshooting

**Problem:** Inherited values not showing in form
**Solution:** Check `shouldInherit()` logic, verify field mappings in FIELD_INHERITANCE_MAP

**Problem:** Override button not working
**Solution:** Verify FieldWithInheritance component emits events correctly, check event handler binding

**Problem:** Data not persisting between sessions
**Solution:** Ensure localStorage persistence in useProjectContextInjection composable

**Problem:** Performance slow with many overrides
**Solution:** Implement debouncing in syncToProjectContext, consider moving from localStorage to IndexedDB

---

**Document prepared for Phase 1C implementation**
**Created:** 2025-11-30
**Status:** Ready for next phase
