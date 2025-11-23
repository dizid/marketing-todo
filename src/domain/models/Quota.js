/**
 * Quota Domain Model
 *
 * Represents a user's AI generation quota and usage.
 * Encapsulates quota-specific business logic (checking availability, calculating remaining).
 */

import { SUBSCRIPTION_TIERS, QUOTA_CONFIG } from '@/shared/config'
import { validateEnum } from '@/shared/utils'

export class Quota {
  /**
   * Create a new Quota instance
   *
   * @param {string} tier - Subscription tier (free, premium, enterprise)
   * @param {number} usageThisMonth - Generations used this month
   * @param {Date} resetDate - When quota resets
   */
  constructor(tier = SUBSCRIPTION_TIERS.FREE, usageThisMonth = 0, resetDate = null) {
    validateEnum(tier, Object.values(SUBSCRIPTION_TIERS))

    this.tier = tier
    this.usageThisMonth = Math.max(0, usageThisMonth)
    this.resetDate = resetDate || this.calculateNextResetDate()
  }

  /**
   * Get quota limit for current tier
   */
  getLimit() {
    const config = QUOTA_CONFIG[this.tier]
    return config.monthlyGenerations
  }

  /**
   * Get remaining quota
   */
  getRemaining() {
    const limit = this.getLimit()
    if (limit === -1) return Infinity // Unlimited
    return Math.max(0, limit - this.usageThisMonth)
  }

  /**
   * Get usage percentage (0-100)
   */
  getPercentage() {
    const limit = this.getLimit()
    if (limit === -1 || limit === 0) return 0
    return Math.min(100, Math.round((this.usageThisMonth / limit) * 100))
  }

  /**
   * Check if user can generate (has quota remaining)
   */
  canGenerate() {
    return this.getRemaining() > 0
  }

  /**
   * Check if quota is exceeded
   */
  isExceeded() {
    return !this.canGenerate()
  }

  /**
   * Check if quota is near limit (80% or more used)
   */
  isNearLimit() {
    const percentage = this.getPercentage()
    return percentage >= 80
  }

  /**
   * Record usage
   */
  recordUsage(count = 1) {
    this.usageThisMonth += count
    return this
  }

  /**
   * Reset quota (called on reset date)
   */
  reset() {
    this.usageThisMonth = 0
    this.resetDate = this.calculateNextResetDate()
    return this
  }

  /**
   * Check if reset is due
   */
  isDueForReset() {
    if (!this.resetDate) return false
    return new Date() >= new Date(this.resetDate)
  }

  /**
   * Upgrade tier
   */
  upgradeTo(newTier) {
    validateEnum(newTier, Object.values(SUBSCRIPTION_TIERS))
    this.tier = newTier
    return this
  }

  /**
   * Get quota display message
   */
  getDisplayMessage() {
    if (this.tier === SUBSCRIPTION_TIERS.ENTERPRISE) {
      return 'Unlimited AI generations'
    }

    const remaining = this.getRemaining()
    const limit = this.getLimit()

    if (remaining === 0) {
      return `Quota exceeded (${limit} per month)`
    }

    return `${remaining} of ${limit} generations left`
  }

  /**
   * Get detailed quota status
   */
  getStatus() {
    return {
      tier: this.tier,
      limit: this.getLimit(),
      used: this.usageThisMonth,
      remaining: this.getRemaining(),
      percentage: this.getPercentage(),
      canGenerate: this.canGenerate(),
      isExceeded: this.isExceeded(),
      isNearLimit: this.isNearLimit(),
      resetDate: this.resetDate,
      message: this.getDisplayMessage()
    }
  }

  /**
   * Calculate next reset date (1st of next month)
   */
  calculateNextResetDate() {
    const now = new Date()
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    return nextMonth
  }

  /**
   * Get days until reset
   */
  getDaysUntilReset() {
    const now = new Date()
    const resetDate = new Date(this.resetDate)
    const diffTime = resetDate - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
  }

  /**
   * Check if quota period has changed (month changed)
   */
  hasMonthChanged(lastCheckDate) {
    if (!lastCheckDate) return true
    const lastCheck = new Date(lastCheckDate)
    const now = new Date()
    return lastCheck.getMonth() !== now.getMonth() || lastCheck.getFullYear() !== now.getFullYear()
  }

  /**
   * Serialize to plain object
   */
  toJSON() {
    return {
      tier: this.tier,
      usageThisMonth: this.usageThisMonth,
      resetDate: this.resetDate
    }
  }

  /**
   * Create Quota from plain object
   */
  static fromJSON(json) {
    return new Quota(
      json.tier || SUBSCRIPTION_TIERS.FREE,
      json.usageThisMonth || 0,
      json.resetDate
    )
  }

  /**
   * Get quota tier info
   */
  static getTierInfo(tier) {
    validateEnum(tier, Object.values(SUBSCRIPTION_TIERS))
    return QUOTA_CONFIG[tier]
  }

  /**
   * Compare two tiers
   */
  static isTierHigher(tier1, tier2) {
    const tiers = Object.values(SUBSCRIPTION_TIERS)
    return tiers.indexOf(tier1) > tiers.indexOf(tier2)
  }
}
