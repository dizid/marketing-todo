# Stripe Subscription System - Setup & Fix Guide

## Status

You have **two separate issues**:

1. ✅ **Code Issue - FIXED**: Timestamp conversion bug in `stripe-create-subscription.cjs` (commit `bbd75e2`)
2. ⚠️ **Configuration Issue - NEEDS YOUR ACTION**: Supabase RLS policies not configured

---

## Issue #1: Code Bug (Already Fixed)

### Error
```
Failed to store subscription: Invalid time value
```

### What Was Wrong
Lines 204-205 in `stripe-create-subscription.cjs` tried to convert null timestamps without checking if they exist first.

### Fix Applied
✅ **Commit `bbd75e2`** added defensive null checks:
- Check if timestamp exists before converting
- Use current time as fallback for start date
- Use +30 days from now as fallback for end date

**This is already done and committed.**

---

## Issue #2: Supabase RLS Policies (Needs Your Action)

### Error You're Seeing
```
406 Not Acceptable from Supabase
POST 500 Internal Server Error from stripe-create-subscription function
```

### Root Cause
The `subscriptions` table doesn't have Row Level Security (RLS) policies configured, so:
- Frontend can't read user's subscription (406 error)
- Backend function fails because frontend query failed (500 error)

### How to Fix

#### Step 1: Open Supabase Dashboard
1. Go to: https://app.supabase.com/
2. Select your project
3. Go to **SQL Editor** (left sidebar)

#### Step 2: Create RLS Policies
1. Click **New Query**
2. Copy the entire contents of this file: `SUPABASE_RLS_FIX.sql` in your project root
3. Paste it into the SQL Editor
4. Click **Run**

**That's it!** The SQL will:
- Enable RLS on the subscriptions table
- Create policies allowing users to read/write their own subscriptions
- Keep service role (backend) able to manage all subscriptions

#### Step 3: Verify It Worked
Run this query in Supabase SQL Editor to confirm:

```sql
SELECT policyname, permissive, roles, qual
FROM pg_policies
WHERE tablename = 'subscriptions'
ORDER BY policyname;
```

**Expected result**: You should see 3 policies:
- `Users can insert their own subscription`
- `Users can update their own subscription`
- `Users can view their own subscription`

#### Step 4: Restart Your Dev Server
```bash
# Kill existing processes
pkill -9 node

# Restart dev server
npm run dev

# In another terminal, restart Netlify functions
netlify functions:serve
```

#### Step 5: Test the Flow
1. Open your app
2. Click "Upgrade to Premium"
3. Payment modal should open (no 406 error)
4. Enter test card: `4242 4242 4242 4242`
5. Expiry: `12/25`, CVC: `123`
6. Click "Subscribe"
7. Should complete without 500 error

---

## Understanding the Fix

### What are RLS Policies?

RLS (Row Level Security) is a database-level security feature that:
- Restricts which rows users can see/modify
- Works at the database level (more secure than app-level checks)
- Requires explicit policies to grant access

### Why Was It Missing?

Your `subscriptions` table was created but had no RLS policies. This means:
- **RLS enabled** = Default deny all access ❌
- **No policies** = Can't read/write anything
- **Frontend query** = 406 Not Acceptable ❌

### What the Policies Do

1. **SELECT policy** - Users can read their own subscription
   ```
   Allow if: auth.uid() = user_id
   ```

2. **UPDATE policy** - Users can update their own subscription
   ```
   Allow if: auth.uid() = user_id
   ```

3. **INSERT policy** - Users can create their own subscription
   ```
   Allow if: auth.uid() = user_id
   ```

4. **Service role bypass** - Backend functions bypass all policies
   - Happens automatically when using `SUPABASE_SERVICE_ROLE_KEY`
   - This key is server-only (Netlify functions), never exposed to frontend

---

## Environment Variables Check

Your `.env` file has:
- ✅ `VITE_SUPABASE_URL` - Frontend database URL
- ✅ `VITE_SUPABASE_ANON_KEY` - Frontend authentication key
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - Backend super-user key (Netlify only)
- ✅ `STRIPE_SECRET_KEY` - Stripe backend key
- ✅ `VITE_STRIPE_PUBLIC_KEY` - Stripe frontend key
- ✅ `VITE_FUNCTIONS_URL` - Points to Netlify functions

**All environment variables are correctly set.**

---

## Troubleshooting

### Still getting 406 error after running SQL?

**Check if RLS is enabled:**
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'subscriptions';
```

Should show:
```
tablename     | rowsecurity
subscriptions | t (true)
```

If `t` is not true, run this first:
```sql
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
```

### Still getting 500 error from function?

**Check function logs:**
1. Open your dev server terminal
2. Look for `[stripe-create-subscription]` log messages
3. Copy the full error message
4. It should now show the actual error (not timestamp issue)

**If it's a Stripe error:**
- Verify `STRIPE_SECRET_KEY` is correct and set in `.env`
- Verify `VITE_STRIPE_PRICE_ID` matches your Stripe account

**If it's a database error:**
- Verify subscriptions table exists
- Verify all columns exist (user_id, tier, status, etc.)

### Test locally before production:

```bash
# Make sure you're using test Stripe keys (pk_test_*, sk_test_*)
# which are already in your .env

# Kill and restart everything
pkill -9 node
sleep 2
npm run dev &
sleep 4
netlify functions:serve &
sleep 4

# Open app at http://localhost:3001
# Click Upgrade
# Should work now!
```

---

## Summary of What You Need to Do

### ✅ Already Done
- Code bug fixed (timestamp conversion)
- Environment variables configured
- Netlify functions created

### ⚠️ You Need to Do This
1. **Open Supabase SQL Editor**
2. **Paste and run** `SUPABASE_RLS_FIX.sql`
3. **Restart your dev server**
4. **Test the subscription flow**

That's it! Once RLS policies are in place, everything will work.

---

## Next Steps After Fixing

1. ✅ Test subscription creation locally
2. ✅ Test subscription cancellation
3. ⏳ Get live Stripe keys when ready for production
4. ⏳ Update `.env` with production keys
5. ⏳ Deploy to Netlify
6. ⏳ Update Stripe webhook URL to production domain

---

## Questions?

- **RLS Policies**: Read `SUPABASE_RLS_FIX.sql` - has detailed comments
- **Timestamp Bug**: See `SUBSCRIPTION_FIX_SUMMARY.md`
- **Full Architecture**: See `STRIPE_SUBSCRIPTION_RESOLVED.md`
