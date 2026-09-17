type Result<T> = { ok: true; value: T } | { ok: false; error: Error };

export async function fetchJson<T extends object>(url: URL): Promise<Result<T>> {
  try {
    const response = await fetch(url);
    return { ok: true, value: (await response.json()) as T };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error : new Error(String(error)) };
  }
}
