#!/usr/bin/env node

/**
 * Script to add help schema to all task configs
 *
 * This script:
 * 1. Reads /src/configs/unifiedTasks.js
 * 2. Adds 'tooltip' + 'example' to each form field (where missing)
 * 3. Adds 'help' object with 'examples' and 'commonMistakes' arrays
 * 4. Writes the updated file back
 */

const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'src/configs/unifiedTasks.js');

// Read the file
let content = fs.readFileSync(configPath, 'utf-8');

// Generic help content that applies to most tasks
const getHelpForTask = (taskId, taskName) => {
  const helpContent = {
    'define-audience': {
      examples: [
        {
          scenario: 'B2B SaaS targeting CTOs',
          input: { audience_overview: 'CTOs at Series A fintech startups', industry: 'FinTech', company_size: 'startup' },
          output: 'Persona: Alex, 28, CTO at early-stage fintech company focused on building scalable infrastructure'
        },
        {
          scenario: 'E-commerce targeting online sellers',
          input: { audience_overview: 'Sellers on Amazon and Shopify struggling with inventory', industry: 'E-commerce', company_size: 'small' },
          output: 'Persona: Sarah, 35, Small business owner needing automation tools for inventory management'
        }
      ],
      commonMistakes: [
        'Being too vague - "everyone" is never the answer. Be specific with job titles and company sizes.',
        'Forgetting to mention pain points - companies care about what problems you solve, not just who the user is.',
        'Not considering budget - understanding their budget helps you position your price correctly.',
        'Ignoring industry context - same problem in different industries often requires different solutions.',
        'Describing activities instead of problems - focus on what keeps them up at night, not what they do daily.'
      ]
    },

    'generate-posts': {
      examples: [
        {
          scenario: 'LinkedIn thought leadership',
          input: { post_type: 'LinkedIn', topic: 'AI automation', tone: 'professional' },
          output: '5 LinkedIn posts about AI automation benefits for business leaders'
        },
        {
          scenario: 'Twitter thread about a product feature',
          input: { post_type: 'Twitter', topic: 'New feature launch', tone: 'casual' },
          output: 'A 7-tweet thread explaining the feature and why users should care'
        }
      ],
      commonMistakes: [
        'Writing too long for the platform - Twitter has character limits, LinkedIn works better with shorter paragraphs.',
        'Using too much jargon - make it understandable to your target audience, not just experts.',
        'Forgetting the CTA (call to action) - what do you want readers to do? Comment? Share? Visit link?',
        'All promotion, no value - lead with value/insight first, then mention your product.',
        'Same tone everywhere - LinkedIn and Twitter have different audiences and tones. Adapt accordingly.'
      ]
    },

    'define-goals': {
      examples: [
        {
          scenario: 'SaaS company growth goals',
          input: { current_situation: '500 MRR with 10 customers', target_metric: 'MRR', target_value: '5000', timeframe: '6 months' },
          output: 'SMART goals: Increase MRR to $5,000 in 6 months (10x growth); key milestones at months 2,4,6'
        },
        {
          scenario: 'Ecommerce revenue target',
          input: { current_situation: '$10k/month in revenue', target_metric: 'revenue', target_value: '50000', timeframe: '12 months' },
          output: 'Revenue goal: $50k/month within 12 months; requires 5x increase in average order value or customer base'
        }
      ],
      commonMistakes: [
        'Goals that are too vague - "grow revenue" doesn\'t tell you what success looks like.',
        'Unrealistic timelines - 100x growth in 30 days is not a plan, it\'s fantasy.',
        'Ignoring dependencies - some goals depend on other goals being achieved first.',
        'Not tracking progress - define metrics you\'ll measure weekly, not just the final goal.',
        'No contingency planning - what\'s your backup if you miss the first milestone?'
      ]
    },

    'setup-integrations': {
      examples: [
        {
          scenario: 'Connect CRM and email marketing',
          input: { platforms: 'Salesforce, Mailchimp', use_case: 'sync customer data' },
          output: 'Setup: API connections, field mapping, automated sync every 6 hours'
        }
      ],
      commonMistakes: [
        'Connecting too many tools at once - test one integration fully before adding more.',
        'Not cleaning data before sync - garbage in = garbage out.',
        'Ignoring API rate limits - understand how often your integration can run.',
        'No error handling - what happens when an API call fails?',
        'Storing sensitive data unsecurely - API keys should never be in version control.'
      ]
    },

    'setup-tracking': {
      examples: [
        {
          scenario: 'Track user behavior in SaaS app',
          input: { platform: 'Google Analytics', events: 'signup, feature_use, upgrade' },
          output: 'Setup GA4, define 10 key events, create dashboards for conversion funnel'
        }
      ],
      commonMistakes: [
        'Tracking everything - pick your 5-10 most important metrics.',
        'Not setting up funnels - events are useless if you don\'t track how they relate.',
        'Ignoring data quality - remove bot traffic and ensure accurate event names.',
        'No baseline - measure before making changes so you can see the impact.',
        'Forgetting mobile users - make sure your tracking works on mobile and web.'
      ]
    },

    'generate-giveaway': {
      examples: [
        {
          scenario: 'Product launch giveaway',
          input: { prize: 'lifetime subscription worth $5000', audience: 'product enthusiasts' },
          output: 'Giveaway framework: entry mechanics, marketing angles, tracking mechanism'
        }
      ],
      commonMistakes: [
        'Prize not aligned with audience - giving away fishing gear to gamers won\'t work.',
        'Too easy to enter - make people work a little (share, refer, visit site).',
        'No follow-up after giveaway - use the contact list to sell them.',
        'Prize too small - a $10 discount won\'t drive engagement.',
        'Not promoting the giveaway - nobody enters if they don\'t know about it.'
      ]
    },

    'generate-blog': {
      examples: [
        {
          scenario: 'Technical guide for developers',
          input: { topic: 'API authentication best practices', audience: 'backend engineers' },
          output: '2500-word technical blog post with code examples, common mistakes, and recommended approaches'
        }
      ],
      commonMistakes: [
        'Writing for yourself, not your audience - use their language and reference their problems.',
        'Burying the lead - put the useful info first, not at the bottom.',
        'Not optimizing for search - research keywords before writing.',
        'Forgetting a CTA - end with what you want readers to do next.',
        'Writing once and never updating - refresh old posts with new data and insights.'
      ]
    },

    'generate-video': {
      examples: [
        {
          scenario: 'Product demo video',
          input: { product: 'Email automation tool', length: '5 min', audience: 'busy marketers' },
          output: '5-minute video script showing key features with minimal jargon, strong hooks, and call-to-action'
        }
      ],
      commonMistakes: [
        'Videos that are too long - aim for 3-5 minutes unless it\'s a tutorial.',
        'Bad audio quality - invest in a decent microphone.',
        'No captions - half your viewers watch without sound.',
        'Boring intro - hook viewers in the first 3 seconds.',
        'No clear CTA - what should people do after watching?'
      ]
    },

    'generate-graphics': {
      examples: [
        {
          scenario: 'Social media graphics for product',
          input: { platform: 'Instagram', style: 'minimalist', color_scheme: 'brand colors' },
          output: 'Set of 20 Instagram-ready graphics with consistent branding, captions, and calls-to-action'
        }
      ],
      commonMistakes: [
        'Text too small - if it\'s not readable on mobile, don\'t use it.',
        'Too much information - one idea per graphic.',
        'Inconsistent branding - use the same fonts and colors.',
        'Not optimized for platform - Instagram graphics ≠ LinkedIn graphics.',
        'No call-to-action - graphics should direct people to do something.'
      ]
    },

    'generate-webinar': {
      examples: [
        {
          scenario: 'Product education webinar',
          input: { topic: 'Advanced features', duration: '45 min', audience: 'existing customers' },
          output: 'Webinar agenda, slides, speaker notes, Q&A strategy, follow-up email sequence'
        }
      ],
      commonMistakes: [
        'No clear agenda - people won\'t register if they don\'t know what to expect.',
        'Slides are the presentation - slides should support your speaking, not replace it.',
        'No time for questions - leave 15-20 min for Q&A.',
        'Poor time management - always practice your timing.',
        'No follow-up - most conversions happen post-webinar, not during.'
      ]
    },

    'collect-feedback': {
      examples: [
        {
          scenario: 'Post-purchase feedback survey',
          input: { type: 'satisfaction', questions: '5-7', incentive: '10% discount' },
          output: 'Short survey (2-3 min) with clear questions and incentive for completion'
        }
      ],
      commonMistakes: [
        'Survey too long - people won\'t complete surveys longer than 5 minutes.',
        'Biased questions - don\'t ask "how great was our product?" ask "what can we improve?"',
        'Wrong timing - ask feedback right after the experience, not a month later.',
        'No incentive - people need a reason to give you their time.',
        'Not acting on feedback - if you collect it, show that you\'re using it.'
      ]
    },

    'publish-updates': {
      examples: [
        {
          scenario: 'Product release announcement',
          input: { new_features: '3 major, 5 minor', audience: 'existing users' },
          output: 'Release notes, email announcement, social media content, help docs'
        }
      ],
      commonMistakes: [
        'Not explaining the benefit - "we added a button" is boring; "save 10 hours/week" is compelling.',
        'Hiding the big changes - lead with what matters most to users.',
        'No documentation - if you don\'t explain how to use it, users won\'t.',
        'Same announcement everywhere - customize for each platform.',
        'No feedback channel - let users ask questions about the changes.'
      ]
    },

    'iterate-features': {
      examples: [
        {
          scenario: 'Improving user onboarding',
          input: { current_step_count: '8 steps', current_completion: '40%', goal: '60% completion' },
          output: 'Testing plan: reduce to 5 steps, add tooltips, track completion metrics weekly'
        }
      ],
      commonMistakes: [
        'Changing too much at once - test one thing at a time.',
        'Not measuring impact - define success before making changes.',
        'Ignoring user research - don\'t guess, ask users why they\'re dropping off.',
        'Never going back to old versions - if new doesn\'t work better, revert.',
        'Not iterating based on data - let analytics guide your decisions, not opinions.'
      ]
    },

    'setup-analytics': {
      examples: [
        {
          scenario: 'E-commerce analytics dashboard',
          input: { platform: 'Google Analytics 4', metrics: 'revenue, AOV, conversion rate' },
          output: 'Dashboard with real-time revenue tracking, segment analysis, and weekly automated reports'
        }
      ],
      commonMistakes: [
        'Tracking vanity metrics - visitors don\'t matter; conversions do.',
        'Not setting up goals - define what "success" means before analyzing data.',
        'Ignoring segments - knowing overall performance is less useful than knowing by segment.',
        'One-time reports - set up automated reports so you see trends.',
        'Not taking action - analytics is useless if you don\'t change behavior based on insights.'
      ]
    },

    'optimize-channels': {
      examples: [
        {
          scenario: 'Improving email marketing ROI',
          input: { current_open_rate: '15%', current_click_rate: '2%', goal: 'increase both by 50%' },
          output: 'Testing plan: A/B test subject lines, segment lists, test send times, improve copy'
        }
      ],
      commonMistakes: [
        'Testing everything at once - change one variable per test.',
        'Sample sizes too small - ensure statistical significance.',
        'Not knowing your baseline - measure before optimizing.',
        'Optimizing for the wrong metric - don\'t optimize for open rates if conversion is your goal.',
        'Ignoring unsubscribe rates - aggressive optimization can harm your list.'
      ]
    },

    'review-roi': {
      examples: [
        {
          scenario: 'Evaluating marketing spend',
          input: { spent_on_ads: '5000', revenue_generated: '50000', manual_outreach_spent: '2000' },
          output: 'ROI analysis: ads = 10x ROI, manual = 25x ROI; recommendation: increase manual outreach budget'
        }
      ],
      commonMistakes: [
        'Not attributing revenue correctly - which touchpoint actually caused the conversion?',
        'Ignoring lifetime value - some $100 customers are worth more than $1000 one-time customers.',
        'Short measurement windows - give campaigns time to show results.',
        'Not accounting for seasonal trends - Q4 doesn\'t equal your average month.',
        'Measuring revenue instead of profit - high revenue with low margins isn\'t success.'
      ]
    },

    'landing-page-creator': {
      examples: [
        {
          scenario: 'SaaS product landing page',
          input: { product: 'Analytics tool', primary_benefit: 'save time', target_conversion: 'free trial signup' },
          output: 'Landing page with headline, hero image, benefits, social proof, pricing, and multi-CTA strategy'
        }
      ],
      commonMistakes: [
        'Unclear value proposition - visitors should understand your value in 3 seconds.',
        'Too many CTAs - one primary CTA, rest are secondary.',
        'Missing social proof - testimonials, case studies, logos of customers.',
        'Page is slow - optimize images, minimize code, use a fast host.',
        'Not mobile optimized - test on phones, not just desktop.'
      ]
    }
  };

  // Provide generic help if task-specific help not found
  return helpContent[taskId] || {
    examples: [
      {
        scenario: 'Example scenario',
        input: { example: 'sample input' },
        output: 'Sample output from AI'
      }
    ],
    commonMistakes: [
      'Being too vague or generic',
      'Not providing enough context',
      'Forgetting key details',
      'Not being specific about goals'
    ]
  };
};

// Get tooltip + example for form fields (generic approach)
const getFieldHelp = (fieldId, fieldLabel) => {
  const tooltips = {
    'audience_overview': 'Be specific: who are they (job title, company size)? What problem do they have?',
    'industry': 'The primary industry or vertical (e.g., SaaS, Healthcare, E-commerce)',
    'company_size': 'Typical company size of your target audience',
    'job_titles': 'Comma-separated list of people who would use your product',
    'pain_points': 'What specific problems does your audience face? What keeps them up at night?',
    'budget_range': 'How much are they willing to spend on a solution like yours?',
    'target_users_30d': 'How many customers do you want to acquire in the next 30 days?',
    'market_size': 'TAM (Total), SAM (Serviceable), SOM (Obtainable) market estimates',
    'notes': 'Any other relevant context about your audience or market'
  };

  return {
    tooltip: tooltips[fieldId] || `Information about ${fieldLabel}`,
    example: 'e.g., specific example here'
  };
};

// Count how many tasks we processed
let taskCount = 0;
let fieldCount = 0;

// Process the content - add tooltip + example to each form field if missing
// This is a simplified approach that targets the `form:` arrays
content = content.replace(
  /(\{\s*id:\s*'([^']+)',\s*type:\s*'([^']+)',?\s*label:\s*'([^']+)',?\s*(?!tooltip)(?!example))/g,
  (match, p1, fieldId, fieldType, fieldLabel) => {
    if (!match.includes('tooltip') && !match.includes('example')) {
      fieldCount++;
      const help = getFieldHelp(fieldId, fieldLabel);
      return `${match}\n      tooltip: '${help.tooltip}',\n      example: '${help.example}',`;
    }
    return match;
  }
);

// Now add the help object after `ai:` section for each task
// Pattern to find where `ai:` ends and where we should insert `help:`
const taskPattern = /export const (\w+) = \{([\s\S]*?)\n\}/g;

content = content.replace(taskPattern, (fullMatch, taskExportName, taskContent) => {
  // Skip if already has help object
  if (taskContent.includes('help:')) {
    return fullMatch;
  }

  // Extract task ID from the content
  const taskIdMatch = taskContent.match(/id:\s*'([^']+)'/);
  const taskId = taskIdMatch ? taskIdMatch[1] : taskExportName;

  // Extract task name for context
  const taskNameMatch = taskContent.match(/name:\s*'([^']+)'/);
  const taskName = taskNameMatch ? taskNameMatch[1] : taskId;

  // Get help content for this specific task
  const help = getHelpForTask(taskId, taskName);

  taskCount++;

  // Format help object
  const helpJson = JSON.stringify(help, null, 4)
    .split('\n')
    .map(line => line ? '  ' + line : line)
    .join('\n');

  // Insert help object before the closing brace
  return fullMatch.replace(/\n\}$/, `,\n\n  help: ${helpJson}\n}`);
});

// Write back to file
fs.writeFileSync(configPath, content, 'utf-8');

console.log(`✓ Help schema added to task configs`);
console.log(`  - Processed: ${taskCount} tasks`);
console.log(`  - Added tooltips/examples to: ${fieldCount} form fields`);
console.log(`  - Updated file: ${configPath}`);
