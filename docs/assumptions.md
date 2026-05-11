# Assumptions

- Primary user is an HR / H&S (or similar) admin running recurring triage on MSK-related suggestions.
- The goal is reducing MSK absence risk through follow-up, not full CRUD on suggestions.
- This iteration focuses on **viewing + triaging**: **priority**, **status**, and **suggestion type** filters; **text search** on employee name and suggestion text; **status updates** via PATCH. Create / edit / delete of suggestion content is out of scope.
- **Status model** matches the app types: `pending`, `in_progress`, `completed`, `overdue` (not a generic “New / Resolved” naming in code).
- **Allowed transitions** are enforced on the server and reflected in the UI dropdown. Example: `completed` cannot move to another status; `pending` can move to `in_progress`, `completed`, or `overdue`. The full matrix lives in `app/utils/domain/suggestionStatus.ts`.
- **`overdue`** is a first-class workflow state in the model and transitions, but **this demo does not run background jobs or timers** to flip rows to overdue automatically (that would live in a real VIDA or scheduling integration).
- **Completed** rows use **read-only** status in the UI (no dropdown); the server also disallows transitions out of `completed`.
- **“Source”** (`vida` | `admin`) on a suggestion means who **raised** the recommendation (carried on the row from upstream / seed data). **`statusUpdatedBy`** (`vida` | `admin`, optional) means who **last changed workflow status**; updates from this dashboard set it to `admin` on successful PATCH.
- Data is **seed + in-memory** for this demo: **restarting the Nitro server process** (or starting a new worker) resets suggestions to sample data (except any uncommitted seed changes).
- Auth / roles are not implemented: anyone hitting the app can perform triage actions exposed in the UI.
