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

async function blob(path: string): Promise<Blob> {
  const res = await fetch(path, {
    headers: { 'X-API-Key': API_KEY },
  })
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`)
  }
  return res.blob()
}

export type House = {
  id: number
  title: string
  address: string
  price: number
  currency: string
  bedrooms: number
  bathrooms: number
  sqft: number
  property_type: string
  description: string
  reason: string
  image: string
}

export const LOCALE = 'en-IE'

export function formatPrice(amount: number, currency = 'EUR'): string {
  return new Intl.NumberFormat(LOCALE, { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  del: (path: string) => request<void>(path, { method: 'DELETE' }),
  blob,
}
