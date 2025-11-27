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
      recordUsage: vi.fn().mockResolvedValue(undefined)
    }

    mockTaskRepository = {
      addAIOutput: vi.fn().mockResolvedValue(undefined)
    }

    mockLogger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      logError: vi.fn()
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
        { aiPrompt: 'Generate description for {appDesc}' }
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

      await useCase.execute('user-1', 'project-1', 'task-1', {}, { aiPrompt: 'Test' })

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

      await useCase.execute('user-1', 'project-1', 'task-1', {}, { aiPrompt: 'Test' })

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
      mockQuotaRepository.getMonthlyUsage.mockResolvedValue({ count: 20 }) // At free limit

      await expect(
        useCase.execute('user-1', 'project-1', 'task-1', {}, { aiPrompt: 'Test' })
      ).rejects.toThrow(QuotaExceededError)
    })

    it('allows generation when under quota', async () => {
      mockQuotaRepository.getMonthlyUsage.mockResolvedValue({ count: 5 }) // Under free limit
      mockGrokClient.generate.mockResolvedValue({
        text: 'Content',
        tokens: 100
      })

      const result = await useCase.execute('user-1', 'project-1', 'task-1', {}, { aiPrompt: 'Test' })
      expect(result).toBeDefined()
    })

    it('checks quota before API call', async () => {
      mockQuotaRepository.getMonthlyUsage.mockResolvedValue({ count: 25 })

      await expect(
        useCase.execute('user-1', 'project-1', 'task-1', {}, { aiPrompt: 'Test' })
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
        { aiPrompt: 'Build {appDesc} for {targetAudience}' }
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
        { aiPrompt: 'Use {field2}' } // field2 is missing
      )

      expect(mockGrokClient.generate).toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('catches and logs API errors', async () => {
      mockGrokClient.generate.mockRejectedValue(new APIError('API failed'))
      mockQuotaRepository.getMonthlyUsage.mockResolvedValue({ count: 5 })

      await expect(
        useCase.execute('user-1', 'project-1', 'task-1', {}, { aiPrompt: 'Test' })
      ).rejects.toThrow(APIError)

      expect(mockLogger.error).toHaveBeenCalled()
    })

    it('handles network timeouts', async () => {
      mockGrokClient.generate.mockRejectedValue(new Error('Timeout'))
      mockQuotaRepository.getMonthlyUsage.mockResolvedValue({ count: 5 })

      await expect(
        useCase.execute('user-1', 'project-1', 'task-1', {}, { aiPrompt: 'Test' })
      ).rejects.toThrow()
    })

    it('logs warnings for quota exceeded', async () => {
      mockQuotaRepository.getMonthlyUsage.mockResolvedValue({ count: 25 })

      try {
        await useCase.execute('user-1', 'project-1', 'task-1', {}, { aiPrompt: 'Test' })
      } catch (e) {
        // Expected
      }

      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining('Quota exceeded'),
        expect.any(Object)
      )
    })
  })

  describe('Usage Recording', () => {
    it('records usage after successful generation', async () => {
      mockGrokClient.generate.mockResolvedValue({
        text: 'Generated',
        tokens: 150
      })

      await useCase.execute('user-1', 'project-1', 'task-1', {}, { aiPrompt: 'Test' })

      expect(mockQuotaRepository.recordUsage).toHaveBeenCalledWith(
        'user-1',
        'task-1',
        'grok-2',
        150,
        150,
        expect.any(Number)
      )
    })

    it('does not record usage when generation fails', async () => {
      mockGrokClient.generate.mockRejectedValue(new Error('Failed'))
      mockQuotaRepository.getMonthlyUsage.mockResolvedValue({ count: 5 })

      try {
        await useCase.execute('user-1', 'project-1', 'task-1', {}, { aiPrompt: 'Test' })
      } catch (e) {
        // Expected
      }

      expect(mockQuotaRepository.recordUsage).not.toHaveBeenCalled()
    })
  })

  describe('Input Validation', () => {
    it('requires user ID', async () => {
      await expect(
        useCase.execute(null, 'project-1', 'task-1', {}, { aiPrompt: 'Test' })
      ).rejects.toThrow()
    })

    it('requires project ID', async () => {
      await expect(
        useCase.execute('user-1', null, 'task-1', {}, { aiPrompt: 'Test' })
      ).rejects.toThrow()
    })

    it('requires task ID', async () => {
      await expect(
        useCase.execute('user-1', 'project-1', null, {}, { aiPrompt: 'Test' })
      ).rejects.toThrow()
    })

    it('requires AI prompt in config', async () => {
      await expect(
        useCase.execute('user-1', 'project-1', 'task-1', {}, {})
      ).rejects.toThrow()
    })
  })
})
