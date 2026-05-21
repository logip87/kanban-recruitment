# Kanban Recruitment QA Automation

Playwright + TypeScript test framework for the demo Kanban board application.

TEST REPORT 
https://logip87.github.io/kanban-recruitment/

Target application:

```text
https://main-bvxea6i-yqgjk4adqrx5w.ch-1.platformsh.site/
```

## Issues Found

The automated suite identifies the product defects below. Each expected-failing test is
annotated with an Allure issue link and a short description covering the observed result,
expected result, browser, and environment.

Issue list locations:

- Human-readable list: this README, in the table below.
- Allure issue metadata source: [`support/knownProductIssues.ts`](./support/knownProductIssues.ts).
- Published report: open the GitHub Pages Allure report, select a failed test, and check
  its Overview description and issue link.

| Covered by                                                       | Requirement      | Defect                                                                                                                          |
| ---------------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `FR1-001 creates a column`                                       | FR1              | Creating a new column through the Add column flow does not add the requested column to the board.                               |
| `FR1-002 renames a column`                                       | FR1              | Column rename is not reachable from the column settings flow; the expected column-name input never appears.                     |
| `FR1-006 hard WIP limit blocks extra card movement`              | FR1              | Hard WIP limit does not block moving another card into a full hard-blocked column.                                              |
| `FR2-001 column policy and description are visible on demand`    | FR2              | Column policy and description are not exposed on demand; the column info control is missing.                                    |
| `FR4-001 toggles swimlanes on and off without losing cards`      | FR4              | Enabling swimlanes hides or loses existing cards instead of preserving them in a lane.                                          |
| `FR6-001 requires a title when creating a card`                  | FR6              | Empty card creation is blocked, but no visible required-title validation message is shown.                                      |
| `FR11-001 blocked cards are visually prominent`                  | FR11             | Blocked cards receive a blocked class, but the required blocked badge is missing.                                               |
| `FR13-002 filters by blocked state`                              | FR13             | Blocked filter chip is ambiguous and partly untranslated, resolving as both `app.filters.blocked_only.label` and `Not blocked`. |
| `FR13-004 combines priority, blocked, and date filters`          | FR13             | Combined advanced filtering cannot reliably apply blocked filtering because the blocked filter option is ambiguous.             |
| `UX-002 keyboard shortcuts trigger expected controls`            | UX Shortcuts     | Keyboard shortcut `N` does not open the new-card control, so the documented shortcut workflow is not usable.                    |
| `UX-004 keyboard reorder announces changes with aria-live`       | UX Drag-and-drop | Keyboard reorder updates order, but `aria-live` announces implementation ids instead of a meaningful card title.                |
| `UX-005 empty states show guided tips and sample template cards` | UX Empty States  | Empty board state does not show the required guided tips or sample template card entry point.                                   |
| `UX-006 column settings form is not clipped for empty columns`   | UX Layout        | Column settings form is clipped when a column has no cards, making the lower edit fields partially hidden.                      |

## What Was Done

- Built a Playwright + TypeScript QA framework around a lean Page Object Model:
  `BasePage`, `BoardPage`, shared fixtures, and deterministic localStorage state setup.
- Added automated coverage for the assignment requirements: board/column management,
  swimlanes, drag-and-drop, card management, bulk actions, blocked cards, search,
  advanced filters, UX checks, and lightweight performance checks.
- Added smoke, regression, and performance test tags so the main CI suite can stay fast
  while performance tests run separately.
- Configured Allure 3 reporting, test-level issue annotations, GitHub Actions execution,
  and GitHub Pages publishing for the latest report.
- Configured Playwright artifacts to keep screenshots and traces for failures while
  disabling video capture.

## Requirement Coverage

The suite covers all functional requirements from the assignment (`FR1` through `FR13`)
plus the stated performance, scalability, and UX expectations.

| Area                    | Coverage                                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------------------ |
| Board and columns       | Default columns, create, rename, reorder, archive, WIP soft warning, WIP hard block, metadata.   |
| Swimlanes and DnD       | Swimlane toggle, cross-column movement, swimlane movement, in-column reorder, stable numbering.  |
| Card management         | Required title, full card fields, modal edits, bulk move/archive, blocked reason and dependency. |
| Search and filters      | Search by title/description, priority filter, blocked filter, due date range, combined filters.  |
| UX and accessibility    | Density, shortcuts, command palette discovery, aria-live reorder, empty states, clipped menus.   |
| Performance/scalability | 1,000-card initial load and card-operation P95 checks, isolated from the main CI run.            |

## Quick Start

```bash
npm install
npm run install:browsers
npm test
```

Override the target URL locally with:

```bash
DEMO_BASE_URL=https://example.test npm test
```

On Windows PowerShell:

```powershell
$env:DEMO_BASE_URL="https://example.test"; npm test
```

## Useful Scripts

- `npm run test:smoke` - quick application availability checks.
- `npm run test:chromium` - run only the Chromium project.
- `npm run test:ci` - run the main Chromium CI suite without `@performance` tests.
- `npm run test:performance` - run the dedicated Chromium performance checks.
- `npm run test:headed` - run with visible browser windows.
- `npm run test:debug` - open Playwright inspector.
- `npm run clean:test-results` - remove generated Playwright and Allure result folders.
- `npm run report` - open the HTML report after a run.
- `npm run report:allure` - generate the Allure 3 report from `allure-results`.
- `npm run report:allure:open` - serve the generated Allure report locally.
- `npm run history:allure` - append the current run to `allure-history/history.jsonl`.
- `npm run lint` - static analysis.
- `npm run typecheck` - TypeScript validation.
- `npm run format` - format repository files.

## Reports and Artifacts

The project uses Allure 3 with Playwright results written to `allure-results/`.
Allure configuration lives in `allurerc.mjs`, and known product defects are annotated
inside the relevant tests through `support/knownProductIssues.ts`.

```bash
npm run report:allure
```

The report still shows known product defects as failed test cases, which keeps the
product status visible. Open a failed test in Allure to see the issue link and the
description explaining why that test is expected to fail against the current demo app.
The raw Playwright step is allowed to continue so screenshots, traces, and Allure
history are still produced before the report is published.

History trends use `allure-history/history.jsonl`. CI restores this folder from the
GitHub Actions cache before report generation, then updates and saves it after the run.

Playwright is configured to retain traces and screenshots for failures. Video capture is
disabled, and CI artifact uploads exclude `.webm` files.

CI runs the main Chromium suite only, excluding `@performance` tests. Performance checks
run in the separate `Playwright Performance` workflow on `main`, nightly, and manually.

GitHub Actions publishes the latest Allure report to GitHub Pages after every push to
`main`:

```text
https://logip87.github.io/kanban-recruitment/
```

The workflow publishes the report even when product-defect tests fail, so the latest
evidence remains available on GitHub Pages.

## Documentation

- [Test strategy and coverage plan](./docs/test-strategy.md)
- [POM structure](./docs/pom-structure.md)
