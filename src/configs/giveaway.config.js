/**
 * Giveaway/Contest Configuration
 */

export const giveawayTask = {
  id: 'social-3',
  name: 'Run Giveaway/Contest',
  description: 'Step-by-step guide to launch a giveaway',
  category: 'social',

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
