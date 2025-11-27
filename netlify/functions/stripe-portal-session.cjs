/**
 * Netlify Function: Stripe Billing Portal Session
 * Endpoint: POST /.netlify/functions/stripe-portal-session
 *
 * Creates a Stripe billing portal session for customer self-service
 * Allows customers to manage subscriptions, update payment methods, view invoices
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { stripeCustomerId } = JSON.parse(event.body)

    // Validate input
    if (!stripeCustomerId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing stripeCustomerId' })
      }
    }

    // Create billing portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${process.env.VITE_APP_URL}/app/subscription`
    })

    return {
      statusCode: 200,
      body: JSON.stringify({
        url: portalSession.url
      })
    }
  } catch (error) {
    console.error('Error creating billing portal session:', error)
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: error.message || 'Failed to create billing portal session'
      })
    }
  }
}
