/**
 * Connect Accounts Configuration
 *
 * Simple platform definitions for the Connect Accounts mini app.
 * Each platform has minimal info: why, where, and what to do.
 */

export const platforms = [
  {
    id: 'email',
    name: 'Email (Mailchimp)',
    icon: '📧',
    description: 'Connect your email list for newsletters and signup forms',
    why: 'Send automated emails to your audience and capture emails from your landing page',
    instruction: 'Create a Mailchimp account, generate an API key in Account settings, and paste it into this app',
    link: 'https://mailchimp.com',
    linkText: 'Go to Mailchimp',
    helpText: 'An API key is like a password that lets this app communicate with Mailchimp. Find it in Account > Extras > API Keys, copy it, and come back here to paste it.'
  },

  {
    id: 'twitter',
    name: 'Twitter/X',
    icon: '🐦',
    description: 'Connect to auto-share posts and track engagement',
    why: 'Automatically share your content on Twitter and track performance',
    instruction: 'Create a Twitter Developer account, create an app, get your API credentials, and add them to this app',
    link: 'https://developer.twitter.com',
    linkText: 'Go to Twitter Developer Portal',
    helpText: 'You\'ll get API credentials (API Key, API Secret, Bearer Token, etc). Save these somewhere safe, then copy them back here. These let this app post on your behalf.'
  },

  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: '💼',
    description: 'Connect to share content with your professional network',
    why: 'Share posts directly to LinkedIn and build your professional presence',
    instruction: 'Create a LinkedIn App, generate credentials, and connect them to this app',
    link: 'https://www.linkedin.com/developers',
    linkText: 'Go to LinkedIn Developers',
    helpText: 'After creating your app, you\'ll get a Client ID and Client Secret. These are confidential - keep them safe and only share with trusted tools like this one. Paste them here to authorize the connection.'
  },

  {
    id: 'analytics',
    name: 'Google Analytics',
    icon: '📊',
    description: 'Track visitors and measure what\'s working',
    why: 'See real-time data about your traffic, visitors, and conversions',
    instruction: 'Create a Google Analytics property and connect it to this app using your Measurement ID',
    link: 'https://analytics.google.com',
    linkText: 'Go to Google Analytics',
    helpText: 'Find your Measurement ID (starts with "G-") in Admin > Property > Data Streams. This ID lets this app pull your traffic data. It\'s not secret, so it\'s safe to share.'
  },

  {
    id: 'stripe',
    name: 'Stripe (Payments)',
    icon: '💳',
    description: 'Accept payments and manage subscriptions',
    why: 'Accept credit card payments and manage customer billing for paid plans or features',
    instruction: 'Create a Stripe account, get your API keys from the Dashboard, and add them to this app',
    link: 'https://stripe.com',
    linkText: 'Go to Stripe',
    helpText: 'You\'ll get a Publishable Key and a Secret Key. The Publishable Key is safe to share, but keep your Secret Key private - it\'s like a master password. Only paste the keys you need here.'
  },

  {
    id: 'slack',
    name: 'Slack (Team Notifications)',
    icon: '💬',
    description: 'Get alerts and notifications in your Slack workspace',
    why: 'Receive real-time notifications about user signups, feedback, and important events in Slack',
    instruction: 'Create a Slack App in your workspace, get your webhook URL or bot token, and connect it here',
    link: 'https://api.slack.com/apps',
    linkText: 'Go to Slack Apps',
    helpText: 'A Slack webhook URL or bot token lets this app send messages to your Slack channel. Treat these like passwords - keep them private. You can regenerate them anytime if they\'re compromised.'
  }
]

export const connectAccountsTask = {
  id: 'setup-3',
  name: 'Account Connection Guide',
  description: 'Step-by-step guide to connect social media, email, and analytics accounts',
  category: 'setup',

  // Freemium model fields
  tier: 'free',
  what: 'Get step-by-step guides to manually connect your email, social media, analytics, payments, and Slack accounts. Includes specific instructions for each platform and API key generation.',
  why: 'Connected accounts enable automation (scheduled posts, email campaigns) and real-time notifications (signups, customer feedback). Manual updates are slow and error-prone.',
  how: 'Select each platform you want to connect, follow the detailed guide to generate API keys and access tokens, then use those credentials in your tools.',

  form: [],
  ai: null,

  output: {
    enabled: false
  },

  customComponent: 'ConnectAccountsMiniApp',
  platforms: platforms,

  help: {
    examples: [
      {
        scenario: 'Setting up email marketing and analytics for new SaaS',
        input: { platforms: ['Mailchimp', 'Google Analytics'], goal: 'track signups and send welcome emails' },
        output: 'Mailchimp: Step-by-step OAuth connection flow, API key generation guide with screenshots, explanation of permissions being granted, and test email verification. Google Analytics: Measurement ID location instructions, code snippet placement guide, conversion goal setup for tracking signups, real-time verification steps.'
      },
      {
        scenario: 'Connecting payment processing and team notifications',
        input: { platforms: ['Stripe', 'Slack'], goal: 'accept payments and get notified of new customers' },
        output: 'Stripe: Publishable vs Secret key explanation, test mode setup instructions, webhook configuration for payment events, security best practices. Slack: Webhook URL generation, channel selection, notification formatting options, test message verification to ensure integration works.'
      }
    ],
    commonMistakes: [
      'Sharing secret keys publicly - pasting your Stripe Secret Key or API keys in public repos or screenshots. Treat secret keys like passwords - never share them publicly.',
      'Not testing connections after setup - clicking connect and assuming it works. Always send a test email, trigger a test event, or verify data is flowing before moving on.',
      'Granting too many permissions - giving full account access when you only need read permissions. Only grant the minimum permissions needed for the integration to work.',
      'Using production keys for testing - testing payment flows with real Stripe keys and accidentally charging real cards. Use test mode keys for all development and testing.',
      'Forgetting to revoke access - connecting a tool and never removing it. Periodically audit connected apps and revoke access to ones you no longer use for security.',
      'Not reading what permissions you\'re granting - clicking "Allow All" on OAuth screens without reading. Always review exactly what access you\'re giving to avoid unexpected data sharing.'
    ]
  }
}
