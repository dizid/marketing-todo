/**
 * Composable: useDataIntegrity
 *
 * Vue composable wrapper around DataIntegrityService
 * Provides reactive data validation and integrity checking for projects
 *
 * Usage:
 * const { verifyIntegrity, generateRepair } = useDataIntegrity()
 * const report = await verifyIntegrity(projectId)
 * const plan = generateRepair(report)
 */

import { ref, computed } from 'vue'
import { dataIntegrityService } from '@/services/dataIntegrityService.js'

export function useDataIntegrity() {
  const isLoading = ref(false)
  const error = ref(null)
  const lastReport = ref(null)
  const integrityCache = new Map() // { projectId → report }

  /**
   * Verify data integrity for a project
   */
  const verifyIntegrity = async (projectId, useCache = true) => {
    isLoading.value = true
    error.value = null

    try {
      // Check cache first
      if (useCache && integrityCache.has(projectId)) {
        const cachedReport = integrityCache.get(projectId)
        // Only use cache if less than 5 minutes old
        const age = Date.now() - new Date(cachedReport.timestamp).getTime()
        if (age < 5 * 60 * 1000) {
          lastReport.value = cachedReport
          return cachedReport
        }
      }

      // Run verification
      const report = await dataIntegrityService.verifyProjectIntegrity(projectId)
      lastReport.value = report
      integrityCache.set(projectId, report)
      return report
    } catch (err) {
      error.value = err.message
      console.error('[useDataIntegrity] Verification error:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Generate repair plan for identified issues
   */
  const generateRepairPlan = (report = null) => {
    const targetReport = report || lastReport.value
    if (!targetReport) {
      throw new Error('No integrity report available. Run verifyIntegrity first.')
    }
    return dataIntegrityService.generateRepairPlan(targetReport)
  }

  /**
   * Clear cache for a specific project or all projects
   */
  const clearCache = (projectId = null) => {
    if (projectId) {
      integrityCache.delete(projectId)
    } else {
      integrityCache.clear()
    }
  }

  /**
   * Check if project passed all integrity checks
   */
  const isIntegrityOk = computed(() => {
    return lastReport.value && lastReport.value.status === 'ok'
  })

  /**
   * Get human-readable status
   */
  const integrityStatus = computed(() => {
    if (!lastReport.value) return 'not-checked'
    return lastReport.value.status
  })

  /**
   * Get issue count
   */
  const issueCount = computed(() => {
    return lastReport.value ? lastReport.value.issues.length : 0
  })

  /**
   * Get warning count
   */
  const warningCount = computed(() => {
    return lastReport.value ? lastReport.value.warnings.length : 0
  })

  /**
   * Get critical issues
   */
  const criticalIssues = computed(() => {
    if (!lastReport.value) return []
    return lastReport.value.issues.filter(i => i.severity === 'critical')
  })

  /**
   * Get error issues
   */
  const errorIssues = computed(() => {
    if (!lastReport.value) return []
    return lastReport.value.issues.filter(i => i.severity === 'error')
  })

  return {
    // State
    isLoading,
    error,
    lastReport,

    // Methods
    verifyIntegrity,
    generateRepairPlan,
    clearCache,

    // Computed
    isIntegrityOk,
    integrityStatus,
    issueCount,
    warningCount,
    criticalIssues,
    errorIssues
  }
}
