-- ============================================================================
-- SUPABASE RLS CLEANUP - REMOVE DUPLICATE POLICIES
-- ============================================================================
-- This script removes duplicate RLS policies that were created by running
-- the fix script multiple times
-- ============================================================================

-- IMPORTANT: Run this in your Supabase SQL Editor
-- Dashboard > SQL Editor > New Query > Paste this > Run

-- ============================================================================
-- Step 1: Remove duplicate "view" policies
-- ============================================================================

-- Drop the incorrectly named policy
DROP POLICY IF EXISTS "Users can view own subscription" ON public.subscriptions;

-- ============================================================================
-- Step 2: Verify only the correct policies remain
-- ============================================================================
-- Run this SELECT to verify:
SELECT policyname
FROM pg_policies
WHERE tablename = 'subscriptions'
ORDER BY policyname;

-- ============================================================================
-- EXPECTED RESULT:
-- ============================================================================
-- You should see exactly 4 policies:
-- 1. Service role can manage subscriptions
-- 2. Users can insert their own subscription
-- 3. Users can update their own subscription
-- 4. Users can view their own subscription
--
-- If you still see duplicates, run these individually:
-- DROP POLICY IF EXISTS "Users can view own subscription" ON public.subscriptions;
-- DROP POLICY IF EXISTS "Users can view their own subscription" ON public.subscriptions;
-- Then re-run the SUPABASE_RLS_FIX.sql to create the correct policy once
-- ============================================================================
