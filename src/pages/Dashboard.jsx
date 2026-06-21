import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { fetchDashboard } from '../api/client'
import { formatDate, formatProfit } from '../utils/format'

const PAGE_SIZE = 10
const SEARCH_DEBOUNCE_MS = 350

export default function Dashboard() {
  const [metrics, setMetrics] = useState([])
  const [serviceSummary, setServiceSummary] = useState(null)
  const [referral, setReferral] = useState(null)
  const [referrals, setReferrals] = useState([])

  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('desc')
  const [page, setPage] = useState(1)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [copiedField, setCopiedField] = useState(null)

  const navigate = useNavigate()
  const debounceRef = useRef(null)

  // Debounce the search input into the actual query param.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setSearch(searchInput)
    }, SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(debounceRef.current)
  }, [searchInput])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const payload = await fetchDashboard({ search, sort })
        if (cancelled) return
        setMetrics(payload.metrics || [])
        setServiceSummary(payload.serviceSummary)
        setReferral(payload.referral)
        setReferrals(payload.referrals || [])
        setPage(1)
      } catch (err) {
        if (cancelled) return
        const status = err.status ? ` (${err.status})` : ''
        setError(`${err.message}${status}`)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [search, sort])

  const totalEntries = referrals.length
  const totalPages = Math.max(1, Math.ceil(totalEntries / PAGE_SIZE))
  const clampedPage = Math.min(page, totalPages)

  const pageRows = useMemo(() => {
    const start = (clampedPage - 1) * PAGE_SIZE
    return referrals.slice(start, start + PAGE_SIZE)
  }, [referrals, clampedPage])

  const rangeFrom = totalEntries === 0 ? 0 : (clampedPage - 1) * PAGE_SIZE + 1
  const rangeTo = Math.min(clampedPage * PAGE_SIZE, totalEntries)

  function handleCopy(text, field) {
    if (!text) return
    navigator.clipboard?.writeText(text).then(() => {
      setCopiedField(field)
      setTimeout(() => setCopiedField((current) => (current === field ? null : current)), 1500)
    })
  }

  function goToPage(next) {
    setPage(Math.min(Math.max(1, next), totalPages))
  }

  return (
    <div className="page">
      <Navbar />

      <main className="dashboard">
        <header className="dashboard__header">
          <h1>Referral Dashboard</h1>
          <p className="dashboard__subtitle">
            Track your referrals, earnings, and partner activity in one place.
          </p>
        </header>

        {loading && (
          <p className="state state--loading">Loading your referral data…</p>
        )}

        {!loading && error && (
          <p className="state state--error" role="alert">{error}</p>
        )}

        {!loading && !error && (
          <>
            <section
              className="card overview"
              role="region"
              aria-label="Overview metrics"
            >
              <h2 className="card__title">Overview</h2>
              <div className="overview__grid">
                {metrics.map((metric) => (
                  <div className="overview__item" key={metric.id ?? metric.label}>
                    <span className="overview__label">{metric.label}</span>
                    <span className="overview__value">{metric.value}</span>
                  </div>
                ))}
              </div>
            </section>

            {serviceSummary && (
              <section
                className="card service-summary"
                aria-label="Service summary"
              >
                <h2 className="card__title">Service summary</h2>
                <dl className="service-summary__grid">
                  <div className="service-summary__item">
                    <dt>Service</dt>
                    <dd>{serviceSummary.service}</dd>
                  </div>
                  <div className="service-summary__item">
                    <dt>Your Referrals</dt>
                    <dd>{serviceSummary.yourReferrals}</dd>
                  </div>
                  <div className="service-summary__item">
                    <dt>Active Referrals</dt>
                    <dd>{serviceSummary.activeReferrals}</dd>
                  </div>
                  <div className="service-summary__item">
                    <dt>Total Ref. Earnings</dt>
                    <dd>{serviceSummary.totalRefEarnings}</dd>
                  </div>
                </dl>
              </section>
            )}

            {referral && (
              <section className="card share" aria-label="Share referral">
                <h2 className="card__title">Refer friends and earn more</h2>
                <div className="share__grid">
                  <div className="share__field">
                    <label htmlFor="referral-link">Your Referral Link</label>
                    <div className="share__row">
                      <input
                        id="referral-link"
                        type="text"
                        readOnly
                        value={referral.link || ''}
                      />
                      <button
                        type="button"
                        onClick={() => handleCopy(referral.link, 'link')}
                      >
                        {copiedField === 'link' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  <div className="share__field">
                    <label htmlFor="referral-code">Your Referral Code</label>
                    <div className="share__row">
                      <input
                        id="referral-code"
                        type="text"
                        readOnly
                        value={referral.code || ''}
                      />
                      <button
                        type="button"
                        onClick={() => handleCopy(referral.code, 'code')}
                      >
                        {copiedField === 'code' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            <section className="card table-card" aria-label="All referrals">
              <div className="table-card__head">
                <h2 className="card__title">All referrals</h2>

                <div className="table-card__controls">
                  <div className="search-field">
                    <label htmlFor="referral-search" aria-label="Search referrals">
                      <svg viewBox="0 0 20 20" aria-hidden="true" className="search-field__icon">
                        <circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="1.6" />
                        <line x1="13.4" y1="13.4" x2="18" y2="18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                      <input
                        id="referral-search"
                        type="text"
                        placeholder="Name or service…"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                      />
                    </label>
                  </div>

                  <label className="sort-field">
                    Sort by date
                    <select value={sort} onChange={(e) => setSort(e.target.value)}>
                      <option value="desc">Newest first</option>
                      <option value="asc">Oldest first</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Service</th>
                      <th scope="col">Date</th>
                      <th scope="col" className="col-profit">Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.length === 0 && (
                      <tr className="empty-row">
                        <td colSpan={4}>No matching entries</td>
                      </tr>
                    )}
                    {pageRows.map((row) => (
                      <tr
                        key={row.id}
                        tabIndex={0}
                        className="data-row"
                        onClick={() => navigate(`/referral/${row.id}`)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            navigate(`/referral/${row.id}`)
                          }
                        }}
                      >
                        <td>{row.name}</td>
                        <td>{row.serviceName}</td>
                        <td>{formatDate(row.date)}</td>
                        <td className="col-profit">{formatProfit(row.profit)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="table-card__footer">
                <p className="entries-summary">
                  Showing {rangeFrom}–{rangeTo} of {totalEntries} entries
                </p>

                {totalPages > 1 && (
                  <nav className="pagination" aria-label="Pagination">
                    <button
                      type="button"
                      onClick={() => goToPage(clampedPage - 1)}
                      disabled={clampedPage === 1}
                    >
                      Previous
                    </button>

                    <div className="pagination__pages">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          type="button"
                          className={p === clampedPage ? 'pagination__page is-active' : 'pagination__page'}
                          aria-current={p === clampedPage ? 'page' : undefined}
                          onClick={() => goToPage(p)}
                        >
                          {p}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => goToPage(clampedPage + 1)}
                      disabled={clampedPage === totalPages}
                    >
                      Next
                    </button>
                  </nav>
                )}
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
