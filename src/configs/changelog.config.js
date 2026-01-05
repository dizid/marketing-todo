export const changelogTask = {
  id: 'feedback-2',
  name: 'Publish Product Updates',
  description: 'Generate multi-channel product update announcements with AI. Turn bullet points into polished announcements for email, social, and in-app.',
  category: 'feedback',
  hasAI: true,

  // Freemium model - Premium tier task
  tier: 'premium',
  what: 'Create and publish product updates (changelog) across channels: in-app, email, blog, Twitter, Reddit. Keep users informed about improvements and new features.',
  why: 'Users want to know you\'re actively improving. Updates build excitement and retention. Users who see updates feel heard and supported by your team.',
  how: 'List your improvements, then get a multi-channel update package: in-app message, email template, blog post, Twitter thread, and Reddit post. Publish to each channel.',

  customComponent: 'ChangelogMiniApp',
  channels: [
    { id: 'twitter', name: 'Twitter/X', maxChars: 280, format: 'short' },
    { id: 'email', name: 'Email', maxChars: 1000, format: 'detailed' },
    { id: 'blog', name: 'Blog Post', maxChars: null, format: 'comprehensive' },
    { id: 'linkedin', name: 'LinkedIn', maxChars: 300, format: 'professional' },
    { id: 'slack', name: 'Slack', maxChars: 400, format: 'casual' }
  ],

  form: [
    {
      id: 'updates_list',
      type: 'textarea',
      label: 'What updates are you announcing?',
      placeholder: '- New dark mode option\n- 50% faster page loads\n- Export to PDF feature\n- Bug fixes for mobile',
      tooltip: 'List each update on a new line. Include both major features and small improvements.',
      required: true,
      rows: 4
    },
    {
      id: 'product_description',
      type: 'textarea',
      label: 'Brief product context',
      placeholder: 'Project management tool for remote teams',
      tooltip: 'One sentence about what your product does',
      required: true,
      rows: 2
    },
    {
      id: 'selected_channels',
      type: 'checkboxes',
      label: 'Which channels to generate for?',
      options: [
        { value: 'twitter', label: 'Twitter/X Thread' },
        { value: 'email', label: 'Email to Users' },
        { value: 'blog', label: 'Blog Post' },
        { value: 'linkedin', label: 'LinkedIn' },
        { value: 'slack', label: 'Slack/Discord' },
        { value: 'inapp', label: 'In-App Notification' }
      ],
      required: true
    },
    {
      id: 'brand_voice',
      type: 'select',
      label: 'Brand voice',
      tooltip: 'Choose the tone that matches your brand personality',
      options: [
        { value: 'professional', label: 'Professional & Polished' },
        { value: 'friendly', label: 'Friendly & Approachable' },
        { value: 'technical', label: 'Technical & Detailed' },
        { value: 'casual', label: 'Casual & Fun' }
      ],
      required: true
    }
  ],

  ai: {
    template: `You are a product communications expert. Create a multi-channel update announcement package.

PRODUCT UPDATES:
{updates_list}

PRODUCT CONTEXT:
{product_description}

TARGET CHANNELS:
{selected_channels}

BRAND VOICE:
{brand_voice}

Generate a COMPLETE announcement package:

## 🐦 TWITTER/X THREAD (280 chars per tweet)

**Tweet 1 (Hook):**
[Attention-grabbing announcement with emoji]

**Tweet 2 (What's New):**
[Main update in 280 chars]

**Tweet 3 (Why It Matters):**
[User benefit focus]

**Tweet 4 (CTA):**
[Call to action with link placeholder]

---

## 📧 EMAIL ANNOUNCEMENT

**Subject Line Options:**
1. [Curiosity-driven subject]
2. [Benefit-driven subject]
3. [Announcement-style subject]

**Email Body:**

Hi {first_name},

[Opening that connects to user's experience]

**What's New:**
[Bullet points of updates with brief explanations]

**Why We Built This:**
[Story/context about the improvement]

**How to Use It:**
[Simple instructions or link to docs]

[Personal sign-off]

---

## 📝 BLOG POST

**Title Options:**
1. [SEO-optimized title]
2. [Benefit-focused title]
3. [Announcement title]

**Introduction (100 words):**
[Hook + context + what this post covers]

**Section 1: The Problem We're Solving**
[User pain point this addresses]

**Section 2: What's New**
[Detailed explanation of each update with screenshots placeholders]

**Section 3: How to Get Started**
[Step-by-step instructions]

**Section 4: What's Next**
[Tease upcoming features, ask for feedback]

**Conclusion + CTA:**
[Summary + call to action]

---

## 💼 LINKEDIN POST

[Professional tone announcement, 1300 chars max]
- Open with business impact
- Bullet key updates
- End with engagement question

---

## 💬 SLACK/DISCORD ANNOUNCEMENT

[Casual, community-friendly version]
- Emoji-rich
- Celebratory tone
- Quick highlights
- Link to full changelog

---

## 📋 IN-APP NOTIFICATION

**Title:** [10 words max]
**Body:** [50 words max, actionable]
**CTA Button:** [3 words max]

Format each section as copy-paste ready content.`,

    temperature: 0.8,
    maxTokens: 3500
  },

  output: {
    enabled: true,
    exportFilename: 'product-update-announcements',
    displayFormat: 'text',
    editable: true,
    deletable: true,
    exportable: true,
    copyable: true
  },

  help: {
    examples: [
      {
        scenario: 'SaaS product shipping new collaboration features',
        input: { updates: ['Real-time cursor tracking', 'Comment threads', 'File version history'], channels: ['twitter', 'email', 'blog'] },
        output: 'Multi-channel update package: concise Twitter thread highlighting the 3 new features with a demo GIF, detailed email to users explaining why each feature was built and how to use them, comprehensive blog post with screenshots and use cases for each feature.'
      },
      {
        scenario: 'Mobile app releasing bug fixes and performance improvements',
        input: { updates: ['Fixed crash on startup', '50% faster load times', 'New dark mode'], channels: ['twitter', 'slack'] },
        output: 'Twitter announcement emphasizing the speed improvement and new dark mode with before/after screenshots, casual Slack message for community thanking beta testers and listing all fixes in a friendly, conversational tone.'
      }
    ],
    commonMistakes: [
      'Only announcing major features - users want to know about ALL improvements, including bug fixes and performance boosts. Regular updates show you\'re actively improving, which builds trust.',
      'Using technical jargon - "Refactored database queries for 10x performance" means nothing to users. Say "App now loads 10x faster" instead. Focus on benefits, not implementation.',
      'Forgetting to explain WHY - listing features without context is boring. Tell users WHY you built this feature, what problem it solves, and how it makes their life better.',
      'Posting once and moving on - publish your update on one channel and call it done. Cross-post to ALL relevant channels (Twitter, email, blog, Slack, in-app) to maximize reach.',
      'No screenshots or demos - walls of text about new features get ignored. Always include screenshots, GIFs, or short demo videos showing the feature in action.',
      'Not asking for feedback - announcing updates as one-way broadcasts. Ask users "What do you think?" or "What should we build next?" to turn announcements into conversations.'
    ]
  }
}
