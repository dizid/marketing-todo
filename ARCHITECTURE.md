# Sales & Marketing Task Manager - Architecture Guide

## Overview

This is a **configuration-driven task management application** for managing marketing and sales workflows. Built with Vue 3, Vite, Pinia, and Supabase, it uses a unified, scalable architecture where tasks are defined as JSON configurations rather than individual Vue components.

### Tech Stack

- **Frontend**: Vue 3 (Composition API)
- **Build Tool**: Vite 7.1.11
- **State Management**: Pinia 3.0.3
- **Routing**: Vue Router 4.6.3
- **Styling**: Tailwind CSS 4.1.15
- **Database**: Supabase (PostgreSQL)
- **AI API**: Grok 2 (via Netlify proxy)
- **Target**: ES Next

---

## Architecture Principles

### 1. **Configuration-Driven UI**
- Tasks are defined as JavaScript objects with a standardized schema
- A single `UnifiedTaskComponent` or `MiniAppShell` renders any task from its config
- **Benefit**: Adding new tasks requires only JSON config, no Vue component coding needed

### 2. **Separation of Concerns**
- **Components**: Presentational layer (MiniAppShell, FormBuilder, AIPanel, OutputSection)
- **Services**: Business logic (aiGeneration, projectService, taskRegistry)
- **State**: Pinia stores (projectStore, authStore)
- **Utils**: Reusable functions (formValidation, supabase client)

### 3. **Mini-App Framework**
- Reusable orchestration pattern via `MiniAppShell`
- Composes: FormBuilder (input), AIPanel (generation), OutputSection (results)
- Each mini-app wraps task configuration + adds custom logic if needed

### 4. **Validation Centralization**
- All form validation in `src/utils/formValidation.js`
- Schema-driven validation from field definitions
- Consistent error messages across all tasks

### 5. **AI Generation Abstraction**
- Unified `generateAIContent()` service in `src/services/aiGeneration.js`
- Handles: prompt building, template substitution, API calls, response parsing
- Extensible for future AI models

---

## Directory Structure

```
/src
├── /assets              # Static assets (images, fonts, etc.)
├── /components          # Vue components
│   ├── Dashboard.vue                    # Main app view
│   ├── UnifiedTaskComponent.vue          # Universal task renderer (legacy)
│   ├── /Task
│   │   ├── TaskModal.vue                # Task container modal
│   │   ├── /Forms                       # Legacy form components (deprecated)
│   │   └── /Generate                    # Legacy generation components (deprecated)
│   └── /TaskMiniApps                    # New mini-app framework
│       ├── /core
│       │   ├── MiniAppShell.vue         # Orchestrator component
│       │   └── miniAppRegistry.js       # Mini-app registry & routing
│       ├── /shared
│       │   ├── FormBuilder.vue          # Dynamic form field renderer
│       │   ├── AIPanel.vue              # AI generation interface
│       │   └── OutputSection.vue        # Results display & management
│       ├── /configs
│       │   ├── defineAudience.config.js # Task config (setup-1)
│       │   ├── generatePosts.config.js  # Task config (social-1)
│       │   └── [taskId].config.js       # ... 19 more configs
│       └── /[TaskNameMiniApp].vue       # Mini-app wrapper components (19 files)
├── /configs
│   └── unifiedTasks.js                  # All 21 task definitions (being migrated)
├── /schemas
│   └── taskConfigSchema.js              # Task configuration schema documentation
├── /services
│   ├── aiGeneration.js                  # Unified AI generation service
│   ├── taskRegistry.js                  # Task metadata & component mapping
│   ├── projectService.js                # Project CRUD operations
│   ├── grok.js                          # Grok API wrapper
│   └── db.js                            # Database helpers
├── /stores
│   ├── authStore.js                     # Authentication state (Pinia)
│   └── projectStore.js                  # Project & task state (Pinia)
├── /utils
│   ├── formValidation.js                # Centralized validation functions
│   └── supabase.js                      # Supabase client configuration
├── /router
│   └── index.js                         # Vue Router configuration
└── main.js                              # Application entry point
```

---

## Data Flow

### Task Execution Flow

```
User View
    ↓
MiniAppShell (Orchestrator)
    ├─→ FormBuilder (User Input)
    │   └─→ formValidation (Validation)
    │
    ├─→ AIPanel (Generation)
    │   └─→ aiGeneration Service
    │       ├─→ buildPrompt (Template substitution)
    │       └─→ callGrokAPI (API call)
    │
    └─→ OutputSection (Results Display)
        ↓
    projectStore (Auto-save to Pinia)
        ↓
    Supabase (Persist to database)
```

### Form Data → AI → Output

1. **Form Input** → FormBuilder renders fields from task config
2. **Validation** → formValidation.js validates against schema
3. **Generation** → AIPanel calls `generateAIContent(config, formData)`
4. **Prompt Building** → Template variables replaced with form data + context
5. **API Call** → Grok API via Netlify proxy (grok-proxy.js)
6. **Response Parsing** → Custom parser from config transforms raw response
7. **Output Display** → OutputSection shows parsed results
8. **Persistence** → Saved via projectStore → Supabase

---

## Task Definition System

### Configuration Schema

Every task follows this structure (simplified):

```javascript
export const taskNameTask = {
  // Identification
  id: 'task-id',                    // Unique identifier
  name: 'Display Name',             // User-facing name
  description: 'Task description',  // Help text
  category: 'setup|social|etc',     // Category grouping

  // Form Fields
  form: [
    {
      id: 'field_id',               // Used in data model
      type: 'text|textarea|number|select|checkboxes|radio',
      label: 'Field Label',
      placeholder: 'Help text',
      description: 'Additional help',
      required: true,
      // Type-specific options:
      rows: 3,                       // For textarea
      min: 1, max: 10,               // For number
      options: [                     // For select/checkboxes/radio
        { value: 'val', label: 'Label' }
      ],
      validate: (value) => true|'Error message'  // Custom validation
    }
  ],

  // AI Generation Configuration
  ai: {
    promptTemplate: 'Based on {field_id}...',    // Template with placeholders
    temperature: 0.8,               // 0-1 (higher = more creative)
    maxTokens: 2000,                // Max response length

    // Optional: Add context from elsewhere
    contextProvider: () => ({
      app_description: 'From localStorage',
      company_name: 'From global state'
    }),

    // Optional: Transform raw response into structured data
    parseResponse: (raw) => {
      // Parse raw AI text into objects/arrays
      return parsedData
    },

    // Optional: Validate parsed response
    validateResponse: (parsed) => true|'Error'
  },

  // Output/Results Configuration
  output: {
    enabled: true,                  // Show results section?
    exportFilename: 'filename',     // For CSV/JSON export
    displayFormat: 'text|list|table|custom'  // How to display
  }
}
```

### All 21 Tasks (By Category)

**Setup** (5 tasks):
- `setup-1`: Define Target Audience
- `setup-2`: Define Goals
- `setup-3`: Setup Integrations
- `setup-4`: Prepare Assets
- `setup-5`: Setup Tracking

**Social** (3 tasks):
- `social-1`: Generate Social Media Posts
- `social-2`: Engage Followers
- `social-3`: Generate Giveaway Content

**Content** (3 tasks):
- `content-1`: Generate Blog Post
- `content-2`: Generate Video Script
- `content-3`: Generate Graphics Prompts

**Acquisition** (3 tasks):
- `acq-1`: (Not yet implemented)
- `acq-2`: Generate Outreach Message
- `acq-3`: Generate Webinar Content

**Feedback** (3 tasks):
- `feedback-1`: Collect Feedback
- `feedback-2`: Publish Updates
- `feedback-3`: Iterate Features

**Analytics** (3 tasks):
- `analytics-1`: Setup Analytics
- `analytics-2`: Optimize Channels
- `analytics-3`: Review ROI

---

## Mini-App Framework

### How to Create a New Mini-App

**Step 1: Create Config** (`src/components/TaskMiniApps/configs/[taskId].config.js`)

```javascript
export const [taskId]Config = {
  id: 'task-id',
  title: 'Task Name',
  description: 'Task description',

  formFields: [ /* field definitions */ ],
  aiConfig: { /* AI configuration */ },
  showOutput: true,
  exportFilename: 'filename'
}
```

**Step 2: Create Mini-App Wrapper** (`src/components/TaskMiniApps/[TaskNameMiniApp].vue`)

```vue
<template>
  <MiniAppShell :task-config="config" :task-data="taskData" @save="saveTask" />
</template>

<script setup>
import { computed } from 'vue'
import { useProjectStore } from '../../stores/projectStore'
import MiniAppShell from './core/MiniAppShell.vue'
import { taskIdConfig } from './configs/[taskId].config'

const store = useProjectStore()
const config = computed(() => taskIdConfig)
const taskData = computed(() => store.getTaskData('task-id') || {})

const saveTask = (data) => {
  store.saveTaskData('task-id', data)
}
</script>
```

**Step 3: Register Mini-App** (`src/components/TaskMiniApps/core/miniAppRegistry.js`)

```javascript
import [TaskNameMiniApp] from '../[TaskNameMiniApp].vue'

export const miniAppRegistry = {
  'task-id': [TaskNameMiniApp],
  // ... other mini-apps
}
```

**Step 4: Update Task Registry** (`src/services/taskRegistry.js`)

```javascript
export function getTaskComponent(taskId) {
  const miniAppComponent = miniAppRegistry[taskId]
  if (miniAppComponent) {
    return miniAppComponent
  }
  // Fall back to legacy system
  return componentMap[taskId]
}
```

---

## Key Components

### MiniAppShell (`src/components/TaskMiniApps/core/MiniAppShell.vue`)

Orchestrates the entire task workflow:
- **FormBuilder** for input
- **AIPanel** for generation
- **OutputSection** for results
- Auto-saves to store via watch watchers

**Props:**
- `taskConfig` (Object, required) - Task configuration
- `taskData` (Object) - Saved task data

**Emits:**
- `save` - Data changed, propagate to store

### FormBuilder (`src/components/TaskMiniApps/shared/FormBuilder.vue`)

Dynamic form field renderer:
- Renders all field types from config
- Built-in validation
- Real-time data binding

**Props:**
- `title` (String) - Form section title
- `fields` (Array) - Field definitions
- `initialData` (Object) - Pre-filled values

**Emits:**
- `update:data` - Form data changed

### AIPanel (`src/components/TaskMiniApps/shared/AIPanel.vue`)

AI generation interface:
- Generate button with progress indicator
- Displays generated output
- Copy to clipboard, use/save buttons
- Error handling and recovery

**Props:**
- `isValid` (Boolean) - Is form valid?
- `generateFn` (Function, required) - Function to call for generation

**Emits:**
- `output` - AI output received
- `use` - User clicked "Use This"

### OutputSection (`src/components/TaskMiniApps/shared/OutputSection.vue`)

Results display and management:
- Lists saved outputs
- Edit/delete individual items
- Export to CSV/JSON
- Clear all button

**Props:**
- `items` (Array) - Saved output items
- `exportFilename` (String) - Export file name

**Emits:**
- `update:items` - Items changed (edit/delete)
- `remove` - Item removed

---

## Services

### aiGeneration.js

Unified AI generation service:

```javascript
import { generateAIContent } from '@/services/aiGeneration'

// Usage in any component
const output = await generateAIContent(taskConfig, formData)
```

**Functions:**
- `generateAIContent(config, formData)` - Main entry point
- `buildPrompt(template, formData, contextProvider)` - Template substitution
- `callGrokAPI(prompt, aiConfig)` - API communication
- `validateParsedResponse(parsed, validateFn)` - Response validation

### taskRegistry.js

Task metadata and component routing:

```javascript
import { getTaskComponent, getTaskMetadata } from '@/services/taskRegistry'

// Get component for a task
const Component = getTaskComponent('task-id')

// Get task metadata
const { name, description, category } = getTaskMetadata('task-id')
```

### projectService.js

Project CRUD operations:

```javascript
import { createProject, getProject, updateProject } from '@/services/projectService'

// Create new project
const project = await createProject({ name: 'Q4 Campaign' })

// Get project with all tasks
const full = await getProject(projectId)

// Update project
await updateProject(projectId, { name: 'Q4 Campaign 2024' })
```

### formValidation.js

Centralized form validation:

```javascript
import {
  validateForm,
  validateField,
  validateEmail,
  validateRequired,
  hasFormErrors
} from '@/utils/formValidation'

// Validate entire form
const errors = validateForm(formData, fieldDefinitions)
if (hasFormErrors(errors)) {
  console.log('Form has errors:', errors)
}

// Validate single field
const emailError = validateEmail('user@example.com')

// Custom validators
const textError = validateText(value, { minLength: 5, maxLength: 100 })
```

---

## State Management (Pinia)

### projectStore.js

Manages project and task state:

```javascript
import { useProjectStore } from '@/stores/projectStore'

const store = useProjectStore()

// Projects
store.setCurrentProject(projectId)
const current = store.currentProject
const all = store.projects

// Tasks
store.saveTaskData('task-id', { formData, aiOutput, savedItems })
const taskData = store.getTaskData('task-id')

// Persistence
store.loadProjectsFromSupabase()  // Auto-called on init
```

### authStore.js

Manages authentication state:

```javascript
import { useAuthStore } from '@/stores/authStore'

const auth = useAuthStore()

// User
const user = auth.user
const isLoggedIn = auth.isLoggedIn

// Methods
await auth.signOut()
```

---

## API Layer

### Grok API (via Netlify Proxy)

**Request:**
```javascript
POST /.netlify/functions/grok-proxy
{
  "model": "grok-2",
  "messages": [
    { "role": "user", "content": "prompt text" }
  ],
  "temperature": 0.8,
  "max_tokens": 2000
}
```

**Response:**
```javascript
{
  "choices": [
    {
      "message": {
        "content": "AI response text"
      }
    }
  ]
}
```

**Handled By:**
- Frontend: `generateAIContent()` in `aiGeneration.js`
- Backend: `netlify/functions/grok-proxy.js`

### Supabase Database

**Tables:**
- `projects` - User projects
- `project_tasks` - Task data for each project
- `auth.users` - User authentication

**Accessed By:**
- `projectService.js` - CRUD operations
- `projectStore.js` - State management

---

## Code Review Checklist

When adding new features or tasks:

- ✅ **Architecture**: Does it follow the configuration-driven pattern?
- ✅ **No Duplication**: Is code reused via components/utilities/services?
- ✅ **Validation**: Are form validations in `formValidation.js`?
- ✅ **Error Handling**: Are errors user-friendly and logged?
- ✅ **Naming**: Are variables and functions clearly named?
- ✅ **Testing**: Can it be tested independently?
- ✅ **Documentation**: Is the config/component documented?

---

## Adding a New Task (Quick Reference)

### For Simple Form Tasks (No AI)

1. Add config to `unifiedTasks.js`
2. Task auto-renders via `UnifiedTaskComponent.vue`
3. Done! (No component needed)

### For AI Generation Tasks (NEW STANDARD)

1. Create `src/components/TaskMiniApps/configs/[taskId].config.js`
   - Define formFields
   - Define aiConfig with promptTemplate
   - Define parseResponse if structured output needed

2. Create `src/components/TaskMiniApps/[TaskNameMiniApp].vue`
   - Wrap MiniAppShell with config
   - Connect to projectStore for persistence

3. Register in `src/components/TaskMiniApps/core/miniAppRegistry.js`

4. Update `src/services/taskRegistry.js` to point to new mini-app

5. Test:
   - Form renders correctly
   - Validation works
   - AI generation succeeds
   - Results save to store
   - Results persist to database

**Total Time**: ~15 minutes

---

## Best Practices

### Task Configuration

✅ **Good:**
```javascript
form: [
  {
    id: 'audience_overview',
    type: 'textarea',
    label: 'Target Audience Overview',
    required: true,
    description: 'Be specific about who you\'re targeting'
  }
]
```

❌ **Avoid:**
```javascript
// Don't hardcode validation in component
// Don't repeat form fields across tasks
// Don't use unclear field names
```

### AI Prompts

✅ **Good:**
```javascript
template: `Generate {post_count} social posts based on:
- Topic: {content_focus}
- Tone: {tone}
- Platform requirements...

Format output with clear [PLATFORM:] headers.`
```

❌ **Avoid:**
```javascript
// Don't use vague instructions
// Don't forget format examples
// Don't forget platform-specific constraints
```

### Response Parsing

✅ **Good:**
```javascript
parseResponse: (raw) => {
  const lines = raw.split('\n')
  return lines
    .filter(l => l.trim())
    .map(l => ({ content: l }))
}
```

❌ **Avoid:**
```javascript
// Don't assume format without validation
// Don't fail silently on parse errors
// Don't return unparsed raw text if structured output promised
```

### Error Messages

✅ **Good:**
```javascript
"Please enter a valid email address"
"Budget range is required"
"Grok API is temporarily unavailable. Please try again later."
```

❌ **Avoid:**
```javascript
"Error 500"
"Bad request"
"null.message"
```

---

## Migration Status

### Complete (Using New System)
- ✅ setup-1: Define Audience (mini-app)
- ✅ social-1: Generate Posts (mini-app)

### Pending (Using Config System)
- 🔄 19 remaining tasks: In config format, need mini-app wrappers

### Deprecated (Legacy Components)
- ❌ 20 legacy components in `/Task/Forms` and `/Task/Generate`
- Plan to delete once all 21 tasks migrated to mini-apps

---

## Performance Considerations

### Bundle Size
- Lazy-load mini-app components
- Remove unused legacy components once migration complete
- Tree-shake unused utilities

### API Calls
- Cache context provider results
- Debounce form input before auto-save
- Batch database updates

### Rendering
- Use `v-if` for conditional sections (not just `v-show`)
- Memoize expensive computations
- Virtual scroll for large output lists (future)

---

## Troubleshooting

### AI Generation Returns 500 Error

**Check:**
1. Is `GROK_API_KEY` set in `.env`?
2. Is Netlify function accessible (dev server running)?
3. Check browser console for detailed error messages

**Solution:**
- Set environment variables
- Run `npm run dev`
- Check Netlify logs

### Form Data Not Saving

**Check:**
1. Is Pinia store connected to component?
2. Is `@save` event emitted from MiniAppShell?
3. Is Supabase configured?

**Solution:**
- Verify projectStore imports
- Check browser console for persistence errors
- Verify Supabase connection string

### Task Not Showing Up

**Check:**
1. Is taskId registered in taskRegistry?
2. Is config exported in miniAppRegistry?
3. Are all imports correct?

**Solution:**
- Add task to taskRegistry.js
- Register in miniAppRegistry.js
- Check browser console for import errors

---

## Future Improvements

- [ ] Migrate remaining 19 tasks to mini-apps
- [ ] Delete 20 legacy components
- [ ] Add multi-model AI support (Claude, ChatGPT, etc.)
- [ ] Implement version history for outputs
- [ ] Add batch task generation
- [ ] Template library for prompt reuse
- [ ] Analytics dashboard for content performance
- [ ] Collaborative editing (real-time sync)
- [ ] Mobile app with React Native

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.
See [docs/TASK_DEFINITION_GUIDE.md](./docs/TASK_DEFINITION_GUIDE.md) for task creation guide.
See [docs/CODE_REVIEW_CHECKLIST.md](./docs/CODE_REVIEW_CHECKLIST.md) for review criteria.
