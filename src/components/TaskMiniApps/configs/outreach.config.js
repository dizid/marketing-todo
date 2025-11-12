/**
 * Personalized Outreach Mini-App Configuration
 *
 * This config defines the form fields, AI generation prompt,
 * and output structure for the Personalized Outreach task
 */

export const outreachConfig = {
  id: 'outreach',
  title: 'Personalized Outreach',
  description: 'Generate personalized outreach messages tailored to specific audience segments with AI assistance.',

  // Freemium model fields
  tier: 'free',
  what: 'Generate personalized outreach messages for email, LinkedIn, and direct messages. AI tailors each message to your audience and includes a clear call-to-action.',
  why: 'Cold outreach is one of the most effective growth channels for B2B products. Personalization increases response rates by 2-3x compared to generic emails.',
  how: 'Select a target persona, channel, and tone, then let AI generate message variants. Review for accuracy, personalize further if needed, then send to your leads.',

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
      ]
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
    promptTemplate: `You are helping generate a personalized outreach message.

TARGET PERSONA: {recipient_segment}
CHANNEL: {channel}
TONE: {tone}

COMPANY:
- Name: {company_name}
- Product/Service: {app_description}

OUTREACH DETAILS:
- Desired Call-to-Action: {call_to_action}
- Additional Details to Include: {additional_details}
- Extra Notes: {notes}

Generate a personalized {channel} outreach message that:
1. Grabs attention and shows you know their situation
2. Briefly explains how {app_description} helps
3. Includes a personal touch using the additional details
4. Has a clear CTA: {call_to_action}
5. Uses a {tone} tone
6. Is concise and authentic

Format:
For email: Start with "SUBJECT: [subject]" on first line, blank line, then message body
For other channels: Just the message content`,

    temperature: 0.8,
    maxTokens: 1500,

    // Get context from local storage (similar to generatePosts)
    contextProvider: () => {
      try {
        const stored = localStorage.getItem('marketing-app-data')
        const data = stored ? JSON.parse(stored) : {}
        return {
          app_description: data.appDescription || 'Your product/service',
          company_name: data.companyName || 'Your Company'
        }
      } catch (e) {
        console.error('Error loading context:', e)
        return {
          app_description: 'Your product/service',
          company_name: 'Your Company'
        }
      }
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
