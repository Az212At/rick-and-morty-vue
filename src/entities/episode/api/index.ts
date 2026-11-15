import { createApiPath } from "@/shared/api/rick-and-morty-api";

export const episodeListPath = (filters: { page: number; name: string }) =>
  createApiPath("episode", filters);
