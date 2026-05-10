Do not use any skills.

# 01 Collect Prompt

Task:

Collect exactly one GitHub issue and convert it into an Issue Intake Brief.

Input options:

* A GitHub issue URL
* A GitHub issue number
* A pasted GitHub issue body
* A short user-provided task description

If given a GitHub issue URL or number:

* Use available GitHub tooling to read the issue.
* If using `gh issue view`, use this argument order:
  `gh issue view --repo minhntothex/split-bill-and-tracking --json number,title,body,labels,url <issue-number>`
* If GitHub access is unavailable, ask the user to paste the issue content.

Do not analyze repository implementation.

Do not write code.

Rules:

* Use exactly one issue.
* Do not merge multiple issues.
* Do not broaden scope.
* Do not analyze repository architecture.
* Do not infer implementation details unless explicitly stated in the issue.
* If the issue is too large, mark `Ready for Analysis: No`.

Output:

# Issue Intake Brief

## Source
- Issue:
- Title:
- Labels:

## Problem
Briefly describe the issue.

## User Value
Explain why this issue matters.

## In Scope
List exactly what should be implemented.

## Out of Scope
List what must not be implemented.

## Acceptance Criteria
Convert the issue into checkable acceptance criteria.

## Risks / Open Questions
List only real blockers or ambiguities.

## Ready for Analysis
Yes/No
