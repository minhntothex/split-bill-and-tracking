Use:
- context-gathering
- issue-analysis

# 02 Analyze Prompt

Task:

Analyze exactly one Issue Intake Brief.

Required input: `tmp/workflow/dev_01-issue.md`

Read:

* `.codex/AGENTS.md`
* `.codex/docs/MVP_V0.md`
* `.codex/docs/PROD_SPEC.md`
* `.codex/DESIGN.md` if UI work is involved

Use available repository context and tooling when needed.

Do not write code.

Rules:

* Analyze only the selected issue.
* Do not broaden scope.
* Do not redesign unrelated UI.

Output:

# Issue Analysis

## Selected Issue
- Title:
- Scope:

## Relevant Existing Implementation
Relevant files/components/services/APIs only.

## Gap Analysis
What is missing for this issue only.

## Reusable Existing Code
Existing files/functions/components/services to reuse.

## UI Impact
UI impact or "No UI impact".

## Validation Impact
Relevant validation/schema impact.

## Test Impact
Relevant Jest test impact.

## Risks
Real implementation risks/blockers only.

## Files Likely To Change
Likely affected files only.

## Ready for Planning
Yes/No
