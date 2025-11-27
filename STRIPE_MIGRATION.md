# Stripe Payment Integration Migration Guide

## Overview
This document covers the database schema migration to support Stripe payments and remove PayPal integration.

## Database Schema Changes

### Add Payment Provider Column to subscriptions Table

```sql
-- Add stripe columns to subscriptions table
ALTER TABLE subscriptions
ADD COLUMN stripe_customer_id TEXT DEFAULT NULL,
ADD COLUMN stripe_subscription_id TEXT DEFAULT NULL,
ADD COLUMN payment_provider TEXT DEFAULT 'stripe';

-- Add index for faster lookups
CREATE INDEX idx_subscriptions_stripe_customer_id
ON subscriptions(stripe_customer_id);

-- (Optional) Remove PayPal columns if they exist
ALTER TABLE subscriptions
DROP COLUMN IF EXISTS paypal_subscription_id,
DROP COLUMN IF EXISTS paypal_payer_id;
```

### Execute Migration via Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **SQL Editor**
4. Create new query with the SQL above
5. Execute the query
6. Verify columns were created

### Verify Schema

```sql
-- Check subscriptions table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'subscriptions'
ORDER BY ordinal_position;

-- Should include:
-- - stripe_customer_id (text, nullable)
-- - stripe_subscription_id (text, nullable)
-- - payment_provider (text, nullable)
```

---

## Configuration Steps

### 1. Get Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **API Keys**
3. Copy:
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)

### 2. Create Stripe Product & Price

1. Go to **Products** in Stripe Dashboard
2. Click **+ Add product**
3. Fill in:
   - **Name**: "Premium Subscription"
   - **Description**: "Premium plan with 400 AI generations/month"
   - **Type**: "Service"
4. In **Pricing** section:
   - **Price**: $19.00
   - **Billing period**: Monthly
   - **Save product**
5. Copy the **Price ID** (starts with `price_`)

### 3. Enable PayPal in Stripe (Optional)

If you've already activated PayPal in Stripe:
1. Go to **Settings** → **Payment Methods**
2. Ensure **PayPal** is enabled
3. No additional configuration needed—Stripe Payment Element will automatically show PayPal option

### 4. Set Up Webhook

Webhooks allow Stripe to notify your application about payment events. You need to set up webhooks for **both local testing** and **production**.

#### Option A: Local Testing with ngrok (Recommended)

If you want to test webhooks locally before deploying:

1. **Install ngrok** (one-time setup):
   ```bash
   # macOS with Homebrew
   brew install ngrok

   # Or download from https://ngrok.com/download
   ```

2. **Start your Netlify functions locally**:
   ```bash
   netlify functions:serve
   ```
   This starts a local server on `http://localhost:9999`

3. **In a new terminal, create an ngrok tunnel**:
   ```bash
   ngrok http 9999
   ```
   Output will show something like:
   ```
   Forwarding    https://abc123def456.ngrok.io -> http://localhost:9999
   ```

4. **In Stripe Dashboard** → **Developers** → **Webhooks** → **+ Add endpoint**:
   - **Endpoint URL**: `https://2f17c17ab6c6.ngrok-free.app/.netlify/functions/stripe-webhook`
   - **Events to send**:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
   - Click **Add endpoint**
   - Copy **Signing secret** (starts with `whsec_`) to your `.env` file as `STRIPE_WEBHOOK_SECRET`

5. **Test the webhook** (optional):
   - In Stripe Dashboard, click on your new endpoint
   - Scroll to **Events** section
   - Click **Send test event**
   - Select `customer.subscription.created`
   - Your local function will receive and log the event
   - Check browser console or terminal for logs

**Note**: The ngrok URL changes every time you restart ngrok. Free ngrok accounts are fine for development.

---

#### Option B: Production Setup (https://launchpilot.marketing/)

For production, use your actual domain:

1. **Ensure your site is deployed**:
   - Your Netlify site is already deployed at `https://launchpilot.marketing/`
   - Netlify Functions are automatically exposed at `https://launchpilot.marketing/.netlify/functions/`

2. **In Stripe Dashboard** → **Developers** → **Webhooks** → **+ Add endpoint**:
   - **Endpoint URL**: `https://launchpilot.marketing/.netlify/functions/stripe-webhook`
   - **Events to send**:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
   - Click **Add endpoint**
   - Copy **Signing secret** (starts with `whsec_`) to your `.env` file as `STRIPE_WEBHOOK_SECRET`

3. **Update Netlify environment variables**:
   - Go to [Netlify Site Settings](https://app.netlify.com)
   - Select your site
   - Go to **Site Settings** → **Build & Deploy** → **Environment**
   - Add `STRIPE_WEBHOOK_SECRET` with the value from Step 2
   - **Redeploy** your site (or wait for automatic deploy on next push)

4. **Verify webhook is working**:
   - In Stripe Dashboard, click on your endpoint
   - Scroll to **Events** section
   - Make a test payment locally
   - You should see `customer.subscription.created` and `invoice.payment_succeeded` events
   - Click on an event to see the payload and response

---

#### Webhook URL Format Reference

| Environment | URL Format |
|-------------|-----------|
| Local (ngrok) | `https://<ngrok-id>.ngrok.io/.netlify/functions/stripe-webhook` |
| Production | `https://launchpilot.marketing/.netlify/functions/stripe-webhook` |

**Example values**:
- ngrok URL: `https://abc123def456.ngrok.io/.netlify/functions/stripe-webhook`
- Production: `https://launchpilot.marketing/.netlify/functions/stripe-webhook`

---

#### How Webhooks Work

1. **You make a payment** on your app using Stripe Payment Element
2. **Stripe processes the payment** and creates subscription/payment events
3. **Stripe sends HTTP POST** to your webhook endpoint with event data
4. **Your endpoint (`stripe-webhook.js`)** receives the request:
   - Verifies the signature using `STRIPE_WEBHOOK_SECRET`
   - Routes to appropriate handler (subscription created, payment succeeded, etc.)
   - Updates your database with subscription/payment status
   - Returns `200 OK` to confirm receipt
5. **If Stripe doesn't get 200 OK**, it retries the webhook multiple times
6. **Your app stays in sync** with Stripe automatically

---

#### Troubleshooting Webhooks

**Problem**: "Webhook endpoint not responding"

**Solutions**:
1. Check Stripe Dashboard → **Developers** → **Webhooks** → your endpoint → **Events**
2. Look for red ✗ marks next to events (failed deliveries)
3. Click on a failed event to see the error response
4. Common issues:
   - **Local testing**: ngrok tunnel expired or not running
   - **Production**: Website is down or has errors
   - **Wrong secret**: `STRIPE_WEBHOOK_SECRET` doesn't match Stripe's
   - **Wrong URL**: Double-check the endpoint URL spelling

**Problem**: "Payment succeeded but database didn't update"

**Solution**:
1. Check your webhook logs in Stripe Dashboard
2. Look at the response body (should show `{ received: true }`)
3. Check Netlify function logs: **Netlify** → **Functions** → **stripe-webhook**
4. If response is an error, fix the issue and re-test

**Problem**: "How do I know if the webhook is working?"

**Solution**:
1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Click on your endpoint
3. Scroll down to see recent events
4. Green ✓ = successful delivery
5. Red ✗ = failed (click to see error)
6. Make a test payment to generate events

### 5. Update Environment Variables

Update `.env` in your project:

```bash
# Stripe Public Key (safe to expose in frontend)
VITE_STRIPE_PUBLIC_KEY=pk_test_... # or pk_live_...

# Stripe Secret Key (Netlify environment only)
STRIPE_SECRET_KEY=sk_test_... # or sk_live_...

# Stripe Webhook Secret
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Product Price
VITE_STRIPE_PRICE_ID=price_... # Copy from Stripe Dashboard
VITE_STRIPE_MONTHLY_PRICE=1900 # $19.00 in cents
```

### 6. Update Netlify Environment Variables

1. Go to [Netlify Site Settings](https://app.netlify.com)
2. Go to **Site Settings** → **Build & Deploy** → **Environment**
3. Add the following variables:
   - `STRIPE_SECRET_KEY` = your secret key
   - `STRIPE_WEBHOOK_SECRET` = your webhook secret
4. Save changes
5. Redeploy your site (or it will deploy automatically)

---

## Testing

### Test Stripe Integration Locally

1. Start development servers:
   ```bash
   npm run dev              # Vite dev server (port 3000)
   netlify functions:serve  # Netlify functions (port 9999)
   ```

2. Navigate to subscription page: `http://localhost:3001/app/subscription`

3. Click "Upgrade to Premium" button

4. Test with Stripe test cards:

   | Card Number | Description | Action |
   |-------------|-------------|--------|
   | `4242 4242 4242 4242` | Visa (success) | Complete payment |
   | `4000 0000 0000 0002` | Visa (decline) | Should fail with error |
   | `4000 0025 0000 3155` | 3D Secure | Will prompt for authentication |
   | `5555 5555 5555 4444` | Mastercard | Complete payment |

5. Use any future expiry date and any CVC (e.g., 12/25, 123)

6. For PayPal test:
   - Select "PayPal" in payment method selector
   - You'll be redirected to Stripe's PayPal flow
   - Use PayPal sandbox credentials if prompted

### Check Database

1. Go to Supabase Dashboard
2. Go to **SQL Editor**
3. Query to see subscription:
   ```sql
   SELECT * FROM subscriptions
   WHERE user_id = 'your-user-id'
   LIMIT 1;
   ```
4. Should see:
   - `payment_provider` = 'stripe'
   - `stripe_customer_id` = populated
   - `stripe_subscription_id` = populated
   - `tier` = 'premium'
   - `status` = 'active' (after webhook confirmation)

### Check Webhook

1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Click on your endpoint
3. Scroll to **Events** section
4. Should see recent events:
   - `customer.subscription.created` ✓
   - `invoice.payment_succeeded` ✓

---

## Cleanup

### PayPal Code Removed

The following PayPal code has been deleted:
- ✅ `src/services/paypalService.js`
- ✅ `netlify/functions/paypal-*.js` (all PayPal functions)
- ✅ PayPal constants from `constants.js`
- ✅ PayPal environment variables from `.env`

### Components Updated

- ✅ `ManageSubscriptionPage.vue` - Now uses Stripe instead of PayPal
- ✅ `StripePaymentModal.vue` - New payment modal component

---

## Troubleshooting

### Payment Element Not Loading

**Error**: "Stripe not initialized"

**Solution**:
1. Check `VITE_STRIPE_PUBLIC_KEY` in `.env`
2. Verify it starts with `pk_test_` or `pk_live_`
3. Restart dev server: `npm run dev`

### Webhook Not Firing

**Error**: Database subscription status stays "pending"

**Solution**:
1. Verify webhook endpoint in Stripe Dashboard
2. Check `STRIPE_WEBHOOK_SECRET` in Netlify environment
3. Check Stripe webhook logs for errors
4. Manually trigger test event in Stripe Dashboard

### Payment Creation Fails

**Error**: "400: Invalid price"

**Solution**:
1. Verify `VITE_STRIPE_PRICE_ID` matches actual price ID from Stripe
2. Make sure price is in test mode (if using test keys)
3. Check Netlify function logs for detailed error

### Subscription Cancel Fails

**Error**: "Cannot read stripe_subscription_id"

**Solution**:
1. Verify subscription record exists in database
2. Check `stripe_subscription_id` column is populated
3. Verify `STRIPE_SECRET_KEY` in Netlify environment

---

## Monitoring

### Health Checks

Run these queries to monitor the system:

```sql
-- Count active Premium subscriptions
SELECT COUNT(*) FROM subscriptions
WHERE tier = 'premium' AND status = 'active';

-- Count free tier users
SELECT COUNT(*) FROM subscriptions
WHERE tier = 'free';

-- List recent payments
SELECT user_id, created_at, status FROM subscriptions
WHERE created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

### Logs to Monitor

1. **Netlify Function Logs**:
   - Go to Netlify → **Functions**
   - Click on each Stripe function
   - Check recent logs

2. **Browser Console**:
   - Check for JavaScript errors
   - Watch Network tab for API calls

3. **Stripe Dashboard**:
   - Go to **Developers** → **Webhooks**
   - View endpoint logs
   - Check for failed events

---

## Rollback Plan (If Needed)

If something goes wrong, you can rollback:

1. **Revert database**: Keep `payment_provider` column (won't hurt)
2. **Revert code**: `git checkout` to previous commit
3. **Disable Stripe webhook**: Go to Stripe → **Developers** → **Webhooks** → Disable endpoint
4. **Restore PayPal**: Re-add PayPal functions from git history if needed

---

## Next Steps

1. ✅ Run database migration above
2. ✅ Get Stripe API keys
3. ✅ Create product and price in Stripe
4. ✅ Set up webhook
5. ✅ Update `.env` with credentials
6. ✅ Update Netlify environment variables
7. ✅ Test in development
8. ✅ Deploy to production
9. ✅ Monitor logs and transactions
10. ✅ Celebrate—Stripe integration complete! 🎉

---

## Support

- [Stripe Documentation](https://stripe.com/docs)
- [Netlify Functions Docs](https://docs.netlify.com/functions/overview/)
- [Supabase SQL Guide](https://supabase.com/docs/guides/database)

Questions? Check the [Stripe Discord](https://discord.gg/stripe) or [Netlify Community](https://community.netlify.com/).
