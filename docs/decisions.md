# Technical decisions (MSK_dashboard)

## 1) Scope: view + triage only

**Decision**

- Table view with filters (priority, status, suggestion **type** via tag-style multi-select, text search on employee name + suggestion text, clear).
- Inline **status** updates via dropdown; **completed** rows show read-only copy (no further transitions).
- Defer create / edit / delete of suggestions.

**Why**

- Aligns with the main workflow: surface risk and act on status quickly.

**Tradeoff**

- Less feature breadth; stronger focus on the triage path.

---

## 2) No default “urgency” sort

**Decision**

- List order follows the **API / in-memory array** order (sample data order, then in-place updates). No client-side “unresolved first, then priority, then age” sort.

**Why**

- Keeps the first version simple; filters already narrow the set.

**Tradeoff**

- Admins may need to scan more if the seed order is not ideal; a dedicated sort is a future improvement.

---

## 3) Single transition rules module (DRY)

**Decision**

- `app/utils/domain/suggestionStatus.ts` defines allowed next statuses.
- **Server**: `canTransitionStatus` in `setSuggestionStatus`.
- **Client**: `getNextStatuses` drives `StatusSelect` options.

**Why**

- One source of truth so the UI cannot offer transitions the API would reject.

**Tradeoff**

- Server imports app-path utilities; acceptable for a Nuxt monolith; would split if app and API were separate repos.

---

## 4) In-memory `suggestionsStore` (no database)

**Decision**

- `server/utils/suggestionsStore.ts` keeps a **mutable clone** of sample suggestions (`structuredClone` on boot).
- `listSuggestions` and `setSuggestionStatus` are the only read/update paths for the list in this iteration.

**Why**

- Fast to ship and easy to run locally without DB setup.

**Tradeoff**

- Data is lost on restart; not suitable for production as-is.

---

## 5) PATCH API + TanStack Query mutations

**Decision**

- `PATCH /api/suggestions/:id/status` with body `{ status }` returns the updated suggestion.
- Client uses **Vue Query** (`useQuery` for list, `useMutation` in `useSuggestionStatusUpdate`) with a **shared** `SUGGESTIONS_QUERY_KEY`, **optimistic** cache updates, and rollback on error.

**Why**

- Snappy UI, single cache for list + updates, consistent with Nuxt + `$fetch`.

**Tradeoff**

- Optimistic payload must stay in sync with server fields (`status`, `statusUpdatedBy`, `dateUpdated`, `dateCompleted`).

---

## 6) Type filter: empty = all types

**Decision**

- Tag-group filter for suggestion type: **no types selected** means “no type filter” (show all). A **partial** selection filters to those types only.

**Why**

- Avoids an empty table when nothing is checked; matches common filter UX.

**Tradeoff**

- Slightly different from “checkboxes = AND of checked only” in some apps; documented here for clarity.

---

## 7) Demo test stack: Vitest + Playwright

**Decision**

- **Vitest** for a small **unit** suite (`tests/unit/`) targeting pure logic: `suggestionStatus` transitions and `suggestionTableFilters` (facets, search, composed pipeline), with `~` aliased to `app/` in `vitest.config.ts`.
- **Playwright** for a minimal **E2E** smoke spec (`e2e/`) against the home page; default flow is `build` + `nuxt preview` on **port 4173** so local `npm run dev` on 3000 can stay running.

**Why**

- Shows how to run fast, isolated tests and one browser-level check without a heavy component harness.

**Tradeoff**

- E2E cold run includes a production build; expand specs gradually to justify CI time.

---

## 8) Facet filters vs debounced search (split responsibilities)

**Decision**

- **Facets** (priority, status, suggestion type): state and derived list live in `useSuggestionsTableFilters`, implemented with `filterSuggestionsByFacets` in `app/utils/suggestionTableFilters.ts`.
- **Search** (employee name + suggestion text): debounce and immediate vs effective string state live in `useDebouncedString` (used from `SuggestionTable.vue`); the effective query is applied via `filterSuggestionsBySearchQuery` on the facet-filtered list.
- **`filterSuggestionsByTableState`** applies facets then search in one call so behavior matches the UI and stays easy to test.

**Why**

- Keeps the composable free of employee maps and timers; pure filter functions stay testable without Vue or fake timers.

**Tradeoff**

- Readers look in two places for “how the table filters”; the pipeline is documented in README and encoded in `filterSuggestionsByTableState`.
- **`useDebouncedString` is a small in-house helper** instead of pulling in **VueUse** (`watchDebounced`, `useDebounceFn`, etc.): fewer dependencies and explicit behavior (e.g. flush when the query is whitespace-only). If the app grows more debounced or async UI patterns, **consider adopting VueUse** (or similar) for consistency and shared maintenance rather than accumulating one-off timers.
