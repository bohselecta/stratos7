"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Activity,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Code2,
  FileText,
  Folder,
  GitBranch,
  Github,
  ImageIcon,
  Layers,
  Library,
  Maximize2,
  MessageCircle,
  Minimize2,
  MoreHorizontal,
  PanelLeft,
  PanelRightOpen,
  Pause,
  Pin,
  Play,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  SquarePen,
  Terminal,
  X,
} from "lucide-react";
import {
  demoProjects,
  demoActivity,
  demoChats,
  demoProjectContexts,
  initialApproval,
  initialRun,
} from "@/data/demo";
import { fixtureAdapter, type ProjectFile } from "@/lib/surface";
import { useSurface, type Tab } from "@/lib/store";

const primaryTabs: Tab[] = ["Overview", "Needs you", "Tasks", "Runs", "Files"];
const extraTabs: Tab[] = ["Context", "History", "Advanced"];
function IconButton({
  label,
  children,
  onClick,
  pressed,
  disabled,
}: {
  label: string;
  children: ReactNode;
  onClick: () => void;
  pressed?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className="icon-button"
      aria-label={label}
      title={label}
      onClick={onClick}
      aria-pressed={pressed}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`panel-card ${className}`}>{children}</section>;
}

export function StratosShell() {
  const s = useSurface();
  const [hydrated, setHydrated] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [mobileNavigation, setMobileNavigation] = useState(false);
  const navigationOpen = mobile ? mobileNavigation : s.railOpen;
  useEffect(() => {
    const media = window.matchMedia("(max-width: 600px)");
    const update = () => setMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 1000px)");
    const update = () => setNarrow(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const [more, setMore] = useState(false);
  const [review, setReview] = useState(false);
  const [changes, setChanges] = useState(false);
  const [note, setNote] = useState("");
  const [file, setFile] = useState<ProjectFile | null>(null);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [overlay, setOverlay] = useState<
    "search" | "projects" | "preview" | "tools" | null
  >(null);
  const [query, setQuery] = useState("");
  const [prompt, setPrompt] = useState("");
  const [conversation, setConversation] = useState("");
  const [mode, setMode] = useState("Chat");
  const [filter, setFilter] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [newTask, setNewTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [toast, setToast] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const composer = useRef<HTMLInputElement>(null);
  const active =
    demoProjects.find((p) => p.id === s.activeId) ?? demoProjects[0];
  const project =
    demoProjects.find((p) => p.id === s.panelId) ?? demoProjects[0];
  const work = s.work[project.id];
  const projectContext =
    demoProjectContexts.find((c) => c.projectId === project.id) ??
    demoProjectContexts[0];
  const needs = work.approval === "waiting" && work.progress >= 76;
  const done = work.progress === 100;
  const selectTab = (tab: Tab) => {
    s.panel({ tab, open: true });
    setMore(false);
    setFile(null);
  };
  useEffect(() => {
    setHydrated(true);
    const timer = setInterval(() => useSurface.getState().tick(), 2000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    void fixtureAdapter.getFiles(s.panelId).then(setFiles);
    setFile(null);
    setReview(false);
    setChanges(false);
    setTaskId(null);
  }, [s.panelId]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 4000);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    if (overlay) {
      returnFocus.current = document.activeElement as HTMLElement;
      dialog.current?.showModal();
    } else {
      dialog.current?.close();
      returnFocus.current?.focus();
    }
  }, [overlay]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOverlay("search");
      }
      if (e.key === "Escape") {
        setMore(false);
        setFile(null);
        setTaskId(null);
        setReview(false);
        setChanges(false);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  const switchProject = (id: string) => {
    s.select(id);
    setConversation("");
    setOverlay(null);
  };
  const submit = () => {
    if (!prompt.trim()) return;
    setConversation(prompt.trim());
    setPrompt("");
  };
  const queueTask = () => {
    if (!taskTitle.trim()) return;
    s.update(project.id, {
      tasks: [
        ...work.tasks,
        {
          id: `demo-task-${Date.now()}`,
          source: "fixture",
          title: taskTitle.trim(),
          state: "queued",
          estimate: "Not started",
        },
      ],
    });
    setTaskTitle("");
    setNewTask(false);
  };
  const requestChanges = () => {
    if (!note.trim()) return;
    void fixtureAdapter.decideApproval(
      initialApproval.id,
      "changes-requested",
      note.trim(),
    );
    setChanges(false);
    setReview(false);
  };
  const runCard = (
    <Card className="run-card">
      <div className="card-label">
        <strong>
          <span className={`status-dot ${work.paused ? "amber" : ""}`} />
          {done
            ? "Completed"
            : work.paused
              ? "Paused"
              : work.progress >= 88 && work.approval === "waiting"
                ? "Ready for approval"
                : "Running"}
        </strong>
        <span className="subtle">{done ? "100%" : `${work.progress}%`}</span>
      </div>
      <h3>{initialRun.title}</h3>
      <p>
        {done
          ? "Preview published. All responsive and keyboard checks passed."
          : initialRun.detail}
      </p>
      <div
        className="progress-track"
        role="progressbar"
        aria-label="Run progress"
        aria-valuenow={work.progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span style={{ width: `${work.progress}%` }} />
      </div>
      <div className="progress-meta">
        <span>
          {done
            ? "26 of 26 views checked"
            : `${Math.min(26, Math.floor((work.progress / 100) * 26))} of 26 views checked`}
        </span>
        <span>
          {Math.floor(work.elapsed / 60)}m {work.elapsed % 60}s elapsed
        </span>
      </div>
      <div className="two-buttons">
        <button
          onClick={() => (done ? setOverlay("preview") : selectTab("Runs"))}
        >
          {done ? "Open preview" : "View run"}
          <ArrowUpRight size={14} />
        </button>
        {!done && (
          <button
            disabled={work.approval === "changes-requested"}
            onClick={() => s.update(project.id, { paused: !work.paused })}
          >
            {work.paused ? <Play size={14} /> : <Pause size={14} />}
            {work.paused ? "Resume" : "Pause"}
          </button>
        )}
      </div>
    </Card>
  );
  const approvalCard = (
    <Card className="approval-card">
      <div className="card-label">
        <strong>
          <span className="attention-icon">!</span>Needs you
        </strong>
        <span className="amber-badge">1 approval</span>
      </div>
      <h3>{initialApproval.title}</h3>
      <p>{initialApproval.summary}</p>
      <div className="approval-stats">
        <span>
          <b>7</b>
          <small>Files changed</small>
        </span>
        <span>
          <b>
            <Check size={12} />
            12/12
          </b>
          <small>Checks passed</small>
        </span>
        <span>
          <b>Preview</b>
          <small>Target</small>
        </span>
      </div>
      {review && (
        <div className="evidence">
          <strong>Ready for your review</strong>
          <p>
            Responsive dashboard, accessible metric cards, and stronger keyboard
            focus. Production stays unchanged.
          </p>
          <details open>
            <summary>Evidence & permissions</summary>
            <div className="check-line">
              <CheckCheck size={15} />
              12 checks passed · 26 view snapshots
            </div>
            <pre>
              <span className="diff-minus">− Fixed-width dashboard grid</span>
              {"\n"}
              <span className="diff-plus">
                + Responsive grid and visible focus states
              </span>
            </pre>
            <p>
              <ShieldCheck size={13} /> Grant: publish this candidate to preview
              only.
            </p>
            <p>
              <GitBranch size={13} /> preview/dashboard-refresh · isolated
              environment
            </p>
            <button className="text-button" onClick={() => selectTab("Files")}>
              Inspect all 7 changed files <ArrowRight size={13} />
            </button>
          </details>
          <button
            className="primary-button"
            onClick={() => {
              void fixtureAdapter.decideApproval(
                initialApproval.id,
                "approved",
              );
              setReview(false);
              setToast("Approved. Your preview is being prepared.");
            }}
          >
            Approve preview publication <Check size={15} />
          </button>
        </div>
      )}
      {changes && (
        <form
          className="change-form"
          onSubmit={(e) => {
            e.preventDefault();
            requestChanges();
          }}
        >
          <label htmlFor="change-note">What should the agent change?</label>
          <textarea
            id="change-note"
            autoFocus
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Describe the changes you need…"
            required
          />
          <button className="primary-button" disabled={!note.trim()}>
            Send changes
          </button>
        </form>
      )}
      <div className="two-buttons">
        <button
          className="light"
          onClick={() => {
            setReview(!review);
            setChanges(false);
          }}
        >
          {review ? "Close review" : "Review & approve"}
          <ArrowRight size={14} />
        </button>
        <button
          onClick={() => {
            setChanges(!changes);
            setReview(false);
          }}
        >
          Ask for changes
        </button>
      </div>
    </Card>
  );
  const queue = (
    <Card>
      <div className="card-label">
        <strong>
          Up next{" "}
          <span className="count">
            {work.tasks.filter((t) => t.state !== "done").length}
          </span>
        </strong>
        <IconButton label="Add task" onClick={() => setNewTask(!newTask)}>
          <Plus size={16} />
        </IconButton>
      </div>
      {work.tasks.map((task, index) => (
        <div className="queue-row" key={task.id}>
          <input
            type="checkbox"
            aria-label={`Complete ${task.title}`}
            checked={task.state === "done"}
            onChange={() =>
              s.update(project.id, {
                tasks: work.tasks.map((t) =>
                  t.id === task.id
                    ? { ...t, state: t.state === "done" ? "queued" : "done" }
                    : t,
                ),
              })
            }
          />
          <button
            onClick={() => setTaskId(task.id)}
            className={task.state === "done" ? "completed-task" : ""}
          >
            {task.title}
          </button>
          {s.tab === "Tasks" ? (
            <IconButton
              label={`Move ${task.title} up`}
              disabled={index === 0}
              onClick={() => {
                if (!index) return;
                const tasks = [...work.tasks];
                [tasks[index - 1], tasks[index]] = [
                  tasks[index],
                  tasks[index - 1],
                ];
                s.update(project.id, { tasks });
              }}
            >
              <ArrowUp size={13} />
            </IconButton>
          ) : (
            <span className="subtle">
              {task.state === "done"
                ? "Done"
                : task.state === "running"
                  ? "Running"
                  : "Queued"}
            </span>
          )}
        </div>
      ))}
      {newTask ? (
        <form
          className="task-form"
          onSubmit={(e) => {
            e.preventDefault();
            queueTask();
          }}
        >
          <input
            autoFocus
            aria-label="Task title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="What needs to happen?"
          />
          <button disabled={!taskTitle.trim()} aria-label="Save task">
            <ArrowUp size={15} />
          </button>
        </form>
      ) : (
        <button
          className="text-button add-task"
          onClick={() => setNewTask(true)}
        >
          <Plus size={15} />
          Add a task
        </button>
      )}
      {taskId && (
        <div className="evidence">
          <div className="card-label">
            <strong>{work.tasks.find((t) => t.id === taskId)?.title}</strong>
            <IconButton
              label="Close task detail"
              onClick={() => setTaskId(null)}
            >
              <X size={14} />
            </IconButton>
          </div>
          <p>
            Scoped to {project.name}. The agent will use the project context and
            attach evidence when complete.
          </p>
          <p>Status: {work.tasks.find((t) => t.id === taskId)?.state}</p>
          <button
            className="primary-button"
            onClick={() =>
              s.update(project.id, {
                tasks: work.tasks.map((t) =>
                  t.id === taskId
                    ? {
                        ...t,
                        state:
                          t.state === "queued"
                            ? "running"
                            : t.state === "running"
                              ? "done"
                              : "queued",
                      }
                    : t,
                ),
              })
            }
          >
            {work.tasks.find((t) => t.id === taskId)?.state === "queued"
              ? "Start task"
              : work.tasks.find((t) => t.id === taskId)?.state === "running"
                ? "Mark complete"
                : "Return to queue"}
          </button>
        </div>
      )}
    </Card>
  );
  const tools = (
    <Card>
      <div className="card-label">
        <strong>Connected tools</strong>
        <span className="subtle">Preview scope only</span>
      </div>
      <div className="tool-grid">
        {[
          [Code2, "Codex"],
          [Github, "GitHub"],
          [Layers, "Preview"],
          [ImageIcon, "Design"],
        ].map(([Icon, label]) => {
          const Component = Icon as typeof Code2;
          return (
            <button key={label as string} onClick={() => setOverlay("tools")}>
              <Component size={20} />
              <span>{label as string}</span>
              <span className="tool-status">Demo</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
  if (!hydrated)
    return <main className="loading">Opening your workspace…</main>;
  return (
    <main
      className={`shell ${s.open ? "with-panel" : "without-panel"} panel-${s.size} ${navigationOpen ? "navigation-open" : "navigation-collapsed"}`}
    >
      <aside
        id="navigation-sidebar"
        className="left-rail"
        inert={(narrow || s.size === "full") && s.open}
      >
        <div className="brand-row">
          <div className="brand-mark">
            <Layers size={25} />
          </div>
          <strong>ChatGPT</strong>
          <span>STRATOS</span>
        </div>
        <button
          className="search-box"
          onClick={() => {
            setQuery("");
            setOverlay("search");
          }}
        >
          <Search size={16} />
          <span>Search anything</span>
          <kbd>⌘ K</kbd>
        </button>
        <nav className="primary-nav" aria-label="Main navigation">
          {[
            [SquarePen, "New chat"],
            [Folder, "Projects"],
            [Library, "Library"],
            [Sparkles, "Agents"],
          ].map(([Icon, label]) => {
            const Component = Icon as typeof Folder;
            return (
              <button
                key={label as string}
                title={label as string}
                onClick={() => {
                  if (label === "New chat") {
                    setConversation("");
                    composer.current?.focus();
                  } else if (label === "Projects") setOverlay("projects");
                  else selectTab(label === "Library" ? "Files" : "Runs");
                }}
              >
                <Component size={18} />
                <span>{label as string}</span>
              </button>
            );
          })}
        </nav>
        <div className="rail-divider" />
        <div className="eyebrow">Pinned projects</div>
        <div className="project-list">
          {demoProjects.map((p) => (
            <button
              key={p.id}
              title={p.name}
              className={active.id === p.id ? "active-project" : ""}
              onClick={() => switchProject(p.id)}
            >
              <Folder size={17} />
              <span>{p.name}</span>
              {p.id === s.panelId && <i className="status-dot" />}
            </button>
          ))}
        </div>
        <div className="eyebrow recent-label">Recent chats</div>
        <div className="recent-list">
          {demoChats.map((c) => (
            <button key={c.id} onClick={() => setConversation(c.title)}>
              <MessageCircle size={15} />
              {c.title}
            </button>
          ))}
        </div>
        <div className="rail-note">
          <ShieldCheck size={15} />
          <span>
            A space to try things.
            <br />
            All projects are fictional.
          </span>
        </div>
        <div className="demo-user">
          <div className="demo-avatar">D</div>
          <div>
            <strong>Demo workspace</strong>
            <span>Stratos preview</span>
          </div>
          <IconButton
            label="Workspace settings"
            onClick={() => selectTab("Advanced")}
          >
            <Settings2 size={17} />
          </IconButton>
        </div>
      </aside>
      {!((narrow || s.size === "full") && s.open) && (
        <button
          className="sidebar-pull"
          onClick={() =>
            mobile
              ? setMobileNavigation(!mobileNavigation)
              : s.panel({ railOpen: !s.railOpen })
          }
          aria-label={
            navigationOpen
              ? "Collapse navigation sidebar"
              : "Expand navigation sidebar"
          }
          aria-expanded={navigationOpen}
          aria-controls="navigation-sidebar"
          title={navigationOpen ? "Close sidebar" : "Open sidebar"}
        >
          <span className="drawer-grip" />
          {navigationOpen ? (
            <ChevronLeft size={15} />
          ) : (
            <ChevronRight size={15} />
          )}
        </button>
      )}
      <section
        className="workspace"
        inert={(narrow || s.size === "full") && s.open}
      >
        <header className="workspace-header">
          <button className="breadcrumb" onClick={() => setOverlay("projects")}>
            <Folder size={18} />
            <span>Projects</span>
            <span>/</span>
            <strong>{active.name}</strong>
            <ChevronDown size={13} />
          </button>
          <div className="mode-switch">
            {["Chat", "Work"].map((m) => (
              <button
                key={m}
                className={mode === m ? "on" : ""}
                onClick={() => {
                  setMode(m);
                  if (m === "Work") selectTab("Overview");
                }}
              >
                {m}
              </button>
            ))}
          </div>
          <div className="header-actions">
            <IconButton
              label="Search workspace"
              onClick={() => setOverlay("search")}
            >
              <Search size={18} />
            </IconButton>
            <IconButton
              label={s.open ? "Collapse project panel" : "Open project panel"}
              onClick={() => s.panel({ open: !s.open })}
            >
              <PanelRightOpen size={19} />
            </IconButton>
          </div>
        </header>
        <div className="center-content">
          <div className="hero-art" />
          <div className="context-pill">
            <span className="status-dot" />
            {active.name} <span className="pill-divider" /> Context active
          </div>
          <h1>Room for your next big idea.</h1>
          <p className="hero-sub">What would you like to work on?</p>
          {conversation && (
            <div className="conversation">
              <div className="user-message">{conversation}</div>
              <div className="assistant-message">
                <Sparkles size={17} />
                <p>
                  I’ve added this to our conversation in{" "}
                  <strong>{active.name}</strong>. You can inspect the current
                  work, review its evidence, or add a task in the project panel.
                  <small>Demo response · no model request is sent</small>
                </p>
              </div>
            </div>
          )}
          <form
            className="composer"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <IconButton
              label="Browse project files"
              onClick={() => selectTab("Files")}
            >
              <Plus size={23} />
            </IconButton>
            <input
              ref={composer}
              aria-label="Message"
              placeholder="Ask anything, or start something new…"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button
              type="button"
              className="model"
              onClick={() => selectTab("Advanced")}
            >
              Astra
              <ChevronDown size={12} />
            </button>
            <button
              className="send"
              aria-label="Send message"
              disabled={!prompt.trim()}
            >
              <ArrowUp size={22} />
            </button>
          </form>
          <div className="quick-chips">
            {[
              [Folder, "Continue project"],
              [Terminal, "Run code"],
              [FileText, "Analyze files"],
              [ImageIcon, "Create an image"],
            ].map(([Icon, label], index) => {
              const Component = Icon as typeof Folder;
              return (
                <button
                  key={label as string}
                  onClick={() => {
                    if (index === 0) selectTab("Overview");
                    else if (index === 1) selectTab("Runs");
                    else if (index === 2) selectTab("Files");
                    else {
                      setPrompt("Create an illustration for " + active.name);
                      composer.current?.focus();
                    }
                  }}
                >
                  <Component size={15} />
                  {label as string}
                </button>
              );
            })}
          </div>
          <div className="section-heading">
            <h2>Your projects</h2>
            <button onClick={() => setOverlay("projects")}>
              View all <ArrowRight size={15} />
            </button>
          </div>
          <div className="project-cards">
            {demoProjects.map((p) => (
              <button
                key={p.id}
                className={`project-card ${active.id === p.id ? "selected-card" : ""}`}
                onClick={() => switchProject(p.id)}
              >
                <div className="project-art">
                  <Image
                    src={p.artwork}
                    alt=""
                    fill
                    sizes="(max-width: 600px) 45vw, 220px"
                    priority
                  />
                </div>
                <div className="project-card-copy">
                  <strong>
                    {p.name}
                    <span
                      className={`status-dot ${p.status === "idle" ? "amber" : ""}`}
                    />
                  </strong>
                  <span>{p.subtitle}</span>
                  <small>
                    {p.id === demoProjects[0].id
                      ? "7 files changed"
                      : "Project workspace"}
                    <span>·</span>
                    {p.status === "complete" ? "Up to date" : "Just now"}
                  </small>
                </div>
              </button>
            ))}
          </div>
          <div className="section-heading activity-heading">
            <h2>Recent activity</h2>
            <button onClick={() => setFilter(!filter)}>
              {filter ? active.name : "All projects"}
              <ChevronDown size={13} />
            </button>
          </div>
          <div className="activity-list">
            {demoActivity
              .filter((a) => !filter || a.project === active.name)
              .map((a, i) => (
                <button
                  className="activity-row"
                  key={a.id}
                  onClick={() => {
                    const p = demoProjects.find((p) => p.name === a.project)!;
                    s.select(p.id);
                    s.panel({ open: true, tab: "History" });
                  }}
                >
                  <span className={`activity-icon tone-${i}`}>
                    <FileText size={18} />
                  </span>
                  <strong>
                    {a.title}
                    <small>{a.project}</small>
                  </strong>
                  <time>{a.when}</time>
                  <MoreHorizontal size={16} />
                </button>
              ))}
          </div>
          <footer className="workspace-footer">
            <span className="status-dot" />
            Your ideas, with room to become something.<span>STRATOS / 07</span>
          </footer>
        </div>
      </section>
      {!s.open && (
        <button
          className="collapsed-edge"
          onClick={() => s.panel({ open: true })}
          aria-label="Expand project panel"
        >
          <PanelRightOpen size={20} />
          {needs && <b>1</b>}
        </button>
      )}
      {s.open && (
        <aside
          id="project-drawer"
          className="project-panel"
          aria-label="Project panel"
        >
          <header className="panel-header">
            <div>
              <h2>Project</h2>
              <span className="live-badge">
                <span className="status-dot" />
                LIVE
              </span>
            </div>
            <div className="panel-controls">
              <IconButton
                label={s.pinned ? "Unpin panel" : "Pin panel"}
                pressed={s.pinned}
                onClick={() => s.panel({ pinned: !s.pinned })}
              >
                <Pin size={16} />
              </IconButton>
              <IconButton
                label="Toggle wide inspector"
                pressed={s.size === "wide"}
                onClick={() =>
                  s.panel({ size: s.size === "wide" ? "standard" : "wide" })
                }
              >
                <PanelLeft size={16} />
              </IconButton>
              <IconButton
                label={
                  s.size === "full" ? "Exit full screen" : "Full screen project"
                }
                onClick={() =>
                  s.panel({ size: s.size === "full" ? "standard" : "full" })
                }
              >
                {s.size === "full" ? (
                  <Minimize2 size={16} />
                ) : (
                  <Maximize2 size={16} />
                )}
              </IconButton>
              <IconButton
                label="Close panel"
                onClick={() => s.panel({ open: false })}
              >
                <X size={18} />
              </IconButton>
            </div>
          </header>
          <div
            className="panel-tabs"
            onKeyDown={(e) => {
              if (
                !(e.target instanceof HTMLElement) ||
                e.target.getAttribute("role") !== "tab"
              )
                return;
              const tabs = Array.from(
                e.currentTarget.querySelectorAll<HTMLButtonElement>(
                  '[role="tab"]',
                ),
              );
              const index = tabs.indexOf(e.target as HTMLButtonElement);
              const next =
                e.key === "ArrowRight"
                  ? (index + 1) % tabs.length
                  : e.key === "ArrowLeft"
                    ? (index - 1 + tabs.length) % tabs.length
                    : e.key === "Home"
                      ? 0
                      : e.key === "End"
                        ? tabs.length - 1
                        : -1;
              if (next >= 0) {
                e.preventDefault();
                tabs[next].click();
                tabs[next].focus();
              }
            }}
          >
            <div
              className="tab-group"
              role="tablist"
              aria-label="Project destinations"
            >
              {primaryTabs.map((t) => (
                <button
                  role="tab"
                  aria-selected={s.tab === t}
                  tabIndex={
                    s.tab === t ||
                    (extraTabs.includes(s.tab) && t === "Overview")
                      ? 0
                      : -1
                  }
                  key={t}
                  onClick={() => selectTab(t)}
                  className={s.tab === t ? "active" : ""}
                >
                  {t}
                  {t === "Needs you" && needs && <b>1</b>}
                </button>
              ))}
            </div>
            <div className="more-wrap">
              <button
                className={extraTabs.includes(s.tab) ? "active" : ""}
                aria-label="More panel tabs"
                aria-expanded={more}
                onClick={() => setMore(!more)}
              >
                <MoreHorizontal size={17} />
              </button>
              {more && (
                <div className="more-menu">
                  {extraTabs.map((t) => (
                    <button key={t} onClick={() => selectTab(t)}>
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="panel-scroll" role="tabpanel" aria-label={s.tab}>
            <Card className="project-summary">
              <div className="project-summary-top">
                <div className="summary-art">
                  <Image src={project.artwork} alt="" fill sizes="46px" />
                </div>
                <div>
                  <strong>{project.name}</strong>
                  <p>{project.subtitle}</p>
                </div>
                <button
                  onClick={() => {
                    s.select(project.id);
                    s.panel({ size: "full" });
                  }}
                >
                  Open
                  <ArrowUpRight size={14} />
                </button>
              </div>
              <div className="project-stats">
                <span>
                  <b>
                    <span className="status-dot" />
                    Synced
                  </b>
                  <small>Local workspace</small>
                </span>
                <span>
                  <b>
                    <FileText size={13} />7 changed
                  </b>
                  <small>Files in review</small>
                </span>
                <span>
                  <b>
                    <GitBranch size={13} />
                    preview
                  </b>
                  <small>Isolated branch</small>
                </span>
              </div>
              {s.activeId !== s.panelId && (
                <div className="pinned-note">
                  <Pin size={12} />
                  Pinned here while you explore {active.name}
                </div>
              )}
            </Card>
            {(s.tab === "Overview" || s.tab === "Needs you") &&
              needs &&
              approvalCard}
            {s.tab === "Needs you" && !needs && (
              <Card>
                <CheckCheck className="green" size={22} />
                <h3>
                  {work.approval === "changes-requested"
                    ? "Changes sent to the agent"
                    : "You’re all caught up"}
                </h3>
                <p>
                  {work.note ||
                    (work.approval === "approved"
                      ? "Your approval is recorded in History."
                      : "The agent is finishing its checks. Requests will appear here.")}
                </p>
              </Card>
            )}
            {(s.tab === "Overview" || s.tab === "Runs") && runCard}
            {s.tab === "Runs" && (
              <Card>
                <div className="card-label">
                  <strong>Run detail</strong>
                  <span className="subtle">Local simulation</span>
                </div>
                <div className="stage-list">
                  {[
                    "Inspect component changes",
                    "Check responsive layouts",
                    "Review keyboard states",
                    "Wait for approval",
                    "Publish preview",
                  ].map((stage, i) => (
                    <div key={stage}>
                      <span className={i < 3 || done ? "stage-done" : ""}>
                        {i < 3 || done ? <Check size={13} /> : i + 1}
                      </span>
                      <strong>{stage}</strong>
                      <small>
                        {i < 3 || done
                          ? "Passed"
                          : i === 3 && work.approval === "approved"
                            ? "Approved"
                            : "Pending"}
                      </small>
                    </div>
                  ))}
                </div>
                <details open>
                  <summary>Checks & evidence</summary>
                  <p>
                    12/12 fixture acceptance checks passed. Seven changed files
                    are included in this candidate.
                  </p>
                  <button
                    className="text-button"
                    onClick={() => selectTab("Files")}
                  >
                    Inspect files <ArrowRight size={13} />
                  </button>
                </details>
                <details>
                  <summary>Execution log</summary>
                  <pre>{`[00:00] Loaded project context\n[00:12] Compared component snapshots\n[00:48] Responsive checks passed\n[01:22] Keyboard checks passed\n[01:42] ${work.approval === "approved" ? "Preview publication authorized" : "Awaiting preview authorization"}${done ? "\n[02:00] Preview ready" : ""}`}</pre>
                </details>
              </Card>
            )}
            {(s.tab === "Overview" || s.tab === "Tasks") && queue}
            {s.tab === "Overview" && (
              <>
                {tools}
                <button
                  className="advanced-link panel-card"
                  onClick={() => selectTab("Advanced")}
                >
                  <Settings2 size={16} />
                  <span>
                    <strong>Advanced</strong>
                    <small>Permissions, model, environment & evidence</small>
                  </span>
                  <ChevronRight size={16} />
                </button>
              </>
            )}
            {s.tab === "Files" && (
              <Card>
                <div className="card-label">
                  <strong>Files changed</strong>
                  <span className="subtle">7 files · +122 −29</span>
                </div>
                {files.map((f) => (
                  <button
                    className="file-row"
                    key={f.id}
                    onClick={() => setFile(f)}
                  >
                    <FileText size={17} />
                    <span>{f.name}</span>
                    <small className="diff-plus">+{f.added}</small>
                    <small className="diff-minus">−{f.removed}</small>
                    <ChevronRight size={14} />
                  </button>
                ))}
                {file && (
                  <div className="file-inspector">
                    <div className="card-label">
                      <strong>{file.name}</strong>
                      <IconButton
                        label="Close file inspector"
                        onClick={() => setFile(null)}
                      >
                        <X size={15} />
                      </IconButton>
                    </div>
                    <p>Unified diff · fixture candidate</p>
                    <pre>
                      <span className="diff-minus">− {file.before}</span>
                      {"\n"}
                      <span className="diff-plus">+ {file.after}</span>
                    </pre>
                  </div>
                )}
              </Card>
            )}
            {s.tab === "Context" && (
              <Card>
                <div className="card-label">
                  <strong>Context capsule</strong>
                  <span className="subtle">Project scoped</span>
                </div>
                <h3>{project.name}</h3>
                <p>{projectContext.goal}</p>
                <h3>Decisions</h3>
                {projectContext.decisions.map((d) => (
                  <p className="check-line" key={d}>
                    <Check size={14} />
                    {d}
                  </p>
                ))}
                <h3>References</h3>
                {projectContext.references.map((r) => (
                  <details key={r}>
                    <summary>{r}</summary>
                    <p>
                      {projectContext.goal} Evidence remains attached to the
                      current candidate and its receipt.
                    </p>
                  </details>
                ))}
              </Card>
            )}
            {s.tab === "History" && (
              <Card>
                <div className="card-label">
                  <strong>History</strong>
                  <span className="subtle">
                    {work.receipts.length} receipts
                  </span>
                </div>
                {work.receipts.map((r) => (
                  <div className="receipt" key={r.id}>
                    <div className="receipt-mark">
                      <Check size={15} />
                    </div>
                    <div>
                      <strong>{r.title}</strong>
                      <p>{r.detail}</p>
                      <small>{r.timestamp} · Saved locally</small>
                    </div>
                  </div>
                ))}
              </Card>
            )}
            {s.tab === "Advanced" && (
              <Card>
                <div className="card-label">
                  <strong>Advanced</strong>
                  <span className="subtle">Scoped & inspectable</span>
                </div>
                {[
                  [
                    "Model",
                    "Astra · simulated execution. No model request is made.",
                  ],
                  [
                    "Permissions & tool grants",
                    "Read project files, propose edits, and run checks. Preview publication requires approval. Production access is not granted.",
                  ],
                  [
                    "Branch & environment",
                    "preview/dashboard-refresh · isolated local fixture environment",
                  ],
                  [
                    "Evidence bundle",
                    "7 file diffs, 26 view snapshots, 12 acceptance checks. All evidence is simulated for this product demo.",
                  ],
                  [
                    "Raw logs",
                    "Fixture adapter initialized. No connected account data loaded. Local state persisted.",
                  ],
                ].map(([title, body]) => (
                  <details key={title}>
                    <summary>{title}</summary>
                    <p>{body}</p>
                  </details>
                ))}
                <button
                  className="text-button reset"
                  onClick={() => {
                    s.reset();
                    setReview(false);
                    setChanges(false);
                    setToast("Demo reset. Visual regression is running.");
                  }}
                >
                  Restart the demo
                </button>
              </Card>
            )}
            <div className="panel-footer">
              <ShieldCheck size={12} />
              Fictional workspace · changes stay in this demo
            </div>
          </div>
        </aside>
      )}
      <dialog
        aria-labelledby="dialog-title"
        ref={dialog}
        onCancel={() => setOverlay(null)}
        onClick={(e) => {
          if (e.target === dialog.current) setOverlay(null);
        }}
      >
        <div className="dialog-header">
          <h2 id="dialog-title">
            {overlay === "search"
              ? "Find your next thread"
              : overlay === "projects"
                ? "Your projects"
                : overlay === "preview"
                  ? "Preview is ready"
                  : "Project integrations"}
          </h2>
          <IconButton label="Close dialog" onClick={() => setOverlay(null)}>
            <X size={20} />
          </IconButton>
        </div>
        {(overlay === "search" || overlay === "projects") && (
          <>
            <input
              autoFocus
              aria-label="Search projects and chats"
              placeholder="Search projects and chats…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {demoProjects
              .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
              .map((p) => (
                <button
                  className="search-result"
                  key={p.id}
                  onClick={() => switchProject(p.id)}
                >
                  <Folder size={18} />
                  <span>
                    <strong>{p.name}</strong>
                    <small>{p.subtitle}</small>
                  </span>
                  <ArrowUpRight size={16} />
                </button>
              ))}
            {overlay === "search" &&
              demoChats
                .filter((c) =>
                  c.title.toLowerCase().includes(query.toLowerCase()),
                )
                .map((c) => (
                  <button
                    className="search-result"
                    key={c.id}
                    onClick={() => {
                      setConversation(c.title);
                      setOverlay(null);
                    }}
                  >
                    <MessageCircle size={17} />
                    {c.title}
                  </button>
                ))}
            {!demoProjects.some((p) =>
              p.name.toLowerCase().includes(query.toLowerCase()),
            ) && <p className="subtle">No matching projects.</p>}
          </>
        )}
        {overlay === "tools" && (
          <>
            <p>
              Tools use a local fixture adapter. Explore their scope without
              connecting an account.
            </p>
            {[
              "Codex · inspect files and run fixture checks",
              "GitHub · read the demo branch and candidate diff",
              "Preview · publish only after your approval",
              "Design · project artwork and component references",
            ].map((t) => (
              <div className="integration-row" key={t}>
                <ShieldCheck size={18} />
                {t}
                <span>Demo</span>
              </div>
            ))}
          </>
        )}
        {overlay === "preview" && (
          <div className="preview-demo">
            <span className="preview-label">
              LOCAL PREVIEW · {project.name}
            </span>
            <h3>Everything in view.</h3>
            <p>Your refreshed project dashboard is ready for review.</p>
            <div className="preview-metrics">
              <span>
                <b>12/12</b>Checks passed
              </span>
              <span>
                <b>26</b>Views verified
              </span>
              <span>
                <b>7</b>Files updated
              </span>
            </div>
            <div className="preview-chart">
              {[35, 49, 43, 65, 58, 79, 72, 91, 84, 100].map((h, i) => (
                <i key={i} style={{ height: `${h}%` }} />
              ))}
            </div>
            <button
              className="primary-button"
              onClick={() => {
                setOverlay(null);
                selectTab("History");
              }}
            >
              View publication receipt <ArrowRight size={16} />
            </button>
          </div>
        )}
      </dialog>
      {toast && (
        <div className="toast" role="status">
          <Check size={17} />
          {toast}
        </div>
      )}
    </main>
  );
}
