# Marketing To-Do App - Multi-Project System

A modern Vue 3 marketing task manager with per-project organization, Supabase authentication, and Grok AI integration.

## Features

- **Multi-Project System** - Create unlimited marketing projects with isolated task tracking
- **Smart Checklist** - 20 pre-built marketing tasks across 6 categories
- **Project Settings** - Define target audience, goals, tech stack, and timeline per project
- **Progress Tracking** - Visual progress bars for overall and per-category completion
- **Database Persistence** - All data saved to Supabase with Row Level Security
- **Authentication** - Secure signup/login with email verification
- **Grok AI Integration** - AI-powered marketing advice generation
- **Export** - Export project data as Markdown or JSON
- **Mobile-First** - Responsive design optimized for all devices

## Quick Start

### Prerequisites
- Node.js v18+
- Supabase account with project created
- Grok API key from xAI console

### Installation & Setup

**For a complete rebuild from scratch, see [REBUILD_FROM_SCRATCH.md](REBUILD_FROM_SCRATCH.md)**

Quick setup for existing developers:

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (.env file)
VITE_SUPABASE_URL=https://[project-id].supabase.co
VITE_SUPABASE_ANON_KEY=[anon-key]
VITE_FUNCTIONS_URL=http://localhost:9999/.netlify/functions
GROK_API_KEY=xai-[your-key]

# 3. Run development server (Terminal 1)
npm run dev

# 4. Run Netlify functions (Terminal 2)
netlify functions:serve

# 5. Visit http://localhost:3000
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vue 3 + Vite |
| Styling | Tailwind CSS |
| State Management | Pinia |
| Routing | Vue Router |
| Database | Supabase (PostgreSQL) |
| Serverless | Netlify Functions |
| AI | Grok API |

## Database Tables

- **user_profiles** - User account data (synced with auth.users)
- **projects** - User's marketing projects with metadata
- **project_data** - Key-value store for project settings, tasks, and generated content

## Project Structure

```
src/
├── components/
│   ├── Project/
│   │   ├── ProjectHeader.vue    # Navigation & project selector
│   │   ├── ProjectSetup.vue     # Create project modal
│   │   ├── ProjectForm.vue      # Edit project modal
│   ├── AuthForm.vue             # Login/signup
│   ├── Dashboard.vue            # Main app interface
│   ├── ChecklistCategory.vue    # Task category accordion
│   └── ChecklistItem.vue        # Individual task
├── services/
│   ├── projectService.js        # Project CRUD operations
│   └── grok.js                  # Grok AI integration
├── stores/
│   ├── projectStore.js          # Project state management
│   └── authStore.js             # Auth state management
├── utils/
│   └── supabase.js              # Supabase client
└── router/
    └── index.js                 # Route configuration

netlify/functions/
└── grok-proxy.js                # Serverless Grok API proxy
```

## Testing

See [REBUILD_FROM_SCRATCH.md](REBUILD_FROM_SCRATCH.md) Step 9 for comprehensive testing checklist.

## Deployment

```bash
npm run build
netlify deploy --prod
```

Set `GROK_API_KEY` in Netlify Site Settings → Environment variables.

## Documentation

- **[REBUILD_FROM_SCRATCH.md](REBUILD_FROM_SCRATCH.md)** - Complete rebuild guide with step-by-step instructions, SQL schema, troubleshooting, and architecture decisions
- **[claude.md](claude.md)** - Custom project notes

## Phase Information

**Current Phase:** Phase 1 - Multi-Project System ✅

**Next Phase:** Phase 2 - Task Mini-Apps (modular task components)

See REBUILD_FROM_SCRATCH.md for Phase 2 planning details.

## Common Issues

Consult [REBUILD_FROM_SCRATCH.md](REBUILD_FROM_SCRATCH.md) Common Issues & Solutions section for:
- Foreign key constraint errors
- 406 Supabase REST API errors
- CORS issues
- Grok function 404 errors
- Port conflicts

## License

MIT
