# Interaction Spec

## Panel tabs

### Overview
Shows only the highest-value project state: project identity, approvals, active run, queue, tool scope, and advanced disclosure.

### Needs you
Dedicated attention queue. Every item must explain why the user is needed and what happens if they act.

### Tasks
Queued, running, blocked, and done tasks. Users may reorder fictional demo tasks and open task detail.

### Runs
Execution sessions with stage, elapsed time, progress, pause/resume, logs, checks, and evidence.

### Files
Relevant or changed artifacts. Open a file inspector. For changed files, show a compact diff representation.

### Context / History / Advanced
Move behind `More` when width is limited. Context explains what the project knows. History contains receipts and state transitions. Advanced contains permissions, model/tool choices, environment, branch, raw logs, and evidence.

## Approval interaction

Default summary:

- plain-language requested action
- target scope/environment
- number of files/artifacts changed
- independent checks/evidence count

Expanded detail:

- concise diff summary
- exact permissions involved
- evidence/checklist
- environment/branch
- optional raw log

Actions:

- Review & approve
- Ask for changes
- Reject where appropriate

## Persistence

A pinned panel remains open while the user changes the center conversation/project within the demo. Panel width, open/closed state, and selected tab persist locally.
