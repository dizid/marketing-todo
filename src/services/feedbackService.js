// Feedback Service - Handles user feedback submission
// Manages: task completion feedback, testimonials

import { supabase } from '../utils/supabase.js'

/**
 * Submit user feedback for a completed task
 * @param {Object} feedbackData - Feedback data
 * @param {string} feedbackData.userId - User ID
 * @param {string} feedbackData.projectId - Project ID (optional)
 * @param {string} feedbackData.taskId - Task ID
 * @param {number} feedbackData.rating - Rating (1-5)
 * @param {string} feedbackData.feedbackText - Feedback text (optional)
 * @param {boolean} feedbackData.canUseAsTestimonial - Testimonial consent
 */
export async function submitFeedback(feedbackData) {
  const { data, error } = await supabase
    .from('user_feedback')
    .insert({
      user_id: feedbackData.userId,
      project_id: feedbackData.projectId || null,
      task_id: feedbackData.taskId,
      rating: feedbackData.rating,
      feedback_text: feedbackData.feedbackText || null,
      can_use_as_testimonial: feedbackData.canUseAsTestimonial
    })

  if (error) throw error
  return data
}
