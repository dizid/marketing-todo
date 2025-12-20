/**
 * Personalized Outreach Task Configuration
 *
 * This task uses the OutreachMiniApp component which provides
 * AI-assisted generation of personalized outreach emails and messages.
 */

export const outreachTask = {
  id: 'acq-2',
  name: 'Personalized Outreach',
  description: 'Generate a complete cold outreach campaign: 5-email sequence, LinkedIn messages, objection handling, and follow-up templates.',
  category: 'acquisition',
  customComponent: 'OutreachMiniApp',
  miniAppId: 'outreach',
  type: 'miniapp',
  hasAI: true,

  // Freemium model - Free tier task
  tier: 'free',
  what: 'Create personalized cold outreach campaigns for email and LinkedIn. Generate 5-email sequences, connection messages, follow-up templates, and response handling scripts.',
  why: 'Cold outreach works when personalized (10-25% reply rate vs 1% for generic). But writing personalized sequences is time-consuming. AI generates the framework, you add personal touches.',
  how: 'Describe your target audience and what you offer. Select your outreach channel. Get a complete sequence with subject lines, body copy, and follow-up cadence.',

  form: [
    {
      id: 'target_audience',
      type: 'textarea',
      label: 'Who are you reaching out to?',
      placeholder: 'CTOs at Series A SaaS startups who are struggling with developer productivity',
      tooltip: 'Be specific: job title + company type + pain point. The more specific, the better the personalization.',
      required: true,
      rows: 2
    },
    {
      id: 'pain_point',
      type: 'textarea',
      label: 'What problem do they have?',
      placeholder: 'Developers spending 40% of time on repetitive tasks that could be automated',
      tooltip: 'The specific pain point your product solves. This becomes the hook for your outreach.',
      required: true,
      rows: 2
    },
    {
      id: 'product_offering',
      type: 'textarea',
      label: 'What do you offer?',
      placeholder: 'AI-powered code assistant that automates boilerplate code and documentation',
      tooltip: 'Your product/service and its main benefit. Keep it to one sentence.',
      required: true,
      rows: 2
    },
    {
      id: 'outreach_channel',
      type: 'select',
      label: 'Primary outreach channel',
      tooltip: 'Email works for most B2B. LinkedIn is better for executives and when you have mutual connections.',
      options: [
        { value: 'email', label: 'Email (cold outreach)' },
        { value: 'linkedin', label: 'LinkedIn (connection + message)' },
        { value: 'both', label: 'Both email and LinkedIn' }
      ],
      required: true
    },
    {
      id: 'message_angle',
      type: 'select',
      label: 'Message angle',
      tooltip: 'The primary hook for your outreach. Choose based on what resonates with your audience.',
      options: [
        { value: 'time-saving', label: 'Time-saving (save X hours/week)' },
        { value: 'cost-reduction', label: 'Cost reduction (save $X/month)' },
        { value: 'revenue', label: 'Revenue growth (increase by X%)' },
        { value: 'competitive', label: 'Competitive advantage (stay ahead)' },
        { value: 'risk', label: 'Risk reduction (avoid X problem)' }
      ],
      required: true
    },
    {
      id: 'outreach_goal',
      type: 'select',
      label: 'Goal of outreach',
      tooltip: 'What do you want them to do? Start with the smallest possible ask.',
      options: [
        { value: 'call', label: 'Book a call' },
        { value: 'demo', label: 'Schedule a demo' },
        { value: 'reply', label: 'Start a conversation' },
        { value: 'trial', label: 'Sign up for free trial' }
      ],
      required: true
    }
  ],

  ai: {
    template: `You are a cold outreach expert. Create a personalized outreach campaign.

TARGET PROFILE:
- Audience: {target_audience}
- Their pain point: {pain_point}
- What we offer: {product_offering}

OUTREACH CONTEXT:
- Channel: {outreach_channel}
- Angle: {message_angle}
- Goal: {outreach_goal}

Generate a complete outreach sequence:

## 📧 EMAIL SEQUENCE (5 emails over 14 days)

### Email 1: First Touch
**Subject Line Options:**
1. [Curiosity-driven]
2. [Benefit-driven]
3. [Question-based]

**Body (50-75 words max):**
[Opening line that shows research - reference their company, role, or recent activity]

[1-2 sentences about their specific problem]

[1 sentence about how you can help - be specific with numbers if possible]

[Soft CTA - ask a question or request a reply, NOT a meeting yet]

---

### Email 2: Follow-Up (Day 3)
**Subject:** Re: [Previous subject]

**Body:**
[Quick bump with new angle/value - different from email 1]
[Add a relevant stat or case study]
[Same soft CTA]

---

### Email 3: Value-Add (Day 6)
**Subject:** [New subject with resource]

**Body:**
[Share relevant insight/resource/tip they'd find valuable]
[Connect to their situation]
[Updated CTA - slightly more direct]

---

### Email 4: Social Proof (Day 10)
**Subject:** [Case study tease]

**Body:**
[Brief case study of similar company/person]
[Specific results achieved]
[Implication for them]
[Direct CTA]

---

### Email 5: Breakup (Day 14)
**Subject:** [Closing the loop]

**Body:**
[Acknowledge they're busy]
[One last value prop - make it punchy]
[Easy out + leave door open]

---

## 💬 LINKEDIN MESSAGE SEQUENCE

### Connection Request Note (max 300 chars):
[Short, friendly reason to connect - no pitch]

### Message 1 (After Accept):
[Short, friendly, valuable - no pitch yet]
[Ask about their experience with [relevant topic]]

### Message 2 (Day 3):
[Light pitch with question]
[Reference something from their profile]

### Message 3 (Day 7):
[Direct ask with easy CTA]
[Make it easy to say yes]

---

## 🎯 PERSONALIZATION FRAMEWORK

For each prospect, customize:
1. **Opening Line:** Reference [their recent post/company news/mutual connection/specific challenge]
2. **Problem Statement:** Adjust based on [their industry/role/company size]
3. **Social Proof:** Use [relevant case study for their vertical]

**Research checklist before sending:**
- [ ] Check their LinkedIn for recent posts/activity
- [ ] Check company news (funding, launches, hires)
- [ ] Find mutual connections
- [ ] Identify their specific role challenges

---

## 📊 RESPONSE HANDLING

**If they reply positively:**
[Response template + calendar link suggestion]

**If they reply with objection "not the right time":**
[Response that keeps door open]

**If they reply with objection "not interested":**
[Response that asks for feedback]

**If they reply with objection "send more info":**
[Response with specific resource + re-ask]

---

## 📈 METRICS TO TRACK

- Open rate target: 40-60%
- Reply rate target: 5-15%
- Meeting rate target: 2-5%
- Best send times: Tuesday-Thursday, 9-11am their timezone
- Avoid: Monday morning, Friday afternoon`,

    temperature: 0.8,
    maxTokens: 3500
  },

  output: {
    enabled: true,
    exportFilename: 'outreach-campaign',
    displayFormat: 'text',
    editable: true,
    deletable: true,
    exportable: true,
    copyable: true
  },

  help: {
    examples: [
      {
        scenario: 'SaaS product targeting developers',
        input: { target_audience: 'Python developers', message_angle: 'time-saving' },
        output: 'Personalized emails highlighting how the tool saves developers 5 hours/week on repetitive tasks'
      },
      {
        scenario: 'Service business targeting executives',
        input: { target_audience: 'CFOs at 100+ person companies', message_angle: 'cost reduction' },
        output: 'Executive outreach emphasizing ROI, cost savings, and implementation timeline'
      }
    ],
    commonMistakes: [
      'Generic outreach - "Hi there" doesn\'t work. Personalize by referencing something specific about them.',
      'Leading with your product - they don\'t care yet. Lead with a relevant problem or insight.',
      'Walls of text - keep it to 3-4 sentences max. Make them want to respond.',
      'Wrong person - sending to the wrong person? Research your contact list first.',
      'No follow-up - one email rarely converts. Plan for 3-5 follow-ups over 2-3 weeks.',
      'Ignoring their context - understand their company, role, and what matters to them.'
    ]
  }
}
