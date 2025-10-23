/**
 * Task Registry - Central mapping of task IDs to components and metadata
 *
 * This registry defines:
 * - Task ID to component mapping
 * - Task metadata (type, icon, description)
 * - Task UI configuration
 *
 * Task Types:
 * - 'form': User fills out a form (stored in taskData)
 * - 'generate': AI generates content, user edits and saves
 * - 'simple': Just checkbox + notes (no special UI)
 */

// Map task IDs to components
const taskComponentMap = {
  // Setup Basics
  'setup-1': () => import('@/components/Task/Forms/DefineAudienceTask.vue'),
  'setup-2': () => import('@/components/Task/Forms/DefineGoalsTask.vue'),
  'setup-3': () => import('@/components/Task/Forms/SetupIntegrationsTask.vue'),
  'setup-4': () => import('@/components/Task/Forms/PrepareAssetsTask.vue'),
  'setup-5': () => import('@/components/Task/Forms/SetupTrackingTask.vue'),

  // Social Media Marketing
  'social-1': () => import('@/components/Task/Generate/GeneratePostsTask.vue'),
  'social-2': () => import('@/components/Task/Forms/EngageFollowersTask.vue'),
  'social-3': () => import('@/components/Task/Generate/GenerateGiveawayTask.vue'),

  // Content Creation
  'content-1': () => import('@/components/Task/Generate/GenerateBlogTask.vue'),
  'content-2': () => import('@/components/Task/Forms/GenerateVideoTask.vue'),
  'content-3': () => import('@/components/Task/Generate/GenerateGraphicsTask.vue'),

  // User Acquisition & Engagement
  'acq-1': () => import('@/components/Task/Generate/GeneratePostTask.vue'),
  'acq-2': () => import('@/components/Task/Generate/GenerateOutreachTask.vue'),
  'acq-3': () => import('@/components/Task/Generate/GenerateWebinarTask.vue'),

  // Feedback & Iteration
  'feedback-1': () => import('@/components/Task/Forms/CollectFeedbackTask.vue'),
  'feedback-2': () => import('@/components/Task/Forms/PublishUpdatesTask.vue'),
  'feedback-3': () => import('@/components/Task/Forms/IterateFeaturesTask.vue'),

  // Analytics & Optimization
  'analytics-1': () => import('@/components/Task/Forms/SetupAnalyticsTask.vue'),
  'analytics-2': () => import('@/components/Task/Forms/OptimizeChannelsTask.vue'),
  'analytics-3': () => import('@/components/Task/Forms/ReviewROITask.vue')
}

/**
 * Task metadata and configuration
 * Organized by category and task ID
 */
const taskMetadata = {
  'setup-1': {
    name: 'Define Audience & Goals',
    type: 'form',
    category: 'setup',
    icon: '🎯',
    description: 'Profile ideal users and set acquisition targets.',
    hasAI: true,
    aiPrompt: 'Suggest 3 personas and a 30-day plan for [app desc] to get 150 users.',
    fields: ['audience', 'personas', 'targetUsers', 'timeline', 'notes']
  },
  'setup-2': {
    name: 'Set Up Landing Page',
    type: 'form',
    category: 'setup',
    icon: '📄',
    description: 'Build a simple site with features, screenshots, and sign-up form.',
    hasAI: true,
    aiPrompt: 'Generate headline, 5 bullets, and CTA copy for landing page on [app desc].',
    fields: ['headline', 'bullets', 'ctaCopy', 'notes']
  },
  'setup-3': {
    name: 'Connect Accounts',
    type: 'form',
    category: 'setup',
    icon: '🔗',
    description: 'Link social (X, LinkedIn, Reddit), email (Mailchimp), and analytics.',
    hasAI: false,
    fields: ['integrations', 'notes']
  },
  'setup-4': {
    name: 'Prepare Assets',
    type: 'form',
    category: 'setup',
    icon: '🎨',
    description: 'Create demo video/screenshots and basic branding.',
    hasAI: true,
    aiPrompt: 'Describe 4 visual asset ideas (e.g., banners) for [app desc].',
    fields: ['assets', 'branding', 'notes']
  },
  'setup-5': {
    name: 'Set Up Tracking Sheet',
    type: 'form',
    category: 'setup',
    icon: '📊',
    description: 'Use Google Sheets for logging sign-ups and sources.',
    hasAI: true,
    aiPrompt: 'Create a spreadsheet template outline for tracking marketing metrics.',
    fields: ['metrics', 'sources', 'notes']
  },
  'social-1': {
    name: 'Schedule Posts',
    type: 'generate',
    category: 'social',
    icon: '📱',
    description: 'Plan and queue 4-6 updates on X/LinkedIn/Instagram.',
    hasAI: true,
    aiPrompt: 'Generate 10 posts for [app desc] with hashtags, emojis, and sign-up links.',
    fields: ['generatedPosts', 'selectedPosts', 'notes']
  },
  'social-2': {
    name: 'Engage Followers',
    type: 'form',
    category: 'social',
    icon: '💬',
    description: 'Respond to comments/DMs to build community.',
    hasAI: true,
    aiPrompt: 'Create 6 reply templates for common interactions on [app desc].',
    fields: ['replyTemplates', 'notes']
  },
  'social-3': {
    name: 'Run Giveaway/Contest',
    type: 'generate',
    category: 'social',
    icon: '🎁',
    description: 'Offer free access for shares/retweets.',
    hasAI: true,
    aiPrompt: 'Draft a giveaway announcement post and rules for [app desc].',
    fields: ['giveawayContent', 'rules', 'notes']
  },
  'content-1': {
    name: 'Write Blog Post',
    type: 'generate',
    category: 'content',
    icon: '📝',
    description: 'Detail app benefits or niche tutorials.',
    hasAI: true,
    aiPrompt: 'Draft 500-word blog on [app niche], including promo for [app desc].',
    fields: ['blogContent', 'notes']
  },
  'content-2': {
    name: 'Create Video Tutorial',
    type: 'form',
    category: 'content',
    icon: '🎥',
    description: 'Short demo of key features.',
    hasAI: true,
    aiPrompt: 'Script a 2-min video walkthrough for [app desc].',
    fields: ['videoScript', 'features', 'notes']
  },
  'content-3': {
    name: 'Design Graphics',
    type: 'generate',
    category: 'content',
    icon: '🖼️',
    description: 'Social banners, infographics.',
    hasAI: true,
    aiPrompt: 'Describe 5 graphic designs (colors, elements) for promoting [app desc].',
    fields: ['graphicDescriptions', 'notes']
  },
  'acq-1': {
    name: 'Post in Communities',
    type: 'generate',
    category: 'acquisition',
    icon: '🌐',
    description: 'Share on Reddit, Indie Hackers, Product Hunt.',
    hasAI: true,
    aiPrompt: 'Write an announcement post for Reddit r/[subreddit] about [app desc].',
    fields: ['communityPosts', 'selectedCommunities', 'notes']
  },
  'acq-2': {
    name: 'Personalized Outreach',
    type: 'generate',
    category: 'acquisition',
    icon: '✉️',
    description: 'Email/DM 20-50 potential users.',
    hasAI: true,
    aiPrompt: 'Generate 5 cold outreach templates for devs interested in [app desc].',
    fields: ['outreachTemplates', 'selectedTemplates', 'notes']
  },
  'acq-3': {
    name: 'Host Webinar/Q&A',
    type: 'generate',
    category: 'acquisition',
    icon: '🎤',
    description: 'Live session for demos.',
    hasAI: true,
    aiPrompt: 'Outline a 30-min webinar script on [app topic].',
    fields: ['webinarScript', 'topics', 'notes']
  },
  'feedback-1': {
    name: 'Collect User Feedback',
    type: 'form',
    category: 'feedback',
    icon: '💭',
    description: 'Send surveys or interviews to 10+ users.',
    hasAI: true,
    aiPrompt: 'Create 10 survey questions to gather feedback on [app desc].',
    fields: ['surveyQuestions', 'feedbackSources', 'notes']
  },
  'feedback-2': {
    name: 'Publish Product Updates',
    type: 'form',
    category: 'feedback',
    icon: '🆕',
    description: 'Share improvements and bug fixes on social.',
    hasAI: true,
    aiPrompt: 'Write 3 social media announcements for new features in [app desc].',
    fields: ['updates', 'channels', 'notes']
  },
  'feedback-3': {
    name: 'Iterate on Features',
    type: 'form',
    category: 'feedback',
    icon: '🔄',
    description: 'Prioritize user requests and refine product.',
    hasAI: true,
    aiPrompt: 'Suggest 3 feature improvements based on user feedback for [app desc].',
    fields: ['improvements', 'priorityLevel', 'notes']
  },
  'analytics-1': {
    name: 'Set Up Analytics',
    type: 'form',
    category: 'analytics',
    icon: '📈',
    description: 'Track sign-ups, retention, and engagement metrics.',
    hasAI: false,
    fields: ['metrics', 'tools', 'notes']
  },
  'analytics-2': {
    name: 'Optimize Channels',
    type: 'form',
    category: 'analytics',
    icon: '🎯',
    description: 'Double down on high-performers.',
    hasAI: true,
    aiPrompt: 'Based on [metrics], suggest a pivot plan for marketing focus.',
    fields: ['topChannels', 'optimizations', 'notes']
  },
  'analytics-3': {
    name: 'Review ROI',
    type: 'form',
    category: 'analytics',
    icon: '💰',
    description: 'Calculate cost-per-user (even if organic).',
    hasAI: false,
    fields: ['costPerUser', 'roi', 'notes']
  }
}

/**
 * Get task component by ID
 * Returns a dynamic import promise
 */
export const getTaskComponent = (taskId) => {
  return taskComponentMap[taskId]
}

/**
 * Get task metadata by ID
 */
export const getTaskMetadata = (taskId) => {
  return taskMetadata[taskId]
}

/**
 * Get all task metadata
 */
export const getAllTaskMetadata = () => {
  return taskMetadata
}

/**
 * Check if task has a custom component
 */
export const hasTaskComponent = (taskId) => {
  return !!taskComponentMap[taskId]
}

/**
 * Get all tasks of a specific type
 */
export const getTasksByType = (type) => {
  return Object.entries(taskMetadata)
    .filter(([, metadata]) => metadata.type === type)
    .map(([id, metadata]) => ({ id, ...metadata }))
}

/**
 * Export all for testing/debugging
 */
export default {
  getTaskComponent,
  getTaskMetadata,
  getAllTaskMetadata,
  hasTaskComponent,
  getTasksByType
}
