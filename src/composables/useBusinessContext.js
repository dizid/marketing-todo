import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/utils/supabase'

/**
 * useBusinessContext Composable
 *
 * Provides read/write interface to business context data stored in
 * Supabase project_data.businessContext JSON field
 *
 * Usage:
 *   const { getContext, setContext, updateContext, getCompletionScore } = useBusinessContext()
 *   await getContext() // fetch full context
 *   await updateContext('tier1_business', 'company.name', 'Acme Inc')
 */

export const useBusinessContext = () => {
  const route = useRoute()
  const context = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Get current project ID from route
  const getProjectId = () => {
    return route.params.projectId || localStorage.getItem('currentProjectId')
  }

  /**
   * Fetch full business context from Supabase
   */
  const getContext = async () => {
    loading.value = true
    error.value = null

    try {
      const projectId = getProjectId()
      if (!projectId) throw new Error('No project ID found')

      const { data, error: queryError } = await supabase
        .from('project_data')
        .select('businessContext')
        .eq('id', projectId)
        .single()

      if (queryError) throw queryError

      context.value = data?.businessContext || getEmptyContext()
      return context.value
    } catch (err) {
      console.error('Error fetching business context:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch specific tier from business context
   */
  const getContextTier = async (tierName) => {
    try {
      const ctx = context.value || (await getContext())
      return ctx[tierName] || null
    } catch (err) {
      console.error(`Error fetching tier ${tierName}:`, err)
      throw err
    }
  }

  /**
   * Set entire business context (full replace)
   */
  const setContext = async (newContext) => {
    loading.value = true
    error.value = null

    try {
      const projectId = getProjectId()
      if (!projectId) throw new Error('No project ID found')

      // Validate context structure
      const validation = validateContextStructure(newContext)
      if (!validation.valid) {
        throw new Error(`Context validation failed: ${validation.errors.join(', ')}`)
      }

      const { error: updateError } = await supabase
        .from('project_data')
        .update({
          businessContext: newContext,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId)

      if (updateError) throw updateError

      context.value = newContext
      return newContext
    } catch (err) {
      console.error('Error setting business context:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Update single field in business context using nested path
   * Example: updateContext('tier1_business', 'company.name', 'Acme Inc')
   */
  const updateContext = async (tierName, fieldPath, value) => {
    loading.value = true
    error.value = null

    try {
      const projectId = getProjectId()
      if (!projectId) throw new Error('No project ID found')

      // Get current context
      const ctx = context.value || (await getContext())

      // Set nested value
      setNestedValue(ctx[tierName], fieldPath, value)

      // Record in enrichment history
      if (!ctx.metadata) {
        ctx.metadata = getEmptyMetadata()
      }
      ctx.metadata.enrichmentHistory = ctx.metadata.enrichmentHistory || []
      ctx.metadata.enrichmentHistory.push({
        timestamp: new Date().toISOString(),
        field: `${tierName}.${fieldPath}`,
        newValue: value
      })

      // Update in database
      const { error: updateError } = await supabase
        .from('project_data')
        .update({
          businessContext: ctx,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId)

      if (updateError) throw updateError

      context.value = ctx
      return ctx
    } catch (err) {
      console.error('Error updating business context:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Merge new data into business context (progressive enrichment)
   */
  const enrichContext = async (sourceData) => {
    loading.value = true
    error.value = null

    try {
      const projectId = getProjectId()
      if (!projectId) throw new Error('No project ID found')

      const ctx = context.value || (await getContext())

      // Deep merge sourceData into context
      Object.keys(sourceData).forEach((tierName) => {
        if (ctx[tierName]) {
          ctx[tierName] = { ...ctx[tierName], ...sourceData[tierName] }
        }
      })

      // Recalculate completion score
      ctx.metadata = ctx.metadata || getEmptyMetadata()
      ctx.metadata.completionScore = calculateCompletionScore(ctx)
      ctx.metadata.completionDate = new Date().toISOString()

      // Update in database
      const { error: updateError } = await supabase
        .from('project_data')
        .update({
          businessContext: ctx,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId)

      if (updateError) throw updateError

      context.value = ctx
      return ctx
    } catch (err) {
      console.error('Error enriching business context:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Calculate completion score (0-100) based on tier fullness
   */
  const getCompletionScore = () => {
    if (!context.value) return 0
    return calculateCompletionScore(context.value)
  }

  /**
   * Get scores for each individual tier
   */
  const getTierScores = () => {
    if (!context.value) return {}

    return {
      tier1: getTierCompleteness(context.value.tier1_business),
      tier2: getTierCompleteness(context.value.tier2_market),
      tier3: getTierCompleteness(context.value.tier3_brand),
      tier4: getTierCompleteness(context.value.tier4_goals),
      tier5: getTierCompleteness(context.value.tier5_marketing),
      tier6: getTierCompleteness(context.value.tier6_content),
      tier7: getTierCompleteness(context.value.tier7_integrations)
    }
  }

  /**
   * Track field view for analytics
   */
  const trackFieldView = (fieldName) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'business_context_field_viewed', {
        event_category: 'business_context',
        event_label: fieldName
      })
    }
  }

  /**
   * Record feedback on generated content
   */
  const recordContentFeedback = async (taskName, contentId, rating, feedback) => {
    try {
      const ctx = context.value || (await getContext())

      if (!ctx.tier6_content) {
        ctx.tier6_content = { generatedContent: [], assetLibrary: {} }
      }

      // Store feedback in metadata
      if (!ctx.metadata) {
        ctx.metadata = getEmptyMetadata()
      }

      ctx.metadata.feedbackSummary = ctx.metadata.feedbackSummary || {
        totalFeedback: 0,
        averageRating: 0,
        mostCommonFeedback: []
      }

      ctx.metadata.feedbackSummary.totalFeedback += 1
      ctx.metadata.feedbackSummary.averageRating =
        (ctx.metadata.feedbackSummary.averageRating * (ctx.metadata.feedbackSummary.totalFeedback - 1) + rating) /
        ctx.metadata.feedbackSummary.totalFeedback

      await updateContext('metadata', 'feedbackSummary', ctx.metadata.feedbackSummary)
    } catch (err) {
      console.error('Error recording content feedback:', err)
      throw err
    }
  }

  return {
    context: computed(() => context.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    getContext,
    getContextTier,
    setContext,
    updateContext,
    enrichContext,
    getCompletionScore,
    getTierScores,
    trackFieldView,
    recordContentFeedback
  }
}

/**
 * Helper: Get empty context structure
 */
function getEmptyContext() {
  return {
    tier1_business: getEmptyTier1(),
    tier2_market: getEmptyTier2(),
    tier3_brand: getEmptyTier3(),
    tier4_goals: getEmptyTier4(),
    tier5_marketing: getEmptyTier5(),
    tier6_content: getEmptyTier6(),
    tier7_integrations: getEmptyTier7(),
    metadata: getEmptyMetadata()
  }
}

function getEmptyTier1() {
  return {
    company: {
      name: '',
      description: '',
      industry: '',
      yearFounded: null,
      size: '',
      website: '',
      tagline: ''
    },
    product: {
      name: '',
      description: '',
      category: '',
      uniqueValue: '',
      pricePoint: '',
      stage: ''
    }
  }
}

function getEmptyTier2() {
  return {
    positioning: {
      primaryCompetitors: [],
      competitiveAdvantage: '',
      marketGap: '',
      mainDifferentiator: ''
    },
    audiences: {
      primary: {
        label: '',
        description: '',
        painPoints: [],
        aspirations: [],
        demographics: {
          ageRange: '',
          jobTitle: '',
          annualBudget: ''
        },
        behaviors: []
      }
    },
    targetSegmentation: {}
  }
}

function getEmptyTier3() {
  return {
    voice: {
      tone: [],
      personality: '',
      language: '',
      avoidLanguage: []
    },
    messaging: {
      coreBenefit: '',
      emotionalDriver: '',
      socialProof: [],
      keyMessages: []
    },
    visual: {
      colorScheme: '',
      imagery: '',
      style: ''
    },
    keywords: {
      primary: [],
      secondary: [],
      negative: []
    }
  }
}

function getEmptyTier4() {
  return {
    strategy: {
      primaryGoal: '',
      goalTimeframe: '',
      targetMetric: '',
      targetValue: ''
    },
    currentMetrics: {
      websiteVisitors: 0,
      leadRate: 0,
      conversionRate: 0,
      avgOrderValue: 0
    },
    successMetrics: {
      websiteVisitors: 0,
      leadRate: 0,
      conversionRate: 0,
      avgOrderValue: 0
    }
  }
}

function getEmptyTier5() {
  return {
    channels: {
      email: { status: 'inactive', subscribers: 0 },
      social: [],
      website: { monthlyVisitors: 0, leadPerMonth: 0 }
    },
    successfulCampaigns: {},
    failedApproaches: []
  }
}

function getEmptyTier6() {
  return {
    generatedContent: [],
    assetLibrary: {
      imageTemplates: [],
      videoScripts: [],
      emailTemplates: [],
      landingPageLayouts: []
    }
  }
}

function getEmptyTier7() {
  return {
    email: {
      provider: 'none',
      connected: false,
      lists: 0
    },
    social: [],
    analytics: {
      provider: 'none',
      connected: false
    },
    crmIntegration: {
      provider: '',
      connected: false
    }
  }
}

function getEmptyMetadata() {
  return {
    completionScore: 0,
    completionDate: null,
    enrichmentHistory: [],
    taskRunCount: {},
    promptQualityTrend: {
      week1AvgRating: 0,
      week2AvgRating: 0,
      trend: 'stable'
    },
    feedbackSummary: {
      totalFeedback: 0,
      averageRating: 0,
      mostCommonFeedback: []
    }
  }
}

/**
 * Helper: Set value at nested path
 */
function setNestedValue(obj, path, value) {
  const keys = path.split('.')
  let current = obj

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (!current[key]) {
      current[key] = {}
    }
    current = current[key]
  }

  current[keys[keys.length - 1]] = value
}

/**
 * Helper: Calculate tier completeness (0-100)
 */
function getTierCompleteness(tier) {
  if (!tier) return 0

  const totalKeys = Object.keys(tier).length
  if (totalKeys === 0) return 0

  let filledKeys = 0
  Object.entries(tier).forEach(([, value]) => {
    if (value !== null && value !== '' && value !== undefined) {
      if (Array.isArray(value)) {
        filledKeys += value.length > 0 ? 1 : 0
      } else if (typeof value === 'object') {
        filledKeys += Object.keys(value).length > 0 ? 1 : 0
      } else {
        filledKeys += 1
      }
    }
  })

  return Math.round((filledKeys / totalKeys) * 100)
}

/**
 * Helper: Calculate overall completion score
 */
function calculateCompletionScore(context) {
  if (!context) return 0

  const tierNames = ['tier1_business', 'tier2_market', 'tier3_brand', 'tier4_goals', 'tier5_marketing', 'tier6_content', 'tier7_integrations']
  const scores = tierNames.map((tierName) => getTierCompleteness(context[tierName]))

  // Weight early tiers more heavily (Tier 1-2 are critical)
  const weights = [0.2, 0.2, 0.15, 0.15, 0.15, 0.1, 0.05]
  const weightedScore = scores.reduce((sum, score, i) => sum + score * weights[i], 0)

  return Math.round(weightedScore)
}

/**
 * Helper: Validate context structure
 */
function validateContextStructure(context) {
  const errors = []

  if (!context || typeof context !== 'object') {
    errors.push('Context must be an object')
  }

  const requiredTiers = ['tier1_business', 'tier2_market', 'tier3_brand', 'tier4_goals', 'tier5_marketing', 'tier6_content', 'tier7_integrations', 'metadata']

  requiredTiers.forEach((tier) => {
    if (!context[tier]) {
      errors.push(`Missing required tier: ${tier}`)
    }
  })

  return {
    valid: errors.length === 0,
    errors
  }
}
