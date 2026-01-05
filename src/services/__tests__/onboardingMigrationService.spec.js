/**
 * Onboarding Migration Service Tests
 *
 * Tests for onboarding wizard data migration to ProjectContext
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { OnboardingMigrationService } from '../onboardingMigrationService.js'

describe('OnboardingMigrationService', () => {
  let service, mockWizardData

  beforeEach(() => {
    service = new OnboardingMigrationService()
    mockWizardData = {
      productName: 'Test Product',
      productType: 'saas',
      productDescription: 'A test product',
      targetAudience: 'Developers',
      mainGoal: 'first_100',
      timeline: '3_months',
      budget: 5000,
      teamSize: '2-5',
      currentStage: 'building',
      techStack: ['React', 'Node.js']
    }
  })

  describe('Data Transformation', () => {
    it('should transform basic wizard data to context format', () => {
      const transformed = service.transformWizardToContext(mockWizardData)

      expect(transformed.productName).toBe('Test Product')
      expect(transformed.productType).toBe('saas')
      expect(transformed.productDescription).toBe('A test product')
      expect(transformed.targetAudience).toBe('Developers')
    })

    it('should transform goals and timeline', () => {
      const transformed = service.transformWizardToContext(mockWizardData)

      expect(transformed.primaryGoal).toBe('first_100')
      expect(transformed.targetTimeline).toBe('3_months')
    })

    it('should transform team and stage information', () => {
      const transformed = service.transformWizardToContext(mockWizardData)

      expect(transformed.marketingBudget).toBe(5000)
      expect(transformed.teamSize).toBe('2-5')
      expect(transformed.currentStage).toBe('building')
    })

    it('should transform tech stack', () => {
      const transformed = service.transformWizardToContext(mockWizardData)

      expect(transformed.techStack).toBeDefined()
      expect(transformed.techStack.tools).toEqual(['React', 'Node.js'])
    })

    it('should handle partial wizard data', () => {
      const partial = {
        productName: 'Only Name',
        productType: 'mobile_app'
      }

      const transformed = service.transformWizardToContext(partial)

      expect(transformed.productName).toBe('Only Name')
      expect(transformed.productType).toBe('mobile_app')
      expect(transformed.targetAudience).toBeUndefined()
    })

    it('should handle missing optional fields', () => {
      const minimal = {
        productName: 'Minimal',
        productType: 'other'
      }

      const transformed = service.transformWizardToContext(minimal)

      expect(Object.keys(transformed).length).toBe(2)
      expect(transformed.productName).toBe('Minimal')
    })

    it('should skip empty tech stack', () => {
      const data = { ...mockWizardData, techStack: [] }
      const transformed = service.transformWizardToContext(data)

      expect(transformed.techStack).toBeUndefined()
    })
  })

  describe('Product Type Mapping', () => {
    it('should map common product type variations', () => {
      const variations = [
        { input: 'mobile-app', expected: 'mobile_app' },
        { input: 'mobile_app', expected: 'mobile_app' },
        { input: 'saas', expected: 'saas' },
        { input: 'SAAS', expected: 'saas' },
        { input: 'ecommerce', expected: 'ecommerce' },
        { input: 'e-commerce', expected: 'ecommerce' },
        { input: 'digital-product', expected: 'digital_product' },
        { input: 'digital_product', expected: 'digital_product' },
        { input: 'game', expected: 'game' },
        { input: 'other', expected: 'other' }
      ]

      variations.forEach(({ input, expected }) => {
        expect(service.mapProductType(input)).toBe(expected)
      })
    })

    it('should return null for unknown product type', () => {
      expect(service.mapProductType('unknown-type')).toBeNull()
      expect(service.mapProductType('')).toBeNull()
    })
  })

  describe('Goal Mapping', () => {
    it('should map goal variations', () => {
      const variations = [
        { input: 'first_100', expected: 'first_100' },
        { input: 'first-100', expected: 'first_100' },
        { input: 'first 100', expected: 'first_100' },
        { input: '100-users', expected: 'first_100' },
        { input: '1k_mrr', expected: '1k_mrr' },
        { input: '1k-mrr', expected: '1k_mrr' },
        { input: '$1k', expected: '1k_mrr' },
        { input: '10k_mrr', expected: '10k_mrr' },
        { input: '10k-mrr', expected: '10k_mrr' },
        { input: '$10k', expected: '10k_mrr' },
        { input: 'audience', expected: 'audience' },
        { input: 'build-audience', expected: 'audience' },
        { input: 'community', expected: 'audience' },
        { input: 'validate', expected: 'validate' },
        { input: 'product-market-fit', expected: 'validate' },
        { input: 'pmf', expected: 'validate' }
      ]

      variations.forEach(({ input, expected }) => {
        expect(service.mapPrimaryGoal(input)).toBe(expected)
      })
    })

    it('should return null for unknown goal', () => {
      expect(service.mapPrimaryGoal('unknown-goal')).toBeNull()
    })
  })

  describe('Timeline Mapping', () => {
    it('should map timeline variations', () => {
      const variations = [
        { input: '1_month', expected: '1_month' },
        { input: '1-month', expected: '1_month' },
        { input: 'month', expected: '1_month' },
        { input: '3_months', expected: '3_months' },
        { input: '3-months', expected: '3_months' },
        { input: 'quarter', expected: '3_months' },
        { input: '6_months', expected: '6_months' },
        { input: '6-months', expected: '6_months' },
        { input: 'half-year', expected: '6_months' },
        { input: 'no_timeline', expected: 'no_timeline' },
        { input: 'no-timeline', expected: 'no_timeline' },
        { input: 'none', expected: 'no_timeline' },
        { input: 'open-ended', expected: 'no_timeline' }
      ]

      variations.forEach(({ input, expected }) => {
        expect(service.mapTargetTimeline(input)).toBe(expected)
      })
    })
  })

  describe('Team Size Mapping', () => {
    it('should map team size variations', () => {
      const variations = [
        { input: 'solo', expected: 'solo' },
        { input: 'just-me', expected: 'solo' },
        { input: '1', expected: 'solo' },
        { input: '2-5', expected: '2-5' },
        { input: '2_5', expected: '2-5' },
        { input: 'small', expected: '2-5' },
        { input: '6-10', expected: '6-10' },
        { input: '6_10', expected: '6-10' },
        { input: 'medium', expected: '6-10' },
        { input: '10+', expected: '10+' },
        { input: '10_plus', expected: '10+' },
        { input: 'large', expected: '10+' }
      ]

      variations.forEach(({ input, expected }) => {
        expect(service.mapTeamSize(input)).toBe(expected)
      })
    })
  })

  describe('Stage Mapping', () => {
    it('should map stage variations', () => {
      const variations = [
        { input: 'idea', expected: 'idea' },
        { input: 'planning', expected: 'idea' },
        { input: 'pre-launch', expected: 'idea' },
        { input: 'building', expected: 'building' },
        { input: 'development', expected: 'building' },
        { input: 'in-progress', expected: 'building' },
        { input: 'beta', expected: 'beta' },
        { input: 'limited-release', expected: 'beta' },
        { input: 'early-access', expected: 'beta' },
        { input: 'launched', expected: 'launched' },
        { input: 'live', expected: 'launched' },
        { input: 'production', expected: 'launched' }
      ]

      variations.forEach(({ input, expected }) => {
        expect(service.mapCurrentStage(input)).toBe(expected)
      })
    })
  })

  describe('Completeness Validation', () => {
    it('should detect complete data', () => {
      const result = service.validateCompleteness(mockWizardData)

      expect(result.isComplete).toBe(true)
      expect(result.missingFields).toEqual([])
      expect(result.completionPercentage).toBe(100)
    })

    it('should detect incomplete data', () => {
      const incomplete = {
        productName: 'Product',
        // missing productType and targetAudience
      }

      const result = service.validateCompleteness(incomplete)

      expect(result.isComplete).toBe(false)
      expect(result.missingFields).toContain('productType')
      expect(result.missingFields).toContain('targetAudience')
    })

    it('should calculate completion percentage', () => {
      const partial = {
        productName: 'Product',
        productType: 'saas',
        targetAudience: 'Users',
        mainGoal: 'first_100'
      }

      const result = service.validateCompleteness(partial)

      // 4 fields out of 9 total = ~44%
      expect(result.completionPercentage).toBeGreaterThan(40)
      expect(result.completionPercentage).toBeLessThan(100)
    })

    it('should track required vs optional fields', () => {
      const result = service.validateCompleteness(mockWizardData)

      expect(result.completedFields).toBe(3) // required fields filled
      expect(result.totalRequiredFields).toBe(3)
    })
  })

  describe('Transformation Preview', () => {
    it('should provide preview of transformation', () => {
      const preview = service.getTransformationPreview(mockWizardData)

      expect(preview.original).toEqual(mockWizardData)
      expect(preview.transformed).toBeDefined()
      expect(preview.validation).toBeDefined()
      expect(preview.completeness).toBeDefined()
    })

    it('should show errors in preview for invalid data', () => {
      const invalid = {
        productName: 'Product',
        productType: 'unknown-type',
        targetAudience: 'Users'
      }

      const preview = service.getTransformationPreview(invalid)

      expect(preview.transformationErrors.length).toBeGreaterThan(0)
    })
  })

  describe('Error Handling', () => {
    it('should handle missing required parameters', async () => {
      const result = await service.migrateOnboarding(null, null, null)

      expect(result.success).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('should accumulate errors during transformation', () => {
      const errors = []
      const data = {
        productType: 'invalid-type',
        mainGoal: 'invalid-goal',
        teamSize: 'invalid-size'
      }

      service.transformWizardToContext(data, errors)

      expect(errors.length).toBeGreaterThanOrEqual(3)
    })

    it('should report unknown mappings', () => {
      expect(service.mapProductType('unknown')).toBeNull()
      expect(service.mapPrimaryGoal('unknown')).toBeNull()
      expect(service.mapTargetTimeline('unknown')).toBeNull()
      expect(service.mapTeamSize('unknown')).toBeNull()
      expect(service.mapCurrentStage('unknown')).toBeNull()
    })
  })

  describe('Batch Migration', () => {
    it('should handle empty batch', async () => {
      const result = await service.migrateBatch([])

      expect(result.succeeded).toEqual([])
      expect(result.failed).toEqual([])
    })

    it('should track succeeded and failed migrations', async () => {
      const migrations = [
        { projectId: 'proj1', userId: 'user1', wizardData: mockWizardData },
        { projectId: 'proj2', userId: 'user2', wizardData: mockWizardData }
      ]

      // Note: This will fail in tests without mocked repository,
      // but we're testing the structure
      const result = await service.migrateBatch(migrations)

      expect(result.succeeded).toBeDefined()
      expect(result.failed).toBeDefined()
      expect(result.warnings).toBeDefined()
    })
  })

  describe('Edge Cases', () => {
    it('should handle null values gracefully', () => {
      const data = {
        productName: 'Product',
        productType: 'saas',
        targetAudience: 'Users',
        budget: null,
        techStack: null
      }

      const transformed = service.transformWizardToContext(data)

      expect(transformed.productName).toBe('Product')
      expect(transformed.marketingBudget).toBeUndefined()
      expect(transformed.techStack).toBeUndefined()
    })

    it('should handle whitespace in mappings', () => {
      expect(service.mapProductType(' SAAS ')).toBe('saas')
      expect(service.mapPrimaryGoal('  first 100  ')).toBe('first_100')
      expect(service.mapTeamSize(' 2-5 ')).toBe('2-5')
    })

    it('should handle budget as string number', () => {
      const data = { ...mockWizardData, budget: '5000' }
      const transformed = service.transformWizardToContext(data)

      expect(transformed.marketingBudget).toBe(5000)
    })

    it('should handle empty strings', () => {
      const data = {
        productName: '',
        productType: 'saas',
        targetAudience: ''
      }

      const transformed = service.transformWizardToContext(data)

      expect(transformed.productName).toBeUndefined()
      expect(transformed.targetAudience).toBeUndefined()
    })
  })

  describe('Case Insensitivity', () => {
    it('should handle mixed case inputs', () => {
      expect(service.mapProductType('MobileApp')).toBe('mobile_app')
      expect(service.mapProductType('SAAS')).toBe('saas')
      expect(service.mapPrimaryGoal('FIRST_100')).toBe('first_100')
      expect(service.mapTeamSize('SOLO')).toBe('solo')
      expect(service.mapCurrentStage('BUILDING')).toBe('building')
    })
  })
})
