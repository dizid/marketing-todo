/**
 * Quota Store (Consolidated)
 *
 * Merged responsibility: Subscription and AI quota management
 * Data: Subscription tier, usage tracking, quota limits, AI usage history
 * Does NOT: Projects, tasks, content (separate stores)
 *
 * This store consolidates the old subscriptionStore and new quotaStore patterns
 * It's the single source of truth for subscription and quota information
 *
 * Uses: QuotaRepository for domain layer data access
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { QuotaRepository } from '@/domain/repositories'
import { Quota } from '@/domain/models'
import { supabase } from '@/utils/supabase'
import { logger } from '@/shared/utils'
import {
  FREE_TIER_QUOTA,
  PREMIUM_TIER_QUOTA,
  SUBSCRIPTION_STATUSES,
  SUBSCRIPTION_CACHE_MAX_AGE
} from '@/shared/config/constants'

const childLogger = logger.child('quotaStore')

export const useQuotaStore = defineStore('quota', () => {
  const authStore = useAuthStore()
  const quotaRepository = new QuotaRepository(supabase, childLogger)

  // ===== STATE =====
  const subscription = ref(null) // { tier, status, created_at }
  const usage = ref(null) // { count, resetDate }
  const quotaModel = ref(null) // Quota domain model
  const aiUsage = ref([]) // AI usage history (from subscriptionStore)
  const isLoading = ref(false)
  const error = ref(null)
  const lastFetched = ref(null) // Cache timestamp for subscriptionStore compatibility

  // Constants
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes for normal operations

  // Guards against concurrent fetches
  let _isFetchingAIUsage = false

  // ===== COMPUTED PROPERTIES =====

  // Tier information with grace period support
  const tier = computed(() => subscription.value?.tier || 'free')

  const effectiveTier = computed(() => {
    if (!subscription.value) return 'free'

    const status = subscription.value.status
    const currentPeriodEnd = subscription.value.current_period_end

    // If past_due, keep premium access while Stripe retries payment
    if (status === SUBSCRIPTION_STATUSES.PAST_DUE) {
      return 'premium'
    }

    // If cancelled but still within billing period, keep premium access
    if (status === SUBSCRIPTION_STATUSES.CANCELLED && currentPeriodEnd) {
      const periodEndDate = new Date(currentPeriodEnd)
      const now = new Date()
      if (now < periodEndDate) {
        return 'premium'
      }
    }

    // Otherwise use DB tier
    return tier.value
  })

  const isFree = computed(() => effectiveTier.value === 'free')
  const isPremium = computed(() => effectiveTier.value === 'premium')

  // Subscription status
  const subscriptionStatus = computed(() => subscription.value?.status || 'active')
  const isActive = computed(() => subscriptionStatus.value === 'active')

  // Quota calculations (from subscriptionStore)
  const currentQuotaLimit = computed(() => {
    return isPremium.value ? PREMIUM_TIER_QUOTA : FREE_TIER_QUOTA
  })

  const currentMonthUsage = computed(() => {
    if (!aiUsage.value || aiUsage.value.length === 0) return 0

    // Get current month's usage
    const now = new Date()
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    return aiUsage.value.filter(usage => {
      const usageDate = new Date(usage.created_at)
      return usageDate >= currentMonth
    }).length
  })

  const remainingQuota = computed(() => {
    const remaining = currentQuotaLimit.value - currentMonthUsage.value
    return Math.max(0, remaining)
  })

  const quotaPercentage = computed(() => {
    return Math.round((currentMonthUsage.value / currentQuotaLimit.value) * 100)
  })

  const hasQuotaRemaining = computed(() => remainingQuota.value > 0)

  // Quota reset date
  const quotaResetDate = computed(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth() + 1, 1)
  })

  const formattedResetDate = computed(() => {
    return quotaResetDate.value.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  })

  // Can user generate AI?
  const canGenerateAI = computed(() => {
    // Premium users always can
    if (isPremium.value) return true

    // Free users need quota remaining
    return hasQuotaRemaining.value
  })

  // Compatibility with new quotaStore pattern
  const canGenerate = computed(() => {
    return quotaModel.value?.canGenerate() ?? canGenerateAI.value
  })

  const quotaMessage = computed(() => {
    return quotaModel.value?.getDisplayMessage() || 'Loading quota...'
  })

  const quotaStatus = computed(() => {
    return quotaModel.value?.getStatus() ?? {}
  })

  // ===== METHODS =====

  /**
   * Fetch subscription status from Supabase
   * Uses cache to avoid excessive database queries
   * Pass force=true to bypass cache (e.g., after payment confirmation)
   */
  async function fetchSubscriptionStatus(force = false) {
    if (!authStore.user) {
      subscription.value = null
      return null
    }

    // Check cache unless force=true
    if (!force && lastFetched.value && Date.now() - lastFetched.value < CACHE_DURATION) {
      return subscription.value
    }

    try {
      isLoading.value = true
      error.value = null

      // Fetch subscription
      const { data, error: fetchError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', authStore.user.id)
        .single()

      if (fetchError) {
        // User might not have subscription yet, that's ok
        if (fetchError.code !== 'PGRST116') {
          throw fetchError
        }
        subscription.value = {
          tier: 'free',
          status: 'active'
        }
      } else {
        subscription.value = data
      }

      lastFetched.value = Date.now()

      // Also cache in localStorage for offline use (read-only)
      localStorage.setItem('subscription_cache', JSON.stringify({
        data: subscription.value,
        cachedAt: Date.now()
      }))

      return subscription.value
    } catch (err) {
      console.error('Failed to fetch subscription:', err)
      error.value = err.message

      // Try to use localStorage fallback
      const cached = localStorage.getItem('subscription_cache')
      if (cached) {
        try {
          const parsedCache = JSON.parse(cached)
          const cacheAge = Date.now() - parsedCache.cachedAt

          // Validate cache is not stale
          if (cacheAge < SUBSCRIPTION_CACHE_MAX_AGE) {
            subscription.value = parsedCache.data
          } else {
            console.warn('[quotaStore] Stale cache rejected, age:', cacheAge)
            subscription.value = { tier: 'free', status: 'active' }
          }
        } catch {
          subscription.value = { tier: 'free', status: 'active' }
        }
      } else {
        subscription.value = { tier: 'free', status: 'active' }
      }

      return subscription.value
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch AI usage for current user
   * Includes guard against concurrent fetches to prevent race conditions
   */
  async function fetchAIUsage() {
    if (!authStore.user) {
      aiUsage.value = []
      return []
    }

    // Prevent concurrent fetches
    if (_isFetchingAIUsage) {
      return aiUsage.value
    }

    _isFetchingAIUsage = true
    try {
      const { data, error: fetchError } = await supabase
        .from('ai_usage')
        .select('*')
        .eq('user_id', authStore.user.id)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      aiUsage.value = data || []
      return aiUsage.value
    } catch (err) {
      console.error('Failed to fetch AI usage:', err)
      aiUsage.value = []
      return []
    } finally {
      _isFetchingAIUsage = false
    }
  }

  /**
   * Track an AI generation (called after successful AI API call)
   * DEPRECATED: Usage tracking is now done server-side in grok-proxy
   */
  async function trackAIUsage(taskId, model, tokensInput, tokensOutput, costEstimate = 0) {
    console.warn('[quotaStore] trackAIUsage is deprecated - tracking is done server-side')

    // Refresh usage count from server to get latest data
    await fetchAIUsage()

    return true
  }

  /**
   * Decrement quota (optimistic update)
   */
  function decrementQuota() {
    if (remainingQuota.value > 0) {
      // This is optimistic - actual decrement happens when usage is tracked
      // Used for UI feedback
    }
  }

  /**
   * Verify premium subscription after Stripe payment
   * Note: Subscription is created server-side by stripe-create-subscription function
   * This fetches the subscription to verify it was created successfully
   */
  async function verifyPremiumUpgrade() {
    if (!authStore.user) {
      throw new Error('User not authenticated')
    }

    try {
      isLoading.value = true
      error.value = null

      // Fetch the subscription - server should have already created it during Stripe flow
      const { data: fetchData, error: fetchError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', authStore.user.id)
        .single()

      if (fetchError) {
        console.error('[quotaStore] Failed to fetch subscription after upgrade:', fetchError)
        throw new Error(`Subscription upgrade failed: ${fetchError.message}`)
      }

      if (!fetchData) {
        throw new Error('Subscription record not found after upgrade')
      }

      subscription.value = fetchData
      lastFetched.value = Date.now()

      console.log('[quotaStore] Subscription verified as premium successfully')
      return fetchData
    } catch (err) {
      console.error('[quotaStore] Failed to upgrade subscription:', err)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Cancel subscription
   */
  async function cancelSubscription(reason = null) {
    if (!authStore.user) {
      throw new Error('User not authenticated')
    }

    try {
      isLoading.value = true
      error.value = null

      // Update subscription to cancelled status
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({
          status: 'cancelled',
          tier: 'free', // Downgrade to free
          cancelled_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', authStore.user.id)

      if (updateError) throw updateError

      // Fetch the updated subscription (avoid .single() errors)
      const { data, error: fetchError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', authStore.user.id)
        .single()

      if (fetchError) throw fetchError

      subscription.value = data
      lastFetched.value = Date.now()

      return data
    } catch (err) {
      console.error('Failed to cancel subscription:', err)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Manually invalidate cache - forces next fetch to hit database
   * Used when we know data has changed (e.g., after payment confirmation)
   */
  function invalidateCache() {
    lastFetched.value = null
    console.log('[quotaStore] Cache invalidated, next fetch will hit database')
  }

  /**
   * Initialize quota store on user login
   */
  async function initialize() {
    if (authStore.user) {
      await fetchSubscriptionStatus(true)
      await fetchAIUsage()
    }
  }

  /**
   * Refactored pattern methods (new quotaStore compatibility)
   */

  /**
   * Initialize quota for user (refactored pattern)
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
   * Fetch current subscription status (refactored pattern)
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
   * Fetch monthly usage (refactored pattern)
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
   * Record usage (called after successful AI generation) - refactored pattern
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
   * Upgrade subscription tier (refactored pattern)
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
    aiUsage.value = []
    lastFetched.value = null
    error.value = null
  }

  return {
    // State
    subscription,
    usage,
    quotaModel,
    aiUsage,
    isLoading,
    error,

    // Computed - Tier information
    tier,
    effectiveTier,
    isFree,
    isPremium,

    // Computed - Subscription status
    subscriptionStatus,
    isActive,

    // Computed - Quota limits
    currentQuotaLimit,
    currentMonthUsage,
    remainingQuota,
    quotaPercentage,
    hasQuotaRemaining,
    quotaResetDate,
    formattedResetDate,
    canGenerateAI,

    // Computed - Refactored pattern
    canGenerate,
    quotaMessage,
    quotaStatus,

    // Methods - Subscription management (from old subscriptionStore)
    fetchSubscriptionStatus,
    fetchAIUsage,
    trackAIUsage,
    decrementQuota,
    verifyPremiumUpgrade,
    cancelSubscription,
    invalidateCache,
    initialize,

    // Methods - Refactored pattern (new quotaStore)
    initializeQuota,
    fetchSubscription,
    fetchUsage,
    recordUsage,
    upgradeToPremium,
    getUsageHistory,
    getUsageStats,

    // Methods - Shared
    reset
  }
})
