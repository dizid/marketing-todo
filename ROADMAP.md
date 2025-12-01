# Single Source of Truth (SSOT) Strategic Roadmap

**Launchpilot v0.7 → v1.0+**
**Building an Intelligent, Interconnected Platform**

---

## Vision

Transform Launchpilot from a collection of disconnected mini-apps into an **intelligent, interconnected platform** where user data enters once, gets reused everywhere, and automatically generates strategic outputs (business plans, roadmaps, presentations).

---

## The Insight: What Becomes Possible

Once users accumulate data across tasks, Launchpilot can auto-generate:

1. **Unified Business Plan** - Auto-compiled from:
   - Product definition (from Offer Builder)
   - Market positioning (from Positioning Map)
   - Audience insights (from Audience Research)
   - Financial projections (from ROI Calculator)
   - Timelines (from Webinar/Ads/Launches)

2. **Marketing Roadmap** - Auto-compiled from:
   - Strategic goals (from Define Goals)
   - Channel strategy (from Channel Analyzer)
   - Content calendar (from Content Plan)
   - Campaign timeline (from Paid Ads, Webinars)
   - Budget allocation (from Budget planning)

3. **90-Day Launch Plan** - Auto-compiled from:
   - Timeline + budget constraints
   - Product readiness
   - Audience targeting
   - Messaging framework
   - Campaign sequencing

4. **Competitive Positioning Brief** - Auto-compiled from:
   - Competitor analysis (from Competitor Intelligence)
   - Positioning statement (from Positioning Map)
   - Differentiation angles (from Sales Page Audit)
   - Messaging variations (from multiple copywriting tasks)

5. **Executive Summary/Pitch Deck** - Auto-compiled from all above

---

## Phase 1: Data Foundation Activation (1-2 weeks)

### Goal
Activate the existing ProjectContext infrastructure to eliminate form-level duplication.

### 1A: Create Field Inheritance UI Component
**What**: New `FieldWithInheritance.vue` component
- Shows where value comes from: "Inherited from Audience Research" vs "Custom override"
- Visual indicator (icon/badge) for inherited fields
- "Update from source" button to sync if source data changes
- "Save as override" to lock task-specific variation
- Builds trust in the system (transparency)

**Deliverable**: Vue component + usage examples in 3 tasks

---

### 1B: Audit & Map All Form Fields
**What**: Document field inheritance across all 32 tasks
- For each task config, identify:
  - Which fields map to ProjectContext canonical fields
  - Which fields are task-specific
  - Which fields have hidden dependencies on other tasks
- Create: `FIELD_INHERITANCE_MAP.json` documenting all mappings
- Identify: targetAudience (12+ appearances), productName (8+ appearances), etc.

**Deliverable**: `FIELD_INHERITANCE_MAP.json` + analysis document

---

### 1C: Activate Inheritance in Top 10 Tasks
**Priority order** (by duplication & impact):
1. Offer Builder
2. Paid Ads
3. Webinar Planning
4. Sales Page Audit
5. Cold Outreach
6. Email Sequence
7. Landing Page Creator
8. Community Engagement
9. Lead Magnet Ideas
10. Positioning Map

**For each task**:
- Auto-populate inherited fields from ProjectContext
- Show inheritance UI indicators
- Allow override
- Sync back to ProjectContext if user updates

**Deliverable**: 10 updated task configs + inheritance UI active

---

### 1D: Build Composable for Inheritance Injection
**What**: `useProjectContextInjection.ts` composable
- Input: task form config + ProjectContext
- Output: Enhanced form with inherited values pre-populated
- Tracks which fields were inherited vs. entered fresh
- Handles inheritance resolution chain

**Deliverable**: Composable + documentation + unit tests

---

## Phase 2: Task Dependency Graph (1 week)

### Goal
Map hidden dependencies so system can suggest task sequences and auto-populate based on task history.

### 2A: Build Task Dependency Graph
**What**: Create `TASK_DEPENDENCY_GRAPH.json`

```json
{
  "offer-builder": {
    "requires": ["product-definition", "audience-insights"],
    "enables": ["sales-page-audit", "email-sequence", "pricing-strategy"],
    "reads_from": ["Define Audience", "Positioning Map"],
    "writes_to": ["ProjectContext.primaryOffer", "ProjectContext.targetAudience"]
  }
}
```

**Dependency types**:
- **Data reads**: Task reads from ProjectContext fields
- **Data writes**: Task contributes to ProjectContext
- **Task sequence**: What should come before this task
- **Cross-task**: This task helps inform that task

**Deliverable**: Complete dependency graph + visualization

---

### 2B: Smart Task Suggestions
**What**: Intelligent task recommender
When user completes a task:
- Show "Next recommended tasks" based on dependency graph
- Example: "You've defined your offer. Next: optimize your sales page, or plan your email sequence"
- Surface tasks that would benefit from the data just entered
- Prioritize by: impact on user goals, data completeness, natural workflow

**Deliverable**: Task suggestion component + ranking algorithm

---

### 2C: Task Completion Scoring
**What**: "You're X% complete" progress indicator
Calculate based on:
- Core ProjectContext fields filled (60% weight)
- Number of tasks completed (20% weight)
- Depth of each task completion (20% weight)
- Milestones: 25%, 50%, 75%, 100% (with rewards/celebrations)

**Deliverable**: Scoring algorithm + progress dashboard

---

## Phase 3: Auto-Generated Outputs (2-3 weeks)

### Goal
Turn accumulated data into strategic documents users can download/share.

---

### 3A: Business Plan Generator
**Trigger**: When ProjectContext reaches ~70% completion

**Sections** (auto-generated from various tasks):
1. **Executive Summary** - From Audience Research + Goals + Positioning
2. **Product/Service Description** - From Offer Builder + Product Definition
3. **Target Market Analysis** - From Audience Research + Competitor Intelligence
4. **Positioning & Messaging** - From Positioning Map + Sales Page Audit
5. **Marketing Strategy** - From Channel Analyzer + Paid Ads setup
6. **Financial Projections** - From ROI Calculator + Budget planning
7. **Timeline & Milestones** - From all task deadlines
8. **Implementation Plan** - From Landing Page Creator + Content Plan
9. **Risk Analysis** - From consistency checker + data gaps
10. **Next Steps** - Recommended tasks based on dependency graph

**Output formats**: PDF, Word, Markdown

**Deliverable**: Business Plan generation service + template system

---

### 3B: Marketing Roadmap Generator
**Trigger**: When tasks covering channels + content + timeline are complete

**Structure**:
```
Roadmap for: [productName]
Focus: [primary_goal from ProjectContext]
Budget: $X/month over Y months
Channels: [email, paid_ads, content, community, etc.]
Key Milestones: [from Webinar/Campaign tasks]

== MONTH 1 ==
Week 1: Content calendar launch + email sequence starts
Week 2: Paid ads begin
Week 3-4: First A/B tests + engagement tracking
Checkpoint: [metric from ROI calculator]

== MONTH 2 ==
[Detailed plan]

== MONTH 3 ==
[Scaling recommendations]
```

**Output formats**: Gantt chart, Timeline PDF, Spreadsheet

**Deliverable**: Roadmap generation service + calendar UI

---

### 3C: 90-Day Launch Plan
**Trigger**: When user has defined timeline + budget + audience + offer

**Auto-generated components**:
- Week-by-week breakdown with specific actions
- Content calendar with posting schedule
- Email send schedule with messaging
- Ad spend allocation by channel
- Checkpoint metrics to track weekly
- Risk mitigation strategies

**Deliverable**: Launch plan template + generation service

---

### 3D: Competitive Positioning Brief
**Trigger**: When Competitor Intelligence + Positioning Map complete

**Includes**:
- Head-to-head comparison table (you vs competitors)
- Differentiation strategy by dimension
- Messaging angles targeted at each competitor's weakness
- Win/loss scenario planning
- Pricing positioning analysis

**Deliverable**: Brief generation service + comparison templates

---

### 3E: Pitch Deck / Executive Summary
**Trigger**: Business Plan + Positioning Brief complete

**Generates**:
- 10-15 slide deck format (PDF + PowerPoint)
- For: investor pitches, team alignment, board presentations
- Pulling synthesized data from all generated outputs
- Professional design templates

**Deliverable**: Pitch deck generation service + design templates

---

## Phase 4: Intelligence Layer (2-3 weeks)

### Goal
System proactively surfaces insights and recommendations based on data patterns.

---

### 4A: Data Consistency Checker
**What**: Real-time contradiction detection

Monitor for logical inconsistencies:
- "Audience is SMBs but targeting $5K+ price" → Flag
- "Budget is $1K/month but planning 3-channel campaign" → Suggest prioritization
- "Timeline is 30 days but plan includes 10-email sequence" → Warn on feasibility
- "Positioning is premium but pricing is budget" → Highlight disconnect

**Severity levels**: Warning, Caution, Info

**Deliverable**: Consistency checker service + real-time alerts

---

### 4B: Gap Analyzer
**What**: Identify incomplete strategies

Detect missing pieces:
- "You've defined offer but not value stack" → Suggest Offer Builder refinement
- "You have positioning but no competitive differentiation" → Suggest Competitor Intelligence
- "You have traffic plan but no conversion optimization" → Suggest Sales Page Audit
- "Budget allocated but no ROI target set" → Suggest ROI Calculator

**Deliverable**: Gap analysis service + recommendation engine

---

### 4C: Insight Generator
**What**: Proactive strategic insights

When data patterns emerge, surface insights:
- "Your target audience is wider than your budget supports. Consider segmentation."
- "Based on your timeline, here's the minimum viable content calendar"
- "Your positioning is strong but pricing positioning is missing. Consider audit."
- "You have high engagement targets but low content allocation. Rebalance?"

**Deliverable**: Insight generation service + recommendation UI

---

### 4D: Recommendation Engine
**What**: Intelligent next-step suggestions

Ranking and prioritization:
- Rank tasks by impact on stated goals
- Suggest task refinements ("Your audience definition needs more detail")
- Indicate which fields, if clarified, would unlock new insights
- Surface high-ROI tasks based on user data

**Deliverable**: Recommendation engine + prioritization algorithm

---

## Phase 5: Collaborative & Export Features (1-2 weeks)

### Goal
Make outputs shareable and actionable for teams.

---

### 5A: Export Enhancements
**Current**: Markdown, JSON

**Add**:
- PDF generation (with branding options)
- PowerPoint export (for pitch decks + roadmaps)
- Google Sheets export (for calendars/roadmaps)
- Word document export (for business plans)
- Shareable links (read-only preview, versioned)
- Email delivery option

**Deliverable**: Export services for all formats + sharing UI

---

### 5B: Team Collaboration (Foundational)
**What**: Enable team workflows
- Comment on specific sections of generated outputs
- Version tracking ("saved as V3 on 2025-12-15")
- "Stakeholder review" mode (comment-only access)
- Change notifications ("Marcus updated target audience")
- Approval workflows for key decisions

**Deliverable**: Collaboration components + notification system

---

### 5C: Template Library
**What**: Build organizational knowledge base
- Save successful plans as templates
- Share anonymized templates with community
- "Use this business plan template" for new projects
- Community voting on best templates
- Fork templates for customization

**Deliverable**: Template management system + library UI

---

## Phase 6: Advanced Intelligence (3-4 weeks, Lower Priority)

### 6A: Multi-Version Scenario Planning
**What**: "What-if" analysis engine

Allow users to explore scenarios:
- "What if we 2x budget?"
- "What if we extend timeline to 6 months?"
- "What if we target enterprise instead of SMB?"
- System recalculates all dependent fields
- Side-by-side comparison of scenarios

**Deliverable**: Scenario engine + comparison UI

---

### 6B: Historical Comparison
**What**: Track plan evolution

Enable learning over time:
- Compare current plan against previous versions
- "You've updated positioning 3 times. Here's what changed."
- Track decision changes and outcomes
- Learning analytics: "What changes correlate with success?"

**Deliverable**: Version history system + comparison UI

---

### 6C: AI-Powered Plan Critique
**What**: Automated strategy review

AI reviews generated outputs:
- Logical consistency check
- Market viability assessment
- Resource feasibility analysis
- Risk identification
- Provides "strengths" and "areas for improvement"

**Deliverable**: AI critique service + feedback UI

---

### 6D: Benchmarking
**What**: Industry standard comparisons

Position user against peers:
- "Your marketing budget is $X/month targeting Y audience"
- "Industry benchmark for this segment is $Z/month"
- "You're [above/below] average"
- "Peers in your segment allocate X% to email, Y% to ads"

**Deliverable**: Benchmarking data system + comparison UI

---

## Implementation Priority & Sequencing

### Critical Path (Must Do First)
These unlock everything else:

1. **Phase 1** - Data Foundation Activation (1-2 weeks)
   - ✅ Highest impact
   - ✅ Reduces user friction immediately
   - ✅ Enables all other phases
   - Estimated effort: 60-80 hours

2. **Phase 2** - Task Dependency Graph (1 week)
   - ✅ Powers smart suggestions
   - ✅ Improves UX significantly
   - ✅ Provides clear next steps
   - Estimated effort: 30-40 hours

3. **Phase 3A** - Business Plan Generator (1 week)
   - ✅ Highest immediate user value
   - ✅ Justifies premium tier
   - ✅ "Aha!" moment for users
   - Estimated effort: 40-60 hours

---

### High Value Next (Should Do)
4. **Phase 3B** - Marketing Roadmap Generator (1 week)
   - Estimated effort: 40-50 hours

5. **Phase 4A** - Consistency Checker (3-4 days)
   - Prevents user confusion
   - Estimated effort: 20-30 hours

6. **Phase 5A** - Export Enhancements (3-4 days)
   - Users need to share/download outputs
   - Estimated effort: 20-30 hours

---

### Nice to Have (Lower Priority)
7. **Phase 3C, 3D, 3E** - Additional generators (2+ weeks)
8. **Phase 4B, 4C, 4D** - Intelligence layer (2+ weeks)
9. **Phase 5B, 5C** - Collaboration & templates (1+ week)
10. **Phase 6** - Advanced features (3-4 weeks)

---

## Expected User Impact

### Current State (v0.7)
- ❌ User enters "target audience" in 5+ different tasks separately
- ❌ No visibility into what data they have or haven't filled
- ❌ Outputs are isolated per-task
- ❌ No unified strategy view
- ❌ No "completion" sense
- ❌ No recommendations

### After Phase 1-3 (v0.8-v0.9)
- ✅ User enters data once, sees it flow everywhere
- ✅ Can see "40% plan complete" progress
- ✅ Can download complete Business Plan with a click
- ✅ Can share unified Marketing Roadmap with team
- ✅ Tasks intelligently suggest what to do next
- ✅ Clear sense of progress and completion

### After Phase 4-6 (v1.0+)
- ✅ System warns about strategy contradictions
- ✅ AI suggests next priorities
- ✅ User can scenario-plan easily
- ✅ Historical tracking shows plan evolution
- ✅ Benchmarking against industry
- ✅ Team collaboration workflows
- ✅ Advanced analytics on user decision patterns

---

## Technical Implementation Notes

### Leveraging Existing Infrastructure
- ✅ **ProjectContext table** - Already exists, designed for this
- ✅ **task_field_overrides** - Ready for inheritance support
- ✅ **business_context_audit** - Ready for versioning
- ✅ **Repository pattern** - Already in place
- ✅ **Pinia stores** - Foundation for state management
- ✅ **Composables** - Inheritance composable pattern established

### New Components/Files Needed

**UI Components**:
- `FieldWithInheritance.vue` - Shows inheritance state
- `ProgressDashboard.vue` - Displays completion %
- `TaskSuggestions.vue` - Next recommended tasks
- `GeneratedOutputs.vue` - Download/view Business Plan, Roadmap, etc.
- `ConsistencyAlerts.vue` - Real-time warnings

**Services**:
- `BusinessPlanGenerator.ts` - Generate business plans
- `RoadmapGenerator.ts` - Generate marketing roadmaps
- `LaunchPlanGenerator.ts` - Generate 90-day plans
- `ConsistencyChecker.ts` - Validate strategy coherence
- `GapAnalyzer.ts` - Identify missing pieces
- `RecommendationEngine.ts` - Suggest next steps
- `ExportService.ts` - PDF, Word, PowerPoint, Sheets export

**Composables**:
- `useProjectContextInjection.ts` - Inject inherited values into forms
- `useDependencyGraph.ts` - Task dependency logic
- `useCompletionScore.ts` - Calculate progress %

**Static/Config**:
- `FIELD_INHERITANCE_MAP.json` - Field-to-ProjectContext mappings
- `TASK_DEPENDENCY_GRAPH.json` - Task relationships

### Database Changes (Minimal)
- Use existing tables effectively
- `businessContext` column designed for this
- `task_field_overrides` ready for inheritance
- Consider `output_history` table for Business Plan versioning

---

## Success Metrics

### Phase 1: "Is the inheritance system being used?"
- **Metric 1**: % of form fields auto-populated with inherited values (target: 80%+)
- **Metric 2**: % of users seeing inheritance UI (target: 100%)
- **Metric 3**: Time saved per form (target: 30-50% reduction)

### Phase 2: "Are users following suggested task sequences?"
- **Metric 1**: Click-through on "next recommended task" (target: 60%+)
- **Metric 2**: Task completion order alignment with graph (target: 70%+)
- **Metric 3**: User satisfaction with suggestions (target: 4.0+/5.0)

### Phase 3: "Are users downloading/sharing generated outputs?"
- **Metric 1**: # of Business Plans generated per week (target: +500% vs baseline)
- **Metric 2**: # of downloads/exports per week (target: 70%+ of users)
- **Metric 3**: User satisfaction with output quality (target: 4.2+/5.0)
- **Metric 4**: Upsell conversion (premium tier) (target: +25%)

### Phase 4: "Is system surfacing useful insights?"
- **Metric 1**: % of users acting on gap analysis suggestions (target: 40%+)
- **Metric 2**: Consistency checker catches before user discovers (target: 60%+)
- **Metric 3**: User satisfaction with recommendations (target: 3.9+/5.0)

### Overall: "Does SSOT deliver on promise?"
- **Metric 1**: Time to complete full strategy (target: -40% vs current)
- **Metric 2**: User satisfaction ("I feel like my strategy is complete") (target: 4.3+/5.0)
- **Metric 3**: Upsell to higher tiers (target: +20%)
- **Metric 4**: User retention at 90 days (target: +15%)
- **Metric 5**: Net Promoter Score (target: 50+)

---

## Why This Works

### Network Effects
- Each task adds value to every other task
- More data entered = exponentially more value
- User is incentivized to complete more tasks

### Reduces Friction
- Auto-population saves 30-50% of form entry time
- Smart suggestions eliminate "what should I do next?" uncertainty
- Unified outputs (Business Plan, Roadmap) feel like a complete system

### Increases Confidence
- Generated outputs validate user's thinking
- Consistency checker catches contradictions early
- Progress dashboard shows they're "on track"

### Enables New Value
- Business Plans impossible without SSOT
- Marketing Roadmaps impossible without integrated data
- None of this possible without data reuse

### Supports Upsell
- Free tier: Basic tasks + some inheritance
- Professional tier: All inheritance, basic generators
- Business tier: Advanced generators, collaboration, scenarios

### Defensible
- Competitors can't quickly replicate interconnected data system
- Data integration is the moat
- Difficult to copy without rewriting entire architecture

---

## Timeline Summary

| Phase | Duration | Key Deliverable | Value |
|-------|----------|-----------------|-------|
| Phase 1 | 1-2 weeks | Inheritance system active | Friction reduction |
| Phase 2 | 1 week | Smart task suggestions | UX improvement |
| Phase 3A | 1 week | Business Plan generator | Major aha moment |
| Phase 3B | 1 week | Marketing Roadmap | Completion feeling |
| Phase 4A | 3-4 days | Consistency checker | Error prevention |
| Phase 5A | 3-4 days | Enhanced exports | Sharing capability |
| **Phases 3C-6** | **3-4 weeks** | **Advanced features** | **Competitive moat** |
| **Total** | **~6-8 weeks** | **v1.0 release** | **Complete platform** |

---

## Appendix: Canonical Fields in ProjectContext

The 10 core fields that should sync across all tasks:

1. **productName** - What you're selling
2. **productType** - Category (SaaS, course, service, product, etc.)
3. **productDescription** - Detailed description
4. **targetAudience** - Who you're selling to
5. **primaryGoal** - Main marketing objective
6. **targetTimeline** - When you want to launch/complete
7. **marketingBudget** - Total monthly budget
8. **teamSize** - How many people on the team
9. **currentStage** - Where you are (ideation, MVP, launching, scaling)
10. **techStack** - What tools/platforms you use

**High-duplication fields** (appear 8+ times across tasks):
- targetAudience (12+ tasks)
- productName (8+ tasks)
- primaryGoal (8+ tasks)
- productDescription (6+ tasks)
- targetTimeline (5+ tasks)

---

## Appendix: Task Field Mapping Example

```json
{
  "offer-builder": {
    "productName": "core_product",
    "targetAudience": "customer_description",
    "primaryGoal": "primary_outcome",
    "productDescription": "core_product",
    "marketingBudget": null
  },
  "paid-ads": {
    "productName": "product_positioning",
    "targetAudience": "audience_targeting",
    "primaryGoal": "primary_goal",
    "marketingBudget": "monthly_budget",
    "targetTimeline": "campaign_timeline"
  },
  "email-sequence": {
    "productName": "product_description",
    "targetAudience": "audience_context",
    "primaryGoal": null,
    "productDescription": "product_description"
  }
}
```

---

## Appendix: Critical Success Factors

1. **Data Quality** - Garbage in, garbage out. Consistency checker crucial.
2. **Clear Inheritance UI** - Users must understand where data comes from.
3. **Smart Defaults** - When inheriting, provide good defaults, not just empty fields.
4. **Preserve User Control** - Always allow override. Never force inheritance.
5. **Celebrate Milestones** - Progress % must feel rewarding, not just informational.
6. **Make Outputs Beautiful** - Generated Business Plans must look professional.
7. **Build Trust Gradually** - Start with Phase 1, prove value, then expand.

---

**Document Version**: 1.0
**Last Updated**: 2025-11-30
**Status**: Ready for Implementation
**Owner**: Product & Engineering

---

*Single Source of Truth: Where data works smarter, users work less, and strategies get better.*
