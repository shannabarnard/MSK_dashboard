import type { Suggestion, SuggestionsData } from "../../app/types/suggestion";
import {
  sampleEmployees,
  sampleSuggestions,
} from "../../app/data/sampleSuggestions";

const suggestions: Suggestion[] = structuredClone(sampleSuggestions);

export const listSuggestions = async (): Promise<SuggestionsData> => {
  return {
    employees: sampleEmployees,
    suggestions,
  };
};
