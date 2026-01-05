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
  output: { enabled: false },

  help: {
    examples: [
      {
        scenario: 'SaaS running giveaway to grow email list',
        input: { prize: '1-year subscription worth $500', duration: '7 days', entry_requirements: ['email signup', 'follow on Twitter', 'tag 2 friends'] },
        output: 'Complete giveaway package: official rules ensuring legal compliance, promotional post templates for Twitter/Instagram/LinkedIn, entry tracking spreadsheet, winner selection method (random draw tool), announcement templates, and follow-up email sequence for non-winners to convert them to customers.'
      },
      {
        scenario: 'E-commerce brand running Instagram giveaway',
        input: { prize: '$200 product bundle', duration: '10 days', entry_requirements: ['follow account', 'like post', 'tag 3 friends in comments'] },
        output: 'Instagram-optimized giveaway: eye-catching post caption with clear entry instructions, story template countdown, rules compliant with Instagram ToS, comment moderation guide, winner announcement graphics template, and strategy to convert contest participants into buyers with exclusive discount code.'
      }
    ],
    commonMistakes: [
      'Prize doesn\'t attract your target audience - giving away an iPhone attracts everyone, not your ideal customers. Choose prizes that appeal specifically to people who\'d buy your product.',
      'No clear entry requirements - vague "enter below" instructions confuse people. State exact steps: "1. Follow us, 2. Like this post, 3. Tag 2 friends in comments".',
      'Not following platform rules - Instagram and Facebook have strict giveaway policies. Violating them can get your account banned. Always check current rules before launching.',
      'Ignoring legal requirements - forgetting "No purchase necessary" disclaimer or failing to state odds. Check local contest laws and include required disclosures.',
      'Not having a post-giveaway strategy - getting 500 new followers, announcing winner, then radio silence. Have a content plan ready to keep new followers engaged.',
      'Picking winner unfairly - manually choosing or picking friends. Use random selection tools (e.g., Comment Picker) and announce selection method upfront for transparency.'
    ]
  }
}
