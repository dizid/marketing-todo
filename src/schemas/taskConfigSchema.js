/**
 * Unified Task Configuration Schema
 *
 * This schema defines the structure for ALL task types.
 * Instead of writing new Vue components for each task, we define tasks as JSON configs
 * that conform to this schema. A single UnifiedTaskComponent renders any task based on its config.
 */

export const taskConfigSchema = {
  id: 'string (required, unique task identifier)',
  name: 'string (required, display name)',
  description: 'string (optional, task description)',
  category: 'string (optional, category grouping)',

  // Form configuration
  form: [
    {
      id: 'string (required, field identifier)',
      type: 'text|textarea|number|select|checkboxes|radio (required)',
      label: 'string (required, field label)',
      placeholder: 'string (optional)',
      description: 'string (optional, help text)',
      required: 'boolean (optional, default false)',

      // For number inputs
      min: 'number (optional)',
      max: 'number (optional)',
      suffix: 'string (optional, e.g., "users to acquire")',

      // For textarea
      rows: 'number (optional, default 3)',

      // For select, checkboxes, radio
      options: [
        { value: 'string', label: 'string' }
      ],

      // Optional: conditional visibility
      visibleIf: 'function(formData) => boolean (optional)',

      // Optional: validation function
      validate: 'function(value) => true|string (optional, string = error message)'
    }
  ],

  // AI generation configuration
  ai: {
    enabled: 'boolean (optional, default true)',

    systemPrompt: 'string (optional, system context for AI)',

    // Template with {field} placeholders that get replaced with form values
    template: 'string (required if ai.enabled)',

    // Temperature and token limits
    temperature: 'number (optional, 0-1, default 0.8)',
    maxTokens: 'number (optional, default 2000)',

    // Optional: provide additional context from elsewhere
    contextProvider: 'function() => object (optional)',

    // Optional: parse AI response into structured format
    responseParser: 'function(responseText) => object|array|string (optional)',

    // Optional: validation for parsed response
    validateResponse: 'function(parsed) => true|string (optional)',

    // Optional: display config for AI output
    outputFormat: 'string (list|text|table|custom, optional, default text)'
  },

  // Output/results configuration
  output: {
    enabled: 'boolean (optional, default true)',
    exportFilename: 'string (optional, for CSV/JSON export)',

    // How to display results
    displayFormat: 'list|table|text|custom (optional)',

    // What actions are available
    editable: 'boolean (optional, can user edit results)',
    deletable: 'boolean (optional, can user delete results)',
    exportable: 'boolean (optional, can user export results)',
    copyable: 'boolean (optional, can user copy results)'
  }
}

/**
 * Example Usage:
 *
 * export const defineAudienceTask = {
 *   id: 'define-audience',
 *   name: 'Define Target Audience',
 *   description: 'Create buyer personas...',
 *
 *   form: [
 *     {
 *       id: 'audience_overview',
 *       type: 'textarea',
 *       label: 'Target Audience Overview',
 *       placeholder: 'Describe your target audience...',
 *       required: true,
 *       rows: 3
 *     },
 *     // ... more fields
 *   ],
 *
 *   ai: {
 *     template: `Based on this audience: {audience_overview}\n...`,
 *     temperature: 0.8,
 *     maxTokens: 1500,
 *     responseParser: (response) => {
 *       // Parse into structured format
 *       return response
 *     }
 *   },
 *
 *   output: {
 *     exportFilename: 'audience-personas',
 *     editable: true,
 *     displayFormat: 'text'
 *   }
 * }
 */
