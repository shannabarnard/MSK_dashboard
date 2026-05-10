# Assumptions

- Primary user is an HR / H&S (or similar) admin running recurring triage on MSK-related suggestions.
- The goal is reducing MSK absence risk through follow-up, not full CRUD on suggestions.
- This iteration focuses on **viewing + triaging** (filters, search, status updates). Create / edit / delete suggestion content is out of scope.
- **Status model** matches the app types: `pending`, `in_progress`, `completed`, `overdue` (not a generic “New / Resolved” naming in code).
- **Allowed transitions** are enforced on the server and reflected in the UI dropdown (e.g. `completed` cannot move to another status; `pending` can move to `in_progress`, `completed`, or `overdue`).
- **“Source”** on a suggestion (`vida` vs `admin`) means who *raised* the recommendation; **`statusUpdatedBy`** (when set) indicates the dashboard marked a status change as admin-driven vs VIDA-sourced status display.
- Data is **seed + in-memory** for this demo: restarting the dev server resets suggestions to sample data (except any uncommitted seed changes).
- Auth / roles are not implemented: anyone hitting the app can perform triage actions exposed in the UI.
