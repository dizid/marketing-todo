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
  output: { enabled: false }
}
