/**
 * Community Posts Configuration
 * Comprehensive guide for posting in 10+ communities
 */

export const communities = [
  {
    id: 'reddit',
    name: 'Reddit',
    icon: '🤖',
    description: 'Niche subreddits with highly engaged communities',
    category: 'General',
    difficulty: 'Intermediate',

    postingGuide: {
      steps: [
        {
          title: 'Find the right subreddit',
          description: 'Search for subreddits related to your niche. Check r/startups, r/SideProject, r/entrepreneur, or niche-specific subs. Look at member count and activity level.'
        },
        {
          title: 'Read the rules carefully',
          description: 'Every subreddit has different rules. Read the sidebar, pinned posts, and recent posts. Many ban direct promotion - look for "Feedback Friday" or "Share Sunday" threads.'
        },
        {
          title: 'Participate first (1-2 weeks)',
          description: 'Comment on other posts, provide value, build karma. Don\'t post about your product immediately. Establish yourself as a helpful community member first.'
        },
        {
          title: 'Craft a value-first post',
          description: 'Lead with the problem you\'re solving, not your product. Share your journey, lessons learned, or ask for genuine feedback. Be transparent about what you\'ve built.'
        },
        {
          title: 'Time your post strategically',
          description: 'Post between 6-8am ET (when US users wake up) or 2-4pm ET (afternoon browsing). Avoid weekends unless the sub is specifically active then.'
        },
        {
          title: 'Engage immediately after posting',
          description: 'Reply to every comment within the first 2 hours. Reddit\'s algorithm favors posts with early engagement. Be helpful, not defensive. Answer questions honestly.'
        }
      ],

      dos: [
        'Lead with a problem or story, not your product',
        'Be transparent about building and selling something',
        'Participate in the community before promoting',
        'Use Reddit\'s authentic, casual tone',
        'Include a clear ask (feedback, testing, advice)',
        'Reply to every single comment quickly'
      ],

      donts: [
        'Don\'t spam multiple subreddits with same post',
        'Don\'t use marketing language or hype',
        'Don\'t ignore negative feedback or get defensive',
        'Don\'t post during low-activity hours',
        'Don\'t include affiliate links or heavy CTAs',
        'Don\'t delete and repost if it doesn\'t go well'
      ],

      engagementTips: [
        'Upvote and thank people for constructive feedback',
        'If someone asks a question, reply within 30 minutes',
        'Be vulnerable - share struggles and failures',
        'Offer to help others who post similar projects',
        'Follow up 1-2 weeks later with what you learned'
      ]
    },

    postTemplates: [
      {
        quality: 'good',
        title: 'I built a tool to solve [specific problem] after wasting 10 hours/week on [manual task]',
        body: 'Hey r/[subreddit]! 👋\n\nFor the past 3 months, I was spending 10+ hours/week manually [task]. It was killing my productivity, so I built [Product] to automate it.\n\n**What it does:** [2 sentence explanation]\n\n**Why I\'m posting:** I\'d love feedback from people who face this problem. Is this actually useful? What\'s missing?\n\n**Early stage:** Still rough around the edges, but it\'s working for me. Happy to give free access to anyone who wants to try it.\n\nWould love your honest thoughts!',
        why: 'Leads with relatable problem, transparent about building a solution, asks for genuine feedback'
      },
      {
        quality: 'bad',
        title: '🚀 Revolutionary AI-Powered Platform Launches Today! 🚀',
        body: 'Excited to announce the launch of [Product]! We\'ve built the world\'s most advanced [category] solution.\n\n✨ Features:\n- Feature 1\n- Feature 2\n- Feature 3\n\nSign up now for 50% off! Limited time offer!\n\n[link]',
        why: 'Pure marketing copy, emojis overload, hype language, no story, feels like spam'
      }
    ],

    headlineFormulas: [
      'I built [tool] to solve [problem] - would love feedback',
      'Spent [time] doing [task] manually, so I automated it',
      'After [struggle], I created [solution] - here\'s what I learned',
      '[Months] of building [product] - mistakes and wins'
    ]
  },

  {
    id: 'indie-hackers',
    name: 'Indie Hackers',
    icon: '👨‍💻',
    description: 'Community of founders building profitable businesses',
    category: 'Startup',
    difficulty: 'Beginner',

    postingGuide: {
      steps: [
        {
          title: 'Set up your profile',
          description: 'Complete your IH profile with your photo, bio, and products. This builds credibility when you post.'
        },
        {
          title: 'Choose the right section',
          description: 'Post in "Share" for launches, "Ask IH" for questions, "Milestones" for achievements. Each section has different norms and expectations.'
        },
        {
          title: 'Be metrics-transparent',
          description: 'IH users love numbers. Share revenue, MRR, user count, conversion rates. Being open about metrics is the norm here - it\'s not bragging.'
        },
        {
          title: 'Tell your founder story',
          description: 'Share your journey: what you tried, what failed, what worked. IH users want to learn from your experience, not just hear about your product.'
        },
        {
          title: 'Add value to the community',
          description: 'After posting, spend time commenting on others\' posts. IH is reciprocal - help others and they\'ll help you.'
        }
      ],

      dos: [
        'Share actual revenue numbers and metrics',
        'Be honest about failures and pivots',
        'Focus on lessons learned and insights',
        'Use the "Ask IH" section for genuine questions',
        'Comment on and support other indie hackers',
        'Post updates on your journey regularly'
      ],

      donts: [
        'Don\'t hide your numbers or be vague',
        'Don\'t just drop links without context',
        'Don\'t fake success or inflate metrics',
        'Don\'t treat it like a pure marketing channel',
        'Don\'t ignore people who engage with your post',
        'Don\'t post only when you want something'
      ],

      engagementTips: [
        'Reply to every comment thoughtfully',
        'Share detailed answers, not one-liners',
        'Ask follow-up questions to commenters',
        'Offer to do 1:1 calls with people who are helpful',
        'Update your original post with learnings from comments'
      ]
    },

    postTemplates: [
      {
        quality: 'good',
        title: 'Reached $2K MRR in 3 months with [Product] - here\'s the breakdown',
        body: '**Background:** Quit my job in January to build [Product] full-time.\n\n**What it does:** [One sentence]\n\n**The numbers:**\n- Month 1: $200 MRR (10 customers)\n- Month 2: $800 MRR (35 customers)\n- Month 3: $2,100 MRR (58 customers)\n\n**What worked:**\n- Content marketing on [channel] drove 60% of signups\n- Free tier converted at 12% (better than expected)\n- Personal onboarding calls for first 20 customers\n\n**What didn\'t:**\n- Paid ads were too expensive (CAC > LTV)\n- Cold email had <1% response rate\n\n**Next steps:** Trying to hit $10K MRR by end of year.\n\nHappy to answer questions!',
        why: 'Transparent metrics, shares what worked AND what didn\'t, shows real growth trajectory'
      },
      {
        quality: 'bad',
        title: 'Just launched my SaaS! Check it out',
        body: 'Hey everyone, I just launched [Product]. It helps with [vague description].\n\nWould love if you could check it out and let me know what you think!\n\n[link]',
        why: 'No metrics, no journey, no context, just asking for free promotion'
      }
    ],

    headlineFormulas: [
      'Hit $[amount] MRR in [timeframe] - here\'s how',
      'Built [product] to $[revenue] with [strategy]',
      '[Months] of building in public - lessons learned',
      'From idea to [milestone] - mistakes I made'
    ]
  },

  {
    id: 'product-hunt',
    name: 'Product Hunt',
    icon: '🚀',
    description: 'Daily showcase of new products',
    category: 'Launch',
    difficulty: 'Advanced',

    postingGuide: {
      steps: [
        {
          title: 'Prepare 2-3 weeks in advance',
          description: 'Build hype before launch. Tease on Twitter, collect emails, line up supporters. Create high-quality screenshots, demo video, and tagline. You only get one launch - make it count.'
        },
        {
          title: 'Schedule for Tuesday-Thursday',
          description: 'Avoid Mondays (too busy) and Fridays (low engagement). Launch at 12:01am PST to maximize the 24-hour window. Set multiple alarms.'
        },
        {
          title: 'Write a compelling tagline',
          description: 'You have ONE sentence to hook people. Make it clear, specific, and benefit-focused. Not "AI-powered platform" but "Turn screenshots into editable code in seconds".'
        },
        {
          title: 'Engage heavily on launch day',
          description: 'Reply to every comment within 30 minutes. Thank supporters. Answer questions in detail. The PH team notices and may feature engaged makers.'
        },
        {
          title: 'Leverage your network',
          description: 'Message friends, email list, Twitter followers. Ask for upvotes and honest feedback. Don\'t be pushy, but don\'t be shy either. Most upvotes come from your network.'
        },
        {
          title: 'Post a maker comment immediately',
          description: 'Within 5 minutes of launching, post a "maker comment" explaining your journey, why you built this, and what makes it special. Pin this comment.'
        }
      ],

      dos: [
        'Prepare assets (video, screenshots, thumbnail) in advance',
        'Tease launch on Twitter/LinkedIn 1 week before',
        'Reply to every single comment on launch day',
        'Mobilize your network (nicely) for upvotes',
        'Post updates throughout the day',
        'Thank everyone who supports you'
      ],

      donts: [
        'Don\'t use fake accounts or bots for upvotes (you\'ll get banned)',
        'Don\'t launch on a Friday or holiday',
        'Don\'t write a generic tagline',
        'Don\'t disappear after posting',
        'Don\'t argue with negative feedback',
        'Don\'t re-launch the same product (unless major update)'
      ],

      engagementTips: [
        'Set up notifications so you never miss a comment',
        'Give detailed, thoughtful answers (not "Thanks!")',
        'Ask commenters questions back to start conversations',
        'Share behind-the-scenes stories in your replies',
        'Celebrate milestones (#1 of the day) with your supporters'
      ]
    },

    postTemplates: [
      {
        quality: 'good',
        title: 'Turn Figma designs into production-ready React code in seconds',
        body: '**Maker Comment:**\n\nHey Product Hunt! 👋\n\nI\'m [Name], and I built [Product] because I was tired of spending hours translating Figma designs into code.\n\n**The problem:** Designers hand off Figmas, developers spend days recreating them. Lots of back-and-forth, inconsistencies, wasted time.\n\n**Our solution:** Upload your Figma file, get clean React/Vue/HTML code instantly. Copy-paste ready, fully responsive, matches your design system.\n\n**Who it\'s for:** Dev teams, agencies, solo founders who want to ship faster.\n\n**What makes us different:** Unlike other tools, we generate semantic, maintainable code (not just pixel-perfect divs). You can actually use this in production.\n\nHappy to answer any questions! This is our first launch and I\'m here all day.\n\n🙏 Thanks for checking it out!',
        why: 'Clear tagline, personal story, explains problem/solution, sets expectations for engagement'
      },
      {
        quality: 'bad',
        title: 'Revolutionary AI Platform',
        body: 'Check out our new platform! Uses AI to help you work faster.\n\n[link]',
        why: 'Vague, no context, no maker story, lazy effort'
      }
    ],

    headlineFormulas: [
      '[Action] in [time] - [benefit]',
      'The [simple description] for [specific audience]',
      '[Problem solved] without [pain point]',
      '[Familiar tool] meets [another tool] for [outcome]'
    ]
  },

  {
    id: 'hackernews',
    name: 'Hacker News',
    icon: '⚙️',
    description: 'Tech community focused on substance',
    category: 'Technical',
    difficulty: 'Advanced',

    postingGuide: {
      steps: [
        {
          title: 'Understand HN culture',
          description: 'HN values technical depth, intellectual honesty, and substance over hype. Marketing language gets downvoted instantly. Focus on interesting technical problems you solved.'
        },
        {
          title: 'Choose "Show HN" format',
          description: 'Start your title with "Show HN:" to indicate you\'re sharing something you built. This signals you\'re a maker, not a marketer.'
        },
        {
          title: 'Lead with the technical story',
          description: 'Don\'t pitch features. Explain the interesting technical challenge, your approach, trade-offs you made. HN users want to learn, not buy.'
        },
        {
          title: 'Expect brutal honesty',
          description: 'HN comments can be harsh. Don\'t get defensive. Engage thoughtfully with criticism. Acknowledge valid points. This builds respect.'
        },
        {
          title: 'Post between 8-10am ET',
          description: 'HN is most active during US morning hours. Weekdays are better than weekends.'
        }
      ],

      dos: [
        'Write clear, direct titles (no hype, no emojis)',
        'Focus on technical aspects and challenges',
        'Be honest about limitations and trade-offs',
        'Respond to technical critiques thoughtfully',
        'Share interesting implementation details',
        'Link directly to your product, not a landing page'
      ],

      donts: [
        'Don\'t use marketing speak or buzzwords',
        'Don\'t call anything "revolutionary" or "game-changing"',
        'Don\'t ignore criticism or get defensive',
        'Don\'t post clickbait titles',
        'Don\'t ask for upvotes (vote manipulation = ban)',
        'Don\'t spam - post rarely and meaningfully'
      ],

      engagementTips: [
        'Reply to every substantive comment',
        'Admit when critics have valid points',
        'Share technical details others ask about',
        'Link to your GitHub if open source',
        'Keep replies factual, not emotional'
      ]
    },

    postTemplates: [
      {
        quality: 'good',
        title: 'Show HN: I built a real-time collaborative code editor using CRDTs',
        body: 'Over the past 6 months, I\'ve been working on [Product], a real-time collaborative code editor.\n\n**Technical approach:**\nUsed CRDTs (Conflict-free Replicated Data Types) instead of Operational Transformation. This means no central server needed for conflict resolution - clients can sync directly.\n\n**Challenges:**\n- Keeping file size small (<50KB) as edit history grows\n- Handling network partitions gracefully\n- Cursor position synchronization across different screen sizes\n\n**Trade-offs:**\nChose eventual consistency over strong consistency for speed. In rare cases (simultaneous edits to same character), it takes ~100ms to resolve.\n\n**Stack:** Rust backend, React frontend, WebRTC for peer connections.\n\nWould love feedback, especially on the CRDT implementation. Source code: [github link]\n\nDemo: [link]',
        why: 'Technical depth, explains implementation choices, acknowledges trade-offs, invites technical critique'
      },
      {
        quality: 'bad',
        title: 'Show HN: The Future of Coding is Here! 🚀',
        body: 'We\'ve revolutionized coding with our AI-powered platform!\n\nFeatures:\n- Real-time collaboration\n- AI autocomplete\n- Beautiful UI\n\nSign up for our beta!',
        why: 'Marketing language, emojis, no technical substance, pure promotion'
      }
    ],

    headlineFormulas: [
      'Show HN: [What you built] using [interesting tech]',
      'Show HN: [Product] - [specific technical problem solved]',
      'Show HN: I built [thing] to [outcome] without [common approach]',
      'Show HN: [Tool] - [one sentence technical description]'
    ]
  },

  {
    id: 'devto',
    name: 'Dev.to',
    icon: '📝',
    description: 'Developer community focused on learning',
    category: 'Developer',
    difficulty: 'Beginner',

    postingGuide: {
      steps: [
        {
          title: 'Write a tutorial, not an ad',
          description: 'Dev.to is for sharing knowledge. Write "How I built [feature]" not "Check out my product". Teach something useful.'
        },
        {
          title: 'Use markdown and code blocks',
          description: 'Format your post well. Use headers, code blocks, and images. Dev.to has excellent markdown support - use it to make your post readable.'
        },
        {
          title: 'Add relevant tags',
          description: 'Use 4 tags max. Choose tags with active communities: #javascript, #webdev, #tutorial, #beginners. Check tag pages to see what performs well.'
        },
        {
          title: 'Share your learning journey',
          description: 'What did you struggle with? What mistakes did you make? Developers love learning from others\' experiences. Be vulnerable and honest.'
        },
        {
          title: 'Engage with commenters',
          description: 'Reply to comments with detailed answers. Dev.to users are helpful and curious - reward that with thoughtful engagement.'
        }
      ],

      dos: [
        'Write educational content (tutorials, guides, lessons)',
        'Use code examples and screenshots',
        'Format posts cleanly with markdown',
        'Share what you learned building your product',
        'Link to your product naturally in context',
        'Be helpful to beginners'
      ],

      donts: [
        'Don\'t write pure promotional content',
        'Don\'t skip code examples',
        'Don\'t use clickbait titles',
        'Don\'t assume advanced knowledge',
        'Don\'t ignore comments',
        'Don\'t copy-paste from your blog without adapting'
      ],

      engagementTips: [
        'Reply to every comment within 24 hours',
        'Answer follow-up questions in detail',
        'Thank people for their input',
        'Suggest related resources',
        'Update your post based on feedback'
      ]
    },

    postTemplates: [
      {
        quality: 'good',
        title: 'How I built real-time notifications with WebSockets and React',
        body: 'I recently built a real-time notification system for [Product], and wanted to share what I learned.\n\n## The Challenge\nUsers needed instant notifications without refreshing the page. Polling felt wasteful. WebSockets seemed like the answer, but I\'d never used them.\n\n## My Approach\n\n### 1. Setting up the WebSocket server\n```javascript\nconst WebSocket = require(\'ws\');\nconst wss = new WebSocket.Server({ port: 8080 });\n\nwss.on(\'connection\', (ws) => {\n  console.log(\'Client connected\');\n  // ... \n});\n```\n\n### 2. Connecting from React\n```javascript\nconst [socket, setSocket] = useState(null);\n\nuseEffect(() => {\n  const ws = new WebSocket(\'ws://localhost:8080\');\n  // ...\n}, []);\n```\n\n### 3. Handling disconnects\nThis was the tricky part. Users don\'t always close tabs gracefully...\n\n## Mistakes I Made\n1. Not handling reconnection logic (oops)\n2. Sending too many messages (performance issues)\n3. No fallback for browsers without WebSocket support\n\n## What I\'d Do Differently\n- Add exponential backoff for reconnection\n- Batch messages to reduce network overhead\n- Include long-polling fallback\n\n## Resources\n- [MDN WebSocket docs](link)\n- [My GitHub repo](link)\n\nHappy to answer questions! What\'s your approach to real-time data?',
        why: 'Educational, code examples, shares mistakes, asks for feedback, natural product mention'
      },
      {
        quality: 'bad',
        title: 'Announcing [Product] - The Best Developer Tool Ever!',
        body: 'We just launched [Product]! It has amazing features:\n\n- Feature 1\n- Feature 2\n- Feature 3\n\nSign up now!',
        why: 'Pure promotion, no educational value, no code, clickbait title'
      }
    ],

    headlineFormulas: [
      'How I built [feature] with [technology]',
      'Building [product]: Lessons from [timeframe]',
      'From beginner to [outcome]: My journey with [tech]',
      '[Number] mistakes I made building [thing]'
    ]
  },

  {
    id: 'twitter',
    name: 'X / Twitter',
    icon: '🐦',
    description: 'Build in public with threads',
    category: 'Social',
    difficulty: 'Intermediate',

    postingGuide: {
      steps: [
        {
          title: 'Build your audience first',
          description: 'Don\'t launch a product to 10 followers. Spend 1-2 months tweeting valuable content, engaging with others, and growing to 200-500 followers first.'
        },
        {
          title: 'Write a thread, not a single tweet',
          description: 'Threads get 3-5x more engagement. Start with a hook tweet, break your story into 5-10 tweets. Use the 🧵 emoji. End with a clear CTA.'
        },
        {
          title: 'Lead with a hook',
          description: 'First tweet needs to stop scrolling. Use: numbers ("I made $10K"), results ("went from 0 to 1000 users"), or questions ("Want to know how I...").'
        },
        {
          title: 'Tell a story',
          description: 'People don\'t care about features. They care about your journey. Share the problem, your struggle, your solution, the outcome. Be real.'
        },
        {
          title: 'Tag relevant accounts',
          description: 'Tag people who inspired you, tools you used, or communities you\'re part of. Many will retweet if you mention them positively.'
        },
        {
          title: 'Reply to every comment',
          description: 'First 30 minutes are critical. Reply to every comment. This signals to Twitter\'s algorithm that your thread is engaging. Ask follow-up questions.'
        }
      ],

      dos: [
        'Use threads (5-10 tweets) for storytelling',
        'Start with a powerful hook',
        'Share real numbers and results',
        'Include visuals (screenshots, demos)',
        'Reply to every comment in first hour',
        'Retweet others who launch'
      ],

      donts: [
        'Don\'t tweet to 0 followers (build audience first)',
        'Don\'t write single promotional tweets',
        'Don\'t use too many hashtags',
        'Don\'t be salesy - be authentic',
        'Don\'t ignore replies',
        'Don\'t launch without teasing first'
      ],

      engagementTips: [
        'Reply within 5 minutes to early commenters',
        'Ask questions in your replies',
        'Quote tweet with additional context',
        'Pin successful threads to your profile',
        'Follow up with "Day 2" updates'
      ]
    },

    postTemplates: [
      {
        quality: 'good',
        title: 'Thread: How I built [Product] to $5K MRR in 90 days 🧵',
        body: 'Tweet 1: I quit my job 3 months ago to build [Product]. Today we hit $5K MRR.\n\nHere\'s the unfiltered story of what worked (and what failed):\n\nTweet 2: **The Problem**\nI was spending 10 hours/week on [task]. Talked to 50 other founders - they had the same pain. Market validated ✅\n\nTweet 3: **Month 1: Building**\n- Shipped MVP in 3 weeks (way too slow)\n- Spent 2 weeks on features nobody asked for\n- Mistake: Didn\'t talk to users until launch\n\nTweet 4: **Month 2: Launch**\n- Posted on Reddit, IH, PH\n- Got 500 signups, 12 paid ($600 MRR)\n- 2.4% conversion rate (expected 5%)\n\nTweet 5: **What worked:**\n- Content marketing (wrote 8 blog posts)\n- Cold DMs to people with the problem\n- Free tier → paid upsell\n\nTweet 6: **What failed:**\n- Paid ads (CAC too high)\n- Complicated pricing (confused users)\n- Feature bloat (should\'ve stayed simple)\n\nTweet 7: **Month 3: Growth**\n- Doubled down on SEO\n- Simplified pricing to $49/mo\n- Added referral program\n- Hit $5K MRR 🎉\n\nTweet 8: **Key lesson:**\nShip fast, talk to users constantly, focus on one channel that works.\n\nTweet 9: If you\'re building something, my biggest advice:\n\nDon\'t wait for perfect. Ship, learn, iterate.\n\nTweet 10: Built [Product] to solve [problem].\n\nIf you face this pain, try it out: [link]\n\nHappy to answer questions! 🙌',
        why: 'Hook with numbers, shares journey, honest about failures, clear structure, ends with CTA'
      },
      {
        quality: 'bad',
        title: 'Check out our new product! [link]',
        body: '[single tweet with just a link]',
        why: 'No story, no context, no thread, pure spam'
      }
    ],

    headlineFormulas: [
      'How I [achieved result] in [timeframe] 🧵',
      'I made [number] mistakes building [product] - here they are',
      '[Months] ago I had [problem]. Today I [solution]. Here\'s how:',
      'Thread: Building [product] from $0 to $[revenue]'
    ]
  },

  {
    id: 'linkedin',
    name: 'LinkedIn Groups',
    icon: '💼',
    description: 'Professional communities and groups',
    category: 'Professional',
    difficulty: 'Beginner',

    postingGuide: {
      steps: [
        {
          title: 'Find niche groups',
          description: 'Search for groups in your industry. Look for groups with 1K-50K members (active but not overwhelming). Join 5-10 relevant groups.'
        },
        {
          title: 'Read group rules',
          description: 'Some groups ban promotion. Others have specific days for sharing. Check pinned posts and group description before posting.'
        },
        {
          title: 'Build credibility first',
          description: 'Comment on others\' posts for 1-2 weeks. Share insights, answer questions. Become a recognizable name before promoting.'
        },
        {
          title: 'Frame as a professional insight',
          description: 'Don\'t say "Check out my product." Say "Here\'s what I learned solving [problem]." Position yourself as an expert sharing knowledge.'
        },
        {
          title: 'Use LinkedIn\'s professional tone',
          description: 'Less casual than Reddit, more polished than Twitter. Focus on ROI, productivity, efficiency. Use professional language.'
        }
      ],

      dos: [
        'Join niche groups relevant to your product',
        'Participate before promoting',
        'Share industry insights and lessons',
        'Use professional, polished tone',
        'Include data and results',
        'Respond to comments professionally'
      ],

      donts: [
        'Don\'t spam multiple groups at once',
        'Don\'t ignore group rules',
        'Don\'t use overly casual language',
        'Don\'t post without engaging first',
        'Don\'t be overly salesy',
        'Don\'t post and disappear'
      ],

      engagementTips: [
        'Reply to comments within 2 hours',
        'Ask for professional insights from commenters',
        'Connect with engaged commenters',
        'Share follow-up lessons in comments',
        'Thank people for their input'
      ]
    },

    postTemplates: [
      {
        quality: 'good',
        title: 'After 200+ customer interviews, here's what I learned about [topic]',
        body: 'Over the past 6 months, I\'ve spoken to 200+ [target audience] about [problem].\n\nThree insights that surprised me:\n\n1. **[Insight 1]**\n[Specific percentage] said [specific finding]. This was counterintuitive because [reason].\n\n2. **[Insight 2]**\nThe biggest pain point wasn\'t [expected thing], it was [actual thing]. This led me to pivot our approach.\n\n3. **[Insight 3]**\n[Audience] are willing to pay [amount] for [outcome], but only if [condition].\n\nBased on these insights, we built [Product] to solve [specific problem].\n\nWhat surprised me most: [unexpected learning].\n\nIf you\'re in [industry], what\'s been your experience with [topic]?',
        why: 'Data-driven, positions as expert, shares genuine insights, natural product mention, asks for engagement'
      },
      {
        quality: 'bad',
        title: 'Exciting news! 🎉',
        body: 'We just launched [Product]! It\'s going to change [industry] forever.\n\nSign up now: [link]',
        why: 'Pure promotion, no value, overhyped, no professional insights'
      }
    ],

    headlineFormulas: [
      'After [number] [interviews/tests], here\'s what I learned',
      '[Number] insights from building [product] in [industry]',
      'What [outcome] taught me about [topic]',
      'The [unexpected finding] about [industry problem]'
    ]
  },

  {
    id: 'discord',
    name: 'Discord Servers',
    icon: '💬',
    description: 'Real-time community conversations',
    category: 'Community',
    difficulty: 'Beginner',

    postingGuide: {
      steps: [
        {
          title: 'Find relevant servers',
          description: 'Search Discord server directories (disboard.org, discord.me). Look for startup, indie hacker, or niche-specific servers with 500-5000 members.'
        },
        {
          title: 'Introduce yourself first',
          description: 'Join the server, post in #introductions. Say hi, share what you\'re working on (briefly). Don\'t drop links immediately.'
        },
        {
          title: 'Participate in conversations',
          description: 'Discord is about real-time chat. Jump into conversations, answer questions, share memes. Be a community member for a few days before promoting.'
        },
        {
          title: 'Check for #shameless-plug or #show-and-tell channels',
          description: 'Most Discord servers have dedicated channels for sharing projects. Use those, not general chat. Read channel descriptions.'
        },
        {
          title: 'Keep it conversational',
          description: 'Discord is casual. Write like you\'re chatting with friends. Use emojis, be friendly, don\'t be formal.'
        }
      ],

      dos: [
        'Introduce yourself when you join',
        'Participate genuinely in conversations',
        'Use designated promotion channels',
        'Be casual and conversational',
        'Offer help to others',
        'React and engage with others\' posts'
      ],

      donts: [
        'Don\'t drop links in general channels',
        'Don\'t copy-paste the same message across servers',
        'Don\'t ignore server rules',
        'Don\'t ghost after promoting',
        'Don\'t DM people with your product',
        'Don\'t be overly formal'
      ],

      engagementTips: [
        'Reply quickly - Discord is real-time',
        'Use reactions (👍, 🔥) to acknowledge comments',
        'Answer questions in the thread',
        'Stick around for 30-60 min after posting',
        'Follow up on feedback in the channel'
      ]
    },

    postTemplates: [
      {
        quality: 'good',
        title: '[In #shameless-plug channel]',
        body: 'Hey everyone! 👋\n\nI\'ve been lurking here for a few weeks and finally have something to share.\n\nBuilt a tool called [Product] to solve [specific problem]. Basically, it [one sentence explanation].\n\n**Why I built it:** Was frustrated with [pain point], talked to a bunch of folks here who had the same issue, so I built a solution.\n\n**What it does:**\n- [Benefit 1]\n- [Benefit 2]\n- [Benefit 3]\n\n**Early stage** - still rough, but it works for me. Free for now if anyone wants to try it.\n\nWould genuinely love feedback from this community! What am I missing?\n\n[link]',
        why: 'Acknowledges community membership, casual tone, clear value prop, asks for feedback'
      },
      {
        quality: 'bad',
        title: '[Posted in #general]',
        body: '@everyone Check out my new product [Product]! Revolutionary AI solution. Limited time offer!\n\n[link]',
        why: '@everyone spam, wrong channel, marketing language, ignored community norms'
      }
    ],

    headlineFormulas: [
      'Hey! Built [product] to solve [problem] - would love your thoughts',
      'Sharing something I\'ve been working on: [product]',
      'Made a tool for [specific use case] - feedback welcome!',
      'Anyone else struggle with [problem]? Built [solution]'
    ]
  },

  {
    id: 'facebook',
    name: 'Facebook Groups',
    icon: '👥',
    description: 'Niche interest groups',
    category: 'Community',
    difficulty: 'Beginner',

    postingGuide: {
      steps: [
        {
          title: 'Search for niche groups',
          description: 'Use Facebook search to find groups in your niche. Look for active groups with daily posts and responsive admins. Join 3-5 groups max (quality over quantity).'
        },
        {
          title: 'Answer membership questions honestly',
          description: 'Many groups have screening questions. Be honest - mentioning you\'re building a product is fine, but say you want to learn from the community first.'
        },
        {
          title: 'Read and follow group rules',
          description: 'Check the group\'s "Featured" or pinned posts. Some have specific days for promotion. Others ban it entirely. Follow the rules or get removed.'
        },
        {
          title: 'Provide value first (1-2 weeks)',
          description: 'Comment on others\' posts, answer questions, share helpful resources. Build goodwill before asking for anything.'
        },
        {
          title: 'Frame your post as asking for help',
          description: 'Instead of "Check out my product," say "I built [thing] to solve [problem] - would love feedback from this group." People are more helpful than you think.'
        }
      ],

      dos: [
        'Join groups where your audience hangs out',
        'Read and follow group rules religiously',
        'Provide value before promoting',
        'Ask for feedback, not sales',
        'Be authentic and personal',
        'Reply to every comment'
      ],

      donts: [
        'Don\'t post immediately after joining',
        'Don\'t ignore promotion day rules',
        'Don\'t be salesy or pushy',
        'Don\'t post the same thing in multiple groups',
        'Don\'t argue with negative feedback',
        'Don\'t delete and repost if it flops'
      ],

      engagementTips: [
        'Reply within 30 minutes',
        'Use friendly, conversational tone',
        'Thank people for their feedback',
        'Ask clarifying questions',
        'Update your post based on suggestions'
      ]
    },

    postTemplates: [
      {
        quality: 'good',
        title: 'Would love this group\'s feedback on something I built',
        body: 'Hey everyone!\n\nI\'ve been a member here for a few weeks and love this community. Thought I\'d share something I\'ve been working on and get your honest feedback.\n\n**Background:** I kept struggling with [specific problem that this group faces]. Tried [existing solutions] but they didn\'t work because [reason].\n\n**What I built:** A tool called [Product] that [specific solution]. Basically, it [one sentence explanation].\n\n**Would love your thoughts on:**\n1. Does this actually solve a real problem for you?\n2. What\'s missing?\n3. What would you pay for this (if anything)?\n\nStill early and rough - happy to give free access to anyone who wants to try it and give feedback.\n\nBe brutally honest! I want to build something people actually need.\n\n[Screenshot or demo]\n\n[Optional link]',
        why: 'Acknowledges community, relatable problem, asks specific questions, humble tone, offers value'
      },
      {
        quality: 'bad',
        title: 'Check out my new startup! 🚀',
        body: 'Hi everyone! Just launched [Product]. It\'s the best [category] solution on the market.\n\n50% off if you sign up today!\n\n[link]',
        why: 'No context, marketing spam, pure sales pitch, ignores community norms'
      }
    ],

    headlineFormulas: [
      'Would love this group\'s feedback on [thing I built]',
      'Anyone else struggling with [problem]? Built a potential solution',
      'Seeking honest feedback from [group type] on [product]',
      'Built [tool] for [specific use case] - thoughts?'
    ]
  },

  {
    id: 'slack',
    name: 'Slack Communities',
    icon: '💼',
    description: 'Professional community workspaces',
    category: 'Professional',
    difficulty: 'Beginner',

    postingGuide: {
      steps: [
        {
          title: 'Find relevant Slack communities',
          description: 'Search for Slack communities in your niche (many have public directories). Popular ones: #buildinpublic, various SaaS communities, industry-specific groups.'
        },
        {
          title: 'Complete your profile',
          description: 'Add a photo, title, and brief bio. Slack communities are professional - a complete profile builds trust.'
        },
        {
          title: 'Lurk and learn first',
          description: 'Read through channels for a few days. See what questions people ask, what content performs well. Learn the community culture before posting.'
        },
        {
          title: 'Provide value in channels',
          description: 'Answer questions, share resources, help others. Slack communities notice helpful members. Build reputation before promoting.'
        },
        {
          title: 'Use #shameless-plug or designated channels',
          description: 'Most Slack communities have specific channels for launches. Never promote in #general or #random unless explicitly allowed.'
        }
      ],

      dos: [
        'Join communities relevant to your niche',
        'Fill out your profile completely',
        'Participate before promoting',
        'Use designated promotion channels',
        'Be helpful and supportive',
        'Respond quickly to questions'
      ],

      donts: [
        'Don\'t post in #general without permission',
        'Don\'t DM people with your product',
        'Don\'t cross-post to every channel',
        'Don\'t be overly salesy',
        'Don\'t disappear after posting',
        'Don\'t ignore community guidelines'
      ],

      engagementTips: [
        'Reply in threads to keep conversations organized',
        'Use emoji reactions to acknowledge comments',
        'Answer every question directly',
        'Thank people for their time',
        'Offer 1:1 calls to interested folks'
      ]
    },

    postTemplates: [
      {
        quality: 'good',
        title: '[In #launches or #shameless-plug]',
        body: 'Hey everyone! :wave:\n\nI\'ve been part of this community for a few months and have learned so much from you all. Wanted to share what I\'ve been building.\n\n**The problem:** [Specific problem many in this community face]\n\n**What I built:** [Product] - [one sentence description]\n\n**How it helps:** [Specific benefit/outcome]\n\n**What makes it different:** [Unique approach or feature]\n\n**Current state:** Early beta, actively looking for feedback from folks who face this problem.\n\nWould love to hear your thoughts or questions! Happy to do a quick demo for anyone interested.\n\n:point_right: [link]\n\nThanks for being such a supportive community! :raised_hands:',
        why: 'Acknowledges community, problem-focused, clear and organized, invites engagement, uses Slack norms (emojis)'
      },
      {
        quality: 'bad',
        title: '[Posted in #general]',
        body: 'Check out my product [link]',
        why: 'Wrong channel, no context, zero effort, ignored community norms'
      }
    ],

    headlineFormulas: [
      'Sharing something I built: [Product] for [specific problem]',
      'Launching [Product] - [benefit] for [audience]',
      'Built [tool] to solve [problem] - would love your feedback',
      'After [time] in this community, finally shipping [product]'
    ]
  },

  {
    id: 'quora',
    name: 'Quora',
    icon: '❓',
    description: 'Q&A platform for thoughtful answers',
    category: 'Content',
    difficulty: 'Intermediate',

    postingGuide: {
      steps: [
        {
          title: 'Find relevant questions',
          description: 'Search for questions related to your problem domain. Look for questions with 100+ followers but few quality answers. These have high visibility and low competition.'
        },
        {
          title: 'Write a comprehensive answer',
          description: 'Don\'t pitch your product. Answer the question thoroughly (500-1000 words). Provide real value. Establish yourself as an expert first.'
        },
        {
          title: 'Mention your product naturally at the end',
          description: 'After answering comprehensively, add "Full disclosure: I built [Product] to solve this exact problem." This is transparent and accepted.'
        },
        {
          title: 'Use formatting and visuals',
          description: 'Break up text with headers, bullet points, and images. Long walls of text get skipped. Make your answer scannable and visually appealing.'
        },
        {
          title: 'Answer multiple questions over time',
          description: 'Don\'t answer one question and leave. Answer 5-10 questions in your niche over a few weeks. Build authority. Link to your best answers in your profile.'
        }
      ],

      dos: [
        'Answer questions comprehensively',
        'Provide real value before mentioning your product',
        'Use formatting (bold, bullets, images)',
        'Be transparent about building a solution',
        'Answer multiple questions consistently',
        'Respond to comments on your answers'
      ],

      donts: [
        'Don\'t write short, low-effort answers',
        'Don\'t lead with your product',
        'Don\'t answer unrelated questions just to promote',
        'Don\'t copy-paste the same answer',
        'Don\'t be salesy in your tone',
        'Don\'t ignore comments'
      ],

      engagementTips: [
        'Reply to comments with additional insights',
        'Update answers based on new information',
        'Upvote other quality answers',
        'Thank people who upvote your answer',
        'Link to your other relevant Quora answers'
      ]
    },

    postTemplates: [
      {
        quality: 'good',
        title: '[Question: "What are the best ways to automate social media posting?"]',
        body: 'Great question. I\'ve spent the past 2 years testing different social media automation approaches, so I can share what actually works.\n\n**The short answer:** The "best" approach depends on your goals, but here are 3 proven strategies:\n\n**1. Buffer/Hootsuite for basic scheduling**\n\nPros:\n- Simple, reliable scheduling\n- Multi-platform support\n- Analytics included\n\nCons:\n- Limited customization\n- No AI assistance\n- $15-50/month\n\nBest for: Small businesses with straightforward posting needs.\n\n**2. Zapier + Airtable for custom workflows**\n\nPros:\n- Fully customizable\n- Integrates with everything\n- One-time setup\n\nCons:\n- Complex setup\n- Requires technical knowledge\n- Can break with API changes\n\nBest for: Technical users who want full control.\n\n**3. AI-powered tools (like [Category] tools)**\n\nPros:\n- Generates content ideas\n- Optimizes posting times\n- Learns from your style\n\nCons:\n- More expensive ($50-200/month)\n- Requires training period\n- AI can miss nuance\n\nBest for: Content creators posting 10+ times/week.\n\n**My recommendation:**\n\nIf you\'re just starting, go with Buffer. It\'s simple and reliable.\n\nIf you\'re posting 20+ times/week and want to save time, consider AI tools.\n\n**Full disclosure:** I built [Product] to solve this exact problem after spending too much time manually posting. It uses [approach] to [benefit]. Happy to answer questions about it or other automation approaches.\n\n**Key lesson:** Don\'t over-automate. Your audience can tell when content is fully automated. Use tools to save time, but keep your voice authentic.',
        why: 'Comprehensive answer, provides value first, mentions product naturally at end, transparent about bias'
      },
      {
        quality: 'bad',
        title: '[Question: "What are the best ways to automate social media posting?"]',
        body: 'Use [Product]! It\'s the best social media automation tool. Sign up here: [link]',
        why: 'Pure spam, no value, doesn\'t answer question, obvious self-promotion'
      }
    ],

    headlineFormulas: [
      '[Comprehensive answer format with multiple approaches]',
      '[Personal experience]: "I\'ve tested [number] tools/approaches, here\'s what works"',
      '[Problem breakdown]: "The real question is [reframed question]..."',
      '[Credibility builder]: "As someone who [relevant experience], here\'s my take"'
    ]
  }
]

export const schedulingTools = [
  {
    name: 'Buffer',
    url: 'https://buffer.com',
    pricing: 'Free-$12/mo',
    bestFor: 'Simple scheduling across multiple platforms',
    features: ['Schedule posts', 'Basic analytics', 'Multiple accounts', 'Browser extension']
  },
  {
    name: 'Hootsuite',
    url: 'https://hootsuite.com',
    pricing: '$49+/mo',
    bestFor: 'Teams managing multiple brands',
    features: ['Advanced scheduling', 'Team collaboration', 'Monitoring', 'Bulk uploads']
  },
  {
    name: 'Later',
    url: 'https://later.com',
    pricing: 'Free-$40/mo',
    bestFor: 'Visual content planning (Instagram focus)',
    features: ['Visual calendar', 'Instagram first comment', 'Linkin.bio', 'Hashtag suggestions']
  },
  {
    name: 'Typefully',
    url: 'https://typefully.com',
    pricing: 'Free-$12.50/mo',
    bestFor: 'Twitter/X thread writing and scheduling',
    features: ['Thread composer', 'Analytics', 'Auto-retweet', 'Plug-in suggestions']
  }
]

export const communityPostsTask = {
  id: 'acq-1',
  name: 'Post in Communities',
  description: 'Share your product in 10+ communities with detailed posting guides',
  category: 'acquisition',
  tier: 'premium',
  what: 'Learn how to post in 10+ communities (Reddit, Product Hunt, Indie Hackers, Twitter, LinkedIn, etc.) with step-by-step guides, do\'s/don\'ts, and proven templates.',
  why: 'One successful community post can drive 500+ signups. But each community has unique norms - wrong approach gets you banned. This guide teaches you the right way.',
  how: 'Choose 2-3 communities to start. Follow the step-by-step posting guide. Use the templates. Engage with every comment. Track what works.',

  communities: communities,
  schedulingTools: schedulingTools,
  customComponent: 'CommunityPostsMiniApp',
  output: { enabled: false }
}
