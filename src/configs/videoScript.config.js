export const videoScriptTask = {
  id: 'content-2',
  name: 'Create Video Tutorial',
  description: 'Script and plan a product demo video',
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
  output: { enabled: false }
}
