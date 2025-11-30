/**
 * Define Target Audience Mini-App Configuration
 *
 * This config defines the form fields, AI generation prompt,
 * and output structure for the Define Audience task
 */

export const defineAudienceConfig = {
  id: 'define-audience',
  title: 'Define Target Audience',
  description: 'Create detailed buyer personas and define your target market with AI assistance.',

  // Freemium model fields
  tier: 'free',
  what: 'Create detailed buyer personas that guide all your marketing decisions. AI analyzes your audience, identifies pain points, and recommends the best channels to reach them.',
  why: 'Understanding your audience is the foundation for all successful marketing. Without clear personas, you waste time and money on irrelevant channels and miss growth opportunities.',
  how: 'Answer 5 key questions about your target audience, then use AI to generate detailed personas. Refine them based on your product knowledge and market research.',

  // Field inheritance mappings (mini-app field ID -> canonical ProjectContext field)
  fieldMappings: {
    'audience_overview': 'targetAudience',
    'industry': null,
    'company_size': null,
    'job_titles': null,
    'pain_points': null,
    'budget_range': null,
    'target_users_30d': null,
    'market_size': null,
    'notes': null
  },

  // Form configuration
  formTitle: 'Audience Information',
  formFields: [
    {
      id: 'audience_overview',
      type: 'textarea',
      label: 'Target Audience Overview',
      placeholder: 'Describe your target audience in 2-3 sentences. Who are they? What are their pain points?',
      description: 'A brief overview of who you\'re targeting and why',
      rows: 3
    },
    {
      id: 'industry',
      type: 'text',
      label: 'Industry',
      placeholder: 'e.g., SaaS, E-commerce, Healthcare',
      description: 'The primary industry your audience works in'
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
      suffix: 'users to acquire'
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

  // AI Generation configuration
  aiConfig: {
    promptTemplate: `Based on the following audience information, generate a detailed buyer persona and market analysis:

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

    // Optional: Get app description context
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
    },

    // Optional: Parse response into structured format
    parseResponse: (response) => {
      // For now, just return the response as-is
      // Could be extended to parse into structured sections
      return response
    }
  },

  // Show output/results section
  showOutput: true,
  exportFilename: 'audience-personas',

  // Help content for users
  help: {
    examples: [
      {
        scenario: 'B2B SaaS targeting developers',
        input: { audience_overview: 'Technical developers at startups', industry: 'SaaS', company_size: 'startup', job_titles: 'CTO, Lead Developer' },
        output: 'Detailed personas for CTOs and lead developers at 1-20 person startups who value developer experience and integration capabilities'
      },
      {
        scenario: 'E-commerce targeting marketing managers',
        input: { audience_overview: 'Marketing managers at growth-stage e-commerce', industry: 'E-commerce', company_size: 'small' },
        output: 'Personas for marketing managers at 20-100 person e-commerce companies focused on customer acquisition and retention ROI'
      }
    ],
    commonMistakes: [
      'Being too vague - "everyone" or "businesses" isn\'t an audience. Get specific about company size, role, and industry',
      'Guessing about pain points - interview actual customers. What they tell you will surprise you',
      'Ignoring budget - audiences with no budget aren\'t viable. Know their spending power and decision-making process',
      'Forgetting about multiple personas - most products serve 2-4 different buyer personas. Identify all of them',
      'Missing the decision-maker - you might reach someone, but are they the one who decides to buy?',
      'Changing your persona weekly - lock it in for 30 days, validate with real customer conversations, then iterate'
    ]
  }
}
