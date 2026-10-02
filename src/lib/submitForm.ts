import type { FormDataMap, FormType, PublicConfig, SubmitResponse } from '../shared/forms'

export async function submitForm<T extends FormType>(
  type: T,
  data: FormDataMap[T],
  guard: { hp: string; startedAt: number },
): Promise<SubmitResponse> {
  try {
    const response = await fetch('/api/send-form', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ type, data, ...guard }),
    })
    const body = (await response.json().catch(() => null)) as SubmitResponse | null
    if (body) return body
    return { ok: false, error: 'We couldn’t send your request just now. Please try again in a few minutes.' }
  } catch {
    return { ok: false, error: 'Network error — check your connection and try again.' }
  }
}

let publicConfig: Promise<PublicConfig | null> | null = null

/** Cached per page load. Resolves to null when the functions backend can't be reached. */
export function loadPublicConfig(): Promise<PublicConfig | null> {
  publicConfig ??= fetch('/api/public-config')
    .then((response) => (response.ok ? (response.json() as Promise<PublicConfig>) : null))
    .catch(() => null)
  return publicConfig
}
