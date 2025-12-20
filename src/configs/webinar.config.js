export const webinarTask = {
  id: 'acq-3',
  name: 'Host Webinar/Q&A',
  description: 'Generate a complete webinar planning package with AI: slide outline, promotion emails, follow-up sequence, and speaker scripts.',
  category: 'acquisition',
  hasAI: true,

  // Freemium model - Premium tier task
  tier: 'premium',
  what: 'Plan a 30-minute webinar or live Q&A with structure, topic guidance, slides outline, and promotion strategy. Turn live events into lead generation machines.',
  why: 'Webinars convert 2-3% of attendees to customers. Live events build relationships and authority. One good webinar can generate 50+ qualified leads.',
  how: 'Answer 5 questions about your topic and audience, then get a complete webinar outline with intro, 3 main sections, live demo, Q&A format, and follow-up sequence.',

  customComponent: 'WebinarMiniApp',

  form: [
    {
      id: 'webinar_title',
      type: 'text',
      label: 'Webinar title',
      placeholder: 'How to 10x Your Email Open Rates in 30 Days',
      tooltip: 'A compelling title that promises a specific outcome. "How to [achieve X] in [timeframe]" works well.',
      required: true
    },
    {
      id: 'topic_description',
      type: 'textarea',
      label: 'What will you teach?',
      placeholder: 'Proven email marketing strategies: subject line formulas, send timing, segmentation tactics',
      tooltip: 'The main content you\'ll cover. Be specific about 3-5 key takeaways.',
      rows: 3,
      required: true
    },
    {
      id: 'target_audience',
      type: 'text',
      label: 'Who is this for?',
      placeholder: 'E-commerce store owners struggling with email marketing',
      tooltip: 'Specific audience segment. The more specific, the better the content.',
      required: true
    },
    {
      id: 'duration',
      type: 'select',
      label: 'Duration',
      tooltip: '30-45 mins is optimal for lead gen. 60+ mins for deep-dive workshops.',
      options: [
        { value: '30', label: '30 minutes (quick session)' },
        { value: '45', label: '45 minutes (standard)' },
        { value: '60', label: '60 minutes (deep dive)' },
        { value: '90', label: '90 minutes (workshop)' }
      ],
      required: true
    },
    {
      id: 'webinar_type',
      type: 'select',
      label: 'Webinar type',
      tooltip: 'Choose the format that best fits your content and expertise.',
      options: [
        { value: 'educational', label: 'Educational (teach skills)' },
        { value: 'demo', label: 'Product demo' },
        { value: 'panel', label: 'Panel discussion' },
        { value: 'qa', label: 'Live Q&A' },
        { value: 'case-study', label: 'Case study presentation' }
      ],
      required: true
    },
    {
      id: 'webinar_goal',
      type: 'select',
      label: 'Primary goal',
      tooltip: 'What do you want attendees to do after the webinar?',
      options: [
        { value: 'leads', label: 'Generate leads' },
        { value: 'sales', label: 'Drive sales/conversions' },
        { value: 'education', label: 'Educate existing customers' },
        { value: 'authority', label: 'Build thought leadership' }
      ],
      required: true
    }
  ],

  ai: {
    template: `You are a webinar marketing expert. Create a complete webinar planning package.

WEBINAR DETAILS:
- Title: {webinar_title}
- Topic: {topic_description}
- Target Audience: {target_audience}
- Duration: {duration} minutes
- Type: {webinar_type}
- Goal: {webinar_goal}

Generate a COMPLETE webinar package:

## 🎯 WEBINAR STRATEGY

**Positioning:**
[How this webinar fits in the marketing funnel]

**Success Metrics:**
- Registration goal: [X] signups
- Show-up rate target: [X]%
- Conversion goal: [X]% to [next step]

---

## 📋 SLIDE OUTLINE ({duration} minutes)

**Opening (5 min)**
- Slide 1: Title + Host intro
- Slide 2: What we'll cover (agenda)
- Slide 3: Quick poll to engage audience

**Main Content (15-25 min)**
- Slide 4: Problem statement
  - [Specific pain point]
  - [Why it matters]

- Slide 5-7: Key insight #1
  - [Main point]
  - [Supporting data/example]
  - [Actionable takeaway]

- Slide 8-10: Key insight #2
  - [Main point]
  - [Case study/example]
  - [Actionable takeaway]

- Slide 11-13: Key insight #3
  - [Main point]
  - [Demo/walkthrough]
  - [Actionable takeaway]

**Live Demo (10 min) - if applicable**
- Slide 14: Demo intro
- [Step-by-step demo script]

**Q&A (5-10 min)**
- Slide 15: Q&A prompt
- [Prepared questions to seed if needed]

**Close (5 min)**
- Slide 16: Recap key takeaways
- Slide 17: Special offer/CTA
- Slide 18: Thank you + next steps

---

## 📝 WEBINAR SCRIPT

**Opening Script (read this):**
"[Word-for-word opening script that builds rapport and sets expectations]"

**Transition Phrases:**
- "Now let's dive into..."
- "This brings us to our next point..."
- "But here's where it gets interesting..."

**Closing Script:**
"[Word-for-word closing that drives action]"

---

## 📣 PROMOTION PLAN

### 2 Weeks Before:
**Email 1 - Announcement:**
Subject: [Subject line]
Body: [Full email copy]

**Social Post - LinkedIn:**
[Full post copy]

**Social Post - Twitter:**
[Thread copy]

### 1 Week Before:
**Email 2 - Value Tease:**
Subject: [Subject line]
Body: [Full email copy]

### Day Before:
**Email 3 - Reminder:**
Subject: [Subject line]
Body: [Short reminder]

### Day Of:
**Email 4 - Starting Soon:**
Subject: [Subject line]
Body: [Join now CTA]

---

## 📧 FOLLOW-UP SEQUENCE

**Email 1 (Same Day) - Recording:**
Subject: [Subject line]
Body: [Thanks + recording link + CTA]

**Email 2 (Day 2) - Key Takeaways:**
Subject: [Subject line]
Body: [Summary + resources + CTA]

**Email 3 (Day 4) - Special Offer:**
Subject: [Subject line]
Body: [Limited time offer for attendees]

---

## 🎥 TECH CHECKLIST

Before webinar:
- [ ] Test screen share
- [ ] Check audio levels
- [ ] Prepare backup slides (PDF)
- [ ] Close unnecessary apps
- [ ] Have water nearby
- [ ] Silence phone/notifications

---

## 💡 PRO TIPS FOR THIS WEBINAR

Based on your {target_audience}:
1. [Specific tip for this audience]
2. [Engagement tip]
3. [Conversion tip]`,

    temperature: 0.8,
    maxTokens: 4000
  },

  output: {
    enabled: true,
    exportFilename: 'webinar-planning-package',
    displayFormat: 'text',
    editable: true,
    deletable: true,
    exportable: true,
    copyable: true
  },

  help: {
    examples: [
      {
        scenario: 'Product feature demo webinar',
        input: { webinar_title: 'Advanced Analytics Demo', topic_description: 'New reporting features and dashboards', target_audience: 'Existing customers' },
        output: 'Structured webinar: 5-min intro, 15-min live demo showing real data, 5-min Q&A, 2-min CTA. Follow-up email with recording and 20% discount for attendees.'
      },
      {
        scenario: 'Thought leadership webinar',
        input: { webinar_title: 'The Future of SaaS Automation', topic_description: 'Industry trends and best practices', target_audience: 'Potential customers, industry professionals' },
        output: 'Educational webinar: panel discussion format, 3 speakers sharing insights, live polls for engagement, recorded and repurposed into 5 social clips and 1 blog post.'
      }
    ],
    commonMistakes: [
      'No clear objective - "Let\'s just talk" wastes everyone\'s time. Know exactly what you want attendees to learn or do.',
      'Talking too fast - slide through 50 slides in 30 minutes and nobody absorbs anything. Slow down, pause for questions, repeat key points.',
      'Forgetting to promote it - 30 people sign up, 8 attend. Start promoting 2 weeks out, send 3 reminder emails, use social and email list.',
      'No tech rehearsal - discover your screen share is broken 2 minutes before start time. Test everything 24 hours before.',
      'Boring delivery - read slides verbatim = audience asleep. Use storytelling, real examples, live demos, guest speakers to keep energy high.',
      'No follow-up plan - webinar ends, nothing happens. Send recording within 24 hours + resources + special offer to drive conversions.'
    ]
  }
}
