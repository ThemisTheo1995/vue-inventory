// src/features/dashboard/utils/formatters.ts

const LOCALE = "en-GB"
const CURRENCY_SYMBOL = "GBP"

export const formatPrice = (priceInCents: number): string => {
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: CURRENCY_SYMBOL
  }).format(priceInCents / 100)
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const day = date.toLocaleDateString(LOCALE, { day: 'numeric' })
  const monthYear = date.toLocaleDateString(LOCALE, { month: 'short', year: '2-digit' })
  return `${day}, ${monthYear}`
}

export const getStatusClass = (status: string, small = false): string => {
  const base = small ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
  const common = `${base} font-bold rounded-full border whitespace-nowrap`
  
  switch (status?.toUpperCase()) {
    case 'COMPLETED':
    case 'FULLFILLED':
      return `${common} bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400`
    case 'CONFIRMED':
      return `${common} bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400`
    case 'CANCELLED':
      return `${common} bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400`
    case 'DRAFT':
    default:
      return `${common} bg-slate-100 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300`
  }
}
