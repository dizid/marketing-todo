/**
 * Personalized Outreach Mini-App Configuration
 *
 * Demonstrates PromptBuilder integration for simpler context extraction.
 * Variables automatically extracted from tiers: 1, 2, 3 (company + market + brand)
 */

import { usePromptBuilder } from '../../../services/promptBuilder.js'

export const outreachConfig = {
  id: 'outreach',
  title: 'Personalized Outreach',
  description: 'Requires: Company info (product name & description), target audience & pain points, and brand voice. Set these in Setup first, then fill in channel, tone, and CTA below to generate personalized outreach.',

  // Freemium model fields
  tier: 'free',
  what: 'Generate personalized outreach messages for email, LinkedIn, and direct messages. AI tailors each message to your audience and includes a clear call-to-action.',
  why: 'Cold outreach is one of the most effective growth channels for B2B products. Personalization increases response rates by 2-3x compared to generic emails.',
  how: 'Select a target persona, channel, and tone, then let AI generate message variants. Review for accuracy, personalize further if needed, then send to your leads.',

  // Field inheritance mappings (mini-app field ID -> canonical ProjectContext field)
  fieldMappings: {
    'recipient_segment': 'targetAudience',
    'channel': null,
    'tone': null,
    'call_to_action': null,
    'additional_details': null,
    'notes': null
  },

  // Form configuration
  formTitle: 'Outreach Message Settings',
  formFields: [
    {
      id: 'recipient_segment',
      type: 'select',
      label: 'Recipient Segment / Persona',
      placeholder: 'Select a persona to target',
      required: true,
      description: 'Choose which audience persona to target (loaded from Define Audience)',
      // Options will be populated dynamically by wrapper component
      options: [
        { value: 'general', label: 'General Audience' }
      ],
      globalFieldName: 'targetAudience'
    },
    {
      id: 'channel',
      type: 'select',
      label: 'Outreach Channel',
      options: [
        { value: 'email', label: 'Email' },
        { value: 'linkedin', label: 'LinkedIn Message' },
        { value: 'twitter', label: 'Twitter/X Direct Message' },
        { value: 'direct_message', label: 'Direct Message (Generic)' }
      ],
      required: true,
      description: 'How will you reach out to this person?'
    },
    {
      id: 'tone',
      type: 'select',
      label: 'Tone / Style',
      options: [
        { value: 'professional', label: 'Professional & Formal' },
        { value: 'casual', label: 'Casual & Friendly' },
        { value: 'humorous', label: 'Humorous & Witty' },
        { value: 'urgent', label: 'Urgent & Time-Sensitive' }
      ],
      required: true,
      description: 'The tone of your outreach message'
    },
    {
      id: 'call_to_action',
      type: 'text',
      label: 'Call-to-Action',
      placeholder: 'e.g., Schedule a 15-min demo, Sign up for beta, Book a consultation',
      required: true,
      description: 'What action do you want them to take?'
    },
    {
      id: 'additional_details',
      type: 'textarea',
      label: 'Additional Personalization Details',
      placeholder: 'Any specific information about this recipient or campaign to mention? (e.g., company name, recent achievement, specific pain point)',
      description: 'Help personalize the message further with context',
      rows: 3
    },
    {
      id: 'notes',
      type: 'textarea',
      label: 'Additional Notes',
      placeholder: 'Any other requirements or context...',
      rows: 2
    }
  ],

  // AI Generation configuration
  aiConfig: {
    promptTemplate: `You are a world-class personalized outreach expert. Generate compelling {channel} outreach messages.

SENDER COMPANY:
- Name: {company_name}
- What they do: {app_description}
- Unique positioning: {market_positioning}
- Brand voice: {brand_voice}

RECIPIENT:
- Segment/Persona: {recipient_segment}
- Pain points they likely face: {audience_pain_points}

OUTREACH GOAL:
- Call-to-Action: {call_to_action}
- Tone: {tone}
- Personal context: {additional_details}
- Extra requirements: {notes}

CRITICAL GUIDELINES FOR {channel}:
${'{channel}' === 'email' ? '- Subject line must be compelling but not clickbaity (avoid all-caps, excessive punctuation)\n- Opening line should reference something about them or their situation\n- Keep body to 3-4 short paragraphs max\n- Make the CTA clear and specific\n- Include a professional signature' : '- Keep message concise - respect their time\n- Start with something personal to them\n- Lead with value, not a pitch\n- Include a clear next step\n- Use authentic language, not templates'}

Generate a highly personalized {channel} outreach message that:
1. Shows genuine interest in their situation (not generic)
2. Explains the specific value for their scenario
3. Feels authentic, not like a template
4. Includes the call-to-action naturally
5. Uses the requested {tone} tone
6. Reflects our brand voice: {brand_voice}

Format:
For email: Start with "SUBJECT: [subject]" on first line, blank line, then message body
For other channels: Just the message content`,

    temperature: 0.8,
    maxTokens: 1800,

    // Use PromptBuilder for context extraction
    contextProvider: async () => {
      const builder = usePromptBuilder()
      return await builder.buildOutreachContext()
    },

    // Parse response - handle email format with subject line
    parseResponse: (response) => {
      // Check if response includes email subject line
      if (response.startsWith('SUBJECT:')) {
        const lines = response.split('\n')
        const subjectLine = lines[0].replace('SUBJECT:', '').trim()
        const body = lines.slice(2).join('\n').trim()

        return {
          type: 'email',
          subject: subjectLine,
          body: body,
          fullMessage: response
        }
      }

      // For non-email channels, return as-is
      return {
        type: 'message',
        content: response,
        fullMessage: response
      }
    }
  },

  // Disable default output section - we have custom UI in OutreachMiniApp
  showOutput: false
}
