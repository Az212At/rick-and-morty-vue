import { describe, expect, it, vi } from "vitest";
import { ApiError, request } from "@/shared/api/rick-and-morty-api";
import { jsonResponse } from "./fixtures";

describe("API requests", () => {
  it("passes the cancellation signal and returns parsed data", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse({ id: 1 }));
    vi.stubGlobal("fetch", fetchMock);
    const controller = new AbortController();

    await expect(
      request<{ id: number }>("/character/1", controller.signal)
    ).resolves.toEqual({ id: 1 });
    expect(fetchMock.mock.calls[0][1]?.signal).toBe(controller.signal);
  });

  it("preserves the HTTP status so callers can distinguish no results from server failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn<typeof fetch>()
        .mockResolvedValue(jsonResponse({ error: "Unavailable" }, 503))
    );

    const error = await request("/episode").catch((reason: unknown) => reason);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 503 });
  });
});
