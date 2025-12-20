/**
 * Objection Handling Script Generator - Task 7.3
 */

export const objectionHandlingTask = {
  id: 'sales-3',
  name: 'Objection Handling Chatbot',
  description: 'Practice handling sales objections with AI feedback and instant coaching',
  category: 'sales',
  tier: 'free',

  what: 'Interactive chatbot practice tool for handling objections. Get real-time feedback on your responses with scoring, technique detection, and coaching tips. Practice 5-objection sessions with scalable difficulty levels.',

  why: 'Most sales are lost because reps don\'t know how to handle objections confidently. Interactive practice is 3x more effective than reading scripts. This chatbot provides a safe space to learn and improve your objection handling skills.',

  how: 'Choose your difficulty level (beginner/intermediate/advanced) and sales channel (phone/email/chat). You\'ll receive 5 realistic objections. Respond to each one, get instant feedback on what techniques you used, see the best-practice response, and read coaching tips. Track your progress and practice again to improve.',

  customComponent: 'ObjectionHandlingChatbot',

  form: [
    {
      id: 'product_type',
      type: 'select',
      label: 'Product Type',
      options: [
        { value: 'digital-product', label: 'Digital product (course, ebook, software)' },
        { value: 'service', label: 'Service (coaching, consulting, agency)' },
        { value: 'physical-product', label: 'Physical product' },
        { value: 'membership', label: 'Membership/Subscription' },
        { value: 'event', label: 'Event/Workshop' }
      ],
      required: true
    },
    {
      id: 'price_range',
      type: 'select',
      label: 'Price Range',
      options: [
        { value: 'under-100', label: 'Under $100' },
        { value: '100-500', label: '$100 - $500' },
        { value: '500-2000', label: '$500 - $2,000' },
        { value: '2000-10000', label: '$2,000 - $10,000' },
        { value: 'over-10000', label: 'Over $10,000' }
      ],
      required: true,
      description: 'Price affects objection types and handling approaches'
    },
    {
      id: 'target_audience',
      type: 'textarea',
      label: 'Target Audience',
      placeholder: 'Who are you selling to? (role, industry, experience level)',
      required: true,
      rows: 2
    },
    {
      id: 'sales_method',
      type: 'select',
      label: 'Primary Sales Method',
      options: [
        { value: 'sales-page', label: 'Sales page/website' },
        { value: 'email', label: 'Email sequence' },
        { value: 'calls', label: 'Sales calls/demos' },
        { value: 'chat', label: 'Chat/DM sales' },
        { value: 'in-person', label: 'In-person sales' }
      ],
      required: true,
      description: 'Different channels require different objection handling approaches'
    },
    {
      id: 'common_objections',
      type: 'textarea',
      label: 'Common Objections You Face',
      placeholder: 'List objections you hear most often (e.g., "too expensive", "need to think about it", "already tried something similar")',
      required: true,
      rows: 3,
      description: 'The more specific, the better the scripts'
    },
    {
      id: 'unique_advantages',
      type: 'textarea',
      label: 'Unique Advantages/Proof Points',
      placeholder: 'What sets you apart? (results, credentials, guarantees, testimonials, unique method)',
      rows: 3,
      description: 'What can you use to overcome skepticism?'
    }
  ],

  ai: {
    template: `Create objection handling scripts based on:

Product Type: {product_type}
Price Range: {price_range}
Target Audience: {target_audience}
Sales Method: {sales_method}
Common Objections: {common_objections}
Unique Advantages: {unique_advantages}

Generate comprehensive objection handling resources:

## 1. TOP 10 OBJECTIONS & RESPONSES

For each objection, provide:
- The objection (exact words prospects use)
- Why they're really saying this (underlying concern)
- Response script (2-3 variations)
- Follow-up questions to ask

**Objection 1: "It's too expensive"**
*Real Concern:* [Underlying fear]
*Response Script:*
- Option A: [Frame value, not price]
- Option B: [Compare to cost of not solving problem]
- Option C: [Break down to daily/monthly cost]
*Follow-up:* [Question to continue conversation]

**Objection 2: "I need to think about it"**
*Real Concern:* [What's really holding them back]
*Response Script:*
- Option A: [Isolate the real objection]
- Option B: [Create urgency without pressure]
- Option C: [Offer to think through it together]
*Follow-up:* [Next step question]

[Continue for all 10 most common objections, including those from user's list]

## 2. OBJECTION PREVENTION FRAMEWORK

**In Your Sales Copy/Pitch:**
Address objections BEFORE they're voiced:

- Price objection → [Value stack, ROI calculator, payment plans]
- Time objection → [Efficiency promise, time commitment clarity]
- Trust objection → [Guarantee, social proof, credentials]
- "Will this work for me?" → [Case studies, specific results]
- Competition objection → [Differentiation, unique mechanism]

**Specific Copy to Add:**
[3-5 copy blocks that preemptively handle objections]

## 3. REFUND & GUARANTEE SCRIPTS

**When they ask about refunds:**
"[Script that reinforces confidence while explaining guarantee]"

**When they want to cancel/refund:**
"[Empathetic retention script with alternative solutions]"

**Guarantee positioning:**
"[How to present guarantee as proof of confidence, not weakness]"

## 4. URGENCY WITHOUT PRESSURE

**Scarcity Framing:**
- "This isn't about pressure, it's about [real reason for deadline]"
- "I want to be transparent about [honest scarcity]"

**When they say "I'll come back later":**
"[Script acknowledging their timeline while creating incentive to act now]"

**Deadline enforcement:**
"[How to hold boundaries on bonuses/pricing without seeming pushy]"

## 5. COMPETITOR COMPARISON RESPONSES

**"I'm already using [Competitor]"**
- Response: "[Acknowledge competitor, highlight differentiation]"
- Don't bash competitors, elevate your unique approach

**"I saw [Competitor] for cheaper"**
- Response: "[Explain value difference, not just price difference]"

**"Why shouldn't I just [DIY solution]?"**
- Response: "[Time vs money, complexity, speed to results]"

## 6. PRICE JUSTIFICATION FRAMEWORKS

**For High Prices ($2K+):**
- ROI Calculator: "This pays for itself when [specific outcome]"
- Cost of Inaction: "Not solving this costs you [X] per month"
- Investment Framing: "This isn't an expense, it's an investment in [outcome]"

**For Payment Plan Requests:**
- "[How to present payment plans without devaluing offer]"

**For Discount Requests:**
- "[Script that maintains price integrity while offering value]"

## 7. CLOSING TECHNIQUES

**Trial Close:**
"[Question that gauges readiness without being pushy]"

**Assumptive Close:**
"[Language that assumes the sale while giving them an out]"

**Alternative Close:**
"[Two options, both involving buying - tier selection, timing, etc.]"

**Direct Close:**
"[Simple, confident ask for the sale]"

## 8. FAQ BUILDER

Top 10 questions to proactively answer on sales page/in emails:

1. Q: [Most common question]
   A: [Answer that reinforces value]

2. Q: "How long does it take to see results?"
   A: [Realistic timeline with quick win callout]

3. Q: "What if it doesn't work for me?"
   A: [Guarantee reinforcement]

[Continue for 10 questions based on common objections]

Format as ready-to-use scripts with specific wording, not just frameworks.`,

    temperature: 0.7,
    maxTokens: 2500,

    // SSOT Phase 5: Removed contextProvider - project context auto-injected from projectStore
  },

  output: {
    enabled: true,
    exportFilename: 'objection-handling-scripts',
    displayFormat: 'text',
    editable: true,
    deletable: true,
    exportable: true,
    copyable: true
  },

  // PHASE 1: Chatbot Data Structure
  // Interactive practice objections with difficulty levels and coaching
  objections: [
    // PRICE/BUDGET OBJECTIONS (8 variants, difficulty 1-2)
    {
      id: 'price-1',
      category: 'price',
      difficulty: 1,
      channel: ['phone', 'email', 'chat'],
      scenarios: [
        "I can't justify the cost right now.",
        "The budget's tight this quarter.",
        "Can we revisit this when we have more budget?"
      ],
      bestPracticeResponse: "I understand cost is a concern. Think of this as an investment—most customers save $50K in the first year by reducing manual work. In fact, 90% of our enterprise clients hit ROI in the first quarter.",
      techniquesUsed: ['reframing', 'socialProof'],
      coachingTip: "Price objections are usually about perceived value, not actual price. Lead with value reframing (investment, ROI, savings) then reinforce with social proof (customer results).",
      successCriteria: "User mentions ROI/savings, social proof, or alternative/smaller option"
    },
    {
      id: 'price-2',
      category: 'price',
      difficulty: 1,
      channel: ['phone', 'email', 'chat'],
      scenarios: [
        "Your competitor charges half as much.",
        "I found a cheaper alternative.",
        "Can you match their price?"
      ],
      bestPracticeResponse: "Great observation. You're right—they charge less. But here's the difference: we guarantee 2x faster implementation and include 90 days of support. Plus, our customers report $150K average annual savings from the efficiency gains. Would you rather save $5K upfront or make $150K back in value?",
      techniquesUsed: ['reframing', 'proof', 'personalization'],
      coachingTip: "Never drop your price to match competitors. Instead, reframe the value equation: faster implementation, better support, proven outcomes. Help them see total cost of ownership, not just price.",
      successCriteria: "User acknowledges value difference, agrees to demo, or stops pushing on price"
    },
    {
      id: 'price-3',
      category: 'price',
      difficulty: 2,
      channel: ['phone', 'email', 'chat'],
      scenarios: [
        "We need a discount to make this work.",
        "What's your best price?",
        "Can you knock 20% off?"
      ],
      bestPracticeResponse: "I appreciate you asking. Here's my approach: rather than cutting price and devaluing the offer, let's find a path that works. What if we started with the Starter plan at 60% of the Enterprise cost, prove ROI in 90 days, then upgrade when you see the results? That way you get risk-free proof before committing.",
      techniquesUsed: ['alternative', 'credibility', 'proof'],
      coachingTip: "Discounts train buyers to negotiate. Instead, offer value alternatives: starter plans, pilots, payment plans. This maintains price integrity while lowering barriers.",
      successCriteria: "User accepts starter tier, agrees to pilot, or stops asking for discount"
    },
    {
      id: 'price-4',
      category: 'price',
      difficulty: 2,
      channel: ['phone', 'email', 'chat'],
      scenarios: [
        "This is expensive for what we need.",
        "We only need basic functionality.",
        "Can we get a stripped-down version?"
      ],
      bestPracticeResponse: "Absolutely—let's match the solution to your needs. We actually have a Starter plan that includes the core features you mentioned at half the cost. 40% of our customers start there and upgrade once they see the value. Want to take that path?",
      techniquesUsed: ['alternative', 'socialProof', 'personalization'],
      coachingTip: "Different customers have different needs. Always offer tiered pricing. Make it easy for them to start small and grow with you. This builds loyalty and lifetime value.",
      successCriteria: "User accepts lower tier, agrees to Starter plan, or sees value in starter option"
    },
    {
      id: 'price-5',
      category: 'price',
      difficulty: 2,
      channel: ['phone', 'chat'],
      scenarios: [
        "We need this but the money just isn't there right now.",
        "It's perfect but timing doesn't work financially.",
        "Cost is the only thing holding us back."
      ],
      bestPracticeResponse: "I hear you—timing matters financially. Here's what I'd suggest: we can set up a 30-day pilot at 50% off so you see real results with minimal risk. Meanwhile, every day you wait costs you about $500 in manual work. What if we start now at pilot pricing and you upgrade next month when you see the ROI?",
      techniquesUsed: ['urgency', 'alternative', 'reframing'],
      coachingTip: "Budget delays are real. Don't dismiss them. Instead, offer lower-risk entry points and quantify the cost of waiting. Help them see that NOT investing costs more.",
      successCriteria: "User accepts pilot option, agrees to future upgrade, or commits to timeline"
    },

    // AUTHORITY/CREDIBILITY OBJECTIONS (6 variants)
    {
      id: 'authority-1',
      category: 'authority',
      difficulty: 1,
      channel: ['phone', 'email', 'chat'],
      scenarios: [
        "I've never heard of your company.",
        "You're pretty new, aren't you?",
        "Who else uses you?"
      ],
      bestPracticeResponse: "Fair question. We've served 500+ companies including Stripe, Notion, and Figma. Here are three customer success stories: [link]. Plus, our 98% retention rate shows our customers trust us. Would you like to see a case study from someone in your industry?",
      techniquesUsed: ['socialProof', 'credibility', 'proof'],
      coachingTip: "Trust objections hide deeper concerns. Use specific names, results, and metrics. Case studies beat claims every time. Show, don't tell.",
      successCriteria: "User accepts credibility evidence, requests case study, or stops questioning legitimacy"
    },
    {
      id: 'authority-2',
      category: 'authority',
      difficulty: 1,
      channel: ['phone', 'email', 'chat'],
      scenarios: [
        "You're not as established as [competitor name].",
        "I'd feel more comfortable with [bigger company].",
        "Why should I switch from the established player?"
      ],
      bestPracticeResponse: "I get it—they're more established. But here's the thing: because we're focused and nimble, we often deliver better results faster. Look at [competitor]: they have 10K+ features you don't need. We focus on what actually drives your outcomes. Plus, our customers report 40% faster implementation and 3x better support. Want to compare side-by-side?",
      techniquesUsed: ['reframing', 'differentiation', 'socialProof'],
      coachingTip: "Don't fight established incumbents on size. Instead, reframe: nimble > bloated, focused > feature-heavy, better support > bigger brand. Show specific advantages.",
      successCriteria: "User acknowledges focused advantages, agrees to comparison, or stops defending incumbent"
    },
    {
      id: 'authority-3',
      category: 'authority',
      difficulty: 2,
      channel: ['phone', 'email', 'chat'],
      scenarios: [
        "What if you go out of business?",
        "How do I know you'll still be around in 5 years?",
        "What's your funding situation?"
      ],
      bestPracticeResponse: "Great question—security matters. We're venture-backed with $50M in funding, 7 years profitable, and growing 40% YoY. Our customers' data is encrypted and backed up daily. Plus, we have a data portability guarantee: if we ever shut down, you get your data instantly. Would that put your mind at ease?",
      techniquesUsed: ['credibility', 'proof', 'reassurance'],
      coachingTip: "Viability concerns are legitimate. Show financial stability, growth metrics, and security guarantees. Give them confidence in your longevity.",
      successCriteria: "User accepts security/viability evidence or stops questioning company stability"
    },
    {
      id: 'authority-4',
      category: 'authority',
      difficulty: 2,
      channel: ['phone', 'email', 'chat'],
      scenarios: [
        "What if you don't deliver on your promises?",
        "How's your track record on implementations?",
        "Do you have references from my industry?"
      ],
      bestPracticeResponse: "Absolutely—happy to provide references. We have 15+ case studies from your industry showing average 45% time savings and $250K impact. Here's one from a similar company: [link with real results]. Plus, we offer a 30-day satisfaction guarantee: if you're not seeing results, you get your money back. No risk for you.",
      techniquesUsed: ['socialProof', 'proof', 'credibility'],
      coachingTip: "Delivery concerns are about trust. Use specific case studies, third-party validation, and guarantees. Make it zero-risk for them to say yes.",
      successCriteria: "User reviews case studies, requests references, or agrees to trial"
    },

    // TIMING/URGENCY OBJECTIONS (6 variants)
    {
      id: 'timing-1',
      category: 'timing',
      difficulty: 1,
      channel: ['phone', 'email', 'chat'],
      scenarios: [
        "Now's not a good time.",
        "Can we revisit in Q2?",
        "Let's table this for later."
      ],
      bestPracticeResponse: "I understand timing matters. Here's what I suggest: we could start with a 30-day pilot using your team's downtime, so you're ready to scale after Q1. The longer you wait, the more manual work you're doing that we could eliminate. Can we book 15 minutes next week to explore options?",
      techniquesUsed: ['alternative', 'urgency', 'personalization'],
      coachingTip: "Timing objections often hide budget/authority concerns. Dig deeper: 'What would make now a good time?' Offer smaller commitments (pilot, starter plan) to lower barriers.",
      successCriteria: "User agrees to pilot timeline, schedules meeting, or removes timing barrier"
    },
    {
      id: 'timing-2',
      category: 'timing',
      difficulty: 1,
      channel: ['phone', 'email', 'chat'],
      scenarios: [
        "We're too busy right now.",
        "Our team is slammed with [project].",
        "We don't have capacity to implement this."
      ],
      bestPracticeResponse: "I hear you—team capacity is real. That's actually why this is perfect now. We handle 80% of the implementation. Your team only needs 5 hours for setup. Plus, you'll save 20 hours/week after implementation, freeing up capacity. Could you spare those 5 hours over the next month?",
      techniquesUsed: ['reframing', 'urgency', 'proof'],
      coachingTip: "Busy teams will always feel busy. Show that the solution actually creates capacity. Make it clear that the short-term pain creates long-term gain.",
      successCriteria: "User acknowledges capacity savings or agrees to phased implementation"
    },
    {
      id: 'timing-3',
      category: 'timing',
      difficulty: 2,
      channel: ['phone', 'email', 'chat'],
      scenarios: [
        "We need to do this after [next event/deadline].",
        "Let's wait until after our annual conference.",
        "We're in the middle of a migration—ask us in 6 months."
      ],
      bestPracticeResponse: "I understand the timing concern with [event]. What if we got you set up now while things are steady, so when [event] happens, you have this tool running smoothly? Actually, starting now gives you 90 days to refine workflows before [event]. Many customers wish they'd started earlier. Does that angle work?",
      techniquesUsed: ['reframing', 'urgency', 'credibility'],
      coachingTip: "Upcoming events are convenient excuses. Reframe: starting now means you're READY for that event, not delayed by it. Show how preparation reduces stress.",
      successCriteria: "User agrees to start before event or reschedules sooner"
    },
    {
      id: 'timing-4',
      category: 'timing',
      difficulty: 2,
      channel: ['phone', 'chat'],
      scenarios: [
        "We need to check with [team member] who's on vacation.",
        "Let's wait until [key person] gets back.",
        "I need to align with my team first."
      ],
      bestPracticeResponse: "Smart—alignment matters. Here's what we can do: I'll send you a 2-minute video overview and key talking points. You share it with the team while they're prepping to return. Meanwhile, we can book a 30-minute team sync for next week so everyone's on the same page. That way you're not delaying—you're preparing. Deal?",
      techniquesUsed: ['alternative', 'personalization', 'urgency'],
      coachingTip: "Team alignment delays are common. Make it easy for them to prepare the team. Provide materials, talking points, and templates. Remove friction from the alignment process.",
      successCriteria: "User agrees to team sync or commits to sharing info with team"
    },

    // CAPABILITY/FEATURE OBJECTIONS (4 variants)
    {
      id: 'capability-1',
      category: 'capability',
      difficulty: 2,
      channel: ['phone', 'email', 'chat'],
      scenarios: [
        "Does it integrate with our existing system?",
        "We use [custom system]—do you support that?",
        "Can it connect to our legacy setup?"
      ],
      bestPracticeResponse: "Great question. Our API integrates with 200+ tools. If [their system] isn't on the list yet, we've built custom integrations for 15+ companies with similar setups. For your specific workflow, let me walk through how we've handled similar cases. Can you share your tech stack, and I'll confirm we can support it?",
      techniquesUsed: ['credibility', 'personalization', 'proof'],
      coachingTip: "Integration concerns are legitimate. Don't oversell. Be honest about limitations but emphasize flexibility and customization. Always ask to review their specific setup.",
      successCriteria: "User shares tech stack, requests integration demo, or agrees to technical review"
    },
    {
      id: 'capability-2',
      category: 'capability',
      difficulty: 2,
      channel: ['phone', 'email', 'chat'],
      scenarios: [
        "Can it handle our custom workflows?",
        "Will it work with our unique process?",
        "I'm not sure it has the features we need."
      ],
      bestPracticeResponse: "Perfect concern. Let me ask a few questions about your workflow: [ask about 3 specific steps]. Based on what you're describing, we handle 95% of that natively. For the unique piece, we have a workflow builder. Actually, I want to show you—can we schedule 20 minutes where I walk through your exact workflow? I'm confident we can support it.",
      techniquesUsed: ['personalization', 'credibility', 'proof'],
      coachingTip: "Every customer thinks they're unique. Show you understand their workflow. Then demonstrate flexibility. Schedule a walkthrough to prove it works for them.",
      successCriteria: "User schedules workflow demo or commits to reviewing capabilities"
    },
    {
      id: 'capability-3',
      category: 'capability',
      difficulty: 2,
      channel: ['phone', 'email', 'chat'],
      scenarios: [
        "Will it work for our industry?",
        "Do you have experience with [vertical]?",
        "I need to know you understand our business model."
      ],
      bestPracticeResponse: "Great point. We've worked with 50+ companies in [industry]. Here's what makes [industry] unique: [specific pain points]. We've solved for this in multiple ways depending on company size. Let me show you two case studies from [vertical]—one from a similar-sized company, one from a market leader. Both achieved [specific results].",
      techniquesUsed: ['credibility', 'socialProof', 'proof'],
      coachingTip: "Industry-specific concerns mean they want deep expertise. Prove you understand their vertical. Use case studies from THEIR industry, not generic examples.",
      successCriteria: "User reviews industry case studies or agrees to industry-specific demo"
    },
    {
      id: 'capability-4',
      category: 'capability',
      difficulty: 2,
      channel: ['phone', 'chat'],
      scenarios: [
        "Your product looks good but I'm not sure about reliability.",
        "What's your uptime guarantee?",
        "How do you handle scalability?"
      ],
      bestPracticeResponse: "Excellent question. We guarantee 99.99% uptime—backed by our SLA. We've scaled from 10 customers to 5,000 without performance degradation. Our infrastructure auto-scales, and we run daily backups with redundancy across 3 data centers. Every month we publish a transparency report on uptime and performance. Does our reliability framework put your mind at ease?",
      techniquesUsed: ['credibility', 'proof', 'reassurance'],
      coachingTip: "Technical concerns require technical answers. Provide specific guarantees, metrics, and evidence. Show you've thought about these scenarios.",
      successCriteria: "User accepts reliability evidence or stops questioning technical capability"
    },

    // MULTI-OBJECTION (COMBO) - Advanced difficulty
    {
      id: 'combo-1',
      category: 'combo',
      difficulty: 3,
      channel: ['phone'],
      scenarios: [
        "I like it, but we're not sure about the cost AND timing. Let's revisit in Q2 when budget opens up.",
        "Looks good, but expensive AND we need to check with our team."
      ],
      bestPracticeResponse: "I hear you—cost and timing are both legit concerns. Here's my suggestion: let's start with a 30-day pilot on the starter plan (60% cheaper) to prove value. That way, when Q2 budget opens up, your team will already know what they're getting. For team alignment, I'll send a 2-minute overview and we'll do a 30-minute sync next week. Does that sound like a path forward?",
      techniquesUsed: ['alternative', 'urgency', 'credibility', 'personalization'],
      coachingTip: "Multi-objection calls are harder. Acknowledge ALL concerns but bundle them: 'I'm hearing X, Y, and Z. Here's how we handle all three.' Offer a sequence, not a single solution.",
      successCriteria: "User addresses multiple objections with different techniques, shows confidence handling complexity"
    },
    {
      id: 'combo-2',
      category: 'combo',
      difficulty: 3,
      channel: ['phone'],
      scenarios: [
        "It looks good, but I haven't heard of you AND my team's worried about integration complexity.",
        "Trust your company AND not sure if it integrates with our system AND the cost seems high."
      ],
      bestPracticeResponse: "I appreciate all three concerns—they're all real. Let me address them: First, credibility: we've served 500+ companies with 98% retention. Second, integration: our API handles 200+ integrations and I've done 15+ custom implementations. Your tech stack is actually one we've handled before. Third, cost: let's start with the Starter plan (60% less) for 90 days to prove ROI, then upgrade. Ready to move forward?",
      techniquesUsed: ['socialProof', 'credibility', 'personalization', 'alternative'],
      coachingTip: "Complex objections require confidence and structure. Address each one separately, then offer a bundled solution. This shows you can handle complexity.",
      successCriteria: "User accepts solution addressing all concerns or commits to next step"
    }
  ],

  // Technique definitions for keyword detection and learning
  techniques: {
    reframing: {
      name: 'Value Reframing',
      description: 'Reposition the offer as an investment or cost-saver, not an expense',
      keywords: ['investment', 'saves', 'ROI', 'return', 'cost', 'value', 'worth', 'benefit', 'gain', 'payback'],
      templates: [
        "Think of it as an investment that saves you {time_saved} hours/week",
        "Rather than a cost, this is how we help you {benefit}",
        "The real cost of NOT doing this is {costOfDelay}",
        "You're not paying for software, you're paying for {outcome}"
      ],
      winRate: 0.65
    },
    socialProof: {
      name: 'Social Proof / Credibility',
      description: 'Use customer results, data, case studies, and third-party validation',
      keywords: ['customers', 'companies', 'rate', 'percentage', 'results', 'case study', 'proven', 'trusted', 'success', 'average'],
      templates: [
        "{percentage}% of our {company_type} customers achieve {result}",
        "Companies like {customer1}, {customer2}, and {customer3} trust us",
        "We have a {metric} retention rate because customers see results",
        "Here's a case study from a similar company: {link}"
      ],
      winRate: 0.72
    },
    urgency: {
      name: 'Urgency / Scarcity',
      description: 'Create legitimate time or opportunity pressure',
      keywords: ['sooner', 'longer', 'wait', 'limited', 'now', 'quick', 'hurry', 'seat', 'deadline', 'quarter', 'opportunity', 'cost'],
      templates: [
        "This pricing is locked in for early customers only",
        "The longer you wait, the more you're leaving on the table",
        "Your competitors are already {X}",
        "We have limited bandwidth for new {industry} clients this quarter"
      ],
      winRate: 0.58
    },
    alternative: {
      name: 'Alternative / Smaller Commitment',
      description: 'Lower barriers by offering smaller commitments or flexible options',
      keywords: ['pilot', 'starter', 'option', 'plan', 'smaller', 'phase', 'trial', 'start', 'begin', 'flexibility'],
      templates: [
        "Can't commit to full implementation? Let's start with {smaller_option}",
        "How about we do a 30-day pilot with {limited_scope}?",
        "We offer a {smaller_tier} plan if budget is tight",
        "What if we started with just {one_feature}?"
      ],
      winRate: 0.68
    },
    personalization: {
      name: 'Personalization / Context',
      description: 'Reference their specific situation, industry, or use case',
      keywords: ['your', 'like you', 'similar', 'case', 'workflow', 'example', 'situation', 'specific', 'industry', 'company'],
      templates: [
        "For {industry} companies like you, we typically see {result}",
        "Given your workflow of {process}, here's how we help",
        "I worked with {similar_company} who had the exact same {concern}",
        "In your situation with {context}, the typical ROI is {metric}"
      ],
      winRate: 0.71
    },
    credibility: {
      name: 'Credibility / Trust',
      description: 'Build confidence through credentials, certifications, or track record',
      keywords: ['years', 'experience', 'team', 'certified', 'award', 'served', 'trusted', 'leader', 'expert', 'track'],
      templates: [
        "We're {certification/award}",
        "Our team has {experience_years} years in {field}",
        "We've served {number} companies in your space",
        "We're trusted by industry leaders like {names}"
      ],
      winRate: 0.64
    },
    proof: {
      name: 'Proof / Demonstration',
      description: 'Show evidence through demo, trial, case study, or metrics',
      keywords: ['show', 'demo', 'walk', 'review', 'test', 'try', 'see', 'evidence', 'metrics', 'report', 'benchmark'],
      templates: [
        "Let me show you exactly how it works for {their_scenario}",
        "Here's a case study from {similar_company}: {results}",
        "Our customers report {metric} improvement",
        "Can I give you a 15-minute demo focused on {their_concern}?"
      ],
      winRate: 0.69
    }
  },

  // Coaching by category
  coachingByCategory: {
    price: {
      title: 'Handling Price Objections',
      overview: '70% of deals stall on price. It\'s rarely about actual price—it\'s about perceived value.',
      strategies: [
        '1. Lead with value, not price: "Think of this as investment that saves you $X/year"',
        '2. Reinforce with social proof: "90% of customers hit ROI in Q1"',
        '3. Offer smaller commitment: "Start with a 30-day pilot"',
        '4. Ask deeper: "What number would work?" or "When does budget open up?"'
      ],
      topTechniques: ['reframing', 'socialProof', 'alternative'],
      antiPatterns: [
        '❌ Don\'t just drop your price—teaches them you\'re negotiable',
        '❌ Don\'t get defensive—they have a legitimate concern',
        '❌ Don\'t oversell—leads to buyer\'s remorse and churn'
      ],
      successRate: '65% of reps who lead with reframing convert price objections'
    },

    authority: {
      title: 'Handling Authority Objections',
      overview: 'Trust concerns often hide budget or technical concerns. Address the real fear.',
      strategies: [
        '1. Use specific social proof: Names + results > generic claims',
        '2. Show track record: "500+ companies, 98% retention"',
        '3. Provide case study: "Here\'s a similar company\'s journey"',
        '4. Dig deeper: "What would build your confidence?" or "What do you need to see?"'
      ],
      topTechniques: ['socialProof', 'credibility', 'proof'],
      antiPatterns: [
        '❌ Don\'t make claims without proof—kills credibility',
        '❌ Don\'t compare to established competitors—admit you\'re newer but better',
        '❌ Don\'t ignore it—trust compounds over time'
      ],
      successRate: '72% of reps who show specific social proof convert authority objections'
    },

    timing: {
      title: 'Handling Timing Objections',
      overview: 'Timing is often a smokescreen for budget/authority concerns. Dig deeper.',
      strategies: [
        '1. Ask why: "What needs to happen for now to be a good time?"',
        '2. Create urgency: "Every month you wait costs you $X in missed opportunity"',
        '3. Offer smaller path: "Let\'s do a 30-day pilot now, scale after Q2"',
        '4. Set next step: "Can we schedule 15 minutes next week?"'
      ],
      topTechniques: ['urgency', 'alternative', 'personalization'],
      antiPatterns: [
        '❌ Don\'t just accept "later"—68% of "laters" never close',
        '❌ Don\'t wait passively—they\'ll forget about you',
        '❌ Don\'t make it easy to delay—set deadline for next conversation'
      ],
      successRate: '58% of reps who offer alternatives convert timing objections'
    },

    capability: {
      title: 'Handling Capability Objections',
      overview: 'Capability concerns are about fit. Prove flexibility and customization.',
      strategies: [
        '1. Listen deeply: Ask about their specific workflow/setup',
        '2. Show flexibility: "We handle 95% natively, workflow builder for the rest"',
        '3. Provide proof: Case studies from similar situations',
        '4. Offer assessment: "Let me review your setup to be sure"'
      ],
      topTechniques: ['personalization', 'credibility', 'proof'],
      antiPatterns: [
        '❌ Don\'t oversell capabilities you don\'t have',
        '❌ Don\'t dismiss their concerns—they\'re real',
        '❌ Don\'t schedule a tech call without understanding the issue first'
      ],
      successRate: '68% of reps who show specific capability proof convert these objections'
    },

    combo: {
      title: 'Handling Multi-Objections',
      overview: 'When they object on multiple fronts, acknowledge all concerns then bundle solutions.',
      strategies: [
        '1. List all concerns: "I\'m hearing X, Y, and Z—let me address all three"',
        '2. Address separately: Give specific response to each objection',
        '3. Bundle solution: "Here\'s the path forward that handles all of them"',
        '4. Set next step: Clear action with timeline'
      ],
      topTechniques: ['personalization', 'alternative', 'credibility'],
      antiPatterns: [
        '❌ Don\'t dismiss any concern—they all matter',
        '❌ Don\'t offer a single solution—address each objection type separately',
        '❌ Don\'t rush—complex deals need thoughtful responses'
      ],
      successRate: '55% of reps who handle multi-objections convert (harder category)'
    }
  },

  help: {
    examples: [
      {
        scenario: 'Handling price objection for $2K coaching program',
        input: { product_type: 'service', price_range: '2000-10000', common_objections: ['too expensive', 'need to check with spouse'], sales_method: 'calls' },
        output: 'Objection handling playbook with 10 scripts including "too expensive" (3 response variations focusing on ROI, cost of inaction, payment plans), "need to think about it" (isolating real objection, offering to think through together), competitor comparisons, timing concerns. Includes prevention strategies for sales copy, guarantee positioning scripts, and closing techniques specific to high-ticket coaching.'
      },
      {
        scenario: 'Overcoming trust objections for new SaaS product',
        input: { product_type: 'digital-product', price_range: '100-500', common_objections: ['never heard of you', 'will it work for me?', 'already tried similar tools'], sales_method: 'sales-page' },
        output: 'Objection scripts for sales page and email: social proof positioning ("Join 500+ companies"), differentiation from competitors (unique mechanism explanation), "will it work for me" (case studies for different use cases), trust-building FAQ section, refund guarantee copy that builds confidence, and A/B test suggestions for addressing skepticism before it arises.'
      },
      {
        scenario: 'Interactive chatbot practice for sales team training',
        input: { task: 'objection-handling-chatbot', difficulty: 'beginner' },
        output: 'Practice session with 5 random price/authority objections at beginner difficulty. For each objection, you respond and get instant feedback: "Good! You used reframing (cost of inaction) + social proof (98% retention). That\'s a strong combo." Session tracks which techniques you used, scoring 0-10 per response. After 5 objections, you see stats: techniques used, average score, win rate. Then choose: practice more or try harder objections.'
      }
    ],
    commonMistakes: [
      'Getting defensive about objections - arguing or taking it personally when someone says "too expensive." Objections are buying signals, not rejections. Stay curious and empathetic.',
      'Immediately offering discounts - prospect says "expensive" and you instantly drop price 20%. This trains buyers to object and devalues your offering. First, demonstrate value and ROI.',
      'Not isolating the real objection - accepting "I need to think about it" at face value. Ask: "Just curious, what specifically do you need to think about?" to uncover the true concern.',
      'Talking too much in response - giving 5-minute monologues addressing objections. Keep responses concise (30-60 seconds), then ask a question to continue dialogue.',
      'Not addressing objections proactively - waiting for prospects to raise concerns. Build objection handling into sales copy and pitches to address doubts before they\'re voiced.',
      'Having no structure - winging objection responses differently each time. Document your best responses, practice them, refine based on what works. Consistency improves close rates.',
      'Forgetting to establish next steps - even with perfect responses, if you don\'t lock in the next action, momentum dies. Always: "Great! Let\'s schedule a demo for Thursday."',
      'Not using the right technique for the objection - price objections need value reframing, authority need social proof, timing need urgency or alternatives. Match the technique to the objection type.',
      'Accepting "I need to think about it" - worst response: "Sure, I\'ll follow up next week." Best: "What specifically do you need to think about?" Get to the real objection.',
      'Neglecting to use proof - always have specific examples, case studies, or metrics ready. "We helped similar companies achieve 45% faster implementation" beats "we\'re really good."'
    ],
    proTips: [
      'The "Feel, Felt, Found" framework: "I understand how you feel. Others have felt the same way. But here\'s what they found..." Builds empathy while redirecting.',
      'Use the "Pilot Offer" for hesitation: Turn any "not sure" into a low-risk pilot. 30-day trial, 60% off, starter plan. Removes risk and builds confidence.',
      'Lead with their worst fear: If someone\'s worried about implementation, lead with easy setup. If worried about cost, lead with ROI. Address their concern first.',
      'The "Feel Free to Say No" close: "I want to be transparent—if this doesn\'t feel right, feel free to say no. But if it does, can we move forward?" Takes pressure off, often increases conversions.',
      'Build social proof into your language: Don\'t say "customers like us," say "500+ companies including Stripe and Figma trust us." Numbers and names beat claims.',
      'Always stack techniques: Price objections improve 40% when you combine reframing + social proof. Use 2-3 techniques per objection for max impact.',
      'The "Future pace" close: "Imagine we start this month, 90 days from now you see a 45% time savings. How would that change your business?" Makes it real.',
      'Create scarcity authentically: "We have 2 more enterprise slots this quarter before we pause onboarding" is way better than fake pressure. Truth works.'
    ]
  }
}
