# Affiliate Program Implementation Plan

**Date**: November 24, 2025
**Status**: Planning Phase
**Scope**: Full affiliate/referral program with commission tracking

---

## Executive Summary

This plan outlines the implementation of a professional affiliate/referral program for Launchpilot. The program allows users to refer others and earn commissions when referred users upgrade to premium subscriptions. The implementation leverages existing Stripe integration and Supabase database infrastructure.

---

## Phase 1: Database Schema

### New Tables to Create

#### 1. `affiliate_users`
Tracks which users are affiliates and their commission settings.

```sql
CREATE TABLE affiliate_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  affiliate_code VARCHAR(20) NOT NULL UNIQUE,
  commission_rate DECIMAL(5,2) DEFAULT 10.00, -- Percentage (e.g., 10.00 = 10%)
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'suspended'
  total_referrals INTEGER DEFAULT 0,
  total_earned DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CHECK (commission_rate >= 0 AND commission_rate <= 100),
  CHECK (status IN ('active', 'inactive', 'suspended'))
);

CREATE INDEX idx_affiliate_users_user_id ON affiliate_users(user_id);
CREATE INDEX idx_affiliate_users_code ON affiliate_users(affiliate_code);
```

#### 2. `affiliate_codes`
Unique referral codes per user (allows multiple codes per affiliate).

```sql
CREATE TABLE affiliate_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES affiliate_users(id) ON DELETE CASCADE,
  code VARCHAR(50) NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),

  CHECK (code ~ '^[A-Z0-9]+$') -- Only uppercase alphanumeric
);

CREATE INDEX idx_affiliate_codes_code ON affiliate_codes(code);
CREATE INDEX idx_affiliate_codes_affiliate_id ON affiliate_codes(affiliate_id);
```

#### 3. `referral_relationships`
Maps referred users to their referrers (one referrer per referred user).

```sql
CREATE TABLE referral_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referred_user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  affiliate_user_id UUID NOT NULL REFERENCES affiliate_users(id) ON DELETE CASCADE,
  referral_code VARCHAR(50) NOT NULL REFERENCES affiliate_codes(code),
  signup_date TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'active', 'cancelled'
  created_at TIMESTAMP DEFAULT NOW(),

  CHECK (status IN ('pending', 'active', 'cancelled'))
);

CREATE INDEX idx_referral_relationships_referred_user ON referral_relationships(referred_user_id);
CREATE INDEX idx_referral_relationships_affiliate ON referral_relationships(affiliate_user_id);
CREATE INDEX idx_referral_relationships_status ON referral_relationships(status);
```

#### 4. `affiliate_commissions`
Commission records for tracking earnings.

```sql
CREATE TABLE affiliate_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_user_id UUID NOT NULL REFERENCES affiliate_users(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  commission_rate DECIMAL(5,2) NOT NULL, -- Rate at time of calculation
  payment_amount DECIMAL(10,2) NOT NULL, -- Amount after fees/deductions
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'calculated', 'held', 'paid'
  paid_at TIMESTAMP,
  calculated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),

  CHECK (amount > 0),
  CHECK (commission_rate >= 0 AND commission_rate <= 100),
  CHECK (status IN ('pending', 'calculated', 'held', 'paid'))
);

CREATE INDEX idx_affiliate_commissions_affiliate ON affiliate_commissions(affiliate_user_id);
CREATE INDEX idx_affiliate_commissions_status ON affiliate_commissions(status);
CREATE INDEX idx_affiliate_commissions_paid_at ON affiliate_commissions(paid_at);
```

#### 5. `affiliate_payouts`
Payout history and tracking.

```sql
CREATE TABLE affiliate_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_user_id UUID NOT NULL REFERENCES affiliate_users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  payout_method VARCHAR(50), -- 'stripe', 'bank_transfer', 'paypal'
  payout_reference VARCHAR(255), -- External payout ID
  requested_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),

  CHECK (amount > 0),
  CHECK (status IN ('pending', 'processing', 'completed', 'failed'))
);

CREATE INDEX idx_affiliate_payouts_user ON affiliate_payouts(affiliate_user_id);
CREATE INDEX idx_affiliate_payouts_status ON affiliate_payouts(status);
```

### Row Level Security (RLS) Policies

Apply RLS to ensure users only see their own affiliate data:

```sql
-- affiliate_users: Users see only their own record
ALTER TABLE affiliate_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY affiliate_users_select ON affiliate_users FOR SELECT
  USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');

-- affiliate_commissions: Users see only their referrer's commissions
CREATE POLICY affiliate_commissions_select ON affiliate_commissions FOR SELECT
  USING (auth.uid() = affiliate_user_id OR
         auth.uid() = (SELECT user_id FROM affiliate_users WHERE id = affiliate_user_id));

-- affiliate_payouts: Users see only their own payouts
CREATE POLICY affiliate_payouts_select ON affiliate_payouts FOR SELECT
  USING (auth.uid() = (SELECT user_id FROM affiliate_users WHERE id = affiliate_user_id));
```

---

## Phase 2: Backend Functions (Netlify)

### 1. `affiliate-generate-code.cjs`
Generate a unique referral code for a user.

**Endpoint**: `POST /.netlify/functions/affiliate-generate-code`

**Request**:
```json
{
  "userId": "uuid",
  "customCode": "OPTIONAL_CUSTOM_CODE" // Optional, auto-generate if not provided
}
```

**Response**:
```json
{
  "code": "FRIEND123",
  "affiliateId": "uuid",
  "referralUrl": "https://app.example.com/?ref=FRIEND123"
}
```

**Logic**:
- Verify user is authenticated
- Create `affiliate_users` record if doesn't exist
- Generate unique code (or validate custom code)
- Insert into `affiliate_codes` table
- Return code and referral URL

---

### 2. `affiliate-validate-referral.cjs`
Validate a referral code at signup.

**Endpoint**: `POST /.netlify/functions/affiliate-validate-referral`

**Request**:
```json
{
  "code": "FRIEND123"
}
```

**Response**:
```json
{
  "valid": true,
  "affiliateId": "uuid",
  "affiliateName": "John Doe"
}
```

**Logic**:
- Check if code exists in `affiliate_codes`
- Verify code is active
- Return affiliate info for UI display
- Prevent self-referrals

---

### 3. `affiliate-track-conversion.cjs`
Record a referral signup (called from AuthForm after signup).

**Endpoint**: `POST /.netlify/functions/affiliate-track-conversion`

**Request**:
```json
{
  "userId": "uuid",
  "referralCode": "FRIEND123"
}
```

**Response**:
```json
{
  "success": true,
  "referralId": "uuid"
}
```

**Logic**:
- Verify new user exists
- Verify referral code is valid
- Prevent self-referrals
- Prevent duplicate referrals (one per user)
- Insert into `referral_relationships` with status='pending'
- Mark as 'active' when subscription is confirmed

---

### 4. `affiliate-commission-calculator.cjs`
Calculate and record commissions when payment succeeds (called from webhook).

**Triggered by**: Stripe webhook `invoice.payment_succeeded`

**Logic**:
- Check if subscription payment is from a referred user
- Look up referral relationship in `referral_relationships`
- Calculate commission: `invoice_amount * (commission_rate / 100)`
- Insert into `affiliate_commissions` with status='calculated'
- Update `affiliate_users.total_earned`
- Update `referral_relationships.status` to 'active'

---

## Phase 3: Frontend State Management

### New Pinia Store: `affiliateStore.js`

```javascript
export const useAffiliateStore = defineStore('affiliate', () => {
  const affiliateData = ref(null)
  const referralStats = ref({
    totalReferrals: 0,
    activeReferrals: 0,
    totalEarnings: 0
  })
  const affiliateCode = ref(null)
  const isAffiliate = ref(false)

  const fetchAffiliateData = async (userId) => {
    // Fetch affiliate_users record
  }

  const generateCode = async (userId) => {
    // Call affiliate-generate-code function
  }

  const trackReferral = async (userId, code) => {
    // Call affiliate-track-conversion function
  }

  const fetchCommissions = async () => {
    // Fetch affiliate_commissions for logged-in user
  }

  return {
    affiliateData,
    referralStats,
    affiliateCode,
    isAffiliate,
    fetchAffiliateData,
    generateCode,
    trackReferral,
    fetchCommissions
  }
})
```

---

## Phase 4: Frontend UI Components

### New Route: `/app/affiliate`

Protected route that displays affiliate dashboard.

### Components to Create

#### 1. `AffiliateDashboard.vue`
Main dashboard showing stats and options.

**Features**:
- Display affiliate stats (referrals, active, earnings)
- Show referral code/URL
- Link to commission history
- Settings button

#### 2. `ReferralUrlDisplay.vue`
Show and copy referral link.

**Features**:
- Display referral URL
- Copy-to-clipboard button
- QR code (optional)
- Share options (email, social)

#### 3. `CommissionHistory.vue`
Table of commissions earned.

**Features**:
- Sortable table
- Filter by status/date
- Show amount, referrer, date
- Export to CSV

#### 4. `AffiliateSettings.vue`
Configure affiliate preferences.

**Features**:
- Generate additional codes
- Set commission rate (admin-only)
- View payout methods
- Request payout

#### 5. `ReferralStats.vue`
Stat cards component.

**Features**:
- Total referrals
- Active referrals
- Total earnings
- Pending earnings

---

## Phase 5: Integration Points

### 1. AuthForm.vue (Signup)
Capture referral code from URL parameter `?ref=CODE`

```javascript
// In AuthForm.vue setup
const route = useRoute()
const referralCode = route.query.ref // Capture ?ref=CODE

// After signup succeeds
if (referralCode) {
  await affiliateStore.trackReferral(newUserId, referralCode)
}
```

### 2. LandingPage.vue
Add affiliate CTAs and information section.

**Content**:
- "Earn money by referring friends"
- CTA button linking to affiliate signup

### 3. stripe-webhook.cjs
Hook into `invoice.payment_succeeded` to calculate commissions.

```javascript
async function handlePaymentSuccess(paymentIntent) {
  const userId = paymentIntent.metadata.userId

  // Check if user has referrer
  const referral = await supabase
    .from('referral_relationships')
    .select('affiliate_user_id')
    .eq('referred_user_id', userId)
    .eq('status', 'pending')
    .single()

  if (referral) {
    // Calculate and record commission
    // Update referral status to 'active'
  }
}
```

### 4. ManageSubscriptionPage.vue
Add affiliate section showing referral progress.

---

## Key Features & Anti-Fraud Measures

### Fraud Prevention
1. **No Self-Referrals**: Prevent users from using their own code
2. **One Referrer Per User**: First-click attribution only
3. **Verification on Signup**: Validate referral code before allowing signup
4. **Webhook-Based Commissions**: Calculate from official Stripe events only
5. **Payment Hold Period**: Commissions held for 30 days after payment (optional)

### Commission Timing
- **Immediate**: Commission calculated on `invoice.payment_succeeded`
- **Held**: Commissions held for 30 days (after subscription payment confirmed)
- **Released**: After hold period, available for payout

### Payout Processing
**Phase 1** (Current): Manual payout tracking
**Phase 2** (Future): Stripe Connect or automated bank transfers

---

## Implementation Order

1. Create database tables + RLS policies
2. Build backend functions (generate, validate, track, calculate)
3. Create Pinia store (affiliateStore.js)
4. Build UI components (5 components + route)
5. Integrate with existing flows (signup, webhook, landing page)
6. Add tests and documentation

---

## Estimated Effort

| Component | LOC | Effort |
|-----------|-----|--------|
| Database Schema | 100 | 1 hour |
| Backend Functions | 400 | 3 hours |
| Pinia Store | 150 | 1 hour |
| Vue Components | 500 | 4 hours |
| Integration Points | 200 | 2 hours |
| Testing & Docs | 100 | 2 hours |
| **Total** | **~1,450** | **~13 hours** |

---

## Success Criteria

- ✅ Users can generate unique referral codes
- ✅ Referral signups properly attributed to referrers
- ✅ Commissions calculated accurately on payment
- ✅ Dashboard displays real-time stats
- ✅ No fraud/gaming possible (self-referrals, duplicates, etc.)
- ✅ Payout tracking audit trail
- ✅ Complete test coverage

---

## Future Enhancements

1. **Stripe Connect Integration**: Automated payouts to affiliate bank accounts
2. **Tiered Commissions**: Different rates based on performance
3. **Leaderboard**: Top affiliates display
4. **Marketing Materials**: Co-branded assets for affiliates
5. **Advanced Analytics**: Cohort analysis, LTV tracking
6. **API Access**: Programmatic referral tracking
7. **Affiliate Portal**: Dedicated site for affiliate management
8. **Tax Reporting**: 1099 generation for US affiliates

---

**Next Steps**: Approve plan and begin implementation with Phase 1 (Database Schema).
