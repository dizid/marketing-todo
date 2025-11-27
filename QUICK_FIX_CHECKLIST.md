# Quick Fix Checklist - 3 Simple Steps

## Step 1: Fix Supabase RLS (5 minutes)

### A. Open Supabase Dashboard
- Go to: https://app.supabase.com/
- Select your project
- Click **SQL Editor** (left sidebar)

### B. Run the RLS Fix
1. Click **New Query**
2. Open `SUPABASE_RLS_FIX.sql` in your project root
3. Copy **all the SQL code**
4. Paste into Supabase SQL Editor
5. Click **RUN**

### C. Verify It Worked
Copy this into a new SQL query and run it:
```sql
SELECT policyname FROM pg_policies WHERE tablename = 'subscriptions';
```

Should return 3 policies:
- `Users can insert their own subscription`
- `Users can update their own subscription`
- `Users can view their own subscription`

✅ **Done!**

---

## Step 2: Restart Dev Server (2 minutes)

```bash
# In terminal 1 - Kill everything
pkill -9 node

# Wait 2 seconds
# Then restart main app
npm run dev

# Wait 4 seconds, then in terminal 2
netlify functions:serve
```

✅ **Done!**

---

## Step 3: Test Subscription Flow (2 minutes)

1. Open http://localhost:3001 in browser
2. Make sure you're logged in
3. Click **"Upgrade to Premium"** button
4. Payment modal should open without errors
5. Enter test card:
   - Card: `4242 4242 4242 4242`
   - Expiry: `12/25`
   - CVC: `123`
6. Click **"Subscribe for $19/month"**
7. Should complete successfully

✅ **Done!**

---

## What This Fixes

| Before | After |
|--------|-------|
| ❌ 406 Not Acceptable | ✅ No database error |
| ❌ 500 Internal Server Error | ✅ Subscription creates |
| ❌ "Invalid time value" | ✅ Fixed by code commit |
| ❌ Can't read subscription | ✅ RLS policies allow it |

---

## If Something Goes Wrong

### Still getting 406 error?
- Make sure you ran the SQL and got 3 policies back
- Check that you're logged in (blue user avatar in top right)
- Check browser console for additional errors
- Try clearing localStorage: `localStorage.clear()` in console

### Still getting 500 error?
- Check function logs in terminal running `netlify functions:serve`
- Look for `[stripe-create-subscription]` messages
- If you see a different error, that's the real problem

### Payment modal won't open?
- Check browser console for errors
- Make sure `VITE_STRIPE_PUBLIC_KEY` is set in `.env`
- Make sure you're using test keys (starts with `pk_test_`)

---

## What You Just Fixed

✅ **Code**: Timestamp bug (already committed)
✅ **Database**: RLS policies (you just added)
✅ **Configuration**: Environment variables (already set)

---

## Next Steps

After testing locally:
1. Create a test subscription
2. Test cancellation (downgrade to free)
3. When ready: Get production Stripe keys
4. Update `.env` with production keys
5. Deploy to Netlify

---

## Reference Docs

- **Technical Deep Dive**: `STRIPE_SUBSCRIPTION_RESOLVED.md`
- **Timestamp Bug Details**: `SUBSCRIPTION_FIX_SUMMARY.md`
- **RLS Explained**: `SUPABASE_RLS_FIX.sql` (has comments)
- **Full Setup Guide**: `SETUP_AND_FIX_GUIDE.md`
