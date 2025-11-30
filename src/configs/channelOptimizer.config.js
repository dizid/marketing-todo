/**
 * Marketing Channel Optimizer Configuration
 *
 * Educational mini-app with 6 channel-specific optimization playbooks
 * No AI needed - all content is pre-written educational material
 */

export const channels = [
  {
    id: 'paid_search',
    name: 'Paid Search',
    icon: '🔍',
    subChannels: ['Google Ads', 'Bing Ads'],
    quickTip: 'Best for high-intent keywords, measurable ROI',

    playbook: {
      commonProblems: [
        {
          title: 'High CPC, Low Conversions',
          cause: 'Broad keywords, poor landing page match',
          solution: {
            steps: [
              'Switch to exact/phrase match keywords',
              'Add 50+ negative keywords',
              'Create ad-specific landing pages (not homepage)',
              'Ensure message match (ad copy = landing page headline)'
            ],
            expectedImprovement: '30-50% better conversion rate'
          }
        },
        {
          title: 'Low Quality Score (Paying Too Much)',
          cause: 'Poor CTR, irrelevant landing pages',
          solution: {
            steps: [
              'Group keywords into tight ad groups (5-10 keywords max)',
              'Write specific ad copy for each ad group',
              'Improve landing page relevance (keyword in headline)',
              'Increase CTR with compelling CTAs'
            ],
            expectedImprovement: '20-40% lower CPC'
          }
        },
        {
          title: 'Wasted Spend on Irrelevant Traffic',
          cause: 'Missing negative keywords',
          solution: {
            steps: [
              'Review search term report weekly',
              'Add negative keywords aggressively',
              'Use negative keyword lists',
              'Exclude informational searches (how to, what is, etc.)'
            ],
            expectedImprovement: '15-25% budget savings'
          }
        }
      ],

      checklist: [
        'Audit keyword match types (use phrase/exact for 80% of budget)',
        'Review negative keywords (add 50+ based on search term report)',
        'Optimize ad copy for CTR (test 3+ variations per ad group)',
        'A/B test landing pages (focus on single CTA)',
        'Set up conversion tracking (if not already done)',
        'Review search term report weekly',
        'Pause low-performing keywords (CTR < 2%)',
        'Increase bids on high-converters (ROAS > target)',
        'Test ad extensions (sitelinks, callouts, structured snippets)',
        'Optimize for mobile (50%+ of traffic)',
        'Schedule ads for peak hours',
        'Geotarget high-value locations',
        'Create separate campaigns for brand vs. non-brand',
        'Set up remarketing campaigns',
        'Review competitor ads (what\'s working for them?)'
      ],

      benchmarks: [
        { metric: 'CTR (Click-Through Rate)', average: '3-5%', target: '4%+', excellent: '8%+' },
        { metric: 'CPC (Cost Per Click)', average: '$5-$15', target: 'Below $10', excellent: 'Below $5' },
        { metric: 'Conversion Rate', average: '5-10%', target: '8%+', excellent: '15%+' },
        { metric: 'Quality Score', average: '6-7', target: '8+', excellent: '9-10' },
        { metric: 'CAC (Customer Acquisition Cost)', average: '$200-$500', target: '< 1/3 of LTV', excellent: '< 1/5 of LTV' },
        { metric: 'ROAS (Return on Ad Spend)', average: '2.0-3.0', target: '3.0+', excellent: '5.0+' }
      ],

      abTests: [
        {
          priority: 'HIGH',
          testName: 'Landing Page Headline',
          description: 'Test problem-focused vs. solution-focused',
          example: '"Tired of manual invoicing?" vs. "Automate invoices in 2 clicks"'
        },
        {
          priority: 'HIGH',
          testName: 'CTA Button Text',
          description: 'Test different call-to-action phrases',
          example: '"Start Free Trial" vs. "See How It Works" vs. "Get Started"'
        },
        {
          priority: 'HIGH',
          testName: 'Ad Copy Emotional Hooks',
          description: 'Test fear-based vs. aspiration-based',
          example: '"Don\'t lose customers" vs. "Delight customers with instant replies"'
        },
        {
          priority: 'MEDIUM',
          testName: 'Keyword Match Types',
          description: 'Test exact match only vs. phrase match',
          example: 'Exact match for control, phrase match for volume'
        },
        {
          priority: 'MEDIUM',
          testName: 'Bid Strategy',
          description: 'Test manual CPC vs. automated bidding',
          example: 'Manual CPC vs. Target CPA vs. Maximize Conversions'
        },
        {
          priority: 'LOW',
          testName: 'Ad Extensions',
          description: 'Test with sitelinks vs. without',
          example: 'Add 4+ sitelinks and measure CTR improvement'
        }
      ],

      tools: [
        {
          category: 'Keyword Research',
          items: [
            { name: 'Google Keyword Planner', price: 'Free', url: 'https://ads.google.com/keywordplanner', description: 'Keyword ideas and search volume' },
            { name: 'Ahrefs Keywords Explorer', price: '$99/mo', url: 'https://ahrefs.com', description: 'Competitive analysis and difficulty scores' },
            { name: 'SEMrush Keyword Magic Tool', price: '$119/mo', url: 'https://semrush.com', description: 'Advanced research and clustering' }
          ]
        },
        {
          category: 'Landing Page Optimization',
          items: [
            { name: 'Unbounce', price: '$90/mo', url: 'https://unbounce.com', description: 'A/B testing platform' },
            { name: 'Hotjar', price: '$39/mo', url: 'https://hotjar.com', description: 'Heatmaps and session recordings' },
            { name: 'Google Optimize', price: 'Free', url: 'https://optimize.google.com', description: 'Basic A/B testing' }
          ]
        },
        {
          category: 'Ad Management',
          items: [
            { name: 'Google Ads Editor', price: 'Free', url: 'https://ads.google.com/home/tools/ads-editor/', description: 'Bulk edits and management' },
            { name: 'Optmyzr', price: '$249/mo', url: 'https://optmyzr.com', description: 'Automated optimizations' }
          ]
        }
      ],

      resources: [
        { type: 'Course', name: 'Google Skillshop - Google Ads Certification', price: 'Free', url: 'https://skillshop.withgoogle.com' },
        { type: 'Course', name: 'PPC University by WordStream', price: 'Free', url: 'https://www.wordstream.com/learn' },
        { type: 'Book', name: 'Ultimate Guide to Google Ads by Perry Marshall', price: '$25', url: 'https://www.amazon.com/dp/1599186217' },
        { type: 'Blog', name: 'WordStream Blog', price: 'Free', url: 'https://www.wordstream.com/blog' },
        { type: 'Blog', name: 'Search Engine Land - PPC', price: 'Free', url: 'https://searchengineland.com/ppc' }
      ]
    }
  },

  {
    id: 'social_ads',
    name: 'Social Ads',
    icon: '📱',
    subChannels: ['Meta/Facebook', 'Instagram', 'LinkedIn', 'TikTok', 'X/Twitter'],
    quickTip: 'Best for audience targeting, brand awareness',

    playbook: {
      commonProblems: [
        {
          title: 'High CPM, Low Engagement',
          cause: 'Poor creative, wrong audience',
          solution: {
            steps: [
              'Create scroll-stopping visuals (pattern interrupt)',
              'Test video vs. static images (video usually wins)',
              'Use Lookalike audiences based on customers',
              'Narrow targeting to 500K-2M audience size'
            ],
            expectedImprovement: '40-60% lower CPM'
          }
        },
        {
          title: 'Ad Fatigue (Declining Performance)',
          cause: 'Same creative running too long',
          solution: {
            steps: [
              'Rotate creatives every 2 weeks',
              'Create 5+ variations per campaign',
              'Monitor frequency (keep < 3)',
              'Refresh ad copy and images regularly'
            ],
            expectedImprovement: 'Maintain consistent performance'
          }
        },
        {
          title: 'Poor Targeting (Wrong Audience)',
          cause: 'Too broad or too narrow',
          solution: {
            steps: [
              'Start with Lookalike audiences (1-3%)',
              'Exclude existing customers (unless remarketing)',
              'Test interest-based vs. behavior-based targeting',
              'Use custom audiences from website visitors'
            ],
            expectedImprovement: '2-3x better conversion rate'
          }
        }
      ],

      checklist: [
        'Define clear audience personas',
        'Use Lookalike audiences (based on customers)',
        'Test 3-5 creative variations per campaign',
        'Rotate creatives every 2 weeks',
        'A/B test single image vs. carousel vs. video',
        'Write scroll-stopping copy (pattern interrupt)',
        'Use social proof (testimonials, user counts)',
        'Optimize for specific objectives (conversions, not clicks)',
        'Set up Facebook Pixel / LinkedIn Insight Tag',
        'Exclude existing customers (unless remarketing)',
        'Test different placements (Feed, Stories, Reels)',
        'Analyze top-performing posts organically',
        'Create platform-specific content (don\'t repost everywhere)',
        'Monitor frequency (< 3 is ideal)',
        'Scale winners gradually (20% budget increase max)'
      ],

      benchmarks: [
        { metric: 'CPM (Cost Per 1000 Impressions)', average: '$5-$15', target: 'Below $10', excellent: 'Below $5' },
        { metric: 'CTR (Click-Through Rate)', average: '1-2%', target: '2%+', excellent: '3%+' },
        { metric: 'CPC (Cost Per Click)', average: '$0.50-$3', target: 'Below $1.50', excellent: 'Below $1' },
        { metric: 'Conversion Rate', average: '2-5%', target: '5%+', excellent: '10%+' },
        { metric: 'ROAS (Return on Ad Spend)', average: '2.0-4.0', target: '4.0+', excellent: '6.0+' },
        { metric: 'Frequency', average: '2-4', target: '< 3', excellent: '< 2' }
      ],

      abTests: [
        {
          priority: 'HIGH',
          testName: 'Image vs. Video',
          description: 'Test static image vs. video creative',
          example: 'Static product image vs. 15-second demo video'
        },
        {
          priority: 'HIGH',
          testName: 'Headline Hooks',
          description: 'Test different opening hooks',
          example: '"Stop scrolling!" vs. "Tired of X?" vs. "Discover how..."'
        },
        {
          priority: 'HIGH',
          testName: 'CTA Types',
          description: 'Test different call-to-action styles',
          example: '"Learn More" vs. "Shop Now" vs. "Get Started"'
        },
        {
          priority: 'MEDIUM',
          testName: 'Audience Segments',
          description: 'Test different targeting criteria',
          example: 'Interest-based vs. Lookalike vs. Custom audiences'
        },
        {
          priority: 'MEDIUM',
          testName: 'Ad Formats',
          description: 'Test carousel vs. single image vs. collection',
          example: '5-image carousel vs. hero image'
        },
        {
          priority: 'LOW',
          testName: 'Social Proof',
          description: 'Test with/without testimonials',
          example: 'Generic ad vs. customer testimonial overlay'
        }
      ],

      tools: [
        {
          category: 'Ad Management',
          items: [
            { name: 'Meta Ads Manager', price: 'Free', url: 'https://business.facebook.com/adsmanager', description: 'Manage Facebook & Instagram ads' },
            { name: 'AdEspresso', price: '$49/mo', url: 'https://adespresso.com', description: 'Simplify Meta ads A/B testing' },
            { name: 'LinkedIn Campaign Manager', price: 'Free', url: 'https://business.linkedin.com/marketing-solutions/ads', description: 'B2B advertising platform' }
          ]
        },
        {
          category: 'Creative Tools',
          items: [
            { name: 'Canva', price: 'Free-$13/mo', url: 'https://canva.com', description: 'Design tool for social graphics' },
            { name: 'CapCut', price: 'Free', url: 'https://capcut.com', description: 'Video editing for social' },
            { name: 'Loom', price: 'Free-$12/mo', url: 'https://loom.com', description: 'Quick video creation' }
          ]
        },
        {
          category: 'Analytics',
          items: [
            { name: 'Facebook Pixel Helper', price: 'Free', url: 'https://chrome.google.com/webstore', description: 'Debug pixel tracking' },
            { name: 'Sprout Social', price: '$249/mo', url: 'https://sproutsocial.com', description: 'Social analytics and reporting' }
          ]
        }
      ],

      resources: [
        { type: 'Course', name: 'Meta Blueprint Certification', price: 'Free', url: 'https://www.facebook.com/business/learn' },
        { type: 'Course', name: 'LinkedIn Marketing Labs', price: 'Free', url: 'https://business.linkedin.com/marketing-solutions/marketing-labs' },
        { type: 'Blog', name: 'Jon Loomer Blog', price: 'Free', url: 'https://www.jonloomer.com/blog/' },
        { type: 'YouTube', name: 'Ben Heath - Facebook Ads', price: 'Free', url: 'https://youtube.com/@BenHeath' },
        { type: 'Book', name: 'Ultimate Guide to Social Media Marketing', price: '$20', url: 'https://www.amazon.com/dp/1599186330' }
      ]
    }
  },

  {
    id: 'email',
    name: 'Email Marketing',
    icon: '✉️',
    subChannels: ['Newsletters', 'Sequences', 'Campaigns'],
    quickTip: 'Highest ROI channel, requires list building',

    playbook: {
      commonProblems: [
        {
          title: 'Low Open Rates',
          cause: 'Poor subject lines, wrong send times',
          solution: {
            steps: [
              'A/B test subject lines (aim for 40-50% open rate)',
              'Send at optimal times (Tuesday-Thursday, 10am-11am)',
              'Personalize beyond first name',
              'Keep subject lines under 50 characters'
            ],
            expectedImprovement: '20-30% higher open rates'
          }
        },
        {
          title: 'High Unsubscribe Rates',
          cause: 'Too frequent, not valuable',
          solution: {
            steps: [
              'Reduce send frequency (2-4x per month)',
              'Segment your list (send relevant content)',
              'Provide value in every email',
              'Let subscribers choose frequency'
            ],
            expectedImprovement: '50% fewer unsubscribes'
          }
        },
        {
          title: 'Deliverability Issues',
          cause: 'Spam folder, bounces',
          solution: {
            steps: [
              'Set up SPF, DKIM, DMARC',
              'Warm up new domains gradually',
              'Clean your list quarterly',
              'Avoid spam trigger words'
            ],
            expectedImprovement: '15-25% better deliverability'
          }
        }
      ],

      checklist: [
        'Segment your list (behavior, interests, purchase history)',
        'Personalize beyond first name (product usage, preferences)',
        'A/B test subject lines (aim for 40-50% open rate)',
        'Optimize preview text',
        'Send at optimal times (Tuesday-Thursday, 10am-11am)',
        'Keep emails focused (one goal per email)',
        'Use clear CTAs (buttons, not links)',
        'Optimize for mobile (60%+ open on mobile)',
        'Set up welcome sequence (5-7 emails)',
        'Re-engage inactive subscribers',
        'Clean your list quarterly (remove non-openers)',
        'Monitor deliverability (SPF, DKIM, DMARC)',
        'Avoid spam triggers (all caps, excessive exclamation marks)',
        'Test send frequency (2-4x per month is typical)',
        'Track conversions, not just opens'
      ],

      benchmarks: [
        { metric: 'Open Rate', average: '20-30%', target: '30%+', excellent: '40%+' },
        { metric: 'Click-Through Rate', average: '2-5%', target: '5%+', excellent: '10%+' },
        { metric: 'Conversion Rate', average: '1-3%', target: '3%+', excellent: '5%+' },
        { metric: 'Unsubscribe Rate', average: '0.2-0.5%', target: '< 0.3%', excellent: '< 0.1%' },
        { metric: 'Deliverability', average: '85-95%', target: '95%+', excellent: '98%+' },
        { metric: 'ROI', average: '$36 per $1', target: '$40+', excellent: '$50+' }
      ],

      abTests: [
        {
          priority: 'HIGH',
          testName: 'Subject Lines',
          description: 'Test different subject line styles',
          example: 'Question vs. Benefit vs. Curiosity gap'
        },
        {
          priority: 'HIGH',
          testName: 'Send Times',
          description: 'Test different days and times',
          example: 'Tuesday 10am vs. Thursday 2pm'
        },
        {
          priority: 'MEDIUM',
          testName: 'Email Length',
          description: 'Test short vs. long format',
          example: '100 words vs. 500 words'
        },
        {
          priority: 'MEDIUM',
          testName: 'CTA Placement',
          description: 'Test button position in email',
          example: 'Top vs. Middle vs. Bottom'
        },
        {
          priority: 'LOW',
          testName: 'Personalization',
          description: 'Test generic vs. personalized',
          example: '"Hi there" vs. "Hi [First Name]"'
        }
      ],

      tools: [
        {
          category: 'Email Platforms',
          items: [
            { name: 'Mailchimp', price: 'Free-$350/mo', url: 'https://mailchimp.com', description: 'All-in-one email marketing' },
            { name: 'ConvertKit', price: '$29/mo', url: 'https://convertkit.com', description: 'Email for creators' },
            { name: 'ActiveCampaign', price: '$29/mo', url: 'https://activecampaign.com', description: 'Marketing automation' }
          ]
        },
        {
          category: 'Design & Testing',
          items: [
            { name: 'Litmus', price: '$99/mo', url: 'https://litmus.com', description: 'Email preview and testing' },
            { name: 'Really Good Emails', price: 'Free', url: 'https://reallygoodemails.com', description: 'Email design inspiration' }
          ]
        }
      ],

      resources: [
        { type: 'Course', name: 'Email Marketing Mastery by Copyhackers', price: '$299', url: 'https://copyhackers.com' },
        { type: 'Blog', name: 'Mailchimp Email Marketing Guide', price: 'Free', url: 'https://mailchimp.com/resources/' },
        { type: 'Book', name: 'Email Persuasion by Ian Brodie', price: '$15', url: 'https://www.amazon.com/dp/1781330719' },
        { type: 'Newsletter', name: 'Really Good Emails Newsletter', price: 'Free', url: 'https://reallygoodemails.com/newsletter' }
      ]
    }
  },

  {
    id: 'content_seo',
    name: 'Content / SEO',
    icon: '📝',
    subChannels: ['Blog', 'YouTube', 'SEO'],
    quickTip: 'Long-term investment, compounds over time',

    playbook: {
      commonProblems: [
        {
          title: 'No Organic Traffic',
          cause: 'Not ranking for keywords',
          solution: {
            steps: [
              'Target long-tail keywords (lower competition)',
              'Focus on 50+ keywords systematically',
              'Build backlinks (guest posts, outreach)',
              'Optimize title tags and meta descriptions'
            ],
            expectedImprovement: '3-6 months to see results'
          }
        },
        {
          title: 'High Bounce Rate',
          cause: 'Content doesn\'t match search intent',
          solution: {
            steps: [
              'Analyze top-ranking pages (what do they cover?)',
              'Match content format to intent',
              'Add table of contents for long posts',
              'Improve page speed (< 3 seconds)'
            ],
            expectedImprovement: '30-40% lower bounce rate'
          }
        },
        {
          title: 'Slow Growth',
          cause: 'SEO takes time, not enough content',
          solution: {
            steps: [
              'Publish 2-4 posts per week consistently',
              'Create content clusters (pillar + supporting posts)',
              'Update old content quarterly',
              'Repurpose content (blog → video → social)'
            ],
            expectedImprovement: 'Exponential growth after 6-12 months'
          }
        }
      ],

      checklist: [
        'Conduct keyword research (target 50+ keywords)',
        'Focus on long-tail keywords (lower competition)',
        'Optimize title tags (keyword + benefit)',
        'Write compelling meta descriptions (150-160 chars)',
        'Use header tags properly (H1, H2, H3)',
        'Include keywords naturally (no stuffing)',
        'Add internal links (3-5 per post)',
        'Build backlinks (guest posts, outreach)',
        'Optimize images (alt text, compression)',
        'Improve page speed (< 3 seconds)',
        'Make content scannable (short paragraphs, bullets)',
        'Update old content quarterly',
        'Create content clusters (pillar + supporting posts)',
        'Monitor Search Console (fix errors, see rankings)',
        'Repurpose content (blog → video → social)'
      ],

      benchmarks: [
        { metric: 'Organic Traffic', average: '100-1K visits/mo', target: '1K+', excellent: '10K+' },
        { metric: 'Keyword Rankings', average: '10-50 keywords in top 10', target: '50+', excellent: '100+' },
        { metric: 'Backlinks', average: '10-100', target: '100+', excellent: '500+' },
        { metric: 'Domain Authority', average: '20-40', target: '40+', excellent: '60+' },
        { metric: 'CTR in SERPs', average: '3-5%', target: '5%+', excellent: '10%+' },
        { metric: 'Average Time on Page', average: '1-2 minutes', target: '2+', excellent: '3+' }
      ],

      abTests: [
        {
          priority: 'HIGH',
          testName: 'Headline Formats',
          description: 'Test different headline styles',
          example: 'How to X vs. X Ways to Y vs. Ultimate Guide to X'
        },
        {
          priority: 'MEDIUM',
          testName: 'Content Length',
          description: 'Test short vs. comprehensive',
          example: '500 words vs. 2000+ words'
        },
        {
          priority: 'MEDIUM',
          testName: 'Multimedia',
          description: 'Test text-only vs. images/videos',
          example: 'Add 5+ images and embedded videos'
        },
        {
          priority: 'LOW',
          testName: 'CTA Placement',
          description: 'Test CTA position in content',
          example: 'Top vs. Middle vs. Bottom vs. Multiple'
        }
      ],

      tools: [
        {
          category: 'SEO Tools',
          items: [
            { name: 'Ahrefs', price: '$99/mo', url: 'https://ahrefs.com', description: 'Backlinks, keywords, competitor analysis' },
            { name: 'SEMrush', price: '$119/mo', url: 'https://semrush.com', description: 'All-in-one SEO toolkit' },
            { name: 'Google Search Console', price: 'Free', url: 'https://search.google.com/search-console', description: 'Monitor rankings and errors' }
          ]
        },
        {
          category: 'Content Creation',
          items: [
            { name: 'Grammarly', price: 'Free-$30/mo', url: 'https://grammarly.com', description: 'Writing assistant' },
            { name: 'Hemingway Editor', price: 'Free', url: 'https://hemingwayapp.com', description: 'Readability checker' },
            { name: 'Yoast SEO', price: 'Free', url: 'https://yoast.com', description: 'WordPress SEO plugin' }
          ]
        }
      ],

      resources: [
        { type: 'Course', name: 'Ahrefs Academy', price: 'Free', url: 'https://ahrefs.com/academy' },
        { type: 'Course', name: 'SEMrush Academy', price: 'Free', url: 'https://www.semrush.com/academy/' },
        { type: 'Blog', name: 'Backlinko Blog', price: 'Free', url: 'https://backlinko.com/blog' },
        { type: 'Book', name: 'SEO 2024 by Adam Clarke', price: '$17', url: 'https://www.amazon.com/dp/1916207146' },
        { type: 'YouTube', name: 'Ahrefs YouTube Channel', price: 'Free', url: 'https://youtube.com/@AhrefsCom' }
      ]
    }
  },

  {
    id: 'referrals',
    name: 'Referrals',
    icon: '🤝',
    subChannels: ['Referral Program', 'Partnerships', 'Affiliates'],
    quickTip: 'Low cost, high trust, requires incentive structure',

    playbook: {
      commonProblems: [
        {
          title: 'Low Referral Rates',
          cause: 'No incentive or too complex',
          solution: {
            steps: [
              'Offer double-sided incentives (reward both parties)',
              'Make sharing 1-click easy',
              'Promote referral program everywhere',
              'Automate rewards (no manual processing)'
            ],
            expectedImprovement: '5-10x more referrals'
          }
        },
        {
          title: 'Hard to Track',
          cause: 'No system in place',
          solution: {
            steps: [
              'Use unique referral links/codes',
              'Set up automated tracking',
              'Send confirmation emails',
              'Display referral dashboard'
            ],
            expectedImprovement: '100% visibility into referrals'
          }
        },
        {
          title: 'Limited Reach',
          cause: 'Not promoting referral program',
          solution: {
            steps: [
              'Add to email signature',
              'Prompt after positive experiences',
              'Feature in dashboard',
              'Send monthly reminders'
            ],
            expectedImprovement: '3-5x more participation'
          }
        }
      ],

      checklist: [
        'Design clear incentive structure (double-sided is best)',
        'Make sharing easy (1-click, pre-filled messages)',
        'Promote referral program everywhere',
        'Track referrals properly (unique links, codes)',
        'Automate rewards (no manual processing)',
        'Thank referrers publicly (testimonials, case studies)',
        'Create tiered rewards (more referrals = bigger rewards)',
        'Set up email reminders (trigger after positive experiences)',
        'A/B test incentive types (cash, credit, free months)',
        'Partner with complementary products (co-marketing)',
        'Run referral contests (monthly leaderboards)',
        'Monitor fraud (fake referrals, self-referrals)'
      ],

      benchmarks: [
        { metric: 'Referral Rate', average: '2-5%', target: '5%+', excellent: '10%+' },
        { metric: 'Referred Customer LTV', average: '1.5x higher', target: '2x+', excellent: '3x+' },
        { metric: 'Viral Coefficient', average: '0.2-0.5', target: '0.5+', excellent: '1.0+' },
        { metric: 'Program Participation', average: '5-10%', target: '10%+', excellent: '20%+' },
        { metric: 'Conversion Rate', average: '20-30%', target: '30%+', excellent: '50%+' }
      ],

      abTests: [
        {
          priority: 'HIGH',
          testName: 'Incentive Types',
          description: 'Test different reward structures',
          example: 'Cash vs. Credit vs. Free month'
        },
        {
          priority: 'HIGH',
          testName: 'Reward Amounts',
          description: 'Test incentive value',
          example: '$10 vs. $25 vs. $50'
        },
        {
          priority: 'MEDIUM',
          testName: 'Messaging',
          description: 'Test referral request copy',
          example: '"Refer a friend" vs. "Share and earn"'
        },
        {
          priority: 'LOW',
          testName: 'Timing of Ask',
          description: 'Test when to prompt for referrals',
          example: 'After signup vs. After success moment'
        }
      ],

      tools: [
        {
          category: 'Referral Platforms',
          items: [
            { name: 'ReferralCandy', price: '$49/mo', url: 'https://referralcandy.com', description: 'E-commerce referral program' },
            { name: 'Viral Loops', price: '$49/mo', url: 'https://viral-loops.com', description: 'Referral and viral marketing' },
            { name: 'PartnerStack', price: '$500/mo', url: 'https://partnerstack.com', description: 'B2B partnership platform' }
          ]
        },
        {
          category: 'Tracking',
          items: [
            { name: 'Rewardful', price: '$49/mo', url: 'https://rewardful.com', description: 'Affiliate tracking for Stripe' },
            { name: 'Ambassador', price: 'Custom', url: 'https://getambassador.com', description: 'Enterprise referral management' }
          ]
        }
      ],

      resources: [
        { type: 'Book', name: 'Referral Engine by John Jantsch', price: '$18', url: 'https://www.amazon.com/dp/1591843111' },
        { type: 'Blog', name: 'Referral Rock Blog', price: 'Free', url: 'https://referralrock.com/blog/' },
        { type: 'Case Study', name: 'Dropbox Referral Program', price: 'Free', url: 'https://referralcandy.com/blog/dropbox-referral-program/' }
      ]
    }
  },

  {
    id: 'organic_social',
    name: 'Organic Social',
    icon: '👥',
    subChannels: ['X/Twitter', 'LinkedIn', 'Instagram', 'TikTok'],
    quickTip: 'Free but time-intensive, builds community',

    playbook: {
      commonProblems: [
        {
          title: 'Low Engagement',
          cause: 'Posting without strategy',
          solution: {
            steps: [
              'Post consistently (3-5x per week)',
              'Engage with your audience daily',
              'Share behind-the-scenes content',
              'Run polls and ask questions'
            ],
            expectedImprovement: '2-3x higher engagement'
          }
        },
        {
          title: 'Slow Growth',
          cause: 'Not using growth tactics',
          solution: {
            steps: [
              'Use platform-specific best practices',
              'Collaborate with others (shoutouts)',
              'Use Stories/Reels (higher reach)',
              'Cross-promote across platforms'
            ],
            expectedImprovement: '5-10x faster growth'
          }
        },
        {
          title: 'Time-Consuming',
          cause: 'No content calendar',
          solution: {
            steps: [
              'Create content calendar (plan 2 weeks ahead)',
              'Batch content creation (1 day per week)',
              'Use scheduling tools (Buffer, Hootsuite)',
              'Repurpose content across platforms'
            ],
            expectedImprovement: '50% time savings'
          }
        }
      ],

      checklist: [
        'Post consistently (3-5x per week minimum)',
        'Create content calendar (plan 2 weeks ahead)',
        'Use platform-specific best practices',
        'Engage with your audience daily (reply to comments)',
        'Share behind-the-scenes content (humanize brand)',
        'Use hashtags strategically (mix of popular + niche)',
        'Post at optimal times (when audience is active)',
        'Cross-promote across platforms (but adapt content)',
        'Share user-generated content',
        'Run polls and ask questions (boost engagement)',
        'Collaborate with others (shoutouts, takeovers)',
        'Analyze top-performing posts (double down)',
        'Use Stories/Reels (higher reach than feed)',
        'Pin/highlight best content',
        'Track growth and engagement metrics weekly'
      ],

      benchmarks: [
        { metric: 'Follower Growth Rate', average: '2-5%/month', target: '5%+', excellent: '10%+' },
        { metric: 'Engagement Rate', average: '1-3%', target: '3%+', excellent: '5%+' },
        { metric: 'Reach', average: '10-30% of followers', target: '30%+', excellent: '50%+' },
        { metric: 'Share Rate', average: '0.5-1%', target: '1%+', excellent: '3%+' },
        { metric: 'Comment Rate', average: '0.5-1%', target: '1%+', excellent: '2%+' }
      ],

      abTests: [
        {
          priority: 'HIGH',
          testName: 'Post Types',
          description: 'Test different content formats',
          example: 'Text vs. Image vs. Video vs. Carousel'
        },
        {
          priority: 'HIGH',
          testName: 'Posting Times',
          description: 'Test different days and times',
          example: 'Weekday mornings vs. Weekend evenings'
        },
        {
          priority: 'MEDIUM',
          testName: 'Captions',
          description: 'Test short vs. long captions',
          example: '1 sentence vs. Storytelling paragraph'
        },
        {
          priority: 'LOW',
          testName: 'Hashtags',
          description: 'Test number of hashtags',
          example: '3 hashtags vs. 10 hashtags vs. 30'
        }
      ],

      tools: [
        {
          category: 'Scheduling',
          items: [
            { name: 'Buffer', price: 'Free-$120/mo', url: 'https://buffer.com', description: 'Schedule posts across platforms' },
            { name: 'Hootsuite', price: '$99/mo', url: 'https://hootsuite.com', description: 'Social media management' },
            { name: 'Later', price: 'Free-$80/mo', url: 'https://later.com', description: 'Visual Instagram planner' }
          ]
        },
        {
          category: 'Content Creation',
          items: [
            { name: 'Canva', price: 'Free-$13/mo', url: 'https://canva.com', description: 'Design social graphics' },
            { name: 'CapCut', price: 'Free', url: 'https://capcut.com', description: 'Video editing' },
            { name: 'Unsplash', price: 'Free', url: 'https://unsplash.com', description: 'Free stock photos' }
          ]
        },
        {
          category: 'Analytics',
          items: [
            { name: 'Sprout Social', price: '$249/mo', url: 'https://sproutsocial.com', description: 'Social analytics' }
          ]
        }
      ],

      resources: [
        { type: 'Course', name: 'HubSpot Social Media Marketing', price: 'Free', url: 'https://academy.hubspot.com' },
        { type: 'Blog', name: 'Buffer Blog', price: 'Free', url: 'https://buffer.com/resources/' },
        { type: 'Book', name: 'Jab, Jab, Jab, Right Hook by Gary Vaynerchuk', price: '$18', url: 'https://www.amazon.com/dp/006227306X' },
        { type: 'Newsletter', name: 'Social Media Examiner', price: 'Free', url: 'https://www.socialmediaexaminer.com/newsletter/' }
      ]
    }
  }
]

export const channelOptimizerTask = {
  id: 'analytics-2',
  name: 'Optimize Marketing Channels',
  description: 'Learn channel-specific optimization strategies with actionable playbooks and tools.',
  category: 'analytics',
  tier: 'free',

  // Advanced task - hidden by default in "Add Tasks Back" section
  removed: true,

  // Educational tool - no data collection
  what: 'Learn how to optimize 6 major marketing channels (Paid Search, Social Ads, Email, Content/SEO, Referrals, Organic Social) with comprehensive playbooks, checklists, and tool recommendations.',
  why: 'Each marketing channel has unique optimization strategies. Generic advice doesn\'t work. This tool provides channel-specific, actionable guidance to improve performance without needing to input any data.',
  how: 'Select the channels you use, read detailed optimization playbooks for each, and apply the checklists and A/B test ideas to your campaigns.',

  // Use custom multi-tab component
  customComponent: 'ChannelOptimizerMiniApp',
  type: 'multi-tab',

  // All playbook content
  channels: channels,

  // No AI needed - all content is pre-written
  ai: null,

  output: {
    enabled: false
  },

  help: {
    examples: [
      {
        scenario: 'Improving paid search campaigns with low Quality Score',
        input: { channel: 'paid_search', issue: 'high CPC, low quality score' },
        output: 'Step-by-step playbook to group keywords into tight ad groups (5-10 per group), write specific ad copy matching each group, improve landing page relevance with keyword in headline, and strategies to increase CTR. Expected 20-40% lower CPC within 2-3 weeks.'
      },
      {
        scenario: 'Boosting email open rates and reducing unsubscribes',
        input: { channel: 'email', issue: 'low open rates, high unsubscribe rate' },
        output: 'Optimization checklist including A/B testing subject lines, reducing send frequency from daily to 2-4x per month, segmenting list by behavior and interests, personalizing beyond first name, and cleaning list quarterly. Benchmarks: target 30%+ open rate, under 0.3% unsubscribe rate.'
      }
    ],
    commonMistakes: [
      'Trying to optimize all channels at once - spreading effort across 6 channels means slow progress everywhere. Pick ONE channel, optimize it to profitability, then move to the next.',
      'Copying best practices blindly - what works for competitors might not work for you. Test everything. Your audience, offer, and market position are unique.',
      'Not giving optimizations enough time - changing your email strategy and checking results after 2 days. Most optimizations need 2-4 weeks to show meaningful results.',
      'Optimizing for the wrong metric - improving click-through rate but not tracking if clicks convert to sales. Always optimize for REVENUE or CONVERSIONS, not vanity metrics.',
      'Ignoring the 80/20 rule - spending time optimizing channels that drive 5% of revenue. Focus optimization efforts on your top 1-2 revenue-driving channels first.',
      'Not using the recommended tools - trying to manually track everything in spreadsheets when specialized tools exist. Invest in proper channel-specific tools for better insights and automation.'
    ]
  }
}
