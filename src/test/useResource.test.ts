import { render, waitFor } from "@testing-library/vue";
import { flushPromises } from "@vue/test-utils";
import { defineComponent, h, ref, type MaybeRefOrGetter } from "vue";
import { describe, expect, it, vi } from "vitest";
import { useResource } from "@/shared/lib/useResource";
import { jsonResponse } from "./fixtures";

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((complete) => {
    resolve = complete;
  });
  return { promise, resolve };
}

function mountResource<T>(path: MaybeRefOrGetter<string>) {
  let resource!: ReturnType<typeof useResource<T>>;
  const { unmount } = render(
    defineComponent({
      setup() {
        resource = useResource<T>(path);
        return () => h("div");
      },
    })
  );
  return { resource, unmount };
}

describe("useResource", () => {
  it("aborts an old request and prevents late data from replacing the current result", async () => {
    const oldRequest = deferred<Response>();
    const currentRequest = deferred<Response>();
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockReturnValueOnce(oldRequest.promise)
      .mockReturnValueOnce(currentRequest.promise);
    vi.stubGlobal("fetch", fetchMock);

    const path = ref("/character/1");
    const { resource } = mountResource<{ name: string }>(path);
    path.value = "/character/2";

    expect(fetchMock.mock.calls[0][1]?.signal?.aborted).toBe(true);
    expect(resource.data.value).toBeNull();
    expect(resource.isLoading.value).toBe(true);

    currentRequest.resolve(jsonResponse({ name: "Morty Smith" }));
    await waitFor(() => expect(resource.data.value?.name).toBe("Morty Smith"));
    oldRequest.resolve(jsonResponse({ name: "Rick Sanchez" }));
    await flushPromises();

    expect(resource.data.value?.name).toBe("Morty Smith");
    expect(resource.error.value).toBeNull();
  });

  it("treats an API 404 as no results instead of a connection error", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn<typeof fetch>()
        .mockResolvedValue(
          jsonResponse({ error: "There is nothing here" }, 404)
        )
    );
    const { resource } = mountResource("/character?name=missing");

    await waitFor(() => expect(resource.isLoading.value).toBe(false));
    expect(resource.isNotFound.value).toBe(true);
    expect(resource.error.value).toBeNull();
    expect(resource.data.value).toBeNull();
  });

  it("recovers from a failed request when retrying", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockRejectedValueOnce(new TypeError("Network failed"))
      .mockResolvedValueOnce(jsonResponse({ name: "Rick Sanchez" }));
    vi.stubGlobal("fetch", fetchMock);
    const { resource } = mountResource<{ name: string }>("/character/1");

    await waitFor(() => expect(resource.error.value).toBeTruthy());
    resource.retry();
    await waitFor(() => expect(resource.data.value?.name).toBe("Rick Sanchez"));
    expect(resource.error.value).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("aborts an in-flight request on unmount", () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockReturnValue(new Promise<Response>(() => {}));
    vi.stubGlobal("fetch", fetchMock);
    const { unmount } = mountResource("/character");
    const signal = fetchMock.mock.calls[0][1]?.signal;

    expect(signal?.aborted).toBe(false);
    unmount();
    expect(signal?.aborted).toBe(true);
  });
});
