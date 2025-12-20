-- Migration: Add businessContext JSONB field to project_data
-- Purpose: Store unified business context data for AI prompt enrichment
-- Date: 2025-11-30

-- 1. Add businessContext column to project_data
ALTER TABLE project_data
ADD COLUMN businessContext JSONB DEFAULT '{}'::jsonb;

-- 2. Add constraint to ensure businessContext is a valid object
ALTER TABLE project_data
ADD CONSTRAINT check_business_context_valid
CHECK (jsonb_typeof(businessContext) = 'object');

-- 3. Create index for faster queries on businessContext
CREATE INDEX idx_business_context
ON project_data USING GIN (businessContext);

-- 4. Create index for completion score lookups
CREATE INDEX idx_business_context_completion
ON project_data USING btree ((businessContext -> 'metadata' -> 'completionScore'));

-- 5. Create audit table for tracking changes to businessContext
CREATE TABLE business_context_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES project_data(id) ON DELETE CASCADE,
  changed_field TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  changed_by UUID REFERENCES auth.users(id),
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create index on audit table for queries
CREATE INDEX idx_business_context_audit_project_id
ON business_context_audit(project_id);

CREATE INDEX idx_business_context_audit_changed_at
ON business_context_audit(changed_at DESC);

-- 7. Enable RLS on audit table
ALTER TABLE business_context_audit ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS policy for audit table (users can only see their own project's audit)
CREATE POLICY "Users can view their own business context audit"
  ON business_context_audit FOR SELECT
  USING (
    project_id IN (
      SELECT pd.id FROM project_data pd
      JOIN projects p ON pd.project_id = p.id
      WHERE p.user_id = auth.uid()
    )
  );

-- 9. Create function to automatically log businessContext changes
CREATE OR REPLACE FUNCTION log_business_context_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only log if businessContext changed
  IF NEW.businessContext IS DISTINCT FROM OLD.businessContext THEN
    INSERT INTO business_context_audit (project_id, changed_field, old_value, new_value, changed_by)
    VALUES (NEW.id, 'businessContext', OLD.businessContext, NEW.businessContext, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Create trigger to log changes
CREATE TRIGGER trigger_log_business_context_change
AFTER UPDATE ON project_data
FOR EACH ROW
EXECUTE FUNCTION log_business_context_change();

-- 11. Add comment to column
COMMENT ON COLUMN project_data.businessContext IS
'Unified business context (7-tier progressive enrichment model). Stores all business, market, brand, goal, marketing, content, and integration data for AI prompt enrichment.';

-- 12. Update project_data updated_at when businessContext changes (if not already done)
-- This ensures the updated_at timestamp is automatically updated
-- The trigger above will fire BEFORE the normal updated_at update
