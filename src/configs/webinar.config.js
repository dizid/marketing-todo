export const webinarTask = {
  id: 'acq-3',
  name: 'Host Webinar/Q&A',
  description: 'Plan and execute a webinar',
  category: 'acquisition',

  // Freemium model - Premium tier task
  tier: 'premium',
  what: 'Plan a 30-minute webinar or live Q&A with structure, topic guidance, slides outline, and promotion strategy. Turn live events into lead generation machines.',
  why: 'Webinars convert 2-3% of attendees to customers. Live events build relationships and authority. One good webinar can generate 50+ qualified leads.',
  how: 'Answer 5 questions about your topic and audience, then get a complete webinar outline with intro, 3 main sections, live demo, Q&A format, and follow-up sequence.',

  customComponent: 'WebinarMiniApp',
  output: { enabled: false },

  help: {
    examples: [
      {
        scenario: 'Product feature demo webinar',
        input: { webinar_title: 'Advanced Analytics Demo', topic_description: 'New reporting features and dashboards', target_audience: 'Existing customers' },
        output: 'Structured webinar: 5-min intro, 15-min live demo showing real data, 5-min Q&A, 2-min CTA. Follow-up email with recording and 20% discount for attendees.'
      },
      {
        scenario: 'Thought leadership webinar',
        input: { webinar_title: 'The Future of SaaS Automation', topic_description: 'Industry trends and best practices', target_audience: 'Potential customers, industry professionals' },
        output: 'Educational webinar: panel discussion format, 3 speakers sharing insights, live polls for engagement, recorded and repurposed into 5 social clips and 1 blog post.'
      }
    ],
    commonMistakes: [
      'No clear objective - "Let\'s just talk" wastes everyone\'s time. Know exactly what you want attendees to learn or do.',
      'Talking too fast - slide through 50 slides in 30 minutes and nobody absorbs anything. Slow down, pause for questions, repeat key points.',
      'Forgetting to promote it - 30 people sign up, 8 attend. Start promoting 2 weeks out, send 3 reminder emails, use social and email list.',
      'No tech rehearsal - discover your screen share is broken 2 minutes before start time. Test everything 24 hours before.',
      'Boring delivery - read slides verbatim = audience asleep. Use storytelling, real examples, live demos, guest speakers to keep energy high.',
      'No follow-up plan - webinar ends, nothing happens. Send recording within 24 hours + resources + special offer to drive conversions.'
    ]
  }
}
