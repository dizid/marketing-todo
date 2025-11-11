# PHASE 1: Database Setup - Step-by-Step Guide

**Status**: Ready to execute
**Duration**: ~1 hour
**Files**: `PHASE_1_DATABASE_MIGRATION.sql`

---

## Step 1: Backup Current Database (5 minutes)

**Why**: Safety first. If anything goes wrong, you can restore from backup.

1. Open your Supabase dashboard
2. Navigate to **Settings** → **Database** → **Backups**
3. Click **Create a backup** (name it: `Before-Freemium-Migration-2025-11-11`)
4. Wait for backup to complete (should be quick)

✅ **Checkpoint**: Backup created

---

## Step 2: Delete Test Users (10 minutes) - OPTIONAL

**Why**: You mentioned test users can be discarded. This is optional but recommended for a clean start.

**Option A: Delete via Supabase Dashboard (Recommended)**
1. Go to **Authentication** → **Users**
2. Select each test user account
3. Click **Delete user** for each
4. Confirm deletion

**Option B: Skip this step**
- The SQL migration will handle it (create subscriptions for remaining users)
- You can delete test data later

✅ **Checkpoint**: Test users deleted (or skipped)

---

## Step 3: Run Migration SQL (5 minutes)

**Step 3.1: Open Supabase SQL Editor**
1. Open [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **SQL Editor** (left sidebar)
4. Click **New Query**

**Step 3.2: Copy & Paste Migration Script**
1. Open the file: `/home/marc/DEV/sales/PHASE_1_DATABASE_MIGRATION.sql`
2. Copy the entire script
3. Paste into the Supabase SQL Editor
4. You'll see the full migration script in the editor

**Step 3.3: Execute Migration**
1. Click **Run** (or press `Ctrl+Enter` / `Cmd+Enter`)
2. Watch for success message: "Query executed successfully"
3. No errors should appear

⚠️ **If you get errors:**
- Check the error message
- Run the **CLEANUP** section at bottom of script first (to drop tables)
- Then re-run the full migration

✅ **Checkpoint**: All 3 tables created (subscriptions, ai_usage, payments)

---

## Step 4: Verify Migration Success (5 minutes)

**Step 4.1: Check Tables Exist**
1. In Supabase Dashboard, go to **Table Editor** (left sidebar)
2. You should see 3 new tables:
   - `subscriptions`
   - `ai_usage`
   - `payments`

**Step 4.2: Verify Table Structure**

Click on each table and verify columns:

**`subscriptions` table should have:**
- id (UUID)
- user_id (UUID, unique)
- tier (varchar) - default 'free'
- status (varchar) - default 'active'
- paypal_subscription_id (varchar)
- paypal_payer_id (varchar)
- current_period_start (timestamp)
- current_period_end (timestamp)
- cancelled_at (timestamp)
- metadata (jsonb)
- created_at, updated_at (timestamp)

**`ai_usage` table should have:**
- id (UUID)
- user_id (UUID)
- project_id (UUID)
- task_id (varchar)
- model (varchar)
- tokens_input (integer)
- tokens_output (integer)
- cost_estimate (decimal)
- created_at (timestamp)

**`payments` table should have:**
- id (UUID)
- user_id (UUID)
- subscription_id (UUID)
- amount (decimal)
- currency (varchar)
- status (varchar)
- provider (varchar)
- provider_payment_id (varchar)
- provider_subscription_id (varchar)
- payment_type (varchar)
- metadata (jsonb)
- created_at, updated_at (timestamp)

**Step 4.3: Check Data Initialization**

In SQL Editor, run this verification query:

```sql
SELECT COUNT(*) as subscription_count FROM subscriptions;
```

Expected result:
- If you deleted test users: 0 rows
- If you kept test users: N rows (one per user, all with tier='free')

✅ **Checkpoint**: All tables exist with correct structure

---

## Step 5: Verify Row Level Security (RLS) is Active (5 minutes)

1. In Supabase Dashboard, go to **Authentication** → **Policies**
2. You should see policies listed for:
   - subscriptions
   - ai_usage
   - payments

3. Verify each table has RLS enabled:
   - Go to **Table Editor**
   - Click on each table
   - You should see a 🔒 lock icon indicating RLS is enabled

✅ **Checkpoint**: RLS policies active and secure

---

## Step 6: Test Local Development Connection (15 minutes)

**Why**: Verify your app can connect to the new tables without errors.

**Step 6.1: Start Local Dev Server**
```bash
cd /home/marc/DEV/sales
npm run dev
```

**Step 6.2: Open App in Browser**
- Navigate to `http://localhost:5173`

**Step 6.3: Check Browser Console**
1. Open Developer Tools (`F12` or `Cmd+Option+I`)
2. Go to **Console** tab
3. You should see NO errors about subscriptions/tables

**Step 6.4: Create a Test Account**
1. Click "Sign up" on auth page
2. Enter: test@example.com / password123
3. Click "Sign up"
4. You should see success message

**Step 6.5: Verify Subscription Created**
1. Open Supabase Dashboard
2. Go to **Table Editor** → **subscriptions**
3. You should see a new row with:
   - user_id = your test user's ID
   - tier = 'free'
   - status = 'active'

✅ **Checkpoint**: App connects to database, subscriptions auto-create

---

## Step 7: Quick Sanity Check (5 minutes)

Run these verification queries in Supabase SQL Editor:

```sql
-- Check subscriptions table
SELECT
  id,
  user_id,
  tier,
  status,
  current_period_end
FROM subscriptions
LIMIT 5;

-- Check RLS is working (should show no rows for unauthenticated user)
SELECT COUNT(*) FROM ai_usage;

-- Check indexes created
SELECT indexname FROM pg_indexes
WHERE tablename IN ('subscriptions', 'ai_usage', 'payments');
```

✅ **Checkpoint**: All queries return expected results

---

## ⚠️ Troubleshooting

### Issue: "Table already exists" error
**Solution:**
1. Run the CLEANUP section from the SQL script first
2. Then re-run the full migration

### Issue: RLS policies not working
**Solution:**
1. Go to **Settings** → **Database** → **Enable Row Level Security** (toggle ON)
2. Re-run the migration

### Issue: Users can't sign up
**Solution:**
1. Check auth is enabled: **Settings** → **Authentication**
2. Verify email confirmation is set to "Confirm email" (not "Disabled")
3. Check browser console for specific errors

### Issue: App shows database connection error
**Solution:**
1. Check `.env` file has correct Supabase URL and anon key
2. Verify Supabase project is running (not paused)
3. Clear browser cache and refresh

---

## Next Steps

Once Phase 1 is complete and verified:

1. ✅ Update todo: Mark "Phase 1" as complete
2. ⏭️ Start **Phase 2**: Remove notes fields from components
3. ⏭️ Start **Phase 3** in parallel: Create subscription store

---

## Quick Reference

**Database Tables Created:**
- `subscriptions` - User tier and PayPal info
- `ai_usage` - AI generation tracking for quotas
- `payments` - Payment audit trail

**Key Features:**
- ✅ RLS enabled (users see only their data)
- ✅ Auto-initialize: All users get free tier
- ✅ Indexed for performance
- ✅ Rollback-friendly (can delete with CLEANUP script)

**Timeline:**
- Backup: 5 min
- Delete users (optional): 10 min
- Run SQL: 5 min
- Verify: 5 min
- Test locally: 15 min
- Sanity check: 5 min
- **Total: ~45 minutes**

---

## Confirmation Checklist

Before moving to Phase 2, confirm:

- [ ] Backup created
- [ ] Test users deleted (or skipped)
- [ ] SQL migration executed successfully
- [ ] All 3 tables visible in Table Editor
- [ ] Table structures verified
- [ ] RLS policies active
- [ ] Local dev server works
- [ ] Test account created
- [ ] Subscription auto-created in DB
- [ ] Verification queries all pass
- [ ] No console errors
- [ ] Ready to proceed to Phase 2

---

## Support

If you encounter issues:
1. Check Supabase status page: https://status.supabase.com
2. Review error messages carefully
3. Run cleanup + migration again
4. Check your Supabase project settings

Good luck! 🚀
