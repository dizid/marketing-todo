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

import { useQuotaStore } from '@/stores/quotaStore'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/utils/supabase'

const FREE_TIER_QUOTA = 20
const PREMIUM_TIER_QUOTA = 200

/**
 * Custom error class for quota exceeded errors
 * Allows components to detect and handle quota errors specifically
 */
export class QuotaExceededError extends Error {
  constructor(message, tier, resetDate) {
    super(message)
    this.name = 'QuotaExceededError'
    this.tier = tier
    this.resetDate = resetDate
  }
}

/**
 * Check if an error is a quota exceeded error
 * @param {Error} error - The error to check
 * @returns {boolean} True if quota exceeded error
 */
export const isQuotaExceededError = (error) => {
  return error instanceof QuotaExceededError || error?.name === 'QuotaExceededError'
}

/**
 * Handle quota exceeded error by redirecting to subscription page
 * @param {Object} router - Vue router instance
 * @param {Error} error - The quota exceeded error
 */
export const handleQuotaExceededError = (router, error) => {
  if (isQuotaExceededError(error)) {
    router.push({
      name: 'ManageSubscription',
      query: { reason: 'quota_exceeded' }
    })
    return true
  }
  return false
}

/**
 * Check if user can generate AI content
 * @returns {boolean} Whether user has quota remaining
 */
export const canGenerateAI = () => {
  const quotaStore = useQuotaStore()

  // Premium users always can
  if (quotaStore.isPremium) {
    return true
  }

  // Free users need quota remaining
  return quotaStore.hasQuotaRemaining
}

/**
 * Get remaining AI generations for user
 * @returns {number} Number of remaining generations
 */
export const getRemainingQuota = () => {
  const quotaStore = useQuotaStore()
  return quotaStore.remainingQuota
}

/**
 * Get quota limit for user's tier
 * @returns {number} Total monthly quota
 */
export const getQuotaLimit = () => {
  const quotaStore = useQuotaStore()
  return quotaStore.currentQuotaLimit
}

/**
 * Get current month's usage
 * @returns {number} Number of generations used this month
 */
export const getCurrentUsage = () => {
  const quotaStore = useQuotaStore()
  return quotaStore.currentMonthUsage
}

/**
 * Get quota reset date
 * @returns {Date} Date when quota resets (first of next month)
 */
export const getResetDate = () => {
  const quotaStore = useQuotaStore()
  return quotaStore.quotaResetDate
}

/**
 * Get quota percentage used
 * @returns {number} Percentage of quota used (0-100)
 */
export const getQuotaPercentage = () => {
  const quotaStore = useQuotaStore()
  return quotaStore.quotaPercentage
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
  const quotaStore = useQuotaStore()

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
    await quotaStore.fetchAIUsage()

    return data?.[0] || null
  } catch (err) {
    console.error('Failed to track AI generation:', err)
    throw err
  }
}

/**
 * Check quota before generating AI
 * Throws QuotaExceededError if user doesn't have quota
 * @param {string} taskId - Task attempting to generate
 * @throws {QuotaExceededError} If quota exceeded
 */
export const checkQuotaBeforeGeneration = (taskId) => {
  const quotaStore = useQuotaStore()

  if (!canGenerateAI()) {
    const tier = quotaStore.tier
    const limit = quotaStore.currentQuotaLimit
    const resetDate = quotaStore.formattedResetDate

    const message = tier === 'free'
      ? `You've used all ${limit} free AI generations this month. Upgrade to Premium for 10x more generations.`
      : `You've used all ${limit} premium AI generations this month. Quota resets on ${resetDate}.`

    throw new QuotaExceededError(message, tier, resetDate)
  }
}

/**
 * Get user-friendly quota message
 * @returns {Object} Message object with status and text
 */
export const getQuotaMessage = () => {
  const quotaStore = useQuotaStore()

  const remaining = quotaStore.remainingQuota
  const limit = quotaStore.currentQuotaLimit
  const tier = quotaStore.tier

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
  const quotaStore = useQuotaStore()

  return {
    remaining: quotaStore.remainingQuota,
    limit: quotaStore.currentQuotaLimit,
    used: quotaStore.currentMonthUsage,
    percentage: quotaStore.quotaPercentage,
    hasRemaining: quotaStore.hasQuotaRemaining,
    resetDate: quotaStore.formattedResetDate,
    tier: quotaStore.tier,
    canGenerate: quotaStore.canGenerateAI,
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
  const quotaStore = useQuotaStore()
  const costPerToken = quotaStore.isFree ? GROK_4_FAST_COST : GROK_2_COST

  return tokensOutput * costPerToken
}

/**
 * Refresh quota from database
 * Forces fresh fetch from Supabase
 */
export const refreshQuota = async () => {
  const quotaStore = useQuotaStore()
  await quotaStore.fetchSubscriptionStatus(true)
  await quotaStore.fetchAIUsage()
}

/**
 * Initialize quota service
 * Called when user authenticates
 */
export const initializeQuotaService = async () => {
  const quotaStore = useQuotaStore()
  await quotaStore.initialize()
}

/**
 * Reset quota service
 * Called when user logs out
 */
export const resetQuotaService = () => {
  const quotaStore = useQuotaStore()
  quotaStore.reset()
}
