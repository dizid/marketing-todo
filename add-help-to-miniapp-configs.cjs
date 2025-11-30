#!/usr/bin/env node

/**
 * Script to add help schema to mini-app config files
 * by pulling from unifiedTasks.js
 */

const fs = require('fs');
const path = require('path');

const configDir = '/home/marc/DEV/sales/src/components/TaskMiniApps/configs';
const unifiedTasksPath = '/home/marc/DEV/sales/src/configs/unifiedTasks.js';

// Read unifiedTasks.js to extract help content
let unifiedContent = fs.readFileSync(unifiedTasksPath, 'utf-8');

// Create a mapping of task ID to help content
const helpMap = {};

// Extract help from unifiedTasks
const taskMatches = unifiedContent.matchAll(/help:\s*({[\s\S]*?commonMistakes:[\s\S]*?}\s*}\s*)/g);
for (const match of taskMatches) {
  const helpStr = match[1];
  // Find the associated task ID by looking backwards for id: property
  const beforeMatch = unifiedContent.substring(0, match.index);
  const idMatch = beforeMatch.match(/id:\s*['"]([^'"]+)['"]/);
  if (idMatch) {
    const taskId = idMatch[1];
    try {
      // Extract the help object
      const helpStartIdx = match.index;
      const helpEndIdx = match.index + match[0].length;
      const helpText = unifiedContent.substring(helpStartIdx, helpEndIdx);

      // Parse the JSON
      const jsonMatch = helpText.match(/help:\s*({[\s\S]*?})\s*[,}]/);
      if (jsonMatch) {
        const helpObj = eval('(' + jsonMatch[1] + ')');
        helpMap[taskId] = helpObj;
      }
    } catch (e) {
      // Skip if we can't parse
    }
  }
}

// Map config file names to task IDs
const configMap = {
  'defineAudience.config.js': 'define-audience',
  'generatePosts.config.js': 'generate-posts',
  'webinar.config.js': 'webinar-plan',
  'feedback.config.js': 'feedback-collection',
  'publishUpdates.config.js': 'publish-updates',
  'iterateFeatures.config.js': 'iterate-features',
  'outreach.config.js': 'acq-2',
};

// Process each config file
console.log('\n✓ Adding help to mini-app configs...\n');

Object.entries(configMap).forEach(([filename, taskId]) => {
  const filePath = path.join(configDir, filename);

  if (!fs.existsSync(filePath)) {
    console.log(`  skipped           ${filename} (file not found)`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf-8');

  // Skip if already has help
  if (content.includes('help:')) {
    console.log(`  already has help  ${filename}`);
    return;
  }

  // Get help for this task
  const help = helpMap[taskId];
  if (!help) {
    console.log(`  no help found     ${filename} (task: ${taskId})`);
    return;
  }

  // Format help as JSON string with proper indentation
  const helpJson = JSON.stringify(help, null, 2)
    .split('\n')
    .map(line => '  ' + line)
    .join('\n');

  // Add help before the closing brace
  const updatedContent = content.replace(/\}$/, `,\n\n  help: ${helpJson}\n}`);

  fs.writeFileSync(filePath, updatedContent, 'utf-8');
  console.log(`  added help        ${filename}`);
});

console.log('\n✓ Complete!\n');
