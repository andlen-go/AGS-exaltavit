export function json(status: number, body: unknown, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers },
  })
}

export async function readJson<T>(request: Request): Promise<T | null> {
  if (!request.headers.get('content-type')?.includes('application/json')) return null
  try {
    return (await request.json()) as T
  } catch {
    return null
  }
}
