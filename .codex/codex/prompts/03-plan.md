Use:
- executing-plans

# 03 Plan Prompt

Task:

Create a minimal implementation plan for exactly one analyzed issue.

Required input:

* `tmp/workflow/dev_01-issue.md`
* `tmp/workflow/dev_02-analyze.md`

Read:

* `.codex/AGENTS.md`
* `.codex/docs/MVP_V0.md`
* `.codex/docs/PROD_SPEC.md`
* `.codex/DESIGN.md` if UI work is involved

Use available repository context when needed.

Do not write code.

Rules:

* Plan only one issue.
* Keep the plan minimal.
* Avoid unnecessary abstractions.
* Do not expand scope.

Output:

```md
# Minimal Implementation Plan

## Issue
- Title:
- Goal:

## Scope
Exactly what will be implemented.

## Non-goals
What will not be touched.

## Implementation Steps
Minimal numbered steps only.

## Files To Create / Change
Expected files only.

## API Changes
Routes/methods if any.

## UI Changes
Affected pages/components if any.

## Data / Schema Changes
Collections/indexes if any.

## Validation
Relevant validation/schema changes if any.

## Logic Changes
Relevant functions/services if any.

## Jest Tests
Relevant tests to add/update if any.

## Verification
Minimal verification steps.

## Done Criteria
Checkable completion criteria.
```