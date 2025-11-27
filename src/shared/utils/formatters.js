/**
 * Shared formatting utilities for displaying data in user-friendly formats.
 * Used across components for consistent presentation.
 */

/**
 * Format date to readable string (e.g., "Jan 15, 2024")
 */
export function formatDate(date) {
  if (!date) return ''

  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(dateObj)
}

/**
 * Format date with time (e.g., "Jan 15, 2024 2:30 PM")
 */
export function formatDateTime(date) {
  if (!date) return ''

  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(dateObj)
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(date) {
  if (!date) return ''

  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const seconds = Math.floor((now - dateObj) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`

  return formatDate(dateObj)
}

/**
 * Format number with commas (e.g., "1,234,567")
 */
export function formatNumber(num) {
  if (num === null || num === undefined) return ''
  return Number(num).toLocaleString('en-US')
}

/**
 * Format currency (e.g., "$12.34")
 */
export function formatCurrency(amount, currency = 'USD') {
  if (amount === null || amount === undefined) return ''

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount)
}

/**
 * Format percentage (e.g., "42.5%")
 */
export function formatPercentage(value, decimals = 1) {
  if (value === null || value === undefined) return ''
  return `${(Number(value) * 100).toFixed(decimals)}%`
}

/**
 * Format bytes to human-readable size (e.g., "2.5 MB")
 */
export function formatBytes(bytes) {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Format duration in seconds to readable string (e.g., "1h 30m")
 */
export function formatDuration(seconds) {
  if (!seconds || seconds < 0) return '0s'

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  const parts = []
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`)

  return parts.join(' ')
}

/**
 * Format text: capitalize first letter
 */
export function capitalize(text) {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * Format text: snake_case to Title Case
 */
export function formatLabel(text) {
  if (!text) return ''
  return text
    .split('_')
    .map(word => capitalize(word))
    .join(' ')
}

/**
 * Format task progress (e.g., "12/25 tasks" or "48%")
 */
export function formatProgress(completed, total) {
  if (!total) return '0%'
  const percentage = Math.round((completed / total) * 100)
  return `${percentage}%`
}

/**
 * Format quota remaining (e.g., "15 generations left")
 */
export function formatQuotaRemaining(remaining, tier = 'free') {
  if (remaining <= 0) {
    return tier === 'free'
      ? 'Upgrade to continue'
      : 'Quota exceeded'
  }

  return `${remaining} left`
}

/**
 * Format quota percentage for visual display
 */
export function formatQuotaPercentage(remaining, limit) {
  if (!limit) return 0
  return Math.round((remaining / limit) * 100)
}

/**
 * Format tokens used (e.g., "1.2K tokens")
 */
export function formatTokens(tokens) {
  if (tokens < 1000) return `${tokens} tokens`
  if (tokens < 1000000) return `${(tokens / 1000).toFixed(1)}K tokens`
  return `${(tokens / 1000000).toFixed(1)}M tokens`
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text, maxLength = 50) {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Format task status badge text
 */
export function formatTaskStatus(checked, removed) {
  if (removed) return 'Hidden'
  if (checked) return 'Done'
  return 'To-do'
}

/**
 * Format task status color for badges
 */
export function getTaskStatusColor(checked, removed) {
  if (removed) return 'gray'
  if (checked) return 'green'
  return 'blue'
}

/**
 * Format subscription tier display name
 */
export function formatSubscriptionTier(tier) {
  const tierNames = {
    free: 'Free Plan',
    premium: 'Premium',
    enterprise: 'Enterprise'
  }
  return tierNames[tier] || capitalize(tier)
}

/**
 * Safe JSON stringify for display
 */
export function formatJSON(obj, indent = 2) {
  try {
    return JSON.stringify(obj, null, indent)
  } catch {
    return String(obj)
  }
}

/**
 * Get friendly error message
 */
export function getErrorMessage(error) {
  if (typeof error === 'string') return error
  if (error?.message) return error.message
  if (error?.code) return error.code
  return 'An unexpected error occurred'
}
