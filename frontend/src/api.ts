const API_KEY = import.meta.env.VITE_API_KEY ?? 'dev-key'

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
      ...init.headers,
    },
  })
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`)
  }
  return res.status === 204 ? (undefined as T) : res.json()
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  del: (path: string) => request<void>(path, { method: 'DELETE' }),
}

export type Item = { id: string; title: string; description: string }
