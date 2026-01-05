/**
 * Paid Ads Optimization Mini-App Configuration
 *
 * For users who already have running campaigns and want to optimize performance
 */

export const auditWizardForm = [
  {
    id: 'platforms',
    type: 'checkboxes',
    label: 'Which platforms are you running ads on?',
    options: [
      { value: 'google', label: 'Google Ads' },
      { value: 'meta', label: 'Meta (Facebook/Instagram)' },
      { value: 'linkedin', label: 'LinkedIn Ads' },
      { value: 'tiktok', label: 'TikTok Ads' },
      { value: 'twitter', label: 'Twitter/X Ads' },
      { value: 'pinterest', label: 'Pinterest Ads' }
    ],
    required: true,
    description: 'Select all platforms where you currently run ads'
  },
  {
    id: 'campaign_duration',
    type: 'select',
    label: 'How long have your campaigns been running?',
    options: [
      { value: '1-2weeks', label: '1-2 weeks' },
      { value: '2-4weeks', label: '2-4 weeks (ideal for analysis)' },
      { value: '1-2months', label: '1-2 months' },
      { value: '3+months', label: '3+ months' }
    ],
    required: true
  },
  {
    id: 'total_spend',
    type: 'number',
    label: 'Total Ad Spend (Last 30 Days)',
    placeholder: '1000',
    min: 100,
    prefix: '$',
    required: true,
    description: 'Your total advertising budget spent in the last 30 days'
  },
  {
    id: 'total_clicks',
    type: 'number',
    label: 'Total Clicks (Last 30 Days)',
    placeholder: '500',
    min: 10,
    required: true,
    description: 'Total number of clicks received across all platforms'
  },
  {
    id: 'total_conversions',
    type: 'number',
    label: 'Total Conversions (Last 30 Days)',
    placeholder: '25',
    min: 0,
    required: true,
    description: 'Sales, leads, signups - whatever your conversion goal is'
  },
  {
    id: 'primary_goal',
    type: 'select',
    label: 'Primary Optimization Goal',
    options: [
      { value: 'increase-ctr', label: 'Increase Click-Through Rate (CTR)' },
      { value: 'lower-cpa', label: 'Lower Cost Per Acquisition (CPA)' },
      { value: 'improve-roas', label: 'Improve Return on Ad Spend (ROAS)' },
      { value: 'scale-winners', label: 'Scale Winning Campaigns' },
      { value: 'fix-underperforming', label: 'Fix Underperforming Campaigns' }
    ],
    required: true
  },
  {
    id: 'biggest_challenge',
    type: 'textarea',
    label: 'What\'s your biggest advertising challenge right now?',
    placeholder: 'e.g., High CPA, low conversion rate, ad fatigue, not sure what to test next...',
    rows: 3,
    description: 'Be specific - this helps AI generate better recommendations'
  },
  {
    id: 'avg_ctr',
    type: 'number',
    label: 'Average CTR (%) - Optional',
    placeholder: '1.5',
    min: 0,
    step: 0.01,
    suffix: '%',
    description: 'If you know your click-through rate percentage'
  }
]

export const platformOptimizations = [
  {
    id: 'google-ads',
    platform: 'Google Ads',
    icon: '🔍',
    sections: [
      {
        title: 'Quality Score Optimization',
        expectedImpact: 'Lower CPC by 20-40%',
        timeToImplement: '1-2 weeks',
        difficulty: 'Intermediate',
        tactics: [
          {
            name: 'Improve Ad Relevance',
            description: 'Match your ad copy exactly to your keywords. Use Dynamic Keyword Insertion (DKI) to automatically insert the search term into your headline.',
            steps: [
              'Review keywords with Quality Score < 7',
              'Rewrite ad headlines to include exact keyword match',
              'Use {KeyWord:Default Text} in headlines for dynamic insertion',
              'Ensure landing page H1 matches ad headline',
              'Test 3 ad variations per ad group'
            ],
            why: 'Google rewards relevance with lower CPCs. A Quality Score increase from 5 to 8 can reduce your CPC by 50%.'
          },
          {
            name: 'Landing Page Experience',
            description: 'Optimize landing pages for speed, relevance, and mobile experience.',
            steps: [
              'Use Google PageSpeed Insights - aim for 90+ score',
              'Ensure landing page contains the exact keywords you\'re bidding on',
              'Add trust signals: testimonials, security badges, guarantees',
              'Make CTA button above the fold on mobile',
              'Reduce form fields to absolute minimum (3-5 max)'
            ],
            why: 'Landing page experience is 33% of your Quality Score. Slow pages kill conversions and increase CPCs.'
          },
          {
            name: 'Expected CTR Improvement',
            description: 'Increase your historical CTR to signal relevance to Google.',
            steps: [
              'Pause ads with CTR < 1% after 100 impressions',
              'Use countdown timers in headlines: "Ends in {COUNTDOWN}!"',
              'Add emotional triggers: "Finally", "Proven", "Guaranteed"',
              'Test question headlines: "Struggling with [problem]?"',
              'Use symbols in descriptions: ✓ ★ → (sparingly)'
            ],
            why: 'Higher CTR = Google shows your ads more often at lower cost. Aim for 3%+ CTR on search campaigns.'
          }
        ]
      },
      {
        title: 'Negative Keyword Strategy',
        expectedImpact: 'Reduce wasted spend by 20-30%',
        timeToImplement: '2 hours',
        difficulty: 'Beginner',
        tactics: [
          {
            name: 'Build Negative Keyword Lists',
            description: 'Exclude irrelevant searches to stop wasting money on non-buyers.',
            steps: [
              'Go to Search Terms report, filter by conversions = 0',
              'Add any irrelevant terms as negative keywords',
              'Create shared negative lists: "Jobs", "Free", "DIY", "Cheap"',
              'For B2B: exclude "students", "free", "tutorial", "how to make"',
              'For premium products: exclude "cheap", "discount", "free", "affordable"'
            ],
            why: 'Most accounts waste 20-30% of budget on irrelevant searches. Negative keywords are the fastest ROI improvement.'
          },
          {
            name: 'Negative Keyword Mining',
            description: 'Continuously find and exclude bad searches.',
            steps: [
              'Review Search Terms report weekly',
              'Add negatives at campaign level (broad) or ad group level (specific)',
              'Use negative phrase match for multi-word exclusions',
              'Set up automated rules: "Add as negative if spend > $50 and conversions = 0"',
              'Steal competitor negative lists from industry forums'
            ],
            why: 'Search evolves constantly. Weekly reviews prevent new waste.'
          }
        ]
      },
      {
        title: 'Smart Bidding Optimization',
        expectedImpact: 'Improve CPA by 15-30%',
        timeToImplement: '1 week (learning period)',
        difficulty: 'Advanced',
        tactics: [
          {
            name: 'Choose the Right Bidding Strategy',
            description: 'Match your bidding strategy to your conversion volume and goal.',
            steps: [
              'If <30 conversions/month: Use Maximize Clicks or Manual CPC',
              'If 30-50 conversions/month: Use Target CPA (set 20% higher than current)',
              'If 50+ conversions/month: Use Target ROAS or Maximize Conversions',
              'Give algorithm 2 weeks learning period - don\'t change target during this time',
              'If performance drops after 2 weeks, revert to manual and try again in 30 days'
            ],
            why: 'Smart Bidding needs data. Without enough conversions, it makes bad decisions and wastes money.'
          },
          {
            name: 'Portfolio Bid Strategies',
            description: 'Combine campaigns for better machine learning performance.',
            steps: [
              'Create portfolio bid strategy across 3+ similar campaigns',
              'Ensure all campaigns share same conversion goal',
              'Combined campaigns should have 50+ conversions/month total',
              'Monitor performance at portfolio level, not individual campaign',
              'Exclude brand campaigns from portfolio (different intent)'
            ],
            why: 'More data = smarter algorithm. Portfolio strategies learn faster than individual campaigns.'
          }
        ]
      },
      {
        title: 'Search vs Display Optimization',
        expectedImpact: 'Better allocation = 30% higher ROAS',
        timeToImplement: '3 days',
        difficulty: 'Intermediate',
        tactics: [
          {
            name: 'Optimize Search Campaigns',
            description: 'Focus on high-intent keywords and exact/phrase match.',
            steps: [
              'Review Auction Insights - if you\'re #1, you might be overbidding',
              'Split test: exact match vs phrase match (exact usually wins)',
              'Use RLSA (Remarketing Lists for Search Ads) to bid higher on previous visitors',
              'Exclude GDN (Display Network) from Search campaigns',
              'Focus 70% of budget on bottom-funnel keywords (comparison, buy, best, vs)'
            ],
            why: 'Search has 3-5x higher conversion rate than Display. Optimize Search first, then expand.'
          },
          {
            name: 'Display Campaign Efficiency',
            description: 'Use Display for retargeting and awareness, not direct response.',
            steps: [
              'Create separate Display campaigns - never mix with Search',
              'Start with retargeting only: website visitors last 30 days',
              'Use Responsive Display Ads with 5 headlines + 5 descriptions',
              'Exclude mobile apps (usually low quality traffic)',
              'Set frequency cap: max 3 impressions per user per day'
            ],
            why: 'Display has 10x lower CTR than Search. Use it strategically for retargeting, not cold acquisition.'
          }
        ]
      }
    ]
  },
  {
    id: 'meta-ads',
    platform: 'Meta Ads',
    icon: '📘',
    sections: [
      {
        title: 'Creative Fatigue Management',
        expectedImpact: 'Maintain CTR, prevent 50% performance drops',
        timeToImplement: 'Ongoing weekly task',
        difficulty: 'Intermediate',
        tactics: [
          {
            name: 'Detect Ad Fatigue Early',
            description: 'Monitor frequency and CTR to catch fatigue before it tanks performance.',
            steps: [
              'Check ad frequency metric weekly - if >3, creative is fatiguing',
              'Monitor CTR week-over-week - if drops >20%, refresh creative',
              'Watch for CPA increases - if up >30%, likely fatigue',
              'Set up automated rule: "Alert me if frequency >4"',
              'Larger audiences fatigue slower - expand targeting if fatiguing fast'
            ],
            why: 'Meta users see same ad multiple times. After 3-4 exposures, CTR drops 40-60%. Fresh creative maintains performance.'
          },
          {
            name: 'Creative Refresh Schedule',
            description: 'Plan creative rotation to stay fresh without disrupting learning.',
            steps: [
              'Small audience (<100K): Refresh every 2 weeks',
              'Medium audience (100K-500K): Refresh every 3-4 weeks',
              'Large audience (>500K): Refresh every 6-8 weeks',
              'Always keep 1 winning ad running (control) while testing new creative',
              'Refresh = new angle/hook, not just different image of same concept'
            ],
            why: 'Fresh creative prevents fatigue while maintaining performance. Always test new against proven winner.'
          },
          {
            name: 'Angle Variation Framework',
            description: 'Test different creative angles to find what resonates.',
            steps: [
              'Angle 1: Problem-focused ("Tired of [problem]?")',
              'Angle 2: Solution-focused ("Here\'s how to [solution]")',
              'Angle 3: Social proof ("Join 10,000+ who solved [problem]")',
              'Angle 4: Urgency ("Limited time: [offer]")',
              'Angle 5: Curiosity ("The [topic] secret nobody talks about")',
              'Run all 5 simultaneously, kill losers after 50 clicks'
            ],
            why: 'Different angles attract different segments. Test to find your best performer, then iterate on that angle.'
          }
        ]
      },
      {
        title: 'Audience Targeting Optimization',
        expectedImpact: 'Lower CPA by 30-50%',
        timeToImplement: '1 week',
        difficulty: 'Advanced',
        tactics: [
          {
            name: 'Audience Exclusion Strategy',
            description: 'Prevent ad spend waste by excluding converted customers and low-quality audiences.',
            steps: [
              'Exclude existing customers (upload customer list)',
              'Exclude recent purchasers (last 90 days)',
              'Exclude job seekers: people who like "Remote Work", "Freelance", "Work From Home"',
              'Exclude competitors\' employees (if targeting by company)',
              'Create exclusion list of low-intent behaviors'
            ],
            why: 'Showing acquisition ads to existing customers wastes 15-25% of budget. Exclusions improve ROAS immediately.'
          },
          {
            name: 'Lookalike Audience Ladder',
            description: 'Build lookalike audiences based on value, not just conversions.',
            steps: [
              'Create value-based lookalike: Top 25% customers by LTV',
              'Start with 1% lookalike (most similar), test before expanding',
              'Test 1% vs 3% vs 5% - usually 1% performs best',
              'Need 1000+ source audience for quality lookalikes',
              'Refresh lookalike source every 60-90 days as customer base grows'
            ],
            why: 'Generic "All Customers" lookalike includes low-value customers. Value-based lookalikes find better prospects.'
          },
          {
            name: 'Interest Stacking for Precision',
            description: 'Layer interests to narrow audiences and reduce CPA.',
            steps: [
              'Test broad interest alone as control (e.g., "Digital Marketing")',
              'Test narrow AND stacking: "Digital Marketing" AND "Small Business" AND "E-commerce"',
              'Narrow audiences = higher CPA but better quality (test both)',
              'Don\'t stack more than 3 interests (too narrow)',
              'Use Audience Insights to discover complementary interests'
            ],
            why: 'Broad interests have low CPMs but high CPAs. Stacking filters for higher-intent prospects.'
          }
        ]
      },
      {
        title: 'Campaign Budget Optimization (CBO)',
        expectedImpact: 'Automatic budget allocation to winners',
        timeToImplement: '2 days',
        difficulty: 'Intermediate',
        tactics: [
          {
            name: 'When to Use CBO vs ABO',
            description: 'Choose the right budget strategy for your goal.',
            steps: [
              'Use CBO when: Testing multiple audiences, want algorithmic optimization',
              'Use ABO when: Testing creative, need control over ad set budgets, small budget (<$50/day)',
              'CBO needs minimum 5 ad sets to work well',
              'Set ad set spending limits if one audience dominates unfairly',
              'Don\'t switch CBO → ABO or vice versa mid-campaign (resets learning)'
            ],
            why: 'CBO shifts budget to best-performing ad sets automatically. But it needs scale to work effectively.'
          },
          {
            name: 'CBO Best Practices',
            description: 'Configure CBO for optimal performance.',
            steps: [
              'Set campaign budget 20% higher than sum of previous ad set budgets',
              'Give CBO 7 days learning period - don\'t judge early',
              'Use "Bid Cap" if CPAs are going too high',
              'Monitor at ad set level - if one gets 0 budget, it\'s underperforming',
              'Keep ad sets similar in size (don\'t mix 10K and 1M audiences)'
            ],
            why: 'CBO works best with patience and similar-sized ad sets. Uneven audiences confuse the algorithm.'
          }
        ]
      }
    ]
  },
  {
    id: 'linkedin-ads',
    platform: 'LinkedIn Ads',
    icon: '💼',
    sections: [
      {
        title: 'Lower LinkedIn\'s High CPCs',
        expectedImpact: 'Reduce CPC by 20-40%',
        timeToImplement: '1 week',
        difficulty: 'Intermediate',
        tactics: [
          {
            name: 'Optimize for Engagement First',
            description: 'Build social proof to reduce CPCs organically.',
            steps: [
              'Start with Engagement objective (not Conversions) for first week',
              'Accumulate likes/comments/shares on posts',
              'Reuse high-engagement posts in future campaigns (lower CPC)',
              'Encourage team to engage with ads in first 24 hours',
              'Add conversation-starting questions in copy to drive comments'
            ],
            why: 'LinkedIn rewards engagement. Ads with engagement get better distribution at lower cost.'
          },
          {
            name: 'Audience Precision Tactics',
            description: 'Narrow targeting to reduce waste and CPC.',
            steps: [
              'Use job title + seniority + company size (triple layer)',
              'Exclude students, job seekers, low-value industries',
              'Target 50K-200K audience size (sweet spot)',
              '<50K = too expensive, >500K = too broad',
              'Use Matched Audiences (website retargeting) - 50% lower CPC'
            ],
            why: 'LinkedIn charges premium CPCs. Narrow targeting ensures you\'re only reaching decision-makers.'
          }
        ]
      }
    ]
  }
]

export const goalPlaybooks = [
  {
    id: 'lower-cpa',
    title: 'Lower Your CPA by 30-50%',
    icon: '💰',
    difficulty: 'Intermediate',
    timeToImplement: '2-3 weeks',
    expectedResults: '30-50% reduction in Cost Per Acquisition',
    tactics: [
      {
        title: 'Landing Page Optimization',
        priority: 'Critical',
        description: 'Your landing page might be the problem, not your ads.',
        checklist: [
          'Headline matches ad copy exactly (message match)',
          'Remove navigation menu (eliminate exits)',
          'Single clear CTA above the fold',
          'Load time under 2 seconds (use Google PageSpeed Insights)',
          'Mobile-optimized (60%+ traffic is mobile)',
          'Add trust signals: testimonials, logos, security badges, guarantee',
          'Reduce form fields to 3-5 max (every field costs conversions)',
          'Use directional cues: arrows pointing to CTA button',
          'Add live chat or chatbot for instant support',
          'A/B test: short form vs long form'
        ],
        why: 'Even if CTR is great, bad landing pages kill conversions. A 2x conversion rate improvement = 50% lower CPA.',
        expectedImpact: '50-100% increase in conversion rate'
      },
      {
        title: 'Conversion Tracking Audit',
        priority: 'Critical',
        description: 'If tracking is broken, you\'re optimizing blind.',
        checklist: [
          'Test conversion pixel: complete a test purchase/signup',
          'Check Google Analytics Goals are firing correctly',
          'Verify Facebook Pixel is tracking all events',
          'Use Google Tag Assistant to debug tracking issues',
          'Set up Enhanced Conversions (Google) or CAPI (Meta)',
          'Track micro-conversions: add-to-cart, video views, button clicks',
          'Attribute conversions correctly (30-day click, 1-day view)',
          'Exclude internal traffic from conversion tracking',
          'Set up offline conversion tracking if phone/in-person sales'
        ],
        why: 'Broken tracking = algorithms optimize for wrong goal. Fix tracking before anything else.',
        expectedImpact: 'Better data = better optimization decisions'
      },
      {
        title: 'Audience Refinement',
        priority: 'High',
        description: 'Stop showing ads to people who won\'t buy.',
        checklist: [
          'Analyze converting vs non-converting audiences in Ads Manager',
          'Exclude audiences with 0 conversions after $100 spend',
          'Focus budget on top 20% best-performing audiences',
          'Test narrow vs broad audiences (narrow often has lower CPA)',
          'Use customer data: upload email list for better lookalikes',
          'Exclude existing customers from acquisition campaigns',
          'Target bottom-funnel intent: "buy", "pricing", "vs [competitor]"',
          'Use retargeting ladder: website visitors → engaged users → cart abandoners'
        ],
        why: 'Not all audiences are equal. Shifting budget from bad to good audiences is the fastest CPA improvement.',
        expectedImpact: '20-40% CPA reduction'
      },
      {
        title: 'Negative Targeting',
        priority: 'High',
        description: 'What you exclude is as important as what you target.',
        checklist: [
          'Add negative keywords: free, cheap, diy, tutorial, job, careers',
          'Exclude mobile apps on Google Display Network',
          'Exclude low-income ZIP codes (if premium product)',
          'Exclude job seekers on Facebook (people who like "Remote Work")',
          'Exclude competitors\' employees',
          'Review placement report - exclude low-quality websites',
          'Exclude ages <18 and >65 unless your product targets them'
        ],
        why: 'Negative targeting eliminates waste. Most accounts waste 20-30% on wrong audiences.',
        expectedImpact: '15-25% budget savings'
      }
    ]
  },
  {
    id: 'increase-ctr',
    title: 'Increase CTR by 2-3x',
    icon: '👆',
    difficulty: 'Beginner',
    timeToImplement: '1 week',
    expectedResults: '2-3x improvement in Click-Through Rate',
    tactics: [
      {
        title: 'Ad Creative Refresh',
        priority: 'Critical',
        description: 'Boring ads get ignored. Make yours stand out.',
        checklist: [
          'Use pattern interrupts: bright colors, unexpected images, contrasts',
          'Test real people vs stock photos (real usually wins 2x)',
          'Add text overlay to images: highlight key benefit',
          'Use video (even simple) - 2-3x higher CTR than static images',
          'Test carousel ads with step-by-step how-to',
          'Use before/after images for transformation products',
          'Test memes and trending formats (if brand-appropriate)',
          'Rotate creative every 2-4 weeks to prevent ad fatigue'
        ],
        why: 'Creative is 70% of ad performance. Better creative = higher CTR = lower CPC.',
        expectedImpact: '2-3x CTR improvement'
      },
      {
        title: 'Headline Formulas That Work',
        priority: 'High',
        description: 'Your headline determines if people read the rest.',
        checklist: [
          'Use numbers: "7 Ways to [achieve goal]" (3-4x higher CTR)',
          'Ask questions: "Struggling with [pain point]?"',
          'Use power words: Finally, Proven, Guaranteed, Secret, Fast',
          'Create urgency: "Limited Time", "Ends Tonight", "Only 5 Left"',
          'Make it specific: "Reduce CPA by 47%" not "Lower CPA"',
          'Use "How to" format: "How to [achieve result] in [timeframe]"',
          'Test negative angles: "Stop Wasting Money on [problem]"',
          'Personalize with DKI: "Best {KeyWord} for {City}"'
        ],
        why: 'Headline is read 5x more than body. Great headline = 50-100% higher CTR.',
        expectedImpact: '50-100% CTR increase'
      },
      {
        title: 'CTA Button Optimization',
        priority: 'Medium',
        description: 'Tell people exactly what to do next.',
        checklist: [
          'Use action verbs: "Get", "Start", "Download", "Claim" (not "Submit")',
          'Add urgency: "Get My Free Trial Now" vs "Free Trial"',
          'Test specific vs generic: "Download Free Guide" vs "Learn More"',
          'Use first person: "Start My Free Trial" vs "Start Free Trial"',
          'Create scarcity: "Claim Your Spot" vs "Sign Up"',
          'Test long vs short: "Yes, Send Me the Guide" vs "Download"',
          'Make buttons stand out: contrasting color, large size'
        ],
        why: 'CTA clarifies next step. Specific CTAs get 2x more clicks than generic ones.',
        expectedImpact: '20-40% more clicks on ads'
      }
    ]
  },
  {
    id: 'improve-roas',
    title: 'Improve ROAS from 3:1 to 5:1+',
    icon: '📈',
    difficulty: 'Advanced',
    timeToImplement: '4-6 weeks',
    expectedResults: 'Double your return on ad spend',
    tactics: [
      {
        title: 'Retargeting Funnel Setup',
        priority: 'Critical',
        description: 'Most visitors don\'t buy first visit. Bring them back.',
        checklist: [
          'Create pixel audiences: All visitors, 180-day window',
          'Segment by behavior: Homepage vs Product page vs Cart abandoners',
          'Budget allocation: 60% retargeting, 40% cold traffic',
          'Retargeting ladder: Day 1-3 (awareness), Day 4-14 (consideration), Day 15+ (discount)',
          'Use dynamic product ads to show exact product viewed',
          'Exclude purchasers from all retargeting campaigns',
          'Test different ad angles for warm vs cold audiences',
          'Set frequency cap: max 5 impressions per person per week'
        ],
        why: 'Retargeting converts 3-10x better than cold traffic. It\'s the fastest ROAS improvement.',
        expectedImpact: '3-5x ROAS on retargeting campaigns'
      },
      {
        title: 'Customer Lifetime Value Optimization',
        priority: 'High',
        description: 'Increase what each customer is worth over time.',
        checklist: [
          'Set up post-purchase email sequence: onboarding, tips, upsells',
          'Create subscription or recurring billing option',
          'Launch loyalty program: points, VIP tiers, referral rewards',
          'Build upsell/cross-sell campaigns to existing customers',
          'Increase prices (test 10-20% increase - most see no drop in conversions)',
          'Create premium tier or bundle offers',
          'Send win-back campaigns to churned customers',
          'Calculate and track actual LTV by cohort monthly'
        ],
        why: 'If you increase LTV from $100 to $150, you can pay 50% more for ads and still be profitable.',
        expectedImpact: '30-50% increase in LTV = 30-50% higher acceptable CPA'
      },
      {
        title: 'AOV (Average Order Value) Tactics',
        priority: 'High',
        description: 'Make each purchase worth more.',
        checklist: [
          'Add "Frequently Bought Together" bundles at checkout',
          'Offer free shipping threshold: "Add $15 more for free shipping"',
          'Create product bundles at 15% discount vs buying separately',
          'Show "Customers also bought" recommendations',
          'Use "Complete the Set" upsells',
          'Add one-click upsells on thank-you page',
          'Test tiered pricing: Good, Better, Best (most choose Better)',
          'Offer payment plans for high-ticket items'
        ],
        why: 'Increasing AOV from $50 to $75 = 50% more revenue per customer at same ad cost.',
        expectedImpact: '20-40% AOV increase'
      }
    ]
  },
  {
    id: 'scale-winners',
    title: 'Scale Winning Campaigns',
    icon: '🚀',
    difficulty: 'Advanced',
    timeToImplement: '4-8 weeks',
    expectedResults: '2-5x campaign spend while maintaining ROAS',
    tactics: [
      {
        title: 'The 20% Scaling Rule',
        priority: 'Critical',
        description: 'Scale too fast = performance crash. Scale methodically.',
        checklist: [
          'Increase budget max 20% every 3 days (gives algorithm time to adjust)',
          'Never double budget overnight (resets learning, kills performance)',
          'Example: $100/day → $120 (day 3) → $144 (day 6) → $173 (day 9)',
          'Monitor CPA daily during scaling - if it increases >30%, pause scaling',
          'Wait 7 days after any major change before scaling',
          'Don\'t scale and change creative/audience simultaneously',
          'If performance drops, reduce budget back to previous level'
        ],
        why: 'Fast scaling disrupts algorithm learning. Gradual scaling maintains performance.',
        expectedImpact: 'Maintain ROAS while increasing spend'
      },
      {
        title: 'Horizontal Scaling (New Audiences)',
        priority: 'High',
        description: 'Find new audiences similar to your winners.',
        checklist: [
          'Duplicate winning ad sets, change audience only',
          'Test broader lookalike %: if 1% works, test 2-3%',
          'Expand to similar interest audiences',
          'Test international markets (if product allows)',
          'Create "stacked" interest combos from winning interests',
          'Test aged-up/aged-down versions of winning demographics',
          'Expand geographic targeting: state → region → national',
          'Test similar platforms: if Meta works, try Pinterest/TikTok'
        ],
        why: 'Vertical scaling (increasing budget) has limits. Horizontal scaling finds new pockets of demand.',
        expectedImpact: '2-3x total spend capacity'
      },
      {
        title: 'Campaign Duplication Strategy',
        priority: 'Medium',
        description: 'Create copies of winners to bypass budget constraints.',
        checklist: [
          'Duplicate entire winning campaign with identical settings',
          'Wait 48 hours between launching duplicates',
          'Rename clearly: "Campaign A - Original" vs "Campaign A - Scale 1"',
          'Monitor cannibalization: if combined performance drops, pause duplicates',
          'Works best on large audiences (>1M)',
          'Don\'t duplicate more than 2-3 times (diminishing returns)',
          'Use for quick tests: duplicate, change one variable, compare'
        ],
        why: 'Sometimes Meta won\'t spend your budget even at Target CPA. Duplication forces more spend.',
        expectedImpact: 'Bypass platform spending limitations'
      }
    ]
  }
]

export const advancedStrategies = {
  abTesting: {
    title: 'A/B Testing Framework',
    icon: '🧪',
    sections: [
      {
        title: 'Testing Hierarchy (Priority Order)',
        content: `Test in this order for maximum impact:

**1. Audience (Highest Impact)**
- Different audience = different people seeing ads
- Can change performance by 3-10x
- Example: "Small Business Owners" vs "Marketing Managers"

**2. Offer (High Impact)**
- What you promise: discount, free trial, guarantee
- Can change conversion rate by 2-5x
- Example: "50% Off" vs "Buy One Get One Free"

**3. Creative (Medium Impact)**
- Image, video, ad format
- Can change CTR by 2-3x
- Example: Photo of person vs product screenshot

**4. Copy (Lower Impact)**
- Headlines, body text, CTA
- Can change CTR by 20-50%
- Example: "Get Started Free" vs "Start Your Free Trial"

**Why this order?**
Audience changes WHO sees your ad. Offer changes WHY they should click. Creative/Copy changes HOW you present it. Audience has 10x more impact than copy tweaks.`
      },
      {
        title: 'Statistical Significance',
        content: `Don't call winners too early. Follow these rules:

**Minimum Test Requirements:**
- 100 conversions per variation (200 total for A vs B test)
- OR 95% statistical confidence (use calculator below)
- AND at least 7 days runtime (accounts for weekly patterns)

**Common Mistakes:**
- Calling winner after 20 conversions (not enough data)
- Testing too many variations at once (splits traffic thin)
- Changing test mid-flight (invalidates results)
- Ignoring weekly patterns (weekday vs weekend performance)

**Statistical Significance Calculator:**
Use this formula or online calculator:

If Variation A: 100 conversions from 1000 clicks (10% CVR)
If Variation B: 150 conversions from 1000 clicks (15% CVR)

Is the 15% vs 10% difference real or random luck?
→ Use tool: abtestguide.com/calc/
→ Need p-value < 0.05 (95% confidence)

**Rule of Thumb:**
If you can't get 100 conversions in 14 days, your budget is too small for testing. Focus on proven tactics instead.`
      },
      {
        title: 'Testing Calendar Template',
        content: `What to test each week:

**Week 1: Audience Test**
- Variation A: Interest-based targeting
- Variation B: Lookalike audience 1%
- Budget: $50/day per variation
- Decision criteria: Lower CPA wins

**Week 2: Offer Test**
- Variation A: "20% Off First Order"
- Variation B: "Free Shipping + Gift"
- Budget: $50/day per variation
- Decision criteria: Higher CVR wins

**Week 3: Creative Test**
- Variation A: Video ad (product demo)
- Variation B: Carousel ad (benefits)
- Variation C: Single image (lifestyle)
- Budget: $30/day per variation
- Decision criteria: Higher CTR wins

**Week 4: Copy Test**
- Variation A: Question headline
- Variation B: Benefit-driven headline
- Budget: $50/day per variation
- Decision criteria: Higher CTR + lower CPA wins

**Week 5: Scale Winners**
- Take best performers from Week 1-4
- Increase budget by 20%
- Monitor performance

Repeat cycle monthly. Always be testing.`
      }
    ]
  },
  creativeFatigue: {
    title: 'Creative Fatigue Management',
    icon: '🔄',
    sections: [
      {
        title: 'Fatigue Warning Signs',
        content: `Watch for these signals:

**Metric-Based Signals:**
- Frequency >3.0 (people seeing ad too many times)
- CTR drops >20% week-over-week
- CPA increases >30% week-over-week
- Negative feedback rate increasing

**Time-Based Guidelines:**
- Small audience (<100K): Refresh every 2 weeks
- Medium audience (100K-500K): Refresh every 3-4 weeks
- Large audience (>500K): Refresh every 6-8 weeks

**Platform Differences:**
- Meta: Fatigue fastest (2-4 weeks)
- Google Search: Fatigue slowest (3-6 months)
- TikTok: Fatigue very fast (1-2 weeks)
- LinkedIn: Fatigue moderate (4-6 weeks)`
      },
      {
        title: 'Refresh Strategy',
        content: `How to refresh without disrupting performance:

**Option 1: Controlled Refresh (Recommended)**
- Keep 1 proven ad running (50% of budget)
- Test 2 new variations (25% each)
- After 7 days, kill loser, scale winner
- Never turn off all proven ads at once

**Option 2: Angle Rotation**
Don't just change image, change the message angle:
- Week 1-2: Problem-focused angle
- Week 3-4: Solution-focused angle
- Week 5-6: Social proof angle
- Week 7-8: Urgency angle
- Week 9+: Back to best performer

**Option 3: Format Variation**
Change ad format, keep message:
- Single image → Video
- Video → Carousel
- Carousel → Collection ad
- Static → Animated

**Creative Elements to Test:**
1. Background color/style
2. Person in image (or no person)
3. Text overlay (or no text)
4. Product close-up vs lifestyle shot
5. Before/after vs single state`
      }
    ]
  },
  audienceSegmentation: {
    title: 'Advanced Audience Segmentation',
    icon: '🎯',
    sections: [
      {
        title: 'Customer Journey Stage Targeting',
        content: `Create separate campaigns for each stage:

**Stage 1: Awareness (Cold Traffic)**
- Audience: Interests, lookalikes, broad targeting
- Ad message: Educational, problem-focused
- Goal: Engagement, video views, page visits
- Budget: 30-40% of total

**Stage 2: Consideration (Warm Traffic)**
- Audience: Website visitors, video watchers, post engagers
- Ad message: Solution presentation, benefits, proof
- Goal: Landing page visits, lead magnet downloads
- Budget: 30-40% of total

**Stage 3: Decision (Hot Traffic)**
- Audience: Cart abandoners, product page visitors, email list
- Ad message: Urgency, scarcity, testimonials, guarantees
- Goal: Purchases, signups
- Budget: 20-30% of total

**Why Separate Campaigns?**
- Different messages for different awareness levels
- Budget allocation matches conversion likelihood
- Better tracking and optimization by stage`
      },
      {
        title: 'Retargeting Ladder',
        content: `Progressively stronger offers as people show more interest:

**Rung 1: Homepage Visitors (Lowest Intent)**
- Audience: Visited homepage, spent <30 seconds
- Message: General brand awareness, value props
- Offer: "Learn More", educational content
- Example: "Discover how [product] helps [audience]"

**Rung 2: Content Engagers (Medium Intent)**
- Audience: Read blog, watched video >50%, Instagram engagers
- Message: Specific benefits, use cases
- Offer: Free guide, webinar, tool
- Example: "Download: The Complete [Topic] Guide"

**Rung 3: Product Viewers (High Intent)**
- Audience: Visited product/pricing page, spent 2+ minutes
- Message: Social proof, comparisons, overcome objections
- Offer: Free trial, demo, 10% discount
- Example: "Join 10,000+ companies using [product]"

**Rung 4: Cart Abandoners (Highest Intent)**
- Audience: Added to cart, started checkout, didn't purchase
- Message: Urgency, scarcity, risk reversal
- Offer: 15-20% discount, free shipping, bonus
- Example: "Complete your order - 15% off expires in 24hrs"

**Budget Allocation:**
Rung 1: 20% | Rung 2: 25% | Rung 3: 30% | Rung 4: 25%

**Pro Tip:** Exclude each rung from the one above (e.g., exclude cart abandoners from product viewer campaign). Prevents overlap and wasted impressions.`
      }
    ]
  },
  scaling: {
    title: 'Scaling Playbook',
    icon: '📊',
    sections: [
      {
        title: 'When to Scale (Green Lights)',
        content: `Only scale when you see ALL of these signals:

**Performance Green Lights:**
✅ Campaign running profitably for 14+ days
✅ CPA stable or decreasing (not fluctuating wildly)
✅ ROAS at or above target for 7+ consecutive days
✅ Conversion rate stable week-over-week
✅ Quality of leads/customers is good (if trackable)

**Volume Green Lights:**
✅ Budget fully spent daily (hitting cap)
✅ Impression share >70% (not maxed on audience size)
✅ Still gaining new customers (not oversaturating audience)

**Data Green Lights:**
✅ 50+ conversions in campaign (enough for algorithm learning)
✅ Conversion tracking working correctly
✅ Attribution window set correctly

**If ANY red flags:**
- CPA increasing >20%
- ROAS below target
- Conversion rate dropping
- Quality of customers declining

→ Fix problems BEFORE scaling. Scaling bad campaigns = burning money faster.`
      },
      {
        title: 'How to Scale (Methods)',
        content: `Multiple ways to scale - use combination:

**Method 1: Vertical Scaling (Increase Budget)**
- Increase budget 20% every 3-4 days
- Never double budget overnight
- Example: $100 → $120 → $144 → $173
- Best for: Established campaigns with stable performance

**Method 2: Horizontal Scaling (New Audiences)**
- Duplicate campaign, change audience only
- Test similar/related audiences
- Expand lookalike % (1% → 2% → 5%)
- Best for: When vertical scaling plateaus

**Method 3: Geographic Expansion**
- Start local → expand regional → go national → test international
- Test one geo at a time
- Different geos have different CPAs (factor in)
- Best for: Local businesses or products with broad appeal

**Method 4: Platform Expansion**
- If Google works, test Microsoft Ads (similar audience, lower CPC)
- If Meta works, test Pinterest/TikTok/Snapchat
- Copy winning creative/copy, adjust for platform
- Best for: Diversification and tapping new audiences

**Method 5: Campaign Duplication**
- Duplicate winning campaign entirely
- Run both simultaneously
- Monitor for cannibalization
- Best for: When platform won't spend your budget

**Pro Scaling Schedule:**
- Week 1-2: Vertical scaling (+20% budget)
- Week 3-4: Horizontal scaling (new audiences)
- Week 5-6: Geographic expansion
- Week 7-8: Platform expansion
- Repeat cycle as long as profitable`
      },
      {
        title: 'When NOT to Scale (Red Flags)',
        content: `Stop scaling immediately if:

**Performance Red Flags:**
🚩 CPA increases >30% after scaling
🚩 ROAS drops below breakeven
🚩 Conversion rate drops >25%
🚩 Quality score decreases (Google Ads)
🚩 Negative feedback rate increases (Meta)

**Audience Red Flags:**
🚩 Frequency >5.0 (audience saturation)
🚩 Same people seeing ads over and over
🚩 Running out of new people to reach
🚩 Impression share >95% (maxed out)

**Market Red Flags:**
🚩 Seasonal downturn starting
🚩 Competitor launched major promotion
🚩 Industry crisis or bad press
🚩 Your website/product having issues

**What to Do Instead:**
1. Reduce budget back to profitable level
2. Refresh creative (combat fatigue)
3. Test new audiences (expand reach)
4. Improve landing page (boost conversion rate)
5. Wait for performance to stabilize
6. Then try scaling again slowly

**Remember:** Scaling amplifies everything. If campaign is already struggling, scaling makes it worse. Fix first, then scale.`
      }
    ]
  }
}

export const paidAdsOptimizeTask = {
  id: 'advertising-2',
  name: 'Optimize Paid Advertising Campaigns',
  description: 'AI-powered campaign audit analyzes your ad performance and generates a prioritized optimization roadmap',
  category: 'advertising',
  tier: 'free',
  what: 'Audit your running ad campaigns and get AI-powered recommendations to improve CTR, reduce CPA, and increase ROAS. Input your current metrics (spend, clicks, conversions) and receive a prioritized 30-day optimization plan with specific tactics ranked by impact.',
  why: 'Most advertisers waste 30-50% of their budget on underperforming ads, audiences, and platforms. Without data-driven optimization, you\'re leaving money on the table. Small improvements (2x CTR, 50% lower CPA) can dramatically impact profitability and turn break-even campaigns into winners.',
  how: 'Input metrics from your current campaigns: total spend, clicks, conversions, platforms running on. AI analyzes performance against industry benchmarks, identifies bottlenecks (low CTR? high CPA? poor ROAS?), and generates a ranked action plan: which ads to kill, which to scale, what to test next, and platform-specific optimization tactics.',

  auditWizardForm: auditWizardForm,
  platformOptimizations: platformOptimizations,
  goalPlaybooks: goalPlaybooks,
  advancedStrategies: advancedStrategies,

  customComponent: 'PaidAdsOptimizeMiniApp',
  output: { enabled: false },

  help: {
    examples: [
      {
        scenario: 'Google Ads campaign with high CPC and low Quality Score',
        input: { platforms: ['google'], total_spend: 2000, total_clicks: 400, conversions: 12, main_issue: 'high cost per click' },
        output: 'Optimization audit showing poor Quality Score driving high CPC ($5 avg vs $2-3 benchmark). Prioritized action plan: 1) Tighten ad groups (break 50 keywords into 5 tight groups of 10), 2) Improve ad copy relevance (include target keyword in headline 1), 3) Optimize landing page (add target keyword to H1), 4) Add 20+ negative keywords. Expected impact: 20-30% CPC reduction within 2 weeks, Quality Score 4->7, maintaining conversion rate.'
      },
      {
        scenario: 'Facebook Ads with high spend but poor ROAS',
        input: { platforms: ['meta'], total_spend: 3000, total_clicks: 1500, conversions: 15, revenue: 2250, main_issue: 'low ROAS' },
        output: 'Performance diagnosis: 0.75 ROAS (spending $3K to make $2.25K = losing money). Root cause analysis reveals high CTR (2%) but low landing page conversion (1% vs 3-5% benchmark). Optimization roadmap: 1) Audit landing page (likely mismatch with ad promise), 2) Test 3 new landing page headlines, 3) Add social proof and guarantee, 4) Set up retargeting for 98% who didn\'t convert. Secondary: test lookalike audiences, refresh creative to combat fatigue. Target: 2x ROAS within 30 days by fixing conversion funnel.'
      }
    ],
    commonMistakes: [
      'Optimizing too early - making changes after 2 days and 50 clicks. Wait for statistical significance: minimum 100 clicks per ad variation or 30 conversions per campaign before making decisions.',
      'Changing too many variables at once - simultaneously updating ad copy, targeting, budget, and landing page. Change ONE thing at a time or you won\'t know what worked.',
      'Only looking at clicks - celebrating 5% CTR while ignoring that 0% convert. Optimize for CONVERSIONS and REVENUE, not vanity metrics like impressions or CTR.',
      'Killing ads prematurely - pausing ads after one bad day. Ad performance fluctuates daily. Evaluate over 7-14 day windows, not single days.',
      'Ignoring ad fatigue - running the same creative for 60+ days wondering why performance declined. Refresh creative every 30-45 days as audiences see ads multiple times.',
      'Not testing audiences - setting one audience and never testing alternatives. Continuously test new interest groups, lookalikes at different percentages (1%, 2-3%, 4-5%), and exclude converters.'
    ]
  }
}
