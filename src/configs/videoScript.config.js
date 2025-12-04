export const videoScriptTask = {
  id: 'content-2',
  name: 'Video Script Outline Generator',
  description: 'Generate a structured script outline for a product demo video',
  category: 'content',

  // Freemium model - Premium tier task
  tier: 'premium',
  what: 'Script a 2-minute product demo video with section-by-section guidance, timing targets, and professional structure. Learn best practices for video that sells.',
  why: 'Video converts 80% better than text. Users watch demos instead of reading docs. A 2-minute demo is easier than a 10-page blog post.',
  how: 'Fill in your product details, then get an AI-generated script with timing for each section (hook, problem, solution, features, CTA). Record screen capture and voice over.',

  customComponent: 'VideoScriptMiniApp',
  sections: [
    { id: 'hook', title: 'Hook/Opening', target: 5, guidance: 'Grab attention in first 5 seconds. Ask a question or state a problem.' },
    { id: 'problem', title: 'Problem Statement', target: 15, guidance: 'Explain the pain point clearly in 15 seconds.' },
    { id: 'demo', title: 'Solution Demo', target: 60, guidance: 'Show how your product solves the problem. Break into 3-4 sub-steps.' },
    { id: 'features', title: 'Key Features', target: 30, guidance: 'Highlight 3-4 main features in 30 seconds.' },
    { id: 'cta', title: 'CTA/Closing', target: 10, guidance: 'Clear call-to-action. Where to sign up or learn more.' }
  ],
  output: { enabled: false },

  help: {
    examples: [
      {
        scenario: 'SaaS creating 2-minute product demo for landing page',
        input: { product_type: 'project management tool', target_audience: 'remote teams', main_benefit: 'eliminate meeting chaos', video_length: 120 },
        output: 'Structured video script with timing: Hook (0:00-0:05) "Tired of endless status meetings?", Problem (0:05-0:20) "Remote teams waste 10+ hours weekly in meetings that could be async updates", Solution Demo (0:20-1:20) screen recording showing: creating project, assigning tasks, automatic status updates replacing meetings, Features (1:20-1:50) highlighting real-time updates, integrations, mobile app, CTA (1:50-2:00) "Start free trial at [URL]". Includes shot list, voiceover script, and screen recording instructions.'
      },
      {
        scenario: 'Course creator scripting promotional video for social media',
        input: { product_type: 'email marketing course', target_audience: 'solopreneurs', main_benefit: 'build email list to 1000', video_length: 60 },
        output: '60-second social promo script: Hook (0:00-0:05) "Want to grow your email list fast?", Problem (0:05-0:15) "Most solopreneurs struggle to get past 50 subscribers", Solution (0:15-0:40) showing before/after student results (0 to 1200 subscribers in 90 days), explaining 3-step framework, Features (0:40-0:50) "24 video lessons, templates, community", CTA (0:50-0:60) "Link in bio - enrollment closes Friday". Optimized for vertical format (9:16) with captions for sound-off viewing.'
      }
    ],
    commonMistakes: [
      'Slow hook - starting with company intro or long explanation. First 3 seconds must grab attention: ask provocative question, show unexpected result, or state bold claim.',
      'Talking head instead of screen recording - filming yourself talking about the product instead of showing it. For software/digital products, 80% should be screen recording, 20% talking head max.',
      'Too long - creating 10-minute videos when viewer drop-off starts at 2 minutes. Aim for 60-90 seconds for social, 2-3 minutes max for website demos. Shorter is better.',
      'Feature dumping - listing 20 features instead of focusing on 3 core benefits. Show outcomes ("save 10 hours/week") not features ("automated reminders").',
      'No captions - posting videos without captions when 85% of social videos are watched without sound. Always add burned-in captions or use platform auto-captions.',
      'Poor audio quality - using laptop mic in echoey room. Invest in $50 USB mic (Blue Snowball) - audio quality matters more than video quality for demos.'
    ]
  }
}
