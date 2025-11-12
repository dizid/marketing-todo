-- ============================================================================
-- PHASE 1 PRE-MIGRATION VERIFICATION SCRIPT
-- Run this BEFORE executing PHASE_1_DATABASE_MIGRATION.sql
-- ============================================================================

-- This script verifies your current schema is compatible with Phase 1 additions
-- Run these queries and verify expected results before proceeding

-- ============================================================================
-- CHECK 1: Verify auth.users table exists and has data
-- ============================================================================
-- Expected: Shows count of auth users
-- If returns 0: ⚠️ No users yet (OK, will be created when you sign up)
-- If returns error: ❌ STOP - auth system not working
SELECT COUNT(*) as auth_users_count FROM auth.users;


-- ============================================================================
-- CHECK 2: Verify projects table exists
-- ============================================================================
-- Expected: Table exists with columns (id, user_id, name, description, etc.)
-- If returns error: ❌ STOP - projects table missing or corrupted
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'projects' AND table_schema = 'public'
ORDER BY ordinal_position;


-- ============================================================================
-- CHECK 3: Verify project_data table exists
-- ============================================================================
-- Expected: Table exists with JSONB value column
-- If returns error: ❌ STOP - project_data table missing
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'project_data' AND table_schema = 'public'
ORDER BY ordinal_position;


-- ============================================================================
-- CHECK 4: Check for any existing subscriptions table
-- ============================================================================
-- Expected: Returns 0 rows (table shouldn't exist yet)
-- If returns 1: ⚠️ subscriptions table already exists (migration will skip with ON CONFLICT)
-- If returns error: ✅ OK - table doesn't exist yet
SELECT COUNT(*) as existing_subscriptions_table
FROM information_schema.tables
WHERE table_name = 'subscriptions' AND table_schema = 'public';


-- ============================================================================
-- CHECK 5: Check for any existing ai_usage table
-- ============================================================================
-- Expected: Returns 0 rows (table shouldn't exist yet)
-- If returns 1: ⚠️ ai_usage table already exists
-- If returns error: ✅ OK - table doesn't exist yet
SELECT COUNT(*) as existing_ai_usage_table
FROM information_schema.tables
WHERE table_name = 'ai_usage' AND table_schema = 'public';


-- ============================================================================
-- CHECK 6: Check for any existing payments table
-- ============================================================================
-- Expected: Returns 0 rows (table shouldn't exist yet)
-- If returns 1: ⚠️ payments table already exists
-- If returns error: ✅ OK - table doesn't exist yet
SELECT COUNT(*) as existing_payments_table
FROM information_schema.tables
WHERE table_name = 'payments' AND table_schema = 'public';


-- ============================================================================
-- CHECK 7: FINAL GO/NO-GO DECISION
-- ============================================================================
-- Run this query - if it returns ✅ GO - you're safe to proceed
-- If returns ❌ NO-GO or error - investigate issues first

WITH checks AS (
  SELECT
    'Auth users table exists' as check_name,
    CASE WHEN EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_name = 'users' AND table_schema = 'auth'
    ) THEN '✅' ELSE '❌' END as result

  UNION ALL

  SELECT
    'projects table exists' as check_name,
    CASE WHEN EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_name = 'projects' AND table_schema = 'public'
    ) THEN '✅' ELSE '❌' END as result

  UNION ALL

  SELECT
    'project_data table exists' as check_name,
    CASE WHEN EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_name = 'project_data' AND table_schema = 'public'
    ) THEN '✅' ELSE '❌' END as result

  UNION ALL

  SELECT
    'subscriptions table does NOT exist' as check_name,
    CASE WHEN NOT EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_name = 'subscriptions' AND table_schema = 'public'
    ) THEN '✅' ELSE '⚠️' END as result

  UNION ALL

  SELECT
    'ai_usage table does NOT exist' as check_name,
    CASE WHEN NOT EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_name = 'ai_usage' AND table_schema = 'public'
    ) THEN '✅' ELSE '⚠️' END as result

  UNION ALL

  SELECT
    'payments table does NOT exist' as check_name,
    CASE WHEN NOT EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_name = 'payments' AND table_schema = 'public'
    ) THEN '✅' ELSE '⚠️' END as result
)
SELECT
  CASE
    WHEN COUNT(CASE WHEN result = '❌' THEN 1 END) > 0 THEN '❌ NO-GO: Critical issues found'
    WHEN COUNT(CASE WHEN result = '⚠️' THEN 1 END) > 0 THEN '⚠️ CAUTION: Review warnings'
    ELSE '✅ GO: Safe to proceed with Phase 1'
  END as decision,
  COUNT(*) as checks_run
FROM checks
GROUP BY 1;
