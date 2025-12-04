-- Migration: Add last modified tracking for conflict detection UI (Phase 3 Task 3.4)
-- Purpose: Track who modified data and when for better conflict resolution messages
-- Status: CRITICAL - Enables user identification in conflict error messages

-- Add last_modified_by column (tracks which user made the change)
ALTER TABLE project_data
ADD COLUMN IF NOT EXISTS last_modified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add last_modified_at column (tracks when the change was made)
ALTER TABLE project_data
ADD COLUMN IF NOT EXISTS last_modified_at TIMESTAMPTZ DEFAULT NOW();

-- Create function to update last_modified_at on each update
CREATE OR REPLACE FUNCTION update_project_data_last_modified_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_modified_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop old trigger if it exists
DROP TRIGGER IF EXISTS project_data_last_modified_at_trigger ON project_data;

-- Create trigger to update last_modified_at on update
CREATE TRIGGER project_data_last_modified_at_trigger
BEFORE UPDATE ON project_data
FOR EACH ROW
EXECUTE FUNCTION update_project_data_last_modified_at();

-- Create function to set last_modified_by from current user
CREATE OR REPLACE FUNCTION set_project_data_modified_by()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_modified_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop old trigger if it exists
DROP TRIGGER IF EXISTS project_data_modified_by_trigger ON project_data;

-- Create trigger to set last_modified_by on insert/update
CREATE TRIGGER project_data_modified_by_trigger
BEFORE INSERT OR UPDATE ON project_data
FOR EACH ROW
EXECUTE FUNCTION set_project_data_modified_by();

-- Create index on last_modified_by and last_modified_at for queries
CREATE INDEX IF NOT EXISTS idx_project_data_modified
  ON project_data(project_id, last_modified_by, last_modified_at);

-- Verify migration
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'project_data' AND column_name IN ('last_modified_by', 'last_modified_at')
ORDER BY ordinal_position;
