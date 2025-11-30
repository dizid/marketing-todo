#!/usr/bin/env node

/**
 * Script to add help schema to all remaining task config files
 *
 * This script:
 * 1. Finds all .config.js files in /src/configs/
 * 2. Adds 'help' object with examples and commonMistakes (if missing)
 * 3. Writes back to each file
 */

const fs = require('fs');
const path = require('path');

const configDir = '/home/marc/DEV/sales/src/configs';

// Generic help content for different task types
const getHelpForTaskType = (taskName, taskId) => {
  // Generic help for most tasks
  return {
    examples: [
      {
        scenario: 'Typical use case for ' + taskName,
        input: { example: 'sample input for this task' },
        output: 'Expected output showing how this task helps your marketing'
      },
      {
        scenario: 'Advanced use of ' + taskName,
        input: { example: 'more complex input' },
        output: 'Demonstrates how this task creates value for your business'
      }
    ],
    commonMistakes: [
      'Being too vague or generic in your inputs',
      'Not providing enough context or details',
      'Forgetting to specify your target audience',
      'Not being clear about your marketing goals',
      'Ignoring the specific requirements of this task'
    ]
  };
};

// Function to add help to a single file
const addHelpToFile = (filePath) => {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');

    // Skip if already has help
    if (content.includes('help:')) {
      return { file: path.basename(filePath), status: 'already has help' };
    }

    // Skip if doesn't export a task
    if (!content.includes('export const')) {
      return { file: path.basename(filePath), status: 'skipped (no export)' };
    }

    // Extract task name from file name (e.g., abTestIdeas.config.js -> A/B Test Ideas)
    const fileName = path.basename(filePath, '.config.js');
    const taskName = fileName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();

    // Extract task id from export
    const idMatch = content.match(/id:\s*['"]([^'"]+)['"]/);
    const taskId = idMatch ? idMatch[1] : fileName;

    const help = getHelpForTaskType(taskName, taskId);

    // Format help as JSON
    const helpJson = JSON.stringify(help, null, 4)
      .split('\n')
      .map(line => '  ' + line)
      .join('\n');

    // Add help before the closing brace
    const updatedContent = content.replace(/\}$/, `,\n\n  help: ${helpJson}\n}`);

    fs.writeFileSync(filePath, updatedContent, 'utf-8');
    return { file: path.basename(filePath), status: 'added help' };
  } catch (err) {
    return { file: path.basename(filePath), status: 'error: ' + err.message };
  }
};

// Main execution
const files = fs.readdirSync(configDir)
  .filter(f => f.endsWith('.config.js'))
  .sort();

console.log(`\n✓ Adding help schema to ${files.length} config files...\n`);

const results = [];
files.forEach(file => {
  const result = addHelpToFile(path.join(configDir, file));
  results.push(result);
  console.log(`  ${result.status.padEnd(20)} ${result.file}`);
});

const addedCount = results.filter(r => r.status === 'added help').length;
const skippedCount = results.filter(r => r.status.includes('skipped')).length;
const alreadyCount = results.filter(r => r.status === 'already has help').length;

console.log(`\n✓ Complete!`);
console.log(`  - Added help: ${addedCount}`);
console.log(`  - Already had help: ${alreadyCount}`);
console.log(`  - Skipped: ${skippedCount}`);
