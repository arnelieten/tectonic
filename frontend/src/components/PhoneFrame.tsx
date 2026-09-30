import { useState, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** When true, status bar uses light icons (on dark backgrounds) */
  lightStatus?: boolean
}

function StatusBar({ light, time }: { light: boolean; time: string }) {
  const fg = light ? 'text-white' : 'text-kbc-ink'

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 top-0 z-30 flex items-end justify-between px-7 pb-1 pt-3 text-[13px] font-semibold ${fg}`}
    >
      <span>{time}</span>
      <div className="flex items-center gap-1.5">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" aria-hidden>
          <rect x="0" y="8" width="3" height="4" rx="0.5" opacity="0.35" />
          <rect x="5" y="5" width="3" height="7" rx="0.5" opacity="0.55" />
          <rect x="10" y="2" width="3" height="10" rx="0.5" opacity="0.75" />
          <rect x="15" y="0" width="3" height="12" rx="0.5" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" aria-hidden>
          <path d="M8 2.5C10.5 2.5 12.7 3.5 14.2 5.1L15.6 3.7C13.7 1.8 11 0.5 8 0.5S2.3 1.8 0.4 3.7L1.8 5.1C3.3 3.5 5.5 2.5 8 2.5Z" />
          <path d="M8 6.5C9.4 6.5 10.7 7 11.7 7.9L13.1 6.5C11.6 5.1 9.9 4.3 8 4.3S4.4 5.1 2.9 6.5L4.3 7.9C5.3 7 6.6 6.5 8 6.5Z" />
          <circle cx="8" cy="10.5" r="1.5" />
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none" aria-hidden>
          <rect
            x="0.5"
            y="0.5"
            width="22"
            height="12"
            rx="3"
            stroke="currentColor"
            className={light ? 'text-white/90' : 'text-kbc-ink/90'}
          />
          <rect x="2" y="2" width="17" height="9" rx="1.5" fill="currentColor" />
          <path
            d="M24 4.5V8.5C25 8 25.5 7 25.5 6.5C25.5 6 25 5 24 4.5Z"
            fill="currentColor"
            opacity="0.45"
          />
        </svg>
      </div>
    </div>
  )
}

export default function PhoneFrame({ children, lightStatus = false }: Props) {
  const [statusTime] = useState(() =>
    new Date().toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit', hour12: false }),
  )

  return (
    <div className="flex min-h-full items-center justify-center p-6">
      <div
        className="relative h-[844px] w-[390px] overflow-hidden rounded-[3rem] bg-black shadow-[0_24px_80px_rgba(22,56,97,0.25)] ring-[10px] ring-[#1a1a1a]"
        role="presentation"
      >
        <div className="absolute left-1/2 top-3 z-40 h-[34px] w-[126px] -translate-x-1/2 rounded-full bg-black" />
        <StatusBar light={lightStatus} time={statusTime} />
        <div className="relative h-full w-full overflow-hidden bg-white">{children}</div>
        <div className="pointer-events-none absolute bottom-2 left-1/2 z-40 h-1 w-[134px] -translate-x-1/2 rounded-full bg-white/30" />
      </div>
    </div>
  )
}
