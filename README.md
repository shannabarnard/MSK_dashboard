# MSK Suggestions Board

## Overview

A small Nuxt dashboard for HR / H&S admins to view, filter, and triage MSK-related suggestions assigned to employees.

## How to run

```bash
npm install
npm run dev
```

More detail on product and engineering choices lives in [`docs/assumptions.md`](docs/assumptions.md) and [`docs/decisions.md`](docs/decisions.md).

---

## Assumptions

- Primary user is an HR / H&S (or similar) admin doing recurring triage on MSK suggestions.
- Goal is reducing MSK absence risk through follow-up, not full CRUD on suggestion content.
- This iteration is **view + triage only**: filters, search, and status updates — no create / edit / delete of suggestions.
- Status values in code are `pending`, `in_progress`, `completed`, `overdue`; transitions match server + UI rules.
- **`source`** (`vida` | `admin`) = who raised the recommendation; **`statusUpdatedBy`** reflects admin-driven status changes when applicable.
- Data is **seeded sample + in-memory**; restarting the server resets to seed (unless the seed file itself changes).
- **No authentication or roles** — anyone with access to the app can use triage actions shown in the UI.

---

## Architectural decisions

- **Nuxt 4** app with **Tailwind** for styling and **TanStack Vue Query** for server state (list fetch + status mutation).
- **Scope**: table with filters (priority, status, suggestion type tag-group, text search on employee name + suggestion text, clear); inline status dropdown; completed rows are read-only for status changes.
- **API**: `GET /api/suggestions` for board data; `PATCH /api/suggestions/:id/status` with `{ status }` for updates; responses wrap payload as `{ ok, data }` where applicable.
- **Server store**: `server/utils/suggestionsStore.ts` — `structuredClone` of sample data, `listSuggestions` + `setSuggestionStatus` as the only list read/update path for this demo.
- **Single transition module**: `app/utils/domain/suggestionStatus.ts` — `canTransitionStatus` on the server, `getNextStatuses` for `StatusSelect`, so the UI cannot offer illegal transitions.
- **Client mutation flow**: `useSuggestionStatusUpdate` uses a shared `SUGGESTIONS_QUERY_KEY`, optimistic cache updates, and rollback on error; server response reconciles the updated row.
- **Type filter semantics**: no types selected = show all types; partial selection = filter to those types only.

---

## Trade-offs

- **Narrow scope** — strong triage path, but no suggestion authoring, editing, or deletion in-app.
- **In-memory persistence** — zero DB setup, but data does not survive restarts and is not multi-instance safe.
- **No default urgency sort** — simple implementation; row order follows seed / API array order, not “risk first”.
- **Monolith shared rules** — server imports the same transition helpers as the client; fine for one repo, would split for a standalone API service.
- **Optimistic updates** — fast UX, but optimistic patches must stay aligned with server fields (`status`, `statusUpdatedBy`, `dateUpdated`, `dateCompleted`).
- **Type filter UX** — “empty = all” avoids a blank table but differs from strict “only checked types” semantics some users expect.
- **No auth** — fast to demo, not acceptable for real production without guards.

---

## Future improvements

- **Persistence**: real database (or BFF + existing HR API), migrations, and audit log for status changes.
- **Auth / RBAC**: restrict triage to approved roles; optional read-only viewers.
- **Sorting**: default or user-controlled sort (e.g. unresolved first, then priority, then age) with clear UI affordance.
- **Deduplicate status lists**: derive allowed statuses for the PATCH handler from a single shared constant with the TypeScript type to avoid drift.
- **Shared “apply status patch” helper**: one small function used by `setSuggestionStatus` and the optimistic mutation to reduce duplication.
- **Error UX**: row-level error messages, retry, and handling for concurrent edits.
- **Observability**: structured logging and metrics on PATCH latency and validation failures.
