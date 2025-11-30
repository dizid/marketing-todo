export const surveyTypes = [
  { id: 'nps', name: 'NPS Survey', description: 'Net Promoter Score - how likely to recommend' },
  { id: 'feature', name: 'Feature Feedback', description: 'Which features matter most?' },
  { id: 'onboarding', name: 'Onboarding', description: 'How was the sign-up experience?' },
  { id: 'churn', name: 'Exit Survey', description: 'Why are users leaving?' },
  { id: 'testing', name: 'User Testing', description: 'Get feedback on new features' }
]

export const feedbackCollectionTask = {
  id: 'feedback-1',
  name: 'Collect User Feedback',
  description: 'Create surveys and collect user feedback',
  category: 'feedback',

  // Freemium model - Premium tier task
  tier: 'premium',
  what: 'Create and launch surveys to 10+ users with 5 proven survey templates (NPS, satisfaction, feature request, retention, pricing). Analyze feedback to guide product decisions.',
  why: 'User feedback reveals what to build next. Guessing wastes months. Direct feedback from 10 users beats opinions from 100 investors. Fast feedback loops = faster growth.',
  how: 'Choose your survey type (NPS, satisfaction, feature ideas, churn, pricing), customize 5-10 questions, generate a shareable link, then collect responses in a spreadsheet.',

  surveyTypes: surveyTypes,
  customComponent: 'FeedbackCollectionMiniApp',
  output: { enabled: false },

  help: {
    examples: [
      {
        scenario: 'SaaS collecting NPS feedback to measure customer satisfaction',
        input: { survey_type: 'nps', distribution: 'email to active users' },
        output: 'NPS survey with 11-point scale "How likely are you to recommend us to a friend?" plus follow-up questions for promoters (what do you love?) and detractors (what could we improve?). Email template for distribution, response tracking spreadsheet, and analysis framework to calculate NPS score and identify patterns.'
      },
      {
        scenario: 'E-commerce store surveying customers who churned',
        input: { survey_type: 'churn', distribution: 'exit popup and follow-up email' },
        output: 'Exit survey with 5-7 questions uncovering why customers left: pricing concerns, feature gaps, customer service issues, or found better alternative. Multi-choice plus open-ended questions, automated email follow-up for non-respondents, categorization framework to identify top churn reasons and action items.'
      }
    ],
    commonMistakes: [
      'Asking too many questions - 20-question surveys get 5% completion rates. Keep it to 5-7 questions max, focusing on the most critical insights you need.',
      'Using vague questions - asking "How was your experience?" instead of specific "What nearly stopped you from signing up?" Specific questions get actionable answers.',
      'Not incentivizing responses - people are busy. Offer $10 gift card, free month, or entry to prize draw to boost response rates from 5% to 20-30%.',
      'Surveying at the wrong time - sending satisfaction surveys 5 minutes after signup before they\'ve used the product. Time surveys after meaningful usage (7 days for apps, post-purchase for e-commerce).',
      'Ignoring open-ended feedback - only analyzing multiple choice data and skipping the goldmine in text responses. Read every open-ended answer - that\'s where breakthrough insights hide.',
      'Collecting feedback but never acting - running surveys, seeing the same issues repeatedly, but not fixing them. Users notice when feedback goes into a black hole and stop responding.'
    ]
  }
}
