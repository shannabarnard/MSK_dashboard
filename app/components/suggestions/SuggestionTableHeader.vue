<script setup lang="ts">
import type { SuggestionType } from "~/types/suggestion";
import SuggestionTypeTagGroup from "~/components/suggestions/SuggestionTypeTagGroup.vue";
import { isPartialTypeSelection } from "~/utils/suggestionTypeFilter";
import type {
  PriorityFilter,
  StatusFilter,
} from "~/utils/suggestionTableFilters";

const props = defineProps<{
  query: string;
  priorityFilter: PriorityFilter;
  statusFilter: StatusFilter;
  selectedTypes: SuggestionType[];
}>();

const emit = defineEmits<{
  "update:query": [value: string];
  "update:priorityFilter": [value: PriorityFilter];
  "update:statusFilter": [value: StatusFilter];
  "update:selectedTypes": [value: SuggestionType[]];
  clear: [];
}>();

const hasActiveFilters = computed(
  () =>
    props.query.trim() !== "" ||
    props.priorityFilter !== "All" ||
    props.statusFilter !== "All" ||
    isPartialTypeSelection(props.selectedTypes),
);

const onQueryInput = (event: Event) => {
  emit("update:query", (event.target as HTMLInputElement).value);
};

const onPriorityChange = (event: Event) => {
  emit(
    "update:priorityFilter",
    (event.target as HTMLSelectElement).value as PriorityFilter,
  );
};

const onStatusChange = (event: Event) => {
  emit(
    "update:statusFilter",
    (event.target as HTMLSelectElement).value as StatusFilter,
  );
};

const setSelectedTypes = (value: SuggestionType[]) => {
  emit("update:selectedTypes", value);
};

const onClear = () => {
  emit("clear");
};
</script>

<template>
  <div
    class="flex flex-wrap items-end gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3"
  >
    <div class="flex min-w-[12rem] flex-1 flex-col gap-1">
      <input
        id="suggestion-search-input"
        :value="props.query"
        type="search"
        placeholder="Search by employee name or suggestion"
        class="w-full max-w-md rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
        @input="onQueryInput"
      />
    </div>

    <SuggestionTypeTagGroup
      :model-value="props.selectedTypes"
      @update:model-value="setSelectedTypes"
    />

    <div class="flex flex-col gap-1">
      <select
        id="suggestion-filter-priority"
        :value="props.priorityFilter"
        class="min-w-[9rem] rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
        @change="onPriorityChange"
      >
        <option value="All">All priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
    </div>

    <div class="flex flex-col gap-1">
      <select
        id="suggestion-filter-status"
        :value="props.statusFilter"
        class="min-w-[9rem] rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
        @change="onStatusChange"
      >
        <option value="All">All statuses</option>
        <option value="pending">Pending</option>
        <option value="in_progress">In progress</option>
        <option value="overdue">Overdue</option>
        <option value="completed">Completed</option>
      </select>
    </div>

    <div class="flex flex-col gap-1">
      <button
        id="suggestion-clear-filters"
        type="button"
        class="rounded-md border bg-slate-200 border-slate-300 px-2.5 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="!hasActiveFilters"
        @click="onClear"
      >
        Clear
      </button>
    </div>
  </div>
</template>
