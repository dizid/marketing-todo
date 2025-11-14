/**
 * High-Converting Offer Builder - Task 7.2
 */

export const offerBuilderTask = {
  id: 'sales-2',
  name: 'High-Converting Offer Builder',
  description: 'Build a compelling offer including bonuses, guarantee, positioning, and pricing psychology',
  category: 'sales',
  tier: 'free',

  what: 'Create a complete offer structure with core product positioning, value stack with bonuses, compelling guarantees, price anchoring strategies, and persuasive value propositions. Get multiple offer naming options and psychological framing.',

  why: 'Your offer is the difference between "meh" and "take my money." Most entrepreneurs under-charge and under-deliver on perceived value. A well-structured offer with bonuses, guarantees, and strategic pricing can 3-5x conversions without changing the product.',

  how: 'Describe your core product, desired customer outcome, existing assets you can bundle, pricing preferences, and guarantee level. AI will generate a complete offer package with value stacking, bonus recommendations, risk reversal strategies, and pricing psychology tactics.',

  form: [
    {
      id: 'core_product',
      type: 'textarea',
      label: 'Core Product Description',
      placeholder: 'What is the main thing customers are buying?',
      description: 'Be specific about deliverables, format, and transformation',
      required: true,
      rows: 3
    },
    {
      id: 'customer_outcome',
      type: 'textarea',
      label: 'Desired Customer Outcome',
      placeholder: 'What specific result will customers achieve?',
      description: 'Focus on the end state, not features (e.g., "lose 20 lbs" not "meal plans")',
      required: true,
      rows: 2
    },
    {
      id: 'existing_assets',
      type: 'checkboxes',
      label: 'Assets You Can Bundle as Bonuses',
      options: [
        { value: 'course', label: 'Online course or training modules' },
        { value: 'templates', label: 'Templates, worksheets, checklists' },
        { value: 'community', label: 'Private community access' },
        { value: 'calls', label: 'Group calls or coaching sessions' },
        { value: 'tools', label: 'Software tools or calculators' },
        { value: 'content', label: 'Guides, ebooks, or reports' },
        { value: 'other', label: 'Other assets' }
      ],
      description: 'What can you add to increase perceived value?'
    },
    {
      id: 'target_price',
      type: 'number',
      label: 'Target Price Point (USD)',
      placeholder: '297',
      prefix: '$',
      min: 0,
      required: true
    },
    {
      id: 'pricing_flexibility',
      type: 'select',
      label: 'Pricing Flexibility',
      options: [
        { value: 'fixed', label: 'Fixed price only' },
        { value: 'tiered', label: 'Tiered options (Good/Better/Best)' },
        { value: 'payment-plan', label: 'Payment plan available' },
        { value: 'discount', label: 'Launch discount then increase' },
        { value: 'flexible', label: 'Flexible - suggest best strategy' }
      ],
      required: true
    },
    {
      id: 'guarantee_level',
      type: 'select',
      label: 'Risk Reversal Level',
      options: [
        { value: 'none', label: 'No guarantee (not recommended)' },
        { value: 'basic', label: 'Basic: 30-day money-back' },
        { value: 'strong', label: 'Strong: 60-90 day + keep bonuses' },
        { value: 'extreme', label: 'Extreme: Results guarantee or refund' },
        { value: 'suggest', label: 'Suggest best for my offer' }
      ],
      required: true
    },
    {
      id: 'target_audience_level',
      type: 'select',
      label: 'Target Audience Expertise Level',
      options: [
        { value: 'beginner', label: 'Beginners (complete newbies)' },
        { value: 'intermediate', label: 'Intermediate (some experience)' },
        { value: 'advanced', label: 'Advanced (experts looking to level up)' },
        { value: 'mixed', label: 'Mixed levels' }
      ],
      required: true
    },
    {
      id: 'competitors_price',
      type: 'number',
      label: 'Typical Competitor Price (Optional)',
      placeholder: '497',
      prefix: '$',
      min: 0,
      description: 'Helps with price anchoring strategy'
    }
  ],

  ai: {
    template: `Create a high-converting offer structure based on:

Core Product: {core_product}
Desired Outcome: {customer_outcome}
Available Assets: {existing_assets}
Target Price: {target_price}
Pricing Model: {pricing_flexibility}
Guarantee Level: {guarantee_level}
Audience Level: {target_audience_level}
Competitor Price: {competitors_price}

Generate a complete offer package with the following components:

## 1. CORE OFFER POSITIONING

**Product Name Options:**
- 3-5 compelling product names that convey transformation
- Avoid generic names; use outcome-focused naming

**Positioning Statement:**
"[Product Name] is a [category] that helps [target audience] achieve [specific outcome] in [timeframe] without [common pain point]."

**Elevator Pitch:**
30-second version for ads/social media

## 2. VALUE PROPOSITION STATEMENTS

**Primary Value Prop:**
One sentence that captures the core transformation

**Supporting Value Props:**
- Benefit 1: [Specific benefit + proof point]
- Benefit 2: [Specific benefit + proof point]
- Benefit 3: [Specific benefit + proof point]

**Differentiation:**
What makes this different/better than alternatives?

## 3. OFFER COMPONENTS & VALUE STACK

**Core Product:** ${target_price}
[Describe what's included in the main offer]

**Bonus 1:** [Value: $XXX]
[Bonus name and description - complement the core product]

**Bonus 2:** [Value: $XXX]
[Another complementary asset]

**Bonus 3:** [Value: $XXX]
[Urgency-driven bonus - early bird only]

**Total Value:** $[Add up all values]
**Your Investment Today:** ${target_price}
**Savings:** $[Total - Price]

## 4. PRICING PSYCHOLOGY STRATEGY

**Price Anchoring:**
- Show total value ($X,XXX) vs actual price (${target_price})
- Compare to cost of NOT solving the problem
- Reference competitor pricing if higher

**Framing Tactics:**
- Daily cost breakdown: "Just ${target_price}/365} per day"
- ROI framing: "This pays for itself when you [specific result]"
- Comparison: "Less than [relatable expense] but delivers [outcome]"

**Tiered Pricing (if applicable):**
- Tier 1 (Good): [Price] - Core product only
- Tier 2 (Better): [Price] - Core + some bonuses [MOST POPULAR]
- Tier 3 (Best): [Price] - Everything + premium bonuses

## 5. RISK REVERSAL & GUARANTEE

**Guarantee Structure:**
[Based on guarantee_level, create specific guarantee copy]

**Guarantee Copy Examples:**
- "If you don't [achieve result] within [timeframe], we'll refund every penny + you keep all bonuses"
- "We're so confident you'll [outcome] that we'll give you [X days] to try it risk-free"

**Why This Works:**
Removes buyer hesitation by transferring risk from buyer to seller

## 6. URGENCY & SCARCITY MECHANISMS

**Real Scarcity Options:**
- Limited enrollment (max [X] students per cohort)
- Closing enrollment on [date]
- Founding member pricing (ends [date])

**Urgency Tactics:**
- Early bird pricing expires [date/time]
- Bonuses removed after [X] purchases
- Price increases after launch period

**Ethical Implementation:**
Never fake scarcity - use real deadlines and limits

## 7. OBJECTION HANDLING IN OFFER

**Common Objections to Address:**

"Is this worth the price?"
→ Show value stack, compare to alternatives, demonstrate ROI

"Will this work for me?"
→ Include case studies, testimonials, guarantee

"I don't have time"
→ Emphasize efficiency, quick wins, done-for-you elements

"I can figure this out myself"
→ Position time vs money, speed to results

## 8. SALES PAGE STRUCTURE

**Above the Fold:**
- Headline: [Outcome + Timeframe + Without Pain]
- Subheadline: [Expand on promise]
- CTA: [Action-oriented button]

**Body Flow:**
1. Problem agitation
2. Solution introduction
3. How it works (3-step process)
4. Features → Benefits
5. Social proof
6. Value stack
7. Guarantee
8. FAQ
9. Final CTA

**CTA Button Copy Options:**
- "Yes, I Want [Outcome]!"
- "Get Instant Access Now"
- "Claim My [Bonus] Before It's Gone"
- "Start [Achieving Result] Today"

## 9. PSYCHOLOGICAL TRIGGERS

**Authority:** Include credentials, media mentions, years of experience
**Social Proof:** Number of customers, testimonials, case studies
**Reciprocity:** Free value before the ask (lead magnet, content)
**Commitment:** Small yes → big yes (micro-commitments)
**Liking:** Story, personality, shared values
**Scarcity:** Limited time, quantity, or bonuses

## 10. MESSAGING ANGLES TO TEST

**Angle 1: Transformation Focus**
"From [current pain state] to [desired outcome state] in [timeframe]"

**Angle 2: Speed/Efficiency**
"The fastest way to [outcome] without [common obstacle]"

**Angle 3: Simplification**
"The simple [X]-step system to [result]"

**Angle 4: Exclusive Access**
"Join [X] others who are already [achieving result]"

**Angle 5: Problem Agitation**
"Still struggling with [pain]? Here's why and how to fix it"

## 11. OFFER OPTIMIZATION CHECKLIST

- [ ] Clear, specific outcome promised
- [ ] Value stack exceeds price by 5-10x
- [ ] Strong guarantee removes risk
- [ ] Bonuses complement core offer
- [ ] Urgency/scarcity is real and ethical
- [ ] Social proof is included
- [ ] Multiple payment options (if price > $200)
- [ ] CTA is action-oriented and benefit-driven
- [ ] FAQ addresses top 5 objections
- [ ] Mobile-optimized sales page

Format in clear, actionable markdown with specific copy suggestions.`,

    temperature: 0.8,
    maxTokens: 2500,

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
    exportFilename: 'offer-structure',
    displayFormat: 'text',
    editable: true,
    deletable: true,
    exportable: true,
    copyable: true
  }
}
