/**
 * AI Quota Service
 * Handles AI generation quota enforcement and tracking
 *
 * Features:
 * - Check if user has quota remaining
 * - Track AI generation usage
 * - Calculate monthly quotas
 * - Enforce tier-based limits (Free: 20/month, Premium: 200/month)
 */

import { useSubscriptionStore } from '@/stores/subscriptionStore'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/utils/supabase'

const FREE_TIER_QUOTA = 20
const PREMIUM_TIER_QUOTA = 200

/**
 * Check if user can generate AI content
 * @returns {boolean} Whether user has quota remaining
 */
export const canGenerateAI = () => {
  const subscriptionStore = useSubscriptionStore()

  // Premium users always can
  if (subscriptionStore.isPremium) {
    return true
  }

  // Free users need quota remaining
  return subscriptionStore.hasQuotaRemaining
}

/**
 * Get remaining AI generations for user
 * @returns {number} Number of remaining generations
 */
export const getRemainingQuota = () => {
  const subscriptionStore = useSubscriptionStore()
  return subscriptionStore.remainingQuota
}

/**
 * Get quota limit for user's tier
 * @returns {number} Total monthly quota
 */
export const getQuotaLimit = () => {
  const subscriptionStore = useSubscriptionStore()
  return subscriptionStore.currentQuotaLimit
}

/**
 * Get current month's usage
 * @returns {number} Number of generations used this month
 */
export const getCurrentUsage = () => {
  const subscriptionStore = useSubscriptionStore()
  return subscriptionStore.currentMonthUsage
}

/**
 * Get quota reset date
 * @returns {Date} Date when quota resets (first of next month)
 */
export const getResetDate = () => {
  const subscriptionStore = useSubscriptionStore()
  return subscriptionStore.quotaResetDate
}

/**
 * Get quota percentage used
 * @returns {number} Percentage of quota used (0-100)
 */
export const getQuotaPercentage = () => {
  const subscriptionStore = useSubscriptionStore()
  return subscriptionStore.quotaPercentage
}

/**
 * Track an AI generation
 * @param {string} taskId - ID of the task that used AI
 * @param {string} model - Model used (grok-2, grok-4-fast)
 * @param {number} tokensInput - Input tokens used
 * @param {number} tokensOutput - Output tokens used
 * @param {number} costEstimate - Estimated cost in USD
 * @returns {Promise<Object>} Tracked usage record
 */
export const trackGeneration = async (
  taskId,
  model = 'grok-4-fast',
  tokensInput = 0,
  tokensOutput = 0,
  costEstimate = 0
) => {
  const authStore = useAuthStore()
  const subscriptionStore = useSubscriptionStore()

  if (!authStore.user) {
    throw new Error('User not authenticated')
  }

  try {
    // Record in ai_usage table
    const { data, error } = await supabase
      .from('ai_usage')
      .insert([
        {
          user_id: authStore.user.id,
          task_id: taskId,
          model,
          tokens_input: tokensInput,
          tokens_output: tokensOutput,
          cost_estimate: costEstimate
        }
      ])
      .select()

    if (error) {
      throw error
    }

    // Refresh quota data
    await subscriptionStore.fetchAIUsage()

    return data?.[0] || null
  } catch (err) {
    console.error('Failed to track AI generation:', err)
    throw err
  }
}

/**
 * Check quota before generating AI
 * Throws error if user doesn't have quota
 * @param {string} taskId - Task attempting to generate
 * @throws {Error} If quota exceeded
 */
export const checkQuotaBeforeGeneration = (taskId) => {
  const subscriptionStore = useSubscriptionStore()

  if (!canGenerateAI()) {
    const tier = subscriptionStore.tier
    const remaining = subscriptionStore.remainingQuota
    const limit = subscriptionStore.currentQuotaLimit
    const resetDate = subscriptionStore.formattedResetDate

    throw new Error(
      tier === 'free'
        ? `Free tier quota exceeded. You've used ${limit} AI generations this month. Quota resets on ${resetDate}.`
        : `Premium quota exceeded. You've used ${limit} AI generations this month. Quota resets on ${resetDate}.`
    )
  }
}

/**
 * Get user-friendly quota message
 * @returns {Object} Message object with status and text
 */
export const getQuotaMessage = () => {
  const subscriptionStore = useSubscriptionStore()

  const remaining = subscriptionStore.remainingQuota
  const limit = subscriptionStore.currentQuotaLimit
  const tier = subscriptionStore.tier

  if (remaining === 0) {
    return {
      type: 'error',
      text: `You've reached your ${tier} tier quota of ${limit} AI generations this month.`
    }
  }

  if (remaining <= 3) {
    return {
      type: 'warning',
      text: `You have ${remaining} AI generation${remaining !== 1 ? 's' : ''} remaining this month.`
    }
  }

  return {
    type: 'info',
    text: `${remaining}/${limit} AI generations remaining this month.`
  }
}

/**
 * Get quota status for UI display
 * @returns {Object} Quota status object
 */
export const getQuotaStatus = () => {
  const subscriptionStore = useSubscriptionStore()

  return {
    remaining: subscriptionStore.remainingQuota,
    limit: subscriptionStore.currentQuotaLimit,
    used: subscriptionStore.currentMonthUsage,
    percentage: subscriptionStore.quotaPercentage,
    hasRemaining: subscriptionStore.hasQuotaRemaining,
    resetDate: subscriptionStore.formattedResetDate,
    tier: subscriptionStore.tier,
    canGenerate: subscriptionStore.canGenerateAI,
    message: getQuotaMessage()
  }
}

/**
 * Calculate estimated cost of AI generation
 * @param {number} tokensOutput - Output tokens from AI response
 * @returns {number} Estimated cost in USD
 */
export const estimateCost = (tokensOutput) => {
  // Pricing (2025):
  // Grok-4-fast: $0.50/1M output tokens
  // Grok-2: $15/1M output tokens
  const GROK_4_FAST_COST = 0.50 / 1000000
  const GROK_2_COST = 15 / 1000000

  // For free tier, use cheaper model
  const subscriptionStore = useSubscriptionStore()
  const costPerToken = subscriptionStore.isFree ? GROK_4_FAST_COST : GROK_2_COST

  return tokensOutput * costPerToken
}

/**
 * Refresh quota from database
 * Forces fresh fetch from Supabase
 */
export const refreshQuota = async () => {
  const subscriptionStore = useSubscriptionStore()
  await subscriptionStore.fetchSubscriptionStatus(true)
  await subscriptionStore.fetchAIUsage()
}

/**
 * Initialize quota service
 * Called when user authenticates
 */
export const initializeQuotaService = async () => {
  const subscriptionStore = useSubscriptionStore()
  await subscriptionStore.initialize()
}

/**
 * Reset quota service
 * Called when user logs out
 */
export const resetQuotaService = () => {
  const subscriptionStore = useSubscriptionStore()
  subscriptionStore.reset()
}
