/**
 * Subscription Store (Deprecated - Compatibility Layer)
 *
 * DEPRECATED: This store has been consolidated into useQuotaStore
 *
 * This file exists only for backward compatibility.
 * All new code should import from @/stores/quotaStore
 *
 * Migration path:
 * OLD: import { useSubscriptionStore } from '@/stores/subscriptionStore'
 * NEW: import { useQuotaStore } from '@/stores/quotaStore'
 *
 * All methods and computed properties are available under the same names.
 */

import { useQuotaStore } from '@/stores/quotaStore'

/**
 * Compatibility export - delegates to useQuotaStore
 * Maintains backward compatibility for existing code
 */
export const useSubscriptionStore = useQuotaStore
