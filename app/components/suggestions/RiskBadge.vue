<script setup lang="ts">
import type { SuggestionPriority } from "~/types/suggestion";

const props = defineProps<{
  priority: SuggestionPriority;
}>();

const PRIORITY_BADGE: Record<
  SuggestionPriority,
  { dot: string; label: string }
> = {
  high: { dot: "bg-rose-500", label: "High" },
  medium: { dot: "bg-amber-500", label: "Medium" },
  low: { dot: "bg-emerald-500", label: "Low" },
};

const badge = computed(() => PRIORITY_BADGE[props.priority]);
</script>

<template>
  <span
    class="inline-flex items-center gap-x-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset text-gray-700 ring-gray-600/10"
  >
    <span
      class="h-1.5 w-1.5 shrink-0 rounded-full"
      :class="badge.dot"
      aria-hidden="true"
    />
    {{ badge.label }}
  </span>
</template>
