# Phase 3 SSOT - Automated Test Suite

## Overview

Comprehensive Jest/Vitest test suite for all Phase 3 SSOT features. 40+ automated tests covering:

- ✅ Task 3.1: Debouncing (3 tests)
- ✅ Task 3.2: Save State Tracking (5 tests)
- ✅ Task 3.3: Validation Gate (5 tests)
- ✅ Task 3.4: Conflict Detection (9 tests)
- ✅ Task 3.5: Unsaved Changes Warning (10 tests)
- ✅ Integration Tests (3 tests)

**Total: 35 test cases**

---

## Quick Start

### 1. Install Vitest (if not already installed)

```bash
npm install -D vitest
```

### 2. Run All Tests

```bash
npm run test
```

Or with Vitest specifically:

```bash
npx vitest run src/__tests__/phase3-ssot.test.js
```

### 3. Watch Mode (for development)

```bash
npx vitest watch src/__tests__/phase3-ssot.test.js
```

### 4. Run with Coverage

```bash
npx vitest run --coverage src/__tests__/phase3-ssot.test.js
```

---

## Test Structure

### File Location
```
src/__tests__/phase3-ssot.test.js
```

### Test Categories

#### Task 3.1: Debouncing
- `should debounce saves by 500ms`
- `should cancel previous timeout on new input`
- `should batch multiple changes into single save request`

**What it tests:** Verifies that the debouncing mechanism works correctly, preventing rapid database calls.

#### Task 3.2: Save State Tracking
- `should track isSaving state during save`
- `should clear saveError on successful save`
- `should update lastSaveTime on save completion`
- `should handle save errors correctly`
- `should track multiple consecutive saves`

**What it tests:** Validates that save state is properly tracked throughout the save lifecycle.

#### Task 3.3: Validation Gate
- `should block save when required field is empty`
- `should allow save when all required fields filled`
- `should validate individual required fields`
- `should provide clear error messages`
- `should clear errors when fields are filled`

**What it tests:** Ensures that invalid forms cannot be saved and that validation messages are clear.

#### Task 3.4: Conflict Detection
- `should initialize with no conflicts`
- `should detect 409 conflict from error response`
- `should extract lastModifiedBy from conflict error`
- `should extract lastModifiedAt from conflict error`
- `should track version mismatch`
- `should recognize matching versions`
- `should clear conflict state`
- `should format conflict message with timestamp`
- `should handle missing lastModifiedAt gracefully`
- `should not detect non-409 errors as conflicts`

**What it tests:** Validates optimistic locking, conflict detection, and proper handling of concurrent edits.

#### Task 3.5: Unsaved Changes Warning
- `should initialize with clean state`
- `should mark form as dirty on edit`
- `should mark form as clean after save`
- `should detect actual data changes`
- `should recognize unchanged data`
- `should update saved state after successful save`
- `should show unsaved warning when navigating with changes`
- `should allow navigation when clean`
- `should confirm discard and navigate`
- `should cancel navigation and keep editing`
- `should provide clear warning message`

**What it tests:** Ensures dirty state tracking, warnings before navigation, and proper state management.

#### Integration Tests
- `should handle complete edit-save workflow`
- `should handle conflict then retry workflow`
- `should block save with validation errors`

**What it tests:** End-to-end workflows combining multiple Phase 3 features.

---

## Understanding Test Results

### Successful Test Run
```
✓ Phase 3 SSOT Tests (35 tests)
  ✓ Task 3.1: Debouncing (3 tests)
    ✓ should debounce saves by 500ms
    ✓ should cancel previous timeout on new input
    ✓ should batch multiple changes into single save request
  ✓ Task 3.2: Save State Tracking (5 tests)
    ...
  ✓ Task 3.3: Validation Gate (5 tests)
    ...
  [etc]

✓ All tests passed! (35/35)
```

### Failed Test
If a test fails, you'll see:
```
✗ should debounce saves by 500ms
  Error: expected 5 to be 1
    at Context.<anonymous> (phase3-ssot.test.js:42:15)
```

**What to do:** Read the assertion that failed and check the implementation.

---

## Running Specific Tests

### Run only Task 3.4 tests
```bash
npx vitest run --grep "Task 3.4" src/__tests__/phase3-ssot.test.js
```

### Run only Integration tests
```bash
npx vitest run --grep "Integration" src/__tests__/phase3-ssot.test.js
```

### Run a single test
```bash
npx vitest run --grep "should debounce saves by 500ms" src/__tests__/phase3-ssot.test.js
```

---

## Adding New Tests

To add a new Phase 3 test:

1. Open `src/__tests__/phase3-ssot.test.js`
2. Find the appropriate `describe` block
3. Add new `it()` test case:

```javascript
it('should [specific behavior]', () => {
  // Arrange
  const data = { /* setup */ }

  // Act
  const result = performAction(data)

  // Assert
  expect(result).toBe(expectedValue)
})
```

---

## CI/CD Integration

### Add to package.json

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest watch",
    "test:coverage": "vitest run --coverage"
  }
}
```

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
```

---

## Test Coverage

To generate a coverage report:

```bash
npx vitest run --coverage src/__tests__/phase3-ssot.test.js
```

This generates:
- Console summary showing % coverage
- HTML report in `coverage/` directory
- LCOV report for CI/CD integration

**Target coverage:** 80%+ for Phase 3 code

---

## Troubleshooting

### Tests Not Found
```bash
# Make sure test file exists
ls src/__tests__/phase3-ssot.test.js

# Make sure vitest is installed
npm list vitest
```

### Import Errors
```bash
# Install missing dependencies
npm install
```

### Timeout Errors
Increase timeout for slow tests:
```javascript
it('slow test', async () => {
  // test code
}, 10000) // 10 second timeout
```

### Mock Not Working
Ensure mocks are set up before imports:
```javascript
import { vi } from 'vitest'

vi.mock('../path/to/module', () => ({
  // mock implementation
}))
```

---

## Continuous Testing

### Watch Mode
```bash
npm run test:watch
```

Automatically reruns tests when files change.

### Pre-commit Hook

Add to `.husky/pre-commit`:
```bash
npm test -- --run
```

Prevents committing broken code.

---

## Next Steps

1. **Run tests locally:** `npm test`
2. **Check coverage:** `npm run test:coverage`
3. **Add to CI/CD:** Set up GitHub Actions
4. **Commit tests:** `git add src/__tests__/ && git commit -m "test: Add Phase 3 automated test suite"`

---

## Test Maintenance

- Update tests when requirements change
- Add tests for any new Phase 3 features
- Review coverage reports quarterly
- Refactor tests for clarity and DRY

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Jest Matchers Reference](https://jestjs.io/docs/expect)
- [Testing Library Best Practices](https://testing-library.com/)

---

## Questions?

If tests fail unexpectedly:
1. Check test output for exact assertion failure
2. Review the implementation being tested
3. Verify test assumptions are correct
4. Check for timing/async issues with `vi.useFakeTimers()`
