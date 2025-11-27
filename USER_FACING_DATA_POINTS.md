# User-Facing Data Points Inventory - Launchpilot

Complete inventory of ALL user-facing data that users input or interact with in the Launchpilot application. This excludes internal code variables and system-generated data.

---

## SECTION 1: ONBOARDING WIZARD

### Step 1: Product Type
- **Product Type** (select) - Options: mobile_app, saas, ecommerce, game, digital_product, other
- **Product Name** (text input, required) - Name of user's product/app
- **Product Description** (text input, optional) - One-line description

### Step 2: Target Audience
- **Target Audience** (textarea, required) - Description of ideal customer/user profile

### Step 3: Goals
- **Main Goal** (select, required) - Options: first_100, 1k_mrr, 10k_mrr, audience, validate
- **Timeline** (select, required) - Options: 1_month, 3_months, 6_months, no_timeline

### Step 4: Details
- **Team Size** (select, required) - Options: solo, 2-5, 6-10, 10+
- **Current Stage** (select, required) - Options: idea, building, beta, launched
- **Marketing Budget** (number input, optional) - Dollar amount for marketing spend

### Step 5: Signup
- **Email** (text input, required) - User's email address
- **Password** (password input, required) - Account password
- **Terms of Service Agreement** (checkbox, required) - Consent to terms

---

## SECTION 2: PROJECT MANAGEMENT

### Project Form / Project Creation
- **Project Name** (text input, required) - Name of project/initiative
- **Description** (textarea, optional) - Detailed project description
- **Target Audience** (text input, required) - Who this project targets
- **Primary Goals** (textarea, required) - Main objectives for the project
- **Tech Stack** (text input, optional) - Technologies/tools being used
- **Timeline** (text input, optional) - Project timeline/deadline

---

## SECTION 3: TASK MINI-APPS & INPUTS

### Analytics Setup Mini-App

**Platform Selection**
- **Selected Platform** (select) - Options: ga4, mixpanel
- **Product Type** (select) - Type of product for analytics

**Tracking Plan Details**
- **Product Name** (text input, required)
- **Product Description** (textarea, required)
- **Main Goal** (select, required) - Goal for analytics tracking
- **Custom Goal** (text input, conditional) - If "other" is selected

**Verification Checklist**
- Code Installed (checkbox)
- Realtime Data Working (checkbox)
- Events Tracking Working (checkbox)
- All Pages Tracked (checkbox)
- Dashboard Bookmarked (checkbox)
- Reminder Set (checkbox)

---

### Channel Optimizer Mini-App

**Overview Tab**
- **Selected Channels** (checkbox group) - Multiple channels: Facebook, Instagram, Twitter, LinkedIn, TikTok, YouTube, Threads, Bluesky, Email, Website

**Playbooks Tab**
- **Per-Channel Optimization Checklist** (checkboxes) - Different action items per selected channel

---

### Community Posts Mini-App

**Overview Tab**
- **Selected Communities** (checkbox group) - Community platforms to engage with (Reddit, Hacker News, Discord, Slack communities, etc.)

**Guides Tab**
- Read-only educational content (no user input)

---

### Design Graphics Mini-App

**Design Setup Form**
- **Design Purpose** (select, required) - Options: social-banner, website-hero, infographic, ad-creative, product-screenshot, thumbnail
- **Design Style** (select, required) - Options: modern-minimal, bold-vibrant, professional, playful, luxury, tech
- **Key Message / CTA** (text input, required) - Main message or call-to-action text

**Tool Selection**
- **Selected Tool** (select) - Options: DALL-E, Midjourney, Canva, Adobe Express, etc.

**Design Checklist & Notes**
- **Design Checklist Items** (checkboxes) - Verification of design elements
- **Design Notes** (textarea, optional) - Additional notes about the design

---

### Write Blog Post Mini-App

**Setup Form**
- **Blog Topic / Title** (text input, required) - Blog post topic or working title
- **Target Audience** (text input, required) - Intended readers/persona
- **Keywords** (text input, optional) - Comma-separated SEO keywords
- **Writing Tone** (select, required) - Options: professional, conversational, educational, narrative, thought-leadership
- **Target Word Count** (select, required) - Options: short (<500), medium (500-1500), long (1500-3000), comprehensive (3000+)

**Writing Interface**
- **Section Content** (textarea) - Actual blog post body content by section
- **Section Status** (checkbox indicator) - Marks individual sections as complete

---

### Landing Page Creator Mini-App

**Multi-Step Wizard Form Inputs**
- **Page Headline** (text input)
- **Subheading** (text input)
- **Call-to-Action Button Text** (text input)
- **Button Link/URL** (URL input)
- **Hero Image** (file/image upload)
- **Value Proposition Points** (text input - multiple)
- **Form Fields for Lead Capture** (email, name, etc.)
- **Social Proof Elements** (testimonials, logos, etc.)
- **Pricing Information** (text/numbers if applicable)
- **Footer Information** (company info, links, etc.)

---

### Webinar Planning Mini-App

**Webinar Form**
- **Webinar Title** (text input, required)
- **Webinar Date** (date input, required)
- **Expected Attendees** (number input, optional)
- **Duration** (number input, minutes)
- **Target Audience** (text input, required) - Who should attend

---

### Paid Ads Launch Mini-App

**Budget & Goal Setup**
- **Monthly Budget** (number input, required) - Total advertising spend
- **Primary Campaign Goal** (select, required) - Options: traffic, conversions, leads, brand awareness
- **Target Product/Service** (text input, required) - What's being advertised
- **Target Audience Description** (textarea, required) - Detailed audience info
- **Current Monthly Revenue** (number input, optional)

**Audit & Implementation Checklist**
- **Weekly Checklist Items** (checkboxes) - Action items for the week

---

### Paid Ads Optimize Mini-App

**Audit Form**
- **Active Campaigns** (checkbox group) - Which platforms have active ads
- **Monthly Ad Spend** (number input, required) - Current spending amount
- **Monthly Conversions** (number input, required) - Number of conversions achieved
- **Average Order Value** (number input, optional) - AOV if applicable
- **Platforms Running Ads** (checkboxes) - Which platforms (Facebook, Google, LinkedIn, TikTok, etc.)
- **Main Challenge** (textarea, required) - What's not working well
- **Previously Tested** (textarea, optional) - Optimization attempts already tried

**Audit Results**
- **Week-by-Week Checklists** (checkboxes) - Optimization action items
- **Quick Win Implementation** (checkboxes) - Immediate improvements

---

### Feedback Collection Mini-App

- Read-only educational content and templates
- Survey templates available for copying
- No persistent user input (templates are reference only)

---

### Other Educational Mini-Apps (Guides, Resources)

Tasks like:
- Engage Followers
- Publish Updates
- Iterate Features
- Giveaway Planning
- Outreach
- Community Building

Features:
- **Expand/Collapse Toggles** for guide sections
- **Template Copying** (links/references, no persistent data)
- **Tool Recommendations** (links only)

---

## SECTION 4: AUTHENTICATION & ACCOUNT

### Auth Form
- **Email** (text input, required) - For login/signup
- **Password** (password input, required) - For account access
- **Password Reset Request** (text input, optional) - Email for password recovery

---

## SECTION 5: SUBSCRIPTION & BILLING

### Stripe Payment Modal
- **Payment Card Information** (Stripe Card Element) - Card details via Stripe hosted field
  - Card number
  - Expiry date
  - CVC/CVV

### Manage Subscription Page
- **Cancel Subscription** (button action) - Confirmation checkbox to cancel active plan

---

## SECTION 6: GENERAL UI INTERACTIONS

### Search & Filter Bar
- **Search Text** (text input) - Search tasks/projects
- **Filter Options** (select/checkbox group) - Filter by status, type, etc.

### Settings & Preferences
- (To be confirmed - check if settings page exists)

---

## DATA SUMMARY

### By Input Type

**Text Inputs (Free text)**
- Product name, description, topic, headline, email, CTA text, audience description, keywords, search, notes

**Number Inputs**
- Budget, revenue, spend, conversions, word count, duration, expected attendees, AOV

**Select/Dropdowns**
- Product type, main goal, timeline, team size, stage, tone, design style, platform, purpose, design purpose

**Textareas**
- Description, target audience, goals, product description, blog content, challenges, previously tested

**Checkboxes**
- Community selection, channel selection, checklist items, terms agreement, verification items

**Date Inputs**
- Webinar date, campaign dates

**File/Image Uploads**
- Hero images, design files, product screenshots

**URLs**
- Button links, external tool links, resource links

**Card Elements (Stripe)**
- Payment card information

---

## METRICS

- **Total Unique User-Facing Data Points:** 85-95 distinct inputs across entire application
- **Onboarding Data Points:** 9
- **Project Data Points:** 6
- **Mini-App Inputs:** 70+
- **Auth/Account Data Points:** 3

---

## NOTES

1. All data is collected from user inputs, not auto-generated
2. Data is persisted in either browser localStorage or Supabase backend
3. Some mini-apps are educational/read-only (no persistent input)
4. Mini-apps with checkboxes track completion status
5. Some fields are conditional based on previous selections

---

---

## SEMANTIC DUPLICATES ANALYSIS

### High-Priority Consolidation Candidates

#### 1. TARGET AUDIENCE (Found 5 times)
**Literal Locations:**
- Step 2 Onboarding: "Target Audience" (textarea)
- Project Form: "Target Audience" (text input)
- Blog Post Mini-App: "Target Audience" (text input) - "Intended readers/persona"
- Webinar Mini-App: "Target Audience" (text input)
- Paid Ads Launch: "Target Audience Description" (textarea)

**Recommendation:** Consolidate into ONE "Target Audience/Persona" field filled at onboarding or project level, reuse everywhere else (but allow task-specific edits)

---

#### 2. PRODUCT NAME & DESCRIPTION (Found 4 times)
**Literal Locations:**
- Step 1 Onboarding: "Product Name" + "Product Description"
- Analytics Mini-App: "Product Name" + "Product Description"
- Paid Ads Launch: "Target Product/Service"
- Landing Page: (implicitly in "Value Proposition Points")

**Recommendation:** Store once at onboarding, auto-fill in all task forms with option to override

---

#### 3. MAIN GOAL / PRIMARY OBJECTIVE (Found 4 times)
**Literal Locations:**
- Step 3 Onboarding: "Main Goal" (select: first_100, 1k_mrr, 10k_mrr, audience, validate)
- Project Form: "Primary Goals" (textarea)
- Analytics Mini-App: "Main Goal" (select for analytics tracking)
- Paid Ads Launch: "Primary Campaign Goal" (select: traffic, conversions, leads, brand awareness)

**Recommendation:** Consolidate onboarding goal with project goals - different value sets, so may need context-specific usage. **Needs clarification:** Should these be the same field or context-specific?

---

#### 4. TIMELINE / DEADLINE (Found 3 times)
**Literal Locations:**
- Step 3 Onboarding: "Timeline" (select: 1_month, 3_months, 6_months, no_timeline)
- Project Form: "Timeline" (text input)
- Webinar Mini-App: "Webinar Date" (date input)

**Recommendation:** Create unified "Timeline" concept - store overall project timeline, reference in task-specific contexts

---

#### 5. PRODUCT TYPE (Found 2 times)
**Literal Locations:**
- Step 1 Onboarding: "Product Type" (select: mobile_app, saas, ecommerce, game, digital_product, other)
- Analytics Mini-App: "Product Type" (select for analytics)

**Recommendation:** Auto-populate analytics product type from onboarding selection

---

#### 6. TEAM SIZE (Found 1 main, relevant to others)
**Literal Locations:**
- Step 4 Onboarding: "Team Size" (select: solo, 2-5, 6-10, 10+)

**Recommendation:** Could be referenced in project context for team-based workflows

---

#### 7. BUDGET / FINANCIAL METRICS (Found 3 times - different contexts)
**Literal Locations:**
- Step 4 Onboarding: "Marketing Budget" (number)
- Paid Ads Launch: "Monthly Budget" (number) + "Current Monthly Revenue" (number)
- Paid Ads Optimize: "Monthly Ad Spend" (number)

**Recommendation:** These are contextually different (marketing budget vs. ad spend vs. revenue). Store separately but could reference overall budget from onboarding.

---

### Medium-Priority Consolidation Candidates

#### 8. CALL-TO-ACTION / KEY MESSAGE (Found 2 times)
**Literal Locations:**
- Design Graphics: "Key Message / CTA" (text)
- Landing Page: "Call-to-Action Button Text" + "Subheading" (text)

**Recommendation:** Could share CTA library across design + landing page tasks

---

#### 9. EMAIL / CONTACT INFO (Found 2 times)
**Literal Locations:**
- Step 5 Onboarding: "Email" (for signup)
- Auth Form: "Email" (for login)

**Recommendation:** Obviously unified (same user email)

---

#### 10. KEYWORDS / SEO TERMS (Found 2 times)
**Literal Locations:**
- Blog Post: "Keywords" (comma-separated)
- Landing Page: (implicitly in design/messaging)

**Recommendation:** Could be shared across blog + landing page contexts

---

### Low-Priority / Context-Specific (Not Consolidation Candidates)

These are unique to specific tasks and should remain separate:
- Design Purpose, Design Style, Selected Tool
- Writing Tone, Word Count
- Channels, Communities (channel-specific selections)
- Payment Card Info (Stripe-specific, security boundary)
- Verification Checklists (task-specific progress)
- Custom Goals, Previously Tested (task-specific audit data)

---

## CONSOLIDATION IMPACT SUMMARY

**If fully consolidated, current 85-95 data points could reduce to ~40-50 core data points:**

| Category | Current Count | After Consolidation |
|----------|---------------|-------------------|
| Core User Profile | 9 (onboarding) | 9 (unchanged - primary source) |
| Product Info | 4 duplicates | 2 consolidated fields |
| Audience/Persona | 5 duplicates | 1 consolidated field |
| Goals & Timeline | 7 duplicates | 2-3 consolidated fields |
| Budget & Revenue | 3 + task-specific | Keep 2-3 separate |
| Mini-App Specific | ~50 | ~40 (less duplication) |
| Auth/Billing | 3 | 3 (unchanged) |
| **TOTAL** | **85-95** | **40-50** |

---

## RECOMMENDED IMPLEMENTATION APPROACH

### Phase 1: Identify Core Consolidated Fields
Create a "User Profile" or "Project Profile" data structure with:
- Product Name + Type + Description
- Target Audience/Persona (with option for task-specific override)
- Primary Goal (with task-context variants)
- Timeline
- Team Size
- Marketing Budget (reference point)

### Phase 2: Update Component Usage
- Onboarding stores once
- Project form references + allows editing
- Task mini-apps auto-populate from project/profile
- Each mini-app can override if needed

### Phase 3: Update Data Store (Pinia/Supabase)
- Create `userProfile` store with consolidated fields
- Create `projectProfile` with editable copies
- Link tasks to projectProfile for inheritance
- Track which fields are overridden vs. inherited

---

## NEXT STEPS

1. **Clarify consolidation strategy** - Which duplicates should be consolidated vs. context-specific?
2. **Define data inheritance hierarchy** - Onboarding → Project → Tasks
3. **Update store architecture** - Implement consolidated data model
4. **Refactor components** - Update all forms to use shared data sources
