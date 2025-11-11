/**
 * Engage Followers Configuration
 * Templates for responding to followers
 */

export const interactionTypes = [
  {
    id: 'questions',
    name: 'Answer Questions',
    emoji: '❓',
    description: 'Users asking about your product',
    scenarios: [
      'How much does it cost?',
      'Is there a free trial?',
      'Does it work with [tool]?'
    ],
    templates: [
      'Great question! [Answer specific question]. Check out our docs here: [link]',
      'We\'re glad you asked! [Answer]. Feel free to reach out if you have more questions.',
      'Love this question! [Answer]. Our team is happy to help anytime.'
    ]
  },
  {
    id: 'compliments',
    name: 'Thank Supporters',
    emoji: '🙏',
    description: 'Users praising your product',
    scenarios: [
      'Love your product!',
      'Just launched and it\'s amazing!',
      'This saved us so much time!'
    ],
    templates: [
      'Thank you so much! 🙌 We\'re thrilled you\'re loving it. Your feedback means everything.',
      'This made our day! 💙 Thanks for the support. Can\'t wait to ship more features you\'ll love.',
      'We appreciate you! Thanks for being part of the journey. Let us know if you need anything.'
    ]
  },
  {
    id: 'feature-requests',
    name: 'Acknowledge Feature Requests',
    emoji: '💡',
    description: 'Users suggesting new features',
    scenarios: [
      'Would be great if you added X',
      'Have you considered Y feature?',
      'It would be perfect with Z'
    ],
    templates: [
      'Love the suggestion! We\'re tracking feature requests at [link]. Upvote there so we can prioritize.',
      'Great idea! This is something we\'ve been thinking about. Your use case helps us build better.',
      'Thanks for this feedback! We\'re always looking to improve. Let\'s chat about how we can help.'
    ]
  },
  {
    id: 'bug-reports',
    name: 'Respond to Issues',
    emoji: '🐛',
    description: 'Users reporting bugs',
    scenarios: [
      'I found a bug where...',
      'Something doesn\'t work...',
      'Error when I try...'
    ],
    templates: [
      'Thanks for reporting! We\'re investigating this. Can you send us more details at [email]?',
      'Sorry you experienced that! This isn\'t the experience we want. Let\'s fix it together. DM us?',
      'Appreciate you catching this! Our team is on it. We\'ll follow up within 24 hours.'
    ]
  },
  {
    id: 'general',
    name: 'General Engagement',
    emoji: '💬',
    description: 'General comments and chatter',
    scenarios: [
      'Just found your product!',
      'Interesting approach',
      'Looking forward to this'
    ],
    templates: [
      'Welcome! 👋 We\'d love to show you around. Let me know if you have any questions!',
      'Thanks for the interest! We\'re working hard to make this the best it can be.',
      'Your support means a lot! Don\'t hesitate to reach out if you need anything.'
    ]
  }
]

export const engageFollowersTask = {
  id: 'social-2',
  name: 'Engage Followers',
  description: 'Template responses for common interactions',
  category: 'social',

  // Freemium model - Premium tier task
  tier: 'premium',
  what: 'Build a systematic engagement strategy with templated responses for comments, DMs, and community interactions. Turn followers into brand advocates through consistent, authentic engagement.',
  why: 'Social media algorithms favor engagement. Posts with replies/comments get 5x more reach. Communities with engaged followers become word-of-mouth growth engines.',
  how: 'Review the 10 response templates (for compliments, questions, complaints, feedback requests, etc). Customize them with your voice, then copy-paste when responding to comments.',

  interactionTypes: interactionTypes,
  customComponent: 'EngageFollowersMiniApp',
  output: { enabled: false }
}
