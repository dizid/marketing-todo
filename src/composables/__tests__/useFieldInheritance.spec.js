/**
 * Field Inheritance Composable Tests
 *
 * Tests for useFieldInheritance and useFieldInheritanceBatch composables
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useFieldInheritance, useFieldInheritanceBatch } from '../useFieldInheritance.js'
import { ProjectContext } from '@/domain/models/index.js'
import { CANONICAL_FIELDS } from '@/shared/registry/fieldRegistry.js'

describe('useFieldInheritance', () => {
  let projectId, taskId, fieldName, composable

  beforeEach(() => {
    projectId = 'project-123'
    taskId = 'task-456'
    fieldName = CANONICAL_FIELDS.TARGET_AUDIENCE
  })

  it('should create a composable instance', () => {
    composable = useFieldInheritance(projectId, taskId, fieldName)
    expect(composable).toBeDefined()
    expect(composable.fieldValue).toBeDefined()
    expect(composable.hasOverride).toBeDefined()
    expect(composable.canInherit).toBeDefined()
  })

  it('should detect inheritable fields', () => {
    composable = useFieldInheritance(projectId, taskId, CANONICAL_FIELDS.TARGET_AUDIENCE)
    expect(composable.canInherit).toBe(true)

    const nonInheritableComposable = useFieldInheritance(projectId, taskId, CANONICAL_FIELDS.TECH_STACK)
    expect(nonInheritableComposable.canInherit).toBe(false)
  })

  it('should set and clear overrides', () => {
    composable = useFieldInheritance(projectId, taskId, fieldName)

    // Initially no override
    expect(composable.hasOverride).toBe(false)

    // Set override
    const result = composable.setOverride('Test Audience')
    expect(result.isValid).toBe(true)
    expect(composable.hasOverride).toBe(true)
    expect(composable.fieldValue).toBe('Test Audience')

    // Clear override
    composable.clearOverride()
    expect(composable.hasOverride).toBe(false)
  })

  it('should validate override values', () => {
    composable = useFieldInheritance(projectId, taskId, CANONICAL_FIELDS.MARKETING_BUDGET)

    // Invalid: string instead of number
    const invalidResult = composable.setOverride('not-a-number')
    expect(invalidResult.isValid).toBe(false)
    expect(invalidResult.error).toBeDefined()

    // Valid: number
    const validResult = composable.setOverride(5000)
    expect(validResult.isValid).toBe(true)
  })

  it('should report field source correctly', () => {
    composable = useFieldInheritance(projectId, taskId, fieldName)

    // No value initially
    expect(composable.getSource).toBe(null)

    // Set override
    composable.setOverride('Override Value')
    expect(composable.getSource).toBe('override')

    // Clear override
    composable.clearOverride()
    expect(composable.getSource).toBe(null)
  })

  it('should provide inheritance chain information', () => {
    composable = useFieldInheritance(projectId, taskId, fieldName)
    composable.setOverride('Test Value')

    const chain = composable.getInheritanceChain()
    expect(chain).toEqual({
      fieldName,
      isInheritable: true,
      current: {
        value: 'Test Value',
        source: 'override'
      },
      override: {
        hasOverride: true,
        value: 'Test Value'
      },
      inherited: {
        value: undefined,
        available: false
      },
      projectId,
      taskId
    })
  })

  it('should initialize async without errors', async () => {
    composable = useFieldInheritance(projectId, taskId, fieldName)
    const initResult = await composable.initialize()
    expect(composable.isLoading).toBe(false)
  })
})

describe('useFieldInheritanceBatch', () => {
  let projectId, taskId, fieldNames, composable

  beforeEach(() => {
    projectId = 'project-123'
    taskId = 'task-456'
    fieldNames = [
      CANONICAL_FIELDS.TARGET_AUDIENCE,
      CANONICAL_FIELDS.PRIMARY_GOAL,
      CANONICAL_FIELDS.MARKETING_BUDGET
    ]
  })

  it('should create batch composable instance', () => {
    composable = useFieldInheritanceBatch(projectId, taskId, fieldNames)
    expect(composable).toBeDefined()
    expect(composable.getAllFieldValues).toBeDefined()
    expect(composable.setOverrides).toBeDefined()
    expect(composable.getInheritanceSummary).toBeDefined()
  })

  it('should get field values for multiple fields', () => {
    composable = useFieldInheritanceBatch(projectId, taskId, fieldNames)

    const values = composable.getAllFieldValues
    expect(values).toBeDefined()
    expect(Object.keys(values)).toContain(CANONICAL_FIELDS.TARGET_AUDIENCE)
    expect(Object.keys(values)).toContain(CANONICAL_FIELDS.PRIMARY_GOAL)
  })

  it('should set overrides for multiple fields', () => {
    composable = useFieldInheritanceBatch(projectId, taskId, fieldNames)

    const overrides = {
      [CANONICAL_FIELDS.TARGET_AUDIENCE]: 'New Audience',
      [CANONICAL_FIELDS.PRIMARY_GOAL]: 'first_100'
    }

    const results = composable.setOverrides(overrides)

    expect(results[CANONICAL_FIELDS.TARGET_AUDIENCE].isValid).toBe(true)
    expect(results[CANONICAL_FIELDS.PRIMARY_GOAL].isValid).toBe(true)
    expect(composable.getOverriddenFields.value).toContain(CANONICAL_FIELDS.TARGET_AUDIENCE)
  })

  it('should validate overrides during batch set', () => {
    composable = useFieldInheritanceBatch(projectId, taskId, fieldNames)

    const overrides = {
      [CANONICAL_FIELDS.TARGET_AUDIENCE]: 'Valid',
      [CANONICAL_FIELDS.MARKETING_BUDGET]: 'invalid-number' // Invalid
    }

    const results = composable.setOverrides(overrides)

    expect(results[CANONICAL_FIELDS.TARGET_AUDIENCE].isValid).toBe(true)
    expect(results[CANONICAL_FIELDS.MARKETING_BUDGET].isValid).toBe(false)
  })

  it('should clear individual overrides', () => {
    composable = useFieldInheritanceBatch(projectId, taskId, fieldNames)

    composable.setOverride(CANONICAL_FIELDS.TARGET_AUDIENCE, 'Test')
    expect(composable.getOverriddenFields.value).toContain(CANONICAL_FIELDS.TARGET_AUDIENCE)

    composable.clearOverride(CANONICAL_FIELDS.TARGET_AUDIENCE)
    expect(composable.getOverriddenFields.value).not.toContain(CANONICAL_FIELDS.TARGET_AUDIENCE)
  })

  it('should clear all overrides at once', () => {
    composable = useFieldInheritanceBatch(projectId, taskId, fieldNames)

    composable.setOverrides({
      [CANONICAL_FIELDS.TARGET_AUDIENCE]: 'Test1',
      [CANONICAL_FIELDS.PRIMARY_GOAL]: 'test_goal'
    })

    expect(composable.getOverriddenFields.value.length).toBeGreaterThan(0)

    composable.clearAllOverrides()
    expect(composable.getOverriddenFields.value.length).toBe(0)
  })

  it('should provide inheritance summary', () => {
    composable = useFieldInheritanceBatch(projectId, taskId, fieldNames)

    composable.setOverride(CANONICAL_FIELDS.TARGET_AUDIENCE, 'Override Value')

    const summary = composable.getInheritanceSummary()

    expect(summary.totalFields).toBe(fieldNames.length)
    expect(summary.overriddenFields).toBeGreaterThan(0)
    expect(summary.fields).toBeDefined()
    expect(summary.fields[CANONICAL_FIELDS.TARGET_AUDIENCE]).toBeDefined()
  })

  it('should track inherited vs overridden fields', () => {
    composable = useFieldInheritanceBatch(projectId, taskId, fieldNames)

    // Set one override
    composable.setOverride(CANONICAL_FIELDS.TARGET_AUDIENCE, 'Override')

    const summary = composable.getInheritanceSummary()

    // Check the overridden field
    const audienceField = summary.fields[CANONICAL_FIELDS.TARGET_AUDIENCE]
    expect(audienceField.overridden).toBe(true)
    expect(audienceField.source).toBe('override')

    // Other fields should not be overridden
    const goalField = summary.fields[CANONICAL_FIELDS.PRIMARY_GOAL]
    expect(goalField.overridden).toBe(false)
  })

  it('should identify inheritable fields', () => {
    const allFields = [
      CANONICAL_FIELDS.TARGET_AUDIENCE, // inheritable
      CANONICAL_FIELDS.TECH_STACK // not inheritable
    ]

    composable = useFieldInheritanceBatch(projectId, taskId, allFields)
    const summary = composable.getInheritanceSummary()

    expect(summary.inheritableFields).toBeGreaterThan(0)
    expect(summary.nonInheritableFields).toBeGreaterThan(0)
  })

  it('should initialize async without errors', async () => {
    composable = useFieldInheritanceBatch(projectId, taskId, fieldNames)
    const initResult = await composable.initialize()
    expect(composable.isLoading).toBe(false)
  })
})
