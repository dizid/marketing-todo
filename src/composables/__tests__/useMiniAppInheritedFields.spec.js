/**
 * Mini-App Inherited Fields Composable Tests
 *
 * Tests for useMiniAppInheritedFields composable
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { useMiniAppInheritedFields } from '../useMiniAppInheritedFields.js'
import { CANONICAL_FIELDS } from '@/shared/registry/fieldRegistry.js'

describe('useMiniAppInheritedFields', () => {
  let projectId, miniApp

  beforeEach(() => {
    projectId = 'project-123'
  })

  describe('Blog Mini-App', () => {
    beforeEach(() => {
      miniApp = useMiniAppInheritedFields(projectId, 'blog')
    })

    it('should initialize with blog fields', () => {
      expect(miniApp.miniAppName).toBe('blog')
      expect(miniApp.selectedFields.value).toBeDefined()
      expect(miniApp.requiredFields.value.size).toBeGreaterThan(0)
    })

    it('should have correct required fields for blog', () => {
      expect(miniApp.requiredFields.value.has(CANONICAL_FIELDS.PRODUCT_NAME)).toBe(true)
      expect(miniApp.requiredFields.value.has(CANONICAL_FIELDS.TARGET_AUDIENCE)).toBe(true)
    })

    it('should set and get field values', () => {
      const result = miniApp.setField(CANONICAL_FIELDS.PRODUCT_NAME, 'My Product')
      expect(result.isValid).toBe(true)
      expect(miniApp.getField(CANONICAL_FIELDS.PRODUCT_NAME)).toBe('My Product')
    })

    it('should detect field source', () => {
      miniApp.setField(CANONICAL_FIELDS.PRODUCT_NAME, 'Override')
      expect(miniApp.isOverridden(CANONICAL_FIELDS.PRODUCT_NAME)).toBe(true)
      expect(miniApp.getFieldSource(CANONICAL_FIELDS.PRODUCT_NAME)).toBe('override')
    })

    it('should validate required fields', () => {
      // Clear all fields
      miniApp.clearAllFields()

      const validation = miniApp.validateRequired()
      expect(validation.isValid).toBe(false)
      expect(Object.keys(validation.errors).length).toBeGreaterThan(0)
    })

    it('should pass validation when required fields are set', () => {
      miniApp.setField(CANONICAL_FIELDS.PRODUCT_NAME, 'Product')
      miniApp.setField(CANONICAL_FIELDS.TARGET_AUDIENCE, 'Audience')

      const validation = miniApp.validateRequired()
      expect(validation.isValid).toBe(true)
      expect(Object.keys(validation.errors).length).toBe(0)
    })
  })

  describe('Paid Ads Mini-App', () => {
    beforeEach(() => {
      miniApp = useMiniAppInheritedFields(projectId, 'paidAds')
    })

    it('should initialize with paidAds fields', () => {
      expect(miniApp.miniAppName).toBe('paidAds')
      expect(miniApp.requiredFields.value.size).toBe(3)
    })

    it('should have budget field available', () => {
      expect(miniApp.selectedFields.value.has(CANONICAL_FIELDS.MARKETING_BUDGET)).toBe(true)
    })

    it('should validate budget field as number', () => {
      const result = miniApp.setField(CANONICAL_FIELDS.MARKETING_BUDGET, 5000)
      expect(result.isValid).toBe(true)

      const invalidResult = miniApp.setField(CANONICAL_FIELDS.MARKETING_BUDGET, 'invalid')
      expect(invalidResult.isValid).toBe(false)
    })
  })

  describe('General Mini-App', () => {
    beforeEach(() => {
      miniApp = useMiniAppInheritedFields(projectId, 'projectForm')
    })

    it('should have all canonical fields available', () => {
      expect(miniApp.selectedFields.value.size).toBeGreaterThan(8)
    })
  })

  describe('Field Management', () => {
    beforeEach(() => {
      miniApp = useMiniAppInheritedFields(projectId, 'blog')
    })

    it('should set override with validation', () => {
      const result = miniApp.setOverride(CANONICAL_FIELDS.PRODUCT_NAME, 'New Name')
      expect(result.isValid).toBe(true)
      expect(miniApp.isOverridden(CANONICAL_FIELDS.PRODUCT_NAME)).toBe(true)
    })

    it('should clear single field override', () => {
      miniApp.setField(CANONICAL_FIELDS.PRODUCT_NAME, 'Name')
      expect(miniApp.isOverridden(CANONICAL_FIELDS.PRODUCT_NAME)).toBe(true)

      miniApp.clearField(CANONICAL_FIELDS.PRODUCT_NAME)
      expect(miniApp.isOverridden(CANONICAL_FIELDS.PRODUCT_NAME)).toBe(false)
    })

    it('should clear all field overrides', () => {
      miniApp.setField(CANONICAL_FIELDS.PRODUCT_NAME, 'Name')
      miniApp.setField(CANONICAL_FIELDS.TARGET_AUDIENCE, 'Audience')

      miniApp.clearAllFields()

      expect(miniApp.isOverridden(CANONICAL_FIELDS.PRODUCT_NAME)).toBe(false)
      expect(miniApp.isOverridden(CANONICAL_FIELDS.TARGET_AUDIENCE)).toBe(false)
    })

    it('should reset to inherited values', () => {
      miniApp.setField(CANONICAL_FIELDS.PRODUCT_NAME, 'Override')
      miniApp.resetToInherited()
      expect(miniApp.isOverridden(CANONICAL_FIELDS.PRODUCT_NAME)).toBe(false)
    })
  })

  describe('Data Inspection', () => {
    beforeEach(() => {
      miniApp = useMiniAppInheritedFields(projectId, 'blog')
    })

    it('should export field data', () => {
      miniApp.setField(CANONICAL_FIELDS.PRODUCT_NAME, 'Product')
      miniApp.setField(CANONICAL_FIELDS.TARGET_AUDIENCE, 'Audience')

      const exported = miniApp.exportFieldData()
      expect(exported[CANONICAL_FIELDS.PRODUCT_NAME]).toBe('Product')
      expect(exported[CANONICAL_FIELDS.TARGET_AUDIENCE]).toBe('Audience')
    })

    it('should include null values when requested', () => {
      miniApp.clearAllFields()
      const exported = miniApp.exportFieldData(true)
      expect(Object.keys(exported).length).toBeGreaterThan(0)
    })

    it('should get validation status summary', () => {
      miniApp.setField(CANONICAL_FIELDS.PRODUCT_NAME, 'Product')
      miniApp.setField(CANONICAL_FIELDS.TARGET_AUDIENCE, 'Audience')

      const status = miniApp.getValidationStatus
      expect(status.requiredFieldsCount).toBe(2)
      expect(status.filledRequiredFields).toBe(2)
    })

    it('should provide comprehensive summary', () => {
      miniApp.setField(CANONICAL_FIELDS.PRODUCT_NAME, 'Product')

      const summary = miniApp.getSummary
      expect(summary.miniAppName).toBe('blog')
      expect(summary.projectId).toBe(projectId)
      expect(summary.totalFields).toBeGreaterThan(0)
      expect(summary.overriddenFields).toBeGreaterThan(0)
      expect(summary.fields).toBeDefined()
    })
  })

  describe('Field Inheritance Checks', () => {
    beforeEach(() => {
      miniApp = useMiniAppInheritedFields(projectId, 'blog')
    })

    it('should identify inheritable fields', () => {
      expect(miniApp.canInherit(CANONICAL_FIELDS.PRODUCT_NAME)).toBe(true)
      expect(miniApp.canInherit(CANONICAL_FIELDS.TARGET_AUDIENCE)).toBe(true)
    })

    it('should identify non-inheritable fields', () => {
      expect(miniApp.canInherit(CANONICAL_FIELDS.TECH_STACK)).toBe(false)
    })

    it('should check required field status', () => {
      expect(miniApp.isRequired(CANONICAL_FIELDS.PRODUCT_NAME)).toBe(true)
      expect(miniApp.isRequired(CANONICAL_FIELDS.PRODUCT_DESCRIPTION)).toBe(false)
    })

    it('should get inherited fields object', () => {
      const inherited = miniApp.getInheritedFields
      expect(inherited).toBeDefined()
      expect(typeof inherited).toBe('object')
    })

    it('should get overridden fields object', () => {
      miniApp.setField(CANONICAL_FIELDS.PRODUCT_NAME, 'Override')
      const overridden = miniApp.getOverriddenFields
      expect(overridden[CANONICAL_FIELDS.PRODUCT_NAME]).toBe('Override')
    })
  })

  describe('Error Handling', () => {
    beforeEach(() => {
      miniApp = useMiniAppInheritedFields(projectId, 'blog')
    })

    it('should handle invalid field values gracefully', () => {
      const result = miniApp.setField(CANONICAL_FIELDS.MARKETING_BUDGET, 'not-a-number')
      expect(result.isValid).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should not override on validation failure', () => {
      miniApp.setField(CANONICAL_FIELDS.PRODUCT_NAME, 'Valid')
      const invalidResult = miniApp.setField(CANONICAL_FIELDS.PRODUCT_NAME, { notAString: true })
      expect(invalidResult.isValid).toBe(false)
    })
  })

  describe('Async Operations', () => {
    beforeEach(() => {
      miniApp = useMiniAppInheritedFields(projectId, 'blog')
    })

    it('should initialize without errors', async () => {
      await miniApp.initialize()
      expect(miniApp._batchComposable.isLoading).toBe(false)
    })
  })

  describe('Mini-App Field Mappings', () => {
    it('webinar should require specific fields', () => {
      const webinar = useMiniAppInheritedFields(projectId, 'webinar')
      expect(webinar.isRequired(CANONICAL_FIELDS.PRODUCT_NAME)).toBe(true)
      expect(webinar.isRequired(CANONICAL_FIELDS.TARGET_AUDIENCE)).toBe(true)
      expect(webinar.isRequired(CANONICAL_FIELDS.TARGET_TIMELINE)).toBe(false)
    })

    it('landingPage should require product details', () => {
      const landing = useMiniAppInheritedFields(projectId, 'landingPage')
      expect(landing.isRequired(CANONICAL_FIELDS.PRODUCT_NAME)).toBe(true)
      expect(landing.isRequired(CANONICAL_FIELDS.PRODUCT_DESCRIPTION)).toBe(true)
      expect(landing.isRequired(CANONICAL_FIELDS.MARKETING_BUDGET)).toBe(false)
    })

    it('paidAds should require goal field', () => {
      const ads = useMiniAppInheritedFields(projectId, 'paidAds')
      expect(ads.isRequired(CANONICAL_FIELDS.PRIMARY_GOAL)).toBe(true)
      expect(ads.isRequired(CANONICAL_FIELDS.MARKETING_BUDGET)).toBe(true)
    })
  })
})
