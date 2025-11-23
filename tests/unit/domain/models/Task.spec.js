/**
 * Task Model Unit Tests
 *
 * Tests pure business logic of Task domain model
 * - No framework dependencies
 * - No async operations
 * - 100% testable logic
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { Task } from '@/domain/models/Task'

describe('Task Model', () => {
  let task

  beforeEach(() => {
    task = new Task(
      'task-1',
      'Complete Setup',
      { aiPrompt: 'Setup instructions' },
      { checked: false, removed: false },
      {}
    )
  })

  describe('Initialization', () => {
    it('creates task with correct initial state', () => {
      expect(task.id).toBe('task-1')
      expect(task.name).toBe('Complete Setup')
      expect(task.isCompleted()).toBe(false)
      expect(task.isRemoved()).toBe(false)
    })

    it('initializes with default status values', () => {
      const newTask = new Task('id', 'name', {})
      expect(newTask.isCompleted()).toBe(false)
      expect(newTask.isRemoved()).toBe(false)
    })
  })

  describe('Completion Management', () => {
    it('marks task as complete', () => {
      task.complete()
      expect(task.isCompleted()).toBe(true)
    })

    it('marks task as incomplete', () => {
      task.complete()
      task.incomplete()
      expect(task.isCompleted()).toBe(false)
    })

    it('toggles completion status', () => {
      expect(task.isCompleted()).toBe(false)
      task.toggleCompletion()
      expect(task.isCompleted()).toBe(true)
      task.toggleCompletion()
      expect(task.isCompleted()).toBe(false)
    })

    it('returns correct status label', () => {
      expect(task.getStatusLabel()).toBe('To-do')
      task.complete()
      expect(task.getStatusLabel()).toBe('Done')
      task.remove()
      expect(task.getStatusLabel()).toBe('Hidden')
    })
  })

  describe('Visibility Management', () => {
    it('removes task from view', () => {
      task.remove()
      expect(task.isRemoved()).toBe(true)
      expect(task.isVisible()).toBe(false)
    })

    it('restores removed task', () => {
      task.remove()
      task.restore()
      expect(task.isRemoved()).toBe(false)
      expect(task.isVisible()).toBe(true)
    })

    it('maintains completion status when removed', () => {
      task.complete()
      task.remove()
      expect(task.isCompleted()).toBe(true)
      expect(task.isRemoved()).toBe(true)
    })
  })

  describe('AI Configuration', () => {
    it('identifies task with AI capability', () => {
      const aiTask = new Task('id', 'name', { aiConfig: { prompt: 'test' } })
      expect(aiTask.hasAI()).toBe(true)
    })

    it('identifies task without AI', () => {
      const noAiTask = new Task('id', 'name', {})
      expect(noAiTask.hasAI()).toBe(false)
    })

    it('returns AI config when available', () => {
      const aiConfig = { prompt: 'Setup instructions' }
      const aiTask = new Task('id', 'name', { aiConfig })
      const config = aiTask.getAIConfig()
      expect(config).toEqual(aiConfig)
    })
  })

  describe('Form Data Management', () => {
    it('sets and retrieves form data', () => {
      const formData = { email: 'test@example.com', name: 'Test' }
      task.setFormData(formData)
      expect(task.getFormData()).toEqual(formData)
    })

    it('starts with empty form data', () => {
      expect(task.getFormData()).toEqual({})
    })

    it('overwrites previous form data', () => {
      task.setFormData({ field1: 'value1' })
      task.setFormData({ field2: 'value2' })
      expect(task.getFormData()).toEqual({ field2: 'value2' })
    })
  })

  describe('AI Output Management', () => {
    it('adds AI output', () => {
      task.addAIOutput('Generated content here')
      const outputs = task.getAIOutputs()
      expect(outputs.length).toBe(1)
      expect(outputs[0].text).toBe('Generated content here')
    })

    it('tracks creation timestamp for outputs', () => {
      const before = Date.now()
      task.addAIOutput('content')
      const after = Date.now()
      const output = task.getAIOutputs()[0]
      const timestamp = new Date(output.createdAt).getTime()
      expect(timestamp).toBeGreaterThanOrEqual(before)
      expect(timestamp).toBeLessThanOrEqual(after)
    })

    it('maintains multiple AI outputs in order', () => {
      task.addAIOutput('First')
      task.addAIOutput('Second')
      task.addAIOutput('Third')
      const outputs = task.getAIOutputs()
      expect(outputs.length).toBe(3)
      expect(outputs[0].text).toBe('First')
      expect(outputs[2].text).toBe('Third')
    })

    it('returns empty array initially', () => {
      expect(task.getAIOutputs()).toEqual([])
    })
  })

  describe('Saved Items Management', () => {
    it('adds saved item', () => {
      task.addSavedItem({ text: 'Saved Content' })
      const saved = task.getSavedItems()
      expect(saved.length).toBe(1)
      expect(saved[0].text).toBe('Saved Content')
    })

    it('deletes saved item', () => {
      task.addSavedItem({ text: 'Item to delete' })
      let saved = task.getSavedItems()
      expect(saved.length).toBe(1)

      const itemIdToDelete = saved[0].id
      task.deleteSavedItem(itemIdToDelete)

      const updated = task.getSavedItems()
      expect(updated.length).toBe(0)
    })

    it('returns empty array initially', () => {
      expect(task.getSavedItems()).toEqual([])
    })
  })

  describe('Data Serialization', () => {
    it('serializes to JSON', () => {
      task.complete()
      task.setFormData({ test: 'data' })
      task.addAIOutput('output')
      const json = task.toJSON()

      expect(json.id).toBe('task-1')
      expect(json.status.checked).toBe(true)
      expect(json.data.formData).toEqual({ test: 'data' })
    })

    it('deserializes from JSON', () => {
      const json = {
        id: 'task-2',
        name: 'Test Task',
        config: { aiPrompt: 'test' },
        status: { checked: true, removed: false },
        data: { formData: { field: 'value' } }
      }
      const restored = Task.fromJSON(json)
      expect(restored.id).toBe('task-2')
      expect(restored.isCompleted()).toBe(true)
      expect(restored.getFormData()).toEqual({ field: 'value' })
    })
  })

  describe('Progress Tracking', () => {
    it('calculates progress correctly', () => {
      task.setFormData({ step1: 'done', step2: 'done', step3: 'pending' })
      const progress = task.getProgress()
      expect(progress).toBeGreaterThanOrEqual(0)
      expect(progress).toBeLessThanOrEqual(100)
    })
  })

  describe('Edge Cases', () => {
    it('handles null form data gracefully', () => {
      task.setFormData(null)
      expect(task.getFormData()).toEqual({})
    })

    it('maintains state after multiple operations', () => {
      task.complete()
      task.remove()
      task.setFormData({ test: 'data' })
      task.addAIOutput('content')

      expect(task.isCompleted()).toBe(true)
      expect(task.isRemoved()).toBe(true)
      expect(task.getFormData()).toEqual({ test: 'data' })
      expect(task.getAIOutputs().length).toBe(1)
    })

    it('clears data correctly', () => {
      task.setFormData({ test: 'data' })
      task.addAIOutput('output')
      task.addSavedItem('item', 'content')

      task.clearData()

      expect(task.getFormData()).toEqual({})
      expect(task.getAIOutputs()).toEqual([])
      expect(task.getSavedItems()).toEqual([])
    })
  })
})
