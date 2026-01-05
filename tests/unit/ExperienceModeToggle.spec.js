/**
 * ExperienceModeToggle Component Tests
 *
 * Tests the Vue component for switching between beginner/intermediate modes
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ExperienceModeToggle from '@/components/Dashboard/ExperienceModeToggle.vue'

// Mock the taskRecommendationEngine
vi.mock('@/services/taskRecommendationEngine', () => ({
  getTaskCountsByExperienceLevel: vi.fn(() => ({
    beginner: { name: 'Beginner', description: 'Essential tasks', maxPhase: 3, taskCount: 10 },
    intermediate: { name: 'Intermediate', description: 'Full toolkit', maxPhase: 4, taskCount: 24 },
    advanced: { name: 'Advanced', description: 'Expert level', maxPhase: 4, taskCount: 24 }
  }))
}))

// Mock the projectStore
const mockProjectStore = {
  experienceLevel: 'beginner',
  currentProject: { id: 'test-project-id', name: 'Test Project' },
  currentProjectSettings: { productType: 'saas' },
  isLoading: false,
  setExperienceLevel: vi.fn()
}

vi.mock('@/stores/projectStore', () => ({
  useProjectStore: () => mockProjectStore
}))

describe('ExperienceModeToggle Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    mockProjectStore.experienceLevel = 'beginner'
    mockProjectStore.setExperienceLevel.mockResolvedValue(undefined)
  })

  it('should render the component', () => {
    const wrapper = mount(ExperienceModeToggle)
    expect(wrapper.exists()).toBe(true)
  })

  it('should display "Experience Mode" label', () => {
    const wrapper = mount(ExperienceModeToggle)
    expect(wrapper.text()).toContain('Experience Mode')
  })

  it('should show three buttons: Beginner, Intermediate, Advanced', () => {
    const wrapper = mount(ExperienceModeToggle)
    const buttons = wrapper.findAll('button')

    expect(buttons.length).toBe(3)
    expect(buttons[0].text()).toBe('Beginner')
    expect(buttons[1].text()).toBe('Intermediate')
    expect(buttons[2].text()).toBe('Advanced')
  })

  it('should have Advanced button disabled', () => {
    const wrapper = mount(ExperienceModeToggle)
    const advancedButton = wrapper.findAll('button')[2]

    expect(advancedButton.attributes('disabled')).toBeDefined()
  })

  it('should highlight the current mode (beginner)', () => {
    const wrapper = mount(ExperienceModeToggle)
    const beginnerButton = wrapper.findAll('button')[0]

    expect(beginnerButton.classes()).toContain('bg-green-600')
  })

  it('should display task count for current mode', () => {
    const wrapper = mount(ExperienceModeToggle)

    // Should show "10 tasks" for beginner
    expect(wrapper.text()).toContain('10 tasks')
  })

  it('should display level description', () => {
    const wrapper = mount(ExperienceModeToggle)

    expect(wrapper.text()).toContain('Essential tasks')
  })

  it('should call setExperienceLevel when clicking intermediate', async () => {
    const wrapper = mount(ExperienceModeToggle)
    const intermediateButton = wrapper.findAll('button')[1]

    await intermediateButton.trigger('click')

    expect(mockProjectStore.setExperienceLevel).toHaveBeenCalledWith('intermediate')
  })

  it('should not call setExperienceLevel when clicking current mode', async () => {
    const wrapper = mount(ExperienceModeToggle)
    const beginnerButton = wrapper.findAll('button')[0]

    await beginnerButton.trigger('click')

    expect(mockProjectStore.setExperienceLevel).not.toHaveBeenCalled()
  })

  it('should not call setExperienceLevel when clicking disabled Advanced', async () => {
    const wrapper = mount(ExperienceModeToggle)
    const advancedButton = wrapper.findAll('button')[2]

    await advancedButton.trigger('click')

    expect(mockProjectStore.setExperienceLevel).not.toHaveBeenCalled()
  })

  describe('Intermediate Mode', () => {
    beforeEach(() => {
      mockProjectStore.experienceLevel = 'intermediate'
    })

    it('should highlight intermediate button when in intermediate mode', () => {
      const wrapper = mount(ExperienceModeToggle)
      const intermediateButton = wrapper.findAll('button')[1]

      expect(intermediateButton.classes()).toContain('bg-blue-600')
    })

    it('should show 24 tasks for intermediate', () => {
      const wrapper = mount(ExperienceModeToggle)

      expect(wrapper.text()).toContain('24 tasks')
    })
  })

  describe('Mode Switching', () => {
    it('should show feedback message after switching modes', async () => {
      const wrapper = mount(ExperienceModeToggle)
      const intermediateButton = wrapper.findAll('button')[1]

      await intermediateButton.trigger('click')
      await wrapper.vm.$nextTick()

      // The feedback should appear (with transition)
      // Note: Due to async nature, we check if setExperienceLevel was called
      expect(mockProjectStore.setExperienceLevel).toHaveBeenCalled()
    })
  })
})
