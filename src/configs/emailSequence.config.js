/**
 * Email Sales Sequence Builder - Task 7.4
 */

export const emailSequenceTask = {
  id: 'sales-4',
  name: 'Email Sales Sequence Builder',
  description: 'Create a complete email sales sequence from welcome to conversion',
  category: 'sales',
  tier: 'free',

  what: 'Generate a full email sequence (7-14 emails) designed to nurture leads and drive sales. Get subject lines, email body templates, P.S. tactics, segmentation triggers, and A/B test suggestions. Covers welcome sequences, product launches, and evergreen sales sequences.',

  why: 'Email converts 40x better than social media. But most sequences are either too aggressive (instant unsubscribes) or too passive (no sales). A well-crafted sequence builds trust while systematically moving prospects toward purchase.',

  how: 'Specify your sequence goal (welcome, launch, evergreen), product details, audience awareness level, and desired sequence length. AI will generate a complete sequence with email-by-email breakdown, subject lines, body copy framework, timing, and optimization tactics.',

  form: [
    {
      id: 'sequence_goal',
      type: 'select',
      label: 'Sequence Goal',
      options: [
        { value: 'welcome', label: 'Welcome Sequence (new subscribers → first purchase)' },
        { value: 'launch', label: 'Product Launch (build hype → open cart → close cart)' },
        { value: 'evergreen', label: 'Evergreen Sales (ongoing nurture → conversion)' },
        { value: 'cart-abandon', label: 'Cart Abandonment Recovery' },
        { value: 'reactivation', label: 'Re-engage Cold Subscribers' }
      ],
      required: true
    },
    {
      id: 'product_description',
      type: 'textarea',
      label: 'Product/Offer Description',
      placeholder: 'What are you selling in this sequence?',
      required: true,
      rows: 2
    },
    {
      id: 'audience_awareness',
      type: 'select',
      label: 'Audience Awareness Level',
      options: [
        { value: 'unaware', label: 'Unaware (don\'t know they have a problem)' },
        { value: 'problem-aware', label: 'Problem-Aware (know problem, not solutions)' },
        { value: 'solution-aware', label: 'Solution-Aware (know solutions exist)' },
        { value: 'product-aware', label: 'Product-Aware (know your product exists)' },
        { value: 'most-aware', label: 'Most Aware (ready to buy, need final push)' }
      ],
      required: true,
      description: 'Determines how much education vs selling to include'
    },
    {
      id: 'sequence_length',
      type: 'select',
      label: 'Sequence Length',
      options: [
        { value: '5-email', label: '5 emails (quick conversion)' },
        { value: '7-email', label: '7 emails (standard nurture)' },
        { value: '10-email', label: '10 emails (deeper relationship)' },
        { value: '14-email', label: '14 emails (complex/high-ticket offer)' }
      ],
      required: true
    },
    {
      id: 'tone',
      type: 'select',
      label: 'Email Tone',
      options: [
        { value: 'casual', label: 'Casual & Conversational' },
        { value: 'professional', label: 'Professional & Authoritative' },
        { value: 'friendly', label: 'Friendly & Approachable' },
        { value: 'direct', label: 'Direct & No-Nonsense' },
        { value: 'storytelling', label: 'Story-Driven & Personal' }
      ],
      required: true
    },
    {
      id: 'offer_details',
      type: 'textarea',
      label: 'Offer Details',
      placeholder: 'Price, bonuses, guarantee, urgency/scarcity elements',
      rows: 2,
      description: 'What makes your offer compelling?'
    },
    {
      id: 'existing_relationship',
      type: 'select',
      label: 'Existing Relationship',
      options: [
        { value: 'cold', label: 'Cold (new lead magnet subscribers)' },
        { value: 'warm', label: 'Warm (engaged with content before)' },
        { value: 'hot', label: 'Hot (previous customers/engaged prospects)' }
      ],
      required: true,
      description: 'How familiar are they with you already?'
    }
  ],

  ai: {
    template: `Create a complete email sales sequence based on:

Sequence Goal: {sequence_goal}
Product: {product_description}
Audience Awareness: {audience_awareness}
Sequence Length: {sequence_length}
Tone: {tone}
Offer Details: {offer_details}
Relationship: {existing_relationship}

Generate a comprehensive email sequence with:

## 1. SEQUENCE STRATEGY

**Overall Arc:**
- Day 1-3: [Objective for these emails]
- Day 4-7: [Objective for these emails]
- Day 8+: [Objective for final emails]

**Conversion Path:**
[Map the journey from first email to purchase]

**Key Metrics to Track:**
- Open rate benchmark: [%]
- Click rate benchmark: [%]
- Conversion rate benchmark: [%]

## 2. EMAIL-BY-EMAIL BREAKDOWN

**EMAIL 1 - [Purpose/Theme]**
*Send Timing:* Immediately (or specify delay)

*Subject Line Options:*
1. [Subject line with curiosity/benefit]
2. [Alternative subject line]
3. [Third option]

*Preview Text:*
"[First 50 chars shown in inbox]"

*Email Structure:*
- Opening: [Hook that grabs attention]
- Body: [Key message/value delivery]
- CTA: [Specific action to take]
- P.S.: [Reinforce key point or tease next email]

*Goal:* [What should this email accomplish?]
*Avg Performance:* [Expected open/click rates]

---

**EMAIL 2 - [Purpose/Theme]**
*Send Timing:* [Hours/days after Email 1]

*Subject Line Options:*
1. [Subject line]
2. [Alternative]
3. [Third option]

*Preview Text:*
"[Preview text]"

*Email Structure:*
- Opening: [Connection to previous email or new angle]
- Body: [Content - story, education, or social proof]
- CTA: [Action step]
- P.S.: [Additional value or urgency note]

*Goal:* [Email objective]

---

[Continue for all emails in sequence based on {sequence_length}]

## 3. SUBJECT LINE FORMULAS

**Curiosity-Driven:**
- "The [X] mistake costing you [outcome]"
- "[Surprising fact] about [topic]"
- "What nobody tells you about [topic]"

**Benefit-Driven:**
- "How to [achieve result] in [timeframe]"
- "[Number] ways to [solve problem]"
- "Get [outcome] without [pain point]"

**Urgency-Driven:**
- "Last chance: [Offer] ends [when]"
- "Only [X] spots left for [thing]"
- "[Time-sensitive opportunity]"

**Story-Driven:**
- "How I [achieved result]"
- "My biggest mistake with [topic]"
- "This almost ruined [outcome]..."

## 4. PREVIEW TEXT EXAMPLES

Preview text is the second most important factor after subject lines.

**Complement the Subject:**
If subject asks a question, preview answers it partially
If subject makes a promise, preview expands on it

**Examples:**
- Subject: "The pricing mistake killing your sales"
- Preview: "Here's why $97 might be leaving money on the table"

[Provide 10+ preview text examples aligned with subject lines]

## 5. P.S. LINE TACTICS

The P.S. is the second-most read part of emails.

**Reinforce CTA:**
"P.S. Don't forget to [action]. It takes 2 minutes and [benefit]."

**Add Urgency:**
"P.S. The [bonus/price] ends [when]. Don't miss out."

**Tease Next Email:**
"P.S. Tomorrow I'm sharing [intriguing preview]. Keep an eye out."

**Social Proof:**
"P.S. Just got this message from [customer]: '[testimonial snippet]'"

**Remove Objection:**
"P.S. Worried about [objection]? [Quick reassurance]"

[Provide specific P.S. lines for each email in sequence]

## 6. SEGMENTATION TRIGGERS

**Engagement-Based Segmentation:**
- Opened but didn't click → [Send alternative angle]
- Clicked but didn't buy → [Send objection handling email]
- Didn't open 3+ emails → [Send re-engagement or remove]

**Behavior-Based Segmentation:**
- Clicked pricing page → [Send urgency/bonus email]
- Visited sales page 2+ times → [Send personal outreach]
- Clicked competitors link → [Send differentiation email]

**How to Implement:**
[Platform-specific instructions for segmentation in email tools]

## 7. A/B TEST SUGGESTIONS

**Test Priority 1: Subject Lines**
- Test: [Curiosity vs Benefit-driven]
- Expected lift: 10-30% open rate improvement

**Test Priority 2: CTA Placement**
- Test: [CTA in middle vs end of email]
- Expected lift: 5-15% click rate improvement

**Test Priority 3: Email Length**
- Test: [Short (100 words) vs Long (500 words)]
- Hypothesis: [Which should perform better and why]

**Test Priority 4: Urgency Framing**
- Test: [Scarcity vs Time-based urgency]
- Expected impact: 10-20% conversion lift

## 8. DELIVERABILITY TIPS

**Avoid Spam Triggers:**
- Don't use: FREE, !!!, ALL CAPS, $$$
- Avoid heavy image-to-text ratio
- Keep links to 2-3 per email max

**Authentication:**
- Set up SPF, DKIM, DMARC
- Use branded sending domain
- Maintain consistent from name

**Engagement:**
- Ask questions to encourage replies
- Clean list regularly (remove non-openers)
- Warm up new domains gradually

## 9. PERFORMANCE BENCHMARKS

**By Email Position:**
- Email 1: [Expected open/click/conversion rates]
- Email 2: [Expected rates]
- Email 3: [Expected rates]
[Continue for all emails]

**By Industry:**
[Benchmark data for your type of product/audience]

**Optimization Targets:**
- If open rate < [X]% → Fix subject lines
- If click rate < [Y]% → Improve CTAs/value
- If conversion rate < [Z]% → Address objections

Format with ready-to-use email templates, not just outlines.`,

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
    exportFilename: 'email-sales-sequence',
    displayFormat: 'text',
    editable: true,
    deletable: true,
    exportable: true,
    copyable: true
  },

  help: {
    examples: [
      {
        scenario: 'Welcome sequence for new SaaS trial users',
        input: { sequence_goal: 'welcome', product_description: 'Project management SaaS, $49/month', audience_awareness: 'product-aware', sequence_length: '7-email', tone: 'friendly' },
        output: '7-email welcome sequence: Email 1 (immediate) - welcome and quick start guide, Email 2 (day 2) - feature highlight with video tutorial, Email 3 (day 4) - case study showing results, Email 4 (day 7) - address common objections, Email 5 (day 10) - upgrade reminder with bonus, Email 6 (day 13) - urgency and scarcity, Email 7 (day 14) - final call before trial ends. Each with 3 subject line options, preview text, P.S. tactics, and segmentation triggers.'
      },
      {
        scenario: 'Product launch sequence for existing email list',
        input: { sequence_goal: 'launch', product_description: 'Online course on email marketing, $297', audience_awareness: 'solution-aware', sequence_length: '10-email', tone: 'storytelling' },
        output: '10-email launch sequence with pre-launch hype (3 emails), cart open phase (4 emails), and cart close urgency (3 emails). Includes curiosity-building subject lines, value-stacking in email body, social proof integration points, price justification messaging, bonus reveals, countdown timers, and cart close urgency tactics. A/B test suggestions for subject lines and CTA placement.'
      }
    ],
    commonMistakes: [
      'Selling too hard too fast - email 1 is a hard pitch for purchase. Build trust first through value delivery, then introduce the offer around email 3-4 in a welcome sequence.',
      'Using boring subject lines - "Newsletter #5" or "Weekly Update" get ignored. Use curiosity, benefit, or urgency-driven subject lines that make people want to open.',
      'Sending all emails at once - scheduling the entire sequence to send within 24 hours overwhelms subscribers. Space emails 2-3 days apart for nurture sequences, closer for launches.',
      'Not segmenting based on behavior - sending the same emails to people who opened vs didn\'t open, clicked vs didn\'t click. Segment and send different follow-ups based on engagement.',
      'Forgetting the P.S. - the P.S. is the second-most read part of emails but many skip it. Use it to reinforce your CTA, add urgency, or tease the next email.',
      'No clear call-to-action - emails that inform but don\'t ask for any action. Every email should have ONE clear next step: click, reply, book a call, or purchase.'
    ]
  }
}
