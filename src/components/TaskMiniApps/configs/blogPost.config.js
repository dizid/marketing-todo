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
  title: 'Blog Post Generator',
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
      description: 'What should this blog post be about? Be specific. "Sales processes" is too vague. "How to reduce sales cycle from 90 to 30 days" is perfect.',
      minLength: 10,
      maxLength: 150
    },
    {
      id: 'post_type',
      type: 'select',
      label: 'Post Type',
      options: [
        { value: 'how_to', label: 'How-To / Tutorial (Step-by-step instructions - best for ranking)' },
        { value: 'listicle', label: 'Listicle (Top X Tips - highly shareable)' },
        { value: 'trend_analysis', label: 'Trend Analysis (Industry insights - positions you as expert)' },
        { value: 'case_study', label: 'Case Study / Customer Story (Social proof - drives sales)' },
        { value: 'ultimate_guide', label: 'Ultimate Guide (Comprehensive - ranks for broad terms)' },
        { value: 'problem_solution', label: 'Problem & Solution (Addresses objections - great for objection pages)' },
        { value: 'interview', label: 'Interview / Expert Q&A (Thought leadership - gets expert promotion)' }
      ],
      required: true,
      description: 'What format should this post follow? Choose based on your goal: rank for keywords (How-To), get shares (Listicle), show authority (Trend), drive sales (Case Study).'
    },
    {
      id: 'primary_keyword',
      type: 'text',
      label: 'Primary Keyword / Search Intent',
      placeholder: 'e.g., best project management tools, how to improve team productivity',
      required: true,
      description: 'What search term should this post rank for? Use tools like Google Keyword Planner or SEMrush. Choose keywords with 1K-10K monthly searches and low-moderate competition for fastest ranking.',
      minLength: 5,
      maxLength: 100
    },
    {
      id: 'target_audience',
      type: 'select',
      label: 'Target Audience',
      placeholder: 'Select audience persona',
      required: true,
      description: 'Who is this blog post written for? Specific audiences get better-targeted content. Writing for "Marketing CTOs" is more effective than "Everyone in tech."',
      options: [
        { value: 'general', label: 'General Audience' },
        { value: 'business_leaders', label: 'Business Leaders / Executives' },
        { value: 'technical_practitioners', label: 'Technical Practitioners / Engineers' },
        { value: 'marketing_professionals', label: 'Marketing Professionals' },
        { value: 'sales_teams', label: 'Sales Teams' },
        { value: 'startups', label: 'Startup Founders / Early Stage' },
        { value: 'enterprise', label: 'Enterprise / Large Organizations' },
        { value: 'custom', label: 'Custom Audience (specify in Additional Context)' }
      ]
    },
    {
      id: 'post_length',
      type: 'select',
      label: 'Desired Length',
      options: [
        { value: 'short', label: 'Short (800-1200 words) - News/tips, ~3 min read' },
        { value: 'medium', label: 'Medium (1500-2000 words) - Balanced, ~5 min read' },
        { value: 'long', label: 'Long (2500-3500 words) - Deep dive, ~8 min read' },
        { value: 'ultimate', label: 'Ultimate Guide (4000+ words) - Comprehensive, ~12 min read' }
      ],
      required: true,
      description: 'How long should this post be? Longer posts rank better for broad keywords. Shorter posts get more shares. Ultimate guides dominate search results.'
    },
    {
      id: 'include_data',
      type: 'checkboxes',
      label: 'Include',
      options: [
        { value: 'statistics', label: 'Statistics & Research (Increases credibility & SEO)' },
        { value: 'examples', label: 'Real Examples & Case Studies (Improves engagement & trust)' },
        { value: 'comparison', label: 'Comparison Tables (Helps decision-making)' },
        { value: 'quote', label: 'Industry Expert Quotes (Builds authority)' }
      ],
      description: 'What elements should be included? More elements = higher credibility. Check at least 2 for best results.'
    },
    {
      id: 'cta_type',
      type: 'select',
      label: 'Call-to-Action Type',
      options: [
        { value: 'newsletter', label: 'Newsletter Signup (Best for lead generation)' },
        { value: 'demo', label: 'Request Demo (Best for high-intent prospects)' },
        { value: 'free_trial', label: 'Free Trial (Best for product adoption)' },
        { value: 'consultation', label: 'Book Consultation (Best for high-ticket services)' },
        { value: 'download', label: 'Download Resource (Best for nurture campaigns)' },
        { value: 'webinar', label: 'Register for Webinar (Best for education & authority)' },
        { value: 'related_posts', label: 'Related Posts (Best for engagement & time-on-site)' }
      ],
      required: true,
      description: 'What should readers do next? Choose based on your goal: leads (newsletter), sales (demo), engagement (related posts).'
    },
    {
      id: 'notes',
      type: 'textarea',
      label: 'Additional Context (Optional)',
      placeholder: 'e.g., specific stats to include, competitors to mention/avoid, unique angle, success story to feature, target geography, tone adjustments',
      rows: 3,
      maxLength: 500,
      description: 'Help us personalize this post. Include specific data points, competitor mentions, unique angles, or storytelling elements you want featured.'
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

6. OBJECTION PRE-HANDLING:
   Anticipate and address these common reader objections:
   - "I don't have time to read this" → Provide key takeaway summary upfront
   - "I don't have time to implement" → Include quick-win shortcuts and 15-min version
   - "Will this actually work for me?" → Use examples from {audience_description} context
   - "How do I know if my {primary_keyword} content will rank?" → Explain keyword difficulty assessment
   - "What if my competitors say the same thing?" → Emphasize unique angle or data points
   - "How do I measure if this is working?" → Include success metrics and KPIs

7. CONTENT VARIATIONS:
   After the main post, provide:
   - Alternative angle 1: Contrarian perspective or debate
   - Alternative angle 2: Data-driven approach vs storytelling approach
   - Short-form version: 150-word executive summary for social media
   - Long-form expansion: 2-3 advanced topics for a follow-up post

8. INTERNAL LINKING STRATEGY:
   - Identify 3-5 internal pages to link to naturally
   - Suggest anchor text that's descriptive and keyword-rich
   - Show where in the post each link fits naturally

9. SOCIAL MEDIA EXCERPTS:
   Provide 5 quote-worthy excerpts (50-100 words each) that work as:
   - LinkedIn posts
   - Twitter/X threads (3-5 tweets)
   - Instagram carousel captions

10. IMPLEMENTATION CHECKLIST (Before Publishing):
    - Pre-publication: [ ] Keyword density checked (2-4% {primary_keyword}), [ ] H2/H3 headers added, [ ] Internal links added, [ ] Formatting verified, [ ] Grammar/spell check complete
    - At publication: [ ] Analytics setup, [ ] Social media scheduling, [ ] Email notification to list, [ ] CMS optimization (meta description, featured image)
    - Post-publication: [ ] Monitor CTR for 48 hours, [ ] Respond to comments, [ ] Update internal links from similar posts, [ ] Plan follow-up content or video version

11. CONVERSION BENCHMARKS:
    Include these expected metrics:
    - Reading time: {post_length} typically 4-7 minutes read
    - Click-through rate goal: 2-5% (depending on placement)
    - Engagement: Aim for 1 comment per 100 views
    - Social shares: Industry average {post_type} gets 10-50 shares
    - Time-on-page: 2+ minutes for quality engagement
    - Scroll depth: 60%+ of visitors should scroll to CTA

12. A/B TESTING RECOMMENDATIONS:
    Test these variations in next posts:
    - Headline variations (5 alternatives to test)
    - CTA placement (mid-post vs end-of-post)
    - Format variations (listicle vs narrative for this topic)
    - Quote formatting (blockquote vs bold text)
    - CTA copy strength (soft ask vs urgent deadline)

Generate the complete blog post ready to publish. Use proper markdown formatting with # H1, ## H2, ### H3 headers. After the main post, include sections 6-12 as supplementary material for the author.`,

    temperature: 0.7,
    maxTokens: 6000,

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
  output: {
    enabled: true,
    exportFilename: 'blog-post-complete',
    displayFormat: 'markdown',
    editable: true,
    deletable: true,
    exportable: true,
    copyable: true,
    formats: ['markdown', 'plain-text', 'html']
  },

  // Help content for users
  help: {
    examples: [
      {
        scenario: 'Product launch blog post for new feature',
        input: { topic: 'How to Reduce Onboarding Time', post_type: 'how_to', primary_keyword: 'reduce onboarding time', post_length: 'long' },
        output: 'Ultimate guide with step-by-step instructions, real examples, statistics on time savings, comparison with manual approaches, CTA to try the feature. Includes objection-handling (time constraints), implementation checklist, internal linking suggestions, and A/B testing framework.'
      },
      {
        scenario: 'Thought leadership article for target audience',
        input: { topic: 'The Future of Remote Collaboration', post_type: 'trend_analysis', primary_keyword: 'remote work trends 2025', post_length: 'medium' },
        output: 'Trend analysis with industry expert quotes, statistics, predictions, and positioning your company as the solution. Includes alternative angles (contrarian vs data-driven), social media excerpts for LinkedIn/Twitter, conversion benchmarks (2-5% CTR target), and 5 headline variations for testing.'
      },
      {
        scenario: 'Niche B2B case study post (edge case)',
        input: { topic: 'How Enterprise SaaS Companies Scale Sales Teams from 5 to 50', post_type: 'case_study', primary_keyword: 'enterprise sales team scaling', post_length: 'ultimate' },
        output: 'Detailed case study with before/after metrics, team structure diagrams, compensation breakdown, hiring timeline. Includes advanced topics for follow-up posts, competitor comparison alternatives, 30-day implementation roadmap, and success metrics specific to enterprise hiring (cost per hire, ramp time, quota attainment).'
      }
    ],
    commonMistakes: [
      'Too promotional - People read blogs for education, not sales pitches. Lead with value, mention product naturally. Spend 80% teaching, 20% on your solution.',
      'Ignoring SEO - Use your target keyword in title, first 100 words, and conclusion. But don\'t over-stuff (looks spammy). Aim for 2-4% keyword density.',
      'Poor structure - Break content with headers and bullets. Dense paragraphs = high bounce rate. Scannable > readable. Use whitespace generously.',
      'No data - Statistics and research make posts credible and rank better. Include at least 3-5 data points. Cite your sources for credibility.',
      'Unclear audience - Write for a specific person, not everyone. "CTOs in SaaS" vs "software developers" creates completely different posts.',
      'Weak CTA - Don\'t just say "subscribe." Be specific: "Get 10 templates for XYZ" or "Book a 15-min strategy call." Urgency helps.',
      'No examples - Theory without examples = boring and unconvincing. Include 2-3 real-world scenarios and case studies from your audience.',
      'Ignoring search intent - "How to" posts need steps and instructions. "Best X" posts need comparisons. Match user intent to content type.',
      'Slow to rank - Expect 3-6 months to rank for competitive keywords. Link internally, promote on social, build backlinks. One post isn\'t enough.',
      'Neglecting updates - Google favors fresh content. Update old posts with new data, examples, and links. This is how you maintain rankings.'
    ],
    proTips: [
      'Psychological hooks: Use curiosity (question in headline), urgency (limited data/offer), or status (exclusive insights) to increase CTR.',
      'Data storytelling: Don\'t just list statistics. Explain what they mean: "45% of teams fail X" → why they fail → how to avoid it.',
      'Internal linking gold: Link to pages that solve the next logical problem. If post is "How to hire developers," link to "Building onboarding for engineers."',
      'Social proof placement: Mention case studies and customer quotes mid-post, not just at end. Builds credibility as readers scroll.',
      'Skimmability: 30% of readers only skim. Use bold text for key takeaways, bullet points for lists, H3 headers for key ideas.',
      'Format variety: Mix paragraph text, bullets, numbered lists, blockquotes, and tables. Varied formatting keeps readers engaged.',
      'Link authority: Link to 3-5 high-authority sources (industry leaders, government data, research firms). Boosts your SEO credibility.',
      'Call-to-action timing: Best CTA placement is when reader has learned enough to care but before they leave. Usually 70-80% through post.'
    ]
  }
}
