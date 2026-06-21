import { Link, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

export default function Navbar() {
  const navigate = useNavigate()

  function handleLogout() {
    Cookies.remove('jwt_token')
    navigate('/login')
  }

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand" aria-label="Go to dashboard home">
          <span className="navbar__brand-mark" aria-hidden="true">GB</span>
          Go Business
        </Link>
        <nav aria-label="Primary" className="navbar__nav">
          <Link to="/" className="navbar__link">Home</Link>
        </nav>
        <button type="button" className="navbar__logout" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </header>
  )
}
