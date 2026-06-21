import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { fetchReferralById } from '../api/client'
import { formatDate, formatProfit } from '../utils/format'

/**
 * Resolves a referral row out of the normalized API payload. Handles three shapes:
 *  - payload.raw is itself the row (id/name/serviceName/date/profit at top level)
 *  - payload.referrals is an array containing the row with matching id
 *  - payload.referrals is itself a single object (defensive)
 */
function resolveRow(payload, id) {
  if (!payload) return null
  const targetId = String(id)

  const raw = payload.raw
  if (raw && raw.id !== undefined && String(raw.id) === targetId && raw.name !== undefined) {
    return raw
  }

  if (Array.isArray(payload.referrals)) {
    const found = payload.referrals.find((r) => String(r.id) === targetId)
    if (found) return found
  } else if (payload.referrals && String(payload.referrals.id) === targetId) {
    return payload.referrals
  }

  return null
}

export default function ReferralDetail() {
  const { id } = useParams()
  const [row, setRow] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setNotFound(false)
      setRow(null)
      try {
        const payload = await fetchReferralById(id)
        if (cancelled) return
        const resolved = resolveRow(payload, id)
        if (resolved) {
          setRow(resolved)
        } else {
          setNotFound(true)
        }
      } catch {
        if (cancelled) return
        setNotFound(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [id])

  return (
    <div className="page">
      <Navbar />

      <main className="detail">
        {loading && <p className="state state--loading">Loading referral…</p>}

        {!loading && notFound && (
          <div className="card detail__notfound">
            <h1>Referral not found</h1>
            <Link to="/" className="back-link">← Back to dashboard</Link>
          </div>
        )}

        {!loading && !notFound && row && (
          <div className="card detail__card">
            <h1>Referral Details</h1>
            <h2 className="detail__name">{row.name}</h2>

            <dl className="detail__list">
              <div className="detail__row">
                <dt>Referral ID</dt>
                <dd>{row.id}</dd>
              </div>
              <div className="detail__row">
                <dt>Service Name</dt>
                <dd>{row.serviceName}</dd>
              </div>
              <div className="detail__row">
                <dt>Date</dt>
                <dd>{formatDate(row.date)}</dd>
              </div>
              <div className="detail__row">
                <dt>Profit</dt>
                <dd>{formatProfit(row.profit)}</dd>
              </div>
            </dl>

            <Link to="/" className="back-link">← Back to dashboard</Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
