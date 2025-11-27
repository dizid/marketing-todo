/**
 * Form Schema Consolidation Service Tests
 *
 * Tests for form schema consolidation service that maps mini-app fields
 * to canonical ProjectContext fields
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { FormSchemaConsolidationService } from '../formSchemaConsolidationService.js'
import { CANONICAL_FIELDS } from '@/shared/registry/fieldRegistry.js'

describe('FormSchemaConsolidationService', () => {
  let service

  beforeEach(() => {
    service = new FormSchemaConsolidationService()
  })

  describe('Field Mappings Initialization', () => {
    it('should initialize with field mappings', () => {
      const mappings = service.fieldMappings
      expect(Object.keys(mappings).length).toBeGreaterThan(0)
    })

    it('should initialize mini-app dependencies', () => {
      const deps = service.miniAppFieldDependencies
      expect(Object.keys(deps).length).toBeGreaterThan(0)
    })

    it('should have mappings for all target audience sources', () => {
      const audienceMappings = [
        'defineAudience.audience_overview',
        'blog.target_audience',
        'webinar.audience_description',
        'paidAds.audience_segment',
        'landingPage.target_audience',
        'communityPosts.audience_focus',
        'outreach.target_audience'
      ]

      audienceMappings.forEach((key) => {
        expect(service.fieldMappings[key]).toBe(CANONICAL_FIELDS.TARGET_AUDIENCE)
      })
    })

    it('should have mappings for product name across mini-apps', () => {
      const productNameMappings = [
        'blog.product_name',
        'webinar.product_name',
        'paidAds.product_name',
        'landingPage.product_name',
        'defineAudience.product_name'
      ]

      productNameMappings.forEach((key) => {
        expect(service.fieldMappings[key]).toBe(CANONICAL_FIELDS.PRODUCT_NAME)
      })
    })

    it('should track all canonical fields used', () => {
      const canonicalFields = new Set(Object.values(service.fieldMappings).filter(v => v))
      expect(canonicalFields.size).toBeGreaterThan(5)
      expect(canonicalFields.has(CANONICAL_FIELDS.TARGET_AUDIENCE)).toBe(true)
      expect(canonicalFields.has(CANONICAL_FIELDS.PRODUCT_NAME)).toBe(true)
    })
  })

  describe('Mini-App Field Dependencies', () => {
    it('should track which mini-apps use target audience', () => {
      const miniApps = service.getMiniAppsUsingField(CANONICAL_FIELDS.TARGET_AUDIENCE)
      expect(miniApps.length).toBeGreaterThanOrEqual(5)
      expect(miniApps).toContain('defineAudience')
      expect(miniApps).toContain('blog')
    })

    it('should track which mini-apps use product name', () => {
      const miniApps = service.getMiniAppsUsingField(CANONICAL_FIELDS.PRODUCT_NAME)
      expect(miniApps.length).toBeGreaterThanOrEqual(3)
    })

    it('should return canonical fields for specific mini-app', () => {
      const blogFields = service.getCanonicalFieldsForMiniApp('blog')
      expect(blogFields).toContain(CANONICAL_FIELDS.PRODUCT_NAME)
      expect(blogFields).toContain(CANONICAL_FIELDS.TARGET_AUDIENCE)
    })

    it('should return empty array for unknown mini-app', () => {
      const unknownFields = service.getCanonicalFieldsForMiniApp('unknownMiniApp')
      expect(unknownFields).toEqual([])
    })
  })

  describe('Field Mapping', () => {
    it('should map defineAudience fields to canonical names', () => {
      const mapped = service.mapFieldToCanonical('defineAudience', 'audience_overview')
      expect(mapped).toBe(CANONICAL_FIELDS.TARGET_AUDIENCE)
    })

    it('should map blog fields to canonical names', () => {
      const mapped = service.mapFieldToCanonical('blog', 'target_audience')
      expect(mapped).toBe(CANONICAL_FIELDS.TARGET_AUDIENCE)
    })

    it('should return null for unmapped fields', () => {
      const mapped = service.mapFieldToCanonical('blog', 'unknown_field')
      expect(mapped).toBeNull()
    })

    it('should return null for unknown mini-app', () => {
      const mapped = service.mapFieldToCanonical('unknownApp', 'any_field')
      expect(mapped).toBeNull()
    })
  })

  describe('Canonical Field Definitions', () => {
    it('should retrieve canonical field definition', () => {
      const def = service.getCanonicalFieldDefinition(CANONICAL_FIELDS.TARGET_AUDIENCE)
      expect(def).not.toBeNull()
      expect(def.name).toBe(CANONICAL_FIELDS.TARGET_AUDIENCE)
      expect(def.type).toBeDefined()
      expect(def.label).toBeDefined()
    })

    it('should include validation rules in definition', () => {
      const def = service.getCanonicalFieldDefinition(CANONICAL_FIELDS.MARKETING_BUDGET)
      expect(def).not.toBeNull()
      expect(def.validation).toBeDefined()
    })

    it('should include UI metadata in definition', () => {
      const def = service.getCanonicalFieldDefinition(CANONICAL_FIELDS.PRODUCT_NAME)
      expect(def).not.toBeNull()
      expect(def.ui).toBeDefined()
    })

    it('should return null for undefined field', () => {
      const def = service.getCanonicalFieldDefinition('UNDEFINED_FIELD')
      expect(def).toBeNull()
    })

    it('should include inheritable flag', () => {
      const def = service.getCanonicalFieldDefinition(CANONICAL_FIELDS.PRODUCT_NAME)
      expect(def.inheritable).toBeDefined()
    })
  })

  describe('Form Field Consolidation', () => {
    it('should consolidate blog form fields', () => {
      const formFields = [
        { id: 'product_name', type: 'text' },
        { id: 'target_audience', type: 'text' }
      ]

      const result = service.consolidateFormFields('blog', formFields)

      expect(result.miniAppId).toBe('blog')
      expect(result.consolidatedFields.length).toBe(2)
      expect(result.unmappedFields).toEqual([])
      expect(result.consolidationRate).toBe(100)
    })

    it('should track unmapped fields', () => {
      const formFields = [
        { id: 'product_name', type: 'text' },
        { id: 'unknown_field', type: 'text' },
        { id: 'another_unknown', type: 'text' }
      ]

      const result = service.consolidateFormFields('blog', formFields)

      expect(result.unmappedFields).toContain('unknown_field')
      expect(result.unmappedFields).toContain('another_unknown')
      expect(result.consolidationRate).toBeLessThan(100)
    })

    it('should provide consolidation summary', () => {
      const formFields = [
        { id: 'product_name', type: 'text' },
        { id: 'target_audience', type: 'text' },
        { id: 'custom_field', type: 'text' }
      ]

      const result = service.consolidateFormFields('blog', formFields)

      expect(result.summary.totalOriginalFields).toBe(3)
      expect(result.summary.consolidatedFields).toBe(2)
      expect(result.summary.unmappedFields).toBe(1)
    })

    it('should preserve original field information', () => {
      const formFields = [
        { id: 'product_name', type: 'text', placeholder: 'Enter name' }
      ]

      const result = service.consolidateFormFields('blog', formFields)
      const consolidated = result.consolidatedFields[0]

      expect(consolidated.originalId).toBe('product_name')
      expect(consolidated.originalType).toBe('text')
      expect(consolidated.canonicalName).toBe(CANONICAL_FIELDS.PRODUCT_NAME)
    })

    it('should merge field metadata with canonical definitions', () => {
      const formFields = [
        { id: 'product_name', type: 'text' }
      ]

      const result = service.consolidateFormFields('blog', formFields)
      const consolidated = result.consolidatedFields[0]

      expect(consolidated.type).toBeDefined()
      expect(consolidated.label).toBeDefined()
      expect(consolidated.description).toBeDefined()
    })

    it('should handle empty form fields', () => {
      const result = service.consolidateFormFields('blog', [])

      expect(result.consolidatedFields).toEqual([])
      expect(result.unmappedFields).toEqual([])
      expect(result.consolidationRate).toBe(0)
    })
  })

  describe('Consolidation Impact Analysis', () => {
    it('should calculate impact analysis', () => {
      const analysis = service.getConsolidationImpactAnalysis()

      expect(analysis.totalMiniApps).toBeGreaterThan(0)
      expect(analysis.totalCanonicalFields).toBeGreaterThan(0)
      expect(analysis.fieldUsageDistribution).toBeDefined()
      expect(analysis.mostUsedFields).toBeDefined()
    })

    it('should identify most-used fields', () => {
      const analysis = service.getConsolidationImpactAnalysis()

      expect(analysis.mostUsedFields.length).toBeGreaterThan(0)
      expect(analysis.mostUsedFields[0].field).toBeDefined()
      expect(analysis.mostUsedFields[0].miniAppsUsing).toBeGreaterThan(0)
    })

    it('should sort by usage count descending', () => {
      const analysis = service.getConsolidationImpactAnalysis()

      for (let i = 0; i < analysis.mostUsedFields.length - 1; i++) {
        expect(analysis.mostUsedFields[i].miniAppsUsing).toBeGreaterThanOrEqual(
          analysis.mostUsedFields[i + 1].miniAppsUsing
        )
      }
    })

    it('should count field usage correctly', () => {
      const analysis = service.getConsolidationImpactAnalysis()

      // Target audience should be one of the most used
      const targetAudienceUsage = analysis.fieldUsageDistribution[CANONICAL_FIELDS.TARGET_AUDIENCE]
      expect(targetAudienceUsage).toBeGreaterThanOrEqual(5)
    })

    it('should track usage distribution', () => {
      const analysis = service.getConsolidationImpactAnalysis()

      const totalUsage = Object.values(analysis.fieldUsageDistribution).reduce((sum, count) => sum + count, 0)
      expect(totalUsage).toBeGreaterThan(0)
    })
  })

  describe('Form Validation Against Schema', () => {
    it('should validate form with all mapped fields', () => {
      const formFields = [
        { id: 'product_name', type: 'string' },
        { id: 'target_audience', type: 'string' }
      ]

      const result = service.validateFormAgainstSchema('blog', formFields)

      expect(result.isValid).toBe(true)
      expect(result.issues.missingCanonicalMappings).toEqual([])
      expect(result.issues.typeMismatches).toEqual([])
    })

    it('should detect unmapped fields', () => {
      const formFields = [
        { id: 'product_name', type: 'text' },
        { id: 'unknown_custom_field', type: 'text' }
      ]

      const result = service.validateFormAgainstSchema('blog', formFields)

      expect(result.isValid).toBe(false)
      expect(result.issues.missingCanonicalMappings.length).toBeGreaterThan(0)
    })

    it('should detect type mismatches', () => {
      const formFields = [
        { id: 'product_name', type: 'number' } // Should be text
      ]

      const result = service.validateFormAgainstSchema('blog', formFields)

      expect(result.issues.typeMismatches.length).toBeGreaterThan(0)
    })

    it('should provide detailed issue information', () => {
      const formFields = [
        { id: 'unknown_field', type: 'text' }
      ]

      const result = service.validateFormAgainstSchema('blog', formFields)

      const issue = result.issues.missingCanonicalMappings[0]
      expect(issue.fieldId).toBe('unknown_field')
      expect(issue.fieldType).toBe('text')
      expect(issue.message).toBeDefined()
    })

    it('should count total issues', () => {
      const formFields = [
        { id: 'unknown_field_1', type: 'text' },
        { id: 'unknown_field_2', type: 'text' }
      ]

      const result = service.validateFormAgainstSchema('blog', formFields)

      expect(result.issueCount).toBe(2)
    })

    it('should include field count in result', () => {
      const formFields = [
        { id: 'product_name', type: 'text' },
        { id: 'target_audience', type: 'text' }
      ]

      const result = service.validateFormAgainstSchema('blog', formFields)

      expect(result.fieldCount).toBe(2)
    })
  })

  describe('Consolidation Report Generation', () => {
    it('should generate consolidation report', () => {
      const report = service.generateConsolidationReport()

      expect(report.timestamp).toBeDefined()
      expect(report.summary).toBeDefined()
      expect(report.byMiniApp).toBeDefined()
      expect(report.byCanonicalField).toBeDefined()
    })

    it('should include summary statistics', () => {
      const report = service.generateConsolidationReport()

      expect(report.summary.totalFieldMappings).toBeGreaterThan(0)
      expect(report.summary.uniqueMiniApps).toBeGreaterThan(0)
      expect(report.summary.uniqueCanonicalFields).toBeGreaterThan(0)
    })

    it('should organize by mini-app', () => {
      const report = service.generateConsolidationReport()

      expect(Object.keys(report.byMiniApp).length).toBeGreaterThan(0)
      expect(report.byMiniApp.blog).toBeDefined()
      expect(report.byMiniApp.blog.canonicalFieldsUsed).toBeDefined()
      expect(report.byMiniApp.blog.fieldCount).toBeGreaterThan(0)
    })

    it('should organize by canonical field', () => {
      const report = service.generateConsolidationReport()

      expect(Object.keys(report.byCanonicalField).length).toBeGreaterThan(0)
      expect(report.byCanonicalField[CANONICAL_FIELDS.TARGET_AUDIENCE]).toBeDefined()
      expect(report.byCanonicalField[CANONICAL_FIELDS.TARGET_AUDIENCE].usedBy).toBeDefined()
      expect(report.byCanonicalField[CANONICAL_FIELDS.TARGET_AUDIENCE].miniAppCount).toBeGreaterThan(0)
    })

    it('should avoid duplicate mini-apps in field report', () => {
      const report = service.generateConsolidationReport()

      Object.values(report.byCanonicalField).forEach((field) => {
        const uniqueApps = new Set(field.usedBy)
        expect(uniqueApps.size).toBe(field.miniAppCount)
      })
    })

    it('should include timestamp', () => {
      const report = service.generateConsolidationReport()

      expect(report.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/)
    })
  })

  describe('Consolidation Recommendations', () => {
    it('should generate recommendations', () => {
      const recs = service.getConsolidationRecommendations()

      expect(Array.isArray(recs)).toBe(true)
      expect(recs.length).toBeGreaterThanOrEqual(0)
    })

    it('should identify high-reuse fields', () => {
      const recs = service.getConsolidationRecommendations()

      const highReuseRecs = recs.filter((r) => r.type === 'high-reuse')
      expect(highReuseRecs.length).toBeGreaterThan(0)
    })

    it('should prioritize by criticality', () => {
      const recs = service.getConsolidationRecommendations()

      // Should be sorted by priority
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
      for (let i = 0; i < recs.length - 1; i++) {
        expect(priorityOrder[recs[i].priority]).toBeLessThanOrEqual(priorityOrder[recs[i + 1].priority])
      }
    })

    it('should recommend high-reuse fields with multiple mini-apps', () => {
      const recs = service.getConsolidationRecommendations()

      const highReuseRecs = recs.filter((r) => r.type === 'high-reuse')
      highReuseRecs.forEach((rec) => {
        expect(rec.field).toBeDefined()
        expect(rec.miniAppsUsing).toBeGreaterThanOrEqual(3)
        expect(rec.recommendation).toBeDefined()
      })
    })

    it('should mark fields used by 5+ mini-apps as critical', () => {
      const recs = service.getConsolidationRecommendations()

      const criticalRecs = recs.filter((r) => r.priority === 'critical')
      criticalRecs.forEach((rec) => {
        expect(rec.miniAppsUsing).toBeGreaterThanOrEqual(5)
      })
    })

    it('should include descriptive recommendations', () => {
      const recs = service.getConsolidationRecommendations()

      recs.forEach((rec) => {
        expect(rec.recommendation).toBeDefined()
        expect(typeof rec.recommendation).toBe('string')
        expect(rec.recommendation.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Consolidation Mapping Export', () => {
    it('should export consolidation mapping', () => {
      const mapping = service.exportConsolidationMapping()

      expect(mapping).toBeDefined()
      expect(mapping.version).toBeDefined()
      expect(mapping.timestamp).toBeDefined()
      expect(mapping.fieldMappings).toBeDefined()
      expect(mapping.miniAppDependencies).toBeDefined()
      expect(mapping.canonicalFieldDefinitions).toBeDefined()
    })

    it('should export all field mappings', () => {
      const mapping = service.exportConsolidationMapping()

      expect(Object.keys(mapping.fieldMappings).length).toBeGreaterThan(0)
      expect(mapping.fieldMappings['blog.product_name']).toBe(CANONICAL_FIELDS.PRODUCT_NAME)
    })

    it('should export mini-app dependencies as arrays', () => {
      const mapping = service.exportConsolidationMapping()

      Object.entries(mapping.miniAppDependencies).forEach(([miniAppId, fields]) => {
        expect(Array.isArray(fields)).toBe(true)
        fields.forEach((field) => {
          expect(typeof field).toBe('string')
        })
      })
    })

    it('should export canonical field definitions', () => {
      const mapping = service.exportConsolidationMapping()

      expect(mapping.canonicalFieldDefinitions[CANONICAL_FIELDS.PRODUCT_NAME]).toBeDefined()
      const def = mapping.canonicalFieldDefinitions[CANONICAL_FIELDS.PRODUCT_NAME]
      expect(def.type).toBeDefined()
      expect(def.label).toBeDefined()
    })

    it('should have consistent version', () => {
      const mapping = service.exportConsolidationMapping()

      expect(mapping.version).toBe('1.0')
    })

    it('should include ISO timestamp', () => {
      const mapping = service.exportConsolidationMapping()

      expect(mapping.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/)
    })
  })

  describe('Mini-App Coverage', () => {
    it('should have mappings for defineAudience mini-app', () => {
      const fields = service.getCanonicalFieldsForMiniApp('defineAudience')
      expect(fields.length).toBeGreaterThan(0)
    })

    it('should have mappings for blog mini-app', () => {
      const fields = service.getCanonicalFieldsForMiniApp('blog')
      expect(fields).toContain(CANONICAL_FIELDS.PRODUCT_NAME)
      expect(fields).toContain(CANONICAL_FIELDS.TARGET_AUDIENCE)
    })

    it('should have mappings for webinar mini-app', () => {
      const fields = service.getCanonicalFieldsForMiniApp('webinar')
      expect(fields).toContain(CANONICAL_FIELDS.TARGET_AUDIENCE)
    })

    it('should have mappings for paidAds mini-app', () => {
      const fields = service.getCanonicalFieldsForMiniApp('paidAds')
      expect(fields).toContain(CANONICAL_FIELDS.TARGET_AUDIENCE)
      expect(fields).toContain(CANONICAL_FIELDS.MARKETING_BUDGET)
    })

    it('should have mappings for landingPage mini-app', () => {
      const fields = service.getCanonicalFieldsForMiniApp('landingPage')
      expect(fields).toContain(CANONICAL_FIELDS.PRODUCT_NAME)
      expect(fields).toContain(CANONICAL_FIELDS.TARGET_AUDIENCE)
    })
  })

  describe('Field Type Consistency', () => {
    it('should maintain type consistency for product name across mini-apps', () => {
      const productNameMappings = ['blog.product_name', 'webinar.product_name', 'paidAds.product_name']

      productNameMappings.forEach((mapping) => {
        const canonical = service.mapFieldToCanonical(mapping.split('.')[0], mapping.split('.')[1])
        expect(canonical).toBe(CANONICAL_FIELDS.PRODUCT_NAME)

        const def = service.getCanonicalFieldDefinition(canonical)
        expect(def.type).toBe('string')
      })
    })

    it('should maintain type consistency for budget field', () => {
      const budgetMappings = service.getMiniAppsUsingField(CANONICAL_FIELDS.MARKETING_BUDGET)
      const def = service.getCanonicalFieldDefinition(CANONICAL_FIELDS.MARKETING_BUDGET)

      expect(def.type).toBe('number')
      expect(budgetMappings.length).toBeGreaterThan(0)
    })
  })

  describe('Edge Cases', () => {
    it('should handle consolidation of single field', () => {
      const result = service.consolidateFormFields('blog', [{ id: 'product_name', type: 'text' }])

      expect(result.consolidatedFields.length).toBe(1)
      expect(result.consolidationRate).toBe(100)
    })

    it('should handle consolidation with all unmapped fields', () => {
      const result = service.consolidateFormFields('blog', [
        { id: 'unknown1', type: 'text' },
        { id: 'unknown2', type: 'text' }
      ])

      expect(result.consolidatedFields.length).toBe(0)
      expect(result.unmappedFields.length).toBe(2)
      expect(result.consolidationRate).toBe(0)
    })

    it('should handle validation of empty form', () => {
      const result = service.validateFormAgainstSchema('blog', [])

      expect(result.isValid).toBe(true)
      expect(result.fieldCount).toBe(0)
    })

    it('should generate report with current data', () => {
      const report1 = service.generateConsolidationReport()
      const report2 = service.generateConsolidationReport()

      // Both should have same structure
      expect(Object.keys(report1.summary)).toEqual(Object.keys(report2.summary))
    })
  })

  describe('Canonical Field Properties', () => {
    it('should include inheritable property for all fields', () => {
      const canonicalFields = new Set(Object.values(service.fieldMappings).filter(v => v))

      canonicalFields.forEach((field) => {
        const def = service.getCanonicalFieldDefinition(field)
        expect(def).not.toBeNull()
        expect(def.inheritable).toBeDefined()
        expect(typeof def.inheritable).toBe('boolean')
      })
    })

    it('should include required property for all fields', () => {
      const canonicalFields = new Set(Object.values(service.fieldMappings).filter(v => v))

      canonicalFields.forEach((field) => {
        const def = service.getCanonicalFieldDefinition(field)
        expect(def).not.toBeNull()
        expect(def.required).toBeDefined()
      })
    })

    it('should have ui metadata for form rendering', () => {
      const canonicalFields = new Set(Object.values(service.fieldMappings).filter(v => v))

      canonicalFields.forEach((field) => {
        const def = service.getCanonicalFieldDefinition(field)
        expect(def).not.toBeNull()
        expect(def.ui).toBeDefined()
      })
    })
  })
})
