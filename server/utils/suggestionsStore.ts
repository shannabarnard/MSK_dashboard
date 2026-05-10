import type {
  Suggestion,
  SuggestionStatus,
  SuggestionsData,
} from "../../app/types/suggestion";
import {
  sampleEmployees,
  sampleSuggestions,
} from "../../app/data/sampleSuggestions";
import { canTransitionStatus } from "../../app/utils/domain/suggestionStatus";

const suggestions: Suggestion[] = structuredClone(sampleSuggestions);

export const listSuggestions = async (): Promise<SuggestionsData> => {
  return {
    employees: sampleEmployees,
    suggestions,
  };
};

export const setSuggestionStatus = async (
  id: string,
  nextStatus: SuggestionStatus,
): Promise<Suggestion> => {
  const index = suggestions.findIndex((item) => item.id === id);
  if (index === -1) {
    throw createError({
      statusCode: 404,
      statusMessage: "Suggestion not found.",
    });
  }

  const current = suggestions[index]!;
  if (!canTransitionStatus(current.status, nextStatus)) {
    throw createError({
      statusCode: 422,
      statusMessage: `Invalid transition from ${current.status} to ${nextStatus}.`,
    });
  }

  const now = new Date().toISOString();
  const updated: Suggestion = {
    ...current,
    status: nextStatus,
    statusUpdatedBy: "admin",
    dateUpdated: now,
    dateCompleted: nextStatus === "completed" ? now : undefined,
  };

  suggestions[index] = updated;
  return updated;
};
