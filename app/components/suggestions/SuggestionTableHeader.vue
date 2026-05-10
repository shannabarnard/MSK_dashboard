<script setup lang="ts">
export type SuggestionSearchColumn = "employee" | "suggestion";

const props = defineProps<{
  query: string;
  column: SuggestionSearchColumn;
}>();

const emit = defineEmits<{
  "update:query": [value: string];
  "update:column": [value: SuggestionSearchColumn];
}>();

const onQueryInput = (event: Event) => {
  emit("update:query", (event.target as HTMLInputElement).value);
};
</script>

<template>
  <div class="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">

    <input
      id="suggestion-search-input w-full"
      :value="props.query"
      type="search"
      placeholder="Type to search..."
      class="w-full max-w-md rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
      @input="onQueryInput"
    />
  </div>
</template>
