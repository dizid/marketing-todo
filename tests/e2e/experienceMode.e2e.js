/**
 * Experience Mode E2E Test Script
 *
 * Run manually with: node tests/e2e/experienceMode.e2e.js
 *
 * This script tests the actual database persistence:
 * 1. Loads .env for Supabase credentials
 * 2. Creates a test project settings entry
 * 3. Updates experienceLevel
 * 4. Verifies persistence
 * 5. Cleans up
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Generate a proper UUID v4 for testing
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

const TEST_PROJECT_ID = uuidv4()

async function runTests() {
  console.log('\\n🧪 Experience Mode E2E Tests\\n')
  console.log('=' .repeat(50))

  let passed = 0
  let failed = 0

  try {
    // Test 1: Save beginner mode to database
    console.log('\\nTest 1: Save beginner experienceLevel to database')
    const settings1 = { experienceLevel: 'beginner', productType: 'saas' }

    const { error: error1 } = await supabase
      .from('project_data')
      .upsert({
        project_id: TEST_PROJECT_ID,
        key: 'settings',
        value: settings1
      }, { onConflict: 'project_id,key' })

    if (error1) {
      console.log('  ❌ FAILED:', error1.message)
      failed++
    } else {
      console.log('  ✅ PASSED: Saved beginner mode')
      passed++
    }

    // Test 2: Read back and verify
    console.log('\\nTest 2: Read back experienceLevel from database')
    const { data: data2, error: error2 } = await supabase
      .from('project_data')
      .select('value')
      .eq('project_id', TEST_PROJECT_ID)
      .eq('key', 'settings')
      .single()

    if (error2) {
      console.log('  ❌ FAILED:', error2.message)
      failed++
    } else if (data2.value.experienceLevel === 'beginner') {
      console.log('  ✅ PASSED: Read beginner mode correctly')
      passed++
    } else {
      console.log('  ❌ FAILED: Expected beginner, got', data2.value.experienceLevel)
      failed++
    }

    // Test 3: Update to intermediate mode
    console.log('\\nTest 3: Update experienceLevel to intermediate')
    const settings3 = { ...settings1, experienceLevel: 'intermediate' }

    const { error: error3 } = await supabase
      .from('project_data')
      .update({ value: settings3 })
      .eq('project_id', TEST_PROJECT_ID)
      .eq('key', 'settings')

    if (error3) {
      console.log('  ❌ FAILED:', error3.message)
      failed++
    } else {
      console.log('  ✅ PASSED: Updated to intermediate mode')
      passed++
    }

    // Test 4: Verify update persisted
    console.log('\\nTest 4: Verify intermediate mode persisted')
    const { data: data4, error: error4 } = await supabase
      .from('project_data')
      .select('value')
      .eq('project_id', TEST_PROJECT_ID)
      .eq('key', 'settings')
      .single()

    if (error4) {
      console.log('  ❌ FAILED:', error4.message)
      failed++
    } else if (data4.value.experienceLevel === 'intermediate') {
      console.log('  ✅ PASSED: Intermediate mode persisted correctly')
      passed++
    } else {
      console.log('  ❌ FAILED: Expected intermediate, got', data4.value.experienceLevel)
      failed++
    }

    // Test 5: Settings merge (don't lose other fields)
    console.log('\\nTest 5: Verify other settings preserved after mode change')
    if (data4.value.productType === 'saas') {
      console.log('  ✅ PASSED: productType preserved after experienceLevel change')
      passed++
    } else {
      console.log('  ❌ FAILED: productType was lost, got', data4.value.productType)
      failed++
    }

    // Test 6: Invalid experienceLevel (app should prevent, but DB accepts)
    console.log('\\nTest 6: Database accepts any experienceLevel value (validation is app-side)')
    const settings6 = { ...settings3, experienceLevel: 'expert' }

    const { error: error6 } = await supabase
      .from('project_data')
      .update({ value: settings6 })
      .eq('project_id', TEST_PROJECT_ID)
      .eq('key', 'settings')

    if (error6) {
      console.log('  ❌ FAILED:', error6.message)
      failed++
    } else {
      console.log('  ✅ PASSED: Database accepts any value (app validates)')
      passed++
    }

  } catch (err) {
    console.error('\\n💥 Unexpected error:', err.message)
    failed++
  } finally {
    // Cleanup
    console.log('\\nCleaning up test data...')
    await supabase
      .from('project_data')
      .delete()
      .eq('project_id', TEST_PROJECT_ID)
    console.log('  ✓ Cleanup complete')
  }

  // Summary
  console.log('\\n' + '='.repeat(50))
  console.log(`\\n📊 Results: ${passed} passed, ${failed} failed\\n`)

  process.exit(failed > 0 ? 1 : 0)
}

runTests()
