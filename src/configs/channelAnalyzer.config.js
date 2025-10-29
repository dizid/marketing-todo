export const channelAnalyzerTask = {
  id: 'analytics-2',
  name: 'Optimize Channels',
  description: 'Analyze which channels work best',
  category: 'analytics',
  customComponent: 'ChannelAnalyzerMiniApp',
  metrics: [
    { name: 'Traffic', label: 'Sessions/Visits', icon: '👥' },
    { name: 'Conversions', label: 'Sign-ups/Customers', icon: '✅' },
    { name: 'Cost', label: 'Spend (if paid)', icon: '💰' },
    { name: 'Revenue', label: 'Revenue from channel', icon: '💵' }
  ],
  output: { enabled: false }
}
