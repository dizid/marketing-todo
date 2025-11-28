/**
 * Data Integrity Service
 *
 * Validates ProjectContext field consolidation and detects data inconsistencies.
 * Ensures that the migration from scattered field names to canonical fields
 * is working correctly and that no data is being lost.
 *
 * Checks:
 * 1. Field Consolidation: Verifies canonical fields have values (not scattered)
 * 2. Backward Compatibility: Old field names are properly migrated
 * 3. Data Consistency: No conflicts between overridden and inherited values
 * 4. Completeness: All required fields are populated
 * 5. Validity: Field values meet constraints and are in valid format
 */

import { ProjectContextRepository } from './projectContextRepository.js'
import { fieldRegistry } from './fieldRegistry.js'

class DataIntegrityService {
  constructor() {
    this.repository = new ProjectContextRepository()
    this.registry = fieldRegistry
    this.validationRules = this._initializeValidationRules()
  }

  /**
   * Initialize field validation rules
   */
  _initializeValidationRules() {
    return {
      // String fields: Check length and content
      productName: {
        type: 'string',
        minLength: 1,
        maxLength: 200,
        nullable: false,
        pattern: null // Any string allowed
      },
      productDescription: {
        type: 'string',
        minLength: 1,
        maxLength: 5000,
        nullable: false
      },
      targetAudience: {
        type: 'string',
        minLength: 1,
        maxLength: 2000,
        nullable: false
      },
      primaryGoal: {
        type: 'string',
        minLength: 1,
        maxLength: 2000,
        nullable: true
      },
      targetTimeline: {
        type: 'string',
        minLength: 1,
        maxLength: 500,
        nullable: true
      },
      productType: {
        type: 'string',
        minLength: 1,
        maxLength: 200,
        nullable: true
      },
      marketingBudget: {
        type: 'string',
        nullable: true,
        pattern: /^[\d,]+(-[\d,]+)?|free|paid|enterprise/i // "5000", "5,000-10,000", "free", etc.
      },
      teamSize: {
        type: 'string',
        nullable: true,
        pattern: /^\d+(-\d+)?$/ // "1-5", "10", etc.
      },
      currentStage: {
        type: 'string',
        minLength: 1,
        maxLength: 200,
        nullable: true
      }
    }
  }

  /**
   * Run comprehensive integrity check on a project
   *
   * @returns {Object} Integrity report with checks, warnings, and errors
   */
  async verifyProjectIntegrity(projectId) {
    const report = {
      projectId,
      timestamp: new Date().toISOString(),
      status: 'ok',
      checks: {
        consolidation: null,
        completeness: null,
        consistency: null,
        validity: null,
        backwardCompatibility: null
      },
      issues: [],
      warnings: [],
      summary: null
    }

    try {
      // Run all checks
      report.checks.consolidation = await this._checkConsolidation(projectId)
      report.checks.completeness = await this._checkCompleteness(projectId)
      report.checks.consistency = await this._checkConsistency(projectId)
      report.checks.validity = await this._checkValidity(projectId)
      report.checks.backwardCompatibility = await this._checkBackwardCompatibility(projectId)

      // Collect issues and warnings
      for (const [checkName, result] of Object.entries(report.checks)) {
        if (result && result.issues) {
          report.issues.push(
            ...result.issues.map(issue => ({ check: checkName, ...issue }))
          )
        }
        if (result && result.warnings) {
          report.warnings.push(
            ...result.warnings.map(warning => ({ check: checkName, ...warning }))
          )
        }
      }

      // Set overall status
      if (report.issues.length > 0) {
        report.status = 'error'
      } else if (report.warnings.length > 0) {
        report.status = 'warning'
      }

      // Generate summary
      report.summary = this._generateSummary(report)
    } catch (error) {
      report.status = 'error'
      report.issues.push({
        severity: 'critical',
        message: `Failed to verify integrity: ${error.message}`,
        error: error.toString()
      })
    }

    return report
  }

  /**
   * Check 1: Field Consolidation
   * Verify that fields are consolidated into canonical form (not scattered)
   */
  async _checkConsolidation(projectId) {
    const result = {
      passed: true,
      issues: [],
      warnings: []
    }

    try {
      const context = await this.repository.getProjectContextForProject(projectId)
      if (!context) {
        result.issues.push({
          severity: 'error',
          field: 'ProjectContext',
          message: 'No ProjectContext found for project',
          impact: 'Cannot verify field consolidation'
        })
        result.passed = false
        return result
      }

      // Check that canonical fields are populated
      const canonicalFields = ['productName', 'targetAudience', 'productDescription']
      for (const fieldName of canonicalFields) {
        const value = context[fieldName]
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          result.issues.push({
            severity: 'warning',
            field: fieldName,
            message: `Canonical field is empty`,
            recommendation: 'Populate this field in project settings'
          })
          result.passed = false
        }
      }

      // Check that no duplicate sources for a field
      const sources = this.registry.getFieldsByCategory()
      for (const [category, fields] of Object.entries(sources)) {
        for (const field of fields) {
          const sourcesForField = this.registry.getSourcesFor(field.canonical)
          if (sourcesForField.length > 1) {
            // This is expected, but check that we're using canonical form
            const value = context[field.canonical]
            if (!value) {
              result.warnings.push({
                severity: 'warning',
                field: field.canonical,
                message: `Field has ${sourcesForField.length} source names but is not populated`,
                sources: sourcesForField.map(s => s.source).join(', ')
              })
            }
          }
        }
      }
    } catch (error) {
      result.issues.push({
        severity: 'error',
        message: `Consolidation check failed: ${error.message}`
      })
      result.passed = false
    }

    return result
  }

  /**
   * Check 2: Completeness
   * Verify all required fields are populated
   */
  async _checkCompleteness(projectId) {
    const result = {
      passed: true,
      issues: [],
      warnings: []
    }

    try {
      const context = await this.repository.getProjectContextForProject(projectId)
      if (!context) {
        result.issues.push({
          severity: 'error',
          message: 'No ProjectContext found'
        })
        result.passed = false
        return result
      }

      // Required fields for a valid project
      const requiredFields = ['productName', 'targetAudience']
      const missingFields = []

      for (const fieldName of requiredFields) {
        const value = context[fieldName]
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          missingFields.push(fieldName)
        }
      }

      if (missingFields.length > 0) {
        result.issues.push({
          severity: 'error',
          message: `Missing required fields: ${missingFields.join(', ')}`,
          fields: missingFields
        })
        result.passed = false
      }

      // Check optional fields
      const optionalFields = ['primaryGoal', 'targetTimeline', 'marketingBudget', 'teamSize']
      const missingOptional = optionalFields.filter(
        f => !context[f] || (typeof context[f] === 'string' && context[f].trim() === '')
      )

      if (missingOptional.length >= 2) {
        result.warnings.push({
          severity: 'info',
          message: `${missingOptional.length} optional fields are empty`,
          fields: missingOptional,
          recommendation: 'Consider filling in these fields for better targeting'
        })
      }
    } catch (error) {
      result.issues.push({
        severity: 'error',
        message: `Completeness check failed: ${error.message}`
      })
      result.passed = false
    }

    return result
  }

  /**
   * Check 3: Data Consistency
   * Verify no conflicts between task overrides and inherited values
   */
  async _checkConsistency(projectId) {
    const result = {
      passed: true,
      issues: [],
      warnings: []
    }

    try {
      // Get all tasks for this project
      const tasks = await this.repository.getProjectTasks(projectId)
      if (!tasks || tasks.length === 0) {
        result.warnings.push({
          severity: 'info',
          message: 'No tasks found for this project'
        })
        return result
      }

      // Check each task for override consistency
      for (const task of tasks) {
        const overrides = await this.repository.getTaskFieldOverrides(projectId, task.id)
        if (!overrides) continue

        // Verify override values are valid
        for (const [fieldName, overrideValue] of Object.entries(overrides)) {
          const rule = this.validationRules[fieldName]
          if (rule) {
            const validation = this._validateFieldValue(fieldName, overrideValue, rule)
            if (!validation.valid) {
              result.issues.push({
                severity: 'error',
                task: task.id,
                field: fieldName,
                message: `Invalid override value: ${validation.error}`,
                value: overrideValue
              })
              result.passed = false
            }
          }
        }
      }
    } catch (error) {
      result.issues.push({
        severity: 'error',
        message: `Consistency check failed: ${error.message}`
      })
      result.passed = false
    }

    return result
  }

  /**
   * Check 4: Field Validity
   * Verify all field values meet constraints
   */
  async _checkValidity(projectId) {
    const result = {
      passed: true,
      issues: [],
      warnings: []
    }

    try {
      const context = await this.repository.getProjectContextForProject(projectId)
      if (!context) {
        result.issues.push({
          severity: 'error',
          message: 'No ProjectContext found'
        })
        result.passed = false
        return result
      }

      // Validate each field
      for (const [fieldName, rule] of Object.entries(this.validationRules)) {
        const value = context[fieldName]

        if (!value) {
          if (!rule.nullable) {
            result.issues.push({
              severity: 'warning',
              field: fieldName,
              message: `Required field is empty`
            })
          }
          continue
        }

        const validation = this._validateFieldValue(fieldName, value, rule)
        if (!validation.valid) {
          result.issues.push({
            severity: 'warning',
            field: fieldName,
            message: validation.error,
            value: value
          })
          result.passed = false
        }
      }
    } catch (error) {
      result.issues.push({
        severity: 'error',
        message: `Validity check failed: ${error.message}`
      })
      result.passed = false
    }

    return result
  }

  /**
   * Check 5: Backward Compatibility
   * Verify old field names are properly migrated to canonical fields
   */
  async _checkBackwardCompatibility(projectId) {
    const result = {
      passed: true,
      issues: [],
      warnings: []
    }

    try {
      const context = await this.repository.getProjectContextForProject(projectId)
      if (!context) {
        result.issues.push({
          severity: 'error',
          message: 'No ProjectContext found'
        })
        result.passed = false
        return result
      }

      // Check that we're not storing data under old field names
      const oldFieldPatterns = [
        'audience', 'targetMarket', 'target_audience',
        'product', 'app', 'description', 'product_description',
        'goal', 'goals', 'objective', 'primary_goal',
        'timeline', 'timeframe', 'deadline', 'target_timeline'
      ]

      const storedFields = Object.keys(context)
      const foundOldFields = storedFields.filter(f =>
        oldFieldPatterns.some(pattern =>
          f.toLowerCase().includes(pattern.toLowerCase())
        )
      )

      if (foundOldFields.length > 0) {
        result.warnings.push({
          severity: 'warning',
          message: `Found fields using old naming conventions: ${foundOldFields.join(', ')}`,
          recommendation: 'These should be migrated to canonical field names'
        })
      }

      // Check migration status
      const canonicalFields = ['productName', 'targetAudience', 'productDescription']
      const migrationStatus = {}
      for (const canonical of canonicalFields) {
        migrationStatus[canonical] = context[canonical] ? 'migrated' : 'pending'
      }

      if (Object.values(migrationStatus).some(status => status === 'pending')) {
        result.warnings.push({
          severity: 'info',
          message: 'Some fields have not been migrated yet',
          migrationStatus
        })
      }
    } catch (error) {
      result.issues.push({
        severity: 'error',
        message: `Backward compatibility check failed: ${error.message}`
      })
      result.passed = false
    }

    return result
  }

  /**
   * Validate a single field value against its rule
   */
  _validateFieldValue(fieldName, value, rule) {
    // Check type
    if (rule.type === 'string' && typeof value !== 'string') {
      return { valid: false, error: `Expected string, got ${typeof value}` }
    }

    // Check nullable
    if (value === null || value === undefined) {
      if (!rule.nullable) {
        return { valid: false, error: 'Value is null but field is not nullable' }
      }
      return { valid: true }
    }

    // Check string length
    if (typeof value === 'string') {
      if (rule.minLength && value.length < rule.minLength) {
        return { valid: false, error: `String too short (min ${rule.minLength})` }
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        return { valid: false, error: `String too long (max ${rule.maxLength})` }
      }
    }

    // Check pattern
    if (rule.pattern && typeof value === 'string') {
      if (!rule.pattern.test(value)) {
        return { valid: false, error: `Value does not match pattern: ${rule.pattern}` }
      }
    }

    return { valid: true }
  }

  /**
   * Generate human-readable summary of integrity report
   */
  _generateSummary(report) {
    const criticalCount = report.issues.filter(i => i.severity === 'critical').length
    const errorCount = report.issues.filter(i => i.severity === 'error').length
    const warningCount = report.issues.filter(i => i.severity === 'warning').length

    let summary = ''
    if (criticalCount > 0) {
      summary += `${criticalCount} critical issue${criticalCount !== 1 ? 's' : ''} found. `
    }
    if (errorCount > 0) {
      summary += `${errorCount} error${errorCount !== 1 ? 's' : ''} found. `
    }
    if (warningCount > 0) {
      summary += `${warningCount} warning${warningCount !== 1 ? 's' : ''} found. `
    }
    if (report.issues.length === 0 && report.warnings.length === 0) {
      summary = 'All checks passed. Data integrity verified.'
    }

    return summary.trim()
  }

  /**
   * Generate a detailed repair plan for identified issues
   */
  generateRepairPlan(integrityReport) {
    const plan = {
      issues: integrityReport.issues,
      actions: [],
      estimatedTime: null
    }

    for (const issue of integrityReport.issues) {
      if (issue.severity === 'error' && issue.field) {
        // Field is empty or invalid
        plan.actions.push({
          type: 'populate_field',
          field: issue.field,
          priority: 'high',
          description: `Set value for ${issue.field}`
        })
      }

      if (issue.severity === 'error' && issue.task && issue.field) {
        // Task override is invalid
        plan.actions.push({
          type: 'review_override',
          project: issue.projectId,
          task: issue.task,
          field: issue.field,
          priority: 'high',
          description: `Review and fix invalid override for ${issue.field} in task ${issue.task}`
        })
      }
    }

    // Estimate time based on action count
    const complexTime = plan.actions.length * 2 // 2 minutes per action
    plan.estimatedTime = `${complexTime} minutes`

    return plan
  }
}

// Export singleton instance
export const dataIntegrityService = new DataIntegrityService()

// Export class for testing/extension
export { DataIntegrityService }
