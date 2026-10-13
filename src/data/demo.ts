import type {
  DemoApproval,
  DemoReceipt,
  DemoRun,
  DemoTask,
  ProjectSummary,
} from "@/lib/types";

export const demoProjects: ProjectSummary[] = [
  {
    id: "demo-atlas-console",
    name: "Atlas Console",
    subtitle: "Product workspace",
    artwork: "/graphics/atlas-console-v2.svg",
    status: "needs-you",
    source: "fixture",
  },
  {
    id: "demo-orion-release",
    name: "Orion Release",
    subtitle: "Launch readiness",
    artwork: "/graphics/orion-release-v2.svg",
    status: "idle",
    source: "fixture",
  },
  {
    id: "demo-beacon-docs",
    name: "Beacon Docs",
    subtitle: "Knowledge base",
    artwork: "/graphics/beacon-docs-v2.svg",
    status: "complete",
    source: "fixture",
  },
  {
    id: "demo-quartz-api",
    name: "Quartz API",
    subtitle: "Platform services",
    artwork: "/graphics/quartz-api-v2.svg",
    status: "idle",
    source: "fixture",
  },
];

export const initialTasks: DemoTask[] = [
  {
    id: "demo-task-a11y",
    title: "Verify keyboard navigation",
    state: "queued",
    estimate: "~8m",
    source: "fixture",
  },
  {
    id: "demo-task-notes",
    title: "Generate concise release notes",
    state: "queued",
    estimate: "~4m",
    source: "fixture",
  },
  {
    id: "demo-task-handoff",
    title: "Prepare staging handoff",
    state: "queued",
    estimate: "~6m",
    source: "fixture",
  },
];

export const initialRun: DemoRun = {
  id: "demo-run-visual-regression",
  title: "Visual regression sweep",
  detail: "Checking responsive layouts and keyboard states",
  progress: 68,
  elapsed: "1m 42s",
  paused: false,
  source: "fixture",
};

export const initialApproval: DemoApproval = {
  id: "demo-approval-preview",
  title: "Publish the refreshed dashboard to preview?",
  summary:
    "The agent finished the requested UI update and passed the demo acceptance checks. Publishing creates a shareable preview; it does not change production.",
  filesChanged: 7,
  checksPassed: "12/12",
  target: "Preview",
  state: "waiting",
  source: "fixture",
};

export const initialReceipts: DemoReceipt[] = [
  {
    id: "demo-receipt-checks",
    title: "Acceptance checks completed",
    timestamp: "10:24",
    detail: "12 of 12 fixture checks passed for the preview candidate.",
    source: "fixture",
  },
];

export const demoFiles = [
  {
    id: "demo-file-page",
    source: "fixture" as const,
    name: "app/dashboard/page.tsx",
    added: 24,
    removed: 8,
    before: '<section className="dashboard">',
    after:
      '<section aria-label="Project overview" className="dashboard responsive">',
  },
  {
    id: "demo-file-card",
    source: "fixture" as const,
    name: "components/metric-card.tsx",
    added: 18,
    removed: 4,
    before: "<div onClick={onSelect}>{title}</div>",
    after:
      "<button onClick={onSelect} aria-pressed={selected}>{title}</button>",
  },
  {
    id: "demo-file-css",
    source: "fixture" as const,
    name: "styles/dashboard.css",
    added: 32,
    removed: 12,
    before: "grid-template-columns: repeat(4, 240px);",
    after: "grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));",
  },
  {
    id: "demo-file-test",
    source: "fixture" as const,
    name: "tests/dashboard.spec.ts",
    added: 21,
    removed: 0,
    before: "// Dashboard checks",
    after: 'await expect(page.getByRole("button")).toBeFocused();',
  },
  {
    id: "demo-file-nav",
    source: "fixture" as const,
    name: "components/navigation.tsx",
    added: 9,
    removed: 3,
    before: "<nav>",
    after: '<nav aria-label="Project navigation">',
  },
  {
    id: "demo-file-token",
    source: "fixture" as const,
    name: "styles/tokens.css",
    added: 6,
    removed: 2,
    before: "--text-muted: #555;",
    after: "--text-muted: #a5b2c5;",
  },
  {
    id: "demo-file-notes",
    source: "fixture" as const,
    name: "docs/release-notes.md",
    added: 12,
    removed: 0,
    before: "# Release notes",
    after:
      "Added responsive layouts, keyboard focus, and accessible metric cards.",
  },
];
export const demoActivity = [
  {
    id: "demo-activity-1",
    source: "fixture",
    title: "Updated release checklist",
    project: "Orion Release",
    when: "8m ago",
  },
  {
    id: "demo-activity-2",
    source: "fixture",
    title: "Completed component regression run",
    project: "Atlas Console",
    when: "26m ago",
  },
  {
    id: "demo-activity-3",
    source: "fixture",
    title: "Reorganized API migration notes",
    project: "Quartz API",
    when: "2h ago",
  },
  {
    id: "demo-activity-4",
    source: "fixture",
    title: "Published the onboarding guide",
    project: "Beacon Docs",
    when: "5h ago",
  },
];
export const demoChats = [
  { id: "demo-chat-1", source: "fixture", title: "Project panel prototype" },
  { id: "demo-chat-2", source: "fixture", title: "Release planning" },
  { id: "demo-chat-3", source: "fixture", title: "Accessibility review" },
  { id: "demo-chat-4", source: "fixture", title: "Dashboard copy edit" },
];
export const demoContext = {
  id: "demo-context",
  source: "fixture",
  goal: "Make the project dashboard clear, accessible, and ready for a preview review.",
  decisions: [
    "Keep conversation at the center of the experience.",
    "Use accessible contrast and keyboard navigation.",
    "Publish to preview only after human approval.",
  ],
  references: [
    "Product brief · revision 3",
    "Component library · 24 components",
    "Acceptance checklist · 12 checks",
  ],
};

export const demoProjectContexts = [
  {
    id: "demo-context-atlas",
    source: "fixture",
    projectId: "demo-atlas-console",
    goal: demoContext.goal,
    decisions: demoContext.decisions,
    references: demoContext.references,
  },
  {
    id: "demo-context-orion",
    source: "fixture",
    projectId: "demo-orion-release",
    goal: "Coordinate launch readiness and give reviewers a clear view of the release candidate.",
    decisions: [
      "Keep the release checklist visible.",
      "Collect evidence for each launch gate.",
      "Publish the release dashboard to preview before handoff.",
    ],
    references: [
      "Launch readiness brief",
      "Release checklist",
      "Handoff guidelines",
    ],
  },
  {
    id: "demo-context-beacon",
    source: "fixture",
    projectId: "demo-beacon-docs",
    goal: "Make the knowledge base easier to navigate and review its updated documentation dashboard.",
    decisions: [
      "Use concise titles and accessible navigation.",
      "Keep related guides together.",
      "Review the documentation preview before publication.",
    ],
    references: [
      "Documentation style guide",
      "Information architecture",
      "Onboarding guide",
    ],
  },
  {
    id: "demo-context-quartz",
    source: "fixture",
    projectId: "demo-quartz-api",
    goal: "Clarify the platform service dashboard and make API migration progress easy to inspect.",
    decisions: [
      "Show migration status per service.",
      "Attach validation evidence to every change.",
      "Keep the candidate isolated from production.",
    ],
    references: [
      "API migration brief",
      "Service overview",
      "Platform acceptance checks",
    ],
  },
];
