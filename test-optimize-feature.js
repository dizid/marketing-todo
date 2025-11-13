import * as config from './src/configs/paidAdsOptimize.config.js'
import { readFileSync } from 'fs'

console.log('='.repeat(60))
console.log('TESTING: Paid Ads Optimization Mini-App')
console.log('='.repeat(60))

let testsPassed = 0
let testsFailed = 0

const test = (name, assertion) => {
  if (assertion) {
    console.log(`✅ ${name}`)
    testsPassed++
  } else {
    console.log(`❌ ${name}`)
    testsFailed++
  }
}

// Config Tests
console.log('\n📦 CONFIG FILE TESTS (paidAdsOptimize.config.js)')
console.log('-'.repeat(60))

test('Exports auditWizardForm', Array.isArray(config.auditWizardForm))
test('Exports platformOptimizations', Array.isArray(config.platformOptimizations))
test('Exports goalPlaybooks', Array.isArray(config.goalPlaybooks))
test('Exports advancedStrategies', typeof config.advancedStrategies === 'object')
test('Exports paidAdsOptimizeTask', typeof config.paidAdsOptimizeTask === 'object')

console.log(`\n  Audit form fields: ${config.auditWizardForm?.length} (expected: 8)`)
test('Has 8 audit wizard fields', config.auditWizardForm?.length === 8)

console.log(`  Platform optimizations: ${config.platformOptimizations?.length} (expected: 3+)`)
test('Has platform optimizations', config.platformOptimizations?.length >= 3)

console.log(`  Goal playbooks: ${config.goalPlaybooks?.length} (expected: 4)`)
test('Has 4 goal playbooks', config.goalPlaybooks?.length === 4)

// Validate audit form structure
console.log('\n  Validating audit form fields...')
config.auditWizardForm?.forEach((field, idx) => {
  test(`  Field ${idx + 1} has id, type, label`, field.id && field.type && field.label)
})

// Validate goal playbooks structure
console.log('\n  Validating goal playbooks...')
const expectedPlaybooks = ['lower-cpa', 'increase-ctr', 'improve-roas', 'scale-winners']
expectedPlaybooks.forEach(id => {
  const playbook = config.goalPlaybooks?.find(p => p.id === id)
  test(`  Has playbook: ${id}`, !!playbook)
  if (playbook) {
    test(`    ${id} has tactics`, Array.isArray(playbook.tactics) && playbook.tactics.length > 0)
  }
})

// Validate platform optimizations
console.log('\n  Validating platform optimizations...')
config.platformOptimizations?.forEach(platform => {
  test(`  Platform ${platform.platform} has sections`, Array.isArray(platform.sections))
})

// Validate advanced strategies
console.log('\n  Validating advanced strategies...')
const strategyKeys = ['abTesting', 'creativeFatigue', 'audienceSegmentation', 'scaling']
strategyKeys.forEach(key => {
  test(`  Has strategy: ${key}`, !!config.advancedStrategies?.[key])
})

// Task config validation
console.log('\n  Validating task configuration...')
test('Task ID is advertising-2', config.paidAdsOptimizeTask?.id === 'advertising-2')
test('Task category is advertising', config.paidAdsOptimizeTask?.category === 'advertising')
test('Custom component is PaidAdsOptimizeMiniApp', config.paidAdsOptimizeTask?.customComponent === 'PaidAdsOptimizeMiniApp')
test('Task has what/why/how', config.paidAdsOptimizeTask?.what && config.paidAdsOptimizeTask?.why && config.paidAdsOptimizeTask?.how)

// Component Tests
console.log('\n🧩 COMPONENT FILE TESTS (PaidAdsOptimizeMiniApp.vue)')
console.log('-'.repeat(60))

const componentContent = readFileSync('./src/components/TaskMiniApps/PaidAdsOptimizeMiniApp.vue', 'utf-8')

test('Has <template> section', componentContent.includes('<template>'))
test('Has <script setup> section', componentContent.includes('<script setup>'))
test('Has <style scoped> section', componentContent.includes('<style scoped>'))

test('Imports from vue', componentContent.includes("from 'vue'"))
test('Imports paidAdsOptimizeTask config', componentContent.includes("from '@/configs/paidAdsOptimize.config'"))

test('Defines props', componentContent.includes('defineProps'))
test('Defines emits', componentContent.includes('defineEmits'))

test('Has audit tab', componentContent.includes("activeTab === 'audit'"))
test('Has playbooks tab', componentContent.includes("activeTab === 'playbooks'"))
test('Has advanced tab', componentContent.includes("activeTab === 'advanced'"))

test('Has runAudit method', componentContent.includes('runAudit'))
test('Has generateAuditResults method', componentContent.includes('generateAuditResults'))
test('Has saveAudit method', componentContent.includes('saveAudit'))
test('Has resetAudit method', componentContent.includes('resetAudit'))

test('Has responsive design', componentContent.includes('@media') && componentContent.includes('768px'))

// Integration Tests
console.log('\n🔗 INTEGRATION TESTS')
console.log('-'.repeat(60))

const taskModalContent = readFileSync('./src/components/Task/TaskModal.vue', 'utf-8')
test('TaskModal imports PaidAdsOptimizeMiniApp', taskModalContent.includes("import PaidAdsOptimizeMiniApp from '@/components/TaskMiniApps/PaidAdsOptimizeMiniApp.vue'"))
test('TaskModal adds to customComponentMap', taskModalContent.includes("'PaidAdsOptimizeMiniApp': PaidAdsOptimizeMiniApp"))

const unifiedTasksContent = readFileSync('./src/configs/unifiedTasks.js', 'utf-8')
test('unifiedTasks imports paidAdsOptimizeTask', unifiedTasksContent.includes("import { paidAdsOptimizeTask } from './paidAdsOptimize.config'"))
test('unifiedTasks adds advertising-2', unifiedTasksContent.includes("'advertising-2': paidAdsOptimizeTask"))

// File Stats
console.log('\n📊 FILE STATISTICS')
console.log('-'.repeat(60))

const configLines = config.toString().split('\n').length
const componentLines = componentContent.split('\n').length

console.log(`  paidAdsOptimize.config.js: ${configLines} lines`)
console.log(`  PaidAdsOptimizeMiniApp.vue: ${componentLines} lines`)

// Content Depth Tests
console.log('\n📚 CONTENT DEPTH TESTS')
console.log('-'.repeat(60))

// Count tactics across all playbooks
let totalTactics = 0
config.goalPlaybooks?.forEach(playbook => {
  totalTactics += playbook.tactics?.length || 0
})
console.log(`  Total tactics in goal playbooks: ${totalTactics}`)
test('Has 10+ tactics across playbooks', totalTactics >= 10)

// Count platform sections
let totalPlatformSections = 0
config.platformOptimizations?.forEach(platform => {
  totalPlatformSections += platform.sections?.length || 0
})
console.log(`  Total platform optimization sections: ${totalPlatformSections}`)
test('Has 5+ platform sections', totalPlatformSections >= 5)

// Count advanced strategy sections
let totalStratSections = 0
Object.values(config.advancedStrategies || {}).forEach(strategy => {
  totalStratSections += strategy.sections?.length || 0
})
console.log(`  Total advanced strategy sections: ${totalStratSections}`)
test('Has 10+ advanced strategy sections', totalStratSections >= 10)

// Summary
console.log('\n' + '='.repeat(60))
console.log('TEST SUMMARY')
console.log('='.repeat(60))
console.log(`✅ Tests Passed: ${testsPassed}`)
console.log(`❌ Tests Failed: ${testsFailed}`)
console.log(`📊 Pass Rate: ${Math.round((testsPassed / (testsPassed + testsFailed)) * 100)}%`)

if (testsFailed === 0) {
  console.log('\n🎉 ALL TESTS PASSED! Feature is ready.')
  process.exit(0)
} else {
  console.log(`\n⚠️  ${testsFailed} test(s) failed. Review above for details.`)
  process.exit(1)
}
