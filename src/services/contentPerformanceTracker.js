/**
 * Content Performance Tracker Service
 *
 * Logs generated content and tracks performance metrics.
 * Analyzes correlation between tier usage and content quality.
 *
 * Features:
 * - Log content generation with metadata
 * - Track content performance (opens, clicks, conversions)
 * - Analyze tier impact on quality
 * - Generate recommendations based on performance
 */

import { useBusinessContext } from '../composables/useBusinessContext.js'

const STORAGE_KEY = 'launchpilot-content-performance'

/**
 * Content performance tracker composable
 */
export const useContentPerformanceTracker = () => {
  const { getContext } = useBusinessContext()

  /**
   * Log generated content with metadata
   */
  const logContent = async (contentData) => {
    const {
      taskId,
      contentType,
      content,
      userInputs = {},
      tiersUsed = [],
      generatedAt = new Date().toISOString(),
      quality = {} // Optional: user-provided quality metrics
    } = contentData

    const logEntry = {
      id: generateId(),
      taskId,
      contentType,
      content: typeof content === 'object' ? JSON.stringify(content) : content,
      userInputs,
      tiersUsed,
      generatedAt,
      quality: {
        userRating: quality.userRating || null,
        usability: quality.usability || null,
        relevance: quality.relevance || null,
        authenc ity: quality.authenticity || null
      },
      performance: {
        views: 0,
        engagements: 0,
        conversions: 0,
        metricType: null // 'email_opens', 'page_clicks', 'blog_traffic', etc
      }
    }

    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"entries":[]}')
      existing.entries.push(logEntry)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
      return logEntry
    } catch (error) {
      console.error('Error logging content:', error)
      return null
    }
  }

  /**
   * Update performance metrics for logged content
   */
  const updatePerformance = (contentId, performanceData) => {
    const {
      views = 0,
      engagements = 0,
      conversions = 0,
      metricType = null
    } = performanceData

    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"entries":[]}')
      const entry = data.entries.find(e => e.id === contentId)

      if (entry) {
        entry.performance = {
          views,
          engagements,
          conversions,
          metricType
        }
        entry.updatedAt = new Date().toISOString()
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        return entry
      }
    } catch (error) {
      console.error('Error updating performance:', error)
    }

    return null
  }

  /**
   * Rate content quality (1-5 stars)
   */
  const rateContent = (contentId, rating, feedback = '') => {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"entries":[]}')
      const entry = data.entries.find(e => e.id === contentId)

      if (entry) {
        entry.quality.userRating = rating
        entry.quality.feedback = feedback
        entry.ratedAt = new Date().toISOString()
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        return entry
      }
    } catch (error) {
      console.error('Error rating content:', error)
    }

    return null
  }

  /**
   * Get all logged content
   */
  const getAllContent = () => {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"entries":[]}')
      return data.entries || []
    } catch (error) {
      console.error('Error retrieving content:', error)
      return []
    }
  }

  /**
   * Get content by task
   */
  const getContentByTask = (taskId) => {
    const allContent = getAllContent()
    return allContent.filter(c => c.taskId === taskId)
  }

  /**
   * Get performance stats by task
   */
  const getTaskPerformanceStats = (taskId) => {
    const content = getContentByTask(taskId)
    if (content.length === 0) return null

    const stats = {
      totalGenerated: content.length,
      averageRating: 0,
      ratedCount: 0,
      totalViews: 0,
      totalEngagements: 0,
      totalConversions: 0,
      engagementRate: 0,
      conversionRate: 0,
      tierUsageFrequency: {},
      performanceByTier: {}
    }

    // Calculate stats
    for (const entry of content) {
      // Ratings
      if (entry.quality?.userRating) {
        stats.averageRating += entry.quality.userRating
        stats.ratedCount += 1
      }

      // Performance
      stats.totalViews += entry.performance?.views || 0
      stats.totalEngagements += entry.performance?.engagements || 0
      stats.totalConversions += entry.performance?.conversions || 0

      // Tier usage
      for (const tier of entry.tiersUsed || []) {
        stats.tierUsageFrequency[tier] = (stats.tierUsageFrequency[tier] || 0) + 1
      }
    }

    // Calculate rates
    if (stats.ratedCount > 0) {
      stats.averageRating = (stats.averageRating / stats.ratedCount).toFixed(2)
    }

    if (stats.totalViews > 0) {
      stats.engagementRate = ((stats.totalEngagements / stats.totalViews) * 100).toFixed(1)
      stats.conversionRate = ((stats.totalConversions / stats.totalViews) * 100).toFixed(1)
    }

    // Calculate performance by tier
    stats.performanceByTier = calculateTierImpact(content)

    return stats
  }

  /**
   * Get overall performance stats across all tasks
   */
  const getOverallStats = () => {
    const allContent = getAllContent()
    if (allContent.length === 0) return null

    const stats = {
      totalContentGenerated: allContent.length,
      tasksUsed: new Set(allContent.map(c => c.taskId)).size,
      averageRating: 0,
      ratedCount: 0,
      totalViews: 0,
      totalEngagements: 0,
      totalConversions: 0,
      engagementRate: 0,
      conversionRate: 0,
      byTask: {},
      tierCommonality: {}
    }

    // Per-task breakdown
    for (const entry of allContent) {
      if (!stats.byTask[entry.taskId]) {
        stats.byTask[entry.taskId] = {
          count: 0,
          averageRating: 0,
          ratedCount: 0
        }
      }
      stats.byTask[entry.taskId].count += 1

      if (entry.quality?.userRating) {
        stats.byTask[entry.taskId].averageRating += entry.quality.userRating
        stats.byTask[entry.taskId].ratedCount += 1
      }

      // Tier commonality
      for (const tier of entry.tiersUsed || []) {
        stats.tierCommonality[tier] = (stats.tierCommonality[tier] || 0) + 1
      }
    }

    // Calculate averages
    for (const taskId in stats.byTask) {
      const task = stats.byTask[taskId]
      if (task.ratedCount > 0) {
        task.averageRating = (task.averageRating / task.ratedCount).toFixed(2)
      } else {
        task.averageRating = null
      }
    }

    // Calculate overall rates
    for (const entry of allContent) {
      if (entry.quality?.userRating) {
        stats.averageRating += entry.quality.userRating
        stats.ratedCount += 1
      }
      stats.totalViews += entry.performance?.views || 0
      stats.totalEngagements += entry.performance?.engagements || 0
      stats.totalConversions += entry.performance?.conversions || 0
    }

    if (stats.ratedCount > 0) {
      stats.averageRating = (stats.averageRating / stats.ratedCount).toFixed(2)
    }

    if (stats.totalViews > 0) {
      stats.engagementRate = ((stats.totalEngagements / stats.totalViews) * 100).toFixed(1)
      stats.conversionRate = ((stats.totalConversions / stats.totalViews) * 100).toFixed(1)
    }

    return stats
  }

  /**
   * Analyze tier impact on performance
   */
  const calculateTierImpact = (contentItems) => {
    const tierData = {}

    for (const item of contentItems) {
      for (const tier of item.tiersUsed || []) {
        if (!tierData[tier]) {
          tierData[tier] = {
            usageCount: 0,
            totalRating: 0,
            ratedCount: 0,
            totalViews: 0,
            totalEngagements: 0,
            totalConversions: 0
          }
        }

        tierData[tier].usageCount += 1

        if (item.quality?.userRating) {
          tierData[tier].totalRating += item.quality.userRating
          tierData[tier].ratedCount += 1
        }

        tierData[tier].totalViews += item.performance?.views || 0
        tierData[tier].totalEngagements += item.performance?.engagements || 0
        tierData[tier].totalConversions += item.performance?.conversions || 0
      }
    }

    // Calculate averages
    const impact = {}
    for (const tier in tierData) {
      const data = tierData[tier]
      impact[tier] = {
        usageCount: data.usageCount,
        averageRating: data.ratedCount > 0 ? (data.totalRating / data.ratedCount).toFixed(2) : null,
        averageViews: Math.round(data.totalViews / data.usageCount),
        averageEngagements: Math.round(data.totalEngagements / data.usageCount),
        averageConversions: Math.round(data.totalConversions / data.usageCount)
      }
    }

    return impact
  }

  /**
   * Get recommendation: which tiers would improve performance?
   */
  const getQualityImprovementRecommendations = (taskId) => {
    const context = getBusinessContextSync()
    const content = getContentByTask(taskId)

    if (content.length === 0) {
      return { message: 'No content generated yet for this task' }
    }

    const stats = getTaskPerformanceStats(taskId)
    const recommendations = []

    // Analyze tiers NOT used
    const usedTiers = new Set()
    for (const item of content) {
      for (const tier of item.tiersUsed || []) {
        usedTiers.add(tier)
      }
    }

    const allTiers = [
      'tier1_business',
      'tier2_market',
      'tier3_brand',
      'tier4_goals',
      'tier5_marketing'
    ]

    for (const tier of allTiers) {
      if (!usedTiers.has(tier)) {
        const tierCompletion = getTierCompletionSync(tier, context)
        if (tierCompletion > 0) {
          // Tier is partially/fully complete but not used
          recommendations.push({
            tier,
            type: 'missing_tier',
            message: `Complete ${tier} to improve content quality`,
            potentialImprovement: 15 // Default percentage
          })
        } else {
          // Tier is incomplete
          recommendations.push({
            tier,
            type: 'incomplete_tier',
            message: `Complete ${tier} for better content (currently ${tierCompletion}% complete)`,
            potentialImprovement: 10 + tierCompletion
          })
        }
      }
    }

    // Suggest tier based on current rating
    if (stats.averageRating && stats.averageRating < 4) {
      recommendations.push({
        type: 'low_rating',
        message: `Content is underperforming (${stats.averageRating}/5). Check tier completion for context improvement.`
      })
    }

    return {
      currentRating: stats.averageRating,
      recommendations: recommendations.slice(0, 3) // Top 3 recommendations
    }
  }

  /**
   * Helper: sync version of getContext for internal use
   */
  const getBusinessContextSync = () => {
    try {
      return JSON.parse(localStorage.getItem('businessContext') || '{}')
    } catch {
      return {}
    }
  }

  /**
   * Helper: get tier completion percentage
   */
  const getTierCompletionSync = (tierName, context) => {
    const tier = context?.[tierName]
    if (!tier) return 0

    const fields = Object.keys(tier).filter(key => tier[key] !== null && tier[key] !== undefined)
    const totalFields = Object.keys(tier).length

    return totalFields > 0 ? Math.round((fields.length / totalFields) * 100) : 0
  }

  /**
   * Helper: generate unique ID
   */
  const generateId = () => {
    return `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  return {
    logContent,
    updatePerformance,
    rateContent,
    getAllContent,
    getContentByTask,
    getTaskPerformanceStats,
    getOverallStats,
    calculateTierImpact,
    getQualityImprovementRecommendations
  }
}
