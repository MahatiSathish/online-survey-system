import { Link } from "react-router-dom"

function NotFoundPage() {
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">Page Not Found</h1>
      <p className="text-slate-600">The page you requested does not exist.</p>
      <Link to="/" className="text-blue-600 hover:text-blue-700">
        Return to home
      </Link>
    </section>
  )
}

export default NotFoundPage
