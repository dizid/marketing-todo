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

      return ProjectContext.fromJSON(this._fromDbPayload(data))
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

      return (data || []).map(item => ProjectContext.fromJSON(this._fromDbPayload(item)))
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

      return ProjectContext.fromJSON(this._fromDbPayload(data))
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

      // Convert to database format (snake_case, no internal fields)
      const payload = this._toDbPayload(context.toJSON())

      const { data, error } = await this.supabase
        .from(SUPABASE_CONFIG.TABLES.PROJECT_CONTEXTS)
        .insert([payload])
        .select()
        .single()

      if (error) throw error

      this.logger.info('Context created', { contextId: context.id, projectId })
      return ProjectContext.fromJSON(this._fromDbPayload(data))
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

      // Convert updates to database format (snake_case, no internal fields)
      const payload = this._toDbPayload({
        ...updates,
        updatedAt: now
      })

      const { data, error } = await this.supabase
        .from(SUPABASE_CONFIG.TABLES.PROJECT_CONTEXTS)
        .update(payload)
        .eq('project_id', projectId)
        .select()
        .single()

      if (error) throw error
      if (!data) throw new NotFoundError('ProjectContext', `project_id:${projectId}`)

      this.logger.info('Context updated', { projectId, fields: Object.keys(updates) })
      return ProjectContext.fromJSON(this._fromDbPayload(data))
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

  // ============================================================================
  // Task-Level Field Override Methods (Phase 6)
  // ============================================================================

  /**
   * Get all field overrides for a task
   * @param {string} projectId - Project UUID
   * @param {string} taskId - Task UUID
   * @returns {Object} Map of field names to override values
   */
  async getTaskFieldOverrides(projectId, taskId) {
    try {
      this.logger.debug('Fetching task field overrides', { projectId, taskId })

      const { data, error } = await this.supabase
        .from('task_field_overrides')
        .select('field_name, field_value, field_type, source')
        .eq('project_id', projectId)
        .eq('task_id', taskId)

      if (error) throw error

      // Convert array of overrides to map: { field_name: value }
      const overrides = {}
      if (data) {
        data.forEach((override) => {
          overrides[override.field_name] = override.field_value
        })
      }

      return overrides
    } catch (error) {
      const wrappedError = wrapError(error, DatabaseError, { projectId, taskId })
      this.logger.logError(wrappedError)
      throw wrappedError
    }
  }

  /**
   * Get a specific field override for a task
   * @param {string} projectId - Project UUID
   * @param {string} taskId - Task UUID
   * @param {string} fieldName - Canonical field name
   * @returns {*|null} Override value or null if not overridden
   */
  async getTaskFieldOverride(projectId, taskId, fieldName) {
    try {
      this.logger.debug('Fetching task field override', { projectId, taskId, fieldName })

      const { data, error } = await this.supabase
        .from('task_field_overrides')
        .select('field_value')
        .eq('project_id', projectId)
        .eq('task_id', taskId)
        .eq('field_name', fieldName)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      if (!data) return null

      return data.field_value
    } catch (error) {
      const wrappedError = wrapError(error, DatabaseError, { projectId, taskId, fieldName })
      this.logger.logError(wrappedError)
      throw wrappedError
    }
  }

  /**
   * Set a field override for a task
   * @param {string} projectId - Project UUID
   * @param {string} taskId - Task UUID
   * @param {string} userId - User UUID
   * @param {string} fieldName - Canonical field name
   * @param {*} value - Field value
   * @param {string} fieldType - Field type hint (optional)
   * @param {string} source - Override source (optional, default: 'ui')
   * @returns {Object} Inserted/updated override record
   */
  async setTaskFieldOverride(projectId, taskId, userId, fieldName, value, fieldType = null, source = 'ui') {
    try {
      this.logger.debug('Setting task field override', { projectId, taskId, fieldName, source })

      const { data, error } = await this.supabase
        .from('task_field_overrides')
        .upsert(
          {
            project_id: projectId,
            task_id: taskId,
            user_id: userId,
            field_name: fieldName,
            field_value: value,
            field_type: fieldType,
            source: source,
            overridden_at: new Date().toISOString()
          },
          { onConflict: 'project_id,task_id,field_name' }
        )
        .select()
        .single()

      if (error) throw error

      this.logger.info('Task field override set', { projectId, taskId, fieldName })
      return data
    } catch (error) {
      const wrappedError = wrapError(error, DatabaseError, { projectId, taskId, fieldName })
      this.logger.logError(wrappedError)
      throw wrappedError
    }
  }

  /**
   * Clear a field override for a task (revert to inherited value)
   * @param {string} projectId - Project UUID
   * @param {string} taskId - Task UUID
   * @param {string} fieldName - Canonical field name
   * @returns {boolean} True if override was deleted
   */
  async clearTaskFieldOverride(projectId, taskId, fieldName) {
    try {
      this.logger.debug('Clearing task field override', { projectId, taskId, fieldName })

      const { error } = await this.supabase
        .from('task_field_overrides')
        .delete()
        .eq('project_id', projectId)
        .eq('task_id', taskId)
        .eq('field_name', fieldName)

      if (error) throw error

      this.logger.info('Task field override cleared', { projectId, taskId, fieldName })
      return true
    } catch (error) {
      const wrappedError = wrapError(error, DatabaseError, { projectId, taskId, fieldName })
      this.logger.logError(wrappedError)
      throw wrappedError
    }
  }

  /**
   * Clear all field overrides for a task (revert to inherited values)
   * @param {string} projectId - Project UUID
   * @param {string} taskId - Task UUID
   * @returns {number} Number of overrides deleted
   */
  async clearAllTaskFieldOverrides(projectId, taskId) {
    try {
      this.logger.debug('Clearing all task field overrides', { projectId, taskId })

      const { count, error } = await this.supabase
        .from('task_field_overrides')
        .delete()
        .eq('project_id', projectId)
        .eq('task_id', taskId)

      if (error) throw error

      this.logger.info('All task field overrides cleared', { projectId, taskId, count })
      return count || 0
    } catch (error) {
      const wrappedError = wrapError(error, DatabaseError, { projectId, taskId })
      this.logger.logError(wrappedError)
      throw wrappedError
    }
  }

  /**
   * Get resolved field value with inheritance chain
   * 1. Task-level override (if exists)
   * 2. Project-level inherited value (if inheritable)
   * 3. Null
   *
   * @param {string} projectId - Project UUID
   * @param {string} taskId - Task UUID
   * @param {string} fieldName - Canonical field name
   * @returns {Object} { value, source: 'override'|'inherited'|'default' }
   */
  async getTaskFieldResolved(projectId, taskId, fieldName) {
    try {
      this.logger.debug('Resolving task field value', { projectId, taskId, fieldName })

      // Try to get override first
      const override = await this.getTaskFieldOverride(projectId, taskId, fieldName)
      if (override !== null && override !== undefined) {
        return {
          value: override,
          source: 'override'
        }
      }

      // Fall back to project context (inherited)
      const context = await this.getByProjectId(projectId)
      if (context) {
        // Convert fieldName to camelCase property name (e.g., product_name → product_name)
        const contextValue = context[fieldName] || context[this._toCamelCase(fieldName)]
        if (contextValue !== null && contextValue !== undefined) {
          return {
            value: contextValue,
            source: 'inherited'
          }
        }
      }

      // Default
      return {
        value: null,
        source: 'default'
      }
    } catch (error) {
      const wrappedError = wrapError(error, DatabaseError, { projectId, taskId, fieldName })
      this.logger.logError(wrappedError)
      throw wrappedError
    }
  }

  /**
   * Get multiple field values with resolution chain for a task
   * @param {string} projectId - Project UUID
   * @param {string} taskId - Task UUID
   * @param {string[]} fieldNames - Array of canonical field names
   * @returns {Object} Map of field names to { value, source }
   */
  async getTaskFieldsResolved(projectId, taskId, fieldNames) {
    try {
      this.logger.debug('Resolving multiple task fields', { projectId, taskId, fieldCount: fieldNames.length })

      const resolved = {}

      for (const fieldName of fieldNames) {
        resolved[fieldName] = await this.getTaskFieldResolved(projectId, taskId, fieldName)
      }

      return resolved
    } catch (error) {
      const wrappedError = wrapError(error, DatabaseError, { projectId, taskId, fieldCount: fieldNames.length })
      this.logger.logError(wrappedError)
      throw wrappedError
    }
  }

  /**
   * Batch set multiple field overrides for a task
   * @param {string} projectId - Project UUID
   * @param {string} taskId - Task UUID
   * @param {string} userId - User UUID
   * @param {Object} overrides - Map of fieldName -> value
   * @param {string} source - Override source (default: 'ui')
   * @returns {Object[]} Array of inserted/updated overrides
   */
  async setTaskFieldOverridesBatch(projectId, taskId, userId, overrides, source = 'ui') {
    try {
      this.logger.debug('Batch setting task field overrides', { projectId, taskId, fieldCount: Object.keys(overrides).length })

      const rows = Object.entries(overrides).map(([fieldName, value]) => ({
        project_id: projectId,
        task_id: taskId,
        user_id: userId,
        field_name: fieldName,
        field_value: value,
        source: source,
        overridden_at: new Date().toISOString()
      }))

      const { data, error } = await this.supabase
        .from('task_field_overrides')
        .upsert(rows, { onConflict: 'project_id,task_id,field_name' })
        .select()

      if (error) throw error

      this.logger.info('Task field overrides batch set', { projectId, taskId, count: data?.length || 0 })
      return data || []
    } catch (error) {
      const wrappedError = wrapError(error, DatabaseError, { projectId, taskId })
      this.logger.logError(wrappedError)
      throw wrappedError
    }
  }

  /**
   * Get all tasks with overrides for a project
   * @param {string} projectId - Project UUID
   * @returns {string[]} Array of task IDs with at least one override
   */
  async getTasksWithOverrides(projectId) {
    try {
      this.logger.debug('Fetching tasks with overrides', { projectId })

      const { data, error } = await this.supabase
        .from('task_field_overrides')
        .select('task_id')
        .eq('project_id', projectId)
        .distinct()

      if (error) throw error

      const taskIds = (data || []).map(row => row.task_id)
      return taskIds
    } catch (error) {
      const wrappedError = wrapError(error, DatabaseError, { projectId })
      this.logger.logError(wrappedError)
      throw wrappedError
    }
  }

  /**
   * Get override statistics for a project
   * @param {string} projectId - Project UUID
   * @returns {Object} Stats including total overrides, by field, by task
   */
  async getOverrideStatistics(projectId) {
    try {
      this.logger.debug('Calculating override statistics', { projectId })

      const { data, error } = await this.supabase
        .from('task_field_overrides')
        .select('task_id, field_name')
        .eq('project_id', projectId)

      if (error) throw error

      // Calculate statistics
      const stats = {
        totalOverrides: data?.length || 0,
        uniqueTasks: new Set(data?.map(row => row.task_id) || []).size,
        uniqueFields: new Set(data?.map(row => row.field_name) || []).size,
        byField: {},
        byTask: {}
      }

      if (data) {
        data.forEach(row => {
          stats.byField[row.field_name] = (stats.byField[row.field_name] || 0) + 1
          stats.byTask[row.task_id] = (stats.byTask[row.task_id] || 0) + 1
        })
      }

      return stats
    } catch (error) {
      const wrappedError = wrapError(error, DatabaseError, { projectId })
      this.logger.logError(wrappedError)
      throw wrappedError
    }
  }

  /**
   * Convert snake_case to camelCase
   * @private
   */
  _toCamelCase(str) {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
  }

  /**
   * Convert camelCase to snake_case
   * @private
   */
  _toSnakeCase(str) {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
  }

  /**
   * Convert model data to database payload format
   * - Converts camelCase to snake_case
   * - Removes internal fields like _customFields
   * @private
   */
  _toDbPayload(data) {
    const payload = {}
    const internalFields = ['_customFields']

    for (const [key, value] of Object.entries(data)) {
      // Skip internal fields
      if (internalFields.includes(key)) continue
      // Skip undefined values
      if (value === undefined) continue

      // Convert camelCase to snake_case
      const dbKey = this._toSnakeCase(key)
      payload[dbKey] = value
    }

    return payload
  }

  /**
   * Convert database row to model-friendly format
   * - Converts snake_case to camelCase
   * @private
   */
  _fromDbPayload(row) {
    if (!row) return row

    const data = {}
    for (const [key, value] of Object.entries(row)) {
      const modelKey = this._toCamelCase(key)
      data[modelKey] = value
    }

    return data
  }
}
