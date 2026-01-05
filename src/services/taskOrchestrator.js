/**
 * Task Orchestrator Service
 *
 * Analyzes business context completion and guides users to optimal tasks.
 * Provides task readiness scoring, tier requirements, and personalized recommendations.
 *
 * Features:
 * - Calculates readiness score for each task (0-100%)
 * - Identifies which tiers would improve which tasks
 * - Recommends next best tier to complete for maximum impact
 * - Maps tasks to tier requirements
 */

import { useBusinessContext } from '../composables/useBusinessContext.js'

/**
 * Tier requirement levels for tasks
 * Required: task outputs significantly degraded without these tiers
 * Optional: task works fine, but quality improved with these tiers
 */
const TASK_TIER_MAPPING = {
  'generate-posts': {
    id: 'generate-posts',
    title: 'Generate Social Media Posts',
    tier: 'free',
    tiersRequired: ['tier1_business', 'tier2_market', 'tier3_brand'],
    tiersOptional: ['tier5_marketing'],
    impactByTier: {
      tier1_business: 'Basic company context (product name, description)',
      tier2_market: 'Audience targeting (who you reach)',
      tier3_brand: 'Voice consistency (personality, tone, keywords)',
      tier5_marketing: 'Historical reference (past campaign inspiration)',
    },
    qualityFactors: [
      { tier: 'tier3_brand', impact: 25, description: 'Brand personality makes posts authentic' },
      { tier: 'tier2_market', impact: 20, description: 'Audience knowledge ensures relevance' },
      { tier: 'tier5_marketing', impact: 15, description: 'Past campaigns provide inspiration' },
    ]
  },

  'outreach': {
    id: 'outreach',
    title: 'Personalized Outreach',
    tier: 'free',
    tiersRequired: ['tier1_business', 'tier2_market'],
    tiersOptional: ['tier3_brand'],
    impactByTier: {
      tier1_business: 'Company positioning (what you do)',
      tier2_market: 'Recipient targeting (who you reach)',
      tier3_brand: 'Message voice (how you sound)',
    },
    qualityFactors: [
      { tier: 'tier2_market', impact: 30, description: 'Audience pain points drive relevance' },
      { tier: 'tier3_brand', impact: 20, description: 'Brand voice ensures authenticity' },
    ]
  },

  'email-sequence': {
    id: 'email-sequence',
    title: 'Email Sales Sequence',
    tier: 'premium',
    tiersRequired: ['tier1_business', 'tier2_market', 'tier3_brand'],
    tiersOptional: ['tier4_goals', 'tier5_marketing'],
    impactByTier: {
      tier1_business: 'Company story for credibility',
      tier2_market: 'Audience objections for handling',
      tier3_brand: 'Voice consistency across emails',
      tier4_goals: 'Business metrics for urgency',
      tier5_marketing: 'Past campaigns for social proof',
    },
    qualityFactors: [
      { tier: 'tier4_goals', impact: 25, description: 'Goals enable strategic progression' },
      { tier: 'tier3_brand', impact: 20, description: 'Consistent voice across sequence' },
      { tier: 'tier5_marketing', impact: 20, description: 'Past campaigns strengthen proof sections' },
    ]
  },

  'blog-post': {
    id: 'blog-post',
    title: 'Write Blog Post',
    tier: 'premium',
    tiersRequired: ['tier1_business', 'tier2_market', 'tier3_brand'],
    tiersOptional: ['tier4_goals', 'tier5_marketing'],
    impactByTier: {
      tier1_business: 'Company credibility (establish authority)',
      tier2_market: 'Audience targeting (know your reader)',
      tier3_brand: 'Voice consistency (professional tone)',
      tier4_goals: 'Strategic focus (what to optimize for)',
      tier5_marketing: 'Data sources (stats, case studies)',
    },
    qualityFactors: [
      { tier: 'tier2_market', impact: 30, description: 'Audience focus drives SEO relevance' },
      { tier: 'tier3_brand', impact: 20, description: 'Voice consistency builds authority' },
      { tier: 'tier5_marketing', impact: 15, description: 'Past campaigns provide data' },
    ]
  },

  'landing-page-copy': {
    id: 'landing-page-copy',
    title: 'Generate Landing Page Copy',
    tier: 'premium',
    tiersRequired: ['tier1_business', 'tier2_market'],
    tiersOptional: ['tier3_brand', 'tier4_goals', 'tier5_marketing'],
    impactByTier: {
      tier1_business: 'Company positioning (credibility)',
      tier2_market: 'Audience objections (handle concerns)',
      tier3_brand: 'Voice (persuasive messaging)',
      tier4_goals: 'Conversion metric (urgency/scarcity)',
      tier5_marketing: 'Proof points (testimonials, stats)',
    },
    qualityFactors: [
      { tier: 'tier2_market', impact: 25, description: 'Objection handling drives conversions' },
      { tier: 'tier4_goals', impact: 20, description: 'Goals inform urgency strategy' },
      { tier: 'tier5_marketing', impact: 15, description: 'Stats/proof strengthen credibility' },
    ]
  }
}

/**
 * Composable for orchestrating task guidance
 */
export const useTaskOrchestrator = () => {
  const { getContext } = useBusinessContext()

  /**
   * Calculate tier completion percentage (0-100%)
   */
  const calculateTierCompletion = async (tierName) => {
    try {
      const context = await getContext()
      const tier = context[tierName]
      if (!tier) return 0

      // Count completed fields in tier
      const fields = Object.keys(tier).filter(key => tier[key] !== null && tier[key] !== undefined)
      const totalFields = Object.keys(tier).length

      return totalFields > 0 ? Math.round((fields.length / totalFields) * 100) : 0
    } catch (error) {
      console.error(`Error calculating tier completion for ${tierName}:`, error)
      return 0
    }
  }

  /**
   * Calculate readiness score for a task (0-100%)
   * Based on: required tier completion + optional tier bonus
   */
  const calculateTaskReadiness = async (taskId) => {
    const taskMapping = TASK_TIER_MAPPING[taskId]
    if (!taskMapping) return 0

    const requiredTiers = taskMapping.tiersRequired || []
    const optionalTiers = taskMapping.tiersOptional || []

    // Calculate required tier completion (70% of score)
    let requiredScore = 100
    for (const tierName of requiredTiers) {
      const completion = await calculateTierCompletion(tierName)
      requiredScore = Math.min(requiredScore, completion)
    }
    const requiredWeight = requiredTiers.length > 0 ? 70 : 0

    // Calculate optional tier bonus (30% of score)
    let optionalScore = 0
    for (const tierName of optionalTiers) {
      const completion = await calculateTierCompletion(tierName)
      optionalScore = Math.max(optionalScore, completion)
    }
    const optionalWeight = optionalTiers.length > 0 ? 30 : 0

    return Math.round(
      (requiredScore * requiredWeight / 100) + (optionalScore * optionalWeight / 100)
    )
  }

  /**
   * Get readiness data for all tasks
   */
  const getAllTasksReadiness = async () => {
    const tasks = Object.values(TASK_TIER_MAPPING)
    const readiness = {}

    for (const task of tasks) {
      readiness[task.id] = {
        ...task,
        readinessScore: await calculateTaskReadiness(task.id),
        completionPercentage: await calculateTaskReadiness(task.id)
      }
    }

    return readiness
  }

  /**
   * Get next recommended tier to complete
   * Analyzes which tier would improve the most tasks
   */
  const getRecommendedNextTier = async () => {
    const tierNames = [
      'tier1_business',
      'tier2_market',
      'tier3_brand',
      'tier4_goals',
      'tier5_marketing',
      'tier6_content',
      'tier7_integrations'
    ]

    const tierImpact = {}

    for (const tierName of tierNames) {
      const completion = await calculateTierCompletion(tierName)
      if (completion === 100) continue // Already complete

      // Count how many tasks could benefit from this tier
      let taskCount = 0
      let totalImpact = 0

      for (const task of Object.values(TASK_TIER_MAPPING)) {
        const isRequired = task.tiersRequired?.includes(tierName)
        const isOptional = task.tiersOptional?.includes(tierName)

        if (isRequired) {
          taskCount += 1
          totalImpact += 20 // Required tier impact
        } else if (isOptional) {
          taskCount += 1
          totalImpact += 10 // Optional tier impact
        }
      }

      tierImpact[tierName] = {
        completion,
        tasksAffected: taskCount,
        estimatedQualityImprovement: totalImpact,
        percentComplete: completion
      }
    }

    // Find tier with lowest completion that affects most tasks
    const incompleteTiers = Object.entries(tierImpact)
      .filter(([_, data]) => data.completion < 100)
      .sort((a, b) => {
        // Prioritize by: high task impact + low completion
        const scoreA = (b[1].tasksAffected * 10) - a[1].completion
        const scoreB = (a[1].tasksAffected * 10) - b[1].completion
        return scoreB - scoreA
      })

    if (incompleteTiers.length === 0) {
      return { recommendation: null, message: 'All tiers complete!' }
    }

    const [tierName, tierData] = incompleteTiers[0]
    const tierLabels = {
      tier1_business: 'Define Your Business',
      tier2_market: 'Market & Audience',
      tier3_brand: 'Brand Voice',
      tier4_goals: 'Business Goals',
      tier5_marketing: 'Marketing Channels',
      tier6_content: 'Content Library',
      tier7_integrations: 'Integrations'
    }

    return {
      recommendation: tierName,
      label: tierLabels[tierName],
      completion: tierData.completion,
      tasksAffected: tierData.tasksAffected,
      estimatedQualityImprovement: tierData.estimatedQualityImprovement,
      message: `Completing ${tierLabels[tierName]} will improve ${tierData.tasksAffected} tasks`
    }
  }

  /**
   * Get specific task mapping with full details
   */
  const getTaskMapping = (taskId) => {
    return TASK_TIER_MAPPING[taskId] || null
  }

  /**
   * Get all available tasks with their tier requirements
   */
  const getAllTaskMappings = () => {
    return Object.values(TASK_TIER_MAPPING)
  }

  /**
   * Get impact of completing a specific tier
   */
  const getTierImpact = (tierName) => {
    const affectedTasks = []

    for (const task of Object.values(TASK_TIER_MAPPING)) {
      if (task.tiersRequired?.includes(tierName)) {
        affectedTasks.push({
          taskId: task.id,
          taskTitle: task.title,
          impactType: 'required',
          impact: task.impactByTier?.[tierName] || 'Core functionality'
        })
      } else if (task.tiersOptional?.includes(tierName)) {
        affectedTasks.push({
          taskId: task.id,
          taskTitle: task.title,
          impactType: 'optional',
          impact: task.impactByTier?.[tierName] || 'Quality improvement'
        })
      }
    }

    return {
      tierName,
      affectedTasks,
      totalTasks: affectedTasks.length,
      requiredFor: affectedTasks.filter(t => t.impactType === 'required').length,
      enhancesQuality: affectedTasks.filter(t => t.impactType === 'optional').length
    }
  }

  /**
   * Get suggested tasks based on profile completion
   * Returns high-readiness tasks first
   */
  const getSuggestedTasks = async () => {
    const readiness = await getAllTasksReadiness()
    const tasksArray = Object.values(readiness)

    // Sort by readiness score (highest first)
    tasksArray.sort((a, b) => b.readinessScore - a.readinessScore)

    // Categorize
    return {
      readyNow: tasksArray.filter(t => t.readinessScore >= 75),
      almostReady: tasksArray.filter(t => t.readinessScore >= 50 && t.readinessScore < 75),
      needsWork: tasksArray.filter(t => t.readinessScore < 50),
      allTasks: tasksArray
    }
  }

  return {
    calculateTierCompletion,
    calculateTaskReadiness,
    getAllTasksReadiness,
    getRecommendedNextTier,
    getTaskMapping,
    getAllTaskMappings,
    getTierImpact,
    getSuggestedTasks
  }
}
