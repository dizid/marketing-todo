import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './authStore'
import { supabase } from '@/utils/supabase'

/**
 * Subscription Store
 * Manages user subscription state, tier, and quota information
 *
 * Features:
 * - Tracks user tier (free/premium)
 * - Manages AI generation quota
 * - Caches subscription status
 * - Syncs with Supabase database
 */

export const useSubscriptionStore = defineStore('subscription', () => {
  const authStore = useAuthStore()

  // State
  const subscription = ref(null)
  const lastFetched = ref(null)
  const aiUsage = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // Constants
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
  const FREE_TIER_QUOTA = 20 // 20 AI generations per month
  const PREMIUM_TIER_QUOTA = 200 // 200 AI generations per month

  // Computed properties
  const tier = computed(() => subscription.value?.tier || 'free')
  const isFree = computed(() => tier.value === 'free')
  const isPremium = computed(() => tier.value === 'premium')
  const subscriptionStatus = computed(() => subscription.value?.status || 'active')
  const isActive = computed(() => subscriptionStatus.value === 'active')

  // Quota calculations
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

  // Calculate quota reset date (first of next month)
  const quotaResetDate = computed(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth() + 1, 1)
  })

  // Format quota reset date for display
  const formattedResetDate = computed(() => {
    return quotaResetDate.value.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  })

  /**
   * Fetch subscription status from Supabase
   * Uses cache to avoid excessive database queries
   */
  const fetchSubscriptionStatus = async (force = false) => {
    if (!authStore.user) {
      subscription.value = null
      return null
    }

    // Check cache
    const now = Date.now()
    if (!force && lastFetched.value && now - lastFetched.value < CACHE_DURATION) {
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

      lastFetched.value = now

      // Also cache in localStorage for offline use (read-only)
      localStorage.setItem('subscription_cache', JSON.stringify({
        data: subscription.value,
        cachedAt: now
      }))

      return subscription.value
    } catch (err) {
      console.error('Failed to fetch subscription:', err)
      error.value = err.message

      // Try to use localStorage fallback
      const cached = localStorage.getItem('subscription_cache')
      if (cached) {
        try {
          const { data } = JSON.parse(cached)
          subscription.value = data
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
   */
  const fetchAIUsage = async () => {
    if (!authStore.user) {
      aiUsage.value = []
      return []
    }

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
    }
  }

  /**
   * Track an AI generation (called after successful AI API call)
   */
  const trackAIUsage = async (taskId, model, tokensInput, tokensOutput, costEstimate = 0) => {
    if (!authStore.user) {
      console.error('Cannot track AI usage without authenticated user')
      return null
    }

    try {
      const { data, error: insertError } = await supabase
        .from('ai_usage')
        .insert([
          {
            user_id: authStore.user.id,
            task_id: taskId,
            model: model || 'grok-4-fast',
            tokens_input: tokensInput || 0,
            tokens_output: tokensOutput || 0,
            cost_estimate: costEstimate || 0
          }
        ])
        .select()

      if (insertError) throw insertError

      // Update local usage
      await fetchAIUsage()

      return data?.[0] || null
    } catch (err) {
      console.error('Failed to track AI usage:', err)
      error.value = err.message
      return null
    }
  }

  /**
   * Decrement quota (optimistic update)
   */
  const decrementQuota = () => {
    if (remainingQuota.value > 0) {
      // This is optimistic - actual decrement happens when usage is tracked
      // Used for UI feedback
    }
  }

  /**
   * Check if user can generate AI content
   */
  const canGenerateAI = computed(() => {
    // Premium users always can
    if (isPremium.value) return true

    // Free users need quota remaining
    return hasQuotaRemaining.value
  })

  /**
   * Upgrade subscription to premium
   */
  const upgradeToPresentation = async (paypalSubscriptionId, paypalPayerId) => {
    if (!authStore.user) {
      throw new Error('User not authenticated')
    }

    try {
      isLoading.value = true
      error.value = null

      const { data, error: updateError } = await supabase
        .from('subscriptions')
        .update({
          tier: 'premium',
          status: 'active',
          paypal_subscription_id: paypalSubscriptionId,
          paypal_payer_id: paypalPayerId,
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', authStore.user.id)
        .select()
        .single()

      if (updateError) throw updateError

      subscription.value = data
      lastFetched.value = Date.now()

      return data
    } catch (err) {
      console.error('Failed to upgrade subscription:', err)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Cancel subscription
   */
  const cancelSubscription = async (reason = null) => {
    if (!authStore.user) {
      throw new Error('User not authenticated')
    }

    try {
      isLoading.value = true
      error.value = null

      const { data, error: updateError } = await supabase
        .from('subscriptions')
        .update({
          status: 'cancelled',
          tier: 'free', // Downgrade to free
          cancelled_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', authStore.user.id)
        .select()
        .single()

      if (updateError) throw updateError

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
   * Initialize subscription store on user login
   */
  const initialize = async () => {
    if (authStore.user) {
      await fetchSubscriptionStatus(true)
      await fetchAIUsage()
    }
  }

  /**
   * Reset store on logout
   */
  const reset = () => {
    subscription.value = null
    aiUsage.value = []
    lastFetched.value = null
    error.value = null
  }

  return {
    // State
    subscription,
    aiUsage,
    isLoading,
    error,

    // Computed
    tier,
    isFree,
    isPremium,
    subscriptionStatus,
    isActive,
    currentQuotaLimit,
    currentMonthUsage,
    remainingQuota,
    quotaPercentage,
    hasQuotaRemaining,
    quotaResetDate,
    formattedResetDate,
    canGenerateAI,

    // Methods
    fetchSubscriptionStatus,
    fetchAIUsage,
    trackAIUsage,
    decrementQuota,
    upgradeToPresentation,
    cancelSubscription,
    initialize,
    reset
  }
})
