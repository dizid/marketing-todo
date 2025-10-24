# Quick Test - Mini-App Framework Fix

## TL;DR - 2 Minute Test

### 1. Clear Cache & Reload (30 seconds)
```
Press: Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
Select: "Cached images and files"
Click: Clear data
Then navigate back to http://localhost:3001 (or 3000)
```

### 2. Open DevTools & Click Task (30 seconds)
```
1. Press F12 (or Cmd+Opt+I on Mac) to open DevTools
2. Click the Console tab
3. Click the "🎯 Define Audience & Goals" task in your checklist
4. Look at the console - you should see these logs:

   ✓ [TaskModal] Loading task component for: setup-1
   ✓ [TaskModal] componentFn: ƒ
   ✓ [TaskModal] Loading module...
   ✓ [TaskModal] Module loaded: Object
   ✓ [TaskModal] Component assigned: DefineAudienceMiniApp  ← KEY LINE
```

### 3. Check the Modal (1 minute)
When the modal opens, it should show:

**LEFT SIDE** (Form Fields):
- Audience Overview [textarea]
- Industry [text]
- Company Size [select]
- Job Titles [text]
- Pain Points [textarea]
- Budget Range [text]
- Target Users (30 days) [number]
- Market Size [text]
- Notes [textarea]

**RIGHT SIDE** (AI Panel):
- Text: "Describe your audience"
- Big blue [Generate] button

**BOTTOM** (Once results are saved):
- List of saved results with [×] delete buttons
- [Clear All] button
- [Export as JSON] button

### 4. Test Form Field (30 seconds)
```
1. Type something in "Audience Overview" field
2. Click elsewhere to unfocus the field
3. Check browser DevTools → Storage → LocalStorage
4. Search for "sales" → your data should be there
   (proving auto-save works)
```

### 5. Test AI Generation (1 minute)
```
1. Fill in at least Audience Overview field
2. Click [Generate] button
3. Watch progress bar go 0 → 100%
4. AI output should appear in right panel
5. Click [Save] button in AI Panel
6. Result should move to bottom Results section
```

---

## Detailed Verification Checklist

| Test | Expected Result | Status |
|------|-----------------|--------|
| Cache cleared & page reloaded | App loads on 3001 | [ ] |
| DevTools console open | Console visible, no errors | [ ] |
| Click Define Audience task | Modal opens | [ ] |
| Console shows "DefineAudienceMiniApp" | Correct component loaded | [ ] |
| Form fields visible | All 9 fields show | [ ] |
| Type in Audience Overview | Text appears in field | [ ] |
| Click elsewhere | Field auto-saves (check localStorage) | [ ] |
| Click [Generate] | Progress bar starts | [ ] |
| Progress reaches 100% | AI response appears in right panel | [ ] |
| Click [Save] in AI panel | Result moves to bottom | [ ] |
| Click "Schedule Posts" task | Modal loads with different form | [ ] |
| Form fields show platforms | Checkboxes for X, LinkedIn, etc. | [ ] |

---

## What You're Testing

**Before Fix**: OLD modal (just AI content, no form)
- User clicks task
- Old DefineAudienceTask.vue loads
- Modal shows only AI-generated text
- No form fields, no structure, no results section

**After Fix**: NEW mini-app (form + AI panel + results)
- User clicks task
- New DefineAudienceMiniApp.vue loads
- Modal shows form on left, AI panel on right
- Form auto-saves
- AI generates content
- Results are saved and displayed

---

## Common Issues & Fixes

### Issue: Still seeing just AI content (old modal)

**Solution 1**: Clear cache more thoroughly
```
DevTools → Application tab
Left panel → Cache Storage → Delete all
OR
Settings (⚙️) → Clear site data → All
Then hard refresh (Ctrl+Shift+R)
```

**Solution 2**: Check console logs
- Are you seeing `[TaskModal] Component assigned: DefineAudienceMiniApp`?
- If not, the component loading failed
- Check if component file exists: `ls src/components/TaskMiniApps/DefineAudienceMiniApp.vue`

**Solution 3**: Verify server is running
```
Check terminal where you ran 'npm run dev'
Should show: "VITE v7.1.11 ready in X ms"
If not, run: npm run dev
```

### Issue: Form appears but no auto-save (values disappear on reload)

**Solution**:
1. Check projectStore is initialized: `localStorage.getItem('sales')`
2. Should show JSON object with project data
3. If empty, form auto-save may not be working
4. Check browser console for errors when typing

### Issue: [Generate] button doesn't work

**Solution**:
1. Check Netlify functions are running: `npm run netlify:serve` in another terminal
2. Check DevTools Network tab → see if request to `/.netlify/functions/grok-proxy` succeeds
3. If 404: Netlify functions not running
4. If 500: Check grok-proxy.js for errors

### Issue: "Ctrl+Shift+Delete doesn't work"

**Alternative approaches**:
```
1. DevTools → Application → Storage → SessionStorage → Right-click each entry → Delete
2. OR: Close all tabs of the app, open fresh tab, visit http://localhost:3001
3. OR: Open DevTools → ⚙️ Settings → Disable cache (while DevTools open)
```

---

## Expected File Structure

```
src/components/
├── TaskMiniApps/
│   ├── DefineAudienceMiniApp.vue         ← Wrapper for define-audience task
│   ├── GeneratePostsMiniApp.vue          ← Wrapper for generate-posts task
│   ├── core/
│   │   ├── MiniAppShell.vue              ← Main orchestrator (245 lines)
│   │   └── miniAppRegistry.js            ← Registry utility (41 lines)
│   ├── shared/
│   │   ├── FormBuilder.vue               ← Dynamic form (200 lines)
│   │   ├── AIPanel.vue                   ← AI generation UI (165 lines)
│   │   └── OutputSection.vue             ← Results display (103 lines)
│   └── configs/
│       ├── defineAudience.config.js      ← Task config (140 lines)
│       └── generatePosts.config.js       ← Task config (186 lines)
├── Task/
│   ├── TaskModal.vue                     ← Has debugging logs
│   └── ... (other old task components)
└── ...

services/
└── taskRegistry.js                       ← FIXED: No more duplicate keys
```

---

## Success Criteria

✅ Console shows `Component assigned: DefineAudienceMiniApp`
✅ Modal displays form fields (not just AI content)
✅ Form input auto-saves to localStorage
✅ [Generate] button triggers AI API call
✅ AI output appears in right panel
✅ [Save] button moves result to Results section
✅ "Schedule Posts" task shows different form fields

---

## Need Help?

Check these files in order:
1. **MINI_APP_VERIFICATION_GUIDE.md** - Detailed verification steps
2. **FIX_SUMMARY.md** - Technical details about what was fixed
3. **Browser Console** - Debug logs will tell you what's happening
4. **DevTools Network Tab** - Check if API calls are succeeding

---

**The Fix**: Removed duplicate object key `'social-1'` from taskRegistry.js that was preventing new mini-apps from loading.

**The Test**: Click "Define Audience & Goals" task and verify you see a form with fields, not just AI content.

**The Result**: If you see the form, the fix worked! 🎉
