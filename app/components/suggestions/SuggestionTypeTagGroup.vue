<script setup lang="ts">
import type { SuggestionType } from "~/types/suggestion";
import { ALL_SUGGESTION_TYPES } from "~/utils/suggestionTypeFilter";

const TYPE_LABELS: Record<SuggestionType, string> = {
  equipment: "Equipment",
  exercise: "Exercise",
  behavioural: "Behavioural",
  lifestyle: "Lifestyle",
};

const props = defineProps<{
  modelValue: SuggestionType[];
}>();

const emit = defineEmits<{
  "update:modelValue": [value: SuggestionType[]];
}>();

const groupId = useId();

const onTypeChange = (type: SuggestionType, event: Event) => {
  const checked = (event.target as HTMLInputElement).checked;
  const next = checked
    ? props.modelValue.includes(type)
      ? props.modelValue
      : [...props.modelValue, type]
    : props.modelValue.filter((t) => t !== type);
  emit("update:modelValue", next);
};
</script>

<template>
  <div class="min-w-0">
    <div
      role="group"
      :aria-labelledby="`${groupId}-label`"
      class="inline-flex min-w-0 max-w-full divide-x divide-slate-300 overflow-x-auto rounded-md border border-slate-300 bg-slate-50"
    >
      <label
        v-for="type in ALL_SUGGESTION_TYPES"
        :key="type"
        class="flex cursor-pointer items-center gap-2 whitespace-nowrap px-3 py-1.5 text-sm text-slate-800 transition-colors hover:bg-slate-100 has-[:focus-visible]:bg-slate-100 has-[:checked]:bg-white"
      >
        <input
          type="checkbox"
          class="h-3.5 w-3.5 shrink-0 rounded border-slate-400 text-slate-800 focus:ring-2 focus:ring-slate-400 focus:ring-offset-0"
          :checked="modelValue.includes(type)"
          @change="onTypeChange(type, $event)"
        />
        <span class="select-none font-medium">{{ TYPE_LABELS[type] }}</span>
      </label>
    </div>
  </div>
</template>
