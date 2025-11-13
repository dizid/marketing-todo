/**
 * Paid Advertising Launch Configuration
 * Help users quickly setup their first ad campaigns with AI-powered recommendations
 */

export const adPlatforms = [
  {
    id: 'google-ads',
    name: 'Google Ads',
    icon: '🔍',
    types: ['Search', 'Display', 'Shopping'],
    bestFor: ['B2B SaaS', 'E-commerce', 'Service businesses', 'High-intent purchases'],
    minBudget: 500,
    difficulty: 'Intermediate',

    overview: {
      description: 'Reach people actively searching for solutions like yours. Highest intent, best for immediate conversions.',
      avgCPC: '$1-5',
      avgConversion: '2-5%',
      timeToResults: '1-2 weeks'
    },

    setupGuide: {
      steps: [
        {
          title: 'Create Google Ads account',
          description: 'Go to ads.google.com → Sign up with your business email. Skip the "Smart Campaign" push - choose "Switch to Expert Mode" for full control.'
        },
        {
          title: 'Install conversion tracking',
          description: 'In Google Ads: Tools → Conversions → New conversion action. Choose "Website" → "Sign up" or "Purchase". Install the tracking code on your thank-you page. THIS IS CRITICAL - you can\'t optimize without it.'
        },
        {
          title: 'Keyword research',
          description: 'Use Google Keyword Planner (free in Ads account). Enter your product category + problem. Export 15-20 keywords with search volume >100/month and CPC <$5. Focus on buyer-intent terms (e.g., "best [solution]", "[problem] software").'
        },
        {
          title: 'Create Search campaign',
          description: 'New Campaign → Sales/Leads goal → Search campaign. Set daily budget (monthly ÷ 30). Choose "Manual CPC" bidding. Target your country/region. Set up 2-3 ad groups by theme (e.g., "Problem keywords", "Solution keywords", "Competitor keywords").'
        },
        {
          title: 'Write 3-5 ad variations',
          description: 'Each ad needs: Headline 1 (include keyword), Headline 2 (benefit), Headline 3 (CTA), Description 1 (value prop), Description 2 (differentiator). Use URL parameters to track which ad performed best. Enable "Responsive Search Ads" for automatic optimization.'
        },
        {
          title: 'Set up negative keywords',
          description: 'Add negative keywords to avoid wasted spend: "free", "cheap", "jobs", "download", "DIY". Check Search Terms report weekly and add irrelevant terms as negatives.'
        },
        {
          title: 'Launch and monitor daily',
          description: 'Launch at full budget. Check performance daily for first week. Look for: CTR >1.5%, CPC <your target, Quality Score >5. Pause ads with CTR <0.5% after 100 impressions. Scale winners.'
        }
      ],

      targeting: {
        keywords: 'Focus on buyer-intent keywords with search volume. Avoid broad match - use phrase match and exact match.',
        audiences: 'In-market audiences (people actively researching), Custom intent (based on search behavior), Remarketing (website visitors)',
        locations: 'Start with your top 2-3 cities/regions. Expand after validating conversions.'
      },

      creativeGuidelines: {
        headlines: [
          'Include your main keyword in Headline 1',
          'Lead with the #1 benefit in Headline 2',
          'Add urgency or social proof in Headline 3',
          'Keep headlines under 30 characters for mobile'
        ],
        descriptions: [
          'First sentence: Unique value proposition',
          'Second sentence: How it works or key differentiator',
          'Include a clear CTA: "Start Free Trial", "Get Quote", "Shop Now"',
          'Use ad extensions: Sitelinks, Callouts, Structured snippets'
        ]
      },

      budgetGuidance: [
        {
          budget: 500,
          allocation: 'Start with Search only. 1-2 ad groups. 10-15 keywords. $16-17/day. Test for 30 days.',
          expectedResults: '300-500 clicks, 6-15 conversions (at 2-3% CR)',
          timeline: 'Week 1-2: Testing. Week 3-4: Optimize top performers.'
        },
        {
          budget: 1000,
          allocation: 'Search primary ($700), Display remarketing ($300). 3-4 ad groups. 20-30 keywords.',
          expectedResults: '600-1000 clicks, 15-30 conversions',
          timeline: 'Week 1-2: Search testing. Week 3-4: Add Display for visitors who didn\'t convert.'
        },
        {
          budget: 3000,
          allocation: 'Search ($1800), Shopping ($800 if e-commerce), Display remarketing ($400).',
          expectedResults: '1800-3000 clicks, 45-90 conversions',
          timeline: 'Full funnel approach. Scale what works weekly.'
        },
        {
          budget: 10000,
          allocation: 'Search ($5000), Shopping ($2500), Display/YouTube ($2500). Multiple campaigns by product/service.',
          expectedResults: '6000-10000 clicks, 150-300 conversions',
          timeline: 'Aggressive scaling. A/B test everything. Hire specialist if needed.'
        }
      ],

      commonMistakes: [
        'Using Broad Match keywords → Wasted spend on irrelevant searches',
        'No conversion tracking → Flying blind, can\'t optimize',
        'Sending traffic to homepage → Use dedicated landing pages',
        'Ignoring Quality Score → Low QS = higher CPC',
        'Not using negative keywords → 20-30% of spend wasted',
        'Pausing campaigns too early → Need 100+ clicks to evaluate'
      ],

      successMetrics: {
        good: 'CTR >2%, Quality Score >7, CPC <$3 (B2B) or <$1.50 (e-commerce), Conversion rate >3%',
        bad: 'CTR <0.5%, Quality Score <3, CPC >$10, Zero conversions after $500 spend',
        action: 'If underperforming after 2 weeks and $500 spend, pause and reassess keywords/ad copy.'
      }
    }
  },

  {
    id: 'meta-ads',
    name: 'Meta Ads (Facebook & Instagram)',
    icon: '📱',
    types: ['Feed', 'Stories', 'Reels'],
    bestFor: ['E-commerce', 'B2C services', 'Visual products', 'Brand awareness'],
    minBudget: 300,
    difficulty: 'Beginner',

    overview: {
      description: 'Target by demographics, interests, and behaviors. Great for discovery and retargeting. Visual-first approach.',
      avgCPC: '$0.50-2',
      avgConversion: '1-3%',
      timeToResults: '1-2 weeks'
    },

    setupGuide: {
      steps: [
        {
          title: 'Create Meta Business Suite account',
          description: 'Go to business.facebook.com → Create Account. Connect your Facebook Page and Instagram account. This is free and required for running ads.'
        },
        {
          title: 'Install Meta Pixel',
          description: 'In Business Suite: All Tools → Events Manager → Add Events → Meta Pixel. Copy pixel code and paste in your website\'s <head> tag. Set up "Purchase" or "Lead" events. Test with Pixel Helper extension.'
        },
        {
          title: 'Build your first audience',
          description: 'Ads Manager → Audiences → Create New. Options: Demographic (age, location, gender), Detailed Targeting (interests, behaviors), Lookalike (upload customer list). Start with: Location + Age range + 3-5 interests.'
        },
        {
          title: 'Create campaign',
          description: 'Ads Manager → Create → Choose objective: Traffic (website visits), Conversions (purchases/signups), or Engagement. Set budget: Daily or Lifetime. Start with $10-20/day for testing.'
        },
        {
          title: 'Design ad creative',
          description: 'Use Canva or design tool for images (1080x1080 square). Video performs 2x better (15-30 seconds). Primary text: 125 characters. Headline: 40 characters. Show product in action, not just logo.'
        },
        {
          title: 'Write compelling copy',
          description: 'Hook in first sentence (problem or benefit). Keep it short (3-4 sentences). Include clear CTA button: Shop Now, Learn More, Sign Up. Use emojis sparingly (1-2 max).'
        },
        {
          title: 'Launch and test',
          description: 'Start with 3-5 ad variations (different images + copy). Let run for 3-4 days before judging. Check: Reach, CTR, CPC, Conversions. Turn off ads with CTR <0.5% after 1000 impressions.'
        }
      ],

      targeting: {
        demographics: 'Age, gender, location, language, relationship status, education, job title',
        interests: 'Target specific interests (e.g., "Shopify", "Entrepreneurship"). Layer 3-5 interests for precision.',
        behaviors: 'Purchase behavior, device usage, travel patterns, life events'
      },

      creativeGuidelines: {
        images: [
          'Square (1:1) or vertical (4:5) formats perform best',
          'Show people using your product (not just product shots)',
          'Bright, high-contrast images (stops the scroll)',
          'Minimal text on image (<20% for best delivery)',
          'Test lifestyle vs product-only shots'
        ],
        video: [
          'First 3 seconds: Hook (problem, result, or curiosity)',
          'Seconds 4-15: Show product solving problem',
          'Seconds 15-30: Explain benefit, show CTA',
          'Add captions (85% watch without sound)',
          'Square or vertical for mobile'
        ],
        copy: [
          'Start with question or bold statement',
          'Focus on ONE benefit per ad',
          'Use "you" language (not "we")',
          'End with clear CTA: "Shop now 👉", "Learn more ↓"'
        ]
      },

      budgetGuidance: [
        {
          budget: 300,
          allocation: 'Single campaign. 2 ad sets (different audiences). 3 ads per set. $10/day testing.',
          expectedResults: '3000-6000 impressions, 60-150 clicks, 1-4 conversions',
          timeline: 'Week 1-2: Test audiences. Week 3-4: Scale winner to $15/day.'
        },
        {
          budget: 1000,
          allocation: 'Traffic ($600), Retargeting ($400). Test 4-5 audiences. 5-8 ad creatives.',
          expectedResults: '20000-40000 impressions, 300-600 clicks, 6-18 conversions',
          timeline: 'Week 1: Broad testing. Week 2-4: Double down on best audience + creative.'
        },
        {
          budget: 3000,
          allocation: 'Prospecting ($1800), Retargeting ($900), Lookalike ($300). Multiple campaigns.',
          expectedResults: '60000-120000 impressions, 1200-2400 clicks, 24-72 conversions',
          timeline: 'Full funnel. Build lookalike from purchasers by Week 3.'
        },
        {
          budget: 10000,
          allocation: 'Scale top 3 audiences. Add Instagram Stories/Reels. Test video vs static. Hire designer.',
          expectedResults: '200000-400000 impressions, 4000-8000 clicks, 80-240 conversions',
          timeline: 'Professional operation. Weekly creative refresh. A/B test everything.'
        }
      ],

      commonMistakes: [
        'Audience too broad → Wasted impressions on uninterested people',
        'No retargeting → Losing 98% of visitors who don\'t convert first visit',
        'Poor image quality → Low CTR, high CPC',
        'Changing ads daily → Need 1000+ impressions to judge performance',
        'Ignoring mobile → 95% of FB/IG users are mobile',
        'No clear CTA → People scroll past unclear offers'
      ],

      successMetrics: {
        good: 'CTR >1%, CPC <$1.50, Conversion rate >1.5%, ROAS >2.5x',
        bad: 'CTR <0.3%, CPC >$5, Zero conversions after $300 spend',
        action: 'If CTR <0.5% after 2000 impressions, change creative. If conversions = 0 after $500, reassess offer/audience.'
      }
    }
  },

  {
    id: 'linkedin-ads',
    name: 'LinkedIn Ads',
    icon: '💼',
    types: ['Sponsored Content', 'Message Ads', 'Text Ads'],
    bestFor: ['B2B SaaS', 'Enterprise sales', 'Professional services', 'Recruiting'],
    minBudget: 1000,
    difficulty: 'Advanced',

    overview: {
      description: 'Most expensive but highest-quality B2B leads. Target by job title, company, seniority. Best for $5K+ deal value.',
      avgCPC: '$5-15',
      avgConversion: '1-2%',
      timeToResults: '2-4 weeks'
    },

    setupGuide: {
      steps: [
        {
          title: 'Create LinkedIn Campaign Manager account',
          description: 'Go to business.linkedin.com/marketing-solutions. Create an account linked to your Company Page (must have one). This is free.'
        },
        {
          title: 'Install LinkedIn Insight Tag',
          description: 'Campaign Manager → Account Assets → Insight Tag. Copy pixel code, paste in your website <head>. Set up conversion tracking for "Lead form submission" or "Demo request".'
        },
        {
          title: 'Define your target audience',
          description: 'LinkedIn\'s strength is precision targeting. Target by: Job Title (e.g., "VP Marketing"), Company Size (e.g., 50-200 employees), Industry, Seniority. Keep audience >50K for scale.'
        },
        {
          title: 'Create Sponsored Content campaign',
          description: 'Create Campaign → Objective: Website Visits or Lead Generation. Audience: Define targeting. Budget: Minimum $10/day. Choose manual bidding (more control). Enable Audience Network (optional).'
        },
        {
          title: 'Design professional creative',
          description: 'Upload image (1200x627) or video (15-30 sec). LinkedIn users expect polished, professional content. Show data, case studies, or customer results. Avoid overly "salesy" ads.'
        },
        {
          title: 'Write B2B-focused copy',
          description: 'Professional tone. Lead with business impact: "Reduce CAC by 40%" not "Cool new tool". Include social proof: "Used by 500+ B2B companies". CTA: "Download Guide", "Book Demo", "Learn More".'
        },
        {
          title: 'Launch and optimize',
          description: 'Start with 3-4 ad variations. Run for 7 days minimum before judging (LinkedIn has longer sales cycles). Monitor: CTR (aim >0.5%), CPC, Conversion rate. Adjust bid if not getting impressions.'
        }
      ],

      targeting: {
        professional: 'Job Title, Job Function, Job Seniority, Years of Experience, Skills',
        company: 'Company Name, Industry, Company Size, Company Growth Rate',
        demographics: 'Location, Age (limited), Gender (limited), Education, Field of Study'
      },

      creativeGuidelines: {
        images: [
          'Professional, polished design (not casual/playful)',
          'Include data points or statistics',
          'Show dashboards, reports, or business outcomes',
          'Avoid stock photos of people in suits',
          'Use your brand colors consistently'
        ],
        copy: [
          'Lead with a business problem or outcome',
          'Use industry-specific language (they know the jargon)',
          'Include ROI or efficiency gains if possible',
          'Social proof: customer logos, testimonials, case studies',
          'CTA should be low-friction: "Learn More" > "Buy Now"'
        ]
      },

      budgetGuidance: [
        {
          budget: 1000,
          allocation: 'Single campaign. 1-2 audiences. 3 ads. $33/day. LinkedIn minimum budget.',
          expectedResults: '150-300 clicks, 2-6 leads (at 1-2% CR)',
          timeline: 'Month 1: Testing. High CPC is normal. Focus on lead quality over quantity.'
        },
        {
          budget: 3000,
          allocation: 'Prospecting ($2000), Retargeting ($1000). 2-3 job title targets. 5-6 ads.',
          expectedResults: '500-1000 clicks, 8-20 leads',
          timeline: 'Week 1-2: Test audiences. Week 3-4: Scale best audience, add retargeting.'
        },
        {
          budget: 10000,
          allocation: 'Multiple campaigns by persona. Sponsored Content + InMail. Lookalike audiences.',
          expectedResults: '1500-3000 clicks, 30-60 leads',
          timeline: 'Professional B2B operation. Weekly optimization. Consider ABM approach.'
        }
      ],

      commonMistakes: [
        'Audience too small (<20K) → Can\'t scale, high CPM',
        'Targeting too broad → Wasted spend on wrong seniority/title',
        'Consumer-style creative → LinkedIn users expect professional content',
        'Impatient → LinkedIn has longer sales cycles (2-4 weeks to judge)',
        'No lead nurturing → LinkedIn leads need follow-up (not instant buyers)',
        'Ignoring company size → SMB vs Enterprise have different behaviors'
      ],

      successMetrics: {
        good: 'CTR >0.6%, CPC <$10 (can go higher for enterprise), Lead quality >70% MQL',
        bad: 'CTR <0.2%, CPC >$20, Leads are irrelevant job titles',
        action: 'If CPC >$15 and conversions low, tighten audience. If CTR <0.3%, refresh creative with data/case studies.'
      }
    }
  },

  {
    id: 'tiktok-ads',
    name: 'TikTok Ads',
    icon: '🎵',
    types: ['In-Feed', 'TopView', 'Branded Effects'],
    bestFor: ['E-commerce', 'Mobile apps', 'D2C brands', 'Gen Z/Millennial products'],
    minBudget: 500,
    difficulty: 'Intermediate',

    overview: {
      description: 'Fast-growing, video-first platform. Younger demographic (18-34). Best for viral, creative products. Lower CPC than Facebook.',
      avgCPC: '$0.30-1',
      avgConversion: '0.5-2%',
      timeToResults: '1 week'
    },

    setupGuide: {
      steps: [
        {
          title: 'Create TikTok Ads Manager account',
          description: 'Go to ads.tiktok.com → Sign up for business account. Add payment method. Connect or create a TikTok business profile. Minimum $50 campaign budget.'
        },
        {
          title: 'Install TikTok Pixel',
          description: 'Assets → Events → Web Events → TikTok Pixel. Copy pixel code, paste in website <head>. Set up events: "Complete Payment" or "Submit Form". Test with TikTok Pixel Helper.'
        },
        {
          title: 'Understand TikTok creative style',
          description: 'TikTok users hate polished ads. They want authentic, native content. Best performing: User-generated style, trending sounds, fast-paced (15-30 sec), mobile-first vertical video (9:16).'
        },
        {
          title: 'Create campaign',
          description: 'Campaign → Objective: Traffic or Conversions. Budget: Campaign Budget Optimization (recommended). Bidding: Lowest Cost to start. Placement: TikTok only (turn off other placements for control).'
        },
        {
          title: 'Set up targeting',
          description: 'Location, Age (18-34 is sweet spot), Gender. Interests: Choose 3-5 relevant categories. Avoid over-targeting on TikTok - their algorithm needs volume to learn. Start broad.'
        },
        {
          title: 'Create native-style video ads',
          description: 'Film on phone, vertical format. Hook in first 2 seconds (text overlay, visual surprise). Show product in use. Add trending sounds (check TikTok\'s Creative Center). Include CTA text overlay at end.'
        },
        {
          title: 'Launch and iterate fast',
          description: 'Upload 5-8 video variations. TikTok algorithm learns fast (24-48 hours). Kill underperformers quickly. Winners can scale rapidly. Refresh creative weekly (platform favors new content).'
        }
      ],

      targeting: {
        demographics: 'Age (16-60+), Gender, Location, Language',
        interests: '20+ categories (Beauty, Fashion, Gaming, Tech, etc.)',
        behaviors: 'Video interactions, Creator interactions, Hashtag interactions'
      },

      creativeGuidelines: {
        video: [
          'Hook in first 2 seconds (problem, result, or curiosity)',
          'Vertical format (9:16) shot on phone',
          'Use trending sounds from TikTok library',
          'Add text overlays (85% watch muted)',
          'Show transformation or before/after',
          'Keep it under 30 seconds',
          'End with clear CTA + text overlay',
          'Native, UGC-style > polished brand content'
        ],
        donts: [
          'Don\'t use horizontal video',
          'Don\'t be too salesy or corporate',
          'Don\'t use slow-paced content',
          'Don\'t ignore trends (sounds, effects)',
          'Don\'t reuse old content (algorithm penalizes)'
        ]
      },

      budgetGuidance: [
        {
          budget: 500,
          allocation: 'Single campaign. 1 ad group. 5-8 video ads. $50 minimum per ad group. Test for 1 week.',
          expectedResults: '10000-20000 impressions, 200-500 clicks, 2-10 conversions',
          timeline: 'TikTok learns fast. Day 1-2: Learning phase. Day 3-7: Optimize top videos.'
        },
        {
          budget: 1500,
          allocation: 'Prospecting ($1000), Retargeting ($500). Test multiple audiences. 10-15 video variations.',
          expectedResults: '40000-80000 impressions, 800-1600 clicks, 8-32 conversions',
          timeline: 'Week 1: Test creative hooks. Week 2: Scale winners, refresh creative.'
        },
        {
          budget: 5000,
          allocation: 'Multiple campaigns by product/audience. Spark Ads (boost organic posts). Test TopView.',
          expectedResults: '150000-300000 impressions, 3000-6000 clicks, 30-120 conversions',
          timeline: 'Professional creator or UGC sourcing needed. Weekly creative refresh mandatory.'
        }
      ],

      commonMistakes: [
        'Using branded, polished ads → TikTok users scroll past "ads"',
        'Horizontal video → 95% of users are mobile vertical',
        'No trending sounds → Algorithm favors trending audio',
        'Targeting too narrow → TikTok algorithm needs volume',
        'Not testing enough creatives → Need 8-10 to find winners',
        'Slow-paced content → TikTok users have 3-second attention spans'
      ],

      successMetrics: {
        good: 'CTR >1.5%, CPC <$1, 3-second video view rate >50%, Conversion rate >1%',
        bad: 'CTR <0.5%, CPC >$3, Zero conversions after $500 spend',
        action: 'If CTR <1% after 5000 impressions, creative is wrong. Test 5 new videos with different hooks.'
      }
    }
  },

  {
    id: 'twitter-ads',
    name: 'Twitter/X Ads',
    icon: '🐦',
    types: ['Promoted Tweets', 'Follower Campaigns', 'Amplify'],
    bestFor: ['Tech products', 'News/Media', 'B2B SaaS', 'Thought leadership'],
    minBudget: 300,
    difficulty: 'Beginner',

    overview: {
      description: 'Great for tech/startup audience. Lower competition than Facebook. Best for awareness and engagement, not direct response.',
      avgCPC: '$0.50-2',
      avgConversion: '0.5-2%',
      timeToResults: '1-2 weeks'
    },

    setupGuide: {
      steps: [
        {
          title: 'Create Twitter Ads account',
          description: 'Go to ads.twitter.com → Sign in with your Twitter account. Set up payment method. You need an active Twitter/X profile with content (ads don\'t work on empty profiles).'
        },
        {
          title: 'Install Twitter Pixel',
          description: 'Ads Manager → Tools → Conversion Tracking → Website Tag. Copy pixel code, add to your website <head>. Set up conversion events: "Sign up", "Purchase". Optional but recommended.'
        },
        {
          title: 'Build organic presence first',
          description: 'Twitter Ads work best when you have organic content. Tweet 3-5x per week for 2 weeks before running ads. Engage with your industry. Ads amplify existing content.'
        },
        {
          title: 'Create campaign',
          description: 'Create Campaign → Objective: Website clicks or Conversions. Budget: Daily budget (start $10-20/day). Placement: Twitter only. Bidding: Automatic bid to start.'
        },
        {
          title: 'Define targeting',
          description: 'Follower look-alikes (target followers of competitors/influencers), Keywords (target by what people tweet about), Interests (broad categories). Start with follower targeting for precision.'
        },
        {
          title: 'Create Promoted Tweet',
          description: 'Write native-looking tweet (not "ad-y"). 280 characters max. Include image or video (performs 3x better). Add link. Use 1-2 hashtags. CTA at the end. Looks like regular tweet.'
        },
        {
          title: 'Launch and engage',
          description: 'Promote your best organic tweets (already proven). Reply to comments on promoted tweets. Twitter users expect interaction. Monitor for 3-4 days, then optimize.'
        }
      ],

      targeting: {
        followerTargeting: 'Target followers of specific accounts (competitors, influencers, complementary brands)',
        keywords: 'Target people tweeting about specific topics',
        interests: '25+ categories like Technology, Business, Entrepreneurship',
        demographics: 'Age, Gender, Location, Language, Device'
      },

      creativeGuidelines: {
        tweets: [
          'Write like a normal tweet (not an ad)',
          'Hook in first line (bold statement or question)',
          'One idea per tweet (don\'t cram)',
          'Include image or short video (stops scroll)',
          'Use 1-2 hashtags max (more = spam)',
          'End with clear CTA and link'
        ],
        visuals: [
          'Twitter image size: 1200x675 (landscape)',
          'Video: 15-30 seconds, add captions',
          'Show product/outcome, not just logo',
          'Keep text minimal on image'
        ]
      },

      budgetGuidance: [
        {
          budget: 300,
          allocation: 'Single campaign. Promote 2-3 best organic tweets. $10/day testing.',
          expectedResults: '3000-6000 impressions, 60-150 clicks, 1-4 conversions',
          timeline: 'Week 1: Test targeting (followers vs keywords). Week 2: Scale winner.'
        },
        {
          budget: 1000,
          allocation: 'Follower targeting ($600), Keyword targeting ($400). Promote 5-6 tweets.',
          expectedResults: '12000-24000 impressions, 240-600 clicks, 4-12 conversions',
          timeline: 'Week 1-2: Test. Week 3-4: Focus on best-performing targeting + creative.'
        },
        {
          budget: 3000,
          allocation: 'Multiple campaigns by audience. Add Video Ads. Test Takeover if budget allows.',
          expectedResults: '40000-80000 impressions, 800-1600 clicks, 12-32 conversions',
          timeline: 'Ongoing engagement. Reply to all comments. Build community while advertising.'
        }
      ],

      commonMistakes: [
        'Promoting tweets with no organic engagement → Looks like spam',
        'Writing "ad copy" → Twitter users ignore formal ads',
        'No image/video → Text-only tweets get 1/3 the engagement',
        'Targeting too broad → Wasted impressions',
        'Not replying to comments → Twitter is conversational',
        'Too many hashtags → Looks desperate'
      ],

      successMetrics: {
        good: 'CTR >1%, CPC <$1.50, Engagement rate >2%, Conversions >0.5%',
        bad: 'CTR <0.3%, CPC >$5, Zero engagement (replies/retweets)',
        action: 'If engagement <1% after 5000 impressions, content is wrong. Test different hooks/angles.'
      }
    }
  },

  {
    id: 'pinterest-ads',
    name: 'Pinterest Ads',
    icon: '📌',
    types: ['Promoted Pins', 'Shopping Ads', 'Carousel Ads'],
    bestFor: ['E-commerce', 'Home decor', 'Fashion', 'Food', 'DIY', 'Visual products'],
    minBudget: 300,
    difficulty: 'Beginner',

    overview: {
      description: 'Users come with buying intent (planning purchases). Longer content lifespan. 89% of users use Pinterest for purchase inspiration.',
      avgCPC: '$0.30-1.50',
      avgConversion: '1-4%',
      timeToResults: '2-3 weeks'
    },

    setupGuide: {
      steps: [
        {
          title: 'Create Pinterest Business account',
          description: 'Go to business.pinterest.com → Sign up. Convert personal account or create new. Add website (verify ownership). Create 5-10 organic pins before running ads.'
        },
        {
          title: 'Install Pinterest Tag',
          description: 'Ads Manager → Conversions → Pinterest Tag. Copy base code, paste in <head>. Add event codes for "AddToCart", "Checkout", "SignUp". Test with Tag Helper extension.'
        },
        {
          title: 'Understand Pinterest behavior',
          description: 'Pinterest is visual search + inspiration. Users save pins for later (long shelf life). Focus on beautiful, aspirational images. Vertical images (2:3 ratio) perform best.'
        },
        {
          title: 'Create campaign',
          description: 'Ads Manager → Create Ad → Objective: Conversions or Traffic. Budget: Daily or Campaign total. Bidding: Auto-bid to start. Placement: Browse or Search (or both).'
        },
        {
          title: 'Target your audience',
          description: 'Interests (very detailed: "Vegan recipes", "Mid-century furniture"). Keywords (what people search). Demographics (Age, Gender, Location). Pinterest has high-quality interest targeting.'
        },
        {
          title: 'Create beautiful Pins',
          description: 'Vertical image (1000x1500). High-quality, aspirational lifestyle photos. Clear product focus. Minimal text overlay. Professional design (Canva templates work). Write descriptive title + description with keywords.'
        },
        {
          title: 'Launch and be patient',
          description: 'Pinterest takes 2-3 weeks to optimize (longer than other platforms). Pins have long tail - can drive traffic for months. Check after 2 weeks. Optimize based on CTR and saves.'
        }
      ],

      targeting: {
        interests: '400+ interests across 30+ categories (Fashion, Home, Food, Beauty, Parenting, etc.)',
        keywords: 'Target by search terms (use Pinterest Trends tool)',
        demographics: 'Age, Gender, Location, Language, Device',
        audiences: 'Visitor retargeting, Customer lists, Actalike audiences (Pinterest\'s lookalike)'
      },

      creativeGuidelines: {
        images: [
          'Vertical format: 2:3 ratio (1000x1500px)',
          'Lifestyle photography (product in use)',
          'Bright, aspirational, Pinterest-aesthetic',
          'Minimal text overlay (let image speak)',
          'Consistent brand style across pins',
          'Multiple pins per product (different angles)'
        ],
        copy: [
          'Title: Clear, descriptive (e.g., "Modern Minimalist Desk Lamp")',
          'Description: 100-200 words with keywords',
          'Natural keyword use (not stuffed)',
          'Include price if e-commerce',
          'End with CTA: "Shop now", "Get the look"'
        ]
      },

      budgetGuidance: [
        {
          budget: 300,
          allocation: 'Single campaign. 2-3 interest targets. 5-8 Pin designs. $10/day.',
          expectedResults: '15000-30000 impressions, 150-450 clicks, 2-12 conversions',
          timeline: 'Week 1-2: Pinterest learning. Week 3-4: Optimization kicks in. Be patient.'
        },
        {
          budget: 1000,
          allocation: 'Prospecting ($700), Retargeting ($300). Multiple interest groups. 10-15 Pins.',
          expectedResults: '60000-120000 impressions, 600-1800 clicks, 10-50 conversions',
          timeline: 'Month 1: Testing. Month 2: Scale best-performing interests + Pin designs.'
        },
        {
          budget: 3000,
          allocation: 'Full catalog. Shopping Ads for e-commerce. Seasonal campaigns. Video Pins.',
          expectedResults: '200000-400000 impressions, 2000-6000 clicks, 40-160 conversions',
          timeline: 'Professional Pinterest strategy. Monthly creative refresh. Catalog integration.'
        }
      ],

      commonMistakes: [
        'Horizontal images → Pinterest is vertical platform',
        'Text-heavy images → Pinterest users want visual inspiration',
        'Inconsistent aesthetic → Brand needs cohesive look',
        'Giving up too early → Pinterest takes 2-3 weeks to optimize',
        'Generic product photos → Need lifestyle context',
        'Ignoring seasonal trends → Pinterest users plan 45-90 days ahead'
      ],

      successMetrics: {
        good: 'CTR >0.7%, CPC <$1, Save rate >5%, Conversion rate >2%',
        bad: 'CTR <0.2%, CPC >$3, Zero saves (means content isn\'t inspiring)',
        action: 'If CTR <0.3% after 2 weeks, creative is wrong. Test more aspirational/lifestyle imagery.'
      }
    }
  }
]

export const budgetWizardForm = [
  {
    id: 'monthly_budget',
    type: 'number',
    label: 'Monthly Advertising Budget (USD)',
    placeholder: '1000',
    min: 300,
    suffix: '/month',
    required: true,
    description: 'How much can you invest in paid ads per month? Minimum $300 recommended.'
  },
  {
    id: 'primary_goal',
    type: 'select',
    label: 'Primary Advertising Goal',
    options: [
      { value: 'awareness', label: 'Brand Awareness (Get my name out there)' },
      { value: 'traffic', label: 'Website Traffic (Drive visitors to my site)' },
      { value: 'leads', label: 'Lead Generation (Collect emails, signups)' },
      { value: 'sales', label: 'Direct Sales (E-commerce purchases)' }
    ],
    required: true,
    description: 'What\'s your #1 goal for these ads?'
  },
  {
    id: 'timeline',
    type: 'select',
    label: 'Launch Timeline',
    options: [
      { value: 'urgent', label: 'This week (urgent, need results fast)' },
      { value: 'soon', label: 'Within 2 weeks (normal pace)' },
      { value: 'testing', label: 'Test over 30 days (learning mode)' },
      { value: 'longterm', label: '90+ days (long-term brand building)' }
    ],
    required: true,
    description: 'How quickly do you need to launch?'
  },
  {
    id: 'experience_level',
    type: 'select',
    label: 'Your Advertising Experience',
    options: [
      { value: 'none', label: 'Complete beginner (never run ads)' },
      { value: 'some', label: 'Some experience (tried ads before)' },
      { value: 'experienced', label: 'Experienced (run ads regularly)' }
    ],
    required: true
  }
]

export const paidAdsTask = {
  id: 'advertising-1',
  name: 'Launch Your First Paid Ad Campaign',
  description: 'AI-powered wizard helps you setup Google Ads, Facebook Ads, and more with your specific budget',
  category: 'advertising',
  tier: 'free',
  what: 'Get a personalized ad launch plan based on your budget, goals, and audience. Includes platform recommendations, budget allocation, ready-to-use ad copy, targeting specs, and week-by-week action plan.',
  why: 'Paid ads can drive results fast, but beginners waste 50-70% of their budget on mistakes. This wizard gives you a proven launch protocol tailored to your business - not generic advice.',
  how: 'Fill out the budget wizard (takes 2 minutes). AI analyzes your project data and generates a complete launch plan with specific dollar amounts, ready-to-use ads, and step-by-step instructions. Then dive into platform guides for details.',

  budgetWizardForm: budgetWizardForm,
  adPlatforms: adPlatforms,
  customComponent: 'PaidAdsLaunchMiniApp',
  output: { enabled: false }
}
