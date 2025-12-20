/**
 * Onboarding Migration Service
 *
 * Converts onboarding wizard data to ProjectContext format.
 * Handles data transformation, validation, and migration tracking.
 *
 * Features:
 * 1. Convert wizard data to ProjectContext fields
 * 2. Field mapping from wizard structure to canonical names
 * 3. Validation during migration
 * 4. Backward compatibility with existing onboarding table
 * 5. Migration status tracking
 * 6. Error handling and rollback support
 *
 * Onboarding Data Mapping:
 * - Step 1 (Product): productName, productType, productDescription
 * - Step 2 (Audience): targetAudience
 * - Step 3 (Goals): primaryGoal, targetTimeline
 * - Step 4 (Team): marketingBudget, teamSize, currentStage, techStack
 */

import { ProjectContextRepository } from '@/domain/repositories/index.js'
import { FieldValidationService } from '@/shared/services/fieldValidationService.js'
import { CANONICAL_FIELDS } from '@/shared/registry/fieldRegistry.js'

export class OnboardingMigrationService {
  constructor(logger = null) {
    this.logger = logger
    this.repository = new ProjectContextRepository(logger)
    this.validationService = new FieldValidationService(logger)
  }

  /**
   * Migrate onboarding wizard data to ProjectContext
   * @param {string} projectId - Project ID
   * @param {string} userId - User ID
   * @param {Object} wizardData - Onboarding wizard data
   * @returns {Object} Migration result { success, contextId?, errors: [] }
   */
  async migrateOnboarding(projectId, userId, wizardData) {
    const errors = []
    const warnings = []

    if (!projectId || !userId || !wizardData) {
      return {
        success: false,
        errors: ['Missing required parameters: projectId, userId, or wizardData']
      }
    }

    try {
      // Transform wizard data to context format
      const contextData = this.transformWizardToContext(wizardData, errors)

      if (errors.length > 0) {
        return {
          success: false,
          errors,
          warnings
        }
      }

      // Validate transformed data
      const validation = this.validationService.validateContext(contextData)
      if (!validation.isValid) {
        return {
          success: false,
          errors: validation.errors,
          warnings: validation.warnings
        }
      }

      // Merge warnings
      warnings.push(...(validation.warnings || []))

      // Create or update ProjectContext
      const context = await this.repository.upsert(projectId, userId, contextData)

      if (this.logger) {
        this.logger.info(`[OnboardingMigration] Successfully migrated onboarding for project: ${projectId}`)
      }

      return {
        success: true,
        contextId: context.id,
        warnings
      }
    } catch (err) {
      errors.push(`Migration error: ${err.message}`)

      if (this.logger) {
        this.logger.error(`[OnboardingMigration] Migration failed: ${err.message}`, err)
      }

      return {
        success: false,
        errors,
        warnings
      }
    }
  }

  /**
   * Transform onboarding wizard data to ProjectContext format
   * @param {Object} wizardData - Wizard data from store
   * @param {Array} errors - Error accumulator
   * @returns {Object} Transformed context data
   */
  transformWizardToContext(wizardData, errors = []) {
    const contextData = {}

    // Step 1: Product Information
    if (wizardData.productName) {
      contextData[CANONICAL_FIELDS.PRODUCT_NAME] = wizardData.productName
    }

    if (wizardData.productType) {
      const mappedType = this.mapProductType(wizardData.productType)
      if (mappedType) {
        contextData[CANONICAL_FIELDS.PRODUCT_TYPE] = mappedType
      } else {
        errors.push(`Unknown product type: ${wizardData.productType}`)
      }
    }

    if (wizardData.productDescription) {
      contextData[CANONICAL_FIELDS.PRODUCT_DESCRIPTION] = wizardData.productDescription
    }

    // Step 2: Target Audience
    if (wizardData.targetAudience) {
      contextData[CANONICAL_FIELDS.TARGET_AUDIENCE] = wizardData.targetAudience
    }

    // Step 3: Goals and Timeline
    if (wizardData.mainGoal) {
      const mappedGoal = this.mapPrimaryGoal(wizardData.mainGoal)
      if (mappedGoal) {
        contextData[CANONICAL_FIELDS.PRIMARY_GOAL] = mappedGoal
      } else {
        errors.push(`Unknown goal: ${wizardData.mainGoal}`)
      }
    }

    if (wizardData.timeline) {
      const mappedTimeline = this.mapTargetTimeline(wizardData.timeline)
      if (mappedTimeline) {
        contextData[CANONICAL_FIELDS.TARGET_TIMELINE] = mappedTimeline
      } else {
        errors.push(`Unknown timeline: ${wizardData.timeline}`)
      }
    }

    // Step 4: Optional Details
    if (wizardData.budget !== null && wizardData.budget !== undefined) {
      contextData[CANONICAL_FIELDS.MARKETING_BUDGET] = Number(wizardData.budget)
    }

    if (wizardData.teamSize) {
      const mappedTeamSize = this.mapTeamSize(wizardData.teamSize)
      if (mappedTeamSize) {
        contextData[CANONICAL_FIELDS.TEAM_SIZE] = mappedTeamSize
      } else {
        errors.push(`Unknown team size: ${wizardData.teamSize}`)
      }
    }

    if (wizardData.currentStage) {
      const mappedStage = this.mapCurrentStage(wizardData.currentStage)
      if (mappedStage) {
        contextData[CANONICAL_FIELDS.CURRENT_STAGE] = mappedStage
      } else {
        errors.push(`Unknown stage: ${wizardData.currentStage}`)
      }
    }

    if (wizardData.techStack && Array.isArray(wizardData.techStack) && wizardData.techStack.length > 0) {
      contextData[CANONICAL_FIELDS.TECH_STACK] = {
        tools: wizardData.techStack
      }
    }

    return contextData
  }

  /**
   * Map wizard product type to canonical type
   */
  mapProductType(wizardType) {
    const mapping = {
      'mobile-app': 'mobile_app',
      mobile_app: 'mobile_app',
      mobileapp: 'mobile_app',
      saas: 'saas',
      ecommerce: 'ecommerce',
      'e-commerce': 'ecommerce',
      game: 'game',
      'digital-product': 'digital_product',
      digital_product: 'digital_product',
      digitalproduct: 'digital_product',
      other: 'other'
    }

    return mapping[wizardType?.toLowerCase()?.trim()] || null
  }

  /**
   * Map wizard goal to canonical goal
   */
  mapPrimaryGoal(wizardGoal) {
    const mapping = {
      'first-100': 'first_100',
      first_100: 'first_100',
      '100-users': 'first_100',
      '1k-mrr': '1k_mrr',
      '1k_mrr': '1k_mrr',
      '$1k': '1k_mrr',
      '10k-mrr': '10k_mrr',
      '10k_mrr': '10k_mrr',
      '$10k': '10k_mrr',
      audience: 'audience',
      'build-audience': 'audience',
      community: 'audience',
      validate: 'validate',
      'product-market-fit': 'validate',
      'pmf': 'validate'
    }

    return mapping[wizardGoal?.toLowerCase()?.trim()?.replace(/\s+/g, '-')] || null
  }

  /**
   * Map wizard timeline to canonical timeline
   */
  mapTargetTimeline(wizardTimeline) {
    const mapping = {
      '1-month': '1_month',
      '1_month': '1_month',
      'month': '1_month',
      '3-months': '3_months',
      '3_months': '3_months',
      'quarter': '3_months',
      '6-months': '6_months',
      '6_months': '6_months',
      'half-year': '6_months',
      'none': 'no_timeline',
      'no-timeline': 'no_timeline',
      'no_timeline': 'no_timeline',
      'open-ended': 'no_timeline',
      'undefined': 'no_timeline'
    }

    return mapping[wizardTimeline?.toLowerCase()?.trim()?.replace(/\s+/g, '-')] || null
  }

  /**
   * Map wizard team size to canonical team size
   */
  mapTeamSize(wizardSize) {
    const mapping = {
      solo: 'solo',
      'just-me': 'solo',
      'me': 'solo',
      '1': 'solo',
      '2-5': '2-5',
      '2_5': '2-5',
      '2-5-people': '2-5',
      'small': '2-5',
      '6-10': '6-10',
      '6_10': '6-10',
      'medium': '6-10',
      '10+': '10+',
      '10_plus': '10+',
      'large': '10+'
    }

    return mapping[wizardSize?.toLowerCase()?.trim()?.replace(/\s+/g, '-')] || null
  }

  /**
   * Map wizard stage to canonical stage
   */
  mapCurrentStage(wizardStage) {
    const mapping = {
      idea: 'idea',
      'planning': 'idea',
      'pre-launch': 'idea',
      building: 'building',
      'development': 'building',
      'in-progress': 'building',
      beta: 'beta',
      'limited-release': 'beta',
      'early-access': 'beta',
      launched: 'launched',
      'live': 'launched',
      'production': 'launched'
    }

    return mapping[wizardStage?.toLowerCase()?.trim()?.replace(/\s+/g, '-')] || null
  }

  /**
   * Validate onboarding data completeness
   * @param {Object} wizardData - Wizard data to validate
   * @returns {Object} { isComplete, missingFields: [], completionPercentage }
   */
  validateCompleteness(wizardData) {
    const requiredFields = [
      'productName',
      'productType',
      'targetAudience'
    ]

    const optionalFields = [
      'productDescription',
      'mainGoal',
      'timeline',
      'budget',
      'teamSize',
      'currentStage'
    ]

    const missingFields = requiredFields.filter((field) => !wizardData[field])
    const filledOptional = optionalFields.filter((field) => wizardData[field]).length

    const completionPercentage = Math.round(
      ((requiredFields.length - missingFields.length + filledOptional) /
        (requiredFields.length + optionalFields.length)) *
        100
    )

    return {
      isComplete: missingFields.length === 0,
      missingFields,
      completionPercentage,
      completedFields: requiredFields.length - missingFields.length,
      totalRequiredFields: requiredFields.length
    }
  }

  /**
   * Get migration status for a project
   * @param {string} projectId - Project ID
   * @returns {Object} Migration status information
   */
  async getMigrationStatus(projectId) {
    try {
      const context = await this.repository.getByProjectId(projectId)

      if (!context) {
        return {
          migrated: false,
          projectId,
          reason: 'No ProjectContext found'
        }
      }

      const filledFields = Object.keys(context)
        .filter((k) => !k.startsWith('_') && context[k] !== null && context[k] !== undefined)
        .length

      return {
        migrated: true,
        projectId,
        contextId: context.id,
        fieldsFilled: filledFields,
        createdAt: context.createdAt,
        updatedAt: context.updatedAt
      }
    } catch (err) {
      if (this.logger) {
        this.logger.error(`[OnboardingMigration] Error checking migration status: ${err.message}`)
      }

      return {
        migrated: false,
        projectId,
        error: err.message
      }
    }
  }

  /**
   * Batch migrate multiple projects
   * @param {Array} migrations - Array of { projectId, userId, wizardData }
   * @returns {Object} Batch migration result
   */
  async migrateBatch(migrations) {
    const results = {
      succeeded: [],
      failed: [],
      warnings: []
    }

    for (const migration of migrations) {
      const result = await this.migrateOnboarding(migration.projectId, migration.userId, migration.wizardData)

      if (result.success) {
        results.succeeded.push({
          projectId: migration.projectId,
          contextId: result.contextId
        })
      } else {
        results.failed.push({
          projectId: migration.projectId,
          errors: result.errors
        })
      }

      if (result.warnings && result.warnings.length > 0) {
        results.warnings.push({
          projectId: migration.projectId,
          warnings: result.warnings
        })
      }
    }

    if (this.logger) {
      this.logger.info(
        `[OnboardingMigration] Batch migration complete: ${results.succeeded.length} succeeded, ${results.failed.length} failed`
      )
    }

    return results
  }

  /**
   * Get transformation preview without saving
   * @param {Object} wizardData - Wizard data
   * @returns {Object} Preview of what would be migrated
   */
  getTransformationPreview(wizardData) {
    const errors = []
    const transformed = this.transformWizardToContext(wizardData, errors)
    const validation = this.validationService.validateContext(transformed)

    return {
      original: wizardData,
      transformed,
      validation: {
        isValid: validation.isValid,
        errors: validation.errors,
        warnings: validation.warnings
      },
      transformationErrors: errors,
      completeness: this.validateCompleteness(wizardData)
    }
  }
}
