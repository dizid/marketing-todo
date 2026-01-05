/**
 * A/B Test Manager Service
 *
 * Manages A/B tests including creation, tracking, statistical analysis,
 * and automatic winner/loser detection using chi-square test.
 *
 * Features:
 * - Create & manage A/B tests with control and variant versions
 * - Track conversions and metrics for each variant
 * - Calculate statistical significance (95% confidence)
 * - Auto-pause underperforming variants
 * - Recommend winners based on significance
 */

const STORAGE_KEY = 'launchpilot-ab-tests'
const CONVERSION_HISTORY_KEY = 'launchpilot-ab-conversions'

export const useABTestManager = () => {
  /**
   * Create a new A/B test
   * @param {Object} testConfig
   * @returns {Object} Created test with ID and metadata
   */
  const createTest = (testConfig) => {
    try {
      const tests = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"tests":{}}')
      tests.tests = tests.tests || {}

      const testId = `test_${Date.now()}`
      const now = new Date().toISOString()

      tests.tests[testId] = {
        id: testId,
        name: testConfig.name,
        description: testConfig.description,
        taskId: testConfig.taskId,
        contentType: testConfig.contentType, // 'headline', 'image', 'audience', 'offer'
        status: 'running', // 'running', 'paused', 'completed', 'winner_selected'
        createdAt: now,
        startDate: now,
        endDate: testConfig.endDate || null,
        targetDuration: testConfig.targetDuration || 14, // days
        confidenceLevel: testConfig.confidenceLevel || 0.95, // 95%
        minSampleSize: testConfig.minSampleSize || 100,

        control: {
          id: 'control',
          name: testConfig.control.name,
          description: testConfig.control.description,
          value: testConfig.control.value,
          conversions: 0,
          visitors: 0,
          conversionRate: 0
        },

        variants: testConfig.variants.map((variant, idx) => ({
          id: `variant_${idx}`,
          name: variant.name,
          description: variant.description,
          value: variant.value,
          conversions: 0,
          visitors: 0,
          conversionRate: 0,
          status: 'running' // 'running', 'paused', 'winner'
        })),

        results: {
          statisticallySignificant: false,
          winner: null,
          winnerConfidence: 0,
          chisquareValue: 0,
          pValue: 1.0,
          lastCalculated: null
        },

        traffic: {
          totalVisitors: 0,
          controlPercentage: 50,
          variantDistribution: {} // {variant_0: 25, variant_1: 25}
        }
      }

      // Initialize variant distribution
      const variantPercentage = (50 / testConfig.variants.length).toFixed(2)
      testConfig.variants.forEach((_, idx) => {
        tests.tests[testId].traffic.variantDistribution[`variant_${idx}`] = variantPercentage
      })

      localStorage.setItem(STORAGE_KEY, JSON.stringify(tests))
      return tests.tests[testId]
    } catch (error) {
      console.error('Error creating A/B test:', error)
      return null
    }
  }

  /**
   * Record a visit for a test variant
   */
  const recordVisit = (testId, variantId) => {
    try {
      const tests = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"tests":{}}')
      const test = tests.tests[testId]

      if (!test) return false

      test.traffic.totalVisitors++

      if (variantId === 'control') {
        test.control.visitors++
      } else {
        const variant = test.variants.find(v => v.id === variantId)
        if (variant) {
          variant.visitors++
        }
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(tests))
      return true
    } catch (error) {
      console.error('Error recording visit:', error)
      return false
    }
  }

  /**
   * Record a conversion for a test variant
   */
  const recordConversion = (testId, variantId, value = 1) => {
    try {
      const tests = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"tests":{}}')
      const test = tests.tests[testId]

      if (!test) return false

      if (variantId === 'control') {
        test.control.conversions += value
        test.control.conversionRate = test.control.visitors > 0
          ? ((test.control.conversions / test.control.visitors) * 100).toFixed(2)
          : 0
      } else {
        const variant = test.variants.find(v => v.id === variantId)
        if (variant) {
          variant.conversions += value
          variant.conversionRate = variant.visitors > 0
            ? ((variant.conversions / variant.visitors) * 100).toFixed(2)
            : 0
        }
      }

      // Recalculate statistical significance
      calculateSignificance(testId, tests)

      localStorage.setItem(STORAGE_KEY, JSON.stringify(tests))

      // Save conversion history
      saveConversionHistory(testId, variantId, value)

      return true
    } catch (error) {
      console.error('Error recording conversion:', error)
      return false
    }
  }

  /**
   * Calculate chi-square test for statistical significance
   * Uses chi-square goodness of fit test (95% confidence = p < 0.05)
   */
  const calculateSignificance = (testId, testsData = null) => {
    try {
      const allTests = testsData || JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"tests":{}}')
      const test = allTests.tests[testId]

      if (!test) return null

      // Need minimum sample size
      if (test.traffic.totalVisitors < test.minSampleSize) {
        return {
          significantyet: false,
          reason: `Need ${test.minSampleSize} visitors (have ${test.traffic.totalVisitors})`
        }
      }

      // Chi-square calculation
      const controlConv = test.control.conversions
      const controlNonConv = test.control.visitors - test.control.conversions

      let chisquareValue = 0
      let totalConversions = controlConv
      let totalNonConversions = controlNonConv

      // Calculate expected frequencies
      test.variants.forEach(variant => {
        totalConversions += variant.conversions
        totalNonConversions += variant.visitors - variant.conversions

        const variantConv = variant.conversions
        const variantNonConv = variant.visitors - variant.conversions

        // Expected values under null hypothesis (equal conversion rates)
        const expectedConv = test.control.visitors * (totalConversions / test.traffic.totalVisitors)
        const expectedNonConv = test.control.visitors * (totalNonConversions / test.traffic.totalVisitors)

        // Chi-square contribution
        if (expectedConv > 0) chisquareValue += Math.pow(controlConv - expectedConv, 2) / expectedConv
        if (expectedNonConv > 0) chisquareValue += Math.pow(controlNonConv - expectedNonConv, 2) / expectedNonConv

        if (variantConv > 0) {
          const variantExpectedConv = variant.visitors * (totalConversions / test.traffic.totalVisitors)
          chisquareValue += Math.pow(variantConv - variantExpectedConv, 2) / variantExpectedConv
        }
        if (variantNonConv > 0) {
          const variantExpectedNonConv = variant.visitors * (totalNonConversions / test.traffic.totalVisitors)
          chisquareValue += Math.pow(variantNonConv - variantExpectedNonConv, 2) / variantExpectedNonConv
        }
      })

      // Chi-square to p-value (simplified: df = num_variants)
      // For 95% confidence with 1 variant: critical value = 3.841
      const df = test.variants.length
      const pValue = approximateChiSquarePValue(chisquareValue, df)

      const isSignificant = pValue < (1 - test.confidenceLevel) // 0.05 for 95% confidence

      // Find winner if significant
      let winner = null
      let winnerConfidence = 0

      if (isSignificant) {
        const allVariants = [
          { id: 'control', rate: parseFloat(test.control.conversionRate) },
          ...test.variants.map(v => ({ id: v.id, rate: parseFloat(v.conversionRate) }))
        ]

        const best = allVariants.reduce((max, curr) => curr.rate > max.rate ? curr : max)
        winner = best.id
        winnerConfidence = best.rate
      }

      test.results = {
        statisticallySignificant: isSignificant,
        winner,
        winnerConfidence,
        chisquareValue: chisquareValue.toFixed(4),
        pValue: pValue.toFixed(6),
        lastCalculated: new Date().toISOString()
      }

      // Auto-pause losers if significant
      if (isSignificant && winner && winner !== 'control') {
        test.variants.forEach(variant => {
          if (variant.id !== winner && variant.status === 'running') {
            variant.status = 'paused'
          }
        })
      }

      if (!testsData) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allTests))
      }

      return test.results
    } catch (error) {
      console.error('Error calculating significance:', error)
      return null
    }
  }

  /**
   * Approximate p-value from chi-square value
   * Simplified lookup table for common scenarios
   */
  const approximateChiSquarePValue = (chisquare, df) => {
    // Chi-square critical values for common df
    const criticalValues = {
      1: { 0.95: 3.841, 0.90: 2.706 },
      2: { 0.95: 5.991, 0.90: 4.605 },
      3: { 0.95: 7.815, 0.90: 6.251 },
      4: { 0.95: 9.488, 0.90: 7.779 }
    }

    const dfCritical = criticalValues[Math.min(df, 4)] || criticalValues[1]

    if (chisquare <= dfCritical[0.90]) return 0.10
    if (chisquare <= dfCritical[0.95]) return 0.05
    if (chisquare > dfCritical[0.95] * 1.5) return 0.01

    return 0.05 + (chisquare - dfCritical[0.95]) * 0.04 / (dfCritical[0.95] * 0.5)
  }

  /**
   * Get all tests
   */
  const getAllTests = () => {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"tests":{}}')
      return Object.values(data.tests || {})
    } catch (error) {
      console.error('Error retrieving tests:', error)
      return []
    }
  }

  /**
   * Get a specific test
   */
  const getTest = (testId) => {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"tests":{}}')
      return data.tests[testId] || null
    } catch (error) {
      console.error('Error retrieving test:', error)
      return null
    }
  }

  /**
   * Get tests by task
   */
  const getTestsByTask = (taskId) => {
    try {
      const tests = getAllTests()
      return tests.filter(t => t.taskId === taskId)
    } catch (error) {
      console.error('Error retrieving tests by task:', error)
      return []
    }
  }

  /**
   * Pause a test
   */
  const pauseTest = (testId) => {
    try {
      const tests = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"tests":{}}')
      const test = tests.tests[testId]

      if (test) {
        test.status = 'paused'
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tests))
        return true
      }
      return false
    } catch (error) {
      console.error('Error pausing test:', error)
      return false
    }
  }

  /**
   * Resume a test
   */
  const resumeTest = (testId) => {
    try {
      const tests = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"tests":{}}')
      const test = tests.tests[testId]

      if (test) {
        test.status = 'running'
        test.variants.forEach(v => {
          if (v.status === 'paused') v.status = 'running'
        })
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tests))
        return true
      }
      return false
    } catch (error) {
      console.error('Error resuming test:', error)
      return false
    }
  }

  /**
   * Select winner and end test
   */
  const selectWinner = (testId, winnerId) => {
    try {
      const tests = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"tests":{}}')
      const test = tests.tests[testId]

      if (test && test.results.statisticallySignificant) {
        test.status = 'winner_selected'
        test.results.winner = winnerId

        if (winnerId === 'control') {
          test.control.status = 'winner'
        } else {
          const variant = test.variants.find(v => v.id === winnerId)
          if (variant) variant.status = 'winner'
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(tests))
        return true
      }
      return false
    } catch (error) {
      console.error('Error selecting winner:', error)
      return false
    }
  }

  /**
   * Save conversion history for reporting
   */
  const saveConversionHistory = (testId, variantId, value) => {
    try {
      const history = JSON.parse(localStorage.getItem(CONVERSION_HISTORY_KEY) || '{"conversions":[]}')
      history.conversions = history.conversions || []

      history.conversions.push({
        testId,
        variantId,
        value,
        timestamp: new Date().toISOString()
      })

      // Keep only last 1000 conversions
      history.conversions = history.conversions.slice(-1000)

      localStorage.setItem(CONVERSION_HISTORY_KEY, JSON.stringify(history))
    } catch (error) {
      console.error('Error saving conversion history:', error)
    }
  }

  /**
   * Get conversion history
   */
  const getConversionHistory = (testId = null) => {
    try {
      const history = JSON.parse(localStorage.getItem(CONVERSION_HISTORY_KEY) || '{"conversions":[]}')
      let conversions = history.conversions || []

      if (testId) {
        conversions = conversions.filter(c => c.testId === testId)
      }

      return conversions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    } catch (error) {
      console.error('Error retrieving conversion history:', error)
      return []
    }
  }

  /**
   * Delete a test
   */
  const deleteTest = (testId) => {
    try {
      const tests = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"tests":{}}')
      delete tests.tests[testId]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tests))
      return true
    } catch (error) {
      console.error('Error deleting test:', error)
      return false
    }
  }

  /**
   * Get test statistics summary
   */
  const getTestStats = (testId) => {
    const test = getTest(testId)
    if (!test) return null

    const allVariants = [test.control, ...test.variants]

    return {
      testId,
      name: test.name,
      status: test.status,
      totalVisitors: test.traffic.totalVisitors,
      variants: allVariants.map(v => ({
        id: v.id,
        name: v.name,
        visitors: v.visitors,
        conversions: v.conversions,
        conversionRate: parseFloat(v.conversionRate),
        confidenceInterval: calculateConfidenceInterval(v.conversions, v.visitors)
      })),
      results: test.results,
      daysRunning: Math.floor((new Date() - new Date(test.startDate)) / (1000 * 60 * 60 * 24))
    }
  }

  /**
   * Calculate 95% confidence interval
   */
  const calculateConfidenceInterval = (conversions, visitors) => {
    if (visitors === 0) return { lower: 0, upper: 0 }

    const p = conversions / visitors
    const z = 1.96 // 95% confidence
    const margin = z * Math.sqrt((p * (1 - p)) / visitors)

    return {
      lower: Math.max(0, (p - margin) * 100).toFixed(2),
      upper: Math.min(100, (p + margin) * 100).toFixed(2)
    }
  }

  return {
    createTest,
    recordVisit,
    recordConversion,
    calculateSignificance,
    getAllTests,
    getTest,
    getTestsByTask,
    pauseTest,
    resumeTest,
    selectWinner,
    getConversionHistory,
    deleteTest,
    getTestStats,
    calculateConfidenceInterval
  }
}
