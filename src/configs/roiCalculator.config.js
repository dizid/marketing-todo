export const roiCalculatorTask = {
  id: 'analytics-3',
  name: 'Review ROI',
  description: 'Calculate ROI by channel',
  category: 'analytics',
  customComponent: 'RoiCalculatorMiniApp',
  metrics: ['ROI', 'ROAS', 'Payback Period', 'LTV', 'CAC'],
  output: { enabled: false }
}
