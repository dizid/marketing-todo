# Strategic & Commercial Analysis Prompt

## Purpose
Provide comprehensive strategic guidance on MVP definition, monetization strategy, and commercial roadmap for the Marketing Todo application.

## Analysis Areas

### 1. MVP Readiness Assessment
**Evaluate:**
- Current feature completeness against core user needs
- Technical debt vs. market-ready code
- Critical vs. nice-to-have features for launch
- Minimum viable feature set for paying customers
- Launch readiness score (0-100)

**Output:**
- MVP feature checklist (what to include/exclude)
- Estimated timeline to MVP launch
- Technical blockers or dependencies
- Risk assessment for early launch

### 2. Monetization Strategy
**Evaluate:**
- Current pricing model (Freemium: Free 40/month, Premium $19/month)
- Pricing competitiveness and elasticity
- Revenue projections at different adoption levels
- Alternative monetization models (enterprise, API, white-label, etc.)
- Sustainability analysis (cost to operate vs. revenue potential)

**Output:**
- Recommended pricing tier structure
- Go-to-market pricing strategy
- CAC (Customer Acquisition Cost) targets
- LTV (Lifetime Value) projections
- When breakeven is achievable
- Alternative revenue streams to pursue

### 3. Product-Market Fit Strategy
**Evaluate:**
- Target user persona clarity (who benefits most?)
- Key value propositions vs. competitor offerings
- Evidence of product-market fit or path to it
- Feature prioritization for retention vs. churn
- User onboarding and success metrics

**Output:**
- Recommended target customer segment
- Top 3 differentiators vs. competitors
- Metrics to track for PMF validation
- Suggested pivots if current positioning misses

### 4. Go-to-Market Roadmap
**Evaluate:**
- Launch channel strategy (direct, partnerships, marketplace, etc.)
- Marketing budget efficiency
- Early customer acquisition plan
- Growth levers and activation loops
- Partnership opportunities

**Output:**
- Phased launch strategy (closed beta → public → growth)
- Customer acquisition channels ranked by ROI
- Marketing spend allocation
- First 100 customers plan
- Month 1-6 growth targets

### 5. Technical Priorities for Revenue
**Evaluate:**
- Which features directly drive revenue?
- Which features prevent churn?
- Technical debt that impacts revenue (bugs, performance, UX)
- Infrastructure scalability for growth
- Security/compliance for enterprise readiness

**Output:**
- Feature priority ranking by revenue impact
- Tech debt paydown schedule
- Scalability assessment
- Enterprise readiness checklist (if applicable)

### 6. Timeline & Milestones
**Evaluate:**
- MVP launch target
- Series funding readiness (if applicable)
- Revenue ramp timeline
- Market expansion phases
- Critical path dependencies

**Output:**
- Quarter-by-quarter roadmap (next 12 months)
- Key revenue milestones
- Customer acquisition targets
- Feature release cadence

### 7. Financial Projections
**Evaluate:**
- Monthly burn rate and runway
- Unit economics (CAC, LTV, payback period)
- Break-even analysis
- Revenue scenarios (conservative/optimistic)
- Funding requirements (if bootstrapping vs. raising capital)

**Output:**
- 12-month financial projections
- Funding requirements
- Profitability timeline
- Key assumptions and sensitivities

### 8. Risk Assessment
**Evaluate:**
- Market risks (competition, demand, trends)
- Technical risks (scalability, security, reliability)
- Commercial risks (pricing, churn, CAC inflation)
- Operational risks (team, expertise gaps)
- Regulatory/compliance risks

**Output:**
- Top 5 risks and mitigation strategies
- Early warning indicators to monitor
- Contingency plans for critical scenarios

## Current Product Context

### Existing Features
- **Core**: Task management with AI-powered task generation/recommendations
- **AI Integration**: Stripe payment integration, quota system (Free 40/month, Premium 400/month)
- **UI**: Dashboard with task phases (Discovery, Conversion, Execution, Optimization)
- **Data**: Task dependency mapping, business model filtering (SaaS, Service, Info-product)

### Current State
- 4-layer clean architecture (Presentation, Application, Domain, Infrastructure)
- Testing infrastructure for presentation layer (19 integration tests)
- Store consolidation complete (quotaStore as SSOT)
- Field inheritance system in place
- Netlify deployment with serverless functions

### Known Gaps/Opportunities
- Onboarding experience not yet optimized
- AI generation models (Grok-2 vs Grok-4-fast) pricing sensitivity
- Enterprise features not yet prioritized
- Mobile responsiveness may be secondary
- API integration for third-party tools (Slack, email, etc.) not yet built

## Instructions for Analysis

1. **Assess realistic MVP launch window** - Based on current state, what's truly minimum and achievable in 2-4 weeks?
2. **Validate monetization** - Is $19/month sustainable? Should it be $9, $29, or tiered differently?
3. **Identify quickest path to revenue** - What's the fastest way to acquire paying customers?
4. **Define success metrics** - What does success look like at 3 months? 6 months? 12 months?
5. **Spot critical gaps** - What's missing that prevents going to market?
6. **Create actionable roadmap** - Specific, time-bound milestones with clear owner and dependencies

## Output Format

Provide analysis in the following structure:
```
## Strategic Analysis Summary

### 1. MVP Readiness
[Status, timeline, checklist]

### 2. Monetization Recommendation
[Model, pricing, projections]

### 3. Go-to-Market Strategy
[Target, channels, phases]

### 4. 12-Month Roadmap
[Q1, Q2, Q3, Q4 milestones]

### 5. Top Risks & Mitigations
[5 critical risks with plans]

### 6. Financial Projections
[Revenue, burn, breakeven]

### 7. First 100 Days Action Plan
[Day 1-30, Day 31-60, Day 61-100]

### 8. Success Metrics & KPIs
[Trackable metrics for each phase]
```

---

**Created**: December 2024
**For**: Marketing Todo App Strategic Planning
**To Execute**: Use with Project/Product team to validate direction before development prioritization
