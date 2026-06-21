import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="notfound">
      <div className="notfound__panel">
        <p className="notfound__code">404</p>
        <h1>Page not found</h1>
        <p className="notfound__copy">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <Link to="/" className="back-link">← Back to dashboard</Link>
      </div>
    </div>
  )
}
