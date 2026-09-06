# Codex Build Instructions — Stratos

This file is the authoritative implementation brief for Codex.

## 0. Non-negotiable demo-data boundary

**Never seed this demo from real user data.** Do not read or import ChatGPT history, project names, chat titles, GitHub repositories, browser history, local files, email, calendar, contacts, connected apps, or account metadata to populate the interface.

The only default data source is `src/data/demo.ts`, and every record must be fictional and tagged `source: "fixture"`.

If you add an integration adapter, keep it disabled by default and return sanitized fixture data until a user explicitly connects a demo account. The public demo must be fully useful without any personal account connection.

Do not put a developer's real name, handle, client, repo, location, chat title, or project title anywhere in the interface, tests, screenshots, or fixtures.

## 1. Product intent

Build a convincing working demo of a persistent project-control layer for ChatGPT/Codex.

The product hierarchy is:

1. **ChatGPT = conversation and intent**
2. **Projects = durable context**
3. **Agents/Codex = execution**
4. **Project panel = persistent observation + control**

The conversation stays visually primary. The right panel appears when work has state, progress, evidence, files, or decisions that need the user.

This is not "VS Code inside ChatGPT." It is a consumer-friendly control surface with professional depth one layer beneath it.

## 2. Visual North Star

Use `public/reference/stratos7-north-star.svg` as the composition guide.

Preserve:

- three-part desktop composition: left navigation / primary workspace / right Project panel
- quiet center canvas and dominant composer
- right-panel tab strip at the top
- high information density without visual clutter
- dark charcoal surfaces, fine borders, subtle blue-violet accenting, restrained status colors
- rounded geometry that feels native to ChatGPT rather than like a generic SaaS admin template
- clear approval card, running card, queue, integrations, and advanced disclosure

Do not reproduce the render as a dead screenshot. Rebuild it responsively from components.

## 3. Canonical panel information architecture

Implement these panel destinations:

- **Overview** — active project, urgent approval, active run, queue, integrations
- **Needs you** — approvals, blockers, questions, review requests
- **Tasks** — queued / active / done work items
- **Runs** — active and completed execution sessions with logs/evidence
- **Files** — changed and relevant artifacts
- **Context** — project context capsule, references, decisions, linked sources
- **History** — acceptance receipts and important state transitions
- **Advanced** — model, permissions, branch/environment, tool grants, raw logs, evidence bundle

On narrower widths, move Context / History / Advanced into `More` rather than shrinking every tab.

## 4. Canonical physical states

The Project panel must support:

1. collapsed edge control
2. standard drawer (~420–480 px)
3. wide inspector (~600–720 px)
4. full-screen project surface
5. pinned state that survives navigation inside the demo

Remember the last panel state in local storage.

## 5. Canonical 45-second demo flow

Build this scripted flow using fixture state:

1. App opens with the fictional **Atlas Console** project active.
2. A visual-regression run is already in progress.
3. User opens another fictional chat/project; pinned panel remains visible.
4. `Needs you` becomes `1`.
5. User opens the approval card.
6. Show an understandable summary first: files changed, checks passed, target environment.
7. User expands evidence and sees a compact diff/checks/permissions view.
8. User approves preview publication.
9. Run resumes / changes state.
10. Preview becomes available.
11. A durable receipt appears in History.

All of this is simulated client-side. No real deployment is required for the product demo.

## 6. Interaction requirements

Implement believable interactions, not decorative controls:

- panel tabs change content
- collapse / expand / pin / full-screen work
- approval buttons mutate fixture state
- asking for changes opens a small inline composer
- run progress can advance on a timer and can be paused/resumed
- clicking `View run` opens run detail with stages, elapsed time, checks, logs, and evidence
- files open in a compact inspector with diff-like treatment
- completed approval creates a History receipt
- switching projects changes fixture context without losing panel state
- `Advanced` uses progressive disclosure
- keyboard accessible controls and visible focus states
- escape closes overlays, not the pinned panel itself

## 7. Product language

Prefer plain commercial wording:

- "Needs you" instead of "decision queue"
- "Review & approve" instead of "accept canonical mutation"
- "Running" instead of "worker trace"
- "Files changed" instead of "artifact delta"
- "Checks passed" instead of "acceptance contract satisfied"
- "History" / "Receipt" for the durable audit trail

Advanced detail may expose exact technical terms after expansion.

## 8. Architecture

Keep the UI independent from future backend implementation.

Create interfaces roughly along these boundaries:

```ts
interface ProjectSurfaceAdapter {
  getProjects(): Promise<ProjectSummary[]>;
  getProject(id: string): Promise<ProjectDetail>;
  getTasks(projectId: string): Promise<Task[]>;
  getRuns(projectId: string): Promise<Run[]>;
  getFiles(projectId: string): Promise<ProjectFile[]>;
  getApprovals(projectId: string): Promise<Approval[]>;
  decideApproval(id: string, decision: ApprovalDecision): Promise<void>;
  getReceipts(projectId: string): Promise<Receipt[]>;
}
```

Start with a fixture adapter. Do not couple components to GitHub/Vercel/Codex payload shapes.

Recommended client state: Zustand or a small reducer/store with serializable demo state.

## 9. Graphics

Use the included SVG artwork under `public/graphics/` as starter art.

Refine the graphic system so every fictional project has distinctive but restrained visual identity. Prefer procedural vector graphics, generative gradients, miniature diagrams, topographic/data motifs, and subtle motion over stock photography.

Graphics must remain secondary to product state. No faces, real brands as project identities, or personal imagery.

## 10. Responsive behavior

Desktop is the hero target. Also make the concept credible at:

- 1440 px: full three-column layout
- 1180 px: narrower left rail and right panel
- tablet: left navigation collapses; project panel overlays or docks
- mobile: Project panel becomes a full-height sheet with the same tabs

## 11. Quality bar

Before calling the demo complete:

- TypeScript clean
- no console errors
- no layout overflow at target breakpoints
- tab, panel, approval, run, file, receipt interactions all work
- no dead buttons in the hero flow
- keyboard navigation is usable
- demo content remains fictional
- no network dependency is required for the main demo flow
- visuals match the North Star composition closely
- motion is short, functional, and interruptible

## 12. Suggested implementation phases

### Phase A — shell fidelity
Reproduce the layout, typography, surfaces, spacing, tabs, and panel states.

### Phase B — fixture state engine
Implement project switching, task/run progression, approvals, receipts, and local persistence.

### Phase C — inspector depth
Add run detail, file detail/diff, context, history, advanced permissions/evidence.

### Phase D — motion + graphics
Refine vector project art, subtle panel transitions, progress movement, status changes.

### Phase E — acceptance pass
Run accessibility, responsive, visual regression, and demo-data audits. Fix every dead interaction used in the canonical flow.

## 13. Do not do these things

- do not import actual ChatGPT account content
- do not scrape or summarize the developer's current chats
- do not read connected repositories just to make the demo feel populated
- do not hard-code a real person's name as the demo user
- do not transform this into a generic project-management dashboard
- do not hide all technical detail; use progressive disclosure instead
- do not make the right panel a modal that disappears whenever the center navigation changes
- do not require a backend before the scripted demo works
