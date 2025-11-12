# Analytics Setup Wizard - Complete Plan

## Overview
Transform the basic "Setup Analytics" task into a comprehensive wizard that helps non-technical founders implement analytics in 15 minutes or less.

**Target User:** Founders launching products who may have ZERO analytics knowledge

**Core Value Proposition:** Go from "I don't know what analytics is" to "Analytics is live on my site" in one session.

---

## User Flow (5-Step Wizard)

### Step 1: What is Analytics? (Education)
**Goal:** Help complete beginners understand what analytics is and why they need it

**Content:**
- Hero section with simple explanation:
  - "Analytics shows you WHO visits your site, WHAT they do, and WHERE they drop off"
- 3 visual cards explaining the value:
  1. **👥 Who Are Your Users?**
     - See demographics, location, devices
     - Example: "80% of users are on mobile - maybe improve mobile UX?"

  2. **📊 What Do They Do?**
     - Track pageviews, signups, purchases
     - Example: "200 visitors → 50 signups → 10 paid = 5% conversion"

  3. **🔍 Where Do They Drop Off?**
     - Find where users leave your funnel
     - Example: "Users abandon cart at checkout - maybe simplify the form?"

- CTA: "Get Started - Set Up Analytics" button

**UI Elements:**
- Clean, visual cards with icons
- Simple language (no jargon)
- Progress indicator (Step 1 of 5)

---

### Step 2: Choose Your Platform
**Goal:** Help users pick between Google Analytics 4 and Mixpanel

**Content:**

**Platform Comparison (Side-by-side cards):**

| Feature | Google Analytics 4 | Mixpanel |
|---------|-------------------|----------|
| **Best For** | Websites, blogs, content sites, e-commerce | SaaS, web apps, mobile apps |
| **Complexity** | Beginner-friendly | Intermediate |
| **Cost** | Free (up to 10M events/month) | Free (up to 20M events/month) |
| **Setup Time** | 10 minutes | 15 minutes |
| **What It Tracks** | Pageviews, traffic sources, user behavior | User journeys, feature usage, cohorts |
| **Best Feature** | SEO insights, traffic sources | User-level tracking, retention analysis |

**Recommendation Box:**
- "Not sure? Start with Google Analytics 4 - it's the easiest and works for 90% of use cases."

**Form Input:**
- Radio button selection between GA4 and Mixpanel
- "What type of product are you building?" dropdown:
  - SaaS / Web App
  - E-commerce Store
  - Blog / Content Site
  - Mobile App
  - Landing Page Only
  - Community / Forum
  - Marketplace / Platform

---

### Step 3: Your Custom Tracking Plan (AI-Generated)
**Goal:** AI generates a customized tracking plan based on product type and platform

**User Input (Simple Form):**
1. Product Name: ________
2. Product Description (1 sentence): ________
3. Main Goal (select one):
   - Get more signups
   - Increase sales
   - Grow traffic
   - Improve engagement
   - Other: ________

**AI Generation:**
When user clicks "Generate My Tracking Plan", AI creates:

**Output Format:**
```
📋 YOUR CUSTOM ANALYTICS TRACKING PLAN

Platform: [Google Analytics 4 / Mixpanel]
Product Type: [SaaS / E-commerce / etc.]

=== ESSENTIAL EVENTS TO TRACK ===

1. ✅ Page Views (Auto-tracked)
   - Why: See which pages get the most traffic
   - Priority: MUST HAVE

2. ✅ Sign Up Completed
   - Why: Track your #1 conversion goal - new users
   - Priority: MUST HAVE
   - When to trigger: When user completes signup form

3. ✅ [Product-Specific Event - e.g., "Product Added to Cart"]
   - Why: [AI explains why this matters for their business]
   - Priority: MUST HAVE
   - When to trigger: [AI explains when]

4. ✅ [2-3 more product-specific events]

=== RECOMMENDED METRICS DASHBOARD ===

Track these weekly:
- Total visitors
- Signup conversion rate (signups / visitors)
- Top traffic sources (where users come from)
- [Product-specific metric, e.g., "Average order value"]

=== 30-DAY GOALS ===

Based on your product, here's what to aim for:
- [ ] Get 500+ visitors
- [ ] Achieve 10% signup rate
- [ ] [Product-specific goal]
```

**UI Elements:**
- Loading spinner while AI generates
- Editable text output (user can modify)
- "Looks good, continue" button
- "Regenerate" button if they want a different plan

---

### Step 4: Implementation Guide
**Goal:** Provide copy-paste code snippets and step-by-step instructions

**Content Structure:**

**For Google Analytics 4:**

```
=== GOOGLE ANALYTICS 4 SETUP ===

⏱️ Time Required: 10 minutes

STEP 1: Create Your GA4 Account
1. Go to: https://analytics.google.com
2. Click "Start measuring"
3. Enter your account name (e.g., "My Product Name")
4. Click "Next"
5. Enter property name: "My Website"
6. Select your timezone and currency
7. Click "Create"

STEP 2: Get Your Tracking Code
1. Click "Web" under "Choose a platform"
2. Enter your website URL
3. Click "Create stream"
4. Copy the "Measurement ID" (looks like G-XXXXXXXXXX)

STEP 3: Install Tracking Code
Copy this code and paste it in the <head> section of EVERY page on your website:

<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>

📝 REPLACE "G-XXXXXXXXXX" with your actual Measurement ID!

WHERE TO PASTE:
- WordPress: Use "Insert Headers and Footers" plugin
- Webflow: Site Settings → Custom Code → Head Code
- HTML website: Inside <head> tag of index.html
- React/Vue: Inside public/index.html <head> tag
- Next.js: Inside pages/_app.js or app/layout.js

STEP 4: Track Custom Events (e.g., Signups)
Add this code where users complete signup:

<script>
gtag('event', 'sign_up', {
  'method': 'Email'
});
</script>

Example for button click:
<button onclick="gtag('event', 'sign_up', {'method': 'Email'});">
  Sign Up
</button>

STEP 5: Verify It's Working
1. Open your website in a new tab
2. Go back to Google Analytics
3. Click "Reports" → "Realtime"
4. You should see "1 user active now" (that's you!)
5. ✅ Analytics is live!

TROUBLESHOOTING:
- Not seeing data? Wait 24-48 hours for first report
- Still nothing? Check if code is in <head> section
- Use Chrome extension "Google Analytics Debugger" to test
```

**For Mixpanel:**

```
=== MIXPANEL SETUP ===

⏱️ Time Required: 15 minutes

STEP 1: Create Mixpanel Account
1. Go to: https://mixpanel.com/register
2. Sign up with email
3. Enter project name (e.g., "My Product")
4. Select "Web" as platform
5. Click "Create Project"

STEP 2: Get Your Project Token
1. Click "Settings" (gear icon)
2. Find "Project Token" (looks like: abc123def456)
3. Copy this token

STEP 3: Install Mixpanel Script
Copy this code and paste it in the <head> section of your website:

<!-- Mixpanel -->
<script type="text/javascript">
(function(c,a){if(!a.__SV){var b=window;try{var d,m,j,k=b.location,f=k.hash;d=function(a,b){return(m=a.match(RegExp(b+"=([^&]*)")))?m[1]:null};f&&d(f,"state")&&(j=JSON.parse(decodeURIComponent(d(f,"state"))),"mpeditor"===j.action&&(b.sessionStorage.setItem("_mpcehash",f),history.replaceState(j.desiredHash||"",c.title,k.pathname+k.search)))}catch(n){}var l,h;window.mixpanel=a;a._i=[];a.init=function(b,d,g){function c(b,i){var a=i.split(".");2==a.length&&(b=b[a[0]],i=a[1]);b[i]=function(){b.push([i].concat(Array.prototype.slice.call(arguments,0)))}}var e=a;"undefined"!==typeof g?e=a[g]=[]:g="mixpanel";e.people=e.people||[];e.toString=function(b){var a="mixpanel";"mixpanel"!==g&&(a+="."+g);b||(a+=" (stub)");return a};e.people.toString=function(){return e.toString(1)+".people (stub)"};l="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");
for(h=0;h<l.length;h++)c(e,l[h]);var f="set set_once union unset remove delete".split(" ");e.get_group=function(){function a(c){b[c]=function(){call2_args=arguments;call2=[c].concat(Array.prototype.slice.call(call2_args,0));e.push([d,call2])}}for(var b={},d=["get_group"].concat(Array.prototype.slice.call(arguments,0)),c=0;c<f.length;c++)a(f[c]);return b};a._i.push([b,d,g])};a.__SV=1.2;b=c.createElement("script");b.type="text/javascript";b.async=!0;b.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===c.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";d=c.getElementsByTagName("script")[0];d.parentNode.insertBefore(b,d)}})(document,window.mixpanel||[]);

mixpanel.init("YOUR_PROJECT_TOKEN");
</script>

📝 REPLACE "YOUR_PROJECT_TOKEN" with your actual token!

STEP 4: Track Page Views
Add this to every page load:

<script>
  mixpanel.track('Page Viewed', {
    'page': window.location.pathname
  });
</script>

STEP 5: Track Custom Events (e.g., Signups)
Add this code when user signs up:

<script>
mixpanel.track('Sign Up Completed', {
  'method': 'Email',
  'timestamp': new Date().toISOString()
});
</script>

STEP 6: Identify Users
After signup, identify the user:

<script>
mixpanel.identify('user_email@example.com');
mixpanel.people.set({
  '$email': 'user_email@example.com',
  '$name': 'User Name',
  'Sign up date': new Date().toISOString()
});
</script>

STEP 7: Verify It's Working
1. Open your website
2. Go to Mixpanel dashboard
3. Click "Events" → "Live View"
4. You should see events coming in real-time
5. ✅ Analytics is live!
```

**UI Elements:**
- Tabbed interface (if user selected platform, show only that platform's guide)
- Copy buttons for each code snippet
- Expandable sections for each step
- Video tutorial link (optional - could add later)
- "Mark as complete" checkboxes

---

### Step 5: Verification Checklist
**Goal:** Ensure analytics is working correctly

**Content:**

```
🎉 FINAL STEP: VERIFY ANALYTICS IS WORKING

Complete this checklist to confirm everything is set up correctly:

□ Analytics code is installed on your website
  ↳ Check: View source code of your site and search for "gtag" (GA4) or "mixpanel" (Mixpanel)

□ You can see yourself in real-time reports
  ↳ GA4: Go to Reports → Realtime → Should show "1 user active"
  ↳ Mixpanel: Go to Events → Live View → Should show your events

□ Custom events are firing correctly
  ↳ Test your signup/conversion tracking by completing the action
  ↳ Verify the event appears in your dashboard

□ Analytics is on all important pages
  ↳ Check: Homepage, signup page, pricing, dashboard (if applicable)

□ Bookmark your analytics dashboard
  ↳ GA4: https://analytics.google.com
  ↳ Mixpanel: https://mixpanel.com

□ Set up weekly check-in reminder
  ↳ Add calendar reminder: "Check analytics every Monday at 9am"

✅ ALL DONE! Your analytics is live.

NEXT STEPS:
- Wait 48 hours for data to accumulate
- Check your dashboard weekly
- Look for trends: traffic spikes, conversion drops, user behavior patterns
- Use insights to improve your product

NEED HELP?
- GA4 Help Center: https://support.google.com/analytics
- Mixpanel Docs: https://docs.mixpanel.com
- [Link to support/community forum if you have one]
```

**UI Elements:**
- Interactive checklist (check off items)
- "Export Setup Guide" button (download PDF with all steps)
- "Mark Task Complete" button
- "Share with Team" button (copy link or email guide)

---

## Technical Implementation Plan

### File Structure
```
src/
  components/
    Analytics/
      AnalyticsSetupWizard.vue          # Main wizard component
      Steps/
        Step1Education.vue              # What is Analytics?
        Step2Platform.vue               # Choose platform
        Step3TrackingPlan.vue           # AI-generated plan
        Step4Implementation.vue         # Code snippets
        Step5Verification.vue           # Checklist
  stores/
    analyticsSetupStore.js              # State management
  configs/
    analyticsSetup.config.js            # Updated config
```

### Component Architecture

**AnalyticsSetupWizard.vue**
- Parent component managing wizard state
- Progress indicator (1 of 5, 2 of 5, etc.)
- Navigation (Back, Next, Skip buttons)
- Stores user selections in Pinia store

**State Management (analyticsSetupStore.js)**
```javascript
{
  currentStep: 1,
  selectedPlatform: null,  // 'ga4' or 'mixpanel'
  productType: null,       // 'saas', 'ecommerce', etc.
  productName: '',
  productDescription: '',
  mainGoal: '',
  aiTrackingPlan: '',      // AI-generated plan
  checklistItems: []       // Step 5 checklist completion
}
```

### AI Prompt Template

```javascript
ai: {
  template: `You are an analytics expert helping a founder set up tracking for their product.

Platform: {platform}
Product Type: {productType}
Product Name: {productName}
Product Description: {productDescription}
Main Goal: {mainGoal}

Generate a customized analytics tracking plan with:

1. ESSENTIAL EVENTS TO TRACK (3-5 events)
   For each event:
   - Event name (clear, specific)
   - Why it matters (business value)
   - Priority (MUST HAVE / NICE TO HAVE)
   - When to trigger (specific user action)

2. RECOMMENDED METRICS DASHBOARD
   - 4-6 key metrics to track weekly
   - Make them specific to their product type and goal

3. 30-DAY GOALS
   - 3-4 realistic, measurable goals for a new product
   - Based on industry benchmarks for their product type

Format with clear sections, checkboxes (✅), and emojis (📋 📊).
Keep language simple - they may be new to analytics.
Be specific to their product type - avoid generic advice.`,

  temperature: 0.7,
  maxTokens: 1500,

  contextProvider: () => {
    // Pull from project settings or onboarding data if available
  }
}
```

### Integration with Existing Task System

**Update src/configs/analyticsSetup.config.js:**
```javascript
export const analyticsSetupTask = {
  id: 'analytics-1',
  name: 'Setup Analytics',
  description: 'Set up analytics tracking in 15 minutes with step-by-step guidance and code snippets.',
  category: 'analytics',
  tier: 'free',

  // Flag to use custom wizard component
  customComponent: 'AnalyticsSetupWizard',
  type: 'wizard',

  what: 'Learn what analytics is, choose a platform (GA4 or Mixpanel), get a custom tracking plan, and implement tracking with copy-paste code snippets.',

  why: 'Analytics shows you WHO uses your product, WHAT they do, and WHERE they drop off. Without analytics, you\'re flying blind - guessing what works instead of knowing. Set it up once and get insights forever.',

  how: 'Follow our 5-step wizard: understand analytics basics, choose a platform, get an AI-generated tracking plan, copy-paste implementation code, and verify it works.',

  // Form fields not needed - wizard handles its own UI
  form: [],

  // AI config for Step 3
  ai: {
    // (template from above)
  },

  output: {
    enabled: true,
    exportFilename: 'analytics-setup-guide',
    displayFormat: 'text',
    editable: true,
    exportable: true,
    copyable: true
  }
}
```

---

## Visual Design Guidelines

### Step 1 (Education) - Visual Cards
```
┌─────────────────────────────────────────┐
│  📊 What is Analytics?                  │
│                                          │
│  Analytics shows you WHO visits your    │
│  site, WHAT they do, and WHERE they     │
│  drop off.                              │
└─────────────────────────────────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   👥         │  │   📊         │  │   🔍         │
│              │  │              │  │              │
│ Who Are Your │  │ What Do They │  │ Where Do     │
│ Users?       │  │ Do?          │  │ They Drop?   │
│              │  │              │  │              │
│ See demo-    │  │ Track page-  │  │ Find where   │
│ graphics...  │  │ views...     │  │ users leave  │
└──────────────┘  └──────────────┘  └──────────────┘
```

### Step 2 (Platform) - Comparison Cards
```
┌────────────────────┐  ┌────────────────────┐
│ Google Analytics 4 │  │     Mixpanel       │
│                    │  │                    │
│ ✅ Free            │  │ ✅ Free            │
│ ✅ Easy setup      │  │ ⚡ User tracking   │
│ ✅ SEO insights    │  │ ⚡ Feature usage   │
│                    │  │                    │
│ Best for:          │  │ Best for:          │
│ Websites, blogs    │  │ SaaS, web apps     │
│                    │  │                    │
│ [Select This] ○    │  │ [Select This] ○    │
└────────────────────┘  └────────────────────┘
```

### Step 4 (Implementation) - Code Blocks
```
╔═══════════════════════════════════════╗
║  STEP 1: Create Your GA4 Account     ║
╠═══════════════════════════════════════╣
║  1. Go to: analytics.google.com      ║
║  2. Click "Start measuring"           ║
║  3. Enter account name...             ║
╚═══════════════════════════════════════╝

╔═══════════════════════════════════════╗
║  STEP 3: Install Tracking Code       ║
╠═══════════════════════════════════════╣
║  <!-- Google Analytics 4 -->          ║
║  <script async src="...">             ║
║  ...                                   ║
║                          [Copy Code]  ║
╚═══════════════════════════════════════╝
```

---

## Success Metrics

How do we know this mini-app is successful?

**User Completion Rate:**
- Target: 70%+ of users who start the wizard complete all 5 steps

**Time to Complete:**
- Target: 10-15 minutes average

**User Feedback:**
- Target: 4.5+ star rating
- Question: "Was this helpful in setting up analytics?"

**Verification:**
- Target: 80%+ complete the verification checklist

---

## Future Enhancements (Post-V1)

**Phase 2:**
- Add video tutorials for each step
- Support more platforms (Plausible, Simple Analytics, Fathom)
- Pre-built dashboard templates (download JSON configs)
- Slack/email integration for weekly analytics reports

**Phase 3:**
- Chrome extension to verify analytics on any page
- Automated testing ("Analytics Health Check")
- Integration with project settings (auto-detect product type from onboarding)
- Team sharing (invite developers to implement)

**Phase 4:**
- Connect to actual analytics APIs (read-only)
- Show real-time metrics inside the app
- AI-powered insights: "Your conversion rate dropped 20% - here's why"

---

## Questions for You Before Implementation

1. **Styling:** Should this match the onboarding wizard style (blue/indigo theme)?
2. **Storage:** Save progress in localStorage or database?
3. **Navigation:** Allow users to skip steps or force sequential completion?
4. **Export:** PDF, Markdown, or both for the setup guide?
5. **Naming:** Keep "Setup Analytics" or rename to "Analytics Setup Wizard"?

---

## Ready to Build?

This plan is complete and ready for implementation. Give me the go-ahead and I'll:

1. Create `src/stores/analyticsSetupStore.js`
2. Create `src/components/Analytics/AnalyticsSetupWizard.vue` and 5 step components
3. Update `src/configs/analyticsSetup.config.js`
4. Wire it into the existing task system
5. Test the full flow

Estimated implementation time: 3-4 hours of focused coding.

What do you think? Any changes to the plan?
