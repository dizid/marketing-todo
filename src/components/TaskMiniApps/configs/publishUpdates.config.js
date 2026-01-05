/**
 * Publish Product Updates Mini-App Configuration
 *
 * This config defines form fields for planning product update announcements,
 * along with step-by-step guides, channel-specific templates, and tool recommendations.
 */

export const publishUpdatesConfig = {
  id: 'publish-updates',
  title: 'Publish Product Updates',
  description: 'Plan and execute product update announcements across multiple channels with step-by-step guidance.',

  // Form configuration
  formTitle: 'Product Update Details',
  formFields: [
    {
      id: 'update_title',
      type: 'text',
      label: 'Update Title',
      placeholder: 'e.g., "New AI Features Released" or "Performance Improvements"',
      required: true,
      description: 'What is the main update or feature?'
    },
    {
      id: 'key_features',
      type: 'textarea',
      label: 'Key Features / Changes',
      placeholder: 'e.g., "• AI-powered search\n• 40% faster load times\n• New export formats"',
      rows: 3,
      required: true,
      description: 'List the main improvements and new features'
    },
    {
      id: 'release_date',
      type: 'text',
      label: 'Release Date',
      placeholder: 'e.g., "November 15, 2024" or "Available now"',
      description: 'When is/was the update released?'
    },
    {
      id: 'target_channels',
      type: 'textarea',
      label: 'Target Channels',
      placeholder: 'e.g., "Email Newsletter\nTwitter\nBlog\nChangelog"',
      rows: 2,
      description: 'Which channels will you use to announce?'
    },
    {
      id: 'additional_notes',
      type: 'textarea',
      label: 'Additional Notes',
      placeholder: 'Any special promotions, beta features, or other context?',
      rows: 2,
      description: 'Anything else to include in the announcement?'
    }
  ],

  // NO AI for this task - template/guide based
  aiConfig: null,

  // Don't show default output
  showOutput: false,

  // Guides
  guides: {
    preLaunch: {
      title: '📋 Pre-Launch Checklist (Preparation)',
      items: [
        '✓ Finalize update details and feature list',
        '✓ Create a compelling update title and description',
        '✓ Write key benefits for each audience segment',
        '✓ Prepare visuals or demo videos if available',
        '✓ Draft announcement content for each channel',
        '✓ Schedule posts in advance using scheduling tools',
        '✓ Plan launch timeline (when to post on each channel)',
        '✓ Prepare FAQ for common questions',
        '✓ Set up tracking/analytics to measure reach',
        '✓ Brief internal team on talking points'
      ]
    },

    duringLaunch: {
      title: '🚀 During Launch - Distribution Checklist',
      items: [
        '✓ Publish to changelog/release notes first',
        '✓ Send email newsletter to subscribers',
        '✓ Post on social media channels simultaneously',
        '✓ Publish blog post with full details',
        '✓ Update website/product pages with new features',
        '✓ Announce in community (Slack, Discord, forum)',
        '✓ Monitor comments and social feedback',
        '✓ Respond to questions and concerns quickly',
        '✓ Pin announcement to top of communication channels',
        '✓ Share customer testimonials or use cases'
      ]
    },

    postLaunch: {
      title: '📊 Post-Launch - Follow-up & Measurement',
      items: [
        '✓ Track engagement metrics (views, clicks, shares)',
        '✓ Respond to all questions and feedback',
        '✓ Collect user reactions and testimonials',
        '✓ Share early results with team',
        '✓ Create case studies of early adopters',
        '✓ Repurpose content (clips, quotes, graphics)',
        '✓ Schedule reminder posts after 1-2 weeks',
        '✓ Update documentation with new features',
        '✓ Analyze what channels performed best',
        '✓ Plan follow-up features based on feedback'
      ]
    }
  },

  // Channel-specific templates
  templates: {
    emailTemplate: {
      title: 'Email Newsletter Announcement',
      content: `Subject: Exciting: [UPDATE_TITLE]

Hi [SUBSCRIBER_NAME],

We're thrilled to announce [UPDATE_TITLE]! 🎉

Here's what's new:
[KEY_FEATURES]

Why you'll love it:
• [BENEFIT 1]
• [BENEFIT 2]
• [BENEFIT 3]

Available: [RELEASE_DATE]

Try it now: [LINK_TO_PRODUCT]

Have questions? Reply to this email - we'd love to hear from you!

Best,
[YOUR_NAME]
[COMPANY_NAME]`
    },

    blogTemplate: {
      title: 'Blog Post Announcement',
      content: `# [UPDATE_TITLE]

We're excited to announce [UPDATE_TITLE]! This release brings significant improvements to [KEY_AREA].

## What's New

[KEY_FEATURES]

## Why This Matters

[EXPLAIN USER IMPACT AND BENEFITS]

## How to Get Started

[STEP-BY-STEP GUIDE OR LINK TO DOCS]

## What's Next

We're already working on [UPCOMING FEATURES]. We'd love your feedback!

[CALL TO ACTION]

---
Published: [DATE]
[LINK TO CHANGELOG]`
    },

    socialTemplate: {
      title: 'Social Media Posts (Twitter, LinkedIn, Facebook)',
      content: `TWITTER (280 chars max):
🚀 Introducing [UPDATE_TITLE]! [KEY_BENEFIT]. Available now. [LINK]

LINKEDIN (longer form):
Excited to announce [UPDATE_TITLE]!

Our team has been working hard to bring you:
• [FEATURE 1]
• [FEATURE 2]
• [FEATURE 3]

This improves [IMPACT]. [LINK_TO_BLOG]

FACEBOOK (conversational):
Great news! [UPDATE_TITLE] is here! 🎉

We've added [KEY_FEATURES] that make [USE_CASE] so much easier.

Check it out: [LINK]
What feature are you most excited about?`
    },

    changelogTemplate: {
      title: 'Changelog / Release Notes',
      content: `# Version [VERSION_NUMBER] - [RELEASE_DATE]

## New Features
• [FEATURE 1]: [Description of what it does]
• [FEATURE 2]: [Description of what it does]
• [FEATURE 3]: [Description of what it does]

## Improvements
• [IMPROVEMENT 1]: [What was improved and why]
• [IMPROVEMENT 2]: [What was improved and why]

## Bug Fixes
• [BUG FIX 1]: [What was fixed]
• [BUG FIX 2]: [What was fixed]

## Known Issues
• [Known limitation or issue, if any]

## Migration Guide
[Any steps users need to take to use new features]

## Feedback
Have questions? Email us at support@example.com or [LINK_TO_COMMUNITY]`
    }
  },

  // Help content for users
  help: {
    examples: [
      {
        scenario: 'Major feature release announcement',
        input: { update_title: 'Real-Time Collaboration Released', key_features: 'Multi-user editing, live comments, version history', target_channels: 'Email, Twitter, Blog, Changelog' },
        output: 'Email highlights time-saving benefits, Twitter threads show GIF demo, blog post details technical changes, changelog shows version numbers'
      },
      {
        scenario: 'Bug fix / performance improvement',
        input: { update_title: 'Performance Improvements: 40% Faster Load Times', key_features: '40% faster queries, optimized caching, database indexing' },
        output: 'Short, focused announcement: "We made it faster" is the headline, technical details in blog only, social media just celebrates the benefit'
      }
    ],
    commonMistakes: [
      'Too much technical detail for general audience - "Index optimization" means nothing to most users. Say "It\'s 40% faster"',
      'No consistent messaging across channels - Email says one thing, Twitter another. Write one message, then adapt for each channel.',
      'Announcing without proof - "Faster now!" without metrics gets ignored. "40% faster (measured on 10k requests)" gets believed.',
      'Forgetting the "why" - Users care about what you changed, but they LOVE why it matters to them.',
      'No call-to-action - Don\'t end with "Let us know what you think". End with "Try it now" or "Read the blog" or "Share your thoughts".',
      'Launching on one channel only - Even a great announcement gets lost. Use email + blog + Twitter + Slack + in-app (5 channels minimum).'
    ]
  },

  // Tool recommendations
  tools: [
    {
      category: 'Email & Newsletter',
      items: [
        { name: 'Substack', link: 'https://substack.com', pros: 'Easy newsletter creation and distribution' },
        { name: 'ConvertKit', link: 'https://convertkit.com', pros: 'Creator-focused email platform' },
        { name: 'MailerLite', link: 'https://mailerlite.com', pros: 'User-friendly with automation' },
        { name: 'Brevo (Sendinblue)', link: 'https://brevo.com', pros: 'Free tier, good for startups' }
      ]
    },
    {
      category: 'Blog & CMS',
      items: [
        { name: 'Medium', link: 'https://medium.com', pros: 'Built-in audience, easy publishing' },
        { name: 'Ghost', link: 'https://ghost.org', pros: 'Modern blogging platform' },
        { name: 'Webflow', link: 'https://webflow.com', pros: 'Design + CMS combined' },
        { name: 'Notion', link: 'https://notion.so', pros: 'All-in-one workspace' }
      ]
    },
    {
      category: 'Social Media Scheduling',
      items: [
        { name: 'Buffer', link: 'https://buffer.com', pros: 'Simple scheduling across platforms' },
        { name: 'Hootsuite', link: 'https://hootsuite.com', pros: 'Enterprise-grade scheduling' },
        { name: 'Later', link: 'https://later.com', pros: 'Visual content planning' },
        { name: 'Metricool', link: 'https://metricool.com', pros: 'Analytics + scheduling' }
      ]
    },
    {
      category: 'Changelog & Release Notes',
      items: [
        { name: 'Changelog.com', link: 'https://changelog.com', pros: 'Dedicated changelog platform' },
        { name: 'Canny', link: 'https://canny.io', pros: 'Changelog + feature requests' },
        { name: 'Notchup', link: 'https://notchup.com', pros: 'Beautiful changelog pages' },
        { name: 'GitHub Releases', link: 'https://github.com', pros: 'Free if using GitHub' }
      ]
    }
  ]
}
