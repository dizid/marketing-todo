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
    promptTemplate: `You are a business consultant analyzing a project. Generate a comprehensive executive summary and priority quick-win tasks.

PROJECT DATA:
- App Description: {appDescription}
- Project Goals: {projectGoals}
- Target Audience: {targetAudience}
- Tech Stack: {techStack}
- Progress: {progress}% ({completedTasks}/{totalTasks} tasks completed)
- Completed Categories:
{checklistSummary}

TASK: Generate:
1. A concise executive summary (150-200 words) analyzing project status and key insights
2. Exactly 3-5 priority quick-win tasks with highest impact/effort ratio

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

## Executive Summary
[Write 150-200 word summary here analyzing project status, progress, strengths, and immediate opportunities]

## Priority Quick-Win Tasks

1. [Task Title]
Impact: High/Medium/Low
Effort: High/Medium/Low
Why: [1-2 sentence explanation of why this matters]
Next Steps: [Specific action items]

2. [Task Title]
Impact: High/Medium/Low
Effort: High/Medium/Low
Why: [1-2 sentence explanation of why this matters]
Next Steps: [Specific action items]

[Continue for 3-5 tasks total]

Be specific, actionable, and focus on tasks that will have the biggest impact with reasonable effort.`,

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
        const tasksMatch = responseText.match(/## Priority Quick-Win Tasks\n([\s\S]*?)/)
        const tasksText = tasksMatch ? tasksMatch[1].trim() : ''

        // Parse individual tasks
        const tasks = []
        const taskBlocks = tasksText.split(/^\d+\./m).slice(1) // Split by numbered headers, skip first empty

        for (const block of taskBlocks) {
          const lines = block.trim().split('\n')
          if (lines.length === 0) continue

          const title = lines[0].trim()
          let impact = '', effort = '', why = '', nextSteps = ''

          for (const line of lines.slice(1)) {
            if (line.includes('Impact:')) {
              const match = line.match(/Impact:\s*(\w+)/i)
              impact = match ? match[1] : ''
            } else if (line.includes('Effort:')) {
              const match = line.match(/Effort:\s*(\w+)/i)
              effort = match ? match[1] : ''
            } else if (line.includes('Why:')) {
              why = line.replace(/.*Why:\s*/i, '').trim()
            } else if (line.includes('Next Steps:')) {
              nextSteps = line.replace(/.*Next Steps:\s*/i, '').trim()
            }
          }

          if (title) {
            tasks.push({
              title,
              impact: impact || 'Medium',
              effort: effort || 'Medium',
              why: why || '',
              nextSteps: nextSteps || ''
            })
          }
        }

        return {
          summary: summary || responseText.substring(0, 300),
          tasks: tasks.slice(0, 5) // Limit to 5 tasks
        }
      } catch (error) {
        console.error('Error parsing executive summary response:', error)
        // Return raw response if parsing fails
        return {
          summary: responseText.substring(0, 300),
          tasks: []
        }
      }
    }
  }
}
