# Launchpilot

AI-powered sales & marketing command center for entrepreneurs. Get your first 10 customers with guided tasks, AI copy generation, and landing page publishing.

## Features

- **33 AI-Powered Tasks** - Sales pages, email sequences, ad strategies, and more
- **Landing Page Builder** - Visual builder with live preview and one-click publish
- **Social Publishing** - Post AI-generated content directly to Twitter/X
- **Milestone Tracking** - Visual journey progress with achievement celebrations
- **Smart Recommendations** - 4-phase marketing journey tailored to your experience
- **Multi-Project Support** - Manage multiple campaigns with isolated data
- **7-Tier Business Context** - AI outputs improve as you add more context
- **Stripe Subscriptions** - Free, Professional ($19/mo), and Business ($49/mo) tiers

## Quick Start

### Prerequisites
- Node.js v18+
- Supabase account
- Grok API key from [xAI Console](https://console.x.ai/)

### Setup

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your credentials

# Start development server
netlify dev

# Open http://localhost:3000
```

### Environment Variables

```bash
VITE_SUPABASE_URL=https://[project-id].supabase.co
VITE_SUPABASE_ANON_KEY=[anon-key]
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]
GROK_API_KEY=xai-[your-key]
VITE_STRIPE_PUBLIC_KEY=pk_[your-key]
STRIPE_SECRET_KEY=sk_[your-key]
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vue 3 + Vite + Tailwind CSS v4 |
| State | Pinia |
| Database | Supabase (Postgres + Auth) |
| Serverless | Netlify Functions |
| AI | Grok API (grok-3) |
| Payments | Stripe |
| Hosting | Netlify |

## Project Structure

```
src/
├── components/
│   ├── Dashboard/          # Main dashboard UI
│   ├── TaskMiniApps/       # 21 task-specific mini-apps
│   └── ...
├── configs/                # Task definitions
├── services/               # API services
├── stores/                 # Pinia state management
└── utils/                  # Utilities

netlify/functions/
├── grok-proxy.cjs          # AI generation
├── stripe-webhook.cjs      # Payment webhooks
├── r2-publish.cjs          # Landing page publishing
└── social-post.cjs         # Social media publishing
```

## Commands

```bash
netlify dev          # Development (port 3000)
npm run build        # Production build
npm test             # Run 348 tests
```

## Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) - System design and patterns
- [FEATURES.md](FEATURES.md) - Complete feature documentation
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guide
- [docs/TASK_DEFINITION_GUIDE.md](docs/TASK_DEFINITION_GUIDE.md) - How to add tasks

## License

MIT
