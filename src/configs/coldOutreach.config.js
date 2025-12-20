/**
 * Cold Outreach Template Generator - Task 8.2
 */

export const coldOutreachTask = {
  id: 'growth-2',
  name: 'Cold Outreach Template Generator',
  description: 'Generate cold email and LinkedIn message templates with high response rates',
  category: 'growth',
  tier: 'free',

  // Phase 6: Field inheritance mappings (form field → canonical field)
  fieldMappings: {
    'target_persona': 'targetAudience',
    'value_proposition': 'productDescription',
    // Fields without canonical mapping (task-specific)
    'outreach_channel': null,
    'campaign_goal': null,
    'email_count': null
  },

  what: 'Get proven cold outreach templates for email, LinkedIn, and DMs. Includes 5 email variations, 4 LinkedIn message templates, follow-up sequences, personalization strategies, icebreaker tactics, and response handling scripts. Designed for high open rates and replies.',

  why: 'Cold outreach done right can generate 20-50+ qualified leads per month. But most cold messages get ignored or marked as spam. The difference between 0% and 30% response rates is the template structure, personalization level, and follow-up strategy.',

  how: 'Specify your outreach channel, target persona, value proposition, and goal. AI will generate multiple template variations with personalization tokens, subject line formulas, follow-up cadences, and response handling scripts to maximize reply rates.',

  form: [
    {
      id: 'outreach_channel',
      type: 'select',
      label: 'Primary Outreach Channel',
      options: [
        { value: 'email', label: 'Cold Email' },
        { value: 'linkedin', label: 'LinkedIn Messages' },
        { value: 'instagram', label: 'Instagram DMs' },
        { value: 'twitter', label: 'Twitter/X DMs' },
        { value: 'multi', label: 'Multi-channel (Email + LinkedIn)' }
      ],
      required: true
    },
    {
      id: 'target_persona',
      type: 'textarea',
      label: 'Target Persona',
      placeholder: 'Who are you reaching out to? (job title, company size, industry, pain points)',
      required: true,
      rows: 3,
      description: 'The more specific, the better the personalization'
    },
    {
      id: 'value_proposition',
      type: 'textarea',
      label: 'Your Value Proposition',
      placeholder: 'What specific value do you offer them? (results, savings, outcomes)',
      required: true,
      rows: 2,
      description: 'Focus on THEIR benefit, not your service'
    },
    {
      id: 'outreach_goal',
      type: 'select',
      label: 'Outreach Goal',
      options: [
        { value: 'meeting', label: 'Book a discovery call/meeting' },
        { value: 'demo', label: 'Schedule a product demo' },
        { value: 'content', label: 'Share valuable content (soft touch)' },
        { value: 'partnership', label: 'Explore partnership opportunity' },
        { value: 'sale', label: 'Direct sale (low-ticket offer)' }
      ],
      required: true,
      description: 'Different goals require different approaches'
    },
    {
      id: 'personalization_data',
      type: 'checkboxes',
      label: 'Personalization Data Available',
      options: [
        { value: 'company', label: 'Company name/info' },
        { value: 'recent-post', label: 'Recent social post/content' },
        { value: 'mutual-connection', label: 'Mutual connections' },
        { value: 'recent-news', label: 'Company news/funding' },
        { value: 'job-posting', label: 'Job postings' },
        { value: 'minimal', label: 'Minimal (just name/title)' }
      ],
      description: 'More personalization = higher response rates'
    },
    {
      id: 'follow_up_strategy',
      type: 'select',
      label: 'Follow-up Strategy',
      options: [
        { value: 'aggressive', label: 'Aggressive (5-7 touchpoints)' },
        { value: 'moderate', label: 'Moderate (3-4 touchpoints)' },
        { value: 'light', label: 'Light (1-2 touchpoints)' },
        { value: 'suggest', label: 'Suggest best strategy' }
      ],
      required: true,
      description: '80% of replies come after the 3rd+ touchpoint'
    },
    {
      id: 'outreach_volume',
      type: 'select',
      label: 'Planned Outreach Volume',
      options: [
        { value: 'low', label: 'Low (<25/day) - Highly personalized' },
        { value: 'medium', label: 'Medium (25-100/day) - Semi-automated' },
        { value: 'high', label: 'High (100+/day) - Scaled automation' }
      ],
      required: true,
      description: 'Volume affects personalization level and tooling needs'
    }
  ],

  ai: {
    template: `Generate cold outreach templates based on:

Outreach Channel: {outreach_channel}
Target Persona: {target_persona}
Value Proposition: {value_proposition}
Outreach Goal: {outreach_goal}
Personalization Data: {personalization_data}
Follow-up Strategy: {follow_up_strategy}
Outreach Volume: {outreach_volume}

Create a comprehensive outreach strategy:

## 1. COLD EMAIL TEMPLATES (5 VARIATIONS)

**Template 1: Problem-Aware**
*Use when:* They're aware of the problem you solve

*Subject Line:*
"Quick question about [their pain point]"

*Email Body:*
Hi [First Name],

I noticed [personalized observation about their company/role].

Most [job title]s I work with struggle with [specific pain point] - is that something you're dealing with?

I help [similar companies/people] [achieve specific outcome] without [common obstacle].

[Social proof: "Recently helped [Similar Company] achieve [specific result]"]

Would it make sense to chat for 15 minutes on [Day] to see if we could do something similar for [Their Company]?

Best,
[Your Name]

P.S. [Low-pressure out: "If timing's not right, no worries - just let me know."]

---

**Template 2: Value-First**
*Use when:* Cold audience, need to build trust first

*Subject Line:*
"[First Name], thought you'd find this useful"

*Email Body:*
Hi [First Name],

I've been following [Their Company]'s work in [industry] and noticed you're [specific observation].

I put together a quick [resource type] on [topic relevant to them] - thought it might be helpful given [reason].

[Link to resource]

No strings attached - just wanted to share.

If you find it useful and want to chat about [their goal/challenge], happy to jump on a quick call.

Best,
[Your Name]

---

**Template 3: Mutual Connection**
*Use when:* You have a mutual connection

*Subject Line:*
"[Mutual Connection] suggested I reach out"

*Email Body:*
Hi [First Name],

[Mutual Connection Name] mentioned you're working on [initiative] at [Their Company] and thought we should connect.

I help [persona] [achieve outcome] - recently worked with [Similar Company] to [specific result in X timeframe].

Given [Their Company]'s focus on [goal], I thought there might be an opportunity to do something similar.

Open to a 15-minute call this week to explore?

Best,
[Your Name]

[Optional: CC the mutual connection for credibility]

---

**Template 4: Pattern Interrupt**
*Use when:* Competitive inbox, need to stand out

*Subject Line:*
"[First Name] - NOT a sales pitch"

*Email Body:*
Hi [First Name],

I'm not going to pitch you anything.

Instead, I want to share 3 insights I've noticed about [their industry/company]:

1. [Specific insight]
2. [Specific insight]
3. [Specific insight]

These patterns emerged from working with [X] companies like [Similar Companies].

If any of this resonates, I'd love to hear your take. If not, no worries - just thought it might be valuable.

Best,
[Your Name]

---

**Template 5: Direct & Specific**
*Use when:* High-intent persona, decision-maker

*Subject Line:*
"[Specific Outcome] in [Timeframe]?"

*Email Body:*
Hi [First Name],

Quick question: Is [achieving specific outcome] a priority for [Their Company] right now?

I ask because I've helped [X] companies in [industry] achieve [specific metric] in [timeframe].

Most recent: [Company Name] went from [before] to [after] in [timeframe].

If this is relevant, let's schedule 20 minutes this week. If not, I'll stop bothering you.

Fair?

Best,
[Your Name]

## 2. LINKEDIN MESSAGE TEMPLATES (4 VARIATIONS)

**Template 1: Connection Request Message**
*Character limit: 300*

Hi [First Name] - I help [persona] [achieve outcome]. Noticed you're [specific observation about their profile/company]. Would love to connect and share insights on [relevant topic]. - [Your Name]

---

**Template 2: Post-Connection Follow-up**
*Send 1-2 days after they accept*

Hi [First Name],

Thanks for connecting!

I saw you're working on [project/initiative] at [Company]. I recently helped [Similar Company] with [related outcome] - thought there might be some overlap.

Would you be open to a brief call to explore?

---

**Template 3: InMail (Premium Feature)**
*Use for: High-value prospects*

*Subject:* [Specific Result] for [Their Company]?

Hi [First Name],

I've been following [Their Company]'s growth in [sector] - impressive work on [specific achievement].

I specialize in helping [persona] achieve [outcome]. Recently, [Similar Company] achieved [specific result] in [timeframe] using our [method/framework].

Given [Their Company]'s focus on [goal], I think we could deliver similar results.

Worth a 15-minute conversation?

Best,
[Your Name]

P.S. [Credibility boost: credential, media mention, or notable client]

---

**Template 4: Comment-to-DM Strategy**
*Step 1:* Engage with their posts for 1-2 weeks
*Step 2:* Send this DM

Hi [First Name],

I've really enjoyed your recent posts on [topic] - especially the one about [specific point].

I work with [persona] on [related topic] and thought you might find [resource/insight] valuable given your interest.

Mind if I share it?

[After they respond, transition to outreach goal]

## 3. FOLLOW-UP SEQUENCES

**Email Follow-up Cadence (Moderate Strategy):**

**Follow-up 1 (3 days after initial):**
*Subject:* Re: [Original subject]

Hi [First Name],

Following up on my email from [Day].

I know you're busy - just wanted to bump this up in your inbox in case you missed it.

Still interested in chatting about [specific outcome]?

Best,
[Your Name]

---

**Follow-up 2 (7 days after initial):**
*Subject:* Different approach?

Hi [First Name],

Tried reaching out twice - clearly not the right timing or approach.

Quick question: Is [problem] even on your radar right now, or should I check back in [timeframe]?

Best,
[Your Name]

---

**Follow-up 3 (14 days after initial):**
*Subject:* Last one, I promise

Hi [First Name],

Last attempt here.

If [achieving outcome] isn't a priority, totally understand. But if it is and you just haven't had time to respond, let me know and I'll send over some times for a quick call.

Otherwise, I'll take the hint and stop emailing. 😊

Best,
[Your Name]

---

**Breakup Email (21 days after initial):**
*Subject:* Breaking up is hard to do

Hi [First Name],

I'm going to assume this isn't a fit and stop reaching out.

If anything changes and you want to explore [outcome], feel free to hit reply.

Thanks for your time (or lack thereof 😄).

Best,
[Your Name]

*Note:* Breakup emails often get highest response rates - psychology of loss aversion

## 4. PERSONALIZATION TOKENS

**For {personalization_data} level available:**

**Company-Level Personalization:**
- [Company Name]
- [Industry/Sector]
- [Company Size/Revenue]
- [Recent Funding/News]
- [Competitors they're up against]

**Individual-Level Personalization:**
- [First Name] (always)
- [Job Title/Role]
- [Recent LinkedIn Post Topic]
- [Mutual Connection]
- [Shared Interest/Background]

**Trigger-Based Personalization:**
- [Job Change] - "Congrats on the new role..."
- [Company Growth] - "Saw you're hiring for..."
- [Content Published] - "Loved your article on..."
- [Funding Announcement] - "Congrats on the Series B..."

**Personalization Tools:**
- Clearbit Enrichment (company data)
- Hunter.io (find emails)
- LinkedIn Sales Navigator (detailed profiles)
- Apollo.io (all-in-one prospecting)

## 5. SUBJECT LINE FORMULAS

**High Open Rate Subject Lines:**

**Curiosity-Driven:**
- "Quick question, [First Name]"
- "[First Name] - thought you'd want to see this"
- "Your thoughts on [topic]?"

**Personalized:**
- "Congrats on [recent achievement]"
- "Fellow [shared background] here"
- "Re: [their recent LinkedIn post topic]"

**Value-Driven:**
- "[Specific number]% increase for [Their Company]?"
- "How [Similar Company] achieved [result]"
- "[Outcome] in [timeframe]?"

**Pattern Interrupt:**
- "This isn't a sales email"
- "NOT what you think"
- "I'll be honest..."

**Warning - Avoid:**
- Generic: "Following up", "Checking in"
- Salesy: "Special offer", "Limited time"
- Vague: "Opportunity", "Partnership"

## 6. ICEBREAKER STRATEGIES

**Compliment + Question:**
"Loved your post on [topic]. Quick question: [relevant question]?"

**Shared Experience:**
"Fellow [alumni/industry/location] here - noticed you're working on [project]..."

**Trigger Event:**
"Saw [Company News] - congrats! Given this, thought you might be interested in [value prop]..."

**Helpful Resource:**
"Found this [resource] that addresses [their pain point] - thought you'd find it useful."

**Mutual Connection:**
"[Connection Name] suggested I reach out - we both work with [persona] on [problem]."

## 7. RESPONSE HANDLING SCRIPTS

**When They Reply "Interested":**
"Great! I have [Day] at [Time] or [Alt Day] at [Alt Time] - which works better for you? [Calendar Link]"

**When They Reply "Not Right Now":**
"Totally understand - timing matters. Mind if I check back in [timeframe]? Or is there a better time you'd suggest?"

**When They Reply "Send Me More Info":**
"Happy to. Before I do, can you share: [1-2 qualifying questions]? Want to make sure I send the most relevant info."

**When They Reply "What's the Price?":**
"Pricing depends on [variables]. Typically ranges from [low] to [high]. Can we jump on a quick call to scope out what makes sense for [Their Company]?"

**When They Reply "I'm Not the Right Person":**
"Thanks for letting me know - who should I connect with about [topic]? Happy to mention you made the intro."

**When They Reply "Remove Me":**
"Done - sorry for the bother. Out of curiosity, was it the timing, the relevance, or the frequency that was off? (Helps me improve)"

## 8. OUTREACH TRACKING SYSTEM

**Metrics to Track:**

**Top-of-Funnel:**
- Emails sent: [X]
- Open rate: [Y]% (Benchmark: 40-60%)
- Reply rate: [Z]% (Benchmark: 5-15%)

**Mid-Funnel:**
- Positive replies: [X] (vs negative/neutral)
- Meetings booked: [Y]
- Show-up rate: [Z]% (Benchmark: 70%+)

**Bottom-Funnel:**
- Opportunities created: [X]
- Deals closed: [Y]
- Conversion rate: [Z]% (reply → deal)

**Tools:**
- Lemlist (automation + tracking)
- Reply.io (multi-channel sequences)
- Woodpecker (email outreach)
- LinkedIn Sales Navigator (LinkedIn outreach)
- HubSpot/Pipedrive (CRM tracking)

**A/B Testing:**
- Subject lines (test 2-3 variations)
- Email length (short vs long)
- Value prop framing
- CTA (question vs calendar link vs request)

## 9. COMPLIANCE & DELIVERABILITY

**CAN-SPAM Compliance:**
- Include your physical address
- Provide clear unsubscribe option
- Don't use deceptive subject lines
- Honor opt-outs within 10 days

**GDPR Compliance (EU Contacts):**
- Have legitimate interest or consent
- Provide data processing info
- Allow data deletion requests

**Deliverability Best Practices:**
- Warm up new domains (start slow, ramp up)
- Keep email list clean (remove bounces)
- Avoid spam trigger words
- Maintain <5% bounce rate
- Use SPF, DKIM, DMARC authentication
- Personalize every email (avoid mass blast appearance)

**Daily Send Limits:**
- New domain: 20-50/day for first 2 weeks
- Warmed domain: 200-500/day
- Multiple domains: Rotate to avoid flags

Format with ready-to-use templates and specific tactics.`,

    temperature: 0.7,
    maxTokens: 3000,

    // SSOT Phase 5: Removed contextProvider - project context now auto-injected
    // from projectStore in aiGeneration.js (app_description, company_name, etc.)
  },

  output: {
    enabled: true,
    exportFilename: 'cold-outreach-templates',
    displayFormat: 'text',
    editable: true,
    deletable: true,
    exportable: true,
    copyable: true
  },

  help: {
    examples: [
      {
        scenario: 'B2B SaaS reaching out to marketing directors',
        input: { target_persona: 'Marketing Directors at 50-200 person B2B companies', outreach_channel: 'email', message_angle: 'time-saving automation', outreach_goal: 'meeting', follow_up_strategy: 'moderate' },
        output: '5 email template variations (problem-aware, value-first, mutual connection, pattern interrupt, direct), 3-4 touchpoint follow-up sequence over 14 days, subject line formulas optimized for B2B decision-makers, personalization tokens for company size and industry, and response handling scripts for common objections.'
      },
      {
        scenario: 'Agency owner targeting e-commerce founders on LinkedIn',
        input: { target_persona: 'E-commerce founders doing $500K-5M revenue', outreach_channel: 'linkedin', message_angle: 'revenue growth', outreach_goal: 'demo', follow_up_strategy: 'light' },
        output: 'LinkedIn connection request message (under 300 chars), post-connection follow-up template, InMail template for premium outreach, comment-to-DM warm-up strategy, icebreakers referencing their recent posts or company news, 1-2 touchpoint follow-up cadence to respect LinkedIn norms.'
      }
    ],
    commonMistakes: [
      'Leading with your product instead of their problem - "We help companies automate..." gets ignored. Start with "Are you still manually doing [task] each week?" Focus on THEIR pain first.',
      'Sending generic mass emails - "Hi there" and "Dear Sir/Madam" scream template. Always personalize with their name, company, and a specific observation about them or their business.',
      'Writing walls of text - 5-paragraph cold emails never get read. Keep it to 3-4 sentences max. Make them WANT to reply to learn more instead of explaining everything upfront.',
      'Not following up - 80% of replies come after the 3rd+ touchpoint, but most people send one email and quit. Have a 3-5 email follow-up sequence ready before you start outreaching.',
      'Asking for too much too soon - first email asking for a 60-minute call or to "hop on a quick chat this week." Start with low-commitment asks like "Worth a 10-minute conversation?" or share value first.',
      'Ignoring deliverability setup - sending from a new domain without SPF/DKIM/DMARC or sending 500 emails on day one. Warm up your domain gradually and set up authentication to avoid spam folders.'
    ]
  }
}
