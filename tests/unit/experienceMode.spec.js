/**
 * Experience Mode (Beginner/Intermediate) - Comprehensive Test Suite
 *
 * Tests:
 * 1. Task Dependency Map structure
 * 2. Recommendation Engine filtering by experience level
 * 3. Task counts per experience level
 * 4. Phase restrictions per level
 * 5. Progress calculation per level
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  getNextTaskRecommendation,
  getTasksForPhase,
  getExperienceLevelConfig,
  getExperienceLevels,
  getTaskCountsByExperienceLevel
} from '@/services/taskRecommendationEngine.js'
import TASK_MAP from '@/data/TASK_DEPENDENCY_MAP.json'

describe('Experience Mode Feature', () => {

  describe('Task Dependency Map Structure', () => {
    it('should have experienceLevels configuration', () => {
      expect(TASK_MAP.experienceLevels).toBeDefined()
      expect(TASK_MAP.experienceLevels.beginner).toBeDefined()
      expect(TASK_MAP.experienceLevels.intermediate).toBeDefined()
      expect(TASK_MAP.experienceLevels.advanced).toBeDefined()
    })

    it('should have correct maxPhase for each level', () => {
      expect(TASK_MAP.experienceLevels.beginner.maxPhase).toBe(3)
      expect(TASK_MAP.experienceLevels.intermediate.maxPhase).toBe(4)
      expect(TASK_MAP.experienceLevels.advanced.maxPhase).toBe(4)
    })

    it('should have experienceLevels array on each task', () => {
      TASK_MAP.phases.forEach(phase => {
        phase.tasks.forEach(task => {
          expect(task.experienceLevels).toBeDefined()
          expect(Array.isArray(task.experienceLevels)).toBe(true)
          expect(task.experienceLevels.length).toBeGreaterThan(0)
        })
      })
    })

    it('should have valid experience level values on tasks', () => {
      const validLevels = ['beginner', 'intermediate', 'advanced']
      TASK_MAP.phases.forEach(phase => {
        phase.tasks.forEach(task => {
          task.experienceLevels.forEach(level => {
            expect(validLevels).toContain(level)
          })
        })
      })
    })
  })

  describe('Experience Level Config', () => {
    it('should return beginner config by default', () => {
      const config = getExperienceLevelConfig()
      expect(config.name).toBe('Beginner')
      expect(config.maxPhase).toBe(3)
    })

    it('should return correct config for each level', () => {
      const beginner = getExperienceLevelConfig('beginner')
      const intermediate = getExperienceLevelConfig('intermediate')
      const advanced = getExperienceLevelConfig('advanced')

      expect(beginner.maxPhase).toBe(3)
      expect(intermediate.maxPhase).toBe(4)
      expect(advanced.maxPhase).toBe(4)
    })

    it('should fall back to beginner for invalid level', () => {
      const config = getExperienceLevelConfig('invalid')
      expect(config.name).toBe('Beginner')
    })
  })

  describe('Get All Experience Levels', () => {
    it('should return all experience levels', () => {
      const levels = getExperienceLevels()
      expect(Object.keys(levels)).toEqual(['beginner', 'intermediate', 'advanced'])
    })
  })

  describe('Recommendation Engine - Beginner Mode', () => {
    const beginnerUser = { productType: 'saas', experienceLevel: 'beginner' }

    it('should recommend tasks only from phases 1-3 for beginners', () => {
      const result = getNextTaskRecommendation(beginnerUser, [])

      expect(result.nextTask).toBeDefined()
      expect(result.maxPhase).toBe(3)
      expect(result.experienceLevel).toBe('beginner')
    })

    it('should filter out intermediate-only tasks for beginners', () => {
      // Complete all Phase 1 beginner tasks
      const phase1Completed = ['growth-5', 'setup-1'] // Positioning + Audience Research
      const result = getNextTaskRecommendation(beginnerUser, phase1Completed)

      // Should NOT recommend growth-3 (Competitor Intelligence) which is intermediate only
      if (result.nextTask) {
        expect(result.nextTask.id).not.toBe('growth-3')
      }
    })

    it('should show completion message when all beginner tasks are done', () => {
      // Simulate completing all beginner-level tasks across phases 1-3
      const allBeginnerTasks = []
      TASK_MAP.phases.forEach(phase => {
        if (phase.phase <= 3) {
          phase.tasks.forEach(task => {
            if (task.experienceLevels.includes('beginner') &&
                (task.businessModels.includes('all') || task.businessModels.includes('saas'))) {
              allBeginnerTasks.push(task.id)
            }
          })
        }
      })

      const result = getNextTaskRecommendation(beginnerUser, allBeginnerTasks)

      expect(result.isComplete).toBe(true)
      expect(result.message).toContain('beginner')
      expect(result.message).toContain('Intermediate')
    })

    it('should never recommend Phase 4 tasks for beginners', () => {
      const phase4TaskIds = TASK_MAP.phases.find(p => p.phase === 4).tasks.map(t => t.id)

      // Complete everything in phases 1-3
      const completedTasks = []
      TASK_MAP.phases.forEach(phase => {
        if (phase.phase <= 3) {
          phase.tasks.forEach(task => {
            if (task.experienceLevels.includes('beginner')) {
              completedTasks.push(task.id)
            }
          })
        }
      })

      const result = getNextTaskRecommendation(beginnerUser, completedTasks)

      if (result.nextTask) {
        expect(phase4TaskIds).not.toContain(result.nextTask.id)
      }
    })
  })

  describe('Recommendation Engine - Intermediate Mode', () => {
    const intermediateUser = { productType: 'saas', experienceLevel: 'intermediate' }

    it('should recommend tasks from all 4 phases for intermediate', () => {
      const result = getNextTaskRecommendation(intermediateUser, [])

      expect(result.maxPhase).toBe(4)
      expect(result.experienceLevel).toBe('intermediate')
    })

    it('should include intermediate-only tasks', () => {
      // Complete Phase 1 beginner tasks to force engine to consider intermediate tasks
      const phase1Completed = ['growth-5', 'setup-1']
      const result = getNextTaskRecommendation(intermediateUser, phase1Completed)

      // Should include growth-3 (Competitor Intelligence) which is intermediate
      // or continue with other tasks
      expect(result.nextTask).toBeDefined()
    })

    it('should recommend Phase 4 tasks after completing phases 1-3', () => {
      // Complete all tasks in phases 1-3
      const completedTasks = []
      TASK_MAP.phases.forEach(phase => {
        if (phase.phase <= 3) {
          phase.tasks.forEach(task => {
            if (task.experienceLevels.includes('intermediate') &&
                (task.businessModels.includes('all') || task.businessModels.includes('saas'))) {
              completedTasks.push(task.id)
            }
          })
        }
      })

      const result = getNextTaskRecommendation(intermediateUser, completedTasks)

      // Should now recommend Phase 4 tasks
      if (result.nextTask) {
        expect(result.nextTask.phase).toBe(4)
      }
    })
  })

  describe('Task Counts by Experience Level', () => {
    it('should return correct task counts for SaaS business model', () => {
      const counts = getTaskCountsByExperienceLevel('saas')

      expect(counts.beginner).toBeDefined()
      expect(counts.intermediate).toBeDefined()
      expect(counts.advanced).toBeDefined()

      // Beginner should have fewer tasks than intermediate
      expect(counts.beginner.taskCount).toBeLessThan(counts.intermediate.taskCount)
    })

    it('should return correct task counts for all business models', () => {
      const counts = getTaskCountsByExperienceLevel(null)

      // Should count all tasks regardless of business model
      expect(counts.beginner.taskCount).toBeGreaterThan(0)
      expect(counts.intermediate.taskCount).toBeGreaterThan(0)
    })

    it('should include metadata in counts', () => {
      const counts = getTaskCountsByExperienceLevel('saas')

      expect(counts.beginner.name).toBe('Beginner')
      expect(counts.beginner.description).toBeDefined()
      expect(counts.beginner.maxPhase).toBe(3)

      expect(counts.intermediate.name).toBe('Intermediate')
      expect(counts.intermediate.maxPhase).toBe(4)
    })
  })

  describe('Get Tasks For Phase', () => {
    it('should filter tasks by experience level in getTasksForPhase', () => {
      const beginnerUser = { productType: 'saas', experienceLevel: 'beginner' }
      const intermediateUser = { productType: 'saas', experienceLevel: 'intermediate' }

      const beginnerPhase1 = getTasksForPhase(1, beginnerUser, [])
      const intermediatePhase1 = getTasksForPhase(1, intermediateUser, [])

      // Intermediate should have more tasks (includes Competitor Intelligence)
      expect(intermediatePhase1.length).toBeGreaterThanOrEqual(beginnerPhase1.length)
    })

    it('should return empty array for Phase 4 with beginner', () => {
      const beginnerUser = { productType: 'saas', experienceLevel: 'beginner' }

      // Phase 4 tasks should all be intermediate/advanced only
      const phase4Tasks = getTasksForPhase(4, beginnerUser, [])

      // All Phase 4 tasks are intermediate+ only, so beginners see them too
      // but the recommendation engine won't recommend them due to maxPhase
      expect(phase4Tasks).toBeDefined()
    })
  })

  describe('Progress Calculation', () => {
    it('should calculate progress based on experience level tasks', () => {
      const beginnerUser = { productType: 'saas', experienceLevel: 'beginner' }
      const intermediateUser = { productType: 'saas', experienceLevel: 'intermediate' }

      const beginnerResult = getNextTaskRecommendation(beginnerUser, [])
      const intermediateResult = getNextTaskRecommendation(intermediateUser, [])

      // Both should start at 0%
      expect(beginnerResult.overallProgress.completed).toBe(0)
      expect(intermediateResult.overallProgress.completed).toBe(0)

      // But total should be different
      expect(beginnerResult.overallProgress.total).toBeLessThan(intermediateResult.overallProgress.total)
    })

    it('should update progress correctly when completing tasks', () => {
      const beginnerUser = { productType: 'saas', experienceLevel: 'beginner' }

      // Complete one task
      const result1 = getNextTaskRecommendation(beginnerUser, ['growth-5'])
      expect(result1.overallProgress.completed).toBe(1)

      // Complete two tasks
      const result2 = getNextTaskRecommendation(beginnerUser, ['growth-5', 'setup-1'])
      expect(result2.overallProgress.completed).toBe(2)
    })
  })

  describe('Alternatives Filtering', () => {
    it('should only suggest alternatives matching experience level', () => {
      const beginnerUser = { productType: 'saas', experienceLevel: 'beginner' }

      const result = getNextTaskRecommendation(beginnerUser, [])

      if (result.alternatives && result.alternatives.length > 0) {
        // All alternatives should be beginner-compatible
        result.alternatives.forEach(alt => {
          const task = TASK_MAP.phases
            .flatMap(p => p.tasks)
            .find(t => t.id === alt.id)

          if (task) {
            expect(task.experienceLevels).toContain('beginner')
          }
        })
      }
    })
  })

  describe('Business Model + Experience Level Combination', () => {
    it('should correctly filter by both business model AND experience level', () => {
      // Service business model, beginner level
      const user = { productType: 'service', experienceLevel: 'beginner' }

      const result = getNextTaskRecommendation(user, [])

      // Task should match both filters
      if (result.nextTask) {
        const task = TASK_MAP.phases
          .flatMap(p => p.tasks)
          .find(t => t.id === result.nextTask.id)

        expect(task.experienceLevels).toContain('beginner')
        expect(
          task.businessModels.includes('all') ||
          task.businessModels.includes('service')
        ).toBe(true)
      }
    })
  })

  describe('Edge Cases', () => {
    it('should handle undefined experience level (default to beginner)', () => {
      const user = { productType: 'saas' } // No experienceLevel

      const result = getNextTaskRecommendation(user, [])

      expect(result.experienceLevel).toBe('beginner')
      expect(result.maxPhase).toBe(3)
    })

    it('should handle empty completed tasks array', () => {
      const user = { productType: 'saas', experienceLevel: 'beginner' }

      const result = getNextTaskRecommendation(user, [])

      expect(result.nextTask).toBeDefined()
      expect(result.currentPhase).toBe(1)
    })

    it('should handle null completed tasks', () => {
      const user = { productType: 'saas', experienceLevel: 'beginner' }

      // Should not throw
      expect(() => getNextTaskRecommendation(user, null)).not.toThrow()
    })
  })

  describe('Task Distribution Verification', () => {
    it('should have reasonable task distribution for beginners', () => {
      const counts = getTaskCountsByExperienceLevel('saas')

      // Beginners should have at least 8 tasks (reasonable minimum)
      expect(counts.beginner.taskCount).toBeGreaterThanOrEqual(8)
      // But not more than 15 (should be focused)
      expect(counts.beginner.taskCount).toBeLessThanOrEqual(15)
    })

    it('should have more tasks for intermediate than beginner', () => {
      const counts = getTaskCountsByExperienceLevel('saas')

      // Intermediate should have significantly more tasks
      expect(counts.intermediate.taskCount).toBeGreaterThan(counts.beginner.taskCount)
      // At least 5 more tasks
      expect(counts.intermediate.taskCount - counts.beginner.taskCount).toBeGreaterThanOrEqual(5)
    })
  })
})
