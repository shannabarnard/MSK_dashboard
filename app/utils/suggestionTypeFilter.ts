import type { SuggestionType } from "~/types/suggestion";

export const ALL_SUGGESTION_TYPES: readonly SuggestionType[] = [
  "equipment",
  "exercise",
  "behavioural",
  "lifestyle",
] as const;

export const isFullTypeSelection = (
  selected: readonly SuggestionType[],
): boolean => {
  return (
    selected.length === ALL_SUGGESTION_TYPES.length &&
    ALL_SUGGESTION_TYPES.every((t) => selected.includes(t))
  );
};

/** True when at least one type is selected but not all (empty = no type filter, show all). */
export const isPartialTypeSelection = (
  selected: readonly SuggestionType[],
): boolean => {
  return selected.length > 0 && !isFullTypeSelection(selected);
};
