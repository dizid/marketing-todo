/**
 * Email Sales Sequence Mini-App Configuration
 *
 * Demonstrates PromptBuilder for intelligent email sequence generation.
 * Generates multi-touch email sequences with strategic timing and progression.
 *
 * Variables automatically extracted from tiers: 1, 2, 3, 4, 5
 * (company + market + brand + goals + marketing channels)
 */

import { usePromptBuilder } from '../../../services/promptBuilder.js'

export const emailSequenceConfig = {
  id: 'email-sequence',
  title: 'Email Sales Sequence',
  description: 'Generate strategic multi-touch email sequences designed to nurture leads and drive conversions.',

  // Freemium model fields
  tier: 'premium',
  what: 'Generate complete email sequences with strategic timing, progression, and follow-ups. Create sequences that build rapport, establish credibility, and drive specific conversions.',
  why: 'Email sequences are proven to convert better than single emails. Multi-touch campaigns with strategic progression increase response rates by 3-5x and shorten sales cycles.',
  how: 'Specify your target audience, campaign goal, and sequence length. We generate personalized email templates with strategic progression: hook, value, credibility, urgency, then CTA. Review and customize each email, then export to your email platform.',

  // Field inheritance mappings
  fieldMappings: {
    'sequence_goal': 'productDescription',
    'audience_segment': 'targetAudience',
    'sequence_length': null,
    'email_tone': null,
    'company_positioning': null,
    'key_differentiators': null,
    'objection_handling': null,
    'notes': null
  },

  // Form configuration
  formTitle: 'Email Sequence Settings',
  formFields: [
    {
      id: 'sequence_goal',
      type: 'select',
      label: 'Campaign Goal',
      options: [
        { value: 'product_launch', label: 'Product Launch' },
        { value: 'feature_adoption', label: 'Feature Adoption' },
        { value: 'trial_signup', label: 'Free Trial Signup' },
        { value: 'webinar_attendance', label: 'Webinar Attendance' },
        { value: 'demo_booking', label: 'Demo Booking' },
        { value: 'upgrade_existing', label: 'Upgrade Existing Customers' }
      ],
      required: true,
      description: 'What is the primary goal of this email sequence?'
    },
    {
      id: 'audience_segment',
      type: 'select',
      label: 'Target Audience Segment',
      placeholder: 'Select audience persona',
      required: true,
      description: 'Which audience segment should this sequence target?',
      options: [
        { value: 'general', label: 'General Audience' }
      ]
    },
    {
      id: 'sequence_length',
      type: 'select',
      label: 'Sequence Length',
      options: [
        { value: '3', label: '3 emails (Fast-track)' },
        { value: '5', label: '5 emails (Standard)' },
        { value: '7', label: '7 emails (Extended nurture)' },
        { value: '10', label: '10 emails (Long-term nurture)' }
      ],
      required: true,
      description: 'How many emails in the sequence?'
    },
    {
      id: 'email_tone',
      type: 'select',
      label: 'Email Tone',
      options: [
        { value: 'professional', label: 'Professional & Formal' },
        { value: 'consultative', label: 'Consultative & Trusted Advisor' },
        { value: 'friendly', label: 'Friendly & Approachable' },
        { value: 'urgent', label: 'Urgent & Time-Sensitive' }
      ],
      required: true,
      description: 'The tone and personality of the emails'
    },
    {
      id: 'company_positioning',
      type: 'textarea',
      label: 'How We Differentiate',
      placeholder: 'e.g., We focus on enterprise security, or We prioritize ease of use over feature complexity',
      description: 'What is our competitive positioning or differentiation?',
      rows: 2,
      required: true
    },
    {
      id: 'key_differentiators',
      type: 'textarea',
      label: 'Key Benefits & Differentiators',
      placeholder: 'e.g., 40% faster onboarding, 99.99% uptime, enterprise-grade security, 24/7 support',
      description: 'Top 3-5 benefits unique to our offering',
      rows: 2,
      required: true
    },
    {
      id: 'objection_handling',
      type: 'textarea',
      label: 'Common Objections & Responses',
      placeholder: 'e.g., "Too expensive" - Response: We pay for ourselves in 3 months through time savings',
      description: 'Common objections from this audience and how we address them',
      rows: 3
    },
    {
      id: 'notes',
      type: 'textarea',
      label: 'Additional Context',
      placeholder: 'Any special requirements, urgency, or context for this sequence...',
      rows: 2
    }
  ],

  // AI Generation configuration
  aiConfig: {
    promptTemplate: `You are an expert email copywriter specializing in B2B sales sequences. Generate a {sequence_length}-email sequence designed to achieve: {sequence_goal}.

COMPANY CONTEXT:
- Name: {company_name}
- What we do: {app_description}
- Industry: {company_industry}
- Positioning: {market_positioning}
- How we differentiate: {company_positioning}
- Key benefits: {key_differentiators}

TARGET AUDIENCE:
- Segment: {audience_segment}
- Description: {audience_description}
- Pain points: {audience_pain_points}
- Aspirations: {audience_aspirations}

EMAIL SEQUENCE STRATEGY:
- Goal: {sequence_goal}
- Tone: {email_tone}
- Current metrics: {current_customer_count} customers, {current_monthly_revenue} ARR
- Primary channel: {primary_marketing_channel}
- Objections to address: {objection_handling}

BRAND VOICE & MESSAGING:
- Personality: {brand_personality}
- Voice: {brand_voice}
- Core benefit: {brand_core_benefit}
- Key messages: {brand_key_messages}

STRATEGIC PROGRESSION:
Email 1: HOOK - Grab attention with compelling insight about their pain point
Email 2: VALUE - Provide immediate, actionable value (no pitch)
Email 3: CREDIBILITY - Share social proof, case studies, or expertise
${'{sequence_length}' >= '5' ? 'Email 4: DIFFERENTIATION - Explain how we solve their problem differently\\nEmail 5: URGENCY - Create appropriate urgency without being pushy' : ''}
${'{sequence_length}' >= '7' ? 'Email 6: OBJECTION - Proactively address the biggest objection\\nEmail 7: FINAL_PITCH - Clear CTA with value recap' : ''}
${'{sequence_length}' >= '10' ? 'Email 8: SOCIAL_PROOF - Customer success story\\nEmail 9: SPECIAL_OFFER - Limited-time value add\\nEmail 10: LAST_CHANCE - Final opportunity with clear CTA' : ''}

CRITICAL GUIDELINES FOR ALL EMAILS:
- Subject lines must be compelling but never clickbait (avoid all-caps, excessive punctuation)
- Each email should feel personal and relevant to {audience_description}
- Balance education with subtle progression toward CTA
- Use short paragraphs (2-3 sentences max per paragraph)
- Include one clear CTA per email (but vary the ask across sequence)
- Respect {audience_description}'s time - emails should take <2 min to read
- Signature: Professional, includes company info

Generate exactly {sequence_length} unique emails for this sequence.

Format your response EXACTLY like this:

[EMAIL 1: HOOK]
Subject: [compelling subject line]
Body:
[email body here - 150-250 words]

[EMAIL 2: VALUE]
Subject: [compelling subject line]
Body:
[email body here]

Important: Use [EMAIL N: PURPOSE] headers, clear Subject: lines, and Body: labels.
Each email should be distinct in purpose and progression.`,

    temperature: 0.7,
    maxTokens: 4000,

    // Use PromptBuilder for context extraction
    contextProvider: async () => {
      const builder = usePromptBuilder()
      return await builder.buildContentContext()
    },

    // Parse response into structured emails
    parseResponse: (response) => {
      const emails = []

      // Split by email blocks
      const emailBlocks = response.split('[EMAIL')

      for (let i = 1; i < emailBlocks.length; i++) {
        const block = emailBlocks[i]
        const headerMatch = block.match(/^\\s*\\d+:\\s*([^\\]]+)\\]/)
        if (!headerMatch) continue

        const emailType = headerMatch[1].trim()
        const subjectMatch = block.match(/Subject:\\s*(.+?)\\n/i)
        const bodyMatch = block.match(/Body:\\s*([\\s\\S]+?)(?=\\n\\[|$)/i)

        if (subjectMatch && bodyMatch) {
          emails.push({
            type: emailType,
            subject: subjectMatch[1].trim(),
            body: bodyMatch[1].trim(),
            selected: true,
            generatedAt: new Date().toISOString()
          })
        }
      }

      return emails.length > 0 ? emails : null
    }
  },

  // Show output/results section
  showOutput: true,
  exportFilename: 'email-sequence',

  // Help content for users
  help: {
    examples: [
      {
        scenario: 'SaaS product launch to existing customers',
        input: { sequence_goal: 'product_launch', sequence_length: '5', email_tone: 'friendly' },
        output: '5 emails: Hook (new feature for their pain point), Value (immediate benefit), Social proof (early adopter stories), Differentiation (why this matters), CTA (upgrade link)'
      },
      {
        scenario: 'B2B demo booking for enterprise prospects',
        input: { sequence_goal: 'demo_booking', sequence_length: '7', email_tone: 'professional' },
        output: '7 emails: Industry insight hook, relevant challenge, case study, ROI explanation, objection handling, social proof, final CTA'
      }
    ],
    commonMistakes: [
      'Pitching too early - People need to see value before the CTA. Start with insights, not asks.',
      'Same email repeated - Each email should have a distinct purpose. Don\'t just resend if they didn\'t open.',
      'Ignoring objections - Address the biggest objection head-on in email 4-6. This increases response rates significantly.',
      'Too long - 3-5 short paragraphs per email. Busy executives won\'t read beyond that.',
      'No personality - Match your brand voice. Generic corporate emails get ignored. Inject personality while staying professional.',
      'Missing context - Reference their specific challenge or aspiration. Generic sequences convert 10x worse than personalized ones.',
      'Weak CTA - Be specific. \"Learn more\" is weak. \"Book a 15-min call\" or \"See ROI calculator\" is strong.',
      'No timing strategy - Space emails 3-5 days apart. Too close = spam. Too far = they forget you.'
    ]
  }
}
