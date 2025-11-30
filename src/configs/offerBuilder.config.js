/**
 * High-Converting Offer Builder - Task 7.2
 */

export const offerBuilderTask = {
  id: 'sales-2',
  name: 'High-Converting Offer Builder',
  description: 'Build an irresistible offer with bonuses, guarantees, and pricing that converts',
  category: 'sales',
  tier: 'free',

  what: 'Create a complete offer package that makes buying a no-brainer. Get product naming ideas, value stacking formulas, bonus recommendations, guarantee templates, pricing psychology tactics, and ready-to-use sales copy. Turn your product into an irresistible offer.',

  why: 'The same product can convert at 1% or 15% based purely on HOW you package and present it. Most entrepreneurs leave money on the table by under-pricing, weak guarantees, and no bonuses. A well-structured offer can 3-5x your conversion rate overnight without changing your product.',

  how: 'Describe your product, the outcome it delivers, and what you can bundle. We\'ll show you exactly how to stack value, price strategically, craft guarantees that eliminate risk, and present your offer in a way that makes buying obvious.',

  form: [
    {
      id: 'core_product',
      type: 'textarea',
      label: 'What\'s Your Core Product?',
      placeholder: 'Example: "A 6-week online course teaching solopreneurs how to automate their marketing. Includes 12 video lessons, 20 templates, and weekly group calls. Gets them from manual everything to 80% automated in 6 weeks."',
      description: 'Describe what customers actually get - deliverables, format, timeline. Focus on WHAT they receive and WHAT it helps them achieve.',
      required: true,
      rows: 3
    },
    {
      id: 'customer_outcome',
      type: 'textarea',
      label: 'What Specific Result Do Customers Get?',
      placeholder: 'Example: "Go from spending 20 hours/week on manual marketing to spending 4 hours/week while actually getting better results. Free up 16 hours to focus on revenue-generating work."',
      description: 'Paint the AFTER picture. Be specific with numbers, timeframes, and measurable outcomes. Avoid vague promises.',
      required: true,
      rows: 2
    },
    {
      id: 'existing_assets',
      type: 'checkboxes',
      label: 'What Can You Bundle as Bonuses?',
      options: [
        { value: 'course', label: 'Training modules or mini-courses' },
        { value: 'templates', label: 'Templates, worksheets, or checklists' },
        { value: 'community', label: 'Private community or group access' },
        { value: 'calls', label: 'Group coaching calls or Q&A sessions' },
        { value: 'tools', label: 'Software access, calculators, or tools' },
        { value: 'content', label: 'Guides, ebooks, reports, or swipe files' },
        { value: 'other', label: 'Other valuable assets you have' }
      ],
      description: 'Select ALL that apply - we\'ll help you decide which make the best bonuses'
    },
    {
      id: 'target_price',
      type: 'number',
      label: 'What Price Do You Want to Charge?',
      placeholder: '297',
      prefix: '$',
      min: 0,
      required: true,
      description: 'Your ideal price in USD. We\'ll show you how to justify and present this price for maximum conversions.'
    },
    {
      id: 'pricing_flexibility',
      type: 'select',
      label: 'What Pricing Options Can You Offer?',
      options: [
        { value: 'fixed', label: 'One price, one option (simplest)' },
        { value: 'tiered', label: 'Good/Better/Best tiers (maximizes revenue)' },
        { value: 'payment-plan', label: 'Payment plan or installments (easier yes)' },
        { value: 'discount', label: 'Early-bird discount that expires (urgency)' },
        { value: 'flexible', label: 'Not sure - suggest best strategy' }
      ],
      required: true,
      description: 'More options usually = more sales, but also more complexity'
    },
    {
      id: 'guarantee_level',
      type: 'select',
      label: 'How Strong Can Your Guarantee Be?',
      options: [
        { value: 'none', label: 'No guarantee (hurts conversions - not recommended)' },
        { value: 'basic', label: 'Basic: 30-day money-back, no questions asked' },
        { value: 'strong', label: 'Strong: 60-90 days + keep all bonuses' },
        { value: 'extreme', label: 'Extreme: Results guarantee or double refund' },
        { value: 'suggest', label: 'Not sure - help me choose' }
      ],
      required: true,
      description: 'Stronger guarantees = higher conversions. The risk is on you, not them.'
    },
    {
      id: 'target_audience_level',
      type: 'select',
      label: 'Who\'s This For?',
      options: [
        { value: 'beginner', label: 'Complete beginners (starting from zero)' },
        { value: 'intermediate', label: 'Some experience (tried before, want better)' },
        { value: 'advanced', label: 'Experts (optimizing, not learning basics)' },
        { value: 'mixed', label: 'Mix of levels (beginners to advanced)' }
      ],
      required: true,
      description: 'Different experience levels need different messaging and bonuses'
    },
    {
      id: 'competitors_price',
      type: 'number',
      label: 'What Do Competitors Charge? (Optional but helpful)',
      placeholder: '497',
      prefix: '$',
      min: 0,
      description: 'If you know competitor pricing, we can help you position yours strategically'
    }
  ],

  ai: {
    template: `You are a conversion copywriter and offer strategist. Create a COMPLETE, ready-to-use offer package.

INPUTS:
Core Product: {core_product}
Customer Outcome: {customer_outcome}
Available Bonus Assets: {existing_assets}
Target Price: {target_price}
Pricing Flexibility: {pricing_flexibility}
Guarantee Level: {guarantee_level}
Audience Experience: {target_audience_level}
Competitor Pricing: {competitors_price}

CRITICAL OUTPUT REQUIREMENTS:
- Provide SPECIFIC copy, not generic templates
- Give EXACT examples they can use immediately
- Make pricing psychology ACTIONABLE
- Include REAL bonus ideas based on their assets
- Format for easy scanning (emojis, bullets, short sections)

Generate this structure:

# 🎁 YOUR HIGH-CONVERTING OFFER

## 1. PRODUCT NAMING IDEAS

Your product name should promise an outcome, not describe features.

**Option 1: [Transformation-Focused Name]**
"[Specific outcome] Blueprint" or "[Result] System"
- Example: "Marketing Automation Blueprint" or "16-Hour Freedom System"
- Why it works: Immediately communicates the end result

**Option 2: [Speed/Efficiency Name]**
"The [X]-Day/Week [Outcome] Challenge"
- Example: "The 6-Week Automation Challenge"
- Why it works: Implies speed and accountability

**Option 3: [Unique Mechanism Name]**
"The [Method Name] Method for [Outcome]"
- Example: "The Set-and-Forget Method for Marketing Automation"
- Why it works: Implies a unique, proprietary approach

**Option 4: [Audience-Specific Name]**
"[Audience]'s Guide to [Outcome]"
- Example: "The Solopreneur's Guide to Marketing Automation"
- Why it works: Makes them feel seen and understood

**RECOMMENDED:** [Pick the best option for their {target_audience_level} and {customer_outcome}]

---

## 2. POSITIONING STATEMENT (Use This Everywhere)

### One-Sentence Pitch
"[Product Name] helps [specific audience] achieve [specific outcome] in [timeframe] without [main pain point they want to avoid]."

**YOUR VERSION:**
"[Write specific version using their {core_product} and {customer_outcome}]"

### 30-Second Elevator Pitch
"Most [audience] struggle with [problem]. They've tried [common failed solutions], but [why those don't work]. [Product Name] uses [unique approach] to help you [achieve outcome] in [timeframe]. We've helped [X] people [get specific result]."

**YOUR VERSION:**
[Write complete elevator pitch using their inputs]

---

## 3. VALUE PROPOSITION HIERARCHY

### PRIMARY VALUE PROP (Lead with this):
"[The ONE biggest benefit - the transformation they want most]"

**YOUR PRIMARY VP:**
"[Create based on {customer_outcome} - make it specific and compelling]"

### SUPPORTING VALUE PROPS (Use in bullet points):
✓ **Speed:** "[How fast they get results compared to alternatives]"
✓ **Ease:** "[How simple/easy it is - remove fear of complexity]"
✓ **Proof:** "[Social proof or guarantee - remove risk]"

**YOUR SUPPORTING VPs:**
1. [Speed benefit based on their outcome]
2. [Ease benefit based on their audience level]
3. [Proof benefit based on their guarantee]

### DIFFERENTIATION (Why You, Not Competitors):
"Unlike [typical solutions/competitors] that [what they do wrong], [Product Name] [what you do differently] which means [benefit to customer]."

**YOUR DIFFERENTIATION:**
[Write based on {competitors_price} and their unique approach]

---

## 4. VALUE STACK (Make {target_price} Feel Like a Steal)

### The Formula: Core + Bonuses = 5-10x Your Price

**CORE OFFER:** {target_price} Value
[Describe what's included in {core_product}]

Based on your available assets ({existing_assets}), here are your best bonuses:

**BONUS #1: [Name Based on Available Assets]**
- **Value:** $[X] (2-3x your main price)
- **What it is:** [Specific asset from their list]
- **Why include it:** Solves [related problem] and increases perceived value
- **Urgency angle:** "Only included for first [X] buyers" OR "Removed after [date]"

**BONUS #2: [Complementary Asset]**
- **Value:** $[X]
- **What it is:** [Another asset that complements bonus 1]
- **Why include it:** Removes obstacle to implementing core product
- **Urgency angle:** [How to create scarcity]

**BONUS #3: [Quick-Win Bonus]**
- **Value:** $[X]
- **What it is:** [Something that delivers fast result]
- **Why include it:** Immediate gratification - proves value quickly
- **Urgency angle:** [Limited quantity or time-based]

**BONUS #4 (Optional): [Community/Support]**
- **Value:** $[X]/month (position as ongoing value)
- **What it is:** Access to [community, calls, or ongoing support]
- **Why include it:** Increases retention and lifetime value
- **Urgency angle:** "Lifetime access locked at this price"

### VALUE STACK MATH:
- Core Product: {target_price}
- Bonus 1: $[X]
- Bonus 2: $[X]
- Bonus 3: $[X]
- Bonus 4: $[X]
- **TOTAL VALUE: $[Sum it up]**

**YOUR INVESTMENT TODAY: {target_price}**
**YOU SAVE: $[Total - Price]**

### HOW TO PRESENT THIS:
"When you invest in [Product Name] today, you get:

✓ [Core product] (Value: {target_price})
✓ [Bonus 1 name] (Value: $X)
✓ [Bonus 2 name] (Value: $X)
✓ [Bonus 3 name] (Value: $X)

**Total Value: $[X]**
**Your Investment: {target_price}**

That's [X]% off the total value - but only if you act now."

---

## 5. PRICING PSYCHOLOGY TACTICS

### For {target_price} Products:
[Provide specific tactics based on their price point]

**IF PRICE < $100:** Volume play, impulse buy
- Frame as: "Less than [daily coffee/lunch out/Netflix]"
- Payment: One-time only, don't offer payment plans
- Urgency: Flash sales, 24-hour deals

**IF PRICE $100-$500:** Justification + value
- Frame as: "Pays for itself when you [first win]"
- Payment: Offer optional payment plan (2-3 months)
- Urgency: Bonuses expire, price increase soon

**IF PRICE $500-$2000:** High-value decision
- Frame as: "Investment with [X]x ROI in [timeframe]"
- Payment: Definitely offer payment plan (3-6 months)
- Urgency: Limited cohort size, application-based

**IF PRICE > $2000:** Major commitment
- Frame as: "Strategic investment in [business/future]"
- Payment: Flexible plans required (6-12 months)
- Urgency: Personalized, application-only access

### YOUR PRICING STRATEGY:
**Price Framing:**
- Daily cost: "Just $[{target_price}/365] per day"
- Alternative cost: "Less than [what they'd spend on alternative]"
- ROI framing: "This pays for itself when you [achieve X from {customer_outcome}]"

**Payment Options ({pricing_flexibility}):**
[Recommend specific payment structure based on their selection]

**Anchoring Tactics:**
1. Show total value ($[X]) first, then reveal price ({target_price})
2. Compare to cost of NOT solving problem: "Staying stuck costs you $[X] per month"
3. [If competitors_price provided] Compare to competitor pricing: "Others charge {competitors_price} for similar"

---

## 6. GUARANTEE STRATEGY ({guarantee_level})

### YOUR RECOMMENDED GUARANTEE:

[Based on {guarantee_level}, provide specific guarantee copy]

**IF BASIC (30-day money-back):**
### The Simple Guarantee

"Try [Product Name] risk-free for 30 days. If you don't [specific outcome], just email us and we'll refund every penny. No questions asked."

**IF STRONG (60-90 day + keep bonuses):**
### The Confident Guarantee

"We're so confident [Product Name] will [deliver outcome] that we'll give you [60-90] full days to try it. If you're not completely satisfied for ANY reason, we'll refund your investment - and you KEEP all the bonuses (worth $[X]) as our thank you for trying."

**Why this works:** Removes all risk + shows extreme confidence + they still get value even if they refund

**IF EXTREME (Results or double refund):**
### The Extreme Guarantee

"If you implement [Product Name] and don't [achieve specific measurable result] within [timeframe], we won't just refund you - we'll refund DOUBLE your investment. That's how confident we are."

**WARNING:** Only use if you have proof this works for most people. This is a bold claim.

**IF SUGGEST:**
For {target_price} products targeting {target_audience_level} audience, we recommend: [STRONG guarantee]

### HOW TO PRESENT YOUR GUARANTEE:

**Headline:** "Our [X]-Day [Type] Guarantee"

**Copy:**
"[Insert guarantee copy above]

Here's why we can make this guarantee: [Reason - results you've seen, confidence in product, track record].

The risk is entirely on us. All you have to do is show up and implement.

[CTA: Try it risk-free now]"

---

## 7. URGENCY & SCARCITY (Ethical Tactics)

### Real Scarcity (Use These):

**1. LIMITED ENROLLMENT**
"Only accepting [X] students this cohort to ensure quality support."
- **Why it works:** People value exclusivity
- **How to prove it:** Close enrollment publicly when reached

**2. TIME-BASED DEADLINE**
"Enrollment closes [specific date and time]. After that, you'll have to wait until [next opening]."
- **Why it works:** Forces decision, prevents procrastination
- **How to prove it:** Actually close enrollment

**3. PRICE INCREASE**
"Founding member pricing ends [date]. Price increases to $[higher] after launch period."
- **Why it works:** Rewards early action
- **How to prove it:** Actually increase price on schedule

**4. BONUS REMOVAL**
"[Specific bonus worth $X] only included for first [X] buyers / until [date]."
- **Why it works:** FOMO on specific value
- **How to prove it:** Remove bonus as stated

### Urgency Copy Examples:

**COUNTDOWN TIMER:**
"[Product Name] at {target_price} ends in: [Timer]
After that, it's {target_price * 1.3} forever."

**ENROLLMENT CAP:**
"[X/Y] spots filled. Only [Y-X] remaining before we close enrollment."

**BONUS EXPIRATION:**
"Claim [Bonus Name] (worth $X) - available for next [X] buyers only."

### CRITICAL RULE:
**NEVER fake scarcity.** If you set a deadline, stick to it. If you say limited spots, actually limit them. Fake scarcity destroys trust forever.

---

## 8. OBJECTION PRE-HANDLING

Address these BEFORE they ask:

### "Is this worth {target_price}?"
**PRE-HANDLE ON SALES PAGE:**
- Show value stack (total value $[X] vs price {target_price})
- Include ROI calculator or case study
- Testimonial about "best investment I made"

**COPY:**
"Is [Product Name] worth {target_price}? Here's the math: [Quick ROI calculation based on {customer_outcome}]. This pays for itself when you [specific first win]."

### "Will this actually work for me?"
**PRE-HANDLE:**
- Address {target_audience_level} specifically
- Show results from similar people
- Guarantee removes all risk

**COPY:**
"This works for [specific audience type] at [their experience level]. Here's proof: [Testimonial from similar person]. Plus, our [guarantee] means you risk nothing."

### "I don't have time to implement this"
**PRE-HANDLE:**
- Emphasize speed/efficiency
- Show time required (be honest)
- Promise quick wins

**COPY:**
"Time commitment: [X hours/week for Y weeks]. Get your first win in [timeframe]. If you don't have [X hours/week], this might not be for you - and that's okay."

### "I can figure this out myself / find it free online"
**PRE-HANDLE:**
- Acknowledge free info exists
- Position as "shortcut" and "proven path"
- Value time vs money

**COPY:**
"Could you figure this out yourself? Maybe. In [X months/years]. Or you could [get result] in [your timeframe] with a proven system. Your time is worth more than {target_price}."

### "I'm worried about [specific concern]"
**PRE-HANDLE:**
- FAQ section addressing top 5-7 concerns
- Video testimonials addressing objections
- Guarantee that covers their worry

**COPY:**
"Common questions:
- [Question 1 based on {target_audience_level}]: [Answer]
- [Question 2 about results]: [Answer with proof]
- [Question 3 about guarantee]: [Answer emphasizing no risk]"

---

## 9. SALES PAGE STRUCTURE

### THE WINNING FLOW:

**ABOVE THE FOLD (First Screen):**
- **Headline:** "[Specific outcome] in [timeframe] for [audience type]"
- **Subheadline:** "Even if [common obstacle they fear]"
- **Visual:** Product image or result screenshot
- **CTA Button:** "Yes, I Want [Main Benefit]!" + trust line below

**EXAMPLE FOR YOU:**
- Headline: "[Outcome from {customer_outcome}]"
- Subheadline: "[Address main pain point]"
- CTA: "[Benefit-driven button text]"

**SCROLL SECTION 1: Problem Agitation (0-25% down page)**
- "Are you struggling with [pain 1]?"
- "Have you tried [failed solution 1] and [failed solution 2]?"
- "It's not your fault. Here's why [typical approaches don't work]..."

**SCROLL SECTION 2: Solution Introduction (25-35%)**
- "Introducing [Product Name]"
- "[One sentence value prop]"
- "Here's how it's different: [unique mechanism]"

**SCROLL SECTION 3: How It Works (35-45%)**
- "It's simple: [3-step process]"
- Step 1: [What they do]
- Step 2: [What they do]
- Step 3: [Result they get]

**SCROLL SECTION 4: Social Proof #1 (45-55%)**
- 3-5 testimonials with:
  - Photo + name + credential
  - Specific result (numbers!)
  - Before → After context

**SCROLL SECTION 5: Value Stack (55-65%)**
- "When you join today, you get:"
- [List core + all bonuses with values]
- "Total Value: $[X]"
- "Your Investment: {target_price}"
- **BIG CTA BUTTON**

**SCROLL SECTION 6: Guarantee (65-75%)**
- Bold headline: "Our [X]-Day Guarantee"
- [Guarantee copy]
- Visual: Badge or seal
- "You risk nothing. We risk everything."

**SCROLL SECTION 7: FAQ (75-85%)**
- 7-10 questions addressing objections
- Format: Q: [Question] A: [Answer that sells]

**SCROLL SECTION 8: Social Proof #2 (85-90%)**
- More testimonials
- Case studies with numbers
- Media mentions if you have them

**SCROLL SECTION 9: Final CTA (90-100%)**
- **Urgency reminder:** "[Deadline] / [X spots left]"
- **Guarantee reminder:** "Risk-free for [X] days"
- **MASSIVE CTA BUTTON:** "[Benefit-driven text]"

---

## 10. CTA COPY THAT CONVERTS

### Button Text Options (Test These):

**BENEFIT-DRIVEN:**
✓ "Yes, I Want to [Specific Outcome]!"
✓ "Get [Main Benefit] Now"
✓ "Start [Achieving Result] Today"

**URGENCY-DRIVEN:**
✓ "Claim My Spot Before [Deadline]!"
✓ "Lock In {target_price} Pricing Now"
✓ "Get [Bonus] Before It's Gone"

**RISK-REVERSAL:**
✓ "Try It Risk-Free for [X] Days"
✓ "Get Started - Guaranteed Results"
✓ "Start My [X]-Day Trial"

**YOUR RECOMMENDED CTA:**
Primary: "[Best option for {pricing_flexibility} and {guarantee_level}]"
Secondary: "[Alternative for retargeting]"
Final: "[Urgency-focused for last CTA]"

### Supporting Text (Under Button):

"[Icon] [Guarantee summary - e.g., '60-day money back guarantee']
[Icon] [Social proof - e.g., 'Join 2,847 others']
[Icon] [Instant access - e.g., 'Get immediate access']"

---

## 11. PSYCHOLOGICAL TRIGGERS TO INCLUDE

### ✅ AUTHORITY
- Your credentials: "[Years experience / certifications / media mentions]"
- Case studies: "We've helped [X] people achieve [result]"
- Media: "As featured in [publications]" (if applicable)

### ✅ SOCIAL PROOF
- **Numbers:** "[X] customers served" or "[X] copies sold"
- **Testimonials:** Minimum 5-7 with photos and specific results
- **Ratings:** "4.9/5 stars from [X] reviews"

### ✅ RECIPROCITY
- Free value before ask: "Download free [lead magnet] first"
- Bonuses: "You get [bonus worth $X] for free"
- Over-deliver: "Expected [X], get [X + Y + Z]"

### ✅ COMMITMENT & CONSISTENCY
- Small yes → big yes: Start with email opt-in, then offer
- Micro-commitments: Quiz, survey, or planning tool before purchase
- Identity: "Join [X] others who [identity]"

### ✅ LIKING
- Story: Share your origin story or why you created this
- Shared values: "Built for [people like you] who [value]"
- Personality: Let your voice come through (don't sound corporate)

### ✅ SCARCITY
- Time: "[X] hours until price increases"
- Quantity: "Only [X] spots left"
- Access: "Accepting [X] people per cohort"

---

## 12. MESSAGING ANGLES TO TEST

Test these in ads, emails, and landing pages:

**ANGLE 1: Transformation Before → After**
"Go from [current pain state] to [desired outcome] in [timeframe]."

**Example for you:**
"Go from [before state from {customer_outcome}] to [after state] in [timeline from {core_product}]."

**ANGLE 2: Speed & Efficiency**
"The fastest way to [outcome] without [common time sink]."

**Example for you:**
"The fastest way to [outcome] without [obstacle they fear from pain points]."

**ANGLE 3: Simplification**
"The simple [X]-step system to [result] - no [complex thing] required."

**Example for you:**
"The simple [X]-step system to [outcome] - no [technical skill] required."

**ANGLE 4: Social Proof**
"Join [X] others who [achieved specific result]."

**Example for you:**
"Join [X] [target audience] who [specific result from {customer_outcome}]."

**ANGLE 5: Problem Agitation**
"Still [struggling with pain]? Here's the real reason why + how to fix it for good."

**Example for you:**
"Still [main pain point]? Here's why [typical solutions don't work] + [your solution]."

---

## 13. TIERED PRICING STRATEGY ({pricing_flexibility})

[If they selected 'tiered' or 'flexible', provide this section]

### Good/Better/Best Pricing Structure:

**TIER 1: "STARTER" (Entry Level)**
- Price: $[{target_price} × 0.6] (60% of main price)
- What's included: Core product only, no bonuses
- Best for: Budget-conscious buyers, testing waters
- Expected: 20% of sales

**TIER 2: "PROFESSIONAL" (MOST POPULAR)**
- Price: {target_price} ← Your target price
- What's included: Core + Bonuses 1-2
- Best for: Serious buyers who want full value
- Expected: 60% of sales
- **Label this:** "MOST POPULAR" or "BEST VALUE"

**TIER 3: "PREMIUM" (High-End)**
- Price: $[{target_price} × 1.8] (180% of main price)
- What's included: Core + ALL bonuses + [exclusive bonus]
- Best for: People who want everything + VIP treatment
- Expected: 20% of sales
- **Label this:** "BEST RESULTS" or "VIP ACCESS"

### How to Present:

[Visual table comparing all three tiers side by side]
- Middle tier slightly taller or highlighted
- "Most Popular" badge on Tier 2
- Make Tier 3 premium feel exclusive

### Revenue Impact:
With 100 customers:
- All buy Tier 2: 100 × {target_price} = $[X]
- 20/60/20 split: (20 × $[Tier 1]) + (60 × {target_price}) + (20 × $[Tier 3]) = $[X]
- **Potential increase: [X]%** just from offering tiers!

---

## 14. IMPLEMENTATION CHECKLIST

Use this to build your offer:

**STEP 1: NAMING & POSITIONING (30 minutes)**
- [ ] Choose product name from options above
- [ ] Write positioning statement
- [ ] Draft elevator pitch
- [ ] Test with 3-5 people for clarity

**STEP 2: VALUE STACK (1 hour)**
- [ ] List everything in core product
- [ ] Assign value to core ({target_price})
- [ ] Choose 3-4 bonuses from available assets
- [ ] Assign credible values to bonuses
- [ ] Calculate total value (aim for 5-10x price)

**STEP 3: PRICING & GUARANTEE (30 minutes)**
- [ ] Set final price ({target_price})
- [ ] Decide on payment options
- [ ] Write guarantee copy
- [ ] Calculate payment plan options if applicable

**STEP 4: URGENCY & SCARCITY (30 minutes)**
- [ ] Choose scarcity type (enrollment cap, deadline, etc.)
- [ ] Set specific numbers/dates
- [ ] Write urgency copy
- [ ] Plan how to enforce (be ethical!)

**STEP 5: SALES PAGE (2-4 hours)**
- [ ] Write headline + subheadline
- [ ] Draft all 9 scroll sections
- [ ] Collect/create testimonials
- [ ] Write FAQ (7-10 questions)
- [ ] Design value stack visual
- [ ] Add CTAs in 3+ places
- [ ] Add guarantee badge/visual

**STEP 6: TEST & OPTIMIZE (Ongoing)**
- [ ] Launch to small audience first
- [ ] Track conversion rate
- [ ] Survey non-buyers for objections
- [ ] A/B test headline
- [ ] A/B test CTA copy
- [ ] Adjust based on feedback

---

## 15. CONVERSION BENCHMARKS

Set these targets:

**For {target_price} Products:**

**Cold Traffic (From Ads):**
- Landing page opt-in: 20-40%
- Email sequence → Sales page: 10-20% click rate
- Sales page → Purchase: 2-5%
- **Overall:** 100 visitors → 2-5 customers

**Warm Traffic (Email List):**
- Email → Sales page: 15-30% click rate
- Sales page → Purchase: 5-15%
- **Overall:** 100 subscribers → 5-15 customers

**What to Optimize:**
- If opt-in low (<20%): Improve lead magnet value prop
- If clicks low (<10%): Improve email sequence, add urgency
- If sales low (<2%): Improve offer presentation, guarantee, or price

---

## 🎁 QUICK WINS

**In 1 hour:** Write your value stack and calculate total value vs price
**In 3 hours:** Draft complete sales page outline with all 9 sections
**In 1 day:** Build minimum viable sales page and test with 10 people
**In 1 week:** Launch to small audience, collect data, optimize

**START HERE:** [Based on {pricing_flexibility} and {guarantee_level}, recommend exact first step]

---

## 💡 PRO TIPS FOR YOUR OFFER

**For {target_price} Price Point:**
[Specific advice based on their price - e.g., under $100 = volume game, over $1000 = high-touch]

**For {target_audience_level} Audience:**
- Beginners: Over-explain, promise hand-holding, focus on "no experience needed"
- Intermediate: Show advanced tactics, promise optimization, focus on "level up"
- Advanced: Emphasize cutting-edge, exclusive access, focus on "insider secrets"

**For {pricing_flexibility} Model:**
[Advice specific to their pricing choice]

**Common Mistakes:**
1. Weak guarantee = leaving money on table (go stronger!)
2. Generic bonuses = no impact (make them specific to outcome)
3. No urgency = people procrastinate forever (add real deadline)

---

## 📊 TRACK THESE METRICS

**Offer Performance:**
- Conversion rate (visitors → buyers)
- Average order value
- Cart abandonment rate
- Refund rate

**Messaging Performance:**
- Which angle converts best (test 3-5)
- Which guarantee works (if testing multiple)
- Which tier sells most (if using tiers)

**Optimization Opportunities:**
- Exit intent popup (recover 5-15% of leaving visitors)
- Retargeting ads (bring back 10-30% of non-buyers)
- Email follow-up (convert 5-20% more over 7 days)

---

**Next Step:** Start with the Implementation Checklist Step 1. Choose your product name and write your positioning statement. That's your foundation for everything else.`,

    temperature: 0.8,
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
    exportFilename: 'offer-structure',
    displayFormat: 'text',
    editable: true,
    deletable: true,
    exportable: true,
    copyable: true
  },

  help: {
    examples: [
      {
        scenario: 'Building offer for $297 online course',
        input: { core_product: '8-week course with 24 video lessons on email marketing', customer_outcome: 'Build email list from 0 to 1000 subscribers and make first $5K', target_price: 297, existing_assets: ['templates', 'community', 'content'], pricing_flexibility: 'payment-plan', guarantee_level: 'strong' },
        output: 'Complete offer package: product naming options ("Email Growth Blueprint"), value stack totaling $1,847 (course $297 + email templates $497 + private community $997/year + swipe file $197), 3-pay option at $99/month, 60-day guarantee with bonus retention, urgency via founding member pricing deadline, sales page structure with 9 sections, and 5 CTA variations tested for conversion.'
      },
      {
        scenario: 'Packaging consulting offer with tiered pricing',
        input: { core_product: 'Monthly marketing consulting for B2B SaaS', customer_outcome: 'Generate 50 qualified leads per month', target_price: 3000, pricing_flexibility: 'tiered', guarantee_level: 'basic' },
        output: 'Good/Better/Best tier structure: Starter $1,800 (monthly calls only), Professional $3,000 (calls + strategy docs + implementation), Premium $5,400 (full-service + priority support). Value stacking showing $8K+ monthly value at Professional tier, positioning statement for each audience segment, guarantee copy for B2B context, objection pre-handling for FAQ section, and ROI calculator showing breakeven after 2 clients.'
      }
    ],
    commonMistakes: [
      'Weak value stacking - core product $500, one mediocre bonus worth $50, total "value" $550. Stack should be 5-10x your price with genuinely valuable bonuses that support the main offer.',
      'Generic product naming - calling it "Marketing Course" instead of outcome-focused "90-Day List Building System." Name should promise the transformation, not describe the format.',
      'Wimpy guarantees - no guarantee or weak "15-day money back." Strong guarantees (60-90 days, keep bonuses) dramatically increase conversion and rarely increase refunds.',
      'No strategic pricing - picking random numbers. Use psychology: $997 converts better than $1000, payment plans increase sales 30-50%, tiered pricing captures more buyer types.',
      'Buried CTAs - one "buy now" button at the bottom. Include minimum 3 CTAs: above fold, after value stack, and final section. Each additional CTA increases conversion 5-10%.',
      'Not testing urgency - evergreen offers with no deadline or scarcity underperform. Add real deadlines (enrollment closes Friday), limited spots (30 per cohort), or price increases (early bird ends).'
    ]
  }
}
