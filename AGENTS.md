# Agent Guidelines

## Project

This repository contains Playwright TypeScript automated tests for the demo Kanban board:

`https://main-bvxea6i-yqgjk4adqrx5w.ch-1.platformsh.site/`

## Commands

- Install dependencies: `npm install`
- Install Playwright browsers: `npm run install:browsers`
- Run all tests: `npm test`
- Run smoke tests: `npm run test:smoke`
- Run Chromium only: `npm run test:chromium`
- Generate Allure report: `npm run report:allure`
- Open Allure report: `npm run report:allure:open`
- Regenerate Allure known issues after a failing run: `npm run known-issues`
- Type-check: `npm run typecheck`
- Lint: `npm run lint`
- Format: `npm run format`

## Automation Conventions

- Keep `tests/` for spec files only. Put fixtures in `fixtures/`, page objects in `pages/`, and state/helpers in `support/`.
- Keep the POM lean. For now this project has `BasePage` and `BoardPage`; do not add `BaseComponent`, modal objects, or extra abstractions until repeated complexity makes them necessary.
- Define POM locators as readonly class properties assigned in the constructor, following the Playwright POM docs.
- Prefer stable `data-testid`, ids, or unique app-owned classes. The current demo mostly exposes BEM-style classes, so use those directly.
- Do not use broad regex locators or fallback chains like role-or-placeholder-or-label unless there is no stable selector.
- If a class is unique enough, use `page.locator('.class-name')`. Do not scope through parent locators just to look fancy.
- Specs should not declare locators. Put selectors and text-based lookup helpers in `BoardPage`, then call named accessors/actions from tests.
- Keep test assertions in spec files unless the assertion represents a reusable page contract.
- Avoid hard waits. Use locator assertions, network/DOM state, or app-visible outcomes.
- Keep tags minimal. Use `@smoke` for smoke tests, `@regression` for functional/UX regression tests, and `@performance` for performance tests. Do not add requirement tags like `@FR1`.
- Keep defects reproducible: every bug should reference the failing test, observed result, expected result, browser, and environment.
- The fixture resets `kanban-store` before each test and seeds default columns (`To Do`, `In progress`, `Done`) through the app's localStorage state contract. Do not depend on app-generated default data.
- If a test needs custom state, call `seedKanbanStore(page, ...)` before `boardPage.goTo()`.
- Do not add one-line wrapper methods for single Playwright actions such as `fill`, `click`, or `goTo`. Tests can call actions directly on locators.
- Use `test.step()` for meaningful grouped phases such as preparing state, performing the user workflow, and verifying the outcome. Do not wrap every single click or assertion.
- Use `test.describe` only when grouping adds value. Do not wrap a single tiny smoke test in a describe block.
- Avoid weak generic assertions such as "no critical render error" when the next visible app locator will fail more clearly.
- Keep assertions specific. Do not use broad title regexes such as `/kanban|board|task|react|vite/i`; assert the exact expected value when known.
