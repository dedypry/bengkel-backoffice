/** Normalize API/Redux values that may be an array, paginated `{ data }`, or null. */
export function asArray<T = any>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object" && Array.isArray((value as any).data)) {
    return (value as any).data as T[];
  }

  return [];
}
