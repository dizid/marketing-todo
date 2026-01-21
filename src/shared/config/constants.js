/**
 * Global constants and configuration values
 * Single source of truth for deployment settings, quotas, and limits
 */

// ============================================================================
// SUBSCRIPTION TIERS & QUOTAS
// ============================================================================

export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise'
}

export const QUOTA_CONFIG = {
  [SUBSCRIPTION_TIERS.FREE]: {
    monthlyGenerations: 40,
    maxTasksPerGeneration: 5,
    maxTokensPerGeneration: 1500,
    description: 'Free plan with limited AI generations'
  },
  [SUBSCRIPTION_TIERS.PREMIUM]: {
    monthlyGenerations: 400,
    maxTasksPerGeneration: 50,
    maxTokensPerGeneration: 2000,
    description: 'Premium plan with high AI usage'
  },
  [SUBSCRIPTION_TIERS.ENTERPRISE]: {
    monthlyGenerations: -1, // Unlimited
    maxTasksPerGeneration: 500,
    maxTokensPerGeneration: 5000,
    description: 'Enterprise plan with unlimited usage'
  }
}

// Legacy constants for backward compatibility (will be replaced by QUOTA_CONFIG)
export const FREE_TIER_QUOTA = QUOTA_CONFIG[SUBSCRIPTION_TIERS.FREE].monthlyGenerations
export const PREMIUM_TIER_QUOTA = QUOTA_CONFIG[SUBSCRIPTION_TIERS.PREMIUM].monthlyGenerations

// ============================================================================
// FEATURE FLAGS
// ============================================================================

export const FEATURES = {
  AI_GENERATION: true,
  STRIPE_INTEGRATION: true,
  ANALYTICS: true,
  EXPORT_TO_HTML: true,
  TASK_RECOMMENDATIONS: false, // Coming soon
  COLLABORATIVE_EDITING: false, // Coming soon
  API_ACCESS: false // Coming soon
}

// ============================================================================
// STORAGE KEYS
// ============================================================================

export const STORAGE_KEYS = {
  AUTH_SESSION: 'auth_session',
  ONBOARDING_DATA: 'onboarding_wizard',
  ONBOARDING_STEP: 'onboarding_current_step',
  THEME: 'user_theme',
  PREFERENCES: 'user_preferences',
  LAST_PROJECT: 'last_selected_project'
}

export const STORAGE_EXPIRY_DAYS = {
  ONBOARDING: 7,
  SESSION: 30,
  PREFERENCES: 365
}

// ============================================================================
// API & TIMEOUTS
// ============================================================================

export const API_CONFIG = {
  REQUEST_TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second between retries
  BASE_BACKOFF: 2 // Exponential backoff multiplier
}

export const GROK_CONFIG = {
  MODEL: 'grok-3-fast',
  DEFAULT_TEMPERATURE: 0.8,
  DEFAULT_MAX_TOKENS: 1500,
  MIN_TOKENS: 100,
  MAX_TOKENS: 4000,
  TIMEOUT: 30000
}

export const NETLIFY_FUNCTIONS = {
  GROK_PROXY: '/.netlify/functions/grok-proxy',
  STRIPE_CREATE: '/.netlify/functions/stripe-create-subscription',
  STRIPE_CANCEL: '/.netlify/functions/stripe-cancel-subscription',
  STRIPE_WEBHOOK: '/.netlify/functions/stripe-webhook',
  STRIPE_PORTAL: '/.netlify/functions/stripe-portal-session'
}

// ============================================================================
// PAGINATION & LIMITS
// ============================================================================

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  AI_USAGE_HISTORY_SIZE: 50
}

export const LIMITS = {
  PROJECT_NAME_MAX_LENGTH: 100,
  PROJECT_DESCRIPTION_MAX_LENGTH: 1000,
  TASK_FORM_FIELD_MAX_LENGTH: 5000,
  AI_OUTPUT_MAX_LENGTH: 10000,
  SAVED_ITEMS_PER_TASK: 100
}

// ============================================================================
// DATE & TIME
// ============================================================================

export const TIME_CONFIG = {
  QUOTA_RESET_DAY_OF_MONTH: 1, // Reset on 1st of each month
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  DEBOUNCE_DELAY: 500, // ms
  THROTTLE_DELAY: 300 // ms
}

// ============================================================================
// VALIDATION RULES
// ============================================================================

export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/,
  UUID_REGEX: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  TASK_ID_REGEX: /^[a-z]+([-_][a-z0-9]+)*$/,
  URL_REGEX: /^https?:\/\/.+/
}

// ============================================================================
// TASK CATEGORIES
// ============================================================================

export const TASK_CATEGORIES = {
  SETUP: 'setup',
  SOCIAL: 'social',
  CONTENT: 'content',
  ACQUISITION: 'acquisition',
  FEEDBACK: 'feedback',
  ANALYTICS: 'analytics',
  SALES: 'sales',
  GROWTH: 'growth'
}

export const CATEGORY_LABELS = {
  [TASK_CATEGORIES.SETUP]: 'Setup Basics',
  [TASK_CATEGORIES.SOCIAL]: 'Social Media Marketing',
  [TASK_CATEGORIES.CONTENT]: 'Content Creation',
  [TASK_CATEGORIES.ACQUISITION]: 'User Acquisition & Engagement',
  [TASK_CATEGORIES.FEEDBACK]: 'Feedback & Iteration',
  [TASK_CATEGORIES.ANALYTICS]: 'Analytics & Optimization',
  [TASK_CATEGORIES.SALES]: 'Sales Optimization',
  [TASK_CATEGORIES.GROWTH]: 'Growth Strategy'
}

// ============================================================================
// ERROR CODES
// ============================================================================

export const ERROR_CODES = {
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  INSUFFICIENT_QUOTA: 'INSUFFICIENT_QUOTA',
  PROJECT_NOT_FOUND: 'PROJECT_NOT_FOUND',
  TASK_NOT_FOUND: 'TASK_NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  API_ERROR: 'API_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
}

// ============================================================================
// ENVIRONMENT DETECTION
// ============================================================================

export const ENV = {
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  isSsr: typeof window === 'undefined'
}

// ============================================================================
// SUPABASE CONFIG
// ============================================================================

export const SUPABASE_CONFIG = {
  TABLES: {
    PROJECTS: 'projects',
    PROJECT_DATA: 'project_data',
    PROJECT_CONTEXTS: 'project_contexts',
    USER_PROFILES: 'user_profiles',
    SUBSCRIPTIONS: 'subscriptions',
    AI_USAGE: 'ai_usage',
    CATEGORY_NOTES: 'category_notes',
    GENERATED_CONTENT: 'generated_content'
  },
  PROJECT_DATA_KEYS: {
    SETTINGS: 'settings',
    TASKS: 'tasks',
    CONTENT: 'content',
    TASK_DATA: 'taskData'
  }
}

// ============================================================================
// COLORS & STYLING
// ============================================================================

export const STATUS_COLORS = {
  SUCCESS: 'green',
  ERROR: 'red',
  WARNING: 'yellow',
  INFO: 'blue',
  COMPLETED: 'green',
  PENDING: 'gray',
  IN_PROGRESS: 'blue'
}

// ============================================================================
// CURRENCY
// ============================================================================

export const CURRENCY = {
  DEFAULT: 'USD',
  SYMBOL: '$'
}

// ============================================================================
// PAGINATION DEFAULTS
// ============================================================================

export const DEFAULT_PAGINATION = {
  pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
  currentPage: 1
}
