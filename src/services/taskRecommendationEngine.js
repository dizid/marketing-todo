import TASK_MAP from '@/data/TASK_DEPENDENCY_MAP.json'

/**
 * Task Recommendation Engine
 * Intelligently recommends the next task based on user context, completed tasks, and experience level
 */

/**
 * Get experience level configuration
 * @param {string} level - Experience level (beginner, intermediate, advanced)
 * @returns {Object} Experience level config
 */
export function getExperienceLevelConfig(level = 'beginner') {
  return TASK_MAP.experienceLevels[level] || TASK_MAP.experienceLevels.beginner
}

/**
 * Get all available experience levels
 * @returns {Object} Experience levels configuration
 */
export function getExperienceLevels() {
  return TASK_MAP.experienceLevels
}

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
 * Filter tasks by experience level
 * @param {Array} tasks - Array of task objects
 * @param {string} experienceLevel - User's experience level (beginner, intermediate, advanced)
 * @returns {Array} Filtered tasks
 */
function filterByExperienceLevel(tasks, experienceLevel = 'beginner') {
  return tasks.filter(task => {
    // If task has no experienceLevels defined, include it for all levels
    if (!task.experienceLevels || task.experienceLevels.length === 0) {
      return true
    }
    return task.experienceLevels.includes(experienceLevel)
  })
}

/**
 * Get the maximum phase allowed for an experience level
 * @param {string} experienceLevel - User's experience level
 * @returns {number} Maximum phase number
 */
function getMaxPhaseForLevel(experienceLevel = 'beginner') {
  const config = getExperienceLevelConfig(experienceLevel)
  return config.maxPhase || 4
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
 * @param {Object} user - User context with productType and experienceLevel
 * @param {Array} completedTaskIds - Array of completed task IDs
 * @returns {Object} Recommendation with next task and progress info
 */
export function getNextTaskRecommendation(user, completedTaskIds = []) {
  // Ensure completedTaskIds is always an array
  const completed = Array.isArray(completedTaskIds) ? completedTaskIds : []
  const experienceLevel = user.experienceLevel || 'beginner'
  const maxPhase = getMaxPhaseForLevel(experienceLevel)

  // Determine current phase
  const currentPhase = getCurrentPhase(completed)

  // If no tasks completed, start with Phase 1
  let nextPhase = currentPhase === 0 ? 1 : currentPhase

  // Get tasks in the next phase
  let nextPhaseTasks = getTasksInPhase(nextPhase)

  // Apply both filters: business model AND experience level
  let filteredTasks = filterByBusinessModel(nextPhaseTasks, user.productType)
  filteredTasks = filterByExperienceLevel(filteredTasks, experienceLevel)

  // If next phase has no applicable tasks, move to next phase (respecting maxPhase)
  if (filteredTasks.length === 0 && nextPhase < maxPhase) {
    nextPhase++
    nextPhaseTasks = getTasksInPhase(nextPhase)
    filteredTasks = filterByBusinessModel(nextPhaseTasks, user.productType)
    filteredTasks = filterByExperienceLevel(filteredTasks, experienceLevel)
  }

  // Get the first available task (not yet completed)
  const nextTask = filteredTasks.find(task => !completed.includes(task.id))

  if (!nextTask) {
    // Check if there are more phases available for this experience level
    if (nextPhase < maxPhase) {
      // Try next phase
      for (let phase = nextPhase + 1; phase <= maxPhase; phase++) {
        const phaseTasks = getTasksInPhase(phase)
        let available = filterByBusinessModel(phaseTasks, user.productType)
        available = filterByExperienceLevel(available, experienceLevel)
        const uncompletedTask = available.find(task => !completed.includes(task.id))
        if (uncompletedTask) {
          return {
            nextTask: {
              id: uncompletedTask.id,
              name: uncompletedTask.name,
              phase: phase
            },
            currentPhase: currentPhase || 1,
            experienceLevel,
            maxPhase,
            phaseProgress: calculatePhaseProgress(currentPhase || 1, user, completed, experienceLevel),
            overallProgress: calculateOverallProgress(user, completed, experienceLevel, maxPhase),
            alternatives: getAlternativeTasksInPhase(phase, uncompletedTask.id, user.productType, completed, experienceLevel)
          }
        }
      }
    }

    // All phases complete for this experience level
    return {
      nextTask: null,
      currentPhase,
      experienceLevel,
      maxPhase,
      isComplete: true,
      message: experienceLevel === 'beginner'
        ? 'Great progress! You\'ve completed all beginner tasks. Switch to Intermediate mode to unlock more advanced tasks.'
        : 'Congratulations! You\'ve completed all phases of the strategic journey.'
    }
  }

  // Calculate progress
  const phaseProgress = calculatePhaseProgress(currentPhase || 1, user, completed, experienceLevel)
  const overallProgress = calculateOverallProgress(user, completed, experienceLevel, maxPhase)

  return {
    nextTask: {
      id: nextTask.id,
      name: nextTask.name,
      phase: nextPhase
    },
    currentPhase: currentPhase || 1,
    experienceLevel,
    maxPhase,
    phaseProgress,
    overallProgress,
    alternatives: getAlternativeTasksInPhase(nextPhase, nextTask.id, user.productType, completed, experienceLevel)
  }
}

/**
 * Calculate phase progress
 */
function calculatePhaseProgress(phaseNumber, user, completedTaskIds, experienceLevel) {
  const tasksInPhase = getTasksInPhase(phaseNumber)
  let filtered = filterByBusinessModel(tasksInPhase, user.productType)
  filtered = filterByExperienceLevel(filtered, experienceLevel)
  const completedInPhase = getCompletedInPhase(completedTaskIds, filtered)

  return {
    completed: completedInPhase.length,
    total: filtered.length,
    percentage: filtered.length > 0 ? Math.round((completedInPhase.length / filtered.length) * 100) : 0
  }
}

/**
 * Calculate overall progress across all phases for the experience level
 */
function calculateOverallProgress(user, completedTaskIds, experienceLevel, maxPhase) {
  let totalTasks = 0
  let completedTasks = 0

  for (const phase of TASK_MAP.phases) {
    if (phase.phase > maxPhase) continue

    let filtered = filterByBusinessModel(phase.tasks, user.productType)
    filtered = filterByExperienceLevel(filtered, experienceLevel)
    totalTasks += filtered.length
    completedTasks += filtered.filter(t => completedTaskIds.includes(t.id)).length
  }

  return {
    completed: completedTasks,
    total: totalTasks,
    percentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  }
}

/**
 * Get alternative tasks to recommend in the same phase
 * @param {number} phaseNumber - Phase number
 * @param {string} excludeTaskId - Task ID to exclude (already recommended)
 * @param {string} userBusinessModel - User's product type
 * @param {Array} completedTaskIds - Completed task IDs
 * @param {string} experienceLevel - User's experience level
 * @returns {Array} Alternative tasks
 */
function getAlternativeTasksInPhase(phaseNumber, excludeTaskId, userBusinessModel, completedTaskIds, experienceLevel = 'beginner') {
  const tasksInPhase = getTasksInPhase(phaseNumber)
  let filtered = filterByBusinessModel(tasksInPhase, userBusinessModel)
  filtered = filterByExperienceLevel(filtered, experienceLevel)

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
  const experienceLevel = user.experienceLevel || 'beginner'
  const tasksInPhase = getTasksInPhase(phaseNumber)
  let filtered = filterByBusinessModel(tasksInPhase, user.productType)
  filtered = filterByExperienceLevel(filtered, experienceLevel)

  return filtered
    .filter(task => !completedTaskIds.includes(task.id))
    .map(task => ({
      id: task.id,
      name: task.name
    }))
}

/**
 * Get task counts by experience level (for UI display)
 * @param {string} userBusinessModel - User's product type
 * @returns {Object} Task counts per experience level
 */
export function getTaskCountsByExperienceLevel(userBusinessModel) {
  const counts = {}

  for (const [level, config] of Object.entries(TASK_MAP.experienceLevels)) {
    let total = 0
    for (const phase of TASK_MAP.phases) {
      if (phase.phase > config.maxPhase) continue
      let filtered = filterByBusinessModel(phase.tasks, userBusinessModel)
      filtered = filterByExperienceLevel(filtered, level)
      total += filtered.length
    }
    counts[level] = {
      ...config,
      taskCount: total
    }
  }

  return counts
}

/**
 * Check if a task is visible for a given experience level
 * @param {string} taskId - Task ID to check
 * @param {string} experienceLevel - Experience level (beginner, intermediate, advanced)
 * @returns {boolean} Whether the task is visible for this level
 */
export function isTaskVisibleForLevel(taskId, experienceLevel = 'beginner') {
  // Search through all phases for this task
  for (const phase of TASK_MAP.phases) {
    const task = phase.tasks.find(t => t.id === taskId)
    if (task) {
      // If no experienceLevels defined, visible for all
      if (!task.experienceLevels || task.experienceLevels.length === 0) {
        return true
      }
      return task.experienceLevels.includes(experienceLevel)
    }
  }
  // Task not found in map - default to visible (legacy tasks)
  return true
}

/**
 * Get task experience level configuration by task ID
 * @param {string} taskId - Task ID
 * @returns {Object|null} Task config with experienceLevels array, or null if not found
 */
export function getTaskExperienceLevels(taskId) {
  for (const phase of TASK_MAP.phases) {
    const task = phase.tasks.find(t => t.id === taskId)
    if (task) {
      return {
        id: task.id,
        name: task.name,
        experienceLevels: task.experienceLevels || ['beginner', 'intermediate', 'advanced'],
        phase: phase.phase
      }
    }
  }
  return null
}

/**
 * Get all tasks that are hidden for a given experience level
 * @param {string} experienceLevel - Experience level (beginner, intermediate, advanced)
 * @returns {Array} Array of hidden task objects with id, name, phase
 */
export function getHiddenTasksForLevel(experienceLevel = 'beginner') {
  const hiddenTasks = []

  for (const phase of TASK_MAP.phases) {
    for (const task of phase.tasks) {
      // Task is hidden if it has experienceLevels but doesn't include current level
      if (task.experienceLevels &&
          task.experienceLevels.length > 0 &&
          !task.experienceLevels.includes(experienceLevel)) {
        hiddenTasks.push({
          id: task.id,
          name: task.name,
          phase: phase.phase,
          phaseName: phase.name
        })
      }
    }
  }

  return hiddenTasks
}
