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
  output: { enabled: false },

  help: {
    examples: [
      {
        scenario: 'Startup analyzing which marketing channels drive best ROI',
        input: { channels: ['social', 'email', 'SEO', 'paid ads'], metrics: { traffic: [500, 200, 1000, 300], conversions: [10, 25, 40, 15], cost: [0, 0, 0, 500] } },
        output: 'Side-by-side analysis showing email has highest conversion rate (12.5%) despite lower traffic, SEO drives most volume at zero cost, paid ads have worst ROI at $33 per conversion. Recommendation: double down on email and SEO, pause paid ads.'
      },
      {
        scenario: 'E-commerce store comparing traffic quality across channels',
        input: { channels: ['Instagram', 'Facebook Ads', 'Google Shopping', 'Pinterest'], metrics: { traffic: [2000, 1000, 800, 400], conversions: [20, 30, 50, 15], revenue: [800, 1500, 3000, 600] } },
        output: 'Channel comparison revealing Google Shopping has highest revenue per visitor ($3.75) and conversion rate (6.25%), Instagram has lowest quality traffic, Facebook Ads provide middle ground. Insight: reallocate Instagram effort to Google Shopping optimization.'
      }
    ],
    commonMistakes: [
      'Looking only at traffic volume - Instagram sends 5000 visitors but zero convert. Focus on CONVERSION RATE and REVENUE, not just traffic numbers. Quality beats quantity.',
      'Not tracking channel-specific conversions - using overall conversion rate for all channels. Each channel needs separate tracking to see which actually drives sales vs just clicks.',
      'Ignoring cost per acquisition - free channels like SEO look amazing until you factor in the hours spent. Calculate time investment and compare true cost per customer across all channels.',
      'Making decisions on too little data - 10 visitors from a channel is not enough. Wait for at least 100-200 visits per channel before making major decisions about what works.',
      'Not considering customer lifetime value by channel - email subscribers might convert at 2% vs paid ads at 5%, but email customers stay 3x longer. Track LTV, not just initial conversion.',
      'Comparing incomparable time periods - analyzing SEO from last month vs paid ads from this week. Always compare the same date ranges and account for seasonality when evaluating channels.'
    ]
  }
}
