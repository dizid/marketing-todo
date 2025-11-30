/**
 * Executive Summary & Priority Tasks Configuration
 *
 * Configuration for AI-generated executive summary with priority quick-win tasks
 * This uses the centralized generateAIContent() service for quota tracking
 */

export const executiveSummaryConfig = {
  id: 'executive-summary',
  name: 'Executive Summary & Priority Tasks',
  description: 'Get an AI-powered executive summary with 3-5 priority quick-win tasks for your project',

  // Freemium model - Free tier task (used frequently by all users)
  tier: 'free',

  // AI Generation configuration - uses centralized quota tracking
  aiConfig: {
    promptTemplate: `You are a strategic business consultant performing ULTRA-DEEP THINKING analysis. Your task is to provide comprehensive executive summary and priority quick-win tasks based on the project data below.

PROJECT DATA:
- App Description: {appDescription}
- Project Goals: {projectGoals}
- Target Audience: {targetAudience}
- Tech Stack: {techStack}
- Progress: {progress}% ({completedTasks}/{totalTasks} tasks completed)
- Completed Categories:
{checklistSummary}

EXECUTIVE SUMMARY REQUIREMENTS:
Generate a comprehensive 150-200 word executive summary that:
1. Analyzes current project status and momentum
2. Identifies key strengths and progress made
3. Highlights critical gaps or blockers
4. Recommends immediate strategic priorities
5. Shows understanding of business fundamentals (market, audience, competition)

PRIORITY TASKS REQUIREMENTS:
Generate exactly 3-5 priority quick-win tasks that:
1. Have the highest impact/effort ratio (Quick Wins = High Impact + Low Effort)
2. Are immediately actionable (can start today/tomorrow)
3. Drive measurable business value
4. Address critical gaps in the current progress
5. Consider market timing and competitive advantage

CRITICAL FORMATTING - YOUR RESPONSE MUST FOLLOW THIS STRUCTURE EXACTLY:

## Executive Summary
[Write 150-200 word comprehensive analysis here covering: current status, momentum, strengths, gaps, and strategic recommendations]

## Priority Quick-Win Tasks

1. [Specific, actionable task title]
Impact: High/Medium/Low
Effort: High/Medium/Low
Why: [2-3 sentence explanation of business value and why this matters NOW]
Next Steps: [Numbered list of specific 1-3 concrete action items]

2. [Specific, actionable task title]
Impact: High/Medium/Low
Effort: High/Medium/Low
Why: [2-3 sentence explanation of business value and why this matters NOW]
Next Steps: [Numbered list of specific 1-3 concrete action items]

3. [Continue for 3-5 tasks total]

QUALITY STANDARDS:
- Be SPECIFIC and ACTIONABLE (not vague)
- Focus on IMMEDIATE IMPACT (not long-term)
- Prioritize HIGH IMPACT / LOW EFFORT combinations
- Show DEEP UNDERSTANDING of the business context
- Provide CLEAR JUSTIFICATION for each task
- Make recommendations that are ACHIEVABLE within 1-2 weeks`,

    temperature: 0.7,
    maxTokens: 2500,

    // Get project data for context
    contextProvider: () => {
      return {
        appDescription: 'Your product/service',
        projectGoals: 'Grow and improve product',
        targetAudience: 'Early adopters',
        techStack: 'Modern web stack',
        progress: '0',
        completedTasks: '0',
        totalTasks: '0',
        checklistSummary: '(No data available)'
      }
    },

    // Parse response into structured summary and tasks
    parseResponse: (responseText) => {
      try {
        // Extract summary section
        const summaryMatch = responseText.match(/## Executive Summary\n([\s\S]*?)(?=## Priority Quick-Win Tasks|\Z)/)
        const summary = summaryMatch ? summaryMatch[1].trim() : ''

        // Extract priority tasks section
        const tasksMatch = responseText.match(/## Priority Quick-Win Tasks\n([\s\S]*)/)
        const tasksText = tasksMatch ? tasksMatch[1].trim() : ''

        // Parse individual tasks - improved parsing for multi-line fields
        const tasks = []
        const taskBlocks = tasksText.split(/^\d+\./m).slice(1) // Split by numbered headers, skip first empty

        for (const block of taskBlocks) {
          const lines = block.trim().split('\n').filter(line => line.trim())
          if (lines.length === 0) continue

          const title = lines[0].trim()
          let impact = '', effort = '', why = '', nextSteps = ''

          // Parse fields - handle multi-line values
          let currentField = null
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i]

            if (line.includes('Impact:')) {
              const match = line.match(/Impact:\s*(\w+)/i)
              impact = match ? match[1] : ''
              currentField = null
            } else if (line.includes('Effort:')) {
              const match = line.match(/Effort:\s*(\w+)/i)
              effort = match ? match[1] : ''
              currentField = null
            } else if (line.includes('Why:')) {
              why = line.replace(/.*Why:\s*/i, '').trim()
              currentField = 'why'
            } else if (line.includes('Next Steps:')) {
              nextSteps = line.replace(/.*Next Steps:\s*/i, '').trim()
              currentField = 'nextSteps'
            } else if (currentField === 'why' && line.trim()) {
              // Append to why if it's a continuation
              if (!line.match(/^(Impact|Effort|Next Steps):/i)) {
                why += ' ' + line.trim()
              }
            } else if (currentField === 'nextSteps' && line.trim()) {
              // Append to nextSteps if it's a continuation
              if (!line.match(/^(Impact|Effort|Why):/i)) {
                nextSteps += ' ' + line.trim()
              }
            }
          }

          if (title) {
            tasks.push({
              title,
              impact: impact || 'Medium',
              effort: effort || 'Medium',
              why: why.trim() || '',
              nextSteps: nextSteps.trim() || ''
            })
          }
        }

        console.log('[ExecutiveSummary] Parsed tasks:', tasks)

        return {
          summary: summary || responseText.substring(0, 300),
          tasks: tasks.slice(0, 5) // Limit to 5 tasks
        }
      } catch (error) {
        console.error('Error parsing executive summary response:', error)
        console.error('Response text:', responseText)
        // Return raw response if parsing fails
        return {
          summary: responseText.substring(0, 300),
          tasks: []
        }
      }
    }
  },

  help: {
    examples: [
      {
        scenario: 'Early-stage SaaS with 25% progress, strong user research',
        input: { progress: '25%', completedTasks: '8/32', strongAreas: ['user research', 'landing page'], gaps: ['analytics', 'paid acquisition'] },
        output: 'Executive summary highlighting strong foundation in understanding customer needs and clear value proposition, identifying critical gap in tracking user behavior and conversion metrics. Priority tasks: 1) Set up Google Analytics with conversion tracking (High Impact/Low Effort), 2) Create first paid ad campaign to test messaging (High Impact/Medium Effort), 3) Build email capture flow on landing page (High Impact/Low Effort).'
      },
      {
        scenario: 'Launched product with 60% progress, low engagement',
        input: { progress: '60%', completedTasks: '19/32', strongAreas: ['product', 'content'], gaps: ['user activation', 'retention'] },
        output: 'Executive summary noting solid product-market fit foundation but concerning activation and retention metrics. Strategic priority shift from acquisition to engagement needed. Priority tasks: 1) Implement onboarding checklist to drive first action (High Impact/Low Effort), 2) Set up behavioral email triggers for inactive users (High Impact/Medium Effort), 3) Build feature usage dashboard to identify drop-off points (Medium Impact/Low Effort).'
      }
    ],
    commonMistakes: [
      'Taking recommendations as gospel - AI suggestions are starting points, not commandments. Evaluate each recommendation against your specific business context and constraints.',
      'Ignoring your own intuition - AI says do X, but your gut says Y. Trust your domain knowledge. Use AI insights to challenge assumptions, not replace judgment.',
      'Not customizing input data - leaving fields blank or using generic descriptions gives generic advice. Provide specific, detailed information for tailored recommendations.',
      'Trying to tackle all priority tasks simultaneously - getting 5 priority tasks and starting all of them. Focus on completing 1-2 tasks fully before starting others.',
      'Never regenerating - running this once at project start and never again. Regenerate monthly as your progress and situation changes for updated priorities.',
      'Not tracking which recommendations worked - implementing suggestions but never measuring results. Track outcomes to learn which AI recommendations actually drive impact for your business.'
    ]
  }
}
