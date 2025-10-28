/**
 * Unified Task Configurations
 *
 * All tasks defined using the unified schema.
 * Each task can be rendered by UnifiedTaskComponent without any custom Vue components.
 */

export const defineAudienceTask = {
  id: 'define-audience',
  name: 'Define Target Audience',
  description: 'Create detailed buyer personas and define your target market with AI assistance.',
  category: 'research',

  form: [
    {
      id: 'audience_overview',
      type: 'textarea',
      label: 'Target Audience Overview',
      placeholder: 'Describe your target audience in 2-3 sentences. Who are they? What are their pain points?',
      description: 'A brief overview of who you\'re targeting and why',
      required: true,
      rows: 3
    },
    {
      id: 'industry',
      type: 'text',
      label: 'Industry',
      placeholder: 'e.g., SaaS, E-commerce, Healthcare',
      description: 'The primary industry your audience works in',
      required: true
    },
    {
      id: 'company_size',
      type: 'select',
      label: 'Typical Company Size',
      options: [
        { value: 'startup', label: 'Startup (1-20 employees)' },
        { value: 'small', label: 'Small Business (21-100 employees)' },
        { value: 'medium', label: 'Medium Business (101-500 employees)' },
        { value: 'enterprise', label: 'Enterprise (500+ employees)' }
      ]
    },
    {
      id: 'job_titles',
      type: 'text',
      label: 'Primary Job Titles',
      placeholder: 'e.g., CTO, Marketing Manager, Product Manager',
      description: 'Comma-separated list of typical job titles'
    },
    {
      id: 'pain_points',
      type: 'textarea',
      label: 'Main Pain Points',
      placeholder: 'What problems does your audience face?',
      description: 'The key challenges and pain points your solution addresses',
      rows: 3
    },
    {
      id: 'budget_range',
      type: 'text',
      label: 'Budget Range',
      placeholder: 'e.g., $5K-$25K annually',
      description: 'The typical budget your audience has for solutions like yours'
    },
    {
      id: 'target_users_30d',
      type: 'number',
      label: 'Target Users (30-day goal)',
      placeholder: '150',
      suffix: 'users to acquire',
      min: 1
    },
    {
      id: 'market_size',
      type: 'textarea',
      label: 'Estimated Market Size',
      placeholder: 'TAM, SAM, SOM estimates',
      description: 'Total Addressable Market, Serviceable Available Market, Serviceable Obtainable Market',
      rows: 3
    },
    {
      id: 'notes',
      type: 'textarea',
      label: 'Additional Notes',
      placeholder: 'Any other insights about your audience...',
      rows: 2
    }
  ],

  ai: {
    template: `Based on the following audience information, generate a detailed buyer persona and market analysis:

Audience Overview: {audience_overview}
Industry: {industry}
Company Size: {company_size}
Job Titles: {job_titles}
Pain Points: {pain_points}
Budget Range: {budget_range}
Market Size Notes: {market_size}

Please generate:
1. A detailed buyer persona (include name, role, goals, pain points, and how they buy)
2. Key success metrics for reaching this audience
3. Top 3 channels to reach them
4. Messaging strategy that resonates with them
5. Potential objections and how to overcome them

Format your response clearly with section headers.`,

    temperature: 0.8,
    maxTokens: 1500,

    contextProvider: () => {
      try {
        const stored = localStorage.getItem('marketing-app-data')
        if (stored) {
          const data = JSON.parse(stored)
          return {
            app_description: data.appDescription || '',
            company_name: data.companyName || ''
          }
        }
      } catch (e) {
        console.error('Error loading context:', e)
      }
      return {}
    }
  },

  output: {
    enabled: true,
    exportFilename: 'audience-personas',
    displayFormat: 'text',
    editable: true,
    deletable: true,
    exportable: true,
    copyable: true
  }
}

export const generatePostsTask = {
  id: 'generate-posts',
  name: 'Generate Social Media Posts',
  description: 'Create platform-optimized social media posts with AI assistance. Generate multiple variants and pick your favorites.',
  category: 'content',

  form: [
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

  ai: {
    template: `Generate exactly {post_count} social media posts for each of these platforms: {platforms_list}.

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

    responseParser: (response) => {
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

  output: {
    enabled: true,
    exportFilename: 'social-posts',
    displayFormat: 'list',
    editable: true,
    deletable: true,
    exportable: true,
    copyable: true
  }
}

// ============================================================================
// REMAINING 19 TASKS (Setup, Social, Content, Acquisition, Feedback, Analytics)
// ============================================================================

export const defineGoalsTask = {
  id: 'setup-2',
  name: 'Define Marketing Goals',
  description: 'Set SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound) for your marketing campaign.',
  category: 'setup',

  form: [
    {
      id: 'goal_what',
      type: 'text',
      label: '📍 Goal: What (Specific)',
      placeholder: 'e.g., Acquire new users through organic channels',
      description: 'Be specific about what you want to achieve',
      required: true
    },
    {
      id: 'goal_metric',
      type: 'number',
      label: '📊 Metric (Measurable)',
      placeholder: '150',
      suffix: 'units',
      min: 1,
      required: true
    },
    {
      id: 'goal_unit',
      type: 'text',
      label: 'Unit of Measure',
      placeholder: 'e.g., users, signups, visits, revenue',
      required: true
    },
    {
      id: 'goal_strategy',
      type: 'textarea',
      label: '✅ Strategy (How to Achieve)',
      placeholder: 'What is your strategy? (e.g., content marketing, paid ads, partnerships)',
      rows: 3
    },
    {
      id: 'goal_why',
      type: 'textarea',
      label: '🎯 Why (Relevant)',
      placeholder: 'Why is this goal important for your business?',
      rows: 3
    },
    {
      id: 'goal_deadline',
      type: 'text',
      label: '⏰ Deadline (Time-bound)',
      placeholder: 'e.g., 30 days, Q1 2024, By March 31',
      required: true
    }
  ],

  ai: null, // No AI for this task

  output: {
    enabled: false
  }
}

export const setupIntegrationsTask = {
  id: 'setup-3',
  name: 'Setup Integrations',
  description: 'Configure third-party integrations for your marketing tools.',
  category: 'setup',

  form: [
    {
      id: 'integrations',
      type: 'checkboxes',
      label: 'Select Integrations to Setup',
      options: [
        { value: 'stripe', label: 'Stripe (Payments)' },
        { value: 'mailchimp', label: 'Mailchimp (Email)' },
        { value: 'hubspot', label: 'HubSpot (CRM)' },
        { value: 'slack', label: 'Slack (Team Communication)' },
        { value: 'zapier', label: 'Zapier (Automation)' },
        { value: 'google-analytics', label: 'Google Analytics (Analytics)' }
      ]
    },
    {
      id: 'integration_notes',
      type: 'textarea',
      label: 'Setup Notes',
      placeholder: 'Add any notes about integration setup...',
      rows: 3
    }
  ],

  ai: null,

  output: {
    enabled: false
  }
}

export const prepareAssetsTask = {
  id: 'setup-4',
  name: 'Prepare Marketing Assets',
  description: 'Prepare logos, banners, videos, and other marketing materials.',
  category: 'setup',

  form: [
    {
      id: 'assets_logos',
      type: 'text',
      label: 'Logo Files Ready?',
      placeholder: 'e.g., SVG, PNG (300px, 1000px)',
      description: 'Describe your logo files'
    },
    {
      id: 'assets_colors',
      type: 'text',
      label: 'Brand Colors',
      placeholder: 'e.g., Primary: #2563EB, Secondary: #1E40AF',
      description: 'Your brand color palette'
    },
    {
      id: 'assets_fonts',
      type: 'text',
      label: 'Brand Fonts',
      placeholder: 'e.g., Headings: Poppins, Body: Inter',
      description: 'Font families for your brand'
    },
    {
      id: 'assets_templates',
      type: 'textarea',
      label: 'Templates & Templates',
      placeholder: 'Social templates, Email templates, Website templates...',
      rows: 3
    }
  ],

  ai: null,

  output: {
    enabled: false
  }
}

export const setupTrackingTask = {
  id: 'setup-5',
  name: 'Setup Conversion Tracking',
  description: 'Configure conversion tracking and analytics to measure campaign success.',
  category: 'setup',

  form: [
    {
      id: 'tracking_goals',
      type: 'checkboxes',
      label: 'Conversion Goals',
      options: [
        { value: 'signup', label: 'Sign Up' },
        { value: 'purchase', label: 'Purchase' },
        { value: 'email_signup', label: 'Email Signup' },
        { value: 'download', label: 'Download' },
        { value: 'contact', label: 'Contact Form' },
        { value: 'custom', label: 'Custom Event' }
      ]
    },
    {
      id: 'tracking_platforms',
      type: 'checkboxes',
      label: 'Tracking Platforms',
      options: [
        { value: 'google_analytics', label: 'Google Analytics' },
        { value: 'facebook_pixel', label: 'Facebook Pixel' },
        { value: 'linkedin_tracking', label: 'LinkedIn Tracking' },
        { value: 'custom_gtag', label: 'Custom GTags' }
      ]
    },
    {
      id: 'tracking_notes',
      type: 'textarea',
      label: 'Implementation Notes',
      placeholder: 'Technical notes for tracking setup...',
      rows: 3
    }
  ],

  ai: null,

  output: {
    enabled: false
  }
}

export const engageFollowersTask = {
  id: 'social-2',
  name: 'Engage Your Followers',
  description: 'Create engagement strategies and campaigns to build community.',
  category: 'social',

  form: [
    {
      id: 'engagement_goal',
      type: 'textarea',
      label: 'Engagement Goal',
      placeholder: 'What do you want to achieve? (e.g., Increase likes, Build community, Launch poll)',
      required: true,
      rows: 2
    },
    {
      id: 'engagement_tactics',
      type: 'checkboxes',
      label: 'Engagement Tactics',
      options: [
        { value: 'polls', label: 'Polls & Surveys' },
        { value: 'questions', label: 'Ask Questions' },
        { value: 'contests', label: 'Contests & Giveaways' },
        { value: 'replies', label: 'Reply to Comments' },
        { value: 'stories', label: 'Stories & Behind-the-Scenes' },
        { value: 'user_generated', label: 'User-Generated Content' }
      ]
    },
    {
      id: 'target_audience',
      type: 'text',
      label: 'Target Audience Segment',
      placeholder: 'Who do you want to engage? (e.g., existing customers, followers)'
    },
    {
      id: 'tone',
      type: 'select',
      label: 'Tone',
      options: [
        { value: 'friendly', label: 'Friendly & Casual' },
        { value: 'professional', label: 'Professional' },
        { value: 'humorous', label: 'Humorous & Fun' },
        { value: 'educational', label: 'Educational' }
      ]
    }
  ],

  ai: {
    template: `Create an engagement strategy for followers:

Goal: {engagement_goal}
Tactics: {engagement_tactics}
Audience: {target_audience}
Tone: {tone}

Generate:
1. 3 specific engagement post ideas
2. Sample questions or prompts
3. Best times to post
4. Expected engagement metrics`,

    temperature: 0.8,
    maxTokens: 1500
  },

  output: {
    enabled: true,
    exportFilename: 'engagement-strategy',
    displayFormat: 'text'
  }
}

export const generateGiveawayTask = {
  id: 'social-3',
  name: 'Generate Giveaway Campaign',
  description: 'Create a giveaway campaign to boost engagement and grow your audience.',
  category: 'social',

  form: [
    {
      id: 'giveaway_prize',
      type: 'textarea',
      label: 'Prize Description',
      placeholder: 'What are you giving away? (be specific)',
      required: true,
      rows: 2
    },
    {
      id: 'giveaway_entry_requirement',
      type: 'select',
      label: 'How to Enter?',
      options: [
        { value: 'follow', label: 'Follow Account' },
        { value: 'like_share', label: 'Like & Share' },
        { value: 'tag_friend', label: 'Tag a Friend' },
        { value: 'email', label: 'Email Signup' },
        { value: 'combined', label: 'Multiple Actions' }
      ]
    },
    {
      id: 'giveaway_duration',
      type: 'text',
      label: 'Duration',
      placeholder: 'e.g., 7 days, 2 weeks, 30 days',
      required: true
    },
    {
      id: 'giveaway_target_growth',
      type: 'number',
      label: 'Target New Followers',
      placeholder: '1000',
      min: 10,
      suffix: 'new followers'
    }
  ],

  ai: {
    template: `Create a giveaway campaign announcement:

Prize: {giveaway_prize}
Entry Requirement: {giveaway_entry_requirement}
Duration: {giveaway_duration}
Target Growth: {giveaway_target_growth}

Generate:
1. Campaign announcement post (Instagram, Twitter, LinkedIn versions)
2. Entry instructions (clear and compelling)
3. Follow-up messaging
4. Winner announcement template`,

    temperature: 0.8,
    maxTokens: 1500
  },

  output: {
    enabled: true,
    exportFilename: 'giveaway-campaign',
    displayFormat: 'text'
  }
}

export const generateBlogTask = {
  id: 'content-1',
  name: 'Generate Blog Post',
  description: 'Generate a complete blog post tailored to your topic and audience.',
  category: 'content',

  form: [
    {
      id: 'blog_topic',
      type: 'text',
      label: 'Blog Topic / Title',
      placeholder: 'e.g., 10 Ways to Improve Your Productivity',
      required: true
    },
    {
      id: 'blog_audience',
      type: 'text',
      label: 'Target Audience',
      placeholder: 'e.g., Startup founders, SaaS users, developers',
      required: true
    },
    {
      id: 'blog_style',
      type: 'select',
      label: 'Writing Style',
      options: [
        { value: 'educational', label: 'Educational / How-to' },
        { value: 'narrative', label: 'Narrative / Storytelling' },
        { value: 'opinion', label: 'Opinion / Thought Leadership' },
        { value: 'case_study', label: 'Case Study' },
        { value: 'list', label: 'List / Listicle' },
        { value: 'technical', label: 'Technical / Deep Dive' }
      ]
    },
    {
      id: 'blog_length',
      type: 'select',
      label: 'Word Count Target',
      options: [
        { value: 'short', label: 'Short (500-800 words)' },
        { value: 'medium', label: 'Medium (1000-1500 words)' },
        { value: 'long', label: 'Long (2000-3000 words)' },
        { value: 'comprehensive', label: 'Comprehensive (3000+ words)' }
      ]
    },
    {
      id: 'blog_seo_keywords',
      type: 'text',
      label: 'SEO Keywords',
      placeholder: 'e.g., productivity tips, time management (comma-separated)',
      description: 'Keywords to optimize for'
    }
  ],

  ai: {
    template: `Write a {blog_length} blog post:

Title: {blog_topic}
Target Audience: {blog_audience}
Writing Style: {blog_style}
SEO Keywords: {blog_seo_keywords}

Generate:
1. Engaging introduction (hook the reader)
2. 3-5 main sections with subheadings
3. Conclusion with call-to-action
4. 2-3 related internal link suggestions
5. 3-5 SEO-friendly meta descriptions

Format as markdown with proper headings.`,

    temperature: 0.7,
    maxTokens: 3000
  },

  output: {
    enabled: true,
    exportFilename: 'blog-post',
    displayFormat: 'text'
  }
}

export const generateVideoTask = {
  id: 'content-2',
  name: 'Generate Video Script',
  description: 'Generate a script for a promotional or educational video.',
  category: 'content',

  form: [
    {
      id: 'video_topic',
      type: 'text',
      label: 'Video Topic',
      placeholder: 'e.g., Product Demo, Tutorial, Customer Testimonial',
      required: true
    },
    {
      id: 'video_duration',
      type: 'select',
      label: 'Video Duration',
      options: [
        { value: '30sec', label: '30 seconds (short form)' },
        { value: '1min', label: '1-2 minutes (standard)' },
        { value: '3min', label: '3-5 minutes (educational)' },
        { value: '10min', label: '10+ minutes (deep dive)' }
      ]
    },
    {
      id: 'video_type',
      type: 'select',
      label: 'Video Type',
      options: [
        { value: 'demo', label: 'Product Demo' },
        { value: 'tutorial', label: 'Tutorial / How-to' },
        { value: 'testimonial', label: 'Customer Testimonial' },
        { value: 'announcement', label: 'Announcement' },
        { value: 'behind_scenes', label: 'Behind the Scenes' }
      ]
    },
    {
      id: 'video_tone',
      type: 'select',
      label: 'Tone',
      options: [
        { value: 'professional', label: 'Professional' },
        { value: 'friendly', label: 'Friendly & Casual' },
        { value: 'humorous', label: 'Humorous' },
        { value: 'energetic', label: 'Energetic & Dynamic' }
      ]
    },
    {
      id: 'video_cta',
      type: 'text',
      label: 'Call-to-Action',
      placeholder: 'e.g., Subscribe, Learn more, Sign up'
    }
  ],

  ai: {
    template: `Generate a video script:

Topic: {video_topic}
Duration: {video_duration}
Type: {video_type}
Tone: {video_tone}
CTA: {video_cta}

Generate:
1. Hook/Opening (grab attention in first 3 seconds)
2. Main content sections (with timing indicators)
3. Visual cues and B-roll suggestions
4. Voiceover narration
5. Call-to-action
6. Closing shot

Format with timestamps and visual descriptions.`,

    temperature: 0.8,
    maxTokens: 2000
  },

  output: {
    enabled: true,
    exportFilename: 'video-script',
    displayFormat: 'text'
  }
}

export const generateGraphicsTask = {
  id: 'content-3',
  name: 'Generate Graphics Brief',
  description: 'Generate design briefs for social media graphics.',
  category: 'content',

  form: [
    {
      id: 'graphics_type',
      type: 'select',
      label: 'Graphics Type',
      options: [
        { value: 'quote', label: 'Quote Graphic' },
        { value: 'infographic', label: 'Infographic' },
        { value: 'carousel', label: 'Carousel Post' },
        { value: 'banner', label: 'Web Banner' },
        { value: 'thumbnail', label: 'Video Thumbnail' }
      ]
    },
    {
      id: 'graphics_topic',
      type: 'text',
      label: 'Topic / Message',
      placeholder: 'What is the main message?',
      required: true
    },
    {
      id: 'graphics_platform',
      type: 'select',
      label: 'Platform',
      options: [
        { value: 'instagram', label: 'Instagram (1080x1350)' },
        { value: 'twitter', label: 'Twitter / X (1200x675)' },
        { value: 'linkedin', label: 'LinkedIn (1200x627)' },
        { value: 'web', label: 'Web Banner' }
      ]
    },
    {
      id: 'graphics_style',
      type: 'select',
      label: 'Visual Style',
      options: [
        { value: 'minimal', label: 'Minimal & Clean' },
        { value: 'bold', label: 'Bold & Vibrant' },
        { value: 'data', label: 'Data-driven' },
        { value: 'playful', label: 'Playful & Fun' }
      ]
    }
  ],

  ai: {
    template: `Create a graphics design brief:

Type: {graphics_type}
Topic: {graphics_topic}
Platform: {graphics_platform}
Style: {graphics_style}

Generate:
1. Main message/headline
2. Visual layout suggestions
3. Color palette recommendations
4. Typography suggestions
5. Elements to include (icons, images, text)
6. Key do's and don'ts
7. File specifications`,

    temperature: 0.8,
    maxTokens: 1500
  },

  output: {
    enabled: true,
    exportFilename: 'graphics-brief',
    displayFormat: 'text'
  }
}

export const generateOutreachTask = {
  id: 'acq-2',
  name: 'Generate Outreach Campaign',
  description: 'Create an outreach campaign to acquire new users and customers.',
  category: 'acquisition',

  form: [
    {
      id: 'outreach_goal',
      type: 'textarea',
      label: 'Campaign Goal',
      placeholder: 'What do you want to achieve? (e.g., Partnership, Customer acquisition, Beta signup)',
      required: true,
      rows: 2
    },
    {
      id: 'outreach_target',
      type: 'text',
      label: 'Target Profile',
      placeholder: 'e.g., SaaS founders, Marketing managers, Enterprise CTOs',
      required: true
    },
    {
      id: 'outreach_channel',
      type: 'select',
      label: 'Outreach Channel',
      options: [
        { value: 'email', label: 'Email Outreach' },
        { value: 'linkedin', label: 'LinkedIn Messaging' },
        { value: 'twitter', label: 'Twitter / X DM' },
        { value: 'partnership', label: 'Partnership Pitch' }
      ]
    },
    {
      id: 'outreach_value',
      type: 'textarea',
      label: 'Value Proposition',
      placeholder: 'What value do you offer to them?',
      rows: 2
    }
  ],

  ai: {
    template: `Create an outreach campaign:

Goal: {outreach_goal}
Target: {outreach_target}
Channel: {outreach_channel}
Value Proposition: {outreach_value}

Generate:
1. Subject line (compelling and clear)
2. Opening hook (personalized and relevant)
3. Problem statement (their pain point)
4. Your solution
5. Social proof / credibility
6. Call-to-action
7. Follow-up messaging strategy`,

    temperature: 0.8,
    maxTokens: 1500
  },

  output: {
    enabled: true,
    exportFilename: 'outreach-campaign',
    displayFormat: 'text'
  }
}

export const generateWebinarTask = {
  id: 'acq-3',
  name: 'Generate Webinar Plan',
  description: 'Plan and structure a webinar to educate and convert prospects.',
  category: 'acquisition',

  form: [
    {
      id: 'webinar_topic',
      type: 'text',
      label: 'Webinar Topic',
      placeholder: 'e.g., How to Scale Your SaaS from 0 to $1M ARR',
      required: true
    },
    {
      id: 'webinar_audience',
      type: 'text',
      label: 'Target Audience',
      placeholder: 'e.g., SaaS founders, Startup CTOs',
      required: true
    },
    {
      id: 'webinar_duration',
      type: 'select',
      label: 'Duration',
      options: [
        { value: '30min', label: '30 minutes' },
        { value: '45min', label: '45 minutes' },
        { value: '60min', label: '60 minutes (standard)' },
        { value: '90min', label: '90 minutes (detailed)' }
      ]
    },
    {
      id: 'webinar_format',
      type: 'select',
      label: 'Format',
      options: [
        { value: 'presentation', label: 'Presentation + Q&A' },
        { value: 'panel', label: 'Panel Discussion' },
        { value: 'workshop', label: 'Interactive Workshop' },
        { value: 'interview', label: 'Expert Interview' }
      ]
    }
  ],

  ai: {
    template: `Create a webinar plan:

Topic: {webinar_topic}
Audience: {webinar_audience}
Duration: {webinar_duration}
Format: {webinar_format}

Generate:
1. Webinar outline with section timings
2. Key talking points
3. Slides structure and topics
4. Interactive elements (polls, Q&A)
5. Promotional message
6. Follow-up email sequence
7. Success metrics to track`,

    temperature: 0.8,
    maxTokens: 2000
  },

  output: {
    enabled: true,
    exportFilename: 'webinar-plan',
    displayFormat: 'text'
  }
}

export const collectFeedbackTask = {
  id: 'feedback-1',
  name: 'Collect Customer Feedback',
  description: 'Create surveys and feedback campaigns to understand customer needs.',
  category: 'feedback',

  form: [
    {
      id: 'feedback_goal',
      type: 'textarea',
      label: 'Feedback Goal',
      placeholder: 'What feedback do you want to collect? (e.g., Product satisfaction, Feature requests)',
      required: true,
      rows: 2
    },
    {
      id: 'feedback_audience',
      type: 'select',
      label: 'Survey Audience',
      options: [
        { value: 'current_customers', label: 'Current Customers' },
        { value: 'trial_users', label: 'Trial Users' },
        { value: 'churned', label: 'Churned Customers' },
        { value: 'prospects', label: 'Prospects' }
      ]
    },
    {
      id: 'feedback_method',
      type: 'select',
      label: 'Collection Method',
      options: [
        { value: 'survey', label: 'Online Survey' },
        { value: 'interview', label: 'User Interview' },
        { value: 'form', label: 'Feedback Form' },
        { value: 'nps', label: 'NPS Survey' }
      ]
    },
    {
      id: 'feedback_incentive',
      type: 'text',
      label: 'Incentive (optional)',
      placeholder: 'e.g., Gift card, discount, entry to raffle'
    }
  ],

  ai: {
    template: `Create a feedback collection campaign:

Goal: {feedback_goal}
Audience: {feedback_audience}
Method: {feedback_method}
Incentive: {feedback_incentive}

Generate:
1. 5-10 survey questions
2. Invitation email template
3. Thank you message
4. Analysis framework for responses
5. Follow-up actions
6. Reporting template`,

    temperature: 0.7,
    maxTokens: 1500
  },

  output: {
    enabled: true,
    exportFilename: 'feedback-campaign',
    displayFormat: 'text'
  }
}

export const publishUpdatesTask = {
  id: 'feedback-2',
  name: 'Publish Product Updates',
  description: 'Communicate product updates and improvements to your audience.',
  category: 'feedback',

  form: [
    {
      id: 'update_title',
      type: 'text',
      label: 'Update Title',
      placeholder: 'e.g., New AI Features Released',
      required: true
    },
    {
      id: 'update_features',
      type: 'textarea',
      label: 'Features / Improvements',
      placeholder: 'List the key changes and improvements...',
      required: true,
      rows: 3
    },
    {
      id: 'update_impact',
      type: 'text',
      label: 'User Impact',
      placeholder: 'How does this benefit users?'
    },
    {
      id: 'update_channels',
      type: 'checkboxes',
      label: 'Communication Channels',
      options: [
        { value: 'email', label: 'Email Newsletter' },
        { value: 'blog', label: 'Blog Post' },
        { value: 'social', label: 'Social Media' },
        { value: 'changelog', label: 'Changelog / Release Notes' }
      ]
    }
  ],

  ai: {
    template: `Create product update announcements:

Title: {update_title}
Features: {update_features}
Impact: {update_impact}
Channels: {update_channels}

Generate:
1. Email announcement
2. Social media posts (Twitter, LinkedIn, Facebook)
3. Blog post excerpt
4. Changelog entry
5. Internal team announcement
6. Key benefits summary`,

    temperature: 0.8,
    maxTokens: 1500
  },

  output: {
    enabled: true,
    exportFilename: 'product-updates',
    displayFormat: 'text'
  }
}

export const iterateFeaturesTask = {
  id: 'feedback-3',
  name: 'Plan Feature Iteration',
  description: 'Plan how to iterate on features based on user feedback.',
  category: 'feedback',

  form: [
    {
      id: 'iteration_feature',
      type: 'text',
      label: 'Feature Name',
      placeholder: 'Which feature are you iterating on?',
      required: true
    },
    {
      id: 'iteration_feedback',
      type: 'textarea',
      label: 'User Feedback',
      placeholder: 'What feedback did you receive from users?',
      required: true,
      rows: 3
    },
    {
      id: 'iteration_goal',
      type: 'text',
      label: 'Iteration Goal',
      placeholder: 'e.g., Improve usability, Add missing features, Fix bugs'
    }
  ],

  ai: {
    template: `Create a feature iteration plan:

Feature: {iteration_feature}
User Feedback: {iteration_feedback}
Goal: {iteration_goal}

Generate:
1. Problem analysis (what's the core issue?)
2. Proposed solutions (3 options)
3. MVP approach (minimal changes to ship faster)
4. Success metrics
5. Timeline and milestones
6. Testing plan
7. Communication strategy to users`,

    temperature: 0.7,
    maxTokens: 1500
  },

  output: {
    enabled: true,
    exportFilename: 'feature-iteration-plan',
    displayFormat: 'text'
  }
}

export const setupAnalyticsTask = {
  id: 'analytics-1',
  name: 'Setup Analytics',
  description: 'Configure analytics and dashboards to measure campaign success.',
  category: 'analytics',

  form: [
    {
      id: 'analytics_platform',
      type: 'select',
      label: 'Analytics Platform',
      options: [
        { value: 'google', label: 'Google Analytics' },
        { value: 'mixpanel', label: 'Mixpanel' },
        { value: 'amplitude', label: 'Amplitude' },
        { value: 'heap', label: 'Heap' }
      ]
    },
    {
      id: 'analytics_metrics',
      type: 'checkboxes',
      label: 'Key Metrics to Track',
      options: [
        { value: 'pageviews', label: 'Page Views' },
        { value: 'visitors', label: 'Unique Visitors' },
        { value: 'conversion', label: 'Conversion Rate' },
        { value: 'bounce_rate', label: 'Bounce Rate' },
        { value: 'time_on_page', label: 'Time on Page' },
        { value: 'retention', label: 'Retention Rate' }
      ]
    },
    {
      id: 'analytics_goals',
      type: 'textarea',
      label: 'Analytics Goals',
      placeholder: 'What do you want to measure? (e.g., user acquisition, retention, revenue)',
      rows: 2
    }
  ],

  ai: null,

  output: {
    enabled: false
  }
}

export const optimizeChannelsTask = {
  id: 'analytics-2',
  name: 'Optimize Marketing Channels',
  description: 'Analyze and optimize your marketing channels for better ROI.',
  category: 'analytics',

  form: [
    {
      id: 'optimize_channels',
      type: 'checkboxes',
      label: 'Channels to Optimize',
      options: [
        { value: 'paid_search', label: 'Paid Search (Google Ads)' },
        { value: 'social_ads', label: 'Social Ads (Meta, LinkedIn)' },
        { value: 'email', label: 'Email Marketing' },
        { value: 'content', label: 'Content Marketing' },
        { value: 'referral', label: 'Referral / Partnerships' }
      ]
    },
    {
      id: 'optimize_metrics',
      type: 'textarea',
      label: 'Current Performance Issues',
      placeholder: "What's not working well? (e.g., High CPC, Low CTR, Poor retention)",
      required: true,
      rows: 2
    },
    {
      id: 'optimize_budget',
      type: 'number',
      label: 'Monthly Budget',
      placeholder: '5000',
      suffix: 'USD',
      min: 100
    }
  ],

  ai: {
    template: `Create a marketing optimization strategy:

Channels: {optimize_channels}
Current Issues: {optimize_metrics}
Budget: {optimize_budget}

Generate:
1. Root cause analysis for each channel
2. Optimization recommendations (specific, actionable)
3. A/B testing ideas
4. Budget allocation strategy
5. Expected ROI improvements
6. Timeline for implementation
7. Success metrics and monitoring`,

    temperature: 0.8,
    maxTokens: 2000
  },

  output: {
    enabled: true,
    exportFilename: 'channel-optimization',
    displayFormat: 'text'
  }
}

export const reviewROITask = {
  id: 'analytics-3',
  name: 'Review Marketing ROI',
  description: 'Analyze marketing ROI and plan for profitability.',
  category: 'analytics',

  form: [
    {
      id: 'roi_period',
      type: 'select',
      label: 'Review Period',
      options: [
        { value: 'week', label: 'Last Week' },
        { value: 'month', label: 'Last Month' },
        { value: 'quarter', label: 'Last Quarter' },
        { value: 'year', label: 'Last Year' }
      ]
    },
    {
      id: 'roi_revenue',
      type: 'number',
      label: 'Revenue Generated',
      placeholder: '50000',
      suffix: 'USD'
    },
    {
      id: 'roi_spending',
      type: 'number',
      label: 'Marketing Spend',
      placeholder: '10000',
      suffix: 'USD'
    },
    {
      id: 'roi_issues',
      type: 'textarea',
      label: 'Challenges / Concerns',
      placeholder: 'What challenges did you face?',
      rows: 2
    }
  ],

  ai: {
    template: `Analyze marketing ROI and create improvement plan:

Period: {roi_period}
Revenue: ${'{roi_revenue}'}
Spend: ${'{roi_spending}'}
Challenges: {roi_issues}

Generate:
1. ROI calculation and analysis
2. Channel performance comparison
3. Cost per acquisition analysis
4. Profitability assessment
5. Top 3 areas to improve
6. Budget reallocation strategy
7. 90-day improvement plan`,

    temperature: 0.8,
    maxTokens: 1500
  },

  output: {
    enabled: true,
    exportFilename: 'roi-analysis',
    displayFormat: 'text'
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

// Export a map of all tasks by ID for easy lookup
export const unifiedTasksMap = {
  'setup-1': defineAudienceTask,
  'setup-2': defineGoalsTask,
  'setup-3': setupIntegrationsTask,
  'setup-4': prepareAssetsTask,
  'setup-5': setupTrackingTask,

  'social-1': generatePostsTask,
  'social-2': engageFollowersTask,
  'social-3': generateGiveawayTask,

  'content-1': generateBlogTask,
  'content-2': generateVideoTask,
  'content-3': generateGraphicsTask,

  'acq-2': generateOutreachTask,
  'acq-3': generateWebinarTask,

  'feedback-1': collectFeedbackTask,
  'feedback-2': publishUpdatesTask,
  'feedback-3': iterateFeaturesTask,

  'analytics-1': setupAnalyticsTask,
  'analytics-2': optimizeChannelsTask,
  'analytics-3': reviewROITask
}

// Export all tasks as array for iteration
export const unifiedTasks = Object.values(unifiedTasksMap)
