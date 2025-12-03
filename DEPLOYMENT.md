# 🚀 Launchpilot MVP Deployment Guide

Get your MVP to market in under 2 hours.

## 📋 Prerequisites

Before deploying, ensure you have accounts for:

- ✅ [Netlify](https://netlify.com) - Free tier works
- ✅ [Supabase](https://supabase.com) - Free tier works
- ✅ [xAI Console](https://console.x.ai/) - For Grok API
- ✅ [Stripe](https://stripe.com) - Start with test mode
- ✅ [GitHub](https://github.com) - Repository hosting

---

## 🎯 Quick Deployment (30 minutes)

### Step 1: Supabase Setup (10 min)

1. **Create Supabase Project**
   ```
   1. Go to https://supabase.com/dashboard
   2. Click "New Project"
   3. Name: "launchpilot-mvp"
   4. Database Password: [generate strong password]
   5. Region: Choose closest to your users
   6. Click "Create new project" (takes ~2 min)
   ```

2. **Get Supabase Credentials**
   ```
   1. Go to Settings → API
   2. Copy "Project URL" → This is VITE_SUPABASE_URL
   3. Copy "anon public" key → This is VITE_SUPABASE_ANON_KEY
   4. Copy "service_role secret" → This is SUPABASE_SERVICE_ROLE_KEY
   ```

3. **Set Up Database**
   ```bash
   # Option A: Use SQL Editor in Supabase Dashboard
   1. Go to SQL Editor in Supabase dashboard
   2. Find database schema files in: docs/database/
   3. Run each migration file in order

   # Option B: Use Supabase CLI (if installed)
   supabase db push
   ```

4. **Configure Authentication**
   ```
   1. Go to Authentication → Providers
   2. Enable "Email" provider
   3. Configure email templates (optional)
   4. Set Site URL to your domain (add later)
   ```

### Step 2: xAI Grok Setup (5 min)

1. **Get Grok API Key**
   ```
   1. Visit https://console.x.ai/
   2. Sign up / Sign in
   3. Go to API Keys section
   4. Click "Create new API key"
   5. Copy the key (starts with "xai-")
   ```

### Step 3: Stripe Setup (10 min)

1. **Create Stripe Account**
   ```
   1. Go to https://dashboard.stripe.com/register
   2. Complete business profile
   3. Start in TEST MODE (toggle in sidebar)
   ```

2. **Get API Keys**
   ```
   1. Go to Developers → API keys
   2. Copy "Publishable key" → VITE_STRIPE_PUBLIC_KEY
   3. Copy "Secret key" → STRIPE_SECRET_KEY
   ```

3. **Create Products & Prices**
   ```
   1. Go to Products → Add product
   2. Create three products:

   Product 1: Free Tier
   - Name: "Launchpilot Free"
   - Price: $0/month
   - Copy Price ID → Save for later

   Product 2: Professional
   - Name: "Launchpilot Professional"
   - Price: $29/month (or your pricing)
   - Recurring: Monthly
   - Copy Price ID → VITE_STRIPE_PRICE_ID

   Product 3: Business
   - Name: "Launchpilot Business"
   - Price: $99/month (or your pricing)
   - Recurring: Monthly
   - Copy Price ID → Save for later
   ```

4. **Configure Webhook (Do after Netlify deployment)**
   ```
   We'll return to this after deploying to Netlify
   ```

### Step 4: Deploy to Netlify (5 min)

1. **Connect GitHub Repository**
   ```
   1. Go to https://app.netlify.com/
   2. Click "Add new site" → "Import an existing project"
   3. Connect to GitHub
   4. Select your marketing-todo repository
   ```

2. **Configure Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   Functions directory: netlify/functions
   ```

3. **Add Environment Variables**
   ```
   Go to Site settings → Environment variables → Add variables:

   # Supabase
   VITE_SUPABASE_URL = https://[your-project].supabase.co
   VITE_SUPABASE_ANON_KEY = [your-anon-key]
   SUPABASE_SERVICE_ROLE_KEY = [your-service-role-key]

   # Grok AI
   GROK_API_KEY = xai-[your-key]

   # Stripe
   VITE_STRIPE_PUBLIC_KEY = pk_test_[your-key]
   STRIPE_SECRET_KEY = sk_test_[your-key]
   VITE_STRIPE_PRICE_ID = price_[your-price-id]

   # App Config
   VITE_APP_URL = https://[your-site].netlify.app
   VITE_FUNCTIONS_URL = /.netlify/functions
   ```

4. **Deploy!**
   ```
   Click "Deploy site"
   Wait 2-3 minutes for build to complete
   ```

### Step 5: Complete Stripe Webhook (5 min)

1. **Get Netlify Functions URL**
   ```
   Your webhook URL will be:
   https://[your-site].netlify.app/.netlify/functions/stripe-webhook
   ```

2. **Create Stripe Webhook**
   ```
   1. Go to Stripe Dashboard → Developers → Webhooks
   2. Click "Add endpoint"
   3. Endpoint URL: https://[your-site].netlify.app/.netlify/functions/stripe-webhook
   4. Description: "Launchpilot subscription events"
   5. Events to send:
      - customer.subscription.created
      - customer.subscription.updated
      - customer.subscription.deleted
      - invoice.payment_succeeded
      - invoice.payment_failed
   6. Click "Add endpoint"
   7. Copy "Signing secret" → Add to Netlify env vars as STRIPE_WEBHOOK_SECRET
   ```

3. **Redeploy Netlify**
   ```
   Go to Netlify → Deploys → Trigger deploy → Deploy site
   ```

---

## ✅ Post-Deployment Checklist

### Immediate Testing (15 min)

- [ ] Visit your Netlify URL
- [ ] Sign up with a new email
- [ ] Check email verification works
- [ ] Create a test project
- [ ] Try generating AI content (uses Grok)
- [ ] Test subscription upgrade (use Stripe test cards)
- [ ] Verify payment flow completes
- [ ] Check Supabase tables populated correctly

### Stripe Test Cards

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155
```

### Production Readiness

- [ ] Update Supabase Site URL to production domain
- [ ] Switch Stripe to LIVE MODE
- [ ] Update Stripe keys to live keys (pk_live_, sk_live_)
- [ ] Update VITE_APP_URL to custom domain
- [ ] Configure custom domain in Netlify
- [ ] Update Stripe webhook to production URL
- [ ] Set up error monitoring (Sentry, LogRocket)
- [ ] Enable Netlify analytics
- [ ] Test full signup → payment → feature access flow
- [ ] Set up backups for Supabase

---

## 🔧 Common Issues & Solutions

### Build Fails on Netlify

**Problem:** "Module not found" or dependency errors

**Solution:**
```bash
# Ensure package.json is committed
git add package.json package-lock.json
git commit -m "Add dependency lockfile"
git push
```

### Supabase Connection Fails

**Problem:** "Invalid API key" or CORS errors

**Solution:**
1. Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
2. Check Supabase project is not paused
3. Verify Supabase Site URL includes your Netlify domain

### Grok AI Not Working

**Problem:** "Unauthorized" or 401 errors

**Solution:**
1. Verify GROK_API_KEY is correct (starts with "xai-")
2. Check xAI billing is active
3. Verify API key permissions

### Stripe Payments Fail

**Problem:** "Invalid API Key" or webhook not triggering

**Solution:**
1. Ensure using correct mode (test vs live)
2. Verify STRIPE_WEBHOOK_SECRET is set
3. Check webhook endpoint URL is correct
4. Test webhook with Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:9999/.netlify/functions/stripe-webhook
   ```

### Database Tables Not Created

**Problem:** "Table does not exist" errors

**Solution:**
Run the SQL migrations in Supabase SQL Editor:
```bash
# Find migration files in:
docs/database/migrations/
```

---

## 🎨 Custom Domain Setup

### Configure Domain in Netlify

1. **Add Custom Domain**
   ```
   Site settings → Domain management → Add custom domain
   Enter: yourdomain.com
   ```

2. **Update DNS**
   ```
   Add DNS records at your registrar:
   Type: A
   Name: @
   Value: 75.2.60.5

   Type: CNAME
   Name: www
   Value: [your-site].netlify.app
   ```

3. **Enable HTTPS**
   ```
   Netlify automatically provisions SSL certificate
   Wait 5-10 minutes for DNS propagation
   ```

4. **Update Environment Variables**
   ```
   Update in Netlify:
   VITE_APP_URL = https://yourdomain.com

   Update in Supabase:
   Authentication → URL Configuration → Site URL
   ```

5. **Update Stripe Webhook**
   ```
   Update webhook endpoint URL to:
   https://yourdomain.com/.netlify/functions/stripe-webhook
   ```

---

## 📊 Monitoring & Analytics

### Essential Monitoring

1. **Netlify Analytics**
   - Enable in Site settings → Analytics
   - Track page views, unique visitors
   - Monitor function invocations

2. **Supabase Monitoring**
   - Check Database → Usage
   - Monitor API requests
   - Watch for rate limits

3. **Stripe Dashboard**
   - Monitor successful payments
   - Track failed charges
   - Watch for disputes

### Recommended Tools (Optional)

- **Sentry** - Error tracking (5K errors/month free)
- **LogRocket** - Session replay (1K sessions/month free)
- **PostHog** - Product analytics (1M events/month free)

---

## 🚀 Going Live Checklist

### Pre-Launch

- [ ] All features tested in production
- [ ] Payment flow works end-to-end
- [ ] Email notifications working
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Switched Stripe to live mode
- [ ] Monitoring tools set up
- [ ] Privacy policy page added
- [ ] Terms of service page added
- [ ] Support email configured

### Launch Day

- [ ] Announce on social media
- [ ] Send to email list (if applicable)
- [ ] Post on Product Hunt / Hacker News
- [ ] Monitor error logs closely
- [ ] Watch Stripe dashboard for payments
- [ ] Be ready to fix issues quickly

### Post-Launch (Week 1)

- [ ] Gather user feedback
- [ ] Fix critical bugs
- [ ] Monitor performance metrics
- [ ] Track conversion rates
- [ ] Optimize based on analytics
- [ ] Plan next features based on user requests

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Netlify Functions Guide](https://docs.netlify.com/functions/overview/)
- [Stripe Integration Docs](https://stripe.com/docs/payments)
- [Grok API Reference](https://docs.x.ai/api)
- [Vue 3 Guide](https://vuejs.org/guide/)

---

## 🆘 Need Help?

- Check [REBUILD_FROM_SCRATCH.md](REBUILD_FROM_SCRATCH.md) for architecture details
- Review [docs/](docs/) folder for technical documentation
- Check GitHub Issues for known problems
- Contact support: [your-email]

---

## 🎉 Congratulations!

Your MVP is now live! Start getting users and iterate based on feedback.

**Remember:** An MVP doesn't need to be perfect. Ship fast, learn faster.
