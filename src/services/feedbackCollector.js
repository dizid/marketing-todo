/**
 * Feedback Collector Service
 *
 * Captures and analyzes user feedback on generated content
 * to improve future AI prompts and track quality trends
 */

import { useBusinessContext } from '@/composables/useBusinessContext'

/**
 * Record content rating and feedback
 */
export const recordContentRating = async (taskName, contentId, rating, feedback = '') => {
  const { recordContentFeedback } = useBusinessContext()

  try {
    // Validate input
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5')
    }

    // Record in business context
    await recordContentFeedback(taskName, contentId, rating, feedback)

    // Track in analytics
    trackRatingGiven(taskName, rating)

    return {
      success: true,
      message: `Thank you! Your rating helps improve ${taskName}`
    }
  } catch (err) {
    console.error('Error recording content rating:', err)
    throw err
  }
}

/**
 * Get rating statistics for a task
 */
export const getTaskRatingStats = (context, taskName) => {
  if (!context?.tier6_content?.generatedContent) {
    return {
      averageRating: 0,
      totalRatings: 0,
      trend: 'no-data',
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    }
  }

  const content = context.tier6_content.generatedContent
  const taskContent = content.filter((c) => c.taskName === taskName && c.userRating)

  if (taskContent.length === 0) {
    return {
      averageRating: 0,
      totalRatings: 0,
      trend: 'no-data',
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    }
  }

  // Calculate average
  const ratings = taskContent.map((c) => c.userRating)
  const averageRating = ratings.reduce((a, b) => a + b, 0) / ratings.length

  // Calculate distribution
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  ratings.forEach((r) => {
    distribution[r]++
  })

  // Determine trend
  const recent = taskContent.slice(-10)
  const recentAvg = recent.reduce((a, b) => a + b.userRating, 0) / recent.length
  const trend = recentAvg > averageRating + 0.5 ? 'improving' : recentAvg < averageRating - 0.5 ? 'declining' : 'stable'

  return {
    averageRating: parseFloat(averageRating.toFixed(2)),
    totalRatings: ratings.length,
    trend,
    distribution,
    recentTrend: parseFloat(recentAvg.toFixed(2))
  }
}

/**
 * Get common feedback themes
 */
export const getCommonFeedbackThemes = (context) => {
  if (!context?.tier6_content?.generatedContent) {
    return []
  }

  const content = context.tier6_content.generatedContent
  const feedbackItems = content.filter((c) => c.feedback).map((c) => c.feedback)

  if (feedbackItems.length === 0) {
    return []
  }

  // Extract common keywords/themes
  const keywords = new Map()

  feedbackItems.forEach((feedback) => {
    // Simple theme extraction
    const themes = extractThemes(feedback)
    themes.forEach((theme) => {
      keywords.set(theme, (keywords.get(theme) || 0) + 1)
    })
  })

  // Sort by frequency and return top 5
  return Array.from(keywords.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([theme, count]) => ({ theme, count }))
}

/**
 * Get improvement suggestions based on feedback
 */
export const getImprovementSuggestions = (context, taskName) => {
  const stats = getTaskRatingStats(context, taskName)
  const suggestions = []

  if (stats.averageRating < 3) {
    suggestions.push({
      severity: 'critical',
      message: `Average rating for ${taskName} is ${stats.averageRating}/5. Consider refining the context or task parameters.`
    })
  } else if (stats.averageRating < 3.5) {
    suggestions.push({
      severity: 'warning',
      message: `${taskName} ratings average ${stats.averageRating}/5. Some users might be unsatisfied with output quality.`
    })
  }

  // Check distribution
  const lowRatings = (stats.distribution[1] || 0) + (stats.distribution[2] || 0)
  const totalRatings = stats.totalRatings

  if (lowRatings > totalRatings * 0.3) {
    suggestions.push({
      severity: 'warning',
      message: `${lowRatings} of ${totalRatings} ratings are low (1-2 stars). Review feedback for patterns.`
    })
  }

  // Check trend
  if (stats.trend === 'declining') {
    suggestions.push({
      severity: 'warning',
      message: `${taskName} quality is declining. Recent average: ${stats.recentTrend}/5. Review recent context changes.`
    })
  }

  if (stats.trend === 'improving') {
    suggestions.push({
      severity: 'positive',
      message: `Great news! ${taskName} quality is improving. Recent average: ${stats.recentTrend}/5`
    })
  }

  return suggestions
}

/**
 * Suggest context improvements based on feedback
 */
export const suggestContextImprovements = (context) => {
  const suggestions = []

  // Check Tier 1-3 completeness
  const tier1Score = calculateTierCompleteness(context.tier1_business)
  const tier2Score = calculateTierCompleteness(context.tier2_market)
  const tier3Score = calculateTierCompleteness(context.tier3_brand)

  if (tier1Score < 70) {
    suggestions.push({
      tier: 'tier1_business',
      action: 'Complete business fundamentals for better content positioning'
    })
  }

  if (tier2Score < 70) {
    suggestions.push({
      tier: 'tier2_market',
      action: 'Define target audience details to improve content relevance'
    })
  }

  if (tier3Score < 70) {
    suggestions.push({
      tier: 'tier3_brand',
      action: 'Establish brand voice for consistent messaging'
    })
  }

  return suggestions
}

/**
 * Calculate weekly trend
 */
export const calculateWeeklyTrend = (context) => {
  if (!context?.tier6_content?.generatedContent) {
    return null
  }

  const now = new Date()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const content = context.tier6_content.generatedContent.filter((c) => {
    const createdAt = new Date(c.createdAt)
    return createdAt > oneWeekAgo && c.userRating
  })

  if (content.length === 0) {
    return null
  }

  const avgRating = content.reduce((a, b) => a + b.userRating, 0) / content.length
  const count = content.length

  return {
    period: 'last 7 days',
    averageRating: parseFloat(avgRating.toFixed(2)),
    contentGenerated: count,
    ratedPercentage: parseFloat(((content.length / context.tier6_content.generatedContent.length) * 100).toFixed(1))
  }
}

/**
 * Track rating given via analytics
 */
function trackRatingGiven(taskName, rating) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'content_rated', {
      event_category: 'feedback',
      event_label: taskName,
      rating: rating
    })
  }
}

/**
 * Extract feedback themes
 */
function extractThemes(feedback) {
  const themes = []

  // Quality themes
  if (feedback.toLowerCase().includes('too generic') || feedback.toLowerCase().includes('generic')) {
    themes.push('too-generic')
  }
  if (feedback.toLowerCase().includes('too short') || feedback.toLowerCase().includes('needs more')) {
    themes.push('too-short')
  }
  if (feedback.toLowerCase().includes('too long') || feedback.toLowerCase().includes('verbose')) {
    themes.push('too-long')
  }
  if (feedback.toLowerCase().includes('tone') || feedback.toLowerCase().includes('voice')) {
    themes.push('tone-mismatch')
  }
  if (feedback.toLowerCase().includes('audience')) {
    themes.push('audience-mismatch')
  }
  if (feedback.toLowerCase().includes('irrelevant')) {
    themes.push('irrelevant')
  }
  if (feedback.toLowerCase().includes('great') || feedback.toLowerCase().includes('excellent')) {
    themes.push('excellent')
  }
  if (feedback.toLowerCase().includes('helpful')) {
    themes.push('helpful')
  }

  return themes
}

/**
 * Helper: Calculate tier completeness
 */
function calculateTierCompleteness(tier) {
  if (!tier) return 0

  const keys = Object.keys(tier)
  if (keys.length === 0) return 0

  let filledCount = 0
  keys.forEach((key) => {
    const value = tier[key]
    if (value !== null && value !== '' && value !== undefined) {
      if (Array.isArray(value)) {
        filledCount += value.length > 0 ? 1 : 0
      } else if (typeof value === 'object') {
        filledCount += Object.keys(value).length > 0 ? 1 : 0
      } else {
        filledCount += 1
      }
    }
  })

  return Math.round((filledCount / keys.length) * 100)
}

/**
 * Export feedback as CSV
 */
export const exportFeedbackAsCSV = (context) => {
  if (!context?.tier6_content?.generatedContent) {
    return null
  }

  const content = context.tier6_content.generatedContent.filter((c) => c.userRating)

  if (content.length === 0) {
    return null
  }

  let csv = 'Task,Rating,Feedback,Created At\n'

  content.forEach((c) => {
    const feedback = (c.feedback || '').replace(/"/g, '""')
    csv += `${c.taskName},"${c.userRating}","${feedback}","${c.createdAt}"\n`
  })

  return csv
}
