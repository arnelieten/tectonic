import { useEffect, useState } from 'react'
import type { House } from '../api'

type Props = {
  house: House
  onOpenNotification: () => void
}

export default function LockScreen({ house, onOpenNotification }: Props) {
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    const t = window.setTimeout(() => setShowNotification(true), 1500)
    return () => window.clearTimeout(t)
  }, [])

  const [{ time, date }] = useState(() => {
    const now = new Date()
    return {
      time: now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      date: now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }),
    }
  })

  return (
    <div className="relative h-full w-full">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.3) 100%), url(/background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#163861',
        }}
      />

      <div className="relative flex h-full flex-col items-center pt-[72px] text-white">
        <p className="text-[15px] font-medium capitalize text-white/85">{date}</p>
        <p className="mt-1 text-[76px] font-extralight leading-none tracking-tight">{time}</p>
      </div>

      <div className="absolute inset-x-0 top-[196px] z-10 px-3">
        {showNotification && (
          <button
            type="button"
            onClick={onOpenNotification}
            className="animate-notification-in w-full rounded-2xl bg-white/95 p-3 text-left shadow-lg backdrop-blur-md transition active:scale-[0.98]"
          >
            <div className="flex items-start gap-3">
              <img src="/kbc-logo.png" alt="" className="h-10 w-10 shrink-0 rounded-xl object-contain" />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[15px] font-semibold text-kbc-navy">KBC</span>
                  <span className="shrink-0 text-[13px] text-kbc-slate">now</span>
                </div>
                <p className="mt-0.5 text-[15px] font-semibold leading-snug text-kbc-ink">
                  Buy your house in 5 minutes!
                </p>
                <p className="mt-1 line-clamp-2 text-[14px] leading-snug text-kbc-slate">
                  {house.title} in Ghent
                </p>
              </div>
            </div>
          </button>
        )}
      </div>

      <p className="absolute bottom-10 left-0 right-0 text-center text-[13px] text-white/70">
        Swipe up to unlock
      </p>
    </div>
  )
}
