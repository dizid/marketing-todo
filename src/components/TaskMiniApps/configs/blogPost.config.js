/**
 * Blog Post Writing Mini-App Configuration
 *
 * Demonstrates PromptBuilder for SEO-optimized blog content generation.
 * Creates long-form, rank-worthy blog posts with structure, examples, and CTAs.
 *
 * Variables automatically extracted from tiers: 1, 2, 3, 4, 5
 * (company + market + brand + goals + marketing channels)
 */

import { usePromptBuilder } from '../../../services/promptBuilder.js'

export const blogPostConfig = {
  id: 'blog-post',
  title: 'Write Blog Post',
  description: 'Create SEO-optimized blog posts that rank, drive traffic, and establish thought leadership.',

  // Freemium model fields
  tier: 'premium',
  what: 'Generate comprehensive blog posts (1500-3000 words) optimized for search engines and reader engagement. Posts include hook, examples, statistics, counterarguments, and clear CTAs.',
  why: 'Blog content drives 67% of leads that convert, plus it establishes authority in your space. SEO-optimized posts continue to drive traffic for months or years after publication.',
  how: 'Choose your topic, target audience, and post type. We generate a complete blog outline, then full post with headers, examples, data points, and internal CTAs. Review for accuracy, add your images, then publish.',

  // Field inheritance mappings
  fieldMappings: {
    'topic': null,
    'post_type': null,
    'primary_keyword': null,
    'target_audience': 'targetAudience',
    'post_length': null,
    'include_data': null,
    'include_examples': null,
    'cta_type': null,
    'notes': null
  },

  // Form configuration
  formTitle: 'Blog Post Settings',
  formFields: [
    {
      id: 'topic',
      type: 'text',
      label: 'Blog Topic',
      placeholder: 'e.g., How to Reduce Sales Cycle Time, The Future of Remote Work',
      required: true,
      description: 'What should this blog post be about?'
    },
    {
      id: 'post_type',
      type: 'select',
      label: 'Post Type',
      options: [
        { value: 'how_to', label: 'How-To / Tutorial' },
        { value: 'listicle', label: 'Listicle (Top X Tips)' },
        { value: 'trend_analysis', label: 'Trend Analysis' },
        { value: 'case_study', label: 'Case Study / Customer Story' },
        { value: 'ultimate_guide', label: 'Ultimate Guide' },
        { value: 'problem_solution', label: 'Problem & Solution' },
        { value: 'interview', label: 'Interview / Expert Q&A' }
      ],
      required: true,
      description: 'What format should this post follow?'
    },
    {
      id: 'primary_keyword',
      type: 'text',
      label: 'Primary Keyword / Search Intent',
      placeholder: 'e.g., best project management tools, how to improve team productivity',
      required: true,
      description: 'What search term should this post rank for? (determines SEO optimization)'
    },
    {
      id: 'target_audience',
      type: 'select',
      label: 'Target Audience',
      placeholder: 'Select audience persona',
      required: true,
      description: 'Who is this blog post written for?',
      options: [
        { value: 'general', label: 'General Audience' }
      ]
    },
    {
      id: 'post_length',
      type: 'select',
      label: 'Desired Length',
      options: [
        { value: 'short', label: 'Short (800-1200 words)' },
        { value: 'medium', label: 'Medium (1500-2000 words)' },
        { value: 'long', label: 'Long (2500-3500 words)' },
        { value: 'ultimate', label: 'Ultimate Guide (4000+ words)' }
      ],
      required: true,
      description: 'How long should this post be?'
    },
    {
      id: 'include_data',
      type: 'checkboxes',
      label: 'Include',
      options: [
        { value: 'statistics', label: 'Statistics & Research' },
        { value: 'examples', label: 'Real Examples & Case Studies' },
        { value: 'comparison', label: 'Comparison Tables' },
        { value: 'quote', label: 'Industry Expert Quotes' }
      ],
      description: 'What elements should be included in the post?'
    },
    {
      id: 'cta_type',
      type: 'select',
      label: 'Call-to-Action Type',
      options: [
        { value: 'newsletter', label: 'Newsletter Signup' },
        { value: 'demo', label: 'Request Demo' },
        { value: 'free_trial', label: 'Free Trial' },
        { value: 'consultation', label: 'Book Consultation' },
        { value: 'download', label: 'Download Resource' },
        { value: 'webinar', label: 'Register for Webinar' },
        { value: 'related_posts', label: 'Related Posts' }
      ],
      required: true,
      description: 'What should readers do at the end of the post?'
    },
    {
      id: 'notes',
      type: 'textarea',
      label: 'Additional Context',
      placeholder: 'Any specific statistics you want included, competitors to mention/avoid, unique angle, etc.',
      rows: 3,
      description: 'Help us personalize this post for your audience'
    }
  ],

  // AI Generation configuration
  aiConfig: {
    promptTemplate: `You are an expert blog writer who creates SEO-optimized, engaging posts that rank highly and convert readers.

BLOG SPECIFICATIONS:
- Topic: {topic}
- Post Type: {post_type}
- Primary Keyword: {primary_keyword}
- Desired Length: {post_length}
- Target Audience: {audience_description}
- Include: {include_data}

YOUR COMPANY & POSITIONING:
- Company: {company_name}
- Industry: {company_industry}
- What we do: {app_description}
- Market positioning: {market_positioning}
- Core benefit: {brand_core_benefit}
- Brand voice: {brand_voice}

TARGET AUDIENCE DEEP DIVE:
- Who: {audience_segment}
- Pain points: {audience_pain_points}
- Aspirations: {audience_aspirations}
- Current challenges: What keeps {audience_description} up at night?

BUSINESS CONTEXT:
- Primary goal: {primary_goal}
- Success metric: {success_metric_name}
- Key messages: {brand_key_messages}
- Keywords to include naturally: {brand_keywords_primary}

CONTENT REQUIREMENTS:
- Post type: {post_type}
- Target keyword: {primary_keyword} (use 2-4 times naturally)
- Length target: {post_length}
- CTA focus: {cta_type}
- Extra context: {notes}

WRITE A {post_type} BLOG POST THAT:

1. HOOK (Opening 50-100 words):
   - Start with surprising statistic, bold claim, or relatable problem
   - Reference {audience_description}'s specific pain point: {audience_pain_points}
   - Create curiosity about why they should read

2. STRUCTURE:
   - Clear H2 subheadings (3-6 main sections depending on length)
   - Each section 200-400 words
   - Break up with H3s, bullet points, and bold text for scannability
   - Include examples, data points, and real-world applications

3. CONTENT QUALITY:
   - Actionable and practical (not theoretical)
   - Include {include_data} to strengthen credibility
   - Use {audience_segment} terminology and context
   - Reference best practices and industry standards
   - Acknowledge counterarguments or alternative approaches

4. SEO OPTIMIZATION:
   - Primary keyword "{primary_keyword}" in H1, first 100 words, and conclusion
   - Natural keyword variations throughout
   - Meta description preview: Compelling 155-160 character hook
   - Include internal linking opportunities

5. CONCLUSION & CTA:
   - Summarize key takeaways (2-3 sentences)
   - Include specific CTA for {cta_type}
   - Mention our company {company_name} naturally (not forced)
   - Optional: Invite engagement (comments, questions, feedback)

BRAND VOICE REQUIREMENTS:
- Tone: {brand_voice}
- Personality: {brand_personality}
- Language style: {brand_language_style}
- Authority level: Thought leader, not salesperson

Generate the complete blog post ready to publish. Use proper markdown formatting with # H1, ## H2, ### H3 headers.`,

    temperature: 0.7,
    maxTokens: 5000,

    // Use PromptBuilder for context extraction
    contextProvider: async () => {
      const builder = usePromptBuilder()
      return await builder.buildContentContext()
    },

    // Parse response - blog posts are returned as formatted markdown
    parseResponse: (response) => {
      // Extract metadata if included
      const titleMatch = response.match(/^#\\s+(.+?)\\n/m)
      const title = titleMatch ? titleMatch[1].trim() : 'Blog Post'

      return {
        type: 'blog_post',
        title: title,
        content: response,
        format: 'markdown',
        wordCount: response.split(/\\s+/).length,
        generatedAt: new Date().toISOString()
      }
    }
  },

  // Show output/results section
  showOutput: true,
  exportFilename: 'blog-post',

  // Help content for users
  help: {
    examples: [
      {
        scenario: 'Product launch blog post for new feature',
        input: { topic: 'How to Reduce Onboarding Time', post_type: 'how_to', primary_keyword: 'reduce onboarding time', post_length: 'long' },
        output: 'Ultimate guide with step-by-step instructions, real examples, statistics on time savings, comparison with manual approaches, CTA to try the feature'
      },
      {
        scenario: 'Thought leadership article for target audience',
        input: { topic: 'The Future of Remote Collaboration', post_type: 'trend_analysis', primary_keyword: 'remote work trends 2025', post_length: 'medium' },
        output: 'Trend analysis with industry expert quotes, statistics, predictions, and positioning your company as the solution'
      }
    ],
    commonMistakes: [
      'Too promotional - People read blogs for education, not sales pitches. Lead with value, mention product naturally.',
      'Ignoring SEO - Use your target keyword in title, first 100 words, and conclusion. But don\'t over-stuff (looks spammy).',
      'Poor structure - Break content with headers and bullets. Dense paragraphs = high bounce rate. Scan-able > readable.',
      'No data - Statistics and research make posts credible and rank better. Include at least 3-5 data points.',
      'Unclear audience - Write for a specific person, not everyone. "CTOs in SaaS" vs "software developers" changes everything.',
      'Weak CTA - Don\'t just say "subscribe." Be specific: "Get 10 templates for XYZ" or "Book a 15-min strategy call."',
      'No examples - Theory without examples = boring and unconvincing. Include real-world scenarios and case studies.',
      'Ignoring search intent - "How to" posts need steps and instructions. "Best X" posts need comparisons. Match user intent.'
    ]
  }
}
