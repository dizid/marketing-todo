/**
 * Retry Utility Tests
 *
 * Tests exponential backoff retry logic for transient failures
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { withRetry } from '@/utils/retry'

describe('withRetry', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns result immediately on successful call', async () => {
    const mockFn = vi.fn().mockResolvedValue({ data: 'success' })

    const promise = withRetry(mockFn, { maxRetries: 3, baseBackoff: 1000 })

    // Fast-forward timers to resolve promise
    await vi.runAllTimersAsync()

    const result = await promise
    expect(result).toEqual({ data: 'success' })
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('retries on 500 server error up to maxRetries', async () => {
    const error500 = new Error('Internal Server Error')
    error500.status = 500

    const mockFn = vi.fn()
      .mockRejectedValueOnce(error500)
      .mockRejectedValueOnce(error500)
      .mockResolvedValueOnce({ data: 'success' })

    const promise = withRetry(mockFn, { maxRetries: 3, baseBackoff: 1000 })

    // Fast-forward timers to handle retries
    await vi.runAllTimersAsync()

    const result = await promise
    expect(result).toEqual({ data: 'success' })
    expect(mockFn).toHaveBeenCalledTimes(3)
  })

  it('does NOT retry on 400 client error', async () => {
    const error400 = new Error('Bad Request')
    error400.status = 400

    const mockFn = vi.fn().mockRejectedValue(error400)

    const promise = withRetry(mockFn, { maxRetries: 3, baseBackoff: 1000 })

    await expect(promise).rejects.toThrow('Bad Request')
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('does NOT retry on 404 client error', async () => {
    const error404 = new Error('Not Found')
    error404.statusCode = 404

    const mockFn = vi.fn().mockRejectedValue(error404)

    const promise = withRetry(mockFn, { maxRetries: 3, baseBackoff: 1000 })

    await expect(promise).rejects.toThrow('Not Found')
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('does NOT retry on 429 rate limit (4xx client error)', async () => {
    const error429 = new Error('Rate Limit Exceeded')
    error429.status = 429

    const mockFn = vi.fn().mockRejectedValue(error429)

    const promise = withRetry(mockFn, { maxRetries: 3, baseBackoff: 1000 })

    await expect(promise).rejects.toThrow('Rate Limit Exceeded')
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('DOES retry on 503 service unavailable', async () => {
    const error503 = new Error('Service Unavailable')
    error503.status = 503

    const mockFn = vi.fn()
      .mockRejectedValueOnce(error503)
      .mockResolvedValueOnce({ data: 'success' })

    const promise = withRetry(mockFn, { maxRetries: 3, baseBackoff: 1000 })

    await vi.runAllTimersAsync()

    const result = await promise
    expect(result).toEqual({ data: 'success' })
    expect(mockFn).toHaveBeenCalledTimes(2)
  })

  it('uses exponential backoff for retry delays', async () => {
    const error500 = new Error('Server Error')
    error500.status = 500

    const mockFn = vi.fn()
      .mockRejectedValueOnce(error500)
      .mockRejectedValueOnce(error500)
      .mockResolvedValueOnce({ data: 'success' })

    const promise = withRetry(mockFn, { maxRetries: 3, baseBackoff: 1000 })

    // First attempt fails immediately
    await Promise.resolve()
    expect(mockFn).toHaveBeenCalledTimes(1)

    // First retry after 1000ms (baseBackoff * 2^0)
    await vi.advanceTimersByTimeAsync(1000)
    expect(mockFn).toHaveBeenCalledTimes(2)

    // Second retry after 2000ms (baseBackoff * 2^1)
    await vi.advanceTimersByTimeAsync(2000)
    expect(mockFn).toHaveBeenCalledTimes(3)

    const result = await promise
    expect(result).toEqual({ data: 'success' })
  })

  it('throws last error when max retries exhausted', async () => {
    const error500 = new Error('Persistent Server Error')
    error500.status = 500

    const mockFn = vi.fn().mockRejectedValue(error500)

    const promise = withRetry(mockFn, { maxRetries: 2, baseBackoff: 100 })

    // Attach rejection handler BEFORE advancing timers to prevent unhandled rejection
    const resultPromise = promise.catch(err => err)

    await vi.runAllTimersAsync()

    const err = await resultPromise
    expect(err).toBeInstanceOf(Error)
    expect(err.message).toBe('Persistent Server Error')
    expect(mockFn).toHaveBeenCalledTimes(3) // Initial + 2 retries
  })

  it('does NOT retry on AbortError', async () => {
    const abortError = new Error('Aborted')
    abortError.name = 'AbortError'

    const mockFn = vi.fn().mockRejectedValue(abortError)

    const promise = withRetry(mockFn, { maxRetries: 3, baseBackoff: 1000 })

    await expect(promise).rejects.toThrow('Aborted')
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('retries on network errors without status code', async () => {
    const networkError = new Error('Network request failed')

    const mockFn = vi.fn()
      .mockRejectedValueOnce(networkError)
      .mockResolvedValueOnce({ data: 'success' })

    const promise = withRetry(mockFn, { maxRetries: 3, baseBackoff: 1000 })

    await vi.runAllTimersAsync()

    const result = await promise
    expect(result).toEqual({ data: 'success' })
    expect(mockFn).toHaveBeenCalledTimes(2)
  })

  it('respects custom maxRetries option', async () => {
    const error500 = new Error('Server Error')
    error500.status = 500

    const mockFn = vi.fn().mockRejectedValue(error500)

    const promise = withRetry(mockFn, { maxRetries: 5, baseBackoff: 100 })

    // Attach rejection handler BEFORE advancing timers to prevent unhandled rejection
    const resultPromise = promise.catch(err => err)

    await vi.runAllTimersAsync()

    const err = await resultPromise
    expect(err).toBeInstanceOf(Error)
    expect(err.message).toBe('Server Error')
    expect(mockFn).toHaveBeenCalledTimes(6) // Initial + 5 retries
  })

  it('respects custom baseBackoff option', async () => {
    const error500 = new Error('Server Error')
    error500.status = 500

    const mockFn = vi.fn()
      .mockRejectedValueOnce(error500)
      .mockResolvedValueOnce({ data: 'success' })

    const promise = withRetry(mockFn, { maxRetries: 1, baseBackoff: 500 })

    // First attempt fails
    await Promise.resolve()
    expect(mockFn).toHaveBeenCalledTimes(1)

    // Retry after custom baseBackoff of 500ms
    await vi.advanceTimersByTimeAsync(500)
    expect(mockFn).toHaveBeenCalledTimes(2)

    const result = await promise
    expect(result).toEqual({ data: 'success' })
  })
})
