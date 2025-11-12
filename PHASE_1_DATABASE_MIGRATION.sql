-- ============================================================================
-- PHASE 1: DATABASE MIGRATION
-- Sales/Marketing Task App - Freemium Model Setup
-- Created: 2025-11-11
-- ============================================================================

-- ============================================================================
-- TABLE 1: SUBSCRIPTIONS
-- Tracks user subscription tier and PayPal subscription details
-- ============================================================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Tier and Status
  tier VARCHAR(20) NOT NULL DEFAULT 'free'
    CHECK (tier IN ('free', 'premium')),
  status VARCHAR(20) NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'cancelled', 'expired', 'paused')),

  -- PayPal Integration
  paypal_subscription_id VARCHAR(255),
  paypal_payer_id VARCHAR(255),

  -- Billing Period
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  current_period_end TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '1 month',
  cancelled_at TIMESTAMPTZ,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_tier ON subscriptions(tier);
CREATE INDEX idx_subscriptions_current_period_end ON subscriptions(current_period_end);

-- Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only view their own subscription
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Only authenticated service role can insert/update (via functions)
CREATE POLICY "Service role can manage subscriptions"
  ON subscriptions FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

---

-- ============================================================================
-- TABLE 2: AI_USAGE
-- Tracks every AI generation for quota enforcement and billing
-- ============================================================================

CREATE TABLE IF NOT EXISTS ai_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,

  -- Task and Model Info
  task_id VARCHAR(100) NOT NULL,
  model VARCHAR(50) NOT NULL
    CHECK (model IN ('grok-2', 'grok-4-fast')),

  -- Token Usage and Cost
  tokens_input INTEGER NOT NULL,
  tokens_output INTEGER NOT NULL,
  cost_estimate DECIMAL(10, 6) NOT NULL DEFAULT 0,

  -- Timestamp
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for efficient querying (created separately)
CREATE INDEX idx_user_period ON ai_usage(user_id, created_at DESC);
CREATE INDEX idx_user_task ON ai_usage(user_id, task_id);
CREATE INDEX idx_created_at ON ai_usage(created_at DESC);

-- Enable Row Level Security
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only view their own AI usage
CREATE POLICY "Users can view own ai usage"
  ON ai_usage FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Service role can insert (via functions)
CREATE POLICY "Service role can insert ai usage"
  ON ai_usage FOR INSERT
  WITH CHECK (auth.jwt()->>'role' = 'service_role');

---

-- ============================================================================
-- TABLE 3: PAYMENTS
-- Audit trail for all payments and transactions
-- ============================================================================

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,

  -- Payment Details
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  status VARCHAR(20) NOT NULL
    CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),

  -- Payment Provider Info
  provider VARCHAR(50) NOT NULL DEFAULT 'paypal'
    CHECK (provider IN ('paypal', 'stripe')),
  provider_payment_id VARCHAR(255) NOT NULL,
  provider_subscription_id VARCHAR(255),

  -- Payment Type
  payment_type VARCHAR(50) NOT NULL DEFAULT 'subscription'
    CHECK (payment_type IN ('subscription', 'one_time', 'ai_generation')),

  -- Metadata (for future use)
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_subscription_id ON payments(subscription_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_provider_id ON payments(provider_payment_id);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);

-- Enable Row Level Security
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only view their own payments
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Service role can insert/update (via functions)
CREATE POLICY "Service role can manage payments"
  ON payments FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

---

-- ============================================================================
-- INITIALIZATION: Create subscriptions for all existing users
-- ============================================================================
-- NOTE: Since this is a fresh start with test users being deleted,
-- this will only create rows for any remaining auth users.
-- After migrations, you can delete test users manually via Supabase dashboard.

INSERT INTO subscriptions (user_id, tier, status)
SELECT
  id as user_id,
  'free' as tier,
  'active' as status
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM subscriptions)
ON CONFLICT (user_id) DO NOTHING;

---

-- ============================================================================
-- VERIFICATION QUERIES (run after migration to confirm success)
-- ============================================================================

-- Check subscriptions table created and initialized
-- SELECT COUNT(*) as subscription_count FROM subscriptions;

-- Check ai_usage table created
-- SELECT COUNT(*) as ai_usage_count FROM ai_usage;

-- Check payments table created
-- SELECT COUNT(*) as payments_count FROM payments;

-- List all tables created
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public'
-- AND table_name IN ('subscriptions', 'ai_usage', 'payments')
-- ORDER BY table_name;

---

-- ============================================================================
-- CLEANUP (Only if needed - run if migration fails)
-- ============================================================================

-- DROP TABLE IF EXISTS payments CASCADE;
-- DROP TABLE IF EXISTS ai_usage CASCADE;
-- DROP TABLE IF EXISTS subscriptions CASCADE;

-- ============================================================================
-- END OF MIGRATION SCRIPT
-- ============================================================================
