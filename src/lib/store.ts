import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  demoProjects,
  initialRun,
  initialTasks,
  initialReceipts,
} from "@/data/demo";
import type { DemoApproval, DemoReceipt, DemoTask } from "./types";
export type Tab =
  | "Overview"
  | "Needs you"
  | "Tasks"
  | "Runs"
  | "Files"
  | "Context"
  | "History"
  | "Advanced";
export type Work = {
  progress: number;
  elapsed: number;
  paused: boolean;
  approval: DemoApproval["state"];
  tasks: DemoTask[];
  receipts: DemoReceipt[];
  note: string;
};
const fresh = (): Work => ({
  progress: initialRun.progress,
  elapsed: 102,
  paused: false,
  approval: "waiting",
  tasks: structuredClone(initialTasks),
  receipts: structuredClone(initialReceipts),
  note: "",
});
type State = {
  open: boolean;
  railOpen: boolean;
  size: "standard" | "wide" | "full";
  pinned: boolean;
  tab: Tab;
  activeId: string;
  panelId: string;
  work: Record<string, Work>;
  panel: (
    patch: Partial<
      Pick<State, "open" | "railOpen" | "size" | "pinned" | "tab">
    >,
  ) => void;
  select: (id: string) => void;
  update: (id: string, patch: Partial<Work>) => void;
  tick: () => void;
  decide: (decision: DemoApproval["state"], note?: string) => void;
  reset: () => void;
};
const initial = () => ({
  open: true,
  railOpen: true,
  size: "standard" as const,
  pinned: true,
  tab: "Overview" as Tab,
  activeId: demoProjects[0].id,
  panelId: demoProjects[0].id,
  work: Object.fromEntries(demoProjects.map((p) => [p.id, fresh()])),
});
export const useSurface = create<State>()(
  persist(
    (set, get) => ({
      ...initial(),
      panel: (patch) => set(patch),
      select: (id) =>
        set((s) => ({ activeId: id, panelId: s.pinned ? s.panelId : id })),
      update: (id, patch) =>
        set((s) => ({
          work: { ...s.work, [id]: { ...s.work[id], ...patch } },
        })),
      tick: () =>
        set((s) => ({
          work: Object.fromEntries(
            Object.entries(s.work).map(([id, w]) => {
              if (
                w.paused ||
                w.progress === 100 ||
                w.approval === "changes-requested"
              )
                return [id, w];
              const progress = Math.min(
                w.approval === "approved" ? 100 : 88,
                w.progress + 2,
              );
              const receipts =
                progress === 100
                  ? [
                      {
                        id: `demo-receipt-preview-${id}`,
                        source: "fixture" as const,
                        title: "Preview is ready",
                        timestamp: "just now",
                        detail:
                          "The approved candidate is available in the local preview. Production is unchanged.",
                      },
                      ...w.receipts,
                    ]
                  : w.receipts;
              return [id, { ...w, progress, elapsed: w.elapsed + 2, receipts }];
            }),
          ),
        })),
      decide: (decision, note = "") => {
        const s = get(),
          w = s.work[s.panelId];
        if (w.approval !== "waiting") return;
        s.update(s.panelId, {
          approval: decision,
          note,
          paused: decision === "changes-requested",
          receipts: [
            {
              id: `demo-receipt-${Date.now()}`,
              source: "fixture",
              title:
                decision === "approved"
                  ? "Preview publication approved"
                  : "Changes requested",
              timestamp: "just now",
              detail:
                decision === "approved"
                  ? "Approved 7 changed files, 12 passed checks, and preview-only publication."
                  : note,
            },
            ...w.receipts,
          ],
        });
      },
      reset: () => set(initial()),
    }),
    { name: "stratos-surface-v1" },
  ),
);
