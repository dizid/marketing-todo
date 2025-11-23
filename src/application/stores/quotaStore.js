/**
 * Quota Store (Refactored)
 *
 * Focused responsibility: Subscription and AI quota management
 * Data: Subscription tier, usage tracking, quota limits
 * Does NOT: Projects, tasks, content (separate stores)
 *
 * Uses: QuotaRepository for data access
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { QuotaRepository } from '@/domain/repositories'
import { Quota } from '@/domain/models'
import { getSupabaseClient } from '@/utils/supabase'
import { logger } from '@/shared/utils'

const childLogger = logger.child('quotaStore')

export const useQuotaStore = defineStore('quota', () => {
  const supabaseClient = getSupabaseClient()
  const quotaRepository = new QuotaRepository(supabaseClient, childLogger)

  // STATE
  const subscription = ref(null) // { tier, status, created_at }
  const usage = ref(null) // { count, resetDate }
  const quotaModel = ref(null) // Quota domain model
  const isLoading = ref(false)
  const error = ref(null)

  // COMPUTED
  const tier = computed(() => subscription.value?.tier || 'free')

  const canGenerate = computed(() => {
    return quotaModel.value?.canGenerate() ?? true
  })

  const remainingQuota = computed(() => {
    return quotaModel.value?.getRemaining() ?? 0
  })

  const quotaPercentage = computed(() => {
    return quotaModel.value?.getPercentage() ?? 0
  })

  const quotaMessage = computed(() => {
    return quotaModel.value?.getDisplayMessage() || 'Loading quota...'
  })

  const quotaStatus = computed(() => {
    return quotaModel.value?.getStatus() ?? {}
  })

  // ACTIONS

  /**
   * Initialize quota for user
   */
  async function initializeQuota(userId) {
    isLoading.value = true
    error.value = null

    try {
      childLogger.debug('Initializing quota', { userId })

      // Fetch subscription
      subscription.value = await quotaRepository.getSubscription(userId)

      // Create quota domain model
      quotaModel.value = await quotaRepository.createQuotaModel(userId)

      childLogger.info('Quota initialized', {
        tier: subscription.value.tier,
        remaining: quotaModel.value.getRemaining()
      })
    } catch (err) {
      error.value = err.message
      childLogger.logError(err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch current subscription status
   */
  async function fetchSubscription(userId) {
    isLoading.value = true
    error.value = null

    try {
      childLogger.debug('Fetching subscription', { userId })
      subscription.value = await quotaRepository.getSubscription(userId)
      childLogger.info('Subscription fetched', { tier: subscription.value.tier })
    } catch (err) {
      error.value = err.message
      childLogger.logError(err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch monthly usage
   */
  async function fetchUsage(userId) {
    isLoading.value = true
    error.value = null

    try {
      childLogger.debug('Fetching usage', { userId })
      const usageData = await quotaRepository.getMonthlyUsage(userId)
      usage.value = {
        count: usageData.count,
        resetDate: usageData.startOfMonth
      }

      // Recreate quota model with updated usage
      if (subscription.value) {
        quotaModel.value = new Quota(subscription.value.tier, usageData.count)
      }

      childLogger.info('Usage fetched', { count: usageData.count })
    } catch (err) {
      error.value = err.message
      childLogger.logError(err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Record usage (called after successful AI generation)
   */
  async function recordUsage(userId, taskId, tokens = 0) {
    try {
      childLogger.debug('Recording usage', { userId, taskId, tokens })

      // Call repository to record
      await quotaRepository.recordUsage(
        userId,
        taskId,
        'grok-2',
        tokens,
        tokens,
        0 // cost calculation can be added later
      )

      // Update local quota model
      if (quotaModel.value) {
        quotaModel.value.recordUsage(1)
      }

      childLogger.info('Usage recorded', { taskId, tokens })
    } catch (err) {
      error.value = err.message
      childLogger.logError(err)
      throw err
    }
  }

  /**
   * Upgrade subscription tier
   */
  async function upgradeToPremium(userId) {
    isLoading.value = true
    error.value = null

    try {
      childLogger.debug('Upgrading to premium', { userId })
      const updated = await quotaRepository.upsertSubscription(userId, 'premium', 'active')
      subscription.value = updated

      // Update quota model
      if (quotaModel.value) {
        quotaModel.value.upgradeTo('premium')
      }

      childLogger.info('Upgraded to premium', { userId })
    } catch (err) {
      error.value = err.message
      childLogger.logError(err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Get usage history
   */
  async function getUsageHistory(userId, limit = 50, offset = 0) {
    try {
      childLogger.debug('Fetching usage history', { userId, limit, offset })
      return await quotaRepository.getUsageHistory(userId, limit, offset)
    } catch (err) {
      error.value = err.message
      childLogger.logError(err)
      throw err
    }
  }

  /**
   * Get usage statistics
   */
  async function getUsageStats(userId) {
    try {
      childLogger.debug('Fetching usage stats', { userId })
      return await quotaRepository.getUsageStats(userId)
    } catch (err) {
      error.value = err.message
      childLogger.logError(err)
      throw err
    }
  }

  /**
   * Reset quota store
   */
  function reset() {
    subscription.value = null
    usage.value = null
    quotaModel.value = null
    error.value = null
  }

  return {
    // State
    subscription,
    usage,
    quotaModel,
    isLoading,
    error,

    // Computed
    tier,
    canGenerate,
    remainingQuota,
    quotaPercentage,
    quotaMessage,
    quotaStatus,

    // Actions
    initializeQuota,
    fetchSubscription,
    fetchUsage,
    recordUsage,
    upgradeToPremium,
    getUsageHistory,
    getUsageStats,
    reset
  }
})
