# Stratos Product Spec

## Problem

Long-running AI work becomes hard to supervise when progress, approvals, artifacts, and execution state are scattered across chats, tools, repositories, and background runs. The main conversation UI should not become an IDE, but users still need an always-available way to understand and control complex work.

## Product hypothesis

A persistent right-hand **Project** surface gives ChatGPT a depth axis:

- conversation remains the default and visually dominant
- durable work state is visible without changing destinations
- approvals and blockers can interrupt appropriately
- evidence and technical detail remain available through progressive disclosure
- the same mental model can span ChatGPT, Codex, and connected tools

## Primary user questions

At any moment the panel should answer:

1. What is happening?
2. What is doing it?
3. What can it change?
4. What changed?
5. Does anything need me?
6. What evidence or receipt exists?

## Design principles

- Conversation first, machinery available.
- Human authority is explicit for consequential changes.
- Status without evidence is insufficient.
- Advanced detail is discoverable, not dumped on everyone.
- Persistence matters more than dashboard density.
- The panel should feel native to ChatGPT, not like a third-party admin console.
- No fake ETAs; show stage, elapsed time, and progress unless prediction is genuinely available.

## North Star layout

Three layers on desktop:

1. left: global navigation and project switching
2. center: conversation / intent / primary workspace
3. right: persistent project observation and control

The right surface supports collapsed, standard, wide-inspector, and full-screen forms.
