/**
 * Field Registry System
 *
 * Centralized registry that maps all field sources (onboarding, project form, mini-apps, etc.)
 * to canonical ProjectContext field names.
 *
 * Enables:
 * 1. Identification of semantic duplicates (same meaning, different names)
 * 2. Automatic field mapping during consolidation
 * 3. Future field additions without breaking existing code
 * 4. Clear inheritance hierarchy (Project → Task)
 *
 * The 10 semantic duplicate groups being consolidated in Phase 1:
 * 1. TARGET_AUDIENCE (5 instances)
 * 2. PRODUCT_NAME & DESCRIPTION (4 instances)
 * 3. MAIN_GOAL / PRIMARY_OBJECTIVE (4 instances)
 * 4. TIMELINE / DEADLINE (3 instances)
 * 5. PRODUCT_TYPE (2 instances)
 * 6. BUDGET / FINANCIAL METRICS (3 instances)
 * 7. TEAM_SIZE (1 main, relevant to others)
 * 8. CALL-TO-ACTION / KEY MESSAGE (2 instances)
 * 9. EMAIL / CONTACT INFO (2 instances - obviously unified)
 * 10. KEYWORDS / SEO TERMS (2 instances)
 */

/**
 * Canonical field definitions
 * These are the authoritative field names in ProjectContext
 */
export const CANONICAL_FIELDS = {
  // Core product/company info
  PRODUCT_NAME: 'productName',
  PRODUCT_TYPE: 'productType',
  PRODUCT_DESCRIPTION: 'productDescription',

  // Audience & persona
  TARGET_AUDIENCE: 'targetAudience',

  // Goals & timelines
  PRIMARY_GOAL: 'primaryGoal',
  TARGET_TIMELINE: 'targetTimeline',

  // Team & budget
  TEAM_SIZE: 'teamSize',
  MARKETING_BUDGET: 'marketingBudget',
  CURRENT_STAGE: 'currentStage',

  // Infrastructure
  TECH_STACK: 'techStack'
}

/**
 * Field groups: Maps semantic duplicate groups to their canonical field
 * Lists all the "old names" that should be consolidated into one canonical name
 */
export const FIELD_GROUPS = {
  // Group 1: Target Audience (5 locations)
  [CANONICAL_FIELDS.TARGET_AUDIENCE]: {
    canonical: CANONICAL_FIELDS.TARGET_AUDIENCE,
    category: 'audience',
    inheritable: true,
    sources: [
      { location: 'onboarding.step2', fieldName: 'targetAudience', type: 'textarea' },
      { location: 'projectForm', fieldName: 'targetAudience', type: 'text' },
      { location: 'miniApp.blog', fieldName: 'targetAudience', type: 'text' },
      { location: 'miniApp.webinar', fieldName: 'targetAudience', type: 'text' },
      { location: 'miniApp.paidAds', fieldName: 'targetAudienceDescription', type: 'textarea' }
    ],
    description: 'Ideal customer profile, persona, or target market description'
  },

  // Group 2: Product Name & Description (4 locations)
  [CANONICAL_FIELDS.PRODUCT_NAME]: {
    canonical: CANONICAL_FIELDS.PRODUCT_NAME,
    category: 'product_identity',
    inheritable: true,
    sources: [
      { location: 'onboarding.step1', fieldName: 'productName', type: 'text' },
      { location: 'miniApp.analytics', fieldName: 'productName', type: 'text' },
      { location: 'miniApp.paidAds', fieldName: 'targetProductService', type: 'text' },
      { location: 'miniApp.landingPage', fieldName: 'productName', type: 'implicit' }
    ],
    description: 'Name of the product/service/app'
  },

  [CANONICAL_FIELDS.PRODUCT_DESCRIPTION]: {
    canonical: CANONICAL_FIELDS.PRODUCT_DESCRIPTION,
    category: 'product_identity',
    inheritable: true,
    sources: [
      { location: 'onboarding.step1', fieldName: 'productDescription', type: 'text' },
      { location: 'miniApp.analytics', fieldName: 'productDescription', type: 'textarea' },
      { location: 'miniApp.landingPage', fieldName: 'valueProposition', type: 'implicit' }
    ],
    description: 'One-line or detailed description of product'
  },

  // Group 3: Main Goal / Primary Objective (4 locations)
  [CANONICAL_FIELDS.PRIMARY_GOAL]: {
    canonical: CANONICAL_FIELDS.PRIMARY_GOAL,
    category: 'goals',
    inheritable: true,
    sources: [
      {
        location: 'onboarding.step3',
        fieldName: 'mainGoal',
        type: 'select',
        values: ['first_100', '1k_mrr', '10k_mrr', 'audience', 'validate']
      },
      {
        location: 'projectForm',
        fieldName: 'primaryGoals',
        type: 'textarea',
        note: 'More narrative format than select'
      },
      {
        location: 'miniApp.analytics',
        fieldName: 'mainGoal',
        type: 'select',
        note: 'Analytics-specific tracking goal'
      },
      {
        location: 'miniApp.paidAds',
        fieldName: 'primaryCampaignGoal',
        type: 'select',
        values: ['traffic', 'conversions', 'leads', 'brand_awareness']
      }
    ],
    description: 'Primary business goal or objective'
  },

  // Group 4: Timeline / Deadline (3 locations)
  [CANONICAL_FIELDS.TARGET_TIMELINE]: {
    canonical: CANONICAL_FIELDS.TARGET_TIMELINE,
    category: 'timeline',
    inheritable: true,
    sources: [
      {
        location: 'onboarding.step3',
        fieldName: 'timeline',
        type: 'select',
        values: ['1_month', '3_months', '6_months', 'no_timeline']
      },
      { location: 'projectForm', fieldName: 'timeline', type: 'text' },
      { location: 'miniApp.webinar', fieldName: 'webinarDate', type: 'date' }
    ],
    description: 'Timeline for reaching goal or completing milestone'
  },

  // Group 5: Product Type (2 locations)
  [CANONICAL_FIELDS.PRODUCT_TYPE]: {
    canonical: CANONICAL_FIELDS.PRODUCT_TYPE,
    category: 'product_identity',
    inheritable: true,
    sources: [
      {
        location: 'onboarding.step1',
        fieldName: 'productType',
        type: 'select',
        values: ['mobile_app', 'saas', 'ecommerce', 'game', 'digital_product', 'other']
      },
      {
        location: 'miniApp.analytics',
        fieldName: 'productType',
        type: 'select',
        note: 'Should auto-populate from onboarding'
      }
    ],
    description: 'Category of product: SaaS, mobile app, ecommerce, etc.'
  },

  // Group 6: Budget / Financial Metrics (3 locations, context-specific)
  [CANONICAL_FIELDS.MARKETING_BUDGET]: {
    canonical: CANONICAL_FIELDS.MARKETING_BUDGET,
    category: 'budget_and_finance',
    inheritable: true,
    sources: [
      { location: 'onboarding.step4', fieldName: 'marketingBudget', type: 'number' },
      { location: 'miniApp.paidAds.launch', fieldName: 'monthlyBudget', type: 'number' },
      { location: 'miniApp.paidAds.optimize', fieldName: 'monthlyAdSpend', type: 'number' }
    ],
    description: 'Total marketing or advertising budget in dollars',
    note: 'Different contexts may track budget differently (total vs. spend)'
  },

  // Group 7: Team Size (primary source)
  [CANONICAL_FIELDS.TEAM_SIZE]: {
    canonical: CANONICAL_FIELDS.TEAM_SIZE,
    category: 'organization',
    inheritable: true,
    sources: [
      {
        location: 'onboarding.step4',
        fieldName: 'teamSize',
        type: 'select',
        values: ['solo', '2-5', '6-10', '10+']
      }
    ],
    description: 'Size of team working on product'
  },

  // Group 8: Current Stage
  [CANONICAL_FIELDS.CURRENT_STAGE]: {
    canonical: CANONICAL_FIELDS.CURRENT_STAGE,
    category: 'product_lifecycle',
    inheritable: true,
    sources: [
      {
        location: 'onboarding.step4',
        fieldName: 'currentStage',
        type: 'select',
        values: ['idea', 'building', 'beta', 'launched']
      }
    ],
    description: 'Current stage of product development/market'
  },

  // Group 9: Tech Stack (future use)
  [CANONICAL_FIELDS.TECH_STACK]: {
    canonical: CANONICAL_FIELDS.TECH_STACK,
    category: 'infrastructure',
    inheritable: false,
    sources: [
      { location: 'projectForm', fieldName: 'techStack', type: 'text' }
    ],
    description: 'Technology stack or tools being used'
  }
}

/**
 * Get all canonical field names
 */
export function getAllCanonicalFields() {
  return Object.values(CANONICAL_FIELDS)
}

/**
 * Get the canonical name for a field
 * @param {string} sourceName - Original field name from any source
 * @returns {string|null} Canonical field name, or null if not found
 */
export function getCanonical(sourceName) {
  // Direct lookup if it's already canonical
  if (Object.values(CANONICAL_FIELDS).includes(sourceName)) {
    return sourceName
  }

  // Search through all groups for this source
  for (const group of Object.values(FIELD_GROUPS)) {
    const found = group.sources.find(source => source.fieldName === sourceName)
    if (found) {
      return group.canonical
    }
  }

  return null
}

/**
 * Get all sources for a canonical field
 * @param {string} canonicalName - The canonical field name
 * @returns {Array} Array of source definitions
 */
export function getSourcesFor(canonicalName) {
  const group = FIELD_GROUPS[canonicalName]
  return group ? group.sources : []
}

/**
 * Check if a field is inheritable (can be inherited from project to task)
 * @param {string} canonicalName - The canonical field name
 * @returns {boolean} True if field is inheritable
 */
export function isInheritable(canonicalName) {
  const group = FIELD_GROUPS[canonicalName]
  return group ? group.inheritable : false
}

/**
 * Get fields grouped by category
 * @returns {Object} Fields organized by category
 */
export function getFieldsByCategory() {
  const categories = {}

  for (const [fieldName, group] of Object.entries(FIELD_GROUPS)) {
    const category = group.category
    if (!categories[category]) {
      categories[category] = []
    }
    categories[category].push({
      fieldName,
      description: group.description,
      inheritable: group.inheritable,
      sourceCount: group.sources.length
    })
  }

  return categories
}

/**
 * Get consolidation summary
 * @returns {Object} Summary of consolidation across all groups
 */
export function getConsolidationSummary() {
  let totalSources = 0
  let totalCanonical = 0
  const byCategory = {}

  for (const group of Object.values(FIELD_GROUPS)) {
    const count = group.sources.length
    totalSources += count

    const category = group.category
    if (!byCategory[category]) {
      byCategory[category] = { canonical: 0, sources: 0 }
    }
    byCategory[category].canonical++
    byCategory[category].sources += count
  }

  totalCanonical = Object.keys(FIELD_GROUPS).length

  return {
    totalSourceFields: totalSources,
    totalCanonicalFields: totalCanonical,
    reduction: `${totalSources} → ${totalCanonical} (${Math.round((1 - totalCanonical / totalSources) * 100)}% reduction)`,
    byCategory
  }
}

/**
 * Map old field names to canonical names
 * Useful for migrations and backward compatibility
 * @param {Object} oldData - Data with old field names
 * @returns {Object} Data mapped to canonical names
 */
export function mapToCanonical(oldData) {
  const canonical = {}

  for (const [oldKey, value] of Object.entries(oldData)) {
    const canonicalKey = getCanonical(oldKey)
    if (canonicalKey) {
      canonical[canonicalKey] = value
    } else {
      // Keep unknown fields as-is (forward compatibility)
      canonical[oldKey] = value
    }
  }

  return canonical
}

/**
 * Validate field value against known constraints
 * @param {string} canonicalField - Field name
 * @param {*} value - Value to validate
 * @returns {Object} Validation result { isValid: boolean, error?: string }
 */
export function validateField(canonicalField, value) {
  // Allow null/undefined values
  if (value === null || value === undefined) {
    return { isValid: true }
  }

  const group = FIELD_GROUPS[canonicalField]
  if (!group) {
    return { isValid: true } // Unknown field, skip validation
  }

  // Check enum values if defined
  const source = group.sources[0] // Use first source's values as reference
  if (source.values && !source.values.includes(value)) {
    return {
      isValid: false,
      error: `Invalid value for ${canonicalField}. Must be one of: ${source.values.join(', ')}`
    }
  }

  // Type validation
  if (canonicalField === CANONICAL_FIELDS.MARKETING_BUDGET) {
    if (typeof value !== 'number' || value < 0) {
      return {
        isValid: false,
        error: 'Marketing budget must be a positive number'
      }
    }
  }

  return { isValid: true }
}

/**
 * Export consolidation mapping for documentation
 * @returns {Object} Detailed consolidation map
 */
export function getConsolidationMap() {
  const map = {}

  for (const [canonical, group] of Object.entries(FIELD_GROUPS)) {
    map[canonical] = {
      description: group.description,
      inheritable: group.inheritable,
      previousLocations: group.sources.map(s => `${s.location}.${s.fieldName}`),
      count: group.sources.length
    }
  }

  return map
}
