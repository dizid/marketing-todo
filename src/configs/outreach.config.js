export const outreachTask = {
  id: 'acq-2',
  name: 'Personalized Outreach',
  description: 'Cold outreach email campaigns',
  category: 'acquisition',
  customComponent: 'OutreachMiniApp',
  emailTemplates: [
    {
      name: 'The Problem Hook',
      subject: 'Quick question about [their problem]',
      body: 'Hi [Name],\n\nI came across your [work/company] and noticed you might be dealing with [problem].\n\nWe built [product] specifically for this. Would be happy to show you.\n\nBest,\n[Your name]'
    },
    {
      name: 'The Mutual Connection',
      subject: '[Mutual connection] thought we should talk',
      body: 'Hi [Name],\n\n[Mutual contact] recommended I reach out. We\'re working on [product] to help [people] with [problem].\n\nThought it might be relevant.\n\nBest,\n[Your name]'
    },
    {
      name: 'The Compliment',
      subject: 'Love what you\'re doing with [specific thing]',
      body: 'Hi [Name],\n\nI\'ve been following your work and really impressed by [specific achievement].\n\nWe\'re in a similar space with [product]. Would love to connect.\n\nBest,\n[Your name]'
    },
    {
      name: 'The Value First',
      subject: 'Thought you might find this useful',
      body: 'Hi [Name],\n\nFound this [resource/insight] that seemed relevant to [their work].\n\nAlso working on [product] in this space. Happy to chat sometime.\n\nBest,\n[Your name]'
    },
    {
      name: 'The Direct Ask',
      subject: 'Would love your feedback on [product]',
      body: 'Hi [Name],\n\nWe just launched [product] to help [audience] with [problem].\n\nYour perspective would be invaluable. 15 min call sometime?\n\nBest,\n[Your name]'
    }
  ],
  output: { enabled: false }
}
