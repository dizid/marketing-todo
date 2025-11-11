# Phase 9: QA & Launch - Comprehensive Test Plan

**Project**: TaskMaster Marketing App (Freemium Model)
**Date**: 2025-11-11
**Tester**: QA Team
**Coverage**: Payment flow, subscription management, quota system, user journeys
**Duration**: 2-3 days

---

## Test Environment Setup

### Prerequisites
- [ ] Test account credentials ready
- [ ] PayPal sandbox account configured
- [ ] Supabase test database available
- [ ] Browser dev tools open (for error checking)
- [ ] Network tab monitoring enabled
- [ ] Console logs clear at start

### Test Data Setup
```javascript
// Test accounts to create:
1. Free User: free-user@test.com
2. Premium User: premium-user@test.com
3. Admin: admin@test.com
```

---

## Part 1: Payment Flow Testing

### 1.1: PayPal Subscription Creation
**Objective**: Verify user can initiate PayPal subscription

**Test Steps**:
1. [ ] Sign up as free user → `free-user@test.com`
2. [ ] Dashboard loads with free tier badge
3. [ ] Click "Upgrade to Premium" button
4. [ ] Modal appears: "Upgrading to Premium..."
5. [ ] Redirected to PayPal approval URL
6. [ ] Verify redirect URL includes:
   - [ ] `returnUrl=...&upgrade=success`
   - [ ] `subscription_id` parameter
   - [ ] `payer` parameter (mock mode)

**Expected Results**:
- ✅ No JavaScript errors in console
- ✅ Network request to `/.netlify/functions/paypal-create-subscription` succeeds (200)
- ✅ Response includes `approvalUrl`
- ✅ Subscription record created in database with `status: 'active'`

**Related Files**:
- `PremiumUpgradeButton.vue:115-132`
- `paypalService.js:40-86`
- `paypal-create-subscription.js`

---

### 1.2: PayPal Return & Upgrade Success
**Objective**: Verify user correctly upgraded after PayPal approval

**Test Steps**:
1. [ ] User returns from PayPal with `?upgrade=success&subscription_id=xxx&payer=xxx`
2. [ ] PremiumUpgradeButton detects return parameters
3. [ ] Calls `upgradeToPresentation()` to fetch subscription
4. [ ] Page shows success notification
5. [ ] URL params cleared (history.replaceState)
6. [ ] Dashboard refreshes

**Expected Results**:
- ✅ NO 406 error in console (this was the bug we fixed!)
- ✅ User tier changed to "premium" in dashboard
- ✅ Quota limit changed from 20 to 200
- ✅ Subscription page shows Premium badge
- ✅ "Upgrade" button replaced with "Cancel Subscription"

**Failure Scenarios to Test**:
- [ ] What if subscription_id is missing? → Should show error
- [ ] What if hard refresh on return URL? → Should fetch subscription and succeed
- [ ] What if user already premium? → Should handle gracefully

**Related Files**:
- `PremiumUpgradeButton.vue:142-173`
- `subscriptionStore.js:245-282`
- `paypal-create-subscription.js:128-134`

---

### 1.3: Mock vs Real PayPal Mode
**Objective**: Verify app works in both dev (mock) and production (real)

**Test Scenarios**:

#### Dev Mode (Mock)
- [ ] `PAYPAL_CLIENT_ID` starts with `AUO3` or is missing
- [ ] Mock token generated: `mock-access-token-{timestamp}`
- [ ] Mock subscription ID: `I-{random}`
- [ ] Subscription record created with `paypal_payer_id: 'MOCK_PAYER'`
- [ ] All flows work normally (no API calls to real PayPal)

#### Production Mode (Real)
- [ ] `PAYPAL_CLIENT_ID` is real credential
- [ ] Real token fetched from PayPal API
- [ ] Real subscription created via PayPal API
- [ ] Subscription record created with real payer ID
- [ ] Webhook events received for status updates

**Related Files**:
- `paypal-create-subscription.js:39-47`
- `paypal-create-subscription.js:122-140`

---

## Part 2: Subscription Management Testing

### 2.1: Manage Subscription Page - Free User
**Objective**: Verify free user sees upgrade option and comparison

**Test Steps**:
1. [ ] Sign in as free user
2. [ ] Click "💳 Subscription" button in header
3. [ ] Navigate to `/app/subscription`
4. [ ] Page loads successfully
5. [ ] Current Plan shows: "Free" badge + "Active" status
6. [ ] Quota display: "0 / 20" (no usage yet)
7. [ ] Reset date: shows next month's first day
8. [ ] See comparison table: Free vs Premium
9. [ ] "Upgrade" button visible and clickable

**Expected Results**:
- ✅ Page fully responsive (mobile/tablet/desktop)
- ✅ All stats accurate
- ✅ Clicking "Upgrade" redirects to PayPal
- ✅ No console errors

**Related Files**:
- `ManageSubscriptionPage.vue:1-100`
- `/app/subscription` route

---

### 2.2: Manage Subscription Page - Premium User
**Objective**: Verify premium user sees cancellation option and billing details

**Test Steps**:
1. [ ] Sign in as premium user (or upgrade as above)
2. [ ] Click "💳 Subscription" button
3. [ ] Navigate to `/app/subscription`
4. [ ] Current Plan shows: "⭐ Premium" badge + "Active" status
5. [ ] Quota display: "X / 200" (X = actual usage)
6. [ ] Progress bar shows usage percentage (color-coded)
7. [ ] Reset date: shows next month's first day
8. [ ] "Cancel Premium Subscription" button visible
9. [ ] Back button returns to dashboard

**Expected Results**:
- ✅ All stats display correctly
- ✅ Color-coded progress bar: green (0-50%), yellow (50-75%), orange (75-90%), red (90-100%)
- ✅ Cancel button shows confirmation dialog
- ✅ No console errors

**Related Files**:
- `ManageSubscriptionPage.vue:100-250`

---

### 2.3: Subscription Cancellation Flow
**Objective**: Verify premium user can cancel and revert to free

**Test Steps**:
1. [ ] Premium user navigates to `/app/subscription`
2. [ ] Clicks "Cancel Premium Subscription"
3. [ ] Sees confirmation dialog: "Are you sure?"
4. [ ] Clicks "Yes, Cancel" button
5. [ ] Cancellation processes
6. [ ] Success notification appears
7. [ ] Page redirects to dashboard after 2 seconds
8. [ ] Dashboard shows "Free" tier
9. [ ] Quota reset to 20/month

**Expected Results**:
- ✅ No console errors
- ✅ Database updated: `tier: 'free'`, `status: 'cancelled'`
- ✅ Subscription store updated
- ✅ UI refreshed immediately
- ✅ "Cancel" button replaced with "Upgrade"

**Failure Scenarios**:
- [ ] Cancel then try again immediately → should show "No active subscription"
- [ ] Cancel while quota exhausted → should still work
- [ ] Cancel then upgrade again → should create new record

**Related Files**:
- `ManageSubscriptionPage.vue:224-268`
- `subscriptionStore.js:287-335`
- `paypalService.js:132-174`

---

## Part 3: Quota System Testing

### 3.1: Quota Enforcement on Free User
**Objective**: Verify free user (20/month) cannot exceed quota

**Test Steps**:
1. [ ] Free user with 20 quota available
2. [ ] Dashboard shows: "0 / 20 used"
3. [ ] Click "Generate Post" (or any AI feature)
4. [ ] AI generation succeeds
5. [ ] Quota decrements: "1 / 20 used"
6. [ ] Repeat 19 more times → "20 / 20 used"
7. [ ] Attempt 21st generation → blocked with error modal
8. [ ] Modal shows: "Quota Exceeded"
9. [ ] "Upgrade to Premium" button visible in modal

**Expected Results**:
- ✅ Quota tracked accurately
- ✅ 21st attempt blocked BEFORE API call (saves cost)
- ✅ Error message clear and helpful
- ✅ Quota status updates in real-time

**Related Files**:
- `subscriptionStore.js:57-66` (quota calculations)
- `aiQuotaService.js` (quota enforcement)
- `QuotaExceededModal.vue`

---

### 3.2: Quota Enforcement on Premium User
**Objective**: Verify premium user (200/month) has higher limit

**Test Steps**:
1. [ ] Premium user with 200 quota available
2. [ ] Dashboard shows: "0 / 200 used"
3. [ ] Generate 50 posts → "50 / 200 used"
4. [ ] Progress bar at 25% (green)
5. [ ] Generate 100 more → "150 / 200 used"
6. [ ] Progress bar at 75% (yellow)
7. [ ] Generate 50 more → "200 / 200 used"
8. [ ] Progress bar at 100% (red)
9. [ ] Attempt 201st → blocked like free user

**Expected Results**:
- ✅ Quota calculation correct
- ✅ Color transitions: green → yellow → orange → red
- ✅ All 200 generations allowed
- ✅ Blocked on 201st

**Related Files**:
- `subscriptionStore.js:40-42` (free/premium quotas)
- `QuotaStatusCard.vue`

---

### 3.3: Monthly Quota Reset
**Objective**: Verify quota resets on 1st of month

**Test Steps** (using system time manipulation):
1. [ ] Free user generates 10 posts in November
2. [ ] Shows "10 / 20 used"
3. [ ] System time advanced to December 1st
4. [ ] Page refreshed
5. [ ] Shows "0 / 20 used" (reset!)
6. [ ] Premium user with 150/200 used in November
7. [ ] Time advanced to December 1st
8. [ ] Shows "0 / 200 used" (reset!)

**Expected Results**:
- ✅ Reset happens automatically on month boundary
- ✅ Works on page refresh
- ✅ Works across free and premium
- ✅ Historical data preserved (can see Nov usage if viewing analytics)

**How to Test**:
- Use browser DevTools to set system time
- Or modify subscription creation date in database
- Or wait until actual month change (slow)

**Related Files**:
- `subscriptionStore.js:44-55` (currentMonthUsage calculation)

---

## Part 4: User Journey Testing

### 4.1: Complete Free User Journey
**Objective**: Verify entire free user experience

**Test Steps**:
1. [ ] Unregistered user visits `/`
2. [ ] Sees landing page with "Get Started" button
3. [ ] Clicks "Get Started" → goes to `/auth`
4. [ ] Signs up with email: `journey-free@test.com`
5. [ ] Redirected to `/app` (dashboard)
6. [ ] Dashboard shows "Free" tier, "0 / 20" quota
7. [ ] Creates project and generates 20 posts
8. [ ] 21st attempt blocked → shows upgrade modal
9. [ ] Clicks "Upgrade to Premium" in modal
10. [ ] Redirected to PayPal
11. [ ] Completes PayPal approval (mock flow)
12. [ ] Returns to app as premium user
13. [ ] Generates 180 more posts (total 200)
14. [ ] Navigates to `/app/subscription`
15. [ ] Sees "⭐ Premium" badge
16. [ ] Clicks "Cancel Premium Subscription"
17. [ ] Confirms cancellation
18. [ ] Reverts to "Free" tier, "200 / 200" quota (at limit)
19. [ ] Cannot generate 201st post
20. [ ] Must wait for reset or upgrade

**Expected Results**:
- ✅ All transitions smooth
- ✅ No broken links or 404s
- ✅ Data persists across page reloads
- ✅ Quota tracked accurately throughout

**Testing Duration**: ~30 minutes

---

### 4.2: Complete Premium User Journey
**Objective**: Verify premium user experience from signup to cancellation

**Test Steps**:
1. [ ] Unregistered user visits `/`
2. [ ] Clicks "Get Started"
3. [ ] Signs up: `journey-premium@test.com`
4. [ ] Dashboard shows "Free" tier
5. [ ] Immediately navigates to `/app/subscription`
6. [ ] Clicks "Upgrade to Premium - $19/month"
7. [ ] Completes PayPal flow (mock)
8. [ ] Returns and sees "⭐ Premium" badge
9. [ ] Generates content freely (200/month)
10. [ ] Views subscription page showing premium stats
11. [ ] Sees "No Billing History" (first month)
12. [ ] Clicks "Cancel Premium Subscription"
13. [ ] Confirms cancellation
14. [ ] Reverts to "Free" tier, "200 / 200" quota (at limit)

**Expected Results**:
- ✅ Seamless upgrade experience
- ✅ Premium features immediately available
- ✅ Cancellation process smooth

**Testing Duration**: ~20 minutes

---

## Part 5: Landing Page Testing

### 5.1: Landing Page Functionality
**Objective**: Verify public landing page works correctly

**Test Steps**:
1. [ ] Unauthenticated user visits `/`
2. [ ] Sees landing page (not redirected)
3. [ ] Navigation bar visible with logo, Sign In, Get Started
4. [ ] Hero section with headline and CTAs
5. [ ] Scroll through: Features, Pricing, Comparison, FAQ
6. [ ] Click "View Pricing" → smoothly scrolls to pricing
7. [ ] Free plan card visible
8. [ ] Premium plan card with "POPULAR" badge
9. [ ] Click "Get Started Free" → goes to `/auth?mode=signup`
10. [ ] Click "Sign In" → goes to `/auth?mode=login`
11. [ ] Authenticated user visits `/` → redirects to `/app`

**Expected Results**:
- ✅ All sections render correctly
- ✅ Responsive design works on mobile
- ✅ Smooth scrolling works
- ✅ Auth redirects correct

**Related Files**:
- `LandingPage.vue`
- `router/index.js` (route `/`)

---

### 5.2: Pricing Table Accuracy
**Objective**: Verify pricing information is correct

**Test Steps**:
1. [ ] Free plan shows: $0/month, 20 AI generations
2. [ ] Premium plan shows: $19/month, 200 AI generations
3. [ ] Feature comparison table matches
4. [ ] FAQ answers are accurate
5. [ ] No typos or broken links

**Expected Results**:
- ✅ All pricing correct
- ✅ No errors in copy

---

## Part 6: Integration Testing

### 6.1: Auth → Dashboard → Subscription Flow
**Objective**: Verify seamless integration between components

**Test Steps**:
1. [ ] Sign up via landing page
2. [ ] Redirected to dashboard with auth guard
3. [ ] Navigate to subscription page
4. [ ] Navigate back to dashboard
5. [ ] Log out from header
6. [ ] Redirected to auth page
7. [ ] Sign in again
8. [ ] Back at dashboard with preserved data

**Expected Results**:
- ✅ Auth guards work correctly
- ✅ Session persisted across navigation
- ✅ No data loss on logout/login

---

### 6.2: Quota System Integration
**Objective**: Verify quota system works across all AI generation

**Test Components**:
1. [ ] QuotaStatusCard shows correct limits
2. [ ] AI generation respects quota
3. [ ] QuotaExceededModal triggers correctly
4. [ ] Upgrade button in modal works
5. [ ] ManageSubscriptionPage shows accurate quota

**Expected Results**:
- ✅ All components in sync
- ✅ Single source of truth in subscriptionStore

---

## Part 7: Error Handling & Edge Cases

### 7.1: Network Error Scenarios
**Objective**: Verify graceful handling of network failures

**Test Steps** (using browser DevTools):
1. [ ] Set network to "Offline"
2. [ ] Try to generate AI content → should show error
3. [ ] Set network to "Slow 3G"
4. [ ] Try to upgrade subscription → should timeout or show error
5. [ ] Restore network → should work normally

**Expected Results**:
- ✅ Error messages clear and helpful
- ✅ No infinite loading states
- ✅ User can retry

---

### 7.2: Data Inconsistency Scenarios
**Objective**: Verify system recovers from inconsistent state

**Test Steps**:
1. [ ] Manually delete subscription record from database
2. [ ] User tries to access `/app/subscription`
3. [ ] Should show appropriate error
4. [ ] User can upgrade to recreate

**Expected Results**:
- ✅ App doesn't crash
- ✅ Error message helpful
- ✅ User can recover

---

### 7.3: Race Condition: Concurrent Upgrades
**Objective**: Verify system handles user rapidly clicking upgrade

**Test Steps**:
1. [ ] Click "Upgrade to Premium" button 3 times rapidly
2. [ ] Should only create 1 subscription (idempotent with upsert)
3. [ ] Only 1 PayPal redirect

**Expected Results**:
- ✅ Button disabled after first click
- ✅ Only 1 request sent
- ✅ Only 1 subscription created (upsert logic)

---

## Part 8: Performance Testing

### 8.1: Page Load Times
**Objective**: Verify acceptable performance

**Test Metrics**:
- [ ] Landing page: < 2 seconds (First Contentful Paint)
- [ ] Dashboard: < 1 second
- [ ] Subscription page: < 1 second
- [ ] PayPal redirect: < 500ms

**How to Measure**:
- Use Chrome DevTools → Performance tab
- Or Lighthouse audit

**Related**:
- Images optimized?
- Bundle size reasonable?
- No N+1 queries?

---

### 8.2: Quota Calculation Performance
**Objective**: Verify quota math doesn't slow down app

**Test Steps**:
1. [ ] User with 10,000 AI usage records
2. [ ] Dashboard still loads quickly
3. [ ] Quota calculation doesn't block UI

**Expected Results**:
- ✅ Quota loads instantly (cached)
- ✅ No jank or freezing

---

## Part 9: Security Testing

### 9.1: Row Level Security (RLS)
**Objective**: Verify users only see their own data

**Test Steps**:
1. [ ] User A signs up and creates subscription
2. [ ] User B signs up
3. [ ] User B tries to access User A's subscription via API
4. [ ] Should be rejected (403 Forbidden)
5. [ ] User B can only see their own data

**How to Test**:
- Use browser DevTools to manually call API
- Or inspect network requests

**Related Files**:
- Database RLS policies

---

### 9.2: API Key Protection
**Objective**: Verify sensitive data is protected

**Test Steps**:
1. [ ] PayPal credentials not exposed in frontend
2. [ ] Service role key not sent to client
3. [ ] Only public keys used in browser

**How to Test**:
- View page source → no secrets
- Inspect network requests → no secrets

---

### 9.3: XSS Protection
**Objective**: Verify no injection vulnerabilities

**Test Steps**:
1. [ ] Try to inject script in form fields
2. [ ] E.g., in "Content Focus": `<script>alert('xss')</script>`
3. [ ] Should be escaped/sanitized
4. [ ] No alert should appear

**Expected Results**:
- ✅ Input properly sanitized
- ✅ No console errors

---

## Part 10: Browser Compatibility

### 10.1: Cross-Browser Testing
**Test on**:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

**Test Cases**:
- [ ] Landing page renders correctly
- [ ] Dashboard loads
- [ ] PayPal redirect works
- [ ] Forms submit
- [ ] No console errors

---

### 10.2: Mobile Responsiveness
**Test on**:
- [ ] iPhone 12 (375px width)
- [ ] iPad (768px width)
- [ ] Android (360px width)

**Test Cases**:
- [ ] Landing page mobile layout
- [ ] Dashboard mobile layout
- [ ] Subscription page mobile layout
- [ ] Forms usable on mobile
- [ ] Buttons properly sized (>44px)

---

## Part 11: Database & Webhooks

### 11.1: PayPal Webhook Handling
**Objective**: Verify webhook events update database

**Test Steps** (if PayPal webhooks configured):
1. [ ] Complete real PayPal flow
2. [ ] PayPal sends `BILLING.SUBSCRIPTION.ACTIVATED` webhook
3. [ ] Server receives and verifies signature
4. [ ] Database updated with subscription status
5. [ ] User can see updated status in app

**Expected Results**:
- ✅ Webhook received
- ✅ Signature verified (security)
- ✅ Database updated
- ✅ No errors in function logs

---

### 11.2: Database State Verification
**Objective**: Verify all tables properly updated

**Test Steps**:
1. [ ] User upgrades to premium
2. [ ] Check `subscriptions` table:
   - [ ] User has 1 record
   - [ ] `tier: 'premium'`
   - [ ] `status: 'active'`
   - [ ] `paypal_subscription_id` populated
   - [ ] `current_period_start` set
   - [ ] `current_period_end` set
3. [ ] User generates 5 posts
4. [ ] Check `ai_usage` table:
   - [ ] 5 records created
   - [ ] `user_id` matches
   - [ ] `created_at` timestamps valid
5. [ ] User cancels subscription
6. [ ] Check `subscriptions`:
   - [ ] `tier: 'free'`
   - [ ] `status: 'cancelled'`
   - [ ] `cancelled_at` populated

**Related Tables**:
- `subscriptions`
- `ai_usage`
- `payments` (if implemented)

---

## Test Results Template

### Summary
```
Date: ___________
Tester: ___________
Environment: [Dev/Staging/Prod]
Duration: ___________

PASSED: _____ / _____ tests
FAILED: _____ / _____ tests
BLOCKED: _____ / _____ tests
```

### Issues Found
```
Issue #1: [Title]
- Severity: [Critical/High/Medium/Low]
- Steps to Reproduce: [...]
- Expected: [...]
- Actual: [...]
- Browser: [...]
- Resolution: [...]

Issue #2: ...
```

### Sign-Off
- [ ] All tests passed
- [ ] No blocking issues
- [ ] Ready for production
- [ ] Tester name: ___________
- [ ] Date: ___________

---

## Success Criteria

✅ **MUST PASS** (Blocking):
- [ ] Free users limited to 20 AI generations/month
- [ ] Premium users limited to 200 AI generations/month
- [ ] PayPal upgrade flow works without errors
- [ ] User tier correctly updated after upgrade
- [ ] Subscription can be cancelled
- [ ] Landing page accessible and functional
- [ ] No console errors or warnings
- [ ] Database data integrity

⚠️ **SHOULD PASS** (High Priority):
- [ ] All features work on mobile
- [ ] Page load times acceptable (<2s)
- [ ] Quota display updates in real-time
- [ ] Error messages helpful

📋 **NICE TO HAVE** (Low Priority):
- [ ] Lighthouse score > 90
- [ ] SEO tags on landing page
- [ ] Billing history section implemented

---

## Sign-Off

**QA Lead**: _____________________
**Date**: ___________
**Status**: ☐ PASSED  ☐ FAILED  ☐ BLOCKED

---

**Next Steps After QA**:
1. Fix any critical/high priority issues
2. Re-test fixes
3. Get final sign-off
4. Deploy to production
5. Monitor in production for 1 week
6. Create post-launch report

