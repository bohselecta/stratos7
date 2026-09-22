# Demo Data Policy

Stratos is intended to be safe to run, record, and publish without exposing a developer's private account state.

## Rule

**The demo must be populated only from fictional fixture data.**

The source of truth is `src/data/demo.ts`.

## Forbidden as seed data

Do not populate the interface from:

- ChatGPT chat history or project history
- current or past user project names
- GitHub repositories or usernames from the connected account
- local filenames or filesystem indexing
- browser history
- email, calendar, contacts, Drive, Slack, or other connectors
- profile name, location, organization, or client data

## Adapter rule

Future live integrations must sit behind a `ProjectSurfaceAdapter`. The default implementation remains a fixture adapter. Live adapters are opt-in and must never silently replace fixture data in a public/demo build.

## Fixture requirements

Every demo-domain record must:

- use an id beginning with `demo-`
- include `source: "fixture"`
- use fictional project/task/user content

`npm run audit:demo-data` performs a basic structural audit. It is not a substitute for review.

## Scoped experiment authorization — September 22, 2026

The user explicitly authorized the supplied general-purpose Adaptive Working Agreement prompt and related product notes for the new lab. The verbatim prompt is isolated in `public/labs/agreement/prompt.txt`; editorial concept notes contain no personal identity or unrelated history. The lab's six fictional task records live in `public/labs/agreement/fixtures.json` and are tagged as authored demonstrations, not measurements. See `public/labs/AGENTS.md` and `docs/ADAPTATION_LAB.md`.

This exception does not authorize importing other chats, personal project data, or account details. User-pasted evaluation transcripts remain in page memory, require an explicit export action to leave it, and must not become public seed data or be automatically committed. Inspect exports before sharing.
