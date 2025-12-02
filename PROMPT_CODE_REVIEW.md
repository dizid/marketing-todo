# Code Architecture Quality Analysis Prompt

## Quick Architecture Review

Analyze the code architecture quality focusing on:

### 1. **Layering & Boundaries**
- Are layers properly separated? (presentation, application, domain, infrastructure)
- Do dependencies flow inward?
- Are cross-layer dependencies justified?

### 2. **SOLID Principles**
- Single Responsibility: Clear module purpose?
- Dependency Inversion: Abstractions vs implementations?
- Interface Segregation: Appropriately sized contracts?

### 3. **Code Organization**
- Logical folder structure and naming conventions
- File sizes and component complexity
- Related code co-location

### 4. **State Management & Data Flow**
- Store modularity and normalization
- Action complexity and orchestration
- Data coupling between modules

### 5. **Reusability**
- Composables/utilities with single responsibility
- Circular dependencies between modules
- Duplication that could be abstracted

### 6. **Dependency Management**
- Import organization and clarity
- Circular dependencies
- Module coupling

### 7. **Testability**
- Dependency injection patterns
- Test coverage gaps
- Mock/stub complexity

### 8. **Anti-Patterns**
- God objects or oversized components
- Feature envy or inappropriate intimacy
- Leaky abstractions
- Workarounds or hacks (TODOs, FIXMEs)

---

## Output Format

Provide a concise report with:

1. **Summary** (3-5 key findings)
2. **Quality Score** (0-100)
3. **Top Strengths** (2-3 items)
4. **Critical Issues** (problems that block scalability/maintainability)
5. **Recommendations** (max 5, ordered by impact/effort ratio)
   - Issue description
   - Impact: High/Medium/Low
   - Effort: High/Medium/Low
   - Quick refactoring approach
6. **Metrics** (cyclomatic complexity, coupling, test coverage)
