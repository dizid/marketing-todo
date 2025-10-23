// Project Service - Handles all project-related operations
// Manages: projects CRUD, project data (settings, tasks, content)

import { supabase } from '../utils/supabase.js'

/**
 * Get all projects for current user
 */
export async function getProjects() {
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Get single project by ID
 */
export async function getProject(projectId) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

/**
 * Create new project
 */
export async function createProject(name, description = '') {
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('projects')
    .insert({
      user_id: user.id,
      name,
      description,
      status: 'active'
    })
    .select()

  if (error) throw error
  return data?.[0]
}

/**
 * Update project (name, description, status)
 */
export async function updateProject(projectId, updates) {
  const { data, error } = await supabase
    .from('projects')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', projectId)
    .select()

  if (error) throw error
  return data?.[0]
}

/**
 * Delete project
 */
export async function deleteProject(projectId) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)

  if (error) throw error
}

/**
 * Get project data by key (settings, tasks, content, etc)
 */
export async function getProjectData(projectId, key) {
  const { data, error } = await supabase
    .from('project_data')
    .select('value')
    .eq('project_id', projectId)
    .eq('key', key)

  if (error) throw error
  return data?.[0]?.value || null
}

/**
 * Save/update project data
 */
export async function saveProjectData(projectId, key, value) {
  const { data, error } = await supabase
    .from('project_data')
    .upsert({
      project_id: projectId,
      key,
      value,
      updated_at: new Date().toISOString()
    }, { onConflict: 'project_id,key' })
    .select()

  if (error) throw error
  return data?.[0]
}

/**
 * Get all project data keys (for bulk loading)
 */
export async function getAllProjectData(projectId) {
  const { data, error } = await supabase
    .from('project_data')
    .select('key, value')
    .eq('project_id', projectId)

  if (error) throw error

  const result = {}
  data?.forEach(row => {
    result[row.key] = row.value
  })
  return result
}

/**
 * Project-specific helpers
 */

/**
 * Get project settings
 */
export async function getProjectSettings(projectId) {
  return await getProjectData(projectId, 'settings')
}

/**
 * Save project settings
 */
export async function saveProjectSettings(projectId, settings) {
  return await saveProjectData(projectId, 'settings', settings)
}

/**
 * Get project tasks (with their state: checked, notes, etc)
 */
export async function getProjectTasks(projectId) {
  return await getProjectData(projectId, 'tasks')
}

/**
 * Save project tasks
 */
export async function saveProjectTasks(projectId, tasks) {
  return await saveProjectData(projectId, 'tasks', tasks)
}

/**
 * Get project's generated content history
 */
export async function getProjectContent(projectId) {
  const content = await getProjectData(projectId, 'content')
  return content || []
}

/**
 * Add generated content to project
 */
export async function addProjectContent(projectId, contentType, content) {
  const existing = (await getProjectData(projectId, 'content')) || []
  const updated = [
    ...existing,
    {
      id: crypto.randomUUID(),
      contentType,
      content,
      createdAt: new Date().toISOString()
    }
  ]
  return await saveProjectData(projectId, 'content', updated)
}

/**
 * Initialize project with default data (called when project is created)
 */
export async function initializeProject(projectId) {
  const defaultSettings = {
    targetAudience: '',
    goals: '',
    techStack: '',
    timeline: '',
    description: ''
  }

  const defaultTasks = {}

  await Promise.all([
    saveProjectSettings(projectId, defaultSettings),
    saveProjectTasks(projectId, defaultTasks)
  ])
}
