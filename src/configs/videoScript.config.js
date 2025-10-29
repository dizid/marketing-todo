export const videoScriptTask = {
  id: 'content-2',
  name: 'Create Video Tutorial',
  description: 'Script and plan a product demo video',
  category: 'content',
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
