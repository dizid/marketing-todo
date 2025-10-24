# Task Mini-Apps Framework

A modular, configuration-driven architecture for building intelligent task mini-apps with AI assistance.

## 📁 Architecture

```
TaskMiniApps/
├── core/
│   ├── MiniAppShell.vue          # Universal wrapper component
│   └── miniAppRegistry.js        # Central task registry
│
├── shared/
│   ├── FormBuilder.vue           # Dynamic form component
│   ├── AIPanel.vue               # AI generation panel
│   └── OutputSection.vue         # Results management
│
├── configs/
│   ├── defineAudience.config.js  # Define Audience task config
│   ├── generatePosts.config.js   # Generate Posts task config
│   └── ... (more configs)
│
├── DefineAudienceMiniApp.vue     # Wrapped Define Audience task
├── GeneratePostsMiniApp.vue      # Wrapped Generate Posts task
└── ... (more wrapped tasks)
```

## 🎯 How It Works

### 1. Configuration-Driven
Each task is defined by a `.config.js` file that specifies:
- **Form fields** - What inputs the user provides
- **AI prompt template** - The prompt sent to Grok
- **Response parser** - How to parse AI output (optional)
- **Context providers** - Additional data (e.g., app description)

### 2. Universal Flow
All tasks follow this pattern:
```
User fills form → AI generates → User reviews → User saves results
```

### 3. Reusable Components
- **FormBuilder** - Any form configuration becomes a working form
- **AIPanel** - Handles generation, loading states, regeneration
- **OutputSection** - Stores, displays, and exports results
- **MiniAppShell** - Orchestrates everything together

## 🚀 Adding a New Task

### Step 1: Create Configuration
Create `configs/yourTask.config.js`:

```javascript
export const yourTaskConfig = {
  id: 'your-task',
  title: 'Your Task Title',
  description: 'Brief description',

  // Form definition
  formTitle: 'Input Form',
  formFields: [
    {
      id: 'field_id',
      type: 'text', // 'text', 'textarea', 'number', 'select', 'checkboxes', 'radio'
      label: 'Field Label',
      placeholder: 'Help text',
      description: 'Additional help',
      required: false
    }
  ],

  // AI generation
  aiConfig: {
    promptTemplate: `Generate based on: {field_id}`,
    temperature: 0.8,
    maxTokens: 2000,

    // Optional: Get context data
    contextProvider: () => ({
      app_description: localStorage.getItem('...')
    }),

    // Optional: Parse AI response
    parseResponse: (response) => {
      // Parse and structure the response
      return response
    }
  },

  // Show results section?
  showOutput: true,
  exportFilename: 'task-export'
}
```

### Step 2: Register Task
In `core/miniAppRegistry.js`:

```javascript
import { yourTaskConfig } from '../configs/yourTask.config.js'

export const miniAppRegistry = {
  // ... existing tasks
  'your-task': yourTaskConfig
}
```

### Step 3: Create Mini-App Component (Optional)
Create `YourTaskMiniApp.vue`:

```vue
<template>
  <MiniAppShell
    :task-config="config"
    :task-data="taskData"
    @save="handleSave"
  >
    <template #ai-output="{ output }">
      <!-- Custom output rendering if needed -->
      <p>{{ output }}</p>
    </template>
  </MiniAppShell>
</template>

<script setup>
import MiniAppShell from './core/MiniAppShell.vue'
import { yourTaskConfig } from './configs/yourTask.config.js'

const props = defineProps({
  taskId: String,
  taskData: Object
})

const emit = defineEmits(['save'])

const config = ref(yourTaskConfig)
const taskData = ref(props.taskData || { formData: {}, aiOutput: null, savedItems: [] })

const handleSave = (data) => {
  taskData.value = data
  emit('save', data)
}
</script>
```

### Step 4: Use in TaskModal
In `Task/TaskModal.vue` or wherever tasks are displayed:

```vue
<template>
  <GeneratePostsMiniApp
    v-if="task.id === 'generate-posts'"
    :task-id="task.id"
    :task-data="task.data"
    @save="handleTaskSave"
  />
  <DefineAudienceMiniApp
    v-else-if="task.id === 'define-audience'"
    :task-id="task.id"
    :task-data="task.data"
    @save="handleTaskSave"
  />
  <!-- ... more mini-apps -->
</template>

<script setup>
import { hasMiniApp } from './TaskMiniApps/core/miniAppRegistry.js'
import GeneratePostsMiniApp from './TaskMiniApps/GeneratePostsMiniApp.vue'
import DefineAudienceMiniApp from './TaskMiniApps/DefineAudienceMiniApp.vue'

// You can use hasMiniApp(taskId) to conditionally render
</script>
```

## 📋 Current Tasks

### 1. Define Target Audience (`define-audience`)
- **Purpose**: Create detailed buyer personas and market analysis
- **Inputs**: Audience overview, industry, job titles, pain points, etc.
- **AI Output**: Detailed persona, success metrics, channels, messaging strategy
- **Component**: `DefineAudienceMiniApp.vue`

### 2. Generate Social Posts (`generate-posts`)
- **Purpose**: Create platform-optimized social media posts
- **Inputs**: Platforms, tone, CTA, content focus, keywords, audience
- **AI Output**: Multiple platform-specific posts
- **Component**: `GeneratePostsMiniApp.vue`
- **Special**: Parses posts by platform, validates character limits

## 🔧 Form Field Types

| Type | Usage | Options |
|------|-------|---------|
| `text` | Short text input | placeholder, description |
| `textarea` | Long text input | placeholder, description, rows |
| `number` | Numeric input | min, max, placeholder, suffix |
| `select` | Dropdown | options: [{value, label}, ...] |
| `checkboxes` | Multiple select | options: [{value, label}, ...] |
| `radio` | Single select (visual) | options: [{value, label}, ...] |

## 🤖 AI Configuration

### Prompt Template Variables
Use `{fieldId}` to reference form fields:
```javascript
promptTemplate: `Create content based on: {audience_overview} and {pain_points}`
```

### Context Providers
Access external data without user input:
```javascript
contextProvider: () => ({
  app_description: localStorage.getItem('marketing-app-data')
})
```

### Response Parsing
Transform AI output into structured data:
```javascript
parseResponse: (response) => {
  // Parse and structure
  return structuredData
}
```

## 💾 Data Structure

Each task stores:
```javascript
{
  formData: {
    field_id: 'user input',
    // ...
  },
  aiOutput: 'raw AI response or structured data',
  savedItems: [
    {
      label: 'Item label',
      content: 'Item content',
      description: 'Optional description',
      timestamp: '2025-10-23T...'
    }
  ]
}
```

## 🎨 Customization

### Custom AI Output Display
Override the `#ai-output` slot:

```vue
<MiniAppShell :task-config="config" :task-data="taskData">
  <template #ai-output="{ output }">
    <MyCustomDisplay :data="output" />
  </template>
</MiniAppShell>
```

### Custom Form Validation
Expose validation in FormBuilder:

```javascript
// In FormBuilder
defineExpose({
  validate,
  data: formData
})
```

## 📊 Next Steps

The framework is ready to expand with more tasks:

- [ ] Write Blog Post
- [ ] Create Email Campaign
- [ ] Plan Content Calendar
- [ ] Set Marketing Goals
- [ ] Create Brand Guidelines
- [ ] ... (15+ more tasks)

Each follows the same config → component pattern, making them quick to add.

## 🚀 Performance Notes

- **Lazy Loading**: Import mini-app components only when needed
- **Form Validation**: Built-in client-side validation
- **Auto-Save**: Form changes auto-save to parent
- **Progress Indication**: AI generation shows progress feedback

## 🐛 Debugging

Enable logs in MiniAppShell:
```javascript
console.log('Form data:', formData.value)
console.log('AI prompt:', prompt)
console.log('AI response:', responseText)
```

Check Grok API status:
- Verify endpoint: `/.netlify/functions/grok-proxy`
- Check Netlify functions logs
- Test with curl: `curl -X POST http://localhost:9999/grok-proxy -d '...'`
