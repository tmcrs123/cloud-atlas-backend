export function valueOfFallback<T>(value: unknown, fallback: T) {
  return value ? (value as T) : (fallback as T);
}
