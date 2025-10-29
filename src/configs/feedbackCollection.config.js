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
  surveyTypes: surveyTypes,
  customComponent: 'FeedbackCollectionMiniApp',
  output: { enabled: false }
}
