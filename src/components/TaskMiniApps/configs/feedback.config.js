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
  ],

  // Help content for users
  help: {
    examples: [
      {
        scenario: 'Product feature validation',
        input: { research_goal: 'Validate if customers want dark mode', target_audience: 'Active Pro plan users', survey_type: 'feature_requests' },
        output: 'NPS-style survey targeting 15 users, 2-week timeline, with follow-up interviews for detractors to understand objections'
      },
      {
        scenario: 'Onboarding pain point discovery',
        input: { research_goal: 'Understand why 40% of signups drop', target_audience: 'Users who abandoned signup', survey_type: 'problem_discovery' },
        output: 'Interview guide with 5 key questions, email campaign to gather 10+ responses, analysis to identify top 3 friction points'
      }
    ],
    commonMistakes: [
      'Asking leading questions - "Don\'t you think dark mode is essential?" will get "yes". Ask neutral: "What features would improve your experience?"',
      'Too many questions - People abandon long surveys. 5 questions = 80% completion, 20 questions = 20% completion.',
      'Only asking happy customers - Selection bias kills insights. Survey both happy and churned customers.',
      'Not following up on verbatim - "It\'s expensive" is different from "It\'s $5 more than my budget". Get specific.',
      'No incentive, no responses - People are busy. $5 gift card or 10-min free consulting lifts response rate 3-5x.',
      'Analysis paralysis - Don\'t wait for 100 responses. Analyze after 10-15 and spot patterns. Can always do more.'
    ]
  },

  // Tool Setup Tutorials
  toolTutorials: [
    {
      tool: 'Google Forms',
      tagline: 'Free, simple, perfect for quick surveys',
      difficulty: 'Beginner',
      timeToSetup: '5 minutes',
      steps: [
        {
          title: 'Create a new form',
          description: 'Go to forms.google.com and click "+ Blank" to create a new form. Give it a clear title like "Product Feedback Survey".'
        },
        {
          title: 'Add your questions',
          description: 'Click "+" to add questions. Use Multiple Choice for rating scales, Short Answer for open text, or Linear Scale for 1-10 ratings. Copy questions from the templates above.'
        },
        {
          title: 'Customize settings',
          description: 'Click the gear icon → turn on "Collect email addresses" if needed, limit to 1 response per person, and show progress bar for longer surveys.'
        },
        {
          title: 'Get shareable link',
          description: 'Click "Send" → Link icon → Check "Shorten URL" → Copy the link. Share via email, Slack, or social media.'
        },
        {
          title: 'View responses',
          description: 'Go to "Responses" tab to see answers in real-time. Click the Sheets icon to export all responses to Google Sheets for analysis.'
        }
      ],
      proTips: [
        'Enable "Email notifications" to get alerts when someone responds',
        'Use "Required" toggle on critical questions to avoid incomplete responses',
        'Preview the form before sending (eye icon) to test user experience'
      ]
    },
    {
      tool: 'Typeform',
      tagline: 'Beautiful, conversational surveys with higher completion rates',
      difficulty: 'Beginner',
      timeToSetup: '10 minutes',
      steps: [
        {
          title: 'Sign up and create',
          description: 'Go to typeform.com → Sign up (free plan available) → Click "Create typeform" → Choose "Start from scratch" or browse templates.'
        },
        {
          title: 'Add questions one-by-one',
          description: 'Typeform shows one question at a time (conversational). Click "+" to add questions. Choose Opinion Scale (1-10), Multiple Choice, or Long Text. Paste questions from templates.'
        },
        {
          title: 'Customize design',
          description: 'Click "Design" tab → Choose theme colors and fonts to match your brand. Upload a background image or logo if desired. Preview on mobile/desktop.'
        },
        {
          title: 'Configure logic jumps (optional)',
          description: 'Advanced: Click "Logic" on any question to show different follow-ups based on answers. Example: If NPS score < 7, ask "What disappointed you?"'
        },
        {
          title: 'Publish and share',
          description: 'Click "Publish" → Copy the unique link. Embed in email, website, or share directly. Track completion rate in real-time on dashboard.'
        }
      ],
      proTips: [
        'Free plan allows 10 responses/month - upgrade to Pro for unlimited',
        'Use "Thank You Screen" to add a personal touch or redirect to your site',
        'Enable Google Sheets integration to auto-export responses'
      ]
    },
    {
      tool: 'SurveyMonkey',
      tagline: 'Powerful analytics and professional survey features',
      difficulty: 'Intermediate',
      timeToSetup: '15 minutes',
      steps: [
        {
          title: 'Create account and survey',
          description: 'Go to surveymonkey.com → Sign up → Click "Create Survey" → Choose template (Product Feedback, NPS, Customer Satisfaction) or start blank.'
        },
        {
          title: 'Build your survey',
          description: 'Drag and drop question types (Multiple Choice, Rating Scale, Matrix, Open-Ended). Customize question text using templates from above. Add page breaks for long surveys.'
        },
        {
          title: 'Design and branding',
          description: 'Click "Style" tab → Choose color theme, add logo, customize fonts. Preview how it looks on desktop and mobile devices.'
        },
        {
          title: 'Set up collectors',
          description: 'Click "Send Survey" → Choose method: Web Link (for email/social), Email Invitation (send directly), or Website Embed. Copy link or generate embed code.'
        },
        {
          title: 'Analyze results',
          description: 'Go to "Analyze Results" → View response summaries, charts, and individual responses. Export to Excel/CSV or create custom reports with filters and cross-tabs.'
        }
      ],
      proTips: [
        'Free plan limited to 10 questions - paid plans unlock skip logic and more',
        'Use "Question Bank" for pre-written, research-backed questions',
        'Set up email reminders to non-responders to boost completion rate'
      ]
    },
    {
      tool: 'Calendly',
      tagline: 'Schedule user interviews and feedback calls effortlessly',
      difficulty: 'Beginner',
      timeToSetup: '10 minutes',
      steps: [
        {
          title: 'Sign up and connect calendar',
          description: 'Go to calendly.com → Sign up (free plan available) → Connect your Google/Outlook calendar so Calendly knows when you\'re available.'
        },
        {
          title: 'Create event type',
          description: 'Click "New Event Type" → Choose "One-on-One" → Name it "User Feedback Call" → Set duration (15, 30, or 60 minutes).'
        },
        {
          title: 'Set availability',
          description: 'Define when people can book you (e.g., weekdays 10am-4pm). Add buffer time between meetings. Set minimum notice period (e.g., 24 hours).'
        },
        {
          title: 'Customize booking page',
          description: 'Add description: "I\'d love to hear your feedback on [PRODUCT]". Add custom questions like "What area do you want to discuss?" or "What\'s your biggest challenge?"'
        },
        {
          title: 'Share your link',
          description: 'Copy your Calendly link (e.g., calendly.com/yourname/feedback) → Share via email, in-app message, or on your website. People book directly into your calendar.'
        }
      ],
      proTips: [
        'Add Zoom/Google Meet integration for automatic video call links',
        'Use email reminders to reduce no-shows (send 1 hour before call)',
        'Create different event types for different feedback topics'
      ]
    },
    {
      tool: 'Notion',
      tagline: 'Organize and synthesize feedback in one collaborative workspace',
      difficulty: 'Intermediate',
      timeToSetup: '20 minutes',
      steps: [
        {
          title: 'Create feedback database',
          description: 'Open Notion → Create new page → Add "Table - Inline" database. Name columns: Date, User, Feedback Type, Key Quote, Theme, Priority, Status.'
        },
        {
          title: 'Set up templates',
          description: 'Create a "User Interview Template" page with standard questions. Each time you conduct an interview, duplicate this template and fill it out during/after the call.'
        },
        {
          title: 'Log feedback entries',
          description: 'After each survey/interview, add a row to your database. Copy key quotes verbatim. Tag with themes (e.g., "Onboarding", "Pricing", "Feature Request").'
        },
        {
          title: 'Create views and filters',
          description: 'Create filtered views: "High Priority Feedback", "Feature Requests", "Bugs/Issues". Use tags and filters to spot patterns across multiple users.'
        },
        {
          title: 'Synthesize insights',
          description: 'Create a "Feedback Summary" page. Group similar feedback into themes. Add quotes as evidence. Note frequency (how many users mentioned it). Create action items.'
        }
      ],
      proTips: [
        'Link feedback entries to specific product features or pages',
        'Share workspace with your team for collaborative analysis',
        'Use "@mentions" to assign follow-up actions to team members'
      ]
    },
    {
      tool: 'Dovetail',
      tagline: 'Purpose-built for analyzing qualitative user research',
      difficulty: 'Advanced',
      timeToSetup: '30 minutes',
      steps: [
        {
          title: 'Sign up and create project',
          description: 'Go to dovetailapp.com → Sign up (free trial available) → Create a new project named "User Feedback Q1" or similar. Invite team members.'
        },
        {
          title: 'Import feedback data',
          description: 'Upload interview transcripts (text, audio, or video), survey responses (CSV), or type notes directly. Dovetail auto-transcribes audio/video files.'
        },
        {
          title: 'Highlight and tag insights',
          description: 'Read through transcripts and highlight key quotes. Tag each highlight with themes (e.g., "Pain Point", "Feature Request", "Positive"). Create custom tags as needed.'
        },
        {
          title: 'Identify patterns',
          description: 'Go to "Insights" tab → Dovetail automatically groups similar feedback. See which themes appear most frequently. Export charts showing top pain points or requests.'
        },
        {
          title: 'Create reports',
          description: 'Generate visual reports with quotes, frequency charts, and recommendations. Share reports with stakeholders or export as PDF. Track which insights led to product changes.'
        }
      ],
      proTips: [
        'Use "Fields" to capture user metadata (plan type, signup date, segment)',
        'Collaborate in real-time - team members can tag and comment together',
        'Connect Dovetail to Slack for feedback alerts and sharing insights'
      ]
    }
  ]
}
