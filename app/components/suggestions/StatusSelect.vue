<script setup lang="ts">
import { getNextStatuses } from "~/utils/domain/suggestionStatus";
import type { SuggestionStatus } from "~/types/suggestion";

const props = defineProps<{
  currentStatus: SuggestionStatus;
  disabled?: boolean;
}>();

const selectId = useId();

const emit = defineEmits<{
  change: [status: SuggestionStatus];
}>();

const model = ref(props.currentStatus);

watch(
  () => props.currentStatus,
  (next) => {
    model.value = next;
  },
);

const options = computed(() => [
  props.currentStatus,
  ...getNextStatuses(props.currentStatus),
]);
const statusLabel = (status: SuggestionStatus): string =>
  status.replaceAll("_", " ");

const onChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit("change", target.value as SuggestionStatus);
};
</script>

<template>
  <label class="sr-only" :for="selectId">Update status</label>
  <select
    :id="selectId"
    class="min-h-9 touch-manipulation rounded-md border border-slate-300 bg-white px-1 py-2 text-xs font-medium leading-tight text-slate-700 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100 sm:w-full sm:min-h-8 sm:px-2 sm:py-0.5 sm:text-sm"
    :value="model"
    :disabled
    @change="onChange"
  >
    <option v-for="option in options" :key="option" :value="option">
      {{ statusLabel(option) }}
    </option>
  </select>
</template>
