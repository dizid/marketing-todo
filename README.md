# Sales Marketing Dashboard

A modern, full-stack sales dashboard with AI-powered marketing advice using Grok AI.

## ✨ Features

- 📝 **Smart Checklist** - 6 categories with 30+ pre-built marketing tasks
- 🎯 **Progress Tracking** - Visual progress bars and completion stats
- 💾 **Database Persistence** - All data saved to Supabase
- 🔐 **Authentication** - Secure signup/login with email
- 🤖 **Grok AI Integration** - AI-powered marketing advice generation
- 🎨 **Beautiful UI** - Tailwind CSS v4 responsive design
- 📤 **Export** - Export data as Markdown or JSON

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run the app
netlify dev  # (with Grok AI)
# or
npm run dev  # (basic, no Grok)
```

Visit http://localhost:3000 and sign up!

## 📖 Setup Instructions

**See COMPLETE_SETUP.md for full instructions:**
- Installing Netlify CLI
- Testing all features
- Troubleshooting
- Deployment

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vue 3 + Vite |
| Styling | Tailwind CSS v4 |
| State | Pinia (auth) |
| Routing | Vue Router |
| Backend | Supabase + Netlify Functions |
| AI | Grok API |
| Database | PostgreSQL (Supabase) |

## 🤖 How Grok AI Works

1. Click **"✨ Generate Advice"** on Dashboard
2. Your app description + progress sent to Grok
3. Get personalized marketing recommendations
4. Advice saved to database

**Requires:** `netlify dev` + `GROK_API_KEY` in `.env`

## 📁 Project Structure

```
src/
├── components/
│   ├── AuthForm.vue      # Login/signup
│   ├── Dashboard.vue     # Main app + Grok button
│   ├── ChecklistCategory.vue
│   └── ChecklistItem.vue
├── services/
│   ├── db.js            # Database queries
│   └── grok.js          # Grok API integration
├── stores/
│   └── authStore.js     # Auth state management
├── utils/
│   └── supabase.js      # Supabase client
└── router/
    └── index.js         # Route config

netlify/functions/
└── grok-proxy.js        # Serverless Grok proxy

.env                     # API keys
```

## 📊 Database Tables

All use Row Level Security (RLS) - users only access their own data.

| Table | Purpose |
|-------|---------|
| `user_settings` | App description & checklist data |
| `category_notes` | Notes per task category |
| `generated_content` | AI-generated content history |

## 🧪 Testing Checklist

- [ ] Sign up → auto-login to dashboard
- [ ] Fill app description → refresh → still there
- [ ] Check tasks → refresh → still checked
- [ ] Sign out → login → data persists
- [ ] Click "✨ Generate Advice" → see AI recommendations

## 📋 Commands

```bash
npm run dev       # Start dev server (no Grok)
netlify dev      # Start with Netlify functions (with Grok)
npm run build    # Build for production
```

## 🚀 Deployment

```bash
npm run build
netlify deploy --prod
```

Set `GROK_API_KEY` in Netlify environment variables.

## 🔧 Troubleshooting

**Grok not working?**
- Use `netlify dev` (not `npm run dev`)
- Check `GROK_API_KEY` in `.env`

**Data not saving?**
- Check you're logged in (email visible in header)
- Verify Supabase tables exist

**Can't login?**
- Verify Supabase credentials in `.env`
- Email confirmation is disabled (auto-confirms)

See **COMPLETE_SETUP.md** for more help.

## 📚 Documentation

- **COMPLETE_SETUP.md** - Full setup & troubleshooting
- **README.md** - This file

## 📝 License

MIT
