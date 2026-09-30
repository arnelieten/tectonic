import { useEffect, useState } from 'react'
import { api, type House } from './api'
import PhoneFrame from './components/PhoneFrame'
import ChecklistScreen from './screens/ChecklistScreen'
import KbcPaySheet from './screens/KbcPaySheet'
import ListingScreen from './screens/ListingScreen'
import LockScreen from './screens/LockScreen'

type Screen = 'lock' | 'listing' | 'pay' | 'checklist'

const DEMO_HOUSE_ID = 1

export default function App() {
  const [screen, setScreen] = useState<Screen>('lock')
  const [house, setHouse] = useState<House | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let objectUrl: string | undefined
    ;(async () => {
      try {
        const h = await api.get<House>(`/api/houses/${DEMO_HOUSE_ID}`)
        setHouse(h)
        const blob = await api.blob(`/api/houses/${DEMO_HOUSE_ID}/image`)
        objectUrl = URL.createObjectURL(blob)
        setImageUrl(objectUrl)
      } catch (e) {
        setError(String(e))
      }
    })()
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [])

  function replay() {
    setScreen('lock')
  }

  const lightStatus = screen === 'lock'

  if (error) {
    return (
      <main className="flex min-h-full items-center justify-center p-8">
        <p className="max-w-md rounded-xl border border-kbc-line bg-white p-6 text-kbc-ink">
          Could not load the demo. Start the API with{' '}
          <code className="rounded bg-kbc-mist px-1">uv run fastapi dev</code> in{' '}
          <code className="rounded bg-kbc-mist px-1">backend</code>, then refresh.
          <span className="mt-2 block text-sm text-kbc-slate">{error}</span>
        </p>
      </main>
    )
  }

  if (!house || !imageUrl) {
    return (
      <main className="flex min-h-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-kbc-line border-t-kbc-sky" />
      </main>
    )
  }

  return (
    <PhoneFrame lightStatus={lightStatus}>
      {screen === 'lock' && (
        <LockScreen house={house} onOpenNotification={() => setScreen('listing')} />
      )}
      {screen === 'listing' && (
        <ListingScreen
          house={house}
          imageUrl={imageUrl}
          onBack={() => setScreen('lock')}
          onPay={() => setScreen('pay')}
        />
      )}
      {screen === 'pay' && (
        <>
          <ListingScreen
            house={house}
            imageUrl={imageUrl}
            onBack={() => setScreen('listing')}
            onPay={() => {}}
          />
          <KbcPaySheet
            house={house}
            onClose={() => setScreen('listing')}
            onReplay={replay}
            onChecklist={() => setScreen('checklist')}
          />
        </>
      )}
      {screen === 'checklist' && <ChecklistScreen onFinish={replay} />}
    </PhoneFrame>
  )
}
