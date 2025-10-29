export const communities = [
  {
    id: 'reddit',
    name: 'Reddit',
    icon: '🤖',
    description: 'r/[niche], r/startups, r/SideProject',
    tone: 'Casual, community-focused, authentic',
    rules: 'No direct self-promotion. Focus on value first.',
    template: 'Check out this [thing] I built for [problem]. Would love feedback!'
  },
  {
    id: 'indie-hackers',
    name: 'Indie Hackers',
    icon: '👨‍💻',
    description: 'Indie Hackers community',
    tone: 'Honest, builder-focused, transparent about metrics',
    rules: 'Share your journey, lessons learned, not just promo.',
    template: 'Launched [product]. Here\'s what I learned building it...'
  },
  {
    id: 'product-hunt',
    name: 'Product Hunt',
    icon: '🚀',
    description: 'Product Hunt launch community',
    tone: 'Enthusiastic, polished, story-driven',
    rules: 'Make your best first impression. Prepare for launch day.',
    template: 'We\'ve been working on [product] to solve [problem]. Excited to share it!'
  },
  {
    id: 'hackernews',
    name: 'Hacker News',
    icon: '⚙️',
    description: 'Tech-focused community',
    tone: 'Technical, thoughtful, substantive',
    rules: 'Focus on interesting technical aspects or story.',
    template: '[Title that explains what/why, not hype]'
  },
  {
    id: 'devto',
    name: 'Dev.to',
    icon: '📝',
    description: 'Developer community',
    tone: 'Educational, helpful, tutorial-focused',
    rules: 'Share knowledge and experience, not just product promo.',
    template: 'How we built [feature] for [product]: [technical insights]'
  }
]

export const communityPostsTask = {
  id: 'acq-1',
  name: 'Post in Communities',
  description: 'Share your product in niche communities',
  category: 'acquisition',
  communities: communities,
  customComponent: 'CommunityPostsMiniApp',
  output: { enabled: false }
}
