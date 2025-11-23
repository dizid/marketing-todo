/**
 * useQuotaManagement Composable
 *
 * Provides quota/subscription management interface for components.
 * Wraps quotaStore with business logic.
 */

import { computed } from 'vue'
import { useQuotaStore } from '@/application/stores'
import { logger } from '@/shared/utils'

const childLogger = logger.child('useQuotaManagement')

export function useQuotaManagement() {
  const quotaStore = useQuotaStore()

  /**
   * Get subscription tier
   */
  const tier = computed(() => quotaStore.tier)

  /**
   * Check if can generate AI
   */
  const canGenerate = computed(() => quotaStore.canGenerate)

  /**
   * Get remaining quota
   */
  const remaining = computed(() => quotaStore.remainingQuota)

  /**
   * Get usage percentage (0-100)
   */
  const percentage = computed(() => quotaStore.quotaPercentage)

  /**
   * Get user-friendly message
   */
  const message = computed(() => quotaStore.quotaMessage)

  /**
   * Get full quota status
   */
  const status = computed(() => quotaStore.quotaStatus)

  /**
   * Check if loading
   */
  const isLoading = computed(() => quotaStore.isLoading)

  /**
   * Initialize quota for user
   */
  async function initializeQuota(userId) {
    try {
      await quotaStore.initializeQuota(userId)
      return true
    } catch (err) {
      childLogger.logError(err)
      throw err
    }
  }

  /**
   * Fetch fresh quota data
   */
  async function refreshQuota(userId) {
    try {
      await quotaStore.fetchUsage(userId)
      return true
    } catch (err) {
      childLogger.logError(err)
      throw err
    }
  }

  /**
   * Record usage after AI generation
   */
  async function recordGeneration(userId, taskId, tokens = 0) {
    try {
      await quotaStore.recordUsage(userId, taskId, tokens)
      return true
    } catch (err) {
      childLogger.logError(err)
      throw err
    }
  }

  /**
   * Upgrade to premium
   */
  async function upgradeToPremium(userId) {
    try {
      await quotaStore.upgradeToPremium(userId)
      return true
    } catch (err) {
      childLogger.logError(err)
      throw err
    }
  }

  /**
   * Get usage history
   */
  async function getHistory(userId, limit = 50, offset = 0) {
    try {
      return await quotaStore.getUsageHistory(userId, limit, offset)
    } catch (err) {
      childLogger.logError(err)
      throw err
    }
  }

  /**
   * Get usage statistics
   */
  async function getStats(userId) {
    try {
      return await quotaStore.getUsageStats(userId)
    } catch (err) {
      childLogger.logError(err)
      throw err
    }
  }

  return {
    // Computed properties
    tier,
    canGenerate,
    remaining,
    percentage,
    message,
    status,
    isLoading,

    // Actions
    initializeQuota,
    refreshQuota,
    recordGeneration,
    upgradeToPremium,
    getHistory,
    getStats
  }
}
