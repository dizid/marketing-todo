/**
 * Funnel Blueprint Generator - Task 7.1
 */

export const funnelBlueprintTask = {
  id: 'sales-1',
  name: 'Funnel Blueprint Generator',
  description: 'Create a complete sales funnel plan tailored to your product, audience, and pricing model',
  category: 'sales',
  tier: 'free',

  what: 'Generate a full sales funnel framework from Awareness to Retention. Get funnel components including awareness ads, lead magnets, nurture sequences, offer pitches, retargeting plans, and upsells. Includes psychology notes on urgency, scarcity, and objection handling.',

  why: 'Most businesses lose 90% of potential customers due to lack of a structured funnel. A well-designed funnel turns cold traffic into paying customers through systematic nurturing. Without a funnel blueprint, you\'re relying on luck instead of strategy.',

  how: 'Answer questions about your product, target audience, main customer problem, pricing, and sales goal. AI will generate a complete funnel framework with specific components for each stage, visual funnel map, recommended KPIs, and psychology principles to maximize conversions.',

  form: [
    {
      id: 'product_description',
      type: 'textarea',
      label: 'Product/Service Description',
      placeholder: 'Describe what you sell and how it helps customers...',
      description: 'Be specific about what you offer and the transformation it provides',
      required: true,
      rows: 3
    },
    {
      id: 'target_audience',
      type: 'textarea',
      label: 'Target Audience',
      placeholder: 'Who is this product for? (demographics, psychographics, pain points)',
      description: 'The more specific, the better the funnel recommendations',
      required: true,
      rows: 2
    },
    {
      id: 'main_problem',
      type: 'textarea',
      label: 'Main Customer Problem',
      placeholder: 'What specific problem does your product solve?',
      description: 'Focus on the #1 pain point your product addresses',
      required: true,
      rows: 2
    },
    {
      id: 'price_point',
      type: 'number',
      label: 'Price Point (USD)',
      placeholder: '97',
      prefix: '$',
      min: 0,
      required: true,
      description: 'Your main product price (we\'ll suggest appropriate funnel complexity)'
    },
    {
      id: 'offer_structure',
      type: 'select',
      label: 'Offer Structure',
      options: [
        { value: 'one-time', label: 'One-time purchase' },
        { value: 'subscription', label: 'Subscription/Recurring' },
        { value: 'payment-plan', label: 'Payment plan' },
        { value: 'tiered', label: 'Tiered pricing (Good/Better/Best)' },
        { value: 'freemium', label: 'Freemium model' }
      ],
      required: true
    },
    {
      id: 'sales_goal',
      type: 'select',
      label: 'Primary Sales Goal',
      options: [
        { value: 'awareness', label: 'Awareness (Get known in the market)' },
        { value: 'leads', label: 'Lead Generation (Build email list)' },
        { value: 'conversions', label: 'Direct Conversions (Drive sales now)' },
        { value: 'ascension', label: 'Customer Ascension (Upsell existing customers)' },
        { value: 'retention', label: 'Retention (Keep customers longer)' }
      ],
      required: true
    },
    {
      id: 'existing_assets',
      type: 'textarea',
      label: 'Existing Marketing Assets (Optional)',
      placeholder: 'Email list, social following, content library, past customers, etc.',
      rows: 2,
      description: 'What resources do you already have that can feed the funnel?'
    }
  ],

  ai: {
    template: `Create a complete sales funnel blueprint based on:

Product: {product_description}
Target Audience: {target_audience}
Main Problem Solved: {main_problem}
Price Point: {price_point}
Offer Structure: {offer_structure}
Primary Goal: {sales_goal}
Existing Assets: {existing_assets}

Generate a comprehensive funnel blueprint with the following structure:

## 1. FUNNEL OVERVIEW
- Funnel type recommendation (based on price point and offer)
- Estimated timeline from cold traffic to customer
- Success metrics to track

## 2. STAGE 1: AWARENESS (Top of Funnel)
**Goal:** Make target audience aware of the problem and your solution

**Tactics:**
- 3-5 awareness ad angles (headlines + hooks)
- Content topics that attract your audience
- Platform recommendations (where to run ads)
- Budget allocation suggestion
- Expected metrics (CPM, Reach, Engagement)

**Psychology Notes:** Use pattern interrupts, curiosity, problem agitation

## 3. STAGE 2: INTEREST (Lead Capture)
**Goal:** Convert cold traffic into leads

**Lead Magnet Ideas:**
- 3 lead magnet concepts (aligned with main problem)
- Opt-in page structure
- Thank-you page sequence
- Immediate value delivery

**Tactics:**
- Landing page framework
- CTA copy variations
- Trust elements to include
- Expected conversion rate benchmarks

**Psychology Notes:** Reciprocity, instant gratification, low commitment

## 4. STAGE 3: CONSIDERATION (Nurture Sequence)
**Goal:** Build trust and demonstrate value

**Email Sequence Structure:**
- Email 1: Welcome + deliver lead magnet
- Email 2: Story/connection (build relationship)
- Email 3: Education (demonstrate expertise)
- Email 4: Social proof (show results)
- Email 5: Soft pitch (introduce offer)
- Emails 6-7: Overcome objections
- Email 8: Hard pitch with urgency

**Content Nurture:**
- Educational content themes
- Case studies to share
- Common objections to address

**Psychology Notes:** Authority, social proof, commitment/consistency

## 5. STAGE 4: ACTION (Conversion)
**Goal:** Convert leads into paying customers

**Offer Presentation:**
- Sales page structure
- Key elements: Headline, benefits, proof, guarantee, CTA
- Upsell/downsell strategy
- Pricing psychology tactics
- Urgency/scarcity mechanisms

**Conversion Optimizations:**
- Risk reversal strategies
- Payment options
- Checkout optimization tips

**Psychology Notes:** Scarcity, urgency, loss aversion, anchoring

## 6. STAGE 5: RETENTION (Maximize LTV)
**Goal:** Keep customers, increase lifetime value

**Retention Tactics:**
- Onboarding sequence (first 30 days)
- Engagement touchpoints
- Upsell/cross-sell opportunities
- Referral program framework
- Reactivation campaigns for churned customers

**Ascension Ladder:**
- Entry product → Core product → Premium offer
- Suggested pricing and positioning for each tier

**Psychology Notes:** Sunk cost, endowment effect, community belonging

## 7. STAGE 6: RETARGETING (Recover Lost Opportunities)
**Goal:** Bring back non-converters

**Retargeting Segments:**
- Visited landing page, didn't opt in
- Opted in, didn't open emails
- Opened emails, didn't click
- Clicked offer, didn't buy
- Added to cart, abandoned checkout

**Retargeting Campaigns:**
- Ad creative angles for each segment
- Email re-engagement sequences
- Offer modifications (discounts, bonuses, payment plans)

**Psychology Notes:** FOMO, social proof, new angles/hooks

## 8. RECOMMENDED KPIS BY STAGE
- Awareness: CPM, Reach, CTR
- Interest: Opt-in rate, Cost per lead
- Consideration: Email open rate, click rate, engagement
- Action: Conversion rate, CPA, ROAS
- Retention: Churn rate, LTV, repeat purchase rate
- Retargeting: Re-engagement rate, recovery conversion rate

## 9. FUNNEL PSYCHOLOGY PRINCIPLES
- **Urgency:** How to create without being sleazy
- **Scarcity:** Real vs artificial scarcity tactics
- **Social Proof:** Types of proof for each stage
- **Objections:** Top 5 objections and where to address them
- **Risk Reversal:** Guarantee structures that boost conversions

## 10. 90-DAY IMPLEMENTATION ROADMAP
- Month 1: Build awareness assets + lead magnet
- Month 2: Create nurture sequence + sales page
- Month 3: Launch retention + retargeting campaigns

Format in clear markdown with specific, actionable recommendations.`,

    temperature: 0.8,
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
    exportFilename: 'sales-funnel-blueprint',
    displayFormat: 'text',
    editable: true,
    deletable: true,
    exportable: true,
    copyable: true
  }
}
