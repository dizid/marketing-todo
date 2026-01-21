# Contributing Guide

Welcome! This guide explains how to contribute to the Sales & Marketing Task Manager.

## Quick Links

- 📋 [Architecture Guide](./ARCHITECTURE.md) - System design and patterns
- 📝 [Task Definition Guide](./docs/TASK_DEFINITION_GUIDE.md) - How to create tasks
- ✅ [Code Review Checklist](./docs/CODE_REVIEW_CHECKLIST.md) - Quality standards
- 🐛 [Issues](https://github.com/yourrepo/issues) - Report bugs and request features

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- Supabase account (for database access)
- Grok API key (for AI features)

### Setup

```bash
# Clone repository
git clone https://github.com/yourrepo/sales.git
cd sales

# Install dependencies
npm install

# Create .env file with your keys
cp .env.example .env
# Edit .env with your credentials:
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY
# - GROK_API_KEY

# Start dev server (recommended)
netlify dev

# Open http://localhost:3000
```

### Check It Works

```bash
# Run tests
npm test

# Build for production
npm run build
```

## Project Structure

```
sales/
├── src/
│   ├── components/          # Vue components
│   ├── configs/            # Task definitions
│   ├── services/           # Business logic
│   ├── stores/             # State management (Pinia)
│   ├── utils/              # Utilities
│   └── router/             # Routing
├── docs/                   # Documentation
├── netlify/functions/      # Serverless functions
├── ARCHITECTURE.md         # System design
└── CONTRIBUTING.md         # This file
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed structure.

## Types of Contributions

### 🆕 Adding a New Task

**Estimated time:** 15 minutes

1. **Create config** - Define form fields and AI generation
   - Location: `src/components/TaskMiniApps/configs/[taskId].config.js`
   - Reference: [Task Definition Guide](./docs/TASK_DEFINITION_GUIDE.md)

2. **Create wrapper** - Connect config to MiniAppShell
   - Location: `src/components/TaskMiniApps/[TaskNameMiniApp].vue`
   - Template: Use existing mini-apps as reference

3. **Register mini-app** - Add to registry
   - Location: `src/components/TaskMiniApps/core/miniAppRegistry.js`

4. **Update task registry** - Point to new mini-app
   - Location: `src/services/taskRegistry.js`

5. **Test thoroughly** - See Testing section

6. **Submit PR** - Follow [Code Review Checklist](./docs/CODE_REVIEW_CHECKLIST.md)

### 🐛 Fixing a Bug

1. Create issue if it doesn't exist
2. Create branch: `git checkout -b fix/issue-description`
3. Write code
4. Add test if applicable
5. Submit PR with issue reference

### ✨ Improving Performance/UX

1. Discuss in issue first (for major changes)
2. Create branch: `git checkout -b improve/description`
3. Make changes
4. Benchmark before/after
5. Submit PR with metrics

### 📚 Improving Documentation

1. Create branch: `git checkout -b docs/description`
2. Update markdown files
3. Submit PR

## Development Workflow

### 1. Create Branch

```bash
# For new features
git checkout -b feature/description

# For bug fixes
git checkout -b fix/issue-123

# For improvements
git checkout -b improve/performance

# For docs
git checkout -b docs/section
```

### 2. Make Changes

- Follow existing code patterns
- Reference [ARCHITECTURE.md](./ARCHITECTURE.md)
- Check [Code Review Checklist](./docs/CODE_REVIEW_CHECKLIST.md)

### 3. Test Locally

```bash
# Start dev server
npm run dev

# Test your changes manually:
# - Does the form render?
# - Does validation work?
# - Does AI generation work?
# - Do results save?
# - Do results persist after reload?
```

### 4. Commit Changes

```bash
# Write clear commit message
git add .
git commit -m "feat: Add new task definition for feature requests

This adds the feedback-1 task which allows users to collect
and categorize customer feature requests via AI analysis.

Includes:
- New mini-app config with form fields
- AI prompt for analyzing requests
- Response parser for structured output
- Component wrapper and registration

Closes #42"
```

**Commit message format:**
```
<type>: <subject>

<body>

<footer>
```

- `type`: feat, fix, docs, style, refactor, perf, test
- `subject`: Present tense, lowercase, no period
- `body`: Explain what and why
- `footer`: Reference issues (Closes #123)

### 5. Submit Pull Request

**PR Title:** Clear and descriptive
```
feat: Add feedback collection task (feedback-1)
fix: Prevent duplicate form submissions
docs: Add task definition examples
```

**PR Description:** Use template:
```markdown
## What Changed
- Description of changes
- Why this was needed

## How to Test
1. Step 1
2. Step 2
3. Verify behavior

## Checklist
- [ ] Code follows style guide
- [ ] No console errors
- [ ] Manual testing done
- [ ] Documentation updated
- [ ] Tests added/updated
```

## Code Style

### Vue Files

```vue
<template>
  <div class="space-y-4">
    <!-- Component content -->
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Props at top
const props = defineProps({
  taskConfig: {
    type: Object,
    required: true
  }
})

// Emits at top
const emit = defineEmits(['save'])

// State
const formData = ref({})

// Computed
const isValid = computed(() => {
  return formData.value.name?.length > 0
})

// Methods
const handleSubmit = () => {
  emit('save', formData.value)
}
</script>

<style scoped>
/* Tailwind classes preferred over scoped styles */
</style>
```

### JavaScript Files

```javascript
/**
 * Service description
 * @param {Type} param - Parameter description
 * @returns {Type} Return description
 */
export function exampleFunction(param) {
  // Implementation
  return result
}
```

### Naming

- Variables/functions: `camelCase`
- Components: `PascalCase`
- Files: `kebab-case.vue`
- Constants: `UPPER_CASE`
- Field IDs: `snake_case`
- Config IDs: `category-number` (e.g., `social-1`)

## Testing

### Manual Testing Checklist

For every new/modified task:

- [ ] Form renders without errors
- [ ] All fields accept input correctly
- [ ] Required field validation works
- [ ] Optional fields are optional
- [ ] Custom validators work
- [ ] AI generation succeeds
- [ ] Response parsing works
- [ ] Results display correctly
- [ ] Results save to Pinia store
- [ ] Results persist to Supabase
- [ ] Can reload page and data is still there
- [ ] Edit/delete results works
- [ ] Export to CSV works
- [ ] Copy to clipboard works
- [ ] Works on mobile (if applicable)

### Automated Tests

```bash
# Run all tests (378 tests)
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

## Common Patterns

### Adding a Simple Form Task

```javascript
// configs/collectFeedback.config.js
export const collectFeedbackConfig = {
  id: 'feedback-1',
  title: 'Collect Customer Feedback',
  description: 'Gather structured feedback from customers',

  formFields: [
    {
      id: 'feedback_type',
      type: 'select',
      label: 'Type',
      options: [
        { value: 'bug', label: 'Bug Report' },
        { value: 'feature', label: 'Feature Request' }
      ]
    },
    {
      id: 'description',
      type: 'textarea',
      label: 'Description',
      required: true
    }
  ],

  showOutput: true
}
```

### Adding an AI Generation Task

```javascript
// configs/generateBlog.config.js
export const generateBlogConfig = {
  id: 'content-1',
  title: 'Generate Blog Post',

  formFields: [
    { id: 'topic', type: 'text', label: 'Topic', required: true },
    { id: 'audience', type: 'textarea', label: 'Target Audience' },
    { id: 'length', type: 'select', label: 'Length', options: [...] }
  ],

  aiConfig: {
    promptTemplate: `Write a blog post about {topic} for {audience}...`,
    temperature: 0.7,
    maxTokens: 2000,
    parseResponse: (raw) => raw // Or parse into structured format
  },

  showOutput: true
}
```

## Debugging

### View Console Logs

```bash
# Start dev server
npm run dev

# Open DevTools (F12) → Console tab
# Look for prefixed logs like [MiniAppShell], [AIPanel], [AIGeneration]
```

### Check Store State

```javascript
// In browser console
import { useProjectStore } from './stores/projectStore'
const store = useProjectStore()
console.log(store.currentProject)
console.log(store.getTaskData('task-id'))
```

### Supabase Issues

```bash
# Check Supabase logs
# Go to Supabase dashboard → Logs

# Check network requests
# DevTools → Network tab → Filter by grok-proxy or Supabase calls
```

### AI Generation Issues

```javascript
// Look for logs with [AIGeneration] prefix
// Check browser console for error details
// Verify GROK_API_KEY is set in .env
// Verify Netlify function is running (check /netlify/functions/)
```

## Getting Help

### Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - How the app works
- [Task Definition Guide](./docs/TASK_DEFINITION_GUIDE.md) - How to create tasks
- [Code Review Checklist](./docs/CODE_REVIEW_CHECKLIST.md) - Quality standards

### Ask Questions

- **In PRs:** Comment on specific lines
- **In Issues:** Start a discussion
- **In Code:** Add helpful comments
- **In Commits:** Write clear messages

## Code of Conduct

Be respectful, inclusive, and constructive:

- ✅ Help others learn
- ✅ Ask clarifying questions
- ✅ Acknowledge mistakes
- ✅ Welcome feedback
- ❌ No harassment, discrimination, or abuse

## Release Process

Releases follow semantic versioning:

- **Major** (1.0.0): Breaking changes
- **Minor** (1.1.0): New features, backward compatible
- **Patch** (1.1.1): Bug fixes

## Performance Tips

### Development

```bash
# Start dev server with faster rebuilds
npm run dev

# Monitor bundle size
npm run build
```

### Code

- Use `computed` for derived state
- Avoid unnecessary watchers
- Lazy-load components if heavy
- Debounce API calls
- Cache expensive operations

## Accessibility

- Use semantic HTML
- Provide alt text for images
- Test with keyboard navigation
- Check color contrast
- Label form fields properly

## Documentation Standards

### Comments
```javascript
// Good: Explains why
const timeout = 5000  // Allow 5 seconds for slow networks

// Avoid: Explains what (obvious from code)
const x = 5000  // Set x to 5000
```

### Commit Messages
```
✅ Good:
feat: Add email validation to contact forms
This prevents submission of invalid emails and improves data quality.

❌ Avoid:
updated things
fixed bugs
changes
```

### PR Descriptions
```
✅ Good:
## What
Added email field validation

## Why
Currently invalid emails are accepted, causing bounce issues

## How to test
1. Submit form with invalid email
2. Verify error message appears
3. Fix email and resubmit

❌ Avoid:
Added stuff
```

## Where to Get Help

- **Technical Questions:** Open an issue
- **Architecture Questions:** Refer to ARCHITECTURE.md
- **Task Definitions:** See Task Definition Guide
- **Code Review:** Check Code Review Checklist
- **Bugs:** Open an issue with reproduction steps

## Celebrating Contributions

We appreciate all contributions! When your PR is merged:

- 🎉 It becomes part of the main codebase
- 📦 It's included in the next release
- ✨ You're added to contributors (if desired)
- 🙏 We say thank you!

---

**Questions?** Open an issue or start a discussion!

Happy coding! 🚀
