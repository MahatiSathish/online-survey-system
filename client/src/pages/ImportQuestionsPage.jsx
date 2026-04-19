import { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { importQuestionsFile, saveSurveyQuestions } from "../services/surveyService"

const QUESTION_TYPES = [
  { value: "text", label: "Text" },
  { value: "single-choice", label: "MCQ" },
  { value: "multiple-choice", label: "Checkbox" },
  { value: "rating", label: "Rating" },
  { value: "dropdown", label: "Dropdown" },
]

function ImportQuestionsPage() {
  const { surveyId } = useParams()
  const navigate = useNavigate()

  const [questions, setQuestions] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const hasQuestions = useMemo(() => questions.length > 0, [questions])

  async function processFile(file) {
    setErrorMessage("")
    setSuccessMessage("")
    setIsUploading(true)

    try {
      const extension = file.name.split(".").pop()?.toLowerCase()
      if (!["csv", "xlsx"].includes(extension)) {
        throw new Error("Please upload a .csv or .xlsx file")
      }
      const response = await importQuestionsFile(surveyId, file)
      setQuestions(response.questions)
      setSuccessMessage(`${response.questions.length} questions imported. Review before saving.`)
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsUploading(false)
    }
  }

  function handleDrop(event) {
    event.preventDefault()
    setIsDragging(false)

    const file = event.dataTransfer.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  function updateQuestion(index, field, value) {
    setQuestions((previous) =>
      previous.map((question, questionIndex) =>
        questionIndex === index ? { ...question, [field]: value } : question
      )
    )
  }

  async function handleSave() {
    setErrorMessage("")
    setSuccessMessage("")
    setIsSaving(true)

    try {
      await saveSurveyQuestions(surveyId, questions)
      setSuccessMessage("Imported questions saved successfully.")
      setTimeout(() => navigate(`/surveys/${surveyId}`), 800)
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Import Questions</h1>
        <p className="mt-1 text-sm text-slate-600">
          Upload CSV/XLSX, review questions, edit if needed, then save.
        </p>
      </div>

      <div
        className={`rounded-xl border-2 border-dashed p-8 text-center transition ${
          isDragging ? "border-slate-900 bg-slate-100" : "border-slate-300 bg-white"
        }`}
        onDragOver={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <p className="text-slate-700">Drag and drop a CSV/XLSX file here</p>
        <p className="mt-2 text-sm text-slate-500">Columns: prompt, type, options, required</p>
        <label className="mt-4 inline-block cursor-pointer rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-700">
          Choose File
          <input
            type="file"
            accept=".csv,.xlsx"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {isUploading && <p className="text-sm text-slate-600">Parsing uploaded file...</p>}
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

      {hasQuestions && (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Previewing <span className="font-semibold">{questions.length}</span> imported questions
          </p>
          {questions.map((question, index) => (
            <article
              key={`${question.prompt}-${index}`}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            >
              <p className="mb-3 text-sm font-medium text-slate-500">Question {index + 1}</p>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-sm text-slate-700">Prompt</span>
                  <input
                    className="w-full rounded-md border border-slate-300 px-3 py-2"
                    value={question.prompt}
                    onChange={(event) => updateQuestion(index, "prompt", event.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm text-slate-700">Type</span>
                  <select
                    className="w-full rounded-md border border-slate-300 px-3 py-2"
                    value={question.type}
                    onChange={(event) => updateQuestion(index, "type", event.target.value)}
                  >
                    {QUESTION_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block md:col-span-2">
                  <span className="mb-1 block text-sm text-slate-700">Options (pipe separated)</span>
                  <input
                    className="w-full rounded-md border border-slate-300 px-3 py-2"
                    value={(question.options || []).join(" | ")}
                    onChange={(event) =>
                      updateQuestion(
                        index,
                        "options",
                        event.target.value
                          .split("|")
                          .map((item) => item.trim())
                          .filter(Boolean)
                      )
                    }
                  />
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={Boolean(question.required)}
                    onChange={(event) => updateQuestion(index, "required", event.target.checked)}
                  />
                  Required
                </label>
              </div>
            </article>
          ))}

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-md bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700 disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save to Survey"}
          </button>
        </div>
      )}
    </section>
  )
}

export default ImportQuestionsPage
