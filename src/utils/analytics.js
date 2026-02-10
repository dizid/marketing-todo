/**
 * Analytics utility for GA4 event tracking
 *
 * Centralizes all GA4 event tracking with safety checks.
 * Uses the window.gtag pattern already established in the codebase.
 *
 * Usage:
 * import { trackEvent, trackCtaClick, trackSignUp, trackLeadCapture } from '@/utils/analytics'
 */

/**
 * Track a GA4 custom event
 * @param {string} eventName - GA4 event name (snake_case)
 * @param {Object} params - Event parameters
 */
export function trackEvent(eventName, params = {}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params)
  }
}

/**
 * Track a CTA button click
 * @param {string} ctaName - Identifier for the CTA (e.g., 'hero_get_started')
 * @param {string} location - Page section (e.g., 'hero', 'pricing', 'nav')
 */
export function trackCtaClick(ctaName, location) {
  trackEvent('cta_click', {
    event_category: 'engagement',
    event_label: ctaName,
    cta_location: location
  })
}

/**
 * Track a successful signup
 * @param {string} method - Signup method (e.g., 'email')
 */
export function trackSignUp(method = 'email') {
  trackEvent('sign_up', { method })
}

/**
 * Track a lead capture (waitlist form submission)
 * @param {string} source - Where the lead was captured (e.g., 'landing_waitlist')
 */
export function trackLeadCapture(source = 'landing_waitlist') {
  trackEvent('generate_lead', {
    event_category: 'lead_capture',
    event_label: source,
    value: 1
  })
}

/**
 * Track a page/section view
 * @param {string} sectionName - Section identifier (e.g., 'features', 'pricing')
 */
export function trackSectionView(sectionName) {
  trackEvent('section_view', {
    event_category: 'engagement',
    event_label: sectionName
  })
}
