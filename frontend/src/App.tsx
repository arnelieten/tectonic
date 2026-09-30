import { useEffect, useState } from 'react'
import { api, type Item } from './api'

export default function App() {
  const [items, setItems] = useState<Item[]>([])
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [reply, setReply] = useState('')
  const [sessionId, setSessionId] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadItems = () => api.get<Item[]>('/api/items').then(setItems).catch((e) => setError(String(e)))

  useEffect(() => {
    loadItems()
  }, [])

  async function addItem(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    await api.post<Item>('/api/items', { title })
    setTitle('')
    loadItems()
  }

  async function removeItem(id: string) {
    await api.del(`/api/items/${id}`)
    loadItems()
  }

  async function ask(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) return
    setLoading(true)
    try {
      const res = await api.post<{ reply: string; session_id: string }>('/api/ai/chat', {
        message,
        session_id: sessionId,
      })
      setReply(res.reply)
      setSessionId(res.session_id)
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-3xl space-y-8 p-8">
      <header>
        <h1 className="text-4xl font-bold tracking-tight">Tectonic</h1>
        <p className="text-gray-500">Hackathon starter: FastAPI + Vite + React</p>
      </header>

      {error && <p className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <section className="space-y-3 rounded-xl border p-6">
        <h2 className="text-xl font-semibold">Items</h2>
        <form onSubmit={addItem} className="flex gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New item"
            className="flex-1 rounded border px-3 py-2"
          />
          <button className="rounded bg-black px-4 py-2 text-white">Add</button>
        </form>
        <ul className="divide-y">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">{item.title}</p>
                {item.description && <p className="text-sm text-gray-500">{item.description}</p>}
              </div>
              <button onClick={() => removeItem(item.id)} className="text-sm text-gray-400 hover:text-red-600">
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3 rounded-xl border p-6">
        <h2 className="text-xl font-semibold">Ask the AI</h2>
        <form onSubmit={ask} className="flex gap-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Say something"
            className="flex-1 rounded border px-3 py-2"
          />
          <button disabled={loading} className="rounded bg-black px-4 py-2 text-white disabled:opacity-50">
            {loading ? 'Thinking...' : 'Send'}
          </button>
        </form>
        {reply && <p className="whitespace-pre-wrap rounded bg-gray-50 p-3">{reply}</p>}
      </section>
    </main>
  )
}
