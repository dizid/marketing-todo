/**
 * CreateProjectUseCase
 *
 * Orchestrates the project creation workflow.
 * Handles: validation, project creation, default initialization, event emission.
 */

import { validateProjectName, wrapError, logger as defaultLogger } from '@/shared/utils'
import { DatabaseError } from '@/shared/utils'

export class CreateProjectUseCase {
  /**
   * @param {ProjectRepository} projectRepository - Project data access
   * @param {Logger} logger - Logging utility
   * @param {Object} taskConfigs - All available task configurations
   */
  constructor(projectRepository, logger = defaultLogger, taskConfigs = {}) {
    this.projectRepository = projectRepository
    this.logger = logger.child('CreateProjectUseCase')
    this.taskConfigs = taskConfigs
  }

  /**
   * Execute project creation
   *
   * @param {string} userId - User UUID
   * @param {string} name - Project name
   * @param {string} description - Project description (optional)
   * @returns {Promise<Object>} Created project with initialized tasks
   */
  async execute(userId, name, description = '') {
    try {
      // 1. VALIDATE INPUT
      this.logger.debug('Validating input', { userId, name })
      validateProjectName(name)

      // 2. CREATE PROJECT IN DATABASE
      this.logger.debug('Creating project in database')
      const projectData = await this.projectRepository.create(userId, name, description)

      if (!projectData || !projectData.id) {
        throw new DatabaseError('Project creation returned invalid data', {
          code: 'INVALID_PROJECT_DATA',
          context: { projectData }
        })
      }

      // 3. INITIALIZE WITH DEFAULT TASKS
      this.logger.debug('Initializing default tasks', { projectId: projectData.id })
      const defaultTasks = await this.projectRepository.initializeWithDefaults(
        projectData.id,
        this.taskConfigs
      )

      this.logger.info('Project created successfully', {
        projectId: projectData.id,
        name,
        totalTasks: Object.keys(defaultTasks).length,
        removedTasks: Object.values(defaultTasks).filter(t => t.removed).length
      })

      return {
        id: projectData.id,
        userId: projectData.user_id,
        name: projectData.name,
        description: projectData.description,
        tasks: defaultTasks,
        createdAt: projectData.created_at
      }
    } catch (error) {
      this.logger.logError(error)
      throw error
    }
  }
}
