# Kanban Board Test Strategy

## Scope

Target application:

`https://main-bvxea6i-yqgjk4adqrx5w.ch-1.platformsh.site/`

The test framework is prepared for automated functional, UX, accessibility, and lightweight performance checks. The next phase is exploratory defect identification, where these planned cases should be converted into executable tests as selectors and observed behavior are confirmed.

## Test Layers

- Smoke: application loads, default board is usable, no critical render errors.
- Functional regression: board, columns, cards, search, filters, drag/drop, bulk actions.
- Keyboard and accessibility: shortcuts, keyboard reorder, aria-live feedback, focus handling.
- UX validation: information density, blocked/WIP visual prominence, empty states.
- Performance checks: initial load and card operation latency on realistic data volumes, isolated from the main CI suite.

## Requirement Coverage Matrix

| ID                 | Requirement                                                                        | Planned Coverage                                                                                             |
| ------------------ | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| FR1                | Create, rename, reorder, archive columns; WIP limits with soft warn and hard block | Covered by column management regression tests, including WIP breach and hard-block movement cases.           |
| FR2                | Column policies and descriptions visible on hover/click                            | Covered by column metadata visibility tests using hover/click assertions.                                    |
| FR3                | Default columns: To Do, In progress, Done                                          | Covered by smoke and board initialization tests.                                                             |
| FR4                | Toggle swimlanes on/off per board                                                  | Covered by swimlane visibility and persistence tests.                                                        |
| FR5                | Drag-and-drop across columns and between swimlanes                                 | Covered by drag/drop interaction tests for mouse and keyboard where supported.                               |
| FR6                | Card fields: required title, description, priority, due date                       | Covered by create/edit validation and field persistence tests.                                               |
| FR7                | Card edit using modal dialog for title and due date                                | Covered by modal open/edit/save/cancel tests.                                                                |
| FR8                | Reorder within a column; stable card numbering across moves                        | Covered by intra-column reorder and card identity tests.                                                     |
| FR9                | Bulk actions: move, archive                                                        | Covered by multi-select bulk movement/archive tests.                                                         |
| FR10               | Blocked state with reason and optional dependency link                             | Covered by blocked card form and persistence tests.                                                          |
| FR11               | Blocked cards visually prominent                                                   | Covered by UI prominence checks for badge/style/accessibility name.                                          |
| FR12               | Global search across titles and descriptions                                       | Covered by search result inclusion/exclusion tests.                                                          |
| FR13               | Advanced filters: priority, blocked, date ranges                                   | Covered by filter combination tests and reset behavior.                                                      |
| NFR Performance    | P95 interactive latency under 150ms; load under 2s for up to 1,000 cards           | Covered by Playwright timing probes and synthetic/seeded board performance tests if data setup is available. |
| NFR Scalability    | Support boards up to 1,000 cards                                                   | Covered by generated data or app seed-state tests once setup mechanism is known.                             |
| UX Density         | Compact layout; 12-16 cards visible per column at 1080p                            | Covered by viewport layout assertions and screenshot review.                                                 |
| UX Drag/Keyboard   | Smooth drag/drop, autoscroll, keyboard reorder, aria-live                          | Covered by interaction and accessibility regression tests.                                                   |
| UX Visual Language | Tags, blocked badges, WIP breaches high contrast                                   | Covered by visual state and contrast-oriented assertions.                                                    |
| UX Shortcuts       | N, E, F, S, ?, discoverable via command palette                                    | Covered by keyboard shortcut tests and command palette discovery tests.                                      |
| UX Empty States    | Guided tips and sample template cards                                              | Covered by empty board/column state tests once reset or clean-board setup exists.                            |

## Planned Test Cases

### Board and Column Management

| Case      | What to Test                                     | How                                                                                                     |
| --------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `FR3-001` | New/default board shows To Do, In progress, Done | Navigate to board and assert columns by accessible name/text.                                           |
| `FR1-001` | Create a column                                  | Use add-column control, save name, assert new column appears in expected position.                      |
| `FR1-002` | Rename a column                                  | Open column settings, rename, assert cards remain in column.                                            |
| `FR1-003` | Reorder columns                                  | Drag column handle or keyboard reorder, assert final order.                                             |
| `FR1-004` | Archive a column                                 | Archive column, assert it disappears from active board and cards are handled according to app behavior. |
| `FR1-005` | WIP soft limit warning                           | Set limit below card count, assert high-contrast warning but card movement remains allowed.             |
| `FR1-006` | WIP hard block                                   | Enable hard block, try to exceed limit, assert move is blocked and user receives actionable feedback.   |
| `FR2-001` | Column policy/description visibility             | Add/view metadata, trigger hover/click, assert content is visible and dismissible.                      |

### Swimlanes and Drag-and-Drop

| Case      | What to Test                  | How                                                                                    |
| --------- | ----------------------------- | -------------------------------------------------------------------------------------- |
| `FR4-001` | Toggle swimlanes on/off       | Toggle board setting and assert lane containers appear/disappear without losing cards. |
| `FR5-001` | Move card across columns      | Drag a card from To Do to In progress and assert column membership changes.            |
| `FR5-002` | Move card between swimlanes   | Drag across lane boundary and assert lane membership changes.                          |
| `FR8-001` | Reorder cards within a column | Drag within same column, assert order changes.                                         |
| `FR8-002` | Card number stays stable      | Capture card number, move/reorder, assert same number remains attached to same title.  |

### Card Management

| Case       | What to Test                | How                                                                            |
| ---------- | --------------------------- | ------------------------------------------------------------------------------ |
| `FR6-001`  | Title is required           | Submit card form with blank title and assert validation.                       |
| `FR6-002`  | Create card with all fields | Fill title, description, priority, due date, assert persisted card details.    |
| `FR7-001`  | Edit title in modal         | Open card modal, update title, save, assert board updates.                     |
| `FR7-002`  | Edit due date in modal      | Open card modal, update due date, save, assert displayed due date updates.     |
| `FR9-001`  | Bulk move cards             | Select multiple cards, move to another column, assert all selected cards move. |
| `FR9-002`  | Bulk archive cards          | Select multiple cards, archive, assert cards are removed from active board.    |
| `FR10-001` | Mark blocked with reason    | Set blocked state and reason, assert reason persists in card/modal.            |
| `FR10-002` | Add dependency link         | Add dependency link, save, assert link persists and is usable.                 |
| `FR11-001` | Blocked card prominence     | Assert blocked badge/visual treatment is visible and distinguishable.          |

### Search, Filters, and Views

| Case       | What to Test            | How                                                                       |
| ---------- | ----------------------- | ------------------------------------------------------------------------- |
| `FR12-001` | Search by title         | Search unique title, assert matching card visible and non-matches hidden. |
| `FR12-002` | Search by description   | Search term only present in description, assert card is found.            |
| `FR13-001` | Filter by priority      | Apply each priority filter and assert only matching cards remain.         |
| `FR13-002` | Filter by blocked state | Filter blocked/unblocked and assert result set.                           |
| `FR13-003` | Filter by date range    | Create cards inside/outside range and assert filter behavior.             |
| `FR13-004` | Combine filters         | Combine priority, blocked, and date range; assert intersection result.    |

### UX, Accessibility, and Performance

| Case       | What to Test                    | How                                                                                  |
| ---------- | ------------------------------- | ------------------------------------------------------------------------------------ |
| `UX-001`   | Compact density at 1080p        | At 1920x1080, assert 12-16 cards are visible in a column without scrolling the page. |
| `UX-002`   | Keyboard shortcuts              | Press N/E/F/S/? and assert expected command/modal behavior.                          |
| `UX-003`   | Command palette discoverability | Open help/command palette and assert shortcuts are listed.                           |
| `UX-004`   | Keyboard reorder with aria-live | Use keyboard movement and assert order plus live-region announcement.                |
| `UX-005`   | Empty states                    | Use empty board/column setup and assert guided tips/sample cards.                    |
| `PERF-001` | Initial board load under 2s     | Capture navigation/load timings for a board with up to 1,000 cards.                  |
| `PERF-002` | Card operation P95 under 150ms  | Measure repeated create/edit/move operations and calculate P95.                      |

## Coverage Summary

Planned coverage includes every listed functional requirement (`FR1-FR13`) plus the stated performance, scalability, and UX expectations. The only conditional area is the 1,000-card scalability/performance suite, because it depends on discovering whether the demo app exposes a seed/reset API, local storage model, backend endpoint, or fixture import mechanism.

## Execution Tags

- `@smoke` - fast checks for deployment availability.
- `@regression` - functional and UX regression checks.
- `@performance` - timing and scalability checks, run through the dedicated performance workflow/script rather than the main CI suite.

Avoid stacking tags on every test. The test title and folder already provide enough context.
