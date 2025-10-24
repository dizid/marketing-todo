# Quick Reference - Mini-App Framework

## 30-Second Summary

**Problem**: Generate button does nothing when clicked
**Solution**: Follow TEST_GENERATE_NOW.md to identify where the flow breaks

## Essential Commands

```bash
# Start dev server
npm run dev
# Port: 3001 (or 3000 if 3001 taken)

# Start Netlify functions (optional, for API testing)
npm run netlify:serve

# Check git status
git status

# View recent commits
git log --oneline -5
```

## Key Files (in order of importance)

| File | Purpose | Status |
|------|---------|--------|
| TEST_GENERATE_NOW.md | Step-by-step test instructions | Start here ⭐ |
| DEBUG_GENERATE_BUTTON.md | Troubleshooting guide | Use if tests fail |
| SESSION_HANDOFF.md | Detailed session summary | Reference |
| CURRENT_STATUS.md | Framework status | Reference |
| src/components/TaskMiniApps/core/MiniAppShell.vue | AI orchestrator (HAS LOGGING) | Being debugged |
| src/components/TaskMiniApps/shared/AIPanel.vue | Generate button (HAS LOGGING) | Being debugged |
| src/services/taskRegistry.js | Task component mapping | ✓ FIXED |

## Console Log Sequence

```
✓ Working flow:
[AIPanel] Generate button clicked
[MiniAppShell] Generate clicked
[MiniAppShell] Calling Grok API...
[MiniAppShell] API response status: 200
[AIPanel] Result received: "..."

✗ Problem: Where do logs stop?
```

## What's Working

✓ Mini-app component loads
✓ Form renders with 9 fields
✓ Form auto-saves
✓ Netlify API works
✓ Vite server running

## What's Not Working

✗ Generate button click (no logs or partial logs)
✗ AI output doesn't display (or isn't generated)

## Next Steps

1. **Follow TEST_GENERATE_NOW.md** (15 minutes)
   - Clear cache
   - Open DevTools
   - Click task
   - Fill form
   - Click Generate
   - Watch console

2. **Report findings**
   - Which console logs appear?
   - Which logs don't appear?
   - Any error messages?

3. **Debugging path**
   - No logs → Button click issue
   - Only [AIPanel] logs → Prop binding issue
   - Only up to API call → API failure
   - All logs successful → UI rendering issue

## File Locations

```
Project Root: /home/marc/DEV/sales/

Documentation:
- TEST_GENERATE_NOW.md ⭐ START HERE
- DEBUG_GENERATE_BUTTON.md
- SESSION_HANDOFF.md
- CURRENT_STATUS.md
- QUICK_REFERENCE.md (this file)

Mini-App Framework:
- src/components/TaskMiniApps/
  ├── DefineAudienceMiniApp.vue
  ├── GeneratePostsMiniApp.vue
  ├── core/MiniAppShell.vue ← HAS LOGGING
  ├── shared/AIPanel.vue ← HAS LOGGING
  ├── shared/FormBuilder.vue
  ├── shared/OutputSection.vue
  ├── configs/defineAudience.config.js
  └── configs/generatePosts.config.js

Registry:
- src/services/taskRegistry.js ✓ FIXED

Modal:
- src/components/Task/TaskModal.vue
```

## Common Issues

| Problem | Solution |
|---------|----------|
| Button disabled | Fill in form field first |
| No console logs | Hard refresh (Ctrl+Shift+Delete) |
| 404 errors | Run `npm run netlify:serve` |
| Output missing | Check console logs, scroll modal |

## Test Checklist

- [ ] Dev server running (`npm run dev`)
- [ ] Page reloaded (Ctrl+Shift+R)
- [ ] DevTools open (F12)
- [ ] Console tab selected
- [ ] Task clicked
- [ ] Form filled
- [ ] Generate button clicked
- [ ] Console logs reviewed
- [ ] Findings documented

## Success Criteria

When Generate works:
```
✓ Progress bar fills 0-100%
✓ Takes 30-60 seconds
✓ Output appears in modal
✓ "Generated successfully!" message shows
✓ Copy/Use buttons appear
```

## Emergency Shortcuts

```bash
# Kill all node processes if stuck
pkill -f "npm run dev"
pkill -f "netlify"

# Start fresh
rm -rf node_modules/.vite
npm run dev

# Check what's on port 3001
lsof -i :3001

# View last 50 lines of build output
tail -50 /tmp/dev-server-final.log
```

## Most Important Link

👉 **Start here**: `TEST_GENERATE_NOW.md`

Takes 15 minutes, identifies the exact problem

---

**TL;DR**: Run `npm run dev`, follow TEST_GENERATE_NOW.md steps 1-7, share console logs showing where they stop.
