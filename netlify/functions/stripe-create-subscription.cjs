/**
 * Netlify Function: Create Stripe Subscription
 * Endpoint: POST /.netlify/functions/stripe-create-subscription
 *
 * Creates a Stripe customer and subscription, stores in database
 * Returns client secret for frontend payment confirmation
 */

// Validate environment variables at module load time
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('[stripe-create-subscription] CRITICAL: STRIPE_SECRET_KEY not set in environment')
  throw new Error('STRIPE_SECRET_KEY environment variable is required')
}

if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('[stripe-create-subscription] CRITICAL: Supabase environment variables not set')
  throw new Error('Supabase environment variables (VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) are required')
}

let stripe, supabase
try {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
  console.log('[stripe-create-subscription] Stripe SDK initialized successfully')
} catch (error) {
  console.error('[stripe-create-subscription] CRITICAL: Failed to initialize Stripe SDK:', error.message)
  throw error
}

try {
  const { createClient } = require('@supabase/supabase-js')
  supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
  console.log('[stripe-create-subscription] Supabase client initialized successfully')
} catch (error) {
  console.error('[stripe-create-subscription] CRITICAL: Failed to initialize Supabase:', error.message)
  throw error
}

exports.handler = async (event) => {
  // Helper to always return proper JSON response
  const jsonResponse = (statusCode, data) => ({
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    console.warn('[stripe-create-subscription] Invalid HTTP method:', event.httpMethod)
    return jsonResponse(405, { error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' })
  }

  try {
    console.log('[stripe-create-subscription] Request received')

    // Parse request body safely
    let userId, priceId
    try {
      console.log('[stripe-create-subscription] Request body:', event.body)
      const parsed = JSON.parse(event.body || '{}')
      userId = parsed.userId
      priceId = parsed.priceId
      console.log('[stripe-create-subscription] Parsed - userId:', userId, 'priceId:', priceId)
    } catch (parseError) {
      console.error('[stripe-create-subscription] Failed to parse request body:', parseError.message)
      return jsonResponse(400, {
        error: 'Invalid JSON in request body',
        code: 'INVALID_JSON',
        details: parseError.message
      })
    }

    // Validate input
    if (!userId || !priceId) {
      console.error('[stripe-create-subscription] Validation failed - userId:', userId, 'priceId:', priceId)
      return jsonResponse(400, {
        error: 'Missing userId or priceId',
        code: 'MISSING_PARAMS',
        received: { userId: !!userId, priceId: !!priceId }
      })
    }

    // Validate UUID format (basic check)
    if (typeof userId !== 'string' || userId.length === 0) {
      console.error('[stripe-create-subscription] Invalid userId type/format:', typeof userId)
      return jsonResponse(400, {
        error: 'userId must be a non-empty string',
        code: 'INVALID_USER_ID'
      })
    }

    if (typeof priceId !== 'string' || priceId.length === 0) {
      console.error('[stripe-create-subscription] Invalid priceId type/format:', typeof priceId)
      return jsonResponse(400, {
        error: 'priceId must be a non-empty string',
        code: 'INVALID_PRICE_ID'
      })
    }

    // Get or create Stripe customer
    let customer
    try {
      customer = await getOrCreateStripeCustomer(userId)
      console.log('[stripe-create-subscription] Got customer:', customer.id)
      if (!customer?.id) {
        throw new Error('Customer created but has no ID')
      }
    } catch (error) {
      console.error('[stripe-create-subscription] Failed to get/create customer:', error.message)
      return jsonResponse(500, {
        error: 'Failed to create or retrieve Stripe customer',
        code: 'CUSTOMER_CREATE_ERROR',
        details: error.message
      })
    }

    // Create subscription with payment_behavior: 'default_incomplete'
    // This creates a subscription without payment, requiring client confirmation
    console.log('[stripe-create-subscription] Creating subscription with:', { customerId: customer.id, priceId })
    let subscription
    try {
      subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice', 'latest_invoice.payment_intent']
      })
      console.log('[stripe-create-subscription] Created subscription:', subscription.id)
    } catch (error) {
      console.error('[stripe-create-subscription] Failed to create subscription:', error.message, error.code)
      const errorCode = error.code === 'resource_missing' ? 'PRICE_NOT_FOUND' : 'SUBSCRIPTION_CREATE_ERROR'
      const errorDetail = error.code === 'resource_missing'
        ? 'The specified price ID does not exist in your Stripe account'
        : error.message
      return jsonResponse(400, {
        error: 'Failed to create subscription',
        code: errorCode,
        details: errorDetail
      })
    }
    console.log('[stripe-create-subscription] Created subscription:', subscription.id)
    console.log('[stripe-create-subscription] Subscription status:', subscription.status)
    console.log('[stripe-create-subscription] Period dates - start:', subscription.current_period_start, 'end:', subscription.current_period_end)

    // Retrieve fresh subscription object to ensure all fields are populated
    // Sometimes the created subscription might not have all fields expanded
    subscription = await stripe.subscriptions.retrieve(subscription.id, {
      expand: ['latest_invoice', 'latest_invoice.payment_intent']
    })
    console.log('[stripe-create-subscription] Retrieved subscription:', subscription.id)
    console.log('[stripe-create-subscription] After retrieve - Period dates - start:', subscription.current_period_start, 'end:', subscription.current_period_end)

    // Store in database - update if exists, insert if not
    // Convert Stripe unix timestamps (in seconds) to ISO strings
    let periodStart, periodEnd
    try {
      // Stripe subscriptions should have period dates, but with payment_behavior: 'default_incomplete'
      // they might be null until payment is confirmed. Use current time as start if null.
      const now = new Date()

      if (typeof subscription.current_period_start === 'number') {
        periodStart = new Date(subscription.current_period_start * 1000).toISOString()
      } else if (subscription.current_period_start) {
        periodStart = subscription.current_period_start
      } else {
        // Fallback: use current time if not provided
        periodStart = now.toISOString()
        console.log('[stripe-create-subscription] Using current time as period start (was null)')
      }

      if (typeof subscription.current_period_end === 'number') {
        periodEnd = new Date(subscription.current_period_end * 1000).toISOString()
      } else if (subscription.current_period_end) {
        periodEnd = subscription.current_period_end
      } else {
        // Fallback: calculate 1 month from now if not provided
        const endDate = new Date(now)
        endDate.setMonth(endDate.getMonth() + 1)
        periodEnd = endDate.toISOString()
        console.log('[stripe-create-subscription] Calculated period end (was null):', periodEnd)
      }

      console.log('[stripe-create-subscription] Converted dates - start:', periodStart, 'end:', periodEnd)
    } catch (dateError) {
      console.error('[stripe-create-subscription] Date conversion error:', dateError)
      throw new Error(`Failed to convert subscription dates: ${dateError.message}`)
    }

    const subscriptionData = {
      user_id: userId,
      tier: 'premium',
      status: 'active', // Set to active immediately - Stripe webhook will confirm/update
      stripe_customer_id: customer.id,
      stripe_subscription_id: subscription.id,
      current_period_start: periodStart,
      current_period_end: periodEnd,
      payment_provider: 'stripe',
      updated_at: new Date().toISOString()
    }

    // Try to update existing subscription first
    const { data: existingData, error: selectError } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', userId)
      .single()

    let dbError = null
    if (existingData) {
      // Update existing record
      const { error } = await supabase
        .from('subscriptions')
        .update(subscriptionData)
        .eq('user_id', userId)
      dbError = error
    } else {
      // Insert new record
      const { error } = await supabase
        .from('subscriptions')
        .insert([subscriptionData])
      dbError = error
    }

    if (dbError) {
      console.error('Database error:', dbError)
      throw dbError
    }

    // Create a standalone PaymentIntent for the subscription payment
    // The subscription's latest_invoice.payment_intent is often null with payment_behavior: 'default_incomplete'
    // So we create a separate PaymentIntent that the frontend can use to confirm payment
    console.log('[stripe-create-subscription] Creating standalone PaymentIntent for subscription confirmation')

    let clientSecret = null
    try {
      let invoice = null

      // Try to get invoice from subscription
      if (subscription.latest_invoice?.id) {
        invoice = await stripe.invoices.retrieve(subscription.latest_invoice.id)
        console.log('[stripe-create-subscription] Retrieved invoice from subscription:', invoice.id, 'amount:', invoice.amount_due)
      } else {
        // If latest_invoice is null, list invoices for this subscription
        console.log('[stripe-create-subscription] latest_invoice was null, listing invoices for subscription...')
        const invoices = await stripe.invoices.list({
          subscription: subscription.id,
          limit: 1
        })

        if (invoices.data?.length > 0) {
          invoice = invoices.data[0]
          console.log('[stripe-create-subscription] Found invoice from list:', invoice.id, 'amount:', invoice.amount_due)
        } else {
          // If no invoice found, create PaymentIntent with price amount
          // Get price details to know the amount
          const price = await stripe.prices.retrieve(priceId)
          console.log('[stripe-create-subscription] No invoice found, using price amount:', price.unit_amount)

          const paymentIntent = await stripe.paymentIntents.create({
            amount: price.unit_amount,
            currency: price.currency || 'usd',
            customer: customer.id,
            payment_method_types: ['card'],
            metadata: {
              subscriptionId: subscription.id,
              userId: userId,
              priceId: priceId
            }
          })

          clientSecret = paymentIntent.client_secret
          console.log('[stripe-create-subscription] Created PaymentIntent from price:', paymentIntent.id)
        }
      }

      // If we have an invoice, create PaymentIntent for it
      if (invoice && !clientSecret) {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: invoice.amount_due,
          currency: invoice.currency || 'usd',
          customer: customer.id,
          payment_method_types: ['card'],
          metadata: {
            subscriptionId: subscription.id,
            invoiceId: invoice.id,
            userId: userId
          }
        })

        clientSecret = paymentIntent.client_secret
        console.log('[stripe-create-subscription] Created PaymentIntent:', paymentIntent.id, 'with client_secret')
      }
    } catch (error) {
      console.error('[stripe-create-subscription] Failed to create PaymentIntent:', error.message)
      throw new Error(`Failed to create payment intent: ${error.message}`)
    }

    if (!clientSecret) {
      throw new Error('Failed to generate client_secret for payment')
    }

    console.log('[stripe-create-subscription] Successfully returning client secret and subscription data')
    return jsonResponse(200, {
      clientSecret,
      subscriptionId: subscription.id,
      customerId: customer.id
    })
  } catch (error) {
    // Catch any errors that slip through our specific error handlers
    console.error('[stripe-create-subscription] UNHANDLED ERROR:', error?.message || error)
    console.error('[stripe-create-subscription] Error stack:', error?.stack || 'No stack trace')
    console.error('[stripe-create-subscription] Error type:', error?.constructor?.name || 'Unknown')

    // Determine appropriate status code based on error type
    let statusCode = 500
    let errorCode = 'INTERNAL_ERROR'

    if (error?.code === 'resource_missing') {
      statusCode = 400
      errorCode = 'RESOURCE_NOT_FOUND'
    } else if (error?.code === 'invalid_request_error') {
      statusCode = 400
      errorCode = 'INVALID_REQUEST'
    } else if (error?.status) {
      statusCode = error.status
    }

    // Always return proper JSON response - NEVER empty body
    return jsonResponse(statusCode, {
      error: error?.message || 'An unexpected error occurred while creating subscription',
      code: errorCode,
      details: error?.raw?.message || error?.raw?.error?.message || null,
      timestamp: new Date().toISOString()
    })
  }
}

/**
 * Get existing or create new Stripe customer
 * Stores customer ID in database for future reference
 * Defensive: Handles all error scenarios gracefully
 */
async function getOrCreateStripeCustomer(userId) {
  try {
    console.log('[getOrCreateStripeCustomer] Looking up existing customer for userId:', userId)

    // Check if customer ID exists in database
    let subscription = null
    try {
      const result = await supabase
        .from('subscriptions')
        .select('stripe_customer_id')
        .eq('user_id', userId)
        .single()

      if (result.error) {
        if (result.error.code !== 'PGRST116') { // PGRST116 = not found, which is OK
          console.warn('[getOrCreateStripeCustomer] Database query warning:', result.error.message)
        }
      } else {
        subscription = result.data
      }
    } catch (dbError) {
      console.warn('[getOrCreateStripeCustomer] Database lookup failed:', dbError.message)
      // Continue - we'll create a new customer
    }

    // Return existing customer if found
    if (subscription?.stripe_customer_id) {
      try {
        console.log('[getOrCreateStripeCustomer] Retrieving existing customer:', subscription.stripe_customer_id)
        const customer = await stripe.customers.retrieve(subscription.stripe_customer_id)
        console.log('[getOrCreateStripeCustomer] Successfully retrieved customer:', customer.id)
        return customer
      } catch (retrieveError) {
        console.warn('[getOrCreateStripeCustomer] Could not retrieve existing customer, will create new one:', retrieveError.message)
        // Fall through to create new customer
      }
    }

    // Create new customer - try with email first
    console.log('[getOrCreateStripeCustomer] Creating new customer')
    let user = null
    let email = null

    try {
      const { data: userData, error: authError } = await supabase.auth.admin.getUserById(userId)
      if (authError) {
        console.warn('[getOrCreateStripeCustomer] Could not fetch user details:', authError.message)
      } else if (userData) {
        user = userData
        email = userData.user_metadata?.email || userData.email
        console.log('[getOrCreateStripeCustomer] Found user email:', email ? '***' + email.substring(email.length - 10) : 'none')
      }
    } catch (authError) {
      console.warn('[getOrCreateStripeCustomer] Error fetching user from auth:', authError.message)
    }

    // Create customer with email if available
    const customerData = {
      metadata: {
        userId: String(userId),
        createdAt: new Date().toISOString()
      }
    }

    if (email) {
      customerData.email = email
    }

    const customer = await stripe.customers.create(customerData)
    console.log('[getOrCreateStripeCustomer] Created new customer:', customer.id)
    return customer

  } catch (error) {
    console.error('[getOrCreateStripeCustomer] FAILED to create customer:', error?.message || error)
    console.error('[getOrCreateStripeCustomer] Error code:', error?.code)
    console.error('[getOrCreateStripeCustomer] Error type:', error?.constructor?.name)
    throw new Error(`Failed to create Stripe customer: ${error?.message || 'Unknown error'}`)
  }
}
