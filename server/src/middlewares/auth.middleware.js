import { verifyToken } from "../utils/token.js"

export function requireAuth(req, _res, next) {
  try {
    const authHeader = req.headers.authorization || ""
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null

    if (!token) {
      const error = new Error("Authentication token is required")
      error.statusCode = 401
      throw error
    }

    req.user = verifyToken(token)
    next()
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 401
      error.message = "Invalid or expired authentication token"
    }
    next(error)
  }
}
