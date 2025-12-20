/**
 * GenerateAIContentUseCase Unit Tests
 *
 * Tests AI generation orchestration with mocked dependencies
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GenerateAIContentUseCase } from '@/application/usecases'
import { QuotaExceededError, APIError } from '@/shared/utils/errors'

describe('GenerateAIContentUseCase', () => {
  let useCase
  let mockGrokClient
  let mockQuotaRepository
  let mockTaskRepository
  let mockLogger

  beforeEach(() => {
    // Mock dependencies
    mockGrokClient = {
      generate: vi.fn()
    }

    mockQuotaRepository = {
      getMonthlyUsage: vi.fn().mockResolvedValue({ count: 5 }),
      getSubscription: vi.fn().mockResolvedValue({ tier: 'free' }),
      recordUsage: vi.fn().mockResolvedValue(undefined),
      createQuotaModel: vi.fn().mockResolvedValue({
        canGenerate: () => true,
        getRemaining: () => 35,
        getLimit: () => 40,
        getDisplayMessage: () => '35 of 40 generations left',
        tier: 'free'
      })
    }

    mockTaskRepository = {
      addAIOutput: vi.fn().mockResolvedValue(undefined)
    }

    mockLogger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      logError: vi.fn(),
      child: vi.fn().mockReturnThis() // Returns self for chaining
    }

    useCase = new GenerateAIContentUseCase(
      mockGrokClient,
      mockQuotaRepository,
      mockTaskRepository,
      mockLogger
    )
  })

  describe('Successful Generation', () => {
    it('generates content within quota', async () => {
      mockGrokClient.generate.mockResolvedValue({
        text: 'Generated content',
        tokens: 150
      })

      const result = await useCase.execute(
        'user-1',
        'project-1',
        'task-1',
        { appDesc: 'My App' },
        { aiConfig: { promptTemplate: 'Generate description for {appDesc}' } }
      )

      expect(result.text).toBe('Generated content')
      expect(result.tokens).toBe(150)
      expect(mockGrokClient.generate).toHaveBeenCalled()
      expect(mockTaskRepository.addAIOutput).toHaveBeenCalled()
    })

    it('logs successful generation', async () => {
      mockGrokClient.generate.mockResolvedValue({
        text: 'Content',
        tokens: 100
      })

      await useCase.execute('user-1', 'project-1', 'task-1', {}, { aiConfig: { promptTemplate: 'Test' } })

      expect(mockLogger.info).toHaveBeenCalledWith(
        expect.stringContaining('success'),
        expect.any(Object)
      )
    })

    it('saves AI output to task', async () => {
      mockGrokClient.generate.mockResolvedValue({
        text: 'Generated',
        tokens: 100
      })

      await useCase.execute('user-1', 'project-1', 'task-1', {}, { aiConfig: { promptTemplate: 'Test' } })

      expect(mockTaskRepository.addAIOutput).toHaveBeenCalledWith(
        'project-1',
        'user-1',
        'task-1',
        'Generated'
      )
    })
  })

  describe('Quota Checking', () => {
    it('throws QuotaExceededError when quota exhausted', async () => {
      mockQuotaRepository.createQuotaModel.mockResolvedValue({
        canGenerate: () => false,
        getRemaining: () => 0,
        getLimit: () => 40,
        getDisplayMessage: () => 'Quota exceeded (40 per month)',
        tier: 'free'
      })

      await expect(
        useCase.execute('user-1', 'project-1', 'task-1', {}, { aiConfig: { promptTemplate: 'Test' } })
      ).rejects.toThrow(QuotaExceededError)
    })

    it('allows generation when under quota', async () => {
      mockGrokClient.generate.mockResolvedValue({
        text: 'Content',
        tokens: 100
      })

      const result = await useCase.execute('user-1', 'project-1', 'task-1', {}, { aiConfig: { promptTemplate: 'Test' } })
      expect(result).toBeDefined()
    })

    it('checks quota before API call', async () => {
      mockQuotaRepository.createQuotaModel.mockResolvedValue({
        canGenerate: () => false,
        getRemaining: () => 0,
        getLimit: () => 40,
        getDisplayMessage: () => 'Quota exceeded (40 per month)',
        tier: 'free'
      })

      await expect(
        useCase.execute('user-1', 'project-1', 'task-1', {}, { aiConfig: { promptTemplate: 'Test' } })
      ).rejects.toThrow()

      // API should not be called when quota exceeded
      expect(mockGrokClient.generate).not.toHaveBeenCalled()
    })
  })

  describe('Prompt Building', () => {
    it('substitutes form data into prompt template', async () => {
      mockGrokClient.generate.mockResolvedValue({
        text: 'Result',
        tokens: 100
      })

      const formData = {
        appDesc: 'My Amazing App',
        targetAudience: 'Developers'
      }

      await useCase.execute(
        'user-1',
        'project-1',
        'task-1',
        formData,
        { aiConfig: { promptTemplate: 'Build {appDesc} for {targetAudience}' } }
      )

      const callArgs = mockGrokClient.generate.mock.calls[0]
      expect(callArgs[0]).toContain('My Amazing App')
      expect(callArgs[0]).toContain('Developers')
    })

    it('handles missing form fields gracefully', async () => {
      mockGrokClient.generate.mockResolvedValue({
        text: 'Result',
        tokens: 100
      })

      const formData = { field1: 'value1' }

      await useCase.execute(
        'user-1',
        'project-1',
        'task-1',
        formData,
        { aiConfig: { promptTemplate: 'Use {field2}' } } // field2 is missing
      )

      expect(mockGrokClient.generate).toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('catches and logs API errors', async () => {
      mockGrokClient.generate.mockRejectedValue(new APIError('API failed'))

      await expect(
        useCase.execute('user-1', 'project-1', 'task-1', {}, { aiConfig: { promptTemplate: 'Test' } })
      ).rejects.toThrow(APIError)

      // Implementation uses logError method
      expect(mockLogger.logError).toHaveBeenCalled()
    })

    it('handles network timeouts', async () => {
      mockGrokClient.generate.mockRejectedValue(new Error('Timeout'))

      await expect(
        useCase.execute('user-1', 'project-1', 'task-1', {}, { aiConfig: { promptTemplate: 'Test' } })
      ).rejects.toThrow()
    })

    it('logs error for quota exceeded', async () => {
      mockQuotaRepository.createQuotaModel.mockResolvedValue({
        canGenerate: () => false,
        getRemaining: () => 0,
        getLimit: () => 40,
        getDisplayMessage: () => 'Quota exceeded (40 per month)',
        tier: 'free'
      })

      try {
        await useCase.execute('user-1', 'project-1', 'task-1', {}, { aiConfig: { promptTemplate: 'Test' } })
      } catch (e) {
        // Expected - quota exceeded throws QuotaExceededError
      }

      // Implementation logs via logError, not warn
      expect(mockLogger.logError).toHaveBeenCalled()
    })
  })

  describe('Usage Recording', () => {
    it('logs usage after successful generation', async () => {
      // Note: Actual usage tracking happens server-side in grok-proxy function
      // Client-side just logs for UI updates
      mockGrokClient.generate.mockResolvedValue({
        text: 'Generated',
        tokens: 150
      })

      await useCase.execute('user-1', 'project-1', 'task-1', {}, { aiConfig: { promptTemplate: 'Test' } })

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Usage tracking recorded',
        expect.objectContaining({
          userId: 'user-1',
          taskId: 'task-1',
          tokens: 150
        })
      )
    })

    it('does not log usage when generation fails', async () => {
      mockGrokClient.generate.mockRejectedValue(new Error('Failed'))

      try {
        await useCase.execute('user-1', 'project-1', 'task-1', {}, { aiConfig: { promptTemplate: 'Test' } })
      } catch (e) {
        // Expected
      }

      // Usage tracking log should NOT be called on failure
      expect(mockLogger.info).not.toHaveBeenCalledWith(
        'Usage tracking recorded',
        expect.any(Object)
      )
    })
  })

  describe('Input Validation', () => {
    it('requires user ID', async () => {
      await expect(
        useCase.execute(null, 'project-1', 'task-1', {}, { aiConfig: { promptTemplate: 'Test' } })
      ).rejects.toThrow()
    })

    it('requires project ID', async () => {
      await expect(
        useCase.execute('user-1', null, 'task-1', {}, { aiConfig: { promptTemplate: 'Test' } })
      ).rejects.toThrow()
    })

    it('requires task ID', async () => {
      await expect(
        useCase.execute('user-1', 'project-1', null, {}, { aiConfig: { promptTemplate: 'Test' } })
      ).rejects.toThrow()
    })

    it('requires AI config in taskConfig', async () => {
      await expect(
        useCase.execute('user-1', 'project-1', 'task-1', {}, {})
      ).rejects.toThrow()
    })
  })
})
