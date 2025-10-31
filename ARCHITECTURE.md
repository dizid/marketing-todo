# Architecture Documentation

**Marketing To-Do App v0.5**
**System Design and Technical Architecture**

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

### Architecture Diagram

```
Browser (Vue 3 App)
        │
        ├─→ Netlify Functions (Grok API Proxy)
        │
        └─→ Supabase (PostgreSQL + Auth)
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
- **Supabase** - PostgreSQL database + Authentication
- **Netlify Functions** - Serverless backend
- **Grok API** (xAI) - AI content generation

---

## Directory Structure

```
src/
├── main.js                        # Entry point
├── App.vue                        # Root component
├── components/                    # Vue components (60 files)
│   ├── Dashboard.vue              # Main dashboard
│   ├── AuthForm.vue               # Login/signup
│   ├── ProjectHeader.vue          # Navigation
│   ├── MiniAppShell.vue           # Task orchestrator
│   ├── FormBuilder.vue            # Dynamic forms
│   ├── AIPanel.vue                # AI generation
│   ├── OutputSection.vue          # Results display
│   ├── MiniApps/                  # Task implementations (22+ files)
│   └── Task/                      # Legacy components (deprecated)
├── services/                      # Business logic (6 files)
│   ├── aiGeneration.js
│   ├── projectService.js
│   ├── taskRegistry.js
│   ├── db.js
│   ├── grok.js
│   └── landingPageExporter.js
├── stores/                        # Pinia state (2 files)
│   ├── authStore.js
│   └── projectStore.js
├── router/                        # Vue Router
│   └── index.js
├── configs/                       # Task configurations (18+ files)
│   └── unifiedTasks.js
├── utils/                         # Utilities (2 files)
│   ├── supabase.js
│   └── formValidation.js
└── assets/                        # Static resources

netlify/
└── functions/
    └── grok-proxy.js              # Grok API proxy
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

### aiGeneration.js
- Build prompts from templates
- Call Grok API
- Parse/validate responses
- Generate with retries
- Handle errors

### projectService.js
- Project CRUD operations
- Project data management
- Initialize projects
- Bulk operations

### taskRegistry.js
- Get task configurations
- List all tasks
- Filter by category
- Validate configs

### db.js
- Supabase query wrappers
- RLS-enforced operations
- Transaction support
- Helper methods

### grok.js
- API client
- Health checks
- Error handling
- Rate limiting

### landingPageExporter.js
- Export as HTML
- Export as JSON
- Generate CSS
- Download files

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

## Conclusion

The Marketing To-Do App uses a modern, scalable architecture with:
- **Configuration-driven UI** for easy task management
- **Layered architecture** for separation of concerns
- **Pinia stores** for centralized state
- **Service layer** for business logic
- **Supabase backend** for data and auth
- **Security-first** with RLS and validation

The design makes it easy to extend with new features while maintaining code quality and performance.

For more details, see:
- `APPLICATION_STATUS.md` - Current status and health
- `FEATURES.md` - Complete feature documentation
- `FEATURES_SHORT.md` - Quick feature overview
