/**
 * PromptBuilder Service
 *
 * Intelligently constructs AI prompts by:
 * 1. Loading business context from Supabase
 * 2. Extracting relevant tiers based on task requirements
 * 3. Formatting context variables for prompt injection
 * 4. Handling missing/incomplete data gracefully
 *
 * This service eliminates repetitive contextProvider logic in task configs.
 * Instead of each task writing its own context extraction, they can:
 *
 * OLD APPROACH (repetitive):
 *   contextProvider: async () => {
 *     const { getContext } = useBusinessContext()
 *     const context = await getContext()
 *     const tier1 = context?.tier1_business
 *     // ... extract 10+ fields
 *   }
 *
 * NEW APPROACH (with PromptBuilder):
 *   contextProvider: async () => {
 *     const builder = usePromptBuilder()
 *     return builder.buildContext(['tier1', 'tier2', 'tier3'])
 *   }
 */

import { useBusinessContext } from '../composables/useBusinessContext.js'

/**
 * Composable for building prompts with business context
 * @returns {Object} PromptBuilder API
 */
export const usePromptBuilder = () => {
  const { getContext } = useBusinessContext()

  /**
   * Extract formatted context variables for a specific set of tiers
   * @param {Array<string>} tierNames - e.g., ['tier1_business', 'tier2_market', 'tier3_brand']
   * @param {Object} customExtractors - Optional: { fieldName: (context, tier) => value }
   * @returns {Promise<Object>} Variables ready for prompt template
   */
  const buildContext = async (tierNames = [], customExtractors = {}) => {
    try {
      const context = await getContext()
      const variables = {}

      // Built-in tier extractors
      const extractors = {
        tier1_business: (ctx) => extractTier1(ctx),
        tier2_market: (ctx) => extractTier2(ctx),
        tier3_brand: (ctx) => extractTier3(ctx),
        tier4_goals: (ctx) => extractTier4(ctx),
        tier5_marketing: (ctx) => extractTier5(ctx),
        tier6_content: (ctx) => extractTier6(ctx),
        tier7_integrations: (ctx) => extractTier7(ctx),
        ...customExtractors
      }

      // Extract variables from requested tiers
      for (const tierName of tierNames) {
        const extractor = extractors[tierName]
        if (extractor) {
          const tierVars = extractor(context)
          Object.assign(variables, tierVars)
        }
      }

      return variables
    } catch (error) {
      console.error('PromptBuilder: Error building context:', error)
      return getDefaultVariables(tierNames)
    }
  }

  /**
   * Build context for social media tasks
   * Combines brand + audience + marketing data
   */
  const buildSocialMediaContext = async () => {
    return buildContext(['tier1_business', 'tier2_market', 'tier3_brand', 'tier5_marketing'])
  }

  /**
   * Build context for outreach/sales tasks
   * Combines company + market positioning + brand
   */
  const buildOutreachContext = async () => {
    return buildContext(['tier1_business', 'tier2_market', 'tier3_brand'])
  }

  /**
   * Build context for content creation (blog, email, etc)
   * Combines everything except integrations
   */
  const buildContentContext = async () => {
    return buildContext(['tier1_business', 'tier2_market', 'tier3_brand', 'tier4_goals', 'tier5_marketing'])
  }

  /**
   * Build context for goal/strategy tasks
   * Focuses on goals and metrics
   */
  const buildStrategicContext = async () => {
    return buildContext(['tier1_business', 'tier2_market', 'tier3_brand', 'tier4_goals'])
  }

  return {
    buildContext,
    buildSocialMediaContext,
    buildOutreachContext,
    buildContentContext,
    buildStrategicContext
  }
}

// ============================================================================
// TIER EXTRACTION FUNCTIONS
// ============================================================================

/**
 * Tier 1: Business Basics
 * Company name, product description, website, founding info
 */
function extractTier1(context) {
  const tier = context?.tier1_business || {}
  const company = tier.company || {}
  const product = tier.product || {}

  return {
    company_name: company.name || 'Your Company',
    company_website: company.website || '',
    company_industry: company.industry || '',
    company_tagline: company.tagline || '',
    app_description: product.description || 'Your product/service',
    product_name: product.name || 'Your Product',
    product_category: product.category || '',
    product_price_point: product.pricePoint || '',
    product_stage: product.stage || 'early'
  }
}

/**
 * Tier 2: Market & Audience
 * Competitive landscape, positioning, target audience, pain points
 */
function extractTier2(context) {
  const tier = context?.tier2_market || {}
  const positioning = tier.positioning || {}
  const audience = tier.audiences?.primary || {}

  return {
    market_positioning: positioning.differentiator || 'solving key industry challenges',
    market_competitors: (positioning.competitors || []).join(', ') || 'industry competitors',
    competitive_advantage: positioning.competitiveAdvantage || 'unique approach',
    market_gap: positioning.marketGap || 'unmet market need',
    audience_description: audience.description || 'target professionals',
    audience_segment: audience.jobTitle || 'decision makers',
    audience_age_range: audience.ageRange || '',
    audience_pain_points: (audience.painPoints || []).join(', ') || 'key challenges',
    audience_aspirations: (audience.aspirations || []).join(', ') || 'success goals'
  }
}

/**
 * Tier 3: Brand & Voice
 * Brand personality, tone, messaging, keywords
 */
function extractTier3(context) {
  const tier = context?.tier3_brand || {}
  const voice = tier.voice || {}
  const messaging = tier.messaging || {}
  const keywords = tier.keywords || {}

  return {
    brand_personality: voice.personality || 'authentic and helpful',
    brand_voice: voice.tone || 'friendly and professional',
    brand_language_style: voice.languageStyle || 'clear and conversational',
    brand_core_benefit: messaging.coreBenefit || 'primary value',
    brand_emotional_driver: messaging.emotionalDriver || 'customer motivation',
    brand_key_messages: (messaging.keyMessages || []).join('; ') || 'main talking points',
    brand_keywords_primary: (keywords.primary || []).join(', ') || 'core keywords',
    brand_keywords_secondary: (keywords.secondary || []).join(', ') || 'supporting keywords'
  }
}

/**
 * Tier 4: Goals & Metrics
 * Primary goals, timeframes, success metrics, target values
 */
function extractTier4(context) {
  const tier = context?.tier4_goals || {}
  const strategy = tier.strategy || {}
  const currentMetrics = tier.currentMetrics || {}
  const successMetrics = tier.successMetrics || {}

  return {
    primary_goal: strategy.primaryGoal || 'business growth',
    goal_timeframe: strategy.timeframe || 'next quarter',
    goal_target_metric: strategy.successMetric || 'key performance indicator',
    goal_target_value: strategy.targetValue || '0',
    current_monthly_revenue: currentMetrics.monthlyRevenue || '0',
    current_customer_count: currentMetrics.customerCount || '0',
    current_churn_rate: currentMetrics.churnRate || '0%',
    success_metric_name: successMetrics.metricName || 'growth metric',
    success_metric_target: successMetrics.targetValue || '0'
  }
}

/**
 * Tier 5: Marketing & Channels
 * Marketing channels, campaigns, strategies
 */
function extractTier5(context) {
  const tier = context?.tier5_marketing || {}
  const channels = tier.channels || {}
  const campaigns = tier.successfulCampaigns || []
  const failures = tier.failedApproaches || []

  // Format past campaigns for prompt inclusion
  const campaignText = campaigns.length > 0
    ? campaigns.slice(0, 3).map(c => `- ${c.name}: ${c.description}`).join('\n')
    : 'No previous campaigns recorded yet'

  // Format failed approaches as lessons learned
  const failureText = failures.length > 0
    ? failures.slice(0, 2).map(f => `- Avoid: ${f}`).join('\n')
    : 'No recorded failures yet'

  return {
    email_status: channels.emailMarketing?.status || 'not_started',
    email_subscriber_count: channels.emailMarketing?.subscriberCount || '0',
    website_monthly_visitors: channels.website?.monthlyVisitors || '0',
    past_campaigns: campaignText,
    failed_approaches: failureText,
    primary_marketing_channel: channels.primaryChannel || 'social media'
  }
}

/**
 * Tier 6: Content Library
 * Generated content items and asset collections
 */
function extractTier6(context) {
  const tier = context?.tier6_content || {}
  const generatedContent = tier.generatedContent || []
  const assets = tier.assetLibrary || {}

  return {
    total_content_items: generatedContent.length,
    content_types: [...new Set(generatedContent.map(c => c.type))].join(', ') || 'none generated',
    total_assets: Object.keys(assets).length,
    asset_categories: Object.keys(assets).join(', ') || 'no assets'
  }
}

/**
 * Tier 7: Integrations
 * Connected platforms and tools
 */
function extractTier7(context) {
  const tier = context?.tier7_integrations || {}

  return {
    email_provider: tier.email?.provider || 'not connected',
    email_account: tier.email?.account || '',
    social_platforms: (tier.social || []).join(', ') || 'none connected',
    analytics_tool: tier.analytics?.tool || 'not connected',
    crm_system: tier.crm?.system || 'not connected'
  }
}

/**
 * Get default variables when context is unavailable
 * Ensures prompts always have valid (if generic) variables
 */
function getDefaultVariables(tierNames = []) {
  const defaults = {
    // Tier 1
    company_name: 'Your Company',
    company_website: '',
    company_industry: '',
    company_tagline: '',
    app_description: 'Your product/service',
    product_name: 'Your Product',
    product_category: '',
    product_price_point: '',
    product_stage: 'early',

    // Tier 2
    market_positioning: 'solving key industry challenges',
    market_competitors: 'industry competitors',
    competitive_advantage: 'unique approach',
    market_gap: 'unmet market need',
    audience_description: 'target professionals',
    audience_segment: 'decision makers',
    audience_age_range: '',
    audience_pain_points: 'key challenges',
    audience_aspirations: 'success goals',

    // Tier 3
    brand_personality: 'authentic and helpful',
    brand_voice: 'friendly and professional',
    brand_language_style: 'clear and conversational',
    brand_core_benefit: 'primary value',
    brand_emotional_driver: 'customer motivation',
    brand_key_messages: 'main talking points',
    brand_keywords_primary: 'core keywords',
    brand_keywords_secondary: 'supporting keywords',

    // Tier 4
    primary_goal: 'business growth',
    goal_timeframe: 'next quarter',
    goal_target_metric: 'key performance indicator',
    goal_target_value: '0',
    current_monthly_revenue: '0',
    current_customer_count: '0',
    current_churn_rate: '0%',
    success_metric_name: 'growth metric',
    success_metric_target: '0',

    // Tier 5
    email_status: 'not_started',
    email_subscriber_count: '0',
    website_monthly_visitors: '0',
    past_campaigns: 'No previous campaigns recorded yet',
    failed_approaches: 'No recorded failures yet',
    primary_marketing_channel: 'social media',

    // Tier 6
    total_content_items: 0,
    content_types: 'none generated',
    total_assets: 0,
    asset_categories: 'no assets',

    // Tier 7
    email_provider: 'not connected',
    email_account: '',
    social_platforms: 'none connected',
    analytics_tool: 'not connected',
    crm_system: 'not connected'
  }

  // Return only requested tier defaults
  const requested = {}
  if (tierNames.length === 0) {
    return defaults
  }

  // Map tier names to default keys
  const tierKeysMap = {
    tier1_business: ['company_name', 'company_website', 'company_industry', 'company_tagline', 'app_description', 'product_name', 'product_category', 'product_price_point', 'product_stage'],
    tier2_market: ['market_positioning', 'market_competitors', 'competitive_advantage', 'market_gap', 'audience_description', 'audience_segment', 'audience_age_range', 'audience_pain_points', 'audience_aspirations'],
    tier3_brand: ['brand_personality', 'brand_voice', 'brand_language_style', 'brand_core_benefit', 'brand_emotional_driver', 'brand_key_messages', 'brand_keywords_primary', 'brand_keywords_secondary'],
    tier4_goals: ['primary_goal', 'goal_timeframe', 'goal_target_metric', 'goal_target_value', 'current_monthly_revenue', 'current_customer_count', 'current_churn_rate', 'success_metric_name', 'success_metric_target'],
    tier5_marketing: ['email_status', 'email_subscriber_count', 'website_monthly_visitors', 'past_campaigns', 'failed_approaches', 'primary_marketing_channel'],
    tier6_content: ['total_content_items', 'content_types', 'total_assets', 'asset_categories'],
    tier7_integrations: ['email_provider', 'email_account', 'social_platforms', 'analytics_tool', 'crm_system']
  }

  for (const tierName of tierNames) {
    const keys = tierKeysMap[tierName] || []
    keys.forEach(key => {
      requested[key] = defaults[key]
    })
  }

  return requested
}
