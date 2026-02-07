# Launchpilot Overhaul Plan: AI Agents That Actually DO Things

## The Core Problem

The current app is a **passive checklist with a text generator**. Users:
1. Open a task (e.g., "Write Blog Post")
2. Fill out a form (topic, tone, audience)
3. Click "Generate" → get AI-written text
4. **Then have to manually do everything** — copy it, publish it, format it, etc.

The AI generates *suggestions*. It doesn't *execute*.

---

## The New Vision: Agent-Executed Actions

Shift from "AI writes copy for you to use" to **"AI agents plan AND execute real marketing work."**

Instead of a checklist where each item opens a form → generates text, each item becomes an **agent workflow** that:
- Plans the steps needed
- Executes each step (publish, send, create, analyze)
- Reports back with real results (URLs, metrics, artifacts)
- Asks for human approval only at decision points

---

## Architecture Changes

### Current Architecture
```
User → Form → AI generates text → User manually acts
```

### New Architecture
```
User → Configures goal → Agent plans steps → Agent executes → User reviews results
                                ↑                    ↓
                           Agent Store ←── Action Registry
                                ↓
                        Execution Engine (step-by-step with status)
```

### New Directory Structure (additions)
```
src/
├── agents/                          # NEW: Agent system
│   ├── AgentExecutionEngine.js      # Core orchestrator - runs agent workflows
│   ├── AgentActionRegistry.js       # Registry of all executable actions
│   ├── actions/                     # Atomic executable actions
│   │   ├── publishBlogPost.js       # Write + publish blog content
│   │   ├── sendOutreachEmail.js     # Draft + send cold emails
│   │   ├── publishLandingPage.js    # Build + deploy to R2 (upgrade existing)
│   │   ├── createSocialPosts.js     # Generate + schedule social posts
│   │   ├── researchCompetitors.js   # Scrape + analyze competitor data
│   │   ├── analyzeSEO.js            # Check SEO + suggest fixes
│   │   ├── setupEmailSequence.js    # Create automated email sequence
│   │   ├── buildLeadMagnet.js       # Create + host lead magnet
│   │   ├── runABTest.js             # Set up and monitor A/B tests
│   │   └── generateReport.js        # Pull metrics + build report
│   └── workflows/                   # Multi-step agent workflows
│       ├── launchCampaign.js        # Full campaign: research → content → publish → track
│       ├── coldOutreachBlitz.js     # Research leads → personalize → send → follow up
│       ├── contentPipeline.js       # Plan → write → publish → promote → analyze
│       ├── landingPageLaunch.js     # Copy → design → build → publish → optimize
│       └── competitorIntel.js       # Research → analyze → position → report
├── stores/
│   ├── agentStore.js                # NEW: Agent execution state
│   └── ... (existing stores)
├── components/
│   ├── Agents/                      # NEW: Agent UI components
│   │   ├── AgentDashboard.vue       # Overview of all agent runs
│   │   ├── AgentWorkflowView.vue    # Live view of agent executing steps
│   │   ├── AgentStepCard.vue        # Individual step with status
│   │   ├── AgentApprovalGate.vue    # Human-in-the-loop approval point
│   │   ├── AgentOutputViewer.vue    # View artifacts (pages, emails, posts)
│   │   └── AgentHistoryLog.vue      # Past runs + results
│   └── Dashboard/
│       ├── AgentActivityFeed.vue    # NEW: Replace static checklist with live agent feed
│       └── ... (keep existing, refactor progressively)
```

---

## New Pinia Store: `agentStore.js`

```
State:
  - activeAgents[]         # Currently running agent workflows
  - agentHistory[]         # Completed agent runs
  - pendingApprovals[]     # Steps awaiting human approval
  - agentQueue[]           # Queued workflows

Per Agent Run:
  - id                     # Unique run ID
  - workflowId             # Which workflow (e.g., "content-pipeline")
  - status                 # queued | planning | executing | waiting_approval | completed | failed
  - steps[]                # Array of step objects
  - currentStepIndex       # Which step is active
  - artifacts[]            # Output artifacts (URLs, files, content)
  - startedAt / completedAt
  - error                  # If failed

Per Step:
  - id, name, description
  - status                 # pending | in_progress | completed | failed | skipped
  - actionId               # Which action to execute
  - input                  # Data fed to the action
  - output                 # Result from the action
  - requiresApproval       # Boolean - pause for human review?
  - approvalStatus         # pending | approved | rejected
```

---

## Redesigned Task Map → Agent Workflow Map

Replace the passive 4-phase checklist with **action-oriented agent workflows**:

### Phase 1: Foundation (automated research + setup)
| Old Task | New Agent Workflow | What It Actually Does |
|----------|-------------------|----------------------|
| Define Target Audience | **Audience Research Agent** | Analyzes your product, researches similar products' audiences, generates detailed persona with data backing. Saves structured persona to project. |
| Positioning Map | **Positioning Agent** | Researches competitors (scrapes landing pages, pricing pages), generates differentiation matrix, writes positioning statement. |
| Competitor Analysis | **Competitor Intel Agent** | Automated: finds competitors, analyzes their messaging/pricing/features, generates comparison report with strategic recommendations. |

### Phase 2: Build (agents create real assets)
| Old Task | New Agent Workflow | What It Actually Does |
|----------|-------------------|----------------------|
| Set Up Landing Page | **Landing Page Builder Agent** | Generates copy → builds HTML → previews → publishes to R2 → returns live URL. Fully automated with approval gate before publish. |
| Lead Magnet Builder | **Lead Magnet Agent** | Creates PDF/guide content → formats → generates download page → publishes. Returns shareable link. |
| Offer Builder | **Offer Architect Agent** | Analyzes market data → creates pricing strategy → generates offer copy → builds offer page section. |
| Email Sequence | **Email Automation Agent** | Plans sequence (welcome → nurture → sell) → writes each email → formats for copy/paste into email tool. Future: direct integration with email APIs. |

### Phase 3: Launch (agents execute outreach + content)
| Old Task | New Agent Workflow | What It Actually Does |
|----------|-------------------|----------------------|
| Write Blog Post | **Content Publishing Agent** | Researches topic → writes SEO-optimized post → formats with headings/images → publishes (or exports ready-to-publish). |
| Schedule Posts | **Social Campaign Agent** | Generates platform-specific posts → creates image prompts → schedules posts (via Buffer/native API or exports calendar). |
| Cold Outreach | **Outreach Blitz Agent** | Generates personalized email templates → creates follow-up sequences → exports ready-to-send batches. Future: direct send via SMTP. |
| Community Posts | **Community Engagement Agent** | Identifies relevant communities → generates authentic posts per platform (Reddit, HN, Indie Hackers) → exports ready-to-post. |
| Paid Ads | **Ad Campaign Agent** | Generates ad copy variants → creates targeting suggestions → builds campaign structure → exports to platform. |

### Phase 4: Optimize (agents analyze + improve)
| Old Task | New Agent Workflow | What It Actually Does |
|----------|-------------------|----------------------|
| Analytics Setup | **Analytics Agent** | Generates tracking plan → creates event definitions → provides implementation code snippets. |
| Optimize Channels | **Channel Optimizer Agent** | Analyzes which content/channels perform → generates optimization report → suggests resource reallocation. |
| A/B Testing | **A/B Test Agent** | Generates test hypotheses → creates variant copy → tracks results → recommends winners. |
| Sales Funnel | **Funnel Builder Agent** | Maps complete funnel → identifies gaps → generates content for each stage → creates funnel visualization. |

---

## Agent Execution Engine Design

### Core Concepts

**1. Actions** — Atomic, executable operations:
```javascript
// Example: publishBlogPost action
{
  id: 'publish-blog-post',
  name: 'Publish Blog Post',
  execute: async (input, context) => {
    // 1. Generate the blog content via AI
    // 2. Format as HTML
    // 3. Publish to R2 or export
    // 4. Return URL + metadata
    return { url, title, wordCount, publishedAt }
  }
}
```

**2. Workflows** — Sequences of actions with logic:
```javascript
// Example: Content Pipeline workflow
{
  id: 'content-pipeline',
  name: 'Content Publishing Pipeline',
  steps: [
    { action: 'research-topic', requiresApproval: false },
    { action: 'generate-outline', requiresApproval: true },  // User reviews outline
    { action: 'write-full-post', requiresApproval: false },
    { action: 'generate-social-posts', requiresApproval: false },
    { action: 'publish-blog-post', requiresApproval: true },  // User approves before publish
    { action: 'schedule-social-promotion', requiresApproval: false }
  ]
}
```

**3. Approval Gates** — Human-in-the-loop checkpoints:
- Agent pauses at key steps
- Shows user what it's about to do
- User approves, edits, or rejects
- Agent continues or adjusts

**4. Artifacts** — Real outputs from agent execution:
- Published URLs
- Generated documents (HTML, PDF)
- Email drafts ready to send
- Social post content with images
- Reports with data

---

## AI Integration Changes

### Current: Single-shot text generation
```
Prompt → Grok API → Raw text → Display in UI
```

### New: Multi-turn agent reasoning
```
Goal → AI plans steps → Execute step 1 → AI evaluates result → Execute step 2 → ...
```

The AI becomes a **planner + evaluator**, not just a generator:
1. **Planning phase**: Given user's goal + project context, AI decides which actions to take and in what order
2. **Execution phase**: Each action runs, AI evaluates the output quality
3. **Adaptation**: If a step fails or produces poor results, AI adjusts the plan
4. **Reporting**: AI summarizes what was accomplished with metrics

### Enhanced Grok Proxy
The `grok-proxy.cjs` function needs to support:
- **System prompts** for agent role/persona
- **Multi-turn conversations** for planning workflows
- **Structured output** (JSON mode) for action parameters
- **Longer context** for evaluating previous step outputs

---

## Implementation Phases

### Phase A: Foundation (Agent Infrastructure)
1. Create `src/agents/AgentExecutionEngine.js` — core orchestrator
2. Create `src/agents/AgentActionRegistry.js` — action registration
3. Create `src/stores/agentStore.js` — agent state management
4. Update `grok-proxy.cjs` — support system prompts + multi-turn + JSON mode
5. Create base UI: `AgentWorkflowView.vue`, `AgentStepCard.vue`, `AgentApprovalGate.vue`

### Phase B: First Agent Workflows (prove the pattern)
1. **Landing Page Builder Agent** — upgrade existing R2 publish flow into full agent workflow
2. **Content Publishing Agent** — blog post generation → formatting → publish/export
3. **Competitor Intel Agent** — research → analyze → report

### Phase C: Full Agent Suite
1. Build remaining agent actions (outreach, social, email, ads, etc.)
2. Build remaining workflows
3. Replace old task checklist UI with Agent Activity Dashboard

### Phase D: Dashboard Overhaul
1. Replace passive checklist with **Agent Activity Feed** (live status of running agents)
2. **Results Dashboard** showing real artifacts produced
3. **Approval Queue** for pending human decisions
4. Keep milestone tracking but tie to agent-produced results (real URLs, real emails sent)

---

## What Stays, What Goes, What Changes

### Keep (working well)
- Supabase auth + database layer
- Stripe subscription system
- R2 publishing infrastructure (upgrade to agent action)
- Project/onboarding stores (extend, don't replace)
- Quota system (extend to cover agent runs)
- Vue 3 + Vite + Tailwind stack

### Transform (refactor into agent system)
- Task configs → Agent workflow definitions
- MiniAppShell + form pattern → Agent configuration + approval gates
- AIPanel → Agent step execution view
- Task recommendation engine → Agent workflow recommendation
- Task dependency map → Agent workflow dependency map

### Remove (after agent equivalents exist)
- Static checklist UI (progressive replacement)
- Individual MiniApp components (replaced by generic AgentWorkflowView)
- Config-driven form approach (replaced by agent-driven execution)

### Add (new)
- Agent execution engine
- Agent action registry + atomic actions
- Agent store (state management)
- Agent UI components
- Multi-turn AI conversations
- Artifact management (URLs, documents, reports)
- Approval gate system

---

## Key Design Principles

1. **Agents DO, not just SAY** — Every agent workflow must produce a real artifact (URL, document, email draft, report) not just text advice.

2. **Human-in-the-loop at decision points** — Agents execute autonomously but pause at high-stakes moments (publishing, sending, spending money).

3. **Progressive replacement** — Don't rip out the old system all at once. Build agent workflows alongside existing tasks, then swap the UI.

4. **Composable actions** — Actions are atomic and reusable across workflows. The "generate blog post" action is used in both "Content Pipeline" and "Launch Campaign" workflows.

5. **Real status tracking** — Users see exactly what the agent is doing right now, what it's done, and what's next. No black box.

6. **Fail gracefully** — If an agent step fails, it reports what went wrong, suggests alternatives, and doesn't lose previous work.

---

## Questions to Resolve Before Building

1. **Email sending**: Direct SMTP integration or export-to-clipboard for now?
2. **Social posting**: Direct API integration (needs OAuth per platform) or export-ready format?
3. **Ad platforms**: Integration with Google/Meta ads APIs or campaign structure export?
4. **Competitor research**: Web scraping approach or AI-powered analysis from user-provided URLs?
5. **Content publishing**: R2 only or also integrations with WordPress/Ghost/Medium?
