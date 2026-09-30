export type RateType = 'fixed' | 'variable'

/** Illustrative yearly rates in percent, not live KBC rates. */
export const RATES: Record<RateType, number> = { fixed: 3.3, variable: 2.9 }
/** Belgian variable formulas cap the rise; demo assumes +2 points worst case. */
export const VARIABLE_MAX_RISE = 2

export const TERM_YEARS = { min: 5, max: 25, default: 25 }
export const ACCOUNTS = [
  { name: 'Personal Account', number: '4821', balance: 60_000 },
  { name: 'Savings Account', number: '7390', balance: 70_000 },
]

export const DOWN_PAYMENT = {
  min: 40_000,
  max: ACCOUNTS.reduce((sum, account) => sum + account.balance, 0),
  step: 5_000,
  default: 60_000,
}

export type MortgageInput = {
  price: number
  downPayment: number
  termYears: number
  rateType: RateType
}

export type MortgageResult = {
  loan: number
  rate: number
  monthly: number
  monthlyMax: number | null
  totalInterest: number
  totalCost: number
}

function annuity(loan: number, yearlyRatePct: number, termYears: number): number {
  const months = termYears * 12
  const r = yearlyRatePct / 100 / 12
  if (r === 0) return loan / months
  return (loan * r) / (1 - (1 + r) ** -months)
}

/** Rounded to €10 so the demo shows indicative amounts. */
function roundTo10(amount: number): number {
  return Math.round(amount / 10) * 10
}

export function computeMortgage({ price, downPayment, termYears, rateType }: MortgageInput): MortgageResult {
  const loan = Math.max(price - downPayment, 0)
  const rate = RATES[rateType]
  const monthlyRaw = annuity(loan, rate, termYears)
  const totalInterest = monthlyRaw * termYears * 12 - loan

  return {
    loan,
    rate,
    monthly: roundTo10(monthlyRaw),
    monthlyMax:
      rateType === 'variable' ? roundTo10(annuity(loan, rate + VARIABLE_MAX_RISE, termYears)) : null,
    totalInterest: Math.round(totalInterest / 100) * 100,
    totalCost: Math.round((loan + totalInterest) / 100) * 100,
  }
}

export function defaultMortgage(price: number): MortgageResult {
  return computeMortgage({
    price,
    downPayment: DOWN_PAYMENT.default,
    termYears: TERM_YEARS.default,
    rateType: 'fixed',
  })
}
