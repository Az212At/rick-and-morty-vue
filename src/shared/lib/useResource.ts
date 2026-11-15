import {
  computed,
  ref,
  shallowRef,
  toValue,
  watch,
  type MaybeRefOrGetter,
} from "vue";
import { ApiError, request } from "@/shared/api/rick-and-morty-api";

interface ResourceState<T> {
  data: T | null;
  isLoading: boolean;
  isNotFound: boolean;
  error: string | null;
}

function loadingState<T>(): ResourceState<T> {
  return { data: null, isLoading: true, isNotFound: false, error: null };
}

/** The watcher owns each request and aborts it on query changes or scope disposal. */
export function useResource<T>(path: MaybeRefOrGetter<string>) {
  const attempt = ref(0);
  const state = shallowRef<ResourceState<T>>(loadingState());

  watch(
    [() => toValue(path), attempt],
    ([currentPath], _previous, onCleanup) => {
      const controller = new AbortController();
      onCleanup(() => controller.abort());
      state.value = loadingState();

      void request<T>(currentPath, controller.signal)
        .then((data) => {
          if (!controller.signal.aborted) {
            state.value = {
              data,
              isLoading: false,
              isNotFound: false,
              error: null,
            };
          }
        })
        .catch((error: unknown) => {
          if (controller.signal.aborted) {
            return;
          }

          const isNotFound = error instanceof ApiError && error.status === 404;
          state.value = {
            data: null,
            isLoading: false,
            isNotFound,
            error: isNotFound
              ? null
              : "Не удалось загрузить данные. Проверьте подключение и попробуйте снова.",
          };
        });
    },
    // Clear stale data before Vue renders a new query; cleanup also runs on unmount.
    { immediate: true, flush: "sync" }
  );

  return {
    data: computed(() => state.value.data),
    isLoading: computed(() => state.value.isLoading),
    isNotFound: computed(() => state.value.isNotFound),
    error: computed(() => state.value.error),
    retry: () => {
      attempt.value += 1;
    },
  };
}
