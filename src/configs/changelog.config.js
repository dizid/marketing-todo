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
  output: { enabled: false }
}
