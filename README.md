# ChatGPT 7 — Stratos

**Stratos** is a product-design prototype for a persistent project control surface inside ChatGPT/Codex.

The core idea is simple: **conversation remains primary while complex work gains a visible, inspectable, controllable state layer.** A right-hand Project panel can stay open across chats and workspaces, showing approvals, active runs, queued tasks, files, context, evidence, and scoped integrations without turning the main ChatGPT surface into an IDE.

> Status: product demo scaffold, not an OpenAI product and not connected to private ChatGPT data.

## North Star

The visual reference lives at `public/reference/stratos7-north-star.svg`.

## Demo data guarantee

This repository must remain safe to present publicly. **All content in the demo is fictional fixture data.** Do not import or seed the interface from a developer's real ChatGPT history, browser history, GitHub account, local filesystem, contacts, calendar, email, or any other connected source.

See `docs/DEMO_DATA_POLICY.md` and `AGENTS.md` before adding data or integrations.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Prototype goals

- Persistent right-side Project panel
- Overview / Needs you / Tasks / Runs / Files tabs
- Human authorization before consequential state changes
- Running task progress, evidence, and receipts
- Progressive disclosure for advanced technical detail
- Panel states: collapsed, standard, wide inspector, full screen
- Mocked adapters that can later map to Codex, GitHub, Vercel, Drive, Figma, etc.
- High visual fidelity to the North Star render

## Repo map

```text
src/app/                 Next.js app shell
src/components/          Stratos UI components
src/data/demo.ts         only allowed seed data for the demo
src/lib/types.ts         product-domain types
public/graphics/         fictional project artwork
public/reference/        North Star reference render
scripts/                 demo-data and quality checks
docs/                    product + interaction specifications
AGENTS.md                 Codex build instructions
```

## Recommended handoff

Give Codex the repository plus `public/reference/stratos7-north-star.svg` and ask it to execute `AGENTS.md` in phases. Do not ask Codex to infer demo content from your current ChatGPT account or connected services.
