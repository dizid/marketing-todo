# Phase 6d: PayPal Sandbox Integration Testing

## Overview

This phase tests the complete PayPal subscription flow end-to-end in the Netlify development environment. We verify that users can upgrade from free to premium tier, and that all database updates and quota displays work correctly after payment approval.

## Prerequisites

### 1. PayPal Sandbox Account Setup

Before testing, ensure you have:

1. **PayPal Developer Account** - https://developer.paypal.com/
2. **Business Account (Seller)** - For receiving payments
3. **Personal Account (Buyer)** - For approving payments

#### Getting Credentials:

1. Go to https://developer.paypal.com/dashboard/
2. Navigate to "Apps & Credentials" → Sandbox tab
3. Select "Merchant" account type
4. Copy your:
   - **Client ID** (appears as "rest_merchant_*")
   - **Secret** (appears below Client ID)

### 2. Environment Setup

Add these to `.env.local` (development only):

```env
# PayPal Configuration (Sandbox)
VITE_PAYPAL_SANDBOX=true
VITE_PAYPAL_PLAN_ID=<your-sandbox-plan-id>

# Netlify Functions will read these from netlify.toml
# (Instructions below)
```

### 3. Netlify Environment Variables

Add to your Netlify project settings (or `netlify.toml`):

```toml
[functions]
  environment = { PAYPAL_SANDBOX = "true", PAYPAL_CLIENT_ID = "your-client-id", PAYPAL_CLIENT_SECRET = "your-secret" }
```

Or via Netlify Dashboard:
- Go to Site settings → Build & deploy → Environment
- Add: `PAYPAL_SANDBOX=true`
- Add: `PAYPAL_CLIENT_ID=<your-id>`
- Add: `PAYPAL_CLIENT_SECRET=<your-secret>`
- Add: `PAYPAL_WEBHOOK_ID=<your-webhook-id>`
- Add: `VITE_SUPABASE_URL=<your-url>`
- Add: `SUPABASE_SERVICE_ROLE_KEY=<your-key>`

### 4. PayPal Webhook Setup

1. Log into PayPal Developer Dashboard
2. Go to Webhooks (in left sidebar under "Apps & Credentials")
3. Create webhook for event types:
   - `BILLING.SUBSCRIPTION.ACTIVATED`
   - `BILLING.SUBSCRIPTION.CANCELLED`
   - `BILLING.SUBSCRIPTION.EXPIRED`
   - `PAYMENT.CAPTURE.COMPLETED`
   - `PAYMENT.CAPTURE.FAILED`
4. Webhook URL: `https://your-netlify-site.netlify.app/.netlify/functions/paypal-webhook`
5. Copy the **Webhook ID** and add to environment variables

## Testing Environment

### Development Mode (Recommended for Testing)

```bash
# Terminal 1: Start Netlify dev server
netlify dev

# This starts both:
# - Vite dev server on localhost:3000
# - Netlify Functions on localhost:9999
```

### Manual Testing Flow

#### Test 1: Initiate Upgrade from QuotaStatusCard

**Steps:**
1. Log in as a FREE tier user
2. Navigate to Dashboard
3. Locate QuotaStatusCard (under ProjectHeader)
4. Click "✨ Upgrade to Premium" button

**Expected Results:**
- Loading spinner appears: "Processing..."
- Loading modal overlays screen: "Upgrading to Premium"
- After ~1 second, redirects to PayPal approval page
- URL changes to: `https://sandbox.paypal.com/checkoutnow?token=<token>`
- Button shows: "✅ Upgrade Initiated (Redirecting to PayPal...)"

**Verification:**
- [ ] No console errors
- [ ] Network tab shows POST to `/.netlify/functions/paypal-create-subscription`
- [ ] Response contains `approvalUrl` starting with PayPal domain
- [ ] User is NOT redirected before clicking "Approve" on PayPal

---

#### Test 2: PayPal Approval Flow

**Prerequisites:** Completed Test 1

**Steps:**
1. On PayPal sandbox approval page, log in with **Personal account** (buyer)
2. Review subscription details: "$19.00 USD / Month"
3. Click "Subscribe" button

**Expected Results:**
- PayPal confirms subscription
- Redirects back to app with query parameters:
  - URL: `https://localhost:3000/app?upgrade=success&subscription_id=I-xxxxx&payer_id=xxxxx`
- PremiumUpgradeButton detects return via `URLSearchParams`
- Auto-calls `subscriptionStore.upgradeToPresentation(subscriptionId, payerId)`

**Verification:**
- [ ] Redirect happens smoothly
- [ ] No "upgrade=cancelled" parameter
- [ ] Browser history shows return URL change
- [ ] Check network tab for Supabase update request

---

#### Test 3: Database Update After Approval

**Prerequisites:** Completed Test 2

**Steps:**
1. Immediately after redirect, check database in Supabase
2. Query `subscriptions` table for current user

**Expected Results:**
```sql
SELECT * FROM subscriptions
WHERE user_id = '<current-user-id>';
```

Should show:
- `tier` = 'premium' (was 'free')
- `status` = 'active'
- `paypal_subscription_id` = 'I-xxxxx' (from query param)
- `paypal_payer_id` = 'xxxxx' (from query param)
- `current_period_start` = today's date
- `current_period_end` = today + 30 days
- `updated_at` = recent timestamp

**Verification:**
- [ ] All fields populated correctly
- [ ] No NULL values in critical fields
- [ ] Timestamps are ISO format
- [ ] Payer ID matches PayPal response

---

#### Test 4: Quota Display Updates Reactively

**Prerequisites:** Completed Test 3

**Steps:**
1. Remain on app (no page refresh)
2. Observe QuotaStatusCard in real-time
3. Watch Network tab for `subscriptionStore.fetchSubscriptionStatus()` call

**Expected Results:**
- QuotaStatusCard updates automatically:
  - Badge changes from "Free" → "✨ Premium"
  - Quota display changes: "0/20" → "0/200"
  - Progress bar resets to 0%
  - Color-coding recalculates
- No page refresh needed
- Pinia store reactivity triggers component re-render

**Verification:**
- [ ] Visual updates happen within 1 second
- [ ] Badge styling changes (blue → purple)
- [ ] Quota numbers update correctly
- [ ] Progress bar resets
- [ ] Status message updates

---

#### Test 5: AI Generation Works with Premium Quota

**Prerequisites:** Completed Test 4, have premium quota

**Steps:**
1. Navigate to any task with AI generation (e.g., GeneratePostTask)
2. Fill in form fields
3. Click "Generate with AI" button
4. Generation should succeed

**Expected Results:**
- API call succeeds (uses 1 out of 200 quota)
- Generated content displays
- QuotaStatusCard updates: "1/200"
- No quota exceeded error

**Verification:**
- [ ] API call succeeds (check network tab)
- [ ] Response contains generated content
- [ ] QuotaStatusCard shows "1/200"
- [ ] AI usage record created in Supabase

---

#### Test 6: Quota Exceeded Modal (Premium Tier)

**Prerequisites:** User is premium tier with 199 generations used

**Steps:**
1. Navigate to any Generate task
2. Try to generate when at quota limit (200/200)
3. Click "Generate with AI"

**Expected Results:**
- Generation blocked BEFORE API call
- QuotaExceededModal appears
- Modal shows premium-specific message:
  - "⭐ Premium Tier Limit Reached"
  - "You have used your 200 premium AI generations"
  - "Your quota resets on [date]"
- No upgrade button (already premium)

**Verification:**
- [ ] Modal appears within 500ms
- [ ] Premium messaging displays (not free tier messaging)
- [ ] No API call in network tab
- [ ] Modal has close button

---

#### Test 7: Initiate Upgrade from QuotaExceededModal

**Prerequisites:** Free user with 20/20 quota used

**Steps:**
1. Navigate to any Generate task
2. Try to generate when at quota limit (20/20)
3. QuotaExceededModal appears
4. Click "✨ Upgrade to Premium - $19/month" button

**Expected Results:**
- Same flow as Test 1
- Loading spinner appears
- Redirects to PayPal after ~1 second
- Modal remains visible during redirect

**Verification:**
- [ ] Button works from modal context
- [ ] PayPal flow proceeds normally
- [ ] All Test 2-5 steps work identically

---

#### Test 8: Cancel PayPal Approval

**Prerequisites:** Initiated upgrade flow

**Steps:**
1. On PayPal approval page, click "Cancel"
2. Should be redirected back to app

**Expected Results:**
- URL: `https://localhost:3000/app?upgrade=cancelled`
- PremiumUpgradeButton detects cancellation
- No database update occurs
- User remains on free tier
- QuotaStatusCard shows original state (Free, 20 gens)

**Verification:**
- [ ] No upgrade error message displays
- [ ] User remains free tier in database
- [ ] Subscription status unchanged
- [ ] Can retry upgrade later

---

#### Test 9: Multiple Upgrade Attempts

**Prerequisites:** Free user

**Steps:**
1. Click upgrade button (Test 1)
2. Approve on PayPal (Test 2)
3. Wait for redirect and database update
4. Try clicking upgrade again

**Expected Results:**
- Second click has no effect (already premium)
- Or shows different UI (already subscribed)
- No double-charging

**Verification:**
- [ ] Button disabled or hidden for premium users
- [ ] No new PayPal subscription created
- [ ] Database shows single subscription record

---

#### Test 10: Webhook Verification (Manual Simulation)

**Prerequisites:** Have PayPal webhook ID in environment

**Steps:**
1. In terminal, simulate PayPal webhook POST:
```bash
curl -X POST http://localhost:9999/paypal-webhook \
  -H "Content-Type: application/json" \
  -H "paypal-transmission-id: test-transmission-123" \
  -H "paypal-transmission-time: 2025-01-15T10:30:00Z" \
  -H "paypal-cert-url: https://api.paypal.com/cert.pem" \
  -H "paypal-auth-algo: SHA256withRSA" \
  -d '{
    "id": "webhook-event-123",
    "event_type": "BILLING.SUBSCRIPTION.ACTIVATED",
    "resource": {
      "id": "I-test-subscription-456",
      "custom_id": "<test-user-id>",
      "status": "ACTIVE",
      "subscriber": {
        "payer_id": "test-payer-789"
      }
    }
  }'
```

**Expected Results:**
- Response: `{ "statusCode": 200, "success": true }`
- Database updated (if webhook verification passes)
- Logs show: "[PayPal Webhook] Processing event: BILLING.SUBSCRIPTION.ACTIVATED"

**Verification:**
- [ ] Webhook returns 200
- [ ] No error logs
- [ ] Database reflects update

---

## Checklist Summary

### Pre-Testing Checklist
- [ ] PayPal sandbox account created and credentials obtained
- [ ] Netlify environment variables configured
- [ ] Webhook URL registered in PayPal Dashboard
- [ ] Development environment running (`netlify dev`)
- [ ] Database tables verified (subscriptions, ai_usage)
- [ ] Test user account created and logged in (free tier)

### Test Execution Checklist
- [ ] Test 1: Initiate Upgrade
- [ ] Test 2: PayPal Approval Flow
- [ ] Test 3: Database Update Verification
- [ ] Test 4: Quota Display Updates
- [ ] Test 5: AI Generation with Premium Quota
- [ ] Test 6: Quota Exceeded Modal (Premium)
- [ ] Test 7: Upgrade from Modal
- [ ] Test 8: Cancel PayPal Approval
- [ ] Test 9: Multiple Upgrade Attempts
- [ ] Test 10: Webhook Verification

### Post-Testing Validation
- [ ] No console errors in browser DevTools
- [ ] No errors in Netlify function logs
- [ ] Database consistency verified
- [ ] All quota displays reactive
- [ ] No API calls wasted on blocked generations
- [ ] Error messages user-friendly

## Troubleshooting

### Issue: "PayPal credentials missing"
**Solution:** Verify environment variables in Netlify (dev dashboard or netlify.toml)

### Issue: "No approval URL received"
**Solution:** Check PayPal API response in network tab → paypal-create-subscription function logs

### Issue: "Signature verification failed"
**Solution:** Verify PAYPAL_WEBHOOK_ID matches exact ID from PayPal Dashboard (case-sensitive)

### Issue: Database not updating after approval
**Solution:**
1. Check Supabase service role key is correct
2. Verify RLS policies allow inserts
3. Check `upgradeToPresentation()` method in subscriptionStore

### Issue: Quota not updating reactively
**Solution:**
1. Hard refresh page (Ctrl+Shift+R)
2. Check subscriptionStore cache isn't stale
3. Verify `fetchSubscriptionStatus()` completes successfully

### Issue: Redirect loop after approval
**Solution:** Ensure `PremiumUpgradeButton.vue` `checkForPayPalReturn()` runs on mount

## Performance Benchmarks

Expected timings for complete flow:

| Step | Expected Time | Actual Time | Status |
|------|---|---|---|
| Click upgrade button | <100ms | | |
| Get PayPal token | 1-2s | | |
| Create subscription | 1-2s | | |
| Redirect to PayPal | <500ms | | |
| PayPal approval (user interaction) | 10-30s | | |
| Redirect back to app | <1s | | |
| Database update | <500ms | | |
| Quota display update | <1s | | |
| **Total (user perspective)** | **~15-35s** | | |

## Success Criteria

✅ **Phase 6d Complete When:**
1. All 10 tests pass without errors
2. Database updates consistently after approval
3. Quota displays update reactively
4. No console errors in browser or Netlify logs
5. PayPal webhook signature verification works
6. Premium users can generate with 200 quota limit
7. Free users cannot access premium features
8. Multiple users can upgrade independently
9. Cancellation flow works correctly
10. All timings within acceptable ranges

---

**Phase Status:** Ready for manual testing
**Estimated Time:** 2-3 hours (including PayPal setup)
**Next Phase:** Phase 7 - Task Config Updates (Tier/What/Why/How)
