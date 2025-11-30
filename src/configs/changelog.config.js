export const changelogTask = {
  id: 'feedback-2',
  name: 'Publish Product Updates',
  description: 'Announce product updates across channels',
  category: 'feedback',

  // Freemium model - Premium tier task
  tier: 'premium',
  what: 'Create and publish product updates (changelog) across channels: in-app, email, blog, Twitter, Reddit. Keep users informed about improvements and new features.',
  why: 'Users want to know you\'re actively improving. Updates build excitement and retention. Users who see updates feel heard and supported by your team.',
  how: 'List your improvements, then get a multi-channel update package: in-app message, email template, blog post, Twitter thread, and Reddit post. Publish to each channel.',

  customComponent: 'ChangelogMiniApp',
  channels: [
    { id: 'twitter', name: 'Twitter/X', maxChars: 280, format: 'short' },
    { id: 'email', name: 'Email', maxChars: 1000, format: 'detailed' },
    { id: 'blog', name: 'Blog Post', maxChars: null, format: 'comprehensive' },
    { id: 'linkedin', name: 'LinkedIn', maxChars: 300, format: 'professional' },
    { id: 'slack', name: 'Slack', maxChars: 400, format: 'casual' }
  ],
  output: { enabled: false },

  help: {
    examples: [
      {
        scenario: 'SaaS product shipping new collaboration features',
        input: { updates: ['Real-time cursor tracking', 'Comment threads', 'File version history'], channels: ['twitter', 'email', 'blog'] },
        output: 'Multi-channel update package: concise Twitter thread highlighting the 3 new features with a demo GIF, detailed email to users explaining why each feature was built and how to use them, comprehensive blog post with screenshots and use cases for each feature.'
      },
      {
        scenario: 'Mobile app releasing bug fixes and performance improvements',
        input: { updates: ['Fixed crash on startup', '50% faster load times', 'New dark mode'], channels: ['twitter', 'slack'] },
        output: 'Twitter announcement emphasizing the speed improvement and new dark mode with before/after screenshots, casual Slack message for community thanking beta testers and listing all fixes in a friendly, conversational tone.'
      }
    ],
    commonMistakes: [
      'Only announcing major features - users want to know about ALL improvements, including bug fixes and performance boosts. Regular updates show you\'re actively improving, which builds trust.',
      'Using technical jargon - "Refactored database queries for 10x performance" means nothing to users. Say "App now loads 10x faster" instead. Focus on benefits, not implementation.',
      'Forgetting to explain WHY - listing features without context is boring. Tell users WHY you built this feature, what problem it solves, and how it makes their life better.',
      'Posting once and moving on - publish your update on one channel and call it done. Cross-post to ALL relevant channels (Twitter, email, blog, Slack, in-app) to maximize reach.',
      'No screenshots or demos - walls of text about new features get ignored. Always include screenshots, GIFs, or short demo videos showing the feature in action.',
      'Not asking for feedback - announcing updates as one-way broadcasts. Ask users "What do you think?" or "What should we build next?" to turn announcements into conversations.'
    ]
  }
}
