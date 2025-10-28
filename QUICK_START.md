# Quick Start Guide

Fast reference for the most common tasks.

## 🚀 Get Up and Running

```bash
# 1. Install dependencies
npm install

# 2. Set up environment (copy and edit)
cp .env.example .env

# 3. Start dev server
npm run dev

# 4. Open browser
# → http://localhost:5173
```

---

## ➕ Add a New Task (15 minutes)

### 1. Create Config
**File:** `src/components/TaskMiniApps/configs/[taskId].config.js`

```javascript
export const [taskId]Config = {
  id: 'category-N',                    // e.g., 'social-2'
  title: 'Task Name',
  description: 'What does this task do?',

  formFields: [
    { id: 'field1', type: 'text', label: 'Field Label', required: true }
  ],

  // Optional: For AI generation
  aiConfig: {
    promptTemplate: 'Based on {field1}...',
    temperature: 0.8,
    maxTokens: 2000
  },

  showOutput: true,
  exportFilename: 'task-results'
}
```

### 2. Create Wrapper
**File:** `src/components/TaskMiniApps/[TaskNameMiniApp].vue`

```vue
<template>
  <MiniAppShell :task-config="config" :task-data="taskData" @save="saveTask" />
</template>

<script setup>
import { computed } from 'vue'
import { useProjectStore } from '../../stores/projectStore'
import MiniAppShell from './core/MiniAppShell.vue'
import { [taskId]Config } from './configs/[taskId].config'

const store = useProjectStore()
const config = computed(() => [taskId]Config)
const taskData = computed(() => store.getTaskData('[category-N]') || {})

const saveTask = (data) => {
  store.saveTaskData('[category-N]', data)
}
</script>
```

### 3. Register
**File:** `src/components/TaskMiniApps/core/miniAppRegistry.js`

```javascript
import [TaskNameMiniApp] from '../[TaskNameMiniApp].vue'

export const miniAppRegistry = {
  '[category-N]': [TaskNameMiniApp],
  // ... existing apps
}
```

### 4. Update Task Registry
**File:** `src/services/taskRegistry.js`

```javascript
import { miniAppRegistry } from '../components/TaskMiniApps/core/miniAppRegistry'

export function getTaskComponent(taskId) {
  const miniAppComponent = miniAppRegistry[taskId]
  if (miniAppComponent) return miniAppComponent
  return componentMap[taskId]  // Legacy fallback
}
```

---

## 📝 Form Field Types

```javascript
// Text input
{ id: 'name', type: 'text', label: 'Name' }

// Email input
{ id: 'email', type: 'email', label: 'Email' }

// Number input
{ id: 'count', type: 'number', label: 'Count', min: 1, max: 100 }

// Textarea
{ id: 'bio', type: 'textarea', label: 'Bio', rows: 4 }

// Dropdown
{ id: 'role', type: 'select', label: 'Role',
  options: [
    { value: 'admin', label: 'Administrator' },
    { value: 'user', label: 'User' }
  ]
}

// Checkboxes (multiple selection)
{ id: 'interests', type: 'checkboxes', label: 'Interests',
  options: [
    { value: 'tech', label: 'Technology' },
    { value: 'sports', label: 'Sports' }
  ]
}

// Radio buttons
{ id: 'frequency', type: 'radio', label: 'Frequency',
  options: [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' }
  ]
}
```

---

## 🤖 AI Generation

### Prompt Template

Use `{field_id}` placeholders that get replaced with form values:

```javascript
aiConfig: {
  promptTemplate: `Create content based on:
- Topic: {topic}
- Audience: {audience}
- Tone: {tone}

Include 3 examples.`,

  temperature: 0.8,        // 0 = consistent, 1 = creative
  maxTokens: 2000,         // Max response length
}
```

### Parse Response

Transform raw AI text into structured data:

```javascript
parseResponse: (raw) => {
  const lines = raw.split('\n').filter(l => l.trim())
  return lines.map(line => ({ content: line }))
}
```

### Add Context

Provide data from elsewhere (localStorage, store, etc.):

```javascript
contextProvider: () => ({
  app_name: localStorage.getItem('appName'),
  company: localStorage.getItem('company')
})
```

---

## ✅ Validation

### Built-in Validators

```javascript
import {
  validateRequired,
  validateEmail,
  validateNumber,
  validateForm
} from '@/utils/formValidation'

// Validate entire form
const errors = validateForm(formData, fields)

// Check specific field
const emailError = validateEmail(email)
```

### Custom Validation

```javascript
{
  id: 'username',
  type: 'text',
  label: 'Username',
  validate: (value) => {
    if (value.length < 3) return 'At least 3 characters'
    if (!/^[a-z0-9]+$/.test(value)) return 'Letters and numbers only'
    return true
  }
}
```

---

## 🔍 Debugging

### Check Form State
```javascript
// In browser console
import { useProjectStore } from './stores/projectStore'
const store = useProjectStore()
console.log(store.getTaskData('task-id'))
```

### View AI Generation Logs
```javascript
// Look in DevTools Console for prefixed logs:
// [AIGeneration]
// [MiniAppShell]
// [AIPanel]
```

### Verify Grok API
```javascript
// Check in .env that GROK_API_KEY is set:
cat .env | grep GROK_API_KEY

// Should show: GROK_API_KEY=xai-...
```

---

## 📚 Key Files

| File | Purpose |
|------|---------|
| `ARCHITECTURE.md` | System design & patterns |
| `docs/TASK_DEFINITION_GUIDE.md` | How to create tasks |
| `docs/CODE_REVIEW_CHECKLIST.md` | Code review standards |
| `CONTRIBUTING.md` | How to contribute |
| `src/services/aiGeneration.js` | AI generation service |
| `src/utils/formValidation.js` | Validation utilities |
| `src/components/TaskMiniApps/core/MiniAppShell.vue` | Core orchestrator |

---

## 🧪 Manual Testing Checklist

- [ ] Form renders without errors
- [ ] All fields accept input
- [ ] Required field validation works
- [ ] AI generation succeeds (if task has AI)
- [ ] Results display correctly
- [ ] Results save to store
- [ ] Page reload → data persists
- [ ] Export works (if applicable)

---

## 🔗 Important URLs

- **Local Dev:** http://localhost:5173
- **Documentation:** See links below

---

## 📖 Learning Path

1. **Understand the architecture** → Read [ARCHITECTURE.md](./ARCHITECTURE.md) (15 min)
2. **Learn to create tasks** → Read [Task Definition Guide](./docs/TASK_DEFINITION_GUIDE.md) (10 min)
3. **Set up for success** → Read [CONTRIBUTING.md](./CONTRIBUTING.md) (5 min)
4. **Code review standards** → Check [Code Review Checklist](./docs/CODE_REVIEW_CHECKLIST.md) before PR

---

## ⚡ Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview build
npm run preview
```

---

## 🆘 Help

| Issue | Solution |
|-------|----------|
| "API error 500" | Check `GROK_API_KEY` in `.env` |
| Form not showing | Check `formFields` is array |
| AI not working | Check Netlify function running (`npm run dev`) |
| Data not saving | Check Pinia store connection |
| Import errors | Check file paths and extensions |

---

## 💡 Pro Tips

- 💾 **Auto-save**: Form data auto-saves as you type
- 🔄 **Regenerate**: Click "Regenerate" to get different AI output
- 📋 **Copy**: All outputs can be copied to clipboard
- 📥 **Export**: Export results to CSV/JSON
- 🎨 **Tailwind**: Use Tailwind classes for styling (scoped CSS optional)

---

## Next Steps

✅ **Just want to add a task?** → Use section "Add a New Task" above
✅ **Want to understand the system?** → Read ARCHITECTURE.md
✅ **Want to contribute?** → Read CONTRIBUTING.md
✅ **Stuck on something?** → Check the relevant guide in `/docs/`

---

**Happy coding!** 🚀
