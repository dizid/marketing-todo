/**
 * Personalized Outreach Task Configuration
 *
 * This task uses the OutreachMiniApp component which provides
 * AI-assisted generation of personalized outreach emails and messages.
 */

export const outreachTask = {
  id: 'acq-2',
  name: 'Personalized Outreach',
  description: 'Generate personalized outreach emails and messages with AI assistance. Tailored to your audience and product.',
  category: 'acquisition',
  customComponent: 'OutreachMiniApp',
  miniAppId: 'outreach',
  type: 'miniapp',
  hasAI: true,

  help: {
    examples: [
      {
        scenario: 'SaaS product targeting developers',
        input: { target_audience: 'Python developers', message_angle: 'time-saving' },
        output: 'Personalized emails highlighting how the tool saves developers 5 hours/week on repetitive tasks'
      },
      {
        scenario: 'Service business targeting executives',
        input: { target_audience: 'CFOs at 100+ person companies', message_angle: 'cost reduction' },
        output: 'Executive outreach emphasizing ROI, cost savings, and implementation timeline'
      }
    ],
    commonMistakes: [
      'Generic outreach - "Hi there" doesn\'t work. Personalize by referencing something specific about them.',
      'Leading with your product - they don\'t care yet. Lead with a relevant problem or insight.',
      'Walls of text - keep it to 3-4 sentences max. Make them want to respond.',
      'Wrong person - sending to the wrong person? Research your contact list first.',
      'No follow-up - one email rarely converts. Plan for 3-5 follow-ups over 2-3 weeks.',
      'Ignoring their context - understand their company, role, and what matters to them.'
    ]
  }
}
