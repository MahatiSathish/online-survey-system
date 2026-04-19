import { BrowserRouter, Route, Routes } from "react-router-dom"
import Layout from "../components/Layout"
import ProtectedRoute from "../components/ProtectedRoute"
import CreateSurveyPage from "../pages/CreateSurveyPage"
import DashboardPage from "../pages/DashboardPage"
import HomePage from "../pages/HomePage"
import ImportQuestionsPage from "../pages/ImportQuestionsPage"
import LoginPage from "../pages/LoginPage"
import NotFoundPage from "../pages/NotFoundPage"
import PublicSurveyPage from "../pages/PublicSurveyPage"
import RegisterPage from "../pages/RegisterPage"
import ResponseSuccessPage from "../pages/ResponseSuccessPage"
import SurveyDetailsPage from "../pages/SurveyDetailsPage"

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/s/:shareLink" element={<PublicSurveyPage />} />
          <Route path="/s/:shareLink/success" element={<ResponseSuccessPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/surveys/new"
            element={
              <ProtectedRoute>
                <CreateSurveyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/surveys/:surveyId"
            element={
              <ProtectedRoute>
                <SurveyDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/surveys/:surveyId/import"
            element={
              <ProtectedRoute>
                <ImportQuestionsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
