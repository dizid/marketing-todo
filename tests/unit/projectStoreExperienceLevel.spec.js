/**
 * ProjectStore Experience Level Tests
 *
 * Tests the store's experienceLevel handling:
 * 1. Default value
 * 2. Computed getter
 * 3. setExperienceLevel action
 * 4. Validation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// Mock Supabase
vi.mock('@/utils/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null })),
          order: vi.fn(() => Promise.resolve({ data: [], error: null }))
        })),
        order: vi.fn(() => Promise.resolve({ data: [], error: null }))
      })),
      upsert: vi.fn(() => ({
        select: vi.fn(() => Promise.resolve({ data: [], error: null }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => Promise.resolve({ data: [], error: null }))
        }))
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: null, error: null }))
      }))
    }))
  }
}))

// Mock project service
vi.mock('@/services/projectService.js', () => ({
  getProjects: vi.fn(() => Promise.resolve([])),
  getProject: vi.fn(() => Promise.resolve(null)),
  createProject: vi.fn(),
  updateProject: vi.fn(),
  deleteProject: vi.fn(),
  getAllProjectData: vi.fn(() => Promise.resolve({ settings: {}, tasks: {}, content: [] })),
  saveProjectSettings: vi.fn(() => Promise.resolve()),
  saveProjectTasks: vi.fn(() => Promise.resolve()),
  addProjectContent: vi.fn(),
  initializeProject: vi.fn()
}))

// Mock task data service
vi.mock('@/services/taskDataService.js', () => ({
  saveTaskData: vi.fn(),
  getAllTaskData: vi.fn(() => Promise.resolve({}))
}))

// Mock auth store
vi.mock('@/stores/authStore', () => ({
  useAuthStore: () => ({
    user: { id: 'test-user' }
  })
}))

// Mock conflict detection
vi.mock('@/composables/useConflictDetection', () => ({
  useConflictDetection: () => ({
    hasConflict: false,
    conflictInfo: null,
    detectConflict: vi.fn(),
    clearConflict: vi.fn(),
    getConflictMessage: vi.fn()
  })
}))

// Mock logger
vi.mock('@/utils/logger', () => ({
  logger: {
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
}))

import { useProjectStore } from '@/stores/projectStore'
import { saveProjectSettings } from '@/services/projectService.js'

describe('ProjectStore Experience Level', () => {
  let store

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useProjectStore()
    vi.clearAllMocks()

    // Set up initial state
    store.currentProjectId = 'test-project-id'
    store.currentProject = { id: 'test-project-id', name: 'Test Project' }
    store.projectData = {
      settings: {},
      tasks: {},
      content: []
    }
  })

  describe('experienceLevel computed', () => {
    it('should default to beginner when no settings', () => {
      expect(store.experienceLevel).toBe('beginner')
    })

    it('should return experienceLevel from settings', () => {
      store.projectData.settings = { experienceLevel: 'intermediate' }
      expect(store.experienceLevel).toBe('intermediate')
    })

    it('should return beginner when settings exist but experienceLevel is missing', () => {
      store.projectData.settings = { productType: 'saas' }
      expect(store.experienceLevel).toBe('beginner')
    })
  })

  describe('setExperienceLevel action', () => {
    it('should call saveProjectSettings with new experienceLevel', async () => {
      store.projectData.settings = { productType: 'saas' }

      await store.setExperienceLevel('intermediate')

      expect(saveProjectSettings).toHaveBeenCalledWith(
        'test-project-id',
        { productType: 'saas', experienceLevel: 'intermediate' }
      )
    })

    it('should update local state after successful save', async () => {
      store.projectData.settings = { productType: 'saas' }

      await store.setExperienceLevel('intermediate')

      expect(store.projectData.settings.experienceLevel).toBe('intermediate')
    })

    it('should preserve existing settings when updating experienceLevel', async () => {
      store.projectData.settings = {
        productType: 'saas',
        productName: 'My App',
        targetAudience: 'Developers'
      }

      await store.setExperienceLevel('intermediate')

      expect(saveProjectSettings).toHaveBeenCalledWith(
        'test-project-id',
        expect.objectContaining({
          productType: 'saas',
          productName: 'My App',
          targetAudience: 'Developers',
          experienceLevel: 'intermediate'
        })
      )
    })

    it('should throw error for invalid experienceLevel', async () => {
      await expect(store.setExperienceLevel('expert')).rejects.toThrow(
        'Invalid experience level: expert'
      )
    })

    it('should throw error when no project selected', async () => {
      store.currentProjectId = null

      await expect(store.setExperienceLevel('intermediate')).rejects.toThrow(
        'No project selected'
      )
    })

    it('should accept beginner level', async () => {
      await expect(store.setExperienceLevel('beginner')).resolves.not.toThrow()
    })

    it('should accept intermediate level', async () => {
      await expect(store.setExperienceLevel('intermediate')).resolves.not.toThrow()
    })

    it('should accept advanced level', async () => {
      await expect(store.setExperienceLevel('advanced')).resolves.not.toThrow()
    })
  })

  describe('getTaskRecommendation with experienceLevel', () => {
    it('should pass experienceLevel to recommendation engine', async () => {
      // This test verifies the store correctly passes experienceLevel
      // The actual filtering is tested in the recommendation engine tests

      store.projectData.settings = { productType: 'saas', experienceLevel: 'intermediate' }
      store.projectData.tasks = {}

      const recommendation = await store.getTaskRecommendation()

      // Should have received a recommendation
      expect(recommendation).toBeDefined()
      expect(recommendation.experienceLevel).toBe('intermediate')
    })

    it('should use beginner as default when no experienceLevel set', async () => {
      store.projectData.settings = { productType: 'saas' }
      store.projectData.tasks = {}

      const recommendation = await store.getTaskRecommendation()

      expect(recommendation).toBeDefined()
      expect(recommendation.experienceLevel).toBe('beginner')
    })
  })
})
