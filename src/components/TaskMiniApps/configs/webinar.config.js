/**
 * Webinar/Q&A Planning Mini-App Configuration
 *
 * This config defines the form fields for planning a webinar/Q&A session,
 * along with step-by-step guides, checklists, and templates.
 */

export const webinarConfig = {
  id: 'webinar',
  title: 'Host Webinar/Q&A',
  description: 'Plan and organize a 30-minute webinar or Q&A session with step-by-step guidance, checklists, and templates.',

  // Form configuration
  formTitle: 'Webinar Planning Details',
  formFields: [
    {
      id: 'webinar_title',
      type: 'text',
      label: 'Webinar Title/Topic',
      placeholder: 'e.g., "Getting Started with Our Platform" or "Community Q&A Session"',
      required: true,
      description: 'What will your webinar be about?'
    },
    {
      id: 'target_audience',
      type: 'textarea',
      label: 'Target Audience',
      placeholder: 'Describe who should attend (e.g., "Existing customers", "People interested in AI", "Newbies")',
      rows: 3,
      description: 'Who is this webinar for?'
    },
    {
      id: 'webinar_date',
      type: 'text',
      label: 'Scheduled Date & Time',
      placeholder: 'e.g., "Tuesday, Nov 15, 2 PM EST" or "TBD - planning phase"',
      description: 'When will you host it?'
    },
    {
      id: 'duration_minutes',
      type: 'number',
      label: 'Duration (minutes)',
      placeholder: '30',
      min: 15,
      max: 120,
      suffix: 'min',
      description: 'How long will the webinar be?'
    },
    {
      id: 'expected_attendees',
      type: 'number',
      label: 'Expected Number of Attendees',
      placeholder: '50',
      min: 1,
      description: 'How many people do you expect?'
    },
    {
      id: 'key_topics',
      type: 'textarea',
      label: 'Key Topics/Discussion Points',
      placeholder: 'e.g., "1. Product overview\n2. Real use case demo\n3. Q&A from audience\n4. Special offer/Next steps"',
      rows: 4,
      description: 'What will you discuss? (list each topic)'
    },
    {
      id: 'platform_choice',
      type: 'select',
      label: 'Video Platform',
      options: [
        { value: 'zoom', label: 'Zoom' },
        { value: 'google_meet', label: 'Google Meet' },
        { value: 'teams', label: 'Microsoft Teams' },
        { value: 'youtube', label: 'YouTube Live' },
        { value: 'streamyard', label: 'StreamYard' },
        { value: 'undecided', label: 'Not decided yet' }
      ],
      required: true,
      description: 'Which platform will you use?'
    },
    {
      id: 'co_hosts',
      type: 'textarea',
      label: 'Co-Hosts/Speakers (if any)',
      placeholder: 'e.g., "Sarah (product demo), John (Q&A moderator)"',
      rows: 2,
      description: 'Who else will present or help moderate?'
    },
    {
      id: 'notes',
      type: 'textarea',
      label: 'Additional Notes',
      placeholder: 'Any special requirements, goals, or notes?',
      rows: 2,
      description: 'Anything else we should know?'
    }
  ],

  // NO AI for this task - it's guide/template based
  aiConfig: null,

  // Don't show the default output section
  showOutput: false,

  // Guides and templates data
  guides: {
    preWebinar: {
      title: '📋 Pre-Webinar Checklist (1-2 weeks before)',
      items: [
        '✓ Decide on topic and learning objectives',
        '✓ Choose video platform (Zoom, Google Meet, etc.)',
        '✓ Schedule and create event',
        '✓ Prepare slides or presentation materials',
        '✓ Write opening remarks and closing summary',
        '✓ Prepare 5-7 discussion prompts for Q&A',
        '✓ Test camera, microphone, and internet connection',
        '✓ Set up screen sharing (practice once)',
        '✓ Plan backup (have notes ready, recording enabled)',
        '✓ Create short registration link or invite list',
        '✓ Send first invitation email (2 weeks before)',
        '✓ Prepare 1-2 follow-up reminder emails'
      ]
    },

    duringWebinar: {
      title: '🎤 During Webinar - Key Tips',
      items: [
        '✓ Start 5 minutes early to test audio/video with attendees',
        '✓ Welcome everyone and thank them for attending',
        '✓ Set expectations: "We\'ll cover X, then have 10 min for Q&A"',
        '✓ Share your screen clearly and check it\'s visible',
        '✓ Speak clearly and at a natural pace (avoid rushing)',
        '✓ Make eye contact with camera',
        '✓ Use slides to guide conversation',
        '✓ Pause between sections for questions',
        '✓ Encourage participation: "What questions do you have so far?"',
        '✓ Use polls or chat for engagement',
        '✓ Keep track of time - don\'t run over',
        '✓ End with clear next steps and CTA',
        '✓ Thank attendees and ask for feedback'
      ]
    },

    postWebinar: {
      title: '📧 Post-Webinar Follow-Up',
      items: [
        '✓ Send thank you email within 24 hours',
        '✓ Include link to recording (if available)',
        '✓ Share slides as downloadable PDF',
        '✓ Provide additional resources mentioned',
        '✓ Include next steps or special offer (if any)',
        '✓ Send feedback survey or poll',
        '✓ Note attendees who asked great questions',
        '✓ Follow up 1:1 with key prospects',
        '✓ Repurpose content: clips for social, blog post, etc.',
        '✓ Update your webinar metrics (attendance, engagement)',
        '✓ Plan next webinar based on feedback'
      ]
    }
  },

  // Email templates
  templates: {
    preWebinarEmail: {
      subject: 'Join us for: [WEBINAR_TITLE]',
      body: `Hi [NAME],

You're invited to an exclusive webinar!

📅 [DATE & TIME]
⏱️ Duration: [DURATION] minutes
🎯 Topic: [WEBINAR_TITLE]

What you'll learn:
[KEY_TOPICS]

Why attend:
• Learn directly from our experts
• Get answers to your questions live
• Connect with other [AUDIENCE] professionals
• Receive exclusive tips and resources

👉 RSVP HERE: [REGISTRATION_LINK]

See you there!
[YOUR_NAME]`
    },

    openingRemarks: {
      title: 'Opening Remarks Script (2-3 minutes)',
      content: `Good [morning/afternoon], everyone! Welcome!

Thank you all for joining us today. We're excited to have [EXPECTED_ATTENDEES] of you here from [AUDIENCE].

My name is [YOUR_NAME], and I'm [YOUR_TITLE]. With me today is [CO_HOSTS] who will help us explore [WEBINAR_TITLE].

Here's what we'll cover in the next [DURATION] minutes:
[KEY_TOPICS]

We'll save the last 10 minutes for your questions - please drop them in the chat or raise your hand.

Let's get started!`
    },

    qaPrompts: {
      title: 'Q&A Discussion Starters',
      content: `Use these if the chat is quiet:

• "What's the biggest challenge you face with [TOPIC]?"
• "Has anyone tried [RELATED_APPROACH]? How did it go?"
• "What would you most like to learn about [TOPIC]?"
• "Which of these features would be most useful for your [BUSINESS/GOAL]?"
• "Are there common misconceptions about [TOPIC] that we should address?"
• "What does success look like for you in [AREA]?"`
    },

    postWebinarEmail: {
      subject: 'Thank you for joining [WEBINAR_TITLE]!',
      body: `Hi [NAME],

Thank you so much for attending our webinar on [WEBINAR_TITLE]! We loved having you.

Here's what you requested:
📹 Recording: [RECORDING_LINK]
📊 Slides: [SLIDES_LINK]
📚 Resources: [RESOURCES_LINK]

Key Takeaways:
[KEY_TOPICS]

Next Steps:
[NEXT_STEPS_OR_OFFER]

Have a question that didn't get answered? Reply to this email - we're happy to help!

Looking forward to seeing you at our next webinar!
[YOUR_NAME]`
    }
  },

  // Help content for users
  help: {
    examples: [
      {
        scenario: 'Product feature demo webinar',
        input: { webinar_title: 'Advanced Analytics Demo', target_audience: 'Existing customers', expected_attendees: 75 },
        output: 'Live webinar showing new reporting features with real data, Q&A focused on implementation, post-webinar follow-up with template for feature documentation'
      },
      {
        scenario: 'Community Q&A session',
        input: { webinar_title: 'Best Practices Office Hours', target_audience: 'Free plan users', expected_attendees: 30 },
        output: 'Casual AMA format, discussion starters ready for quiet moments, follow-up email with recording and FAQ document'
      }
    ],
    commonMistakes: [
      'No clear objective - "just chat" webinars waste everyone\'s time. Know what you want attendees to leave with.',
      'Talking too fast - people need time to absorb. Pause between sections, repeat key points, leave room for questions.',
      'No agenda shared - people hate surprises. Send the 30-min outline in the invite so they know what to expect.',
      'Forgetting to test tech beforehand - 5 min before start, NOT 5 minutes late discovering audio is broken.',
      'No follow-up plan - recording goes in the void. Send it within 24 hours with resources and next steps.',
      'One-way broadcast - asking "Any questions?" at the end doesn\'t work. Use polls, breakouts, or chat throughout.'
    ]
  },

  // Tools recommendations
  toolSuggestions: [
    {
      category: 'Video Platforms',
      tools: [
        { name: 'Zoom', link: 'https://zoom.us', note: 'Most popular, reliable' },
        { name: 'Google Meet', link: 'https://meet.google.com', note: 'Simple, integrated with Gmail' },
        { name: 'Microsoft Teams', link: 'https://teams.microsoft.com', note: 'Good for enterprise' },
        { name: 'YouTube Live', link: 'https://youtube.com', note: 'Large audience, SEO benefit' }
      ]
    },
    {
      category: 'Scheduling & Registration',
      tools: [
        { name: 'Calendly', link: 'https://calendly.com', note: 'Easy scheduling' },
        { name: 'Eventbrite', link: 'https://eventbrite.com', note: 'Full event management' },
        { name: 'Doodle', link: 'https://doodle.com', note: 'Simple polling' }
      ]
    },
    {
      category: 'Engagement & Polls',
      tools: [
        { name: 'Slido', link: 'https://slido.com', note: 'Live polls & Q&A' },
        { name: 'Mentimeter', link: 'https://mentimeter.com', note: 'Interactive presentations' },
        { name: 'Typeform', link: 'https://typeform.com', note: 'Post-webinar surveys' }
      ]
    },
    {
      category: 'Recording & Editing',
      tools: [
        { name: 'Loom', link: 'https://loom.com', note: 'Quick video messages' },
        { name: 'OBS Studio', link: 'https://obsproject.com', note: 'Free, powerful streaming' },
        { name: 'CapCut', link: 'https://capcut.com', note: 'Easy video editing' }
      ]
    }
  ]
}
