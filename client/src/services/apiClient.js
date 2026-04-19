import axios from "axios"
import { clearAuthToken, getAuthToken } from "./authStorage"

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
})

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const statusCode = error.response?.status
    if (statusCode === 401) {
      clearAuthToken()
    }

    const message = error.response?.data?.message || "Request failed"
    return Promise.reject(new Error(message))
  }
)

export default apiClient
