/**
 * ProjectRepository
 *
 * Abstract data access layer for Project entities.
 * Handles all Supabase operations for projects.
 * Depends on: Supabase client, Logger
 * Independent of: Pinia, Vue, Components
 */

import { NotFoundError, DatabaseError, wrapError, logger as defaultLogger } from '@/shared/utils'
import { Project, Task } from '@/domain/models'
import { SUPABASE_CONFIG } from '@/shared/config'

export class ProjectRepository {
  constructor(supabaseClient, taskConfigs = {}, logger = defaultLogger) {
    this.supabase = supabaseClient
    this.taskConfigs = taskConfigs
    this.logger = logger.child('ProjectRepository')
  }

  /**
   * Get all projects for a user
   */
  async getAll(userId) {
    try {
      this.logger.debug('Fetching all projects', { userId })

      const { data, error } = await this.supabase
        .from(SUPABASE_CONFIG.TABLES.PROJECTS)
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })

      if (error) throw error

      return data || []
    } catch (error) {
      const wrappedError = wrapError(error, DatabaseError, { userId })
      this.logger.logError(wrappedError)
      throw wrappedError
    }
  }

  /**
   * Get single project by ID
   */
  async getById(projectId) {
    try {
      this.logger.debug('Fetching project', { projectId })

      const { data, error } = await this.supabase
        .from(SUPABASE_CONFIG.TABLES.PROJECTS)
        .select('*')
        .eq('id', projectId)
        .single()

      if (error) throw error
      if (!data) throw new NotFoundError('Project', projectId)

      return data
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      const wrappedError = wrapError(error, DatabaseError, { projectId })
      this.logger.logError(wrappedError)
      throw wrappedError
    }
  }

  /**
   * Create new project
   */
  async create(userId, name, description = '') {
    try {
      this.logger.debug('Creating project', { userId, name })

      const projectId = this._generateId()
      const now = new Date().toISOString()

      const { data, error } = await this.supabase
        .from(SUPABASE_CONFIG.TABLES.PROJECTS)
        .insert([
          {
            id: projectId,
            user_id: userId,
            name,
            description,
            created_at: now,
            updated_at: now
          }
        ])
        .select()
        .single()

      if (error) throw error

      this.logger.info('Project created', { projectId, name })
      return data
    } catch (error) {
      const wrappedError = wrapError(error, DatabaseError, { userId, name })
      this.logger.logError(wrappedError)
      throw wrappedError
    }
  }

  /**
   * Update project metadata
   */
  async update(projectId, updates) {
    try {
      this.logger.debug('Updating project', { projectId, updates })

      const { data, error } = await this.supabase
        .from(SUPABASE_CONFIG.TABLES.PROJECTS)
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId)
        .select()
        .single()

      if (error) throw error
      if (!data) throw new NotFoundError('Project', projectId)

      this.logger.info('Project updated', { projectId })
      return data
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      const wrappedError = wrapError(error, DatabaseError, { projectId })
      this.logger.logError(wrappedError)
      throw wrappedError
    }
  }

  /**
   * Delete project
   */
  async delete(projectId) {
    try {
      this.logger.debug('Deleting project', { projectId })

      const { error } = await this.supabase
        .from(SUPABASE_CONFIG.TABLES.PROJECTS)
        .delete()
        .eq('id', projectId)

      if (error) throw error

      this.logger.info('Project deleted', { projectId })
      return true
    } catch (error) {
      const wrappedError = wrapError(error, DatabaseError, { projectId })
      this.logger.logError(wrappedError)
      throw wrappedError
    }
  }

  /**
   * Get project with all data (tasks, settings, content)
   */
  async getWithData(projectId) {
    try {
      this.logger.debug('Fetching project with data', { projectId })

      const project = await this.getById(projectId)
      const projectData = await this._getProjectData(projectId)

      return {
        ...project,
        ...projectData
      }
    } catch (error) {
      this.logger.logError(error)
      throw error
    }
  }

  /**
   * Initialize project with default tasks
   */
  async initializeWithDefaults(projectId, taskConfigs) {
    try {
      this.logger.debug('Initializing project with defaults', { projectId })

      const defaultTasks = {}
      const defaultSettings = {
        targetAudience: '',
        goals: '',
        techStack: '',
        timeline: ''
      }

      // Initialize all tasks with default status
      Object.keys(taskConfigs).forEach(taskId => {
        defaultTasks[taskId] = {
          checked: false,
          removed: false
        }
      })

      // Mark specific tasks as removed (Sales and Growth categories)
      const removedTaskIds = [
        'sales-1', 'sales-2', 'sales-3', 'sales-4', 'sales-5',
        'growth-1', 'growth-2', 'growth-3', 'growth-4', 'growth-5'
      ]

      removedTaskIds.forEach(taskId => {
        if (defaultTasks[taskId]) {
          defaultTasks[taskId].removed = true
        }
      })

      // Save to project_data
      await this._saveProjectData(projectId, {
        settings: defaultSettings,
        tasks: defaultTasks,
        content: [],
        taskData: {}
      })

      this.logger.info('Project initialized', { projectId })
      return defaultTasks
    } catch (error) {
      const wrappedError = wrapError(error, DatabaseError, { projectId })
      this.logger.logError(wrappedError)
      throw wrappedError
    }
  }

  /**
   * Get all project data (internal helper)
   */
  async _getProjectData(projectId) {
    try {
      const { data, error } = await this.supabase
        .from(SUPABASE_CONFIG.TABLES.PROJECT_DATA)
        .select('key, value')
        .eq('project_id', projectId)

      if (error) throw error

      const projectData = {
        settings: {},
        tasks: {},
        content: [],
        taskData: {}
      }

      data?.forEach(row => {
        projectData[row.key] = row.value
      })

      return projectData
    } catch (error) {
      const wrappedError = wrapError(error, DatabaseError, { projectId })
      this.logger.logError(wrappedError)
      throw wrappedError
    }
  }

  /**
   * Save project data (internal helper)
   */
  async _saveProjectData(projectId, userId, dataUpdates) {
    try {
      const now = new Date().toISOString()

      for (const [key, value] of Object.entries(dataUpdates)) {
        const { error } = await this.supabase
          .from(SUPABASE_CONFIG.TABLES.PROJECT_DATA)
          .upsert(
            {
              project_id: projectId,
              user_id: userId,
              key,
              value,
              updated_at: now
            },
            { onConflict: 'project_id,key' }
          )

        if (error) throw error
      }

      return true
    } catch (error) {
      const wrappedError = wrapError(error, DatabaseError, { projectId })
      this.logger.logError(wrappedError)
      throw wrappedError
    }
  }

  /**
   * Generate UUID v4 (simple version)
   */
  _generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }
}
