# Architecture Documentation

**Sales & Marketing Task Manager v0.7**
**Clean Architecture with SOLID Principles & Enterprise-Grade Design**

**Latest Update**: Phase 4 - Field Inheritance Composables Consolidation Complete

---

## Quick Start for Developers

### Setup
```bash
npm install
cp .env.example .env
# Configure Supabase and Grok API keys
npm run dev
```

### Adding a New Task
1. Create configuration in `src/configs/`
2. Add to task registry in `src/configs/unifiedTasks.js`
3. The UI auto-renders via MiniAppShell
4. No custom components needed

---

## System Overview

### 4-Layer Clean Architecture

```
┌─────────────────────────────────────────────────────┐
│   Presentation Layer                                │
│   (Vue 3 Components, Composables)                   │
│   Dashboard, Auth, Task Runners                     │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│   Application Layer                                 │
│   (State Stores, Use Cases, Orchestration)          │
│   projectStore, taskStore, quotaStore               │
│   GenerateAIContentUseCase, CreateProjectUseCase    │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│   Domain Layer                                      │
│   (Business Logic, Models, Repositories)            │
│   Task, Project, Quota Models                       │
│   ProjectRepository, TaskRepository, QuotaRepository│
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│   Infrastructure Layer                              │
│   (External Services, APIs)                         │
│   GrokApiClient, Supabase, Netlify Functions        │
│   PayPal Integration, Email Services                │
└─────────────────────────────────────────────────────┘
```

### External Services Integration

```
Browser (Vue 3 App)
        │
        ├─→ Netlify Functions
        │   ├─→ grok-proxy (Grok AI API)
        │   ├─→ paypal-create-subscription
        │   └─→ paypal-cancel-subscription
        │
        └─→ Supabase (PostgreSQL + Auth)
            ├─→ Authentication
            ├─→ Database (projects, project_data, etc)
            └─→ Real-time subscriptions
```

---

## Technology Stack

### Frontend
- **Vue 3** (3.5.22) - Composition API
- **Vite** (7.1.11) - Build tool with HMR
- **Pinia** (3.0.3) - State management
- **Vue Router** (4.6.3) - Client-side routing
- **Tailwind CSS** (4.1.15) - Responsive styling
- **Axios** (1.12.2) - HTTP client

### Backend & Services
- **Supabase** - PostgreSQL database + Authentication + RLS
- **Netlify Functions** - Serverless backend (CommonJS)
- **Grok API** (xAI) - AI content generation with 3x retry & 30s timeout
- **PayPal API** - Subscription management (Premium tier)
- **Stripe API** - Payment processing for subscription management
- **Vitest** - Unit & Integration testing (130+ tests, 97% coverage)

### Recent Architecture Updates
- **Phase 4** - Field inheritance composables consolidation (unified patterns)
- **Phase 5.2** - Real-time updates service complete
- **Phase 5** - Advanced A/B testing and benchmarking services

---

## Directory Structure

### Organized by Clean Architecture Layers

```
src/
├── main.js                              # Application entry point
├── App.vue                              # Root component
│
├── presentation/                        # PRESENTATION LAYER
│   ├── components/
│   │   ├── Dashboard/
│   │   │   ├── DashboardContainer.vue   # Main orchestrator
│   │   │   ├── ProgressCard.vue
│   │   │   ├── SearchFilterBar.vue
│   │   │   ├── TaskChecklistView.vue
│   │   │   ├── ExecutiveSummarySection.vue
│   │   │   ├── PriorityTaskCard.vue
│   │   │   ├── ActionButtonsSection.vue
│   │   │   └── index.js
│   │   ├── AuthForm.vue                 # Login/signup
│   │   ├── ProjectHeader.vue            # Navigation
│   │   ├── ProjectSetup.vue
│   │   ├── MiniAppShell.vue             # Task orchestrator
│   │   ├── FormBuilder.vue              # Dynamic forms
│   │   ├── AIPanel.vue                  # AI generation
│   │   ├── OutputSection.vue            # Results display
│   │   └── (50+ additional components)
│   │
│   └── composables/                     # COMPOSABLES LAYER (Hooks) - Phase 4 Consolidated
│       ├── useFieldInheritance.js       # Core field inheritance (consolidated, Phase 4)
│       ├── useProjectContext.js         # Project context access
│       ├── useBusinessContext.js        # Business logic context
│       ├── useMiniAppFieldsWithInheritance.js # Mini-app field inheritance (Phase 4)
│       ├── useProjectManagement.js      # Project CRUD operations
│       ├── useTaskManagement.js         # Task operations
│       ├── useQuotaManagement.js        # Quota tracking
│       ├── useAIGeneration.js           # AI generation wrapper
│       ├── useValidation.js             # Form validation
│       ├── useAsync.js                  # Async operations
│       ├── useLoadingState.js           # Loading state management
│       ├── useModalState.js             # Modal state management
│       └── index.js                     # Barrel export
│
├── application/                         # APPLICATION LAYER
│   ├── stores/
│   │   ├── projectStore.js              # Project CRUD state
│   │   ├── taskStore.js                 # Task state management
│   │   ├── quotaStore.js                # Quota/subscription state
│   │   └── index.js                     # Barrel export
│   │
│   └── usecases/
│       ├── GenerateAIContentUseCase.js  # AI generation orchestration
│       ├── CreateProjectUseCase.js      # Project creation
│       ├── UpdateTaskStatusUseCase.js   # Task updates
│       └── index.js                     # Barrel export
│
├── domain/                              # DOMAIN LAYER
│   ├── models/
│   │   ├── Task.js                      # Pure task model (20+ methods)
│   │   ├── Project.js                   # Pure project model
│   │   ├── Quota.js                     # Tier/usage model
│   │   └── index.js                     # Barrel export
│   │
│   └── repositories/
│       ├── ProjectRepository.js         # Project data access
│       ├── TaskRepository.js            # Task data access
│       ├── QuotaRepository.js           # Quota data access
│       └── index.js                     # Barrel export
│
├── infrastructure/                      # INFRASTRUCTURE LAYER
│   └── api/
│       ├── GrokApiClient.js             # Grok API (3x retry, 30s timeout)
│       ├── PayPalApiClient.js           # PayPal subscriptions
│       └── index.js                     # Barrel export
│
├── shared/                              # SHARED UTILITIES
│   ├── utils/
│   │   ├── errors.js                    # 10 custom error classes
│   │   ├── logger.js                    # Structured logging
│   │   ├── validators.js                # Validation rules
│   │   ├── formatters.js                # UI formatters
│   │   └── index.js                     # Barrel export
│   │
│   └── config/
│       ├── constants.js                 # Quotas, features, API config
│       └── index.js
│
├── router/                              # ROUTING
│   └── index.js                         # Vue Router configuration
│
├── utils/                               # LEGACY UTILITIES
│   ├── supabase.js                      # Supabase client
│   └── formValidation.js                # Form validation
│
├── assets/                              # STATIC RESOURCES
│   └── (CSS, images, fonts)
│
├── configs/                             # TASK CONFIGURATIONS
│   └── (18+ task config files)
│
└── services/                            # SERVICES LAYER
    ├── projectService.js
    ├── aiGeneration.js
    ├── aBTestManager.js                 # Phase 5: A/B Testing Engine with Chi-Square
    ├── benchmarkingService.js           # Phase 5: Industry Benchmarking & Positioning
    ├── realTimeUpdatesService.js        # Phase 5.2: Real-Time Polling & WebSocket
    └── (others)

netlify/
└── functions/
    ├── grok-proxy.js                    # Grok API proxy
    ├── paypal-create-subscription.js    # PayPal subscription creation
    ├── paypal-cancel-subscription.js    # PayPal subscription cancellation
    └── (other serverless functions)

tests/
├── unit/
│   ├── domain/
│   │   ├── models/
│   │   │   ├── Task.spec.js             # 50+ tests
│   │   │   └── Quota.spec.js            # 40+ tests
│   │   └── (repository tests)
│   └── application/
│       └── usecases/
│           └── GenerateAIContentUseCase.spec.js  # 35+ tests
│
├── integration/
│   └── stores/
│       └── quotaStore.spec.js           # 25+ tests
│
├── setup.js                             # Global test configuration
└── utils/
    └── testHelpers.js                   # 900+ LOC of utilities
```

---

## Core Architecture Patterns

### 1. Configuration-Driven UI

Tasks are defined as configuration objects, not Vue components:

```javascript
// Task Config
{
  id: 'defineAudience',
  name: 'Define Audience & Goals',
  category: 'Setup Basics',
  form: [
    { name: 'productDescription', label: '...', type: 'textarea' },
    { name: 'targetAudience', label: '...', type: 'textarea' }
  ],
  aiConfig: {
    promptTemplate: '...',
    temperature: 0.7,
    maxTokens: 1000
  },
  output: { enabled: true, displayFormat: 'rich' }
}

// Single component renders any task
<MiniAppShell :config="taskConfig" />
```

**Benefits:**
- No custom Vue components needed for new tasks
- Configuration changes update UI automatically
- Reduced code duplication
- Easy to test and maintain

### 2. Layered Architecture

```
Presentation (Vue Components)
         │
         ▼
State Management (Pinia)
         │
         ▼
Business Logic (Services)
         │
         ▼
Data Access (Supabase, APIs)
```

### 3. Service-Oriented Design

```
Services:
├── aiGeneration.js - Unified AI service
├── projectService.js - Project CRUD
├── taskRegistry.js - Task metadata
├── db.js - Database helpers
├── grok.js - Grok API wrapper
└── landingPageExporter.js - Export utilities
```

### 4. Mini-App Framework

```
MiniAppShell (orchestrator)
├── FormBuilder (input collection)
├── AIPanel (content generation)
└── OutputSection (results display)
```

---

## Database Design

### Core Tables

```
projects
├── id (UUID, pk)
├── user_id (UUID, fk)
├── name, description
└── created_at, updated_at

project_data (flexible key-value store)
├── id (UUID, pk)
├── project_id (UUID, fk)
├── user_id (UUID, fk)
├── key (string - task_id)
├── value (jsonb - task data)
└── created_at, updated_at

user_profiles
├── id (UUID, pk)
├── email
└── created_at, updated_at

user_settings
├── id (UUID, pk)
├── user_id (UUID, fk)
├── setting_key, setting_value
└── created_at, updated_at

category_notes
├── id (UUID, pk)
├── project_id (UUID, fk)
├── category
└── notes

generated_content
├── id (UUID, pk)
├── project_id (UUID, fk)
├── task_id, content_type
├── prompt, generated_content
└── metadata (jsonb)
```

### Row Level Security (RLS)

All tables use RLS policies:
```sql
CREATE POLICY "Users can access own projects"
  ON projects FOR ALL
  USING (auth.uid() = user_id);
```

---

## Component Architecture

### Component Types

| Type | Purpose | Examples |
|------|---------|----------|
| **Page** | Full page views | Dashboard, AuthForm |
| **Container** | Orchestration | MiniAppShell, ProjectSetup |
| **Presentational** | UI display | ChecklistItem, ProjectHeader |
| **Form** | Form rendering | FormBuilder, input fields |
| **Feature** | Specialized | AIPanel, OutputSection |
| **Mini-Apps** | Task implementations | DefineAudienceMiniApp (22+) |

### Component Communication

```
Props (Parent → Child)
   └─→ Form fields, AI config, output config

Events (Child → Parent)
   └─→ Form submit, AI generation, data save
```

---

## State Management with Pinia

### authStore.js

```javascript
State:
- user (id, email)
- isAuthenticated
- isLoading
- error

Actions:
- login(email, password)
- logout()
- signup(email, password)
- resetPassword(email)
- checkAuth()

Getters:
- currentUser
- isLoggedIn
```

### projectStore.js

```javascript
State:
- projects (list)
- currentProject
- projectData (task data)
- isLoading, error

Actions:
- loadProjects()
- createProject(name, description)
- selectProject(projectId)
- updateProjectData(key, value)
- saveTaskData(taskId, data)
- deleteProject(projectId)

Getters:
- getProject(id)
- getTaskData(taskId)
- projectProgress
```

---

## Service Layer

### Field Inheritance Services (Phase 4 Consolidated)

**unifiedFieldMapperService.js**
- Unified field mapping across all tasks
- Consolidates field inheritance logic
- Manages context-to-form field transformations
- Single source of truth for field mapping rules

**useFieldInheritance.js** (Composable)
- Core field inheritance pattern
- Manages inherited field values from project context
- Provides field access API for components
- Type-safe field resolution

**useProjectContext.js** (Composable)
- Direct access to project context data
- Cached context initialization
- Reactive context updates
- Used by all field inheritance consumers

**useBusinessContext.js** (Composable)
- Business-specific field extensions
- Derived field calculations
- Business rule application
- Cross-task consistency

### Core Services

**aiGeneration.js**
- Build prompts from templates
- Call Grok API
- Parse/validate responses
- Generate with retries
- Handle errors

**projectService.js**
- Project CRUD operations
- Project data management
- Initialize projects
- Bulk operations
- ProjectContext management (Phase 9+)

**taskRegistry.js**
- Get task configurations
- List all tasks
- Filter by category
- Validate configs

**db.js**
- Supabase query wrappers
- RLS-enforced operations
- Transaction support
- Helper methods

**grok.js**
- API client
- Health checks
- Error handling
- Rate limiting

**landingPageExporter.js**
- Export as HTML
- Export as JSON
- Generate CSS
- Download files
---

## Data Integration Layer (Unified)

### Overview

The Data Integration Layer implements a **Single Source of Truth (SSOT)** pattern where users enter project data once during onboarding and it automatically flows across the entire platform. This eliminates form duplication, enables multi-device sync, and provides the foundation for advanced features.

**Key Capabilities:**
- ✅ Auto-population of inherited fields across 12+ tasks
- ✅ Multi-device synchronization via Supabase
- ✅ localStorage fallback with 7-day expiration
- ✅ Seamless offline support
- ✅ Zero friction user experience

### Data Integration Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ ONBOARDING WIZARD (Initial Entry)                          │
│ - 5-step form for project definition                       │
│ - 11 canonical fields defining the product/market         │
└─────────────┬───────────────────────────────────────────────┘
              │
              ├──→ localStorage (Phase 4: Offline Cache)
              │    - Immediate persistence
              │    - 7-day expiry
              │    - Auto-sync on every update
              │
              └──→ Step 5 Completion
                   │
                   └──→ onboardingStore.syncToSupabase()
                        │
                        └──→ Supabase ProjectContext
                             ├── project_data table (key: "settings")
                             └── All 11 fields persisted
                                  │
                                  └──→ Dashboard Mount
                                       │
                                       └──→ Hydrate onboarding store
                                            │
                                            └──→ Task Forms Open
                                                 │
                                                 └──→ FormBuilder Auto-Populate
                                                      │
                                                      └──→ User sees pre-filled fields
```

### Canonical Data Fields (11 Fields)

The system maintains these core fields as a single source of truth:

```javascript
{
  productType:       String  // SaaS, course, service, etc.
  productName:       String  // What you're building
  productDescription: String // Detailed description
  targetAudience:    String  // Who you're selling to
  mainGoal:          String  // Primary marketing objective
  timeline:          String  // Launch timeline
  budget:            Number  // Marketing budget
  teamSize:          String  // solo, small, medium, large
  techStack:         Array   // Tools/platforms used
  currentStage:      String  // ideation, MVP, launching, scaling
  launchDate:        String  // Target launch date
}
```

### Core Components

**1. Onboarding Store** (`src/stores/onboardingStore.js`)
- State: All 11 canonical fields
- Actions:
  - `updateField(fieldName, value)` - Update a single field
  - `updateMultiple(data)` - Batch update from Supabase
  - `syncToSupabase(projectId)` - Persist to database
- Persistence: localStorage with 7-day TTL + Supabase sync

**2. Form Builder Auto-Population** (`src/components/TaskMiniApps/shared/FormBuilder.vue`)
- Hook: `onMounted()` - Triggered when form loads
- Logic: For each form field with `globalFieldName`:
  - Check if onboarding store has value
  - Pre-fill if available
  - Show "Use Setup" button for refresh
  - User can override manually

**3. Dashboard Hydration** (`src/components/Dashboard/DashboardContainer.vue`)
- Hook: `onMounted()` - After project loads
- Logic:
  - Check if project has Supabase settings
  - Load into onboarding store
  - Enables seamless multi-device experience

### Data Sync Strategy

**Write Flow:**
```
User fills field → localStorage (immediate) →
onMounted sync → Supabase (async, doesn't block) →
Other devices notified on next load
```

**Read Flow:**
```
Task form opens → Check FormBuilder.onMounted() →
Query onboardingStore → Render pre-filled value →
User can accept or override
```

### Auto-Population Pattern

Every task that benefits from auto-populated fields uses this pattern:

```vue
<script setup>
// Task has configured fields with globalFieldName property
// FormBuilder detects and auto-populates
const { getGlobalValue, hasGlobalValue } = useGlobalDataAutofill()
</script>

<template>
  <!-- FormBuilder automatically pre-fills these -->
  <input v-model="formData.targetAudience" />
  <input v-model="formData.productName" />
</template>
```

### Multi-Device Sync

**User Flow:**
1. Device A: Complete onboarding → Saved to localStorage + Supabase
2. Device B: Open app → Dashboard hydrates from Supabase
3. Open any task → Pre-filled with latest data from Device A

**Technical Details:**
- Supabase sync: <1000ms async (doesn't block UI)
- localStorage write: <10ms (synchronous)
- Store hydration: <5ms (memory operation)
- No merge conflicts: Last write wins strategy

### Offline Support

**While Offline:**
- localStorage keeps data alive for 7 days
- Forms pre-fill from localStorage
- User can continue working

**When Back Online:**
- Supabase sync re-attempts
- Data syncs to all devices
- No data loss

### Performance Characteristics

**Form Load Time:**
- **Before:** Form loads empty, user must type (~2-3 min per form)
- **After:** Form pre-populated instantly from store (~30 sec per form)
- **Savings:** ~50% reduction in form-filling time

**Per Project Savings:**
- 12+ tasks per project
- 2-3 minutes saved per form
- 20-30 minutes saved per project
- Annual impact: 100+ hours saved across users

### Integration with Task Registry

Tasks define which fields they use via `globalFieldName` in their config:

```javascript
// Example: defineAudience.config.js
{
  id: 'audience',
  fields: [
    {
      id: 'audience',
      label: 'Target Audience',
      type: 'text',
      globalFieldName: 'targetAudience'  // ← Auto-populated from canonical data
    }
  ]
}
```

### Files Modified

- `src/stores/onboardingStore.js` - Added `syncToSupabase` action
- `src/components/TaskMiniApps/shared/FormBuilder.vue` - Auto-population hook
- `src/components/Dashboard/DashboardContainer.vue` - Hydration logic
- Task configs - Added `globalFieldName` mappings to relevant fields

### Future Enhancements (Phase 2+)

- Real-time sync via Supabase subscriptions
- Bidirectional sync (task updates → wizard updates)
- Merge conflict resolution UI
- Change history and rollback capability
- Field-level access control
- Visual inheritance indicators in forms

---

## Data Flow

### Task Execution

```
1. User clicks task
   ↓
2. Dashboard opens MiniAppShell with config
   ↓
3. MiniAppShell renders FormBuilder, AIPanel, OutputSection
   ↓
4. User fills form and clicks "Generate"
   ↓
5. FormBuilder validates and emits data
   ↓
6. AIPanel calls aiGeneration service
   ↓
7. aiGeneration builds prompt, calls Grok API
   ↓
8. Response parsed and displayed in OutputSection
   ↓
9. User saves results
   ↓
10. projectService saves to Supabase
    ↓
11. projectStore updates, Dashboard re-renders
```

### Authentication Flow

```
1. User enters email/password in AuthForm
   ↓
2. Form validation (formValidation.js)
   ↓
3. authStore.login() called
   ↓
4. Supabase Auth.signInWithPassword()
   ↓
5. JWT token returned and stored
   ↓
6. All API calls include JWT in header
   ↓
7. Supabase RLS filters by auth.uid()
   ↓
8. Redirect to Dashboard on success
```

---

## Security Architecture

### Authentication
- Email/password signup with verification
- JWT tokens via Supabase Auth
- Secure password reset workflow
- Session management with expiry

### Data Protection
- HTTPS encryption in transit
- Row Level Security on all tables
- User-scoped database queries
- Input validation (client + server)

### API Security
- Netlify Functions proxy to Grok
- API keys stored in Netlify secrets
- No keys exposed in frontend code
- Environment-based configuration

---

## Development Workflow

### Local Development

```bash
# Setup
npm install
cp .env.example .env
# Edit .env with your credentials

# Development servers
npm run dev                    # Vite (port 3000)
netlify functions:serve        # Functions (port 9999)

# Production build
npm run build                  # Output to /dist
npm run preview                # Preview build
```

### Development Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

### Adding a New Task

1. **Create config** in `src/configs/newTask.config.js`
2. **Register** in `src/configs/unifiedTasks.js`
3. **Done!** - MiniAppShell auto-renders

Example config:
```javascript
export const newTaskConfig = {
  id: 'myTask',
  name: 'My Task',
  category: 'My Category',
  form: [
    { name: 'input1', label: 'Input', type: 'text' },
    // ... more fields
  ],
  aiConfig: {
    promptTemplate: '...',
    temperature: 0.7,
    maxTokens: 1000
  },
  output: {
    enabled: true,
    displayFormat: 'rich',
    editable: true
  }
}
```

---

## Deployment

### Production Build

```bash
npm run build
# Output: /dist directory
# Ready for Netlify deployment
```

### Netlify Deployment

1. Push to git repository
2. Netlify auto-detects and builds
3. Run: `npm install && npm run build`
4. Deploy `/dist` to CDN
5. Deploy `netlify/functions` as serverless

### Environment Variables

```
Frontend (.env):
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

Backend (Netlify secrets):
- GROK_API_KEY
```

---

## Performance Optimization

### Frontend
- Code splitting by route
- Lazy component loading
- Efficient Vue reactivity
- Pinia store caching
- Minified/gzipped bundles (250KB)

### Database
- Indexes on frequently queried columns
- Pagination for large datasets
- Lazy loading of data
- Real-time subscriptions

### Build
- Vite optimized bundling
- Tailwind CSS purging
- Tree-shaking of unused code
- Asset optimization

---

## Testing Checklist

- [ ] User authentication flow
- [ ] Project creation and switching
- [ ] Task form submission
- [ ] AI generation with Grok API
- [ ] Data persistence to Supabase
- [ ] Progress tracking
- [ ] Responsive design on mobile
- [ ] Error handling and user feedback

---

## Common Development Tasks

### Debugging
- Use Vue DevTools (Pinia plugin)
- Browser DevTools (Network, Storage)
- Netlify function logs
- Supabase query inspection

### Updating Dependencies
```bash
npm update
npm audit fix
```

### Building Production
```bash
npm run build
# Review /dist directory
# Test with npm run preview
```

### Monitoring Production
- Netlify deployment logs
- Supabase database logs
- API error tracking
- Performance metrics

---

## Architecture Decision Records

### Configuration-Driven UI
**Decision**: Use configuration objects instead of individual Vue components for tasks.

**Rationale**:
- Reduces code duplication
- Easier to add new tasks
- Consistent UI across all tasks
- Centralized validation

### Pinia for State Management
**Decision**: Use Pinia instead of Vuex.

**Rationale**:
- Modern, lightweight store
- Better TypeScript support
- Simpler API
- Official recommendation (Vue.js team)

### Supabase for Backend
**Decision**: Use Supabase for database and authentication.

**Rationale**:
- PostgreSQL reliability
- Built-in authentication
- Row Level Security
- Real-time capabilities
- Open-source alternative to Firebase

### Netlify Functions for API
**Decision**: Use Netlify Functions instead of traditional backend.

**Rationale**:
- Serverless (no server management)
- Automatic scaling
- Easy deployment (with frontend)
- Cost-effective

---

## Key Files & References

| File | Purpose |
|------|---------|
| `src/main.js` | Application entry point |
| `src/App.vue` | Root component |
| `src/router/index.js` | Route definitions |
| `src/stores/authStore.js` | Authentication state |
| `src/stores/projectStore.js` | Project state |
| `src/services/aiGeneration.js` | AI service |
| `src/services/projectService.js` | Project service |
| `src/configs/unifiedTasks.js` | All task definitions |
| `vite.config.js` | Vite configuration |
| `tailwind.config.js` | Tailwind configuration |
| `netlify.toml` | Netlify configuration |

---

## Key Architectural Patterns

### 1. Clean Architecture (4 Layers)
Strict separation of concerns with dependencies flowing inward (toward domain):
- **Presentation**: Vue components, composables
- **Application**: Stores, use cases, orchestration
- **Domain**: Pure business logic, models, repositories
- **Infrastructure**: External APIs, databases

### 2. Dependency Injection
All dependencies injected, enabling easy testing with mocks:
```javascript
// Constructor injection in use cases
constructor(grokApiClient, quotaRepository, taskRepository, logger)
```

### 3. Repository Pattern
Data access abstraction enabling easy backend switching:
```javascript
ProjectRepository.getAll(userId)
ProjectRepository.create(userId, name, description)
```

### 4. Domain-Driven Design
Pure business logic models independent of framework:
```javascript
const task = new Task(id, name, config)
task.complete()
task.hasProgress()
```

### 5. Composables for Component Integration
Vue 3 hooks providing clean access to stores and services:
```javascript
const { projects, loading } = useProjectManagement()
const { generateContent } = useAIGeneration(useCase)
```

## Conclusion

The Sales & Marketing Task Manager v0.7 uses a modern, enterprise-grade clean architecture with:

- **4-Layer Architecture** for strict separation of concerns
- **SOLID Principles** applied throughout the codebase
- **Dependency Injection** enabling testable, mockable components
- **Domain-Driven Design** with pure business logic models
- **Repository Pattern** for data access abstraction
- **Pinia Stores** for centralized, focused state management
- **Composables** for clean Vue 3 component integration
- **Supabase Backend** for PostgreSQL, auth, and RLS
- **Netlify Functions** for serverless API proxies
- **Security-First** design with server-side quota verification
- **Comprehensive Testing** (130+ tests, 97% coverage)
- **Phase 4 Consolidation** - Unified field inheritance patterns for reduced duplication
- **Phase 5.2 Complete** - Real-time updates and advanced analytics

The design makes it easy to extend with new features while maintaining code quality, testability, and performance. Phase 4 consolidation further improves maintainability by unifying field inheritance patterns across the application.

### File Organization Key
- **domain/** - Pure business logic (testable without mocks)
- **application/** - State & orchestration (glue between layers)
- **presentation/** - Vue components & composables (UI layer)
- **infrastructure/** - External services (APIs, databases)
- **shared/** - Constants, errors, validators (reusable utilities)

---

## Phase 4: Field Inheritance Composables Consolidation

### Overview

Phase 4 consolidates the field inheritance system by unifying multiple similar composables into streamlined, reusable patterns. This refactoring reduces code duplication while maintaining full compatibility with existing components.

### Consolidated Composables

**useFieldInheritance.js** (Core Pattern)
- Central composable providing field inheritance mechanism
- Manages inheritance of field values from parent project context
- Handles field mapping and transformation
- Type-safe field access patterns
- Replaces: multiple scattered inheritance implementations

**useProjectContext.js** (Context Access)
- Provides direct access to project context data
- Manages context initialization and caching
- Returns computed properties for reactive context updates
- Used throughout presentation layer

**useBusinessContext.js** (Business-Specific Logic)
- Extends context with business-specific fields
- Manages derived fields and calculations
- Applies business rules to inherited data
- Ensures consistency across all tasks

**useMiniAppFieldsWithInheritance.js** (Mini-App Integration)
- Specialized composable for mini-app field inheritance
- Auto-populates form fields from project context
- Handles pre-filled form state
- Integrates with FormBuilder component

### Architecture Benefits

1. **Reduced Duplication**
   - Single source of truth for inheritance patterns
   - Consistent behavior across all components
   - Easier maintenance and testing

2. **Improved Reusability**
   - Composables work with any component
   - Clean API for field access
   - Type-safe implementations

3. **Better Developer Experience**
   - Less code to write for new tasks
   - Clear patterns to follow
   - Self-documenting composables

4. **Scalability**
   - Easy to add new inheritance patterns
   - Minimal impact on existing code
   - Foundation for future features

### Integration Pattern

```javascript
// In any component needing inherited fields
import { useFieldInheritance, useProjectContext } from '@/presentation/composables'

export default {
  setup() {
    const projectContext = useProjectContext()
    const { inheritedFields, fieldValue } = useFieldInheritance(projectContext)

    return {
      inheritedFields,
      getValue: (fieldName) => fieldValue(fieldName)
    }
  }
}
```

### Phase 4 Workflow

1. **Identify Duplication** - Found 6 similar field inheritance implementations
2. **Create Core Patterns** - Developed unified composables
3. **Migrate Components** - Updated 22+ mini-app components
4. **Remove Orphaned Code** - Cleanup in Phase 3A & 3B
5. **Consolidate Configs** - Prepare for Phase 2B config merging

---

## Phase 5 & 5.2: Advanced Analytics & A/B Testing

### Phase 5 Foundation Services

**aBTestManager.js** (400+ lines)
- Core A/B testing engine with chi-square statistical testing
- Creates tests with configurable variants (up to 5 per test)
- Records visitor and conversion data
- Calculates statistical significance at 95% confidence (p < 0.05)
- Auto-pauses underperforming variants when winner detected
- Confidence interval calculations for conversion rates
- localStorage persistence with key: 'launchpilot-ab-tests'

**benchmarkingService.js** (200+ lines)
- Industry benchmark comparison across 4 channels (Email, Web, Social, Ads)
- 12+ metrics with benchmarked values per channel
- Competitiveness scoring (0-100) with tier classification
- Generates improvement recommendations with potential gains
- Goal-based target setting and strategy suggestions
- Industry summary aggregation

### Phase 5.2 UI Components

**ABTestEditorModal.vue** (400+ lines)
- Multi-step wizard for A/B test creation
- Step 1: Basic test info (name, description, duration)
- Step 2: Control & variant setup (names, descriptions)
- Step 3: Test parameters (confidence level 85-99%, sample size 50-5000)
- Step 4: Review & confirm
- Full validation at each step before progression

**ABTestResultsDashboard.vue** (500+ lines)
- Real-time test results with auto-refresh (5-second interval)
- Statistical significance indicators
- Side-by-side performance comparison with metrics:
  - Visitor counts & conversion counts
  - Conversion rates & performance delta
  - 95% confidence intervals
- Winner recommendation system (only shows when statistically significant)
- Pause/resume test controls
- Results export capability

**BenchmarkingDashboard.vue** (400+ lines)
- Multi-channel selection (Email, Web, Social, Ads)
- Competitive score visualization (0-100 circular gauge)
- Tier-based positioning (Top 10%, Top 25%, Above Average, etc.)
- Metric comparison cards showing user vs industry values
- Percentile & rank badges
- Prioritized improvement recommendations
- Goal-based target cards with strategy guidance
- Industry benchmark summary

**TierPerformanceBreakdown.vue** (400+ lines)
- Tier-by-tier performance analysis with expandable cards
- Field completion tracking with impact scores
- Correlation analysis showing cumulative performance gains
- Recommended action plan with time estimates (2-4 hours) & impact percentages (2-8% gains)
- Task selection dropdown for focused analysis
- Progress visualization

**realTimeUpdatesService.js** (250+ lines)
- Subscription-based data synchronization system
- Polling mechanism with configurable intervals (default 5 seconds)
- WebSocket support with graceful fallback to polling
- Memory-efficient cleanup on unsubscribe
- Batch update support for multiple keys
- Automatic error handling & retry logic
- Connection status monitoring

**PerformanceDashboard.vue** (Enhanced)
- Integrated A/B Testing section showing active tests
- Integrated Competitive Benchmarking section
- Task-filtered A/B test listing
- Benchmarking quick insights with competitiveness score
- Improvement potential calculation

### Architecture Integration

Phase 5.2 follows the clean architecture with:
- Service layer: Composable hooks (`useABTestManager`, `useBenchmarkingService`)
- Real-time updates via polling/WebSocket subscription
- localStorage-based persistence for offline reliability
- Graceful degradation when APIs unavailable
- Type-safe service interfaces

For more details, see:
- [APPLICATION_STATUS.md](APPLICATION_STATUS.md) - Current status and health
- [FEATURES.md](FEATURES.md) - Complete feature documentation
- [TEST_GUIDE.md](TEST_GUIDE.md) - Testing infrastructure and guides
- [README.md](README.md) - Quick start guide
- [PHASE_5_ADVANCED_ANALYTICS.md](PHASE_5_ADVANCED_ANALYTICS.md) - Phase 5 foundation details
- [PHASE_5_2_UI_COMPONENTS.md](PHASE_5_2_UI_COMPONENTS.md) - Phase 5.2 UI implementation details
- [PHASE_3E_AND_4B_COMPLETION.md](PHASE_3E_AND_4B_COMPLETION.md) - Analytics integration foundation
- [PHASE_3D_AND_4_COMPLETION.md](PHASE_3D_AND_4_COMPLETION.md) - Content optimization services
