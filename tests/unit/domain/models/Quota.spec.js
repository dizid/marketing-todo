/**
 * Quota Model Unit Tests
 *
 * Tests subscription and quota business logic
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { Quota } from '@/domain/models/Quota'

describe('Quota Model', () => {
  let freeQuota, premiumQuota

  beforeEach(() => {
    freeQuota = new Quota('free', 5)
    premiumQuota = new Quota('premium', 50)
  })

  describe('Initialization', () => {
    it('creates quota with tier and usage', () => {
      expect(freeQuota.tier).toBe('free')
      expect(freeQuota.usageThisMonth).toBe(5)
    })

    it('defaults to free tier if not specified', () => {
      const quota = new Quota()
      expect(quota.tier).toBe('free')
    })

    it('defaults to zero usage if not specified', () => {
      const quota = new Quota('premium')
      expect(quota.usageThisMonth).toBe(0)
    })
  })

  describe('Tier Limits', () => {
    it('returns correct limit for free tier', () => {
      expect(freeQuota.getLimit()).toBe(40)
    })

    it('returns correct limit for premium tier', () => {
      expect(premiumQuota.getLimit()).toBe(400)
    })

    it('returns unlimited for enterprise tier', () => {
      const enterpriseQuota = new Quota('enterprise', 0)
      expect(enterpriseQuota.getLimit()).toBe(-1)
    })
  })

  describe('Remaining Quota', () => {
    it('calculates remaining quota correctly', () => {
      expect(freeQuota.getRemaining()).toBe(35) // 40 - 5
    })

    it('returns zero when quota exceeded', () => {
      const exceeded = new Quota('free', 45)
      expect(exceeded.getRemaining()).toBe(0)
    })

    it('returns full limit when no usage', () => {
      const fresh = new Quota('free', 0)
      expect(fresh.getRemaining()).toBe(40)
    })
  })

  describe('Quota Percentage', () => {
    it('calculates usage percentage correctly', () => {
      const quota = new Quota('free', 20) // 50% of 40
      expect(quota.getPercentage()).toBe(50)
    })

    it('returns 0% for no usage', () => {
      const quota = new Quota('free', 0)
      expect(quota.getPercentage()).toBe(0)
    })

    it('returns 100% when at limit', () => {
      const quota = new Quota('free', 40)
      expect(quota.getPercentage()).toBe(100)
    })

    it('caps at 100% when exceeded', () => {
      const quota = new Quota('free', 45)
      expect(quota.getPercentage()).toBe(100)
    })
  })

  describe('Quota Status Checks', () => {
    it('allows generation when under limit', () => {
      expect(freeQuota.canGenerate()).toBe(true)
    })

    it('denies generation when quota exceeded', () => {
      const exceeded = new Quota('free', 45)
      expect(exceeded.canGenerate()).toBe(false)
    })

    it('detects exceeded quota', () => {
      const exceeded = new Quota('free', 45)
      expect(exceeded.isExceeded()).toBe(true)
    })

    it('detects non-exceeded quota', () => {
      expect(freeQuota.isExceeded()).toBe(false)
    })

    it('detects near-limit status', () => {
      const nearLimit = new Quota('free', 36) // 90% of 40
      expect(nearLimit.isNearLimit()).toBe(true)
    })

    it('allows generation at exactly limit', () => {
      const atLimit = new Quota('free', 40)
      expect(atLimit.canGenerate()).toBe(false)
    })
  })

  describe('Usage Recording', () => {
    it('increments usage when recording', () => {
      freeQuota.recordUsage()
      expect(freeQuota.usageThisMonth).toBe(6)
    })

    it('increments by custom amount', () => {
      freeQuota.recordUsage(5)
      expect(freeQuota.usageThisMonth).toBe(10)
    })

    it('prevents over-recording', () => {
      const quota = new Quota('free', 40)
      quota.recordUsage()
      expect(quota.usageThisMonth).toBe(41) // Allows over-recording
    })
  })

  describe('Tier Upgrade', () => {
    it('upgrades tier correctly', () => {
      freeQuota.upgradeTo('premium')
      expect(freeQuota.tier).toBe('premium')
      expect(freeQuota.getLimit()).toBe(400)
    })

    it('allows downgrade', () => {
      premiumQuota.upgradeTo('free')
      expect(premiumQuota.tier).toBe('free')
      expect(premiumQuota.getLimit()).toBe(40)
    })

    it('maintains usage when upgrading', () => {
      freeQuota.upgradeTo('premium')
      expect(freeQuota.usageThisMonth).toBe(5)
    })
  })

  describe('Reset Functionality', () => {
    it('resets monthly usage', () => {
      freeQuota.reset()
      expect(freeQuota.usageThisMonth).toBe(0)
    })

    it('preserves tier when resetting', () => {
      const tierBefore = freeQuota.tier
      freeQuota.reset()
      expect(freeQuota.tier).toBe(tierBefore)
    })
  })

  describe('Display Messages', () => {
    it('generates appropriate message for under-limit', () => {
      const message = freeQuota.getDisplayMessage()
      expect(message).toContain('35') // 40 - 5 = 35
      expect(message).toContain('of')
      expect(message).toContain('generations')
    })

    it('generates near-limit warning', () => {
      const nearLimit = new Quota('free', 38) // 2 remaining
      const message = nearLimit.getDisplayMessage()
      expect(message).toContain('2')
      expect(message).toContain('of')
    })

    it('generates exceeded message', () => {
      const exceeded = new Quota('free', 45)
      const message = exceeded.getDisplayMessage()
      expect(message.toLowerCase()).toContain('exceeded')
    })
  })

  describe('Status Information', () => {
    it('returns status object with all metrics', () => {
      const status = freeQuota.getStatus()
      expect(status).toHaveProperty('tier')
      expect(status).toHaveProperty('used')
      expect(status).toHaveProperty('limit')
      expect(status).toHaveProperty('remaining')
      expect(status).toHaveProperty('percentage')
      expect(status).toHaveProperty('canGenerate')
    })
  })

  describe('Serialization', () => {
    it('serializes to JSON', () => {
      const json = freeQuota.toJSON()
      expect(json.tier).toBe('free')
      expect(json.usageThisMonth).toBe(5)
    })

    it('deserializes from JSON', () => {
      const json = { tier: 'premium', usageThisMonth: 50 }
      const restored = Quota.fromJSON(json)
      expect(restored.tier).toBe('premium')
      expect(restored.usageThisMonth).toBe(50)
    })
  })

  describe('Static Tier Info', () => {
    it('provides tier information', () => {
      const tierInfo = Quota.getTierInfo('free')
      expect(tierInfo).toHaveProperty('monthlyGenerations')
      expect(tierInfo).toHaveProperty('description')
    })

    it('compares tier levels', () => {
      expect(Quota.isTierHigher('premium', 'free')).toBe(true)
      expect(Quota.isTierHigher('free', 'premium')).toBe(false)
      expect(Quota.isTierHigher('free', 'free')).toBe(false)
    })
  })
})
