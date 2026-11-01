const LOCALE = 'en-GB'

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const day = date.toLocaleDateString(LOCALE, { day: 'numeric' })
  const monthYear = date.toLocaleDateString(LOCALE, { month: 'short', year: '2-digit' })
  return `${day}, ${monthYear}`
}
