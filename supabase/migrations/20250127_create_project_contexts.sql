-- ============================================================================
-- Phase 1: Create ProjectContext Table
-- ============================================================================
-- Single source of truth for consolidated project-level data
-- Consolidates 10 semantic duplicate groups into unified, inheritable fields
-- Date: 2025-01-27
-- Purpose: Establish ProjectContext as the canonical source for:
--   1. Product identity (name, type, description)
--   2. Target audience & persona
--   3. Primary goal
--   4. Timeline
--   5. Budget & financial metrics
--   6. Team size & stage
--   7. Tech stack
-- Backward compatible: Old project_data table remains intact for fallback

-- Create table
CREATE TABLE project_contexts (
  -- Primary identifiers
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Core identity fields
  product_name TEXT,
  product_type TEXT CHECK (
    product_type IS NULL OR product_type IN (
      'mobile_app', 'saas', 'ecommerce', 'game', 'digital_product', 'other'
    )
  ),
  product_description TEXT,

  -- Audience & goals
  target_audience TEXT,
  primary_goal TEXT CHECK (
    primary_goal IS NULL OR primary_goal IN (
      'first_100', '1k_mrr', '10k_mrr', 'audience', 'validate'
    )
  ),

  -- Timeline & budget
  target_timeline TEXT CHECK (
    target_timeline IS NULL OR target_timeline IN (
      '1_month', '3_months', '6_months', 'no_timeline'
    )
  ),
  marketing_budget NUMERIC(15, 2),

  -- Organization
  team_size TEXT CHECK (
    team_size IS NULL OR team_size IN (
      'solo', '2-5', '6-10', '10+'
    )
  ),
  current_stage TEXT CHECK (
    current_stage IS NULL OR current_stage IN (
      'idea', 'building', 'beta', 'launched'
    )
  ),

  -- Infrastructure
  tech_stack JSONB,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Indexes for Performance
-- ============================================================================

-- Foreign key indexes for fast lookups
CREATE INDEX idx_project_contexts_project_id ON project_contexts(project_id);
CREATE INDEX idx_project_contexts_user_id ON project_contexts(user_id);

-- Composite index for user queries (common pattern)
CREATE INDEX idx_project_contexts_user_updated ON project_contexts(user_id, updated_at DESC);

-- ============================================================================
-- RLS (Row Level Security)
-- ============================================================================

ALTER TABLE project_contexts ENABLE ROW LEVEL SECURITY;

-- Users can only see their own contexts
CREATE POLICY "Users can view own contexts" ON project_contexts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own contexts" ON project_contexts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contexts" ON project_contexts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own contexts" ON project_contexts
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- Trigger for updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_project_contexts_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_project_contexts_updated_at
BEFORE UPDATE ON project_contexts
FOR EACH ROW
EXECUTE FUNCTION update_project_contexts_timestamp();

-- ============================================================================
-- Schema Documentation
-- ============================================================================
-- FIELDS:
--
-- product_name:
--   Consolidated from: onboarding.step1, analytics, paidAds, landingPage
--   Description: Name of the product/service/app
--
-- product_type:
--   Consolidated from: onboarding.step1, analytics
--   Description: Category of product (SaaS, mobile app, etc.)
--
-- product_description:
--   Consolidated from: onboarding.step1, analytics, landingPage
--   Description: One-line or detailed product description
--
-- target_audience:
--   Consolidated from: onboarding.step2, project form, blog, webinar, paid ads
--   Description: Ideal customer profile, persona, or target market
--   Inheritable: YES (tasks can inherit or override)
--
-- primary_goal:
--   Consolidated from: onboarding.step3, project form, analytics, paid ads
--   Description: Primary business objective or campaign goal
--   Inheritable: YES
--
-- target_timeline:
--   Consolidated from: onboarding.step3, project form, webinar
--   Description: Timeline for reaching goal or completing milestone
--   Inheritable: YES
--
-- marketing_budget:
--   Consolidated from: onboarding.step4, paid ads (launch/optimize)
--   Description: Total marketing or advertising budget in dollars
--   Inheritable: YES
--
-- team_size:
--   Source: onboarding.step4
--   Description: Size of team working on product
--   Inheritable: YES
--
-- current_stage:
--   Source: onboarding.step4
--   Description: Current stage of product development/market
--   Inheritable: YES
--
-- tech_stack:
--   Source: project form (future use)
--   Description: Technology stack or tools being used
--   Type: JSONB for flexible structure
--   Inheritable: NO (mostly for reference)
--
-- ============================================================================
-- CONSOLIDATION RATIOS:
-- Before: 85-95 user-facing data points
-- After: ~45-50 core data points (47% reduction)
-- Duplicates eliminated: 10 semantic groups
-- ============================================================================

-- Verify migration
SELECT
  EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'project_contexts') AS table_created,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'project_contexts') AS column_count;
