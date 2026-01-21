/**
 * Milestone Store (Pinia)
 *
 * Tracks user milestones and celebrations for the "First 10 Customers" journey.
 * Milestones are persisted to Supabase and trigger celebrations when achieved.
 *
 * Milestones:
 * 1. First Landing Page - Published to R2
 * 2. First Content - Generated blog/social post
 * 3. First Lead - Manually logged or from form
 * 4. First Customer - Manually celebrated
 * 5. First $100 - Revenue milestone
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/utils/supabase'
import { useAuthStore } from './authStore'

// Milestone definitions
export const MILESTONES = [
  {
    id: 'first-landing-page',
    name: 'First Landing Page',
    description: 'Published your first landing page',
    icon: '🌐',
    celebrationTitle: 'Your landing page is LIVE!',
    celebrationMessage: "You now have a real presence on the web. Share it with the world!",
    order: 1
  },
  {
    id: 'first-content',
    name: 'First Content',
    description: 'Created your first marketing content',
    icon: '✍️',
    celebrationTitle: 'Content created!',
    celebrationMessage: "You're building your marketing engine. Keep creating!",
    order: 2
  },
  {
    id: 'first-lead',
    name: 'First Lead',
    description: 'Got your first interested prospect',
    icon: '🎣',
    celebrationTitle: 'First lead captured!',
    celebrationMessage: "Someone is interested in what you're building. Follow up!",
    order: 3
  },
  {
    id: 'first-customer',
    name: 'First Customer',
    description: 'Made your first sale',
    icon: '🎉',
    celebrationTitle: 'FIRST CUSTOMER!',
    celebrationMessage: "You did it! Someone paid for your product. This is huge!",
    order: 4
  },
  {
    id: 'first-100',
    name: 'First $100',
    description: 'Earned your first $100 in revenue',
    icon: '💰',
    celebrationTitle: '$100 milestone reached!',
    celebrationMessage: "You're officially making money. The first $100 is the hardest!",
    order: 5
  }
]

export const useMilestoneStore = defineStore('milestones', () => {
  const authStore = useAuthStore()

  // State
  const achievedMilestones = ref([]) // Array of { milestoneId, achievedAt }
  const isLoading = ref(false)
  const error = ref(null)

  // Celebration state
  const currentCelebration = ref(null) // The milestone being celebrated
  const showCelebration = ref(false)

  // Computed
  const milestoneProgress = computed(() => {
    const achieved = achievedMilestones.value.length
    const total = MILESTONES.length
    return {
      achieved,
      total,
      percentage: Math.round((achieved / total) * 100)
    }
  })

  const milestonesWithStatus = computed(() => {
    return MILESTONES.map(milestone => {
      const achievement = achievedMilestones.value.find(a => a.milestoneId === milestone.id)
      return {
        ...milestone,
        achieved: !!achievement,
        achievedAt: achievement?.achievedAt || null
      }
    })
  })

  const nextMilestone = computed(() => {
    return milestonesWithStatus.value.find(m => !m.achieved)
  })

  /**
   * Load milestones from Supabase for current user
   */
  const loadMilestones = async () => {
    if (!authStore.user) return

    isLoading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('user_milestones')
        .select('milestone_id, achieved_at')
        .eq('user_id', authStore.user.id)

      if (fetchError) {
        // Table might not exist yet - that's okay
        if (fetchError.code === '42P01') {
          console.log('Milestones table not yet created')
          return
        }
        throw fetchError
      }

      achievedMilestones.value = (data || []).map(row => ({
        milestoneId: row.milestone_id,
        achievedAt: row.achieved_at
      }))
    } catch (err) {
      console.error('Error loading milestones:', err)
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Mark a milestone as achieved
   * @param {string} milestoneId - The milestone ID to achieve
   * @param {boolean} showCelebrationModal - Whether to show celebration
   */
  const achieveMilestone = async (milestoneId, showCelebrationModal = true) => {
    if (!authStore.user) return

    // Check if already achieved
    const alreadyAchieved = achievedMilestones.value.find(a => a.milestoneId === milestoneId)
    if (alreadyAchieved) return

    const milestone = MILESTONES.find(m => m.id === milestoneId)
    if (!milestone) {
      console.warn('Unknown milestone:', milestoneId)
      return
    }

    try {
      const achievedAt = new Date().toISOString()

      // Save to Supabase
      const { error: insertError } = await supabase
        .from('user_milestones')
        .insert({
          user_id: authStore.user.id,
          milestone_id: milestoneId,
          achieved_at: achievedAt
        })

      if (insertError) {
        // Table might not exist - store locally for now
        if (insertError.code === '42P01') {
          console.log('Milestones table not yet created, storing locally')
        } else {
          throw insertError
        }
      }

      // Update local state
      achievedMilestones.value.push({
        milestoneId,
        achievedAt
      })

      // Show celebration
      if (showCelebrationModal) {
        currentCelebration.value = milestone
        showCelebration.value = true
      }

    } catch (err) {
      console.error('Error achieving milestone:', err)
      error.value = err.message
    }
  }

  /**
   * Dismiss the celebration modal
   */
  const dismissCelebration = () => {
    showCelebration.value = false
    currentCelebration.value = null
  }

  /**
   * Check if a specific milestone is achieved
   * @param {string} milestoneId
   */
  const isAchieved = (milestoneId) => {
    return achievedMilestones.value.some(a => a.milestoneId === milestoneId)
  }

  /**
   * Manually log a lead (for first-lead milestone)
   */
  const logLead = async () => {
    await achieveMilestone('first-lead')
  }

  /**
   * Manually log first customer (for first-customer milestone)
   */
  const logFirstCustomer = async () => {
    await achieveMilestone('first-customer')
  }

  /**
   * Manually log first $100 (for first-100 milestone)
   */
  const logFirst100 = async () => {
    await achieveMilestone('first-100')
  }

  return {
    // State
    achievedMilestones,
    isLoading,
    error,
    currentCelebration,
    showCelebration,

    // Computed
    milestoneProgress,
    milestonesWithStatus,
    nextMilestone,

    // Actions
    loadMilestones,
    achieveMilestone,
    dismissCelebration,
    isAchieved,
    logLead,
    logFirstCustomer,
    logFirst100
  }
})
