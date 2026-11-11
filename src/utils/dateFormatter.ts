const LOCALE = 'en-GB'

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const day = date.toLocaleDateString(LOCALE, { day: 'numeric' })
  const monthYear = date.toLocaleDateString(LOCALE, { month: 'short', year: '2-digit' })
  return `${day}, ${monthYear}`
}

export const formatDateTime = (dateString?: string) => {
  if (!dateString) return { date: "—", time: "" }
  const d = new Date(dateString)
  const date = new Intl.DateTimeFormat(LOCALE, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(d)
  const time = new Intl.DateTimeFormat(LOCALE, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(d)
  return { date, time }
}
