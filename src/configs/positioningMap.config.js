/**
 * Positioning & Messaging Map - Task 8.5
 */

export const positioningMapTask = {
  id: 'growth-5',
  name: 'Positioning & Messaging Map',
  description: 'Create a comprehensive positioning strategy and messaging framework for your brand',
  category: 'growth',
  tier: 'free',

  what: 'Generate a complete positioning and messaging framework including positioning statement, unique value proposition, messaging pillars, elevator pitch variations, tagline options, problem/solution framework, before/after messaging, audience-specific messaging, objection-proof copy, and brand voice guidelines.',

  why: 'Positioning is the foundation of all marketing. Weak positioning = generic messaging = blending in. Strong positioning = instant clarity = standing out. Get this right and every marketing campaign becomes easier and more effective. Get it wrong and you\'ll compete on price alone.',

  how: 'Answer questions about your product category, target market, transformation, competitors, unique mechanism, proof points, and audience sophistication. AI will generate a complete positioning map with messaging frameworks you can use across all channels.',

  form: [
    {
      id: 'product_category',
      type: 'text',
      label: 'Product Category',
      placeholder: 'e.g., Email marketing software, Business coaching, Productivity app',
      required: true,
      description: 'What category do customers put you in?'
    },
    {
      id: 'target_market',
      type: 'textarea',
      label: 'Target Market',
      placeholder: 'Be specific: industry, company size, role, psychographics',
      required: true,
      rows: 2,
      description: 'Who is this for? The more specific, the stronger the positioning'
    },
    {
      id: 'transformation',
      type: 'textarea',
      label: 'Transformation Delivered',
      placeholder: 'What change/outcome do customers experience? From [current state] to [desired state]',
      required: true,
      rows: 2,
      description: 'Focus on the end result, not features'
    },
    {
      id: 'competitors',
      type: 'textarea',
      label: 'Main Competitors/Alternatives',
      placeholder: 'Who else solves this problem? Include indirect competitors (status quo, DIY)',
      rows: 2,
      description: 'What are customers comparing you to?'
    },
    {
      id: 'unique_mechanism',
      type: 'textarea',
      label: 'Unique Mechanism/Approach',
      placeholder: 'What makes your method different? Your secret sauce, proprietary process, or unique angle',
      required: true,
      rows: 2,
      description: 'This is what makes you different, not just better'
    },
    {
      id: 'proof_points',
      type: 'checkboxes',
      label: 'Proof Points Available',
      options: [
        { value: 'results', label: 'Customer results/case studies' },
        { value: 'testimonials', label: 'Testimonials/reviews' },
        { value: 'credentials', label: 'Credentials/certifications' },
        { value: 'years', label: 'Years in business/experience' },
        { value: 'volume', label: 'Number of customers served' },
        { value: 'media', label: 'Media mentions/press' },
        { value: 'awards', label: 'Industry awards/recognition' }
      ],
      description: 'What evidence do you have that you deliver results?'
    },
    {
      id: 'audience_sophistication',
      type: 'select',
      label: 'Market Sophistication Level',
      options: [
        { value: 'level-1', label: 'Level 1: Unaware market (don\'t know problem exists)' },
        { value: 'level-2', label: 'Level 2: Problem-aware (know problem, not solutions)' },
        { value: 'level-3', label: 'Level 3: Solution-aware (familiar with category)' },
        { value: 'level-4', label: 'Level 4: Product-aware (comparing options)' },
        { value: 'level-5', label: 'Level 5: Most aware (saturated, skeptical market)' }
      ],
      required: true,
      description: 'How familiar is your market with solutions like yours?'
    },
    {
      id: 'pricing_tier',
      type: 'select',
      label: 'Pricing Tier',
      options: [
        { value: 'budget', label: 'Budget (Low-cost leader)' },
        { value: 'mid-market', label: 'Mid-market (Balance of value/price)' },
        { value: 'premium', label: 'Premium (High-touch, high-quality)' },
        { value: 'luxury', label: 'Luxury (Exclusive, top-tier)' }
      ],
      required: true,
      description: 'Where do you sit in the market pricing spectrum?'
    }
  ],

  ai: {
    template: `Create a comprehensive positioning and messaging framework based on:

Product Category: {product_category}
Target Market: {target_market}
Transformation: {transformation}
Competitors: {competitors}
Unique Mechanism: {unique_mechanism}
Proof Points: {proof_points}
Market Sophistication: {audience_sophistication}
Pricing Tier: {pricing_tier}

Generate a complete positioning and messaging map:

## 1. POSITIONING STATEMENT (Internal Framework)

**Template:**
"For [target market] who [need/pain point], [Product Name] is a [category] that [key benefit]. Unlike [competitors], we [unique differentiation]."

**Your Positioning Statement:**
"For [fill based on {target_market}] who [infer from {transformation}], [Product Name] is [{product_category}] that [primary benefit from {transformation}]. Unlike [{competitors}], we [{unique_mechanism}]."

**Why This Matters:**
This is your North Star - every piece of marketing should reinforce this positioning.

## 2. UNIQUE VALUE PROPOSITION (UVP)

**Customer-Facing UVP:**
"[Specific outcome] for [specific audience] in [timeframe] without [main pain point/obstacle]"

**Example Based on Your Input:**
"[Outcome from {transformation}] for [{target_market}] using [{unique_mechanism}]"

**UVP Variations for Different Channels:**

**Homepage Hero:**
"[Transformation outcome]. [Unique mechanism explanation]."

**Ad Copy (Short Version):**
"[Outcome] without [pain point]"

**Email Signature:**
"Helping [target market] [achieve transformation]"

## 3. MESSAGING PILLARS (3-4 Core Themes)

**Pillar 1: [Problem/Pain Agitation]**
- **Core Message:** "You're struggling with [specific pain from {transformation} before state]"
- **Supporting Points:**
  • [Pain point 1 - specific to {target_market}]
  • [Pain point 2]
  • [Why traditional solutions fail]
- **Use In:** Top of funnel, awareness content, cold outreach

**Pillar 2: [Unique Solution/Mechanism]**
- **Core Message:** "Unlike [standard approach], we use [{unique_mechanism}]"
- **Supporting Points:**
  • [How it works - simplified]
  • [Why it's better than alternatives]
  • [Who it's perfect for]
- **Use In:** Mid-funnel, consideration stage, sales pages

**Pillar 3: [Results/Transformation]**
- **Core Message:** "[{transformation} outcome] - proven results"
- **Supporting Points:**
  • [Specific result from {proof_points}]
  • [Social proof/testimonials]
  • [Case study highlights]
- **Use In:** Bottom of funnel, objection handling, retargeting

**Pillar 4 (Optional): [Process/Implementation]**
- **Core Message:** "Simple 3-step process to [outcome]"
- **Supporting Points:**
  • [Step 1: Setup/onboarding]
  • [Step 2: Implementation]
  • [Step 3: Results]
- **Use In:** How-it-works sections, demos, explainer content

## 4. ELEVATOR PITCH VARIATIONS

**30-Second Version (Networking):**
"I help [target market] [achieve transformation] using [{unique_mechanism}]. Most people try [common failed approach], but we've found [key insight]. We've helped [social proof number] achieve [specific result]."

**10-Second Version (Cold intro):**
"We're a [{product_category}] that helps [{target_market}] [{transformation outcome}]."

**2-Minute Version (Sales call opener):**
"[Start with pain]: Most [{target_market}] we talk to struggle with [pain point].

[Agitate]: They've tried [typical solutions from {competitors}] but find [why those fail].

[Unique mechanism]: We take a different approach using [{unique_mechanism}], which means [benefit].

[Proof]: We've worked with [X companies/people] like [name-drop if possible] to achieve [specific results].

[Call to action]: I'd love to show you how it works - do you have 15 minutes this week?"

## 5. TAGLINE OPTIONS

**Tagline Strategy for {audience_sophistication} market:**
[Guidance on whether to be bold/provocative or clear/descriptive based on sophistication level]

**Option 1 (Outcome-Focused):**
"[Transformation outcome] made simple"

**Option 2 (Audience-Specific):**
"[Product category] built for [{target_market}]"

**Option 3 (Unique Mechanism):**
"[Transformation] through [{unique_mechanism}]"

**Option 4 (Bold/Provocative) - for sophisticated markets:**
"[Contrarian statement about category]"

**Option 5 (Social Proof):**
"Trusted by [X] [{target_market}] to [outcome]"

**Recommended Tagline:**
[Choose based on market sophistication and competitive landscape]

## 6. PROBLEM/SOLUTION FRAMEWORK

**Problem Framework (Before State):**

**Surface Problem:**
"[Target market] think their problem is [surface issue]"

**Real Problem:**
"But the actual problem is [deeper root cause]"

**Why It Matters:**
"This is costing them [time/money/opportunity]"

**Why Previous Solutions Failed:**
"They've tried [{competitors} approach], but it doesn't work because [fundamental flaw]"

---

**Solution Framework (After State):**

**Your Solution:**
"[Product] solves this by [{unique_mechanism}]"

**How It's Different:**
- Traditional approach: [What others do]
- Our approach: [What you do differently]
- Why it works: [Underlying principle]

**What Success Looks Like:**
"After using [Product], customers go from [before state] to [{transformation} after state]"

## 7. BEFORE/AFTER MESSAGING

**Before Using [Product]:**
- [Pain point 1 - specific to {target_market}]
- [Pain point 2]
- [Pain point 3]
- [Emotional state: frustrated, overwhelmed, etc.]

**After Using [Product]:**
- [Transformation outcome 1]
- [Transformation outcome 2]
- [Transformation outcome 3]
- [Emotional state: confident, relieved, empowered]

**Visual Representation:**

BEFORE                    →    AFTER
[Struggling with X]       →    [Achieving Y]
[Manual/slow process]     →    [Automated/fast]
[Confused/guessing]       →    [Clear/confident]
[Losing money/time]       →    [ROI positive]

**Use In:** Sales pages, testimonials, case studies, comparison content

## 8. AUDIENCE-SPECIFIC MESSAGING

**For {target_market}, tailor messaging by sub-segment:**

**Segment 1: [Sub-segment A, e.g., "Beginners"]**
- **Pain point emphasis:** [What beginners struggle with most]
- **Message angle:** "No experience needed - we'll guide you step-by-step"
- **Proof needed:** "Others started just like you and achieved [result]"

**Segment 2: [Sub-segment B, e.g., "Experienced/Advanced"]**
- **Pain point emphasis:** [What experienced users need]
- **Message angle:** "Advanced features for [sophisticated need]"
- **Proof needed:** Expert testimonials, complex case studies

**Segment 3: [Sub-segment C, e.g., by industry/vertical]**
- **Pain point emphasis:** Industry-specific challenges
- **Message angle:** "Built specifically for [vertical]"
- **Proof needed:** Vertical-specific social proof

**Segment 4: [Sub-segment D, e.g., by company size]**
- **Pain point emphasis:** Scale-related issues
- **Message angle:** Scalability or simplicity depending on size
- **Proof needed:** Similar-sized companies

## 9. OBJECTION-PROOF MESSAGING

**Based on {pricing_tier} and {competitors}, address these objections in positioning:**

**Objection 1: "Too expensive"**
- **Positioning Response:** "[Product] is an investment that pays for itself when [ROI calculation]"
- **Message:** "Less expensive than [alternative cost like hiring, time waste, opportunity cost]"

**Objection 2: "How is this different from [competitor]?"**
- **Positioning Response:** "Unlike [{competitor}] which focuses on [their approach], we use [{unique_mechanism}] which means [customer benefit]"
- **Message:** "We're not [category], we're [new category you create]"

**Objection 3: "I can do this myself"**
- **Positioning Response:** "You could, but it would take [X time/effort]. We've spent [years/resources] perfecting [{unique_mechanism}] so you don't have to"
- **Message:** "Time vs money - what's your time worth?"

**Objection 4: "Will this work for me?"**
- **Positioning Response:** "[Social proof from {proof_points}] - we've helped [X] people like you achieve [result]"
- **Message:** Specific case studies matching their profile

**Objection 5: "Not the right time"**
- **Positioning Response:** "The cost of waiting is [quantify]"
- **Message:** "Every [day/month] you wait costs you [specific loss]"

## 10. BRAND VOICE GUIDELINES

**Based on {target_market} and {pricing_tier}, recommended brand voice:**

**Voice Characteristics:**
- **Tone:** [Professional/Casual/Friendly/Authoritative - pick 2-3]
- **Personality:** [Traits that resonate with {target_market}]
- **Formality Level:** [Scale 1-10, where 1=very casual, 10=very formal]

**Do's:**
- ✅ Use [type of language: industry jargon, plain English, technical terms]
- ✅ Address audience as [you/we/formal titles]
- ✅ Emphasize [values that matter to {target_market}]
- ✅ Include [humor/data/stories - what resonates]

**Don'ts:**
- ❌ Avoid [language that alienates {target_market}]
- ❌ Don't [common mistakes in {product_category} marketing]
- ❌ Never [red flags for your audience]

**Voice Examples:**

**Casual/Friendly (Good for consumer, lower-priced products):**
"Hey! We get it - [pain point] sucks. That's why we built [Product] to make [transformation] stupid simple."

**Professional/Authoritative (Good for B2B, higher-priced):**
"For [target market] seeking [outcome], [Product] delivers [transformation] through our proven [{unique_mechanism}] methodology."

**Conversational Expert (Balance - works for most):**
"Most [{target_market}] we work with struggle with [pain]. Here's what we've learned: [key insight]. That's why [Product] focuses on [{unique_mechanism}]."

## 11. POSITIONING IMPLEMENTATION CHECKLIST

Use this positioning across all channels consistently:

**Website:**
- [ ] Homepage headline reflects UVP
- [ ] About page includes positioning statement
- [ ] Messaging pillars present in navigation/content
- [ ] Before/after messaging in testimonials

**Sales Materials:**
- [ ] Pitch deck opens with positioning
- [ ] Sales one-pagers emphasize unique mechanism
- [ ] Case studies structured around transformation

**Marketing Campaigns:**
- [ ] Ad copy uses audience-specific messaging
- [ ] Email sequences reinforce messaging pillars
- [ ] Content calendar aligns with positioning themes

**Product/Service Delivery:**
- [ ] Onboarding reinforces why you're different
- [ ] Customer success touches on transformation journey
- [ ] Product updates framed through positioning lens

**Team Alignment:**
- [ ] Sales team can recite elevator pitch
- [ ] Support team understands unique mechanism
- [ ] Everyone can articulate "why we're different"

## 12. POSITIONING EVOLUTION FRAMEWORK

**When to Revisit Positioning:**
- [ ] Every 12-18 months (market shifts)
- [ ] After major product changes
- [ ] When entering new markets
- [ ] If messaging isn't resonating (low conversion)

**Market Sophistication Evolution:**
If you're at {audience_sophistication}, expect to evolve:
- **Next 12 months:** [How sophistication will change]
- **Messaging shift needed:** [How to adapt positioning]

**Competitive Response:**
As competitors copy your positioning:
- **Defensive:** Double down on [{unique_mechanism}] proof
- **Offensive:** Evolve to [next level of differentiation]

Format as actionable messaging frameworks with specific copy examples.`,

    temperature: 0.7,
    maxTokens: 3500,

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
    exportFilename: 'positioning-messaging-map',
    displayFormat: 'text',
    editable: true,
    deletable: true,
    exportable: true,
    copyable: true
  }
}
