/**
 * Collect User Feedback - Task Configuration
 *
 * AI-powered survey question generation + comprehensive feedback collection planning
 */

export const surveyTypes = [
  { id: 'nps', name: 'NPS Survey', description: 'Net Promoter Score - how likely to recommend' },
  { id: 'satisfaction', name: 'Customer Satisfaction', description: 'Overall satisfaction and experience' },
  { id: 'feature', name: 'Feature Feedback', description: 'Which features matter most?' },
  { id: 'problem_discovery', name: 'Problem Discovery', description: 'Understand pain points and needs' },
  { id: 'onboarding', name: 'Onboarding Feedback', description: 'How was the sign-up experience?' },
  { id: 'churn', name: 'Exit Survey', description: 'Why are users leaving?' },
  { id: 'pricing', name: 'Pricing Research', description: 'Willingness to pay and value perception' },
  { id: 'testing', name: 'User Testing', description: 'Get feedback on new features' }
]

export const feedbackCollectionTask = {
  id: 'feedback-1',
  name: 'Generate Survey Questions',
  description: 'Create custom survey questions tailored to your research goal',
  category: 'feedback',
  tier: 'premium',

  // Phase 6: Field inheritance mappings
  fieldMappings: {
    'target_audience': 'targetAudience',
    'product_context': 'productDescription',
    // Task-specific fields
    'research_goal': null,
    'survey_type': null,
    'distribution_channels': null,
    'response_goal': null,
    'incentive_budget': null
  },

  what: 'Generate custom survey questions tailored to your specific research goal. Get AI-crafted questions designed to uncover actionable insights, plus distribution strategies, outreach templates, and an analysis framework. Stop guessing - get feedback that drives product decisions.',

  why: 'Generic survey templates miss the nuances of YOUR business. AI-generated questions based on your specific goal, audience, and context yield 3x more actionable insights. Plus, 80% of surveys fail due to poor question design - we fix that.',

  how: 'Describe what you want to learn, who you\'re surveying, and how you\'ll reach them. AI generates custom questions with the right format (scale, open-text, multiple choice), optimal order, and follow-up logic. You also get ready-to-use outreach templates and an analysis framework.',

  customComponent: 'FeedbackCollectionMiniApp',
  surveyTypes: surveyTypes,

  form: [
    {
      id: 'research_goal',
      type: 'textarea',
      label: 'What Do You Want to Learn?',
      placeholder: 'Example: "Understand why users abandon our checkout flow" or "Validate if customers want a mobile app before we build it" or "Find out which 3 features would make power users upgrade to Pro"',
      description: 'Be specific about the insights you need. The more focused your goal, the better the questions.',
      required: true,
      rows: 3
    },
    {
      id: 'target_audience',
      type: 'textarea',
      label: 'Who Are You Surveying?',
      placeholder: 'Example: "Active customers who\'ve used the product for 30+ days" or "Users who signed up but never made a purchase" or "Churned customers from the last 90 days"',
      description: 'Define your target respondents. Different audiences need different question approaches.',
      rows: 2
    },
    {
      id: 'survey_type',
      type: 'select',
      label: 'What Type of Survey?',
      options: [
        { value: 'nps', label: 'NPS (Net Promoter Score) - loyalty and recommendation' },
        { value: 'satisfaction', label: 'Customer Satisfaction - overall experience' },
        { value: 'feature_feedback', label: 'Feature Feedback - what to build next' },
        { value: 'problem_discovery', label: 'Problem Discovery - understand pain points' },
        { value: 'onboarding', label: 'Onboarding Feedback - first impressions' },
        { value: 'churn', label: 'Exit Survey - why customers leave' },
        { value: 'pricing', label: 'Pricing Research - willingness to pay' },
        { value: 'user_testing', label: 'User Testing - feedback on specific feature' },
        { value: 'custom', label: 'Custom - mixed question types' }
      ],
      required: true,
      description: 'This determines the question framework and metrics we\'ll use'
    },
    {
      id: 'product_context',
      type: 'textarea',
      label: 'Brief Product/Service Context',
      placeholder: 'Example: "SaaS project management tool for small teams, $29/month, competitors are Asana and Monday"',
      description: 'Help AI understand your business so questions are relevant',
      rows: 2
    },
    {
      id: 'distribution_channels',
      type: 'checkboxes',
      label: 'How Will You Reach Respondents?',
      options: [
        { value: 'email', label: 'Email to existing customers/users' },
        { value: 'in_app', label: 'In-app popup or modal' },
        { value: 'social', label: 'Social media (Twitter, LinkedIn, etc.)' },
        { value: 'community', label: 'Community (Slack, Discord, forum)' },
        { value: 'direct', label: 'Direct outreach (personal messages)' },
        { value: 'website', label: 'Website popup or embedded' },
        { value: 'post_purchase', label: 'Post-purchase/post-signup flow' }
      ],
      description: 'We\'ll tailor outreach templates for your chosen channels'
    },
    {
      id: 'response_goal',
      type: 'number',
      label: 'Target Number of Responses',
      placeholder: '20',
      min: 5,
      suffix: 'responses',
      description: 'Aim for 20-50 for qualitative insights, 100+ for statistically significant quantitative data'
    },
    {
      id: 'incentive_budget',
      type: 'select',
      label: 'Incentive Budget',
      options: [
        { value: 'none', label: 'No incentives (lower response rate)' },
        { value: 'low', label: 'Low ($5-10 per response or prize draw)' },
        { value: 'medium', label: 'Medium ($15-25 per response)' },
        { value: 'high', label: 'High ($50+ per response - for interviews)' },
        { value: 'non_monetary', label: 'Non-monetary (early access, free month, etc.)' }
      ],
      description: 'Incentives boost response rates 3-5x. Worth it for important research.'
    },
    {
      id: 'existing_hypotheses',
      type: 'textarea',
      label: 'Any Hypotheses to Validate? (Optional)',
      placeholder: 'Example: "We think users churn because onboarding is too complex" or "We believe pricing is the main objection"',
      description: 'If you have specific assumptions to test, we\'ll design questions to validate or invalidate them',
      rows: 2
    }
  ],

  ai: {
    template: `You are an expert user researcher with 15 years of experience designing surveys that generate actionable insights. Create a complete, tailored feedback collection plan.

## INPUTS

**Research Goal:** {research_goal}
**Target Audience:** {target_audience}
**Survey Type:** {survey_type}
**Product Context:** {product_context}
**Distribution Channels:** {distribution_channels}
**Response Goal:** {response_goal} responses
**Incentive Budget:** {incentive_budget}
**Hypotheses to Validate:** {existing_hypotheses}

---

## YOUR TASK

Generate a complete survey plan with custom questions, distribution strategy, and analysis framework. Make every question count - no filler, no generic templates.

---

# YOUR CUSTOM SURVEY PLAN

## 1. SURVEY QUESTIONS (5-7 Questions)

Design questions specifically for {survey_type} survey targeting {target_audience}.

**Question 1: [OPENER - Easy, engaging question]**
- **Question:** "[Write the exact question]"
- **Type:** [Multiple Choice / Rating Scale 1-5 / Rating Scale 0-10 / Open Text / Yes/No]
- **Why This Question:** [1-sentence rationale - what insight does this unlock?]
- **Options (if applicable):** [List specific answer options]

**Question 2: [CORE INSIGHT - Gets to the heart of research goal]**
- **Question:** "[Exact question]"
- **Type:** [Type]
- **Why This Question:** [Rationale]
- **Options (if applicable):** [Options]

**Question 3: [DEPTH - Probes deeper into main topic]**
- **Question:** "[Exact question]"
- **Type:** [Type - recommend Open Text for depth]
- **Why This Question:** [Rationale]
- **Follow-up Prompt:** [If applicable, what to ask based on answer]

**Question 4: [QUANTIFIABLE - Something you can measure over time]**
- **Question:** "[Exact question]"
- **Type:** [Rating Scale preferred]
- **Why This Question:** [Rationale]
- **Benchmark:** [What score is "good" for this type of question]

**Question 5: [ACTIONABLE - Points to specific improvements]**
- **Question:** "[Exact question]"
- **Type:** [Type]
- **Why This Question:** [Rationale]

**Question 6: [PRIORITY - Forces ranking or prioritization]**
- **Question:** "[Exact question]"
- **Type:** [Ranking / Select top 3 / Forced choice]
- **Why This Question:** [Rationale]
- **Options:** [Specific options to rank]

**Question 7: [CLOSER - Open-ended catch-all]**
- **Question:** "Is there anything else you'd like to share about [topic]?"
- **Type:** Open Text
- **Why This Question:** Catches insights you didn't think to ask about

---

## 2. QUESTION FLOW STRATEGY

**Recommended Order:**
1. [Question X] - Start easy to build momentum
2. [Question X] - Transition to core topic
3. [Question X] - Deepest/most thoughtful question (they're engaged now)
4. [Question X] - Quantifiable metric
5. [Question X] - Action-oriented
6. [Question X] - Priority/ranking
7. [Question X] - Open-ended closer

**Logic Jumps (Skip Logic):**
- If [answer to Q1] = [option], then show [follow-up question]
- If [answer to Q4] < [threshold], then show [specific follow-up for low scorers]

**Estimated Completion Time:** [X] minutes

---

## 3. DISTRIBUTION STRATEGY

Based on your channels ({distribution_channels}) and goal of {response_goal} responses:

### Channel 1: [Primary Channel]
**Expected Response Rate:** [X]%
**Responses Needed to Send:** [Calculate: response_goal / rate]
**Best Timing:** [Day of week, time of day]
**Key Tactic:** [Specific approach for this channel]

### Channel 2: [Secondary Channel]
**Expected Response Rate:** [X]%
**Responses Needed to Send:** [X]
**Best Timing:** [Timing]
**Key Tactic:** [Tactic]

### Backup Plan:
If response rate is lower than expected after 3 days:
- [Specific action to boost responses]
- [Second backup tactic]

---

## 4. OUTREACH TEMPLATES

### Email Template (Primary)

**Subject Line Options:**
1. "[First Name], quick question about your experience"
2. "2 minutes to help shape [Product]'s future"
3. "[First Name], we'd love your feedback (+ [incentive])"

**Email Body:**
\`\`\`
Hi [First Name],

[1-sentence context: why you're reaching out]

I'm [Name] from [Company], and we're trying to [brief description of goal].

Your perspective matters because [specific reason this person's feedback is valuable].

Would you mind taking 2-3 minutes to answer [X] quick questions?

[SURVEY LINK]

[If incentive: "As a thank you, you'll receive [incentive details]."]

Thanks so much,
[Name]

P.S. [Personal touch or urgency element]
\`\`\`

### In-App/Popup Template

**Trigger:** [When to show: after X action, on Y page, etc.]

**Copy:**
\`\`\`
[Headline: Short, benefit-focused]

[1 sentence context]

[CTA Button: "Share Feedback" or "Take 2-min Survey"]
[Dismiss: "Maybe later"]
\`\`\`

### Follow-Up Reminder (Day 3-4)

**Subject:** "Quick reminder: your feedback matters"

**Body:**
\`\`\`
Hi [First Name],

Just a friendly nudge - we're still hoping to hear from you.

[Survey Link]

[New angle or additional context on why their input helps]

Thanks,
[Name]
\`\`\`

---

## 5. INCENTIVE RECOMMENDATIONS

Based on your budget ({incentive_budget}) and audience ({target_audience}):

**Recommended Incentive:**
- **Type:** [Specific incentive that works for this audience]
- **Value:** $[X] per response OR [alternative]
- **Expected Response Rate Boost:** [X]x increase

**Alternatives:**
1. [Alternative incentive option 1]
2. [Alternative incentive option 2]

**Implementation:**
- [How to deliver the incentive]
- [Timing of incentive delivery]

---

## 6. RESPONSE ANALYSIS FRAMEWORK

### Quantitative Analysis (Rating Scales)

**Key Metrics to Calculate:**
- [Metric 1]: [How to calculate] - Target: [benchmark]
- [Metric 2]: [How to calculate] - Target: [benchmark]

**Segmentation:**
Analyze responses by:
- [Segment 1: e.g., customer tenure, plan type]
- [Segment 2: e.g., usage frequency]

### Qualitative Analysis (Open-Ended)

**Step 1: Read All Responses Twice**
First pass: Note initial impressions
Second pass: Start tagging themes

**Step 2: Theme Categorization**
Create tags for:
- [Category 1 based on research goal]
- [Category 2]
- [Category 3]
- [Category 4: Surprising/unexpected]

**Step 3: Quote Extraction**
Pull 5-10 powerful quotes that:
- Represent common sentiments
- Highlight specific pain points
- Suggest specific solutions

**Step 4: Pattern Identification**
Look for:
- Most common theme (appears in X% of responses)
- Second most common
- Correlation between answers (do X respondents also say Y?)

---

## 7. HYPOTHESIS VALIDATION

Based on your hypotheses: {existing_hypotheses}

**How to Validate:**
- [Hypothesis 1]: Look for [specific evidence] in [Question X] responses
- If [X]% of respondents [answer pattern], hypothesis is [validated/invalidated]

**Decision Criteria:**
- If [condition], then [action to take]
- If [condition], then [alternative action]

---

## 8. ACTION PLAN CHECKLIST

### Before Launch (Day 0)
- [ ] Create survey in [recommended tool based on survey_type]
- [ ] Test survey yourself (check timing, flow, mobile experience)
- [ ] Have 2-3 people test and give feedback on questions
- [ ] Prepare distribution list/channels
- [ ] Set up tracking (response count, completion rate)

### Launch Week (Days 1-7)
- [ ] Send initial outreach via [primary channel]
- [ ] Monitor first 24 hours for issues
- [ ] Day 3-4: Send reminder to non-respondents
- [ ] Day 5-6: Activate backup channels if needed
- [ ] Day 7: Second reminder if short of goal

### Analysis (Day 8-10)
- [ ] Close survey (don't leave open indefinitely)
- [ ] Export all responses
- [ ] Calculate quantitative metrics
- [ ] Read all open-ended responses twice
- [ ] Tag and categorize themes
- [ ] Create summary document with top insights

### Action (Day 10+)
- [ ] Share findings with team
- [ ] Prioritize insights by impact
- [ ] Create action items from feedback
- [ ] Plan follow-up communication to respondents

---

## 9. COMMON PITFALLS TO AVOID

For {survey_type} surveys targeting {target_audience}:

1. **[Specific Pitfall]:** [Why it's a problem and how to avoid]
2. **[Specific Pitfall]:** [Why and how to avoid]
3. **[Specific Pitfall]:** [Why and how to avoid]

---

## 10. BENCHMARK EXPECTATIONS

**For {survey_type} surveys:**
- Typical response rate: [X-Y]%
- Good completion rate: [X]%+
- Time to reach {response_goal} responses: [X-Y days]

**Signs of Success:**
- [What a successful outcome looks like]
- [Specific metric to track]

**Red Flags:**
- [What indicates a problem]
- [How to course-correct]

---

**Ready to launch?** Start with the "Before Launch" checklist above. Your survey questions are designed to answer: "{research_goal}" - stay focused on this goal when analyzing results.`,

    temperature: 0.7,
    maxTokens: 3000
  },

  output: {
    enabled: true,
    exportFilename: 'survey-plan',
    displayFormat: 'text',
    editable: true,
    deletable: true,
    exportable: true,
    copyable: true
  },

  help: {
    examples: [
      {
        scenario: 'SaaS company wants to reduce churn',
        input: {
          research_goal: 'Understand why customers cancel within the first 30 days',
          target_audience: 'Customers who cancelled in the last 60 days',
          survey_type: 'churn',
          distribution_channels: ['email'],
          response_goal: 30,
          incentive_budget: 'low'
        },
        output: 'Custom 6-question exit survey: 1) Primary reason for leaving (forced choice with specific options based on product type), 2) What nearly stopped you from cancelling? (open text), 3) Rate value vs. price (1-10 scale), 4) What would bring you back? (open text), 5) Which competitor did you switch to? (multiple choice), 6) Anything else? Three email templates with re-engagement angles, analysis framework for categorizing churn reasons, and prioritization matrix for fixes.'
      },
      {
        scenario: 'Startup validating new feature before building',
        input: {
          research_goal: 'Validate if customers want a mobile app before we invest 3 months building it',
          target_audience: 'Active Pro plan customers who use the product weekly',
          survey_type: 'feature_feedback',
          distribution_channels: ['email', 'in_app'],
          response_goal: 50,
          incentive_budget: 'non_monetary'
        },
        output: 'Validation-focused 5-question survey: 1) How often do you access [Product] away from your desk? (frequency scale), 2) What do you currently use when mobile? (open text), 3) Rate importance of mobile access (1-10), 4) Which 3 features would you need on mobile? (ranking from list), 5) Would you use a mobile app weekly? (yes/probably/unlikely/no). In-app popup targeting power users, email campaign with early access incentive, decision framework: build if 70%+ rate importance 7+ and 60%+ say "yes" to weekly use.'
      }
    ],
    commonMistakes: [
      'Asking too many questions - 20-question surveys get 5% completion rates. Keep it to 5-7 questions max, focusing on the most critical insights you need.',
      'Using vague questions - asking "How was your experience?" instead of specific "What nearly stopped you from signing up?" Specific questions get actionable answers.',
      'Not incentivizing responses - people are busy. Offer $10 gift card, free month, or entry to prize draw to boost response rates from 5% to 20-30%.',
      'Surveying at the wrong time - sending satisfaction surveys 5 minutes after signup before they\'ve used the product. Time surveys after meaningful usage (7 days for apps, post-purchase for e-commerce).',
      'Ignoring open-ended feedback - only analyzing multiple choice data and skipping the goldmine in text responses. Read every open-ended answer - that\'s where breakthrough insights hide.',
      'Collecting feedback but never acting - running surveys, seeing the same issues repeatedly, but not fixing them. Users notice when feedback goes into a black hole and stop responding.'
    ],
    proTips: [
      'Lead with the most important question: Put your #1 research question as Q2 or Q3 (after a warm-up). Most dropoffs happen at Q4+, so front-load the critical stuff.',
      'Use the "magic question" for feature validation: "If we removed [feature], how would you feel?" with options: Very disappointed / Somewhat disappointed / Not disappointed. 40%+ "very disappointed" = product-market fit.',
      'Time your surveys strategically: Post-purchase = within 24 hours. Satisfaction = after 7-14 days of use. Churn = within 48 hours of cancellation. Feature requests = after major usage milestone.',
      'Segment before you survey: A "power user" survey and a "casual user" survey will yield 10x better insights than one generic survey to everyone.',
      'Use verbatim quotes in your analysis: Numbers convince executives, but quotes convince product teams. Pull 5-10 powerful quotes that bring the data to life.',
      'Close the loop with respondents: Send a "here\'s what we learned and what we\'re changing" email after analysis. Response rates on future surveys increase 30-50%.',
      'Test with 5 people before launching: Send to 5 colleagues or friends first. If any question confuses them, rewrite it. Confused respondents give useless data.',
      'Set a hard deadline: Surveys left open indefinitely collect stale responses. Set a 7-10 day window and stick to it. Creates urgency and cleaner data.'
    ]
  }
}
