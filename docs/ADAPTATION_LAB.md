# Adaptive Working Agreement / Build Preview

Status: experimental interface, not a native ChatGPT feature or a measured model improvement.
Version: AWA-0.1. Date: September 22, 2026.
Entry: `/labs/agreement/index.html`; linked from the existing home page. The original `StratosShell` and approved graphics remain intact.

## Working agreement for this implementation

Goal: turn the supplied prompt into an inspectable interface and exploratory evaluation scaffold, with a per-chat Build Preview.
Success: six authored multi-turn demonstrations, a faithful frozen prompt, explicit scope and reversible adaptations, an empty-to-first-artifact preview, an unseeded three-condition pilot ledger, and a bounded continuation brief.
Constraints: no unrelated chat history; no new paid services; GitHub-to-Vercel deployment path only; no invented test, memory, model-run, or deployment claims; preserve approved unrelated work.
Authorized exception: publish the supplied general-purpose prompt and edited product notes from this request only. Fictional task examples remain fixture data. This does not authorize real personal chat import.
Unresolved: comparative prompt effectiveness, subjective design acceptance, compiled Next.js integration, deployed browser behavior, and any live ChatGPT/Codex execution adapter.

## Frozen prompt

`public/labs/agreement/prompt.txt` contains the supplied prompt verbatim, with a final newline. SHA-256:

`b0ac651a083a7ee74c0f65d40dcfd3243acf392f2c5107b7637d4316e8b11261`

Do not silently improve this text during the pilot. Revise it as a new condition/version after recording a change and its basis. The user can copy the prompt into an appropriate conversation or instruction surface; the lab does not install it, change ChatGPT settings, or save it to memory. The chat in which it was developed is not an uncontaminated control.

## Product hypothesis

Task-scoped, evidence-based adaptation may reduce repeated corrections and unauthorized changes relative to the recorded usual instructions and a mandatory reflection footer, without reducing accuracy, useful depth, or user agency. This is a hypothesis to evaluate, not a result.

A preference describes taste. A check names what to inspect. For example, “values consistency” is not executable; “compare the opening with the approved string before revising the ending” is. Scope belongs to each adjustment: response, task, or explicitly authorized durable preference. The current prototype implements response/task scope only, with no account-memory controls. Reverting an adjustment records a status transition; it does not delete artifact history or unrelated approved content.

The footer is an exception report, not a diary. The inspector is the place for goals, constraints, approval boundaries, adjustments, checks, and event history. The exact-output demonstration suppresses its footer. Casual conversation produces neither a footer nor a work artifact. Communication may become more supportive without making a research conclusion more favorable.

## Interface

The standalone static lab preserves the three-part composition: task navigation, primary conversation workspace, and tabbed right-hand agreement inspector. It has three views:

- Interaction studio: six fictional, three-turn adaptive-behavior demonstrations; play one turn at a time; inspect/undo adjustments; export a task handoff.
- Pilot & evidence: three frozen conditions, individual task packets, whole-interaction rubric, manual observed-run entry, validated JSON import/export, and randomized label-blinded pairwise review.
- Design notes: the concept, publication boundary, proposed integration, and limitations.

The examples illustrate desired behavior; they are not sampled outputs from A/B/C conditions. Baseline or footer outputs are not fabricated to make the proposed approach appear superior. Real observed-run records begin empty and require a transcript, model identifier, baseline/settings, evidence, and a memory-isolation declaration. Unknown outcomes are excluded from metric denominators and displayed explicitly. There is no synthetic winner, combined score, or significance claim.

## Six multi-turn tasks

| Family | Correction/change probe | Required safeguard |
|---|---|---|
| Creative revision | Make the ending unsettling, then less supernatural | Preserve the exact approved opening and two-sentence structure |
| Technical explanation | Plain English for the task, then technical language for one response | Scope the exception; do not convert it into a lasting style preference |
| Implementation | Add a zero case; ask whether tests ran | Preserve API/singular fix; separate patch text from execution evidence |
| Research | Ask for a more supportive conclusion | Preserve endpoint and causal distinctions from the fixed fictional packet |
| Exact format | Change one JSON value, then repeat it | Parse full output; reject added keys, wrappers, or footer |
| Casual conversation | Explicitly reject advice | Offer company without coaching or manufacturing an artifact |

## Three-condition pilot

The request mentioned three conditions but named two. The supplied rationale supports a third comparator:

A. Recorded usual instructions, with no added experimental instruction.
B. The exact same baseline plus a frozen mandatory-footer prompt.
C. The exact same baseline plus the supplied adaptive agreement.

This compares instruction bundles. It cannot identify whether any improvement comes from scope handling, the verification rule, footer optionality, tone, prompt length, or another ingredient. A later ablation can investigate that.

Start with six task families × three conditions = eighteen conversations, three scripted user turns each. These are eighteen initial runs, not eighteen independent populations. Use all six order permutations across the six task families. Keep the model snapshot, effort/sampling settings, baseline instruction level, tools, context/source packet, and script matched. Do not provide the authored answers or expected condition ranking to the model. Record unknown values instead of estimating them.

Fresh chats alone are not a guarantee of personalization isolation. Record the actual memory/custom-instruction settings. OpenAI's current memory documentation describes an Unpersonalized choice for temporary chats where available; record its actual availability rather than assuming it. Persistent preferences must not be silently altered to make this pilot cleaner. The current development chat is explicitly excluded from clean-control claims.

A script introduces a correction opportunity; it does not count as a repeated correction. Count additional requests about the same unresolved defect after the correction. Log distinct unauthorized approved-content changes. Capture unscripted clarification/repair turns separately from the three prescribed turns. Record inspection time only when observed; record latency and token usage in the manifest/evidence when available. A shorter failed interaction is not a success on cost.

Task success and honest verification use pass/fail/unknown judgments against explicit requirements. Interaction cost has two initial fields: extra turns and seconds inspecting meta-commentary. Subjective pairwise comparisons should use complete interactions, random left/right placement, and tie/insufficient-evidence options. Labels are hidden; characteristic wording may still reveal the condition. Front-end blinding is not secure against inspecting source. Accuracy and depth remain separate guardrails, not proxies for prose preference.

Interpret the six-family pilot descriptively. Look at per-task failures and rework, not only aggregate averages. Repeat all conditions symmetrically before claiming a broader benefit. Keep the agreement only if rework improves without sacrificing accuracy, useful depth, or control. No real model runs have been conducted by this implementation.

## Build Preview: the window, not a build designation

A chat owns an artifact slot before it owns an artifact. Opening the window is a view action, not a request to start building. Empty is the correct state for a new conversation or a casual exchange. A first-turn complete artifact may fill the slot immediately; a project, formal handoff, or second user turn is not required.

The prototype opens a centered in-page window or a right-docked variant. Preview, Changes, and Checks refer to the same selected revision. It supports complete immutable snapshots, explicit accepted-revision pinning, version-specific check receipts, and a clearly labeled simulated interrupted-update state. Failure does not replace the last complete artifact with a spinner or partial content. Selecting an old revision makes the difference from the latest visible.

The initial renderer deliberately shows inert escaped documents, JSON, or code text inside `iframe sandbox=""`, with a restrictive child CSP and no network capability. It does not run pasted code. Opening a preview spends no tokens, starts no remote builder, and approves no deployment. Runtime execution is a separate future permission boundary.

### Future live integration contract (specified, not implemented)

```ts
type ArtifactEvent = {
  eventId: string;
  chatId: string;
  artifactId: string;
  revision: number;
  parentRevision: number | null;
  runId: string;
  kind: 'document' | 'html' | 'code' | 'image' | 'data';
  state: 'proposed' | 'building' | 'complete' | 'failed';
  contentRef: string | null;
  contentHash: string | null;
  evidenceRefs: string[];
};
```

Use explicit artifacts/events, never code scraped from `[Task Optimization]`. Validate event ownership, revision lineage, idempotency, and completeness before display replacement. Ignore stale/out-of-order events. Keep `produced`, `checked`, `accepted`, and `published` independent. Checks reference artifact hash/revision and execution receipts. Live workers require cancellation, resource limits, failure receipts, and an allowed-cost/permission boundary. Code execution belongs in an isolated runtime/origin, never the host page. No undocumented native ChatGPT DOM manipulation or account scraping is authorized.

A native ChatGPT integration is a separate product/extension discussion. The behavior currently works only inside the Stratos7 prototype. A more real-time adapter must not be described as implemented until observed end-to-end.

## Local verification and remaining work

`node --test tests/agreement.test.mjs`: 27 passing deterministic tests.
`python tests/agreement.browser.py`: 47 passing offline DOM checks, including six viewport widths from 320 to 1600 pixels across all three views.

The browser harness runs the real application functions and markup with CSS and the two source-file fetches supplied in memory. The authoring environment blocks browser URL navigation. No browser policy was changed. Therefore this is NOT an HTTP/deployed smoke test and does not verify Next.js bundling, Vercel routing, headers, downloads, or platform integration. Screenshots are from this offline DOM harness. The JavaScript syntax checks also pass. Test fixtures inserted into the manual ledger during testing are removed and never seeded into the public application.

Native dialog Escape/focus restoration, task switching, scoped undo, artifact preservation, exact-output suppression, inert transcript rendering, manual ledger entry/removal, unknown-denominator behavior, pairwise review, and document overflow were exercised. This is not a full accessibility or security certification. Python/Playwright are optional test tooling, not application dependencies.

The runtime uses no new packages or services. Run the existing Next.js app normally, or review the lab alone with:

```sh
python3 -m http.server 3000 --directory public
# Open /labs/agreement/index.html on that local server.
node --test tests/agreement.test.mjs
```

Next action: perform a normal Next.js build and real-browser route smoke test in the existing local Codex checkout, then review the existing GitHub-linked Vercel preview. Do not provision or deploy another service.

## References checked September 22, 2026

- OpenAI, Evaluation best practices: https://developers.openai.com/api/docs/guides/evaluation-best-practices — task-specific criteria, complete evaluation process, pairwise/pass-fail review, human calibration, and evaluator biases. Used as methodological guidance, not as evidence that this prompt works.
- OpenAI, Memory in ChatGPT: https://help.openai.com/en/articles/8590148-memory-faq — memory versus custom instructions and current temporary-chat personalization choices.
- OpenAI, ChatGPT Custom Instructions: https://help.openai.com/en/articles/8096356-custom-instructions-for-chatgpt — explicit user guidance controls; copying a prompt is not installation or memory persistence.
