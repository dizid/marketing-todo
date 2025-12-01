import TASK_MAP from '@/data/TASK_DEPENDENCY_MAP.json'

/**
 * Task Recommendation Engine
 * Intelligently recommends the next task based on user context and completed tasks
 */

/**
 * Get the current phase based on completed tasks
 * @param {Array} completedTaskIds - Array of completed task IDs
 * @returns {number} Current phase number (1-4)
 */
function getCurrentPhase(completedTaskIds) {
  if (!completedTaskIds || completedTaskIds.length === 0) {
    return 0 // Before any phase
  }

  // Find the highest phase that has completed tasks
  let highestPhase = 0
  for (const phase of TASK_MAP.phases) {
    const tasksInPhase = phase.tasks.map(t => t.id)
    const hasCompletedInPhase = tasksInPhase.some(id => completedTaskIds.includes(id))
    if (hasCompletedInPhase) {
      highestPhase = phase.phase
    }
  }

  return highestPhase
}

/**
 * Get all tasks in a specific phase
 * @param {number} phaseNumber - Phase number (1-4)
 * @returns {Array} Tasks in that phase
 */
function getTasksInPhase(phaseNumber) {
  const phase = TASK_MAP.phases.find(p => p.phase === phaseNumber)
  return phase ? phase.tasks : []
}

/**
 * Filter tasks by business model relevance
 * @param {Array} tasks - Array of task objects
 * @param {string} userBusinessModel - User's product type
 * @returns {Array} Filtered tasks
 */
function filterByBusinessModel(tasks, userBusinessModel) {
  if (!userBusinessModel) return tasks

  return tasks.filter(task => {
    // If task applies to "all", include it
    if (task.businessModels.includes('all')) {
      return true
    }
    // Otherwise, only include if user's business model matches
    return task.businessModels.includes(userBusinessModel)
  })
}

/**
 * Get tasks already completed in a phase
 * @param {Array} completedTaskIds - Array of completed task IDs
 * @param {Array} tasksInPhase - Tasks in the current/next phase
 * @returns {Array} Completed task IDs
 */
function getCompletedInPhase(completedTaskIds, tasksInPhase) {
  const taskIdsInPhase = tasksInPhase.map(t => t.id)
  return completedTaskIds.filter(id => taskIdsInPhase.includes(id))
}

/**
 * Main recommendation function
 * @param {Object} user - User context with productType
 * @param {Array} completedTaskIds - Array of completed task IDs
 * @returns {Object} Recommendation with next task and progress info
 */
export function getNextTaskRecommendation(user, completedTaskIds = []) {
  // Determine current phase
  const currentPhase = getCurrentPhase(completedTaskIds)

  // If no tasks completed, start with Phase 1
  let nextPhase = currentPhase === 0 ? 1 : currentPhase

  // Get tasks in the next phase
  let nextPhaseTasks = getTasksInPhase(nextPhase)

  // If next phase has no applicable tasks, move to next phase
  let filteredTasks = filterByBusinessModel(nextPhaseTasks, user.productType)
  if (filteredTasks.length === 0 && nextPhase < 4) {
    nextPhase++
    nextPhaseTasks = getTasksInPhase(nextPhase)
    filteredTasks = filterByBusinessModel(nextPhaseTasks, user.productType)
  }

  // Get the first available task (not yet completed)
  const nextTask = filteredTasks.find(task => !completedTaskIds.includes(task.id))

  if (!nextTask) {
    // User has completed all tasks in this phase, suggest next phase
    if (nextPhase < 4) {
      return getNextTaskRecommendation(user, completedTaskIds.concat([]))
    }
    // All phases complete
    return {
      nextTask: null,
      currentPhase,
      isComplete: true,
      message: 'Congratulations! You\'ve completed all phases of the strategic journey.'
    }
  }

  // Calculate progress
  const tasksInCurrentPhase = getTasksInPhase(currentPhase || 1)
  const filteredCurrentPhase = filterByBusinessModel(tasksInCurrentPhase, user.productType)
  const completedInPhase = getCompletedInPhase(completedTaskIds, filteredCurrentPhase)

  const totalTasks = TASK_MAP.phases.reduce((sum, phase) => {
    return sum + filterByBusinessModel(phase.tasks, user.productType).length
  }, 0)

  return {
    nextTask: {
      id: nextTask.id,
      name: nextTask.name,
      phase: nextPhase
    },
    currentPhase: currentPhase || 1,
    phaseProgress: {
      completed: completedInPhase.length,
      total: filteredCurrentPhase.length,
      percentage: filteredCurrentPhase.length > 0 ? Math.round((completedInPhase.length / filteredCurrentPhase.length) * 100) : 0
    },
    overallProgress: {
      completed: completedTaskIds.length,
      total: totalTasks,
      percentage: totalTasks > 0 ? Math.round((completedTaskIds.length / totalTasks) * 100) : 0
    },
    alternatives: getAlternativeTasksInPhase(nextPhase, nextTask.id, user.productType, completedTaskIds)
  }
}

/**
 * Get alternative tasks to recommend in the same phase
 * @param {number} phaseNumber - Phase number
 * @param {string} excludeTaskId - Task ID to exclude (already recommended)
 * @param {string} userBusinessModel - User's product type
 * @param {Array} completedTaskIds - Completed task IDs
 * @returns {Array} Alternative tasks
 */
function getAlternativeTasksInPhase(phaseNumber, excludeTaskId, userBusinessModel, completedTaskIds) {
  const tasksInPhase = getTasksInPhase(phaseNumber)
  const filtered = filterByBusinessModel(tasksInPhase, userBusinessModel)

  return filtered
    .filter(task => task.id !== excludeTaskId && !completedTaskIds.includes(task.id))
    .slice(0, 2)
    .map(task => ({
      id: task.id,
      name: task.name
    }))
}

/**
 * Get all available tasks for a given phase and user context
 * @param {number} phaseNumber - Phase number
 * @param {Object} user - User context
 * @param {Array} completedTaskIds - Completed task IDs
 * @returns {Array} Available tasks
 */
export function getTasksForPhase(phaseNumber, user, completedTaskIds = []) {
  const tasksInPhase = getTasksInPhase(phaseNumber)
  const filtered = filterByBusinessModel(tasksInPhase, user.productType)

  return filtered
    .filter(task => !completedTaskIds.includes(task.id))
    .map(task => ({
      id: task.id,
      name: task.name
    }))
}
