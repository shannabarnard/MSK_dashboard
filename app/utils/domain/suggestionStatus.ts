import type { SuggestionStatus } from "~/types/suggestion";

const ALLOWED_TRANSITIONS: Record<SuggestionStatus, SuggestionStatus[]> = {
  pending: ["in_progress", "completed", "overdue"],
  in_progress: ["completed", "overdue"],
  overdue: ["in_progress", "completed"],
  completed: [],
};

export const canTransitionStatus = (
  from: SuggestionStatus,
  to: SuggestionStatus,
): boolean => {
  if (from === to) {
    return true;
  }
  return ALLOWED_TRANSITIONS[from].includes(to);
};

export const getNextStatuses = (
  status: SuggestionStatus,
): SuggestionStatus[] => {
  return [...ALLOWED_TRANSITIONS[status]];
};
