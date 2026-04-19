import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { deleteSurvey, getSurveyById, updateSurvey } from "../services/surveyService"

function SurveyDetailsPage() {
  const { surveyId } = useParams()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [questions, setQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    async function loadSurvey() {
      try {
        const response = await getSurveyById(surveyId)
        setTitle(response.survey.title)
        setDescription(response.survey.description || "")
        setQuestions(response.survey.questions || [])
      } catch (error) {
        setErrorMessage(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadSurvey()
  }, [surveyId])

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")
    setIsSubmitting(true)

    try {
      await updateSurvey(surveyId, { title, description, questions })
      setSuccessMessage("Survey updated successfully.")
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm("Delete this survey permanently?")
    if (!confirmed) {
      return
    }

    try {
      await deleteSurvey(surveyId)
      window.location.href = "/dashboard"
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  return (
    <section className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Edit Survey</h1>
      <p className="mt-1 text-sm text-slate-600">Survey ID: {surveyId}</p>

      {isLoading ? (
        <p className="mt-6 text-slate-600">Loading survey details...</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Title</span>
            <input
              className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-blue-500 focus:ring"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Description
            </span>
            <textarea
              className="min-h-24 w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-blue-500 focus:ring"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </label>

          {errorMessage && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {successMessage}
            </p>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-slate-900 px-4 py-2 font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-md border border-red-300 px-4 py-2 font-medium text-red-700 hover:bg-red-50"
            >
              Delete Survey
            </button>
          </div>
        </form>
      )}
    </section>
  )
}

export default SurveyDetailsPage
