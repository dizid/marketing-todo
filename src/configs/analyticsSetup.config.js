/**
 * Analytics Setup Wizard Configuration
 *
 * 5-step wizard to help founders set up analytics:
 * 1. Education (What is Analytics?)
 * 2. Platform Selection (GA4 vs Mixpanel)
 * 3. AI-Generated Tracking Plan
 * 4. Implementation Guide (code snippets)
 * 5. Verification Checklist
 */

export const analyticsTools = [
  {
    id: 'ga4',
    name: 'Google Analytics 4',
    icon: '📊',
    description: 'Free analytics for websites, blogs, and e-commerce',
    bestFor: 'Websites, blogs, content sites, e-commerce',
    complexity: 'Beginner-friendly',
    cost: 'Free (up to 10M events/month)',
    setupTime: '10 minutes',
    features: ['Pageviews', 'Traffic sources', 'User behavior', 'SEO insights'],
    recommended: true
  },
  {
    id: 'mixpanel',
    name: 'Mixpanel',
    icon: '🎯',
    description: 'Advanced product analytics for SaaS and web apps',
    bestFor: 'SaaS, web apps, mobile apps',
    complexity: 'Intermediate',
    cost: 'Free (up to 20M events/month)',
    setupTime: '15 minutes',
    features: ['User journeys', 'Feature usage', 'Retention', 'Cohort analysis'],
    recommended: false
  }
]

export const productTypes = [
  { value: 'saas', label: 'SaaS / Web App', icon: '💻' },
  { value: 'ecommerce', label: 'E-commerce Store', icon: '🛒' },
  { value: 'blog', label: 'Blog / Content Site', icon: '📝' },
  { value: 'mobile', label: 'Mobile App', icon: '📱' },
  { value: 'landing', label: 'Landing Page Only', icon: '🎯' },
  { value: 'community', label: 'Community / Forum', icon: '💬' },
  { value: 'marketplace', label: 'Marketplace / Platform', icon: '🏪' }
]

export const mainGoals = [
  { value: 'signups', label: 'Get more signups', icon: '👥' },
  { value: 'sales', label: 'Increase sales', icon: '💰' },
  { value: 'traffic', label: 'Grow traffic', icon: '📈' },
  { value: 'engagement', label: 'Improve engagement', icon: '❤️' },
  { value: 'other', label: 'Other', icon: '🎯' }
]

export const analyticsSetupTask = {
  id: 'analytics-1',
  name: 'Analytics Setup Wizard',
  description: 'Set up analytics tracking in 15 minutes with step-by-step guidance and code snippets.',
  category: 'analytics',
  tier: 'free',

  what: 'Learn what analytics is, choose a platform (GA4 or Mixpanel), get a custom tracking plan, and implement tracking with copy-paste code snippets.',
  why: 'Analytics shows you WHO uses your product, WHAT they do, and WHERE they drop off. Without analytics, you\'re flying blind - guessing what works instead of knowing.',
  how: 'Follow our 5-step wizard: understand analytics basics, choose a platform, get an AI-generated tracking plan, copy-paste implementation code, and verify it works.',

  tools: analyticsTools,
  productTypes: productTypes,
  mainGoals: mainGoals,

  // Use custom wizard component
  customComponent: 'AnalyticsSetupMiniApp',
  type: 'wizard',

  // AI configuration for Step 3 (Tracking Plan Generation)
  ai: {
    template: `You are an analytics expert helping a founder set up tracking for their product.

Platform: {platform}
Product Type: {productType}
Product Name: {productName}
Product Description: {productDescription}
Main Goal: {mainGoal}

Generate a customized analytics tracking plan with the following sections:

=== ESSENTIAL EVENTS TO TRACK ===

List 3-5 events the founder MUST track for their product type. For each event:
- Event name (clear, specific, snake_case format)
- Why it matters (business value in one sentence)
- Priority: MUST HAVE or NICE TO HAVE
- When to trigger (specific user action)

Format each event like this:
✅ event_name
   Why: [business value]
   Priority: MUST HAVE
   Trigger: [when to fire this event]

=== RECOMMENDED METRICS DASHBOARD ===

List 4-6 key metrics they should track weekly. Make them specific to their product type and goal.
Format as a bullet list with brief explanations of why each metric matters.

=== 30-DAY GOALS ===

Based on industry benchmarks for their product type, suggest 3-4 realistic, measurable goals for a new product.
Format as checkboxes:
- [ ] Goal 1 (with specific number)
- [ ] Goal 2
etc.

Keep language simple and beginner-friendly. Be specific to their product type - avoid generic advice.
Use emojis sparingly (only for section headers: 📋 ✅ 📊 🎯).`,

    temperature: 0.7,
    maxTokens: 1500,

    contextProvider: () => {
      // No additional context needed - all info comes from wizard
      return {}
    }
  },

  output: {
    enabled: true,
    exportFilename: 'analytics-setup-guide',
    displayFormat: 'markdown',
    editable: true,
    exportable: true,
    copyable: true
  }
}
