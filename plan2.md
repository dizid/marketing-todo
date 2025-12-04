# Roadmap View Feature Implementation Plan

## Overview
Implement a visual roadmap modal that displays all 4 strategic phases of the sales growth system (Discovery → Conversion → Execution → Optimization) with task progress tracking, enabling users to see their position in the journey and navigate to any task across phases.

**Trigger:** "View Roadmap" button in NextTaskCard component
**Current Status:** Button only logs "[Task DNA] Roadmap view requested - implement in v1.1"
**Target:** Fully functional roadmap modal with phase visualization and task navigation

---

## Current Implementation Status

### Button Locations
1. **NextTaskCard.vue** (Line 55) - Component rendering the "View Roadmap" button
2. **DashboardContainer.vue** (Line 557) - Handler that logs the request

### Existing Modal Pattern
The app uses a consistent modal pattern implemented in:
- TaskModal.vue
- AddTasksModal.vue
- StripePaymentModal.vue

**Pattern characteristics:**
- Fixed overlay with semi-transparent backdrop (bg-black/50)
- Z-index: 50
- Centered layout on desktop, full-height on mobile
- Close button (✕) in top-right
- Click on backdrop to dismiss
- Tailwind CSS styling

---

## Implementation Architecture

### 1. Create RoadmapModal Component
**File:** `/src/components/TaskRecommendation/RoadmapModal.vue`

#### Purpose
Display all 4 phases with visual progress, completed tasks, and available tasks

#### Component Structure
```
RoadmapModal
├── Header
│   ├── Title: "Your Sales Growth Roadmap"
│   └── Close Button (✕)
├── Content (Scrollable)
│   ├── Phase 1: Discovery
│   │   ├── Phase header with progress
│   │   ├── Completed tasks section
│   │   └── Available tasks section
│   ├── Phase 2: Conversion
│   │   ├── Phase header with progress
│   │   ├── Completed tasks section
│   │   └── Available tasks section
│   ├── Phase 3: Execution
│   │   ├── Phase header with progress
│   │   ├── Completed tasks section
│   │   └── Available tasks section
│   └── Phase 4: Optimization
│       ├── Phase header with progress
│       ├── Completed tasks section
│       └── Available tasks section
└── Footer (Optional - for close/help)
```

#### Props
```javascript
{
  isOpen: Boolean,                    // Modal visibility
  taskRecommendation: Object,         // Current recommendation with phase data
  completedTasks: Array,              // Array of completed task IDs
  currentPhase: String                // Current phase name
}
```

#### Emits
```javascript
{
  'close': void,                      // Close modal
  'task-selected': { taskId }        // User clicked a task
}
```

#### Key Features
- **Phase Cards** - Grid layout (4 columns desktop, stacked mobile)
- **Progress Bars** - Visual indicator of completion (X/Y tasks)
- **Task Lists** - Separate sections for completed (✓ checkmark) and available tasks
- **Current Phase Indicator** - Visual highlight/badge for user's current phase
- **Interactive Tasks** - Click task to open/start it
- **Responsive** - Full-height on mobile, max-width centered on desktop
- **Color Coding** - Each phase has a distinct color (Discovery, Conversion, Execution, Optimization)

#### Layout Variations
**Desktop (≥1024px):**
- 4 columns equal width
- Horizontal phase flow
- Side-by-side task comparisons

**Tablet (768px-1023px):**
- 2 columns
- Phases in 2x2 grid

**Mobile (<768px):**
- Single column
- Full-width cards
- Stacked phases

---

### 2. Update DashboardContainer
**File:** `/src/components/Dashboard/DashboardContainer.vue`

#### Changes Required

**A. Add state variable:**
```javascript
const showRoadmapModal = ref(false)
```

**B. Update handler:**
Replace:
```javascript
const handleViewRoadmap = () => {
  console.log('[Task DNA] Roadmap view requested - implement in v1.1')
}
```

With:
```javascript
const handleViewRoadmap = () => {
  showRoadmapModal.value = true
}
```

**C. Add component to template:**
```vue
<RoadmapModal
  :is-open="showRoadmapModal"
  :task-recommendation="taskRecommendation"
  :completed-tasks="completedTasks"
  :current-phase="currentPhase"
  @close="showRoadmapModal = false"
  @task-selected="handleTaskOpened"
/>
```

**D. Import component:**
```javascript
import RoadmapModal from '@/components/TaskRecommendation/RoadmapModal.vue'
```

#### Integration Points
- Use existing `handleTaskOpened()` method when task selected
- Use existing `taskRecommendation` from store
- Use existing `completedTasks` tracking
- Maintain consistency with TaskModal behavior

---

### 3. Data Source & Structure

#### From TaskRecommendationEngine
The `taskRecommendationEngine.js` provides:
- Phase information via `TASK_DEPENDENCY_MAP`
- Task completion status
- Phase progress calculations
- Available tasks for each phase

#### From ProjectStore
The `projectStore` provides:
- `taskRecommendation` - Current recommendation data
- `completedTasks` - Array of completed task IDs
- `userProfile` - User context (stage, product type)

#### TASK_DEPENDENCY_MAP Structure
```json
{
  "Phase_1_Discovery": {
    "phaseName": "Discovery",
    "phaseGoal": "Define your market position",
    "tasks": [
      {
        "taskId": "positioning-messaging-map",
        "name": "Positioning & Messaging Map",
        "description": "...",
        "dependencies": []
      },
      ...
    ]
  },
  ...
}
```

---

## Phase Task Breakdown

### Phase 1: Discovery (3 tasks)
- Positioning & Messaging Map
- Audience Research
- Competitor Intelligence

### Phase 2: Conversion (6 tasks)
- Lead Magnet Ideas
- High-Converting Offer Builder
- Sales Page Audit & Optimizer
- Email Sales Sequence Builder
- Cold Outreach Templates
- Sales Objection Handler

### Phase 3: Execution (8 tasks)
- A/B Test Idea Generator
- Blog Post Generator
- Create Email Newsletter
- Social Media Content Plan
- Webinar Planning Checklist
- Community Engagement Strategy
- Paid Ads Strategy
- Landing Page Creator

### Phase 4: Optimization (TBD)
- (Defined in TASK_DEPENDENCY_MAP)

---

## UI/UX Design Details

### Color Scheme (Tailwind)
- **Discovery:** `bg-blue-50` border-blue-200 → `text-blue-600` (Exploration)
- **Conversion:** `bg-purple-50` border-purple-200 → `text-purple-600` (Persuasion)
- **Execution:** `bg-green-50` border-green-200 → `text-green-600` (Action)
- **Optimization:** `bg-orange-50` border-orange-200 → `text-orange-600` (Refinement)

### Task Item States
- **Completed:** Checkmark ✓, lighter text (opacity-60), strikethrough optional
- **Available:** Full opacity, clickable (hover effect)
- **Locked:** Disabled appearance (opacity-50, no cursor)

### Progress Indicators
- **Progress Bar:** `bg-gray-200` with colored fill based on phase
- **Task Count:** Bold number (e.g., "2/6 tasks completed")
- **Current Phase Badge:** Glowing border or highlight effect

### Interactions
- **Hover on task:** Subtle background color, cursor pointer
- **Click on task:** Trigger 'task-selected' event → Close roadmap → Open TaskModal
- **Click backdrop:** Close modal
- **Click close button:** Close modal

---

## Implementation Steps

### Step 1: Create RoadmapModal Component
1. Create file `/src/components/TaskRecommendation/RoadmapModal.vue`
2. Implement modal structure (header, content, footer)
3. Add phase iteration logic
4. Build phase card component (reusable)
5. Build task item component (reusable)
6. Add progress calculation logic
7. Add Tailwind styling and responsive classes
8. Implement event emitters

### Step 2: Implement Data Display
1. Map TASK_DEPENDENCY_MAP data to component props
2. Filter completed vs. available tasks
3. Calculate progress for each phase
4. Identify and highlight current phase
5. Sort tasks logically within each phase

### Step 3: Wire Up Interactions
1. Implement task click handlers
2. Emit 'task-selected' event with task ID
3. Hook into DashboardContainer's `handleTaskOpened()`
4. Ensure TaskModal opens with correct task

### Step 4: Update DashboardContainer
1. Import RoadmapModal component
2. Add `showRoadmapModal` state
3. Update `handleViewRoadmap()` method
4. Add `<RoadmapModal>` to template
5. Test modal opening/closing

### Step 5: Styling & Polish
1. Apply color-coding to phases
2. Add animations for modal entrance/exit
3. Add hover effects for interactivity
4. Test responsive behavior
5. Verify accessibility (ARIA labels, keyboard navigation)

### Step 6: Testing
1. Unit tests for data calculations
2. Component rendering tests
3. Interaction tests (click, close, task selection)
4. Responsive design tests (mobile, tablet, desktop)
5. Integration tests with DashboardContainer

---

## Success Criteria

- [x] Plan document created
- [ ] RoadmapModal component created with all 4 phases displayed
- [ ] Phase cards show accurate task counts and progress
- [ ] Completed tasks visually distinguished from available tasks
- [ ] Current phase is highlighted/indicated
- [ ] Clicking a task opens that task in TaskModal
- [ ] Modal opens when "View Roadmap" button clicked
- [ ] Modal closes on backdrop click, close button, or task selection
- [ ] Responsive design works on mobile, tablet, desktop
- [ ] Consistent styling with existing modals
- [ ] No console errors or warnings
- [ ] User can see their position in the 4-phase journey
- [ ] User can navigate to any available task from the roadmap

---

## Dependencies & Technologies

- **Vue 3** - Component framework (Composition API)
- **Tailwind CSS** - Styling
- **Pinia** - State management (projectStore)
- **TASK_DEPENDENCY_MAP.json** - Phase and task definitions
- **taskRecommendationEngine.js** - Business logic

---

## Related Files

**Files to modify:**
- `/src/components/Dashboard/DashboardContainer.vue` - Add modal and handler

**Files to create:**
- `/src/components/TaskRecommendation/RoadmapModal.vue` - New modal component

**Files to reference:**
- `/src/data/TASK_DEPENDENCY_MAP.json` - Phase structure
- `/src/components/TaskModal.vue` - Modal pattern reference
- `/src/components/TaskRecommendation/NextTaskCard.vue` - Button location
- `/src/services/taskRecommendationEngine.js` - Data logic
- `/src/stores/projectStore.js` - State management

---

## Timeline Estimate (Once Plan Approved)

- Create RoadmapModal component: ~45 min
- Implement data display logic: ~30 min
- Wire up interactions: ~20 min
- Update DashboardContainer: ~15 min
- Styling & responsive design: ~30 min
- Testing & debugging: ~30 min
- **Total: ~2.5 hours**

---

## Notes

- The roadmap should be read-only display with clickable task links (not editable)
- Future enhancement: Add filters (by status, category, etc.)
- Future enhancement: Add drag-drop task reordering (if applicable)
- Consider adding a "Collapse/Expand" for each phase to reduce scrolling on mobile
- Could add estimated time to complete each task as a future feature
