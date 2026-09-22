import { StratosShell } from "@/components/stratos-shell";

export default function Home() {
  return <>
    <StratosShell />
    <a href="/labs/agreement/index.html" aria-label="Open the Adaptive Working Agreement experiment" style={{ position: "fixed", bottom: 20, right: 22, zIndex: 10, display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 15px", border: "1px solid #575066", borderRadius: 11, background: "#282431", color: "#e5def5", textDecoration: "none", fontSize: 12, boxShadow: "0 6px 24px #0005" }}>
      <span aria-hidden="true">◫</span> Adaptation Lab <span aria-hidden="true">↗</span>
    </a>
  </>;
}
