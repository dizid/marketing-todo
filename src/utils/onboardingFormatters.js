/**
 * Onboarding Formatters
 * Shared utilities for formatting wizard data
 */

/**
 * Format goal enum to human-readable string
 * @param {string} goal - Goal enum value
 * @returns {string} Formatted goal text
 */
export const formatGoal = (goal) => {
  const goals = {
    first_100: 'Make first $100',
    '1k_mrr': 'Reach $1K MRR',
    '10k_mrr': 'Reach $10K MRR',
    audience: 'Build an audience',
    validate: 'Validate idea'
  }
  return goals[goal] || goal
}

/**
 * Format timeline enum to human-readable string
 * @param {string} timeline - Timeline enum value
 * @returns {string} Formatted timeline text
 */
export const formatTimeline = (timeline) => {
  const timelines = {
    '1_month': '1 month',
    '3_months': '3 months',
    '6_months': '6 months',
    no_timeline: 'No specific timeline'
  }
  return timelines[timeline] || timeline
}
