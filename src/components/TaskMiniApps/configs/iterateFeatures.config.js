/**
 * Iterate on Features Mini-App Configuration
 *
 * This config defines form fields for feature prioritization using a 2x2 Impact/Effort Matrix,
 * along with step-by-step guides, evaluation frameworks, and tool recommendations.
 */

export const iterateFeaturesConfig = {
  id: 'iterate-features',
  title: 'Iterate on Features',
  description: 'Prioritize features based on impact and implementation effort using a priority matrix framework.',

  // Form configuration
  formTitle: 'Feature Evaluation',
  formFields: [
    {
      id: 'feature_name',
      type: 'text',
      label: 'Feature Name',
      placeholder: 'e.g., "Dark Mode", "API Integration", "Advanced Search"',
      required: true,
      description: 'What is the feature or improvement you want to evaluate?'
    },
    {
      id: 'user_impact',
      type: 'select',
      label: 'User Impact',
      options: [
        { value: 'low', label: 'Low - Minor improvement for a few users' },
        { value: 'medium', label: 'Medium - Useful for many users' },
        { value: 'high', label: 'High - Critical for user experience or retention' }
      ],
      required: true,
      description: 'How much value would this add for users?'
    },
    {
      id: 'implementation_effort',
      type: 'select',
      label: 'Implementation Effort',
      options: [
        { value: 'low', label: 'Low - Simple, 1-2 days of work' },
        { value: 'medium', label: 'Medium - Moderate, 1-2 weeks of work' },
        { value: 'high', label: 'High - Complex, 1+ months of work' }
      ],
      required: true,
      description: 'How much effort would it take to implement?'
    },
    {
      id: 'customer_requests',
      type: 'number',
      label: 'Customer Requests',
      placeholder: '0',
      min: 0,
      description: 'How many customers have asked for this?'
    },
    {
      id: 'business_value',
      type: 'textarea',
      label: 'Business Value',
      placeholder: 'e.g., "Increases retention by reducing churn", "Enables enterprise sales", "Differentiates from competitors"',
      rows: 2,
      description: 'Why is this feature important for your business?'
    },
    {
      id: 'notes',
      type: 'textarea',
      label: 'Additional Notes',
      placeholder: 'Any dependencies, risks, or constraints?',
      rows: 2,
      description: 'Any context we should know?'
    }
  ],

  // NO AI for this task - template/guide based
  aiConfig: null,

  // Don't show default output
  showOutput: false,

  // Guides
  guides: {
    gathering: {
      title: '📋 Gathering Feature Requests',
      items: [
        '✓ Collect feedback from customer interviews and calls',
        '✓ Review support tickets and common feature requests',
        '✓ Monitor community forums and discussion boards',
        '✓ Analyze social media mentions and Twitter conversations',
        '✓ Check competitor feature sets and industry trends',
        '✓ Survey users about desired improvements',
        '✓ Track feature requests in a central system (Canny, ProductBoard)',
        '✓ Prioritize by frequency (how many people asked?)',
        '✓ Identify patterns in similar requests',
        '✓ Document the source and context of each request'
      ]
    },

    framework: {
      title: '🎯 Prioritization Framework (Impact vs Effort)',
      items: [
        '✓ Assess IMPACT: How much value does this add? (Low/Medium/High)',
        '✓ Assess EFFORT: How much work is required? (Low/Medium/High)',
        '✓ Plot feature on 2x2 matrix (4 quadrants)',
        '✓ QUICK WINS (High Impact, Low Effort) - Do these FIRST',
        '✓ MAJOR PROJECTS (High Impact, High Effort) - Plan these carefully',
        '✓ NICE TO HAVE (Low Impact, Low Effort) - Consider when time permits',
        '✓ TIME SINKS (Low Impact, High Effort) - Avoid or deprioritize',
        '✓ Consider business alignment and strategic goals',
        '✓ Get team input on effort estimates',
        '✓ Revisit prioritization every quarter as new data comes in'
      ]
    },

    roadmap: {
      title: '🗺️ Building Your Roadmap',
      items: [
        '✓ Start with QUICK WINS (high impact, low effort)',
        '✓ Build momentum with early wins to validate prioritization',
        '✓ Batch MAJOR PROJECTS into releases (high impact worth the effort)',
        '✓ Fill gaps in timeline with NICE TO HAVE features',
        '✓ Communicate roadmap to team and stakeholders',
        '✓ Set realistic timelines based on team capacity',
        '✓ Identify dependencies between features',
        '✓ Plan for tech debt and infrastructure improvements',
        '✓ Leave room for bug fixes and maintenance (20% of capacity)',
        '✓ Share progress and adjust roadmap based on learnings'
      ]
    }
  },

  // Priority Matrix explanation
  priorityMatrix: {
    title: '2x2 Priority Matrix (Impact vs Effort)',
    description: 'Position features based on their impact on users and effort to implement.',
    quadrants: [
      {
        name: 'Quick Wins',
        color: '#10b981',
        position: 'top-left',
        impactRange: 'High Impact',
        effortRange: 'Low Effort',
        recommendation: 'Do these FIRST - maximum value with minimal resources',
        examples: 'Bug fixes, UI improvements, small new features'
      },
      {
        name: 'Major Projects',
        color: '#6366f1',
        position: 'top-right',
        impactRange: 'High Impact',
        effortRange: 'High Effort',
        recommendation: 'Plan these carefully - worth the investment but needs dedication',
        examples: 'Platform redesign, new product area, complex integration'
      },
      {
        name: 'Nice to Have',
        color: '#f59e0b',
        position: 'bottom-left',
        impactRange: 'Low Impact',
        effortRange: 'Low Effort',
        recommendation: 'Consider when you have spare capacity - low risk, low reward',
        examples: 'Cosmetic improvements, nice-to-have features, polish'
      },
      {
        name: 'Time Sinks',
        color: '#ef4444',
        position: 'bottom-right',
        impactRange: 'Low Impact',
        effortRange: 'High Effort',
        recommendation: 'AVOID or strongly reconsider - lots of effort, little value',
        examples: 'Over-engineering, unnecessary rewrites, scope creep'
      }
    ]
  },

  // Evaluation framework
  evaluationFramework: {
    title: 'Feature Evaluation Framework',
    impactScoringTemplate: `IMPACT SCORING (1-5 scale):

5 = Critical - Essential for core product value or preventing churn
4 = High - Significantly improves user experience or enables new use cases
3 = Medium - Useful improvement that many users would appreciate
2 = Low - Nice enhancement that benefits a small segment
1 = Minimal - Cosmetic or rarely used

Questions to ask:
• How many users would benefit?
• Would it increase customer satisfaction/NPS?
• Would it reduce customer churn?
• Is it a blocker for closing sales?
• Does it differentiate from competitors?`,

    effortEstimatingTemplate: `EFFORT ESTIMATION (1-5 scale):

1 = Trivial (1-2 hours)
2 = Simple (1-2 days)
3 = Medium (1-2 weeks)
4 = Complex (1-2 months)
5 = Very Complex (3+ months)

Factors to consider:
• Design work needed?
• Backend changes required?
• Frontend changes required?
• Database migrations?
• Testing and QA effort?
• Documentation needed?
• Training/rollout effort?
• Dependencies on other systems?`,

    alignmentTemplate: `BUSINESS ALIGNMENT CHECK:

Strategic Fit:
☐ Aligns with company vision
☐ Supports business goals
☐ Competitive advantage
☐ Revenue impact
☐ Cost reduction

Risk Assessment:
☐ Technical risks identified
☐ Dependencies documented
☐ Mitigation plans in place
☐ Resource availability confirmed
☐ Timeline realistic

Go/No-Go Decision:
☐ Move forward
☐ More research needed
☐ Defer to next quarter
☐ Reject/close`
  },

  // Help content for users
  help: {
    examples: [
      {
        scenario: 'Prioritizing between dark mode and API integration',
        input: { feature_name: 'Dark Mode', user_impact: 'high', implementation_effort: 'low', customer_requests: 25 },
        output: 'Dark mode = Quick Win (high impact, low effort). Build it next. API integration = Major Project (high impact, high effort). Plan for Q2.'
      },
      {
        scenario: 'Evaluating a niche feature request',
        input: { feature_name: 'Japanese Language Support', user_impact: 'low', implementation_effort: 'high', customer_requests: 1 },
        output: 'Low impact + high effort = TIME SINK. Skip it. Unless this expands into 1000 Japanese users, focus resources elsewhere.'
      }
    ],
    commonMistakes: [
      'Overestimating impact - "5 people asked for it" is NOT high impact. "50% of customers would pay extra for it" IS high impact.',
      'Underestimating effort - Adding 1 language sounds easy, then you hit 20 hidden complexity issues. Always add 50% to effort estimates.',
      'Ignoring the time sinks - "It\'s just a small feature" that takes 3 months. Say no to low-impact, high-effort work.',
      'No customer validation - You think users want dark mode, but maybe they want performance. Ask 10 customers to rank 5 potential features.',
      'Feature creep from one person - One vocal customer wants something. One person\'s opinion ≠ market demand. Look for patterns (5+ requests).',
      'Not revisiting the roadmap - Priorities change every quarter. What was high-impact 6 months ago might be obsolete now.'
    ]
  },

  // Tool recommendations
  tools: [
    {
      category: 'Feature Request Management',
      items: [
        { name: 'Canny', link: 'https://canny.io', pros: 'Dedicated feature request tracking and voting' },
        { name: 'Feature Upvote', link: 'https://featureupvote.com', pros: 'Simple upvoting system for features' },
        { name: 'Nolt', link: 'https://nolt.io', pros: 'Lightweight feedback and feature voting' },
        { name: 'Productboard', link: 'https://www.productboard.com', pros: 'Enterprise-grade product management' }
      ]
    },
    {
      category: 'Roadmap & Planning',
      items: [
        { name: 'Roadmap.sh', link: 'https://roadmap.sh', pros: 'Visual roadmap creation and sharing' },
        { name: 'Airfocus', link: 'https://www.airfocus.io', pros: 'Prioritization and roadmap planning' },
        { name: 'Trello', link: 'https://trello.com', pros: 'Simple visual roadmap with cards' },
        { name: 'Notion', link: 'https://notion.so', pros: 'All-in-one workspace for roadmaps' }
      ]
    },
    {
      category: 'Collaboration & Documentation',
      items: [
        { name: 'Airtable', link: 'https://airtable.com', pros: 'Database for organizing feature lists' },
        { name: 'Asana', link: 'https://asana.com', pros: 'Team collaboration and project tracking' },
        { name: 'Monday.com', link: 'https://monday.com', pros: 'Visual project management' },
        { name: 'Figma', link: 'https://figma.com', pros: 'Design and prototype new features' }
      ]
    },
    {
      category: 'User Research & Analytics',
      items: [
        { name: 'Amplitude', link: 'https://amplitude.com', pros: 'Product analytics and user behavior' },
        { name: 'Mixpanel', link: 'https://mixpanel.com', pros: 'Event tracking and user insights' },
        { name: 'Heap', link: 'https://heap.io', pros: 'Automatic session recording and analytics' },
        { name: 'Hotjar', link: 'https://hotjar.com', pros: 'Heatmaps and user session recordings' }
      ]
    }
  ]
}
