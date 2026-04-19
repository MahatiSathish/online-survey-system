import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getPublicSurvey, submitPublicResponse } from "../services/surveyService"

function PublicSurveyPage() {
  const { shareLink } = useParams()
  const navigate = useNavigate()

  const [survey, setSurvey] = useState(null)
  const [answers, setAnswers] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    async function loadSurvey() {
      try {
        const response = await getPublicSurvey(shareLink)
        setSurvey(response.survey)
      } catch (error) {
        setErrorMessage(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadSurvey()
  }, [shareLink])

  function setAnswer(questionId, value) {
    setAnswers((previous) => ({ ...previous, [questionId]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage("")
    setIsSubmitting(true)

    try {
      await submitPublicResponse(shareLink, answers)
      navigate(`/s/${shareLink}/success`)
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  function renderQuestionField(question) {
    if (question.type === "single-choice") {
      return (
        <div className="space-y-2">
          {question.options.map((option) => (
            <label key={option} className="flex items-center gap-2">
              <input
                type="radio"
                name={question.id}
                value={option}
                checked={answers[question.id] === option}
                onChange={() => setAnswer(question.id, option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      )
    }

    if (question.type === "multiple-choice") {
      const selected = Array.isArray(answers[question.id]) ? answers[question.id] : []

      return (
        <div className="space-y-2">
          {question.options.map((option) => (
            <label key={option} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={option}
                checked={selected.includes(option)}
                onChange={(event) => {
                  const next = event.target.checked
                    ? [...selected, option]
                    : selected.filter((item) => item !== option)
                  setAnswer(question.id, next)
                }}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      )
    }

    if (question.type === "rating") {
      return (
        <input
          type="number"
          min="1"
          max="5"
          className="w-24 rounded-md border border-slate-300 px-3 py-2"
          value={answers[question.id] || ""}
          onChange={(event) => setAnswer(question.id, event.target.value)}
        />
      )
    }

    if (question.type === "dropdown") {
      return (
        <select
          className="w-full rounded-md border border-slate-300 px-3 py-2"
          value={answers[question.id] || ""}
          onChange={(event) => setAnswer(question.id, event.target.value)}
        >
          <option value="">Select an option</option>
          {question.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )
    }

    return (
      <textarea
        className="min-h-24 w-full rounded-md border border-slate-300 px-3 py-2"
        value={answers[question.id] || ""}
        onChange={(event) => setAnswer(question.id, event.target.value)}
      />
    )
  }

  if (isLoading) {
    return <p className="text-slate-600">Loading survey...</p>
  }

  if (!survey) {
    return <p className="text-red-600">{errorMessage || "Survey not found"}</p>
  }

  return (
    <section className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">{survey.title}</h1>
      <p className="mt-1 text-slate-600">{survey.description}</p>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        {survey.questions.map((question, index) => (
          <article key={question.id} className="rounded-lg border border-slate-200 p-4">
            <p className="font-medium text-slate-900">
              {index + 1}. {question.prompt}
              {question.required && <span className="ml-1 text-red-500">*</span>}
            </p>
            <div className="mt-3">{renderQuestionField(question)}</div>
          </article>
        ))}

        {errorMessage && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700 disabled:opacity-60"
        >
          {isSubmitting ? "Submitting..." : "Submit Response"}
        </button>
      </form>
    </section>
  )
}

export default PublicSurveyPage
