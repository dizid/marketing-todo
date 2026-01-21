/**
 * Social Publisher Service
 *
 * Handles social media publishing and connection management.
 * Integrates with the social-post Netlify function.
 *
 * Supported platforms:
 * - Twitter/X (OAuth 2.0 PKCE flow)
 * - LinkedIn (coming soon)
 */

import { supabase } from '@/utils/supabase'

// Twitter OAuth 2.0 configuration
const TWITTER_CLIENT_ID = import.meta.env.VITE_TWITTER_CLIENT_ID
const TWITTER_REDIRECT_URI = `${window.location.origin}/auth/twitter/callback`

/**
 * Check if user has connected a social platform
 * @param {string} platform - Platform name (twitter, linkedin)
 * @returns {Promise<boolean>}
 */
export async function isConnected(platform) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { data, error } = await supabase
      .from('social_connections')
      .select('id')
      .eq('user_id', user.id)
      .eq('platform', platform)
      .single()

    return !!data && !error
  } catch (err) {
    console.error('Error checking connection:', err)
    return false
  }
}

/**
 * Get connection status for all supported platforms
 * @returns {Promise<Object>} Map of platform -> connected boolean
 */
export async function getConnectionStatus() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { twitter: false, linkedin: false }

    const { data, error } = await supabase
      .from('social_connections')
      .select('platform')
      .eq('user_id', user.id)

    if (error) {
      // Table might not exist yet
      return { twitter: false, linkedin: false }
    }

    const connected = {
      twitter: false,
      linkedin: false
    }

    data?.forEach(row => {
      connected[row.platform] = true
    })

    return connected
  } catch (err) {
    console.error('Error getting connection status:', err)
    return { twitter: false, linkedin: false }
  }
}

/**
 * Initiate Twitter OAuth 2.0 PKCE flow
 * Opens popup for authorization
 */
export function connectTwitter() {
  if (!TWITTER_CLIENT_ID) {
    throw new Error('Twitter integration not configured. Please add VITE_TWITTER_CLIENT_ID to your environment.')
  }

  // Generate PKCE challenge
  const codeVerifier = generateCodeVerifier()
  const codeChallenge = generateCodeChallenge(codeVerifier)

  // Store verifier for callback
  sessionStorage.setItem('twitter_code_verifier', codeVerifier)

  // Build authorization URL
  const scope = 'tweet.read tweet.write users.read offline.access'
  const state = crypto.randomUUID()
  sessionStorage.setItem('twitter_oauth_state', state)

  const authUrl = new URL('https://twitter.com/i/oauth2/authorize')
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('client_id', TWITTER_CLIENT_ID)
  authUrl.searchParams.set('redirect_uri', TWITTER_REDIRECT_URI)
  authUrl.searchParams.set('scope', scope)
  authUrl.searchParams.set('state', state)
  authUrl.searchParams.set('code_challenge', codeChallenge)
  authUrl.searchParams.set('code_challenge_method', 'S256')

  // Open in popup
  const width = 600
  const height = 700
  const left = window.screenX + (window.outerWidth - width) / 2
  const top = window.screenY + (window.outerHeight - height) / 2

  window.open(
    authUrl.toString(),
    'twitter-auth',
    `width=${width},height=${height},left=${left},top=${top}`
  )
}

/**
 * Handle Twitter OAuth callback
 * Called from the callback page
 * @param {string} code - Authorization code
 * @param {string} state - State parameter
 */
export async function handleTwitterCallback(code, state) {
  // Verify state
  const savedState = sessionStorage.getItem('twitter_oauth_state')
  if (state !== savedState) {
    throw new Error('Invalid state parameter')
  }

  const codeVerifier = sessionStorage.getItem('twitter_code_verifier')
  if (!codeVerifier) {
    throw new Error('Missing code verifier')
  }

  // Exchange code for tokens via Netlify function
  const response = await fetch('/.netlify/functions/twitter-auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code,
      codeVerifier,
      redirectUri: TWITTER_REDIRECT_URI
    })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to connect Twitter')
  }

  // Clean up session storage
  sessionStorage.removeItem('twitter_code_verifier')
  sessionStorage.removeItem('twitter_oauth_state')

  return data
}

/**
 * Post content to a social platform
 * @param {string} platform - Platform name (twitter, linkedin)
 * @param {string} content - Content to post
 * @returns {Promise<Object>} Post result with postUrl
 */
export async function publishPost(platform, content) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const response = await fetch('/.netlify/functions/social-post', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      platform,
      content,
      userId: user.id
    })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to publish post')
  }

  return data
}

/**
 * Disconnect a social platform
 * @param {string} platform - Platform name
 */
export async function disconnectPlatform(platform) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('social_connections')
    .delete()
    .eq('user_id', user.id)
    .eq('platform', platform)
}

// PKCE Helpers

function generateCodeVerifier() {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return base64UrlEncode(array)
}

function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  return crypto.subtle.digest('SHA-256', data).then(hash => {
    return base64UrlEncode(new Uint8Array(hash))
  })
}

function base64UrlEncode(array) {
  const base64 = btoa(String.fromCharCode(...array))
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}
