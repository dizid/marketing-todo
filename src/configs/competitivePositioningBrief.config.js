/**
 * Competitive Positioning Brief Generator - Premium Feature
 *
 * Analyzes your competitive landscape and generates a strategic positioning brief
 * that identifies differentiation opportunities and market positioning strategy.
 *
 * Part of Phase 3D: Auto-Generated Business Documents
 */

export const competitivePositioningBriefConfig = {
  id: 'competitive-positioning-brief',
  name: 'Competitive Positioning Brief Generator',
  description: 'Generate a strategic positioning brief analyzing your competitive landscape and market opportunities',
  category: 'strategy',
  tier: 'premium',

  what: 'Get a strategic competitive positioning brief that analyzes your market position, identifies differentiation opportunities, and provides actionable positioning recommendations. Includes SWOT analysis, competitive differentiation strategy, market positioning map, defensibility analysis, and action recommendations.',

  why: 'Without a clear competitive positioning strategy, you risk being seen as "another me-too" product in a crowded market. This brief ensures you have a defensible position that resonates with your target audience and differentiates you from established competitors.',

  how: 'Provide information about your main competitors, current positioning, competitive advantages, pricing strategy, and audience overlap. AI analyzes this landscape and generates a comprehensive positioning brief with actionable recommendations to strengthen your market position.',

  form: [
    {
      id: 'main_competitors',
      type: 'textarea',
      label: 'Main Competitors (Top 3-5)',
      placeholder: 'List competitors and briefly describe what makes them competitive.',
      required: true,
      rows: 3,
      description: 'Who are your main direct competitors?'
    },
    {
      id: 'your_positioning',
      type: 'textarea',
      label: 'Your Current Positioning',
      placeholder: 'How do you position yourself? What is your unique angle?',
      required: true,
      rows: 2,
      description: 'Your unique value proposition'
    },
    {
      id: 'competitive_advantages',
      type: 'checkboxes',
      label: 'Your Competitive Advantages',
      options: [
        { value: 'price', label: 'Lower price' },
        { value: 'quality', label: 'Higher quality/results' },
        { value: 'speed', label: 'Faster delivery/results' },
        { value: 'support', label: 'Better customer support' },
        { value: 'features', label: 'Unique features/approach' },
        { value: 'niche', label: 'Niche specialization' },
        { value: 'brand', label: 'Brand/reputation' },
        { value: 'community', label: 'Community/ecosystem' }
      ],
      description: 'What do you do better?',
      required: true
    },
    {
      id: 'pricing_comparison',
      type: 'select',
      label: 'Your Pricing vs Competitors',
      options: [
        { value: 'lower', label: 'Significantly lower (30%+ cheaper)' },
        { value: 'slightly-lower', label: 'Slightly lower (10-30% cheaper)' },
        { value: 'similar', label: 'Similar pricing' },
        { value: 'slightly-higher', label: 'Slightly higher (10-30% more)' },
        { value: 'premium', label: 'Premium (30%+ more expensive)' }
      ],
      required: true,
      description: 'How does your pricing compare?'
    },
    {
      id: 'audience_overlap',
      type: 'select',
      label: 'Target Audience Overlap',
      options: [
        { value: 'identical', label: 'Identical (same exact persona)' },
        { value: 'high', label: 'High overlap (80% similar)' },
        { value: 'moderate', label: 'Moderate overlap (50% similar)' },
        { value: 'low', label: 'Low overlap (different segments)' },
        { value: 'none', label: 'Different markets entirely' }
      ],
      required: true,
      description: 'How much direct competition?'
    },
    {
      id: 'defensive_moats',
      type: 'textarea',
      label: 'Your Defensibility & Moats',
      placeholder: 'What makes your position defensible? Network effects, brand loyalty, proprietary data, switching costs, etc.',
      rows: 2,
      description: 'What protects your advantage?',
      required: true
    }
  ],

  aiConfig: {
    promptTemplate: `You are a strategic business consultant. Analyze the competitive landscape and generate a concise Competitive Positioning Brief.

COMPETITIVE DATA:
- Main Competitors: {main_competitors}
- Your Positioning: {your_positioning}
- Your Advantages: {competitive_advantages}
- Pricing: {pricing_comparison}
- Audience Overlap: {audience_overlap}
- Defensibility: {defensive_moats}

## SWOT ANALYSIS
**Strengths:** Your top 3 competitive advantages
**Weaknesses:** Where competitors outperform
**Opportunities:** Market gaps from your research
**Threats:** Main competitive risks

## POSITIONING STRATEGY
**Core Positioning:** One clear statement differentiating you from competitors
**3 Messaging Angles:**
1. [Unique approach/mechanism]
2. [Niche specialization focus]
3. [Outcome/result focus]

## MARKET POSITION
Your position relative to competitors on: Price, Specialization, Quality dimensions

## DEFENSIBILITY & MOATS
**2-3 sustainable advantages** that are hard to copy, with moat strength (Strong/Medium/Weak)

## TOP 3 RECOMMENDATIONS
1. [Positioning refinement based on competitive gaps]
2. [Go-to-market strategy focused on where you win]
3. [Defensive strategy against main threats]

QUALITY STANDARDS:
- Be specific and actionable
- Reference the actual competitive data
- Focus on what makes you defensibly different
- Provide clear business justification`,

    temperature: 0.7,
    maxTokens: 3500,

    contextProvider: () => {
      try {
        const stored = localStorage.getItem('launchpilot-projectData')
        if (stored) {
          const data = JSON.parse(stored)
          return {
            app_name: data.productName || '',
            app_description: data.productDescription || '',
            target_audience: data.targetAudience || ''
          }
        }
      } catch (e) {
        console.error('[CompetitivePositioningBrief] Error loading context:', e)
      }
      return {}
    }
  },

  output: {
    enabled: true,
    exportFilename: 'competitive-positioning-brief',
    displayFormat: 'text',
    editable: true,
    deletable: true,
    exportable: true,
    copyable: true
  },

  help: {
    examples: [
      {
        scenario: 'SaaS PM tool: differentiate on simplicity',
        input: {
          main_competitors: 'Asana, Monday.com, ClickUp',
          your_positioning: 'Simplified PM for non-technical teams',
          competitive_advantages: ['ease of use', 'price'],
          pricing_comparison: 'lower',
          audience_overlap: 'high',
          defensive_moats: 'Community network, low-cost model'
        },
        output: 'SWOT shows simplicity vs feature bloat. Positioning: "PM without the learning curve". Messaging: ease-of-use, niche focus (non-tech), faster ROI. Moat: community effects + cost structure. Recommendations: emphasize simplicity in GTM, build community moat, defend against feature creep.'
      }
    ],

    commonMistakes: [
      'Feature parity trap - matching every competitor feature dilutes your focus. Own your differentiator and excel there.',
      'Price-only competition - easiest to copy. Build defensibility through quality, service, or specialization.',
      'Inconsistent positioning - positioning must be reflected across product, marketing, and sales.',
      'Ignoring market timing - best positioning fails if market not ready. Align with customer readiness and trends.',
      'Obsessing over competitors - analyze competitors, but lead with customer insights.',
      'Weak moats - defensibility must be based on hard-to-copy advantages (network effects, switching costs, brand).'
    ]
  }
}
