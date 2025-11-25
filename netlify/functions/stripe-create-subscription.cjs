/**
 * Netlify Function: Create Stripe Subscription
 * Endpoint: POST /.netlify/functions/stripe-create-subscription
 *
 * Creates a Stripe customer and subscription, stores in database
 * Returns client secret for frontend payment confirmation
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    console.log('[stripe-create-subscription] Request body:', event.body)
    const { userId, priceId } = JSON.parse(event.body)
    console.log('[stripe-create-subscription] Parsed - userId:', userId, 'priceId:', priceId)

    // Validate input
    if (!userId || !priceId) {
      console.error('[stripe-create-subscription] Validation failed - userId:', userId, 'priceId:', priceId)
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing userId or priceId', userId, priceId })
      }
    }

    // Get or create Stripe customer
    const customer = await getOrCreateStripeCustomer(userId)
    console.log('[stripe-create-subscription] Got customer:', customer.id)

    // Create subscription with payment_behavior: 'default_incomplete'
    // This creates a subscription without payment, requiring client confirmation
    console.log('[stripe-create-subscription] Creating subscription with:', { customerId: customer.id, priceId })
    let subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice', 'latest_invoice.payment_intent']
    })
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
    return {
      statusCode: 200,
      body: JSON.stringify({
        clientSecret,
        subscriptionId: subscription.id,
        customerId: customer.id
      })
    }
  } catch (error) {
    console.error('[stripe-create-subscription] ERROR:', error)
    console.error('[stripe-create-subscription] Stack:', error.stack)

    // Ensure we always return proper JSON error response
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: error.message || 'Failed to create subscription',
        code: error.code || 'SUBSCRIPTION_ERROR',
        details: error.raw?.message || null
      })
    }
  }
}

/**
 * Get existing or create new Stripe customer
 * Stores customer ID in database for future reference
 */
async function getOrCreateStripeCustomer(userId) {
  try {
    // Check if customer ID exists in database
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single()

    // Return existing customer
    if (subscription?.stripe_customer_id) {
      return await stripe.customers.retrieve(subscription.stripe_customer_id)
    }

    // Create new customer
    const { data: user } = await supabase.auth.admin.getUserById(userId)

    const customer = await stripe.customers.create({
      email: user.user_metadata?.email || user.email,
      metadata: {
        userId
      }
    })

    return customer
  } catch (error) {
    // If customer not found, create new one
    // Also handle Supabase auth errors (e.g., invalid UUID format)
    if (error.code === 'resource_missing' || error.message?.includes('Expected parameter to be UUID')) {
      console.log('[stripe-create-subscription] Creating new customer without email (auth lookup failed):', error.message)
      const customer = await stripe.customers.create({
        metadata: {
          userId
        }
      })
      return customer
    }
    throw error
  }
}
