/**
 * Netlify Function: Stripe Billing Portal Session
 * Endpoint: POST /.netlify/functions/stripe-portal-session
 *
 * Creates a Stripe billing portal session for customer self-service
 * Allows customers to manage subscriptions, update payment methods, view invoices
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { createClient } = require('@supabase/supabase-js')
const { verifyAuth, getCorsOrigin } = require('./utils/auth.cjs')

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

exports.handler = async (event) => {
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
    return jsonResponse(405, { error: 'Method not allowed' })
  }

  try {
    // Verify authentication
    let verifiedUserId
    try {
      const auth = await verifyAuth(event)
      verifiedUserId = auth.userId
      console.log('[stripe-portal-session] Request authenticated')
    } catch (authError) {
      console.error('[stripe-portal-session] Auth failed:', authError.message)
      return jsonResponse(401, {
        error: 'Unauthorized',
        details: authError.message
      })
    }

    const { stripeCustomerId } = JSON.parse(event.body)

    // Validate input
    if (!stripeCustomerId) {
      return jsonResponse(400, { error: 'Missing stripeCustomerId' })
    }

    // Verify customer ownership - ensure the authenticated user owns this customer
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_customer_id', stripeCustomerId)
      .single()

    if (subError || !subscription) {
      console.error('[stripe-portal-session] Customer not found in database')
      return jsonResponse(404, { error: 'Customer not found' })
    }

    if (subscription.user_id !== verifiedUserId) {
      console.error('[stripe-portal-session] User does not own this customer')
      return jsonResponse(403, { error: 'Forbidden' })
    }

    // Create billing portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${process.env.VITE_APP_URL}/app/subscription`
    })

    return jsonResponse(200, {
      url: portalSession.url
    })
  } catch (error) {
    console.error('[stripe-portal-session] Error creating billing portal session')
    return jsonResponse(400, {
      error: 'Failed to create billing portal session'
    })
  }
}
