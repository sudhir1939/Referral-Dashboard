import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ReferralDetail from './pages/ReferralDetail'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function PublicOnlyRoute({ children }) {
  const token = Cookies.get('jwt_token')
  if (token) {
    return <Navigate to="/" replace />
  }
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/referrals"
          element={<Navigate to="/" replace />}
        />
        <Route
          path="/referral/:id"
          element={
            <ProtectedRoute>
              <ReferralDetail />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
