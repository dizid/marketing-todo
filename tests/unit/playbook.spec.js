import { describe, it, expect } from 'vitest'
import {
  getPlaybooks,
  getPlaybook,
  getPlaybookProgress,
  getPlaybookNextTask,
  getPlaybookList
} from '@/services/taskRecommendationEngine'

describe('Playbook Functions', () => {
  describe('getPlaybooks', () => {
    it('should return all playbooks', () => {
      const playbooks = getPlaybooks()
      expect(playbooks).toBeDefined()
      expect(playbooks['first-10-customers']).toBeDefined()
    })
  })

  describe('getPlaybook', () => {
    it('should return a specific playbook by ID', () => {
      const playbook = getPlaybook('first-10-customers')
      expect(playbook).toBeDefined()
      expect(playbook.name).toBe('First 10 Customers')
      expect(playbook.tasks).toHaveLength(7)
    })

    it('should return null for invalid playbook ID', () => {
      const playbook = getPlaybook('non-existent')
      expect(playbook).toBeNull()
    })
  })

  describe('getPlaybookProgress', () => {
    it('should return 0% progress when no tasks completed', () => {
      const progress = getPlaybookProgress('first-10-customers', [])
      expect(progress.completed).toBe(0)
      expect(progress.total).toBe(7)
      expect(progress.percentage).toBe(0)
      expect(progress.isComplete).toBe(false)
    })

    it('should calculate correct progress', () => {
      const completedTasks = ['setup-1', 'growth-5', 'sales-2']
      const progress = getPlaybookProgress('first-10-customers', completedTasks)
      expect(progress.completed).toBe(3)
      expect(progress.total).toBe(7)
      expect(progress.percentage).toBe(43) // Math.round(3/7 * 100)
      expect(progress.isComplete).toBe(false)
    })

    it('should mark as complete when all tasks done', () => {
      const allTasks = ['setup-1', 'growth-5', 'sales-2', 'setup-2', 'growth-2', 'acq-1', 'sales-3']
      const progress = getPlaybookProgress('first-10-customers', allTasks)
      expect(progress.completed).toBe(7)
      expect(progress.total).toBe(7)
      expect(progress.percentage).toBe(100)
      expect(progress.isComplete).toBe(true)
    })

    it('should return empty progress for invalid playbook', () => {
      const progress = getPlaybookProgress('non-existent', [])
      expect(progress.completed).toBe(0)
      expect(progress.total).toBe(0)
    })
  })

  describe('getPlaybookNextTask', () => {
    it('should return first task when no tasks completed', () => {
      const nextTask = getPlaybookNextTask('first-10-customers', [])
      expect(nextTask.step).toBe(1)
      expect(nextTask.taskId).toBe('setup-1')
      expect(nextTask.name).toBe('Define Target Audience')
      expect(nextTask.isComplete).toBe(false)
    })

    it('should return next uncompleted task', () => {
      const completedTasks = ['setup-1', 'growth-5']
      const nextTask = getPlaybookNextTask('first-10-customers', completedTasks)
      expect(nextTask.step).toBe(3)
      expect(nextTask.taskId).toBe('sales-2')
      expect(nextTask.isComplete).toBe(false)
    })

    it('should return completion message when all tasks done', () => {
      const allTasks = ['setup-1', 'growth-5', 'sales-2', 'setup-2', 'growth-2', 'acq-1', 'sales-3']
      const nextTask = getPlaybookNextTask('first-10-customers', allTasks)
      expect(nextTask.isComplete).toBe(true)
      expect(nextTask.message).toContain('Congratulations')
    })

    it('should return null for invalid playbook', () => {
      const nextTask = getPlaybookNextTask('non-existent', [])
      expect(nextTask).toBeNull()
    })
  })

  describe('getPlaybookList', () => {
    it('should return array of playbook summaries', () => {
      const list = getPlaybookList()
      expect(Array.isArray(list)).toBe(true)
      expect(list.length).toBeGreaterThan(0)

      const first10 = list.find(p => p.id === 'first-10-customers')
      expect(first10).toBeDefined()
      expect(first10.name).toBe('First 10 Customers')
      expect(first10.taskCount).toBe(7)
    })
  })

  describe('First 10 Customers Playbook Structure', () => {
    it('should have correct task sequence', () => {
      const playbook = getPlaybook('first-10-customers')
      const taskIds = playbook.tasks.map(t => t.taskId)

      expect(taskIds).toEqual([
        'setup-1',   // Define Target Audience
        'growth-5',  // Positioning & Messaging Map
        'sales-2',   // High-Converting Offer Builder
        'setup-2',   // Set Up Landing Page
        'growth-2',  // Cold Outreach Campaigns
        'acq-1',     // Post in Communities
        'sales-3'    // Objection Handling
      ])
    })

    it('should have step numbers 1-7', () => {
      const playbook = getPlaybook('first-10-customers')
      const steps = playbook.tasks.map(t => t.step)
      expect(steps).toEqual([1, 2, 3, 4, 5, 6, 7])
    })

    it('should have why explanations for each task', () => {
      const playbook = getPlaybook('first-10-customers')
      playbook.tasks.forEach(task => {
        expect(task.why).toBeDefined()
        expect(task.why.length).toBeGreaterThan(0)
      })
    })
  })
})
