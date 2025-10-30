/**
 * Collect User Feedback Mini-App Configuration
 *
 * This config defines form fields for planning user feedback collection,
 * along with survey templates, guides, and distribution strategies.
 */

export const feedbackConfig = {
  id: 'feedback',
  title: 'Collect User Feedback',
  description: 'Plan and execute user surveys/interviews to gather actionable feedback. Collect 10+ responses systematically.',

  // Form configuration
  formTitle: 'Feedback Collection Plan',
  formFields: [
    {
      id: 'research_goal',
      type: 'textarea',
      label: 'Research Goal / What do you want to learn?',
      placeholder: 'e.g., "Understand biggest pain points with onboarding" or "Validate feature idea before building"',
      rows: 3,
      required: true,
      description: 'What specific insights do you need?'
    },
    {
      id: 'target_audience',
      type: 'textarea',
      label: 'Target Audience',
      placeholder: 'e.g., "Current customers using Pro plan" or "People who abandoned signup"',
      rows: 2,
      description: 'Who should you survey?'
    },
    {
      id: 'survey_type',
      type: 'select',
      label: 'Survey Type',
      options: [
        { value: 'nps', label: 'NPS (Net Promoter Score)' },
        { value: 'satisfaction', label: 'General Satisfaction' },
        { value: 'feature_requests', label: 'Feature Requests' },
        { value: 'problem_discovery', label: 'Problem Discovery' },
        { value: 'post_experience', label: 'Post-Demo/Usage Experience' },
        { value: 'interview', label: 'Interview Guide' },
        { value: 'mixed', label: 'Mixed (Multiple question types)' }
      ],
      required: true,
      description: 'Which type best fits your goal?'
    },
    {
      id: 'target_responses',
      type: 'number',
      label: 'Target Number of Responses',
      placeholder: '10',
      min: 1,
      suffix: 'responses',
      description: 'How many people do you want to survey?'
    },
    {
      id: 'timeline',
      type: 'text',
      label: 'Timeline / Deadline',
      placeholder: 'e.g., "2 weeks" or "by end of month"',
      description: 'When do you need the feedback?'
    },
    {
      id: 'distribution_channels',
      type: 'textarea',
      label: 'Distribution Channels',
      placeholder: 'e.g., "Email to existing customers\nSlack community\nIn-app popup\nTwitter poll"',
      rows: 3,
      description: 'Where/how will you reach people?'
    },
    {
      id: 'budget',
      type: 'select',
      label: 'Budget for Incentives',
      options: [
        { value: 'free', label: 'None - unpaid' },
        { value: 'low', label: 'Low ($10-50 total)' },
        { value: 'medium', label: 'Medium ($50-200)' },
        { value: 'high', label: 'High ($200+)' }
      ],
      description: 'Will you offer incentives?'
    },
    {
      id: 'notes',
      type: 'textarea',
      label: 'Additional Notes',
      placeholder: 'Any other context or constraints?',
      rows: 2,
      description: 'Anything else we should know?'
    }
  ],

  // NO AI - template/guide based
  aiConfig: null,

  // Don't show default output
  showOutput: false,

  // Guides
  guides: {
    preCollection: {
      title: '📋 Pre-Survey Checklist',
      items: [
        '✓ Define 3-5 specific research questions you need answered',
        '✓ Choose survey type based on your goal (NPS, satisfaction, discovery, etc.)',
        '✓ Write clear, unbiased survey questions (avoid leading questions)',
        '✓ Test survey with 1-2 people to catch confusing wording',
        '✓ Decide on target audience and how to reach them',
        '✓ Choose survey platform (Typeform, Google Forms, SurveyMonkey)',
        '✓ Set up distribution channels (email, Slack, in-app, etc.)',
        '✓ Create follow-up email for non-responders (plan 2-3 reminders)',
        '✓ Prepare incentive if using one (discount, free access, etc.)',
        '✓ Set response deadline and remind yourself to close on time'
      ]
    },

    duringCollection: {
      title: '🎯 During Survey Distribution',
      items: [
        '✓ Launch survey across all planned channels simultaneously',
        '✓ Monitor response rate in first 24-48 hours',
        '✓ Send first reminder email at day 3-4',
        '✓ Send second reminder at day 7-8',
        '✓ Note which channels get best response rates',
        '✓ Look for patterns in responses as they come in',
        '✓ Reach out personally to key customers if response rate is low',
        '✓ Keep survey live for full planned duration',
        '✓ Close survey at deadline (don\'t leave open indefinitely)',
        '✓ Export raw responses to spreadsheet'
      ]
    },

    analysis: {
      title: '📊 After Collection - Analysis',
      items: [
        '✓ Consolidate all responses in one document',
        '✓ Read through all responses at least twice',
        '✓ Highlight key quotes and themes',
        '✓ Group similar feedback together',
        '✓ Calculate percentages for quantitative responses',
        '✓ Identify top 3-5 most common pain points',
        '✓ Note any surprising or contradictory feedback',
        '✓ Identify patterns by customer segment (if applicable)',
        '✓ Create summary document with top insights',
        '✓ Share findings with team + discuss action items'
      ]
    }
  },

  // Survey templates
  templates: {
    nps: {
      title: 'NPS (Net Promoter Score) Survey',
      questions: `Question 1: "On a scale of 0-10, how likely are you to recommend [PRODUCT] to a colleague?"
(0 = Not at all likely, 10 = Extremely likely)

Question 2 (Follow-up): "What's the primary reason for your score?"
(Open text response)

---

TIP: Anything 9-10 = Promoter (good), 7-8 = Passive (neutral), 0-6 = Detractor (problem).
Track your score over time to see if it improves.`
    },

    satisfaction: {
      title: 'General Satisfaction Survey',
      questions: `Q1: "Overall, how satisfied are you with [PRODUCT]?"
□ Very satisfied  □ Satisfied  □ Neutral  □ Dissatisfied  □ Very dissatisfied

Q2: "How well does [PRODUCT] solve your [PROBLEM]?"
□ Solves it completely  □ Solves it well  □ Solves it somewhat  □ Doesn't solve it

Q3: "Which feature is most valuable to you?"
□ Feature A  □ Feature B  □ Feature C  □ Other: ___

Q4: "What's the biggest issue or limitation you've encountered?"
(Open text)

Q5: "How likely are you to continue using [PRODUCT]?"
□ Very likely  □ Somewhat likely  □ Not sure  □ Unlikely

Q6: "What one change would improve your experience the most?"
(Open text)`
    },

    featureRequests: {
      title: 'Feature Request Survey',
      questions: `Q1: "What's the biggest gap or missing feature in [PRODUCT] for you?"
(Open text - specific)

Q2: "How much would this feature improve your workflow?"
□ Dramatically  □ Significantly  □ Somewhat  □ Slightly

Q3: "Which of these potential features is most important to you?"
□ Feature Idea A
□ Feature Idea B
□ Feature Idea C
□ Feature Idea D
□ Other: ___

Q4: "How long have you wanted this feature?"
□ Since day 1  □ A few months  □ Weeks  □ Just realized it

Q5: "Would this feature alone make you upgrade/stay longer?"
□ Yes, definitely  □ Maybe  □ Probably not

Q6: "Any other features or improvements?"
(Open text)`
    },

    problemDiscovery: {
      title: 'Problem Discovery Interview Guide',
      questions: `Opening: "Thanks for taking time to chat. I want to understand your experience with [AREA]. There are no wrong answers."

Q1: "What's your biggest pain point with [SPECIFIC PROBLEM]?"
(Listen - don't interrupt. Ask follow-ups: "Tell me more...")

Q2: "How are you currently solving this problem?"
(Listen for workarounds, tools they use, manual processes)

Q3: "What have you already tried?"
(Ask what didn't work and why)

Q4: "How much time/money does this problem cost you per [week/month]?"
(Quantify the impact)

Q5: "What would an ideal solution look like?"
(Let them describe their dream scenario)

Q6: "If you could solve just ONE thing tomorrow, what would it be?"
(Forces prioritization)

Closing: "Is there anything else I should know?"

TIP: Record the conversation (with permission) so you can review it later.`
    }
  },

  // Distribution strategies
  distributionStrategies: [
    {
      channel: 'Email',
      effort: 'Low',
      reach: 'High',
      pros: 'Reaches many, trackable open/click rates',
      cons: 'Lower response rate than direct outreach',
      template: 'Subject: Quick feedback needed - [2 min survey]\n\nHi [NAME],\n\nWe\'re improving [PRODUCT] and your feedback would help. Could you spare 2 minutes to answer 5 quick questions?\n\n[SURVEY LINK]\n\nThanks,\n[YOUR NAME]'
    },
    {
      channel: 'In-App Popup',
      effort: 'Medium',
      reach: 'High (active users)',
      pros: 'Captures feedback from active users immediately',
      cons: 'May annoy some users if poorly timed',
      template: 'Short popup after key action:\n"How\'s it going? [Yes, capture feedback] [Not now]"\nLink to survey'
    },
    {
      channel: 'Direct Outreach',
      effort: 'High',
      reach: 'Low (5-20 people)',
      pros: 'Highest response rate + depth of feedback',
      cons: 'Time-consuming, only works for small groups',
      template: 'Personal email:\n"Hi [NAME], I\'m personally reaching out because your feedback on [TOPIC] would be invaluable. Would you have 15 min for a quick call?\n\n[CALENDLY LINK]"'
    },
    {
      channel: 'Slack/Community',
      effort: 'Low',
      reach: 'Medium',
      pros: 'Engages engaged community, fast response',
      cons: 'Biased sample (active community members)',
      template: 'Hey @channel, we\'re collecting feedback on [TOPIC]. If you have 2 min, this 5-question survey would help us a lot: [LINK]'
    },
    {
      channel: 'Twitter/Social Poll',
      effort: 'Low',
      reach: 'Medium',
      pros: 'Quick, viral potential, easy sharing',
      cons: 'Shallow feedback, biased audience',
      template: 'Twitter Poll:\n"What\'s your biggest challenge with [TOPIC]?\n\nA) Option 1 (details)\nB) Option 2 (details)\nC) Option 3 (details)"'
    }
  ],

  // Tools recommendations
  tools: [
    {
      category: 'Survey Platforms',
      items: [
        { name: 'Typeform', link: 'https://typeform.com', pros: 'Beautiful UI, conversational flow' },
        { name: 'Google Forms', link: 'https://forms.google.com', pros: 'Free, simple, integrates with Sheets' },
        { name: 'SurveyMonkey', link: 'https://surveymonkey.com', pros: 'Powerful analytics, templates' },
        { name: 'Qualtrics', link: 'https://qualtrics.com', pros: 'Enterprise-grade, advanced analysis' }
      ]
    },
    {
      category: 'Interview/Conversation',
      items: [
        { name: 'Calendly', link: 'https://calendly.com', pros: 'Schedule calls easily' },
        { name: 'Notion', link: 'https://notion.so', pros: 'Track interview notes and themes' },
        { name: 'Airtable', link: 'https://airtable.com', pros: 'Database for organizing responses' }
      ]
    },
    {
      category: 'Analysis & Synthesis',
      items: [
        { name: 'Google Sheets', link: 'https://sheets.google.com', pros: 'Free, collaborative, easy pivot tables' },
        { name: 'Dovetail', link: 'https://dovetailapp.com', pros: 'Built for analyzing qualitative feedback' },
        { name: 'Miro', link: 'https://miro.com', pros: 'Visualize themes and affinity mapping' }
      ]
    }
  ]
}
