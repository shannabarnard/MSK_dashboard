<script setup lang="ts">
  import { useQuery } from "@tanstack/vue-query";
  import { fetchSuggestions } from "~/services/suggestionsApi";

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["suggestions"],
    queryFn: fetchSuggestions
  });
</script>

<template>
  <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <header class="mb-6">
      <h1 class="text-2xl font-semibold tracking-tight text-slate-900">MSK Suggestions Board</h1>
      <p class="mt-1 text-sm text-slate-600">Triage suggestions and update their current status.</p>
    </header>

    <section>
      <h2 class="mb-2 text-lg font-medium text-slate-800">Employees</h2>
      <p v-if="isLoading" class="text-sm text-slate-600">
        Loading employees...
      </p>
      <p v-else-if="isError" class="text-sm text-rose-600">
        {{ (error as Error)?.message ?? "Unable to load employees." }}
      </p>
      <ul class="list-inside list-disc space-y-1 text-slate-700">
        <li
          v-for="employee in data?.employees ?? []"
          :key="employee.id"
        >
          {{ employee.name }}
        </li>
      </ul>
    </section>
  </main>
</template>