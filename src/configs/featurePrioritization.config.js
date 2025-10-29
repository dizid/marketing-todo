export const featurePrioritizationTask = {
  id: 'feedback-3',
  name: 'Iterate on Features',
  description: 'Prioritize features based on impact & effort',
  category: 'feedback',
  customComponent: 'FeaturePrioritizationMiniApp',
  quadrants: [
    { name: 'Quick Wins', color: '#10b981', description: 'High impact, low effort - do these first' },
    { name: 'Major Projects', color: '#6366f1', description: 'High impact, high effort - plan these' },
    { name: 'Nice to Have', color: '#f59e0b', description: 'Low impact, low effort - consider later' },
    { name: 'Time Sinks', color: '#ef4444', description: 'Low impact, high effort - avoid' }
  ],
  output: { enabled: false }
}
