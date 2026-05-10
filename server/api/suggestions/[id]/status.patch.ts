import type { SuggestionStatus } from "../../../../app/types/suggestion";
import { setSuggestionStatus } from "../../../utils/suggestionsStore";

const VALID_STATUSES: SuggestionStatus[] = [
  "pending",
  "in_progress",
  "completed",
  "overdue",
];

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Suggestion id is required.",
    });
  }

  const body = await readBody<{ status?: string }>(event);
  if (
    !body?.status ||
    !VALID_STATUSES.includes(body.status as SuggestionStatus)
  ) {
    throw createError({
      statusCode: 422,
      statusMessage: "Invalid suggestion status.",
    });
  }

  const updated = await setSuggestionStatus(
    id,
    body.status as SuggestionStatus,
  );
  return { ok: true, data: updated };
});
