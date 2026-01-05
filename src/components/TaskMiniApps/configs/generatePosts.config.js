/**
 * Generate Social Posts Mini-App Configuration
 *
 * Demonstrates PromptBuilder integration for context extraction.
 * Instead of 50+ lines of context code, uses 1 line: buildSocialMediaContext()
 *
 * Variables automatically extracted from tiers: 1, 2, 3, 5 (brand + audience + marketing)
 */

import { usePromptBuilder } from '../../../services/promptBuilder.js'

export const generatePostsConfig = {
  id: 'generate-posts',
  title: 'Generate Social Media Posts',
  description: 'Create platform-optimized social media posts with AI assistance. Generate multiple variants and pick your favorites.',

  // Freemium model fields
  tier: 'free',
  what: 'Generate platform-optimized social media posts in minutes. Create multiple variants per platform, then choose your favorites and schedule them to post automatically.',
  why: 'Consistent social media presence drives brand awareness and engagement. Without a steady stream of content, your audience forgets you. AI helps you create more, faster.',
  how: 'Select platforms and describe your content, then generate 3-5 post variants. Review quality, pick your favorites, and schedule them to post at optimal times for maximum engagement.',

  // Field inheritance mappings (mini-app field ID -> canonical ProjectContext field)
  fieldMappings: {
    'platforms': null,
    'tone': null,
    'cta': null,
    'post_count': null,
    'content_focus': 'productDescription',
    'keywords': null,
    'audience_context': 'targetAudience',
    'notes': null
  },

  // Form configuration
  formTitle: 'Post Generation Settings',
  formFields: [
    {
      id: 'platforms',
      type: 'checkboxes',
      label: 'Select Platforms',
      options: [
        { value: 'twitter', label: 'X / Twitter (280 char limit)' },
        { value: 'linkedin', label: 'LinkedIn (professional tone)' },
        { value: 'instagram', label: 'Instagram (visual-focused)' },
        { value: 'facebook', label: 'Facebook (community-focused)' }
      ],
      required: true,
      description: 'Select which platforms to generate content for'
    },
    {
      id: 'tone',
      type: 'select',
      label: 'Tone / Style',
      options: [
        { value: 'professional', label: 'Professional & Authoritative' },
        { value: 'casual', label: 'Casual & Friendly' },
        { value: 'technical', label: 'Technical & Detailed' },
        { value: 'storytelling', label: 'Storytelling & Narrative' },
        { value: 'humorous', label: 'Humorous & Witty' }
      ],
      required: true
    },
    {
      id: 'cta',
      type: 'select',
      label: 'Call-to-Action',
      options: [
        { value: 'signup', label: 'Sign Up / Register' },
        { value: 'learn_more', label: 'Learn More' },
        { value: 'join', label: 'Join Community' },
        { value: 'try', label: 'Try Now / Free Trial' },
        { value: 'share', label: 'Share / Retweet' },
        { value: 'none', label: 'No CTA' }
      ]
    },
    {
      id: 'post_count',
      type: 'number',
      label: 'Number of Posts',
      min: 1,
      max: 10,
      placeholder: '3',
      suffix: 'per platform'
    },
    {
      id: 'content_focus',
      type: 'textarea',
      label: 'Content Focus / Topic',
      placeholder: 'What should these posts be about? (e.g., new feature launch, educational content, company milestone)',
      description: 'The main theme or topic for these posts',
      rows: 3,
      required: true
    },
    {
      id: 'keywords',
      type: 'text',
      label: 'Keywords to Include',
      placeholder: 'e.g., AI, automation, productivity (comma-separated)',
      description: 'Keywords or hashtags to naturally include'
    },
    {
      id: 'audience_context',
      type: 'textarea',
      label: 'Audience Context',
      placeholder: 'Who is your target audience for these posts?',
      description: 'Brief description of who should see and engage with these posts',
      rows: 2
    },
    {
      id: 'notes',
      type: 'textarea',
      label: 'Additional Notes',
      placeholder: 'Any special requirements or context...',
      rows: 2
    }
  ],

  // AI Generation configuration
  aiConfig: {
    promptTemplate: `You are a social media content expert creating platform-optimized posts.

BRAND CONTEXT:
- Company: {company_name}
- Product/Service: {app_description}
- Brand Personality: {brand_personality}
- Tone of Voice: {brand_voice}
- Core Keywords: {brand_keywords}

TARGET AUDIENCE:
- Primary Audience: {audience_description}
- Pain Points: {audience_pain_points}
- Aspirations: {audience_aspirations}

CONTENT REQUIREMENTS:
- Topic/Focus: {content_focus}
- Desired Tone: {tone}
- Call-to-Action: {cta}
- Additional Keywords: {keywords}
- Audience Notes: {audience_context}

SUCCESSFUL PAST CAMPAIGNS (for inspiration):
{past_campaigns}

Platform-Specific Requirements:
- X/Twitter: Max 280 characters, use brand voice, add relevant emojis, include hashtags
- LinkedIn: Professional + thought leadership, showcase expertise, include company personality
- Instagram: Visual-focused descriptions, 3-5 hashtags, call for engagement, use emojis naturally
- Facebook: Community-focused, encourage discussion/shares, longer form allowed, personal tone

Generate exactly {post_count} unique social media posts for each of these platforms: {platforms_list}.

Each post should:
1. Reflect the brand personality and voice
2. Resonate with the target audience
3. Include the call-to-action naturally
4. Use the core keywords where appropriate
5. Be platform-specific (not generic)

Format your response EXACTLY like this:

[PLATFORM: Platform Name]
Post 1 content here
---
Post 2 content here
---

[PLATFORM: Next Platform]
Post 1 content here
---

Important: Use [PLATFORM: ...] headers and --- separators between posts.
Start each post on a new line after the separator.`,

    temperature: 0.8,
    maxTokens: 3000,

    // Use PromptBuilder for context extraction
    // Automatically extracts: company_name, app_description, brand_personality,
    // brand_voice, brand_keywords, audience_description, audience_pain_points,
    // audience_aspirations, past_campaigns from tiers 1, 2, 3, 5
    contextProvider: async () => {
      const builder = usePromptBuilder()
      return await builder.buildSocialMediaContext()
    },

    // Parse response into structured posts
    parseResponse: (response) => {
      const posts = []

      // Split by platform blocks
      const platformBlocks = response.split('[PLATFORM:')

      for (let i = 1; i < platformBlocks.length; i++) {
        const block = platformBlocks[i]
        const platformMatch = block.match(/([^]\n]+)/)?.[1]?.trim()

        if (!platformMatch) continue

        // Get posts for this platform (split by ---)
        const postTexts = block
          .split('---')
          .slice(1) // Skip the platform header line
          .map(p => p.trim())
          .filter(p => p.length > 0)

        // Add each post
        for (const postText of postTexts) {
          posts.push({
            platform: platformMatch,
            content: postText,
            selected: true,
            generatedAt: new Date().toISOString()
          })
        }
      }

      return posts.length > 0 ? posts : null
    }
  },

  // Show output/results section
  showOutput: true,
  exportFilename: 'social-posts',

  // Help content for users
  help: {
    examples: [
      {
        scenario: 'SaaS product launch announcement',
        input: { platforms: ['twitter', 'linkedin'], tone: 'professional', content_focus: 'New AI feature launched', cta: 'learn_more' },
        output: 'Platform-specific posts: Twitter version highlights the key benefit in 280 chars with hashtags, LinkedIn version tells a longer story about solving developer problems'
      },
      {
        scenario: 'Community engagement content',
        input: { platforms: ['instagram', 'facebook'], tone: 'storytelling', content_focus: 'Customer success story', cta: 'join' },
        output: 'Instagram posts focus on visual storytelling and community, Facebook posts encourage discussion and shares with the customer testimonial'
      }
    ],
    commonMistakes: [
      'Posting the same content everywhere - each platform has different norms. Twitter needs brevity + hashtags, LinkedIn needs thought leadership, Instagram needs visual hooks.',
      'No call-to-action - people need to know what to do next. "Learn more", "Try it", "Join us" makes a difference.',
      'Too salesy - people don\'t follow you to be pitched. Share value, insights, and stories first. Sell second.',
      'Ignoring your audience - posting about B2B enterprise features to teenagers won\'t work. Know who uses each platform.',
      'Inconsistent posting - one post every 2 months gets lost. Post consistently (3-5 times per week minimum).',
      'Not engaging with replies - if people comment, ignore them at your peril. Reply within 24 hours to build community.'
    ]
  }
}
