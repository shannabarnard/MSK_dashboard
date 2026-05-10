import type {
  Suggestion,
  SuggestionStatus,
  SuggestionsData,
} from "../types/suggestion";

export const fetchSuggestions = async (): Promise<SuggestionsData> => {
  const response = await $fetch<{ ok: true; data: SuggestionsData }>(
    "/api/suggestions",
  );
  return response.data;
};

export const updateSuggestionStatus = async (
  id: string,
  status: SuggestionStatus,
): Promise<Suggestion> => {
  const response = await $fetch<{ ok: true; data: Suggestion }>(
    `/api/suggestions/${id}/status`,
    {
      method: "PATCH",
      body: { status },
    },
  );
  return response.data;
};
