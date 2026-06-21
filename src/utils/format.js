/** Converts an ISO YYYY-MM-DD date string to YYYY/MM/DD. Returns the original string if it doesn't match. */
export function formatDate(isoDate) {
  if (!isoDate) return ''
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(isoDate)
  if (!match) return isoDate
  const [, y, m, d] = match
  return `${y}/${m}/${d}`
}

/** Formats a number as USD currency with no decimal digits, en-US style, e.g. $1,234. */
export function formatProfit(value) {
  const number = typeof value === 'number' ? value : Number(value)
  if (Number.isNaN(number)) return String(value ?? '')
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(number)
}
