# Test: Generate Button - Step by Step

## What to Do Right Now

### 1. Hard Refresh (30 seconds)
```
Press: Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
Wait: Page clears cache
Select: "Cached images and files"
Click: "Clear data"
Navigate: Back to http://localhost:3001
```

### 2. Open DevTools (30 seconds)
```
Press: F12 (or Cmd+Opt+I on Mac)
Look: For Console tab
Click: Console tab
Clear: Any existing messages (click 🚫 icon or type: clear())
```

### 3. Open the Task Modal (15 seconds)
```
Look for: "🎯 Define Audience & Goals" task in your checklist
Click: It
Wait: Modal opens with form fields on left, AI panel on right
Verify: You see input fields like "Audience Overview", "Industry", etc.
```

### 4. Fill in Form Data (30 seconds)
```
Click: "Target Audience Overview" textarea
Type: "Tech startups that need to scale their marketing"
Press: Tab (or click elsewhere to trigger auto-save)
Check: Console should show some activity (save events)
```

### 5. Click Generate Button (15 seconds)
```
Look for: Blue "Generate with AI" button on the right side
Verify: Button is NOT disabled (should be bright blue, not gray)
Click: The "Generate with AI" button
Wait: Progress bar starts (should go 0 → 100%)
```

### 6. Watch Console Logs (30-60 seconds)
```
After clicking Generate, look at console.
You should see this sequence:

[AIPanel] Generate button clicked
[AIPanel] generateFn: ƒ generateAIOutput()
[AIPanel] isValid: true
[AIPanel] Calling generateFn...

[MiniAppShell] Generate clicked
[MiniAppShell] formData: {audience_overview: "Tech startups...", ...}
[MiniAppShell] Calling Grok API...

(progress bar fills)

[MiniAppShell] API response status: 200
[MiniAppShell] Response text: "Based on your target audience..."
[AIPanel] Result received: "Based on your target audience..."
```

### 7. Check for Output
```
Wait: 30-60 seconds for API to respond
Watch: Progress bar in modal should reach 100%
Look: Below the Generate button, output should appear
See: Generated personas, success message, Copy/Use buttons
```

---

## What to Do If Nothing Happens

### Scenario 1: Button Click Causes No Console Output
**This means the button click isn't being registered**

```
1. Check if button is visible (should be blue)
2. Check if button is enabled (not grayed out)
3. Try clicking it again
4. Check console for RED ERROR messages
5. Report: "Button click produces no console logs"
```

### Scenario 2: Console Shows Only `[AIPanel]` Logs
**This means the function isn't being called**

```
Look at: [AIPanel] generateFn:
If it shows: undefined → prop binding broken
If it shows: ƒ function() → prop passed correctly, so MiniAppShell logs should appear

Report: What generateFn shows + screenshot
```

### Scenario 3: Logs Go Up to `[MiniAppShell] Calling Grok API...` Then Stop
**This means the API call failed**

```
Look for: [MiniAppShell] API response status:
If you see: 404 → Netlify functions not running
If you see: 500 → Server error
If you see: other number → different error

To fix 404:
1. Open new terminal
2. Run: npm run netlify:serve
3. Try Generate again

Report: What status code appears
```

### Scenario 4: All Console Logs Appear But No Output in UI
**This means generation worked but output isn't displaying**

```
Look for: [AIPanel] Result received: "..."
If shown: Generation worked, UI update issue
Check:
1. Is there an error message showing instead?
2. Can you scroll down in the modal?
3. Is output off-screen or hidden?

Report: "All logs successful, output doesn't appear"
```

---

## Quick Diagnostic Checklist

Copy one of these messages to report what's happening:

**✗ Button does nothing**
- No console logs appear
- Button is visible and clickable
- No error messages

**✗ Only AIPanel logs, no MiniAppShell logs**
- [AIPanel] logs appear
- [MiniAppShell] logs don't appear
- What does [AIPanel] generateFn show?

**✗ API call fails**
- Logs go to: `[MiniAppShell] API response status: 404`
- (or other status code)
- Netlify functions not running?

**✗ Generation works, output missing**
- All console logs appear successfully
- [AIPanel] Result received shows content
- But output doesn't appear in modal UI

**✓ Works!**
- Output appears in 30-60 seconds
- Progress bar reaches 100%
- I see generated content in the modal

---

## Expected Console Output (Full)

If everything works, you should see this:

```
[TaskModal] Loading task component for: setup-1
[TaskModal] componentFn: ƒ () { ... }
[TaskModal] Loading module...
[TaskModal] Module loaded: Object { default: {…}, __viteHmrId: "…" }
[TaskModal] Component assigned: DefineAudienceMiniApp

(you click Generate)

[AIPanel] Generate button clicked
[AIPanel] generateFn: ƒ generateAIOutput()
[AIPanel] isValid: true
[AIPanel] Calling generateFn...

[MiniAppShell] Generate clicked
[MiniAppShell] formData: Object { audience_overview: "Tech startups...", industry: "", ... }
[MiniAppShell] taskConfig: Object { id: "define-audience", title: "Define Target Audience", ... }
[MiniAppShell] aiConfig: Object { promptTemplate: "Based on...", temperature: 0.8, maxTokens: 1500 }
[MiniAppShell] Original prompt template: "Based on the following audience information..."
[MiniAppShell] Processed form data: Object { audience_overview: "Tech startups...", ... }
[MiniAppShell] Replacing placeholders...
[MiniAppShell] Replacing {audience_overview} with Tech startups that need to scale...
[MiniAppShell] Final prompt: "Based on the following audience information...\n\nAudience Overview: Tech startups..."
[MiniAppShell] Calling Grok API...

(progress bar reaches ~90%)

[MiniAppShell] API response status: 200
[MiniAppShell] API response data: Object { id: "...", object: "chat.completion", created: 1234567890, ... }
[MiniAppShell] Response text: "Buyer Persona:\n\nName: David Chen\nRole: Engineering Manager..."
[MiniAppShell] Final output: "Buyer Persona:\n\nName: David Chen..."
[AIPanel] Result received: "Buyer Persona:\n\nName: David Chen..."
```

Then in the modal:
- Progress bar reaches 100%
- Output section shows the generated personas
- "Generated successfully!" message appears
- Copy and Use buttons are clickable

---

## How to Share Logs

If you see errors or problems:

1. **Take a screenshot** of the console showing the logs
2. **Copy the last 10 logs** from the console:
   - Right-click log line
   - Copy message
   - Paste in chat
3. **Report what you expect vs what happened**

Example report:
```
When I click Generate:
- ✓ [AIPanel] logs appear
- ✗ [MiniAppShell] logs don't appear
- Logs stop at: [AIPanel] Calling generateFn...
- [AIPanel] generateFn: ƒ (shown in console)
- No error messages
```

---

## Common Issues & Quick Fixes

| Issue | Check | Fix |
|-------|-------|-----|
| Button is grayed out | Is form empty? | Fill in "Audience Overview" field |
| No console logs | Click browser reload | Hard refresh (Ctrl+Shift+R) |
| 404 error | Is Netlify running? | Run: `npm run netlify:serve` |
| Generation works but output hidden | Scroll down in modal | Modal might be displaying output below viewport |
| All logs successful but nothing changes | Component update issue | Reload page completely |

---

## Test Summary

This test verifies:
- ✓ Mini-app component loads (form visible)
- ✓ Form auto-save works
- ✓ AIPanel component is connected
- ✓ MiniAppShell receives and processes form data
- ✓ Prompt template correctly substitutes form values
- ✓ Grok API receives request and responds
- ✓ Output is returned to UI and displayed

If ALL these work → Mini-app framework is fully functional!
If any fail → Tell me which logs appear and stop, I'll fix it!

---

**Ready? Follow steps 1-7 above and let me know what the console shows!**
