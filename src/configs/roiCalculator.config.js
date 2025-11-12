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
  output: { enabled: false }
}
