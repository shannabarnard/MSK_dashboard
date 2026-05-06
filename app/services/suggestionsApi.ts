import type { SuggestionsData } from "../types/suggestion";
export const fetchSuggestions = async (): Promise<SuggestionsData> => {
  const response = await $fetch<{ ok: true; data: SuggestionsData }>("/api/suggestions");
  return response.data;
};
