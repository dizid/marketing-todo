export const changelogTask = {
  id: 'feedback-2',
  name: 'Publish Product Updates',
  description: 'Announce product updates across channels',
  category: 'feedback',
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
