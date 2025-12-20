/**
 * ROI Calculator & Forecaster - Analytics Task
 *
 * Hybrid approach: Form fields for data input + Mini-app for visualization + AI for recommendations
 */

export const roiCalculatorTask = {
  id: 'analytics-3',
  name: 'ROI Calculator & Forecaster',
  description: 'Calculate ROI, CAC, LTV and get budget optimization recommendations',
  category: 'analytics',
  tier: 'premium',

  // Phase 6: Field inheritance mappings (form field -> canonical field)
  fieldMappings: {
    'avg_revenue_per_customer': 'avgOrderValue',
    'business_model': 'productType',
    // Task-specific fields (no canonical mapping)
    'marketing_channels': null,
    'channel_data': null,
    'avg_customer_lifetime_months': null,
    'optimization_goal': null
  },

  what: 'Calculate ROI metrics for each marketing channel: Customer Acquisition Cost (CAC), Customer Lifetime Value (LTV), LTV:CAC ratio, payback period, and channel-specific ROAS. Get AI-powered recommendations for budget reallocation to maximize returns.',

  why: 'You can\'t scale what you don\'t measure. Most businesses waste 40-60% of their marketing budget on underperforming channels because they don\'t track unit economics by channel. Knowing exactly which channels are profitable lets you double down on winners and cut losers.',

  how: 'Enter your marketing spend and customer acquisition data by channel. The calculator shows real-time ROI metrics, then AI analyzes your data to recommend optimal budget allocation, identify hidden opportunities, and project revenue impact of changes.',

  customComponent: 'RoiCalculatorMiniApp',

  form: [
    {
      id: 'business_model',
      type: 'select',
      label: 'What\'s Your Business Model?',
      options: [
        { value: 'saas', label: 'SaaS / Subscription (recurring revenue)' },
        { value: 'ecommerce', label: 'E-commerce / Product Sales (one-time + repeat)' },
        { value: 'service', label: 'Service Business (projects or retainers)' },
        { value: 'marketplace', label: 'Marketplace / Platform (transaction fees)' },
        { value: 'info-product', label: 'Info Products / Courses (digital goods)' }
      ],
      required: true,
      description: 'This affects how we calculate LTV and recommend optimizations'
    },
    {
      id: 'marketing_channels',
      type: 'checkboxes',
      label: 'Which Marketing Channels Are You Using?',
      options: [
        { value: 'google_ads', label: 'Google Ads (Search/Display/YouTube)' },
        { value: 'meta_ads', label: 'Meta Ads (Facebook/Instagram)' },
        { value: 'tiktok_ads', label: 'TikTok Ads' },
        { value: 'linkedin_ads', label: 'LinkedIn Ads' },
        { value: 'content_seo', label: 'Content Marketing / SEO' },
        { value: 'email', label: 'Email Marketing' },
        { value: 'affiliate', label: 'Affiliate / Referral' },
        { value: 'organic_social', label: 'Organic Social Media' },
        { value: 'influencer', label: 'Influencer Marketing' },
        { value: 'events', label: 'Events / Webinars' },
        { value: 'cold_outreach', label: 'Cold Outreach (Email/LinkedIn)' },
        { value: 'partnerships', label: 'Partnerships / Co-marketing' }
      ],
      description: 'Select all channels where you\'re actively spending time or money. You\'ll enter data for each in the calculator below.'
    },
    {
      id: 'avg_revenue_per_customer',
      type: 'number',
      label: 'Average Revenue Per Customer',
      placeholder: '150',
      prefix: '$',
      min: 0,
      required: true,
      description: 'For subscriptions: monthly recurring revenue (MRR). For e-commerce: average order value (AOV). For services: average project/retainer value.'
    },
    {
      id: 'avg_customer_lifetime_months',
      type: 'number',
      label: 'Average Customer Lifetime (months)',
      placeholder: '12',
      min: 1,
      max: 120,
      required: true,
      description: 'How long does the average customer stay with you? For SaaS: 1/churn rate. For e-commerce: estimate repeat purchase window. Don\'t know? Start with 12 months.'
    },
    {
      id: 'gross_margin_percent',
      type: 'number',
      label: 'Gross Margin %',
      placeholder: '70',
      suffix: '%',
      min: 1,
      max: 100,
      description: 'Revenue minus cost of goods/delivery. SaaS typically 70-90%. E-commerce 30-50%. Services 50-80%. Used to calculate true profit per customer.'
    },
    {
      id: 'optimization_goal',
      type: 'select',
      label: 'What Do You Want to Optimize For?',
      options: [
        { value: 'maximize_roi', label: 'Maximize overall ROI (efficiency focus)' },
        { value: 'reduce_cac', label: 'Reduce Customer Acquisition Cost' },
        { value: 'improve_ltv_cac', label: 'Improve LTV:CAC ratio (health metric)' },
        { value: 'find_best_channel', label: 'Find best performing channel to scale' },
        { value: 'budget_allocation', label: 'Optimal budget allocation across channels' },
        { value: 'growth_projection', label: 'Project growth at different spend levels' }
      ],
      required: true,
      description: 'This determines what the AI analysis focuses on and what recommendations you\'ll get'
    },
    {
      id: 'monthly_budget',
      type: 'number',
      label: 'Total Monthly Marketing Budget',
      placeholder: '5000',
      prefix: '$',
      min: 0,
      description: 'Your total monthly marketing spend across all channels. Used for budget allocation recommendations.'
    }
  ],

  ai: {
    template: `You are an expert marketing analyst and ROI strategist. Analyze the marketing performance data and provide actionable recommendations.

## INPUT DATA

**Business Model:** {business_model}
**Active Marketing Channels:** {marketing_channels}
**Avg Revenue Per Customer:** {avg_revenue_per_customer}
**Avg Customer Lifetime:** {avg_customer_lifetime_months} months
**Gross Margin:** {gross_margin_percent}%
**Monthly Budget:** {monthly_budget}
**Optimization Goal:** {optimization_goal}

**Channel Performance Data (from calculator):**
{channel_data}

---

## YOUR ANALYSIS TASK

Provide a comprehensive ROI analysis following this exact structure:

# ROI ANALYSIS REPORT

## 1. EXECUTIVE SUMMARY

**Overall Marketing Health:**
- Total Monthly Spend: $[sum from data]
- Total Customers Acquired: [sum from data]
- Blended CAC: $[total spend / total customers]
- Calculated LTV: $[avg_revenue × lifetime_months × (margin/100)]
- Overall LTV:CAC Ratio: [LTV / CAC]:1
- Health Status: [Healthy (>3:1), Acceptable (2-3:1), At Risk (1-2:1), Unprofitable (<1:1)]

**Key Finding:** [One sentence: the most important insight from this data]

---

## 2. CHANNEL-BY-CHANNEL ANALYSIS

[For each channel in their data, provide:]

### [CHANNEL NAME]
| Metric | Value | Benchmark | Status |
|--------|-------|-----------|--------|
| Monthly Spend | $X | - | - |
| Customers Acquired | X | - | - |
| CAC | $X | $X-X typical | [Good/Average/Poor] |
| LTV:CAC | X:1 | 3:1+ ideal | [Status] |
| Payback Period | X months | <12 mo ideal | [Status] |
| ROAS | X:1 | 3:1+ ideal | [Status] |

**Analysis:** [2-3 sentences on what's working, what's not, and why]

---

## 3. CHANNEL RANKING (Best to Worst)

| Rank | Channel | LTV:CAC | CAC | Verdict |
|------|---------|---------|-----|---------|
| 1 | [Best] | X:1 | $X | Scale aggressively |
| 2 | [2nd] | X:1 | $X | Optimize and grow |
| ... | ... | ... | ... | ... |
| Last | [Worst] | X:1 | $X | Reduce or cut |

**Winner:** [Channel] - [Why it's the best]
**Loser:** [Channel] - [Why it's the worst and what to do]

---

## 4. BUDGET REALLOCATION RECOMMENDATIONS

Based on your {optimization_goal} goal:

### Current Allocation vs. Recommended

| Channel | Current $ | Current % | Recommended $ | Recommended % | Change |
|---------|-----------|-----------|---------------|---------------|--------|
| [Channel 1] | $X | X% | $X | X% | +X% / -X% |
| [Channel 2] | $X | X% | $X | X% | +X% / -X% |
| ... | ... | ... | ... | ... | ... |
| **Total** | {monthly_budget} | 100% | {monthly_budget} | 100% | - |

### Why These Changes?

1. **Increase [Channel]:** [Specific reason - low CAC, high LTV:CAC, scalable]
2. **Decrease [Channel]:** [Specific reason - high CAC, poor ROAS, saturated]
3. **Test [Channel]:** [If they're missing an obvious channel for their business model]

### Projected Impact

If you make these changes:
- **Projected additional customers/month:** +X (Y% increase)
- **Projected CAC reduction:** -$X (Y% lower)
- **Projected revenue impact:** +$X/month
- **Annual impact:** +$X/year

---

## 5. OPTIMIZATION OPPORTUNITIES

### Quick Wins (This Week)
1. **[Action]:** [Specific tactic for their top channel - e.g., "Increase Google Ads budget by 20%" or "Pause underperforming ad sets"]
2. **[Action]:** [Second quick win]

### Medium-Term (This Month)
1. **[Action]:** [Optimization requiring more effort]
2. **[Action]:** [Second medium-term action]

### Strategic (This Quarter)
1. **[Action]:** [Larger strategic shift based on data]

---

## 6. BENCHMARKS & CONTEXT

### How You Compare to Industry Standards

For a **{business_model}** business:

| Metric | Your Value | Industry Avg | Top 10% | Your Grade |
|--------|------------|--------------|---------|------------|
| CAC | $X | $X-X | <$X | A/B/C/D/F |
| LTV:CAC | X:1 | 3:1 | 5:1+ | A/B/C/D/F |
| Payback | X mo | 12 mo | <6 mo | A/B/C/D/F |
| ROAS | X:1 | 3:1 | 5:1+ | A/B/C/D/F |

**Overall Grade: [A-F]**

[1-2 sentences contextualizing their performance]

---

## 7. WARNING SIGNS & RISKS

[Identify any concerning patterns:]

- **[Issue 1]:** [Description and why it matters]
- **[Issue 2]:** [Description and recommendation]

---

## 8. GROWTH SCENARIOS

### Scenario A: Conservative (+20% budget)
- Additional spend: +$X/month
- Projected new customers: +X/month
- Projected CAC at scale: $X
- Net revenue impact: +$X/month

### Scenario B: Aggressive (+50% budget)
- Additional spend: +$X/month
- Projected new customers: +X/month
- Projected CAC at scale: $X (likely higher due to diminishing returns)
- Net revenue impact: +$X/month

### Scenario C: Efficiency Mode (-20% budget)
- Budget reduction: -$X/month
- Customers maintained: X/month (from cutting worst channels)
- New blended CAC: $X
- Profit improvement: +$X/month

---

## 9. ACTION PLAN

### This Week:
- [ ] [Specific action 1]
- [ ] [Specific action 2]

### This Month:
- [ ] [Specific action 3]
- [ ] [Specific action 4]

### Track These Metrics:
- [ ] Weekly: [Metric 1], [Metric 2]
- [ ] Monthly: [Metric 3], [Metric 4]

---

## 10. NEXT STEPS

Based on your goal of **{optimization_goal}**, here's your priority order:

1. **First:** [Most impactful action from above]
2. **Second:** [Next priority]
3. **Third:** [Third priority]

**Expected outcome if you execute this plan:**
[1-2 sentences on projected results]

---

Remember: These projections are based on historical data. Actual results may vary. Test changes incrementally and track results weekly.`,

    temperature: 0.7,
    maxTokens: 3000
  },

  output: {
    enabled: true,
    exportFilename: 'roi-analysis',
    displayFormat: 'text',
    editable: true,
    deletable: true,
    exportable: true,
    copyable: true
  },

  help: {
    examples: [
      {
        scenario: 'SaaS calculating ROI across marketing channels',
        input: {
          business_model: 'saas',
          marketing_channels: ['google_ads', 'content_seo', 'email'],
          avg_revenue_per_customer: 50,
          avg_customer_lifetime_months: 12,
          gross_margin_percent: 80,
          optimization_goal: 'find_best_channel',
          channel_data: 'Google Ads: $2000 spend, 20 customers. Content/SEO: $500 spend, 15 customers. Email: $200 spend, 25 customers.'
        },
        output: 'Channel-by-channel ROI breakdown: Google Ads ($2000 spend, 20 customers, $100 CAC, $480 LTV, 4.8:1 LTV:CAC, 2.5-month payback), Content ($500, 15 customers, $33 CAC, $480 LTV, 14.5:1 ratio, profitable immediately), Email ($200, 25 customers, $8 CAC, $480 LTV, 60:1 ratio, best channel). Recommendation: Email is your most efficient channel - increase investment. Reallocate 40% of Google Ads budget to email nurture campaigns. Content has excellent economics - continue investment. Projected impact: +35% more customers at 25% lower blended CAC.'
      },
      {
        scenario: 'E-commerce analyzing product line profitability',
        input: {
          business_model: 'ecommerce',
          marketing_channels: ['meta_ads', 'google_ads', 'influencer'],
          avg_revenue_per_customer: 85,
          avg_customer_lifetime_months: 18,
          gross_margin_percent: 45,
          optimization_goal: 'maximize_roi',
          channel_data: 'Meta Ads: $3000 spend, 45 customers. Google Ads: $2500 spend, 30 customers. Influencer: $1500 spend, 20 customers.'
        },
        output: 'Product profitability analysis: Meta Ads (45 customers, $67 CAC, $688 LTV, 10.3:1 ratio - excellent), Google Ads (30 customers, $83 CAC, $688 LTV, 8.3:1 - strong), Influencer (20 customers, $75 CAC, $688 LTV, 9.2:1 - good but lower volume). Total revenue potential: $65,450/year from 95 customers. Recommendation: Meta is your winner - test scaling budget 50%. Google has room to optimize targeting. Influencer shows promise but needs higher volume - consider micro-influencer strategy for 3x reach at same budget.'
      }
    ],
    commonMistakes: [
      'Only tracking first purchase, not lifetime value - calculating ROI based on initial $50 sale when customers spend $500 over 12 months. Always use LTV, not just first transaction.',
      'Forgetting to include all costs - counting ad spend but ignoring software subscriptions, freelancer fees, and time costs. Include EVERYTHING that goes into acquiring customers.',
      'Not segmenting by channel - lumping all marketing spend together and getting average ROI. Different channels have wildly different ROI - measure each separately.',
      'Making decisions on too little data - calculating ROI after 1 week with 5 customers. Wait for 50-100 customers minimum per channel for reliable ROI calculations.',
      'Comparing incomparable timeframes - measuring Google Ads ROI over 30 days vs content marketing over 90 days. Use consistent time windows when comparing channels.',
      'Ignoring payback period - celebrating 10:1 LTV:CAC ratio while ignoring that it takes 18 months to break even. Cash flow matters - prioritize channels with faster payback periods.'
    ],
    proTips: [
      'Track cohort-based LTV: Customers acquired from different channels often have different lifetime values. Google Ads customers might churn faster than organic. Segment your LTV by acquisition source.',
      'Account for attribution: Last-click attribution under-values awareness channels. Consider using a simple 40/20/40 model (first touch/middle/last touch) for more accurate channel credit.',
      'Factor in time value of money: A customer who pays $1000 today is worth more than one who pays $1000 over 12 months. Use a discount rate (typically 10-15%) for accurate LTV.',
      'Watch for channel saturation: CAC typically increases as you scale any single channel. Budget for 20-40% CAC increase when doubling spend on a channel.',
      'Benchmark against industry standards: SaaS target LTV:CAC is 3:1+, payback <12 months. E-commerce is tighter: 2:1+ LTV:CAC, <6 month payback. Know your benchmarks.',
      'Test incrementality: Some channels may only be capturing customers who would have converted anyway. Run holdout tests to measure true incremental impact.',
      'Include opportunity cost: That $5000/month on underperforming ads could be earning 4% in a savings account. Factor in what you\'re giving up.',
      'Recalculate quarterly: Unit economics shift. Customer behavior changes. Costs fluctuate. Don\'t set it and forget it - review ROI metrics at least quarterly.'
    ]
  }
}
