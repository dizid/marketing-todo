-- ============================================================================
-- Phase 6: Create Task Field Overrides Table
-- ============================================================================
-- Stores task-level field overrides that inherit from ProjectContext
-- Enables tasks to override project-level field values while maintaining inheritance
-- Date: 2025-01-27
-- Purpose: Support task-specific field values with inheritance chain:
--   1. Task-level override (if set)
--   2. Project-level inherited value (from ProjectContext)
--   3. Default value

-- Create task_field_overrides table
CREATE TABLE task_field_overrides (
  -- Primary identifiers
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  task_id UUID NOT NULL,  -- References tasks.id (allows any task structure)
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Field override data
  field_name TEXT NOT NULL, -- Canonical field name from CANONICAL_FIELDS
  field_value JSONB, -- Can store any JSON-serializable value
  field_type TEXT, -- Type hint: 'string', 'number', 'select', 'date', 'json'

  -- Metadata for tracking
  overridden_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  source TEXT DEFAULT 'ui', -- Where the override came from: 'ui', 'api', 'migration'

  -- Constraints
  UNIQUE(project_id, task_id, field_name), -- One override per field per task
  CHECK (field_name IS NOT NULL AND field_name != '')
);

-- ============================================================================
-- Indexes for Performance
-- ============================================================================

-- Fast lookups by project + task
CREATE INDEX idx_task_overrides_project_task ON task_field_overrides(project_id, task_id);

-- Fast lookups by project + field for bulk queries
CREATE INDEX idx_task_overrides_project_field ON task_field_overrides(project_id, field_name);

-- Fast lookups by user (common pattern)
CREATE INDEX idx_task_overrides_user_id ON task_field_overrides(user_id);

-- Composite index for user task queries
CREATE INDEX idx_task_overrides_user_task ON task_field_overrides(user_id, task_id, field_name);

-- ============================================================================
-- RLS (Row Level Security)
-- ============================================================================

ALTER TABLE task_field_overrides ENABLE ROW LEVEL SECURITY;

-- Users can only see overrides for their own projects
CREATE POLICY "Users can view own task overrides" ON task_field_overrides
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own task overrides" ON task_field_overrides
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own task overrides" ON task_field_overrides
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own task overrides" ON task_field_overrides
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- Trigger for updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_task_field_overrides_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_task_field_overrides_updated_at
BEFORE UPDATE ON task_field_overrides
FOR EACH ROW
EXECUTE FUNCTION update_task_field_overrides_timestamp();

-- ============================================================================
-- Schema Documentation
-- ============================================================================
-- COLUMNS:
--
-- project_id:
--   References projects table
--   Used for RLS and inheritance chain
--
-- task_id:
--   Task identifier (UUID)
--   Does not directly reference a table (flexible)
--   Allows any task structure or external task systems
--
-- field_name:
--   Canonical field name from CANONICAL_FIELDS registry
--   Examples: 'product_name', 'target_audience', 'primary_goal'
--   Used to match with ProjectContext fields
--
-- field_value:
--   JSONB to handle any field type
--   Can be: string, number, boolean, object, array, null
--   Allows flexible value storage without schema coupling
--
-- field_type:
--   Type hint for form rendering and validation
--   Values: 'string', 'number', 'select', 'date', 'json'
--   Optional but useful for UI/validation
--
-- source:
--   Tracks where the override came from
--   'ui' - User interface override
--   'api' - API override
--   'migration' - Data migration override
--
-- ============================================================================
-- INHERITANCE CHAIN RESOLUTION:
-- When getting a field value for a task:
-- 1. Check task_field_overrides for override
--    → If found, return override value (source: task)
-- 2. Check project_contexts for inherited value
--    → If found and field is inheritable, return value (source: project)
-- 3. Return default or null
--    → No value found (source: default)
-- ============================================================================
-- QUERY EXAMPLES:
--
-- Get all overrides for a task:
--   SELECT * FROM task_field_overrides
--   WHERE project_id = $1 AND task_id = $2
--   ORDER BY field_name;
--
-- Get specific field override:
--   SELECT field_value FROM task_field_overrides
--   WHERE project_id = $1 AND task_id = $2 AND field_name = $3;
--
-- Get resolution chain (override + inherited):
--   SELECT
--     COALESCE(tfo.field_value, pc.product_name) as resolved_value,
--     CASE WHEN tfo.id IS NOT NULL THEN 'override'
--          WHEN pc.product_name IS NOT NULL THEN 'inherited'
--          ELSE 'default' END as source
--   FROM task_field_overrides tfo
--   FULL OUTER JOIN project_contexts pc ON pc.project_id = tfo.project_id
--   WHERE tfo.project_id = $1 AND tfo.task_id = $2 AND tfo.field_name = 'product_name';
--
-- ============================================================================

-- Verify migration
SELECT
  EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'task_field_overrides') AS table_created,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'task_field_overrides') AS column_count;
