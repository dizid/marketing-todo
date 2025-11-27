/**
 * Generate Social Posts Mini-App Configuration
 *
 * This config defines the form fields, AI generation prompt,
 * and output structure for generating social media content
 */

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
    promptTemplate: `Generate exactly {post_count} social media posts for each of these platforms: {platforms_list}.

Content Requirements:
- Topic/Focus: {content_focus}
- Tone: {tone}
- Call-to-Action: {cta}
- Keywords to include: {keywords}
- Target Audience: {audience_context}
- App/Product: {app_description}

Platform-Specific Requirements:
- X/Twitter: Max 280 characters, use hashtags, add relevant emojis
- LinkedIn: Professional tone, industry insights, include company voice
- Instagram: Visual-focused descriptions, 3-5 hashtags, call for engagement
- Facebook: Community-focused, encourage comments and shares

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
    maxTokens: 2500,

    // Get app description and platform names
    contextProvider: () => {
      try {
        const stored = localStorage.getItem('marketing-app-data')
        const data = stored ? JSON.parse(stored) : {}
        return {
          app_description: data.appDescription || 'Your product/service',
          company_name: data.companyName || ''
        }
      } catch (e) {
        console.error('Error loading context:', e)
        return { app_description: 'Your product/service' }
      }
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
  exportFilename: 'social-posts'
}
