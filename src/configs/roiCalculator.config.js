export const roiCalculatorTask = {
  id: 'analytics-3',
  name: 'Review ROI',
  description: 'Calculate ROI by channel',
  category: 'analytics',

  // Freemium model - Premium tier task
  tier: 'premium',
  what: 'Calculate ROI metrics: cost-per-user, customer lifetime value, payback period, and CAC:LTV ratio. Understand the economics of your growth channels.',
  why: 'You can\'t scale what you don\'t understand economically. Knowing your unit economics tells you which channels are profitable and how much to spend on growth.',
  how: 'Gather: total marketing spend, new customers acquired, monthly revenue per customer. Input into ROI calculator to see profit-per-channel and optimal spend allocation.',

  customComponent: 'RoiCalculatorMiniApp',
  metrics: ['ROI', 'ROAS', 'Payback Period', 'LTV', 'CAC'],
  output: { enabled: false },

  help: {
    examples: [
      {
        scenario: 'SaaS calculating ROI across marketing channels',
        input: { marketing_spend: { google_ads: 2000, content: 500, email: 200 }, new_customers: { google_ads: 20, content: 15, email: 25 }, avg_customer_value: 50, avg_lifetime_months: 12 },
        output: 'Channel-by-channel ROI breakdown: Google Ads ($2000 spend, 20 customers, $100 CAC, $600 LTV, 6:1 LTV:CAC ratio, 2-month payback), Content ($500, 15 customers, $33 CAC, $600 LTV, 18:1 ratio, profitable immediately), Email ($200, 25 customers, $8 CAC, $600 LTV, 75:1 ratio, best channel). Recommendation: reallocate 50% of Google Ads budget to email marketing for 3x better ROI.'
      },
      {
        scenario: 'E-commerce analyzing product line profitability',
        input: { product_costs: { tshirts: 8, hoodies: 15, hats: 5 }, selling_prices: { tshirts: 25, hoodies: 45, hats: 18 }, units_sold: { tshirts: 200, hoodies: 80, hats: 150 }, marketing_spend: 1500 },
        output: 'Product profitability analysis: T-shirts (200 units, $17 margin each, $3400 gross profit), Hoodies (80 units, $30 margin, $2400 profit), Hats (150 units, $13 margin, $1950 profit). Total revenue $7900, total gross profit $7750. After $1500 marketing spend, net profit $6250. ROI 417%. Insight: Hoodies have highest margin per unit but lowest volume - opportunity to increase hoodie promotion.'
      }
    ],
    commonMistakes: [
      'Only tracking first purchase, not lifetime value - calculating ROI based on initial $50 sale when customers spend $500 over 12 months. Always use LTV, not just first transaction.',
      'Forgetting to include all costs - counting ad spend but ignoring software subscriptions, freelancer fees, and time costs. Include EVERYTHING that goes into acquiring customers.',
      'Not segmenting by channel - lumping all marketing spend together and getting average ROI. Different channels have wildly different ROI - measure each separately.',
      'Making decisions on too little data - calculating ROI after 1 week with 5 customers. Wait for 50-100 customers minimum per channel for reliable ROI calculations.',
      'Comparing incomparable timeframes - measuring Google Ads ROI over 30 days vs content marketing over 90 days. Use consistent time windows when comparing channels.',
      'Ignoring payback period - celebrating 10:1 LTV:CAC ratio while ignoring that it takes 18 months to break even. Cash flow matters - prioritize channels with faster payback periods.'
    ]
  }
}
