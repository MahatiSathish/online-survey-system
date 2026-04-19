import { Router } from "express"
import {
  createSurvey,
  deleteSurvey,
  getPublicSurvey,
  getSurveyById,
  importQuestionsPreview,
  listMySurveys,
  saveImportedSurveyQuestions,
  submitPublicResponse,
  updateSurvey,
} from "../controllers/survey.controller.js"
import { requireAuth } from "../middlewares/auth.middleware.js"
import { uploadQuestionsFile } from "../middlewares/upload.middleware.js"

const router = Router()

router.get("/public/:shareLink", getPublicSurvey)
router.post("/public/:shareLink/responses", submitPublicResponse)

router.get("/", requireAuth, listMySurveys)
router.post("/", requireAuth, createSurvey)
router.get("/:surveyId", requireAuth, getSurveyById)
router.put("/:surveyId", requireAuth, updateSurvey)
router.delete("/:surveyId", requireAuth, deleteSurvey)
router.post(
  "/:surveyId/questions/import",
  requireAuth,
  uploadQuestionsFile,
  importQuestionsPreview
)
router.put("/:surveyId/questions", requireAuth, saveImportedSurveyQuestions)

export default router
