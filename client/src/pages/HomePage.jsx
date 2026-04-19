import { Link } from "react-router-dom"
import { getAuthToken } from "../services/authStorage"

function HomePage() {
  const isAuthenticated = Boolean(getAuthToken())

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-bold text-slate-900">Welcome to SurveyHub</h1>
      <p className="mt-3 max-w-3xl text-slate-600">
        Build and manage surveys with secure authentication, a clean dashboard, and
        simple CRUD flows powered by Express + Prisma + Supabase.
      </p>
      <div className="mt-6 flex gap-3">
        {isAuthenticated ? (
          <Link
            className="rounded-md bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700"
            to="/dashboard"
          >
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link
              className="rounded-md bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700"
              to="/register"
            >
              Get Started
            </Link>
            <Link
              className="rounded-md border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
              to="/login"
            >
              Login
            </Link>
          </>
        )}
      </div>
    </section>
  )
}

export default HomePage
