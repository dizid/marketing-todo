# Marketing To-Do App - Complete Rebuild Guide

**Current Version:** Phase 1 - Multi-Project System
**Last Updated:** 2025-10-23
**Total Build Time:** ~6-8 hours for experienced developer

---

## Quick Start Overview

This app is a **multi-project marketing task manager** with:
- User authentication (Supabase)
- Project-based organization (each user can create multiple projects)
- Shared task template (20 marketing tasks across 6 categories)
- Per-project progress tracking
- Grok AI integration for advice generation
- Mobile-first design (no sidebar)

---

## Prerequisites

### Required Accounts/Services
1. **Supabase** (Database + Auth) - https://supabase.com
   - Create a new project
   - Note: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

2. **Grok AI API Key** (xAI)
   - Get from: https://console.x.ai
   - Note: `GROK_API_KEY`

3. **Node.js** v18+ and npm

---

## Step 1: Project Setup (15 minutes)

### Create Vue 3 + Vite Project
```bash
npm create vite@latest marketing-todo -- --template vue
cd marketing-todo
npm install
```

### Install Dependencies
```bash
npm install @supabase/supabase-js pinia vue-router tailwindcss @tailwindcss/vite axios
```

### Configure Vite for Netlify Functions (vite.config.js)
```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000,
    open: false
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: true
  }
})
```

### Create netlify.toml
```toml
[build]
  command = "npm run build"
  functions = "netlify/functions"
  publish = "dist"

[dev]
  functions = "netlify/functions"
  command = "npm run dev"
  targetPort = 3000

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Create .env file
```
VITE_SUPABASE_URL=https://[project-id].supabase.co
VITE_SUPABASE_ANON_KEY=[anon-key]
VITE_FUNCTIONS_URL=http://localhost:9999/.netlify/functions
GROK_API_KEY=xai-[your-key]
```

---

## Step 2: Supabase Database Setup (20 minutes)

### Enable Auth
1. Go to Supabase Dashboard → **Authentication**
2. Ensure **Email** provider is enabled
3. Go to **Email Templates** and verify confirmation email exists
4. Set **URL Configuration** redirect URLs:
   ```
   http://localhost:3000/auth
   http://localhost:3000/reset-password
   http://localhost:3000/
   ```

### Create Tables (SQL Editor)

#### 1. user_profiles table
```sql
CREATE TABLE public.user_profiles (
  id uuid NOT NULL PRIMARY KEY,
  email text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_profiles_pkey PRIMARY KEY (id)
);
```

#### 2. projects table
```sql
CREATE TABLE public.projects (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  status text DEFAULT 'active',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT projects_pkey PRIMARY KEY (id),
  CONSTRAINT projects_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE
);

CREATE INDEX idx_projects_user_id ON public.projects(user_id);
```

#### 3. project_data table (consolidated data storage)
```sql
CREATE TABLE public.project_data (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  key text NOT NULL,
  value jsonb,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT project_data_pkey PRIMARY KEY (id),
  CONSTRAINT project_data_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE,
  CONSTRAINT project_data_unique UNIQUE(project_id, key)
);

CREATE INDEX idx_project_data_project_id ON public.project_data(project_id);
```

#### 4. Create Auth Trigger
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email)
  VALUES (new.id, new.email)
  ON CONFLICT (id) DO UPDATE SET email = new.email;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

---

## Step 3: Core Structure (File Organization)

### Directory Structure
```
src/
├── components/
│   ├── Project/
│   │   ├── ProjectHeader.vue      # Navigation, project dropdown
│   │   ├── ProjectSetup.vue       # Create new project form
│   │   ├── ProjectForm.vue        # Edit project details
│   ├── AuthForm.vue               # Login/signup form
│   ├── ResetPassword.vue          # Password reset
│   ├── Dashboard.vue              # Main app (project-aware)
│   ├── ChecklistCategory.vue      # Task category accordion
│   ├── ChecklistItem.vue          # Individual task item
│   └── Tasks/                     # Future: Task mini-apps
│       ├── TaskModal.vue          # Wrapper for task modals
│       └── tasks/                 # Individual task components
├── services/
│   ├── projectService.js          # CRUD for projects
│   ├── grok.js                    # Grok AI API calls
│   └── db.js                      # Legacy (can be removed)
├── stores/
│   ├── projectStore.js            # Project state management
│   └── authStore.js               # Auth state management
├── utils/
│   └── supabase.js                # Supabase client init
├── router/
│   └── index.js                   # Vue Router config
├── App.vue                        # Root component
└── main.js                        # Entry point
```

---

## Step 4: Key Files to Implement

### 1. src/utils/supabase.js
```javascript
// Initializes Supabase client
// Exports: signUp, signIn, signOut, getCurrentUser, onAuthStateChanged, resetPassword
// See: REBUILD_FROM_SCRATCH.md section "Supabase Utilities"
```

### 2. src/stores/authStore.js
```javascript
// Pinia store for authentication state
// Exports: user, session, isLoading, error, isAuthenticated
// Methods: initializeAuth, subscribeToAuthChanges, handleSignUp, handleSignIn, handleSignOut
```

### 3. src/stores/projectStore.js
```javascript
// Pinia store for project management
// Exports: projects, currentProjectId, currentProject, projectData, error, isLoading
// Methods: fetchProjects, selectProject, createProject, updateProject, deleteProject, updateProjectTasks, updateTask, addContent
// Computed: currentProjectSettings, currentProjectTasks, currentProjectContent
```

### 4. src/services/projectService.js
```javascript
// Service layer for project database operations
// Exports:
// - getProjects() - Get all user's projects
// - createProject(name, description) - Create new project
// - updateProject(projectId, updates) - Update project info
// - getProjectData(projectId, key) - Get specific data
// - saveProjectData(projectId, key, value) - Save/update data
// - initializeProject(projectId) - Create default project data
// - Helper methods: getProjectSettings, saveProjectSettings, getProjectTasks, etc.
```

### 5. src/components/Project/ProjectHeader.vue
```vue
<!-- Top navigation header with:
     - Project dropdown selector
     - "New Project" button
     - Edit button (opens ProjectForm modal)
     - Sign Out button
-->
```

### 6. src/components/Project/ProjectSetup.vue
```vue
<!-- Modal form to create new project
     Fields:
     - Project Name (required)
     - Description (optional)
     - Target Audience (required)
     - Primary Goals (required)
     - Tech Stack (optional)
     - Timeline (optional)
-->
```

### 7. src/components/Project/ProjectForm.vue
```vue
<!-- Modal form to edit existing project
     Same fields as ProjectSetup but for editing
-->
```

### 8. src/components/Dashboard.vue
```vue
<!-- Main app view showing:
     - ProjectHeader at top
     - If no project: "Create project" message
     - If project selected:
       - Overall progress bar
       - Search/filter controls
       - Checklist categories (from taskCategories ref)
       - Grok AI advice section
       - Export buttons (Markdown, JSON)
       - Reset tasks button

     Task categories (hard-coded in component):
     - Setup Basics (5 tasks)
     - Social Media Marketing (3 tasks)
     - Content Creation (3 tasks)
     - User Acquisition & Engagement (3 tasks)
     - Feedback & Iteration (3 tasks)
     - Analytics & Optimization (3 tasks)
     Total: 20 tasks
-->
```

### 9. src/services/grok.js
```javascript
// Grok AI integration
// Exports:
// - getGrokAdvice(userData) - Call Grok API via Netlify function
// - getMindfulnessTip(triggers) - (Future use)
// Uses environment variable: VITE_FUNCTIONS_URL
```

### 10. netlify/functions/grok-proxy.js
```javascript
// Serverless function to proxy Grok API calls
// Handles CORS headers for localhost development
// Expects: POST request with { userData, requestType }
// Returns: { advice: "..." } or { response: "..." }
// Uses: GROK_API_KEY environment variable
// IMPORTANT: Add CORS headers for local development!
```

---

## Step 5: Authentication Flow

1. **User visits app** → Router guard checks if authenticated
2. **Not authenticated** → Redirect to `/auth` (AuthForm component)
3. **AuthForm** → Sign up / Sign in via Supabase
4. **On signup:**
   - Supabase trigger creates user_profiles entry
   - Auth confirmation email sent (user must click link)
   - Session stored in browser
5. **On successful auth:**
   - AuthStore updated with user data
   - Router redirects to `/` (Dashboard)
6. **Dashboard loads:**
   - ProjectStore fetches all projects
   - If no projects: show "Create project" prompt
   - If projects exist: auto-select first, load its data

---

## Step 6: Data Flow

### Creating a Project
```
ProjectSetup.vue (form)
  ↓
projectStore.createProject()
  ↓
projectService.createProject() → INSERT projects table
  ↓
projectService.initializeProject() → INSERT default project_data
  ↓
projectStore.selectProject() → Load into state
  ↓
Dashboard re-renders with project data
```

### Updating Tasks
```
ChecklistItem checkbox changed
  ↓
emit @task-checked to ChecklistCategory
  ↓
emit to Dashboard.handleTaskUpdate()
  ↓
projectStore.updateProjectTasks()
  ↓
projectService.saveProjectData() → UPSERT project_data table
  ↓
State updated, computed properties re-calculate
  ↓
Progress bar updates reactively
```

### Switching Projects
```
ProjectHeader dropdown change
  ↓
projectStore.selectProject(projectId)
  ↓
projectService.getAllProjectData(projectId)
  ↓
State.currentProject = project
  ↓
State.projectData = { settings, tasks, content }
  ↓
Dashboard re-renders with new project data
```

---

## Step 7: Environment Variables

### Local Development (.env)
```
VITE_SUPABASE_URL=https://[project-id].supabase.co
VITE_SUPABASE_ANON_KEY=[anon-key]
VITE_FUNCTIONS_URL=http://localhost:9999/.netlify/functions
GROK_API_KEY=xai-[your-key]
```

### Netlify Deployment (Site Settings → Environment)
```
VITE_SUPABASE_URL=https://[project-id].supabase.co
VITE_SUPABASE_ANON_KEY=[anon-key]
GROK_API_KEY=xai-[your-key]
```
(Note: VITE_FUNCTIONS_URL not needed in production - defaults to `/.netlify/functions`)

---

## Step 8: Running Locally

### Development
```bash
# Terminal 1: Vite dev server
npm run dev

# Terminal 2: Netlify functions
netlify functions:serve

# Terminal 3 (optional): Watch mode
npm run build -- --watch
```

Visit: `http://localhost:3000`

### Production
```bash
npm run build
# Deploy dist/ to Netlify
```

---

## Step 9: Testing Checklist

- [ ] Sign up with new email
- [ ] Confirm email from confirmation link
- [ ] Sign in with credentials
- [ ] Create new project
- [ ] Fill in project settings
- [ ] Check off tasks → verify progress bar updates
- [ ] Switch projects → verify data isolation
- [ ] Add task notes
- [ ] Generate Grok advice
- [ ] Export as Markdown/JSON
- [ ] Sign out → verify redirect to auth
- [ ] Sign back in → verify project data persists

---

## Architecture Decisions

### Why Consolidated project_data Table?
- Simpler schema (2 tables instead of 6+)
- Flexible JSONB values for different data types
- Easier to migrate/extend in future
- Each key stores different data:
  - `settings` → project metadata
  - `tasks` → task states {taskId: {checked, notes, data}}
  - `content` → array of generated content

### Why No Left Sidebar?
- Better for mobile (full-width responsive)
- Project dropdown in header is sufficient
- Simpler CSS and component structure
- Future: Can use drawer/modal for navigation if needed

### Why Project Dropdown Over Tab Navigation?
- Single project selected at a time
- Cleaner mental model
- Easier to add "New Project" button
- Works well at any screen size

### Why Separate projectService and projectStore?
- **projectService**: Database operations (stateless)
- **projectStore**: Application state (cached, reactive)
- Easier to test and debug
- Clear separation of concerns

---

## Common Issues & Solutions

### Issue: "violates foreign key constraint projects_user_id_fkey"
**Cause:** user_profiles entry doesn't exist for authenticated user
**Solution:** Run trigger manually or insert missing user profile
```sql
INSERT INTO public.user_profiles (id, email)
VALUES (user_id, email)
ON CONFLICT (id) DO NOTHING;
```

### Issue: 406 Errors on Supabase REST API
**Cause:** `.single()` called on query with 0 rows, or RLS rejecting request
**Solution:** Remove `.single()`, use array indexing: `data?.[0]?.value`

### Issue: CORS errors on Grok API
**Cause:** Netlify function missing CORS headers
**Solution:** Add to grok-proxy.js response:
```javascript
headers: {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
}
```

### Issue: Grok function returns 404
**Cause:** netlify functions:serve not running or wrong port
**Solution:** Verify port in .env (default 9999), ensure function file exists at `netlify/functions/grok-proxy.js`

---

## Next Steps (Phase 2+)

1. **Task Mini Apps System**
   - Create TaskRegistry.js to map task IDs to components
   - Create TaskModal.vue wrapper
   - Build first task component (e.g., DefineAudienceTask.vue)
   - Store task-specific data in project_data[taskId].data

2. **Task Types** (not implemented yet)
   - Form-based tasks (e.g., "Define Audience")
   - Modal tasks (e.g., "Generate Copy")
   - Multi-step tasks (e.g., "Create Campaign")

3. **Future Features**
   - Task templates (user-defined or marketplace)
   - Collaboration (invite team members)
   - Task comments/collaboration
   - Advanced AI integration
   - Export to external tools (Notion, Google Drive, etc.)

---

## File Checklist for Rebuild

### Essential Files
- [ ] vite.config.js
- [ ] netlify.toml
- [ ] .env (with your credentials)
- [ ] src/main.js
- [ ] src/App.vue
- [ ] src/router/index.js
- [ ] src/utils/supabase.js
- [ ] src/stores/authStore.js
- [ ] src/stores/projectStore.js
- [ ] src/services/projectService.js
- [ ] src/services/grok.js
- [ ] src/components/AuthForm.vue
- [ ] src/components/ResetPassword.vue
- [ ] src/components/Dashboard.vue
- [ ] src/components/ChecklistCategory.vue
- [ ] src/components/ChecklistItem.vue
- [ ] src/components/Project/ProjectHeader.vue
- [ ] src/components/Project/ProjectSetup.vue
- [ ] src/components/Project/ProjectForm.vue
- [ ] netlify/functions/grok-proxy.js

### Optional
- [ ] tailwind.config.js (if using Tailwind)
- [ ] src/assets/main.css
- [ ] index.html

---

## Key Metrics

- **Total Lines of Code:** ~3500 (Vue + JS + SQL)
- **Components:** 10
- **Services:** 2
- **Stores:** 2
- **Database Tables:** 3
- **Serverless Functions:** 1
- **External APIs:** 2 (Supabase + Grok)

---

## Document Metadata

- **Created:** 2025-10-23
- **Last Updated:** 2025-10-23
- **Version:** 1.0 (Phase 1 Complete)
- **Estimated Rebuild Time:** 6-8 hours (experienced dev), 12-16 hours (beginner)
- **Git Repository:** https://github.com/dizid/marketing-todo

---

**If you're reading this and need to rebuild the app, follow these steps sequentially and you'll have a complete, working multi-project app in a few hours!**
