/**
 * Sales Page Audit & Optimizer - Task 7.5
 */

export const salesPageAuditTask = {
  id: 'sales-5',
  name: 'Sales Page Audit & Optimizer',
  description: 'Get a detailed audit of your sales page with specific fixes to boost conversions',
  category: 'sales',
  tier: 'free',

  // Phase 6: Field inheritance mappings (form field → canonical field)
  fieldMappings: {
    // Fields without canonical mapping (task-specific, requires existing page)
    'page_url': null,
    'current_conversion_rate': null,
    'traffic_sources': null,
    'main_objections': null
  },

  what: 'Receive a comprehensive audit of your sales page or landing page. Get a conversion scorecard, headline optimization suggestions, CTA improvements, trust element recommendations, mobile UX fixes, and heatmap interpretation guidance.',

  why: 'Most sales pages convert at 1-3%. Small changes can double or triple conversions. But most entrepreneurs don\'t know what to fix first. A systematic audit identifies the highest-impact improvements and prioritizes them.',

  how: 'Provide your sales page URL (or describe key sections), current conversion rate, traffic sources, and main objections. AI will analyze your page structure against proven conversion principles and deliver a prioritized fix list with before/after copy examples.',

  form: [
    {
      id: 'page_url',
      type: 'text',
      label: 'Sales Page URL (Optional)',
      placeholder: 'https://yoursite.com/offer',
      description: 'If you can\'t share URL, describe page structure instead'
    },
    {
      id: 'current_conversion_rate',
      type: 'number',
      label: 'Current Conversion Rate (%)',
      placeholder: '2.5',
      suffix: '%',
      min: 0,
      max: 100,
      step: 0.1,
      description: 'What percentage of visitors are buying? (If unknown, leave blank)'
    },
    {
      id: 'traffic_sources',
      type: 'checkboxes',
      label: 'Main Traffic Sources',
      options: [
        { value: 'paid-ads', label: 'Paid ads (Google, Meta, etc.)' },
        { value: 'organic', label: 'Organic search (SEO)' },
        { value: 'social', label: 'Social media' },
        { value: 'email', label: 'Email list' },
        { value: 'affiliates', label: 'Affiliates/partners' },
        { value: 'direct', label: 'Direct traffic' }
      ],
      description: 'Different traffic sources have different optimization needs'
    },
    {
      id: 'price_point',
      type: 'number',
      label: 'Product Price (USD)',
      placeholder: '297',
      prefix: '$',
      min: 0,
      required: true,
      description: 'Higher prices require more trust elements and objection handling'
    },
    {
      id: 'main_objections',
      type: 'textarea',
      label: 'Main Customer Objections',
      placeholder: 'What hesitations or concerns do prospects have?',
      rows: 2,
      description: 'Common objections should be addressed on the page'
    },
    {
      id: 'page_sections',
      type: 'checkboxes',
      label: 'Current Page Sections',
      options: [
        { value: 'headline', label: 'Headline/Hero section' },
        { value: 'benefits', label: 'Benefits/Features list' },
        { value: 'social-proof', label: 'Testimonials/Reviews' },
        { value: 'how-it-works', label: 'How it works/Process' },
        { value: 'pricing', label: 'Pricing/Offer details' },
        { value: 'guarantee', label: 'Guarantee/Risk reversal' },
        { value: 'faq', label: 'FAQ section' },
        { value: 'urgency', label: 'Urgency/Scarcity elements' },
        { value: 'bonus', label: 'Bonuses/Value stack' },
        { value: 'bio', label: 'About/Creator bio' }
      ],
      description: 'Check all sections currently on your page'
    }
  ],

  ai: {
    template: `Audit a sales page based on:

Page URL: {page_url}
Current Conversion Rate: {current_conversion_rate}%
Traffic Sources: {traffic_sources}
Price Point: {price_point}
Main Objections: {main_objections}
Existing Sections: {page_sections}

Generate a comprehensive sales page audit:

## 1. CONVERSION AUDIT SCORECARD

**Overall Score:** [X/100]

**Score Breakdown:**
- Headline Clarity: [X/10] - [Issue if low]
- Value Proposition: [X/10] - [Issue if low]
- Social Proof: [X/10] - [Issue if low]
- Trust Elements: [X/10] - [Issue if low]
- CTA Clarity: [X/10] - [Issue if low]
- Mobile UX: [X/10] - [Issue if low]
- Objection Handling: [X/10] - [Issue if low]
- Urgency/Scarcity: [X/10] - [Issue if low]
- Page Structure: [X/10] - [Issue if low]
- Load Speed: [X/10] - [Issue if low]

**Conversion Rate Analysis:**
- Current: {current_conversion_rate}%
- Industry Benchmark: [X]% for {price_point} products
- Potential After Fixes: [X]% (estimated)
- Revenue Impact: [Calculate potential $ increase]

## 2. HEADLINE OPTIMIZATION

**Current Headline Issues:**
- [ ] Not specific enough
- [ ] No clear benefit
- [ ] Too clever, not clear
- [ ] Doesn't address main pain point
- [ ] No urgency or timeframe

**Optimized Headline Options:**

**Option 1 (Benefit-Focused):**
"[Specific Outcome] in [Timeframe] Without [Main Pain Point]"

**Option 2 (Problem-Solution):**
"[Pain Point]? Here's How to [Solve It] Without [Common Obstacle]"

**Option 3 (Social Proof Angle):**
"Join [X Number] [Target Audience] Who [Achieved Result] Using [Method]"

**Subheadline:**
Expand on the promise and qualify the audience
"[Elaboration on headline that builds credibility and specifies who this is for]"

## 3. CTA (CALL-TO-ACTION) IMPROVEMENTS

**Current CTA Issues:**
- [ ] Generic button text ("Buy Now", "Submit")
- [ ] Only one CTA (should have 3-5)
- [ ] No benefit in CTA copy
- [ ] Weak visual contrast
- [ ] No micro-commitment option

**Optimized CTA Strategy:**

**Primary CTA (Above the fold):**
Button Text: "Yes, I Want [Specific Outcome]!"
Supporting Text: "[Urgency or guarantee note]"

**Secondary CTA (After benefits):**
Button Text: "Get Instant Access to [Product Name]"
Supporting Text: "Join [X] others who [achieved result]"

**Final CTA (End of page):**
Button Text: "Claim [Bonus] Before [Deadline]"
Supporting Text: "[Guarantee reminder]"

**CTA Button Design:**
- Color: [High-contrast color suggestion]
- Size: Large, impossible to miss
- Placement: Every 2 scroll screens
- Mobile: Sticky footer button

## 4. TRUST ELEMENT ADDITIONS

Based on {price_point} price point, you need strong trust signals.

**Missing Trust Elements to Add:**

**Social Proof:**
- [ ] Customer testimonials (need 5-10 minimum)
- [ ] Number of customers served
- [ ] Star ratings/reviews
- [ ] Video testimonials (powerful for high-ticket)
- [ ] Before/after results

**Credibility Markers:**
- [ ] Media mentions ("As seen in...")
- [ ] Certifications/credentials
- [ ] Years in business
- [ ] Industry awards
- [ ] Case studies with data

**Risk Reversal:**
- [ ] Money-back guarantee badge
- [ ] Guarantee details (should be bold, specific)
- [ ] "No questions asked" refund policy
- [ ] Extend guarantee period (60-90 days > 30 days)

**Security Signals:**
- [ ] SSL certificate badge
- [ ] Payment security logos (Stripe, PayPal, etc.)
- [ ] Privacy policy link
- [ ] Contact information visible

## 5. MOBILE UX FIXES

[X]% of traffic is mobile - mobile conversion rates often 50% lower if not optimized.

**Critical Mobile Fixes:**

**Above the Fold:**
- [ ] Headline readable without zooming (24px+ font)
- [ ] CTA button large enough (44px+ height)
- [ ] Hero image loads fast (<3 seconds)

**Page Structure:**
- [ ] Remove horizontal scrolling
- [ ] Simplify navigation
- [ ] Single-column layout
- [ ] Tap targets spaced 8px+ apart

**Forms:**
- [ ] Use mobile-friendly input types
- [ ] Minimize fields (3 max for lead capture)
- [ ] Auto-focus on first field
- [ ] Show keyboard appropriate to field type

**Performance:**
- [ ] Compress images (WebP format)
- [ ] Lazy load below-fold content
- [ ] Remove render-blocking resources
- [ ] Target <3 second load time

## 6. SOCIAL PROOF PLACEMENT STRATEGY

**Strategic Placement:**

**1. Above the Fold:**
One-liner social proof: "[X] customers, [Y] rating"

**2. After First Objection:**
Testimonial addressing that specific objection

**3. After Pricing Reveal:**
Testimonial about value: "Worth 10x the price"

**4. In FAQ:**
Embed testimonials in answers

**5. Final CTA:**
"Join [X] others who [result]"

**Testimonial Framework:**
- **Name + Photo + Credential** (builds trust)
- **Specific Result** (not just "great product")
- **Before/After Context** (shows transformation)
- **Timeframe** (shows speed to results)

Example: "I made back the investment in 2 weeks and have since 5x'd my revenue. This is the best business decision I've made." - Sarah M., E-commerce Owner

## 7. OBJECTION HANDLING PLACEMENT

Based on your main objections: {main_objections}

**Map Objections to Page Sections:**

**Objection 1: [Common objection]**
- Where to address: [Specific page section]
- How to address: [Copy/element to add]
- Example: "[Specific copy that handles this]"

**Objection 2: [Second objection]**
- Where to address: [Section]
- How to address: [Tactic]
- Example: "[Copy example]"

[Continue for top 5 objections]

**FAQ Section Optimization:**
Turn your FAQ into an objection-handling powerhouse:
- Q: [Objection phrased as question]
- A: [Answer that reinforces value, not just facts]

## 8. CHECKOUT OPTIMIZATION

**Pre-Checkout:**
- [ ] Show what happens after clicking CTA
- [ ] Display accepted payment methods
- [ ] Mention satisfaction guarantee near CTA
- [ ] Remove navigation (no distractions)

**Checkout Page:**
- [ ] Progress indicator if multi-step
- [ ] Trust badges visible
- [ ] Order summary always visible
- [ ] Autofill enabled
- [ ] Error messages helpful, not technical
- [ ] Multiple payment options
- [ ] Offer payment plan if > $200

**Post-Purchase:**
- [ ] Clear confirmation message
- [ ] Next steps explained
- [ ] Upsell opportunity (subtle)
- [ ] Set expectations for delivery

## 9. URGENCY/SCARCITY IMPLEMENTATION

**Ethical Urgency Tactics:**

**Time-Based:**
- Limited-time bonuses (remove after date)
- Early-bird pricing (increase after deadline)
- Launch period (real open/close dates)

**Quantity-Based:**
- Cohort limits (max X students per month)
- Physical inventory (for physical products)
- 1-on-1 capacity limits (for services)

**Implementation:**
- **Countdown timer:** For deadline-based offers
- **Stock counter:** "Only X spots left"
- **Recent activity:** "3 people purchased in last hour"

**Warning:** Never fake scarcity - it destroys trust if discovered.

## 10. HEATMAP INTERPRETATION GUIDE

If you have heatmap data, look for:

**Click Heatmap:**
- Are people clicking non-clickable elements? (Add CTAs there)
- Are CTAs being ignored? (Make them more prominent)
- Are people clicking away? (Remove exit points)

**Scroll Heatmap:**
- What % reaches pricing? (If <50%, move pricing up)
- Where do people drop off? (Add engaging content there)
- Is FAQ reached? (Move up if low scroll depth)

**Movement Heatmap:**
- Are eyes skipping your headline? (Make it more compelling)
- Are images distracting from CTAs? (Simplify)
- Is form too complex? (Reduce fields)

**Tools to Use:**
- Hotjar (free tier available)
- Microsoft Clarity (free)
- Crazy Egg

## 11. PAGE STRUCTURE RECOMMENDATION

**Optimized Flow for {price_point} Product:**

1. **Hero Section:**
   - Headline + Subheadline
   - Single CTA button
   - Trust indicator ("X customers")

2. **Problem Agitation:**
   - 3-5 pain points your audience faces
   - "Are you struggling with [X]?"

3. **Solution Introduction:**
   - Introduce your product
   - How it solves the problem
   - Unique mechanism/approach

4. **How It Works:**
   - 3-step process
   - Simple, clear, fast

5. **Benefits/Features:**
   - What they get
   - What they'll achieve
   - Focus on outcomes, not features

6. **Social Proof #1:**
   - 3-5 testimonials
   - Varied (different types of results)

7. **Value Stack:**
   - Core offer
   - Bonuses (3-5)
   - Total value vs price

8. **Guarantee:**
   - Bold, specific promise
   - Risk reversal

9. **Objection Handling:**
   - "You might be wondering..."
   - Address top 3-5 objections

10. **Social Proof #2:**
    - Case studies
    - Before/after

11. **FAQ:**
    - 10-15 questions
    - Turn into selling points

12. **Final CTA:**
    - Urgency reminder
    - Guarantee reminder
    - Strong action button

## 12. PRIORITY FIX LIST

Based on impact vs effort, fix in this order:

**Priority 1 (Do First - High Impact, Low Effort):**
1. [Specific fix]
2. [Specific fix]
3. [Specific fix]

**Priority 2 (Do Next - High Impact, Medium Effort):**
1. [Specific fix]
2. [Specific fix]

**Priority 3 (Do Later - Medium Impact):**
1. [Specific fix]
2. [Specific fix]

**Estimated Conversion Lift:**
- After Priority 1 fixes: +[X]% conversion rate
- After Priority 2 fixes: +[X]% more
- After Priority 3 fixes: +[X]% more

Format with specific copy examples and actionable fixes, not just theory.`,

    temperature: 0.7,
    maxTokens: 3000,

    // SSOT Phase 5: Removed contextProvider - project context auto-injected from projectStore
  },

  output: {
    enabled: true,
    exportFilename: 'sales-page-audit',
    displayFormat: 'text',
    editable: true,
    deletable: true,
    exportable: true,
    copyable: true
  },

  help: {
    examples: [
      {
        scenario: 'SaaS sales page converting at 2% wants to hit 5%',
        input: { page_url: 'https://example.com/pricing', current_conversion: 2, monthly_visitors: 1000, product_price: 99 },
        output: 'Comprehensive audit identifying 12 conversion killers: weak headline (generic "Pricing" instead of benefit-driven), no social proof above fold, buried CTA (first CTA at 60% scroll), unclear value prop, no guarantee, poor mobile experience (16% of layout), vague feature descriptions, missing FAQ section, no urgency/scarcity, slow page load (4.2s), missing trust badges. Prioritized action plan: 1) Rewrite headline (potential +30% lift), 2) Add guarantee (potential +20%), 3) Move CTA above fold (potential +15%). Expected new conversion rate: 3.9-4.5%.'
      },
      {
        scenario: 'Course sales page with high traffic but low sales',
        input: { page_url: 'https://example.com/course', current_conversion: 1, monthly_visitors: 5000, product_price: 497 },
        output: 'Audit reveals traffic quality mismatch and offer positioning issues: High bounce rate (78%) suggests wrong audience or unclear value prop, long page (4000 words) likely overwhelming visitors, price seems high without justification (no value stack or ROI calculator), testimonials are generic without specific results, no payment plan offered for $497 price point. Recommendations ranked by impact: 1) Add value stack showing $2500+ total value, 2) Offer 3-pay option ($177/mo), 3) Include 3 result-specific testimonials with numbers, 4) Add "results not typical" case study showing realistic outcomes, 5) Shorten page 30% focusing on transformation.'
      }
    ],
    commonMistakes: [
      'Auditing without traffic data - analyzing page in isolation without knowing where visitors drop off. Install heatmaps (Hotjar) and scroll tracking before auditing to identify real vs imagined problems.',
      'Changing everything at once - implementing all 15 recommendations simultaneously and not knowing what worked. Test top 3 highest-impact changes first, measure results, then iterate.',
      'Focusing on design over copy - making page "prettier" while ignoring that headline is feature-focused instead of benefit-focused. Copy improvements typically drive 3-5x more lift than design tweaks.',
      'Not checking mobile - auditing only desktop when 60% of traffic is mobile. Always audit mobile experience separately - different pain points emerge.',
      'Comparing to wrong benchmarks - expecting 10% conversion on a $5K product when 2-3% is excellent for high-ticket. Know your industry benchmarks before setting goals.',
      'Ignoring page speed - beautiful page that takes 5+ seconds to load loses 40% of visitors before they see anything. Run PageSpeed Insights first - speed improvements often have highest ROI.'
    ],
    proTips: [
      'Test one change at a time: Make a single high-impact change, measure for 2 weeks with at least 500 visitors, then iterate. Changing multiple elements simultaneously makes it impossible to know what worked.',
      'Screenshot your page before changes: Create a dated archive of every version. When conversion drops, you can quickly identify what changed and revert if needed.',
      'Use session recordings over heatmaps: Heatmaps show aggregate behavior, but session recordings show WHY people leave. Watch 20-30 recordings of non-buyers to find patterns.',
      'Prioritize above-the-fold: 50% of visitors never scroll past the first screen. Your headline, subheadline, and first CTA must do the heavy lifting.',
      'Match landing page to ad creative: If your ad promises "5 easy steps", your landing page headline should reinforce that exact promise. Mismatched expectations kill conversions.',
      'Add a price anchor: Before revealing your price, show the value of what they\'re getting. "$5,000 value for just $497" converts better than "$497" alone.',
      'Test guarantee placement: Some pages convert better with guarantee near price, others with guarantee near CTA. Test both positions.',
      'Remove navigation on sales pages: Every link is a potential exit. Remove header navigation and footer links on dedicated sales pages.'
    ]
  }
}
