/**
 * ProjectContext Domain Model
 *
 * Represents the consolidated project-level data that is inherited by tasks/mini-apps.
 * This is the single source of truth for semantic duplicate fields like:
 * - Target Audience (from onboarding, project form, blog, webinar, ads)
 * - Product Name/Description (from onboarding, analytics, ads, landing page)
 * - Main Goal (from onboarding, project, analytics, paid ads)
 * - Timeline (from onboarding, project, webinar)
 * - Product Type (from onboarding, analytics)
 * - Budget (from onboarding, ads, spend)
 * - Team Size & Stage (from onboarding)
 * - Tech Stack (from project/product info)
 *
 * Future-proof design:
 * - Uses optional fields to support future additions without schema refactoring
 * - Implements custom getter/setter pattern for extensibility
 * - Supports field validation at the model layer
 * - Serializes/deserializes cleanly for DB and API transport
 */

import { validateUUID } from '@/shared/utils'

export class ProjectContext {
  /**
   * Create a new ProjectContext instance
   *
   * @param {string} id - Unique context UUID
   * @param {string} projectId - Associated project UUID
   * @param {string} userId - Owner user UUID
   * @param {Object} data - Context data object with all fields
   * @param {string} data.productName - Name of the product/app
   * @param {string} data.productType - Type: mobile_app, saas, ecommerce, game, digital_product, other
   * @param {string} data.productDescription - One-line description of product
   * @param {string} data.targetAudience - Detailed description of ideal customer/persona
   * @param {string} data.primaryGoal - Main objective for the product (e.g., first_100, 1k_mrr)
   * @param {string} data.targetTimeline - Timeline for reaching goal (e.g., 1_month, 3_months, 6_months)
   * @param {number} data.marketingBudget - Total marketing budget in dollars (optional)
   * @param {string} data.teamSize - Team size: solo, 2-5, 6-10, 10+ (optional)
   * @param {string} data.currentStage - Product stage: idea, building, beta, launched (optional)
   * @param {Object} data.techStack - Technology stack info (optional, future use)
   */
  constructor(id, projectId, userId, data = {}) {
    validateUUID(id)
    validateUUID(projectId)
    validateUUID(userId)

    this.id = id
    this.projectId = projectId
    this.userId = userId

    // Core context fields (all optional to support gradual migration)
    this.productName = data.productName || null
    this.productType = data.productType || null
    this.productDescription = data.productDescription || null
    this.targetAudience = data.targetAudience || null
    this.primaryGoal = data.primaryGoal || null
    this.targetTimeline = data.targetTimeline || null

    // Secondary context fields
    this.marketingBudget = data.marketingBudget || null
    this.teamSize = data.teamSize || null
    this.currentStage = data.currentStage || null
    this.techStack = data.techStack || null

    // Metadata
    this.createdAt = data.createdAt || new Date().toISOString()
    this.updatedAt = data.updatedAt || new Date().toISOString()

    // Future-proofing: store any extra fields (Phase 2+ may add new consolidation candidates)
    this._customFields = data._customFields || {}
  }

  /**
   * Get a field value, with fallback for future extensibility
   * @param {string} fieldName - Name of field to retrieve
   * @returns {*} Field value or null if not found
   */
  getField(fieldName) {
    if (this.hasOwnProperty(fieldName)) {
      return this[fieldName]
    }
    return this._customFields[fieldName] || null
  }

  /**
   * Set a field value, supporting future extensibility
   * @param {string} fieldName - Name of field to set
   * @param {*} value - Value to set
   * @returns {ProjectContext} Returns self for chaining
   */
  setField(fieldName, value) {
    if (['id', 'projectId', 'userId', 'createdAt'].includes(fieldName)) {
      throw new Error(`Cannot modify immutable field: ${fieldName}`)
    }

    if (this.hasOwnProperty(fieldName)) {
      this[fieldName] = value
    } else {
      this._customFields[fieldName] = value
    }

    this.updatedAt = new Date().toISOString()
    return this
  }

  /**
   * Update multiple fields at once
   * @param {Object} updates - Object with fields to update
   * @returns {ProjectContext} Returns self for chaining
   */
  updateFields(updates) {
    Object.entries(updates).forEach(([key, value]) => {
      this.setField(key, value)
    })
    return this
  }

  /**
   * Check if a field has been set (not null/undefined)
   * @param {string} fieldName - Name of field to check
   * @returns {boolean} True if field is set
   */
  hasField(fieldName) {
    const value = this.getField(fieldName)
    return value !== null && value !== undefined && value !== ''
  }

  /**
   * Get all fields that are currently set
   * @returns {Object} Object with only non-null fields
   */
  getSetFields() {
    const fields = {}

    // Core fields
    if (this.productName) fields.productName = this.productName
    if (this.productType) fields.productType = this.productType
    if (this.productDescription) fields.productDescription = this.productDescription
    if (this.targetAudience) fields.targetAudience = this.targetAudience
    if (this.primaryGoal) fields.primaryGoal = this.primaryGoal
    if (this.targetTimeline) fields.targetTimeline = this.targetTimeline

    // Secondary fields
    if (this.marketingBudget) fields.marketingBudget = this.marketingBudget
    if (this.teamSize) fields.teamSize = this.teamSize
    if (this.currentStage) fields.currentStage = this.currentStage
    if (this.techStack) fields.techStack = this.techStack

    // Custom fields
    Object.entries(this._customFields).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        fields[key] = value
      }
    })

    return fields
  }

  /**
   * Check if context is empty (no fields set)
   * @returns {boolean} True if all fields are null/undefined
   */
  isEmpty() {
    return Object.keys(this.getSetFields()).length === 0
  }

  /**
   * Get a summary of context for display
   * @returns {Object} Summary object with key fields
   */
  getSummary() {
    return {
      id: this.id,
      projectId: this.projectId,
      product: this.productName ? `${this.productName} (${this.productType})` : 'No product info',
      audience: this.targetAudience ? this.targetAudience.substring(0, 50) + '...' : 'No audience defined',
      goal: this.primaryGoal || 'No goal set',
      timeline: this.targetTimeline || 'No timeline',
      teamSize: this.teamSize || 'Not specified',
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }

  /**
   * Clone this context (creates a new instance with same data)
   * @returns {ProjectContext} New ProjectContext instance
   */
  clone() {
    return new ProjectContext(this.id, this.projectId, this.userId, this.toJSON())
  }

  /**
   * Serialize to plain object (for storage/API)
   * @returns {Object} Plain object representation
   */
  toJSON() {
    return {
      id: this.id,
      projectId: this.projectId,
      userId: this.userId,
      productName: this.productName,
      productType: this.productType,
      productDescription: this.productDescription,
      targetAudience: this.targetAudience,
      primaryGoal: this.primaryGoal,
      targetTimeline: this.targetTimeline,
      marketingBudget: this.marketingBudget,
      teamSize: this.teamSize,
      currentStage: this.currentStage,
      techStack: this.techStack,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      _customFields: this._customFields
    }
  }

  /**
   * Deserialize from plain object (hydrate from storage/API)
   * @param {Object} json - Plain object with context data
   * @returns {ProjectContext} New ProjectContext instance
   */
  static fromJSON(json) {
    if (!json || !json.id || !json.projectId || !json.userId) {
      throw new Error('Invalid ProjectContext JSON: missing id, projectId, or userId')
    }

    return new ProjectContext(json.id, json.projectId, json.userId, json)
  }

  /**
   * Create a new ProjectContext from onboarding data
   * Maps onboarding field names to canonical ProjectContext field names
   *
   * @param {string} projectId - The associated project UUID
   * @param {string} userId - The user UUID
   * @param {Object} onboardingData - Data from onboarding wizard
   * @returns {ProjectContext} New ProjectContext instance
   */
  static fromOnboarding(projectId, userId, onboardingData = {}) {
    const contextId = crypto.randomUUID ? crypto.randomUUID() : `context-${Date.now()}`

    return new ProjectContext(contextId, projectId, userId, {
      // Map onboarding field names to ProjectContext canonical names
      productName: onboardingData.productName || null,
      productType: onboardingData.productType || null,
      productDescription: onboardingData.productDescription || null,
      targetAudience: onboardingData.targetAudience || null,
      primaryGoal: onboardingData.mainGoal || null,
      targetTimeline: onboardingData.timeline || null,
      marketingBudget: onboardingData.marketingBudget || null,
      teamSize: onboardingData.teamSize || null,
      currentStage: onboardingData.currentStage || null,
      techStack: onboardingData.techStack || null
    })
  }
}
