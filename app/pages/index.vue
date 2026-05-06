<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import SuggestionTable from "~/components/suggestions/SuggestionTable.vue";
import { fetchSuggestions } from "~/services/suggestionsApi";

const { data, isLoading, isError, error } = useQuery({
  queryKey: ["suggestions"],
  queryFn: fetchSuggestions,
});

const employeesById = computed(() => {
  const employees = data.value?.employees ?? [];
  return Object.fromEntries(
    employees.map((employee) => [employee.id, employee]),
  );
});
</script>

<template>
  <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <header class="mb-6">
      <h1 class="text-2xl font-semibold tracking-tight text-slate-900">
        MSK Suggestions Board
      </h1>
      <p class="mt-1 text-sm text-slate-600">
        Triage suggestions and update their current status.
      </p>
    </header>

    <section class="space-y-3">
      <h2 class="text-lg font-medium text-slate-800">Suggestions Table</h2>
      <p v-if="isLoading" class="text-sm text-slate-600">
        Loading suggestions...
      </p>
      <p v-else-if="isError" class="text-sm text-rose-600">
        {{ (error as Error)?.message ?? "Unable to load suggestions." }}
      </p>
      <SuggestionTable
        v-else
        :items="data?.suggestions ?? []"
        :employees-by-id
      />
    </section>
  </main>
</template>
