/**
 * Netlify Function: Create Stripe Subscription
 * Endpoint: POST /.netlify/functions/stripe-create-subscription
 *
 * Creates a Stripe customer and subscription, stores in database
 * Returns client secret for frontend payment confirmation
 */

const { verifyAuth, getCorsOrigin } = require('./utils/auth.cjs')

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
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': getCorsOrigin(event)
    },
    body: JSON.stringify(data)
  })

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': getCorsOrigin(event),
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      },
      body: ''
    }
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    console.warn('[stripe-create-subscription] Invalid HTTP method:', event.httpMethod)
    return jsonResponse(405, { error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' })
  }

  try {
    console.log('[stripe-create-subscription] Request received')

    // Verify authentication
    let verifiedUserId
    try {
      const auth = await verifyAuth(event)
      verifiedUserId = auth.userId
      console.log('[stripe-create-subscription] Request authenticated')
    } catch (authError) {
      console.error('[stripe-create-subscription] Auth failed:', authError.message)
      return jsonResponse(401, {
        error: 'Unauthorized',
        code: 'AUTH_FAILED',
        details: authError.message
      })
    }

    // Parse request body safely
    let priceId, idempotencyKey
    try {
      const parsed = JSON.parse(event.body || '{}')
      priceId = parsed.priceId
      idempotencyKey = parsed.idempotencyKey
      console.log('[stripe-create-subscription] Parsed - priceId:', priceId, 'hasIdempotencyKey:', !!idempotencyKey)
    } catch (parseError) {
      console.error('[stripe-create-subscription] Failed to parse request body')
      return jsonResponse(400, {
        error: 'Invalid JSON in request body',
        code: 'INVALID_JSON'
      })
    }

    // Use verified userId instead of client-supplied
    const userId = verifiedUserId

    // Generate idempotency key if not provided
    if (!idempotencyKey) {
      idempotencyKey = `${userId}-${priceId}-${Date.now()}`
      console.log('[stripe-create-subscription] Generated idempotency key')
    } else {
      console.log('[stripe-create-subscription] Using provided idempotency key')
    }

    // Validate input
    if (!userId || !priceId) {
      console.error('[stripe-create-subscription] Validation failed')
      return jsonResponse(400, {
        error: 'Missing userId or priceId',
        code: 'MISSING_PARAMS',
        received: { userId: !!userId, priceId: !!priceId }
      })
    }

    // Validate UUID format (basic check)
    if (typeof userId !== 'string' || userId.length === 0) {
      console.error('[stripe-create-subscription] Invalid userId format')
      return jsonResponse(400, {
        error: 'userId must be a non-empty string',
        code: 'INVALID_USER_ID'
      })
    }

    if (typeof priceId !== 'string' || priceId.length === 0) {
      console.error('[stripe-create-subscription] Invalid priceId format')
      return jsonResponse(400, {
        error: 'priceId must be a non-empty string',
        code: 'INVALID_PRICE_ID'
      })
    }

    // Get or create Stripe customer
    let customer
    try {
      customer = await getOrCreateStripeCustomer(userId)
      console.log('[stripe-create-subscription] Got customer')
      if (!customer?.id) {
        throw new Error('Customer created but has no ID')
      }
    } catch (error) {
      console.error('[stripe-create-subscription] Failed to get/create customer')
      return jsonResponse(500, {
        error: 'Failed to create or retrieve Stripe customer',
        code: 'CUSTOMER_CREATE_ERROR'
      })
    }

    // Create subscription with payment_behavior: 'default_incomplete'
    console.log('[stripe-create-subscription] Creating subscription')
    let subscription
    try {
      subscription = await stripe.subscriptions.create(
        {
          customer: customer.id,
          items: [{ price: priceId }],
          payment_behavior: 'default_incomplete',
          expand: ['latest_invoice', 'latest_invoice.payment_intent']
        },
        {
          idempotencyKey: idempotencyKey
        }
      )
      console.log('[stripe-create-subscription] Created subscription')
    } catch (error) {
      console.error('[stripe-create-subscription] Failed to create subscription')
      const errorCode = error.code === 'resource_missing' ? 'PRICE_NOT_FOUND' : 'SUBSCRIPTION_CREATE_ERROR'
      const errorDetail = error.code === 'resource_missing'
        ? 'The specified price ID does not exist in your Stripe account'
        : 'Failed to create subscription'
      return jsonResponse(400, {
        error: 'Failed to create subscription',
        code: errorCode,
        details: errorDetail
      })
    }
    console.log('[stripe-create-subscription] Subscription status:', subscription.status)

    // Retrieve fresh subscription object to ensure all fields are populated
    subscription = await stripe.subscriptions.retrieve(subscription.id, {
      expand: ['latest_invoice', 'latest_invoice.payment_intent']
    })
    console.log('[stripe-create-subscription] Retrieved subscription')

    // Store subscription info in database
    console.log('[stripe-create-subscription] Storing subscription in database with status=active')
    try {
      // Check if subscription record exists
      const { data: existingData, error: selectError } = await supabase
        .from('subscriptions')
        .select('id, status')
        .eq('user_id', userId)
        .single()

      if (selectError && selectError.code !== 'PGRST116') {
        console.error('[stripe-create-subscription] Database lookup error')
        throw selectError
      }

      // Only update the Stripe IDs - status will be updated by webhook after payment
      const subscriptionUpdate = {
        stripe_customer_id: customer.id,
        stripe_subscription_id: subscription.id,
        payment_provider: 'stripe',
        updated_at: new Date().toISOString()
      }

      if (existingData?.id) {
        // Update existing record with Stripe IDs
        console.log('[stripe-create-subscription] Updating existing subscription record')
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update(subscriptionUpdate)
          .eq('user_id', userId)

        if (updateError) {
          console.error('[stripe-create-subscription] Database update error')
          throw updateError
        }
      } else {
        // Insert new record with 'active' status
        console.log('[stripe-create-subscription] Creating new subscription record')

        // Safely convert Stripe unix timestamps to ISO strings
        const periodStart = subscription.current_period_start
          ? new Date(subscription.current_period_start * 1000).toISOString()
          : new Date().toISOString()
        const periodEnd = subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000).toISOString()
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

        const { error: insertError } = await supabase
          .from('subscriptions')
          .insert([{
            user_id: userId,
            tier: 'premium',
            status: 'active',
            stripe_customer_id: customer.id,
            stripe_subscription_id: subscription.id,
            current_period_start: periodStart,
            current_period_end: periodEnd,
            payment_provider: 'stripe',
            updated_at: new Date().toISOString()
          }])

        if (insertError) {
          console.error('[stripe-create-subscription] Database insert error')
          throw insertError
        }
      }
    } catch (dbError) {
      console.error('[stripe-create-subscription] Database operation error')
      throw new Error('Failed to store subscription')
    }

    // Create a PaymentIntent for the subscription
    console.log('[stripe-create-subscription] Creating PaymentIntent')

    let clientSecret = null
    try {
      // Get the price details to know the amount
      const price = await stripe.prices.retrieve(priceId)
      console.log('[stripe-create-subscription] Price retrieved')

      // Create a PaymentIntent for the subscription
      const paymentIntent = await stripe.paymentIntents.create({
        amount: price.unit_amount,
        currency: price.currency,
        customer: customer.id,
        description: 'Subscription payment',
        metadata: {
          userId: String(userId),
          subscriptionId: subscription.id,
          priceId: priceId
        }
      })

      clientSecret = paymentIntent.client_secret
      console.log('[stripe-create-subscription] Created PaymentIntent')
    } catch (error) {
      console.error('[stripe-create-subscription] Failed to create PaymentIntent')
      throw new Error('Failed to create payment intent')
    }

    console.log('[stripe-create-subscription] Successfully returning client secret')
    return jsonResponse(200, {
      clientSecret,
      subscriptionId: subscription.id,
      customerId: customer.id
    })
  } catch (error) {
    // Catch any errors that slip through our specific error handlers
    console.error('[stripe-create-subscription] UNHANDLED ERROR:', error?.message || error)

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

    // Always return proper JSON response
    return jsonResponse(statusCode, {
      error: error?.message || 'An unexpected error occurred while creating subscription',
      code: errorCode,
      timestamp: new Date().toISOString()
    })
  }
}

/**
 * Get existing or create new Stripe customer
 * Stores customer ID in database for future reference
 */
async function getOrCreateStripeCustomer(userId) {
  try {
    console.log('[getOrCreateStripeCustomer] Looking up existing customer')

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
          console.warn('[getOrCreateStripeCustomer] Database query warning')
        }
      } else {
        subscription = result.data
      }
    } catch (dbError) {
      console.warn('[getOrCreateStripeCustomer] Database lookup failed')
    }

    // Return existing customer if found
    if (subscription?.stripe_customer_id) {
      try {
        console.log('[getOrCreateStripeCustomer] Retrieving existing customer')
        const customer = await stripe.customers.retrieve(subscription.stripe_customer_id)
        console.log('[getOrCreateStripeCustomer] Successfully retrieved customer')
        return customer
      } catch (retrieveError) {
        console.warn('[getOrCreateStripeCustomer] Could not retrieve existing customer, will create new one')
      }
    }

    // Create new customer
    console.log('[getOrCreateStripeCustomer] Creating new customer')
    let user = null

    try {
      const { data: userData, error: authError } = await supabase.auth.admin.getUserById(userId)
      if (authError) {
        console.warn('[getOrCreateStripeCustomer] Could not fetch user details')
      } else if (userData) {
        user = userData
      }
    } catch (authError) {
      console.warn('[getOrCreateStripeCustomer] Error fetching user from auth')
    }

    // Create customer with metadata
    const customerData = {
      metadata: {
        userId: String(userId),
        createdAt: new Date().toISOString()
      }
    }

    // Add email if available (but don't log it)
    const email = user?.user_metadata?.email || user?.email
    if (email) {
      customerData.email = email
    }

    const customer = await stripe.customers.create(customerData)
    console.log('[getOrCreateStripeCustomer] Created new customer')
    return customer

  } catch (error) {
    console.error('[getOrCreateStripeCustomer] FAILED to create customer')
    throw new Error('Failed to create Stripe customer')
  }
}
