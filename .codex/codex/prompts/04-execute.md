Use:
- executing-plans
- test-driven-development

# 04 Execute Prompt

Task:

Implement exactly one approved Minimal Implementation Plan.

Required input:

* `tmp/workflow/dev_01-issue.md`
* `tmp/workflow/dev_02-analyze.md`
* `tmp/workflow/dev_03-plan.md`

Read before implementation:

* `.codex/AGENTS.md`
* `.codex/docs/MVP_V0.md`
* `.codex/docs/PROD_SPEC.md`

Optional UI context when relevant:

* `.codex/DESIGN.md`

Implementation Rules:

* Implement only the selected issue.
* Follow the approved plan exactly.
* Keep implementation minimal and production-ready.
* Do not implement adjacent GitHub issues.
* Do not expand scope beyond the approved plan.
* Do not refactor unrelated files.
* Do not redesign unrelated UI.

Architecture Rules:

* Keep business logic separate from UI.
* Keep components small and composable.
* Prefer server-side validation and access checks.
* Prefer reusable domain logic over duplicated logic.
* Avoid unnecessary abstractions.
* Avoid premature optimization.

UI Rules:

* Use shadcn/ui components when suitable.
* Prefer Radix primitives for interactions.
* Keep UI mobile-first and touch-friendly.
* Prefer practical and readable layouts.
* Keep spacing and typography consistent.
* Keep dialogs and forms compact on mobile.
* Keep animations minimal and purposeful.
* Avoid decorative or marketing-style UI patterns.

Validation & Access Rules:

* Use Zod for API validation when API input is involved.
* Enforce member-only Trip access for Trip-scoped APIs.
* Return consistent API error structures.

Testing Rules:

* Use Jest for all tests.
* Do not introduce Vitest or another test framework.
* Add or update tests only when relevant to this issue.
* Prefer focused tests for changed business logic.

Must Not:

* Do not introduce unrelated dependencies.
* Do not add unapproved features.
* Do not add placeholder implementations.
* Do not leave dead code.
* Do not add unnecessary animations or visual effects.

Before finishing:

* Run or describe the relevant TypeScript verification command.
* Run or describe the relevant Jest verification command.
* Check TypeScript concerns.
* Check tests relevant to the issue.
* Summarize changed files.
* Summarize verification results.
* Summarize any deviations from the approved plan.
