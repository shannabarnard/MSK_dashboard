<script setup lang="ts">
import SuggestionTableHeader from "./SuggestionTableHeader.vue";
import type {
  Employee,
  Suggestion,
  SuggestionStatus,
  SuggestionType,
} from "../../types/suggestion";
import { useDebouncedString } from "~/composables/useDebouncedString";
import { useSuggestionsTableFilters } from "~/composables/useSuggestionsTableFilters";
import { filterSuggestionsBySearchQuery } from "~/utils/suggestionTableFilters";
import StatusChip from "~/components/suggestions/StatusChip.vue";
import StatusSelect from "~/components/suggestions/StatusSelect.vue";
import RiskBadge from "~/components/suggestions/RiskBadge.vue";

const props = defineProps<{
  items: Suggestion[];
  employeesById: Record<string, Employee>;
  pendingById: Record<string, boolean>;
}>();

const emit = defineEmits<{
  "update-status": [id: string, nextStatus: SuggestionStatus];
}>();

const {
  priorityFilter,
  statusFilter,
  selectedTypes,
  setPriorityFilter,
  setStatusFilter,
  setSelectedTypes,
  clearFacetFilters,
  facetFilteredItems,
} = useSuggestionsTableFilters(() => props.items);

const SEARCH_DEBOUNCE_MS = 300;
const {
  immediate: searchInput,
  debounced: debouncedSearchQuery,
  setValue: setSearchQuery,
  reset: resetSearch,
} = useDebouncedString(SEARCH_DEBOUNCE_MS);

const clearFilters = () => {
  resetSearch();
  clearFacetFilters();
};

const filteredItems = computed(() =>
  filterSuggestionsBySearchQuery(
    facetFilteredItems.value,
    props.employeesById,
    debouncedSearchQuery.value,
  ),
);

const typeLabel = (type: SuggestionType) => type.replaceAll("_", " ");

const departmentLabel = (value: string | null | undefined) => {
  return value?.trim() || "—";
};

const isStatusCompleted = (status: SuggestionStatus) => status === "completed";
</script>

<template>
  <section
    class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
  >
    <SuggestionTableHeader
      :query="searchInput"
      :priority-filter
      :status-filter
      :selected-types
      @update:query="setSearchQuery"
      @update:priority-filter="setPriorityFilter"
      @update:status-filter="setStatusFilter"
      @update:selected-types="setSelectedTypes"
      @clear="clearFilters"
    />
    <div class="overflow-x-auto">
      <table class="min-w-full border-collapse">
        <thead class="bg-slate-50 text-left">
          <tr>
            <th
              class="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
            >
              Employee
            </th>
            <th
              class="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
            >
              Suggestion
            </th>
            <th
              class="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
            >
              Priority
            </th>
            <th
              class="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
            >
              Status
            </th>
            <th
              class="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
            >
              Update
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in filteredItems"
            :key="item.id"
            class="border-t border-slate-100"
          >
            <td class="px-4 py-3 align-top">
              <p class="text-sm font-semibold text-slate-900">
                {{ employeesById[item.employeeId]?.name ?? "Unknown" }}
              </p>
              <p class="mt-1 text-xs text-slate-500">
                {{
                  departmentLabel(employeesById[item.employeeId]?.department)
                }}
              </p>
            </td>
            <td class="px-4 py-3 align-top">
              <p class="text-sm font-semibold capitalize text-slate-900">
                {{ typeLabel(item.type) }}
              </p>
              <p class="mt-1 text-xs leading-snug text-slate-600">
                {{ item.description }}
              </p>
            </td>
            <td class="px-4 py-3">
              <RiskBadge :priority="item.priority" />
            </td>
            <td class="px-4 py-3">
              <StatusChip :status="item.status" />
            </td>
            <td class="px-4 py-3 align-top">
              <template v-if="isStatusCompleted(item.status)">
                <div class="flex gap-2.5">
                  <div class="min-w-0 pt-0.5">
                    <p class="text-sm font-semibold text-slate-900">
                      Completed
                    </p>
                    <p class="mt-0.5 text-xs text-slate-500">
                      No further status changes
                    </p>
                  </div>
                </div>
              </template>
              <template v-else>
                <div
                  class="[&_select]:min-h-[2.25rem] [&_select]:w-full [&_select]:text-sm"
                >
                  <StatusSelect
                    :current-status="item.status"
                    :disabled="Boolean(pendingById[item.id])"
                    @change="(next) => emit('update-status', item.id, next)"
                  />
                </div>
                <div
                  v-if="pendingById[item.id]"
                  class="mt-2 flex items-center gap-2 text-xs font-medium text-slate-600"
                >
                  <span
                    class="inline-flex h-2 w-2 animate-pulse rounded-full bg-slate-400"
                    aria-hidden="true"
                  />
                  Saving…
                </div>
              </template>
            </td>
          </tr>
          <tr
            v-if="filteredItems.length === 0"
            class="border-t border-slate-100"
          >
            <td
              colspan="5"
              class="px-4 py-8 text-center text-sm text-slate-500"
            >
              No results match your filters or search
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
