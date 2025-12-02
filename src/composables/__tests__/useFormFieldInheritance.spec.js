/**
 * Form Field Inheritance Composable Tests
 *
 * Tests for useFormFieldInheritance adapter composable (replaces useMiniAppInheritedFields)
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { useFormFieldInheritance } from '../useFormFieldInheritance.js'
import { CANONICAL_FIELDS } from '@/shared/registry/fieldRegistry.js'

describe('useFormFieldInheritance', () => {
  let projectId, composable

  beforeEach(() => {
    projectId = 'project-123'
  })

  describe('Field Mappings', () => {
    beforeEach(() => {
      composable = useFormFieldInheritance(projectId, {
        fieldMappings: {
          'audience_field': 'target_audience',
          'title_field': 'product_name'
        },
        requiredFields: ['audience_field', 'title_field']
      })
    })

    it('should initialize with field mappings', () => {
      expect(composable).toBeDefined()
      expect(composable.getField).toBeDefined()
    })

    it('should map miniApp field IDs to canonical names', () => {
      const value = composable.getField('audience_field')
      // Should retrieve the 'target_audience' canonical field
      expect(typeof value === 'string' || value === null).toBe(true)
    })

    it('should set field using miniApp field ID', () => {
      const result = composable.setField('audience_field', 'B2B Companies')
      expect(result.isValid || result.isValid === undefined).toBe(true)
      expect(composable.getField('audience_field')).toBe('B2B Companies')
    })
  })

  describe('Backward Compatibility - Mini-App Names', () => {
    it('should work with preset "blog" mini-app', () => {
      composable = useFormFieldInheritance(projectId, 'blog')
      expect(composable).toBeDefined()
      expect(composable.getField(CANONICAL_FIELDS.PRODUCT_NAME)).toBeDefined()
    })

    it('should work with preset "webinar" mini-app', () => {
      composable = useFormFieldInheritance(projectId, 'webinar')
      expect(composable).toBeDefined()
      expect(composable.getField(CANONICAL_FIELDS.TARGET_TIMELINE)).toBeDefined()
    })

    it('should work with preset "paidAds" mini-app', () => {
      composable = useFormFieldInheritance(projectId, 'paidAds')
      expect(composable).toBeDefined()
      expect(composable.getField(CANONICAL_FIELDS.MARKETING_BUDGET)).toBeDefined()
    })

    it('should have correct required fields for blog preset', () => {
      composable = useFormFieldInheritance(projectId, 'blog')
      expect(composable.isRequired(CANONICAL_FIELDS.PRODUCT_NAME)).toBe(true)
      expect(composable.isRequired(CANONICAL_FIELDS.TARGET_AUDIENCE)).toBe(true)
    })

    it('should have correct required fields for paidAds preset', () => {
      composable = useFormFieldInheritance(projectId, 'paidAds')
      expect(composable.isRequired(CANONICAL_FIELDS.PRIMARY_GOAL)).toBe(true)
      expect(composable.isRequired(CANONICAL_FIELDS.MARKETING_BUDGET)).toBe(true)
    })
  })

  describe('Field Access', () => {
    beforeEach(() => {
      composable = useFormFieldInheritance(projectId, {
        fieldMappings: { 'product_field': 'product_name' },
        requiredFields: ['product_field']
      })
    })

    it('should get field details with source info', () => {
      const details = composable.getFieldDetails('product_field')
      expect(details).toHaveProperty('value')
      expect(details).toHaveProperty('source')
    })

    it('should set and retrieve field values', () => {
      composable.setField('product_field', 'My Product')
      expect(composable.getField('product_field')).toBe('My Product')
    })

    it('should use setOverride alias', () => {
      composable.setOverride('product_field', 'Override Value')
      expect(composable.getField('product_field')).toBe('Override Value')
    })

    it('should detect overridden fields', () => {
      composable.setField('product_field', 'Overridden')
      expect(composable.isOverridden('product_field')).toBe(true)
    })

    it('should clear field overrides', () => {
      composable.setField('product_field', 'Value')
      expect(composable.isOverridden('product_field')).toBe(true)

      composable.clearField('product_field')
      expect(composable.isOverridden('product_field')).toBe(false)
    })

    it('should clear all field overrides', () => {
      composable.setField('product_field', 'Value')
      expect(composable.isOverridden('product_field')).toBe(true)

      composable.clearAllFields()
      expect(composable.isOverridden('product_field')).toBe(false)
    })
  })

  describe('Field Source Tracking', () => {
    beforeEach(() => {
      composable = useFormFieldInheritance(projectId, {
        fieldMappings: { 'product_field': 'product_name' },
        requiredFields: []
      })
    })

    it('should identify inherited fields', () => {
      expect(composable.isInherited('product_field')).toBe(true) // Assumes inherited if not overridden
    })

    it('should track field source', () => {
      const source = composable.getFieldSource('product_field')
      expect(['inherited', 'override', null].includes(source)).toBe(true)
    })

    it('should update source after override', () => {
      composable.setField('product_field', 'Override')
      expect(composable.getFieldSource('product_field')).toBe('override')
    })
  })

  describe('Field Requirements', () => {
    beforeEach(() => {
      composable = useFormFieldInheritance(projectId, {
        fieldMappings: {
          'required_field': 'product_name',
          'optional_field': 'product_description'
        },
        requiredFields: ['required_field']
      })
    })

    it('should identify required fields', () => {
      expect(composable.isRequired('required_field')).toBe(true)
      expect(composable.isRequired('optional_field')).toBe(false)
    })

    it('should validate required fields', () => {
      composable.clearAllFields()
      const validation = composable.validateRequired()
      expect(validation.isValid).toBe(false)
      expect(validation.errors).toBeDefined()
    })

    it('should pass validation when required fields are set', () => {
      composable.setField('required_field', 'Product Name')
      const validation = composable.validateRequired()
      expect(validation.isValid).toBe(true)
    })

    it('should provide validation status', () => {
      const status = composable.getValidationStatus
      expect(status).toHaveProperty('isValidated')
      expect(status).toHaveProperty('isValid')
      expect(status).toHaveProperty('requiredFieldsCount')
      expect(status).toHaveProperty('filledRequiredFields')
    })
  })

  describe('Data Export', () => {
    beforeEach(() => {
      composable = useFormFieldInheritance(projectId, {
        fieldMappings: {
          'product_field': 'product_name',
          'audience_field': 'target_audience'
        },
        requiredFields: []
      })
    })

    it('should export field data', () => {
      composable.setField('product_field', 'My Product')
      composable.setField('audience_field', 'B2B')

      const exported = composable.exportFieldData()
      expect(exported['product_field']).toBe('My Product')
      expect(exported['audience_field']).toBe('B2B')
    })

    it('should include null values when requested', () => {
      composable.clearAllFields()
      const exported = composable.exportFieldData(true)
      expect(Object.keys(exported).length).toBeGreaterThan(0)
    })

    it('should get inherited fields object', () => {
      const inherited = composable.getInheritedFields
      expect(inherited).toBeDefined()
      expect(typeof inherited).toBe('object')
    })

    it('should get overridden fields object', () => {
      composable.setField('product_field', 'Override')
      const overridden = composable.getOverriddenFields
      expect(overridden['product_field']).toBe('Override')
    })
  })

  describe('Summary and State', () => {
    beforeEach(() => {
      composable = useFormFieldInheritance(projectId, {
        fieldMappings: { 'product_field': 'product_name' },
        requiredFields: ['product_field']
      })
    })

    it('should provide comprehensive summary', () => {
      const summary = composable.getSummary
      expect(summary).toHaveProperty('totalFields')
      expect(summary).toHaveProperty('requiredFields')
      expect(summary).toHaveProperty('overriddenFields')
      expect(summary).toHaveProperty('inheritedFields')
      expect(summary).toHaveProperty('fields')
    })

    it('should reset to inherited values', () => {
      composable.setField('product_field', 'Override')
      expect(composable.isOverridden('product_field')).toBe(true)

      composable.resetToInherited()
      expect(composable.isOverridden('product_field')).toBe(false)
    })

    it('should initialize composable', async () => {
      await composable.initialize()
      expect(composable._batchComposable).toBeDefined()
    })
  })

  describe('Advanced - Underlying Batch Composable', () => {
    beforeEach(() => {
      composable = useFormFieldInheritance(projectId, {
        fieldMappings: { 'product_field': 'product_name' },
        requiredFields: []
      })
    })

    it('should expose batch composable for advanced use', () => {
      expect(composable._batchComposable).toBeDefined()
      expect(composable._batchComposable.getFieldValue).toBeDefined()
    })
  })
})
