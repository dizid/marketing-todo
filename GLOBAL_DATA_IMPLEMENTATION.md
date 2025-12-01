# Global Data Implementation - Ultra-Simple Version

## What We Built (3 Files, 2 Days)

### 1. **Global Data Store** - `src/stores/globalDataStore.js`
Single Pinia store with 10 canonical fields:
- `productName` - What you're selling
- `productDescription` - Detailed description
- `targetAudience` - Who you're selling to
- `primaryGoal` - Main marketing objective
- `targetTimeline` - When you want to launch
- `marketingBudget` - Monthly budget
- `teamSize` - Team size
- `currentStage` - Where you are (ideation, launched, scaling, etc.)
- `techStack` - Tools you use
- `productType` - Category (SaaS, course, service, etc.)

**Features:**
- `getField(fieldName)` - Get any field by name
- `updateField(fieldName, value)` - Update any field
- `hasField(fieldName)` - Check if field has data
- `completionScore` - Computed percentage (0-100) of filled fields
- `getAllFields()` - Export all data as object
- `setAllFields(data)` - Import from object
- `resetAll()` - Clear everything

### 2. **Setup Screen** - `src/components/Setup/GlobalDataSetup.vue`
Beautiful form UI where users enter their 10 core fields once.

**Includes:**
- Progress bar showing completion % (real-time)
- 4 organized sections: Product, Market, Timeline & Budget, Additional Info
- Beautiful validation and styling
- Success notifications
- Reset button for starting over

### 3. **Auto-fill Composable** - `src/composables/useGlobalDataAutofill.js`
Simple helper for tasks to use global data.

**Usage in a task:**
```javascript
const { getGlobalValue, hasGlobalValue } = useGlobalDataAutofill()

// In template:
<input
  v-model="audience"
  :placeholder="hasGlobalValue('targetAudience') ? 'Use: ' + getGlobalValue('targetAudience') : 'Enter audience'"
/>
<button @click="audience = getGlobalValue('targetAudience')" v-if="hasGlobalValue('targetAudience')">
  Use Global
</button>
```

---

## How to Integrate Into Tasks (Next Steps)

### Quick Integration Pattern
For any task form field that maps to global data:

```vue
<script setup>
import { useGlobalDataAutofill } from '@/composables/useGlobalDataAutofill'
const { getGlobalValue, hasGlobalValue } = useGlobalDataAutofill()
const audience = ref('')
</script>

<template>
  <div class="form-group">
    <label>Target Audience</label>
    <input
      v-model="audience"
      placeholder="Enter or use global setup"
    />
    <button
      v-if="hasGlobalValue('targetAudience')"
      @click="audience = getGlobalValue('targetAudience')"
      type="button"
    >
      ↓ Use from Setup
    </button>
  </div>
</template>
```

---

## Where to Add Setup Screen to Dashboard

Add to main navigation (next to Dashboard, Projects):

```vue
<router-link to="/setup" class="nav-item">
  <icon name="settings" />
  Setup
</router-link>
```

Or add as a button in Dashboard header:
```vue
<button @click="showSetupModal = true" class="btn-outline">
  ⚙️ Edit Setup
</button>
```

---

## Data Persistence (Auto-handled by Pinia)

By default, Pinia stores are in-memory. To persist across page refreshes:

**Option A: Pinia Persist Plugin (1 line)**
```javascript
// main.js
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'

const pinia = createPinia()
pinia.use(piniaPluginPersist)
```

**Option B: Manual localStorage sync**
```javascript
// In globalDataStore.js, add to setup:
watch(
  () => globalData.getAllFields(),
  (newVal) => {
    localStorage.setItem('launchpilot-globalData', JSON.stringify(newVal))
  },
  { deep: true }
)

// On mount, restore:
onMounted(() => {
  const saved = localStorage.getItem('launchpilot-globalData')
  if (saved) globalData.setAllFields(JSON.parse(saved))
})
```

---

## Progress Indicator for Dashboard

Add to main Dashboard component:

```vue
<script setup>
import { useGlobalDataStore } from '@/stores/globalDataStore'
const globalData = useGlobalDataStore()
</script>

<template>
  <div class="progress-section">
    <div class="progress-header">
      <h3>Project Setup</h3>
      <span class="completion-percent">{{ globalData.completionScore }}%</span>
    </div>
    <div class="progress-bar">
      <div
        class="progress-fill"
        :style="{ width: globalData.completionScore + '%' }"
      ></div>
    </div>
    <p class="progress-text">
      {{ globalData.completionScore < 100 ? '⚙️ Complete your setup to unlock all features' : '✅ Setup complete!' }}
    </p>
    <router-link to="/setup" class="btn-small" v-if="globalData.completionScore < 100">
      Complete Setup
    </router-link>
  </div>
</template>
```

---

## What Users Experience

1. **First time:** "I see a 'Setup' link in the nav. I click it, fill out 10 simple fields, hit Save."
2. **Try any task:** "The task form shows my product name pre-filled with a 'Use from Setup' button. I can use it or override."
3. **Completion tracking:** "Dashboard shows '40% setup complete'. As I fill more fields, the % goes up."
4. **Everywhere:** "Whenever I fill info in a task, I can pull global data with one click."

---

## Timeline to Full Integration

- **Day 1:** ✅ Create store, Setup screen, composable (DONE)
- **Day 2:** Add to 1 task (Define Audience) as test
- **Day 3:** Add to 4 more tasks (Offer Builder, Paid Ads, Webinar, Cold Outreach)
- **Day 4:** Add progress indicator to Dashboard + persistence

**Total: 4 days to full MVP**

---

## Key Advantages of This Approach

| Aspect | Benefit |
|--------|---------|
| Simplicity | Only 3 files, ~400 lines of code total |
| Speed | Built in 1 day, integrated in 3 more days |
| User Impact | Immediate - "enter once, use everywhere" |
| Maintainability | Dead simple to extend to new tasks |
| Extensibility | Can add complexity later (dependency graph, recommendations) without changing core |
| No Breaking Changes | Completely non-invasive to existing tasks |

---

## Next: Global Data Flow Example

When a task loads:

```
1. Task component mounts
2. useGlobalDataAutofill composable loads
3. Each form field checks: "Does global have this field?"
4. If yes: Show "Use from Setup" button next to field
5. User clicks button → field auto-populates from global store
6. User can override → task-specific value takes precedence
7. User submits → data saved locally to task + globally if applicable
```

---

## Files Created

- ✅ [src/stores/globalDataStore.js](../src/stores/globalDataStore.js) - Core store
- ✅ [src/components/Setup/GlobalDataSetup.vue](../src/components/Setup/GlobalDataSetup.vue) - Setup UI
- ✅ [src/composables/useGlobalDataAutofill.js](../src/composables/useGlobalDataAutofill.js) - Integration helper

---

**Status:** Foundation complete. Ready for task integration.
**Time to benefit:** 4 days until users see value.
**Complexity:** Minimal. Easy to maintain and extend.
