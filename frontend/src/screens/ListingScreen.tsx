import { useState, type ReactNode } from 'react'
import { formatPrice, type House } from '../api'
import { defaultMortgage } from '../mortgage'

type Props = {
  house: House
  imageUrl: string
  onBack: () => void
  onPay: () => void
}

function Highlight({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <li className="flex items-center gap-4 py-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-kbc-sky-tint text-kbc-navy">
        {icon}
      </span>
      <div>
        <p className="text-[13px] text-kbc-slate">{label}</p>
        <p className="text-[17px] font-semibold text-kbc-ink">{value}</p>
      </div>
    </li>
  )
}

const iconProps = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

function PinIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 21s7-7.2 7-12a7 7 0 10-14 0c0 4.8 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  )
}

function EuroIcon() {
  return (
    <svg {...iconProps}>
      <path d="M17 6.5A6.5 6.5 0 007 12a6.5 6.5 0 0010 5.5" />
      <path d="M4.5 10.5h9M4.5 13.5h9" />
    </svg>
  )
}

function BriefcaseIcon() {
  return (
    <svg {...iconProps}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2M3 13h18" />
    </svg>
  )
}

function FriendsIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19a5.5 5.5 0 0111 0" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M15.5 14.2A4.5 4.5 0 0121 18.5" />
    </svg>
  )
}

type VisitSlot = { day: string; time: string; label: string }

function buildVisitSlots(): VisitSlot[] {
  const times = ['10:00', '17:30']
  const slots: VisitSlot[] = []
  for (let offset = 1; slots.length < 6; offset++) {
    const date = new Date()
    date.setDate(date.getDate() + offset)
    if (date.getDay() === 0) continue
    const day = date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
    for (const time of times) slots.push({ day, time, label: `${day}, ${time}` })
  }
  return slots
}

export default function ListingScreen({ house, imageUrl, onBack, onPay }: Props) {
  const monthly = defaultMortgage(house.price).monthly
  const [slots] = useState(buildVisitSlots)
  const [visitOpen, setVisitOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)
  const [bookedSlot, setBookedSlot] = useState<number | null>(null)

  return (
    <div className="relative flex h-full flex-col bg-white">
      <div className="relative min-h-0 flex-1 overflow-y-auto pb-24">
        <div className="relative aspect-[4/3] w-full shrink-0">
          <img src={imageUrl} alt={house.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
          <button
            type="button"
            onClick={onBack}
            className="absolute left-4 top-12 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-md"
            aria-label="Back"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            className="absolute right-4 top-12 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-md"
            aria-label="Save"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z" />
            </svg>
          </button>
        </div>

        <div className="px-5 pt-6">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-[24px] font-semibold leading-tight text-kbc-navy">{house.title}</h1>
            <button
              type="button"
              onClick={() => setVisitOpen((open) => !open)}
              disabled={bookedSlot !== null}
              aria-expanded={visitOpen}
              aria-controls="visit-slots"
              className="flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-kbc-sky px-5 text-[16px] font-semibold text-white transition hover:bg-[#0098d4] disabled:bg-kbc-sky-tint disabled:text-kbc-navy"
            >
              {bookedSlot !== null && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                  <path d="M5 13l4 4L19 7" />
                </svg>
              )}
              {bookedSlot !== null ? 'Visit booked' : 'Book visit'}
            </button>
          </div>

          {bookedSlot !== null && (
            <p className="mt-3 rounded-xl bg-kbc-sky-tint px-4 py-3 text-[15px] text-kbc-navy">
              See you on <span className="font-semibold">{slots[bookedSlot].label}</span> at Veldstraat 18.
            </p>
          )}

          {visitOpen && bookedSlot === null && (
            <div id="visit-slots" className="mt-4 rounded-xl border border-kbc-line bg-kbc-mist p-4">
              <p className="text-[15px] font-semibold text-kbc-navy">Pick a time to visit</p>
              <div className="mt-3 grid grid-cols-2 gap-2" role="radiogroup" aria-label="Visit time">
                {slots.map((slot, index) => (
                  <button
                    key={slot.label}
                    type="button"
                    role="radio"
                    aria-checked={selectedSlot === index}
                    onClick={() => setSelectedSlot(index)}
                    className={`rounded-lg border px-3 py-2 text-left transition ${
                      selectedSlot === index
                        ? 'border-kbc-sky bg-white ring-2 ring-kbc-sky'
                        : 'border-kbc-line bg-white hover:border-kbc-sky'
                    }`}
                  >
                    <span className="block text-[13px] text-kbc-slate">{slot.day}</span>
                    <span className="block text-[15px] font-semibold text-kbc-ink">{slot.time}</span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                disabled={selectedSlot === null}
                onClick={() => {
                  setBookedSlot(selectedSlot)
                  setVisitOpen(false)
                }}
                className="mt-4 h-10 w-full rounded-full bg-kbc-sky text-[16px] font-semibold text-white transition hover:bg-[#0098d4] disabled:opacity-40"
              >
                Confirm visit
              </button>
            </div>
          )}

          <ul className="mt-6 divide-y divide-kbc-line border-y border-kbc-line">
            <Highlight icon={<PinIcon />} label="Location" value="Ghent" />
            <Highlight icon={<EuroIcon />} label="Monthly payment" value={formatPrice(monthly)} />
            <Highlight icon={<BriefcaseIcon />} label="Commute" value="5 km from work" />
            <Highlight icon={<FriendsIcon />} label="Friends" value="Close to your friends" />
          </ul>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 border-t border-kbc-line bg-white px-5 pb-8 pt-3 shadow-[0_-4px_24px_rgba(22,56,97,0.08)]">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[20px] font-semibold text-kbc-navy">
            {formatPrice(monthly)}
            <span className="text-[15px] font-normal text-kbc-slate"> / month</span>
          </p>
          <button
            type="button"
            onClick={onPay}
            className="flex h-11 min-w-[140px] items-center justify-center gap-2 rounded-full bg-black px-6 text-[16px] font-semibold text-white transition hover:bg-neutral-800 active:scale-[0.98]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M21 7H3a1 1 0 00-1 1v10a2 2 0 002 2h16a2 2 0 002-2V8a1 1 0 00-1-1zm-1 2v8H4V9h16zM7 11h2v4H7v-4zm4 0h6v2h-6v-2z" />
            </svg>
            KBC Pay
          </button>
        </div>
      </div>
    </div>
  )
}
