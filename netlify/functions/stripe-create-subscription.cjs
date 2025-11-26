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

    // Store basic subscription info in database ONLY if we're updating from a free tier
    // The actual 'active' status will be set by the webhook after payment is confirmed
    console.log('[stripe-create-subscription] Storing subscription mapping in database (not active yet)')
    try {
      // Check if subscription record exists
      const { data: existingData, error: selectError } = await supabase
        .from('subscriptions')
        .select('id, status')
        .eq('user_id', userId)
        .single()

      if (selectError && selectError.code !== 'PGRST116') {
        console.error('[stripe-create-subscription] Database lookup error:', selectError)
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
        // Update existing record with Stripe IDs (status stays as-is until webhook confirms)
        console.log('[stripe-create-subscription] Updating existing subscription record with Stripe IDs')
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update(subscriptionUpdate)
          .eq('user_id', userId)

        if (updateError) {
          console.error('[stripe-create-subscription] Database update error:', updateError)
          throw updateError
        }
      } else {
        // Insert new record with 'pending' status
        // Only webhook will change to 'active' after payment_succeeded event from Stripe
        // This prevents race conditions where user sees premium before payment is confirmed
        console.log('[stripe-create-subscription] Creating new subscription record with status: pending')

        // Safely convert Stripe unix timestamps to ISO strings
        // Stripe returns seconds since epoch, we need to multiply by 1000 for milliseconds
        const periodStart = subscription.current_period_start
          ? new Date(subscription.current_period_start * 1000).toISOString()
          : new Date().toISOString()
        const periodEnd = subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000).toISOString()
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

        console.log('[stripe-create-subscription] Period dates - start:', periodStart, 'end:', periodEnd)

        const { error: insertError } = await supabase
          .from('subscriptions')
          .insert([{
            user_id: userId,
            tier: 'premium',
            status: 'pending',
            stripe_customer_id: customer.id,
            stripe_subscription_id: subscription.id,
            current_period_start: periodStart,
            current_period_end: periodEnd,
            payment_provider: 'stripe',
            updated_at: new Date().toISOString()
          }])

        if (insertError) {
          console.error('[stripe-create-subscription] Database insert error:', insertError)
          throw insertError
        }
      }
    } catch (dbError) {
      console.error('[stripe-create-subscription] Database operation error:', dbError)
      throw new Error(`Failed to store subscription: ${dbError.message}`)
    }

    // Get invoice for payment - use the subscription's first invoice
    console.log('[stripe-create-subscription] Retrieving invoice for payment')

    let clientSecret = null
    try {
      let invoice = null

      // List invoices for this subscription and get the most recent one (should be just created)
      const invoices = await stripe.invoices.list({
        subscription: subscription.id,
        limit: 1
      })

      if (invoices.data?.length > 0) {
        invoice = invoices.data[0]
        console.log('[stripe-create-subscription] Found subscription invoice:', invoice.id, 'amount:', invoice.amount_due, 'status:', invoice.status)

        // If invoice is not yet finalized, finalize it
        if (invoice.status === 'draft') {
          invoice = await stripe.invoices.finalizeInvoice(invoice.id)
          console.log('[stripe-create-subscription] Finalized invoice:', invoice.id)
        }

        // Get the payment intent from the invoice
        if (invoice.payment_intent) {
          const paymentIntent = await stripe.paymentIntents.retrieve(invoice.payment_intent)
          clientSecret = paymentIntent.client_secret
          console.log('[stripe-create-subscription] Using invoice PaymentIntent:', paymentIntent.id)
        }
      }

      // If no clientSecret from invoice, something went wrong
      if (!clientSecret) {
        throw new Error('Unable to obtain client_secret from subscription invoice')
      }
    } catch (error) {
      console.error('[stripe-create-subscription] Failed to retrieve invoice PaymentIntent:', error.message)
      throw new Error(`Failed to get payment intent from invoice: ${error.message}`)
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
