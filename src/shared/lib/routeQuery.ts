import type { LocationQueryValue } from "vue-router";

export function readQueryString(
  value: LocationQueryValue | LocationQueryValue[] | undefined
): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}
