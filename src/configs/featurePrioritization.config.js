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
  output: { enabled: false },

  help: {
    examples: [
      {
        scenario: 'SaaS with 15 feature requests from user feedback',
        input: { features: ['Dark mode', 'Slack integration', 'Mobile app', 'Export to PDF', 'Keyboard shortcuts', 'Team permissions', 'API access'], impact_scores: [3, 4, 5, 2, 4, 5, 3], effort_scores: [2, 3, 5, 1, 2, 4, 5] },
        output: 'Impact/Effort matrix placing features in 4 quadrants: Quick Wins (keyboard shortcuts, PDF export), Major Projects (mobile app, team permissions), Nice to Have (dark mode), Time Sinks (API access). Recommendation: prioritize keyboard shortcuts and PDF export for immediate wins, plan team permissions for next quarter, deprioritize API access.'
      },
      {
        scenario: 'E-commerce store prioritizing UX improvements',
        input: { features: ['One-click checkout', 'Guest checkout', 'Save for later', 'Wishlist', 'Product recommendations', 'Reviews'], impact_scores: [5, 5, 2, 3, 4, 5], effort_scores: [4, 2, 2, 3, 3, 2] },
        output: 'Matrix analysis revealing guest checkout and reviews as Quick Wins (high impact, low effort), one-click checkout as Major Project worth planning, save for later as Nice to Have. Data shows guest checkout could increase conversion 15-20% with only 1 week of development - highest ROI opportunity.'
      }
    ],
    commonMistakes: [
      'Scoring based on what YOU want, not users - marking features you personally love as "high impact" without user validation. Impact scores should reflect user demand and business value, not founder preferences.',
      'Underestimating effort systematically - marking everything as low effort then wondering why it takes 3x longer. Be realistic about complexity, especially integration and testing time.',
      'Building "nice to have" features before quick wins - doing low impact/low effort tasks first because they\'re easy. Prioritize high impact first, even if effort is higher.',
      'Not validating impact assumptions - assuming a feature will be high impact without talking to users. Validate with at least 5-10 customer conversations before scoring.',
      'Ignoring technical debt in effort calculation - only considering new feature code, forgetting refactoring needed to support it. Factor in infrastructure work when scoring effort.',
      'Never revisiting the matrix - scoring once and using it for 6 months as priorities shift. Reassess quarterly as you learn more about user needs and technical constraints.'
    ]
  }
}
