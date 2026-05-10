Use:
- verification-before-completion
- systematic-debugging

# 05 Review Prompt

Task:

Review the implementation for exactly one GitHub issue.

Required input:

* `tmp/workflow/dev_01-issue.md`
* `tmp/workflow/dev_02-analyze.md`
* `tmp/workflow/dev_03-plan.md`
* Current local changes, or committed branch diff against main

Read:

* `.codex/AGENTS.md`
* `.codex/docs/MVP_V0.md`
* `.codex/docs/PROD_SPEC.md`
* `.codex/DESIGN.md` if UI changes are involved

Use available repository context and tooling when needed.

Do not rewrite code unless explicitly asked.

Rules:

* Review only the selected issue.
* Verify implementation against the approved plan.
* Do not broaden scope.
* Do not redesign unrelated UI.
* Prefer existing repo patterns.
* If no local changes exist, compare current branch diff against main.

Output:

# Issue Review

## Issue
- Title:

## Summary
Pass/fail summary.

## Scope Check
Confirm whether implementation stayed within the selected issue.

## Acceptance Criteria Check
Check each acceptance criterion.

## Code Review
- Correctness:
- Maintainability:
- TypeScript:
- Validation:
- Access control:
- Jest tests:

## Blocking Issues
Blocking issues only.

## Non-blocking Suggestions
Minor improvements only.

## Final Verdict
Ready / Not Ready
