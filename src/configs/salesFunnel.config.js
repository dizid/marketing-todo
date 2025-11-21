/**
 * Funnel Blueprint Generator - Task 7.1
 */

export const funnelBlueprintTask = {
  id: 'sales-1',
  name: 'Funnel Blueprint Generator',
  description: 'Get a complete sales funnel strategy with step-by-step tactics for each stage',
  category: 'sales',
  tier: 'free',

  what: 'Build a complete sales funnel roadmap from first touch to repeat customer. Get ready-to-use tactics for awareness ads, lead capture, email nurture, sales conversion, retention, and win-back campaigns. Includes specific copy examples, budget recommendations, and conversion benchmarks.',

  why: '90% of potential customers never buy because there\'s no nurture process. A funnel systematically moves people from "never heard of you" to "loyal customer" - turning traffic into revenue. This blueprint gives you the exact steps, so you\'re not guessing what comes next.',

  how: 'Tell us about your product, who it\'s for, and what problem it solves. We\'ll generate a customized 6-stage funnel with specific tactics, copy templates, and conversion benchmarks. You\'ll get a 90-day roadmap showing exactly what to build first.',

  form: [
    {
      id: 'product_description',
      type: 'textarea',
      label: 'What Do You Sell?',
      placeholder: 'Example: "An AI-powered email marketing tool that writes personalized campaigns in minutes. Helps small businesses send better emails without hiring a copywriter."',
      description: 'Describe your product and the main benefit it delivers. Focus on what it DOES for customers, not just what it IS.',
      required: true,
      rows: 3
    },
    {
      id: 'target_audience',
      type: 'textarea',
      label: 'Who Is This For?',
      placeholder: 'Example: "Small business owners (5-25 employees) in e-commerce or services who struggle with email marketing. Usually tech-comfortable but not marketers. Budget-conscious."',
      description: 'Be specific: What industry? Company size? Job title? Pain points? The more detail you give, the better your funnel will be.',
      required: true,
      rows: 3
    },
    {
      id: 'main_problem',
      type: 'textarea',
      label: 'What Problem Does This Solve?',
      placeholder: 'Example: "Email campaigns take 3-5 hours to write and design, or cost $500+ to outsource. Most small businesses can\'t afford either."',
      description: 'What specific pain point keeps your customers up at night? Focus on ONE main problem (you can mention others later).',
      required: true,
      rows: 2
    },
    {
      id: 'price_point',
      type: 'number',
      label: 'Main Product Price',
      placeholder: '97',
      prefix: '$',
      min: 0,
      required: true,
      description: 'Your primary product price in USD. This determines funnel complexity - higher prices need more trust-building steps.'
    },
    {
      id: 'offer_structure',
      type: 'select',
      label: 'How Do Customers Pay?',
      options: [
        { value: 'one-time', label: 'One-time purchase (single payment)' },
        { value: 'subscription', label: 'Subscription/Recurring (monthly/annual)' },
        { value: 'payment-plan', label: 'Payment plan (split into installments)' },
        { value: 'tiered', label: 'Tiered pricing (Good/Better/Best packages)' },
        { value: 'freemium', label: 'Freemium (free version + paid upgrade)' }
      ],
      required: true,
      description: 'Different payment models need different funnel strategies'
    },
    {
      id: 'sales_goal',
      type: 'select',
      label: 'What\'s Your #1 Goal Right Now?',
      options: [
        { value: 'awareness', label: 'Awareness - Get known in the market' },
        { value: 'leads', label: 'Lead Generation - Build email list fast' },
        { value: 'conversions', label: 'Sales - Convert traffic to customers now' },
        { value: 'ascension', label: 'Upsells - Get existing customers to buy more' },
        { value: 'retention', label: 'Retention - Keep customers longer' }
      ],
      required: true,
      description: 'Choose your PRIMARY goal - the funnel will prioritize this'
    },
    {
      id: 'existing_assets',
      type: 'textarea',
      label: 'What Marketing Assets Do You Already Have? (Optional)',
      placeholder: 'Example: "5,000-person email list, active Instagram (2K followers), 20 blog posts, 50 past customers"',
      rows: 2,
      description: 'List ANY existing resources: email lists, social followers, content, past customers, budget, etc. We\'ll show you how to leverage them.'
    }
  ],

  ai: {
    template: `You are a direct-response marketing expert. Create a PRACTICAL, step-by-step funnel blueprint.

INPUTS:
Product: {product_description}
Target Audience: {target_audience}
Main Problem: {main_problem}
Price: ${price_point}
Payment Model: {offer_structure}
Primary Goal: {sales_goal}
Existing Assets: {existing_assets}

IMPORTANT OUTPUT REQUIREMENTS:
- Be SPECIFIC, not generic (exact copy, exact platforms, exact budgets)
- Include REAL examples, not just frameworks
- Make it ACTIONABLE - what to do TODAY, this week, this month
- Use numbers and benchmarks wherever possible
- Format for easy scanning (short paragraphs, bullet points, bold headers)

Generate this exact structure:

# 🎯 YOUR FUNNEL BLUEPRINT

## FUNNEL OVERVIEW

**Recommended Funnel Type:** [Name the funnel type based on price + offer structure]

**Expected Timeline:**
- Cold traffic → Email subscriber: [X days]
- Subscriber → First purchase: [X days]
- Total: Cold → Customer in [X] days average

**Success Metrics to Track:**
- Cost per lead: Target $[X]
- Lead-to-customer rate: Target [X]%
- Customer acquisition cost: Target $[X]
- Revenue per customer: Expected $[X]

**Why This Funnel Works for Your Price Point:**
[Explain why ${price_point} products need this specific approach]

---

## 📢 STAGE 1: AWARENESS (Get Attention)

**GOAL:** Make your target audience aware they have a problem you can solve

### Platform Strategy
**Where to Run Ads (prioritized):**
1. [Platform 1] - [Why it's #1 for your audience]
2. [Platform 2] - [Why it's #2]
3. [Platform 3] - [Only if budget allows]

**Monthly Budget Recommendation:**
- Total: $[X] minimum to start
- Platform split: [Platform 1: $X, Platform 2: $Y]

### Ad Angles (Copy These)
**Angle 1: Problem Agitation**
- Headline: "[Specific headline using {main_problem}]"
- Hook: "[First sentence that stops scroll]"
- CTA: "[What to click/do]"
- Why it works: [Psychology principle]

**Angle 2: Transformation Promise**
- Headline: "[Before → After headline]"
- Hook: "[Specific outcome in timeframe]"
- CTA: "[Next step]"
- Why it works: [Appeal to desired state]

**Angle 3: Social Proof**
- Headline: "[Number of users/results achieved]"
- Hook: "[Specific case study snippet]"
- CTA: "[Join others]"
- Why it works: [FOMO + validation]

### Content Topics That Attract Your Audience
[List 5-7 blog/video/social topics that would interest {target_audience} and naturally lead to your solution]

### Expected Performance
- CPM: $[X]-[Y] on [Platform]
- CTR: [X]% average (anything above = good)
- Cost per click: $[X]-[Y]

### QUICK WIN: What to Do This Week
- [ ] [Specific action 1]
- [ ] [Specific action 2]
- [ ] [Specific action 3]

---

## 🧲 STAGE 2: INTEREST (Capture Leads)

**GOAL:** Trade value for contact info - turn traffic into email subscribers

### Lead Magnet Ideas (Pick One to Start)

**Option 1: [Type of lead magnet]**
- Title: "[Specific title using {main_problem}]"
- Format: [PDF/Video/Checklist/Template]
- Why it works: [Solves immediate pain related to main problem]
- Time to create: [X hours/days]
- Expected opt-in rate: [X]% of traffic

**Option 2: [Different type]**
- Title: "[Alternative angle]"
- Format: [Different format]
- Why it works: [Different psychology]
- Time to create: [X hours/days]
- Expected opt-in rate: [X]% of traffic

**Option 3: [Third option]**
- Title: "[Another angle]"
- Format: [Format]
- Why it works: [Appeal]
- Time to create: [X hours/days]
- Expected opt-in rate: [X]% of traffic

**RECOMMENDED:** Start with Option [X] because [specific reason for this audience]

### Landing Page Structure
**Headline Formula:** "[Desired outcome] in [timeframe] without [obstacle]"
**Your Headline:** "[Write specific headline for their product]"

**Subheadline:** "[Expand on promise + qualify audience]"

**3 Bullet Points (What They'll Get):**
• [Specific benefit 1 from lead magnet]
• [Specific benefit 2]
• [Specific benefit 3]

**CTA Button Text:** "[Specific action-oriented text]"

**Trust Indicator:** "[X] people already downloaded this" or "[Social proof element]"

### Thank-You Page Sequence
1. **Immediate:** Deliver lead magnet instantly (email + on-page)
2. **Bonus Offer:** [Suggest a tripwire product if applicable, or next step]
3. **Social Share:** Ask to share if they found it valuable

### Expected Conversion Benchmarks
- Landing page opt-in rate: [X]%-[Y]% (industry average)
- Cost per lead: $[X]-[Y] (based on {price_point} economics)
- Email deliverability: Aim for 98%+ inbox placement

### QUICK WIN: What to Do This Week
- [ ] [Specific action 1]
- [ ] [Specific action 2]
- [ ] [Specific action 3]

---

## 📧 STAGE 3: CONSIDERATION (Nurture & Build Trust)

**GOAL:** Warm up leads through education and social proof before pitching

### 8-Email Welcome Sequence

**Email 1: DELIVER (Send immediately)**
- Subject: "[Your specific subject line]"
- Content: Deliver lead magnet + set expectations for future emails
- No pitch, pure value
- Open rate target: 60%+

**Email 2: STORY (24 hours later)**
- Subject: "[Curiosity or connection-based]"
- Content: Your origin story or customer success story
- Builds relationship and relatability
- Open rate target: 40%+

**Email 3: EDUCATE (Day 3)**
- Subject: "[Teach something valuable]"
- Content: How-to content or framework related to {main_problem}
- Positions you as expert
- Open rate target: 35%+

**Email 4: SOCIAL PROOF (Day 5)**
- Subject: "[Case study tease]"
- Content: Detailed case study or testimonials
- Shows what's possible
- Open rate target: 30%+

**Email 5: SOFT PITCH (Day 7)**
- Subject: "[Introduce solution casually]"
- Content: Introduce {product_description} as natural next step
- Link to sales page, but low-pressure
- Click rate target: 5%+

**Email 6: OBJECTION HANDLING (Day 9)**
- Subject: "[Address common concern]"
- Content: FAQ or address top objection about {price_point}/{product}
- Remove buying friction
- Click rate target: 4%+

**Email 7: BONUS/URGENCY (Day 11)**
- Subject: "[Limited-time element]"
- Content: Bonus for taking action or deadline approaching
- Create FOMO ethically
- Click rate target: 6%+

**Email 8: FINAL CALL (Day 13)**
- Subject: "[Last chance / final invitation]"
- Content: Direct ask to buy, restate value, handle final objections
- This is the hard pitch
- Conversion rate target: 2-5% of list to purchase

### Content Marketing Topics
[5-7 blog/video topics that nurture leads from problem-aware to solution-aware]

### Expected Performance
- List engagement rate: [X]% reading emails consistently
- Sequence conversion rate: [X]% of list to customers
- Revenue per subscriber: $[X] average

### QUICK WIN: What to Do This Week
- [ ] [Write first 3 emails]
- [ ] [Set up automation]
- [ ] [Test deliverability]

---

## 💰 STAGE 4: ACTION (Convert to Customers)

**GOAL:** Turn leads into paying customers with irresistible offer

### Sales Page Structure

**Headline (Hero Section):**
"[Outcome-focused headline using {transformation}]"

**Subheadline:**
"[Elaborate + proof point]"

**The Flow (Scroll Structure):**

1. **Problem Agitation** (0-25% scroll)
   - List 3-5 pain points from {main_problem}
   - "Sound familiar?" relatability

2. **Solution Introduction** (25-35% scroll)
   - How {product_description} solves this
   - Your unique mechanism/approach
   - Why it's different from alternatives

3. **How It Works** (35-45% scroll)
   - Simple 3-step process
   - Screenshots or visual proof
   - "It's easier than you think"

4. **Social Proof #1** (45-55% scroll)
   - 3-5 testimonials with results
   - Before/after if applicable
   - Video testimonials if you have them

5. **Value Stack** (55-65% scroll)
   - Core offer: $[value]
   - Bonus 1: $[value]
   - Bonus 2: $[value]
   - Total value: $[X]
   - **Your price: ${price_point}**

6. **Guarantee** (65-70% scroll)
   - [Recommend specific guarantee based on {offer_structure}]
   - Make it bold and specific
   - "Try it risk-free"

7. **FAQ / Objection Handling** (70-85% scroll)
   - [List 5-7 FAQs specific to {price_point} and {product}]

8. **Social Proof #2** (85-90% scroll)
   - More testimonials
   - Case studies with numbers
   - Media mentions if available

9. **Final CTA** (90-100% scroll)
   - Urgency reminder (deadline, bonus ending)
   - Guarantee reminder
   - Strong action button

### CTA Copy Examples
- Primary: "[Specific benefit-driven button text]"
- Secondary: "[Alternative framing]"
- Final: "[Urgency-based CTA]"

### Pricing Psychology for ${price_point}
[Specific tactics based on price point - anchoring, framing, payment options]

### Upsell/Downsell Strategy
**Upsell (After Purchase):**
- What: [Complementary product at $[X]]
- When: Order confirmation page
- Conversion rate: 10-30% of buyers

**Downsell (If They Don't Buy):**
- What: [Lower-commitment option at $[X]]
- When: Exit intent or after decline
- Conversion rate: 5-15% recovery

### Expected Conversion Rates
- Traffic → Sale: [X]% (cold traffic)
- Email list → Sale: [X]% (nurtured leads)
- Cost per acquisition: $[X] (based on funnel math)

### QUICK WIN: What to Do This Week
- [ ] [Draft sales page outline]
- [ ] [Write headline options]
- [ ] [Collect testimonials]

---

## 🔁 STAGE 5: RETENTION (Maximize Customer Value)

**GOAL:** Keep customers happy, buying more, and referring others

### First 30 Days Onboarding
**Goal:** Ensure quick win + prevent buyer's remorse

**Day 1: Welcome**
- Email: Celebrate purchase + next steps
- Deliver product access
- Set expectations

**Day 3: Quick Win**
- Email: Guide to fastest result
- Ensure they USE the product
- Prevent abandonment

**Day 7: Check-in**
- Email: "How's it going?" + offer help
- Gather feedback
- Surface any issues early

**Day 14: Case Study**
- Email: Share success story
- Remind them of possible outcomes
- Reinforce decision

**Day 30: Upsell Intro**
- Email: Introduce next tier/product
- "You're ready for..."
- Soft pitch for ascension

### Engagement Touchpoints
- Monthly newsletter with [specific content type]
- Quarterly feature updates
- Birthday/anniversary emails
- Re-engagement campaigns for inactive users

### Upsell/Cross-Sell Opportunities
**Ascension Ladder:**
1. Entry: $[lower price point product]
2. Core: ${price_point} ← You are here
3. Premium: $[higher price point upgrade]

**Timing:** Upsell after [X days/milestones]

### Referral Program Framework
- **Incentive:** [What referrer gets] + [What referee gets]
- **Trigger:** Ask after [positive milestone/review]
- **Goal:** [X]% of customers refer at least 1 person

### Churn Prevention
- Watch for: [Specific behavior signals]
- Intervene with: [Retention email/offer]
- Win-back sequence for churned customers

### Expected Retention Metrics
- Month 1 churn: [X]% (aim to minimize)
- Lifetime value: $[X] per customer
- Repeat purchase rate: [X]% within 6 months

### QUICK WIN: What to Do This Week
- [ ] [Build onboarding sequence]
- [ ] [Create welcome email]
- [ ] [Plan 90-day touchpoints]

---

## 🎯 STAGE 6: RETARGETING (Win Back Lost Opportunities)

**GOAL:** Recover people who fell out of funnel at any stage

### Retargeting Segments & Tactics

**Segment 1: Visited Landing Page, Didn't Opt In**
- Size: ~[X]% of traffic
- Ad angle: "[Different hook than original ad]"
- Offer: Bonus or different lead magnet
- Expected recovery: [X]%

**Segment 2: Opted In, Never Opened Emails**
- Size: ~[X]% of list
- Tactic: Re-engagement email with subject line test
- Offer: "Did you miss this?"
- Clean list if no response after 3 attempts

**Segment 3: Opened Emails, Never Clicked**
- Size: ~[X]% of engaged list
- Tactic: Survey email ("What would help you most?")
- Offer: Personalized content based on response
- Expected recovery: [X]%

**Segment 4: Clicked to Sales Page, Didn't Buy**
- Size: ~[X]% of clickers
- Tactic: Objection-handling email + retargeting ads
- Offer: Payment plan or bonus
- Expected recovery: [X]%
- **This is your highest-value segment to recover**

**Segment 5: Abandoned Cart**
- Size: ~[X]% of attempts
- Tactic: 3-email sequence (reminder → objection → final chance)
- Offer: Discount or remove friction
- Expected recovery: [X]%

### Retargeting Ad Examples
[3 specific ad variations for highest-value segments]

### Email Win-Back Sequence
**Email 1 (Immediate):** "Did you mean to leave?"
**Email 2 (24hr):** "Here's what you're missing"
**Email 3 (48hr):** "Last chance + [bonus/discount]"

### Expected Recovery Rates
- Overall funnel leakage: [X]% (people who drop out)
- Retargeting recovery: [X]% (people you bring back)
- ROI on retargeting: [X]:1 (highly profitable)

### QUICK WIN: What to Do This Week
- [ ] [Set up Facebook Pixel / tracking]
- [ ] [Create cart abandonment sequence]
- [ ] [Build high-intent retargeting audience]

---

## 📊 FUNNEL METRICS DASHBOARD

Track these weekly:

| Stage | Metric | Target | Current |
|-------|--------|--------|---------|
| Awareness | CPM | $[X] | ___ |
| Awareness | CTR | [X]% | ___ |
| Interest | Opt-in Rate | [X]% | ___ |
| Interest | Cost/Lead | $[X] | ___ |
| Consideration | Email Open | [X]% | ___ |
| Consideration | Email Click | [X]% | ___ |
| Action | Conversion | [X]% | ___ |
| Action | CPA | $[X] | ___ |
| Retention | Churn | <[X]% | ___ |
| Retention | LTV | $[X] | ___ |

**Your Target Funnel Math:**
- 1,000 visitors → [X] leads → [X] customers
- Revenue: [X] customers × ${price_point} = $[X]
- Cost: 1,000 visitors × $[X] CPC = $[X]
- Profit: $[Revenue - Cost]
- ROI: [X]%

---

## 🚀 90-DAY IMPLEMENTATION ROADMAP

### MONTH 1: FOUNDATION (Awareness + Lead Capture)
**Week 1:**
- [ ] Build lead magnet
- [ ] Create opt-in landing page
- [ ] Set up email automation

**Week 2:**
- [ ] Write first 3 nurture emails
- [ ] Create 3 awareness ad variations
- [ ] Set up Facebook/Google ads account

**Week 3:**
- [ ] Launch ads with $[X]/day budget
- [ ] Test lead magnet opt-in rate
- [ ] Start building email list

**Week 4:**
- [ ] Optimize ads (pause losers, scale winners)
- [ ] Improve landing page if opt-in < [X]%
- [ ] Write emails 4-8 of sequence

**Goal:** [X] email subscribers at $[X] cost per lead

---

### MONTH 2: CONVERSION (Nurture + Sales Page)
**Week 5:**
- [ ] Complete 8-email welcome sequence
- [ ] Write sales page outline
- [ ] Collect testimonials from beta/existing customers

**Week 6:**
- [ ] Build sales page
- [ ] A/B test 2 headline variations
- [ ] Add social proof and FAQs

**Week 7:**
- [ ] Launch sales page to email list
- [ ] Track conversion rate
- [ ] Survey non-buyers for objections

**Week 8:**
- [ ] Optimize sales page based on data
- [ ] Increase ad spend if profitable
- [ ] Build upsell/downsell pages

**Goal:** [X]% list-to-customer conversion, $[X] CPA

---

### MONTH 3: OPTIMIZATION (Retention + Retargeting)
**Week 9:**
- [ ] Build customer onboarding sequence
- [ ] Set up retargeting pixels
- [ ] Create cart abandonment flow

**Week 10:**
- [ ] Launch retargeting ads
- [ ] Implement referral program
- [ ] Build win-back email sequences

**Week 11:**
- [ ] Analyze full funnel metrics
- [ ] Identify biggest leak point
- [ ] A/B test improvement

**Week 12:**
- [ ] Scale what's working
- [ ] Plan month 4 optimizations
- [ ] Document learnings

**Goal:** [X]% increase in LTV, [X]% recovery of lost leads

---

## 🎁 QUICK WINS TO START TODAY

**If you have 1 hour:** Create your lead magnet outline
**If you have 3 hours:** Build your opt-in landing page
**If you have 1 day:** Write your first 3 nurture emails
**If you have 1 week:** Launch your first awareness ad campaign

**The #1 thing to do right now:** [Most important next step based on {sales_goal}]

---

## 💡 PRO TIPS FOR YOUR FUNNEL

**For ${price_point} Products:**
[Specific advice based on price point - e.g., high-ticket needs more trust-building, low-ticket needs volume]

**For {offer_structure} Model:**
[Specific advice based on payment structure - e.g., subscriptions need trial periods, one-time needs urgency]

**Common Mistakes to Avoid:**
- [Mistake 1 specific to this audience]
- [Mistake 2 specific to this price point]
- [Mistake 3 specific to this goal]

**When to Pivot:**
If after 90 days you're not seeing [X metric], consider [specific adjustment]

---

## 📚 RESOURCES & TOOLS

**Ad Platforms:**
- [Platform 1]: Start here (best for {target_audience})
- [Platform 2]: Secondary (if budget allows)

**Email Marketing:**
- [Tool 1]: Good for beginners, $[X]/mo
- [Tool 2]: More advanced, $[X]/mo

**Landing Pages:**
- [Tool 1]: Easy drag-and-drop, $[X]/mo
- [Tool 2]: More customization, $[X]/mo

**Analytics:**
- Google Analytics (free) - Track everything
- [Tool]: Funnel visualization

**Testing:**
- [Tool]: A/B testing
- [Tool]: Heatmaps

---

## ❓ FAQ: IMPLEMENTING YOUR FUNNEL

**Q: What should I build FIRST?**
A: [Specific answer based on {sales_goal} and {existing_assets}]

**Q: How much budget do I need?**
A: Minimum $[X]/month for ads + $[X]/month for tools = $[X] total to start

**Q: How long until I see results?**
A: First lead: [X] days. First sale: [X] days. Profitable funnel: [X] days.

**Q: What if my conversion rates are lower than benchmarks?**
A: [Specific troubleshooting steps]

**Q: Can I skip stages?**
A: [Advice on what's essential vs optional for {price_point}]

---

**Next Step:** Start with the Month 1, Week 1 checklist above. Build momentum with small wins.`,

    temperature: 0.7,
    maxTokens: 4000,

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
