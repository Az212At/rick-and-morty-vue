const API_URL = "https://rickandmortyapi.com/api";

export class ApiError extends Error {
  constructor(public readonly status: number) {
    super(`API request failed with status ${status}`);
    this.name = "ApiError";
  }
}

export async function request<T>(
  path: string,
  signal?: AbortSignal
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { signal });

  if (!response.ok) {
    throw new ApiError(response.status);
  }

  return response.json() as Promise<T>;
}

export function createApiPath(
  resource: "character" | "episode",
  filters: Record<string, string | number | undefined>
): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  }

  return `/${resource}?${params.toString()}`;
}
