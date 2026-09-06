import type { DemoApproval, DemoReceipt, DemoRun, DemoTask, ProjectSummary } from "@/lib/types";

export const demoProjects: ProjectSummary[] = [
  {
    id: "demo-atlas-console",
    name: "Atlas Console",
    subtitle: "Product workspace",
    artwork: "/graphics/atlas-console.svg",
    status: "needs-you",
    source: "fixture",
  },
  {
    id: "demo-orion-release",
    name: "Orion Release",
    subtitle: "Launch readiness",
    artwork: "/graphics/orion-release.svg",
    status: "idle",
    source: "fixture",
  },
  {
    id: "demo-beacon-docs",
    name: "Beacon Docs",
    subtitle: "Knowledge base",
    artwork: "/graphics/beacon-docs.svg",
    status: "complete",
    source: "fixture",
  },
  {
    id: "demo-quartz-api",
    name: "Quartz API",
    subtitle: "Platform services",
    artwork: "/graphics/quartz-api.svg",
    status: "idle",
    source: "fixture",
  },
];

export const initialTasks: DemoTask[] = [
  { id: "demo-task-a11y", title: "Verify keyboard navigation", state: "queued", estimate: "~8m", source: "fixture" },
  { id: "demo-task-notes", title: "Generate concise release notes", state: "queued", estimate: "~4m", source: "fixture" },
  { id: "demo-task-handoff", title: "Prepare staging handoff", state: "queued", estimate: "~6m", source: "fixture" },
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
