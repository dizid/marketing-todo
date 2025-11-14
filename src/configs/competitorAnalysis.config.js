/**
 * Competitor Intelligence Analyzer - Task 8.3
 */

export const competitorAnalysisTask = {
  id: 'growth-3',
  name: 'Competitor Intelligence Analyzer',
  description: 'Analyze competitors and identify opportunities to differentiate and win market share',
  category: 'growth',
  tier: 'free',

  what: 'Receive a comprehensive competitive analysis including SWOT breakdown, messaging differentiation strategies, pricing comparison framework, feature gap analysis, market positioning map, and defensive moat-building tactics. Turn competitive intelligence into actionable growth opportunities.',

  why: 'Ignoring competitors = leaving money on the table. But obsessing over them = copying instead of innovating. Strategic competitive analysis reveals white space opportunities, defensive vulnerabilities, and offensive growth tactics that help you win without competing on price.',

  how: 'List your main competitors, your current positioning, competitive advantages, and intelligence sources. AI will analyze the competitive landscape and deliver differentiation strategies, positioning tactics, and a monitoring system to stay ahead.',

  form: [
    {
      id: 'main_competitors',
      type: 'textarea',
      label: 'Main Competitors (Top 3-5)',
      placeholder: 'List company names and briefly what makes them competitive',
      required: true,
      rows: 3,
      description: 'Focus on direct competitors, not aspirational ones'
    },
    {
      id: 'your_positioning',
      type: 'textarea',
      label: 'Your Current Positioning',
      placeholder: 'How do you currently position yourself in the market?',
      required: true,
      rows: 2,
      description: 'Your unique angle or value proposition'
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
        { value: 'unsure', label: 'Not sure (help me identify)' }
      ],
      description: 'What do you do better than competitors?'
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
      required: true
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
      description: 'How much do you compete for the same customers?'
    },
    {
      id: 'differentiation_gaps',
      type: 'textarea',
      label: 'Areas Where You Want to Differentiate',
      placeholder: 'What gaps or opportunities do you see in the market?',
      rows: 2,
      description: 'Where do competitors fall short?'
    },
    {
      id: 'intel_sources',
      type: 'checkboxes',
      label: 'Available Intelligence Sources',
      options: [
        { value: 'website', label: 'Competitor websites' },
        { value: 'reviews', label: 'Customer reviews (G2, Trustpilot, etc.)' },
        { value: 'social', label: 'Social media presence' },
        { value: 'ads', label: 'Their advertising' },
        { value: 'content', label: 'Content marketing/SEO' },
        { value: 'customers', label: 'Feedback from their customers' },
        { value: 'employees', label: 'Employee reviews (Glassdoor)' }
      ],
      description: 'What data do you have access to?'
    }
  ],

  ai: {
    template: `Analyze competitive landscape based on:

Main Competitors: {main_competitors}
Your Positioning: {your_positioning}
Competitive Advantages: {competitive_advantages}
Pricing Comparison: {pricing_comparison}
Audience Overlap: {audience_overlap}
Differentiation Gaps: {differentiation_gaps}
Intel Sources: {intel_sources}

Generate comprehensive competitive intelligence:

## 1. SWOT ANALYSIS

**STRENGTHS (What You Do Better):**
- [Strength 1]: [How to leverage this in messaging]
- [Strength 2]: [How to amplify this advantage]
- [Strength 3]: [Where to emphasize this]

**WEAKNESSES (Where Competitors Have Edge):**
- [Weakness 1]: [How to neutralize or reframe]
- [Weakness 2]: [Mitigation strategy]
- [Weakness 3]: [When this matters and when it doesn't]

**OPPORTUNITIES (Market Gaps):**
- [Opportunity 1]: [Untapped segment or need]
- [Opportunity 2]: [Competitor vulnerability to exploit]
- [Opportunity 3]: [Emerging trend to capitalize on]

**THREATS (Competitive Risks):**
- [Threat 1]: [How to defend against this]
- [Threat 2]: [Monitoring system needed]
- [Threat 3]: [Contingency plan]

## 2. MESSAGING DIFFERENTIATION STRATEGIES

**Your Core Differentiation:**
Based on {your_positioning} and {competitive_advantages}, position yourself as:
"[Differentiated positioning statement]"

**Messaging Angles to Emphasize:**

**Angle 1: [Unique Mechanism]**
- Competitors say: "[How they position themselves]"
- You say: "[Your differentiated message]"
- Why it works: [Psychological reason this resonates]

**Angle 2: [Target Audience Specificity]**
- Competitors target: "[Broad audience]"
- You target: "[Specific niche]"
- Message: "Unlike [generic solutions], we specifically help [niche] with [unique problem]"

**Angle 3: [Outcome Focus]**
- Competitors focus on: "[Features/process]"
- You focus on: "[Specific outcomes/results]"
- Message: "[Outcome-driven value proposition]"

**Comparison Messaging (Without Bashing):**
"Most [solutions] focus on [competitor approach]. We take a different route by [your approach], which means [customer benefit]."

## 3. PRICING STRATEGY COMPARISON

**Competitor Pricing Models:**
- Competitor A: [Price + model]
- Competitor B: [Price + model]
- Competitor C: [Price + model]
- Your Pricing: [Price + model]

**Your Pricing Position: {pricing_comparison}**

**If Lower Price:**
- **Don't compete on price alone** (race to bottom)
- **Instead:** "Accessible pricing without compromising [quality/results]"
- **Frame:** "Get [same results] for [X% less]"

**If Similar Price:**
- **Differentiate on value:** "Same investment, but you also get [unique advantage]"
- **Offer structure:** Make payment/package more attractive

**If Premium Price:**
- **Justify premium:** "We cost more because [specific reason that benefits customer]"
- **Value stack:** Show ROI justification
- **Positioning:** "Investment, not expense"

**Pricing Tactics:**
- Competitor has lower price → Emphasize value, not price
- Competitor has higher price → Position as "smart alternative"
- Competitor has complex pricing → Make yours transparent and simple

## 4. FEATURE GAP ANALYSIS

**Feature Parity Table:**

| Feature/Capability | You | Comp A | Comp B | Comp C | Opportunity |
|-------------------|-----|--------|--------|--------|-------------|
| [Core Feature 1] | ✅ | ✅ | ✅ | ✅ | Parity |
| [Feature 2] | ✅ | ❌ | ✅ | ❌ | **Advantage** |
| [Feature 3] | ❌ | ✅ | ✅ | ✅ | Gap to fill |
| [Feature 4] | ✅ | ❌ | ❌ | ❌ | **Major advantage** |

**Your Unique Features to Emphasize:**
1. [Feature] - Competitors don't have this
2. [Feature] - You do this better
3. [Feature] - Your proprietary advantage

**Features You're Missing:**
1. [Feature] - Decide: Build it, partner for it, or position around not needing it
2. [Feature] - Is this a dealbreaker or nice-to-have?

**White Space Opportunities:**
Features NO ONE offers yet that market wants:
- [Opportunity 1]: [Unmet need in market]
- [Opportunity 2]: [Complaint in competitor reviews]

## 5. MARKET POSITIONING MAP

**Positioning Matrix:**

[Create 2×2 grid based on key differentiators]

**Example:**

                High Price
                    |
    Complex    [Comp A]    Simple
    -------- YOU HERE --------
              [Comp B]
               [Comp C]
                    |
                Low Price

**Your Position:**
- X-Axis: [First differentiator] (e.g., Price, Complexity, Speed)
- Y-Axis: [Second differentiator] (e.g., Features, Support, Niche)
- Your Quadrant: [Where you sit and why this is strategic]

**Positioning Strategy:**
- Avoid: [Crowded quadrant where competition is fierce]
- Occupy: [Underserved quadrant with your advantages]

## 6. COMPETITIVE ADVANTAGE FRAMEWORK

**Sustainable Advantages (Hard to Copy):**
1. **[Advantage Type]:** [What it is and why it's defensible]
   - Moat depth: Strong/Medium/Weak
   - How to strengthen: [Tactic]

2. **[Advantage Type]:** [Description]
   - Defensibility: [Why competitors can't easily replicate]
   - Investment needed: [What it takes to maintain edge]

**Temporary Advantages (Easily Copied):**
1. [Advantage]: Use as [marketing message] now, expect competitors to copy in [timeframe]
2. [Advantage]: Leverage for [period] then pivot to [next advantage]

**Building Your Moat:**
- **Network Effects:** [How to create lock-in]
- **Brand Loyalty:** [Community, content, trust-building]
- **Proprietary Data/Method:** [Your unique IP]
- **Economies of Scale:** [Cost advantages as you grow]

## 7. DEFENSIVE MOAT BUILDING

**Protect Against Competitive Threats:**

**Threat: Price Wars**
- Defense: Lock in annual contracts, add switching costs, emphasize value
- Tactic: "[Guarantee] that shows confidence in results"

**Threat: Feature Copying**
- Defense: Innovation pipeline - always 2 features ahead
- Tactic: Beta community gets early access (builds loyalty)

**Threat: Market Saturation**
- Defense: Niche down, go deeper with specific segment
- Tactic: "The [solution] built specifically for [niche]"

**Threat: New Entrant with Funding**
- Defense: Community moat, brand trust, customer relationships
- Tactic: Double down on customer success and retention

**Customer Retention Tactics:**
- Make switching painful (but ethically): Integrations, data, customization
- Over-deliver on onboarding (first 90 days critical)
- Build community (harder to leave people than products)
- Annual pricing (reduces churn decision points)

## 8. OFFENSIVE GROWTH OPPORTUNITIES

**Where to Attack Competitors:**

**Opportunity 1: Target Their Unhappy Customers**
- Monitor: Review sites, social mentions, support forums
- Message: "Frustrated with [competitor weakness]? We built [solution] specifically to solve this."
- Channel: Comparison pages, retargeting ads

**Opportunity 2: Underserved Segments**
- Segment they ignore: [Specific niche]
- Your approach: [Specialized solution]
- Go-to-market: [Niche channels they don't use]

**Opportunity 3: Superior Content/Education**
- Gap: [Topic competitors don't cover well]
- Your content: [Ultimate guide/tool/resource]
- SEO play: Rank for "[competitor] alternative" and "[problem] solution"

**Opportunity 4: Faster Innovation**
- Release cadence: Ship [frequency] vs their [slower frequency]
- Message: "We listen to customers and ship fast"
- Community-driven roadmap

**Comparison Pages:**
Create "[Your Brand] vs [Competitor]" pages:
- Honest feature comparison
- Use cases where you win
- Testimonials from switchers
- **Don't bash** - elevate your strengths

## 9. MONITORING SYSTEM

**What to Track:**

**Weekly Monitoring:**
- [ ] Competitor pricing changes
- [ ] New feature announcements
- [ ] Social media messaging shifts
- [ ] Ad creative variations

**Monthly Monitoring:**
- [ ] Review site sentiment trends
- [ ] Content/SEO performance
- [ ] Partnership announcements
- [ ] Hiring patterns (Glassdoor, LinkedIn)

**Quarterly Review:**
- [ ] Full SWOT update
- [ ] Market share estimates
- [ ] Win/loss analysis (why customers chose you vs them)
- [ ] Positioning refinement

**Tools to Use:**
- **Pricing tracking:** Visualping, Kompyte
- **SEO/Content:** Ahrefs, SEMrush (see their rankings)
- **Ads:** Facebook Ad Library, Google Ads Transparency
- **Reviews:** G2, Capterra, Trustpilot alerts
- **Social listening:** Mention, Brand24
- **Website changes:** Visualping

**Set Alerts For:**
- Brand mentions
- "[Competitor] vs [You]" searches
- Review site posts mentioning competitors
- Industry news with competitors

## 10. QUARTERLY COMPETITIVE REVIEW TEMPLATE

**Review Date:** [Quarter/Year]

**Competitive Landscape Changes:**
- New entrants: [Companies]
- Exits/acquisitions: [News]
- Major pivots: [Competitor changes]

**Our Position Updates:**
- Market share change: [Estimate]
- Win rate vs [Competitor]: [%]
- Common win reasons: [Why we won]
- Common loss reasons: [Why we lost]

**Strategic Adjustments Needed:**
1. [Change to messaging/positioning]
2. [Feature priority shift]
3. [Pricing modification]
4. [New market segment to target]

**Action Items for Next Quarter:**
- [ ] [Specific competitive response]
- [ ] [Differentiation enhancement]
- [ ] [Moat-building initiative]

Format with specific, actionable insights and monitoring tactics.`,

    temperature: 0.7,
    maxTokens: 3000,

    contextProvider: () => {
      try {
        const stored = localStorage.getItem('marketing-app-data')
        if (stored) {
          const data = JSON.parse(stored)
          return {
            app_description: data.appDescription || '',
            company_name: data.companyName || ''
          }
        }
      } catch (e) {
        console.error('Error loading context:', e)
      }
      return {}
    }
  },

  output: {
    enabled: true,
    exportFilename: 'competitor-analysis',
    displayFormat: 'text',
    editable: true,
    deletable: true,
    exportable: true,
    copyable: true
  }
}
