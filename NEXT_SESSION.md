# Next Session - Quick Start Guide

**Last Session Date**: 2025-11-11
**Current Status**: 76% Complete (7 of 9 phases done)
**Blockers**: None

---

## Quick Status

✅ **What's Done**:
- Payment integration (PayPal upgrade and cancellation working)
- Public landing page (professional dark design)
- Subscription management page (UI complete)
- QA test plan (200+ test cases defined)
- 3 of 21 task configurations with What/Why/How

⏳ **What's Next**:
1. Complete Phase 7 (18 remaining tasks - 2-3 hours)
2. Run Phase 9 QA tests (200+ test cases - 4-6 hours)
3. Fix any bugs found (2-4 hours)
4. Launch preparation (2-4 hours)

---

## Start Next Session in 3 Steps

### Step 1: Start Dev Server
```bash
cd /home/marc/DEV/sales
npm run dev
```
Server runs at `http://localhost:3000`

### Step 2: Open Current Status
- Read: `SESSION_SUMMARY_2025_11_11.md` (what was done)
- Read: `PHASE_9_QA_TEST_PLAN.md` (what to test)
- Read: `PROJECT_STATUS_UPDATE.md` (detailed status)

### Step 3: Pick Your Focus
- **Option A**: Complete Phase 7 (add What/Why/How to 18 tasks)
- **Option B**: Run QA tests (execute test plan)
- **Option C**: Both in parallel

---

## Key Files by Feature

### Payment & Subscriptions
- `src/services/paypalService.js` - Payment orchestration
- `src/stores/subscriptionStore.js` - Subscription state
- `src/components/ManageSubscriptionPage.vue` - Subscription UI
- `netlify/functions/paypal-create-subscription.js` - Create PayPal subscription
- `netlify/functions/paypal-cancel-subscription.js` - Cancel PayPal subscription
- `netlify/functions/paypal-webhook.js` - Handle PayPal webhooks

### Public Facing
- `src/components/LandingPage.vue` - Marketing landing page
- `src/router/index.js` - Routes (includes auth guards)

### Tasks & Config
- `src/configs/unifiedTasks.js` - Task definitions (21 tasks, 3 updated)
- `src/configs/connectAccounts.config.js` - Connect accounts mini app

### Headers & Navigation
- `src/components/Project/ProjectHeader.vue` - Dashboard header (has subscription button)

---

## Architecture Overview

```
Frontend (Vue 3)
├── Routes: /, /landing, /auth, /app, /app/subscription
├── Components: LandingPage, ManageSubscriptionPage, Dashboard, etc.
├── Stores: authStore, subscriptionStore, projectStore
└── Services: paypalService, apiService

Backend (Netlify Functions)
├── paypal-create-subscription.js
├── paypal-cancel-subscription.js
├── paypal-webhook.js
└── ai-generate.js

Database (Supabase)
├── subscriptions table (user tier, quota, billing dates)
├── users table (email, auth)
└── projects table (user's projects/tasks)
```

---

## What to Test First (Recommended)

### Critical Path Tests (30 mins)
1. **PayPal Upgrade Flow**
   - Login as free user
   - Click "Upgrade to Premium" button
   - Verify redirect to PayPal
   - Complete payment
   - Hard refresh
   - Verify tier = Premium, quota = 200

2. **Cancel Subscription Flow** ← JUST FIXED
   - Login as premium user
   - Go to `/app/subscription`
   - Click "Cancel Premium Subscription"
   - Confirm cancellation
   - Verify success toast
   - Verify tier = Free, quota = 20

3. **Landing Page**
   - Load `/` (should show landing page, not dashboard)
   - If logged in, click "Dashboard" button (should go to `/app`)
   - Test pricing section (should be able to scroll to it)

### Full QA Test Suite (4-6 hours)
See `PHASE_9_QA_TEST_PLAN.md` for 200+ detailed test cases organized in 11 sections.

---

## Phase 7 Completion (18 Tasks Remaining)

### Already Done (3 tasks):
1. defineAudienceTask - Define Target Audience
2. generatePostsTask - Generate Social Media Posts
3. defineGoalsTask - Define Marketing Goals

### Still Need What/Why/How (18 tasks):
- writeBlog
- designGraphics
- engageFollowers
- giveaway
- videoScript
- communityPosts
- outreach
- webinar
- feedbackCollection
- changelog
- featurePrioritization
- analyticsSetup
- channelAnalyzer
- roiCalculator
- executiveSummary
- landingPageCreatorAssistant
- [2 more - check unifiedTasks.js]

### Pattern to Follow
Each task needs these three fields added:
```javascript
{
  id: 'task-id',
  name: 'Task Name',
  // ... existing fields ...

  // ADD THESE THREE:
  tier: 'free' or 'premium',
  what: 'Description of what user creates/does (1-2 sentences)',
  why: 'Why this task matters / business impact (1-2 sentences)',
  how: 'Step-by-step how to complete (3-5 bullet points or sentences)'
}
```

See `unifiedTasks.js` lines with `defineAudienceTask`, `generatePostsTask`, `defineGoalsTask` for examples.

---

## Common Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check

# List available scripts
cat package.json | grep scripts
```

---

## Important Notes

### PayPal Settings
- **Mode**: Development (using sandbox credentials)
- **Client ID**: In `.env` as `VITE_PAYPAL_CLIENT_ID`
- **Client Secret**: In `.env` as `PAYPAL_CLIENT_SECRET`
- **Plan ID**: `P-PREMIUM-MONTHLY-19USD` ($19/month)

### Database (Supabase)
- **URL**: In `.env` as `VITE_SUPABASE_URL`
- **Key**: In `.env` as `VITE_SUPABASE_ANON_KEY`
- **Service Role Key**: In `.env` as `SUPABASE_SERVICE_ROLE_KEY` (for functions)

### Test User
- **Email**: Your test email (set up in Supabase auth)
- **Tier**: Automatically free on signup
- **Can test**: Upgrade to premium, cancel subscription, quota usage

---

## Debugging Tips

### Payment Issues
- Check browser console for error messages
- Look at Network tab to see API calls
- Verify PayPal credentials in environment
- Check Netlify Functions logs

### Quota Issues
- Check `subscriptionStore` in Vue DevTools
- Verify database has correct user subscription record
- Check if monthly reset date is calculated correctly

### Routing Issues
- Verify auth guards in `router/index.js`
- Check user authentication status in `authStore`
- Clear browser cache if routes seem stuck

### Database Issues
- Verify RLS policies in Supabase
- Check user_id matches logged-in user
- Verify subscription table structure (see ARCHITECTURE.md)

---

## Git Workflow

```bash
# Before starting work, pull latest
git pull

# After making changes, check status
git status

# Review changes
git diff

# Stage changes
git add .

# Commit with message
git commit -m "description of changes"

# Push to remote
git push origin main
```

Latest commit should be something like:
```
[Session 2025-11-11] Fix payment flows, add landing page, create QA plan
```

---

## Success Criteria for Phase 9 (QA)

✅ **All Critical Tests Pass**:
- [ ] PayPal upgrade flow works
- [ ] Cancel subscription works
- [ ] Quota displays correctly
- [ ] Monthly reset works
- [ ] Landing page loads
- [ ] Auth flows work
- [ ] No console errors

✅ **QA Documentation**:
- [ ] Test results documented
- [ ] Any bugs logged with details
- [ ] Screenshots of issues
- [ ] Reproduction steps captured

✅ **Ready to Fix Issues**:
- [ ] Prioritize critical vs nice-to-have
- [ ] Time estimate for each fix
- [ ] Plan for retesting

---

## Success Criteria for Phase 7 (Task Config)

✅ **All 21 Tasks Updated**:
- [ ] Every task has `tier` field (free or premium)
- [ ] Every task has `what` field (description)
- [ ] Every task has `why` field (benefit/impact)
- [ ] Every task has `how` field (steps/instructions)

✅ **Tested in UI**:
- [ ] Tasks display correctly in sidebar
- [ ] Can click on task and see What/Why/How sections
- [ ] Text is clear and helpful

---

## Estimated Remaining Work

| Task | Est. Hours | Priority |
|------|-----------|----------|
| Phase 7 (18 tasks) | 2-3 | Medium |
| QA Testing (critical path) | 1-2 | High |
| QA Testing (full suite) | 4-6 | High |
| Bug Fixes (if needed) | 2-4 | High |
| Pre-Launch Prep | 2-3 | Medium |
| Production Deployment | 1-2 | Medium |
| **Total Remaining** | **12-20** | - |

**Timeline**: 2-3 days for QA + Phase 7, then ready for production.

---

## Contact/Reference

- **Full Session Summary**: `SESSION_SUMMARY_2025_11_11.md`
- **QA Test Plan**: `PHASE_9_QA_TEST_PLAN.md`
- **Architecture**: `ARCHITECTURE.md`
- **Status**: `PROJECT_STATUS_UPDATE.md`
- **Previous Phase 6**: `PHASE_6_COMPLETION_SUMMARY.md`

---

**Good luck with the next session! Everything is in place for a smooth continuation.**

If you encounter any issues, check the Session Summary for detailed context about what was built and why.
