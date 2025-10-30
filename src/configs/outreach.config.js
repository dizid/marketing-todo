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
  hasAI: true
}
