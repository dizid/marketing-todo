/**
 * Define Your Business Configuration
 *
 * 7-step onboarding wizard that captures all business context data
 * Maps to the 7-tier businessContext data model
 */

export const defineBusinessConfig = {
  id: 'define-business',
  name: 'Define Your Business',
  description: 'Create your business profile - the foundation for all AI-generated content',
  category: 'Setup',
  tier: 'Free',
  estimatedTime: '20-30 minutes',
  icon: '🏢',

  // Help & guidance
  help: {
    description: 'This wizard captures your complete business context. You\'ll only need to do this once - the information will be reused to improve all AI-generated content.',
    benefits: [
      'Better AI-generated content tailored to your business',
      'No need to re-enter business info for every task',
      'Personalized recommendations based on your goals',
      'Track improvement of AI quality over time'
    ]
  },

  // 7-step form structure
  steps: [
    {
      id: 'step1-company',
      stepNumber: 1,
      title: 'Company Basics',
      subtitle: 'Tell us about your company',
      tierName: 'tier1_business',
      tierSection: 'company',
      estimatedMinutes: 3,
      fields: [
        {
          id: 'company.name',
          label: 'Company Name',
          type: 'text',
          placeholder: 'e.g., Acme Inc',
          required: true,
          tooltip: 'Your official company name',
          help: 'This is used throughout your content to maintain consistency'
        },
        {
          id: 'company.description',
          label: 'Company Description',
          type: 'textarea',
          placeholder: 'What does your company do? What industry are you in?',
          required: true,
          rows: 4,
          tooltip: 'A clear explanation of your company',
          help: 'Write 2-3 sentences explaining your business, industry, and what makes you unique',
          example: 'TechFlow is a SaaS company specializing in workflow automation for marketing teams. We help agencies save time on repetitive tasks.'
        },
        {
          id: 'company.industry',
          label: 'Industry',
          type: 'select',
          placeholder: 'Select your industry',
          required: true,
          options: [
            { value: 'saas', label: 'SaaS / Software' },
            { value: 'ecommerce', label: 'E-commerce' },
            { value: 'agency', label: 'Digital Agency' },
            { value: 'consulting', label: 'Consulting' },
            { value: 'education', label: 'Education' },
            { value: 'healthcare', label: 'Healthcare' },
            { value: 'finance', label: 'Finance' },
            { value: 'real-estate', label: 'Real Estate' },
            { value: 'nonprofit', label: 'Non-profit' },
            { value: 'other', label: 'Other' }
          ],
          tooltip: 'What industry are you in?',
          help: 'This helps tailor content recommendations to your market'
        },
        {
          id: 'company.website',
          label: 'Website URL',
          type: 'text',
          placeholder: 'https://example.com',
          required: false,
          tooltip: 'Your company website',
          help: 'Optional - helps us understand your current positioning'
        },
        {
          id: 'company.tagline',
          label: 'Company Tagline',
          type: 'text',
          placeholder: 'e.g., "Workflow Automation Made Simple"',
          required: false,
          tooltip: 'Your 1-line company elevator pitch',
          help: 'A memorable 1-line description of what you do',
          example: 'Work Less, Achieve More'
        },
        {
          id: 'company.yearFounded',
          label: 'Year Founded',
          type: 'number',
          placeholder: '2020',
          required: false,
          min: 1900,
          max: new Date().getFullYear(),
          tooltip: 'When was your company founded?',
          help: 'Helps establish company maturity and credibility'
        },
        {
          id: 'company.size',
          label: 'Company Size',
          type: 'select',
          placeholder: 'Select company size',
          required: false,
          options: [
            { value: '1-10', label: 'Solopreneur / 1-10 people' },
            { value: '11-50', label: '11-50 people' },
            { value: '51-200', label: '51-200 people' },
            { value: '200+', label: '200+ people' }
          ],
          tooltip: 'How many people work at your company?',
          help: 'Helps tailor recommendations to your team size and resources'
        }
      ]
    },

    {
      id: 'step2-product',
      stepNumber: 2,
      title: 'Product / Service Details',
      subtitle: 'Describe what you offer',
      tierName: 'tier1_business',
      tierSection: 'product',
      estimatedMinutes: 4,
      fields: [
        {
          id: 'product.name',
          label: 'Main Product / Service Name',
          type: 'text',
          placeholder: 'e.g., MarketFlow Pro',
          required: true,
          tooltip: 'What is your primary product/service?',
          help: 'The name of your main offering'
        },
        {
          id: 'product.description',
          label: 'Product Description',
          type: 'textarea',
          placeholder: 'What does it do? Who is it for? What problems does it solve?',
          required: true,
          rows: 4,
          tooltip: 'Detailed description of your product',
          help: 'Explain what your product/service does and why customers need it',
          example: 'MarketFlow Pro is a marketing automation platform that helps small agencies manage campaigns across 10+ channels from a single dashboard.'
        },
        {
          id: 'product.category',
          label: 'Product Category',
          type: 'text',
          placeholder: 'e.g., Marketing Automation',
          required: true,
          tooltip: 'What category is your product in?',
          help: 'E.g., "Project Management", "Email Marketing", "Analytics", etc'
        },
        {
          id: 'product.uniqueValue',
          label: 'Unique Value Proposition',
          type: 'textarea',
          placeholder: 'What makes your product different from competitors?',
          required: true,
          rows: 3,
          tooltip: 'What makes you unique?',
          help: 'Why should customers choose you over alternatives? Focus on the key differentiator.',
          example: 'Unlike other tools, MarketFlow Pro offers unlimited integrations at our lowest price tier, making enterprise features accessible to small teams.'
        },
        {
          id: 'product.pricePoint',
          label: 'Price Position',
          type: 'select',
          placeholder: 'Select price point',
          required: false,
          options: [
            { value: 'budget', label: 'Budget / Low Cost' },
            { value: 'mid', label: 'Mid-Market / Standard' },
            { value: 'premium', label: 'Premium' },
            { value: 'luxury', label: 'Luxury / High-End' }
          ],
          tooltip: 'Where do you position on price?',
          help: 'Helps tailor messaging to customers with matching budgets'
        },
        {
          id: 'product.stage',
          label: 'Product Stage',
          type: 'select',
          placeholder: 'Select product stage',
          required: false,
          options: [
            { value: 'pre-launch', label: 'Pre-Launch / Beta' },
            { value: 'launch', label: 'Just Launched' },
            { value: 'growth', label: 'Growth Phase' },
            { value: 'mature', label: 'Mature / Established' }
          ],
          tooltip: 'What stage is your product at?',
          help: 'Helps identify which messaging resonates best'
        }
      ]
    },

    {
      id: 'step3-positioning',
      stepNumber: 3,
      title: 'Market Positioning',
      subtitle: 'How you fit in the market',
      tierName: 'tier2_market',
      tierSection: 'positioning',
      estimatedMinutes: 5,
      fields: [
        {
          id: 'positioning.primaryCompetitors',
          label: 'Main Competitors',
          type: 'text',
          placeholder: 'e.g., Competitor 1, Competitor 2, Competitor 3',
          required: false,
          tooltip: 'Who are your main competitors?',
          help: 'List your 2-4 main competitors (comma-separated). This helps contextualize your positioning.',
          example: 'Hubspot, Active Campaign, Marketo'
        },
        {
          id: 'positioning.competitiveAdvantage',
          label: 'Competitive Advantage',
          type: 'textarea',
          placeholder: 'What do you do better than competitors?',
          required: true,
          rows: 3,
          tooltip: 'Your competitive edge',
          help: 'What specific advantages do you have over competitors? Be specific and measurable.',
          example: '50% faster implementation than competitors, 2x more customizable, 24/7 dedicated support included'
        },
        {
          id: 'positioning.mainDifferentiator',
          label: 'Main Differentiator',
          type: 'text',
          placeholder: 'Your #1 differentiator',
          required: true,
          tooltip: 'Your single biggest differentiator',
          help: 'If you could only tell prospects ONE thing that makes you different, what would it be?',
          example: 'The only tool with unlimited integrations at our price point'
        },
        {
          id: 'positioning.marketGap',
          label: 'Market Gap You Fill',
          type: 'textarea',
          placeholder: 'What market need do you address that competitors miss?',
          required: false,
          rows: 3,
          tooltip: 'What gap in the market do you fill?',
          help: 'What customer problem were you created to solve? What was missing?',
          example: 'Small agencies needed enterprise features without enterprise pricing. We made that possible.'
        }
      ]
    },

    {
      id: 'step4-audience',
      stepNumber: 4,
      title: 'Target Audience',
      subtitle: 'Who are your ideal customers?',
      tierName: 'tier2_market',
      tierSection: 'audiences',
      estimatedMinutes: 6,
      fields: [
        {
          id: 'audiences.primary.label',
          label: 'Primary Audience Type',
          type: 'text',
          placeholder: 'e.g., Marketing Managers at SMBs',
          required: true,
          tooltip: 'Who is your primary audience?',
          help: 'One clear description of your ideal customer'
        },
        {
          id: 'audiences.primary.description',
          label: 'Audience Description',
          type: 'textarea',
          placeholder: 'Tell us about your primary audience',
          required: true,
          rows: 3,
          tooltip: 'Describe your audience',
          help: 'Who are they? What do they do? What challenges do they face?',
          example: 'Marketing managers at 50-500 person companies who are responsible for managing multiple marketing channels but lack the budget for enterprise tools'
        },
        {
          id: 'audiences.primary.demographics.jobTitle',
          label: 'Typical Job Title',
          type: 'text',
          placeholder: 'e.g., Marketing Manager, Sales Director',
          required: false,
          tooltip: 'What job title do they have?',
          help: 'The typical role of your ideal customer'
        },
        {
          id: 'audiences.primary.demographics.ageRange',
          label: 'Typical Age Range',
          type: 'text',
          placeholder: 'e.g., 28-45',
          required: false,
          tooltip: 'Age range of your audience',
          help: 'If relevant to your positioning'
        },
        {
          id: 'audiences.primary.painPoints',
          label: 'Top 3 Pain Points',
          type: 'text',
          placeholder: 'e.g., Too many disconnected tools, No time for manual tasks, Can\'t track ROI',
          required: true,
          tooltip: 'What problems do they have?',
          help: 'List 3 problems your audience struggles with (comma-separated). These become messaging themes.',
          example: 'Managing 10+ marketing tools, Manual data entry between platforms, No unified view of campaign performance'
        },
        {
          id: 'audiences.primary.aspirations',
          label: 'What Do They Want to Achieve?',
          type: 'text',
          placeholder: 'e.g., Automate 50% of tasks, Prove marketing ROI',
          required: false,
          tooltip: 'What are their goals?',
          help: 'What outcomes would make them happy? (comma-separated)',
          example: 'Save 10 hours/week, Get executive buy-in with data, Scale without hiring'
        }
      ]
    },

    {
      id: 'step5-brand',
      stepNumber: 5,
      title: 'Brand Voice & Messaging',
      subtitle: 'How you communicate',
      tierName: 'tier3_brand',
      tierSection: 'voice',
      estimatedMinutes: 5,
      fields: [
        {
          id: 'voice.personality',
          label: 'Brand Personality',
          type: 'text',
          placeholder: 'e.g., Professional yet approachable, Bold and innovative',
          required: true,
          tooltip: 'Describe your brand personality',
          help: 'How would you describe your brand voice in 2-3 words?',
          example: 'Professional, friendly, straightforward'
        },
        {
          id: 'voice.tone',
          label: 'Tone (Select all that apply)',
          type: 'text',
          placeholder: 'e.g., Professional, Conversational, Technical',
          required: false,
          tooltip: 'What tone do you use?',
          help: 'Select the primary tones you use in communication',
          example: 'Professional, Educational, Approachable'
        },
        {
          id: 'voice.language',
          label: 'Language Style',
          type: 'select',
          placeholder: 'Select language style',
          required: false,
          options: [
            { value: 'technical', label: 'Technical / Industry jargon' },
            { value: 'conversational', label: 'Conversational / Casual' },
            { value: 'storytelling', label: 'Storytelling / Narrative' },
            { value: 'educational', label: 'Educational / How-to' },
            { value: 'direct', label: 'Direct / No-nonsense' }
          ],
          tooltip: 'How do you communicate?',
          help: 'How technical vs casual is your typical communication?'
        },
        {
          id: 'messaging.coreBenefit',
          label: 'Core Benefit (The main why)',
          type: 'text',
          placeholder: 'Why should customers care?',
          required: true,
          tooltip: 'The core benefit of your product',
          help: 'One sentence: What is the #1 benefit your product delivers?',
          example: 'Save your team 10+ hours per week on manual marketing tasks'
        },
        {
          id: 'messaging.emotionalDriver',
          label: 'Emotional Driver',
          type: 'textarea',
          placeholder: 'What emotion should your message evoke?',
          required: false,
          rows: 2,
          tooltip: 'What feeling should your messaging inspire?',
          help: 'Do you want customers to feel: confident, relieved, excited, empowered, etc?',
          example: 'Empowered - they feel in control of their marketing instead of overwhelmed by tools'
        },
        {
          id: 'messaging.keyMessages',
          label: 'Top 3 Key Messages',
          type: 'textarea',
          placeholder: 'What 3 things do you want customers to remember about you?',
          required: false,
          rows: 3,
          tooltip: 'Your key messaging themes',
          help: 'What 3 core messages do you want every piece of marketing to reinforce?',
          example: '1. One platform for all channels\n2. Built for teams (not consultants)\n3. Affordable enterprise features'
        }
      ]
    },

    {
      id: 'step6-goals',
      stepNumber: 6,
      title: 'Goals & Metrics',
      subtitle: 'Your business objectives',
      tierName: 'tier4_goals',
      tierSection: 'strategy',
      estimatedMinutes: 4,
      fields: [
        {
          id: 'strategy.primaryGoal',
          label: 'Primary Business Goal',
          type: 'text',
          placeholder: 'e.g., Increase monthly recurring revenue by 50%',
          required: true,
          tooltip: 'Your main business goal',
          help: 'What is your #1 goal for the next 6-12 months?',
          example: 'Acquire 100 new customers by Q4'
        },
        {
          id: 'strategy.goalTimeframe',
          label: 'Timeframe',
          type: 'select',
          placeholder: 'Select timeframe',
          required: false,
          options: [
            { value: 'Q1', label: 'Next Quarter (Q1)' },
            { value: '6months', label: 'Next 6 Months' },
            { value: '1year', label: 'Next 12 Months' },
            { value: 'ongoing', label: 'Ongoing / Always' }
          ],
          tooltip: 'When do you want to achieve this?',
          help: 'What\'s your timeline for this goal?'
        },
        {
          id: 'strategy.targetMetric',
          label: 'Success Metric',
          type: 'text',
          placeholder: 'e.g., Monthly Recurring Revenue (MRR)',
          required: true,
          tooltip: 'How will you measure success?',
          help: 'What single metric will you track to know if you\'ve achieved the goal?',
          example: 'Number of new customers acquired'
        },
        {
          id: 'strategy.targetValue',
          label: 'Target Value',
          type: 'text',
          placeholder: 'e.g., $50,000, 100 customers',
          required: false,
          tooltip: 'What\'s your target number?',
          help: 'What number are you trying to reach?',
          example: '100 customers'
        }
      ]
    },

    {
      id: 'step7-marketing',
      stepNumber: 7,
      title: 'Marketing Channels',
      subtitle: 'Where you reach customers',
      tierName: 'tier5_marketing',
      tierSection: 'channels',
      estimatedMinutes: 5,
      fields: [
        {
          id: 'channels.email.status',
          label: 'Email Marketing',
          type: 'select',
          placeholder: 'Do you have an email list?',
          required: false,
          options: [
            { value: 'active', label: 'Active (sending regularly)' },
            { value: 'inactive', label: 'Inactive (not using)' },
            { value: 'planning', label: 'Planning to start' }
          ],
          tooltip: 'Email marketing status',
          help: 'Do you use email marketing?'
        },
        {
          id: 'channels.email.subscribers',
          label: 'Email Subscribers',
          type: 'number',
          placeholder: '0',
          required: false,
          min: 0,
          tooltip: 'How many email subscribers do you have?',
          help: 'Approximate number of people on your email list'
        },
        {
          id: 'channels.website.monthlyVisitors',
          label: 'Monthly Website Visitors',
          type: 'number',
          placeholder: '0',
          required: false,
          min: 0,
          tooltip: 'Monthly website traffic',
          help: 'Approximate number of visitors per month'
        },
        {
          id: 'failedApproaches',
          label: 'What Hasn\'t Worked?',
          type: 'textarea',
          placeholder: 'What marketing approaches have you tried that didn\'t work?',
          required: false,
          rows: 3,
          tooltip: 'Marketing approaches to avoid',
          help: 'Learning from what didn\'t work helps us give better recommendations',
          example: 'Cold calling didn\'t work for us. Heavy discounting attracted wrong customers.'
        },
        {
          id: 'successfulCampaigns',
          label: 'Most Successful Campaign/Tactic',
          type: 'textarea',
          placeholder: 'What marketing has worked best for you?',
          required: false,
          rows: 3,
          tooltip: 'Your most successful marketing',
          help: 'What single tactic or campaign has brought you the best customers?',
          example: 'LinkedIn content about workflow automation generated 40% of new leads. Customers came pre-educated and closed faster.'
        }
      ]
    }
  ],

  // Form output configuration
  output: {
    enabled: true,
    display: 'modal',
    title: 'Business Profile Created!',
    message: 'Your business context is now set up. All future AI-generated content will be customized to your business.'
  }
}
