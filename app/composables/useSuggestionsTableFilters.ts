import { computed, ref, toValue, type MaybeRefOrGetter } from "vue";
import type { Suggestion, SuggestionType } from "~/types/suggestion";
import {
  filterSuggestionsByFacets,
  type PriorityFilter,
  type StatusFilter,
} from "~/utils/suggestionTableFilters";

/** Facet filters only (priority, status, type). Search stays in the parent (e.g. debounce + header binding). */
export function useSuggestionsTableFilters(
  items: MaybeRefOrGetter<Suggestion[]>,
) {
  const priorityFilter = ref<PriorityFilter>("All");
  const statusFilter = ref<StatusFilter>("All");
  const selectedTypes = ref<SuggestionType[]>([]);

  const setPriorityFilter = (value: PriorityFilter) => {
    priorityFilter.value = value;
  };

  const setStatusFilter = (value: StatusFilter) => {
    statusFilter.value = value;
  };

  const setSelectedTypes = (value: SuggestionType[]) => {
    selectedTypes.value = value;
  };

  const clearFacetFilters = () => {
    priorityFilter.value = "All";
    statusFilter.value = "All";
    selectedTypes.value = [];
  };

  const facetFilteredItems = computed(() =>
    filterSuggestionsByFacets(toValue(items), {
      priorityFilter: priorityFilter.value,
      statusFilter: statusFilter.value,
      selectedTypes: selectedTypes.value,
    }),
  );

  return {
    priorityFilter,
    statusFilter,
    selectedTypes,
    setPriorityFilter,
    setStatusFilter,
    setSelectedTypes,
    clearFacetFilters,
    facetFilteredItems,
  };
}
