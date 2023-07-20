export function parseUrlParams<T>(url: string) {
  const params = new URLSearchParams(new URL(url).searchParams);
  const result = {} as any;
  params.forEach((value, key, parent) => {
    result[key] = value;
  });

  return result as T;
}
