/**
 * Landing Page Copy Mini-App Configuration
 *
 * Demonstrates PromptBuilder for high-converting landing page writing.
 * Generates compelling sections: hero, value proposition, social proof, FAQ, CTA.
 *
 * Variables automatically extracted from tiers: 1, 2, 3, 4, 5
 * (company + market + brand + goals + marketing channels)
 */

import { usePromptBuilder } from '../../../services/promptBuilder.js'

export const landingPageCopyConfig = {
  id: 'landing-page-copy',
  title: 'Generate Landing Page Copy',
  description: 'Create high-converting landing page copy that speaks to your audience and drives conversions.',

  // Freemium model fields
  tier: 'premium',
  what: 'Generate complete landing page copy sections: hero headline, subheadline, value propositions, social proof, objection handling, FAQ, and CTA. Optimized for conversion based on your audience and positioning.',
  why: 'Landing page copy determines whether visitors stay or leave. Generic copy converts at 1-2%. Audience-specific copy converts at 5-10%. That\'s a 5x-10x difference in leads.',
  how: 'Specify your page goal (demo booking, free trial signup, etc), target audience, and key differentiators. We generate compelling sections you can mix-and-match. Test variations, measure performance, iterate.',

  // Field inheritance mappings
  fieldMappings: {
    'page_goal': null,
    'audience_segment': 'targetAudience',
    'primary_benefit': 'productDescription',
    'competitor_comparison': null,
    'objection_to_address': null,
    'urgency_type': null,
    'notes': null
  },

  // Form configuration
  formTitle: 'Landing Page Settings',
  formFields: [
    {
      id: 'page_goal',
      type: 'select',
      label: 'Page Goal / Primary CTA',
      options: [
        { value: 'demo_booking', label: 'Book a Demo' },
        { value: 'free_trial', label: 'Start Free Trial' },
        { value: 'consultation', label: 'Schedule Consultation' },
        { value: 'webinar_signup', label: 'Register for Webinar' },
        { value: 'feature_signup', label: 'Sign Up for New Feature' },
        { value: 'waitlist', label: 'Join Waitlist' },
        { value: 'download', label: 'Download Resource' },
        { value: 'contact', label: 'Contact Sales' }
      ],
      required: true,
      description: 'What do you want visitors to do?'
    },
    {
      id: 'audience_segment',
      type: 'select',
      label: 'Target Audience',
      placeholder: 'Select audience persona',
      required: true,
      description: 'Who is this landing page for?',
      options: [
        { value: 'general', label: 'General Audience' }
      ]
    },
    {
      id: 'primary_benefit',
      type: 'textarea',
      label: 'Primary Benefit / Problem Solved',
      placeholder: 'e.g., Reduce sales cycle time by 30%, Eliminate manual data entry, Simplify compliance',
      required: true,
      description: 'The #1 benefit visitors care about',
      rows: 2
    },
    {
      id: 'competitor_comparison',
      type: 'select',
      label: 'Address Competitor Concerns?',
      options: [
        { value: 'yes', label: 'Yes, we\'re faster/cheaper/easier than competitors' },
        { value: 'positioning', label: 'Yes, we solve a different problem' },
        { value: 'no', label: 'No, focus on absolute benefits' }
      ],
      description: 'Should we compare ourselves to competitors?'
    },
    {
      id: 'objection_to_address',
      type: 'textarea',
      label: 'Biggest Objection to Address',
      placeholder: 'e.g., "It\'s too expensive", "We don\'t have time to implement", "We\'re not sure if it works"',
      description: 'What\'s holding {audience_description} back from converting?',
      rows: 2,
      required: true
    },
    {
      id: 'urgency_type',
      type: 'select',
      label: 'Urgency / Scarcity Message',
      options: [
        { value: 'launch_limited', label: 'Launch Special (limited time)' },
        { value: 'early_adopter', label: 'Early Adopter Pricing' },
        { value: 'deadline', label: 'Hard Deadline' },
        { value: 'limited_spots', label: 'Limited Availability' },
        { value: 'inventory', label: 'Limited Inventory' },
        { value: 'none', label: 'No Urgency (evergreen)' }
      ],
      description: 'Is there urgency or scarcity to leverage?'
    },
    {
      id: 'notes',
      type: 'textarea',
      label: 'Additional Context',
      placeholder: 'Any specific stats, testimonials, or angles to use or avoid...',
      rows: 2,
      description: 'Help us tailor the messaging'
    }
  ],

  // AI Generation configuration
  aiConfig: {
    promptTemplate: `You are a conversion copywriter specializing in high-performing landing pages. Write compelling copy sections for a landing page designed to convert {audience_description} into {page_goal}.

LANDING PAGE SPECIFICATIONS:
- Primary Goal: {page_goal}
- Target Audience: {audience_description} ({audience_segment})
- Primary Benefit: {primary_benefit}
- Biggest Objection: {objection_to_address}
- Urgency Strategy: {urgency_type}

COMPANY CONTEXT:
- Company: {company_name}
- What we do: {app_description}
- Industry: {company_industry}
- Positioning: {market_positioning}
- Key differentiation: {competitive_advantage}

AUDIENCE DEEP DIVE:
- Who: {audience_segment}
- Pain points: {audience_pain_points}
- Aspirations: {audience_aspirations}
- Job title/role: {audience_segment}

BRAND & MESSAGING:
- Voice: {brand_voice}
- Personality: {brand_personality}
- Core benefit: {brand_core_benefit}
- Key messages: {brand_key_messages}
- Language style: {brand_language_style}

COMPETITIVE CONTEXT:
- Compared to competitors: {competitor_comparison}
- Competitors: {market_competitors}
- Unique advantage: {competitive_advantage}

BUSINESS GOALS:
- Primary goal: {primary_goal}
- Success metric: {success_metric_name}
- Current conversion rate context: We serve {current_customer_count} customers

WRITE COMPELLING LANDING PAGE SECTIONS:

## 1. HERO SECTION
Headline: (1 powerful sentence that speaks to {audience_description}'s biggest pain point)
Subheadline: (1-2 sentences explaining the specific benefit)
Hero CTA: Call to action button (e.g., "Start Free Trial", "Book Demo")

## 2. VALUE PROPOSITION
- Lead with {primary_benefit}
- Explain how it directly solves {objection_to_address}
- Use language {audience_description} understands
- Include specific metrics where possible

## 3. THREE KEY BENEFITS
Write 3 distinct benefit statements that resonate with {audience_description}:
1. Benefit about {audience_pain_points}
2. Benefit about {audience_aspirations}
3. Benefit about {brand_core_benefit}

## 4. SOCIAL PROOF
- Recommended approach for {audience_segment}: {past_campaigns}
- Include social proof types: customer testimonials, stats, case studies, or logos
- Reference industry standards or trust factors

## 5. OBJECTION HANDLING
Address: {objection_to_address}
- Acknowledge the concern
- Provide data or proof (e.g., implementation time, ROI, ease of use)
- Use {brand_voice} to build confidence

## 6. COMPARISON/DIFFERENTIATION
Based on: {competitor_comparison}
- If comparing to competitors: How we're different/better
- If problem-focused: Why this problem matters
- Use non-confrontational language

## 7. FAQ SECTION
Answer 3 questions {audience_description} would ask:
Q1: Most common concern
Q2: Implementation/time question
Q3: Investment/ROI question

## 8. URGENCY MESSAGE
Strategy: {urgency_type}
- Create appropriate urgency without being manipulative
- Example: "{urgency_type}" messaging for {page_goal}

## 9. FINAL CTA SECTION
- Restate primary benefit
- Reassure about {objection_to_address}
- Strong CTA: {page_goal}
- Optional: Remove friction (no credit card, easy cancellation, etc.)

TONE & STYLE REQUIREMENTS:
- Brand voice: {brand_voice}
- Personality: {brand_personality}
- Avoid: Generic corporate speak, buzzwords, unclear jargon
- Include: Specific benefits, proof points, {audience_description}-specific language

Generate copy that converts {audience_description} by speaking directly to {primary_benefit} while addressing {objection_to_address}. Use {brand_voice} and {brand_personality} throughout.`,

    temperature: 0.7,
    maxTokens: 4000,

    // Use PromptBuilder for context extraction
    contextProvider: async () => {
      const builder = usePromptBuilder()
      return await builder.buildContentContext()
    },

    // Parse response into structured sections
    parseResponse: (response) => {
      const sections = []
      const sectionMatches = response.match(/##\\s+\\d+\\.\\s+([^\\n]+)/g) || []

      // Extract each section
      const lines = response.split('\n')
      let currentSection = null
      let currentContent = []

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]

        // Check if this is a new section header
        const headerMatch = line.match(/##\\s+\\d+\\.\\s+(.+)/)
        if (headerMatch) {
          // Save previous section
          if (currentSection) {
            sections.push({
              title: currentSection,
              content: currentContent.join('\n').trim(),
              selected: true,
              generatedAt: new Date().toISOString()
            })
          }
          currentSection = headerMatch[1]
          currentContent = []
        } else if (currentSection) {
          currentContent.push(line)
        }
      }

      // Save last section
      if (currentSection) {
        sections.push({
          title: currentSection,
          content: currentContent.join('\n').trim(),
          selected: true,
          generatedAt: new Date().toISOString()
        })
      }

      return sections.length > 0 ? sections : null
    }
  },

  // Show output/results section
  showOutput: true,
  exportFilename: 'landing-page-copy',

  // Help content for users
  help: {
    examples: [
      {
        scenario: 'Free trial signup for B2B SaaS',
        input: { page_goal: 'free_trial', audience_segment: 'CTOs', primary_benefit: 'Reduce setup time by 80%', objection_to_address: 'Implementation complexity' },
        output: 'Hero headline targeting implementation concerns, value prop about time savings, social proof from similar companies, objection handling section about ease of setup, FAQ covering technical concerns'
      },
      {
        scenario: 'Enterprise demo booking page',
        input: { page_goal: 'demo_booking', audience_segment: 'Enterprise buyers', primary_benefit: 'Enterprise-grade security + ease of use', objection_to_address: 'Feature parity with competitors' },
        output: 'Headline about security + simplicity, benefit sections targeting decision-maker concerns, detailed comparison handling, customer logos, ROI calculator CTA'
      }
    ],
    commonMistakes: [
      'Talking about yourself instead of them - "We built X" gets ignored. "You get X" converts. Write for the reader.',
      'Vague value propositions - "Powerful solution" means nothing. Be specific: "Reduce sales cycle by 30%" or "Cut costs in half."',
      'Ignoring objections - Your visitor thinks: "Is it easy?" "Will it work for us?" "Is it worth the cost?" Answer these upfront.',
      'Too much content - Every sentence must justify its existence. Delete all fluff. One clear message beats 10 mediocre ones.',
      'Weak CTA - "Submit" is weak. "Start my free trial" or "See ROI in 5 minutes" is strong. Be specific about what happens next.',
      'Generic copy for specific audience - "Business leaders" is too broad. "VPs of Sales who manage 10+ reps" is right. Get specific.',
      'No social proof - You can make claims. But third-party validation (customer testimonials, logos, data) sells 10x better.',
      'Ignoring competitive context - Your visitor compares you to competitors (even if you don\'t mention them). Address why you\'re different.'
    ]
  }
}
