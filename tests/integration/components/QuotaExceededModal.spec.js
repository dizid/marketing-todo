/**
 * Quota Exceeded Modal - Integration Tests
 * Tests the modal behavior when user's AI generation quota is exhausted.
 * Covers free tier vs premium tier states and user interactions.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import QuotaExceededModal from '@/components/QuotaExceededModal.vue'
import PremiumUpgradeButton from '@/components/PremiumUpgradeButton.vue'
import { useQuotaStore } from '@/stores/quotaStore'

describe('QuotaExceededModal - Integration Tests', () => {
  let wrapper
  let quotaStore

  beforeEach(() => {
    // Create fresh Pinia testing instance for each test
    wrapper = null
    quotaStore = null
  })

  /**
   * Test: Modal displays free tier quota exceeded message
   * When a free tier user exhausts their quota, show appropriate message
   */
  it('displays free tier quota exceeded message correctly', () => {
    wrapper = mount(QuotaExceededModal, {
      props: {
        isOpen: true
      },
      global: {
        plugins: [createTestingPinia({
          initialState: {
            quota: {
              subscription: { tier: 'free', status: 'active' },
              usage: { count: 40, resetDate: new Date() },
              quotaModel: null,
              aiUsage: Array(40).fill({ created_at: new Date() }),
              isLoading: false,
              error: null
            }
          }
        })],
        stubs: {
          PremiumUpgradeButton: true
        }
      }
    })

    // Verify header and main message
    expect(wrapper.text()).toContain('Quota Exhausted')
    expect(wrapper.text()).toContain("You've reached your monthly AI generation limit")

    // Verify free tier specific content
    expect(wrapper.text()).toContain('Free Tier Limit Reached')
    expect(wrapper.text()).toContain('40 free AI generations')
  })

  /**
   * Test: Modal displays premium tier quota exceeded message
   * When a premium tier user exhausts their quota, show different message
   */
  it('displays premium tier quota exceeded message correctly', () => {
    wrapper = mount(QuotaExceededModal, {
      props: {
        isOpen: true
      },
      global: {
        plugins: [createTestingPinia({
          initialState: {
            quota: {
              subscription: { tier: 'premium', status: 'active' },
              usage: { count: 400, resetDate: new Date() },
              quotaModel: null,
              aiUsage: Array(400).fill({ created_at: new Date() }),
              isLoading: false,
              error: null
            }
          }
        })],
        stubs: {
          PremiumUpgradeButton: true
        }
      }
    })

    // Verify premium tier message
    expect(wrapper.text()).toContain('Premium Tier Limit Reached')
    expect(wrapper.text()).toContain('400 premium AI generations')
  })

  /**
   * Test: Quota usage bar shows 100% full
   * Progress bar should reflect exhausted quota
   */
  it('displays quota usage bar at 100%', () => {
    wrapper = mount(QuotaExceededModal, {
      props: {
        isOpen: true
      },
      global: {
        plugins: [createTestingPinia({
          initialState: {
            quota: {
              subscription: { tier: 'free', status: 'active' },
              usage: { count: 40, resetDate: new Date() },
              quotaModel: null,
              aiUsage: Array(40).fill({ created_at: new Date() }),
              isLoading: false,
              error: null
            }
          }
        })],
        stubs: {
          PremiumUpgradeButton: true
        }
      }
    })

    // Verify usage display
    expect(wrapper.text()).toContain('Your Usage')
    expect(wrapper.text()).toContain('/ 40') // Free tier limit

    // Check progress bar is full (width: 100%)
    const progressBar = wrapper.find('div[style*="width: 100%"]')
    expect(progressBar.exists()).toBe(true)
  })

  /**
   * Test: Close button emits close event
   * User should be able to dismiss the modal
   */
  it('closes modal when close button clicked', async () => {
    wrapper = mount(QuotaExceededModal, {
      props: {
        isOpen: true
      },
      global: {
        plugins: [createTestingPinia({
          initialState: {
            quota: {
              subscription: { tier: 'free', status: 'active' },
              usage: { count: 40, resetDate: new Date() },
              quotaModel: null,
              aiUsage: Array(40).fill({ created_at: new Date() }),
              isLoading: false,
              error: null
            }
          }
        })],
        stubs: {
          PremiumUpgradeButton: true
        }
      }
    })

    // Find and click close button
    const closeButton = wrapper.findAll('button').find(btn =>
      btn.text().includes('Wait for Reset')
    )
    expect(closeButton).toBeDefined()

    await closeButton.trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  /**
   * Test: Modal hidden when isOpen is false
   * Modal should not render when isOpen prop is false
   */
  it('does not display modal when isOpen is false', () => {
    wrapper = mount(QuotaExceededModal, {
      props: {
        isOpen: false
      },
      global: {
        plugins: [createTestingPinia()],
        stubs: {
          PremiumUpgradeButton: true
        }
      }
    })

    expect(wrapper.find('.fixed').exists()).toBe(false)
  })

  /**
   * Test: Upgrade button receives correct props
   * PremiumUpgradeButton should be rendered within modal
   */
  it('renders upgrade button with correct props', () => {
    wrapper = mount(QuotaExceededModal, {
      props: {
        isOpen: true
      },
      global: {
        plugins: [createTestingPinia()],
        components: {
          PremiumUpgradeButton
        }
      }
    })

    const upgradeButton = wrapper.findComponent(PremiumUpgradeButton)
    expect(upgradeButton.exists()).toBe(true)
    expect(upgradeButton.props('variant')).toBe('primary')
    expect(upgradeButton.props('text')).toContain('Upgrade to Premium')
  })

  /**
   * Test: Upgrade success closes modal
   * When upgrade is successful, modal should close
   */
  it('closes modal on upgrade success', async () => {
    wrapper = mount(QuotaExceededModal, {
      props: {
        isOpen: true
      },
      global: {
        plugins: [createTestingPinia()],
        components: {
          PremiumUpgradeButton
        }
      }
    })

    const upgradeButton = wrapper.findComponent(PremiumUpgradeButton)
    expect(upgradeButton.exists()).toBe(true)

    // Simulate successful upgrade
    await upgradeButton.vm.$emit('success')
    await wrapper.vm.$nextTick()

    // Modal should emit upgrade-success
    expect(wrapper.emitted('upgrade-success')).toBeTruthy()
  })

  /**
   * Test: Benefits list shows when free tier is exceeded
   * Premium upgrade benefits should be displayed to free tier users
   */
  it('displays premium benefits for free tier users', () => {
    wrapper = mount(QuotaExceededModal, {
      props: {
        isOpen: true
      },
      global: {
        plugins: [createTestingPinia({
          initialState: {
            quota: {
              subscription: { tier: 'free', status: 'active' },
              usage: { count: 40, resetDate: new Date() },
              quotaModel: null,
              aiUsage: Array(40).fill({ created_at: new Date() }),
              isLoading: false,
              error: null
            }
          }
        })],
        stubs: {
          PremiumUpgradeButton: true
        }
      }
    })

    // Verify benefits are shown
    expect(wrapper.text()).toContain('Upgrade to Premium & Get')
    expect(wrapper.text()).toContain('10x more generations')
    expect(wrapper.text()).toContain('Faster processing')
    expect(wrapper.text()).toContain('Better models')
    expect(wrapper.text()).toContain('Email support')
  })

  /**
   * Test: Reset date is displayed correctly
   * Modal should show when quota resets (first of next month)
   */
  it('displays formatted reset date', () => {
    // Create a specific date to test: Jan 1, 2025
    const resetDate = new Date('2025-01-01')

    wrapper = mount(QuotaExceededModal, {
      props: {
        isOpen: true
      },
      global: {
        plugins: [createTestingPinia({
          initialState: {
            quota: {
              subscription: { tier: 'free', status: 'active' },
              usage: { count: 40, resetDate },
              quotaModel: null,
              aiUsage: Array(40).fill({ created_at: new Date('2024-12-15') }),
              isLoading: false,
              error: null
            }
          }
        })],
        stubs: {
          PremiumUpgradeButton: true
        }
      }
    })

    // Verify reset date appears in both places
    const resetDateText = wrapper.text()
    expect(resetDateText).toContain('resets on')
    // The computed property formattedResetDate will be the first of next month
    expect(resetDateText).toMatch(/[A-Z][a-z]{2} \d{1,2}, \d{4}/)
  })
})
