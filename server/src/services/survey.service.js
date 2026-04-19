import prisma from "../lib/prisma.js"
import Papa from "papaparse"
import XLSX from "xlsx"
import { randomUUID } from "node:crypto"

const ALLOWED_QUESTION_TYPES = [
  "text",
  "single-choice",
  "multiple-choice",
  "rating",
  "dropdown",
]
const OPTION_REQUIRED_TYPES = ["single-choice", "multiple-choice", "dropdown"]
const QUESTION_TYPE_ALIASES = {
  text: "text",
  mcq: "single-choice",
  "single-choice": "single-choice",
  single: "single-choice",
  radio: "single-choice",
  checkbox: "multiple-choice",
  "multiple-choice": "multiple-choice",
  multiple: "multiple-choice",
  rating: "rating",
  dropdown: "dropdown",
  select: "dropdown",
}

function normalizeQuestions(questions = []) {
  if (!Array.isArray(questions)) {
    const error = new Error("questions must be an array")
    error.statusCode = 400
    throw error
  }

  return questions.map((question, index) => {
    if (!question?.prompt?.trim()) {
      const error = new Error(`Row ${index + 1}: prompt is required`)
      error.statusCode = 400
      throw error
    }

    const type = QUESTION_TYPE_ALIASES[String(question.type || "text").toLowerCase()] || "text"
    if (!ALLOWED_QUESTION_TYPES.includes(type)) {
      const error = new Error(`Row ${index + 1}: invalid question type "${question.type}"`)
      error.statusCode = 400
      throw error
    }

    const normalizedOptions = Array.isArray(question.options)
      ? question.options.map((option) => String(option).trim()).filter(Boolean)
      : []

    if (OPTION_REQUIRED_TYPES.includes(type) && normalizedOptions.length === 0) {
      const error = new Error(`Row ${index + 1}: options are required for "${type}" questions`)
      error.statusCode = 400
      throw error
    }

    return {
      prompt: question.prompt.trim(),
      type,
      options: normalizedOptions,
      required: Boolean(question.required),
    }
  })
}

function assertSurveyAccess(survey, errorMessage = "Survey not found") {
  if (!survey) {
    const error = new Error(errorMessage)
    error.statusCode = 404
    throw error
  }
}

async function ensureShareLink(surveyId, shareLink) {
  if (shareLink) {
    return shareLink
  }

  const generatedShareLink = randomUUID()
  await prisma.survey.update({
    where: { id: surveyId },
    data: { shareLink: generatedShareLink },
  })
  return generatedShareLink
}

function parseQuestionsFromRows(rows = []) {
  if (!Array.isArray(rows) || rows.length === 0) {
    const error = new Error("No rows found in uploaded file")
    error.statusCode = 400
    throw error
  }

  const parsed = rows
    .map((row) => {
      const prompt = String(row.prompt || row.question || "").trim()
      const rawType = String(row.type || "text").trim().toLowerCase()
      const requiredRaw = String(row.required || "false").trim().toLowerCase()
      const optionsString = String(row.options || "").trim()

      return {
        prompt,
        type: QUESTION_TYPE_ALIASES[rawType] || rawType,
        required: ["true", "yes", "1"].includes(requiredRaw),
        options: optionsString ? optionsString.split("|").map((item) => item.trim()) : [],
      }
    })
    .filter((question) => question.prompt)

  return normalizeQuestions(parsed)
}

function parseCsvBuffer(fileBuffer) {
  const csvText = fileBuffer.toString("utf-8")
  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim().toLowerCase(),
  })

  if (result.errors.length > 0) {
    const error = new Error("CSV parsing failed")
    error.statusCode = 400
    throw error
  }

  return result.data
}

function parseXlsxBuffer(fileBuffer) {
  const workbook = XLSX.read(fileBuffer, { type: "buffer" })
  const firstSheet = workbook.SheetNames[0]
  if (!firstSheet) {
    const error = new Error("No sheets found in uploaded XLSX file")
    error.statusCode = 400
    throw error
  }

  return XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet], { defval: "" })
}

export async function getSurveysForOwner(ownerId) {
  const surveys = await prisma.survey.findMany({
    where: { ownerId },
    include: {
      questions: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return Promise.all(
    surveys.map(async (survey) => ({
      ...survey,
      shareLink: await ensureShareLink(survey.id, survey.shareLink),
    }))
  )
}

export async function createSurveyRecord(ownerId, payload) {
  if (!payload?.title) {
    const error = new Error("Survey title is required")
    error.statusCode = 400
    throw error
  }

  const normalizedQuestions = normalizeQuestions(payload.questions || [])

  const survey = await prisma.survey.create({
    data: {
      title: payload.title.trim(),
      description: payload.description || "",
      ownerId,
      shareLink: randomUUID(),
      questions: {
        create: normalizedQuestions,
      },
    },
    include: {
      questions: true,
    },
  })

  return survey
}

export async function updateSurveyRecord(surveyId, ownerId, payload) {
  const existingSurvey = await prisma.survey.findFirst({
    where: { id: surveyId, ownerId },
    include: { questions: true },
  })
  assertSurveyAccess(existingSurvey)

  if (!payload?.title?.trim()) {
    const error = new Error("Survey title is required")
    error.statusCode = 400
    throw error
  }

  const normalizedQuestions = normalizeQuestions(payload.questions || [])

  await prisma.question.deleteMany({ where: { surveyId } })

  return prisma.survey.update({
    where: { id: surveyId },
    data: {
      title: payload.title.trim(),
      description: payload.description || "",
      questions: {
        create: normalizedQuestions,
      },
    },
    include: {
      questions: true,
    },
  })
}

export async function deleteSurveyRecord(surveyId, ownerId) {
  const existingSurvey = await prisma.survey.findFirst({
    where: { id: surveyId, ownerId },
  })
  assertSurveyAccess(existingSurvey)

  await prisma.survey.delete({ where: { id: surveyId } })
}

export async function getSurveyDetails(surveyId, ownerId) {
  const survey = await prisma.survey.findFirst({
    where: {
      id: surveyId,
      ownerId,
    },
    include: {
      questions: true,
    },
  })

  assertSurveyAccess(survey)

  return {
    ...survey,
    shareLink: await ensureShareLink(survey.id, survey.shareLink),
  }
}

export async function parseQuestionsFromUpload(file) {
  if (!file) {
    const error = new Error("Please upload a CSV or XLSX file")
    error.statusCode = 400
    throw error
  }

  const extension = file.originalname.split(".").pop()?.toLowerCase()
  if (!["csv", "xlsx"].includes(extension)) {
    const error = new Error("Only CSV and XLSX files are supported")
    error.statusCode = 400
    throw error
  }
  const rows = extension === "csv" ? parseCsvBuffer(file.buffer) : parseXlsxBuffer(file.buffer)

  return parseQuestionsFromRows(rows)
}

export async function saveImportedQuestions(surveyId, ownerId, questions) {
  const survey = await prisma.survey.findFirst({
    where: { id: surveyId, ownerId },
  })
  assertSurveyAccess(survey)

  const normalizedQuestions = normalizeQuestions(questions || [])

  await prisma.question.deleteMany({ where: { surveyId } })

  return prisma.survey.update({
    where: { id: surveyId },
    data: {
      questions: {
        create: normalizedQuestions,
      },
    },
    include: {
      questions: true,
    },
  })
}

export async function getSurveyByShareLink(shareLink) {
  const survey = await prisma.survey.findUnique({
    where: { shareLink },
    include: {
      questions: {
        orderBy: { createdAt: "asc" },
      },
    },
  })
  assertSurveyAccess(survey, "Public survey not found")
  return survey
}

export async function createPublicSurveyResponse(shareLink, answers) {
  if (!answers || typeof answers !== "object") {
    const error = new Error("answers is required")
    error.statusCode = 400
    throw error
  }

  const survey = await getSurveyByShareLink(shareLink)

  for (const question of survey.questions) {
    const answer = answers[question.id]
    if (question.required) {
      const missingAnswer =
        answer === undefined ||
        answer === null ||
        answer === "" ||
        (Array.isArray(answer) && answer.length === 0)

      if (missingAnswer) {
        const error = new Error(`Answer is required for: ${question.prompt}`)
        error.statusCode = 400
        throw error
      }
    }

    if (answer === undefined || answer === null || answer === "") {
      continue
    }

    if (question.type === "single-choice" || question.type === "dropdown") {
      if (typeof answer !== "string" || !question.options.includes(answer)) {
        const error = new Error(`Invalid answer for: ${question.prompt}`)
        error.statusCode = 400
        throw error
      }
    }

    if (question.type === "multiple-choice") {
      const isValidArray =
        Array.isArray(answer) && answer.every((item) => question.options.includes(item))
      if (!isValidArray) {
        const error = new Error(`Invalid checkbox answers for: ${question.prompt}`)
        error.statusCode = 400
        throw error
      }
    }

    if (question.type === "rating") {
      const numericValue = Number(answer)
      if (!Number.isInteger(numericValue) || numericValue < 1 || numericValue > 5) {
        const error = new Error(`Rating must be between 1 and 5 for: ${question.prompt}`)
        error.statusCode = 400
        throw error
      }
    }

    if (question.type === "text" && typeof answer !== "string") {
      const error = new Error(`Text answer must be a string for: ${question.prompt}`)
      error.statusCode = 400
      throw error
    }
  }

  const response = await prisma.response.create({
    data: {
      surveyId: survey.id,
      answers,
    },
  })

  return response
}
