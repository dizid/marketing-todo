# Code Review Checklist

Use this checklist when reviewing pull requests or committing new code to ensure quality and consistency.

## Architecture Quality Framework

This section provides a structured approach to analyzing code architecture quality. Use this framework to conduct deeper reviews of significant changes.

### 1. **Layering & Boundaries**
- Are layers properly separated? (presentation, application, domain, infrastructure)
- Do dependencies flow inward?
- Are cross-layer dependencies justified?
- [ ] Layer separation maintained
- [ ] Inward dependency flow
- [ ] No inappropriate cross-layer calls

### 2. **SOLID Principles**
- Single Responsibility: Clear module purpose?
- Dependency Inversion: Abstractions vs implementations?
- Interface Segregation: Appropriately sized contracts?
- [ ] Single Responsibility: Each module has clear purpose
- [ ] Open/Closed: Extensible without modification
- [ ] Liskov Substitution: Implementations are substitutable
- [ ] Interface Segregation: Properly sized contracts
- [ ] Dependency Inversion: Depends on abstractions not concretions

### 3. **Reusability & Duplication**
- Composables/utilities with single responsibility?
- Circular dependencies between modules?
- Duplication that could be abstracted?
- [ ] No circular dependencies
- [ ] Duplication identified and abstracted
- [ ] Reusable code in utilities/composables
- [ ] DRY principle followed

### 4. **Testability**
- Dependency injection patterns used?
- Test coverage gaps?
- Mock/stub complexity?
- [ ] Dependencies injected properly
- [ ] Components/functions easily mockable
- [ ] Adequate test coverage for changes
- [ ] No tight coupling to external services

### 5. **Anti-Patterns**
- [ ] No god objects or oversized components
- [ ] No feature envy (inappropriate data access)
- [ ] No leaky abstractions
- [ ] No workarounds without issues (TODOs should link to issues)

---

## Architecture & Design

### Configuration-Driven Pattern
- [ ] New tasks use config format (not individual components)?
- [ ] Config follows `taskConfigSchema` structure?
- [ ] Single source of truth for task definition (one config file)?
- [ ] No duplicate task definitions across files?

### Separation of Concerns
- [ ] Components only handle presentation?
- [ ] Business logic in services?
- [ ] State management via Pinia stores?
- [ ] Utilities for reusable functions?

### Mini-App Framework
- [ ] Uses `MiniAppShell` for orchestration (if task has AI)?
- [ ] Composed from FormBuilder, AIPanel, OutputSection?
- [ ] Wrapper component correctly connected to store?
- [ ] Mini-app registered in `miniAppRegistry.js`?

---

## Code Quality

### No Duplication
- [ ] Form fields not repeated across tasks?
- [ ] Validation logic centralized in `formValidation.js`?
- [ ] AI prompts don't repeat similar patterns?
- [ ] Response parsing code not duplicated?

### Naming Conventions
- [ ] Variables: camelCase and descriptive?
- [ ] Functions: clear verb + noun (e.g., `validateEmail`, `generatePosts`)?
- [ ] Components: PascalCase (e.g., `MiniAppShell`)?
- [ ] Files: kebab-case (e.g., `mini-app-shell.vue`)?
- [ ] Config IDs: snake_case, task-prefixed (e.g., `social-1`)?
- [ ] Field IDs: snake_case, meaningful (e.g., `audience_overview`)?

### Code Style
- [ ] Consistent indentation (2 spaces)?
- [ ] No trailing whitespace?
- [ ] Single vs double quotes consistent?
- [ ] Comments explain "why", not "what"?
- [ ] No commented-out code left behind?

---

## Form Configuration

### Field Definitions
- [ ] All required fields have `required: true`?
- [ ] Field `type` is valid (text, email, number, textarea, select, checkboxes, radio)?
- [ ] Field `id` is unique within form?
- [ ] Field `label` is user-friendly?
- [ ] Complex fields have `description` help text?
- [ ] Select/checkboxes/radio have options array?
- [ ] Number fields have `min`/`max` if applicable?
- [ ] Textarea has reasonable `rows` setting?

### Validation
- [ ] Required fields validated on form submit?
- [ ] Email fields use email validator?
- [ ] Number fields have min/max constraints?
- [ ] Custom validators have clear error messages?
- [ ] Validation errors displayed to user (not just console)?
- [ ] Form can't be submitted with validation errors?

### Accessibility
- [ ] All fields have associated labels?
- [ ] Required fields marked with `*`?
- [ ] Error messages associated with fields?
- [ ] Logical tab order for keyboard navigation?

---

## AI Generation Configuration

### Prompt Template
- [ ] Template uses valid placeholder syntax: `{field_id}`?
- [ ] All placeholders correspond to form field IDs or context?
- [ ] Instructions clear and unambiguous?
- [ ] Format examples included (if structured output expected)?
- [ ] Platform-specific constraints documented (if applicable)?
- [ ] Temperature (0.8) appropriate for task type?
- [ ] Max tokens reasonable for expected output length?

### Response Parsing
- [ ] Parser handles empty/null responses?
- [ ] Parser validates response structure?
- [ ] Error messages user-friendly if parsing fails?
- [ ] Parsed output matches expected format?
- [ ] No assumption about AI response format without validation?

### Context Provider
- [ ] Context function has try-catch for errors?
- [ ] Gracefully continues if context unavailable?
- [ ] All provided values are relevant to prompt?
- [ ] No sensitive data leaking in context?

### Error Handling
- [ ] API errors caught and handled?
- [ ] User-friendly error messages (not stack traces)?
- [ ] "Retry" option available for failed generations?
- [ ] Timeout handling for slow/stuck requests?
- [ ] Logged for debugging (with console.log)?

---

## State Management & Persistence

### Pinia Store
- [ ] Data flows through projectStore?
- [ ] Auto-save implemented (watch watcher)?
- [ ] Form data auto-saves on input?
- [ ] AI output saved when "Use This" clicked?
- [ ] Results saved when items added?

### Database
- [ ] Data persists to Supabase on save?
- [ ] Load from Supabase on app init?
- [ ] Handles offline mode gracefully?
- [ ] No duplicate saves (debouncing)?
- [ ] Database schema matches data structure?

### Component Props & Events
- [ ] Props have type definitions?
- [ ] Props have default values where appropriate?
- [ ] Events emitted with clear names and payloads?
- [ ] Two-way binding used correctly (v-model)?
- [ ] No prop mutations (immutability)?

---

## User Experience

### Feedback & Loading States
- [ ] Loading indicators while API calls in progress?
- [ ] Error messages specific and actionable?
- [ ] Success messages shown on completion?
- [ ] Disabled states for invalid forms (Generate button)?
- [ ] Progress indicator for long-running operations?

### Form Usability
- [ ] Form fields in logical order?
- [ ] Related fields grouped together?
- [ ] Clear visual hierarchy (headers, spacing)?
- [ ] Placeholder text helpful but not intrusive?
- [ ] Optional fields clearly marked?

### Output Display
- [ ] Results formatted readably?
- [ ] Copy to clipboard button easy to find?
- [ ] Export functionality working?
- [ ] Edit/delete options available?
- [ ] Timestamp for when result generated?

---

## Performance

### Bundle Size
- [ ] No large libraries imported unnecessarily?
- [ ] Lazy-loading used for heavy components?
- [ ] Unused code removed before commit?
- [ ] Images optimized and cached?

### Runtime Performance
- [ ] No unnecessary re-renders (v-if vs v-show)?
- [ ] Computed properties for derived state?
- [ ] API calls debounced/throttled?
- [ ] Large lists use virtual scrolling (if needed)?
- [ ] No console.log spam in production?

### API Efficiency
- [ ] Not making duplicate API calls?
- [ ] Response caching implemented (if needed)?
- [ ] Batch requests when possible?
- [ ] Reasonable timeouts for long requests?

---

## Testing & Debugging

### Manual Testing Checklist
- [ ] Form renders without errors?
- [ ] All fields accept expected input?
- [ ] Required fields validated correctly?
- [ ] AI generation succeeds?
- [ ] Response parsing works correctly?
- [ ] Results save to store?
- [ ] Results persist to database?
- [ ] Can reload and data is there?
- [ ] Export to CSV/JSON works?
- [ ] Edit/delete results works?

### Browser Console
- [ ] No JavaScript errors?
- [ ] No console warnings (except expected ones)?
- [ ] Console.log statements have meaningful prefixes (e.g., `[AIPanel]`)?
- [ ] No dangling debug code?

### Different Browsers
- [ ] Chrome/Chromium works?
- [ ] Firefox works?
- [ ] Safari works?
- [ ] Mobile responsive?

### Different Data Scenarios
- [ ] Works with long text input?
- [ ] Works with special characters?
- [ ] Works with empty optional fields?
- [ ] Works with edge case numbers (0, very large)?
- [ ] AI handles various response lengths?

---

## Documentation

### Code Comments
- [ ] Complex logic is commented?
- [ ] Configuration options documented?
- [ ] Edge cases explained?
- [ ] Comments are accurate (updated with code)?

### README/Guides
- [ ] Task definition guide updated if new field types?
- [ ] Architecture docs updated if patterns change?
- [ ] Inline JSDoc comments for exported functions?
- [ ] Function parameters documented?

### Commit Message
- [ ] Clear description of what changed?
- [ ] Explains "why" not just "what"?
- [ ] References issue/ticket if applicable?
- [ ] Follows commit message convention?

---

## Security

### Input Validation
- [ ] All user input validated before use?
- [ ] No SQL injection risks (using Supabase properly)?
- [ ] No XSS risks (Vue auto-escapes by default)?
- [ ] No CSRF tokens needed (Supabase handles)?

### API Keys
- [ ] API keys not committed to repo?
- [ ] Using `.env` files correctly?
- [ ] Sensitive data not logged?
- [ ] API key rotation strategy in place?

### Authentication
- [ ] Supabase auth properly configured?
- [ ] Protected routes require auth?
- [ ] User can only access their data?
- [ ] Logout works correctly?

---

## Migration-Specific (Refactoring Tasks)

### Legacy Component Removal
- [ ] Old component not imported anywhere else?
- [ ] No broken references in codebase?
- [ ] Tests updated or removed?
- [ ] Routes updated to use new component?

### Configuration Migration
- [ ] All task data preserved in new config?
- [ ] Form fields match original component?
- [ ] AI prompts updated to match new system?
- [ ] Response parsing handles same format?

---

## Checklist for PR Authors

Before requesting review:

- [ ] Code follows style guide?
- [ ] No console.log debugging statements left?
- [ ] No commented-out code?
- [ ] All tests pass locally?
- [ ] Manual testing completed?
- [ ] Commit messages clear and descriptive?
- [ ] No changes to unrelated files?
- [ ] Documentation updated?

---

## Quick Review Workflow

1. **Read the commit message** - Understand intent
2. **Look at file changes** - Spot obvious issues
3. **Check architecture** - Is it following patterns?
4. **Review form config** - Correct schema?
5. **Review AI config** - Valid template? Good parser?
6. **Check persistence** - Data saved correctly?
7. **Test manually** - Run the code locally
8. **Final check** - Anything worth discussing?

---

## Common Issues to Catch

❌ **Config Issues**
- Missing required fields in schema
- Invalid field types
- Placeholder mismatches (template vs form)
- Response parser assumes format

❌ **Component Issues**
- Not using MiniAppShell
- Hard-coded values instead of config
- Missing event emitters
- Props not typed

❌ **Store Issues**
- Data not saving to store
- Store not connected to component
- Mutations instead of actions
- Race conditions in async operations

❌ **Performance Issues**
- Unnecessary watches
- Re-fetching data
- Large bundle imports
- Unoptimized images

❌ **UX Issues**
- No loading states
- Unclear error messages
- Required fields not marked
- No success feedback

---

## Approval Criteria

A PR is approved when:

✅ All items in relevant sections checked
✅ No blocking issues found
✅ Code follows project patterns
✅ Tests pass and coverage maintained
✅ Manual testing completed
✅ Documentation updated
✅ Commit messages clear

---

## Questions During Review?

- Ask the author for clarification
- Link to relevant docs/architecture
- Suggest alternative approaches
- Reference similar code elsewhere in project
- Be constructive and encouraging!

---

## Post-Merge

- [ ] Monitor for errors in logs?
- [ ] Check metrics for regressions?
- [ ] Collect user feedback?
- [ ] Follow up on any TODOs?
