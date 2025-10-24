# 🚀 Mini-App Testing - Quick Start Guide

## 📖 TL;DR - Test It Now!

1. **Open browser:** http://localhost:3000
2. **Create/open a project**
3. **Look for these new tasks:**
   - 🎯 "Define Target Audience (v2)"
   - 📱 "Generate Social Posts (v2)"
4. **Click one to open the mini-app**
5. **Fill in the form → Click "Generate with AI" → See the magic!**

---

## 🎯 Test Scenario 1: Define Target Audience

### Step 1: Open the Task
- Click on project
- Find and click "Define Target Audience (v2)" task
- Or search for task ID: `setup-1-mini`

### Step 2: Fill the Form
Fill in these fields (any text works for testing):
```
Audience Overview:      "SaaS startup founders who need better analytics"
Industry:               "Software/SaaS"
Company Size:           "Startup (1-20 employees)"
Job Titles:             "CTO, Founder, Product Manager"
Pain Points:            "Hard to track metrics, need real-time dashboards"
Budget Range:           "$100-500/month"
Target Users:           "150"
Market Size:            "TAM: $2B, SAM: $500M, SOM: $50M"
Notes:                  "Focus on early-stage founders"
```

### Step 3: Generate with AI
- Click the blue "Generate with AI" button
- Wait for the loading progress bar (should take 5-10 seconds)
- See the AI-generated buyer persona and market analysis

### Step 4: Review Output
You should see:
- ✅ Detailed buyer persona with name, role, goals
- ✅ Key success metrics to reach this audience
- ✅ Top 3 channels to reach them
- ✅ Messaging strategy
- ✅ How to overcome objections

### Step 5: Save Results
- Click "📋 Copy" to copy the output
- Or click "✓ Use This" to save to results
- See it appear in the "Results & Save" section

---

## 📱 Test Scenario 2: Generate Social Posts

### Step 1: Open the Task
- Click on project
- Find and click "Generate Social Posts (v2)" task
- Or search for task ID: `social-1-mini`

### Step 2: Fill the Form
```
Platforms:        ✓ X/Twitter, ✓ LinkedIn, ✓ Instagram
Tone/Style:       "Casual & Friendly"
CTA:              "Try Now / Free Trial"
Post Count:       "2"
Content Focus:    "New feature launch - real-time analytics dashboard"
Keywords:         "analytics, SaaS, monitoring, insights"
Audience Context: "SaaS founders and product managers"
Notes:            "Focus on early adopters"
```

### Step 3: Generate with AI
- Click "Generate with AI"
- Wait for the progress indicator
- See posts generated for each platform

### Step 4: Review Posts
You should see:
- ✅ Posts grouped by platform
- ✅ X/Twitter posts (with character count, max 280)
- ✅ LinkedIn posts (professional tone)
- ✅ Instagram posts (hashtag-focused)
- ✅ Character limit warnings for posts that are too long

### Step 5: Save Posts
- Click "✓ Use This" to save selected posts
- Posts appear in "Results & Save" section
- Click "📥 Export JSON" to download all posts

---

## ✅ What Should Work

### Form Inputs
- [x] Text fields (type freely)
- [x] Textareas (multi-line text)
- [x] Select dropdowns (click to choose)
- [x] Checkboxes (select multiple options)
- [x] Number inputs (with min/max)
- [x] All changes auto-save

### AI Generation
- [x] Button shows "Generating..." with spinner
- [x] Progress bar fills up (0-100%)
- [x] API call to Grok AI completes
- [x] Response displays in formatted section
- [x] Character limits validated for social posts

### Results Management
- [x] Copy to clipboard button works
- [x] "Use This" saves to results section
- [x] Results display with timestamp
- [x] Delete individual results
- [x] Clear all results (with confirmation)
- [x] Export as JSON

---

## 🐛 If Something Breaks

### Issue: Form doesn't appear
**Solution:** Check browser console (F12) for errors. Likely import issue.
```bash
# Check if files exist:
ls -la /home/marc/DEV/sales/src/components/TaskMiniApps/
```

### Issue: "Generate with AI" button disabled
**Solution:** Form validation failing. Check if all required fields are filled.
Required fields marked with *

### Issue: AI generation hangs
**Solution:** Check if Netlify functions running:
```bash
lsof -i :9999  # Should show netlify functions
```

### Issue: Results not saving
**Solution:** Check browser console for errors. Likely storage issue.

### Issue: Wrong task loading
**Solution:** Make sure you're clicking the "(v2)" version:
- ✅ "Define Target Audience (v2)"
- ❌ "Define Audience & Goals" (old version)

---

## 🔍 Advanced Testing

### Test Character Limit Validation (Social Posts)
1. Fill form with short post content
2. Generate posts
3. Check Twitter/X posts are under 280 chars
4. Generate with longer content (fill content_focus with 200+ chars)
5. Should see warning if post exceeds limit

### Test Regeneration
1. Generate posts once
2. Click "🔄 Regenerate" button
3. See new posts generated
4. Compare with first generation

### Test Export
1. Save multiple posts
2. Click "📥 Export JSON" in Results section
3. JSON file downloads to Downloads folder
4. Open file to see structured data

### Test Form Validation
1. Try to generate without selecting platforms (Social Posts)
2. Button should stay disabled and show error message
3. Select a platform - button enables
4. Now you can generate

---

## 📊 Expected Performance

| Action | Expected Time | Status |
|--------|---------------|--------|
| Form loads | < 1 second | ✅ |
| Form auto-save | Instant | ✅ |
| AI generation | 5-10 seconds | ✅ |
| Results appear | < 1 second | ✅ |
| Export JSON | < 1 second | ✅ |

---

## 🎬 Visual Flow

### Define Audience Flow
```
┌─────────────┐
│  Open Task  │
└──────┬──────┘
       ↓
┌─────────────┐
│  Form loads │ (with 9 fields)
└──────┬──────┘
       ↓
┌─────────────┐
│ Fill fields │ (auto-save as you type)
└──────┬──────┘
       ↓
┌─────────────┐
│ Click "Gen" │ (blue button)
└──────┬──────┘
       ↓
┌──────────────────┐
│ Loading (5-10s)  │ (with progress bar)
└──────┬───────────┘
       ↓
┌──────────────┐
│ See output   │ (persona + analysis)
└──────┬───────┘
       ↓
┌──────────────────┐
│ Click "Use This" │ (save to results)
└──────┬───────────┘
       ↓
┌──────────────────┐
│ In Results list  │ (timestamped items)
└──────────────────┘
```

---

## 📝 Browser Console Tips

Open DevTools: **F12** or **Cmd+Option+I**

Check these to debug:
```javascript
// In Console tab, type:
localStorage.getItem('marketing-app-data')  // See stored app config
```

Check Network tab:
1. Open Network tab (Network)
2. Click "Generate with AI"
3. Look for request to `grok-proxy`
4. Should return status 200 with response

Check Console tab:
1. Open Console tab
2. Generate with AI
3. Should see no red errors
4. May see green logs from MiniAppShell

---

## ✨ Success = You See This

After clicking "Generate with AI" on **Define Audience**:

```
✅ Title: Generate Target Audience

✅ Form with fields populated

✅ Blue loading button "Generating... (45%)"

✅ After loading:
   "Generated successfully!"

   Detailed buyer persona with:
   - Name: [Name]
   - Role: [Title]
   - Pain Points: [Listed]
   - Goals: [Described]

   Key Success Metrics:
   - [Metric 1]
   - [Metric 2]

   Top 3 Channels to Reach Them:
   - Channel 1
   - Channel 2
   - Channel 3

✅ Buttons visible:
   [📋 Copy] [✓ Use This]

✅ After "Use This":
   Item appears in "Results & Save" section
```

---

## 🎯 Checklist Before Testing

- [ ] http://localhost:3000 is open
- [ ] Vite dev server is running (`npm run dev`)
- [ ] Netlify functions running on port 9999 (`netlify functions:serve --port 9999`)
- [ ] Grok API key is set in `.env.local`
- [ ] Network connection is stable
- [ ] App description is filled in project setup
- [ ] No console errors (F12 → Console tab)

---

## 🎉 You're Ready!

Go to http://localhost:3000 and test the mini-apps now!

Report any issues and we'll fix them together.

**Happy testing! 🚀**
