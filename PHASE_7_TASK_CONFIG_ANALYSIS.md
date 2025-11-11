# Phase 7: Task Configuration Updates (Tier/What/Why/How)

## Overview

This phase categorizes all 21 tasks into Free and Premium tiers, and adds educational fields (What/Why/How) to replace the removed notes fields. This supports the freemium model requirements established in the planning phase.

## Task Categorization

### Free Tier Tasks (6 tasks - 20 AI generations/month)

These are essential setup and foundational tasks that every user needs, regardless of tier. They help users get started quickly without paywalls.

1. **setup-1: Define Audience & Goals** ✓ AI-enabled
   - Why Free: Foundational for all launches
   - Risk: Low (generic info gathering)
   - Quota Impact: 1-2 gens/user (audience research)

2. **setup-3: Connect Accounts** (No AI)
   - Why Free: Manual account linking (no AI cost)
   - Risk: Security-sensitive task

3. **social-1: Schedule Posts** ✓ AI-enabled
   - Why Free: Core social media feature
   - Risk: Low (template-based)
   - Quota Impact: 2-3 gens/user (post variants)

4. **acq-2: Personalized Outreach** ✓ AI-enabled
   - Why Free: Essential for user acquisition
   - Risk: Low (email templates)
   - Quota Impact: 2-3 gens/user (outreach variants)

5. **content-1: Write Blog Post** ✓ AI-enabled
   - Why Free: Core content marketing
   - Risk: Low (educational content)
   - Quota Impact: 2-3 gens/user (blog outline + sections)

6. **analytics-2: Optimize Channels** (No AI)
   - Why Free: Manual analytics task
   - Risk: Low (data interpretation)

---

### Premium Tier Tasks (15 tasks - 200 AI generations/month)

These are advanced, high-value tasks that leverage AI extensively. They provide competitive advantage and deeper features.

**Setup & Planning (3 tasks):**
7. **setup-2: Landing Page Creator** ✓ AI-enabled
   - Why Premium: Advanced UI builder + AI copy
   - Quota Impact: 3-5 gens/user
   - Value: Professional landing pages ($500+ designer cost)

8. **setup-4: Prepare Assets** (No AI, premium for organization)
   - Why Premium: Brand-centric feature
   - Value: Organized asset management

9. **setup-5: Set Up Tracking Sheet** (No AI)
   - Why Premium: Advanced analytics setup
   - Value: Custom tracking configuration

**Social Media & Community (3 tasks):**
10. **social-2: Engage Followers** (No AI)
    - Why Premium: Community management templates
    - Value: Systematic engagement approach

11. **social-3: Run Giveaway/Contest** (No AI)
    - Why Premium: Advanced promotion mechanics
    - Value: Contest management framework

12. **acq-1: Post in Communities** (No AI)
    - Why Premium: Multi-platform distribution
    - Value: Access to paid promotion networks

**Content Creation (3 tasks):**
13. **content-2: Create Video Tutorial** (No AI, but AI-adjacent)
    - Why Premium: Video scripting (requires AI in Phase X)
    - Value: Professional video production guidance

14. **content-3: Design Graphics** ✓ AI-enabled
    - Why Premium: AI design briefs
    - Quota Impact: 2-3 gens/user
    - Value: Design guidance + brand consistency

15. **acq-3: Host Webinar/Q&A** (No AI)
    - Why Premium: Webinar planning (advanced)
    - Value: Lead generation event planning

**Feedback & Iteration (3 tasks):**
16. **feedback-1: Collect User Feedback** (No AI)
    - Why Premium: User research framework
    - Value: Structured feedback collection

17. **feedback-2: Publish Product Updates** (No AI)
    - Why Premium: Release management
    - Value: Changelog + multi-channel distribution

18. **feedback-3: Iterate on Features** (No AI)
    - Why Premium: Feature prioritization matrix
    - Value: Data-driven prioritization

**Analytics & Optimization (3 tasks):**
19. **analytics-1: Set Up Analytics** (No AI)
    - Why Premium: Advanced tool configuration
    - Value: Professional analytics setup

20. **analytics-3: Review ROI** (No AI)
    - Why Premium: Advanced metrics calculation
    - Value: ROI tracking + unit economics

21. **analytics-2 (alternate):** Already listed above in Free tier

---

## New Fields to Add to Task Configs

Each task config will have these 4 new fields added:

### 1. `tier` (string)
- Value: "free" | "premium"
- Purpose: Determines if task is available to users
- Schema enforcement: Required on all tasks
- UI impact: Task hidden/disabled if user doesn't have tier

### 2. `what` (string)
- Length: 200-300 characters (1-2 sentences)
- Purpose: Educational - what will the user accomplish
- Replaces: The old "notes" field explanation
- Example: "Learn how to create detailed buyer personas that guide all your marketing decisions. AI will help you analyze market segments and identify your ideal customer profile."
- Format: Plain text, clear and actionable

### 3. `why` (string)
- Length: 150-250 characters (1-2 sentences)
- Purpose: Motivational - why is this task important
- Focuses on: Business value and outcomes
- Example: "Knowing your audience is the foundation for every marketing decision. Without clear personas, you'll waste time on irrelevant channels and miss growth opportunities."
- Format: Plain text, benefit-focused

### 4. `how` (string)
- Length: 150-250 characters (1-2 sentences)
- Purpose: Action-oriented - how to approach the task
- Focuses on: Process and methodology
- Example: "Answer 5 questions about your ideal customers, then use AI to generate detailed personas. Refine based on your product and market research."
- Format: Plain text, step-by-step guidance

---

## Example Updated Config

### Before (Current)
```javascript
export const analyticsSetupTask = {
  id: 'analytics-1',
  name: 'Set Up Analytics',
  description: 'Configure analytics tools',
  category: 'analytics',
  tools: analyticsTools,
  customComponent: 'AnalyticsSetupMiniApp',
  output: { enabled: false }
}
```

### After (Phase 7)
```javascript
export const analyticsSetupTask = {
  id: 'analytics-1',
  name: 'Set Up Analytics',
  description: 'Configure analytics tools',
  category: 'analytics',

  // NEW FIELDS
  tier: 'premium',
  what: 'Configure 5+ analytics tools (GA4, Mixpanel, Amplitude, Hotjar, Segment) to track user behavior, conversion funnels, and product engagement across all your channels.',
  why: 'Without proper analytics, you cannot measure growth, identify bottlenecks, or optimize marketing ROI. Data-driven decisions compound into exponential growth.',
  how: 'Choose 1-2 primary tools (GA4 + Mixpanel recommended), install tracking code, set up key events (signup, purchase, churn), then create dashboards for weekly review.',

  tools: analyticsTools,
  customComponent: 'AnalyticsSetupMiniApp',
  output: { enabled: false }
}
```

---

## Task Config Updates Summary

### Phase 7a: Update Free Tier Tasks (6 tasks)
1. setup-1 → Add tier: "free" + what/why/how
2. setup-3 → Add tier: "free" + what/why/how
3. social-1 → Add tier: "free" + what/why/how
4. acq-2 → Add tier: "free" + what/why/how
5. content-1 → Add tier: "free" + what/why/how
6. analytics-2 → Add tier: "free" + what/why/how

### Phase 7b: Update Premium Tier Tasks (15 tasks)
7. setup-2 → Add tier: "premium" + what/why/how
8. setup-4 → Add tier: "premium" + what/why/how
9. setup-5 → Add tier: "premium" + what/why/how
10. social-2 → Add tier: "premium" + what/why/how
11. social-3 → Add tier: "premium" + what/why/how
12. acq-1 → Add tier: "premium" + what/why/how
13. content-2 → Add tier: "premium" + what/why/how
14. content-3 → Add tier: "premium" + what/why/how
15. acq-3 → Add tier: "premium" + what/why/how
16. feedback-1 → Add tier: "premium" + what/why/how
17. feedback-2 → Add tier: "premium" + what/why/how
18. feedback-3 → Add tier: "premium" + what/why/how
19. analytics-1 → Add tier: "premium" + what/why/how
20. analytics-3 → Add tier: "premium" + what/why/how

### Phase 7c: Update taskRegistry.js
- Add `tier` field to all taskMetadata entries
- Add `what`, `why`, `how` fields to all taskMetadata entries
- Ensure taskMetadata matches config files

### Phase 7d: Create Schema Validator
- Create taskConfigValidator.js
- Validates all 21 configs pass schema check
- Validates tier values, string lengths, required fields

### Phase 7e: Update Dashboard to Show Tier Info
- Show tier lock icon (🔒) for premium tasks on free accounts
- Show what/why/how in task cards (collapsible)
- Allow users to see why task is locked

---

## Files to Modify

### Config Files (12 files in src/configs/):
1. ~/defineAudience.config.js (legacy - may be empty)
2. ~/communityPosts.config.js
3. ~/channelAnalyzer.config.js
4. ~/videoScript.config.js
5. ~/prepareAssets.config.js
6. ~/designGraphics.config.js
7. ~/analyticsSetup.config.js
8. ~/featurePrioritization.config.js
9. ~/roiCalculator.config.js
10. ~/webinar.config.js
11. ~/feedbackCollection.config.js
12. ~/writeBlog.config.js
13. ~/engageFollowers.config.js
14. ~/giveaway.config.js
15. ~/outreach.config.js
16. ~/connectAccounts.config.js
17. ~/landingPageCreatorAssistant.config.js
18. ~/changelog.config.js
19. ~/trackingSheet.config.js

### Mini-App Config Files (5 files in src/components/TaskMiniApps/configs/):
1. ~/feedback.config.js
2. ~/generatePosts.config.js
3. ~/webinar.config.js
4. ~/iterateFeatures.config.js
5. ~/publishUpdates.config.js
6. ~/defineAudience.config.js
7. ~/outreach.config.js

### Registry Files (2 files):
1. ~/taskRegistry.js (update taskMetadata with tier/what/why/how)
2. ~/taskConfigValidator.js (NEW - validation)

---

## Validation Checklist

After Phase 7 completion, all 21 tasks must:

- ✓ Have `tier: "free"` or `tier: "premium"`
- ✓ Have `what` (200-300 char, 1-2 sentences)
- ✓ Have `why` (150-250 char, 1-2 sentences)
- ✓ Have `how` (150-250 char, 1-2 sentences)
- ✓ Pass schema validation (required fields, string lengths)
- ✓ Match taskRegistry.js entries
- ✓ Be properly exported from config files
- ✓ Render in Dashboard without errors

---

## Next Steps After Phase 7

- Phase 8: Create PublicLandingPage.vue with tier comparison table
- Phase 9: End-to-end testing of all user flows
- Deployment: Roll out to production with tier gating

---

**Status:** Ready to begin updates
**Estimated Time:** 2-3 hours
**Complexity:** Medium (repetitive updates, but straightforward content)
