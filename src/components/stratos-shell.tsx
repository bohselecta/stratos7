"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  Activity,
  Boxes,
  ChevronDown,
  CircleDot,
  Code2,
  FileText,
  Folder,
  FolderKanban,
  Github,
  ImageIcon,
  Library,
  MessageCircle,
  MoreHorizontal,
  PanelRightOpen,
  Pause,
  Play,
  Search,
  Send,
  Sparkles,
  SquareCheckBig,
  TerminalSquare,
  WandSparkles,
  X,
} from "lucide-react";
import { demoProjects, initialApproval, initialReceipts, initialRun, initialTasks } from "@/data/demo";
import type { DemoReceipt } from "@/lib/types";

type PanelTab = "Overview" | "Needs you" | "Tasks" | "Runs" | "Files";

const activityRows = [
  ["Updated release checklist", "Orion Release", "8m ago"],
  ["Completed component regression run", "Atlas Console", "26m ago"],
  ["Reorganized API migration notes", "Quartz API", "2h ago"],
  ["Generated onboarding illustration set", "Mobile Onboarding", "5h ago"],
] as const;

export function StratosShell() {
  const [panelOpen, setPanelOpen] = useState(true);
  const [panelWide, setPanelWide] = useState(false);
  const [tab, setTab] = useState<PanelTab>("Overview");
  const [activeProject, setActiveProject] = useState(demoProjects[0]);
  const [approvalState, setApprovalState] = useState(initialApproval.state);
  const [runPaused, setRunPaused] = useState(initialRun.paused);
  const [receipts, setReceipts] = useState<DemoReceipt[]>(initialReceipts);

  const needsYou = approvalState === "waiting" ? 1 : 0;
  const tabs: PanelTab[] = ["Overview", "Needs you", "Tasks", "Runs", "Files"];
  const approval = useMemo(() => ({ ...initialApproval, state: approvalState }), [approvalState]);

  function approvePreview() {
    setApprovalState("approved");
    setReceipts((current) => [
      {
        id: "demo-receipt-approved",
        title: "Preview publication approved",
        timestamp: "just now",
        detail: "A demo-only preview publication was approved. No production system was changed.",
        source: "fixture",
      },
      ...current,
    ]);
  }

  return (
    <main className={`shell ${panelOpen ? "with-panel" : "without-panel"} ${panelWide ? "panel-wide" : ""}`}>
      <aside className="left-rail">
        <div className="brand-row"><div className="s7-mark">S7</div><strong>ChatGPT</strong><span>STRATOS</span></div>
        <button className="search-box"><Search size={16} />Search chats, projects, files…<kbd>⌘K</kbd></button>
        <nav className="primary-nav">
          <button className="selected"><MessageCircle size={17}/>New chat</button>
          <button><FolderKanban size={17}/>Projects</button>
          <button><Library size={17}/>Library</button>
          <button><CircleDot size={17}/>Agents</button>
          <button><Boxes size={17}/>Browse</button>
          <button><WandSparkles size={17}/>Tools</button>
        </nav>
        <div className="rail-divider" />
        <div className="eyebrow">Pinned</div>
        <div className="project-list">
          {demoProjects.map((project) => (
            <button key={project.id} className={project.id === activeProject.id ? "active-project" : ""} onClick={() => setActiveProject(project)}>
              <Folder size={16}/><span>{project.name}</span>{project.status === "needs-you" && <i />}
            </button>
          ))}
          <button><ChevronDown size={15}/><span>Show more</span></button>
        </div>
        <div className="eyebrow recent-label">Recent</div>
        <div className="recent-list">
          <button className="recent-active">Project panel prototype</button>
          <button>Release planning</button>
          <button>Accessibility review</button>
          <button>Dashboard copy edit</button>
          <button>API migration notes</button>
        </div>
        <div className="demo-user"><div className="demo-avatar">DU</div><div><strong>Demo User</strong><span>Prototype workspace</span></div></div>
      </aside>

      <section className="workspace">
        <header className="workspace-header">
          <div className="breadcrumb"><Folder size={17}/>Projects <span>/</span><strong>{activeProject.name}</strong><ChevronDown size={14}/></div>
          <div className="mode-switch"><button className="on">Chat</button><button>Work</button></div>
          <div className="header-actions"><Search size={18}/><Activity size={18}/>{!panelOpen && <button className="icon-only" aria-label="Open project panel" onClick={() => setPanelOpen(true)}><PanelRightOpen size={18}/></button>}</div>
        </header>

        <div className="center-content">
          <div className="context-pill"><span/>Project context active</div>
          <h1>What would you like to work on?</h1>
          <p className="hero-sub">Chat normally. Keep complex work visible when you need it.</p>
          <div className="composer"><button className="plus">+</button><span>Ask anything, plan a task, or @ a project…</span><button className="model">Astra <ChevronDown size={13}/></button><button className="send"><Send size={18}/></button></div>
          <div className="quick-chips">
            <button><FileText size={14}/>Continue project</button><button><TerminalSquare size={14}/>Run code</button><button><SquareCheckBig size={14}/>Analyze files</button><button><ImageIcon size={14}/>Create</button><button><MoreHorizontal size={14}/>More</button>
          </div>
          <div className="section-heading"><h2>Your projects</h2><button>View all →</button></div>
          <div className="project-cards">
            {demoProjects.map((project) => (
              <button key={project.id} className="project-card" onClick={() => setActiveProject(project)}>
                <div className="project-art"><Image src={project.artwork} alt="" fill sizes="180px" priority /></div>
                <div className="project-card-copy"><strong>{project.name}</strong><span>{project.subtitle}<em>fixture</em></span></div>
              </button>
            ))}
          </div>
          <div className="section-heading activity-heading"><h2>Recent activity</h2><button>Filter <ChevronDown size={12}/></button></div>
          <div className="activity-list">
            {activityRows.map(([title, project, when]) => <div className="activity-row" key={title}><div className="activity-icon">✓</div><strong>{title}</strong><span>{project}</span><time>{when}</time></div>)}
          </div>
        </div>
      </section>

      {panelOpen && (
        <aside className="project-panel">
          <header className="panel-header"><div><h2>Project</h2><span className="live-badge">● LIVE</span></div><div className="panel-controls"><button onClick={() => setPanelWide((v) => !v)} title="Toggle inspector width"><PanelRightOpen size={17}/></button><button onClick={() => setPanelOpen(false)} title="Close panel"><X size={18}/></button></div></header>
          <div className="panel-tabs">{tabs.map((item) => <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item}{item === "Needs you" && needsYou > 0 && <b>{needsYou}</b>}</button>)}</div>
          <div className="panel-scroll">
            <ProjectSummaryCard projectName={activeProject.name} />
            {tab === "Overview" && <Overview approval={approval} onApprove={approvePreview} onChanges={() => setApprovalState("changes-requested")} paused={runPaused} setPaused={setRunPaused} needsYou={needsYou} receipts={receipts}/>}            
            {tab === "Needs you" && <NeedsYouView approval={approval} onApprove={approvePreview} onChanges={() => setApprovalState("changes-requested")} />}
            {tab === "Tasks" && <TasksView />}
            {tab === "Runs" && <RunsView paused={runPaused} setPaused={setRunPaused} />}
            {tab === "Files" && <FilesView />}
          </div>
        </aside>
      )}
    </main>
  );
}

function ProjectSummaryCard({ projectName }: { projectName: string }) {
  return <section className="panel-card project-summary"><div className="project-summary-top"><div className="project-orb"><span /></div><div><strong>{projectName}</strong><p>Fictional demo workspace · local fixture data</p></div><button>Open ↗</button></div><div className="project-stats"><span><strong className="ok">● Synced</strong><small>just now</small></span><span><strong>18 files</strong><small>workspace</small></span><span><strong>preview</strong><small>demo branch</small></span></div></section>;
}

function Overview({ approval, onApprove, onChanges, paused, setPaused, needsYou, receipts }: any) {
  return <>
    {needsYou > 0 && <ApprovalCard approval={approval} onApprove={onApprove} onChanges={onChanges}/>}    
    <RunCard paused={paused} setPaused={setPaused}/>
    <QueueCard />
    <ConnectedTools />
    <section className="panel-card advanced-card"><div><strong>Advanced</strong><span>permissions · model · logs · evidence · integrations</span></div><button>›</button></section>
    {needsYou === 0 && receipts[0] && <section className="panel-card receipt-mini"><Sparkles size={16}/><div><strong>{receipts[0].title}</strong><span>{receipts[0].detail}</span></div></section>}
    <p className="principle"><b>STRATOS PRINCIPLE</b> Conversation first. Project state appears when work needs visibility or a decision.</p>
  </>;
}

function ApprovalCard({ approval, onApprove, onChanges }: any) {
  if (approval.state !== "waiting") return <section className="panel-card resolution-card"><SquareCheckBig size={20}/><div><strong>{approval.state === "approved" ? "Approval complete" : "Changes requested"}</strong><span>The demo state has been updated locally.</span></div></section>;
  return <section className="panel-card approval-card"><div className="card-label"><strong>Needs you</strong><span>1 approval</span></div><h3>{approval.title}</h3><p>{approval.summary}</p><div className="approval-stats"><span><b>{approval.filesChanged}</b><small>files changed</small></span><span><b>{approval.checksPassed}</b><small>checks passed</small></span><span><b>{approval.target}</b><small>target</small></span></div><div className="two-buttons"><button className="light" onClick={onApprove}>Review & approve</button><button onClick={onChanges}>Ask for changes</button></div></section>;
}

function RunCard({ paused, setPaused }: { paused: boolean; setPaused: (value: boolean) => void }) {
  return <section className="panel-card run-card"><div className="card-label"><strong>Running</strong><span className="active-state">{paused ? "PAUSED" : "ACTIVE"}</span></div><h3>{initialRun.title}</h3><p>{initialRun.detail}</p><div className="progress-track"><span style={{ width: `${initialRun.progress}%` }}/></div><div className="progress-meta"><span>18 of 26 views checked</span><span>elapsed {initialRun.elapsed}</span></div><div className="two-buttons"><button className="light">View run</button><button onClick={() => setPaused(!paused)}>{paused ? <Play size={14}/> : <Pause size={14}/>} {paused ? "Resume" : "Pause"}</button></div></section>;
}

function QueueCard() { return <section className="panel-card queue-card"><div className="card-label"><strong>Up next</strong><span>{initialTasks.length} tasks</span></div>{initialTasks.map((task) => <div className="queue-row" key={task.id}><i/><span>{task.title}</span><time>{task.estimate}</time></div>)}</section>; }

function ConnectedTools() { return <section className="panel-card tools-card"><div className="card-label"><strong>Connected tools</strong><span>project scoped</span></div><div className="tool-grid"><button><Code2 size={18}/>Open in Codex</button><button><Github size={18}/>GitHub</button><button><Sparkles size={18}/>Preview</button><button><Boxes size={18}/>Design</button></div></section>; }

function NeedsYouView(props: any) { return <><ApprovalCard {...props}/><section className="panel-card empty-note"><strong>Nothing else needs your attention.</strong><span>Blockers and approval requests will appear here.</span></section></>; }
function TasksView() { return <section className="panel-card list-view"><div className="card-label"><strong>Tasks</strong><span>fixture queue</span></div>{initialTasks.map((task) => <div className="detail-row" key={task.id}><SquareCheckBig size={16}/><div><strong>{task.title}</strong><span>{task.state} · {task.estimate}</span></div></div>)}</section>; }
function RunsView({ paused, setPaused }: any) { return <><RunCard paused={paused} setPaused={setPaused}/><section className="panel-card list-view"><div className="card-label"><strong>Recent runs</strong><span>2</span></div><div className="detail-row"><Activity size={16}/><div><strong>Component snapshot sweep</strong><span>complete · 4m 12s</span></div></div><div className="detail-row"><Activity size={16}/><div><strong>Accessibility smoke test</strong><span>complete · 2m 08s</span></div></div></section></>; }
function FilesView() { return <section className="panel-card list-view"><div className="card-label"><strong>Files</strong><span>7 changed</span></div>{["app/dashboard/page.tsx","components/metric-card.tsx","styles/dashboard.css","tests/dashboard.spec.ts"].map((file) => <div className="detail-row" key={file}><FileText size={16}/><div><strong>{file}</strong><span>modified · fixture</span></div></div>)}</section>; }
