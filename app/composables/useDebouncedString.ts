import { onBeforeUnmount, ref } from "vue";

/**
 * Pairs an immediate string (e.g. bound to an input) with a debounced copy used for expensive work (filtering, API calls).
 * Whitespace-only input clears the debounced value immediately so dependents can reset without waiting for the timer.
 *
 * @param debounceMs — Delay before `debounced` catches up; `0` or negative applies synchronously (no timer).
 */
export function useDebouncedString(debounceMs: number) {
  const immediate = ref("");
  const debounced = ref("");
  let timer: ReturnType<typeof setTimeout> | null = null;

  const clearTimer = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  const setValue = (value: string) => {
    immediate.value = value;
    clearTimer();
    if (value.trim() === "") {
      debounced.value = "";
      return;
    }
    if (debounceMs <= 0) {
      debounced.value = value;
      return;
    }
    timer = setTimeout(() => {
      debounced.value = value;
      timer = null;
    }, debounceMs);
  };

  const reset = () => {
    clearTimer();
    immediate.value = "";
    debounced.value = "";
  };

  onBeforeUnmount(clearTimer);

  return { immediate, debounced, setValue, reset };
}
