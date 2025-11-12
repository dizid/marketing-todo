export const featurePrioritizationTask = {
  id: 'feedback-3',
  name: 'Iterate on Features',
  description: 'Prioritize features based on impact & effort',
  category: 'feedback',

  // Freemium model - Premium tier task
  tier: 'premium',
  what: 'Prioritize feature requests using an impact/effort matrix. Analyze which features drive the most value relative to implementation complexity. Make data-driven roadmap decisions.',
  why: 'Most startups build the wrong features. 70% of coding effort goes to features users don\'t want. Impact/effort matrix ensures you build high-value features first.',
  how: 'List 10 feature ideas from user feedback, score each on impact (1-5) and effort (1-5), then AI sorts by impact/effort ratio. Discuss top 3 with your team to decide.',

  customComponent: 'FeaturePrioritizationMiniApp',
  quadrants: [
    { name: 'Quick Wins', color: '#10b981', description: 'High impact, low effort - do these first' },
    { name: 'Major Projects', color: '#6366f1', description: 'High impact, high effort - plan these' },
    { name: 'Nice to Have', color: '#f59e0b', description: 'Low impact, low effort - consider later' },
    { name: 'Time Sinks', color: '#ef4444', description: 'Low impact, high effort - avoid' }
  ],
  output: { enabled: false }
}
