# Mini-App Framework Verification Guide

## What Was Fixed

**Critical Issue**: The taskRegistry.js had duplicate object keys for `'social-1'`. In JavaScript, when an object has duplicate keys, the **last value wins**. This meant the OLD component was being loaded instead of the new mini-app.

```javascript
// BEFORE (broken):
const taskComponentMap = {
  'social-1': () => import('...GeneratePostsMiniApp.vue'),      // NEW (line 22)
  ...
  'social-1': () => import('...GeneratePostsTask.vue'),         // OLD (line 29) - THIS ONE WINS!
}

// AFTER (fixed):
const taskComponentMap = {
  'social-1': () => import('...GeneratePostsMiniApp.vue'),      // NEW (only instance)
}
```

Same issue with `setup-1` metadata - removed the duplicate old entry.

## How to Test

### Step 1: Clear Browser Cache
```
1. Open DevTools (F12 or Cmd+Opt+I on Mac)
2. Right-click the reload button → "Empty cache and hard refresh"
   OR manually: Ctrl+Shift+Delete, select "Cached images and files", Clear data
3. Go to http://localhost:3001 (or 3000, check terminal output)
```

### Step 2: Check TaskModal Console Logs
```
1. Open DevTools → Console tab
2. Click on the "Define Audience & Goals" task in the checklist
3. Watch the console output - you should see:

   ✓ [TaskModal] Loading task component for: setup-1
   ✓ [TaskModal] componentFn: ƒ () { ... }
   ✓ [TaskModal] Loading module...
   ✓ [TaskModal] Module loaded: {default: {...}, __viteHmrId: "..."}
   ✓ [TaskModal] Component assigned: DefineAudienceMiniApp
```

### Step 3: Verify Mini-App UI
When the modal opens, you should now see:
- **Left side**: Form with fields like:
  - Audience Overview
  - Industry
  - Company Size
  - Job Titles
  - Pain Points
  - Budget Range
  - Target Users (30 days)
  - Market Size
  - Notes
- **Right side**: AI Panel with "Generate" button
- **Bottom**: Save results section (empty initially)

**NOT this**: Just an AI-generated content modal with copy/paste buttons (that's the OLD component)

### Step 4: Test Form Functionality
```
1. Fill in a form field (e.g., "Tech startups" in Audience Overview)
2. Console should show auto-save in the project store
3. Click "Generate" on the AI Panel
4. Watch the progress bar from 0-100%
5. AI output should appear in the panel
6. Click "Save" to add it to the Results section
```

### Step 5: Test "Schedule Posts" Task
```
1. Click on the "Schedule Posts" (social-1) task
2. This should also now load the new GeneratePostsMiniApp
3. You should see fields like:
   - Platforms (checkboxes: X, LinkedIn, Instagram, etc.)
   - Tone (select)
   - CTA (text)
   - Post Count (number)
   - Content Focus (textarea)
   - Keywords (text)
   - Audience Context (textarea)
   - Notes (textarea)
```

## Expected vs Actual

### Expected (NEW Mini-App)
- Modal title: "🎯 Define Audience & Goals"
- Main content: **Form on left, AI panel on right**
- Form fills with data from projectStore
- Auto-save on field changes
- AI generates content → display in panel
- Can save multiple results and view them in OutputSection

### Actual Before Fix (OLD Component)
- Modal title: "🎯 Define Audience & Goals"
- Main content: **Just AI-generated text in a textarea**
- No form fields
- Copy/paste buttons for the generated content
- Outdated UI, no structured results saving

## Files Modified

1. **src/services/taskRegistry.js**
   - Removed duplicate `'social-1'` mapping in `taskComponentMap`
   - Removed duplicate `'social-1'` metadata entry
   - Both now correctly map to new mini-app components

## Files Added (Already Exist)

These were created in previous commits:
- `src/components/TaskMiniApps/DefineAudienceMiniApp.vue`
- `src/components/TaskMiniApps/GeneratePostsMiniApp.vue`
- `src/components/TaskMiniApps/core/MiniAppShell.vue`
- `src/components/TaskMiniApps/shared/FormBuilder.vue`
- `src/components/TaskMiniApps/shared/AIPanel.vue`
- `src/components/TaskMiniApps/shared/OutputSection.vue`
- `src/components/TaskMiniApps/configs/defineAudience.config.js`
- `src/components/TaskMiniApps/configs/generatePosts.config.js`

## Troubleshooting

### "Still seeing the old modal with just AI content"
1. Make sure cache is cleared (see Step 1)
2. Check console.log output (see Step 2) - what component is being assigned?
3. If still showing OLD component:
   - Check that `DefineAudienceMiniApp.vue` file exists: `ls src/components/TaskMiniApps/DefineAudienceMiniApp.vue`
   - Verify server is running: `npm run dev`
   - Check server is on correct port (3000 or 3001)

### "Network error or 404 for component"
1. Check Vite output for any build errors
2. Verify all mini-app components exist in `src/components/TaskMiniApps/`
3. Check imports in DefineAudienceMiniApp.vue are correct

### "Form appears but doesn't work (no auto-save, AI doesn't generate)"
1. Open DevTools Network tab → look for fetch requests to `/.netlify/functions/grok-proxy`
2. Check Netlify functions are running: `npm run netlify:serve` (separate terminal)
3. Check grok-proxy.js for any errors

## Next Steps After Verification

Once you confirm the mini-app loads and works:

1. Create mini-app configs for the remaining 18 tasks
2. Update taskRegistry to use new mini-apps for other tasks
3. Test all workflows (form → AI → save → results)
4. Deploy to production

---

**Summary**: The critical bug was a duplicate JavaScript object key. It's now fixed and the new mini-app framework should load correctly. Test by following the steps above.
