<script setup lang="ts">
import SuggestionTableHeader, {
  type PriorityFilter,
  type StatusFilter,
} from "./SuggestionTableHeader.vue";
import type {
  Employee,
  Suggestion,
  SuggestionStatus,
  SuggestionType,
} from "../../types/suggestion";
import { isPartialTypeSelection } from "~/utils/suggestionTypeFilter";
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

const searchInput = ref("");
const debouncedSearchQuery = ref("");
const SEARCH_DEBOUNCE_MS = 300;

let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

const priorityFilter = ref<PriorityFilter>("All");
const statusFilter = ref<StatusFilter>("All");
const selectedTypes = ref<SuggestionType[]>([]);

const setSearchQuery = (value: string) => {
  searchInput.value = value;
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = null;
  }
  if (value.trim() === "") {
    debouncedSearchQuery.value = "";
    return;
  }
  searchDebounceTimer = setTimeout(() => {
    debouncedSearchQuery.value = value;
    searchDebounceTimer = null;
  }, SEARCH_DEBOUNCE_MS);
};

const setPriorityFilter = (value: PriorityFilter) => {
  priorityFilter.value = value;
};

const setStatusFilter = (value: StatusFilter) => {
  statusFilter.value = value;
};

const setSelectedTypes = (value: SuggestionType[]) => {
  selectedTypes.value = value;
};

const clearFilters = () => {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = null;
  }
  searchInput.value = "";
  debouncedSearchQuery.value = "";
  priorityFilter.value = "All";
  statusFilter.value = "All";
  selectedTypes.value = [];
};

onBeforeUnmount(() => {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
  }
});

const filteredItems = computed(() => {
  let list = props.items;

  if (priorityFilter.value !== "All") {
    list = list.filter((item) => item.priority === priorityFilter.value);
  }
  if (statusFilter.value !== "All") {
    list = list.filter((item) => item.status === statusFilter.value);
  }

  if (isPartialTypeSelection(selectedTypes.value)) {
    list = list.filter((item) => selectedTypes.value.includes(item.type));
  }

  const query = debouncedSearchQuery.value.trim().toLowerCase();
  if (!query) {
    return list;
  }

  return list.filter((item) => {
    const name = (
      props.employeesById[item.employeeId]?.name ?? ""
    ).toLowerCase();
    const matchesEmployee = name.includes(query);
    const matchesSuggestion = item.description.toLowerCase().includes(query);
    return matchesEmployee || matchesSuggestion;
  });
});

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
