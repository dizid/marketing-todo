/**
 * Test Utilities & Helpers
 *
 * Reusable testing utilities for unit and integration tests
 */

import { vi } from 'vitest'

/**
 * Create mock repository with all required methods
 */
export function createMockRepository(overrides = {}) {
  return {
    getAll: vi.fn().mockResolvedValue([]),
    getById: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockResolvedValue({}),
    update: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue(undefined),
    ...overrides
  }
}

/**
 * Create mock logger with all required methods
 */
export function createMockLogger(overrides = {}) {
  return {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    logError: vi.fn(),
    child: vi.fn().mockReturnValue(createMockLogger()),
    ...overrides
  }
}

/**
 * Create mock Task domain model
 */
export function createMockTask(overrides = {}) {
  return {
    id: 'task-1',
    name: 'Test Task',
    config: {},
    status: { checked: false, removed: false },
    data: {},
    complete: vi.fn(),
    incomplete: vi.fn(),
    toggleCompletion: vi.fn(),
    remove: vi.fn(),
    restore: vi.fn(),
    isCompleted: vi.fn().mockReturnValue(false),
    isRemoved: vi.fn().mockReturnValue(false),
    isVisible: vi.fn().mockReturnValue(true),
    hasAI: vi.fn().mockReturnValue(false),
    setFormData: vi.fn(),
    getFormData: vi.fn().mockReturnValue({}),
    addAIOutput: vi.fn(),
    getAIOutputs: vi.fn().mockReturnValue([]),
    clearData: vi.fn(),
    toJSON: vi.fn().mockReturnValue({}),
    ...overrides
  }
}

/**
 * Create mock Quota domain model
 */
export function createMockQuota(tier = 'free', usage = 0, overrides = {}) {
  return {
    tier,
    usageThisMonth: usage,
    getLimit: vi.fn().mockReturnValue(tier === 'free' ? 20 : tier === 'premium' ? 200 : Infinity),
    getRemaining: vi.fn().mockReturnValue(20 - usage),
    getPercentage: vi.fn().mockReturnValue((usage / 20) * 100),
    canGenerate: vi.fn().mockReturnValue(usage < 20),
    isExceeded: vi.fn().mockReturnValue(usage >= 20),
    isNearLimit: vi.fn().mockReturnValue(usage > 18),
    recordUsage: vi.fn(),
    upgradeTo: vi.fn(),
    reset: vi.fn(),
    getDisplayMessage: vi.fn().mockReturnValue('Test message'),
    getStatus: vi.fn().mockReturnValue({ tier, used: usage, limit: 20 }),
    toJSON: vi.fn().mockReturnValue({ tier, usageThisMonth: usage }),
    ...overrides
  }
}

/**
 * Create mock API client
 */
export function createMockApiClient(overrides = {}) {
  return {
    generate: vi.fn().mockResolvedValue({
      text: 'Generated content',
      tokens: 150
    }),
    health: vi.fn().mockResolvedValue({ status: 'ok' }),
    ...overrides
  }
}

/**
 * Wait for async operations with timeout
 */
export function waitFor(callback, options = {}) {
  const { timeout = 3000, interval = 50 } = options
  const start = Date.now()

  return new Promise((resolve, reject) => {
    const check = () => {
      if (Date.now() - start > timeout) {
        reject(new Error(`Timeout after ${timeout}ms`))
        return
      }

      try {
        const result = callback()
        if (result) {
          resolve(result)
        } else {
          setTimeout(check, interval)
        }
      } catch (error) {
        setTimeout(check, interval)
      }
    }

    check()
  })
}

/**
 * Create sample form data for testing
 */
export function createSampleFormData(overrides = {}) {
  return {
    appDescription: 'My amazing app',
    targetAudience: 'Developers',
    budget: '5000',
    timeline: 'Q4 2024',
    ...overrides
  }
}

/**
 * Create sample task config
 */
export function createSampleTaskConfig(overrides = {}) {
  return {
    id: 'task-1',
    name: 'Test Task',
    description: 'Task description',
    aiPrompt: 'Generate content for {appDescription}',
    hasAI: true,
    form: [
      {
        id: 'appDescription',
        type: 'textarea',
        label: 'App Description',
        required: true
      }
    ],
    ...overrides
  }
}

/**
 * Flush all pending promises
 */
export function flushPromises() {
  return new Promise(resolve => setImmediate(resolve))
}

/**
 * Create resolved promise
 */
export function resolvedPromise(value) {
  return Promise.resolve(value)
}

/**
 * Create rejected promise
 */
export function rejectedPromise(error) {
  return Promise.reject(error)
}

/**
 * Create spy on console methods
 */
export function spyOnConsole() {
  return {
    log: vi.spyOn(console, 'log').mockImplementation(() => {}),
    warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
    error: vi.spyOn(console, 'error').mockImplementation(() => {}),
    info: vi.spyOn(console, 'info').mockImplementation(() => {})
  }
}

/**
 * Verify mock call arguments
 */
export function verifyMockCall(mock, expectedArgs) {
  expect(mock).toHaveBeenCalled()
  const lastCall = mock.mock.calls[mock.mock.calls.length - 1]
  expectedArgs.forEach((expected, index) => {
    expect(lastCall[index]).toEqual(expected)
  })
}

/**
 * Create test user object
 */
export function createTestUser(overrides = {}) {
  return {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    createdAt: new Date(),
    ...overrides
  }
}

/**
 * Create test project object
 */
export function createTestProject(overrides = {}) {
  return {
    id: 'project-1',
    userId: 'user-1',
    name: 'Test Project',
    description: 'A test project',
    createdAt: new Date(),
    tasks: {},
    ...overrides
  }
}

/**
 * Create mock quotaStore for component tests
 */
export function createMockQuotaStore(overrides = {}) {
  return {
    // State
    subscription: { tier: 'free', status: 'active' },
    usage: { count: 0, resetDate: new Date() },
    quotaModel: null,
    aiUsage: [],
    isLoading: false,
    error: null,

    // Computed
    tier: 'free',
    isFree: true,
    isPremium: false,
    subscriptionStatus: 'active',
    isActive: true,
    currentQuotaLimit: 40,
    currentMonthUsage: 0,
    remainingQuota: 40,
    quotaPercentage: 0,
    hasQuotaRemaining: true,
    quotaResetDate: new Date(),
    formattedResetDate: 'Jan 1, 2025',
    canGenerateAI: true,
    canGenerate: true,
    quotaMessage: 'You have quota remaining',
    quotaStatus: { tier: 'free', remaining: 40, limit: 40 },

    // Methods
    fetchSubscriptionStatus: vi.fn().mockResolvedValue(null),
    fetchAIUsage: vi.fn().mockResolvedValue([]),
    trackAIUsage: vi.fn().mockResolvedValue(null),
    decrementQuota: vi.fn(),
    upgradeToPresentation: vi.fn().mockResolvedValue(null),
    cancelSubscription: vi.fn().mockResolvedValue(null),
    invalidateCache: vi.fn(),
    initialize: vi.fn().mockResolvedValue(null),
    initializeQuota: vi.fn().mockResolvedValue(null),
    fetchSubscription: vi.fn().mockResolvedValue(null),
    fetchUsage: vi.fn().mockResolvedValue(null),
    recordUsage: vi.fn().mockResolvedValue(null),
    upgradeToPremium: vi.fn().mockResolvedValue(null),
    getUsageHistory: vi.fn().mockResolvedValue([]),
    getUsageStats: vi.fn().mockResolvedValue({}),
    reset: vi.fn(),

    ...overrides
  }
}

/**
 * Create mock authStore for component tests
 */
export function createMockAuthStore(overrides = {}) {
  return {
    // State
    user: { id: 'user-1', email: 'test@example.com', name: 'Test User' },
    isLoading: false,
    error: null,

    // Computed
    isAuthenticated: true,
    userName: 'Test User',
    userEmail: 'test@example.com',

    // Methods
    login: vi.fn().mockResolvedValue(null),
    logout: vi.fn().mockResolvedValue(null),
    register: vi.fn().mockResolvedValue(null),
    fetchUser: vi.fn().mockResolvedValue(null),

    ...overrides
  }
}

/**
 * Create mock projectStore for component tests
 */
export function createMockProjectStore(overrides = {}) {
  return {
    // State
    projects: [],
    currentProject: null,
    tasks: {},
    isLoading: false,
    error: null,

    // Computed
    currentProjectTasks: [],
    hasProjects: false,

    // Methods
    fetchProjects: vi.fn().mockResolvedValue([]),
    selectProject: vi.fn(),
    createProject: vi.fn().mockResolvedValue(null),
    updateProject: vi.fn().mockResolvedValue(null),
    deleteProject: vi.fn().mockResolvedValue(null),
    fetchTasks: vi.fn().mockResolvedValue([]),
    completeTask: vi.fn().mockResolvedValue(null),
    updateTaskData: vi.fn().mockResolvedValue(null),
    reset: vi.fn(),

    ...overrides
  }
}
