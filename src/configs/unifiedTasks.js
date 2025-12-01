/**
 * Unified Task Configurations
 *
 * All tasks defined using the unified schema.
 * Each task can be rendered by UnifiedTaskComponent without any custom Vue components.
 *
 * ARCHITECTURE NOTE (Phase 2B Consolidation):
 * These task definitions exist for backwards compatibility and unified task list rendering.
 * Modern implementation uses mini-apps via TaskMiniApps component for better UX.
 * - webinarTask, outreachTask, emailSequenceTask → Also have mini-app implementations
 * - When consolidating configs (Phase 2B), these can reference mini-app configs directly
 * - See: src/components/TaskMiniApps/configs/ for authoritative mini-app definitions
 */

import { connectAccountsTask } from './connectAccounts.config'
import { prepareAssetsTask } from './prepareAssets.config'
import { trackingSheetTask } from './trackingSheet.config'
import { writeBlogTask } from './writeBlog.config'
import { designGraphicsTask } from './designGraphics.config'
import { engageFollowersTask } from './engageFollowers.config'
import { giveawayTask } from './giveaway.config'
import { videoScriptTask } from './videoScript.config'
import { communityPostsTask } from './communityPosts.config'
import { outreachTask } from './outreach.config'
import { webinarTask } from './webinar.config'
import { feedbackCollectionTask } from './feedbackCollection.config'
import { changelogTask } from './changelog.config'
import { featurePrioritizationTask } from './featurePrioritization.config'
import { analyticsSetupTask } from './analyticsSetup.config'
import { channelOptimizerTask } from './channelOptimizer.config'
import { channelAnalyzerTask } from './channelAnalyzer.config'
import { roiCalculatorTask } from './roiCalculator.config'
import { paidAdsTask } from './paidAds.config'
import { paidAdsOptimizeTask } from './paidAdsOptimize.config'
import { funnelBlueprintTask } from './salesFunnel.config'
import { offerBuilderTask } from './offerBuilder.config'
import { objectionHandlingTask } from './objectionHandling.config'
import { emailSequenceTask } from './emailSequence.config'
import { salesPageAuditTask } from './salesPageAudit.config'
import { leadMagnetTask } from './leadMagnet.config'
import { coldOutreachTask } from './coldOutreach.config'
import { competitorAnalysisTask } from './competitorAnalysis.config'
import { competitivePositioningBriefConfig } from './competitivePositioningBrief.config'
import { abTestIdeasTask } from './abTestIdeas.config'
import { positioningMapTask } from './positioningMap.config'

export const defineAudienceTask = {
  id: 'define-audience',
  name: 'Define Target Audience',
  description: 'Answer 5 questions about your audience and let AI generate detailed buyer personas to guide your marketing strategy.',
  category: 'research',
  tier: 'free',
  what: 'Create detailed buyer personas and define your target market. Input audience demographics, pain points, budget, and goals to generate comprehensive personas with messaging strategies.',
  why: 'A clear understanding of your target audience is the foundation for all marketing. Without buyer personas, your messaging will miss the mark and you\'ll waste time reaching the wrong people. Personas guide all decisions: content, positioning, channels, and messaging.',
  how: 'Answer questions about your audience (who they are, what they want, what keeps them up at night). AI will synthesize this into detailed personas with actionable insights on how to reach and persuade them.',

  form: [
    {
      id: 'audience_overview',
      type: 'textarea',
      label: 'Target Audience Overview',
      
      tooltip: 'Be specific: who are they (job title, company size)? What problem do they have?',
      example: 'e.g., specific example here',placeholder: 'Describe your target audience in 2-3 sentences. Who are they? What are their pain points?',
      description: 'A brief overview of who you\'re targeting and why',
      tooltip: 'Be specific: who are they (job title, company size)? What problem do they have?',
      example: 'CTOs at Series A fintech startups struggling with payment infrastructure',
      required: true,
      rows: 3
    },
    {
      id: 'industry',
      type: 'text',
      label: 'Industry',
      
      tooltip: 'The primary industry or vertical (e.g., SaaS, Healthcare, E-commerce)',
      example: 'e.g., specific example here',placeholder: 'e.g., SaaS, E-commerce, Healthcare',
      description: 'The primary industry your audience works in',
      required: true
    },
    {
      id: 'company_size',
      type: 'select',
      label: 'Typical Company Size',
      
      tooltip: 'Typical company size of your target audience',
      example: 'e.g., specific example here',options: [
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
      
      tooltip: 'Comma-separated list of people who would use your product',
      example: 'e.g., specific example here',placeholder: 'e.g., CTO, Marketing Manager, Product Manager',
      description: 'Comma-separated list of typical job titles'
    },
    {
      id: 'pain_points',
      type: 'textarea',
      label: 'Main Pain Points',
      
      tooltip: 'What specific problems does your audience face? What keeps them up at night?',
      example: 'e.g., specific example here',placeholder: 'What problems does your audience face?',
      description: 'The key challenges and pain points your solution addresses',
      rows: 3
    },
    {
      id: 'budget_range',
      type: 'text',
      label: 'Budget Range',
      
      tooltip: 'How much are they willing to spend on a solution like yours?',
      example: 'e.g., specific example here',placeholder: 'e.g., $5K-$25K annually',
      description: 'The typical budget your audience has for solutions like yours'
    },
    {
      id: 'target_users_30d',
      type: 'number',
      label: 'Target Users (30-day goal)',
      
      tooltip: 'How many customers do you want to acquire in the next 30 days?',
      example: 'e.g., specific example here',placeholder: '150',
      suffix: 'users to acquire',
      min: 1
    },
    {
      id: 'market_size',
      type: 'textarea',
      label: 'Estimated Market Size',
      
      tooltip: 'TAM (Total), SAM (Serviceable), SOM (Obtainable) market estimates',
      example: 'e.g., specific example here',placeholder: 'TAM, SAM, SOM estimates',
      description: 'Total Addressable Market, Serviceable Available Market, Serviceable Obtainable Market',
      rows: 3
    },
    {
      id: 'notes',
      type: 'textarea',
      label: 'Additional Notes',
      
      tooltip: 'Any other relevant context about your audience or market',
      example: 'e.g., specific example here',placeholder: 'Any other insights about your audience...',
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
  },

  help: {
    examples: [
      {
        scenario: 'B2B SaaS targeting CTOs at fintech startups',
        input: { audience_overview: 'CTOs at Series A fintech startups needing payment infrastructure', industry: 'FinTech', company_size: 'startup', job_titles: 'CTO, Engineering Lead' },
        output: 'Persona: Alex, 28, CTO at early-stage fintech. Struggles with payment infrastructure. Budget: $50K-100K/year. Decision maker. Values scalability and reliability.'
      },
      {
        scenario: 'E-commerce targeting online sellers struggling with inventory',
        input: { audience_overview: 'Amazon/Shopify sellers overwhelmed by inventory management', industry: 'E-commerce', company_size: 'small', job_titles: 'Shop Owner, Operations Manager', pain_points: 'Manual inventory tracking, overselling, lost sales' },
        output: 'Persona: Sarah, 35, runs 3 Shopify stores. Spending 15 hrs/week on inventory. Budget: $100-300/month. Wants automation and real-time sync.'
      }
    ],
    commonMistakes: [
      'Being too vague - "everyone" is not an audience. Be specific: job title + company size + industry.',
      'Forgetting pain points - companies care about what problems you solve, not just demographics.',
      'Not considering budget - understanding their budget helps position your price correctly.',
      'Ignoring industry context - same problem in different industries often requires different solutions.',
      'Describing activities instead of problems - focus on what keeps them up at night, not daily tasks.',
      'Making it up - research real people, talk to customers, don\'t guess.'
    ]
  }
}

export const generatePostsTask = {
  id: 'generate-posts',
  name: 'Generate Social Media Posts',
  description: 'Create platform-optimized social media posts with AI assistance. Generate multiple variants and pick your favorites.',
  category: 'content',
  tier: 'free',
  what: 'Generate 1-10 platform-optimized social media posts per channel (Twitter, LinkedIn, Instagram, Facebook). Specify your topic, tone, CTA, and audience. AI will create native content for each platform with proper formatting and engagement hooks.',
  why: 'Consistent social posting drives brand awareness, engagement, and traffic. However, creating quality posts for multiple platforms is time-consuming (rewriting for each platform\'s culture and format). Manually posting 20+ times per week is unrealistic. AI-generated variants let you post consistently without the time drain.',
  how: 'Tell AI what you want to say, who should hear it, and what tone you want. Select your platforms (Twitter, LinkedIn, Instagram, Facebook). AI will generate platform-native posts with appropriate length, hashtags, emojis, and CTAs for each channel. Pick your favorites and schedule them.',

  form: [
    {
      id: 'platforms',
      type: 'checkboxes',
      label: 'Select Platforms',
      
      tooltip: 'Information about Select Platforms',
      example: 'e.g., specific example here',options: [
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
      
      tooltip: 'Information about Tone / Style',
      example: 'e.g., specific example here',options: [
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
      
      tooltip: 'Information about Call-to-Action',
      example: 'e.g., specific example here',options: [
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
      
      tooltip: 'Information about Number of Posts',
      example: 'e.g., specific example here',min: 1,
      max: 10,
      placeholder: '3',
      suffix: 'per platform'
    },
    {
      id: 'content_focus',
      type: 'textarea',
      label: 'Content Focus / Topic',
      
      tooltip: 'Information about Content Focus / Topic',
      example: 'e.g., specific example here',placeholder: 'What should these posts be about? (e.g., new feature launch, educational content, company milestone)',
      description: 'The main theme or topic for these posts',
      rows: 3,
      required: true
    },
    {
      id: 'keywords',
      type: 'text',
      label: 'Keywords to Include',
      
      tooltip: 'Information about Keywords to Include',
      example: 'e.g., specific example here',placeholder: 'e.g., AI, automation, productivity (comma-separated)',
      description: 'Keywords or hashtags to naturally include'
    },
    {
      id: 'audience_context',
      type: 'textarea',
      label: 'Audience Context',
      
      tooltip: 'Information about Audience Context',
      example: 'e.g., specific example here',placeholder: 'Who is your target audience for these posts?',
      description: 'Brief description of who should see and engage with these posts',
      rows: 2
    },
    {
      id: 'notes',
      type: 'textarea',
      label: 'Additional Notes',
      
      tooltip: 'Any other relevant context about your audience or market',
      example: 'e.g., specific example here',placeholder: 'Any special requirements or context...',
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
      console.log('[responseParser] Input response:', response.substring(0, 300))
      const posts = []

      // Split by platform blocks
      const platformBlocks = response.split('[PLATFORM:')
      console.log('[responseParser] platformBlocks count:', platformBlocks.length)

      for (let i = 1; i < platformBlocks.length; i++) {
        const block = platformBlocks[i]
        console.log('[responseParser] Processing block', i, ':', block.substring(0, 150))

        // Extract platform name (everything until the first newline)
        const platformMatch = block.match(/^([^\n]+)/)?.[1]?.trim()
        console.log('[responseParser] platformMatch:', platformMatch)

        if (!platformMatch) {
          console.log('[responseParser] No platform match, skipping')
          continue
        }

        // Get posts for this platform
        // If there are --- separators, split by those, otherwise treat the whole block as one post
        let postTexts = []
        if (block.includes('---')) {
          postTexts = block
            .split('---')
            .slice(1) // Skip the platform header line
            .map(p => p.trim())
            .filter(p => p.length > 0)
        } else {
          // No separators, treat everything after the platform line as one post
          const contentAfterPlatform = block.split('\n').slice(1).join('\n').trim()
          if (contentAfterPlatform) {
            postTexts = [contentAfterPlatform]
          }
        }

        console.log('[responseParser] Found', postTexts.length, 'post texts for', platformMatch)

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

      console.log('[responseParser] Final posts:', posts.length, posts)
      return posts.length > 0 ? posts : response // Return raw response if parsing fails
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
  },

  help:   {
      "examples": [
          {
              "scenario": "LinkedIn thought leadership",
              "input": {
                  "post_type": "LinkedIn",
                  "topic": "AI automation",
                  "tone": "professional"
              },
              "output": "5 LinkedIn posts about AI automation benefits for business leaders"
          },
          {
              "scenario": "Twitter thread about a product feature",
              "input": {
                  "post_type": "Twitter",
                  "topic": "New feature launch",
                  "tone": "casual"
              },
              "output": "A 7-tweet thread explaining the feature and why users should care"
          }
      ],
      "commonMistakes": [
          "Writing too long for the platform - Twitter has character limits, LinkedIn works better with shorter paragraphs.",
          "Using too much jargon - make it understandable to your target audience, not just experts.",
          "Forgetting the CTA (call to action) - what do you want readers to do? Comment? Share? Visit link?",
          "All promotion, no value - lead with value/insight first, then mention your product.",
          "Same tone everywhere - LinkedIn and Twitter have different audiences and tones. Adapt accordingly."
      ]
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
  tier: 'free',
  what: 'Define 3-5 SMART marketing goals (Specific, Measurable, Achievable, Relevant, Time-bound). Specify what you want to achieve, the metric, your strategy, why it matters, and your deadline.',
  why: 'Without clear goals, your marketing efforts are scattered and unmeasurable. SMART goals create focus, accountability, and measurable success. They guide budget allocation, channel selection, and content strategy. Vague goals like "grow the business" lead to wasted effort.',
  how: 'For each goal, answer: What do you want (e.g., 150 new users)? How will you measure it (e.g., signups)? Why is it important? What\'s your strategy (e.g., content marketing)? What\'s the deadline (e.g., 30 days)? Write these down and reference them in every marketing decision.',

  form: [
    {
      id: 'goal_what',
      type: 'text',
      label: '📍 Goal: What (Specific)',
      
      tooltip: 'Information about 📍 Goal: What (Specific)',
      example: 'e.g., specific example here',placeholder: 'e.g., Acquire new users through organic channels',
      description: 'Be specific about what you want to achieve',
      required: true
    },
    {
      id: 'goal_metric',
      type: 'number',
      label: '📊 Metric (Measurable)',
      
      tooltip: 'Information about 📊 Metric (Measurable)',
      example: 'e.g., specific example here',placeholder: '150',
      suffix: 'units',
      min: 1,
      required: true
    },
    {
      id: 'goal_unit',
      type: 'text',
      label: 'Unit of Measure',
      
      tooltip: 'Information about Unit of Measure',
      example: 'e.g., specific example here',placeholder: 'e.g., users, signups, visits, revenue',
      required: true
    },
    {
      id: 'goal_strategy',
      type: 'textarea',
      label: '✅ Strategy (How to Achieve)',
      
      tooltip: 'Information about ✅ Strategy (How to Achieve)',
      example: 'e.g., specific example here',placeholder: 'What is your strategy? (e.g., content marketing, paid ads, partnerships)',
      rows: 3
    },
    {
      id: 'goal_why',
      type: 'textarea',
      label: '🎯 Why (Relevant)',
      
      tooltip: 'Information about 🎯 Why (Relevant)',
      example: 'e.g., specific example here',placeholder: 'Why is this goal important for your business?',
      rows: 3
    },
    {
      id: 'goal_deadline',
      type: 'text',
      label: '⏰ Deadline (Time-bound)',
      
      tooltip: 'Information about ⏰ Deadline (Time-bound)',
      example: 'e.g., specific example here',placeholder: 'e.g., 30 days, Q1 2024, By March 31',
      required: true
    }
  ],

  ai: null, // No AI for this task

  output: {
    enabled: false
  },

  help:   {
      "examples": [
          {
              "scenario": "Example scenario",
              "input": {
                  "example": "sample input"
              },
              "output": "Sample output from AI"
          }
      ],
      "commonMistakes": [
          "Being too vague or generic",
          "Not providing enough context",
          "Forgetting key details",
          "Not being specific about goals"
      ]
  }
}

// setupIntegrationsTask replaced with connectAccountsTask from connectAccounts.config
export const setupIntegrationsTask = connectAccountsTask

// prepareAssetsTask imported from prepareAssets.config at top of file

// setupTrackingTask replaced with trackingSheetTask from trackingSheet.config
export const setupTrackingTask = trackingSheetTask

// engageFollowersTask imported from engageFollowers.config at top of file
// giveawayTask imported from giveaway.config at top of file
// videoScriptTask imported from videoScript.config at top of file
// communityPostsTask imported from communityPosts.config at top of file
// outreachTask imported from outreach.config at top of file
// webinarTask imported from webinar.config at top of file
// feedbackCollectionTask imported from feedbackCollection.config at top of file
// changelogTask imported from changelog.config at top of file
// featurePrioritizationTask imported from featurePrioritization.config at top of file
// analyticsSetupTask imported from analyticsSetup.config at top of file
// channelAnalyzerTask imported from channelAnalyzer.config at top of file
// roiCalculatorTask imported from roiCalculator.config at top of file

// OLD EXPORTS - NO LONGER USED (using imported configs instead)
/*
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
      
      tooltip: 'Information about Prize Description',
      example: 'e.g., specific example here',placeholder: 'What are you giving away? (be specific)',
      required: true,
      rows: 2
    },
    {
      id: 'giveaway_entry_requirement',
      type: 'select',
      label: 'How to Enter?',
      
      tooltip: 'Information about How to Enter?',
      example: 'e.g., specific example here',options: [
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
      
      tooltip: 'Information about Duration',
      example: 'e.g., specific example here',placeholder: 'e.g., 7 days, 2 weeks, 30 days',
      required: true
    },
    {
      id: 'giveaway_target_growth',
      type: 'number',
      label: 'Target New Followers',
      
      tooltip: 'Information about Target New Followers',
      example: 'e.g., specific example here',placeholder: '1000',
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
  },

  help:   {
      "examples": [
          {
              "scenario": "Example scenario",
              "input": {
                  "example": "sample input"
              },
              "output": "Sample output from AI"
          }
      ],
      "commonMistakes": [
          "Being too vague or generic",
          "Not providing enough context",
          "Forgetting key details",
          "Not being specific about goals"
      ]
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
      
      tooltip: 'Information about Blog Topic / Title',
      example: 'e.g., specific example here',placeholder: 'e.g., 10 Ways to Improve Your Productivity',
      required: true
    },
    {
      id: 'blog_audience',
      type: 'text',
      label: 'Target Audience',
      
      tooltip: 'Information about Target Audience',
      example: 'e.g., specific example here',placeholder: 'e.g., Startup founders, SaaS users, developers',
      required: true
    },
    {
      id: 'blog_style',
      type: 'select',
      label: 'Writing Style',
      
      tooltip: 'Information about Writing Style',
      example: 'e.g., specific example here',options: [
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
      
      tooltip: 'Information about Word Count Target',
      example: 'e.g., specific example here',options: [
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
      
      tooltip: 'Information about SEO Keywords',
      example: 'e.g., specific example here',placeholder: 'e.g., productivity tips, time management (comma-separated)',
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
  },

  help:   {
      "examples": [
          {
              "scenario": "Example scenario",
              "input": {
                  "example": "sample input"
              },
              "output": "Sample output from AI"
          }
      ],
      "commonMistakes": [
          "Being too vague or generic",
          "Not providing enough context",
          "Forgetting key details",
          "Not being specific about goals"
      ]
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
      
      tooltip: 'Information about Video Topic',
      example: 'e.g., specific example here',placeholder: 'e.g., Product Demo, Tutorial, Customer Testimonial',
      required: true
    },
    {
      id: 'video_duration',
      type: 'select',
      label: 'Video Duration',
      
      tooltip: 'Information about Video Duration',
      example: 'e.g., specific example here',options: [
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
      
      tooltip: 'Information about Video Type',
      example: 'e.g., specific example here',options: [
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
      
      tooltip: 'Information about Tone',
      example: 'e.g., specific example here',options: [
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
      
      tooltip: 'Information about Call-to-Action',
      example: 'e.g., specific example here',placeholder: 'e.g., Subscribe, Learn more, Sign up'
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
  },

  help:   {
      "examples": [
          {
              "scenario": "Example scenario",
              "input": {
                  "example": "sample input"
              },
              "output": "Sample output from AI"
          }
      ],
      "commonMistakes": [
          "Being too vague or generic",
          "Not providing enough context",
          "Forgetting key details",
          "Not being specific about goals"
      ]
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
      
      tooltip: 'Information about Graphics Type',
      example: 'e.g., specific example here',options: [
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
      
      tooltip: 'Information about Topic / Message',
      example: 'e.g., specific example here',placeholder: 'What is the main message?',
      required: true
    },
    {
      id: 'graphics_platform',
      type: 'select',
      label: 'Platform',
      
      tooltip: 'Information about Platform',
      example: 'e.g., specific example here',options: [
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
      
      tooltip: 'Information about Visual Style',
      example: 'e.g., specific example here',options: [
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
  },

  help:   {
      "examples": [
          {
              "scenario": "Example scenario",
              "input": {
                  "example": "sample input"
              },
              "output": "Sample output from AI"
          }
      ],
      "commonMistakes": [
          "Being too vague or generic",
          "Not providing enough context",
          "Forgetting key details",
          "Not being specific about goals"
      ]
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
      
      tooltip: 'Information about Webinar Topic',
      example: 'e.g., specific example here',placeholder: 'e.g., How to Scale Your SaaS from 0 to $1M ARR',
      required: true
    },
    {
      id: 'webinar_audience',
      type: 'text',
      label: 'Target Audience',
      
      tooltip: 'Information about Target Audience',
      example: 'e.g., specific example here',placeholder: 'e.g., SaaS founders, Startup CTOs',
      required: true
    },
    {
      id: 'webinar_duration',
      type: 'select',
      label: 'Duration',
      
      tooltip: 'Information about Duration',
      example: 'e.g., specific example here',options: [
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
      
      tooltip: 'Information about Format',
      example: 'e.g., specific example here',options: [
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
  },

  help:   {
      "examples": [
          {
              "scenario": "Example scenario",
              "input": {
                  "example": "sample input"
              },
              "output": "Sample output from AI"
          }
      ],
      "commonMistakes": [
          "Being too vague or generic",
          "Not providing enough context",
          "Forgetting key details",
          "Not being specific about goals"
      ]
  }
}

*/

// TASKS THAT ARE ACTIVELY USED

// Replaced with comprehensive Feedback Collection mini-app
export const collectFeedbackTask = feedbackCollectionTask

// NEW MINI-APP TASKS

export const publishUpdatesTask = {
  id: 'feedback-2',
  name: 'Publish Product Updates',
  description: 'Plan and execute product update announcements across multiple channels with step-by-step guidance.',
  category: 'feedback',
  customComponent: 'PublishUpdatesMiniApp',
  miniAppId: 'publish-updates',
  type: 'miniapp',
  hasAI: false,

  help:   {
      "examples": [
          {
              "scenario": "Example scenario",
              "input": {
                  "example": "sample input"
              },
              "output": "Sample output from AI"
          }
      ],
      "commonMistakes": [
          "Being too vague or generic",
          "Not providing enough context",
          "Forgetting key details",
          "Not being specific about goals"
      ]
  }
}

export const iterateFeaturesTask = {
  id: 'feedback-3',
  name: 'Iterate on Features',
  description: 'Prioritize features based on impact and implementation effort using a priority matrix framework.',
  category: 'feedback',
  customComponent: 'IterateFeaturesMiniApp',
  miniAppId: 'iterate-features',
  type: 'miniapp',
  hasAI: false,

  help:   {
      "examples": [
          {
              "scenario": "Example scenario",
              "input": {
                  "example": "sample input"
              },
              "output": "Sample output from AI"
          }
      ],
      "commonMistakes": [
          "Being too vague or generic",
          "Not providing enough context",
          "Forgetting key details",
          "Not being specific about goals"
      ]
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
      
      tooltip: 'Information about Analytics Platform',
      example: 'e.g., specific example here',options: [
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
      
      tooltip: 'Information about Key Metrics to Track',
      example: 'e.g., specific example here',options: [
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
      
      tooltip: 'Information about Analytics Goals',
      example: 'e.g., specific example here',placeholder: 'What do you want to measure? (e.g., user acquisition, retention, revenue)',
      rows: 2
    }
  ],

  ai: null,

  output: {
    enabled: false
  },

  help:   {
      "examples": [
          {
              "scenario": "Example scenario",
              "input": {
                  "example": "sample input"
              },
              "output": "Sample output from AI"
          }
      ],
      "commonMistakes": [
          "Being too vague or generic",
          "Not providing enough context",
          "Forgetting key details",
          "Not being specific about goals"
      ]
  }
}

// Replaced with comprehensive multi-tab Channel Optimizer mini-app
export const optimizeChannelsTask = channelOptimizerTask

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
      
      tooltip: 'Information about Review Period',
      example: 'e.g., specific example here',options: [
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
      
      tooltip: 'Information about Revenue Generated',
      example: 'e.g., specific example here',placeholder: '50000',
      suffix: 'USD'
    },
    {
      id: 'roi_spending',
      type: 'number',
      label: 'Marketing Spend',
      
      tooltip: 'Information about Marketing Spend',
      example: 'e.g., specific example here',placeholder: '10000',
      suffix: 'USD'
    },
    {
      id: 'roi_issues',
      type: 'textarea',
      label: 'Challenges / Concerns',
      
      tooltip: 'Information about Challenges / Concerns',
      example: 'e.g., specific example here',placeholder: 'What challenges did you face?',
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
  },

  help:   {
      "examples": [
          {
              "scenario": "Example scenario",
              "input": {
                  "example": "sample input"
              },
              "output": "Sample output from AI"
          }
      ],
      "commonMistakes": [
          "Being too vague or generic",
          "Not providing enough context",
          "Forgetting key details",
          "Not being specific about goals"
      ]
  }
}

export const landingPageCreatorTask = {
  id: 'setup-2',
  name: 'Landing Page Creator',
  description: 'Build a professional landing page in 5 minutes. No coding required. Step-by-step wizard with AI-assisted copy suggestions.',
  category: 'setup',

  form: [],  // Empty - uses custom wizard interface

  ai: {
    template: `You are an expert landing page copywriter. Help improve this landing page copy:

Product: {brand_name}
Tagline: {tagline}

Current Headlines:
- Main: {hero_headline}
- Sub: {hero_subheadline}

Features: {feature_titles}

Please suggest:
1. 3 alternative main headlines (more compelling)
2. 2 alternative sub-headlines (create urgency/excitement)
3. How to improve feature descriptions (make them benefit-focused)
4. CTA optimization (what words convert best)
5. Overall landing page copy recommendations`,

    temperature: 0.8,
    maxTokens: 1200,

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
    exportFilename: 'landing-page',
    displayFormat: 'html',
    editable: false,
    deletable: false,
    exportable: true,
    copyable: true
  },

  // Custom UI flag
  customComponent: 'LandingPageCreatorAssistant',
  useWizard: true,

  help:   {
      "examples": [
          {
              "scenario": "Example scenario",
              "input": {
                  "example": "sample input"
              },
              "output": "Sample output from AI"
          }
      ],
      "commonMistakes": [
          "Being too vague or generic",
          "Not providing enough context",
          "Forgetting key details",
          "Not being specific about goals"
      ]
  }
}


// ============================================================================
// EXPORTS
// ============================================================================

// Export a map of all tasks by ID for easy lookup
export const unifiedTasksMap = {
  'setup-1': defineAudienceTask,
  'setup-2': landingPageCreatorTask,
  'setup-3': connectAccountsTask,
  'setup-4': prepareAssetsTask,
  'setup-5': trackingSheetTask,

  'social-1': generatePostsTask,
  'social-2': engageFollowersTask,
  'social-3': giveawayTask,

  'content-1': writeBlogTask,
  'content-2': videoScriptTask,
  'content-3': designGraphicsTask,

  'acq-1': communityPostsTask,
  'acq-2': outreachTask,
  'acq-3': webinarTask,

  'feedback-1': collectFeedbackTask,
  'feedback-2': publishUpdatesTask,
  'feedback-3': iterateFeaturesTask,

  'analytics-1': setupAnalyticsTask,
  'analytics-2': channelOptimizerTask,
  'analytics-3': reviewROITask,

  'advertising-1': paidAdsTask,
  'advertising-2': paidAdsOptimizeTask,

  'sales-1': funnelBlueprintTask,
  'sales-2': offerBuilderTask,
  'sales-3': objectionHandlingTask,
  'sales-4': emailSequenceTask,
  'sales-5': salesPageAuditTask,

  'growth-1': leadMagnetTask,
  'growth-2': coldOutreachTask,
  'growth-3': competitorAnalysisTask,
  'growth-4': abTestIdeasTask,
  'growth-5': positioningMapTask,

  'strategy-1': competitivePositioningBriefConfig,

  help:   {
      "examples": [
          {
              "scenario": "Example scenario",
              "input": {
                  "example": "sample input"
              },
              "output": "Sample output from AI"
          }
      ],
      "commonMistakes": [
          "Being too vague or generic",
          "Not providing enough context",
          "Forgetting key details",
          "Not being specific about goals"
      ]
  }
}

// Export all tasks as array for iteration
export const unifiedTasks = Object.values(unifiedTasksMap)
