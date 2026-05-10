<script setup lang="ts">
import type { SuggestionStatus } from "~/types/suggestion";

const props = defineProps<{
  status: SuggestionStatus;
}>();

const label = computed(() => props.status.replaceAll("_", " "));
</script>

<template>
  <span class="status-chip" :class="`status-chip--${props.status}`">
    {{ label }}
  </span>
</template>

<style scoped>
.status-chip {
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  padding: 0.125rem 0.625rem;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 500;
  box-shadow: inset 0 0 0 1px var(--status-chip-ring);
}

.status-chip--pending {
  --status-chip-ring: #e2e8f0;
  background-color: #f1f5f9;
  color: #334155;
}

.status-chip--in_progress {
  --status-chip-ring: #bae6fd;
  background-color: #f0f9ff;
  color: #0369a1;
}

.status-chip--completed {
  --status-chip-ring: #a7f3d0;
  background-color: #ecfdf5;
  color: #047857;
}

.status-chip--overdue {
  --status-chip-ring: #fecdd3;
  background-color: #fff1f2;
  color: #be123c;
}
</style>
