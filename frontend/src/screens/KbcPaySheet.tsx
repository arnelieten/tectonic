import { useCallback, useEffect, useRef, useState } from 'react'
import { formatPrice, type House } from '../api'

type PayPhase = 'ready' | 'faceid' | 'processing' | 'done' | 'success'

type Props = {
  house: House
  imageUrl: string
  onClose: () => void
  onReplay: () => void
}

export default function KbcPaySheet({ house, imageUrl, onClose, onReplay }: Props) {
  const [phase, setPhase] = useState<PayPhase>('ready')
  const paymentTimers = useRef<number[]>([])

  const startPayment = useCallback(() => {
    if (phase !== 'ready') return
    setPhase('faceid')
    const t1 = window.setTimeout(() => setPhase('processing'), 1200)
    const t2 = window.setTimeout(() => setPhase('done'), 3200)
    const t3 = window.setTimeout(() => setPhase('success'), 5000)
    paymentTimers.current = [t1, t2, t3]
  }, [phase])

  useEffect(() => {
    return () => {
      for (const id of paymentTimers.current) window.clearTimeout(id)
    }
  }, [])

  return (
    <div className="absolute inset-0 z-20 flex flex-col">
      <button
        type="button"
        className="min-h-0 flex-1 bg-[rgba(22,56,97,0.6)]"
        aria-label="Close payment"
        onClick={phase === 'success' ? onReplay : onClose}
      />

      {phase === 'success' ? (
        <div className="animate-sheet-up rounded-t-[20px] bg-white px-6 pb-10 pt-8 shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#2E8540]/15">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2E8540" strokeWidth="2.5">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-5 text-center text-[22px] font-semibold text-kbc-navy">Congratulations, Thomas</h2>
          <p className="mt-2 text-center text-[15px] leading-relaxed text-kbc-slate">
            <span className="font-semibold text-kbc-ink">{house.title}</span> is yours. Your notary appointment
            is scheduled within 5 minutes.
          </p>
          <button
            type="button"
            onClick={onReplay}
            className="mt-8 h-11 w-full rounded-full bg-kbc-sky text-[16px] font-semibold text-white hover:bg-[#0098d4]"
          >
            Replay demo
          </button>
        </div>
      ) : (
        <div className="animate-sheet-up rounded-t-[20px] bg-[#f2f2f7] px-0 pb-8 pt-3 shadow-2xl">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-black/15" />

          <div className="relative flex items-center justify-center border-b border-black/5 bg-white px-4 py-3">
            <button
              type="button"
              onClick={onClose}
              className="absolute left-4 text-[17px] text-kbc-sky"
              disabled={phase !== 'ready' && phase !== 'done'}
            >
              Cancel
            </button>
            <img src="/kbc-logo.png" alt="KBC" className="h-8 object-contain" />
          </div>

          <div className="mx-4 mt-4 overflow-hidden rounded-xl bg-white">
            <div className="flex items-center gap-3 border-b border-black/5 p-4">
              <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-md bg-kbc-navy text-[10px] font-bold text-white">
                KBC
              </div>
              <div>
                <p className="text-[15px] font-medium text-kbc-ink">KBC Home Account</p>
                <p className="text-[13px] text-kbc-slate">•••• 4821</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4">
              <img src={imageUrl} alt="" className="h-12 w-12 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-medium text-kbc-ink">{house.title}</p>
                <p className="truncate text-[13px] text-kbc-slate">{house.address}</p>
              </div>
            </div>

            <div className="border-t border-black/5 px-4 py-3">
              <p className="text-[13px] text-kbc-slate">Notary & registration (estimated)</p>
              <p className="text-[15px] text-kbc-ink">Included in KBC Home Pack</p>
            </div>
          </div>

          <div className="mx-4 mt-4 flex items-center justify-between rounded-xl bg-white px-4 py-4">
            <span className="text-[13px] font-semibold tracking-wide text-kbc-slate">TOTAL</span>
            <span className="text-[22px] font-semibold text-kbc-ink">
              {formatPrice(house.price, house.currency)}
            </span>
          </div>

          {phase === 'ready' && (
            <button
              type="button"
              onClick={startPayment}
              className="mx-4 mt-6 flex w-[calc(100%-2rem)] flex-col items-center gap-2 rounded-xl bg-black py-4 text-white transition active:scale-[0.99]"
            >
              <span className="text-[15px] font-medium">Confirm with Side Button</span>
              <span className="animate-pulse-ring inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-white/60">
                <span className="h-4 w-1 rounded-full bg-white" />
              </span>
            </button>
          )}

          {phase === 'faceid' && (
            <div className="mx-4 mt-8 flex flex-col items-center py-4">
              <div className="animate-face-id flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-kbc-sky/50 bg-kbc-sky-tint">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#163861" strokeWidth="1.5">
                  <path d="M12 11c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <rect x="4" y="4" width="16" height="16" rx="4" />
                </svg>
              </div>
              <p className="mt-4 text-[15px] font-medium text-kbc-ink">Face ID</p>
            </div>
          )}

          {phase === 'processing' && (
            <div className="mx-4 mt-10 flex flex-col items-center py-6">
              <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-kbc-line border-t-kbc-sky" />
              <p className="mt-4 text-[15px] text-kbc-slate">Processing with KBC…</p>
            </div>
          )}

          {phase === 'done' && (
            <div className="mx-4 mt-8 flex flex-col items-center py-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="mt-4 text-[17px] font-semibold text-kbc-ink">Done</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
