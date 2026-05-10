import { updateSuggestionStatus } from "~/services/suggestionsApi";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import type { SuggestionStatus, SuggestionsData } from "~/types/suggestion";

export const SUGGESTIONS_QUERY_KEY = ["suggestions"] as const;

type StatusUpdatePayload = {
  id: string;
  nextStatus: SuggestionStatus;
};

export const useSuggestionStatusUpdate = (options?: {
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}) => {
  const queryClient = useQueryClient();
  const pendingById = reactive<Record<string, boolean>>({});
  const lastError = ref<Error | null>(null);

  const mutation = useMutation({
    mutationFn: ({ id, nextStatus }: StatusUpdatePayload) =>
      updateSuggestionStatus(id, nextStatus),
    onMutate: async ({ id, nextStatus }) => {
      await queryClient.cancelQueries({ queryKey: SUGGESTIONS_QUERY_KEY });

      const previousData = queryClient.getQueryData<SuggestionsData>(
        SUGGESTIONS_QUERY_KEY,
      );
      if (!previousData) {
        return { previousData };
      }

      const now = new Date().toISOString();
      const optimistic = previousData.suggestions.map((item) =>
        item.id === id
          ? {
              ...item,
              status: nextStatus,
              statusUpdatedBy: "admin" as const,
              dateUpdated: now,
              dateCompleted: nextStatus === "completed" ? now : undefined,
            }
          : item,
      );

      queryClient.setQueryData<SuggestionsData>(SUGGESTIONS_QUERY_KEY, {
        ...previousData,
        suggestions: optimistic,
      });

      return { previousData };
    },
    onError: (error, _, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(SUGGESTIONS_QUERY_KEY, context.previousData);
      }
      lastError.value = error as Error;
      options?.onError?.(lastError.value.message ?? "Unable to update status.");
    },
    onSuccess: (updated) => {
      const currentData = queryClient.getQueryData<SuggestionsData>(
        SUGGESTIONS_QUERY_KEY,
      );
      if (!currentData) {
        return;
      }

      queryClient.setQueryData<SuggestionsData>(SUGGESTIONS_QUERY_KEY, {
        ...currentData,
        suggestions: currentData.suggestions.map((item) =>
          item.id === updated.id ? updated : item,
        ),
      });

      options?.onSuccess?.(
        `Status updated to ${updated.status.replaceAll("_", " ")}.`,
      );
    },
  });

  const updateStatus = async (payload: StatusUpdatePayload): Promise<void> => {
    pendingById[payload.id] = true;
    lastError.value = null;
    try {
      await mutation.mutateAsync(payload);
    } finally {
      pendingById[payload.id] = false;
    }
  };

  return {
    pendingById,
    lastError,
    updateStatus,
  };
};
