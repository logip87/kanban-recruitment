# Kanban Recruitment QA Automation

Playwright + TypeScript test framework for the demo Kanban board application.

## Quick Start

```bash
npm install
npm run install:browsers
npm test
```

The target URL defaults to:

```text
https://main-bvxea6i-yqgjk4adqrx5w.ch-1.platformsh.site/
```

Override it locally with:

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
- `npm run test:headed` - run with visible browser windows.
- `npm run test:debug` - open Playwright inspector.
- `npm run report` - open the HTML report after a run.
- `npm run report:allure` - generate the Allure 3 report from `allure-results`.
- `npm run report:allure:open` - serve the generated Allure report locally.
- `npm run known-issues` - regenerate `allure/known.json` from current failed Allure results.
- `npm run lint` - static analysis.
- `npm run typecheck` - TypeScript validation.
- `npm run format` - format repository files.

## Allure Report

The project uses Allure 3 with Playwright results written to `allure-results/`.
Allure configuration lives in `allurerc.mjs`, and known product defects are tracked in
`allure/known.json` through Allure 3 known issues.

CI runs the Chromium project only, with Playwright workers enabled in parallel.

GitHub Actions publishes the latest Allure report to GitHub Pages after every push to
`main`:

```text
https://logip87.github.io/kanban-recruitment/
```

The workflow still uploads the report when tests fail, then fails the job so the build
status remains honest.

## Known Defects

Issue list location:

- Human-readable list: this README, in the table below.
- Allure known issues source: [`allure/known.json`](./allure/known.json).
- Published report: open the GitHub Pages Allure report and check the Known issues view.

These defects are also listed in `allure/known.json`, so Allure can separate known product
failures from new failures.

| ID     | Covered by                                                       | Requirement      | Defect                                                                                                                          |
| ------ | ---------------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| KB-001 | `FR1-001 creates a column`                                       | FR1              | Creating a new column through the Add column flow does not add the requested column to the board.                               |
| KB-002 | `FR1-002 renames a column`                                       | FR1              | Column rename is not reachable from the column settings flow; the expected column-name input never appears.                     |
| KB-003 | `FR1-006 hard WIP limit blocks extra card movement`              | FR1              | Hard WIP limit does not block moving another card into a full hard-blocked column.                                              |
| KB-004 | `FR2-001 column policy and description are visible on demand`    | FR2              | Column policy and description are not exposed on demand; the column info control is missing.                                    |
| KB-005 | `FR4-001 toggles swimlanes on and off without losing cards`      | FR4              | Enabling swimlanes hides or loses existing cards instead of preserving them in a lane.                                          |
| KB-006 | `FR6-001 requires a title when creating a card`                  | FR6              | Empty card creation is blocked, but no visible required-title validation message is shown.                                      |
| KB-007 | `FR11-001 blocked cards are visually prominent`                  | FR11             | Blocked cards receive a blocked class, but the required blocked badge is missing.                                               |
| KB-008 | `FR13-002 filters by blocked state`                              | FR13             | Blocked filter chip is ambiguous and partly untranslated, resolving as both `app.filters.blocked_only.label` and `Not blocked`. |
| KB-009 | `FR13-004 combines priority, blocked, and date filters`          | FR13             | Combined advanced filtering cannot reliably apply blocked filtering because the blocked filter option is ambiguous.             |
| KB-010 | `UX-002 keyboard shortcuts trigger expected controls`            | UX Shortcuts     | Keyboard shortcut `N` does not open the new-card control, so the documented shortcut workflow is not usable.                    |
| KB-011 | `UX-004 keyboard reorder announces changes with aria-live`       | UX Drag-and-drop | Keyboard reorder updates order, but `aria-live` announces implementation ids instead of a meaningful card title.                |
| KB-012 | `UX-005 empty states show guided tips and sample template cards` | UX Empty States  | Empty board state does not show the required guided tips or sample template card entry point.                                   |

## Documentation

- [Test strategy and coverage plan](./docs/test-strategy.md)
- [POM structure](./docs/pom-structure.md)
