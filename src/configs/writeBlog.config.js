/**
 * Write Blog Post Configuration
 *
 * Configuration for the guided blog writing mini-app.
 * AI generates outline and structure, user writes the content.
 */

export const writeBlogTask = {
  id: 'content-1',
  name: 'Write Blog Post',
  description: 'Create a compelling blog post with AI-guided structure and research',
  category: 'content',

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
    enabled: false
  }
}
