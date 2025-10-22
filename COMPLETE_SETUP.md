# Sales Dashboard - Setup Guide

## ✅ What's Already Done

- ✅ Supabase database configured
- ✅ Authentication (signup/login) working
- ✅ Data persistence to Supabase
- ✅ Grok AI integration
- ✅ Netlify serverless function ready
- ✅ Tailwind CSS styled

---

## 🚀 What You Need to Do: 2 Steps

### Step 1: Install Netlify CLI

```bash
# Install globally
npm install -g netlify-cli

# Login to your Netlify account
netlify login

# Link your project (run from /home/marc/DEV/sales)
cd /home/marc/DEV/sales
netlify link
```

Verify it worked:
```bash
netlify --version
```

---

### Step 2: Run the App

#### **Option A: Basic Testing (No Grok AI)**
```bash
npm run dev
```
- App runs on http://localhost:3000
- Auth works ✅
- Data saves to database ✅
- Grok AI won't work ❌ (needs Netlify functions)

#### **Option B: Full Testing (With Grok AI) - RECOMMENDED**
```bash
# Make sure no other npm dev is running, then:
netlify dev
```
- App runs on http://localhost:3000
- Auth works ✅
- Data saves to database ✅
- Grok AI works ✅ (Netlify functions enabled)

---

## 🧪 Testing Checklist

After running `netlify dev`, test:

- [ ] **Sign Up**: Create account → should auto-login
- [ ] **App Description**: Type something → refresh page → still there?
- [ ] **Check Tasks**: Check a few → refresh page → still checked?
- [ ] **Sign Out/In**: Sign out → login with same email → data still there?
- [ ] **Grok AI**: Click "✨ Generate Advice" → should see AI-generated marketing advice

---

## 📁 Project Structure

```
src/
├── components/
│   └── Dashboard.vue     ← Main app (with Grok button)
├── services/
│   ├── db.js            ← Database queries
│   └── grok.js          ← Grok API calls
├── stores/
│   └── authStore.js     ← Auth state
└── utils/
    └── supabase.js      ← Supabase client

netlify/functions/
└── grok-proxy.js        ← Serverless Grok proxy

.env                      ← Your API keys
netlify.toml             ← Netlify config
```

---

## 🔧 Troubleshooting

### Grok AI not working?
- Are you using `netlify dev` (not `npm run dev`)? ← Check this first!
- Is `GROK_API_KEY` in your `.env`?
- Check browser console (F12) for errors

### Data not saving?
- Are you logged in? (see email in top right)
- Check Supabase dashboard for tables
- Open DevTools Network tab to see if requests are sent

### `netlify dev` won't start?
```bash
# Kill any existing process on port 3000
lsof -i :3000
kill -9 <PID>

# Then try again
netlify dev
```

---

## 📋 Environment Variables (`.env`)

Should already have:
```
VITE_SUPABASE_URL=https://aajllpghqmeulnvlruaj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
GROK_API_KEY=xai-...
```

If `GROK_API_KEY` is missing:
- Get it from https://x.ai/
- Add to `.env`
- Restart `netlify dev`

---

## 📊 Database Tables (Already Created)

1. **user_settings** - Stores app description & checklist
2. **category_notes** - Stores notes per category
3. **generated_content** - Stores AI-generated content

All with Row Level Security (RLS) - only users can access their own data.

---

## 🚀 Deployment (When Ready)

```bash
# Build
npm run build

# Deploy to Netlify
netlify deploy --prod
```

Add `GROK_API_KEY` to Netlify environment variables in dashboard.

---

## 🎯 That's It!

Just run `netlify dev` and start testing. Everything else is already set up! 🎉
