# Phase 3 SSOT Database Schema Fix Guide

## Problem
The app is crashing with error: "Could not find the 'version' column of 'project_data' in the schema cache"

This happens because Phase 3 SSOT implementation expects database columns that haven't been created in Supabase yet.

---

## Root Cause Analysis

### What Phase 3 Expects:
1. **version** column - For optimistic locking (conflict detection)
2. **last_modified_by** column - Track which user made changes
3. **last_modified_at** column - Track when changes were made
4. **Triggers** to auto-increment version and update timestamps

### What's Missing:
- Migration `002_add_version_tracking_to_project_data.sql` exists but may not have been applied
- Migration `003_add_last_modified_tracking_to_project_data.sql` was just created and needs to be applied
- Supabase schema hasn't been updated with these columns

---

## Fix Instructions

### Option A: Manual Application via Supabase SQL Editor (Recommended for Quick Fix)

1. **Go to Supabase Dashboard**
   - URL: https://app.supabase.com
   - Select your project
   - Navigate to "SQL Editor"

2. **Create New Query**
   - Click "New Query"

3. **Copy and Run Migration 002**
   - Open: `/home/marc/DEV/sales/migrations/002_add_version_tracking_to_project_data.sql`
   - Copy the entire contents
   - Paste into SQL Editor
   - Click "Run"
   - ✅ You should see: Column 'version' created

4. **Copy and Run Migration 003**
   - Open: `/home/marc/DEV/sales/migrations/003_add_last_modified_tracking_to_project_data.sql`
   - Copy the entire contents
   - Paste into SQL Editor
   - Click "Run"
   - ✅ You should see: Columns 'last_modified_by' and 'last_modified_at' created

5. **Verify Columns Exist**
   - Run this query in SQL Editor:
   ```sql
   SELECT column_name, data_type, is_nullable, column_default
   FROM information_schema.columns
   WHERE table_name = 'project_data'
   ORDER BY ordinal_position;
   ```
   - ✅ You should see:
     - id (UUID)
     - project_id (UUID)
     - key (text)
     - value (jsonb)
     - updated_at (timestamp)
     - user_id (UUID)
     - version (integer) ← NEW
     - last_modified_by (UUID) ← NEW
     - last_modified_at (timestamp) ← NEW

---

### Option B: Automated via Script

1. **Run Migration Script**
   ```bash
   node run-migrations.js
   ```
   - This script attempts to apply migrations automatically
   - If it fails, it provides instructions for manual application

2. **Follow any prompts** to apply migrations manually if needed

---

## Verification Steps

After applying migrations, verify the fix:

### Step 1: Restart Development Server
```bash
npm run dev
```

### Step 2: Clear Browser Cache
- Open DevTools (F12)
- Settings → Application → Storage → Clear site data
- Hard refresh page (Ctrl+Shift+R or Cmd+Shift+R)

### Step 3: Test Task Save
1. Open any task
2. Make a small edit (change one field)
3. Save should work without errors
4. ✅ No 400 error in console
5. ✅ Data persists after page refresh

### Step 4: Check Console for Errors
- Open DevTools → Console
- Try saving again
- Should NOT see: "Could not find the 'version' column"
- Should NOT see any "PGRST204" errors

### Step 5: Test Concurrent Edit Scenario
1. Open task in two browser windows (side by side)
2. In Window 1: Edit and save the task
3. In Window 2: Make different edit and try to save
4. ✅ Should show conflict detection UI (not a crash)
5. ✅ Conflict message should show who edited it and when

---

## Technical Details: What Each Migration Does

### Migration 002: Version Tracking
```sql
-- Adds version INTEGER column with default value of 1
ALTER TABLE project_data ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

-- Creates index for fast conflict detection queries
CREATE INDEX IF NOT EXISTS idx_project_data_version
  ON project_data(project_id, version);

-- Creates trigger to auto-increment version on each update
-- When row is updated, version automatically becomes (old_version + 1)
```

### Migration 003: Last Modified Tracking
```sql
-- Adds last_modified_by UUID column (foreign key to auth.users)
-- Tracks which user made the change
ALTER TABLE project_data
ADD COLUMN IF NOT EXISTS last_modified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Adds last_modified_at TIMESTAMPTZ column
-- Automatically updated to NOW() on each update
ALTER TABLE project_data
ADD COLUMN IF NOT EXISTS last_modified_at TIMESTAMPTZ DEFAULT NOW();

-- Creates triggers to auto-populate these fields
-- last_modified_by: Set to current authenticated user (auth.uid())
-- last_modified_at: Set to current timestamp (NOW())
```

---

## How This Fixes the Error

### Before (Without Migrations):
```
User saves task
  ↓
projectStore.js tries to upsert with version field:
  upsert({ project_id: xxx, key: 'taskData', value: {...}, version: 1 })
  ↓
Supabase error: "Could not find the 'version' column"
  ↓
App crashes with 400 error
```

### After (With Migrations):
```
User saves task
  ↓
projectStore.js upserts with version field:
  upsert({ project_id: xxx, key: 'taskData', value: {...}, version: 1 })
  ↓
Supabase finds version column ✅
  ↓
Version auto-increments via trigger ✅
  ↓
Last modified tracking updated via triggers ✅
  ↓
Save succeeds, data persists ✅
```

---

## Troubleshooting

### Issue: Still seeing "version column not found" error

**Solution 1: Verify migrations were actually applied**
1. Go to Supabase SQL Editor
2. Run:
   ```sql
   SELECT column_name FROM information_schema.columns
   WHERE table_name = 'project_data' AND column_name = 'version';
   ```
3. If no results, migration wasn't applied
4. Re-run migration 002

**Solution 2: Clear Supabase cache**
1. Go to Supabase Dashboard
2. Click your project name
3. Look for "Manage API" or similar
4. Restart any running API instances
5. Wait 30 seconds
6. Refresh browser

### Issue: "Could not find the 'last_modified_by' column"

**Solution:**
1. Run migration 003 (see verification steps above)
2. Verify it completed successfully
3. Restart dev server
4. Clear browser cache

### Issue: "RLS policy preventing updates"

**Solution:**
1. Check Supabase → Authentication → Policies
2. Ensure project_data table allows updates for authenticated users
3. Trigger functions have SECURITY DEFINER, so they should bypass RLS
4. If still failing, add explicit policy allowing updates

---

## Next Steps After Fix

1. ✅ Migrations applied and verified
2. ⬜ Test Phase 3 conflict detection feature
3. ⬜ Test concurrent edit scenarios
4. ⬜ Plan implementation of plan_master.md features

---

## Files Created/Modified

### Created:
- `/migrations/003_add_last_modified_tracking_to_project_data.sql` - Missing migration
- `/run-migrations.js` - Automated migration runner

### Existing:
- `/migrations/002_add_version_tracking_to_project_data.sql` - Partial migration (already existed)
- `/src/stores/projectStore.js` - Uses version column (line 356)
- `/src/composables/useConflictDetection.js` - Expects lastModifiedBy/lastModifiedAt

---

## Questions?

If migrations fail or you see different errors:
1. Check the exact error message in browser console
2. Go to Supabase Logs (Dashboard → Logs → Edge Function Logs)
3. Copy exact error and search for it in codebase
4. Verify your Supabase project is correctly connected in .env file
