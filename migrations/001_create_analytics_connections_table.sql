-- Migration: Create analytics_connections table for secure OAuth token storage
-- Purpose: Move OAuth tokens from plaintext localStorage to encrypted Supabase storage
-- Status: SECURITY CRITICAL - Do not commit plaintext tokens to version control

-- Create the analytics_connections table
CREATE TABLE IF NOT EXISTS analytics_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Platform identification
  platform_type VARCHAR(50) NOT NULL, -- 'email', 'analytics', 'social'
  provider VARCHAR(50) NOT NULL,      -- 'mailchimp', 'google_analytics', 'twitter', etc.
  connection_name VARCHAR(255),       -- User-friendly name for the connection

  -- Credentials (encrypted)
  -- In Supabase, store encrypted tokens using pgcrypto or client-side encryption
  -- For now, we'll use a simple base64 encoding as interim solution
  -- TODO: Upgrade to Supabase Secrets or pgcrypto in production
  encrypted_api_key TEXT,             -- Encrypted/encoded API key
  encrypted_account_id TEXT,          -- Encrypted/encoded account ID
  encrypted_token TEXT,               -- OAuth token (if applicable)

  -- Status tracking
  status VARCHAR(20) DEFAULT 'connected', -- 'connected', 'expired', 'error'
  last_error TEXT,

  -- Timestamps
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_sync TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  CONSTRAINT unique_user_provider UNIQUE(user_id, provider, connection_name)
);

-- Create indexes for efficient querying
CREATE INDEX idx_analytics_connections_user_id
  ON analytics_connections(user_id);

CREATE INDEX idx_analytics_connections_provider
  ON analytics_connections(provider);

CREATE INDEX idx_analytics_connections_status
  ON analytics_connections(status);

-- Enable Row Level Security (RLS) for security
ALTER TABLE analytics_connections ENABLE ROW LEVEL SECURITY;

-- Create RLS policy: Users can only see their own connections
CREATE POLICY "Users can only access their own analytics connections"
  ON analytics_connections
  FOR ALL
  USING (auth.uid() = user_id);

-- Table for sync history (when analytics data was last fetched)
CREATE TABLE IF NOT EXISTS analytics_sync_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID NOT NULL REFERENCES analytics_connections(id) ON DELETE CASCADE,

  -- Sync details
  platform_item_id VARCHAR(255),      -- ID of item being synced (campaign, post, etc.)
  sync_type VARCHAR(50),              -- 'manual', 'scheduled', 'auto'
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'syncing', 'completed', 'failed'

  -- Results
  records_synced INT,
  last_error TEXT,

  -- Timestamps
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,

  -- Metadata
  metadata JSONB
);

-- Create index for efficient sync history querying
CREATE INDEX idx_sync_history_connection_id
  ON analytics_sync_history(connection_id);

CREATE INDEX idx_sync_history_completed_at
  ON analytics_sync_history(completed_at);

-- Grant appropriate permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON analytics_connections TO authenticated;
GRANT SELECT, INSERT, UPDATE ON analytics_sync_history TO authenticated;

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_analytics_connections_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER analytics_connections_updated_at
BEFORE UPDATE ON analytics_connections
FOR EACH ROW
EXECUTE FUNCTION update_analytics_connections_timestamp();

-- Migration note:
-- After creating this table, run the migration script to move existing tokens from localStorage
-- See: migrations/001_migrate_oauth_tokens.js
