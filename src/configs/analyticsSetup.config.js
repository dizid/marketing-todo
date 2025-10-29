export const analyticsTools = [
  {
    id: 'ga4',
    name: 'Google Analytics 4',
    icon: '📊',
    description: 'Free analytics for web traffic',
    setup_time: '15 min',
    key_metrics: ['Page views', 'Users', 'Bounce rate', 'Conversions']
  },
  {
    id: 'mixpanel',
    name: 'Mixpanel',
    icon: '🎯',
    description: 'Product analytics and funnels',
    setup_time: '30 min',
    key_metrics: ['User actions', 'Funnels', 'Retention', 'Cohorts']
  },
  {
    id: 'amplitude',
    name: 'Amplitude',
    icon: '📈',
    description: 'Advanced product analytics',
    setup_time: '45 min',
    key_metrics: ['User behavior', 'Events', 'Segmentation', 'Forecasting']
  },
  {
    id: 'hotjar',
    name: 'Hotjar',
    icon: '🔍',
    description: 'Heatmaps and user recordings',
    setup_time: '10 min',
    key_metrics: ['Heatmaps', 'Recordings', 'Polls', 'Surveys']
  },
  {
    id: 'segment',
    name: 'Segment',
    icon: '🔗',
    description: 'Data collection hub',
    setup_time: '60 min',
    key_metrics: ['All events', 'Unified data', 'Multi-platform']
  }
]

export const analyticsSetupTask = {
  id: 'analytics-1',
  name: 'Set Up Analytics',
  description: 'Configure analytics tools',
  category: 'analytics',
  tools: analyticsTools,
  customComponent: 'AnalyticsSetupMiniApp',
  output: { enabled: false }
}
