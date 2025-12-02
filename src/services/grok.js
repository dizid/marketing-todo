// src/services/grok.js
// Service for fetching Grok advice through Netlify proxy

import { logger } from '@/utils/logger'

/**
 * Get Grok advice based on user data
 * @param {object} userData - User data for context
 * @returns {Promise<string>} Grok advice response
 */
export async function getGrokAdvice(userData) {
  try {
    logger.debug('Fetching Grok advice with userData:', userData)
    const functionUrl = import.meta.env.VITE_FUNCTIONS_URL || '/.netlify/functions'
    const response = await fetch(`${functionUrl}/grok-proxy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userData, requestType: 'mainAdvice' })
    })
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }
    const data = await response.json()
    logger.debug('Grok response data:', data)
    if (data.error) {
      throw new Error(data.error)
    }
    return data.advice || 'No advice received.'
  } catch (error) {
    logger.error('Error fetching Grok advice', error)
    throw error
  }
}

/**
 * Get mindfulness tip from Grok
 * @param {array} triggers - User triggers for context
 * @returns {Promise<string>} Mindfulness tip response
 */
export async function getMindfulnessTip(triggers) {
  try {
    const response = await fetch('/.netlify/functions/grok-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userData: { triggers }, requestType: 'mindfulnessTip' })
    })
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }
    const data = await response.json()
    if (data.error) {
      throw new Error(data.error)
    }
    return data.response || 'No tip received.'
  } catch (error) {
    logger.error('Error fetching mindfulness tip', error)
    throw error
  }
}

/**
 * Get Executive Summary and Priority Tasks from Grok
 * @param {object} projectData - Complete project data including settings, progress, and task details
 * @returns {Promise<object>} Object with summary and prioritizedTasks array
 */
export async function getExecutiveSummaryAndTasks(projectData) {
  try {
    logger.debug('Fetching executive summary with projectData:', projectData)
    const functionUrl = import.meta.env.VITE_FUNCTIONS_URL || '/.netlify/functions'
    const response = await fetch(`${functionUrl}/grok-proxy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userData: projectData,
        requestType: 'executiveSummary',
        temperature: 0.5,
        max_tokens: 2500
      })
    })
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }
    const data = await response.json()
    logger.debug('Executive summary response:', data)
    if (data.error) {
      throw new Error(data.error)
    }
    // Extract the text content from OpenAI-format response
    const content = data.choices?.[0]?.message?.content || ''
    logger.debug('Extracted content:', content)
    return { responseText: content }
  } catch (error) {
    logger.error('Error fetching executive summary', error)
    throw error
  }
}
