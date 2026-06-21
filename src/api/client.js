import Cookies from 'js-cookie'

const AUTH_URL = 'https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/auth/signin'
const REFERRALS_URL = 'https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals'

/**
 * Signs a user in. On success returns the JWT string (read from data.data.token).
 * On failure throws an Error whose message is the API's message string
 * (falling back to a generic message if the body can't be parsed).
 */
export async function signIn(email, password) {
  let response
  try {
    response = await fetch(AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
  } catch (networkErr) {
    throw new Error('Unable to reach the server. Check your connection and try again.', { cause: networkErr })
  }

  let body = null
  try {
    body = await response.json()
  } catch {
    // ignore parse failure, handled below
  }

  if (!response.ok) {
    const message = body?.message || 'Invalid email or password'
    throw new Error(message)
  }

  const token = body?.data?.token
  if (!token) {
    throw new Error('Sign in succeeded but no token was returned.')
  }
  return token
}

/**
 * Builds a query string from a params object, skipping null/undefined/empty values.
 */
function buildQuery(params) {
  const search = new URLSearchParams()
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, value)
    }
  })
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

/**
 * Normalizes the referrals API envelope. Handles both:
 *  - { success, data: { metrics, serviceSummary, referral, referrals } }
 *  - { success, metrics, serviceSummary, referral, referrals } (flat, beside data)
 */
function normalizePayload(body) {
  const root = body?.data ?? body ?? {}
  // Some responses may nest everything under data while others place
  // metrics/serviceSummary/referral/referrals as siblings of data.
  const merged = { ...body, ...root }
  return {
    metrics: merged.metrics ?? [],
    serviceSummary: merged.serviceSummary ?? null,
    referral: merged.referral ?? null,
    referrals: merged.referrals ?? null,
    // For single-referral fetches, the row itself may BE `data`.
    raw: merged,
  }
}

async function authedGet(params) {
  const token = Cookies.get('jwt_token')
  const url = `${REFERRALS_URL}${buildQuery(params)}`

  let response
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token || ''}`,
      },
    })
  } catch (networkErr) {
    const err = new Error('Unable to reach the server. Check your connection and try again.', { cause: networkErr })
    err.status = null
    throw err
  }

  let body = null
  try {
    body = await response.json()
  } catch {
    // ignore parse failure, handled below
  }

  if (!response.ok) {
    const message = body?.message || 'Something went wrong while loading referrals.'
    const err = new Error(message)
    err.status = response.status
    throw err
  }

  return normalizePayload(body)
}

/** Fetches dashboard data: metrics, serviceSummary, referral, and the referrals list. */
export function fetchDashboard({ search, sort } = {}) {
  return authedGet({ search, sort })
}

/** Fetches a single referral by id. Returns the normalized payload; caller resolves the row. */
export function fetchReferralById(id) {
  return authedGet({ id })
}
