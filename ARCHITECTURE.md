# Architecture Overview

## What This App Is

A **config-driven marketing task engine**:
- 45 task configs (JSON with AI prompt templates)
- 1 form renderer (MiniAppShell.vue)
- Supabase for persistence
- Grok AI for content generation

## Data Flow

```
User types in form
    ↓
500ms debounce
    ↓
projectStore.updateTaskData()
    ↓
Supabase upsert (task_form_data table)
```

## Key Files

| File | Purpose |
|------|---------|
| `src/stores/projectStore.js` | State management, save logic |
| `src/components/TaskMiniApps/core/MiniAppShell.vue` | Renders all 45 tasks |
| `src/services/aiGeneration.js` | Calls Grok API with prompts |
| `src/configs/*.config.js` | Task definitions (fields + AI prompts) |

## Database Schema

```sql
-- User form input (field-level)
task_form_data (project_id, task_id, field_name, field_value, updated_at)

-- Saved AI outputs
task_saved_items (project_id, task_id, item_data, item_order, saved_at)

-- Project settings (blob)
project_data (project_id, key, value, updated_at)
```

## Features

- Auto-save with 500ms debounce
- "Saving..." indicator
- Unsaved changes warning
- Form validation
- Project context auto-injected to AI prompts
- Field inheritance from project settings

## Adding a New Task

1. Create `src/configs/yourTask.config.js`:
```javascript
export default {
  id: 'your-task',
  title: 'Your Task',
  description: 'What this task does',
  formFields: [
    { id: 'field1', type: 'text', label: 'Field 1' },
    { id: 'field2', type: 'textarea', label: 'Field 2' }
  ],
  aiConfig: {
    promptTemplate: `Generate content based on {field1} and {field2}`,
    temperature: 0.7
  }
}
```

2. Add to `src/configs/unifiedTasks.js`
3. Done. MiniAppShell handles the rest.

## Dev Commands

```bash
netlify dev          # Start dev server (port 3000 + functions on 9999)
npm run build        # Production build
npm run test         # Run tests
```

## Tech Stack

- Vue 3 + Vite + Pinia
- Tailwind CSS v4
- Supabase (database + auth)
- Netlify (hosting + serverless)
- Grok AI (content generation)
