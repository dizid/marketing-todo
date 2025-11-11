export const channelAnalyzerTask = {
  id: 'analytics-2',
  name: 'Optimize Channels',
  description: 'Analyze which channels work best',
  category: 'analytics',

  // Freemium model fields
  tier: 'free',
  what: 'Analyze traffic and conversions from each channel (social, email, SEO, paid ads) side-by-side. See which channels drive the most valuable users.',
  why: 'Most startups waste 70% of their marketing budget on low-ROI channels. Identifying your winners lets you double down on what works and cut losers.',
  how: 'Enter metrics (traffic, signups, revenue) by channel from your analytics. Compare side-by-side and identify patterns—which channels get quality users vs. just clicks.',

  customComponent: 'ChannelAnalyzerMiniApp',
  metrics: [
    { name: 'Traffic', label: 'Sessions/Visits', icon: '👥' },
    { name: 'Conversions', label: 'Sign-ups/Customers', icon: '✅' },
    { name: 'Cost', label: 'Spend (if paid)', icon: '💰' },
    { name: 'Revenue', label: 'Revenue from channel', icon: '💵' }
  ],
  output: { enabled: false }
}
