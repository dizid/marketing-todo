-- Migration: Create normalized task storage tables for SSOT Phase 4
-- Purpose: Store user input (formData) and selections (savedItems) in normalized tables
-- This enables field-level querying, reduces conflicts, and eliminates AI response storage
-- Date: 2025-01-11

-- =============================================================================
-- Table 1: task_form_data - Stores individual form field values (USER INPUT)
-- =============================================================================
-- Each row = one field value for one task in one project
-- Benefits:
--   - Field-level updates (no version conflicts on concurrent edits)
--   - Easy to query specific fields across projects
--   - Timestamp tracking per field
--   - User attribution per field

CREATE TABLE IF NOT EXISTS public.task_form_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  task_id TEXT NOT NULL,                    -- e.g., 'define-audience', 'cold-outreach'
  field_name TEXT NOT NULL,                 -- e.g., 'targetAudience', 'emailSubject'
  field_value JSONB,                        -- Supports any field type (string, array, object)
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Unique constraint: one value per field per task per project
  CONSTRAINT task_form_data_unique UNIQUE (project_id, task_id, field_name)
);

-- Index for fast lookups by project + task (most common query)
CREATE INDEX IF NOT EXISTS idx_task_form_data_project_task
  ON public.task_form_data(project_id, task_id);

-- Index for querying specific fields across all projects (analytics)
CREATE INDEX IF NOT EXISTS idx_task_form_data_field_name
  ON public.task_form_data(field_name);

-- Index for recent changes (debugging, audit)
CREATE INDEX IF NOT EXISTS idx_task_form_data_updated_at
  ON public.task_form_data(updated_at DESC);

-- =============================================================================
-- Table 2: task_saved_items - Stores user selections/saved outputs
-- =============================================================================
-- Each row = one saved item (e.g., saved AI output, user-created content)
-- Separated from form data because:
--   - Items are append-only (not field updates)
--   - Different access patterns (list vs. key-value)
--   - Can have multiple items per task

CREATE TABLE IF NOT EXISTS public.task_saved_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  task_id TEXT NOT NULL,                    -- e.g., 'define-audience', 'cold-outreach'
  item_data JSONB NOT NULL,                 -- The saved item content
  item_order INTEGER DEFAULT 0,             -- For maintaining display order
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  saved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Index for fast lookups by project + task
CREATE INDEX IF NOT EXISTS idx_task_saved_items_project_task
  ON public.task_saved_items(project_id, task_id);

-- Index for ordering items
CREATE INDEX IF NOT EXISTS idx_task_saved_items_order
  ON public.task_saved_items(project_id, task_id, item_order);

-- =============================================================================
-- Trigger: Auto-update updated_at on task_form_data changes
-- =============================================================================

CREATE OR REPLACE FUNCTION public.update_task_form_data_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_task_form_data_updated_at ON public.task_form_data;
CREATE TRIGGER trigger_task_form_data_updated_at
  BEFORE UPDATE ON public.task_form_data
  FOR EACH ROW
  EXECUTE FUNCTION public.update_task_form_data_updated_at();

-- =============================================================================
-- Row Level Security (RLS) Policies
-- =============================================================================

-- Enable RLS on both tables
ALTER TABLE public.task_form_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_saved_items ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access form data for their own projects
CREATE POLICY task_form_data_user_access ON public.task_form_data
  FOR ALL
  USING (
    project_id IN (
      SELECT id FROM public.projects WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    project_id IN (
      SELECT id FROM public.projects WHERE user_id = auth.uid()
    )
  );

-- Policy: Users can only access saved items for their own projects
CREATE POLICY task_saved_items_user_access ON public.task_saved_items
  FOR ALL
  USING (
    project_id IN (
      SELECT id FROM public.projects WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    project_id IN (
      SELECT id FROM public.projects WHERE user_id = auth.uid()
    )
  );

-- =============================================================================
-- Comments for documentation
-- =============================================================================

COMMENT ON TABLE public.task_form_data IS 'Normalized storage for task form field values (SSOT Phase 4). Each row stores one field value for one task.';
COMMENT ON COLUMN public.task_form_data.task_id IS 'Task identifier from task config (e.g., define-audience, cold-outreach)';
COMMENT ON COLUMN public.task_form_data.field_name IS 'Form field identifier from task config formFields';
COMMENT ON COLUMN public.task_form_data.field_value IS 'Field value as JSONB to support all types (string, array, object)';

COMMENT ON TABLE public.task_saved_items IS 'Stores user-saved items like AI outputs they want to keep. Separate from form data for different access patterns.';
COMMENT ON COLUMN public.task_saved_items.item_data IS 'The saved item content as JSONB (label, content, timestamp, etc.)';
COMMENT ON COLUMN public.task_saved_items.item_order IS 'Display order within the task (0-indexed)';

-- =============================================================================
-- Grant permissions (if needed for service roles)
-- =============================================================================

-- Note: Supabase handles permissions via RLS policies above
-- These grants are for completeness if using service role access

GRANT SELECT, INSERT, UPDATE, DELETE ON public.task_form_data TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.task_saved_items TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
