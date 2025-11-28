/**
 * Unified Field Mapper Service
 *
 * Centralizes field resolution, transformation, and context building for mini-apps.
 * Bridges ProjectContext, task overrides, and mini-app form data into a single source of truth.
 *
 * Benefits:
 * - Single point of field resolution (ProjectContext + overrides + formData)
 * - Automatic field transformations (arrays → lists, dates → formats)
 * - Inheritance metadata preserved (which values are inherited vs. overridden)
 * - Performance: Caches ProjectContext per task/project combination
 * - Configuration-driven: No manual contextProvider code needed in configs
 */

import { ProjectContextRepository } from './projectContextRepository.js'
import { fieldRegistry } from './fieldRegistry.js'

class UnifiedFieldMapperService {
  constructor() {
    this.repository = new ProjectContextRepository()
    this.cache = new Map() // { projectId:taskId → resolved fields }
    this.transformations = this._initializeTransformations()
  }

  /**
   * Initialize field transformation rules
   * Maps field names to transformation functions that process values for use in prompts
   */
  _initializeTransformations() {
    return {
      // Array fields: Convert to comma-separated strings
      platforms: {
        transform: (value) => {
          if (!Array.isArray(value)) return String(value)
          const platformLabels = {
            twitter: 'X (Twitter)',
            linkedin: 'LinkedIn',
            instagram: 'Instagram',
            facebook: 'Facebook'
          }
          return value.map(p => platformLabels[p] || p).join(', ')
        },
        resultField: 'platforms_list'
      },

      // Money fields: Format with currency symbol
      marketingBudget: {
        transform: (value) => {
          if (!value) return ''
          const num = Number(value)
          return isNaN(num) ? String(value) : `$${num.toLocaleString()}`
        },
        resultField: 'marketingBudget_formatted'
      },

      // Numeric fields: Format with separators
      teamSize: {
        transform: (value) => {
          if (!value) return ''
          const num = Number(value)
          return isNaN(num) ? String(value) : num.toLocaleString()
        },
        resultField: 'teamSize_formatted'
      }
    }
  }

  /**
   * Get cache key for a project/task combination
   */
  _getCacheKey(projectId, taskId) {
    return `${projectId}:${taskId}`
  }

  /**
   * Clear cache for a specific task or entire project
   */
  clearCache(projectId, taskId = null) {
    if (taskId) {
      const key = this._getCacheKey(projectId, taskId)
      this.cache.delete(key)
    } else {
      // Clear all tasks for this project
      for (const key of this.cache.keys()) {
        if (key.startsWith(`${projectId}:`)) {
          this.cache.delete(key)
        }
      }
    }
  }

  /**
   * Build complete context for a task
   *
   * Resolves fields in this order (first match wins):
   * 1. Task field overrides (user explicitly set in mini-app)
   * 2. Form data passed in (current session form values)
   * 3. Inherited values from ProjectContext
   * 4. Default values (empty string)
   *
   * @param {string} projectId - Project ID
   * @param {string} taskId - Task ID
   * @param {Object} formData - Current form data (mini-app field IDs as keys)
   * @param {Object} fieldMappings - Mappings from mini-app fields to canonical fields
   * @param {Object} options - Additional options
   * @returns {Object} Complete context with all available fields
   */
  async buildContextForTask(projectId, taskId, formData = {}, fieldMappings = {}, options = {}) {
    const { useCache = true, includeMeta = false } = options

    // Check cache
    const cacheKey = this._getCacheKey(projectId, taskId)
    if (useCache && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)
      // Merge with current formData (formData takes precedence)
      return this._mergeContextWithFormData(cached, formData, includeMeta)
    }

    // Load ProjectContext for this project
    let context = await this.repository.getProjectContextForProject(projectId)
    if (!context) {
      context = {} // Graceful fallback if no context found
    }

    // Load task overrides
    const overrides = await this.repository.getTaskFieldOverrides(projectId, taskId) || {}

    // Build initial context from ProjectContext
    let resolvedContext = this._buildContextFromProjectContext(context)

    // Merge in task overrides (override > ProjectContext)
    resolvedContext = { ...resolvedContext, ...overrides }

    // Add mapped inherited values (for fields not in form)
    const inheritedValues = this._getMappedInheritedValues(
      fieldMappings,
      context,
      overrides,
      formData
    )
    resolvedContext = { ...resolvedContext, ...inheritedValues }

    // Apply transformations
    const transformedContext = this._applyTransformations(resolvedContext)

    // Cache the resolved context
    if (useCache) {
      this.cache.set(cacheKey, transformedContext)
    }

    // Merge with current formData (formData takes precedence over everything)
    return this._mergeContextWithFormData(transformedContext, formData, includeMeta)
  }

  /**
   * Build context object from ProjectContext canonical fields
   */
  _buildContextFromProjectContext(projectContext) {
    const context = {}

    if (!projectContext) return context

    // Add all known canonical fields
    const canonicalFields = [
      'targetAudience', 'productName', 'productDescription', 'primaryGoal',
      'targetTimeline', 'productType', 'marketingBudget', 'teamSize', 'currentStage'
    ]

    for (const fieldName of canonicalFields) {
      const value = projectContext[fieldName]
      if (value !== null && value !== undefined) {
        context[fieldName] = value
      }
    }

    // Add compound/derived fields
    if (projectContext.productName) {
      context.app_name = projectContext.productName
      context.company_name = projectContext.productName
    }

    if (projectContext.productDescription) {
      context.app_description = projectContext.productDescription
    }

    return context
  }

  /**
   * Get inherited values for fields mapped to canonical fields
   *
   * For each mapping, check if:
   * 1. Task override exists (use it)
   * 2. FormData has value (use it)
   * 3. ProjectContext has value (use it - this is the inherited value)
   */
  _getMappedInheritedValues(fieldMappings, projectContext, overrides, formData) {
    const inherited = {}

    if (!fieldMappings || typeof fieldMappings !== 'object') {
      return inherited
    }

    for (const [miniAppFieldId, canonicalFieldName] of Object.entries(fieldMappings)) {
      // Skip if not mapped to a canonical field
      if (!canonicalFieldName) continue

      // Skip if already has value in formData
      if (miniAppFieldId in formData && formData[miniAppFieldId] !== null) continue

      // Skip if already has override
      if (canonicalFieldName in overrides) continue

      // Use ProjectContext value if available
      if (projectContext && projectContext[canonicalFieldName] !== null) {
        inherited[miniAppFieldId] = projectContext[canonicalFieldName]
      }
    }

    return inherited
  }

  /**
   * Apply transformations to context values
   * Creates both original and transformed versions
   */
  _applyTransformations(context) {
    const transformed = { ...context }

    for (const [fieldName, transformConfig] of Object.entries(this.transformations)) {
      if (fieldName in transformed && transformed[fieldName]) {
        try {
          const resultFieldName = transformConfig.resultField || `${fieldName}_transformed`
          transformed[resultFieldName] = transformConfig.transform(transformed[fieldName])
        } catch (error) {
          console.error(`[UnifiedFieldMapperService] Error transforming ${fieldName}:`, error)
          // Keep original value if transformation fails
        }
      }
    }

    return transformed
  }

  /**
   * Merge context with form data
   * Form data takes precedence (user overrides everything)
   */
  _mergeContextWithFormData(context, formData, includeMeta = false) {
    const merged = { ...context, ...formData }

    if (includeMeta) {
      // Add metadata about each field's source
      merged._fieldMetadata = this._buildFieldMetadata(context, formData)
    }

    return merged
  }

  /**
   * Build metadata about each field's source
   */
  _buildFieldMetadata(context, formData) {
    const metadata = {}

    for (const fieldName of Object.keys(context)) {
      if (fieldName === '_fieldMetadata') continue

      const isInFormData = fieldName in formData
      const isInherited = !isInFormData && fieldName in context

      metadata[fieldName] = {
        source: isInFormData ? 'formData' : 'ProjectContext',
        isInherited,
        isOverridden: isInFormData,
        originalValue: isInFormData ? context[fieldName] : undefined
      }
    }

    return metadata
  }

  /**
   * Get resolved values for specific fields from ProjectContext + overrides
   *
   * @param {string} projectId
   * @param {string} taskId
   * @param {string[]} fieldNames - Canonical field names to resolve
   * @returns {Object} { fieldName: { value, source: 'override'|'inherited'|'default' }, ... }
   */
  async getResolvedFields(projectId, taskId, fieldNames) {
    const resolved = {}

    // Load ProjectContext
    const context = await this.repository.getProjectContextForProject(projectId)

    // Load overrides
    const overrides = await this.repository.getTaskFieldOverrides(projectId, taskId) || {}

    // Resolve each field
    for (const fieldName of fieldNames) {
      if (fieldName in overrides) {
        resolved[fieldName] = {
          value: overrides[fieldName],
          source: 'override'
        }
      } else if (context && context[fieldName] !== null) {
        resolved[fieldName] = {
          value: context[fieldName],
          source: 'inherited'
        }
      } else {
        resolved[fieldName] = {
          value: null,
          source: 'default'
        }
      }
    }

    return resolved
  }

  /**
   * Generate a context provider function for use in AI configs
   *
   * Instead of writing custom contextProvider in each config, use:
   * contextProvider: generateContextProvider(['productName', 'targetAudience'])
   *
   * @param {string} projectId
   * @param {string} taskId
   * @param {string[]} desiredFields - Canonical field names to include
   * @returns {Function} Function that returns resolved context
   */
  generateContextProvider(projectId, taskId, desiredFields = []) {
    return async () => {
      return await this.buildContextForTask(projectId, taskId, {}, {}, {
        useCache: true,
        includeMeta: false
      })
    }
  }

  /**
   * Register a custom transformation
   *
   * @param {string} fieldName
   * @param {Object} transformConfig - { transform: function, resultField: string }
   */
  registerTransformation(fieldName, transformConfig) {
    this.transformations[fieldName] = transformConfig
  }

  /**
   * Get available transformations
   */
  getAvailableTransformations() {
    return Object.keys(this.transformations)
  }
}

// Export singleton instance
export const unifiedFieldMapperService = new UnifiedFieldMapperService()

// Export class for testing/extension
export { UnifiedFieldMapperService }
