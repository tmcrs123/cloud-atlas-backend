export function valueOrFallback<T>(value: unknown, fallback: T) {
  return value ? (value as T) : (fallback as T);
}
