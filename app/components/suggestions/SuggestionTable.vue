<script setup lang="ts">
import SuggestionTableHeader, { type SuggestionSearchColumn } from "./SuggestionTableHeader.vue";
import type { Employee, Suggestion } from "../../types/suggestion";

const props = defineProps<{
  items: Suggestion[];
  employeesById: Record<string, Employee>;
}>();

const searchColumn = ref<SuggestionSearchColumn>("employee");
const searchQuery = ref("");

const setSearchQuery = (value: string) => {
  searchQuery.value = value;
};

const setSearchColumn = (value: SuggestionSearchColumn) => {
  searchColumn.value = value;
};

const filteredItems = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return props.items;

  return props.items.filter((item) => {
    if (searchColumn.value === "employee") {
      return (props.employeesById[item.employeeId]?.name ?? "").toLowerCase().includes(query);
    }

    return item.description.toLowerCase().includes(query);
  });
});
</script>

<template>
  <section
    class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
  >
    <SuggestionTableHeader
      :query="searchQuery"
      :column="searchColumn"
      @update:query="setSearchQuery"
      @update:column="setSearchColumn"
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
            <td class="px-4 py-3 text-sm text-slate-700 capitalize">
              {{ item.priority }}
            </td>
            <td class="px-4 py-3 text-sm text-slate-700">{{ item.status }}</td>
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
              No results match your search
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
