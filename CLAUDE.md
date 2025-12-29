# Launchpilot - Project Guide

## Dev Server Setup

**IMPORTANT**: Use `netlify dev` (no flags). Config is in `netlify.toml`.

```bash
netlify dev
```

This starts:
- **http://localhost:3000** - Access the app here (Netlify proxy)
- Port 3001 - Vite (internal, don't access directly)
- Port 9999 - Functions (internal, proxied through 3000)

### Config Files
- `netlify.toml` - `[dev]` section has port config
- `vite.config.js` - Must match `targetPort` in netlify.toml

### Common Issues
- **8888 port**: If you see localhost:8888, the config is wrong
- **Functions 500**: Check functions server logs, might be timeout (120s limit)
- **CORS errors**: Access via port 3000, not 3001

---

## Tech Stack

- Vue 3 + Vite + Tailwind CSS v4
- Pinia stores
- Supabase (auth + DB)
- Netlify Functions (serverless)
- Grok AI API (grok-3, via proxy function)
- Deployment: Github → Netlify (webhook)

## Key Directories

- `src/components/` - Vue components
- `src/stores/` - Pinia stores
- `src/services/` - API services
- `netlify/functions/` - Serverless functions

## Commands

- `netlify dev` - Start dev server
- `npm run build` - Build for production

## File Boundaries

**SAFE TO MODIFY**: `/src/`, `/netlify/functions/`, config files
**NEVER MODIFY**: `/node_modules/`, `/.git/`, `/dist/`, `.env` files

---

## Code Style

- Variables/Functions: camelCase
- Components: PascalCase
- Files: kebab-case
- Constants: SCREAMING_SNAKE_CASE
- Use `<script setup>` in Vue components
- Pinia for state management

## Implementation Guidelines

- DIRECT IMPLEMENTATION: Complete, working code - no mocks, stubs, or TODOs
- Keep existing working code intact when adding features
- Use extensive comments in code
- Modular, maintainable code structure

## Framework-Specific

- Component files: `<template>`, `<script setup>`, `<style>`
- Router in `src/router/index.js`
- Stores in `src/stores/` directory
- Tailwind v4: Different config than older versions - web search if needed
