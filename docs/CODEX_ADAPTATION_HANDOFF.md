# Codex continuation — Adaptive Working Agreement lab

Read `AGENTS.md`, `public/labs/AGENTS.md`, `docs/ADAPTATION_LAB.md`, and the existing North Star first. The new experiment is implemented as static browser modules served from `public/labs/agreement/`; the root page adds only a discovery link and retains `StratosShell`.

## Bounded next task

1. Preserve all existing approved Stratos7 work and demo-data boundaries. Inspect current changes before editing; do not overwrite another agent's work. No unrelated redesign, dependency refresh, new paid service, account import, automatic model eval, or deployment project creation.
2. Install existing dependencies only as required by the current checkout. Run the existing demo-data audit, TypeScript check, and Next.js build. Also run `node --test tests/agreement.test.mjs`. Fix only regressions caused by this addition. Document pre-existing failures separately.
3. Run a REAL browser against the Next.js dev/production server. Inspect `/` and `/labs/agreement/index.html`. The authoring receipt used an offline DOM harness, so verify routing, ESM imports, asset paths, CSP, iframe rendering, clipboard fallback, file export/import, and root discovery-link placement. Exercise keyboard navigation and 320/390/768/1180/1440/1600 widths. Move the discovery link into the existing navigation only if needed for overlap/accessibility; preserve the overall composition.
4. Exercise initial empty preview; first-turn artifact; accepted-revision pin; undo without artifact rollback; revision-specific checks; interrupted-update simulation; casual no-artifact behavior; exact JSON with no footer; task isolation; ledger unknown values; invalid and duplicate import rejection; randomized pairwise choices; export/re-import. Keep tests' synthetic observations out of shipped fixtures.
5. Add screenshot/command receipts with exact paths and distinguish checks run from unobserved results. If the repository's EXISTING GitHub→Vercel integration yields a preview, inspect that URL and report the commit/deployment identity. Do not claim deployment without a returned and checked URL.
6. Stop after the integrated prototype passes and report remaining limitations. Do not implement a live remote builder, hosted LLM evaluator, persistent account memory, or native ChatGPT changes in this pass.

## Follow-on experiments, not authorization to expand this task

- Review centered versus docked Build Preview with the user; keep its name about the window, not a prerelease status.
- Run the frozen eighteen-conversation pilot manually with the same model/settings. Do not run it automatically or spend API credits. Do not treat the six authored sample traces as comparative results.
- Later connect an explicitly approved artifact adapter, with ownership/revision validation and isolated rendering. Preserve `produced`, `checked`, `accepted`, and `published` as independent states.

Acceptance report must say what was produced, what was checked, what was confirmed, and what remains unknown. Never “all done” based only on a static code read.
