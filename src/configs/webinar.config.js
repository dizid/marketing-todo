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
  output: { enabled: false }
}
