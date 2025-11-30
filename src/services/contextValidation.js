/**
 * Context Validation Service
 *
 * Validates business context data against schema and provides quality assessment
 * per tier and overall
 */

/**
 * Validate entire business context
 */
export const validateContext = (context) => {
  const result = {
    valid: true,
    tierScores: {},
    missingFields: [],
    warnings: [],
    suggestions: [],
    overall: 0
  }

  if (!context || typeof context !== 'object') {
    result.valid = false
    result.missingFields.push('Context is empty or not an object')
    return result
  }

  // Validate each tier
  const tiers = [
    'tier1_business',
    'tier2_market',
    'tier3_brand',
    'tier4_goals',
    'tier5_marketing',
    'tier6_content',
    'tier7_integrations'
  ]

  tiers.forEach((tierName) => {
    const tierValidation = validateTier(tierName, context[tierName])
    result.tierScores[tierName] = tierValidation.score
    result.missingFields.push(...tierValidation.missing)
    result.warnings.push(...tierValidation.warnings)
    result.suggestions.push(...tierValidation.suggestions)
  })

  // Validate metadata
  if (!context.metadata) {
    result.warnings.push('Metadata missing - will be auto-generated')
  } else {
    const metaValidation = validateMetadata(context.metadata)
    result.warnings.push(...metaValidation.warnings)
  }

  // Calculate overall score
  result.overall = calculateOverallScore(result.tierScores)

  // Mark as invalid if critical fields missing
  if (result.missingFields.some((f) => f.includes('CRITICAL'))) {
    result.valid = false
  }

  return result
}

/**
 * Validate individual tier
 */
function validateTier(tierName, tier) {
  const result = {
    score: 0,
    missing: [],
    warnings: [],
    suggestions: []
  }

  if (!tier) {
    result.score = 0
    result.missing.push(`${tierName}: Missing entire tier`)
    return result
  }

  switch (tierName) {
    case 'tier1_business':
      return validateTier1(tier, result)
    case 'tier2_market':
      return validateTier2(tier, result)
    case 'tier3_brand':
      return validateTier3(tier, result)
    case 'tier4_goals':
      return validateTier4(tier, result)
    case 'tier5_marketing':
      return validateTier5(tier, result)
    case 'tier6_content':
      return validateTier6(tier, result)
    case 'tier7_integrations':
      return validateTier7(tier, result)
    default:
      return result
  }
}

function validateTier1(tier, result) {
  let filledFields = 0
  let totalFields = 0

  // Company info
  const companyFields = ['name', 'description', 'industry', 'website']
  companyFields.forEach((field) => {
    totalFields++
    if (tier.company?.[field]) filledFields++
    else result.missing.push(`tier1_business.company.${field}: CRITICAL`)
  })

  // Product info
  const productFields = ['name', 'description', 'category', 'uniqueValue']
  productFields.forEach((field) => {
    totalFields++
    if (tier.product?.[field]) filledFields++
    else result.missing.push(`tier1_business.product.${field}: CRITICAL`)
  })

  if (!tier.company?.tagline) {
    result.warnings.push('tier1_business.company.tagline: Recommended for branding')
  }

  if (!tier.product?.pricePoint) {
    result.warnings.push('tier1_business.product.pricePoint: Helps with positioning')
  }

  result.score = Math.round((filledFields / totalFields) * 100)
  if (filledFields >= totalFields * 0.7)
    result.suggestions.push('Tier 1 solid! Consider adding more detail to tagline and pricing info')

  return result
}

function validateTier2(tier, result) {
  let filledFields = 0
  let totalFields = 0

  // Positioning
  const positioningFields = ['primaryCompetitors', 'competitiveAdvantage', 'mainDifferentiator']
  positioningFields.forEach((field) => {
    totalFields++
    if (tier.positioning?.[field]) filledFields++
    else result.missing.push(`tier2_market.positioning.${field}: CRITICAL`)
  })

  // Audience
  if (!tier.audiences?.primary?.label) {
    result.missing.push('tier2_market.audiences.primary.label: CRITICAL')
  } else {
    filledFields++
  }
  totalFields++

  if (!tier.audiences?.primary?.painPoints || tier.audiences.primary.painPoints.length === 0) {
    result.warnings.push('tier2_market.audiences.primary.painPoints: Essential for messaging')
  } else {
    filledFields++
  }
  totalFields++

  if (!tier.audiences?.primary?.demographics?.jobTitle) {
    result.warnings.push('tier2_market.audiences.primary.demographics: Helps with targeting')
  }

  result.score = Math.round((filledFields / totalFields) * 100)
  if (filledFields >= totalFields * 0.7)
    result.suggestions.push('Market positioning clear! Add secondary audience for expanded reach')

  return result
}

function validateTier3(tier, result) {
  let filledFields = 0
  let totalFields = 0

  // Voice
  const voiceFields = ['tone', 'personality', 'language']
  voiceFields.forEach((field) => {
    totalFields++
    if (tier.voice?.[field]) filledFields++
    else result.missing.push(`tier3_brand.voice.${field}: Important for consistency`)
  })

  // Messaging
  totalFields++
  if (tier.messaging?.coreBenefit) {
    filledFields++
  } else {
    result.missing.push('tier3_brand.messaging.coreBenefit: CRITICAL')
  }

  if (!tier.messaging?.emotionalDriver) {
    result.warnings.push('tier3_brand.messaging.emotionalDriver: Increases engagement')
  }

  // Keywords
  if (!tier.keywords?.primary || tier.keywords.primary.length === 0) {
    result.missing.push('tier3_brand.keywords.primary: Essential for SEO and content')
  } else {
    filledFields++
  }
  totalFields++

  result.score = Math.round((filledFields / totalFields) * 100)
  if (filledFields >= totalFields * 0.6)
    result.suggestions.push('Brand voice taking shape! Add emotional drivers for better messaging')

  return result
}

function validateTier4(tier, result) {
  let filledFields = 0
  let totalFields = 0

  // Strategy
  const strategyFields = ['primaryGoal', 'goalTimeframe', 'targetMetric']
  strategyFields.forEach((field) => {
    totalFields++
    if (tier.strategy?.[field]) filledFields++
    else result.missing.push(`tier4_goals.strategy.${field}: CRITICAL`)
  })

  // Success metrics
  const metricsFields = ['websiteVisitors', 'leadRate', 'conversionRate', 'avgOrderValue']
  metricsFields.forEach((field) => {
    totalFields++
    if (tier.successMetrics?.[field]) filledFields++
  })

  result.score = Math.round((filledFields / totalFields) * 100)
  if (filledFields >= totalFields * 0.7)
    result.suggestions.push('Goals defined! Set baseline currentMetrics for progress tracking')

  return result
}

function validateTier5(tier, result) {
  let filledFields = 0
  let totalFields = 0

  // Channels
  if (tier.channels?.email?.status === 'active') {
    filledFields++
  }
  totalFields++

  if (tier.channels?.social && Array.isArray(tier.channels.social) && tier.channels.social.length > 0) {
    filledFields++
  }
  totalFields++

  if (tier.channels?.website?.monthlyVisitors) {
    filledFields++
  }
  totalFields++

  // Successful campaigns
  const campaignCount = Object.keys(tier.successfulCampaigns || {}).length
  if (campaignCount > 0) {
    filledFields++
  }
  totalFields++

  result.score = Math.round((filledFields / totalFields) * 100)

  if (campaignCount === 0) {
    result.suggestions.push('Tier 5: Document past successful campaigns to inform prompts')
  }

  return result
}

function validateTier6(tier, result) {
  let filledFields = 0
  let totalFields = 1

  // Generated content count
  const contentCount = (tier.generatedContent || []).length
  if (contentCount > 0) {
    filledFields = Math.min(contentCount / 10, 1) // max 10 pieces for full score
  }

  result.score = Math.round(filledFields * 100)
  result.suggestions.push('Tier 6: Builds over time as you generate content')

  return result
}

function validateTier7(tier, result) {
  let filledFields = 0
  let totalFields = 3

  if (tier.email?.connected) filledFields++
  if (tier.social && Array.isArray(tier.social) && tier.social.some((s) => s.connected)) filledFields++
  if (tier.analytics?.connected) filledFields++

  result.score = Math.round((filledFields / totalFields) * 100)
  result.suggestions.push('Tier 7: Connect integrations to enable automated publishing')

  return result
}

function validateMetadata(metadata) {
  const result = {
    warnings: []
  }

  if (!metadata.completionDate) {
    result.warnings.push('metadata.completionDate: Will be auto-set')
  }

  if (metadata.taskRunCount && Object.keys(metadata.taskRunCount).length === 0) {
    result.warnings.push('metadata.taskRunCount: Will update as tasks run')
  }

  return result
}

/**
 * Calculate overall context score
 */
function calculateOverallScore(tierScores) {
  const scores = Object.values(tierScores)
  if (scores.length === 0) return 0

  // Weight earlier tiers more heavily
  const weights = {
    tier1_business: 0.25,
    tier2_market: 0.2,
    tier3_brand: 0.2,
    tier4_goals: 0.15,
    tier5_marketing: 0.1,
    tier6_content: 0.05,
    tier7_integrations: 0.05
  }

  let weighted = 0
  Object.entries(tierScores).forEach(([tier, score]) => {
    weighted += score * (weights[tier] || 0.05)
  })

  return Math.round(weighted)
}

/**
 * Get completion estimate per tier
 */
export const getCompletionEstimate = (tier, tierName) => {
  const estimates = {
    tier1_business: '5-10 minutes',
    tier2_market: '10-15 minutes',
    tier3_brand: '8-12 minutes',
    tier4_goals: '5-8 minutes',
    tier5_marketing: '5-10 minutes',
    tier6_content: 'Grows as you generate content',
    tier7_integrations: '5-15 minutes (if integrating)'
  }

  return estimates[tierName] || '5-10 minutes'
}

/**
 * Get human-readable tier description
 */
export const getTierDescription = (tierName) => {
  const descriptions = {
    tier1_business: 'Business & Product Fundamentals',
    tier2_market: 'Market & Audience Positioning',
    tier3_brand: 'Brand Voice & Messaging',
    tier4_goals: 'Goals & Success Metrics',
    tier5_marketing: 'Marketing Channels & History',
    tier6_content: 'Generated Content Library',
    tier7_integrations: 'External Integrations'
  }

  return descriptions[tierName] || tierName
}

/**
 * Get actionable suggestions based on validation
 */
export const getSuggestions = (validation) => {
  const suggestions = []

  // By tier
  const tierNames = Object.keys(validation.tierScores)
  tierNames.forEach((tierName) => {
    const score = validation.tierScores[tierName]
    if (score < 30) {
      suggestions.push({
        priority: 'high',
        tier: tierName,
        action: `Complete ${getTierDescription(tierName)} - currently ${score}% complete`
      })
    } else if (score < 70) {
      suggestions.push({
        priority: 'medium',
        tier: tierName,
        action: `Enhance ${getTierDescription(tierName)} - currently ${score}% complete`
      })
    }
  })

  // By missing fields
  validation.missingFields.forEach((field) => {
    if (field.includes('CRITICAL')) {
      suggestions.push({
        priority: 'high',
        field,
        action: `Add missing critical field: ${field.replace(': CRITICAL', '')}`
      })
    }
  })

  // Sort by priority
  return suggestions.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
}

/**
 * Check if context is ready for AI prompt generation
 */
export const isContextReadyForPrompts = (validation) => {
  // Need at least 50% on Tier 1-3 (business, market, brand)
  const criticalTiers = ['tier1_business', 'tier2_market', 'tier3_brand']
  const criticalScores = criticalTiers.map((t) => validation.tierScores[t] || 0)
  const avgCriticalScore = criticalScores.reduce((a, b) => a + b, 0) / criticalScores.length

  return avgCriticalScore >= 50
}

/**
 * Get readiness score (0-100) for specific task
 */
export const getTaskReadinessScore = (context, taskType) => {
  const validation = validateContext(context)

  // Different tasks need different context
  const requirements = {
    'generate-posts': {
      tier3_brand: 0.7, // Need strong brand voice
      tier2_market: 0.6, // Need audience understanding
      tier1_business: 0.5
    },
    'write-blog': {
      tier3_brand: 0.6,
      tier2_market: 0.7, // Blog heavily depends on audience
      tier1_business: 0.6
    },
    'email-sequence': {
      tier3_brand: 0.7,
      tier2_market: 0.7,
      tier1_business: 0.6
    },
    'landing-page': {
      tier1_business: 0.8,
      tier2_market: 0.7,
      tier3_brand: 0.6
    },
    'default': {
      tier1_business: 0.5,
      tier2_market: 0.5,
      tier3_brand: 0.5
    }
  }

  const reqs = requirements[taskType] || requirements.default
  let readiness = 0
  let totalWeight = 0

  Object.entries(reqs).forEach(([tier, weight]) => {
    const tierScore = (validation.tierScores[tier] || 0) / 100
    readiness += tierScore * weight
    totalWeight += weight
  })

  return Math.round((readiness / totalWeight) * 100)
}
