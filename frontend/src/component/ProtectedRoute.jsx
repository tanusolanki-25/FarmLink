import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContex"

export default function ProtectedRoute({ children, allowedRole }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <p className="text-center mt-20">Loading...</p>
  if (!user) return <Navigate to="/login" replace />
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" replace />

  // officer aur admin ke liye profileCompleted redirect skip karo
  const skipProfileCheck = user.role === "officer" || user.role === "admin";
  if (!user.profileCompleted && !skipProfileCheck && !location.pathname.endsWith("/register")) {
    return <Navigate to={`/${user.role}/register`} replace />
  }

  return children
}

