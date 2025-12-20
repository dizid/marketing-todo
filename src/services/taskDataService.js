/**
 * Task Data Service - SSOT Phase 4
 *
 * Provides field-level storage operations for task form data and saved items.
 * This replaces the blob-based storage in project_data with normalized tables:
 * - task_form_data: Individual form field values (user input)
 * - task_saved_items: User-saved outputs/selections
 *
 * Key benefits:
 * - Field-level updates (no version conflicts)
 * - Easy querying of specific fields
 * - Timestamp tracking per field
 * - No AI response storage (regenerate on demand)
 */

import { supabase } from '@/utils/supabase'
import { logger } from '@/utils/logger'

// =============================================================================
// Form Data Operations (task_form_data table)
// =============================================================================

/**
 * Save a single form field value
 * Uses UPSERT to create or update the field value
 *
 * @param {string} projectId - Project UUID
 * @param {string} taskId - Task identifier (e.g., 'define-audience')
 * @param {string} fieldName - Field identifier from task config
 * @param {any} fieldValue - The field value (any JSON-serializable type)
 * @returns {Promise<object>} The saved field record
 */
export async function saveFormField(projectId, taskId, fieldName, fieldValue) {
  if (!projectId || !taskId || !fieldName) {
    throw new Error('projectId, taskId, and fieldName are required')
  }

  try {
    const { data, error } = await supabase
      .from('task_form_data')
      .upsert({
        project_id: projectId,
        task_id: taskId,
        field_name: fieldName,
        field_value: fieldValue
      }, {
        onConflict: 'project_id,task_id,field_name'
      })
      .select()
      .single()

    if (error) {
      logger.error('[TaskDataService] Error saving form field:', error)
      throw error
    }

    logger.debug(`[TaskDataService] Saved field ${fieldName} for task ${taskId}`)
    return data
  } catch (err) {
    logger.error('[TaskDataService] saveFormField failed:', err)
    throw err
  }
}

/**
 * Save multiple form fields at once (batch operation)
 * More efficient than individual saves for form submission
 *
 * @param {string} projectId - Project UUID
 * @param {string} taskId - Task identifier
 * @param {object} formData - Object with field names as keys
 * @returns {Promise<object[]>} Array of saved field records
 */
export async function saveFormData(projectId, taskId, formData) {
  if (!projectId || !taskId) {
    throw new Error('projectId and taskId are required')
  }

  if (!formData || typeof formData !== 'object') {
    return []
  }

  try {
    // Convert formData object to array of records
    const records = Object.entries(formData).map(([fieldName, fieldValue]) => ({
      project_id: projectId,
      task_id: taskId,
      field_name: fieldName,
      field_value: fieldValue
    }))

    if (records.length === 0) {
      return []
    }

    const { data, error } = await supabase
      .from('task_form_data')
      .upsert(records, {
        onConflict: 'project_id,task_id,field_name'
      })
      .select()

    if (error) {
      logger.error('[TaskDataService] Error saving form data:', error)
      throw error
    }

    logger.debug(`[TaskDataService] Saved ${records.length} fields for task ${taskId}`)
    return data || []
  } catch (err) {
    logger.error('[TaskDataService] saveFormData failed:', err)
    throw err
  }
}

/**
 * Get all form data for a specific task
 * Returns an object with field names as keys (like the original formData)
 *
 * @param {string} projectId - Project UUID
 * @param {string} taskId - Task identifier
 * @returns {Promise<object>} Object with field names as keys and values
 */
export async function getFormData(projectId, taskId) {
  if (!projectId || !taskId) {
    throw new Error('projectId and taskId are required')
  }

  try {
    const { data, error } = await supabase
      .from('task_form_data')
      .select('field_name, field_value, updated_at')
      .eq('project_id', projectId)
      .eq('task_id', taskId)

    if (error) {
      logger.error('[TaskDataService] Error getting form data:', error)
      throw error
    }

    // Convert array of records to object
    const formData = {}
    for (const record of data || []) {
      formData[record.field_name] = record.field_value
    }

    return formData
  } catch (err) {
    logger.error('[TaskDataService] getFormData failed:', err)
    throw err
  }
}

/**
 * Get form data for all tasks in a project
 * Useful for loading all task data at once
 *
 * @param {string} projectId - Project UUID
 * @returns {Promise<object>} Object keyed by taskId, each containing formData object
 */
export async function getAllTaskFormData(projectId) {
  if (!projectId) {
    throw new Error('projectId is required')
  }

  try {
    const { data, error } = await supabase
      .from('task_form_data')
      .select('task_id, field_name, field_value')
      .eq('project_id', projectId)

    if (error) {
      logger.error('[TaskDataService] Error getting all task form data:', error)
      throw error
    }

    // Group by task_id
    const taskData = {}
    for (const record of data || []) {
      if (!taskData[record.task_id]) {
        taskData[record.task_id] = { formData: {} }
      }
      taskData[record.task_id].formData[record.field_name] = record.field_value
    }

    return taskData
  } catch (err) {
    logger.error('[TaskDataService] getAllTaskFormData failed:', err)
    throw err
  }
}

/**
 * Delete a specific form field
 *
 * @param {string} projectId - Project UUID
 * @param {string} taskId - Task identifier
 * @param {string} fieldName - Field to delete
 */
export async function deleteFormField(projectId, taskId, fieldName) {
  try {
    const { error } = await supabase
      .from('task_form_data')
      .delete()
      .eq('project_id', projectId)
      .eq('task_id', taskId)
      .eq('field_name', fieldName)

    if (error) {
      logger.error('[TaskDataService] Error deleting form field:', error)
      throw error
    }
  } catch (err) {
    logger.error('[TaskDataService] deleteFormField failed:', err)
    throw err
  }
}

// =============================================================================
// Saved Items Operations (task_saved_items table)
// =============================================================================

/**
 * Save an item (e.g., AI output the user wants to keep)
 *
 * @param {string} projectId - Project UUID
 * @param {string} taskId - Task identifier
 * @param {object} itemData - The item to save (label, content, etc.)
 * @returns {Promise<object>} The saved item record
 */
export async function saveItem(projectId, taskId, itemData) {
  if (!projectId || !taskId || !itemData) {
    throw new Error('projectId, taskId, and itemData are required')
  }

  try {
    // Get current max order for this task
    const { data: existingItems } = await supabase
      .from('task_saved_items')
      .select('item_order')
      .eq('project_id', projectId)
      .eq('task_id', taskId)
      .order('item_order', { ascending: false })
      .limit(1)

    const nextOrder = existingItems?.[0]?.item_order ?? -1
    const newOrder = nextOrder + 1

    const { data, error } = await supabase
      .from('task_saved_items')
      .insert({
        project_id: projectId,
        task_id: taskId,
        item_data: itemData,
        item_order: newOrder
      })
      .select()
      .single()

    if (error) {
      logger.error('[TaskDataService] Error saving item:', error)
      throw error
    }

    logger.debug(`[TaskDataService] Saved item for task ${taskId}`)
    return data
  } catch (err) {
    logger.error('[TaskDataService] saveItem failed:', err)
    throw err
  }
}

/**
 * Save multiple items at once (replaces existing items)
 * Used when syncing savedItems array from component
 *
 * @param {string} projectId - Project UUID
 * @param {string} taskId - Task identifier
 * @param {object[]} items - Array of items to save
 * @returns {Promise<object[]>} Array of saved item records
 */
export async function saveSavedItems(projectId, taskId, items) {
  if (!projectId || !taskId) {
    throw new Error('projectId and taskId are required')
  }

  try {
    // Delete existing items for this task
    await supabase
      .from('task_saved_items')
      .delete()
      .eq('project_id', projectId)
      .eq('task_id', taskId)

    if (!items || items.length === 0) {
      return []
    }

    // Insert new items with order
    const records = items.map((itemData, index) => ({
      project_id: projectId,
      task_id: taskId,
      item_data: itemData,
      item_order: index
    }))

    const { data, error } = await supabase
      .from('task_saved_items')
      .insert(records)
      .select()

    if (error) {
      logger.error('[TaskDataService] Error saving items:', error)
      throw error
    }

    logger.debug(`[TaskDataService] Saved ${items.length} items for task ${taskId}`)
    return data || []
  } catch (err) {
    logger.error('[TaskDataService] saveSavedItems failed:', err)
    throw err
  }
}

/**
 * Get all saved items for a specific task
 *
 * @param {string} projectId - Project UUID
 * @param {string} taskId - Task identifier
 * @returns {Promise<object[]>} Array of saved items (just the item_data)
 */
export async function getSavedItems(projectId, taskId) {
  if (!projectId || !taskId) {
    throw new Error('projectId and taskId are required')
  }

  try {
    const { data, error } = await supabase
      .from('task_saved_items')
      .select('id, item_data, item_order, saved_at')
      .eq('project_id', projectId)
      .eq('task_id', taskId)
      .order('item_order', { ascending: true })

    if (error) {
      logger.error('[TaskDataService] Error getting saved items:', error)
      throw error
    }

    // Return just the item_data array (matching original savedItems format)
    return (data || []).map(record => record.item_data)
  } catch (err) {
    logger.error('[TaskDataService] getSavedItems failed:', err)
    throw err
  }
}

/**
 * Get saved items for all tasks in a project
 *
 * @param {string} projectId - Project UUID
 * @returns {Promise<object>} Object keyed by taskId, each containing savedItems array
 */
export async function getAllTaskSavedItems(projectId) {
  if (!projectId) {
    throw new Error('projectId is required')
  }

  try {
    const { data, error } = await supabase
      .from('task_saved_items')
      .select('task_id, item_data, item_order')
      .eq('project_id', projectId)
      .order('item_order', { ascending: true })

    if (error) {
      logger.error('[TaskDataService] Error getting all task saved items:', error)
      throw error
    }

    // Group by task_id
    const taskItems = {}
    for (const record of data || []) {
      if (!taskItems[record.task_id]) {
        taskItems[record.task_id] = { savedItems: [] }
      }
      taskItems[record.task_id].savedItems.push(record.item_data)
    }

    return taskItems
  } catch (err) {
    logger.error('[TaskDataService] getAllTaskSavedItems failed:', err)
    throw err
  }
}

/**
 * Delete a specific saved item by its ID
 *
 * @param {string} itemId - Item UUID
 */
export async function deleteItem(itemId) {
  try {
    const { error } = await supabase
      .from('task_saved_items')
      .delete()
      .eq('id', itemId)

    if (error) {
      logger.error('[TaskDataService] Error deleting item:', error)
      throw error
    }
  } catch (err) {
    logger.error('[TaskDataService] deleteItem failed:', err)
    throw err
  }
}

/**
 * Delete all saved items for a task
 *
 * @param {string} projectId - Project UUID
 * @param {string} taskId - Task identifier
 */
export async function clearSavedItems(projectId, taskId) {
  try {
    const { error } = await supabase
      .from('task_saved_items')
      .delete()
      .eq('project_id', projectId)
      .eq('task_id', taskId)

    if (error) {
      logger.error('[TaskDataService] Error clearing items:', error)
      throw error
    }

    logger.debug(`[TaskDataService] Cleared items for task ${taskId}`)
  } catch (err) {
    logger.error('[TaskDataService] clearSavedItems failed:', err)
    throw err
  }
}

// =============================================================================
// Combined Operations
// =============================================================================

/**
 * Get complete task data (formData + savedItems) for a specific task
 * This provides the same data structure as the old project_data blob
 *
 * @param {string} projectId - Project UUID
 * @param {string} taskId - Task identifier
 * @returns {Promise<object>} { formData: {}, savedItems: [] }
 */
export async function getTaskData(projectId, taskId) {
  const [formData, savedItems] = await Promise.all([
    getFormData(projectId, taskId),
    getSavedItems(projectId, taskId)
  ])

  return {
    formData,
    savedItems
  }
}

/**
 * Save complete task data (formData + savedItems)
 * This provides backward compatibility with existing save patterns
 * NOTE: Does NOT save aiOutput (per SSOT Phase 4 requirement)
 *
 * @param {string} projectId - Project UUID
 * @param {string} taskId - Task identifier
 * @param {object} data - { formData: {}, savedItems: [] }
 */
export async function saveTaskData(projectId, taskId, data) {
  const promises = []

  if (data.formData && typeof data.formData === 'object') {
    promises.push(saveFormData(projectId, taskId, data.formData))
  }

  if (Array.isArray(data.savedItems)) {
    promises.push(saveSavedItems(projectId, taskId, data.savedItems))
  }

  // Note: data.aiOutput is intentionally NOT saved
  // AI responses can be regenerated from formData

  await Promise.all(promises)
}

/**
 * Get all task data for a project (all tasks)
 * Returns structure compatible with old projectData.taskData
 *
 * @param {string} projectId - Project UUID
 * @returns {Promise<object>} Object keyed by taskId: { [taskId]: { formData, savedItems } }
 */
export async function getAllTaskData(projectId) {
  const [formDataByTask, savedItemsByTask] = await Promise.all([
    getAllTaskFormData(projectId),
    getAllTaskSavedItems(projectId)
  ])

  // Merge form data and saved items by task
  const allTaskIds = new Set([
    ...Object.keys(formDataByTask),
    ...Object.keys(savedItemsByTask)
  ])

  const result = {}
  for (const taskId of allTaskIds) {
    result[taskId] = {
      formData: formDataByTask[taskId]?.formData || {},
      savedItems: savedItemsByTask[taskId]?.savedItems || []
    }
  }

  return result
}
