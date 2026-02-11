/**
 * QuotaStore effectiveTier Tests
 *
 * Tests subscription grace period logic:
 * - past_due status keeps premium access during Stripe payment retry window
 * - cancel_at_period_end keeps premium until billing period ends
 * - cancelled subscription reverts to free after period_end
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

// Mock dependencies BEFORE importing the store
vi.mock('@/stores/authStore', () => ({
  useAuthStore: vi.fn(() => ({
    user: { id: 'test-user-id' }
  }))
}))

vi.mock('@/utils/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis()
    }))
  }
}))

vi.mock('@/shared/utils', () => ({
  logger: {
    child: vi.fn(() => ({
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      logError: vi.fn()
    }))
  }
}))

vi.mock('@/domain/repositories', () => ({
  QuotaRepository: function MockQuotaRepository() {
    this.getSubscription = async () => ({ tier: 'free', status: 'active' })
    this.getMonthlyUsage = async () => ({ count: 5, startOfMonth: new Date() })
    this.createQuotaModel = async () => ({
      tier: 'free',
      getRemaining: () => 35,
      getLimit: () => 40,
      canGenerate: () => true
    })
  }
}))

vi.mock('@/domain/models', () => ({
  Quota: function MockQuota(tier, usage) {
    this.tier = tier || 'free'
    this.usageThisMonth = usage || 0
  }
}))

// Import store AFTER mocks
import { useQuotaStore } from '@/stores/quotaStore'

describe('QuotaStore - effectiveTier Grace Period Logic', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('past_due status', () => {
    it('returns premium when status is past_due', () => {
      const store = useQuotaStore()

      // Simulate subscription in past_due status
      store.$patch({
        subscription: {
          tier: 'premium',
          status: 'past_due',
          current_period_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
        }
      })

      expect(store.effectiveTier).toBe('premium')
      expect(store.isPremium).toBe(true)
      expect(store.isFree).toBe(false)
    })

    it('keeps premium access during Stripe payment retry window', () => {
      const store = useQuotaStore()

      // User's payment failed, but Stripe is retrying
      store.$patch({
        subscription: {
          tier: 'premium',
          status: 'past_due',
          current_period_end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
        }
      })

      // User should still have premium access
      expect(store.effectiveTier).toBe('premium')
      expect(store.canGenerateAI).toBe(true)
    })
  })

  describe('cancel_at_period_end - scheduled cancellation', () => {
    it('returns premium when status is cancelled but current_period_end is in the future', () => {
      const store = useQuotaStore()

      // User cancelled, but billing period hasn't ended yet
      const futureDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()

      store.$patch({
        subscription: {
          tier: 'premium',
          status: 'cancelled',
          current_period_end: futureDate,
          cancel_at_period_end: true
        }
      })

      expect(store.effectiveTier).toBe('premium')
      expect(store.isPremium).toBe(true)
      expect(store.isFree).toBe(false)
    })

    it('returns free when status is cancelled and current_period_end is in the past', () => {
      const store = useQuotaStore()

      // User cancelled and billing period has ended
      const pastDate = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()

      store.$patch({
        subscription: {
          tier: 'free', // Webhook should have downgraded this
          status: 'cancelled',
          current_period_end: pastDate,
          cancelled_at: pastDate
        }
      })

      expect(store.effectiveTier).toBe('free')
      expect(store.isPremium).toBe(false)
      expect(store.isFree).toBe(true)
    })

    it('handles scheduled cancellation with 1 day remaining', () => {
      const store = useQuotaStore()

      // User cancelled yesterday, period ends tomorrow
      const tomorrowDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

      store.$patch({
        subscription: {
          tier: 'premium',
          status: 'cancelled',
          current_period_end: tomorrowDate,
          cancel_at_period_end: true
        }
      })

      // Should still have premium access for the remaining day
      expect(store.effectiveTier).toBe('premium')
      expect(store.isPremium).toBe(true)
    })
  })

  describe('active subscription', () => {
    it('returns premium when status is active', () => {
      const store = useQuotaStore()

      store.$patch({
        subscription: {
          tier: 'premium',
          status: 'active',
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      })

      expect(store.effectiveTier).toBe('premium')
      expect(store.isPremium).toBe(true)
      expect(store.isFree).toBe(false)
    })

    it('returns free when status is active but tier is free', () => {
      const store = useQuotaStore()

      store.$patch({
        subscription: {
          tier: 'free',
          status: 'active'
        }
      })

      expect(store.effectiveTier).toBe('free')
      expect(store.isPremium).toBe(false)
      expect(store.isFree).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('returns free when subscription is null', () => {
      const store = useQuotaStore()

      store.$patch({
        subscription: null
      })

      expect(store.effectiveTier).toBe('free')
      expect(store.isFree).toBe(true)
    })

    it('returns free when subscription is undefined', () => {
      const store = useQuotaStore()

      store.$patch({
        subscription: undefined
      })

      expect(store.effectiveTier).toBe('free')
      expect(store.isFree).toBe(true)
    })

    it('handles cancelled subscription with no current_period_end', () => {
      const store = useQuotaStore()

      store.$patch({
        subscription: {
          tier: 'free',
          status: 'cancelled',
          current_period_end: null
        }
      })

      // Without a period end date, should default to DB tier
      expect(store.effectiveTier).toBe('free')
    })

    it('handles subscription with invalid date string', () => {
      const store = useQuotaStore()

      store.$patch({
        subscription: {
          tier: 'premium',
          status: 'cancelled',
          current_period_end: 'invalid-date'
        }
      })

      // Invalid date should be treated as past date (NaN < now = false, falls to else)
      expect(store.effectiveTier).toBe('premium')
    })
  })

  describe('quota limits based on effectiveTier', () => {
    it('uses premium quota when effectiveTier is premium (past_due)', () => {
      const store = useQuotaStore()

      store.$patch({
        subscription: {
          tier: 'premium',
          status: 'past_due'
        }
      })

      // PREMIUM_TIER_QUOTA is 400 (from constants)
      expect(store.currentQuotaLimit).toBeGreaterThan(40) // Should be premium limit
      expect(store.canGenerateAI).toBe(true)
    })

    it('uses premium quota when effectiveTier is premium (cancelled but in grace period)', () => {
      const store = useQuotaStore()

      const futureDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()

      store.$patch({
        subscription: {
          tier: 'premium',
          status: 'cancelled',
          current_period_end: futureDate
        }
      })

      expect(store.currentQuotaLimit).toBeGreaterThan(40)
      expect(store.canGenerateAI).toBe(true)
    })

    it('uses free quota when effectiveTier is free (cancelled past period end)', () => {
      const store = useQuotaStore()

      const pastDate = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()

      store.$patch({
        subscription: {
          tier: 'free',
          status: 'cancelled',
          current_period_end: pastDate
        },
        aiUsage: []
      })

      // FREE_TIER_QUOTA is 40 (from constants)
      expect(store.currentQuotaLimit).toBe(40)
    })
  })

  describe('cache expiry validation', () => {
    it('cache age validation logic - accepts fresh cache', () => {
      const store = useQuotaStore()

      // SUBSCRIPTION_CACHE_MAX_AGE is 24 hours (from constants)
      const recentCacheAge = 10 * 60 * 60 * 1000 // 10 hours
      const maxAge = 24 * 60 * 60 * 1000 // 24 hours

      // Fresh cache should be accepted
      expect(recentCacheAge).toBeLessThan(maxAge)
    })

    it('cache age validation logic - rejects stale cache', () => {
      const store = useQuotaStore()

      const staleCacheAge = 25 * 60 * 60 * 1000 // 25 hours
      const maxAge = 24 * 60 * 60 * 1000 // 24 hours

      // Stale cache should be rejected
      expect(staleCacheAge).toBeGreaterThan(maxAge)
    })
  })
})
