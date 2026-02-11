/**
 * QuotaRepository
 *
 * Abstract data access layer for Quota/Subscription entities.
 * Handles all Supabase operations for subscriptions and AI usage tracking.
 */

import { DatabaseError, wrapError, logger as defaultLogger } from '@/shared/utils'
import { Quota } from '@/domain/models'
import { SUPABASE_CONFIG } from '@/shared/config'

export class QuotaRepository {
  constructor(supabaseClient, logger = defaultLogger) {
    this.supabase = supabaseClient
    this.logger = logger.child('QuotaRepository')
  }

  /**
   * Get user's subscription
   */
  async getSubscription(userId) {
    try {
      this.logger.debug('Fetching subscription', { userId })

      const { data, error } = await this.supabase
        .from(SUPABASE_CONFIG.TABLES.SUBSCRIPTIONS)
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows

      if (!data) {
        // Return default free subscription if none exists
        return {
          user_id: userId,
          tier: 'free',
          status: 'active',
          created_at: new Date().toISOString()
        }
      }

      return data
    } catch (error) {
      const wrappedError = wrapError(error, DatabaseError, { userId })
      this.logger.logError(wrappedError)
      throw wrappedError
    }
  }

  /**
   * Get AI usage this month
   */
  async getMonthlyUsage(userId) {
    try {
      this.logger.debug('Fetching monthly usage', { userId })

      // Get start of current month
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

      const { data, error } = await this.supabase
        .from(SUPABASE_CONFIG.TABLES.AI_USAGE)
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startOfMonth)

      if (error && error.code !== 'PGRST116') throw error

      const usageCount = data?.length || 0
      this.logger.debug('Monthly usage fetched', { userId, count: usageCount })

      return {
        count: usageCount,
        records: data || [],
        startOfMonth
      }
    } catch (error) {
      const wrappedError = wrapError(error, DatabaseError, { userId })
      this.logger.logError(wrappedError)
      throw wrappedError
    }
  }

  /**
   * Record AI generation usage
   */
  async recordUsage(userId, taskId, model, tokensIn, tokensOut, cost) {
    try {
      this.logger.debug('Recording AI usage', { userId, taskId, model, tokensIn, tokensOut })

      const { error } = await this.supabase
        .from(SUPABASE_CONFIG.TABLES.AI_USAGE)
        .insert([
          {
            user_id: userId,
            task_id: taskId,
            model,
            tokens_input: tokensIn,
            tokens_output: tokensOut,
            cost,
            created_at: new Date().toISOString()
          }
        ])

      if (error) throw error

      this.logger.info('Usage recorded', { userId, taskId })
      return true
    } catch (error) {
      const wrappedError = wrapError(error, DatabaseError, { userId, taskId })
      this.logger.logError(wrappedError)
      throw wrappedError
    }
  }

  /**
   * Create or update subscription
   */
  async upsertSubscription(userId, tier, status = 'active') {
    try {
      this.logger.debug('Upserting subscription', { userId, tier, status })

      const { data, error } = await this.supabase
        .from(SUPABASE_CONFIG.TABLES.SUBSCRIPTIONS)
        .upsert(
          {
            user_id: userId,
            tier,
            status,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'user_id' }
        )
        .select()
        .single()

      if (error) throw error

      this.logger.info('Subscription upserted', { userId, tier })
      return data
    } catch (error) {
      const wrappedError = wrapError(error, DatabaseError, { userId, tier })
      this.logger.logError(wrappedError)
      throw wrappedError
    }
  }

  /**
   * Get usage history with pagination
   */
  async getUsageHistory(userId, limit = 50, offset = 0) {
    try {
      this.logger.debug('Fetching usage history', { userId, limit, offset })

      const { data, count, error } = await this.supabase
        .from(SUPABASE_CONFIG.TABLES.AI_USAGE)
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error

      return {
        records: data || [],
        total: count || 0,
        limit,
        offset
      }
    } catch (error) {
      const wrappedError = wrapError(error, DatabaseError, { userId })
      this.logger.logError(wrappedError)
      throw wrappedError
    }
  }

  /**
   * Get usage statistics for a user
   */
  async getUsageStats(userId) {
    try {
      this.logger.debug('Fetching usage stats', { userId })

      const { data, error } = await this.supabase
        .from(SUPABASE_CONFIG.TABLES.AI_USAGE)
        .select('model, tokens_input, tokens_output, cost')
        .eq('user_id', userId)

      if (error) throw error

      const stats = {
        totalGenerations: data?.length || 0,
        totalTokens: 0,
        totalCost: 0,
        byModel: {}
      }

      data?.forEach(record => {
        stats.totalTokens += (record.tokens_input || 0) + (record.tokens_output || 0)
        stats.totalCost += record.cost || 0

        if (!stats.byModel[record.model]) {
          stats.byModel[record.model] = {
            count: 0,
            tokens: 0,
            cost: 0
          }
        }

        stats.byModel[record.model].count++
        stats.byModel[record.model].tokens += (record.tokens_input || 0) + (record.tokens_output || 0)
        stats.byModel[record.model].cost += record.cost || 0
      })

      return stats
    } catch (error) {
      const wrappedError = wrapError(error, DatabaseError, { userId })
      this.logger.logError(wrappedError)
      throw wrappedError
    }
  }

  /**
   * Create Quota domain model from subscription + usage data
   */
  async createQuotaModel(userId) {
    try {
      const subscription = await this.getSubscription(userId)
      const usage = await this.getMonthlyUsage(userId)

      return new Quota(
        subscription.tier,
        usage.count
      )
    } catch (error) {
      this.logger.logError(error)
      throw error
    }
  }
}
