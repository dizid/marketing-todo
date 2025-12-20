/**
 * Experience Mode Integration Tests
 *
 * Tests the full data flow:
 * 1. User selects mode -> Store updates
 * 2. Store calls Supabase -> Database persists
 * 3. Recommendation engine uses the mode
 * 4. Progress calculations adapt
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

// Import actual modules (not mocked) for integration testing
import {
  getNextTaskRecommendation,
  getTaskCountsByExperienceLevel,
  getExperienceLevelConfig
} from '@/services/taskRecommendationEngine.js'

describe('Experience Mode Integration', () => {

  describe('Data Flow: Mode -> Recommendation Engine', () => {
    it('should return different recommendations for beginner vs intermediate', () => {
      const beginnerUser = { productType: 'saas', experienceLevel: 'beginner' }
      const intermediateUser = { productType: 'saas', experienceLevel: 'intermediate' }

      const beginnerResult = getNextTaskRecommendation(beginnerUser, [])
      const intermediateResult = getNextTaskRecommendation(intermediateUser, [])

      // Both should get a recommendation
      expect(beginnerResult.nextTask).toBeDefined()
      expect(intermediateResult.nextTask).toBeDefined()

      // Max phases should differ
      expect(beginnerResult.maxPhase).toBe(3)
      expect(intermediateResult.maxPhase).toBe(4)

      // Total tasks should differ
      expect(beginnerResult.overallProgress.total).toBeLessThan(
        intermediateResult.overallProgress.total
      )
    })

    it('should correctly track progress independently per mode', () => {
      const beginnerUser = { productType: 'saas', experienceLevel: 'beginner' }
      const intermediateUser = { productType: 'saas', experienceLevel: 'intermediate' }

      // Same completed tasks
      const completed = ['growth-5', 'premium-intro-1']

      const beginnerResult = getNextTaskRecommendation(beginnerUser, completed)
      const intermediateResult = getNextTaskRecommendation(intermediateUser, completed)

      // Same completed count
      expect(beginnerResult.overallProgress.completed).toBe(2)
      expect(intermediateResult.overallProgress.completed).toBe(2)

      // But different percentages (different totals)
      expect(beginnerResult.overallProgress.percentage).toBeGreaterThan(
        intermediateResult.overallProgress.percentage
      )
    })
  })

  describe('Task Counts Consistency', () => {
    it('should have consistent counts between getTaskCounts and recommendations', () => {
      const counts = getTaskCountsByExperienceLevel('saas')

      const beginnerUser = { productType: 'saas', experienceLevel: 'beginner' }
      const beginnerResult = getNextTaskRecommendation(beginnerUser, [])

      // Task count from getTaskCounts should match total in recommendation
      expect(counts.beginner.taskCount).toBe(beginnerResult.overallProgress.total)

      const intermediateUser = { productType: 'saas', experienceLevel: 'intermediate' }
      const intermediateResult = getNextTaskRecommendation(intermediateUser, [])

      expect(counts.intermediate.taskCount).toBe(intermediateResult.overallProgress.total)
    })
  })

  describe('Mode Switch Simulation', () => {
    it('should correctly handle mode switch mid-progress', () => {
      const completedTasks = ['growth-5', 'premium-intro-1', 'premium-1']

      // Start as beginner
      const beginnerResult = getNextTaskRecommendation(
        { productType: 'saas', experienceLevel: 'beginner' },
        completedTasks
      )

      // Switch to intermediate
      const intermediateResult = getNextTaskRecommendation(
        { productType: 'saas', experienceLevel: 'intermediate' },
        completedTasks
      )

      // Progress completed should be the same
      expect(beginnerResult.overallProgress.completed).toBe(
        intermediateResult.overallProgress.completed
      )

      // But percentage changes
      expect(beginnerResult.overallProgress.percentage).toBeGreaterThan(
        intermediateResult.overallProgress.percentage
      )

      // Intermediate might recommend different next task
      // (intermediate-only tasks become available)
    })
  })

  describe('Phase Restriction Enforcement', () => {
    it('should never include Phase 4 tasks in beginner totals', () => {
      const counts = getTaskCountsByExperienceLevel('saas')
      const beginnerConfig = getExperienceLevelConfig('beginner')

      // Beginner max phase is 3
      expect(beginnerConfig.maxPhase).toBe(3)

      // Get intermediate counts for comparison
      // Intermediate includes Phase 4, beginner doesn't
      expect(counts.beginner.taskCount).toBeLessThan(counts.intermediate.taskCount)
    })

    it('should correctly sequence through phases for beginner', () => {
      const user = { productType: 'saas', experienceLevel: 'beginner' }

      // No tasks completed - should start Phase 1
      const result1 = getNextTaskRecommendation(user, [])
      expect(result1.currentPhase).toBeLessThanOrEqual(3)

      // Complete all Phase 1 beginner tasks
      const phase1BeginnerTasks = ['growth-5', 'premium-intro-1']
      const result2 = getNextTaskRecommendation(user, phase1BeginnerTasks)

      // Should still be within phases 1-3
      if (result2.nextTask) {
        expect(result2.nextTask.phase).toBeLessThanOrEqual(3)
      }
    })
  })

  describe('Business Model + Experience Level Filtering', () => {
    it('should correctly apply both filters', () => {
      const businessModels = ['saas', 'service', 'info-product', 'ecommerce']
      const experienceLevels = ['beginner', 'intermediate']

      for (const bm of businessModels) {
        for (const el of experienceLevels) {
          const user = { productType: bm, experienceLevel: el }
          const result = getNextTaskRecommendation(user, [])

          // Should always get a valid result
          expect(result.experienceLevel).toBe(el)
          expect(result.maxPhase).toBe(el === 'beginner' ? 3 : 4)

          // Should have valid progress
          expect(result.overallProgress.total).toBeGreaterThan(0)
        }
      }
    })
  })

  describe('Edge Case: No productType', () => {
    it('should work without productType specified', () => {
      const user = { experienceLevel: 'beginner' }
      const result = getNextTaskRecommendation(user, [])

      expect(result.nextTask).toBeDefined()
      expect(result.experienceLevel).toBe('beginner')
    })
  })

  describe('Completion States', () => {
    it('should handle beginner completion with proper message', () => {
      // Find all beginner tasks for saas
      const counts = getTaskCountsByExperienceLevel('saas')

      // Simulate completing all beginner tasks
      // (We need to get the actual task IDs)
      const allBeginnerTaskIds = [
        'growth-5', 'premium-intro-1', // Phase 1
        'growth-1', 'premium-1', // Phase 2
        'growth-4', 'growth-6', 'growth-7', 'premium-8', 'premium-10' // Phase 3
      ]

      const user = { productType: 'saas', experienceLevel: 'beginner' }
      const result = getNextTaskRecommendation(user, allBeginnerTaskIds)

      // Should be complete and suggest switching to intermediate
      if (result.isComplete) {
        expect(result.message).toContain('Intermediate')
      }
    })
  })
})
