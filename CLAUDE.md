# CLAUDE.md - AI Assistant Context for Marketing To-Do App

> **Last Updated:** 2025-11-21
> **Purpose:** Comprehensive guide for AI assistants working on this codebase
> **Status:** Active - Multi-project system with TaskMiniApps, PayPal integration, and AI-powered features

---

## 📋 TABLE OF CONTENTS

1. [Project Overview](#project-overview)
2. [Quick Reference](#quick-reference)
3. [Technology Stack](#technology-stack)
4. [Architecture & Structure](#architecture--structure)
5. [Component System](#component-system)
6. [State Management](#state-management)
7. [Services Layer](#services-layer)
8. [Database Schema](#database-schema)
9. [API Integrations](#api-integrations)
10. [Development Workflow](#development-workflow)
11. [Environment Configuration](#environment-configuration)
12. [Coding Standards](#coding-standards)
13. [Operating Principles](#operating-principles)
14. [Common Patterns](#common-patterns)
15. [Troubleshooting](#troubleshooting)

---

## PROJECT OVERVIEW

### What This App Does

**Marketing To-Do** (also known as "GrokFather App") is a comprehensive marketing task management platform that helps users plan and execute product launches. It features:

- **Multi-Project Organization** - Users can create unlimited marketing projects with isolated task tracking
- **AI-Powered Task Assistance** - 50+ task mini-apps with Grok AI integration for content generation
- **Subscription Tiers** - Free (20 AI generations/month) and Premium ($9.99/month, 200 generations)
- **PayPal Integration** - Subscription payments and management
- **Smart Onboarding** - 5-step wizard for project setup
- **Progress Tracking** - Visual analytics and completion tracking
- **Export Capabilities** - Markdown and JSON export for all project data

### Current Development Phase

**Phase:** Production-ready with ongoing enhancements
**Recent Updates:**
- TaskMiniApps system with 26+ modular mini-applications
- PayPal subscription integration
- AI quota management system
- Onboarding wizard
- Premium features and tier system

### Business Model

- **Free Tier:** 20 AI generations per month
- **Premium Tier:** $9.99/month, 200 AI generations per month
- **Payment:** PayPal subscriptions

---

## QUICK REFERENCE

### Essential Commands

```bash
# Development (requires 2 terminals)
npm install                          # Install dependencies
npm run dev                          # Start Vite dev server (port 3000)
netlify functions:serve              # Start functions server (port 9999)

# Build & Deploy
npm run build                        # Build for production
netlify deploy --prod                # Deploy to production

# Testing
npm test                             # Run tests (not configured yet)
```

### Key File Locations

| File Path | Purpose |
|-----------|---------|
| `src/main.js` | App entry point |
| `src/App.vue` | Root component |
| `src/router/index.js` | Route definitions |
| `src/stores/` | Pinia state stores (4 stores) |
| `src/services/` | Business logic layer |
| `src/components/TaskMiniApps/` | 26 task mini-apps |
| `src/configs/` | 33 task configuration files |
| `netlify/functions/` | Serverless functions (4 functions) |
| `vite.config.js` | Vite build configuration |

### Critical Ports

- **3000** - Vite dev server (frontend)
- **9999** - Netlify functions server (backend)

### Environment Variables Required

```bash
# Frontend (.env)
VITE_SUPABASE_URL=https://[project-id].supabase.co
VITE_SUPABASE_ANON_KEY=[anon-key]
VITE_FUNCTIONS_URL=http://localhost:9999/.netlify/functions  # dev
VITE_FUNCTIONS_URL=/.netlify/functions                        # prod

# Backend (Netlify environment)
GROK_API_KEY=xai-[your-key]
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]
PAYPAL_CLIENT_ID=[paypal-client-id]
PAYPAL_CLIENT_SECRET=[paypal-secret]
```

---

## TECHNOLOGY STACK

### Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Vue 3** | 3.5.22 | Progressive JavaScript framework with Composition API |
| **Vite** | 7.1.11 | Next-generation frontend build tool |
| **Vue Router** | 4.6.3 | Client-side routing |
| **Pinia** | 3.0.3 | State management (Vuex replacement) |
| **Tailwind CSS** | 4.1.15 | Utility-first CSS framework |
| **Axios** | 1.12.2 | HTTP client for API calls |

### Backend Stack

| Technology | Purpose |
|------------|---------|
| **Supabase** | PostgreSQL database + Authentication + Real-time |
| **Netlify Functions** | Serverless backend (Node.js) |
| **Grok API (xAI)** | Large language model for AI content generation |
| **PayPal API** | Subscription payment processing |

### Design System

**Theme:** Cyberpunk/neon aesthetic with dark mode
**Fonts:**
- Space Grotesk (primary)
- Unbounded (headings)
- JetBrains Mono (code)

**Color Palette:**
- Primary: Cyan (#00d9ff)
- Accent: Magenta/Pink (#c9004f)
- Highlight: Yellow (#ffbe0b)
- Background: Dark grays (#0a0a0a, #1a1a1a)

---

## ARCHITECTURE & STRUCTURE

### Directory Structure

```
marketing-todo/
├── src/                                 # Application source code
│   ├── main.js                         # Entry point - initializes Vue, Pinia, Router
│   ├── App.vue                         # Root component - auth init, router-view
│   │
│   ├── components/                     # Vue components
│   │   ├── TaskMiniApps/              # 26 task mini-app components
│   │   │   ├── DefineAudienceMiniApp.vue
│   │   │   ├── GeneratePostsMiniApp.vue
│   │   │   ├── WriteBlogPostMiniApp.vue
│   │   │   ├── ... (23 more)
│   │   │   ├── configs/               # 33 task config files
│   │   │   │   ├── defineAudience.config.js
│   │   │   │   ├── generatePosts.config.js
│   │   │   │   └── ... (31 more)
│   │   │   ├── MiniAppShell.vue       # Reusable mini-app framework
│   │   │   ├── FormBuilder.vue        # Dynamic form generator
│   │   │   ├── AIPanel.vue            # AI generation UI
│   │   │   └── OutputSection.vue      # Results display
│   │   │
│   │   ├── Task/                      # Legacy task components
│   │   │   ├── Forms/                 # Data collection tasks (13 files)
│   │   │   ├── Generate/              # AI generation tasks (8 files)
│   │   │   └── TaskModal.vue
│   │   │
│   │   ├── Project/                   # Project management
│   │   │   ├── ProjectHeader.vue      # Navigation + project selector
│   │   │   ├── ProjectSetup.vue       # Create project modal
│   │   │   ├── ProjectForm.vue        # Edit project modal
│   │   │   └── AddTasksModal.vue      # Custom task addition
│   │   │
│   │   ├── Onboarding/                # Onboarding wizard
│   │   │   ├── OnboardingWizard.vue   # Wizard container
│   │   │   └── Steps/                 # 5-step onboarding flow
│   │   │       ├── Step1ProductType.vue
│   │   │       ├── Step2Audience.vue
│   │   │       ├── Step3Goals.vue
│   │   │       ├── Step4Details.vue
│   │   │       └── Step5Signup.vue
│   │   │
│   │   ├── Dashboard.vue              # Main app interface
│   │   ├── LandingPage.vue            # Public marketing page
│   │   ├── AuthForm.vue               # Login/signup
│   │   ├── ResetPassword.vue          # Password recovery
│   │   ├── ManageSubscriptionPage.vue # Subscription management
│   │   ├── ChecklistCategory.vue      # Task category accordion
│   │   ├── ChecklistItem.vue          # Individual task
│   │   ├── QuotaStatusCard.vue        # AI quota display
│   │   ├── QuotaExceededModal.vue     # Quota limit notification
│   │   ├── PremiumUpgradeButton.vue   # Upgrade CTA
│   │   └── UnifiedTaskComponent.vue   # Task display wrapper
│   │
│   ├── services/                      # Business logic layer
│   │   ├── db.js                      # Database operations (Supabase)
│   │   ├── aiGeneration.js            # Unified AI generation service
│   │   ├── aiQuotaService.js          # Quota management
│   │   ├── projectService.js          # Project CRUD operations
│   │   ├── paypalService.js           # PayPal integration
│   │   ├── grok.js                    # Grok API wrapper (deprecated)
│   │   ├── taskRegistry.js            # Task metadata registry
│   │   └── landingPageExporter.js     # Export functionality
│   │
│   ├── stores/                        # Pinia state management
│   │   ├── authStore.js               # Authentication state
│   │   ├── projectStore.js            # Project and task state
│   │   ├── subscriptionStore.js       # Subscription and quota state
│   │   └── onboardingStore.js         # Onboarding wizard state
│   │
│   ├── router/                        # Vue Router
│   │   └── index.js                   # Route definitions + guards
│   │
│   ├── composables/                   # Reusable Vue composables
│   │   └── useQuotaError.js           # Quota error handling
│   │
│   ├── utils/                         # Utility functions
│   │   ├── supabase.js                # Supabase client + auth helpers
│   │   ├── formValidation.js          # Form validation utilities
│   │   └── onboardingFormatters.js    # Data formatting
│   │
│   ├── configs/                       # Task configuration files
│   │   ├── executiveSummary.config.js
│   │   ├── channelOptimizer.config.js
│   │   ├── offerBuilder.config.js
│   │   ├── paidAds.config.js
│   │   └── ... (29 more config files)
│   │
│   ├── schemas/                       # Data validation schemas
│   │
│   ├── assets/                        # Static assets
│   │   ├── main.css                   # Global styles + Tailwind
│   │   ├── images/
│   │   └── fonts/
│   │
│   └── App.vue                        # Root component
│
├── netlify/functions/                 # Serverless backend
│   ├── grok-proxy.js                  # AI API proxy + usage tracking
│   ├── paypal-create-subscription.js  # Create PayPal subscription
│   ├── paypal-cancel-subscription.js  # Cancel subscription
│   └── paypal-webhook.js              # PayPal webhook handler
│
├── public/                            # Static public assets
│
├── docs/                              # Documentation
│
├── index.html                         # HTML entry point
├── package.json                       # Dependencies + scripts
├── vite.config.js                     # Vite configuration
├── tailwind.config.js                 # Tailwind configuration
├── netlify.toml                       # Netlify deployment config
└── .env                               # Environment variables (gitignored)
```

### Application Flow

```
User visits site
    ↓
index.html loads
    ↓
src/main.js initializes Vue + Pinia + Router
    ↓
App.vue calls authStore.initializeAuth()
    ↓
Router guards check authentication
    ↓
[Public Routes]              [Protected Routes]
- /                          - /app (Dashboard)
- /auth                      - /app/subscription
- /landing
- /welcome
- /reset-password
    ↓
Dashboard.vue
    ↓
Loads projects from projectStore
    ↓
Displays tasks per project
    ↓
User interacts with tasks
    ↓
AI generation → Netlify function → Grok API
    ↓
Results saved to Supabase
```

---

## COMPONENT SYSTEM

### TaskMiniApps Framework

**Location:** `src/components/TaskMiniApps/`

The TaskMiniApps system is a **configuration-driven framework** for creating modular task applications. Each mini-app follows a standard pattern:

**Mini-App Structure:**
```
TaskMiniApps/
├── [TaskName]MiniApp.vue          # Component implementation
├── configs/[taskName].config.js   # Configuration file
├── MiniAppShell.vue               # Reusable framework
├── FormBuilder.vue                # Dynamic form generator
├── AIPanel.vue                    # AI generation interface
└── OutputSection.vue              # Results display
```

**Key Mini-Apps (26 total):**
1. `DefineAudienceMiniApp.vue` - Target audience definition
2. `GeneratePostsMiniApp.vue` - Social media content generation
3. `WriteBlogPostMiniApp.vue` - Blog post creation
4. `DesignGraphicsMiniApp.vue` - Graphics planning
5. `PaidAdsLaunchMiniApp.vue` - Ad campaign launch
6. `PaidAdsOptimizeMiniApp.vue` - Ad optimization
7. `AnalyticsSetupMiniApp.vue` - Analytics configuration
8. `WebinarMiniApp.vue` - Webinar planning
9. `FeedbackCollectionMiniApp.vue` - User feedback
10. `LandingPageWizardStep.vue` - Landing page builder
11. ... (16 more)

**Configuration File Pattern:**
```javascript
// src/components/TaskMiniApps/configs/taskName.config.js
export default {
  id: 'unique-task-id',
  name: 'Display Name',
  description: 'Help text for users',
  tier: 'free', // or 'premium'

  aiConfig: {
    promptTemplate: `Template with {variable} substitution`,
    responseFormat: 'string', // or 'json'
    contextProvider: (projectData) => ({
      // Additional context for AI
    })
  },

  formFields: [
    {
      name: 'fieldName',
      label: 'Field Label',
      type: 'text', // or 'textarea', 'select', etc.
      required: true,
      placeholder: 'Placeholder text'
    }
  ],

  constraints: {
    maxLength: 500,
    minItems: 3
  }
}
```

**Using TaskMiniApps:**
1. Create config file in `configs/`
2. Create component in `TaskMiniApps/`
3. Import config in component
4. Use `<MiniAppShell>` with config
5. Register in `taskRegistry.js`

### Core Components

**Dashboard.vue** (`src/components/Dashboard.vue`)
- Main application interface
- Project selector
- Task categories with accordion UI
- Progress tracking
- Search and filter
- Quota status display

**LandingPage.vue** (`src/components/LandingPage.vue`)
- Public marketing page
- Pricing tiers
- Feature showcase
- CTA buttons

**AuthForm.vue** (`src/components/AuthForm.vue`)
- Login/signup interface
- Email validation
- Error handling
- Redirect after auth

**ManageSubscriptionPage.vue** (`src/components/ManageSubscriptionPage.vue`)
- View current subscription
- Upgrade to premium
- Cancel subscription
- View usage history

**OnboardingWizard.vue** (`src/components/Onboarding/OnboardingWizard.vue`)
- 5-step onboarding flow
- Product type selection
- Audience definition
- Goal setting
- Project details
- Account creation

### Component Naming Conventions

- **Vue components:** PascalCase with `.vue` extension
  - Example: `DefineAudienceMiniApp.vue`, `QuotaStatusCard.vue`
- **Config files:** camelCase with `.config.js` extension
  - Example: `defineAudience.config.js`, `executiveSummary.config.js`
- **Services:** camelCase with `.js` extension
  - Example: `aiGeneration.js`, `projectService.js`

---

## STATE MANAGEMENT

### Pinia Stores

**Location:** `src/stores/`

The application uses 4 Pinia stores for state management:

#### 1. authStore.js - Authentication State

```javascript
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
```

**State:**
- `user` - Current authenticated user object
- `session` - Current session object
- `isLoading` - Auth initialization state
- `error` - Auth error messages

**Key Actions:**
- `initializeAuth()` - Initialize auth on app load
- `subscribeToAuthChanges()` - Listen for auth state changes
- `signUp(email, password)` - User registration
- `signIn(email, password)` - User login
- `signOut()` - User logout

**Usage Pattern:**
```javascript
const authStore = useAuthStore()

// Check if user is authenticated
if (authStore.user) {
  // User is logged in
}

// Sign in
await authStore.signIn(email, password)
```

#### 2. projectStore.js - Project & Task State

```javascript
import { useProjectStore } from '@/stores/projectStore'

const projectStore = useProjectStore()
```

**State:**
- `projects` - Array of user's projects
- `currentProjectId` - Selected project ID
- `currentProject` - Selected project object
- `projectData` - Project-specific data (settings, tasks, content)

**Computed Properties:**
- `currentProjectSettings` - Settings for current project
- `currentProjectTasks` - Tasks for current project
- `currentProjectContent` - Generated content for current project

**Key Actions:**
- `fetchProjects()` - Load all user projects
- `selectProject(projectId)` - Switch active project
- `createProject(data)` - Create new project
- `updateProject(id, data)` - Update project
- `deleteProject(id)` - Delete project
- `saveProjectSettings(settings)` - Save project settings
- `saveProjectTasks(tasks)` - Save task state
- `saveProjectContent(content)` - Save generated content

**Usage Pattern:**
```javascript
const projectStore = useProjectStore()

// Create new project
await projectStore.createProject({
  name: 'Product Launch',
  description: 'Q1 2025 product launch'
})

// Get current project tasks
const tasks = projectStore.currentProjectTasks

// Save task completion
tasks.taskId.completed = true
await projectStore.saveProjectTasks(tasks)
```

#### 3. subscriptionStore.js - Subscription & Quota State

```javascript
import { useSubscriptionStore } from '@/stores/subscriptionStore'

const subscriptionStore = useSubscriptionStore()
```

**State:**
- `subscription` - Subscription details
- `aiUsage` - AI generation usage history
- `tier` - Current tier ('free' or 'premium')

**Constants:**
- `FREE_TIER_QUOTA = 20` - Free tier monthly limit
- `PREMIUM_TIER_QUOTA = 200` - Premium tier monthly limit

**Computed Properties:**
- `currentMonthUsage` - Usage count this month
- `remainingQuota` - Remaining generations
- `isActive` - Subscription active status

**Key Actions:**
- `fetchSubscription()` - Load subscription data
- `trackUsage(taskId, tokens)` - Record AI usage
- `checkQuota()` - Validate quota availability

**Usage Pattern:**
```javascript
const subscriptionStore = useSubscriptionStore()

// Check remaining quota
if (subscriptionStore.remainingQuota > 0) {
  // Can generate AI content
}

// Track usage after AI call
await subscriptionStore.trackUsage('task-id', { input: 100, output: 200 })
```

#### 4. onboardingStore.js - Onboarding Wizard State

```javascript
import { useOnboardingStore } from '@/stores/onboardingStore'

const onboardingStore = useOnboardingStore()
```

**State:**
- `currentStep` - Active step (1-5)
- `formData` - Wizard input data
- `isLoading` - Processing state

**Key Actions:**
- `nextStep()` - Advance to next step
- `previousStep()` - Go back one step
- `setFormData(data)` - Update form data
- `reset()` - Reset wizard state

---

## SERVICES LAYER

### Service Architecture

Services encapsulate business logic and external API calls. Components should **never** call APIs directly - always use services.

**Location:** `src/services/`

### Key Services

#### 1. db.js - Database Operations

**Purpose:** Supabase database CRUD operations

**Key Functions:**
```javascript
import * as db from '@/services/db'

// Project description
await db.saveAppDescription(userId, description)
const description = await db.getAppDescription(userId)

// Task checklist state
await db.saveChecklist(userId, checklist)
const checklist = await db.getChecklist(userId)

// Category notes
await db.saveCategoryNotes(userId, categoryId, notes)
const notes = await db.getCategoryNotes(userId, categoryId)

// Generated content
await db.saveGeneratedContent(userId, contentType, content)
const content = await db.getGeneratedContent(userId, contentType)

// AI context aggregation
const context = await db.getUserDataForAI(userId)
```

#### 2. aiGeneration.js - Unified AI Service

**Purpose:** Central service for all AI content generation

**Main Function:**
```javascript
import { generateAIContent } from '@/services/aiGeneration'

const result = await generateAIContent(config, formData, options)
```

**Parameters:**
- `config` - Task configuration object (from .config.js files)
- `formData` - User input data
- `options` - Optional settings (model, temperature, etc.)

**Features:**
- Prompt template variable substitution
- Quota checking before generation
- Response parsing and formatting
- Error handling with user-friendly messages
- Automatic usage tracking

**Usage Pattern:**
```javascript
import taskConfig from '@/configs/generatePosts.config.js'
import { generateAIContent } from '@/services/aiGeneration'

const formData = {
  platform: 'Twitter',
  topic: 'Product launch',
  tone: 'Professional'
}

try {
  const result = await generateAIContent(taskConfig, formData)
  console.log(result) // Generated content
} catch (error) {
  if (error.message === 'QUOTA_EXCEEDED') {
    // Show upgrade modal
  }
}
```

#### 3. aiQuotaService.js - Quota Management

**Purpose:** Manage AI generation quotas

**Key Functions:**
```javascript
import { checkQuotaBeforeGeneration, trackAIUsage } from '@/services/aiQuotaService'

// Check if user can generate
const canGenerate = await checkQuotaBeforeGeneration(taskId)

// Track usage after generation
await trackAIUsage(taskId, { input: 100, output: 200 })
```

**Quota Limits:**
- Free tier: 20 generations/month
- Premium tier: 200 generations/month

#### 4. projectService.js - Project CRUD

**Purpose:** Project management operations

**Key Functions:**
```javascript
import * as projectService from '@/services/projectService'

// Fetch all user projects
const projects = await projectService.getProjects()

// Get single project
const project = await projectService.getProject(projectId)

// Create new project
const newProject = await projectService.createProject({
  name: 'Q1 Launch',
  description: 'Product launch project'
})

// Update project
await projectService.updateProject(projectId, { name: 'New Name' })

// Delete project
await projectService.deleteProject(projectId)

// Get all project data (settings, tasks, content)
const allData = await projectService.getAllProjectData(projectId)

// Save project data
await projectService.saveProjectSettings(projectId, settings)
await projectService.saveProjectTasks(projectId, tasks)
```

#### 5. paypalService.js - PayPal Integration

**Purpose:** Handle PayPal subscription operations

**Key Functions:**
```javascript
import { createPayPalSubscription, cancelSubscription } from '@/services/paypalService'

// Create subscription
const approvalUrl = await createPayPalSubscription()
window.location.href = approvalUrl // Redirect to PayPal

// Cancel subscription
await cancelSubscription(subscriptionId)
```

#### 6. taskRegistry.js - Task Metadata

**Purpose:** Central registry of all tasks with metadata

**Exports:**
```javascript
import { taskComponentMap, taskMetadata } from '@/services/taskRegistry'

// Map task IDs to Vue components
const component = taskComponentMap['define-audience']

// Get task metadata
const metadata = taskMetadata['define-audience']
// Returns: { name, description, icon, category, tier }
```

---

## DATABASE SCHEMA

### Supabase Tables

**Authentication:** Managed by Supabase Auth
- `auth.users` - User accounts (Supabase managed)

**Application Tables:**

#### 1. user_profiles
Stores user profile information synced with auth.users

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**RLS Policy:** Users can only read/update their own profile

#### 2. projects
Stores user's marketing projects

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**RLS Policy:** Users can only access their own projects

#### 3. project_data
Key-value store for project-specific data (settings, tasks, content)

```sql
CREATE TABLE project_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, key)
);
```

**Keys Used:**
- `settings` - Project settings (audience, goals, tech stack)
- `tasks` - Task completion state
- `content-{taskId}` - Generated content per task

**RLS Policy:** Users can only access data for their own projects

#### 4. user_settings
User preferences and app settings

```sql
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, key)
);
```

**RLS Policy:** Users can only access their own settings

#### 5. category_notes
Notes for task categories

```sql
CREATE TABLE category_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id TEXT NOT NULL,
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, category_id)
);
```

**RLS Policy:** Users can only access their own notes

#### 6. generated_content
Stores AI-generated content

```sql
CREATE TABLE generated_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**RLS Policy:** Users can only access their own content

#### 7. ai_usage
Tracks AI generation usage for quota management

```sql
CREATE TABLE ai_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id TEXT NOT NULL,
  model TEXT,
  tokens_input INTEGER,
  tokens_output INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**RLS Policy:** Users can only view their own usage; server can insert/update

#### 8. user_subscriptions
Subscription information

```sql
CREATE TABLE user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL DEFAULT 'free', -- 'free' or 'premium'
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'cancelled', 'expired'
  paypal_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);
```

**RLS Policy:** Users can read their own subscription; server can update

### Row Level Security (RLS)

**All tables have RLS enabled** to ensure users can only access their own data.

**Standard RLS Pattern:**
```sql
-- SELECT policy
CREATE POLICY "Users can view own data"
  ON table_name FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT policy
CREATE POLICY "Users can insert own data"
  ON table_name FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE policy
CREATE POLICY "Users can update own data"
  ON table_name FOR UPDATE
  USING (auth.uid() = user_id);

-- DELETE policy
CREATE POLICY "Users can delete own data"
  ON table_name FOR DELETE
  USING (auth.uid() = user_id);
```

---

## API INTEGRATIONS

### 1. Grok API (xAI)

**Purpose:** AI content generation
**Endpoint:** `https://api.x.ai/v1/chat/completions`
**Model:** `grok-beta` or `grok-2-latest`

**Access Pattern:**
```
Frontend → Netlify Function (grok-proxy.js) → Grok API
```

**Why Proxy?**
- Keeps API key secure (server-side only)
- Tracks usage in database
- Implements quota checking
- Adds error handling

**Request Format:**
```javascript
POST /.netlify/functions/grok-proxy
Content-Type: application/json

{
  "messages": [
    { "role": "system", "content": "You are a helpful assistant" },
    { "role": "user", "content": "Generate a blog post about..." }
  ],
  "model": "grok-beta",
  "temperature": 0.7
}
```

**Response Format:**
```javascript
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "Generated content here..."
      }
    }
  ],
  "usage": {
    "prompt_tokens": 100,
    "completion_tokens": 200,
    "total_tokens": 300
  }
}
```

### 2. PayPal API

**Purpose:** Subscription payments
**Endpoints:**
- Create subscription
- Cancel subscription
- Handle webhooks

**Access Pattern:**
```
Frontend → Netlify Functions → PayPal API
```

**Functions:**
1. `paypal-create-subscription.js` - Create subscription, return approval URL
2. `paypal-cancel-subscription.js` - Cancel active subscription
3. `paypal-webhook.js` - Handle PayPal events (payment, cancellation, etc.)

**Subscription Flow:**
```
1. User clicks "Upgrade to Premium"
2. Frontend calls paypal-create-subscription function
3. Function creates subscription on PayPal
4. Returns approval URL
5. Frontend redirects user to PayPal
6. User approves subscription
7. PayPal redirects back to app
8. Webhook updates subscription status in database
```

### 3. Supabase API

**Purpose:** Database and authentication
**Endpoints:** REST API (auto-generated from schema)

**Client-side Operations:**
- Use `VITE_SUPABASE_ANON_KEY` (limited permissions)
- RLS enforces data access rules

**Server-side Operations:**
- Use `SUPABASE_SERVICE_ROLE_KEY` (full permissions)
- Only in Netlify functions
- Used for usage tracking, webhook handling

---

## DEVELOPMENT WORKFLOW

### Initial Setup

```bash
# 1. Clone repository
git clone <repo-url>
cd marketing-todo

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env
# Edit .env with your credentials

# 4. Start development servers (2 terminals)

# Terminal 1: Frontend
npm run dev
# Runs on http://localhost:3000

# Terminal 2: Backend
netlify functions:serve
# Runs on http://localhost:9999
```

### Development Servers

**Terminal 1 - Vite Dev Server:**
```bash
npm run dev
```
- Port: 3000
- Hot module replacement (HMR)
- Fast refresh for Vue components
- Proxies `/.netlify/functions` to localhost:9999

**Terminal 2 - Netlify Functions:**
```bash
netlify functions:serve
```
- Port: 9999
- Serves serverless functions locally
- Auto-reloads on file changes

### Making Changes

**1. Adding a New Task:**

a. Create config file:
```javascript
// src/configs/myNewTask.config.js
export default {
  id: 'my-new-task',
  name: 'My New Task',
  description: 'What this task does',
  tier: 'free',
  aiConfig: {
    promptTemplate: 'Generate {something} for {audience}',
    responseFormat: 'string'
  },
  formFields: [
    {
      name: 'something',
      label: 'What to generate',
      type: 'text',
      required: true
    }
  ]
}
```

b. Create component:
```vue
<!-- src/components/TaskMiniApps/MyNewTaskMiniApp.vue -->
<script setup>
import MiniAppShell from './MiniAppShell.vue'
import config from '@/configs/myNewTask.config.js'
</script>

<template>
  <MiniAppShell :config="config" />
</template>
```

c. Register in task registry:
```javascript
// src/services/taskRegistry.js
import MyNewTaskMiniApp from '@/components/TaskMiniApps/MyNewTaskMiniApp.vue'

export const taskComponentMap = {
  'my-new-task': MyNewTaskMiniApp,
  // ... other tasks
}

export const taskMetadata = {
  'my-new-task': {
    name: 'My New Task',
    description: 'Brief description',
    icon: 'icon-class',
    category: 'Strategy',
    tier: 'free'
  },
  // ... other metadata
}
```

**2. Modifying Database Schema:**

```bash
# Access Supabase SQL Editor
# https://app.supabase.com/project/[project-id]/sql

# Create migration
CREATE TABLE new_table (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

# Enable RLS
ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;

# Create policies
CREATE POLICY "Users can view own data"
  ON new_table FOR SELECT
  USING (auth.uid() = user_id);
```

**3. Adding Environment Variables:**

Development:
```bash
# .env
VITE_NEW_VAR=value
```

Production:
```bash
# Netlify dashboard: Site settings → Environment variables
NEW_VAR=production-value
```

### Testing Changes

**Manual Testing Checklist:**
1. Create new user account
2. Complete onboarding
3. Create project
4. Test task interactions
5. Test AI generation (check quota)
6. Test subscription upgrade
7. Test data persistence
8. Test logout/login

**Browser DevTools:**
- Console: Check for errors
- Network: Monitor API calls
- Application → Local Storage: Check Supabase session
- Vuex: Inspect Pinia stores (use Vue DevTools)

### Building for Production

```bash
# Build frontend
npm run build

# Output: dist/ directory

# Test production build locally
npm run preview
```

### Deployment

**Netlify Auto-Deploy:**
1. Push to GitHub
2. Netlify automatically builds and deploys
3. Monitor build logs in Netlify dashboard

**Manual Deploy:**
```bash
netlify deploy --prod
```

**Environment Variables (Production):**
Set in Netlify dashboard:
- Site settings → Environment variables
- Add all vars from .env
- Different values for production (e.g., production Supabase URL)

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-task

# Make changes
git add .
git commit -m "feat: Add new task for email campaigns"

# Push to GitHub
git push origin feature/new-task

# Create Pull Request on GitHub
# Merge after review
```

---

## ENVIRONMENT CONFIGURATION

### Required Environment Variables

**Frontend (.env in root directory):**

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://[project-id].supabase.co
VITE_SUPABASE_ANON_KEY=[your-anon-key]

# Functions URL (different for dev/prod)
# Development:
VITE_FUNCTIONS_URL=http://localhost:9999/.netlify/functions
# Production:
VITE_FUNCTIONS_URL=/.netlify/functions
```

**Backend (Netlify Environment Variables):**

```bash
# Grok AI
GROK_API_KEY=xai-[your-key]

# Supabase (server-side)
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]

# PayPal
PAYPAL_CLIENT_ID=[client-id]
PAYPAL_CLIENT_SECRET=[client-secret]
```

### Getting API Keys

**Supabase:**
1. Create project at https://app.supabase.com
2. Go to Settings → API
3. Copy Project URL and anon/public key

**Grok API:**
1. Sign up at https://console.x.ai
2. Create API key
3. Copy key (starts with `xai-`)

**PayPal:**
1. Create account at https://developer.paypal.com
2. Create App in Dashboard
3. Copy Client ID and Secret
4. Use Sandbox credentials for development

### Configuration Files

**vite.config.js:**
```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/.netlify/functions': {
        target: 'http://localhost:9999',
        changeOrigin: true
      }
    }
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: true
  }
})
```

**netlify.toml:**
```toml
[build]
  command = "npm run build"
  functions = "netlify/functions"
  publish = "dist"

[dev]
  command = "npm run dev"
  port = 3000
  functionsPort = 9999

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**tailwind.config.js:**
```javascript
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f9ff',
          100: '#b3ecff',
          500: '#00d9ff',
          600: '#00b8db',
          700: '#0097b7'
        }
      }
    }
  }
}
```

---

## CODING STANDARDS

### Vue 3 Composition API Patterns

**Component Structure:**
```vue
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

// Props
const props = defineProps({
  taskId: {
    type: String,
    required: true
  }
})

// Emits
const emit = defineEmits(['save', 'cancel'])

// Store access
const authStore = useAuthStore()
const router = useRouter()

// Reactive state
const isLoading = ref(false)
const formData = ref({})

// Computed properties
const isValid = computed(() => {
  return formData.value.name?.length > 0
})

// Methods
async function handleSubmit() {
  isLoading.value = true
  try {
    // Logic here
    emit('save', formData.value)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    isLoading.value = false
  }
}

// Lifecycle hooks
onMounted(async () => {
  // Initialization
})
</script>

<template>
  <div class="container">
    <h1>{{ props.taskId }}</h1>
    <button @click="handleSubmit" :disabled="!isValid || isLoading">
      {{ isLoading ? 'Saving...' : 'Save' }}
    </button>
  </div>
</template>

<style scoped>
.container {
  /* Component-specific styles */
}
</style>
```

### Naming Conventions

**Variables & Functions:**
```javascript
// Variables: camelCase
const userName = 'John'
const isActive = true
const itemCount = 5

// Functions: camelCase with verb prefix
function getUserProfile() {}
async function fetchProjects() {}
function handleClick() {}

// Constants: UPPER_SNAKE_CASE
const MAX_RETRIES = 3
const API_TIMEOUT = 5000
const FREE_TIER_QUOTA = 20

// Private/internal: prefix with underscore
const _internalHelper = () => {}
```

**Components:**
```javascript
// PascalCase
Dashboard.vue
AuthForm.vue
DefineAudienceMiniApp.vue
QuotaStatusCard.vue
```

**Files:**
```javascript
// Services: camelCase
aiGeneration.js
projectService.js
paypalService.js

// Config: camelCase with .config.js
executiveSummary.config.js
defineAudience.config.js

// Stores: camelCase with Store suffix
authStore.js
projectStore.js
```

### Code Organization

**Imports Order:**
```javascript
// 1. Vue core
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// 2. External libraries
import axios from 'axios'

// 3. Stores
import { useAuthStore } from '@/stores/authStore'
import { useProjectStore } from '@/stores/projectStore'

// 4. Services
import { generateAIContent } from '@/services/aiGeneration'
import * as db from '@/services/db'

// 5. Components
import MiniAppShell from './MiniAppShell.vue'
import FormBuilder from './FormBuilder.vue'

// 6. Configs/Utils
import config from '@/configs/task.config.js'
import { validateEmail } from '@/utils/formValidation'
```

**Function Organization:**
```javascript
// 1. Props/emits
const props = defineProps({...})
const emit = defineEmits([...])

// 2. Router/stores
const router = useRouter()
const authStore = useAuthStore()

// 3. Reactive state
const isLoading = ref(false)
const data = ref(null)

// 4. Computed properties
const filteredData = computed(() => {...})

// 5. Methods (group by feature)
// Authentication
async function handleLogin() {}
async function handleLogout() {}

// Data operations
async function fetchData() {}
async function saveData() {}

// UI handlers
function handleClick() {}
function handleSubmit() {}

// 6. Lifecycle hooks
onMounted(async () => {...})
onBeforeUnmount(() => {...})

// 7. Watchers (if needed)
watch(data, (newVal) => {...})
```

### Error Handling

**Try-Catch Pattern:**
```javascript
async function handleOperation() {
  isLoading.value = true
  error.value = null

  try {
    const result = await someAsyncOperation()
    successMessage.value = 'Operation successful!'
    return result
  } catch (err) {
    console.error('Operation failed:', err)
    error.value = err.message || 'An error occurred'
    // Optional: Show user-friendly error
    showErrorToast(error.value)
  } finally {
    isLoading.value = false
  }
}
```

**Service Layer Error Handling:**
```javascript
// services/projectService.js
export async function createProject(data) {
  try {
    const { data: project, error } = await supabase
      .from('projects')
      .insert(data)
      .select()
      .single()

    if (error) throw error
    return project
  } catch (error) {
    console.error('Failed to create project:', error)
    throw new Error(`Failed to create project: ${error.message}`)
  }
}
```

### Comments

**When to Comment:**
```javascript
// ✅ Good comments

// Explain WHY, not WHAT
// We need to debounce search to avoid excessive API calls
const debouncedSearch = debounce(search, 300)

// Document complex logic
// Calculate quota: free tier gets 20/month, premium gets 200/month
// Reset counter on first day of each month
const quota = tier === 'premium' ? 200 : 20

// Warn about gotchas
// IMPORTANT: Must call this BEFORE initializing router
// to ensure auth state is ready
await authStore.initializeAuth()

// Mark TODOs with context
// TODO: Add pagination when we have >100 projects
// For now, limit is 50 per query
```

```javascript
// ❌ Bad comments (avoid these)

// Increment counter
counter++

// Get user
const user = getUser()

// Loop through items
items.forEach(item => {...})
```

### Async/Await Best Practices

**Parallel Execution:**
```javascript
// ✅ Good: Parallel when independent
const [projects, subscription, usage] = await Promise.all([
  fetchProjects(),
  fetchSubscription(),
  fetchUsage()
])

// ❌ Bad: Sequential when could be parallel
const projects = await fetchProjects()
const subscription = await fetchSubscription()  // Waits unnecessarily
const usage = await fetchUsage()  // Waits unnecessarily
```

**Sequential Execution:**
```javascript
// ✅ Good: Sequential when dependent
const user = await authenticateUser()
const projects = await fetchUserProjects(user.id)
const selectedProject = await getProject(projects[0].id)
```

**Error Handling with Promise.all:**
```javascript
// Handle errors individually
const results = await Promise.allSettled([
  fetchProjects(),
  fetchSubscription(),
  fetchUsage()
])

results.forEach((result, index) => {
  if (result.status === 'fulfilled') {
    console.log(`Success ${index}:`, result.value)
  } else {
    console.error(`Error ${index}:`, result.reason)
  }
})
```

---

## OPERATING PRINCIPLES

### Core Implementation Philosophy

**DIRECT IMPLEMENTATION ONLY:**
- Generate complete, working code that realizes the conceptualized solution
- NO partial implementations, mocks, stubs, TODOs, or placeholder functions
- Solution-first thinking at SYSTEM level
- Token optimization: Focus on solution generation, eliminate unnecessary context

### Multi-Dimensional Analysis Framework

When encountering complex requirements:
1. **Observer 1:** Technical feasibility and implementation path
2. **Observer 2:** Edge cases and error handling requirements
3. **Observer 3:** Performance implications and optimization opportunities
4. **Observer 4:** Integration points and dependency management
5. **Synthesis:** Merge observations into unified implementation strategy

### Anti-Pattern Elimination

**Prohibited Implementation Patterns:**
- ❌ "In a full implementation..." or "This is a simplified version..."
- ❌ "You would need to..." or "Consider adding..."
- ❌ Mock functions or placeholder data structures
- ❌ Incomplete error handling or validation
- ❌ Deferred implementation decisions

**Prohibited Communication Patterns:**
- ❌ Social validation: "You're absolutely right!", "Great question!"
- ❌ Hedging language: "might", "could potentially", "perhaps"
- ❌ Excessive explanation of obvious concepts
- ❌ Agreement phrases that consume tokens without value
- ❌ Emotional acknowledgments or conversational pleasantries

**Null Space Pattern Exclusion:**
Eliminate patterns that consume tokens without advancing implementation:
- ❌ Restating requirements already provided
- ❌ Generic programming advice not specific to current task
- ❌ Historical context unless directly relevant to implementation
- ❌ Multiple implementation options without clear recommendation

### Dynamic Mode Adaptation

**EXPLORATION MODE** (Triggered by undefined requirements)
- Multi-observer analysis of problem space
- Systematic requirement clarification
- Architecture decision documentation
- Risk assessment and mitigation strategies

**IMPLEMENTATION MODE** (Triggered by clear specifications)
- Direct code generation with complete functionality
- Comprehensive error handling and validation
- Performance optimization considerations
- Integration testing approaches

**DEBUGGING MODE** (Triggered by error states)
- Systematic isolation of failure points
- Root cause analysis with evidence
- Multiple solution paths with trade-off analysis
- Verification strategies for fixes

**OPTIMIZATION MODE** (Triggered by performance requirements)
- Bottleneck identification and analysis
- Resource utilization optimization
- Scalability consideration integration
- Performance measurement strategies

### Quality Assurance Metrics

**Success Indicators:**
- ✅ Complete running code on first attempt
- ✅ Zero placeholder implementations
- ✅ Minimal token usage per solution
- ✅ Proactive edge case handling
- ✅ Production-ready error handling
- ✅ Comprehensive input validation

**Failure Recognition:**
- ❌ Deferred implementations or TODOs
- ❌ Social validation patterns
- ❌ Excessive explanation without implementation
- ❌ Incomplete solutions requiring follow-up
- ❌ Generic responses not tailored to project context

### Custom Project Instructions

- Act like a senior developer with front-end design expertise
- Use extensive comments in code (explain WHY, not WHAT)
- Make code understandable, logical, and maintainable
- Use modular code architecture
- Give clear integration instructions (App.vue, router.js, imports, .env)
- Leave current working code intact when adding features
- Use clear naming conventions
- Provide clean code with clear comments

---

## COMMON PATTERNS

### Authentication Flow

```javascript
// 1. User visits site
// 2. App.vue initializes auth
// src/App.vue
<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

onMounted(async () => {
  await authStore.initializeAuth()
})
</script>

// 3. Router guards protect routes
// src/router/index.js
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.user) {
    next('/auth')
  } else {
    next()
  }
})

// 4. Component uses auth state
// src/components/Dashboard.vue
<script setup>
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
</script>
```

### AI Generation Flow

```javascript
// 1. User fills form in component
// 2. Component calls AI service
import { generateAIContent } from '@/services/aiGeneration'
import taskConfig from '@/configs/generatePosts.config.js'

async function handleGenerate() {
  isLoading.value = true
  try {
    // Service checks quota
    const result = await generateAIContent(taskConfig, formData.value)

    // Display result
    generatedContent.value = result

    // Save to database
    await saveToProject(result)
  } catch (error) {
    if (error.message === 'QUOTA_EXCEEDED') {
      showUpgradeModal.value = true
    } else {
      errorMessage.value = error.message
    }
  } finally {
    isLoading.value = false
  }
}

// 3. Service calls Netlify function
// src/services/aiGeneration.js
const response = await axios.post('/.netlify/functions/grok-proxy', {
  messages: [...],
  model: 'grok-beta'
})

// 4. Function calls Grok API
// netlify/functions/grok-proxy.js
const grokResponse = await fetch('https://api.x.ai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(requestBody)
})

// 5. Function tracks usage
await supabase.from('ai_usage').insert({
  user_id: userId,
  task_id: taskId,
  tokens_input: usage.prompt_tokens,
  tokens_output: usage.completion_tokens
})

// 6. Result returned to component
```

### Project Data Management

```javascript
// 1. Load project on dashboard mount
onMounted(async () => {
  const projectStore = useProjectStore()
  await projectStore.fetchProjects()

  if (projectStore.projects.length > 0) {
    await projectStore.selectProject(projectStore.projects[0].id)
  }
})

// 2. Display tasks from project store
const tasks = computed(() => projectStore.currentProjectTasks)

// 3. Update task completion
async function toggleTask(taskId) {
  const tasks = { ...projectStore.currentProjectTasks }
  tasks[taskId].completed = !tasks[taskId].completed
  await projectStore.saveProjectTasks(tasks)
}

// 4. Save generated content
async function saveContent(taskId, content) {
  await projectStore.saveProjectContent({
    [`content-${taskId}`]: {
      content,
      timestamp: Date.now()
    }
  })
}
```

### Subscription/Quota Checking

```javascript
// 1. Check quota before generation
import { useSubscriptionStore } from '@/stores/subscriptionStore'

const subscriptionStore = useSubscriptionStore()

async function handleGenerate() {
  // Check if user has quota remaining
  if (subscriptionStore.remainingQuota <= 0) {
    showUpgradeModal.value = true
    return
  }

  // Proceed with generation
  await generateContent()
}

// 2. Display quota status
<template>
  <QuotaStatusCard
    :used="subscriptionStore.currentMonthUsage"
    :total="subscriptionStore.tier === 'premium' ? 200 : 20"
    :tier="subscriptionStore.tier"
  />
</template>

// 3. Upgrade to premium
async function handleUpgrade() {
  const approvalUrl = await createPayPalSubscription()
  window.location.href = approvalUrl
}
```

### Form Validation Pattern

```javascript
import { ref, computed } from 'vue'

const formData = ref({
  email: '',
  password: ''
})

const errors = ref({
  email: null,
  password: null
})

const isValid = computed(() => {
  return !errors.value.email &&
         !errors.value.password &&
         formData.value.email &&
         formData.value.password
})

function validateEmail() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formData.value.email) {
    errors.value.email = 'Email is required'
  } else if (!emailRegex.test(formData.value.email)) {
    errors.value.email = 'Invalid email format'
  } else {
    errors.value.email = null
  }
}

function validatePassword() {
  if (!formData.value.password) {
    errors.value.password = 'Password is required'
  } else if (formData.value.password.length < 8) {
    errors.value.password = 'Password must be at least 8 characters'
  } else {
    errors.value.password = null
  }
}

async function handleSubmit() {
  validateEmail()
  validatePassword()

  if (!isValid.value) return

  // Submit form
}
```

---

## TROUBLESHOOTING

### Common Issues & Solutions

#### 1. Vite Dev Server Won't Start

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000
kill -9 [PID]

# Or use different port
npm run dev -- --port 3001
```

#### 2. Netlify Functions 404

**Error:** `404 Not Found: /.netlify/functions/grok-proxy`

**Solutions:**
- Check Netlify functions server is running on port 9999
- Verify `VITE_FUNCTIONS_URL` in .env
- Check function file exists in `netlify/functions/`
- Restart both dev servers

```bash
# Terminal 1
npm run dev

# Terminal 2
netlify functions:serve
```

#### 3. Supabase RLS Errors

**Error:** `406 Not Acceptable` or `Row Level Security policy violation`

**Solutions:**
- Verify user is authenticated: `const { data: { user } } = await supabase.auth.getUser()`
- Check RLS policies allow operation
- Ensure `user_id` matches `auth.uid()`
- Use service role key for admin operations (server-side only)

#### 4. AI Generation Fails

**Error:** `Failed to generate content` or `QUOTA_EXCEEDED`

**Solutions:**
- Check Grok API key is valid
- Verify quota hasn't been exceeded
- Check network connectivity
- Inspect function logs: `netlify functions:serve` output
- Verify prompt template variables are correct

#### 5. PayPal Integration Issues

**Error:** `PayPal subscription creation failed`

**Solutions:**
- Verify PayPal credentials in environment variables
- Check using correct mode (sandbox vs production)
- Ensure webhook URL is configured in PayPal dashboard
- Check subscription plan IDs match

#### 6. Project Data Not Persisting

**Error:** Data disappears after refresh

**Solutions:**
- Check Supabase connection
- Verify `project_data` table exists
- Check RLS policies
- Ensure `saveProjectTasks()` is called after updates
- Check browser console for errors

#### 7. Authentication Loops

**Error:** Redirects between `/auth` and `/app` continuously

**Solutions:**
- Check `authStore.initializeAuth()` completes before routing
- Verify session is being restored from localStorage
- Check router guard logic
- Clear browser localStorage and cookies

#### 8. Build Errors

**Error:** `Build failed` or `Module not found`

**Solutions:**
- Check import paths use `@/` alias correctly
- Verify all dependencies installed: `npm install`
- Check for TypeScript errors if using TS
- Clear cache: `rm -rf node_modules/.vite` and restart

#### 9. CORS Errors

**Error:** `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solutions:**
- Ensure Netlify functions include CORS headers
- Check Supabase URL is correct
- Verify OPTIONS preflight handling in functions
- Check browser isn't blocking requests

### Debug Tools

**Vue DevTools:**
- Install browser extension
- Inspect component tree
- View Pinia store state
- Monitor events and performance

**Network Inspector:**
- Check API calls succeed (200 status)
- Verify request/response payloads
- Monitor timing and performance
- Check headers and authentication

**Console Logs:**
- Enable verbose logging: `localStorage.debug = '*'`
- Check for errors and warnings
- Use `console.log()` strategically
- Monitor Netlify function logs

**Supabase Dashboard:**
- View database tables
- Check RLS policies
- Monitor real-time subscriptions
- Review authentication users

### Getting Help

**Documentation:**
- Vue 3: https://vuejs.org/guide/
- Vite: https://vitejs.dev/guide/
- Pinia: https://pinia.vuejs.org/
- Supabase: https://supabase.com/docs
- Tailwind CSS: https://tailwindcss.com/docs

**Project-Specific Docs:**
- `README.md` - Project overview
- `ARCHITECTURE.md` - System architecture
- `REBUILD_FROM_SCRATCH.md` - Complete rebuild guide

---

## APPENDIX

### File Modification Safety

**SAFE TO MODIFY:**
- `/src/` - All application source code
- `/src/components/` - Vue components
- `/src/services/` - Business logic
- `/src/stores/` - State management
- `/src/configs/` - Task configurations
- `/netlify/functions/` - Serverless functions
- `vite.config.js` - Build configuration
- `tailwind.config.js` - Styling configuration
- `.env` - Environment variables (local only)

**NEVER MODIFY:**
- `/node_modules/` - Dependencies (auto-managed)
- `/.git/` - Version control (use git commands)
- `/dist/` - Build output (auto-generated)
- `package-lock.json` - Dependency lock (auto-managed)

**MODIFY WITH CAUTION:**
- `package.json` - Only add dependencies if needed
- `netlify.toml` - Only change if deployment needs change
- Database schema - Create migrations, don't break existing data

### Key Acronyms

- **RLS** - Row Level Security (Supabase database security)
- **HMR** - Hot Module Replacement (Vite dev feature)
- **SPA** - Single Page Application
- **CRUD** - Create, Read, Update, Delete
- **API** - Application Programming Interface
- **JWT** - JSON Web Token (authentication)
- **CORS** - Cross-Origin Resource Sharing
- **ESM** - ES Modules (JavaScript module system)

### Quick Command Reference

```bash
# Development
npm install              # Install dependencies
npm run dev             # Start dev server (port 3000)
netlify functions:serve # Start functions (port 9999)

# Build
npm run build           # Build for production
npm run preview         # Preview production build

# Deployment
netlify deploy          # Deploy to draft URL
netlify deploy --prod   # Deploy to production

# Git
git status              # Check changes
git add .               # Stage changes
git commit -m "msg"     # Commit changes
git push                # Push to remote

# Supabase
# Access via web dashboard: https://app.supabase.com

# Environment
cp .env.example .env    # Create env file
```

---

**ACTIVATION PROTOCOL:** This configuration is now active. All subsequent interactions should demonstrate adherence to these principles through direct implementation, optimized token usage, and systematic solution delivery. The precise wording and structure are intentional to enable sophisticated reasoning patterns and efficient development workflows.

---

**Document Version:** 1.0
**Last Updated:** 2025-11-21
**Maintained By:** Development Team
**Next Review:** When major architecture changes occur
