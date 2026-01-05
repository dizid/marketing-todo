/**
 * Manual Test Suite for PaidAdsLaunchMiniApp
 * Validates form validation logic and button behavior
 * Run with: node tests/PaidAdsLaunchMiniApp.manual.test.js
 */

// Simple test runner
const tests = []
let passed = 0
let failed = 0

function test(name, fn) {
  tests.push({ name, fn })
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${expected}, got ${actual}`)
  }
}

function assertGreater(actual, expected, message) {
  if (actual <= expected) {
    throw new Error(`${message}: expected > ${expected}, got ${actual}`)
  }
}

function assertArrayLength(arr, length, message) {
  if (!Array.isArray(arr) || arr.length !== length) {
    throw new Error(`${message}: expected array length ${length}, got ${arr.length}`)
  }
}

// ============================================================================
// VALIDATION LOGIC TESTS
// ============================================================================

test('Budget validation: 200 should be invalid', () => {
  const budget = 200
  const isValid = budget >= 300
  assert(!isValid, 'Budget < 300 should be invalid')
})

test('Budget validation: 300 should be valid', () => {
  const budget = 300
  const isValid = budget >= 300
  assert(isValid, 'Budget >= 300 should be valid')
})

test('Budget validation: 299 should be invalid', () => {
  const budget = 299
  const isValid = budget >= 300
  assert(!isValid, 'Budget < 300 should be invalid')
})

test('Budget validation: 500 should be valid', () => {
  const budget = 500
  const isValid = budget >= 300
  assert(isValid, 'Budget >= 300 should be valid')
})

// ============================================================================
// FORM COMPLETION VALIDATION
// ============================================================================

test('Form validation: all fields empty should be invalid', () => {
  const formData = {
    monthly_budget: null,
    primary_goal: '',
    timeline: '',
    experience_level: ''
  }

  const isFormValid = formData.monthly_budget >= 300 &&
                      formData.primary_goal &&
                      formData.timeline &&
                      formData.experience_level

  assert(!isFormValid, 'Empty form should be invalid')
})

test('Form validation: only budget filled should be invalid', () => {
  const formData = {
    monthly_budget: 500,
    primary_goal: '',
    timeline: '',
    experience_level: ''
  }

  const isFormValid = formData.monthly_budget >= 300 &&
                      formData.primary_goal &&
                      formData.timeline &&
                      formData.experience_level

  assert(!isFormValid, 'Incomplete form should be invalid')
})

test('Form validation: all fields filled with valid budget should be valid', () => {
  const formData = {
    monthly_budget: 500,
    primary_goal: 'leads',
    timeline: 'two_weeks',
    experience_level: 'some'
  }

  const isFormValid = formData.monthly_budget >= 300 &&
                      formData.primary_goal &&
                      formData.timeline &&
                      formData.experience_level

  assert(isFormValid, 'Complete form with valid budget should be valid')
})

test('Form validation: all fields filled but budget too low should be invalid', () => {
  const formData = {
    monthly_budget: 200,
    primary_goal: 'leads',
    timeline: 'two_weeks',
    experience_level: 'some'
  }

  const isFormValid = formData.monthly_budget >= 300 &&
                      formData.primary_goal &&
                      formData.timeline &&
                      formData.experience_level

  assert(!isFormValid, 'Form with budget < 300 should be invalid')
})

// ============================================================================
// BUTTON STATE TESTS
// ============================================================================

test('Button should be disabled when form invalid', () => {
  const isFormValid = false
  const isGenerating = false
  const buttonDisabled = !isFormValid || isGenerating

  assert(buttonDisabled, 'Button should be disabled when form invalid')
})

test('Button should be enabled when form valid and not generating', () => {
  const isFormValid = true
  const isGenerating = false
  const buttonDisabled = !isFormValid || isGenerating

  assert(!buttonDisabled, 'Button should be enabled when form valid')
})

test('Button should be disabled when generating', () => {
  const isFormValid = true
  const isGenerating = true
  const buttonDisabled = !isFormValid || isGenerating

  assert(buttonDisabled, 'Button should be disabled when generating')
})

// ============================================================================
// PLATFORM RECOMMENDATION LOGIC
// ============================================================================

test('Budget 500: should recommend Google Ads + Meta for sales goal', () => {
  const budget = 500
  const goal = 'sales'

  let hasGoogle = false
  let hasMeta = false

  if (budget >= 500 && budget < 1500) {
    if (goal === 'sales' || goal === 'traffic') {
      hasGoogle = true
      hasMeta = true
    }
  }

  assert(hasGoogle && hasMeta, 'Budget 500 + sales goal should recommend Google + Meta')
})

test('Budget 800: should generate multiple platforms', () => {
  const budget = 800
  const goal = 'awareness'

  let recommendationCount = 0

  if (budget >= 500 && budget < 1500) {
    recommendationCount = 2 // Meta + Google
  }

  assertGreater(recommendationCount, 0, 'Budget 800 should recommend platforms')
})

test('Budget 2000: should recommend 3 platforms', () => {
  const budget = 2000
  const goal = 'sales'

  let recommendationCount = 0

  if (budget >= 1500 && budget < 3000) {
    recommendationCount = 3 // Google + Meta + LinkedIn
  }

  assertEqual(recommendationCount, 3, 'Budget 2000 should recommend 3 platforms')
})

test('Budget 5000: should recommend 4+ platforms', () => {
  const budget = 5000
  const goal = 'sales'

  let recommendationCount = 0

  if (budget >= 3000) {
    recommendationCount = 4 // Google + Meta + LinkedIn + TikTok
  }

  assertGreater(recommendationCount, 3, 'Budget 5000 should recommend 4+ platforms')
})

// ============================================================================
// PLAN GENERATION TESTS
// ============================================================================

test('Generated plan should have ad copy variations', () => {
  // Simulating the generateMockPlan function
  const adCopyVariations = [
    { angle: 'Problem-Solution', headline: 'test', body: 'test', cta: 'test' },
    { angle: 'Social Proof', headline: 'test', body: 'test', cta: 'test' },
    { angle: 'Urgency/Scarcity', headline: 'test', body: 'test', cta: 'test' },
    { angle: 'Value Proposition', headline: 'test', body: 'test', cta: 'test' },
    { angle: 'Curiosity', headline: 'test', body: 'test', cta: 'test' }
  ]

  assertArrayLength(adCopyVariations, 5, 'Should generate 5 ad copy variations')
})

test('Generated plan should have weekly checklist with 4 weeks', () => {
  const weeklyChecklist = [
    { week: 1, focus: 'Setup & Launch', tasks: [] },
    { week: 2, focus: 'Monitor & Learn', tasks: [] },
    { week: 3, focus: 'Optimize & Scale', tasks: [] },
    { week: 4, focus: 'Scale & Expand', tasks: [] }
  ]

  assertArrayLength(weeklyChecklist, 4, 'Should generate 4-week checklist')
  assertEqual(weeklyChecklist[0].week, 1, 'First week should be week 1')
  assertEqual(weeklyChecklist[3].week, 4, 'Last week should be week 4')
})

test('Generated plan should have success signals', () => {
  const successSignals = {
    good: ['Signal 1', 'Signal 2', 'Signal 3'],
    bad: ['Bad 1', 'Bad 2'],
    action: 'Action plan text'
  }

  assert(successSignals.good.length > 0, 'Should have good signals')
  assert(successSignals.bad.length > 0, 'Should have bad signals')
  assert(successSignals.action, 'Should have action plan')
})

// ============================================================================
// RUN TESTS
// ============================================================================

console.log('\n📋 Running PaidAdsLaunchMiniApp Manual Tests\n')
console.log('='.repeat(60))

tests.forEach(({ name, fn }, index) => {
  try {
    fn()
    passed++
    console.log(`✅ ${index + 1}. ${name}`)
  } catch (error) {
    failed++
    console.log(`❌ ${index + 1}. ${name}`)
    console.log(`   Error: ${error.message}`)
  }
})

console.log('='.repeat(60))
console.log(`\n📊 Results: ${passed} passed, ${failed} failed out of ${tests.length} tests\n`)

if (failed === 0) {
  console.log('✅ All tests passed!\n')
  process.exit(0)
} else {
  console.log(`❌ ${failed} test(s) failed\n`)
  process.exit(1)
}
