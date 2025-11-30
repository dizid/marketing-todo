/**
 * Tests for PaidAdsLaunchMiniApp Component
 * Verifies form validation, button behavior, and plan generation
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PaidAdsLaunchMiniApp from '../PaidAdsLaunchMiniApp.vue'

const mockTaskConfig = {
  id: 'launch-paid-ads',
  budgetWizardForm: [
    {
      id: 'monthly_budget',
      label: 'Monthly Advertising Budget (USD)',
      type: 'number',
      placeholder: '500',
      min: 0,
      required: true,
      description: 'How much can you invest in paid ads per month? Minimum $300 recommended.'
    },
    {
      id: 'primary_goal',
      label: 'Primary Advertising Goal',
      type: 'select',
      required: true,
      options: [
        { value: 'awareness', label: 'Brand Awareness' },
        { value: 'traffic', label: 'Website Traffic' },
        { value: 'leads', label: 'Lead Generation' },
        { value: 'sales', label: 'Direct Sales' }
      ]
    },
    {
      id: 'timeline',
      label: 'Launch Timeline',
      type: 'select',
      required: true,
      options: [
        { value: 'asap', label: 'ASAP (This week)' },
        { value: 'two_weeks', label: 'Within 2 weeks (normal pace)' },
        { value: 'month', label: 'Within a month (plan ahead)' }
      ]
    },
    {
      id: 'experience_level',
      label: 'Your Advertising Experience',
      type: 'select',
      required: true,
      options: [
        { value: 'none', label: 'None (Never run ads before)' },
        { value: 'some', label: 'Some experience (tried ads before)' },
        { value: 'experienced', label: 'Experienced (run ads regularly)' }
      ]
    }
  ],
  adPlatforms: []
}

describe('PaidAdsLaunchMiniApp', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(PaidAdsLaunchMiniApp, {
      props: {
        taskConfig: mockTaskConfig,
        taskData: {}
      }
    })
  })

  describe('Form Validation', () => {
    it('should disable button when budget < 300', () => {
      const budgetInput = wrapper.find('input[type="number"]')
      const button = wrapper.find('.btn-generate')

      // Set invalid budget
      budgetInput.setValue(200)
      expect(button.attributes('disabled')).toBeDefined()
      expect(button.text()).toContain('Generate My Launch Plan')
    })

    it('should enable button when budget >= 300 and all fields filled', async () => {
      const inputs = wrapper.findAll('input[type="number"]')
      const selects = wrapper.findAll('select')
      const button = wrapper.find('.btn-generate')

      // Fill all fields with valid values
      inputs[0].setValue(500) // budget >= 300
      selects[0].setValue('leads') // primary_goal
      selects[1].setValue('two_weeks') // timeline
      selects[2].setValue('some') // experience_level

      await wrapper.vm.$nextTick()

      expect(button.attributes('disabled')).toBeUndefined()
      expect(button.classes()).toContain('btn-primary')
    })

    it('should disable button if any required field is empty', async () => {
      const inputs = wrapper.findAll('input[type="number"]')
      const selects = wrapper.findAll('select')
      const button = wrapper.find('.btn-generate')

      inputs[0].setValue(500)
      selects[0].setValue('leads')
      // Missing timeline and experience_level

      await wrapper.vm.$nextTick()

      expect(button.attributes('disabled')).toBeDefined()
    })

    it('should validate minimum budget is 300', async () => {
      const budgetInput = wrapper.find('input[type="number"]')
      const button = wrapper.find('.btn-generate')

      // Test boundary: 299 should be invalid
      budgetInput.setValue(299)
      await wrapper.vm.$nextTick()
      expect(button.attributes('disabled')).toBeDefined()

      // Test boundary: 300 should be valid (with other fields)
      const selects = wrapper.findAll('select')
      budgetInput.setValue(300)
      selects[0].setValue('awareness')
      selects[1].setValue('asap')
      selects[2].setValue('none')

      await wrapper.vm.$nextTick()

      expect(button.attributes('disabled')).toBeUndefined()
    })
  })

  describe('Button Behavior', () => {
    it('should show loading state when generating', async () => {
      const inputs = wrapper.findAll('input[type="number"]')
      const selects = wrapper.findAll('select')
      const button = wrapper.find('.btn-generate')

      // Fill form
      inputs[0].setValue(500)
      selects[0].setValue('sales')
      selects[1].setValue('two_weeks')
      selects[2].setValue('experienced')

      await wrapper.vm.$nextTick()

      // Click button
      await button.trigger('click')

      // Should show loading state
      expect(wrapper.vm.isGenerating).toBe(true)
      expect(button.text()).toContain('Generating Your Plan')

      // Wait for generation to complete
      await new Promise(resolve => setTimeout(resolve, 1600))

      expect(wrapper.vm.isGenerating).toBe(false)
      expect(wrapper.vm.generatedPlan).toBeTruthy()
    })

    it('should emit generate-ai event when button clicked', async () => {
      const inputs = wrapper.findAll('input[type="number"]')
      const selects = wrapper.findAll('select')
      const button = wrapper.find('.btn-generate')

      inputs[0].setValue(1000)
      selects[0].setValue('traffic')
      selects[1].setValue('month')
      selects[2].setValue('some')

      await wrapper.vm.$nextTick()
      await button.trigger('click')

      expect(wrapper.emitted('generate-ai')).toBeTruthy()
      const emittedData = wrapper.emitted('generate-ai')[0][0]
      expect(emittedData.taskId).toBe('launch-paid-ads')
      expect(emittedData.wizardData.monthly_budget).toBe(1000)
      expect(emittedData.wizardData.primary_goal).toBe('traffic')
    })
  })

  describe('Plan Generation', () => {
    it('should generate platform recommendations based on budget', async () => {
      const inputs = wrapper.findAll('input[type="number"]')
      const selects = wrapper.findAll('select')

      // Budget: $500-1500 range
      inputs[0].setValue(800)
      selects[0].setValue('sales')
      selects[1].setValue('two_weeks')
      selects[2].setValue('experienced')

      await wrapper.vm.$nextTick()

      // Trigger generation
      wrapper.vm.isGenerating = false
      wrapper.vm.generatedPlan = wrapper.vm.generateMockPlan()

      expect(wrapper.vm.generatedPlan).toBeTruthy()
      expect(wrapper.vm.generatedPlan.platformRecommendations).toBeTruthy()
      expect(wrapper.vm.generatedPlan.platformRecommendations.length).toBeGreaterThan(0)

      // Should have platform recommendations
      const platforms = wrapper.vm.generatedPlan.platformRecommendations
      expect(platforms.some(p => p.platform === 'Google Ads')).toBe(true)
    })

    it('should generate ad copy variations', async () => {
      const inputs = wrapper.findAll('input[type="number"]')
      const selects = wrapper.findAll('select')

      inputs[0].setValue(500)
      selects[0].setValue('awareness')
      selects[1].setValue('asap')
      selects[2].setValue('none')

      await wrapper.vm.$nextTick()

      wrapper.vm.generatedPlan = wrapper.vm.generateMockPlan()

      expect(wrapper.vm.generatedPlan.adCopyVariations).toBeTruthy()
      expect(wrapper.vm.generatedPlan.adCopyVariations.length).toBe(5)

      // Each variation should have required fields
      wrapper.vm.generatedPlan.adCopyVariations.forEach(copy => {
        expect(copy.angle).toBeTruthy()
        expect(copy.headline).toBeTruthy()
        expect(copy.body).toBeTruthy()
        expect(copy.cta).toBeTruthy()
      })
    })

    it('should generate targeting specifications', async () => {
      wrapper.vm.generatedPlan = wrapper.vm.generateMockPlan()

      expect(wrapper.vm.generatedPlan.targetingSpecs).toBeTruthy()
      expect(wrapper.vm.generatedPlan.targetingSpecs.length).toBeGreaterThan(0)

      // Each spec should have platform name
      wrapper.vm.generatedPlan.targetingSpecs.forEach(spec => {
        expect(spec.platform).toBeTruthy()
      })
    })

    it('should generate weekly checklist', async () => {
      wrapper.vm.generatedPlan = wrapper.vm.generateMockPlan()

      expect(wrapper.vm.generatedPlan.weeklyChecklist).toBeTruthy()
      expect(wrapper.vm.generatedPlan.weeklyChecklist.length).toBe(4)

      // Each week should have tasks
      wrapper.vm.generatedPlan.weeklyChecklist.forEach(week => {
        expect(week.week).toBeTruthy()
        expect(week.focus).toBeTruthy()
        expect(week.tasks).toBeTruthy()
        expect(Array.isArray(week.tasks)).toBe(true)
      })
    })

    it('should generate success signals', async () => {
      wrapper.vm.generatedPlan = wrapper.vm.generateMockPlan()

      const signals = wrapper.vm.generatedPlan.successSignals
      expect(signals.good).toBeTruthy()
      expect(signals.bad).toBeTruthy()
      expect(signals.action).toBeTruthy()

      expect(Array.isArray(signals.good)).toBe(true)
      expect(Array.isArray(signals.bad)).toBe(true)
      expect(signals.good.length).toBeGreaterThan(0)
      expect(signals.bad.length).toBeGreaterThan(0)
    })
  })

  describe('Plan Display', () => {
    it('should show form initially', () => {
      const form = wrapper.find('.wizard-form')
      const plan = wrapper.find('.generated-plan')

      expect(form.exists()).toBe(true)
      expect(plan.exists()).toBe(false)
    })

    it('should show plan after generation', async () => {
      wrapper.vm.generatedPlan = wrapper.vm.generateMockPlan()
      await wrapper.vm.$nextTick()

      const form = wrapper.find('.wizard-form')
      const plan = wrapper.find('.generated-plan')

      expect(form.exists()).toBe(false)
      expect(plan.exists()).toBe(true)
    })

    it('should display all plan sections', async () => {
      wrapper.vm.generatedPlan = wrapper.vm.generateMockPlan()
      await wrapper.vm.$nextTick()

      const sections = wrapper.findAll('.plan-section')

      // Should have: platform-rec, ad-copy, targeting-specs, weekly-checklist, success-signals
      expect(sections.length).toBeGreaterThanOrEqual(5)
    })
  })

  describe('Reset Functionality', () => {
    it('should reset form when reset button clicked', async () => {
      wrapper.vm.generatedPlan = wrapper.vm.generateMockPlan()
      await wrapper.vm.$nextTick()

      const resetBtn = wrapper.find('.btn-secondary')
      await resetBtn.trigger('click')

      expect(wrapper.vm.generatedPlan).toBeNull()
      expect(wrapper.vm.wizardData.monthly_budget).toBeNull()
      expect(wrapper.vm.wizardData.primary_goal).toBe('')
    })
  })

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      const labels = wrapper.findAll('label')
      expect(labels.length).toBeGreaterThan(0)

      labels.forEach(label => {
        expect(label.text()).toBeTruthy()
      })
    })

    it('should have required field indicators', () => {
      const requiredSpans = wrapper.findAll('.required')
      expect(requiredSpans.length).toBeGreaterThan(0)
    })

    it('should have field descriptions', () => {
      const descriptions = wrapper.findAll('.field-description')
      expect(descriptions.length).toBeGreaterThan(0)
    })
  })
})
