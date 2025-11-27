/**
 * Form Schema Consolidation Service
 *
 * Maps mini-app form fields to canonical ProjectContext field names.
 * Consolidates 24 mini-apps' forms to use unified field definitions.
 *
 * Features:
 * 1. Field mapping from mini-app forms to canonical names
 * 2. Form schema extraction and normalization
 * 3. Field metadata enrichment with canonical definitions
 * 4. Dependency detection (which mini-apps use which fields)
 * 5. Form validation compatibility checking
 * 6. Batch schema consolidation
 *
 * Field Mapping Strategy:
 * - Identify common fields across multiple mini-apps (audience, goal, timeline, budget, etc.)
 * - Map local field names to canonical names from CANONICAL_FIELDS
 * - Enrich with schema metadata from fieldSchemas.js
 * - Generate consolidated form definitions
 */

import { CANONICAL_FIELDS } from '@/shared/registry/fieldRegistry.js'
import { FIELD_SCHEMAS } from '@/shared/registry/fieldSchemas.js'

export class FormSchemaConsolidationService {
  constructor(logger = null) {
    this.logger = logger

    // Map of mini-app field names to canonical fields
    // Key: "miniAppId.fieldId" -> Value: CANONICAL_FIELD_NAME
    this.fieldMappings = this.initializeFieldMappings()

    // Track which mini-apps use which canonical fields
    this.miniAppFieldDependencies = this.initializeMiniAppDependencies()
  }

  /**
   * Initialize field mappings for all known mini-apps
   * This represents the consolidation of duplicate fields across mini-apps
   */
  initializeFieldMappings() {
    return {
      // Audience-related fields (used by multiple mini-apps)
      'defineAudience.audience_overview': CANONICAL_FIELDS.TARGET_AUDIENCE,
      'defineAudience.target_users_30d': CANONICAL_FIELDS.TARGET_AUDIENCE,
      'blog.target_audience': CANONICAL_FIELDS.TARGET_AUDIENCE,
      'webinar.audience_description': CANONICAL_FIELDS.TARGET_AUDIENCE,
      'paidAds.audience_segment': CANONICAL_FIELDS.TARGET_AUDIENCE,
      'landingPage.target_audience': CANONICAL_FIELDS.TARGET_AUDIENCE,
      'communityPosts.audience_focus': CANONICAL_FIELDS.TARGET_AUDIENCE,
      'outreach.target_audience': CANONICAL_FIELDS.TARGET_AUDIENCE,

      // Product name fields
      'blog.product_name': CANONICAL_FIELDS.PRODUCT_NAME,
      'webinar.product_name': CANONICAL_FIELDS.PRODUCT_NAME,
      'paidAds.product_name': CANONICAL_FIELDS.PRODUCT_NAME,
      'landingPage.product_name': CANONICAL_FIELDS.PRODUCT_NAME,
      'defineAudience.product_name': CANONICAL_FIELDS.PRODUCT_NAME,

      // Product description
      'blog.product_description': CANONICAL_FIELDS.PRODUCT_DESCRIPTION,
      'paidAds.product_description': CANONICAL_FIELDS.PRODUCT_DESCRIPTION,
      'landingPage.product_description': CANONICAL_FIELDS.PRODUCT_DESCRIPTION,
      'defineAudience.product_description': CANONICAL_FIELDS.PRODUCT_DESCRIPTION,

      // Goal-related fields
      'defineAudience.primary_goal': CANONICAL_FIELDS.PRIMARY_GOAL,
      'paidAds.campaign_goal': CANONICAL_FIELDS.PRIMARY_GOAL,
      'webinar.webinar_goal': CANONICAL_FIELDS.PRIMARY_GOAL,

      // Timeline fields
      'defineAudience.target_timeline': CANONICAL_FIELDS.TARGET_TIMELINE,
      'webinar.webinar_timeline': CANONICAL_FIELDS.TARGET_TIMELINE,
      'paidAds.campaign_duration': CANONICAL_FIELDS.TARGET_TIMELINE,

      // Budget fields
      'paidAds.budget': CANONICAL_FIELDS.MARKETING_BUDGET,
      'paidAds.daily_budget': CANONICAL_FIELDS.MARKETING_BUDGET,
      'defineAudience.marketing_budget': CANONICAL_FIELDS.MARKETING_BUDGET,

      // Team size
      'defineAudience.team_size': CANONICAL_FIELDS.TEAM_SIZE,

      // Current stage
      'defineAudience.current_stage': CANONICAL_FIELDS.CURRENT_STAGE,

      // Tech stack (less common)
      'defineAudience.tech_stack': CANONICAL_FIELDS.TECH_STACK
    }
  }

  /**
   * Initialize mini-app to field dependencies
   */
  initializeMiniAppDependencies() {
    const dependencies = {}

    Object.entries(this.fieldMappings).forEach(([key, canonicalField]) => {
      const [miniAppId] = key.split('.')

      if (!dependencies[miniAppId]) {
        dependencies[miniAppId] = new Set()
      }

      dependencies[miniAppId].add(canonicalField)
    })

    return dependencies
  }

  /**
   * Map a mini-app form field to canonical field
   * @param {string} miniAppId - Mini-app identifier
   * @param {string} fieldId - Local field ID in the mini-app
   * @returns {string|null} Canonical field name or null if not mapped
   */
  mapFieldToCanonical(miniAppId, fieldId) {
    const key = `${miniAppId}.${fieldId}`
    return this.fieldMappings[key] || null
  }

  /**
   * Get canonical field definition enriched with metadata
   * @param {string} canonicalFieldName - Name from CANONICAL_FIELDS
   * @returns {Object} Field definition with schema metadata
   */
  getCanonicalFieldDefinition(canonicalFieldName) {
    const schema = FIELD_SCHEMAS[canonicalFieldName]

    if (!schema) {
      return null
    }

    return {
      name: canonicalFieldName,
      type: schema.type,
      label: schema.label,
      description: schema.description,
      required: schema.required,
      inheritable: schema.inheritable,
      validation: schema.validation,
      ui: schema.ui
    }
  }

  /**
   * Consolidate a mini-app form by mapping its fields to canonical names
   * @param {string} miniAppId - Mini-app identifier
   * @param {Array} formFields - Array of form field definitions from the mini-app
   * @returns {Object} Consolidated form with canonical field mappings
   */
  consolidateFormFields(miniAppId, formFields) {
    const consolidatedFields = []
    const unmappedFields = []
    const mappedFieldIds = new Set()

    formFields.forEach((field) => {
      const canonicalName = this.mapFieldToCanonical(miniAppId, field.id)

      if (canonicalName) {
        const canonicalDef = this.getCanonicalFieldDefinition(canonicalName)

        if (canonicalDef) {
          consolidatedFields.push({
            // Keep original field info for reference
            originalId: field.id,
            originalType: field.type,

            // Map to canonical definition
            canonicalName,
            ...canonicalDef,

            // Merge with existing field overrides (placeholder, description, etc.)
            placeholder: field.placeholder || canonicalDef.ui?.placeholder,
            customValidation: field.validate // Preserve custom validators
          })

          mappedFieldIds.add(field.id)
        }
      }

      // Track unmapped fields
      if (!mappedFieldIds.has(field.id)) {
        unmappedFields.push(field.id)
      }
    })

    return {
      miniAppId,
      consolidatedFields,
      unmappedFields,
      consolidationRate: formFields.length > 0 ? (consolidatedFields.length / formFields.length) * 100 : 0,
      summary: {
        totalOriginalFields: formFields.length,
        consolidatedFields: consolidatedFields.length,
        unmappedFields: unmappedFields.length
      }
    }
  }

  /**
   * Get all canonical fields used by a specific mini-app
   * @param {string} miniAppId - Mini-app identifier
   * @returns {Array} Array of canonical field names used by this mini-app
   */
  getCanonicalFieldsForMiniApp(miniAppId) {
    const fields = this.miniAppFieldDependencies[miniAppId]
    return fields ? Array.from(fields) : []
  }

  /**
   * Get all mini-apps that use a specific canonical field
   * @param {string} canonicalFieldName - Canonical field name
   * @returns {Array} Array of mini-app IDs using this field
   */
  getMiniAppsUsingField(canonicalFieldName) {
    const miniApps = []

    Object.entries(this.miniAppFieldDependencies).forEach(([miniAppId, fields]) => {
      if (fields.has(canonicalFieldName)) {
        miniApps.push(miniAppId)
      }
    })

    return miniApps
  }

  /**
   * Get field consolidation impact analysis
   * @returns {Object} Impact analysis with statistics
   */
  getConsolidationImpactAnalysis() {
    const analysis = {
      totalMiniApps: Object.keys(this.miniAppFieldDependencies).length,
      totalCanonicalFields: Object.keys(FIELD_SCHEMAS).length,
      fieldUsageDistribution: {},
      mostUsedFields: [],
      fieldsByUsageCount: {}
    }

    // Count usage of each canonical field
    Object.entries(this.miniAppFieldDependencies).forEach(([miniAppId, fields]) => {
      Array.from(fields).forEach((field) => {
        analysis.fieldUsageDistribution[field] = (analysis.fieldUsageDistribution[field] || 0) + 1
        analysis.fieldsByUsageCount[field] = (analysis.fieldsByUsageCount[field] || 0) + 1
      })
    })

    // Sort by usage count
    analysis.mostUsedFields = Object.entries(analysis.fieldUsageDistribution)
      .sort((a, b) => b[1] - a[1])
      .map(([field, count]) => ({ field, miniAppsUsing: count }))

    return analysis
  }

  /**
   * Validate a mini-app form against canonical field schema
   * @param {string} miniAppId - Mini-app identifier
   * @param {Array} formFields - Form fields to validate
   * @returns {Object} Validation result with any issues
   */
  validateFormAgainstSchema(miniAppId, formFields) {
    const issues = {
      missingCanonicalMappings: [],
      typeMismatches: [],
      warnings: []
    }

    formFields.forEach((field) => {
      const canonicalName = this.mapFieldToCanonical(miniAppId, field.id)

      if (!canonicalName) {
        issues.missingCanonicalMappings.push({
          fieldId: field.id,
          fieldType: field.type,
          message: `Field "${field.id}" has no canonical mapping defined`
        })
      } else {
        const canonicalDef = this.getCanonicalFieldDefinition(canonicalName)

        if (canonicalDef && canonicalDef.type !== field.type) {
          issues.typeMismatches.push({
            fieldId: field.id,
            originalType: field.type,
            canonicalType: canonicalDef.type,
            message: `Type mismatch: "${field.id}" is ${field.type} but canonical is ${canonicalDef.type}`
          })
        }
      }
    })

    return {
      isValid: issues.missingCanonicalMappings.length === 0 && issues.typeMismatches.length === 0,
      issues,
      fieldCount: formFields.length,
      issueCount: Object.values(issues).reduce((sum, arr) => sum + arr.length, 0)
    }
  }

  /**
   * Generate consolidation report for all mini-apps
   * @returns {Object} Comprehensive consolidation report
   */
  generateConsolidationReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalFieldMappings: Object.keys(this.fieldMappings).length,
        uniqueMiniApps: Object.keys(this.miniAppFieldDependencies).length,
        uniqueCanonicalFields: new Set(Object.values(this.fieldMappings)).size
      },
      byMiniApp: {},
      byCanonicalField: {}
    }

    // Organize by mini-app
    Object.entries(this.miniAppFieldDependencies).forEach(([miniAppId, fields]) => {
      report.byMiniApp[miniAppId] = {
        canonicalFieldsUsed: Array.from(fields),
        fieldCount: fields.size
      }
    })

    // Organize by canonical field
    const fieldToMiniApps = {}
    Object.entries(this.fieldMappings).forEach(([key, canonicalField]) => {
      const [miniAppId] = key.split('.')

      if (!fieldToMiniApps[canonicalField]) {
        fieldToMiniApps[canonicalField] = []
      }

      fieldToMiniApps[canonicalField].push(miniAppId)
    })

    Object.entries(fieldToMiniApps).forEach(([field, miniApps]) => {
      report.byCanonicalField[field] = {
        usedBy: [...new Set(miniApps)],
        miniAppCount: new Set(miniApps).size
      }
    })

    return report
  }

  /**
   * Get recommendations for form consolidation
   * @returns {Array} Array of consolidation recommendations
   */
  getConsolidationRecommendations() {
    const analysis = this.getConsolidationImpactAnalysis()
    const recommendations = []

    // Find highly reused fields
    analysis.mostUsedFields.forEach(({ field, miniAppsUsing }) => {
      if (miniAppsUsing >= 3) {
        recommendations.push({
          type: 'high-reuse',
          field,
          miniAppsUsing,
          recommendation: `Field "${field}" is used by ${miniAppsUsing} mini-apps. Consider prioritizing this for unified UI/UX`,
          priority: miniAppsUsing >= 5 ? 'critical' : 'high'
        })
      }
    })

    // Find unmapped fields
    Object.keys(this.miniAppFieldDependencies).forEach((miniAppId) => {
      const unmapped = Object.entries(this.fieldMappings)
        .filter(([key]) => key.startsWith(`${miniAppId}.`))
        .filter(([, canonical]) => !canonical)

      if (unmapped.length > 0) {
        recommendations.push({
          type: 'unmapped-fields',
          miniAppId,
          unmappedCount: unmapped.length,
          recommendation: `${unmapped.length} field(s) in "${miniAppId}" have no canonical mapping. Consider adding mappings.`,
          priority: 'medium'
        })
      }
    })

    return recommendations.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
  }

  /**
   * Export consolidation mapping as JSON for API/config use
   * @returns {Object} Exportable consolidation mapping
   */
  exportConsolidationMapping() {
    return {
      version: '1.0',
      timestamp: new Date().toISOString(),
      fieldMappings: this.fieldMappings,
      miniAppDependencies: Object.fromEntries(
        Object.entries(this.miniAppFieldDependencies).map(([miniAppId, fields]) => [
          miniAppId,
          Array.from(fields)
        ])
      ),
      canonicalFieldDefinitions: Object.fromEntries(
        Object.entries(FIELD_SCHEMAS).map(([fieldName, schema]) => [
          fieldName,
          {
            type: schema.type,
            label: schema.label,
            required: schema.required,
            inheritable: schema.inheritable
          }
        ])
      )
    }
  }
}
