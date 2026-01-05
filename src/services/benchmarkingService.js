/**
 * Benchmarking Service
 *
 * Compares user metrics against industry averages and provides
 * competitive positioning, goals-based recommendations, and insights.
 */

const INDUSTRY_BENCHMARKS = {
  email: {
    avgOpenRate: 21.5,
    avgClickRate: 2.5,
    avgConversionRate: 1.2,
    avgUnsubscribeRate: 0.5
  },
  web: {
    avgConversionRate: 2.35,
    avgBounceRate: 47,
    avgEngagementTime: 4.2
  },
  social: {
    avgEngagementRate: 3.5,
    avgClickThroughRate: 1.8,
    avgShareRate: 0.6
  },
  ads: {
    avgCPC: 1.25,
    avgROAS: 2.5,
    avgCPA: 15.50
  }
}

export const useBenchmarkingService = () => {
  /**
   * Compare user metrics to benchmarks
   */
  const compareMetrics = (metricType, userMetric) => {
    const benchmark = INDUSTRY_BENCHMARKS[metricType]
    if (!benchmark) return null

    const comparison = {}
    for (const [key, benchmarkValue] of Object.entries(benchmark)) {
      const userValue = userMetric[key]
      if (userValue !== undefined) {
        const percentageDiff = ((userValue - benchmarkValue) / benchmarkValue) * 100
        comparison[key] = {
          userValue,
          benchmarkValue,
          percentageDiff: percentageDiff.toFixed(2),
          performance: percentageDiff > 0 ? 'above' : 'below',
          rank: getRank(percentageDiff)
        }
      }
    }
    return comparison
  }

  /**
   * Get performance rank
   */
  const getRank = (percentageDiff) => {
    if (percentageDiff >= 50) return 'top-10%'
    if (percentageDiff >= 25) return 'top-25%'
    if (percentageDiff >= 0) return 'above-average'
    if (percentageDiff >= -25) return 'average'
    if (percentageDiff >= -50) return 'below-average'
    return 'bottom-10%'
  }

  /**
   * Get improvement recommendations based on metrics
   */
  const getRecommendations = (metricType, userMetrics) => {
    const comparisons = compareMetrics(metricType, userMetrics)
    const recommendations = []

    for (const [key, data] of Object.entries(comparisons || {})) {
      if (data.performance === 'below' && data.percentageDiff < -20) {
        const improvement = Math.abs(data.percentageDiff).toFixed(1)
        recommendations.push({
          metric: key,
          issue: `Performing ${improvement}% below benchmark`,
          priority: 'high',
          action: getActionForMetric(metricType, key),
          potentialGain: calculatePotentialGain(data.benchmarkValue, data.userValue)
        })
      }
    }

    return recommendations.sort((a, b) => b.potentialGain - a.potentialGain)
  }

  /**
   * Get actionable advice for specific metric
   */
  const getActionForMetric = (metricType, metric) => {
    const actions = {
      email: {
        avgOpenRate: 'Improve subject lines - test A/B variations for higher open rates',
        avgClickRate: 'Add clear CTAs and test button placement and copy',
        avgConversionRate: 'Optimize landing pages and post-click experience',
        avgUnsubscribeRate: 'Segment lists better and reduce email frequency'
      },
      web: {
        avgConversionRate: 'Optimize forms, reduce friction, A/B test CTAs',
        avgBounceRate: 'Improve page load speed and relevant content matching',
        avgEngagementTime: 'Add video, reduce text blocks, improve readability'
      },
      social: {
        avgEngagementRate: 'Post more frequently, ask questions, create shareable content',
        avgClickThroughRate: 'Better CTAs, timely content, trending topics',
        avgShareRate: 'Focus on emotional/controversial topics, add share buttons'
      },
      ads: {
        avgCPC: 'Improve Quality Score, refine targeting, optimize bid strategy',
        avgROAS: 'Test landing pages, improve conversion rate, adjust budget allocation',
        avgCPA: 'Reduce ad spend on low-converting keywords, focus on audience quality'
      }
    }

    return actions[metricType]?.[metric] || 'No specific recommendation available'
  }

  /**
   * Calculate potential gain if user reaches benchmark
   */
  const calculatePotentialGain = (benchmarkValue, userValue) => {
    return ((benchmarkValue - userValue) / userValue * 100).toFixed(1)
  }

  /**
   * Get industry summary
   */
  const getIndustrySummary = (industry) => {
    const benchmarks = INDUSTRY_BENCHMARKS[industry]
    if (!benchmarks) return null

    return {
      industry,
      benchmarks,
      summary: `Industry average for ${industry} shows these key metrics`,
      lastUpdated: new Date().toISOString()
    }
  }

  /**
   * Calculate competitiveness score (0-100)
   */
  const calculateCompetitivenessScore = (metricType, userMetrics) => {
    const comparisons = compareMetrics(metricType, userMetrics)
    if (!comparisons) return 0

    let totalScore = 0
    let count = 0

    for (const data of Object.values(comparisons)) {
      const percentageDiff = parseFloat(data.percentageDiff)
      // Convert to 0-100 scale
      const score = Math.max(0, Math.min(100, 50 + (percentageDiff / 2)))
      totalScore += score
      count++
    }

    return Math.round(totalScore / count)
  }

  /**
   * Get competitive positioning
   */
  const getCompetitivePositioning = (metricType, userMetrics) => {
    const score = calculateCompetitivenessScore(metricType, userMetrics)

    let position = 'Below Average'
    let advice = 'Focus on fundamentals'

    if (score >= 80) {
      position = 'Top Performer'
      advice = 'Maintain momentum and look for advanced optimizations'
    } else if (score >= 60) {
      position = 'Above Average'
      advice = 'Good performance - continue optimizing key metrics'
    } else if (score >= 40) {
      position = 'Average'
      advice = 'Room for improvement - focus on top 3 metrics'
    } else {
      position = 'Below Average'
      advice = 'Significant opportunities for improvement'
    }

    return {
      score,
      position,
      advice,
      percentile: getPercentile(score)
    }
  }

  /**
   * Get percentile ranking
   */
  const getPercentile = (score) => {
    if (score >= 80) return 'Top 10%'
    if (score >= 70) return 'Top 25%'
    if (score >= 60) return 'Top 40%'
    if (score >= 50) return 'Top 50%'
    if (score >= 40) return 'Bottom 50%'
    return 'Bottom 10%'
  }

  /**
   * Get goal-based targets
   */
  const getGoalBasedTargets = (goal, currentMetrics) => {
    const targets = {
      awareness: {
        metric: 'impressions',
        target: currentMetrics.impressions * 1.5,
        timeframe: '30 days',
        strategy: 'Increase ad spend, expand audience, test new platforms'
      },
      traffic: {
        metric: 'click-through-rate',
        target: INDUSTRY_BENCHMARKS.web.avgConversionRate * 2,
        timeframe: '30 days',
        strategy: 'Optimize headlines and CTAs, improve relevance'
      },
      leads: {
        metric: 'lead-cost',
        target: currentMetrics.leadCost * 0.8,
        timeframe: '45 days',
        strategy: 'Refine targeting, improve landing pages, A/B test offers'
      },
      sales: {
        metric: 'roas',
        target: INDUSTRY_BENCHMARKS.ads.avgROAS,
        timeframe: '60 days',
        strategy: 'Focus on converting segments, improve upsell strategy'
      }
    }

    return targets[goal] || null
  }

  return {
    compareMetrics,
    getRecommendations,
    getIndustrySummary,
    calculateCompetitivenessScore,
    getCompetitivePositioning,
    getGoalBasedTargets,
    INDUSTRY_BENCHMARKS
  }
}
