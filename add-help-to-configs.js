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

    'outreach-campaign': {
      examples: [
        {
          scenario: 'SaaS product targeting developers',
          input: { target_audience: 'Python developers', message_angle: 'time-saving' },
          output: 'Personalized emails highlighting how the tool saves developers 5 hours/week'
        },
        {
          scenario: 'Service business targeting executives',
          input: { target_audience: 'CFOs at 100+ person companies', message_angle: 'cost reduction' },
          output: 'Executive outreach emphasizing ROI and cost savings'
        }
      ],
      commonMistakes: [
        'Generic outreach - "Hi there" doesn\'t work. Personalize by referencing something specific about them.',
        'Leading with your product - they don\'t care yet. Lead with a relevant problem or insight.',
        'Walls of text - keep it to 3-4 sentences max. Make them want to respond.',
        'Wrong person - sending to the wrong person? Research your contact list first.',
        'No follow-up - one email rarely converts. Plan for 3-5 follow-ups over 2-3 weeks.'
      ]
    },

    'webinar-plan': {
      examples: [
        {
          scenario: 'Product launch webinar',
          input: { topic: 'Introducing AI features', audience: 'existing customers' },
          output: 'Full webinar outline with intro, demo, Q&A, and next steps'
        }
      ],
      commonMistakes: [
        'Too much content - 60 min webinar should have 30 min content max, rest is Q&A and discussion.',
        'Not testing tech - always test audio, video, screen share 30 min before.',
        'Boring slides - slides should support your speech, not be the main attraction.',
        'Selling too hard - give value first. Closing CTA comes at the end.',
        'No follow-up - have a strategy for what happens after: email nurture sequence, special offer, etc.'
      ]
    },

    'feedback-collection': {
      examples: [
        {
          scenario: 'Post-purchase feedback',
          input: { feedback_type: 'customer satisfaction', channel: 'email' },
          output: 'Email template for asking customers about their experience'
        }
      ],
      commonMistakes: [
        'Questions too vague - "What did you think?" won\'t give you useful feedback. Ask specific questions.',
        'Too many questions - limit to 3-5 max. Respect people\'s time.',
        'No incentive - giving a small reward (discount, entry into raffle) increases response rate.',
        'Wrong timing - ask at the right moment (right after purchase, after they use it for a week).',
        'Not following up - if you get feedback, acknowledge it and show you\'re implementing it.'
      ]
    },

    'landing-page': {
      examples: [
        {
          scenario: 'SaaS landing page',
          input: { product_type: 'SaaS', primary_benefit: 'time-saving' },
          output: 'Landing page outline with headline, benefits, social proof, pricing, and CTA'
        }
      ],
      commonMistakes: [
        'Unclear headline - "Best software ever" doesn\'t work. State the specific benefit.',
        'Too many options - stick to one primary CTA button. Multiple CTAs confuse visitors.',
        'No social proof - testimonials, case studies, and logos build credibility.',
        'Wall of text - use scannable sections, bullet points, and short paragraphs.',
        'Slow page - optimize images and minimize scripts. Visitors leave after 3 seconds if it\'s slow.'
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
