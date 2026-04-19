import { Link, Outlet, useNavigate } from "react-router-dom"
import { clearAuthToken, getAuthToken } from "../services/authStorage"

function Layout() {
  const navigate = useNavigate()
  const isAuthenticated = Boolean(getAuthToken())

  function handleLogout() {
    clearAuthToken()
    navigate("/login")
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-xl font-semibold text-slate-900">
            Online Survey System
          </Link>
          <nav className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
            <Link to="/" className="hover:text-slate-900">
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hover:text-slate-900">
                  Dashboard
                </Link>
                <Link to="/surveys/new" className="hover:text-slate-900">
                  Create Survey
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-slate-900">
                  Login
                </Link>
                <Link to="/register" className="hover:text-slate-900">
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
