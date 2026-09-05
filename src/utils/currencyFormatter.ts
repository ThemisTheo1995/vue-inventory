// src/utils/formatters.ts
const DEFAULT_LOCALE = "en-GB"

export const formatCurrency = (
  cents: number, 
  currency: string = "GBP", 
  locale: string = DEFAULT_LOCALE
): string => {
  if (cents === null || cents === undefined || isNaN(cents)) return ""
  
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(cents / 100)
}
