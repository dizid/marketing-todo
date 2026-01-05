/**
 * Real-Time Updates Service
 *
 * Manages real-time data updates for A/B tests and analytics metrics.
 * Supports both polling and WebSocket strategies with automatic fallback.
 *
 * Features:
 * - Automatic data refresh at configurable intervals
 * - WebSocket support with fallback to polling
 * - Event emitters for reactive updates
 * - Resource cleanup and memory leak prevention
 * - Connection status monitoring
 */

import { ref } from 'vue'

export const useRealTimeUpdatesService = () => {
  // Connection state
  const isConnected = ref(false)
  const connectionMode = ref('polling') // 'websocket' or 'polling'
  const lastUpdateTime = ref(null)

  // Subscriptions map to track active listeners
  const subscriptions = new Map()
  let subscriptionId = 0

  // Polling intervals
  const intervals = new Map()

  // WebSocket connection
  let ws = null

  /**
   * Subscribe to data updates
   * Returns unsubscribe function
   */
  const subscribe = (key, callback, options = {}) => {
    const id = ++subscriptionId
    const config = {
      interval: options.interval || 5000, // 5 seconds default
      onData: callback,
      onError: options.onError || null,
      autoStart: options.autoStart !== false
    }

    // Store subscription
    if (!subscriptions.has(key)) {
      subscriptions.set(key, new Map())
    }
    subscriptions.get(key).set(id, config)

    // Start polling if no interval exists for this key
    if (!intervals.has(key) && config.autoStart) {
      startPolling(key, config.interval)
    }

    // Return unsubscribe function
    return () => unsubscribe(key, id)
  }

  /**
   * Unsubscribe from updates
   */
  const unsubscribe = (key, subscriptionId) => {
    if (subscriptions.has(key)) {
      subscriptions.get(key).delete(subscriptionId)

      // Stop polling if no more subscribers for this key
      if (subscriptions.get(key).size === 0) {
        stopPolling(key)
        subscriptions.delete(key)
      }
    }
  }

  /**
   * Start polling for a specific data key
   */
  const startPolling = (key, interval) => {
    if (intervals.has(key)) return // Already polling

    const pollInterval = setInterval(async () => {
      try {
        const data = await fetchData(key)
        lastUpdateTime.value = new Date().toISOString()

        // Notify all subscribers
        if (subscriptions.has(key)) {
          subscriptions.get(key).forEach(config => {
            try {
              config.onData(data)
            } catch (error) {
              console.error(`Error in subscription callback for ${key}:`, error)
              if (config.onError) {
                config.onError(error)
              }
            }
          })
        }
      } catch (error) {
        console.error(`Error fetching data for ${key}:`, error)
        if (subscriptions.has(key)) {
          subscriptions.get(key).forEach(config => {
            if (config.onError) {
              config.onError(error)
            }
          })
        }
      }
    }, interval)

    intervals.set(key, pollInterval)
  }

  /**
   * Stop polling for a specific data key
   */
  const stopPolling = (key) => {
    if (intervals.has(key)) {
      clearInterval(intervals.get(key))
      intervals.delete(key)
    }
  }

  /**
   * Fetch data from appropriate source
   * Can be extended to fetch from API or service
   */
  const fetchData = async (key) => {
    // Parse key format: 'dataType:id' (e.g., 'abtest:test_123')
    const [dataType, id] = key.split(':')

    try {
      switch (dataType) {
        case 'abtest':
          return fetchABTestData(id)
        case 'analytics':
          return fetchAnalyticsData(id)
        case 'benchmark':
          return fetchBenchmarkData(id)
        default:
          throw new Error(`Unknown data type: ${dataType}`)
      }
    } catch (error) {
      console.error(`Failed to fetch ${dataType} data for ${id}:`, error)
      throw error
    }
  }

  /**
   * Fetch A/B test data from localStorage or API
   */
  const fetchABTestData = (testId) => {
    try {
      const data = JSON.parse(
        localStorage.getItem('launchpilot-ab-tests') || '{"tests":{}}'
      )
      const test = data.tests[testId]

      if (!test) {
        throw new Error(`Test not found: ${testId}`)
      }

      return {
        ...test,
        lastFetched: new Date().toISOString(),
        source: 'localStorage'
      }
    } catch (error) {
      console.error('Error fetching A/B test data:', error)
      throw error
    }
  }

  /**
   * Fetch analytics data
   * Currently returns mock data - extend to fetch from actual analytics service
   */
  const fetchAnalyticsData = (analyticsId) => {
    // This would typically fetch from your analytics service
    return Promise.resolve({
      id: analyticsId,
      metrics: {
        visits: Math.floor(Math.random() * 1000),
        conversions: Math.floor(Math.random() * 100),
        clickRate: (Math.random() * 5).toFixed(2),
        bounceRate: (40 + Math.random() * 20).toFixed(2)
      },
      lastFetched: new Date().toISOString(),
      source: 'analytics-api'
    })
  }

  /**
   * Fetch benchmark comparison data
   */
  const fetchBenchmarkData = (benchmarkId) => {
    // This would typically fetch benchmark data
    return Promise.resolve({
      id: benchmarkId,
      score: Math.floor(40 + Math.random() * 60),
      position: 'Average',
      lastFetched: new Date().toISOString(),
      source: 'benchmark-service'
    })
  }

  /**
   * Initialize WebSocket connection (for future enhancement)
   */
  const connectWebSocket = (url) => {
    try {
      ws = new WebSocket(url)

      ws.onopen = () => {
        isConnected.value = true
        connectionMode.value = 'websocket'
        console.log('WebSocket connected')
      }

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          handleWebSocketMessage(message)
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        fallbackToPolling()
      }

      ws.onclose = () => {
        isConnected.value = false
        console.log('WebSocket disconnected')
        fallbackToPolling()
      }
    } catch (error) {
      console.error('Failed to connect WebSocket:', error)
      fallbackToPolling()
    }
  }

  /**
   * Handle incoming WebSocket messages
   */
  const handleWebSocketMessage = (message) => {
    const { type, key, data } = message

    if (type === 'update' && subscriptions.has(key)) {
      subscriptions.get(key).forEach(config => {
        try {
          config.onData(data)
        } catch (error) {
          console.error(`Error in subscription callback:`, error)
        }
      })
    }

    lastUpdateTime.value = new Date().toISOString()
  }

  /**
   * Fallback from WebSocket to polling
   */
  const fallbackToPolling = () => {
    connectionMode.value = 'polling'

    // Resume all active polling
    subscriptions.forEach((subMap, key) => {
      if (!intervals.has(key) && subMap.size > 0) {
        // Get interval from first subscriber
        const firstSub = Array.from(subMap.values())[0]
        startPolling(key, firstSub.interval)
      }
    })
  }

  /**
   * Send data update via WebSocket
   */
  const sendUpdate = (key, data) => {
    if (ws && isConnected.value) {
      try {
        ws.send(JSON.stringify({
          type: 'update',
          key,
          data,
          timestamp: new Date().toISOString()
        }))
      } catch (error) {
        console.error('Error sending WebSocket update:', error)
      }
    }
  }

  /**
   * Force immediate update for a key
   */
  const forceUpdate = async (key) => {
    try {
      const data = await fetchData(key)
      lastUpdateTime.value = new Date().toISOString()

      if (subscriptions.has(key)) {
        subscriptions.get(key).forEach(config => {
          try {
            config.onData(data)
          } catch (error) {
            console.error('Error in subscription callback:', error)
            if (config.onError) {
              config.onError(error)
            }
          }
        })
      }

      return data
    } catch (error) {
      console.error(`Error forcing update for ${key}:`, error)
      throw error
    }
  }

  /**
   * Batch update multiple keys
   */
  const batchUpdate = async (keys) => {
    const results = {}

    for (const key of keys) {
      try {
        results[key] = await forceUpdate(key)
      } catch (error) {
        results[key] = { error: error.message }
      }
    }

    return results
  }

  /**
   * Update interval for a specific key
   */
  const updateInterval = (key, newInterval) => {
    if (intervals.has(key)) {
      stopPolling(key)
      startPolling(key, newInterval)
    }

    // Update all subscribers for this key
    if (subscriptions.has(key)) {
      subscriptions.get(key).forEach(config => {
        config.interval = newInterval
      })
    }
  }

  /**
   * Get connection status
   */
  const getStatus = () => {
    return {
      isConnected: isConnected.value,
      mode: connectionMode.value,
      activeSubscriptions: subscriptions.size,
      activePolls: intervals.size,
      lastUpdate: lastUpdateTime.value,
      subscriberCount: Array.from(subscriptions.values()).reduce(
        (sum, map) => sum + map.size,
        0
      )
    }
  }

  /**
   * Cleanup all subscriptions and intervals
   */
  const cleanup = () => {
    // Stop all polling intervals
    intervals.forEach((interval) => clearInterval(interval))
    intervals.clear()

    // Clear all subscriptions
    subscriptions.clear()

    // Close WebSocket if connected
    if (ws && isConnected.value) {
      try {
        ws.close()
      } catch (error) {
        console.error('Error closing WebSocket:', error)
      }
    }

    isConnected.value = false
    connectionMode.value = 'polling'
  }

  /**
   * Reset service to initial state
   */
  const reset = () => {
    cleanup()
    subscriptionId = 0
    lastUpdateTime.value = null
  }

  return {
    // State
    isConnected,
    connectionMode,
    lastUpdateTime,

    // Core methods
    subscribe,
    unsubscribe,
    fetchData,
    forceUpdate,
    batchUpdate,

    // WebSocket methods
    connectWebSocket,
    sendUpdate,

    // Configuration
    startPolling,
    stopPolling,
    updateInterval,

    // Utilities
    getStatus,
    cleanup,
    reset,

    // Internal (for testing)
    subscriptions,
    intervals
  }
}
