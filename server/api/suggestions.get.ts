import { listSuggestions } from "../utils/suggestionsStore";

export default defineEventHandler(async () => {
  const data = await listSuggestions();
  return { ok: true, data };
});
