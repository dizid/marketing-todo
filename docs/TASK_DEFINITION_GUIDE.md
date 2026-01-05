# Task Definition Guide

This guide shows how to define tasks in the Sales & Marketing app using configurations instead of writing Vue components.

## Overview

The app has **33 marketing tasks** across 10 categories, implemented as mini-apps:

| Category | Tasks | Examples |
|----------|-------|----------|
| Setup | 5 | Define Audience, Landing Page Creator |
| Social Media | 3 | Generate Posts, Engage Followers |
| Content Creation | 3 | Write Blog, Video Script |
| Lead Acquisition | 3 | Community Posts, Outreach |
| Feedback & Iteration | 3 | Collect Feedback, Iterate Features |
| Analytics & Optimization | 3 | Setup Analytics, ROI Calculator |
| Advertising | 2 | Paid Ads Launch, Paid Ads Optimize |
| Sales & Revenue | 5 | Offer Builder, Objection Handling |
| Growth & Positioning | 5 | Lead Magnet, Competitor Analysis |
| Strategy | 1 | Competitive Positioning Brief |

### Architecture

Tasks are implemented using two main systems:

1. **Unified Task Configs** (`src/configs/unifiedTasks.js`) - Central registry of all 33 task definitions with form fields, AI prompts, and metadata.

2. **Mini-App Components** (`src/components/TaskMiniApps/`) - 25 Vue components that provide enhanced UX beyond simple forms (wizards, calculators, multi-step flows).

### Task Types

- **Config-driven** - Simple form + AI generation, rendered by MiniAppShell
- **Custom mini-app** - Complex UX (wizards, multi-tab, interactive tools)

---

## Quick Start

Tasks are defined as JavaScript objects in a **configuration file**. Once defined, they automatically render through the mini-app framework with no additional component code needed.

### 30-Second Example

```javascript
// src/components/TaskMiniApps/configs/defineGoals.config.js
export const defineGoalsConfig = {
  id: 'setup-2',
  title: 'Define Business Goals',
  description: 'Set specific, measurable goals for your marketing efforts',

  // Form fields users fill out
  formFields: [
    {
      id: 'revenue_target',
      type: 'number',
      label: 'Monthly Revenue Target',
      min: 100,
      suffix: 'USD'
    },
    {
      id: 'time_frame',
      type: 'select',
      label: 'Time Frame',
      options: [
        { value: '30d', label: '30 days' },
        { value: '90d', label: '90 days' },
        { value: '1y', label: '1 year' }
      ],
      required: true
    }
  ],

  // AI generation config
  aiConfig: {
    promptTemplate: 'Create actionable steps to reach ${revenue_target} in {time_frame}',
    temperature: 0.7,
    maxTokens: 1500
  },

  showOutput: true,
  exportFilename: 'business-goals'
}
```

Then create the wrapper:

```vue
<!-- src/components/TaskMiniApps/DefineGoalsMiniApp.vue -->
<template>
  <MiniAppShell :task-config="config" :task-data="taskData" @save="saveTask" />
</template>

<script setup>
import { computed } from 'vue'
import { useProjectStore } from '../../stores/projectStore'
import MiniAppShell from './core/MiniAppShell.vue'
import { defineGoalsConfig } from './configs/defineGoals.config'

const store = useProjectStore()
const config = computed(() => defineGoalsConfig)
const taskData = computed(() => store.getTaskData('setup-2') || {})

const saveTask = (data) => {
  store.saveTaskData('setup-2', data)
}
</script>
```

That's it! No form HTML, no validation logic, no AI handling needed.

---

## Complete Task Definition Reference

### Part 1: Metadata

```javascript
export const exampleTaskConfig = {
  // REQUIRED: Unique task identifier (used in routing & data storage)
  id: 'setup-1',

  // REQUIRED: Display title shown to user
  title: 'Define Target Audience',

  // OPTIONAL: Help text describing the task
  description: 'Create detailed buyer personas and define your target market',

  // OPTIONAL: Category for grouping (setup|social|content|acquisition|feedback|analytics)
  category: 'setup',

  // ... rest of config
}
```

---

### Part 2: Form Fields

Define what inputs the user sees:

```javascript
formFields: [
  // TEXT INPUT
  {
    id: 'company_name',           // Used in data model
    type: 'text',                 // Input type
    label: 'Company Name',        // Display label
    placeholder: 'e.g., Acme Inc',
    description: 'Your company\'s legal name',
    required: true,               // Mark with asterisk

    // Optional: Custom validation
    validate: (value) => {
      if (value.length < 2) return 'Name must be at least 2 characters'
      return true  // Valid
    }
  },

  // NUMBER INPUT
  {
    id: 'monthly_budget',
    type: 'number',
    label: 'Monthly Budget',
    min: 100,
    max: 100000,
    suffix: 'USD',              // Shown to the right
    placeholder: '5000',
    required: true
  },

  // TEXTAREA (Multi-line text)
  {
    id: 'pain_points',
    type: 'textarea',
    label: 'Customer Pain Points',
    placeholder: 'What problems do your customers face?',
    rows: 4,                    // Height in lines
    description: 'List the top 3-5 pain points',
    required: true
  },

  // SELECT (Dropdown)
  {
    id: 'industry',
    type: 'select',
    label: 'Industry',
    options: [
      { value: 'saas', label: 'SaaS / Software' },
      { value: 'ecommerce', label: 'E-commerce' },
      { value: 'services', label: 'Services' }
    ],
    required: true
  },

  // CHECKBOXES (Multiple selection)
  {
    id: 'platforms',
    type: 'checkboxes',
    label: 'Target Platforms',
    options: [
      { value: 'twitter', label: 'Twitter / X' },
      { value: 'linkedin', label: 'LinkedIn' },
      { value: 'instagram', label: 'Instagram' },
      { value: 'facebook', label: 'Facebook' }
    ],
    required: true,
    description: 'Select all platforms where your audience is active'
  },

  // RADIO (Single selection from group)
  {
    id: 'time_commitment',
    type: 'radio',
    label: 'Content Creation Frequency',
    options: [
      { value: 'daily', label: 'Daily' },
      { value: 'weekly', label: '3-4x per week' },
      { value: 'biweekly', label: 'Bi-weekly' },
      { value: 'monthly', label: 'Monthly' }
    ],
    required: false
  }
]
```

### Field Types Summary

| Type | Input | Use Case | Validation |
|------|-------|----------|-----------|
| `text` | Single line | Names, IDs, short values, emails, URLs | Custom via `validate()` |
| `number` | Number spinner | Quantities, amounts, budgets | Min/max constraints |
| `textarea` | Multi-line | Long descriptions, content, notes | Custom via `validate()` |
| `select` | Dropdown | Single choice from list | Option validation |
| `checkboxes` | Checkboxes | Multiple selections (returns array) | Min/max count validation |
| `radio` | Radio buttons | Single choice, visible options | Option validation |

> **Note**: Only these 6 field types are implemented in the form renderer. For email or URL validation, use the `text` type with a custom `validate()` function.

### Common Field Properties

All field types support these properties:

```javascript
{
  id: 'field_id',              // Required: unique identifier (snake_case)
  type: 'text',                // Required: one of the 6 supported types
  label: 'Display Label',      // Required: shown to user
  description: 'Help text',    // Optional: shown below field
  placeholder: 'Example...',   // Optional: placeholder text
  required: true,              // Optional: adds asterisk, enforces validation
  tooltip: 'More info...',     // Optional: hover tooltip
  example: 'Sample value',     // Optional: example value for reference
}
```

**Type-specific properties:**

| Type | Additional Properties |
|------|----------------------|
| `text` | `maxLength` |
| `number` | `min`, `max`, `suffix` (displayed after input) |
| `textarea` | `rows` (default: 3) |
| `select` | `options` (array of `{value, label}`) |
| `checkboxes` | `options` (array of `{value, label}`) |
| `radio` | `options` (array of `{value, label}`) |

---

### Part 3: AI Generation Configuration

Configure AI-powered content generation:

```javascript
aiConfig: {
  // REQUIRED: Template with {placeholder} syntax
  promptTemplate: `Based on the following audience:

Audience: {audience_overview}
Industry: {industry}
Pain Points: {pain_points}

Generate:
1. A detailed buyer persona
2. Top 3 messaging angles
3. Recommended channels

Keep response concise and actionable.`,

  // OPTIONAL: Control AI creativity (0-1, default 0.8)
  // Lower = more consistent, Higher = more creative
  temperature: 0.8,

  // OPTIONAL: Max tokens in response (default 2000)
  maxTokens: 1500,

  // OPTIONAL: Provide additional context
  contextProvider: () => {
    // This function is called before generation
    // Return object with additional placeholder values
    return {
      app_description: localStorage.getItem('appDescription') || '',
      company_name: localStorage.getItem('companyName') || ''
    }
  },

  // OPTIONAL: Transform raw AI response into structured data
  parseResponse: (rawText) => {
    // Raw text from AI API
    // Parse it into whatever format makes sense for your task

    // Example: Split into lines and create objects
    const lines = rawText.split('\n').filter(l => l.trim())
    return lines.map(line => ({
      content: line,
      timestamp: new Date().toISOString()
    }))

    // Or return original text if no parsing needed
    // return rawText
  },

  // OPTIONAL: Validate parsed response
  validateResponse: (parsed) => {
    if (!parsed || parsed.length === 0) {
      return 'AI generation resulted in empty output'
    }
    return true  // Valid
  }
}
```

### Template Placeholders

Placeholders in `promptTemplate` are automatically replaced:

```javascript
// All form field IDs become placeholders
formFields: [
  { id: 'audience_overview', ... }
  { id: 'industry', ... }
]

promptTemplate: `Based on {audience_overview} in {industry}...`
// {audience_overview} → value from form field 'audience_overview'
// {industry} → value from form field 'industry'
```

### Context Provider

Inject data from elsewhere (localStorage, Pinia store, etc.):

```javascript
contextProvider: () => {
  // Return an object - keys become placeholders
  return {
    app_description: 'From app config',
    company_name: 'From user settings',
    quarter: 'Q4'
  }
}

// In template:
promptTemplate: `{company_name} in {quarter} focused on {app_description}...`
```

### Response Parsing Example

**AI returns raw text:**
```
Post 1: Great new feature released
Post 2: Join us for webinar Thursday
Post 3: Customer success story
```

**Parse into structured data:**
```javascript
parseResponse: (raw) => {
  const posts = raw.split('\n')
    .filter(line => line.trim())
    .map((line, index) => ({
      id: index + 1,
      content: line.replace(/^Post \d+: /, ''),
      created: new Date().toISOString()
    }))

  return posts  // Now it's structured data, not raw text
}
```

---

### Part 4: Output Configuration

Control how results are displayed:

```javascript
showOutput: true,                     // Show results section?
exportFilename: 'audience-personas',  // File name for export

// OPTIONAL: Custom display format
outputFormat: 'text',   // text (default), list, table, custom

// Results are automatically:
// - Displayed in OutputSection
// - Editable (by user)
// - Deletable
// - Copyable to clipboard
// - Exportable to CSV/JSON
```

---

## Real-World Examples

### Example 1: Simple Form (No AI)

*Define Goals Task* - Just a form to collect user input:

```javascript
export const defineGoalsConfig = {
  id: 'setup-2',
  title: 'Define Business Goals',
  description: 'Set measurable targets for your campaign',

  formFields: [
    {
      id: 'revenue_target',
      type: 'number',
      label: 'Revenue Target',
      min: 1000,
      suffix: 'USD',
      required: true
    },
    {
      id: 'customer_count',
      type: 'number',
      label: 'New Customers',
      min: 1,
      required: true
    },
    {
      id: 'deadline',
      type: 'text',
      label: 'Deadline',
      placeholder: 'e.g., End of Q4',
      required: true
    }
  ],

  // No aiConfig - no AI generation needed
  showOutput: false
}
```

### Example 2: Form + AI Generation

*Generate Social Posts* - Form inputs feed into AI generation:

```javascript
export const generatePostsConfig = {
  id: 'social-1',
  title: 'Generate Social Media Posts',

  formFields: [
    {
      id: 'platforms',
      type: 'checkboxes',
      label: 'Select Platforms',
      options: [
        { value: 'twitter', label: 'X / Twitter' },
        { value: 'linkedin', label: 'LinkedIn' },
        { value: 'instagram', label: 'Instagram' }
      ],
      required: true
    },
    {
      id: 'tone',
      type: 'select',
      label: 'Tone',
      options: [
        { value: 'professional', label: 'Professional' },
        { value: 'casual', label: 'Casual' },
        { value: 'humorous', label: 'Humorous' }
      ],
      required: true
    },
    {
      id: 'content_focus',
      type: 'textarea',
      label: 'What to write about',
      rows: 3,
      required: true
    },
    {
      id: 'post_count',
      type: 'number',
      label: 'Posts per platform',
      min: 1,
      max: 10,
      placeholder: '3'
    }
  ],

  aiConfig: {
    promptTemplate: `Generate exactly {post_count} {tone} posts for {platforms}.
Topic: {content_focus}

Format each post clearly separated by ---.
Platform-specific character limits:
- Twitter: max 280 chars
- LinkedIn: professional, no char limit
- Instagram: add 3-5 hashtags

Make them engaging and ready to post.`,

    temperature: 0.8,
    maxTokens: 2500,

    parseResponse: (raw) => {
      // Parse raw posts into structured format
      const posts = raw.split('---')
        .map(p => p.trim())
        .filter(p => p.length > 0)
        .map(p => ({ content: p }))

      return posts
    }
  },

  showOutput: true,
  exportFilename: 'social-posts'
}
```

### Example 3: With Validation

*Collect Feedback* - Custom validation logic:

```javascript
export const collectFeedbackConfig = {
  id: 'feedback-1',
  title: 'Collect Customer Feedback',

  formFields: [
    {
      id: 'feedback_type',
      type: 'select',
      label: 'Type of Feedback',
      options: [
        { value: 'bug', label: 'Bug Report' },
        { value: 'feature', label: 'Feature Request' },
        { value: 'usability', label: 'Usability' },
        { value: 'other', label: 'Other' }
      ],
      required: true
    },
    {
      id: 'feedback_text',
      type: 'textarea',
      label: 'Feedback Details',
      rows: 5,
      required: true,
      validate: (value) => {
        // Custom validation: at least 20 characters
        if (value.length < 20) {
          return 'Please provide at least 20 characters of feedback'
        }
        return true
      }
    },
    {
      id: 'reporter_email',
      type: 'text',
      label: 'Your Email',
      placeholder: 'email@example.com',
      required: false,
      description: 'Optional: for follow-up',
      validate: (value) => {
        // Custom email validation
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address'
        }
        return true
      }
    },
    {
      id: 'priority',
      type: 'radio',
      label: 'Priority',
      options: [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'critical', label: 'Critical' }
      ]
    }
  ],

  // No AI - just storing structured feedback
  showOutput: true,
  exportFilename: 'customer-feedback'
}
```

---

## Advanced Patterns

### Conditional Field Visibility

```javascript
{
  id: 'follow_up_method',
  type: 'select',
  label: 'Follow-up Method',
  options: [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone Call' },
    { value: 'meeting', label: 'Meeting' }
  ],

  // Show only if feedback_type is 'urgent'
  visibleIf: (formData) => formData.feedback_type === 'urgent'
}
```

### Dependent Data

```javascript
aiConfig: {
  promptTemplate: `For {audience_segment}, create {content_type} content...`,

  // Provide additional context based on current data
  contextProvider: () => {
    // Could fetch from API, derive from store, etc.
    const plan = getPlanFromStore()
    const limits = getUsageLimits()

    return {
      max_words: limits[plan].maxWords,
      brand_voice: plan.brandGuidelines.voice
    }
  }
}
```

### Multi-Step Response Parsing

```javascript
parseResponse: (raw) => {
  // Step 1: Clean up raw text
  const cleaned = raw
    .split('\n')
    .filter(l => l.trim())
    .map(l => l.trim())

  // Step 2: Group into sections
  const sections = {}
  let current = null

  for (const line of cleaned) {
    if (line.startsWith('##')) {
      current = line.replace(/^#+\s*/, '')
      sections[current] = []
    } else if (current) {
      sections[current].push(line)
    }
  }

  // Step 3: Transform into structured data
  return Object.entries(sections).map(([title, items]) => ({
    title,
    items,
    count: items.length
  }))
}
```

---

## Migration Checklist

When migrating a task from legacy component to new config system:

- [ ] Create config file in `src/components/TaskMiniApps/configs/`
- [ ] Extract form fields from old component HTML
- [ ] Extract AI prompt from old component
- [ ] Create response parser if needed
- [ ] Create mini-app wrapper component
- [ ] Register in `miniAppRegistry.js`
- [ ] Update `taskRegistry.js` to use mini-app
- [ ] Test form rendering
- [ ] Test form validation
- [ ] Test AI generation
- [ ] Test result saving
- [ ] Test result persistence to Supabase
- [ ] Delete old legacy component

---

## Troubleshooting

### Form fields not showing

- Check `formFields` is array
- Verify field `type` is valid
- Check field `id` is unique
- Verify MiniAppShell is imported

### Validation not working

- Ensure `required: true` is set
- Check custom `validate()` function returns true or string
- Verify field type matches validation logic

### AI generation fails

- Check `promptTemplate` has valid placeholders
- Verify `GROK_API_KEY` environment variable is set
- Look at browser console for detailed error
- Check Netlify function is running (`npm run dev`)

### Results not saving

- Verify `saveTask()` is called in wrapper component
- Check Pinia store has `saveTaskData()` method
- Look at browser console for store errors
- Check Supabase connection string

---

## Best Practices

✅ **DO:**
- Keep field `id` snake_case and descriptive
- Provide `description` for complex fields
- Include `placeholder` examples
- Test with various data inputs
- Document custom validators
- Use consistent naming across similar tasks

❌ **DON'T:**
- Use identical labels for different field purposes
- Create field IDs with spaces or special chars
- Write overly complex AI prompts
- Forget to handle empty responses in parser
- Skip validation on required fields
- Leave configs undocumented

---

## Business Context System

Tasks automatically receive business context from the 7-tier system stored in `projectStore`:

| Tier | Data | Auto-Injected |
|------|------|---------------|
| 1 | Business & Product | Company name, product description, industry |
| 2 | Market & Audience | Customer profiles, pain points, personas |
| 3 | Brand Identity | Voice, tone, visual style guidelines |
| 4 | Goals & Metrics | KPIs, targets, timelines |
| 5 | Marketing Channels | Active platforms, email list, followers |
| 6 | Content Library | Past content, templates, brand assets |
| 7 | Integrations | Connected tools (Stripe, analytics, etc.) |

**How it works:**
- AI prompts automatically receive relevant context from the project store
- No need to manually specify `contextProvider` in most cases
- Form fields can map to canonical context fields for data inheritance

---

## Questions?

Refer to:
- [FEATURES.md](../FEATURES.md) - Complete feature documentation
- [CODE_REVIEW_CHECKLIST.md](./CODE_REVIEW_CHECKLIST.md) - Review criteria
- Example configs in `src/configs/` (unified task definitions)
- Example mini-apps in `src/components/TaskMiniApps/`
- Task registry in `src/services/taskRegistry.js`
