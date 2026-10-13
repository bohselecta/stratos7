# Work-pass verification

Completed against the local production build on September 6, 2026.

- `npm run build`: passed, statically rendered home route.
- `npm run check`: passed TypeScript and the demo-data audit (30 fixture records).
- `npm run test:e2e`: 12 browser tests passed.
- Canonical flow: pinned Atlas observation while navigating to Orion; approval summary and evidence; approval; run completion; local preview; receipt surviving reload.
- Other interactions: pause/resume, required change-request text, task addition/completion, file diff inspection, keyboard tab navigation, Escape behavior, dialog focus restoration, panel sizing and persistence.
- Offline: approval and receipt work with browser networking disabled after the application is loaded.
- Responsive: no page or file-inspector horizontal overflow at 320, 390, 768, 1180, and 1440 pixels.
- Accessibility: automated axe WCAG A/AA scans passed on desktop and mobile. This does not replace a complete manual assistive-technology audit.
- Runtime: no browser errors detected in the canonical flow or the agent-browser visual check.
- Dependencies: `npm audit --omit=dev` reported zero vulnerabilities. A PostCSS override selects a patched compatible version.

`desktop.png` and `mobile.png` record the visual inspection. The generated atmosphere and project-specific SVG artwork are served from the repo.

All checks/evidence shown *inside* the product are fictional demonstration data; the results above describe tests of this implementation. The app does not publish a real preview, run a model, or connect to user accounts.
