/**
 * Giveaway/Contest Configuration
 */

export const giveawayTask = {
  id: 'social-3',
  name: 'Run Giveaway/Contest',
  description: 'Step-by-step guide to launch a giveaway',
  category: 'social',

  // Freemium model - Premium tier task
  tier: 'premium',
  what: 'Plan and launch a giveaway or contest in 5 minutes. Define rules, create promotion assets, and track entries with a template that works for physical or digital prizes.',
  why: 'Giveaways drive massive growth (50-200 new followers) in days. Email/signup requirements for entry build your mailing list. Contests create viral sharing moments.',
  how: 'Define your prize value, duration, and entry requirements. AI generates the contest description, rules, and promotion copy. Share the link and track entries in a tracker.',

  steps: [
    {
      number: 1,
      title: 'Set Prize & Duration',
      fields: ['prizeValue', 'duration', 'prizeDescription']
    },
    {
      number: 2,
      title: 'Define Entry Requirements',
      fields: ['entryMethod', 'followReq', 'tagFriends', 'shareReq']
    },
    {
      number: 3,
      title: 'Generate Announcement',
      fields: ['announcementText', 'rulesText']
    },
    {
      number: 4,
      title: 'Promotion Strategy',
      fields: ['platforms', 'hashtags', 'promotionNotes']
    },
    {
      number: 5,
      title: 'Close & Winner',
      fields: ['closingDate', 'winnerSelection', 'announcementPlan']
    }
  ],

  customComponent: 'GiveawayMiniApp',
  output: { enabled: false }
}
