import { createApiPath } from "@/shared/api/rick-and-morty-api";

export const characterListPath = (filters: {
  page: number;
  name: string;
  status: string;
}) => createApiPath("character", filters);
