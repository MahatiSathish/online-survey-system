import { Link } from "react-router-dom"

function ResponseSuccessPage() {
  return (
    <section className="mx-auto max-w-xl rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
      <h1 className="text-2xl font-semibold text-emerald-900">Response Submitted</h1>
      <p className="mt-2 text-emerald-800">
        Thank you for completing this survey. Your response has been recorded.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-md bg-emerald-700 px-4 py-2 font-medium text-white hover:bg-emerald-600"
      >
        Back to Home
      </Link>
    </section>
  )
}

export default ResponseSuccessPage
