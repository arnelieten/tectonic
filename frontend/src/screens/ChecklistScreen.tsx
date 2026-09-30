import type { ReactNode } from 'react'

type Status = 'done' | 'action'

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

function FlameIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 3c.5 3-2.5 4.5-2.5 8a2.5 2.5 0 005 0c0-1-.5-2-1-2.5 2 .5 4.5 3 4.5 6.5a6 6 0 01-12 0c0-5 4-7.5 6-12z" />
    </svg>
  )
}

function FamilyIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="8" cy="7" r="2.5" />
      <circle cx="16" cy="7" r="2.5" />
      <circle cx="12" cy="13" r="2" />
      <path d="M3.5 19a4.5 4.5 0 019 0M11.5 19a4.5 4.5 0 019 0" />
    </svg>
  )
}

function PlaneIcon() {
  return (
    <svg {...iconProps}>
      <path d="M10.5 13.5L3 11l1.5-1.5 7 1 4-4.5a2 2 0 013 3l-4.5 4 1 7L13.5 21 11 13.5" />
      <path d="M6 18l2-2" />
    </svg>
  )
}

function CarIcon() {
  return (
    <svg {...iconProps}>
      <path d="M5 16V11l2-4.5A2 2 0 018.8 5.5h6.4A2 2 0 0117 6.5L19 11v5" />
      <rect x="3" y="11" width="18" height="6" rx="2" />
      <path d="M6 17v2M18 17v2" />
      <circle cx="7.5" cy="14" r="1" />
      <circle cx="16.5" cy="14" r="1" />
    </svg>
  )
}

function HospitalIcon() {
  return (
    <svg {...iconProps}>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#2E8540] text-white" aria-hidden>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
        <path d="M5 13l4 4L19 7" />
      </svg>
    </span>
  )
}

function AlertIcon() {
  return (
    <span
      className="flex h-4 w-4 items-center justify-center rounded-full bg-[#C8102E] text-[11px] font-bold leading-none text-white"
      aria-hidden
    >
      !
    </span>
  )
}

const STATUS_STYLES: Record<Status, { label: string; tone: string; icon: ReactNode }> = {
  done: { label: 'Done', tone: 'bg-[#2E8540]/10 text-[#2E8540]', icon: <CheckIcon /> },
  action: { label: 'Action needed', tone: 'bg-[#C8102E]/10 text-[#C8102E]', icon: <AlertIcon /> },
}

const ITEMS: { title: string; detail: string; icon: ReactNode; status: Status }[] = [
  { title: 'Fire insurance', detail: 'Included in your home loan', icon: <FlameIcon />, status: 'done' },
  {
    title: 'Hospital insurance',
    detail: "Covered by your employer's group plan",
    icon: <HospitalIcon />,
    status: 'done',
  },
  {
    title: 'Family insurance',
    detail: "Your parents' policy no longer covers you",
    icon: <FamilyIcon />,
    status: 'action',
  },
  {
    title: 'Travel insurance',
    detail: 'Your cover ended when you moved out',
    icon: <PlaneIcon />,
    status: 'action',
  },
  {
    title: 'Car insurance',
    detail: "Your car is still on your parents' policy",
    icon: <CarIcon />,
    status: 'action',
  },
]

type Props = {
  onFinish: () => void
}

export default function ChecklistScreen({ onFinish }: Props) {
  return (
    <div className="flex h-full flex-col bg-kbc-mist">
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6 pt-20">
        <h1 className="text-[28px] font-semibold leading-tight text-kbc-navy">Insurance Checklist</h1>
        <ul className="mt-6 space-y-3">
          {ITEMS.map((item) => {
            const style = STATUS_STYLES[item.status]
            return (
              <li
                key={item.title}
                className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-[0_8px_24px_rgba(22,56,97,0.08)]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-kbc-sky-tint text-kbc-navy">
                  {item.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[16px] font-semibold text-kbc-ink">{item.title}</p>
                  <p className="mt-0.5 text-[13px] leading-snug text-kbc-slate">{item.detail}</p>
                  <span
                    className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold ${style.tone}`}
                  >
                    {style.icon}
                    {style.label}
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="border-t border-kbc-line bg-white px-5 pb-8 pt-3">
        <button
          type="button"
          onClick={onFinish}
          className="h-11 w-full rounded-full bg-kbc-sky text-[16px] font-semibold text-white transition hover:bg-[#0098d4]"
        >
          Finish
        </button>
      </div>
    </div>
  )
}
