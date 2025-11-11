/**
 * Tracking Sheet Configuration
 *
 * Template definitions for the Tracking Sheet mini app.
 * Each template includes guidance on what to track and why.
 */

export const templates = [
  {
    id: 'google-sheets',
    name: 'Google Sheets Template',
    icon: '📊',
    type: 'Google Sheets',
    description: 'Cloud-based spreadsheet for team collaboration and real-time updates',
    why: 'Google Sheets lets you and your team work together in real-time. Data is automatically saved to the cloud, you can access it from anywhere, and you can create formulas and charts instantly. Perfect for growing teams.',
    instruction: 'Create a new Google Sheet and set up these columns: Date, Source, User Name, Email, Product Usage (days), Paid Customer, Revenue, Notes. Then add formulas to track totals and conversion rates.',
    specs: 'Recommended columns: Date, Source, User Name, Email, Product Usage (days), Paid Customer, Revenue, Notes. Add formulas like =SUM() for totals and =(Paid Customers/Total Sign-ups)*100 for conversion rate.',
    action: 'create-google-sheet',
    actionText: '🚀 Create in Google Sheets',
    helpText: 'Open Google Sheets → Click "Blank" → Copy the column headers from below. Start tracking immediately. No setup required—Google Sheets auto-saves everything.',
    templateColumns: ['Date', 'Source', 'User Name', 'Email', 'Product Usage (days)', 'Paid Customer', 'Revenue', 'Notes']
  },

  {
    id: 'excel',
    name: 'Excel Template',
    icon: '📈',
    type: 'Excel (.xlsx)',
    description: 'Powerful spreadsheet with formulas, charts, and offline access',
    why: 'Excel gives you full control with advanced formulas, pivot tables, and beautiful charts. It works offline, so you can use it anywhere even without internet. Best for detailed analysis and reporting.',
    instruction: 'Download the Excel template and open it in Microsoft Excel or Google Sheets. Start entering your data in the rows below the headers.',
    specs: 'Pre-built columns: Date, Source, User Name, Email, Product Usage (days), Paid Customer, Revenue, Notes. Includes: SUM formulas, conversion rate calculation, simple dashboard with charts.',
    downloadLink: '/templates/tracking-sheet-template.xlsx',
    downloadText: '⬇️ Download Excel Template',
    helpText: 'The template includes sample data to show you the format. Delete the sample rows and add your real data. Use the formulas to automatically calculate totals, conversion rates, and revenue.'
  },

  {
    id: 'metrics-guide',
    name: 'Understanding Your Metrics',
    icon: '📚',
    type: 'Learning Guide',
    description: 'Learn what metrics to track and why they matter for your growth',
    why: 'Tracking the right metrics tells you if your product is working and where to focus your marketing efforts. This guide explains each metric and how to use it to make better decisions.',
    instruction: 'Read the guide below to understand each metric. Then use this knowledge to set up your own tracking sheet or use one of the templates above.',
    specs: 'Detailed explanations of: Sign-up source, Conversion rate, Customer lifetime value, Retention rate, and ROI. Plus sample calculations and benchmarks.',
    helpText: 'Understanding your metrics is more important than fancy tools. Start simple with just: Date, Source, User Name, Paid Yet? Then add more columns as you grow.'
  }
]

export const metricsGuide = {
  title: 'Key Metrics to Track',
  metrics: [
    {
      name: 'Sign-Up Source',
      emoji: '🔗',
      description: 'Where did the user come from? (Google, Facebook, Reddit, friend referral, email, etc)',
      why: 'This tells you which marketing channels are working. Focus your budget on channels that bring the best users.',
      example: 'Track: "Twitter", "Product Hunt", "Google", "Friend referral"'
    },
    {
      name: 'Conversion Rate',
      emoji: '📈',
      description: 'What % of sign-ups become paying customers?',
      why: 'If you get 100 sign-ups but 0 pay, you have a product problem, not a marketing problem. Conversion rate tells you if your product is valuable.',
      example: 'Formula: (Paid Customers / Total Sign-ups) × 100. Target: 5-10% is good for most products.'
    },
    {
      name: 'Revenue per Source',
      emoji: '💰',
      description: 'How much revenue comes from each marketing channel?',
      why: 'Some channels bring more valuable users. Twitter might give you 10 sign-ups, but Google might give you 5 sign-ups that all pay. Focus on high-revenue sources.',
      example: 'Sum all revenue from "Google" users. Divide by number of Google sign-ups to get revenue-per-user from that channel.'
    },
    {
      name: 'Customer Retention',
      emoji: '🔄',
      description: 'What % of customers are still using you after 30 days? 90 days?',
      why: 'Retention is more important than sign-ups. If 90% leave after a week, you have a serious problem. Track how many users are still active over time.',
      example: 'Count users who signed up 30 days ago and are still active today. (Active users from 30 days ago / Sign-ups from 30 days ago) × 100'
    },
    {
      name: 'Time to First Value',
      emoji: '⏱️',
      description: 'How many days after sign-up until the user gets real value from your product?',
      why: 'If users take 2 months to see value, many will quit. Track how quickly users see benefits. Faster = better retention.',
      example: 'Track date of sign-up and date of first real usage (e.g., "created first project", "sent first email", etc)'
    },
    {
      name: 'Churn Rate',
      emoji: '📉',
      description: 'What % of customers cancel their subscription each month?',
      why: 'Tells you if your product is satisfying customers or if you need to improve. Low churn = happy customers.',
      example: 'Formula: (Cancelled subscriptions / Starting customers) × 100. Target: <5% monthly churn is healthy.'
    }
  ]
}

export const trackingSheetTask = {
  id: 'setup-5',
  name: 'Set Up Tracking Sheet',
  description: 'Create a tracking sheet to monitor sign-ups, sources, and conversions',
  category: 'setup',

  // Freemium model - Premium tier task
  tier: 'premium',
  what: 'Set up professional metrics tracking with Google Sheets or Excel templates. Track sign-ups, sources, conversions, and revenue in one dashboard with built-in formulas.',
  why: 'Most startups fail because they don\'t track metrics. You can\'t optimize what you don\'t measure. Real-time metrics reveal which channels work and where to cut.',
  how: 'Choose your template (Google Sheets or Excel), copy the column headers, then start entering daily data. Formulas auto-calculate conversion rate, revenue per source, and churn.',

  form: [],
  ai: null,

  output: {
    enabled: false
  },

  customComponent: 'TrackingSheetMiniApp',
  templates: templates,
  metricsGuide: metricsGuide
}
