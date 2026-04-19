import apiClient from "./apiClient"

export async function listSurveys() {
  const { data } = await apiClient.get("/surveys")
  return data
}

export async function getSurveyById(surveyId) {
  const { data } = await apiClient.get(`/surveys/${surveyId}`)
  return data
}

export async function createSurvey(payload) {
  const { data } = await apiClient.post("/surveys", payload)
  return data
}

export async function updateSurvey(surveyId, payload) {
  const { data } = await apiClient.put(`/surveys/${surveyId}`, payload)
  return data
}

export async function deleteSurvey(surveyId) {
  const { data } = await apiClient.delete(`/surveys/${surveyId}`)
  return data
}

export async function importQuestionsFile(surveyId, file) {
  const formData = new FormData()
  formData.append("file", file)

  const { data } = await apiClient.post(`/surveys/${surveyId}/questions/import`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return data
}

export async function saveSurveyQuestions(surveyId, questions) {
  const { data } = await apiClient.put(`/surveys/${surveyId}/questions`, { questions })
  return data
}

export async function getPublicSurvey(shareLink) {
  const { data } = await apiClient.get(`/surveys/public/${shareLink}`)
  return data
}

export async function submitPublicResponse(shareLink, answers) {
  const { data } = await apiClient.post(`/surveys/public/${shareLink}/responses`, { answers })
  return data
}
