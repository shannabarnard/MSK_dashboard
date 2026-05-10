<script setup lang="ts">
import SuggestionTableHeader, {
  type PriorityFilter,
  type StatusFilter,
} from "./SuggestionTableHeader.vue";
import type { Employee, Suggestion } from "../../types/suggestion";
import StatusChip from "~/components/suggestions/StatusChip.vue";
import RiskBadge from "~/components/suggestions/RiskBadge.vue";

const props = defineProps<{
  items: Suggestion[];
  employeesById: Record<string, Employee>;
}>();

const searchQuery = ref("");
const priorityFilter = ref<PriorityFilter>("All");
const statusFilter = ref<StatusFilter>("All");

const setSearchQuery = (value: string) => {
  searchQuery.value = value;
};

const setPriorityFilter = (value: PriorityFilter) => {
  priorityFilter.value = value;
};

const setStatusFilter = (value: StatusFilter) => {
  statusFilter.value = value;
};

const clearFilters = () => {
  searchQuery.value = "";
  priorityFilter.value = "All";
  statusFilter.value = "All";
};

const filteredItems = computed(() => {
  let list = props.items;

  if (priorityFilter.value !== "All") {
    list = list.filter((item) => item.priority === priorityFilter.value);
  }
  if (statusFilter.value !== "All") {
    list = list.filter((item) => item.status === statusFilter.value);
  }

  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return list;

  return list.filter((item) => {
    const name = (props.employeesById[item.employeeId]?.name ?? "").toLowerCase();
    const matchesEmployee = name.includes(query);
    const matchesSuggestion = item.description.toLowerCase().includes(query);
    return matchesEmployee || matchesSuggestion;
  });
});
</script>

<template>
  <section
    class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
  >
    <SuggestionTableHeader
      :query="searchQuery"
      :priority-filter="priorityFilter"
      :status-filter="statusFilter"
      @update:query="setSearchQuery"
      @update:priority-filter="setPriorityFilter"
      @update:status-filter="setStatusFilter"
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
              Type
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
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in filteredItems"
            :key="item.id"
            class="border-t border-slate-100"
          >
            <td class="px-4 py-3 text-sm text-slate-800">
              {{ employeesById[item.employeeId]?.name ?? "Unknown" }}
            </td>
            <td class="px-4 py-3 text-sm text-slate-700 capitalize">
              {{ item.type }}
            </td>
            <td class="px-4 py-3 text-sm text-slate-700">
              {{ item.description }}
            </td>
            <td class="px-4 py-3 align-top">
              <RiskBadge :priority="item.priority" />
            </td>
            <td class="px-4 py-3">
              <StatusChip :status="item.status" />
            </td>
            <td class="px-4 py-3 text-sm text-slate-700">
              <button
                class="rounded border border-slate-300 px-2 py-1 text-xs font-medium hover:bg-slate-50"
              >
                Update
              </button>
            </td>
          </tr>
          <tr v-if="filteredItems.length === 0" class="border-t border-slate-100">
            <td colspan="6" class="px-4 py-8 text-center text-sm text-slate-500">
              No results match your filters or search
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
