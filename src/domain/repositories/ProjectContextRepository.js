/**
 * ProjectContextRepository
 *
 * Data access layer for ProjectContext entities.
 * Handles all Supabase operations for project contexts.
 * Provides fallback behavior for missing contexts (backward compatibility).
 *
 * Depends on: Supabase client, Logger
 * Independent of: Pinia, Vue, Components
 */

import { NotFoundError, DatabaseError, wrapError, logger as defaultLogger } from '@/shared/utils'
import { ProjectContext } from '@/domain/models'
import { SUPABASE_CONFIG } from '@/shared/config'

export class ProjectContextRepository {
  constructor(supabaseClient, logger = defaultLogger) {
    this.supabase = supabaseClient
    this.logger = logger.child('ProjectContextRepository')
  }

  /**
   * Get context by project ID
   * @param {string} projectId - Project UUID
   * @returns {ProjectContext|null} ProjectContext instance or null if not found
   */
  async getByProjectId(projectId) {
    try {
      this.logger.debug('Fetching context by projectId', { projectId })

      const { data, error } = await this.supabase
        .from(SUPABASE_CONFIG.TABLES.PROJECT_CONTEXTS)
        .select('*')
        .eq('project_id', projectId)
        .single()

      if (error) {
        // PGRST116 = not found, which is expected for contexts that haven't been created yet
        if (error.code === 'PGRST116') {
          this.logger.debug('Context not found (expected)', { projectId })
          return null
        }
        throw error
      }

      if (!data) return null

      return ProjectContext.fromJSON(data)
    } catch (error) {
      if (error instanceof NotFoundError) return null
      const wrappedError = wrapError(error, DatabaseError, { projectId })
      this.logger.logError(wrappedError)
      throw wrappedError
    }
  }

  /**
   * Get all contexts for a user
   * @param {string} userId - User UUID
   * @returns {ProjectContext[]} Array of ProjectContext instances
   */
  async getAllForUser(userId) {
    try {
      this.logger.debug('Fetching all contexts for user', { userId })

      const { data, error } = await this.supabase
        .from(SUPABASE_CONFIG.TABLES.PROJECT_CONTEXTS)
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })

      if (error) throw error

      return (data || []).map(item => ProjectContext.fromJSON(item))
    } catch (error) {
      const wrappedError = wrapError(error, DatabaseError, { userId })
      this.logger.logError(wrappedError)
      throw wrappedError
    }
  }

  /**
   * Get context by ID
   * @param {string} contextId - Context UUID
   * @returns {ProjectContext} ProjectContext instance
   * @throws {NotFoundError} If context not found
   */
  async getById(contextId) {
    try {
      this.logger.debug('Fetching context by id', { contextId })

      const { data, error } = await this.supabase
        .from(SUPABASE_CONFIG.TABLES.PROJECT_CONTEXTS)
        .select('*')
        .eq('id', contextId)
        .single()

      if (error) throw error
      if (!data) throw new NotFoundError('ProjectContext', contextId)

      return ProjectContext.fromJSON(data)
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      const wrappedError = wrapError(error, DatabaseError, { contextId })
      this.logger.logError(wrappedError)
      throw wrappedError
    }
  }

  /**
   * Create new context (usually from onboarding)
   * @param {string} projectId - Project UUID
   * @param {string} userId - User UUID
   * @param {Object} contextData - Context data object
   * @returns {ProjectContext} Created ProjectContext instance
   */
  async create(projectId, userId, contextData = {}) {
    try {
      this.logger.debug('Creating context', { projectId, userId })

      const context = ProjectContext.fromOnboarding(projectId, userId, contextData)
      const json = context.toJSON()

      const { data, error } = await this.supabase
        .from(SUPABASE_CONFIG.TABLES.PROJECT_CONTEXTS)
        .insert([json])
        .select()
        .single()

      if (error) throw error

      this.logger.info('Context created', { contextId: context.id, projectId })
      return ProjectContext.fromJSON(data)
    } catch (error) {
      const wrappedError = wrapError(error, DatabaseError, { projectId, userId })
      this.logger.logError(wrappedError)
      throw wrappedError
    }
  }

  /**
   * Update context with new field values
   * @param {string} projectId - Project UUID
   * @param {Object} updates - Object with fields to update
   * @returns {ProjectContext} Updated ProjectContext instance
   * @throws {NotFoundError} If context not found
   */
  async update(projectId, updates) {
    try {
      this.logger.debug('Updating context', { projectId, updates })

      // First get existing context to ensure it exists
      const context = await this.getByProjectId(projectId)
      if (!context) {
        throw new NotFoundError('ProjectContext', `project_id:${projectId}`)
      }

      const now = new Date().toISOString()
      const payload = {
        ...updates,
        updated_at: now
      }

      const { data, error } = await this.supabase
        .from(SUPABASE_CONFIG.TABLES.PROJECT_CONTEXTS)
        .update(payload)
        .eq('project_id', projectId)
        .select()
        .single()

      if (error) throw error
      if (!data) throw new NotFoundError('ProjectContext', `project_id:${projectId}`)

      this.logger.info('Context updated', { projectId, fields: Object.keys(updates) })
      return ProjectContext.fromJSON(data)
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      const wrappedError = wrapError(error, DatabaseError, { projectId, updates })
      this.logger.logError(wrappedError)
      throw wrappedError
    }
  }

  /**
   * Update a single field
   * @param {string} projectId - Project UUID
   * @param {string} fieldName - Name of field to update
   * @param {*} value - New value for field
   * @returns {ProjectContext} Updated ProjectContext instance
   */
  async updateField(projectId, fieldName, value) {
    return this.update(projectId, { [fieldName]: value })
  }

  /**
   * Upsert context (create if missing, update if exists)
   * @param {string} projectId - Project UUID
   * @param {string} userId - User UUID
   * @param {Object} contextData - Context data
   * @returns {ProjectContext} Upserted ProjectContext instance
   */
  async upsert(projectId, userId, contextData = {}) {
    try {
      this.logger.debug('Upserting context', { projectId, userId })

      // Check if context exists
      const existing = await this.getByProjectId(projectId)

      if (existing) {
        // Update existing
        return this.update(projectId, contextData)
      } else {
        // Create new
        return this.create(projectId, userId, contextData)
      }
    } catch (error) {
      const wrappedError = wrapError(error, DatabaseError, { projectId, userId })
      this.logger.logError(wrappedError)
      throw wrappedError
    }
  }

  /**
   * Delete context (soft delete recommended, but hard delete for safety)
   * @param {string} projectId - Project UUID
   * @returns {boolean} True if deleted
   */
  async delete(projectId) {
    try {
      this.logger.debug('Deleting context', { projectId })

      const { error } = await this.supabase
        .from(SUPABASE_CONFIG.TABLES.PROJECT_CONTEXTS)
        .delete()
        .eq('project_id', projectId)

      if (error) throw error

      this.logger.info('Context deleted', { projectId })
      return true
    } catch (error) {
      const wrappedError = wrapError(error, DatabaseError, { projectId })
      this.logger.logError(wrappedError)
      throw wrappedError
    }
  }

  /**
   * Check if context exists for project
   * @param {string} projectId - Project UUID
   * @returns {boolean} True if context exists
   */
  async exists(projectId) {
    try {
      const context = await this.getByProjectId(projectId)
      return context !== null
    } catch (error) {
      // Log but don't throw - just return false
      this.logger.debug('Error checking context existence', { projectId, error: error.message })
      return false
    }
  }

  /**
   * Count contexts for a user
   * @param {string} userId - User UUID
   * @returns {number} Count of contexts
   */
  async countForUser(userId) {
    try {
      this.logger.debug('Counting contexts for user', { userId })

      const { count, error } = await this.supabase
        .from(SUPABASE_CONFIG.TABLES.PROJECT_CONTEXTS)
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)

      if (error) throw error

      return count || 0
    } catch (error) {
      const wrappedError = wrapError(error, DatabaseError, { userId })
      this.logger.logError(wrappedError)
      throw wrappedError
    }
  }

  /**
   * Validate context data before save
   * @param {Object} data - Data to validate
   * @returns {Object} Validation result { isValid: boolean, errors: string[] }
   */
  validate(data) {
    const errors = []

    // Validate required UUID fields if present
    if (data.projectId && !this._isValidUUID(data.projectId)) {
      errors.push('Invalid projectId: must be valid UUID')
    }

    if (data.userId && !this._isValidUUID(data.userId)) {
      errors.push('Invalid userId: must be valid UUID')
    }

    // Validate field types
    if (data.marketingBudget !== undefined && data.marketingBudget !== null) {
      if (typeof data.marketingBudget !== 'number' || data.marketingBudget < 0) {
        errors.push('Invalid marketingBudget: must be positive number or null')
      }
    }

    // Validate select fields have valid values
    const validProductTypes = ['mobile_app', 'saas', 'ecommerce', 'game', 'digital_product', 'other']
    if (data.productType && !validProductTypes.includes(data.productType)) {
      errors.push(`Invalid productType: must be one of ${validProductTypes.join(', ')}`)
    }

    const validGoals = ['first_100', '1k_mrr', '10k_mrr', 'audience', 'validate']
    if (data.primaryGoal && !validGoals.includes(data.primaryGoal)) {
      errors.push(`Invalid primaryGoal: must be one of ${validGoals.join(', ')}`)
    }

    const validTimelines = ['1_month', '3_months', '6_months', 'no_timeline']
    if (data.targetTimeline && !validTimelines.includes(data.targetTimeline)) {
      errors.push(`Invalid targetTimeline: must be one of ${validTimelines.join(', ')}`)
    }

    const validTeamSizes = ['solo', '2-5', '6-10', '10+']
    if (data.teamSize && !validTeamSizes.includes(data.teamSize)) {
      errors.push(`Invalid teamSize: must be one of ${validTeamSizes.join(', ')}`)
    }

    const validStages = ['idea', 'building', 'beta', 'launched']
    if (data.currentStage && !validStages.includes(data.currentStage)) {
      errors.push(`Invalid currentStage: must be one of ${validStages.join(', ')}`)
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Check if string is valid UUID
   * @private
   */
  _isValidUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    return uuidRegex.test(uuid)
  }
}
