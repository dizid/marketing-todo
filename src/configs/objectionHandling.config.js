/**
 * Objection Handling Script Generator - Task 7.3
 */

export const objectionHandlingTask = {
  id: 'sales-3',
  name: 'Objection Handling Script Generator',
  description: 'Get scripts and frameworks to handle common sales objections with confidence',
  category: 'sales',
  tier: 'free',

  what: 'Generate objection handling scripts for the most common buyer hesitations. Get proven response frameworks for price objections, timing concerns, competitor comparisons, and trust issues. Includes both written and verbal scripts.',

  why: 'Objections aren\'t rejections - they\'re buying signals. Most sales are lost because entrepreneurs don\'t know how to handle objections confidently. The right response can turn "I need to think about it" into a closed deal.',

  how: 'Describe your product, price range, target audience, and common objections you face. AI will generate specific scripts for each objection, prevention strategies to address objections before they arise, and frameworks for handling unexpected concerns.',

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
    exportFilename: 'objection-handling-scripts',
    displayFormat: 'text',
    editable: true,
    deletable: true,
    exportable: true,
    copyable: true
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
      }
    ],
    commonMistakes: [
      'Getting defensive about objections - arguing or taking it personally when someone says "too expensive." Objections are buying signals, not rejections. Stay curious and empathetic.',
      'Immediately offering discounts - prospect says "expensive" and you instantly drop price 20%. This trains buyers to object and devalues your offering. First, demonstrate value and ROI.',
      'Not isolating the real objection - accepting "I need to think about it" at face value. Ask: "Just curious, what specifically do you need to think about?" to uncover the true concern.',
      'Talking too much in response - giving 5-minute monologues addressing objections. Keep responses concise (30-60 seconds), then ask a question to continue dialogue.',
      'Not addressing objections proactively - waiting for prospects to raise concerns. Build objection handling into sales copy and pitches to address doubts before they\'re voiced.',
      'Having no structure - winging objection responses differently each time. Document your best responses, practice them, refine based on what works. Consistency improves close rates.'
    ]
  }
}
