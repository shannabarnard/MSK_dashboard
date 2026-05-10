import type {
  Employee,
  Suggestion,
  SuggestionPriority,
  SuggestionStatus,
  SuggestionType,
} from "~/types/suggestion";
import { isPartialTypeSelection } from "~/utils/suggestionTypeFilter";

export type PriorityFilter = SuggestionPriority | "All";
export type StatusFilter = SuggestionStatus | "All";

export type SuggestionFacetFilterState = {
  priorityFilter: PriorityFilter;
  statusFilter: StatusFilter;
  selectedTypes: SuggestionType[];
};

/** Priority, status, and suggestion-type filters (no text search). */
export function filterSuggestionsByFacets(
  items: readonly Suggestion[],
  state: SuggestionFacetFilterState,
): Suggestion[] {
  let list = [...items];

  if (state.priorityFilter !== "All") {
    list = list.filter((item) => item.priority === state.priorityFilter);
  }
  if (state.statusFilter !== "All") {
    list = list.filter((item) => item.status === state.statusFilter);
  }
  if (isPartialTypeSelection(state.selectedTypes)) {
    list = list.filter((item) => state.selectedTypes.includes(item.type));
  }

  return list;
}

/** Text search on employee name and suggestion description (case-insensitive). */
export function filterSuggestionsBySearchQuery(
  items: readonly Suggestion[],
  employeesById: Record<string, Employee>,
  searchQuery: string,
): Suggestion[] {
  const query = searchQuery.trim().toLowerCase();
  if (!query) {
    return [...items];
  }

  return items.filter((item) => {
    const name = (employeesById[item.employeeId]?.name ?? "").toLowerCase();
    const matchesEmployee = name.includes(query);
    const matchesSuggestion = item.description.toLowerCase().includes(query);
    return matchesEmployee || matchesSuggestion;
  });
}

export type SuggestionTableFilterState = SuggestionFacetFilterState & {  /** Effective search string (e.g. after debounce); matched case-insensitively. */
  searchQuery: string;
};

/** Full pipeline: facets then search (matches `SuggestionTable` behavior). */
export function filterSuggestionsByTableState(
  items: readonly Suggestion[],
  employeesById: Record<string, Employee>,
  state: SuggestionTableFilterState,
): Suggestion[] {
  const faceted = filterSuggestionsByFacets(items, {
    priorityFilter: state.priorityFilter,
    statusFilter: state.statusFilter,
    selectedTypes: state.selectedTypes,
  });
  return filterSuggestionsBySearchQuery(
    faceted,
    employeesById,
    state.searchQuery,
  );
}
