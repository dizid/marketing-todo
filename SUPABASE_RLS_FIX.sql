-- ============================================================================
-- SUPABASE RLS FIX FOR SUBSCRIPTIONS TABLE
-- ============================================================================
-- This script fixes RLS (Row Level Security) policies to allow authenticated
-- users to read/write their own subscription records
-- ============================================================================

-- IMPORTANT: Run this in your Supabase SQL Editor
-- Dashboard > SQL Editor > New Query > Paste this > Run

-- ============================================================================
-- Step 1: Enable RLS on subscriptions table
-- ============================================================================
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Step 2: Create policies for authenticated users
-- ============================================================================

-- Policy 1: Allow authenticated users to SELECT their own subscription
CREATE POLICY "Users can view their own subscription"
  ON public.subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy 2: Allow authenticated users to UPDATE their own subscription
CREATE POLICY "Users can update their own subscription"
  ON public.subscriptions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy 3: Allow authenticated users to INSERT their own subscription
CREATE POLICY "Users can insert their own subscription"
  ON public.subscriptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy 4: Allow service role (Netlify functions) to bypass RLS
-- This allows our backend functions to manage subscriptions
-- NOTE: Service role is only available server-side with SUPABASE_SERVICE_ROLE_KEY
-- It automatically bypasses all RLS policies, so no explicit policy needed

-- ============================================================================
-- Step 3: Verify policies were created
-- ============================================================================
-- Run this SELECT to verify all policies:
SELECT schemaname, tablename, policyname, permissive, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'subscriptions'
ORDER BY policyname;

-- ============================================================================
-- Step 4: Test if subscriptions table exists
-- ============================================================================
-- This query verifies the table schema:
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'subscriptions' AND table_schema = 'public'
ORDER BY ordinal_position;

-- ============================================================================
-- EXPLANATION OF WHAT THIS DOES:
-- ============================================================================
-- 1. Enables RLS on the subscriptions table
--    - This means all queries are subject to security policies by default
--    - Without explicit policies, authenticated users can't access anything
--
-- 2. SELECT policy: Users can only read their own subscription record
--    - Matches WHERE clause: auth.uid() = user_id
--    - This fixes the 406 error on subscription reads
--
-- 3. UPDATE policy: Users can only update their own subscription record
--    - Uses USING clause to check permissions
--    - Uses WITH CHECK to verify data is for their own user_id
--
-- 4. INSERT policy: Users can only insert their own subscription record
--    - WITH CHECK ensures they can't create records for other users
--
-- 5. Service role bypass: The SUPABASE_SERVICE_ROLE_KEY automatically bypasses
--    all RLS policies when used server-side (in Netlify functions)
--    - This allows the backend to modify subscriptions as needed
--    - The backend uses service role key, not anon key
--
-- ============================================================================
-- HOW THIS FIXES YOUR ERROR:
-- ============================================================================
-- Error: "406 Not Acceptable" from Supabase
-- Cause: Missing RLS policies - frontend couldn't read subscriptions table
-- Fix: These policies allow authenticated users to read their own records
--
-- ============================================================================
-- SECURITY NOTES:
-- ============================================================================
-- ✓ Users can only see/modify their own subscription
-- ✓ Service role (backend) can see/modify all subscriptions
-- ✓ No row-level data leakage between users
-- ✓ RLS policies enforce data isolation at the database level
-- ============================================================================
