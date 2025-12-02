# Testing Documentation

## Overview

This document provides a comprehensive guide to the testing patterns and infrastructure for the Marketing Todo application. The application uses a **layered testing approach** focusing on integration tests for the presentation layer, unit tests for business logic, and domain model tests.

### Test Coverage Goals

- **Presentation Layer (Vue Components)**: Target 60% - Focus on critical user flows and components
- **Application Layer (Use Cases)**: Target 80% - Test integration with stores and services
- **Domain Layer (Models & Logic)**: Target 90% - Test business rules and calculations
- **Infrastructure Layer**: Minimal - Mock external services

## Architecture

### Test Directory Structure

```
tests/
├── unit/
│   ├── application/
│   │   └── usecases/          # Application logic tests
│   └── domain/
│       ├── models/            # Domain model tests
│       └── repositories/      # Data access tests
├── integration/
│   └── components/            # Vue component integration tests
└── utils/
    └── testHelpers.js         # Reusable test utilities and mocks
```

### Layered Testing Approach

```
┌─────────────────────────────────────────┐
│  Integration Tests (Presentation Layer) │  ← You are here
│  - Vue Components                       │     19 tests, 100% passing
│  - User flows & interactions            │
│  - Pinia store integration              │
└─────────────────────────────────────────┘
           ↓ Uses ↓
┌─────────────────────────────────────────┐
│   Unit Tests (Application Layer)        │
│  - Use Cases                            │
│  - Service integration                  │
│  - Store actions                        │
└─────────────────────────────────────────┘
           ↓ Uses ↓
┌─────────────────────────────────────────┐
│   Unit Tests (Domain Layer)             │
│  - Models (Task, Quota)                 │
│  - Business logic & calculations        │
│  - Validators                           │
└─────────────────────────────────────────┘
           ↓ Uses ↓
┌─────────────────────────────────────────┐
│   Mocked Infrastructure Layer           │
│  - Supabase (mocked)                    │
│  - Stripe (mocked)                      │
│  - External APIs                        │
└─────────────────────────────────────────┘
```

## Integration Testing Pattern

Integration tests focus on **user flows** rather than isolated unit tests. They verify that components work correctly with mocked stores and user interactions.

### Key Testing Tools

- **Vitest**: Test runner with Vue support
- **Vue Test Utils**: Component mounting and interaction testing
- **@pinia/testing**: Pinia store testing utilities
- **createTestingPinia()**: Creates isolated Pinia instances for tests

### Basic Setup Pattern

Every integration test follows this pattern:

```javascript
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import ComponentName from '@/components/ComponentName.vue'

describe('ComponentName - Integration Tests', () => {
  let wrapper

  beforeEach(() => {
    wrapper = null
  })

  it('should test user interaction', () => {
    // 1. Mount component with mocked Pinia store
    wrapper = mount(ComponentName, {
      props: {
        // Component props
      },
      global: {
        plugins: [createTestingPinia({
          initialState: {
            // Store state to set for this test
          }
        })]
      }
    })

    // 2. Verify initial state
    expect(wrapper.text()).toContain('Expected text')

    // 3. Simulate user interaction
    await wrapper.find('button').trigger('click')

    // 4. Verify behavior
    expect(wrapper.emitted('close')).toBeTruthy()
  })
})
```

## Setting Pinia Store State in Tests

### Pattern: Store State Structure

When using `createTestingPinia()`, the `initialState` must match the actual store's state structure. The key is that **computed properties depend on state**, not state itself.

**Example**: In `quotaStore.js`, the computed property `tier` is derived from state:

```javascript
// Store definition
const subscription = ref(null) // { tier, status, created_at }
const tier = computed(() => subscription.value?.tier || 'free')
```

**In tests, set the underlying state**:

```javascript
createTestingPinia({
  initialState: {
    quota: {
      subscription: { tier: 'premium', status: 'active' },
      usage: { count: 40, resetDate: new Date() },
      aiUsage: Array(40).fill({ created_at: new Date() }),
      isLoading: false,
      error: null
    }
  }
})
```

### Common State Structures

#### Quota Store

```javascript
{
  subscription: { tier: 'free'|'premium', status: 'active' },
  usage: { count: number, resetDate: Date },
  quotaModel: null,
  aiUsage: Array<{ created_at: Date }>,
  isLoading: boolean,
  error: null|string
}
```

#### Auth Store

```javascript
{
  user: { id: string, email: string, name: string } | null,
  isLoading: boolean,
  error: null|string
}
```

#### Project Store

```javascript
{
  projects: Array,
  currentProject: null|Object,
  tasks: { [projectId]: Array },
  isLoading: boolean,
  error: null|string
}
```

## Mocking Services and External APIs

### Pattern: Service Mocking

For components that use external services (Stripe, Supabase), use `vi.mock()` at the top of your test file:

```javascript
import { vi } from 'vitest'

vi.mock('@/services/stripeService', () => {
  class MockStripeService {
    constructor(apiClient) {
      this.stripeApiClient = apiClient
    }

    async createSubscription(userId, priceId) {
      return { clientSecret: 'pi_test_secret_123' }
    }

    async confirmPayment(clientSecret, userId) {
      return {
        success: true,
        paymentIntent: { id: 'pi_123', status: 'succeeded' }
      }
    }

    cleanup() {}
  }

  return { StripeService: MockStripeService }
})
```

### Key Pattern Rules

1. **Return actual classes/functions**, not `vi.fn().mockImplementation()`
2. **Make methods async** if the real service uses async
3. **Return realistic data structures** matching the real API
4. **Keep mocks simple** - only mock what the component uses

## Test Utilities (testHelpers.js)

The `tests/utils/testHelpers.js` file provides reusable mock factories for common testing needs.

### Available Mock Factories

#### createMockQuotaStore(overrides)
Creates a fully mocked Pinia quota store with all state and methods:

```javascript
import { createMockQuotaStore } from '@/tests/utils/testHelpers'

const mockStore = createMockQuotaStore({
  isFree: false,
  isPremium: true
})
```

#### createMockAuthStore(overrides)
Creates a mocked authentication store:

```javascript
const authStore = createMockAuthStore({
  user: { id: 'user-123', email: 'test@example.com' }
})
```

#### createMockProjectStore(overrides)
Creates a mocked project management store:

```javascript
const projectStore = createMockProjectStore({
  projects: [{ id: 'proj-1', name: 'Project A' }]
})
```

#### Other Utilities

- `createMockTask(overrides)` - Mock Task domain model
- `createMockRepository(overrides)` - Mock data repository
- `createMockLogger(overrides)` - Mock logging
- `waitFor(callback, options)` - Async wait with timeout
- `createSampleFormData(overrides)` - Sample form data for tests
- `flushPromises()` - Resolve all pending promises

## Current Test Coverage

### Integration Tests (Presentation Layer)

#### QuotaExceededModal Component (9 tests)
- ✓ Displays free tier quota exceeded message
- ✓ Displays premium tier quota exceeded message
- ✓ Displays quota usage bar at 100%
- ✓ Closes modal when close button clicked
- ✓ Does not display modal when isOpen is false
- ✓ Renders upgrade button with correct props
- ✓ Closes modal on upgrade success
- ✓ Displays premium benefits for free tier users
- ✓ Displays formatted reset date

#### StripePaymentModal Component (10 tests)
- ✓ Displays loading state when initializing payment
- ✓ Renders payment element container
- ✓ Does not display modal when isOpen is false
- ✓ Closes modal when cancel button clicked
- ✓ Displays subscribe button
- ✓ Displays payment methods information
- ✓ Receives userId prop correctly
- ✓ Has error message container
- ✓ Displays pricing information clearly
- ✓ Can emit close event

**Total: 19 tests passing (100%)**

## Writing New Integration Tests

### Step 1: Create Test File

Create a new file: `tests/integration/components/ComponentName.spec.js`

```javascript
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import ComponentName from '@/components/ComponentName.vue'

describe('ComponentName - Integration Tests', () => {
  let wrapper

  beforeEach(() => {
    wrapper = null
  })

  // Tests go here
})
```

### Step 2: Add Service Mocks (if needed)

```javascript
// At the top of the file, after imports
vi.mock('@/services/serviceName', () => {
  class MockService {
    async methodName() {
      return { /* mock response */ }
    }
  }
  return { ClassName: MockService }
})
```

### Step 3: Write Tests

```javascript
it('should display message when component mounts', () => {
  wrapper = mount(ComponentName, {
    props: { /* props */ },
    global: {
      plugins: [createTestingPinia({
        initialState: { /* store state */ }
      })]
    }
  })

  expect(wrapper.text()).toContain('Expected message')
})
```

### Step 4: Test User Interactions

```javascript
it('should handle button click', async () => {
  // ... mount component

  const button = wrapper.find('button')
  await button.trigger('click')

  expect(wrapper.emitted('eventName')).toBeTruthy()
})
```

## Running Tests

### Run All Tests
```bash
npm run test
```

### Run Specific Test File
```bash
npm run test tests/integration/components/QuotaExceededModal.spec.js
```

### Run Tests in Watch Mode
```bash
npm run test -- --watch
```

### Run Integration Tests Only
```bash
npm run test -- tests/integration
```

### Run Unit Tests Only
```bash
npm run test -- tests/unit
```

### Generate Coverage Report
```bash
npm run test:coverage
```

### View Test UI
```bash
npm run test:ui
```

## Best Practices

### 1. Focus on User Flows, Not Implementation
**Good**: Test that clicking a button shows an error message
**Bad**: Test that an internal variable changes

### 2. Use Realistic Data
```javascript
// Good - realistic tier structure
initialState: {
  quota: {
    subscription: { tier: 'free', status: 'active' },
    aiUsage: Array(40).fill({ created_at: new Date() })
  }
}

// Bad - incomplete state
initialState: {
  quota: {
    isFree: true  // This is computed, not state!
  }
}
```

### 3. Mock External Services
```javascript
// Good - service is mocked
vi.mock('@/services/paymentService')

// Bad - making real API calls
// (Don't do this in tests)
```

### 4. Test Accessibility
```javascript
// Good - finding by visible text
const button = wrapper.find('button').text().includes('Submit')

// Less ideal - finding by class or ID
// (UI can change, user-visible text is more stable)
```

### 5. Keep Tests Focused
Each test should verify one behavior:

```javascript
// Good - one assertion focus
it('displays error message when payment fails', () => {
  // Setup, action, verify error display only
})

// Less ideal - multiple concerns
it('handles everything about payment', () => {
  // Tests modal opening, form validation, error display, success flow...
})
```

## Debugging Tests

### Debug Output
Add `console.log()` statements to tests:

```javascript
it('should work', () => {
  wrapper = mount(Component)
  console.log('Component HTML:', wrapper.html())
  console.log('Component text:', wrapper.text())
})
```

### Run Single Test
```bash
npm run test -- tests/integration/components/QuotaExceededModal.spec.js -t "should display"
```

### Inspect Component State
```javascript
it('should test', () => {
  wrapper = mount(Component)
  const store = useQuotaStore()
  console.log('Store state:', store.$state)
  console.log('Store computed:', {
    tier: store.tier,
    isFree: store.isFree
  })
})
```

## Common Issues and Solutions

### Issue: Computed properties showing old values
**Cause**: Setting initialState with computed property names instead of state names
**Solution**: Set the underlying state that computed properties depend on
```javascript
// Wrong
initialState: { quota: { isFree: true } }

// Right
initialState: { quota: { subscription: { tier: 'free' } } }
```

### Issue: Component imports not found
**Cause**: Path alias `@` not configured for test files
**Solution**: Use relative paths or add test configuration
```javascript
// Use relative paths
import { createMockQuotaStore } from '../../utils/testHelpers.js'

// Or update vitest config to support @ alias
```

### Issue: Mock service not working
**Cause**: vi.mock() must be at module scope, not inside function
**Solution**: Move mocks to the top of the file
```javascript
// Right place - at module scope
vi.mock('@/services/service')

describe('tests', () => {
  // Tests here
})
```

## Future Testing Roadmap

### Phase 2: Expand Coverage
- [ ] Test DashboardContainer component
- [ ] Test TaskChecklistView component
- [ ] Test MiniAppShell layout component
- [ ] Test QuotaStatusCard component

### Phase 3: User Flow Integration
- [ ] Complete AI Generation flow test
- [ ] Complete Task Completion flow test
- [ ] Test quota checking before generation
- [ ] Test payment flow end-to-end

### Phase 4: Advanced Testing
- [ ] Visual regression testing
- [ ] E2E testing with Playwright
- [ ] Performance testing for large task lists
- [ ] Accessibility testing

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils Guide](https://test-utils.vuejs.org/)
- [Pinia Testing](https://pinia.vuejs.org/cookbook/testing.html)
- [Testing Library Best Practices](https://testing-library.com/docs/queries/about)

## Contributing

When adding new tests:

1. Follow the established naming pattern: `ComponentName.spec.js`
2. Group related tests in describe blocks
3. Write descriptive test names that explain what is being tested
4. Add JSDoc comments to explain test purpose
5. Ensure all tests pass before submitting PR
6. Run coverage to verify test impact

---

**Last Updated**: December 2024
**Test Framework Version**: Vitest 4.0.13
**Total Tests**: 19 (Presentation Layer Integration Tests)
