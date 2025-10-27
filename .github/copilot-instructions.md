## Cinewatch — Copilot instructions for code edits

These instructions are targeted guidance for AI coding agents working on the Cinewatch frontend (Vue 3 + Vite). Keep edits minimal, localised, and consistent with repository conventions.

1. Project overview
	- This is a Vue 3 single-page app built with Vite. Entry point: `src/main.js` and root `App.vue`.
	- UI uses a shared component library `@lewishowles/components` (registered in `main.js`). Styles use Tailwind (see `vite.config.js` and `src/assets/css/main.css`).
	- The app pairs with a separate `cinewatch-api` service. Frontend expects a base API URL at `http://localhost:3000/api` by default (see `src/composables/use-api/use-api.js`).

2. Architecture & conventions
	- Composition API + single-file components (SFCs) are used across `src/components` and `src/composables`.
	- Composables follow a directory-per-composable pattern, e.g. `src/composables/use-api/use-api.js` with tests next to them `use-api.test.js`.
	- Aliases in `vite.config.js`: `@` → `src`, `@cypress` → `test/cypress`, `@unit` → `test/unit`. Use these aliases when adding imports.
	- Global plugin registration and mocks for unit tests: `test/unit/setup.js` registers `@lewishowles/components` and mocks `fetch` globally with Vitest's `vi`.
	- Tests use Vitest for unit tests and Cypress for component/e2e tests. Unit test support files and mocks exist in `test/unit/support` and `test/cypress/support`.

3. Testing and run commands (developer workflows)
	- Local dev: npm run dev (starts Vite dev server)
	- Build: npm run build
	- Preview static build (used by E2E): npm run preview (Vite preview defaults to port used in scripts)
	- Unit tests (Vitest): `npm run test:unit`, `npm run test:unit:run`, or `npm run test:unit:ui` for the UI runner.
	- Component tests (Cypress): `npm run test:component` (component mode). E2E is orchestrated by `npm run test:e2e` which uses start-server-and-test and the preview server.
	- When adding tests: follow existing patterns — use `test/unit/setup.js` for global setup, use `vi` to mock functions, and place unit tests alongside their modules.
	- When writing tests for component or composable methods, wrap tests for a method in a `describe` block named for the method, and wrap all method tests in a `describe` block named `Methods`.
	- When writing the names for tests, use plain english and full sentences. e.g. "Switches to the details page", not "switches to details page".
	- Always start test names with a capital, unless the name starts with a variable.

4. Importing, mocking and network calls
	- The project frequently mocks fetch globally in `test/unit/setup.js`. When writing unit tests, prefer mocking fetch with Vitest's `vi.fn()` or mocking composables (see `test/unit/support/mock-api.js` which vi.mock()s `@/composables/use-api/use-api`).
	- For composables that return refs (isLoading, isReady), tests access `.value` directly (see `use-api.test.js`).
	- API base URL is configurable per-composable via `setBaseUrl()` in `use-api`. Use this to isolate tests from environment URLs.

5. Code style and linting
	- ESLint is configured; run `npm run lint` to autofix style issues. Respect existing indentation and naming conventions.
	- Keep changes minimal — prefer small focused commits/PRs that update a single feature or test file.

6. Patterns and gotchas (explicit examples)
	- Composable pattern: functions return an object of refs and methods. Example: `use-api` exports `{ isLoading, isReady, get, getBaseUrl, setBaseUrl }`.
	- Tests rely on synchronous mocking of fetch responses via `fetch.mockResolvedValueOnce({ ok: true, json: () => ({}) })`. Use the same approach when testing network flows.
	- When mocking a composable, mirror the exported shape exactly. See `test/unit/support/mock-api.js` which mocks `use-api` to provide `get`, `isLoading`, and `isReady`.
	- Components use data-* attributes for test selectors, e.g. `data-test="film-finder"`. Prefer these for selectors in tests instead of fragile class or tag selectors.

7. What to change (minimal guidance)
	- When fixing bugs, update the closest composable or component and its adjacent test file. Keep tests green.
	- When adding new features, add unit tests (Vitest) and, when relevant, a Cypress component test under the component's folder.

8. Files to check when you make changes (quick checklist)
	- `package.json` — update scripts or deps.
	- `vite.config.js` — check aliases and base path (`base: '/cinewatch/'`).
	- Composable under `src/composables/...` and its test `*.test.js`.
	- `test/unit/setup.js` and `test/unit/support/*` for global mocks.
	- Component SFC under `src/components/...` and its tests in the same folder.

9. If you need external data
	- The frontend expects `cinewatch-api` to serve JSON at `/api`. For local development/testing use default base URL or set `setBaseUrl()` in tests to avoid network calls.

10. When in doubt
	- Run unit tests (`npm run test:unit:run`) after code changes. If adding network behaviour, run component/cypress tests as appropriate.

If any section is unclear or you want more detail (examples of mocks, test selectors, or PR naming conventions), tell me which area and I'll expand this file.
