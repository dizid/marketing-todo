# Architecture Overview

## What This App Is

A **config-driven marketing task engine** for solopreneurs:
- 33 task configs (JS with AI prompt templates)
- MiniAppShell.vue + 25 custom mini-app components
- Supabase for persistence
- Grok AI (grok-3) for content generation
- Experience-based task recommendation system

## Core Concepts

### Task Flow
```
User selects task → MiniAppShell renders form → User inputs data
    ↓
500ms debounce → projectStore.updateTaskData() → Supabase upsert
    ↓
User clicks Generate → aiGeneration.js → Grok API → Parsed output
```

### Task Recommendation Engine
```
User profile (businessModel, experienceLevel)
    ↓
taskRecommendationEngine.js filters TASK_DEPENDENCY_MAP.json
    ↓
Returns: nextTask, alternatives, progress, phase info
```

Experience levels control task visibility:
- **Beginner**: Phases 1-3 only, simpler tasks
- **Intermediate**: All 4 phases, full task set
- **Advanced**: Future expansion

## Key Files

| File | Purpose |
|------|---------|
| `src/stores/projectStore.js` | State management, save logic |
| `src/stores/milestoneStore.js` | User journey milestone tracking |
| `src/components/TaskMiniApps/core/MiniAppShell.vue` | Renders config-driven tasks |
| `src/components/Dashboard/MilestoneTracker.vue` | Visual journey progress |
| `src/components/Dashboard/EmailConfirmationBanner.vue` | Unconfirmed user prompts |
| `src/services/aiGeneration.js` | Calls Grok API with prompts |
| `src/services/taskRecommendationEngine.js` | Smart task sequencing |
| `src/services/socialPublisher.js` | Twitter/X publishing integration |
| `src/configs/*.config.js` | Task definitions (fields + AI prompts) |
| `src/configs/unifiedTasks.js` | Task registry (id → config mapping) |
| `src/data/TASK_DEPENDENCY_MAP.json` | Phase/task structure + experience filters |
| `src/utils/logger.js` | Environment-aware logging + Sentry |
| `netlify/functions/social-post.cjs` | Social media publishing endpoint |

## Database Schema

```sql
-- User form input (field-level)
task_form_data (project_id, task_id, field_name, field_value, updated_at)

-- Saved AI outputs
task_saved_items (project_id, task_id, item_data, item_order, saved_at)

-- Project settings (blob)
project_data (project_id, key, value, updated_at)

-- Project context (business info for AI prompts)
project_context (project_id, user_id, context_data, created_at)
```

## Features

- Auto-save with 500ms debounce
- "Saving..." indicator + unsaved changes warning
- Form validation
- Project context auto-injected to AI prompts
- Field inheritance from project settings
- Experience-based task filtering (beginner/intermediate)
- Stripe subscription with quota management
- Sentry error tracking (production only)

## Build & Performance

### Code Splitting (vite.config.js)
```javascript
manualChunks: {
  'vue-vendor': ['vue', 'vue-router', 'pinia'],  // ~105KB
  'supabase': ['@supabase/supabase-js']          // ~167KB
}
```

### Error Tracking
Sentry integration (production only):
- Automatic error capture
- 10% performance tracing
- Session replay on errors

## Environment Variables

Required:
```bash
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx        # Backend only
GROK_API_KEY=xai-xxx
VITE_STRIPE_PUBLIC_KEY=pk_xxx
STRIPE_SECRET_KEY=sk_xxx
VITE_STRIPE_PRICE_ID=price_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
VITE_APP_URL=https://yourdomain.com
```

Optional:
```bash
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx  # Error tracking
VITE_DEBUG=true                             # Verbose logging
```

## Adding a New Task

1. Create `src/configs/yourTask.config.js`:
```javascript
export default {
  id: 'category-n',  // e.g., 'growth-6', 'sales-3'
  title: 'Your Task',
  description: 'What this task does',
  help: 'Detailed guidance shown in UI',
  formFields: [
    { id: 'field1', type: 'text', label: 'Field 1', required: true },
    { id: 'field2', type: 'textarea', label: 'Field 2' }
  ],
  aiConfig: {
    promptTemplate: `Generate content based on {field1} and {field2}`,
    temperature: 0.7
  }
}
```

2. Add to `src/configs/unifiedTasks.js` in the `unifiedTasksMap`
3. Add to `src/data/TASK_DEPENDENCY_MAP.json` in appropriate phase
4. Done. MiniAppShell handles rendering.

## Dev Commands

```bash
# Development
netlify dev                    # Full stack (port 3000 + functions 9999)
npm run dev                    # Vite only (port 3001)

# Testing
npm test                       # Run 378 tests
npm run test:watch             # Watch mode

# Production
npm run build                  # Build to dist/
netlify deploy --prod          # Deploy to Netlify
```

## Tech Stack

- **Frontend**: Vue 3 + Vite + Pinia + Tailwind CSS v4
- **Backend**: Netlify Functions (serverless)
- **Database**: Supabase (Postgres + Auth)
- **AI**: Grok AI (xAI) via REST API
- **Payments**: Stripe (subscriptions + webhooks)
- **Monitoring**: Sentry (errors + performance)
- **Hosting**: Netlify

## Testing

378 tests across:
- Unit tests: Experience mode, domain models, services
- Integration tests: Store interactions, component behavior
- Mocked Supabase/Stripe for isolation

Run with `npm test`. Coverage in `tests/` and `src/**/__tests__/`.
