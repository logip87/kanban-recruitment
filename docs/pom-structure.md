# Page Object Model Structure

## Current Layout

```text
fixtures/
  test.ts                # Shared Playwright fixtures
pages/
  BasePage.ts            # Shared page abstraction with navigation helpers
  BoardPage.ts           # Board, columns, swimlanes, cards, drag/drop entry points
support/
  kanbanStore.ts         # Deterministic localStorage state setup
tests/
  smoke/
    app-load.spec.ts     # Minimal availability smoke test
```

## Intended Responsibilities

`BasePage`

- Store the Playwright `page`.
- Define the page-level `url` contract.
- Navigate with `goTo()` using the page object's own `url`.
- Assert route state with `expectUrl()`.
- Provide shared page readiness checks.

`BoardPage`

- Store board-specific locators.
- Keep locators constructor-assigned, following the Playwright POM example.
- Use stable selectors first. The current demo app does not expose `data-testid`, so the first pass uses app-owned class names such as `.board-view`, `.kanban-column`, and `.search-filter__input`.
- Prefer direct unique selectors. Scope through a parent locator only when the same selector appears in multiple places or needs context.
- Add workflow methods only when they combine multiple meaningful UI actions.

## Locator Strategy

1. Prefer app-owned stable selectors such as `data-testid`.
2. If no test ids exist, use stable app-owned classes or ids.
3. Use visible business text only to distinguish repeated elements, for example one column title inside `.kanban-column__title`.
4. Avoid regex and chained fallback locators unless the app has no better selector.
5. Declare reusable locators as class properties and assign them in the constructor.
6. Do not add methods that only wrap one Playwright action such as `fill`, `click`, or `goTo`.

The first defect-identification pass should inspect the DOM and update `BoardPage` with the most stable selectors exposed by the demo application. Introduce separate component classes only when repeated board fragments become complex enough to justify them.
