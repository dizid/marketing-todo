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
  // Setup Basics - NOW using new Mini-Apps (v2 - configuration-driven framework)
  'setup-1': () => import('@/components/TaskMiniApps/DefineAudienceMiniApp.vue'),  // NEW: Mini-App version
  'setup-2': () => import('@/components/TaskMiniApps/LandingPageCreatorAssistant.vue'),  // NEW: Landing Page Creator Mini-App
  'setup-3': () => import('@/components/TaskMiniApps/ConnectAccountsMiniApp.vue'),
  'setup-4': () => import('@/components/TaskMiniApps/PrepareAssetsMiniApp.vue'),
  'setup-5': () => import('@/components/TaskMiniApps/TrackingSheetMiniApp.vue'),

  // Social Media - NOW using new Mini-Apps
  'social-1': () => import('@/components/TaskMiniApps/GeneratePostsMiniApp.vue'),  // NEW: Mini-App version
  'social-2': () => import('@/components/TaskMiniApps/EngageFollowersMiniApp.vue'),
  'social-3': () => import('@/components/TaskMiniApps/GiveawayMiniApp.vue'),

  // Content Creation
  'content-1': () => import('@/components/TaskMiniApps/WriteBlogPostMiniApp.vue'),
  'content-2': () => import('@/components/TaskMiniApps/VideoScriptMiniApp.vue'),
  'content-3': () => import('@/components/TaskMiniApps/DesignGraphicsMiniApp.vue'),

  // User Acquisition & Engagement
  'acq-1': () => import('@/components/TaskMiniApps/CommunityPostsMiniApp.vue'),
  'acq-2': () => import('@/components/TaskMiniApps/OutreachMiniApp.vue'),
  'acq-3': () => import('@/components/TaskMiniApps/WebinarMiniApp.vue'),

  // Feedback & Iteration
  'feedback-1': () => import('@/components/TaskMiniApps/FeedbackCollectionMiniApp.vue'),
  'feedback-2': () => import('@/components/TaskMiniApps/ChangelogMiniApp.vue'),
  'feedback-3': () => import('@/components/TaskMiniApps/FeaturePrioritizationMiniApp.vue'),

  // Analytics & Optimization
  'analytics-1': () => import('@/components/TaskMiniApps/AnalyticsSetupMiniApp.vue'),
  'analytics-2': () => import('@/components/TaskMiniApps/ChannelAnalyzerMiniApp.vue'),
  'analytics-3': () => import('@/components/TaskMiniApps/RoiCalculatorMiniApp.vue')
}

/**
 * Task metadata and configuration
 * Organized by category and task ID
 */
const taskMetadata = {
  // NEW Mini-Apps (v2) - these now use the main task IDs
  'setup-1': {
    name: 'Define Audience & Goals',
    type: 'miniapp',
    category: 'setup',
    icon: '🎯',
    description: 'Create detailed buyer personas and market analysis with AI assistance.',
    hasAI: true,
    miniAppId: 'define-audience',
    fields: ['audience_overview', 'industry', 'company_size', 'job_titles', 'pain_points', 'budget_range', 'target_users_30d', 'market_size', 'notes']
  },
  'social-1': {
    name: 'Schedule Posts',
    type: 'miniapp',
    category: 'social',
    icon: '📱',
    description: 'Create platform-optimized social media posts with AI assistance. Generate multiple variants and pick your favorites.',
    hasAI: true,
    miniAppId: 'generate-posts',
    fields: ['platforms', 'tone', 'cta', 'post_count', 'content_focus', 'keywords', 'audience_context', 'notes']
  },

  // NOTE: Old setup-1 and social-1 metadata removed - replaced with mini-app versions above
  'setup-2': {
    name: 'Landing Page Creator',
    type: 'miniapp',
    category: 'setup',
    icon: '🚀',
    description: 'Build a professional landing page in 5 minutes. No coding required. AI-assisted copy suggestions included.',
    hasAI: true,
    miniAppId: 'landing-page-creator',
    fields: ['brand_name', 'tagline', 'hero_headline', 'hero_subheadline', 'features', 'signup_headline', 'footer_company_name']
  },
  'setup-3': {
    name: 'Connect Accounts',
    type: 'miniapp',
    category: 'setup',
    icon: '🔗',
    description: 'Link your social media, email, and analytics accounts. Takes 5 minutes per platform.',
    hasAI: false,
    miniAppId: 'connect-accounts'
  },
  'setup-4': {
    name: 'Prepare Assets',
    type: 'miniapp',
    category: 'setup',
    icon: '🎨',
    description: 'Create logos, images, videos, and brand guidelines.',
    hasAI: false,
    miniAppId: 'prepare-assets'
  },
  'setup-5': {
    name: 'Set Up Tracking Sheet',
    type: 'miniapp',
    category: 'setup',
    icon: '📊',
    description: 'Create a tracking sheet to monitor sign-ups, sources, and conversions.',
    hasAI: false,
    miniAppId: 'tracking-sheet'
  },
  'social-2': {
    name: 'Engage Followers',
    type: 'miniapp',
    category: 'social',
    icon: '💬',
    description: 'Template responses for common interactions. Build community by engaging followers.',
    hasAI: false,
    miniAppId: 'engage-followers',
    fields: ['completed']
  },
  'social-3': {
    name: 'Run Giveaway/Contest',
    type: 'miniapp',
    category: 'social',
    icon: '🎁',
    description: 'Launch a giveaway in 5 steps. Offer free access for shares and engagement.',
    hasAI: false,
    miniAppId: 'giveaway',
    fields: ['prizeValue', 'duration', 'prizeDescription', 'rules', 'promotion']
  },
  'content-1': {
    name: 'Write Blog Post',
    type: 'miniapp',
    category: 'content',
    icon: '📝',
    description: 'Create a compelling blog post with AI-guided structure and research',
    hasAI: true,
    miniAppId: 'write-blog',
    fields: ['topic', 'audience', 'keywords', 'tone', 'wordCount', 'sections', 'fullBlog']
  },
  'content-2': {
    name: 'Create Video Tutorial',
    type: 'miniapp',
    category: 'content',
    icon: '🎥',
    description: 'Script a 2-minute product demo. Section-by-section guidance with timing targets.',
    hasAI: false,
    miniAppId: 'video-script',
    fields: ['hook', 'problem', 'demo', 'features', 'cta']
  },
  'content-3': {
    name: 'Design Graphics',
    type: 'miniapp',
    category: 'content',
    icon: '🖼️',
    description: 'Create graphics with AI-guided design briefs and step-by-step tutorials',
    hasAI: true,
    miniAppId: 'design-graphics',
    fields: ['purpose', 'style', 'message', 'brief', 'designHistory']
  },
  'acq-1': {
    name: 'Post in Communities',
    type: 'miniapp',
    category: 'acquisition',
    icon: '🌐',
    description: 'Share on Reddit, Indie Hackers, Product Hunt, HackerNews, Dev.to. Community-specific tone guides.',
    hasAI: false,
    miniAppId: 'community-posts',
    fields: ['posted']
  },
  'acq-2': {
    name: 'Personalized Outreach',
    type: 'miniapp',
    category: 'acquisition',
    icon: '✉️',
    description: 'Generate personalized outreach emails and messages with AI assistance. Tailored to your audience and product.',
    hasAI: true,
    miniAppId: 'outreach',
    fields: ['recipient_segment', 'channel', 'tone', 'call_to_action', 'additional_details', 'notes']
  },
  'acq-3': {
    name: 'Host Webinar/Q&A',
    type: 'miniapp',
    category: 'acquisition',
    icon: '🎤',
    description: 'Plan a 30-minute webinar. Structure, topics, and Q&A guidance.',
    hasAI: false,
    miniAppId: 'webinar',
    fields: ['items']
  },
  'feedback-1': {
    name: 'Collect User Feedback',
    type: 'miniapp',
    category: 'feedback',
    icon: '💭',
    description: 'Send surveys or interviews to 10+ users. 5 survey type templates.',
    hasAI: false,
    miniAppId: 'feedback-collection',
    fields: ['items']
  },
  'feedback-2': {
    name: 'Publish Product Updates',
    type: 'miniapp',
    category: 'feedback',
    icon: '🆕',
    description: 'Share improvements and bug fixes. Track changelog across channels.',
    hasAI: false,
    miniAppId: 'changelog',
    fields: ['items']
  },
  'feedback-3': {
    name: 'Iterate on Features',
    type: 'miniapp',
    category: 'feedback',
    icon: '🔄',
    description: 'Prioritize user requests and refine product. Feature matrix with impact/effort.',
    hasAI: false,
    miniAppId: 'feature-prioritization',
    fields: ['items']
  },
  'analytics-1': {
    name: 'Set Up Analytics',
    type: 'miniapp',
    category: 'analytics',
    icon: '📈',
    description: 'Track sign-ups, retention, engagement metrics. Setup guides for 5 tools.',
    hasAI: false,
    miniAppId: 'analytics-setup',
    fields: ['items']
  },
  'analytics-2': {
    name: 'Optimize Channels',
    type: 'miniapp',
    category: 'analytics',
    icon: '🎯',
    description: 'Analyze metrics by channel. Double down on high-performers.',
    hasAI: false,
    miniAppId: 'channel-analyzer',
    fields: ['items']
  },
  'analytics-3': {
    name: 'Review ROI',
    type: 'miniapp',
    category: 'analytics',
    icon: '💰',
    description: 'Calculate cost-per-user and track ROI metrics. 5 key metrics to monitor.',
    hasAI: false,
    miniAppId: 'roi-calculator',
    fields: ['items']
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
