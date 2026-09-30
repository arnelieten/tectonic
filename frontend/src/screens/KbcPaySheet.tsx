import { useCallback, useEffect, useRef, useState } from 'react'
import { formatPrice, LOCALE, type House } from '../api'
import { ACCOUNTS, computeMortgage, DOWN_PAYMENT, RATES, TERM_YEARS, type RateType } from '../mortgage'

type PayPhase = 'ready' | 'faceid' | 'processing' | 'done' | 'success'

type Props = {
  house: House
  onClose: () => void
  onReplay: () => void
}

const percent = (value: number) => `${value.toLocaleString(LOCALE)}%`

function Slider({
  label,
  value,
  display,
  min,
  max,
  step,
  minLabel,
  maxLabel,
  disabled,
  onChange,
}: {
  label: string
  value: number
  display: string
  min: number
  max: number
  step: number
  minLabel: string
  maxLabel: string
  disabled: boolean
  onChange: (value: number) => void
}) {
  return (
    <label className="block px-4 py-3">
      <span className="flex items-baseline justify-between">
        <span className="text-[14px] text-kbc-slate">{label}</span>
        <span className="text-[15px] font-semibold text-kbc-ink">{display}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-kbc-sky disabled:opacity-50"
      />
      <span className="flex justify-between text-[12px] text-kbc-slate">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </span>
    </label>
  )
}

export default function KbcPaySheet({ house, onClose, onReplay }: Props) {
  const [phase, setPhase] = useState<PayPhase>('ready')
  const [termYears, setTermYears] = useState(TERM_YEARS.default)
  const [downPayment, setDownPayment] = useState(DOWN_PAYMENT.default)
  const [rateType, setRateType] = useState<RateType>('fixed')
  const [expanded, setExpanded] = useState(false)
  const paymentTimers = useRef<number[]>([])

  const mortgage = computeMortgage({ price: house.price, downPayment, termYears, rateType })
  const locked = phase !== 'ready'

  const startPayment = useCallback(() => {
    if (phase !== 'ready') return
    setExpanded(false)
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
        className="min-h-[60px] flex-1 bg-[rgba(22,56,97,0.6)]"
        aria-label="Close payment"
        disabled={phase !== 'ready' && phase !== 'success'}
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
            <span className="font-semibold text-kbc-ink">{house.title}</span> is yours. You pay{' '}
            <span className="font-semibold text-kbc-ink">{formatPrice(mortgage.monthly)} a month</span> over{' '}
            {termYears} years at a {rateType} rate of {percent(mortgage.rate)}.
          </p>
          <button
            type="button"
            onClick={onReplay}
            className="mt-8 h-11 w-full rounded-full bg-kbc-sky text-[16px] font-semibold text-white hover:bg-[#0098d4]"
          >
            View my home loan
          </button>
        </div>
      ) : (
        <div className="animate-sheet-up max-h-[90%] overflow-y-auto rounded-t-[20px] bg-[#f2f2f7] pb-8 pt-3 shadow-2xl">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-black/15" />

          <div className="relative flex items-center justify-center border-b border-black/5 bg-white px-4 py-3">
            <button
              type="button"
              onClick={onClose}
              className="absolute left-4 text-[17px] text-kbc-sky disabled:opacity-40"
              disabled={phase !== 'ready' && phase !== 'done'}
            >
              Cancel
            </button>
            <img src="/kbc-logo.png" alt="KBC" className="h-8 object-contain" />
          </div>

          <div className="mx-4 mt-4 divide-y divide-black/5 overflow-hidden rounded-xl bg-white">
            {ACCOUNTS.map((account) => (
              <div key={account.number} className="flex items-center gap-3 p-3">
                <div className="flex h-8 w-11 shrink-0 items-center justify-center rounded-md bg-kbc-navy text-[10px] font-bold text-white">
                  KBC
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-medium text-kbc-ink">{account.name}</p>
                  <p className="text-[13px] text-kbc-slate">•••• {account.number}</p>
                </div>
                <div className="text-right">
                  <p className="text-[12px] text-kbc-slate">Balance</p>
                  <p className="text-[15px] font-semibold text-kbc-ink tabular-nums">
                    {formatPrice(account.balance)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mx-4 mt-4 overflow-hidden rounded-xl bg-white">
            <button
              type="button"
              onClick={() => setExpanded((open) => !open)}
              aria-expanded={expanded}
              aria-controls="loan-options"
              className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
            >
              <span>
                <span className="block text-[14px] text-kbc-slate">Monthly payment</span>
                <span className="mt-1 block text-[30px] font-semibold leading-none text-kbc-navy tabular-nums">
                  {formatPrice(mortgage.monthly)}
                </span>
                <span className="mt-2 block text-[13px] text-kbc-slate">
                  {termYears} years, {rateType === 'fixed' ? 'fixed' : 'variable'} rate {percent(mortgage.rate)},{' '}
                  {formatPrice(downPayment)} down
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-1 text-[14px] font-semibold text-kbc-sky">
                {expanded ? 'Hide' : 'Adjust'}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
                  aria-hidden
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
            </button>

            {expanded && (
              <div id="loan-options" className="border-t border-black/5 pt-3">
                <p className="px-4 pb-3 text-[13px] text-kbc-slate">
                  {mortgage.monthlyMax !== null
                    ? `Can rise to ${formatPrice(mortgage.monthlyMax)} if interest rates go up`
                    : 'Stays the same for the full term'}
                </p>

                <div className="mx-4 mb-2 grid grid-cols-2 rounded-full bg-kbc-mist p-1" role="radiogroup" aria-label="Interest rate">
                  {(['fixed', 'variable'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      role="radio"
                      aria-checked={rateType === type}
                      disabled={locked}
                      onClick={() => setRateType(type)}
                      className={`rounded-full py-2 text-[14px] font-semibold transition ${
                        rateType === type ? 'bg-white text-kbc-navy shadow-sm' : 'text-kbc-slate'
                      }`}
                    >
                      {type === 'fixed' ? 'Fixed' : 'Variable'} {percent(RATES[type])}
                    </button>
                  ))}
                </div>

                <Slider
                  label="Loan term"
                  value={termYears}
                  display={`${termYears} years`}
                  min={TERM_YEARS.min}
                  max={TERM_YEARS.max}
                  step={1}
                  minLabel={`${TERM_YEARS.min} years`}
                  maxLabel={`${TERM_YEARS.max} years`}
                  disabled={locked}
                  onChange={setTermYears}
                />
                <Slider
                  label="Down payment"
                  value={downPayment}
                  display={formatPrice(downPayment)}
                  min={DOWN_PAYMENT.min}
                  max={DOWN_PAYMENT.max}
                  step={DOWN_PAYMENT.step}
                  minLabel={formatPrice(DOWN_PAYMENT.min)}
                  maxLabel={formatPrice(DOWN_PAYMENT.max)}
                  disabled={locked}
                  onChange={setDownPayment}
                />

                <dl className="border-t border-black/5 px-4 py-3 text-[14px]">
                  <div className="flex justify-between py-0.5">
                    <dt className="text-kbc-slate">Loan amount</dt>
                    <dd className="font-medium text-kbc-ink tabular-nums">{formatPrice(mortgage.loan)}</dd>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <dt className="text-kbc-slate">Total interest</dt>
                    <dd className="font-medium text-kbc-ink tabular-nums">{formatPrice(mortgage.totalInterest)}</dd>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <dt className="text-kbc-slate">Total to repay</dt>
                    <dd className="font-medium text-kbc-ink tabular-nums">{formatPrice(mortgage.totalCost)}</dd>
                  </div>
                </dl>
              </div>
            )}
          </div>

          {phase === 'ready' && (
            <button
              type="button"
              onClick={startPayment}
              className="mx-4 mt-4 flex w-[calc(100%-2rem)] flex-col items-center gap-2 rounded-xl bg-black py-4 text-white transition active:scale-[0.99]"
            >
              <span className="text-[15px] font-medium">Confirm with Side Button</span>
              <span className="animate-pulse-ring inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-white/60">
                <span className="h-4 w-1 rounded-full bg-white" />
              </span>
            </button>
          )}

          {phase === 'faceid' && (
            <div className="mx-4 mt-6 flex flex-col items-center py-2">
              <div className="animate-face-id flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-kbc-sky/50 bg-kbc-sky-tint">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#163861" strokeWidth="1.5">
                  <path d="M12 11c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <rect x="4" y="4" width="16" height="16" rx="4" />
                </svg>
              </div>
              <p className="mt-3 text-[15px] font-medium text-kbc-ink">Face ID</p>
            </div>
          )}

          {phase === 'processing' && (
            <div className="mx-4 mt-6 flex flex-col items-center py-4">
              <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-kbc-line border-t-kbc-sky" />
              <p className="mt-3 text-[15px] text-kbc-slate">Processing with KBC…</p>
            </div>
          )}

          {phase === 'done' && (
            <div className="mx-4 mt-6 flex flex-col items-center py-2">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="mt-3 text-[17px] font-semibold text-kbc-ink">Done</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
