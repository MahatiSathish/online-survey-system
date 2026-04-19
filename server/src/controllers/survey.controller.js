import {
  createPublicSurveyResponse,
  createSurveyRecord,
  deleteSurveyRecord,
  getSurveyByShareLink,
  getSurveyDetails,
  getSurveysForOwner,
  parseQuestionsFromUpload,
  saveImportedQuestions,
  updateSurveyRecord,
} from "../services/survey.service.js"

export async function listMySurveys(req, res, next) {
  try {
    const surveys = await getSurveysForOwner(req.user.userId)
    res.status(200).json({ surveys })
  } catch (error) {
    next(error)
  }
}

export async function createSurvey(req, res, next) {
  try {
    const survey = await createSurveyRecord(req.user.userId, req.body)
    res.status(201).json({ survey })
  } catch (error) {
    next(error)
  }
}

export async function getSurveyById(req, res, next) {
  try {
    const survey = await getSurveyDetails(req.params.surveyId, req.user.userId)
    res.status(200).json({ survey })
  } catch (error) {
    next(error)
  }
}

export async function updateSurvey(req, res, next) {
  try {
    const survey = await updateSurveyRecord(
      req.params.surveyId,
      req.user.userId,
      req.body
    )
    res.status(200).json({ survey })
  } catch (error) {
    next(error)
  }
}

export async function deleteSurvey(req, res, next) {
  try {
    await deleteSurveyRecord(req.params.surveyId, req.user.userId)
    res.status(200).json({ message: "Survey deleted successfully" })
  } catch (error) {
    next(error)
  }
}

export async function importQuestionsPreview(req, res, next) {
  try {
    const questions = await parseQuestionsFromUpload(req.file)
    res.status(200).json({ questions })
  } catch (error) {
    next(error)
  }
}

export async function saveImportedSurveyQuestions(req, res, next) {
  try {
    const survey = await saveImportedQuestions(
      req.params.surveyId,
      req.user.userId,
      req.body.questions
    )
    res.status(200).json({ survey })
  } catch (error) {
    next(error)
  }
}

export async function getPublicSurvey(req, res, next) {
  try {
    const survey = await getSurveyByShareLink(req.params.shareLink)
    res.status(200).json({ survey })
  } catch (error) {
    next(error)
  }
}

export async function submitPublicResponse(req, res, next) {
  try {
    const response = await createPublicSurveyResponse(
      req.params.shareLink,
      req.body.answers
    )
    res.status(201).json({ message: "Response submitted successfully", response })
  } catch (error) {
    next(error)
  }
}
