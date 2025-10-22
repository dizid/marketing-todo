// Database service for Supabase interactions
// All queries respect Row Level Security (RLS) by using authenticated user
// Handles sales task data persistence

import { supabase } from '../utils/supabase.js'

/**
 * Save or update app description for AI generation context
 * @param {string} description - App description text
 */
export async function saveAppDescription(description) {
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('user_settings')
    .upsert({
      user_id: user.id,
      key: 'app_description',
      value: description,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,key' })
    .select()

  if (error) throw error
  return data
}

/**
 * Get app description from database
 */
export async function getAppDescription() {
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('user_settings')
    .select('value')
    .eq('user_id', user.id)
    .eq('key', 'app_description')
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Database error:', error)
    throw error
  }
  return data?.value || ''
}

/**
 * Save checklist categories and items
 * @param {array} categories - Array of category objects with items
 */
export async function saveChecklist(categories) {
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('User not authenticated')
  }

  // Save as JSON in user_settings
  const { data, error } = await supabase
    .from('user_settings')
    .upsert({
      user_id: user.id,
      key: 'checklist_data',
      value: JSON.stringify(categories),
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,key' })
    .select()

  if (error) throw error
  return data
}

/**
 * Get saved checklist from database
 */
export async function getChecklist() {
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('user_settings')
    .select('value')
    .eq('user_id', user.id)
    .eq('key', 'checklist_data')
    .single()

  if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned

  try {
    return data?.value ? JSON.parse(data.value) : null
  } catch (e) {
    console.error('Failed to parse checklist data:', e)
    return null
  }
}

/**
 * Save notes for a specific category
 * @param {string} categoryId - Category identifier
 * @param {string} notes - Notes text
 */
export async function saveCategoryNotes(categoryId, notes) {
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('category_notes')
    .upsert({
      user_id: user.id,
      category_id: categoryId,
      notes: notes,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,category_id' })
    .select()

  if (error) throw error
  return data
}

/**
 * Get notes for a specific category
 * @param {string} categoryId - Category identifier
 */
export async function getCategoryNotes(categoryId) {
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('category_notes')
    .select('notes')
    .eq('user_id', user.id)
    .eq('category_id', categoryId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data?.notes || ''
}

/**
 * Get all user data for Grok AI context
 * Includes description, checklist, and notes
 */
export async function getUserDataForAI() {
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('User not authenticated')
  }

  try {
    const description = await getAppDescription()
    const checklist = await getChecklist()

    return {
      appDescription: description,
      checklist: checklist || [],
      userId: user.id,
      userEmail: user.email
    }
  } catch (error) {
    console.error('Error fetching user data for AI:', error)
    return {
      appDescription: '',
      checklist: [],
      userId: user.id,
      userEmail: user.email
    }
  }
}

/**
 * Save generated content from AI
 * @param {string} contentType - Type of content (e.g., 'marketing_copy', 'description')
 * @param {string} content - Generated content
 */
export async function saveGeneratedContent(contentType, content) {
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('generated_content')
    .insert({
      user_id: user.id,
      content_type: contentType,
      content: content,
      created_at: new Date().toISOString()
    })
    .select()

  if (error) throw error
  return data
}

/**
 * Get all generated content for current user
 */
export async function getGeneratedContent() {
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('generated_content')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}
