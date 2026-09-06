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
