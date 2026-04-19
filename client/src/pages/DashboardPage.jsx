import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { deleteSurvey, listSurveys } from "../services/surveyService"

function DashboardPage() {
  const [surveys, setSurveys] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [actionMessage, setActionMessage] = useState("")

  async function loadSurveys() {
    setErrorMessage("")
    try {
      const response = await listSurveys()
      setSurveys(response.surveys)
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSurveys()
  }, [])

  async function handleDelete(surveyId) {
    const confirmed = window.confirm("Delete this survey?")
    if (!confirmed) {
      return
    }

    try {
      await deleteSurvey(surveyId)
      setSurveys((previous) => previous.filter((survey) => survey.id !== surveyId))
      setActionMessage("Survey deleted successfully.")
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  function getShareUrl(shareLink) {
    return `${window.location.origin}/s/${shareLink}`
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Survey Dashboard</h1>
          <p className="mt-1 text-slate-600">Manage all your surveys in one place.</p>
        </div>
        <Link
          to="/surveys/new"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Create Survey
        </Link>
      </div>

      {actionMessage && (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {actionMessage}
        </p>
      )}

      {errorMessage && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      {isLoading ? (
        <p className="text-slate-600">Loading surveys...</p>
      ) : surveys.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="text-slate-600">No surveys yet. Create your first survey.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {surveys.map((survey) => (
            <article
              key={survey.id}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{survey.title}</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {survey.description || "No description"}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Share Link:{" "}
                    <a
                      className="text-slate-700 underline"
                      href={getShareUrl(survey.shareLink)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {getShareUrl(survey.shareLink)}
                    </a>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/surveys/${survey.id}/import`}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Import Qs
                  </Link>
                  <Link
                    to={`/surveys/${survey.id}`}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(survey.id)}
                    className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default DashboardPage
