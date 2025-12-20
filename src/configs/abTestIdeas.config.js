/**
 * A/B Test Idea Generator - Task 8.4
 */

export const abTestIdeasTask = {
  id: 'growth-4',
  name: 'A/B Test Idea Generator',
  description: 'Generate prioritized A/B test ideas with hypotheses, variants, and success metrics',
  category: 'growth',
  tier: 'free',

  what: 'Get a prioritized backlog of A/B test ideas for your marketing assets. Receive test hypotheses, variant designs, statistical significance calculators, implementation guidance, and results interpretation frameworks. Stop guessing, start testing systematically.',

  why: 'Most marketers optimize based on gut feel, not data. A single winning A/B test can increase conversions by 20-300%. But random testing wastes time and traffic. A systematic testing framework helps you test the highest-impact changes first and reach significance faster.',

  how: 'Specify what you want to test (landing page, email, ad, etc.), current performance metrics, traffic volume, and conversion goal. AI will generate a prioritized test backlog with specific hypotheses, variant recommendations, and a testing roadmap.',

  form: [
    {
      id: 'asset_type',
      type: 'select',
      label: 'What Are You Testing?',
      options: [
        { value: 'landing-page', label: 'Landing page' },
        { value: 'sales-page', label: 'Sales page' },
        { value: 'email', label: 'Email campaign' },
        { value: 'ad-creative', label: 'Ad creative (image/video)' },
        { value: 'ad-copy', label: 'Ad copy/headline' },
        { value: 'pricing-page', label: 'Pricing page' },
        { value: 'signup-flow', label: 'Signup/checkout flow' },
        { value: 'cta-button', label: 'CTA button/placement' }
      ],
      required: true
    },
    {
      id: 'current_performance',
      type: 'textarea',
      label: 'Current Performance Metrics',
      placeholder: 'e.g., "Landing page: 1,000 visitors/week, 2.5% conversion rate, 45% bounce rate"',
      required: true,
      rows: 2,
      description: 'Include: Traffic volume, conversion rate, bounce rate (if known)'
    },
    {
      id: 'traffic_volume',
      type: 'select',
      label: 'Weekly Traffic/Volume',
      options: [
        { value: 'low', label: 'Low (<500/week) - Need high-impact tests' },
        { value: 'medium', label: 'Medium (500-5,000/week) - Standard testing' },
        { value: 'high', label: 'High (5,000-50,000/week) - Rapid iteration' },
        { value: 'very-high', label: 'Very High (50,000+/week) - Micro-optimizations viable' }
      ],
      required: true,
      description: 'Higher traffic = can test smaller changes; Low traffic = need big swings'
    },
    {
      id: 'conversion_goal',
      type: 'select',
      label: 'Primary Conversion Goal',
      options: [
        { value: 'clicks', label: 'Clicks (CTR)' },
        { value: 'signups', label: 'Sign-ups/Leads' },
        { value: 'purchases', label: 'Purchases/Sales' },
        { value: 'engagement', label: 'Engagement (time, scroll, etc.)' },
        { value: 'form-completion', label: 'Form completion' }
      ],
      required: true
    },
    {
      id: 'test_duration',
      type: 'select',
      label: 'How Long Can Tests Run?',
      options: [
        { value: '1-week', label: '1 week (fast iteration)' },
        { value: '2-week', label: '2 weeks (standard)' },
        { value: '4-week', label: '4 weeks (low traffic/cautious)' },
        { value: 'flexible', label: 'Flexible (run until significance)' }
      ],
      required: true,
      description: 'Shorter tests need higher traffic for significance'
    },
    {
      id: 'hypothesis',
      type: 'textarea',
      label: 'Your Hypothesis (Optional)',
      placeholder: 'e.g., "Changing headline from feature-focused to benefit-focused will increase conversions because..."',
      rows: 2,
      description: 'If you have a specific test in mind, describe it here'
    }
  ],

  ai: {
    template: `Generate A/B test ideas based on:

Asset Type: {asset_type}
Current Performance: {current_performance}
Traffic Volume: {traffic_volume}
Conversion Goal: {conversion_goal}
Test Duration: {test_duration}
User Hypothesis: {hypothesis}

Create a comprehensive A/B testing strategy:

## 1. PRIORITIZED TEST BACKLOG

**Test Priority Framework:** Impact × Ease ÷ Time to Significance

**Priority 1 (High Impact, Quick to Significance):**

**Test #1: [Test Name]**
- **Hypothesis:** "Changing [element] from [A] to [B] will increase [metric] by [X]% because [psychological reason]"
- **Expected Impact:** +15-30% conversion lift
- **Effort:** Low (1-2 hours setup)
- **Traffic Needed:** [X] visitors for 95% confidence
- **Time to Significance:** [Y] days at current traffic

**Variants:**
- Control (A): [Current version description]
- Variant (B): [Proposed change - be specific]

**Why This First:**
[Reason this is highest priority - usually high impact + fast results]

---

**Test #2: [Test Name]**
[Same structure]

---

[Continue for 8-10 tests, prioritized by expected impact and time to significance]

**Priority 2 (Medium Impact, Longer Tests):**
[3-5 additional tests]

**Priority 3 (Micro-Optimizations, Only for High Traffic):**
[2-3 tests for when Priority 1-2 are exhausted]

## 2. TEST HYPOTHESES (Specific to {asset_type})

**For {asset_type}, test these elements in order:**

### A. HEADLINE/VALUE PROPOSITION
**Why Test This First:** Headline accounts for 80% of impact

**Test Variations:**
1. Feature-focused: "[Feature] for [Audience]"
   vs
   Benefit-focused: "[Outcome] in [Timeframe] Without [Pain Point]"

2. Clarity-focused: "[Specific what you do]"
   vs
   Curiosity-focused: "[Provocative question/statement]"

**Hypothesis Template:**
"[Variation B] will outperform [Variation A] because [target audience] cares more about [benefit] than [feature], based on [customer research/reviews]."

### B. CALL-TO-ACTION (CTA)
**Why Test:** Small CTA changes can yield 10-50% lifts

**Test Variations:**
1. Button Text:
   - Generic: "Get Started" or "Sign Up"
   vs
   - Specific: "Get My Free [Lead Magnet]" or "Start [Achieving Result]"

2. Button Color:
   - Current: [Color]
   vs
   - High Contrast: [Recommended color based on page design]

3. CTA Placement:
   - Above fold only
   vs
   - Multiple CTAs (every 2 scroll screens)

### C. SOCIAL PROOF
**Why Test:** Trust signals can increase conversions 15-30%

**Test Variations:**
1. No social proof
   vs
   Specific numbers: "[X] customers, [Y] rating"

2. Generic testimonials
   vs
   Specific results: "Made $10K in first month - Sarah M."

3. Testimonial placement:
   - Below pricing
   vs
   - Next to CTA button

### D. VISUAL ELEMENTS
**Test Variations:**
1. Hero image:
   - Stock photo
   vs
   - Product screenshot/demo
   vs
   - Customer success photo

2. Video presence:
   - No video
   vs
   - Explainer video above fold

### E. FORM FIELDS (If Applicable)
**Test Variations:**
1. Number of fields:
   - Email + Name + Phone
   vs
   - Email only

2. Form placement:
   - Right sidebar
   vs
   - Centered below headline

3. Button copy:
   - "Submit"
   vs
   - "Get Instant Access"

## 3. VARIANT DESIGNS

**For Test #1 (Highest Priority):**

**Control (A) - Current Version:**
[Describe current state]

**Variant (B) - Proposed Change:**
**Change:** [Specific modification]
**Mockup Notes:**
- Headline: "[New headline copy]"
- Subheadline: "[New subheadline]"
- Visual changes: [Color, layout, image modifications]
- CTA: "[Button text and color]"

**Design Principles:**
- Make ONE major change per test (isolate variables)
- Keep brand consistency
- Ensure mobile-responsive

**Implementation:**
[Platform-specific notes: Google Optimize, Optimizely, VWO, or native platform A/B testing]

## 4. STATISTICAL SIGNIFICANCE CALCULATOR

**Your Traffic Level: {traffic_volume}**

**Significance Guidelines:**

**For {conversion_goal} with baseline conversion rate [X]%:**

**To detect a 10% lift:**
- Sample size needed: [X] visitors per variant
- At your traffic: [Y] days to significance
- Confidence level: 95%

**To detect a 20% lift:**
- Sample size needed: [X] visitors per variant
- At your traffic: [Y] days to significance

**To detect a 50% lift:**
- Sample size needed: [X] visitors per variant
- At your traffic: [Y] days to significance

**Recommendation for {traffic_volume} traffic:**
[Aim for 20%+ lifts if low traffic; Can test 5-10% lifts if high traffic]

**Statistical Significance Checklist:**
- [ ] Reached minimum sample size (not just time elapsed)
- [ ] P-value < 0.05 (95% confidence)
- [ ] Ran for at least 1 full week (captures day-of-week variance)
- [ ] Checked for external factors (seasonality, promotions, etc.)

**Tools:**
- Evan Miller A/B Test Calculator: [Link to sample size calculator]
- Built-in significance in: Google Optimize, Optimizely
- Manual calculation: Use chi-square test

## 5. TEST DURATION ESTIMATOR

**Based on {test_duration} and {traffic_volume}:**

**Optimal Test Duration:**
- Minimum: [X] days (for statistical validity)
- Maximum: [Y] days (diminishing returns after this)

**Weekly Testing Capacity:**
At your traffic level, you can run approximately [X] tests per month.

**Testing Roadmap:**
- Month 1: Tests #1, #2 (Priority 1 tests)
- Month 2: Tests #3, #4, #5
- Month 3: Tests #6, #7, #8
- Quarter 2: Priority 2 tests

**Parallel vs Sequential Testing:**
- **If traffic > 10K/week:** Can run 2-3 parallel tests on different pages
- **If traffic < 5K/week:** Run sequential tests to avoid splitting traffic too thin

## 6. IMPLEMENTATION GUIDE

**For {asset_type}, recommended tools:**

**Landing Pages:**
- Unbounce (built-in A/B testing)
- Google Optimize (free, integrates with Analytics)
- VWO, Optimizely (enterprise options)

**Emails:**
- Mailchimp, ConvertKit (subject line tests built-in)
- Customer.io (advanced email testing)
- A/B test: Subject lines, preview text, email body

**Ads:**
- Facebook Ads Manager (automatic A/B testing)
- Google Ads (experiments feature)
- Test: Creative, headline, description, CTA

**Step-by-Step Implementation:**

1. **Set Up Tracking:**
   - Install testing platform pixel/script
   - Define conversion goal (what counts as success)
   - Set up Google Analytics event tracking

2. **Create Variants:**
   - Design variant B based on hypothesis
   - Preview on desktop AND mobile
   - Test all links/buttons work

3. **Configure Test:**
   - 50/50 traffic split (unless otherwise justified)
   - Set test duration or traffic cap
   - Enable statistical significance alerts

4. **Launch Test:**
   - QA both variants thoroughly
   - Check tracking fires correctly
   - Monitor first 24 hours for issues

5. **Monitor Progress:**
   - Check daily for significance
   - Watch for anomalies (bot traffic, etc.)
   - Don't stop early (false positives)

6. **Analyze Results:**
   - Use significance calculator
   - Check secondary metrics (bounce rate, time on page)
   - Segment results (mobile vs desktop, traffic source)

7. **Implement Winner:**
   - Push winning variant to 100% traffic
   - Document learnings
   - Start next test

## 7. RESULTS INTERPRETATION FRAMEWORK

**When Test Completes:**

**Scenario 1: Clear Winner (p < 0.05)**
✅ **Action:** Implement winning variant
- Document: What won, by how much, why it likely worked
- Iterate: Can you amplify the winning element further?

**Scenario 2: Inconclusive (p > 0.05)**
🤷 **Action:** No winner, keep control
- Analyze: Was sample size too small? Was change too subtle?
- Next step: Test a bigger variation or different element

**Scenario 3: Negative Result (Variant Performed Worse)**
❌ **Action:** Keep control, learn from failure
- Document: Why might it have failed? (Hypothesis was wrong, poor execution, etc.)
- Iterate: Test opposite direction or different hypothesis

**Secondary Metrics to Check:**
Even if conversion rate increased, check:
- Bounce rate (did it increase? Bad sign)
- Time on page (decreased? Might indicate confusion)
- Scroll depth (are people seeing full page?)
- Cart abandonment rate (for e-commerce)

**Segmented Analysis:**
Break down results by:
- Traffic source (paid vs organic may respond differently)
- Device (mobile vs desktop)
- New vs returning visitors
- Geography (if relevant)

Sometimes variant wins for mobile but loses for desktop - implement conditionally.

## 8. COMMON A/B TESTING MISTAKES TO AVOID

**Mistake #1: Testing Too Many Things at Once**
- Don't test headline + CTA + image simultaneously
- If you do multivariate, need 10x traffic

**Mistake #2: Stopping Test Early**
- "We got 50 conversions, we're done!" ← NO
- Need minimum sample size + 1 full week minimum

**Mistake #3: Not Having a Hypothesis**
- Random testing = slow learning
- Always have "We believe [X] because [reason]"

**Mistake #4: Ignoring Mobile**
- 50%+ traffic is mobile - preview all variants on mobile
- Sometimes need separate tests for mobile

**Mistake #5: Testing Low-Impact Elements**
- Don't test button shade of blue before testing headline
- Follow priority order: Headline > CTA > Social Proof > Visuals > Micro-copy

**Mistake #6: Not Documenting Tests**
- Keep a testing log: Hypothesis, result, learnings
- Build institutional knowledge

**Mistake #7: HiPPO Testing** (Highest Paid Person's Opinion)
- CEO wants to test their idea ≠ priority
- Use data and framework to prioritize

## 9. ADVANCED TESTING STRATEGIES

**For High Traffic ({traffic_volume} = high/very-high):**

**Multivariate Testing:**
Test multiple elements simultaneously
- Requires sophisticated platform (Optimizely, VWO)
- Need 10x traffic of regular A/B test
- Can find interaction effects

**Sequential Testing:**
Test 1 → Implement winner → Test 2 on winning variant → Repeat
- Compounds wins over time
- Example: +20% from headline test, then +15% from CTA test = +38% total

**Personalization Testing:**
Show different variants based on:
- Traffic source (ad traffic sees variant optimized for ad messaging)
- User behavior (returning visitors see different message)
- Device type (mobile-optimized vs desktop)

**For Low Traffic ({traffic_volume} = low):**

**Focus on Big Swings:**
- Test radically different designs, not button colors
- Need larger lifts to reach significance faster

**Consider Qualitative Testing First:**
- User testing (5 people can reveal 80% of issues)
- Heatmaps (Hotjar, Crazy Egg)
- Session recordings
- Then A/B test the biggest issues found

## 10. A/B TESTING DOCUMENTATION TEMPLATE

**Test Log Entry:**

**Test ID:** [001]
**Date:** [Start - End]
**Asset:** {asset_type}
**Element Tested:** [Headline/CTA/Image/etc.]

**Hypothesis:**
"We believe [change] will increase [metric] by [%] because [reason based on data/research]"

**Variants:**
- Control (A): [Description]
- Variant (B): [Description]

**Results:**
- Control conversion rate: [X]%
- Variant conversion rate: [Y]%
- Lift: [+Z]%
- Statistical significance: [p-value]
- Sample size: [N per variant]

**Winner:** [A or B]

**Learnings:**
[Why did it win/lose? What does this tell us about our audience?]

**Next Steps:**
[Follow-up test idea based on learnings]

Format with specific test ideas and implementation steps.`,

    temperature: 0.7,
    maxTokens: 3000,

    // SSOT Phase 5: Removed contextProvider - project context auto-injected from projectStore
  },

  output: {
    enabled: true,
    exportFilename: 'ab-test-ideas',
    displayFormat: 'text',
    editable: true,
    deletable: true,
    exportable: true,
    copyable: true
  },

  help: {
    examples: [
      {
        scenario: 'E-commerce product page with low conversion rate',
        input: { asset_type: 'landing-page', current_performance: '2000 visitors/week, 1.5% conversion rate', traffic_volume: 'medium', conversion_goal: 'purchases' },
        output: 'Prioritized test backlog starting with headline variations (problem-focused vs benefit-focused), followed by CTA button text changes, product image carousel tests, and social proof placement experiments. Includes sample size calculations and expected 2-week test duration for statistical significance.'
      },
      {
        scenario: 'SaaS signup page optimization',
        input: { asset_type: 'signup-flow', current_performance: '500 signups/week, 8% conversion, 60% bounce', traffic_volume: 'medium', conversion_goal: 'signups' },
        output: 'Test roadmap focusing on reducing form fields (test 3 fields vs 7 fields), changing CTA copy from "Sign Up" to "Start Free Trial", adding trust badges, and testing multi-step vs single-page forms. Each test includes hypothesis, expected impact, and traffic requirements.'
      }
    ],
    commonMistakes: [
      'Testing too many variables at once - changing headline, CTA, and images simultaneously makes it impossible to know what drove the results. Test ONE element at a time.',
      'Stopping tests too early - seeing 20 conversions and declaring victory leads to false positives. Always wait for statistical significance AND run for at least 1 full week to account for day-of-week variance.',
      'Testing minor details before major elements - don\'t test button shades of blue before testing your headline. Follow the priority order: Headline > CTA > Social Proof > Visuals > Micro-copy.',
      'Not having a clear hypothesis - random testing wastes time and traffic. Always start with "We believe [X] will increase [metric] by [%] because [psychological reason]".',
      'Ignoring mobile performance - 50%+ of traffic is mobile, but many only preview tests on desktop. Always check how variants look and perform on mobile devices.',
      'Not documenting learnings - running tests without keeping a log means you forget insights and repeat mistakes. Maintain a testing log with hypotheses, results, and learnings for institutional knowledge.'
    ]
  }
}
