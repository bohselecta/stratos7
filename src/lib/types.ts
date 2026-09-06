export type FixtureSource = "fixture";

export type ProjectSummary = {
  id: string;
  name: string;
  subtitle: string;
  artwork: string;
  status: "idle" | "running" | "needs-you" | "complete";
  source: FixtureSource;
};

export type DemoTask = {
  id: string;
  title: string;
  state: "queued" | "running" | "done";
  estimate: string;
  source: FixtureSource;
};

export type DemoRun = {
  id: string;
  title: string;
  detail: string;
  progress: number;
  elapsed: string;
  paused: boolean;
  source: FixtureSource;
};

export type DemoApproval = {
  id: string;
  title: string;
  summary: string;
  filesChanged: number;
  checksPassed: string;
  target: string;
  state: "waiting" | "approved" | "changes-requested";
  source: FixtureSource;
};

export type DemoReceipt = {
  id: string;
  title: string;
  timestamp: string;
  detail: string;
  source: FixtureSource;
};
