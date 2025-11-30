/**
 * Supabase Client
 *
 * Initializes Supabase client for backend database operations.
 * Uses environment variables for configuration.
 *
 * Note: In development, this may be stubbed. In production, ensure
 * VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are configured.
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
