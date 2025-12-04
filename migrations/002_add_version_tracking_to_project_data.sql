-- Migration: Add version tracking for optimistic locking (Phase 3 Task 3.4)
-- Purpose: Enable conflict detection for concurrent edits
-- Status: CRITICAL - Enables data conflict detection and resolution

-- Add version column to project_data table
ALTER TABLE project_data
ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

-- Create index on version for efficient conflict detection
CREATE INDEX IF NOT EXISTS idx_project_data_version
  ON project_data(project_id, version);

-- Update trigger to increment version on each update
CREATE OR REPLACE FUNCTION increment_project_data_version()
RETURNS TRIGGER AS $$
BEGIN
  NEW.version = OLD.version + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop old trigger if it exists
DROP TRIGGER IF EXISTS project_data_version_trigger ON project_data;

-- Create new trigger to increment version on update
CREATE TRIGGER project_data_version_trigger
BEFORE UPDATE ON project_data
FOR EACH ROW
EXECUTE FUNCTION increment_project_data_version();

-- Verify migration
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'project_data' AND column_name = 'version';
