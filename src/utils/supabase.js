/**
 * Supabase Client Configuration
 *
 * This utility initializes and exports the Supabase client for use throughout the application.
 * Supabase provides real-time database, authentication, and storage capabilities.
 *
 * Configuration:
 * - VITE_SUPABASE_URL: Your Supabase project URL
 * - VITE_SUPABASE_ANON_KEY: Anonymous public key (safe for client-side)
 */

import { createClient } from '@supabase/supabase-js'

// Validate required environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.')
  throw new Error('Supabase configuration missing')
}

// Initialize and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Authentication Helper Functions
 */

/**
 * Sign up a new user with email and password
 * Handles both email confirmation and auto-confirmation scenarios
 * @param {string} email - User email address
 * @param {string} password - User password (min 6 characters)
 * @returns {object} {success, requiresConfirmation, error}
 */
export async function signUp(email, password) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      // Provide detailed error messages
      const errorMap = {
        'User already registered': 'This email is already registered. Please sign in instead.',
        'Password should be at least 6 characters': 'Password must be at least 6 characters.',
        'Invalid email': 'Please enter a valid email address.',
        'signup disabled': 'Sign up is currently disabled. Please try again later.',
      }

      const userMessage = Object.entries(errorMap).find(([key]) =>
        error.message.toLowerCase().includes(key.toLowerCase())
      )?.[1] || error.message || 'Sign up failed. Please check your details and try again.'

      throw new Error(userMessage)
    }

    // Check if email confirmation is required
    // If user session exists, email confirmation is disabled (auto-confirmation)
    const requiresConfirmation = !data.session

    return {
      success: true,
      data,
      requiresConfirmation,
      message: requiresConfirmation
        ? 'Please check your email to confirm your account.'
        : 'Account created successfully! Redirecting to dashboard...'
    }
  } catch (error) {
    console.error('SignUp error:', error)
    throw error
  }
}

/**
 * Sign in an existing user with email and password
 * @param {string} email - User email address
 * @param {string} password - User password
 */
export async function signIn(email, password) {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // Provide detailed error messages for common auth errors
      const errorMap = {
        'invalid login credentials': 'Invalid email or password. Please check and try again.',
        'email not confirmed': 'Please confirm your email first. Check your inbox for a confirmation link.',
        'invalid_grant': 'Invalid email or password.',
        'user not found': 'This email is not registered. Please sign up first.',
        'too many requests': 'Too many login attempts. Please wait a few minutes and try again.',
      }

      const userMessage = Object.entries(errorMap).find(([key]) =>
        error.message.toLowerCase().includes(key.toLowerCase())
      )?.[1] || error.message || 'Sign in failed. Please check your credentials.'

      throw new Error(userMessage)
    }

    return { success: true }
  } catch (error) {
    console.error('SignIn error:', error)
    throw error
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Supabase signOut error:', error.message)
      throw new Error('Failed to log out. Please try again.')
    }
  } catch (err) {
    console.error('Logout error:', err.message)
    throw new Error('Logout failed. Please check your connection and try again.')
  }
}

/**
 * Get the current user session
 * @returns {Promise} Current session or null
 */
export const getCurrentUser = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Listen to authentication state changes
 * @param {Function} callback - Function called when auth state changes
 * @returns {Function} Unsubscribe function
 */
export const onAuthStateChanged = (callback) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session)
  })
}

/**
 * Password reset - send reset email
 * @param {string} email - User email address
 * @returns {object} {success, error, message}
 */
export async function resetPassword(email) {
  try {
    // Important: redirect must match URL configured in Supabase dashboard
    const resetRedirectUrl = `${window.location.origin}/reset-password`

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: resetRedirectUrl
    })

    if (error) {
      // Provide detailed error messages
      const errorMap = {
        'user not found': 'No account found with this email address.',
        'email provider disabled': 'Email service is not configured. Please contact support.',
        'too many requests': 'Too many reset requests. Please wait a few minutes and try again.',
      }

      const userMessage = Object.entries(errorMap).find(([key]) =>
        error.message.toLowerCase().includes(key.toLowerCase())
      )?.[1] || error.message || 'Failed to send reset email. Please try again.'

      throw new Error(userMessage)
    }

    return {
      success: true,
      data,
      message: 'Check your email for a password reset link. It may take a few minutes to arrive.'
    }
  } catch (error) {
    console.error('Password reset error:', error)
    return {
      success: false,
      error: error.message || 'Failed to send reset email. Please check your email address and try again.'
    }
  }
}
