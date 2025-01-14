export function stripProperties<T extends object>(
  obj: T,
  keysToRemove: string[]
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keysToRemove.includes(key))
  ) as Partial<T>;
}
