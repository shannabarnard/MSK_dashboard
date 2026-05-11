<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import SuggestionTable from "~/components/suggestions/SuggestionTable.vue";
import {
  SUGGESTIONS_QUERY_KEY,
  useSuggestionStatusUpdate,
} from "~/composables/useSuggestionStatusUpdate";
import { fetchSuggestions } from "~/services/suggestionsApi";
import type { SuggestionStatus } from "~/types/suggestion";

const { data, isLoading, isError, error } = useQuery({
  queryKey: SUGGESTIONS_QUERY_KEY,
  queryFn: fetchSuggestions,
});

const employeesById = computed(() => {
  const employees = data.value?.employees ?? [];
  return Object.fromEntries(
    employees.map((employee) => [employee.id, employee]),
  );
});

const banner = reactive<{
  message: string;
  tone: "success" | "error";
}>({
  message: "",
  tone: "success",
});

let bannerTimer: ReturnType<typeof setTimeout> | null = null;

const showBanner = (message: string, tone: "success" | "error") => {
  banner.message = message;
  banner.tone = tone;
  if (bannerTimer) {
    clearTimeout(bannerTimer);
  }
  bannerTimer = setTimeout(() => {
    banner.message = "";
  }, 6500);
};

const { pendingById, updateStatus } = useSuggestionStatusUpdate({
  onSuccess(message) {
    showBanner(message, "success");
  },
  onError(message) {
    showBanner(message, "error");
  },
});

const handleStatusUpdate = async (id: string, nextStatus: SuggestionStatus) => {
  await updateStatus({ id, nextStatus });
};

onBeforeUnmount(() => {
  if (bannerTimer) {
    clearTimeout(bannerTimer);
  }
});
</script>

<template>
  <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <header class="mb-6">
      <h1 class="text-2xl font-semibold tracking-tight text-slate-900">
        MSK Suggestions Board
      </h1>
      <p class="mt-1 text-sm text-slate-600">
        Triage employee suggestions and update their current status.
      </p>
    </header>

    <div
      v-if="banner.message"
      class="mb-4 rounded-lg border px-4 py-3 text-sm"
      :class="
        banner.tone === 'error'
          ? 'border-rose-200 bg-rose-50 text-rose-700'
          : 'border-emerald-200 bg-emerald-50 text-emerald-700'
      "
      role="status"
      aria-live="polite"
    >
      {{ banner.message }}
    </div>

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
        :pending-by-id
        @update-status="handleStatusUpdate"
      />
    </section>
  </main>
</template>
