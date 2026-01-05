/**
 * Field Schemas & Validation Rules
 *
 * Detailed schema definitions for all consolidatable fields.
 * Provides type information, validation rules, UI hints, and constraints.
 * Used by ProjectContext model and repository for validation.
 *
 * Enables:
 * 1. Consistent validation across app
 * 2. Type safety without TypeScript
 * 3. Form generation (Phase 3)
 * 4. API contract documentation
 * 5. Migration validation
 */

import { CANONICAL_FIELDS } from './fieldRegistry.js'

/**
 * Field schema structure:
 * {
 *   fieldName: {
 *     type: 'string'|'number'|'select'|'date'|'json',
 *     label: 'Human-readable label',
 *     description: 'What this field represents',
 *     required: false,
 *     inheritable: true|false,
 *     validation: {
 *       minLength: number,
 *       maxLength: number,
 *       min: number,
 *       max: number,
 *       pattern: RegExp,
 *       enum: [value1, value2],
 *       custom: function
 *     },
 *     ui: {
 *       placeholder: string,
 *       help: string,
 *       rows: number (for textarea),
 *       icon: string
 *     }
 *   }
 * }
 */

export const FIELD_SCHEMAS = {
  [CANONICAL_FIELDS.PRODUCT_NAME]: {
    type: 'string',
    label: 'Product Name',
    description: 'Name of your product, service, or application',
    required: false,
    inheritable: true,
    validation: {
      minLength: 1,
      maxLength: 100,
      pattern: /^[a-zA-Z0-9\s\-_().&']+$/ // Allow alphanumeric, spaces, hyphens, underscores, parens, ampersand, apostrophe
    },
    ui: {
      placeholder: 'e.g., Launchpilot, Notion Clone, AI Chatbot',
      help: 'This name will be used across analytics, ads, and marketing materials',
      icon: 'box'
    }
  },

  [CANONICAL_FIELDS.PRODUCT_TYPE]: {
    type: 'select',
    label: 'Product Type',
    description: 'Category of your product for analytics and targeting',
    required: false,
    inheritable: true,
    validation: {
      enum: ['mobile_app', 'saas', 'ecommerce', 'game', 'digital_product', 'other']
    },
    ui: {
      placeholder: 'Select product type',
      help: 'Choose the category that best describes your product',
      options: [
        { value: 'mobile_app', label: 'Mobile App (iOS/Android)' },
        { value: 'saas', label: 'SaaS (Web Application)' },
        { value: 'ecommerce', label: 'E-commerce Store' },
        { value: 'game', label: 'Game' },
        { value: 'digital_product', label: 'Digital Product (PDF, course, etc.)' },
        { value: 'other', label: 'Other' }
      ],
      icon: 'layers'
    }
  },

  [CANONICAL_FIELDS.PRODUCT_DESCRIPTION]: {
    type: 'string',
    label: 'Product Description',
    description: 'One-line or brief description of what your product does',
    required: false,
    inheritable: true,
    validation: {
      minLength: 1,
      maxLength: 500
    },
    ui: {
      placeholder: 'e.g., An AI-powered task manager that helps founders build faster',
      help: 'Keep it concise and benefit-focused',
      rows: 3,
      icon: 'align-left'
    }
  },

  [CANONICAL_FIELDS.TARGET_AUDIENCE]: {
    type: 'string',
    label: 'Target Audience',
    description: 'Detailed description of your ideal customer or user profile',
    required: false,
    inheritable: true,
    validation: {
      minLength: 1,
      maxLength: 1000
    },
    ui: {
      placeholder: 'e.g., Founders aged 25-40 building B2B SaaS products, with technical background',
      help: 'Include demographics, behaviors, pain points, and characteristics',
      rows: 4,
      icon: 'users'
    }
  },

  [CANONICAL_FIELDS.PRIMARY_GOAL]: {
    type: 'select',
    label: 'Primary Goal',
    description: 'Main business objective you are trying to achieve',
    required: false,
    inheritable: true,
    validation: {
      enum: ['first_100', '1k_mrr', '10k_mrr', 'audience', 'validate']
    },
    ui: {
      placeholder: 'Select primary goal',
      help: 'What is your most important metric right now?',
      options: [
        { value: 'first_100', label: 'Get First 100 Users' },
        { value: '1k_mrr', label: 'Reach $1K Monthly Revenue' },
        { value: '10k_mrr', label: 'Reach $10K Monthly Revenue' },
        { value: 'audience', label: 'Build Audience / Community' },
        { value: 'validate', label: 'Validate Product-Market Fit' }
      ],
      icon: 'target'
    }
  },

  [CANONICAL_FIELDS.TARGET_TIMELINE]: {
    type: 'select',
    label: 'Target Timeline',
    description: 'Timeframe for achieving your primary goal',
    required: false,
    inheritable: true,
    validation: {
      enum: ['1_month', '3_months', '6_months', 'no_timeline']
    },
    ui: {
      placeholder: 'Select timeline',
      help: 'When do you want to achieve your primary goal?',
      options: [
        { value: '1_month', label: '1 Month' },
        { value: '3_months', label: '3 Months' },
        { value: '6_months', label: '6 Months' },
        { value: 'no_timeline', label: 'No Timeline (Open-ended)' }
      ],
      icon: 'calendar'
    }
  },

  [CANONICAL_FIELDS.MARKETING_BUDGET]: {
    type: 'number',
    label: 'Marketing Budget',
    description: 'Total allocated budget for marketing and customer acquisition',
    required: false,
    inheritable: true,
    validation: {
      min: 0,
      max: 999999.99,
      custom: (value) => {
        // Allow whole numbers or 2 decimal places
        if (typeof value === 'number' && !Number.isInteger(value)) {
          const decimalPlaces = (value.toString().split('.')[1] || '').length
          return decimalPlaces <= 2 ? { valid: true } : { valid: false, error: 'Max 2 decimal places' }
        }
        return { valid: true }
      }
    },
    ui: {
      placeholder: '0',
      help: 'Enter amount in USD. Leave blank if not determined yet.',
      type: 'currency',
      icon: 'dollar-sign',
      prefix: '$'
    }
  },

  [CANONICAL_FIELDS.TEAM_SIZE]: {
    type: 'select',
    label: 'Team Size',
    description: 'How many people are working on this product',
    required: false,
    inheritable: true,
    validation: {
      enum: ['solo', '2-5', '6-10', '10+']
    },
    ui: {
      placeholder: 'Select team size',
      help: 'This helps us tailor recommendations and task suggestions',
      options: [
        { value: 'solo', label: 'Solo (Just me)' },
        { value: '2-5', label: '2-5 people' },
        { value: '6-10', label: '6-10 people' },
        { value: '10+', label: '10+ people' }
      ],
      icon: 'users'
    }
  },

  [CANONICAL_FIELDS.CURRENT_STAGE]: {
    type: 'select',
    label: 'Current Stage',
    description: 'Where your product currently is in its development lifecycle',
    required: false,
    inheritable: true,
    validation: {
      enum: ['idea', 'building', 'beta', 'launched']
    },
    ui: {
      placeholder: 'Select current stage',
      help: 'This helps us prioritize recommendations and features',
      options: [
        { value: 'idea', label: 'Idea (Planning phase)' },
        { value: 'building', label: 'Building (Development in progress)' },
        { value: 'beta', label: 'Beta (Limited release)' },
        { value: 'launched', label: 'Launched (Available to public)' }
      ],
      icon: 'activity'
    }
  },

  [CANONICAL_FIELDS.TECH_STACK]: {
    type: 'json',
    label: 'Tech Stack',
    description: 'Technologies, frameworks, and tools used in your product',
    required: false,
    inheritable: false,
    validation: {
      custom: (value) => {
        if (typeof value !== 'object' || Array.isArray(value)) {
          return { valid: false, error: 'Tech stack must be an object' }
        }
        return { valid: true }
      }
    },
    ui: {
      placeholder: '{"frontend": "React", "backend": "Node.js", "database": "PostgreSQL"}',
      help: 'Store as JSON for flexible structure. Example: {frontend, backend, database, hosting, etc.}',
      rows: 4,
      icon: 'code'
    }
  }
}

/**
 * Validate a field value against its schema
 * @param {string} fieldName - Canonical field name
 * @param {*} value - Value to validate
 * @returns {Object} { isValid: boolean, error?: string, warnings?: string[] }
 */
export function validateFieldValue(fieldName, value) {
  const schema = FIELD_SCHEMAS[fieldName]

  if (!schema) {
    return { isValid: false, error: `Unknown field: ${fieldName}` }
  }

  // Allow null/undefined for non-required fields
  if ((value === null || value === undefined) && !schema.required) {
    return { isValid: true }
  }

  // Check required
  if (schema.required && (value === null || value === undefined || value === '')) {
    return { isValid: false, error: `${schema.label} is required` }
  }

  const warnings = []

  // Type-specific validation
  switch (schema.type) {
    case 'string':
      if (typeof value !== 'string') {
        return { isValid: false, error: `${schema.label} must be a string` }
      }

      if (schema.validation.minLength && value.length < schema.validation.minLength) {
        return {
          isValid: false,
          error: `${schema.label} must be at least ${schema.validation.minLength} characters`
        }
      }

      if (schema.validation.maxLength && value.length > schema.validation.maxLength) {
        return {
          isValid: false,
          error: `${schema.label} cannot exceed ${schema.validation.maxLength} characters`
        }
      }

      if (schema.validation.pattern && !schema.validation.pattern.test(value)) {
        return {
          isValid: false,
          error: `${schema.label} contains invalid characters`
        }
      }

      break

    case 'number':
      if (typeof value !== 'number') {
        return { isValid: false, error: `${schema.label} must be a number` }
      }

      if (schema.validation.min !== undefined && value < schema.validation.min) {
        return { isValid: false, error: `${schema.label} cannot be less than ${schema.validation.min}` }
      }

      if (schema.validation.max !== undefined && value > schema.validation.max) {
        return { isValid: false, error: `${schema.label} cannot exceed ${schema.validation.max}` }
      }

      if (schema.validation.custom) {
        const customResult = schema.validation.custom(value)
        if (!customResult.valid) {
          return { isValid: false, error: customResult.error }
        }
      }

      break

    case 'select':
      if (schema.validation.enum && !schema.validation.enum.includes(value)) {
        return {
          isValid: false,
          error: `${schema.label} must be one of: ${schema.validation.enum.join(', ')}`
        }
      }
      break

    case 'date':
      if (!(value instanceof Date) && typeof value !== 'string') {
        return { isValid: false, error: `${schema.label} must be a valid date` }
      }

      const date = new Date(value)
      if (isNaN(date.getTime())) {
        return { isValid: false, error: `${schema.label} is not a valid date` }
      }

      break

    case 'json':
      if (typeof value !== 'object' || Array.isArray(value)) {
        return { isValid: false, error: `${schema.label} must be a JSON object` }
      }

      if (schema.validation.custom) {
        const customResult = schema.validation.custom(value)
        if (!customResult.valid) {
          return { isValid: false, error: customResult.error }
        }
      }

      break

    default:
      return { isValid: false, error: `Unknown field type: ${schema.type}` }
  }

  return { isValid: true, warnings: warnings.length > 0 ? warnings : undefined }
}

/**
 * Get UI hints for a field (for form generation)
 * @param {string} fieldName - Canonical field name
 * @returns {Object} UI configuration for form input
 */
export function getFieldUIConfig(fieldName) {
  const schema = FIELD_SCHEMAS[fieldName]
  if (!schema) return null

  return {
    type: schema.type,
    label: schema.label,
    placeholder: schema.ui?.placeholder,
    help: schema.ui?.help,
    required: schema.required,
    icon: schema.ui?.icon,
    ...schema.ui
  }
}

/**
 * Get all fields grouped by inheritance capability
 * @returns {Object} { inheritable: [], nonInheritable: [] }
 */
export function getFieldsByInheritability() {
  const inheritable = []
  const nonInheritable = []

  Object.entries(FIELD_SCHEMAS).forEach(([fieldName, schema]) => {
    const field = { fieldName, label: schema.label, required: schema.required }

    if (schema.inheritable) {
      inheritable.push(field)
    } else {
      nonInheritable.push(field)
    }
  })

  return { inheritable, nonInheritable }
}

/**
 * Get default/empty value for a field based on its type
 * @param {string} fieldName - Canonical field name
 * @returns {*} Default value (null for most types)
 */
export function getFieldDefaultValue(fieldName) {
  const schema = FIELD_SCHEMAS[fieldName]
  if (!schema) return null

  switch (schema.type) {
    case 'json':
      return {}
    case 'number':
      return 0
    case 'string':
    case 'select':
    case 'date':
    default:
      return null
  }
}

/**
 * Get schema summary for documentation
 * @returns {Object} Summary of all field schemas
 */
export function getFieldSchemasSummary() {
  const summary = {
    totalFields: Object.keys(FIELD_SCHEMAS).length,
    byType: {},
    byInheritability: { inheritable: 0, nonInheritable: 0 }
  }

  Object.values(FIELD_SCHEMAS).forEach((schema) => {
    // Count by type
    if (!summary.byType[schema.type]) {
      summary.byType[schema.type] = 0
    }
    summary.byType[schema.type]++

    // Count by inheritability
    if (schema.inheritable) {
      summary.byInheritability.inheritable++
    } else {
      summary.byInheritability.nonInheritable++
    }
  })

  return summary
}
