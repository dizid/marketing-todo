# Launchpilot - Project Guide

AI-powered sales/marketing app. Helps founders get their first 10 customers with guided tasks, AI copy generation, and landing page publishing.

## Tech Stack
- Vue 3 + Vite + Tailwind CSS v4
- Pinia stores
- Supabase (auth + DB)
- Netlify Functions (serverless)
- Grok AI API (grok-3-fast, via grok-proxy.cjs)
- Cloudflare R2 (landing page hosting via r2-publish.cjs)
- Stripe (subscriptions)

## Dev Setup
Run `netlify dev` or use the `/dev` skill.
Access at http://localhost:3000

Config in `netlify.toml`:
- Port 3000 - Netlify proxy (access here)
- Port 3001 - Vite (internal)
- Port 9999 - Functions (internal)

## Key Directories
- `src/components/` - Vue components
- `src/components/TaskMiniApps/` - Task-specific mini-apps
- `src/configs/` - Task configurations
- `src/stores/` - Pinia stores
- `src/services/` - API services
- `netlify/functions/` - Serverless functions

## Commands
- `netlify dev` - Start dev server
- `npm run build` - Build for production

## Code Style
- Variables/functions: camelCase
- Components: PascalCase
- Files: kebab-case
- Use `<script setup>` in Vue components

## Preferences
- Act like a senior developer
- Write complete, working code - no mocks, stubs, or TODOs
- Use clear comments in code
- Keep existing working code intact when adding features
- Modular, maintainable structure
