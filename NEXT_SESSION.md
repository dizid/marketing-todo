# Next Session - Quick Start

## What You Need to Know

**Yesterday's achievement**: Refactored entire task system from 2000+ lines to 400 lines component + 1400 lines configs. Everything auto-saves and modal works perfectly.

**Current blocker**: AI generation returns 500 error. Need to debug why.

---

## Quick Debug Steps

### Step 1: Start both servers
```bash
# Terminal 1
npm run dev

# Terminal 2
npx netlify functions:serve
```

Wait for both to be ready:
- Vite: "Local: http://localhost:3000/"
- Netlify: "Local dev server ready: http://localhost:9999"

### Step 2: Test in browser
1. Open http://localhost:3000
2. Login
3. Click any task (e.g., "Define Target Audience")
4. Fill in form fields
5. Click "Generate with AI"
6. Check browser console for error

### Step 3: Check Terminal 2 output
When you click Generate, Terminal 2 (Netlify) will show logs. Look for:
- `[grok-proxy] Calling Grok API...`
- `[grok-proxy] API response status: ...`
- Any error messages

---

## The Architecture (Quick Recap)

```
User clicks task
  → TaskModal looks up config from unifiedTasksMap
  → Passes config to UnifiedTaskComponent
  → UnifiedTaskComponent renders form from config.form
  → User types → auto-saves to Supabase ✓ WORKING
  → User clicks Generate → calls /.netlify/functions/grok-proxy ✗ BROKEN (500 error)
```

---

## Key Files

- `src/components/UnifiedTaskComponent.vue` - The component (400 lines)
- `src/configs/unifiedTasks.js` - All 21 tasks as JSON (1400 lines)
- `src/components/Task/TaskModal.vue` - Modal wrapper (simplified)
- `netlify/functions/grok-proxy.js` - API proxy

---

## What's Working

✓ Form rendering
✓ All input types (text, textarea, select, checkboxes, radio)
✓ Auto-save to Supabase
✓ Modal stays open while typing
✓ Results display
✓ Export button
✓ Build passes

---

## What's Broken

✗ AI generation (500 error from /.netlify/functions/grok-proxy)

---

## Most Likely Fix

The grok-proxy function is throwing an error in the try/catch block. The error could be:

1. **API key not loaded** → Check Netlify logs
2. **Request format issue** → Check what's being sent
3. **Grok API endpoint issue** → Check if it's reachable

Check line 195 of `netlify/functions/grok-proxy.js` - that's the catch block returning 500.

---

## If Stuck

1. Add console.log statements to UnifiedTaskComponent.generateAI() to see what request is being sent
2. Use curl to test the Netlify function directly:
   ```bash
   curl -X POST http://localhost:9999/.netlify/functions/grok-proxy \
     -H "Content-Type: application/json" \
     -d '{
       "model": "grok-2",
       "messages": [{"role": "user", "content": "Say hello"}],
       "temperature": 0.8,
       "max_tokens": 100
     }'
   ```
3. This will show you the actual error from the Netlify function

---

**Status**: Architecture complete, just need to fix the API proxy. Should be quick once you see the actual error.
