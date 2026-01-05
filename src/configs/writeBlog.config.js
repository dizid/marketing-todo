/**
 * Write Blog Post Configuration
 *
 * Configuration for the guided blog writing mini-app.
 * AI generates outline and structure, user writes the content.
 */

export const writeBlogTask = {
  id: 'content-1',
  name: 'Blog Post Outline & Structure Guide',
  description: 'Create a compelling blog post with AI-guided structure and research',
  category: 'content',

  // Freemium model fields
  tier: 'free',
  what: 'Write compelling blog posts with AI-guided outlines and SEO optimization tips. AI generates structure and section guidance, you add the authentic voice and examples.',
  why: 'Blog content drives organic traffic and establishes you as a thought leader. One viral blog post can drive hundreds of qualified users to your product.',
  how: 'Enter your topic and target audience, then get an AI-generated outline with section-by-section guidance. Write each section following the prompts, then optimize for SEO.',

  form: [
    {
      id: 'blog_topic',
      type: 'text',
      label: 'Blog Topic / Title',
      placeholder: 'e.g., How to Build a SaaS Product from Scratch',
      description: 'The main topic or headline for your blog post',
      required: true
    },
    {
      id: 'target_audience',
      type: 'text',
      label: 'Target Audience',
      placeholder: 'e.g., Startup founders, SaaS entrepreneurs',
      description: 'Who are you writing for? This helps AI tailor the outline.',
      required: true
    },
    {
      id: 'keywords',
      type: 'text',
      label: 'Keywords (comma-separated)',
      placeholder: 'e.g., SaaS development, product launch, startup',
      description: 'SEO keywords to naturally incorporate',
      required: false
    },
    {
      id: 'tone',
      type: 'select',
      label: 'Writing Tone',
      options: [
        { value: 'professional', label: 'Professional / Corporate' },
        { value: 'conversational', label: 'Conversational / Friendly' },
        { value: 'educational', label: 'Educational / How-to' },
        { value: 'narrative', label: 'Narrative / Storytelling' },
        { value: 'thought-leadership', label: 'Thought Leadership / Opinion' }
      ],
      description: 'The tone and style of the blog post'
    },
    {
      id: 'word_count_target',
      type: 'select',
      label: 'Target Word Count',
      options: [
        { value: 'short', label: 'Short (500-800 words)' },
        { value: 'medium', label: 'Medium (1000-1500 words)' },
        { value: 'long', label: 'Long (2000-3000 words)' },
        { value: 'comprehensive', label: 'Comprehensive (3000+ words)' }
      ],
      description: 'How long should the blog post be?'
    }
  ],

  customComponent: 'WriteBlogPostMiniApp',

  outline: {
    structure: [
      {
        id: 'introduction',
        title: 'Introduction / Hook',
        wordCountTarget: 150,
        guidance: 'Start with a compelling hook. Answer: What problem does this solve? Why should readers care?'
      },
      {
        id: 'main_point_1',
        title: 'First Main Point',
        wordCountTarget: 400,
        guidance: 'Introduce your first key idea. Support it with examples, data, or personal experience.'
      },
      {
        id: 'main_point_2',
        title: 'Second Main Point',
        wordCountTarget: 400,
        guidance: 'Build on your first point. Keep the reader engaged with practical examples.'
      },
      {
        id: 'main_point_3',
        title: 'Third Main Point',
        wordCountTarget: 400,
        guidance: 'Your final key idea. Make it count and reinforce your main argument.'
      },
      {
        id: 'case_study_example',
        title: 'Real-World Example or Case Study',
        wordCountTarget: 300,
        guidance: 'Share a concrete example, story, or case study that illustrates your points.'
      },
      {
        id: 'conclusion',
        title: 'Conclusion & Call-to-Action',
        wordCountTarget: 150,
        guidance: 'Summarize key takeaways. End with a clear call-to-action. What should readers do next?'
      }
    ]
  },

  tips: {
    seo: [
      'Place your primary keyword in the first 100 words',
      'Use H2 and H3 headers to break up content (helps with SEO and readability)',
      'Aim for 1-2% keyword density (use naturally, not forced)',
      'Write meta description (160 characters max)',
      'Use internal links to other relevant content'
    ],
    writing: [
      'Write short paragraphs (2-3 sentences max)',
      'Use bullet points to highlight key ideas',
      'Include examples and data to support claims',
      'Use the "inverted pyramid" - most important info first',
      'Read it aloud to catch awkward phrasing'
    ],
    engagement: [
      'Open with a question or surprising fact',
      'Use storytelling to connect emotionally',
      'Address reader pain points directly',
      'Include actionable takeaways readers can use immediately',
      'End with a clear next step for readers'
    ],
    structure: [
      'Introduction: Hook + Preview of main points (1-2 sentences)',
      'Body: 3-5 main sections, each with a clear point',
      'Examples: Include 2-3 real-world examples or case studies',
      'Conclusion: Summarize main takeaways + CTA',
      'Proofread: Check grammar, flow, and clarity'
    ]
  },

  output: {
    enabled: true,
    exportFilename: 'blog-post-outline',
    displayFormat: 'markdown',
    editable: true,
    copyable: true,
    exportable: true
  },

  help: {
    examples: [
      {
        scenario: 'Educational "How-to" blog post',
        input: { blog_topic: 'How to Build a SaaS Product from Scratch', target_audience: 'Startup founders', keywords: 'SaaS development, MVP, product launch', tone: 'educational' },
        output: 'AI generates outline: Introduction (why this matters), 5 main sections (idea validation, MVP building, pricing strategy, launch prep, growth tactics), real examples from Stripe/Notion, conclusion with CTA to read your case study.'
      },
      {
        scenario: 'Thought leadership opinion piece',
        input: { blog_topic: 'The Future of AI in Marketing', target_audience: 'Marketing professionals', keywords: 'AI, automation, personalization', tone: 'thought-leadership' },
        output: 'AI generates structure: Hook with trend data, 3 contrarian insights, real examples of companies doing it right, anticipated challenges, conclusion with your unique perspective. Result: 2000+ word authority piece.'
      }
    ],
    commonMistakes: [
      'No clear headline - "Thoughts on marketing" won\'t get clicks. Use specific, benefit-driven headlines: "How Company X Grew 10x with These 5 Tactics"',
      'Writing without research - pull random ideas from your head. Write with data, quotes, examples. Makes you credible, SEO-friendly.',
      'Ignoring structure - giant wall of text loses readers. Use headers, short paragraphs (2-3 sentences), bullet points to break it up.',
      'Not optimizing for search - you write for humans, but search engines help humans find it. Put primary keyword in first 100 words, use H2/H3 headers naturally.',
      'Weak introduction - lose readers in the first 2 sentences. Hook them with a question, surprising stat, or problem they care about.',
      'No call-to-action - blog ends and nothing happens next. Tell readers what to do: sign up, read another post, download resource, schedule call.'
    ]
  }
}
