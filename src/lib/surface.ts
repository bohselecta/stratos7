import {
  demoProjects,
  initialRun,
  initialApproval,
  demoFiles,
} from "@/data/demo";
import type {
  ProjectSummary,
  DemoTask,
  DemoRun,
  DemoApproval,
  DemoReceipt,
} from "./types";
import { useSurface } from "./store";
export type ProjectFile = (typeof demoFiles)[number];
export interface ProjectSurfaceAdapter {
  getProjects(): Promise<ProjectSummary[]>;
  getProject(id: string): Promise<ProjectSummary>;
  getTasks(projectId: string): Promise<DemoTask[]>;
  getRuns(projectId: string): Promise<DemoRun[]>;
  getFiles(projectId: string): Promise<ProjectFile[]>;
  getApprovals(projectId: string): Promise<DemoApproval[]>;
  decideApproval(
    id: string,
    decision: DemoApproval["state"],
    note?: string,
  ): Promise<void>;
  getReceipts(projectId: string): Promise<DemoReceipt[]>;
}
export const fixtureAdapter: ProjectSurfaceAdapter = {
  async getProjects() {
    return structuredClone(demoProjects);
  },
  async getProject(id) {
    const project = demoProjects.find((p) => p.id === id);
    if (!project) throw new Error("Unknown fixture project");
    return structuredClone(project);
  },
  async getTasks(id) {
    return structuredClone(useSurface.getState().work[id].tasks);
  },
  async getRuns(id) {
    const w = useSurface.getState().work[id];
    return [
      {
        ...initialRun,
        progress: w.progress,
        paused: w.paused,
        elapsed: `${w.elapsed}s`,
      },
    ];
  },
  async getFiles() {
    return structuredClone(demoFiles);
  },
  async getApprovals(id) {
    return [
      { ...initialApproval, state: useSurface.getState().work[id].approval },
    ];
  },
  async decideApproval(id, decision, note) {
    if (id !== initialApproval.id) throw new Error("Unknown fixture approval");
    useSurface.getState().decide(decision, note);
  },
  async getReceipts(id) {
    return structuredClone(useSurface.getState().work[id].receipts);
  },
};
