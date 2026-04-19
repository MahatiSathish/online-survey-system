export function notFoundHandler(req, res, _next) {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  })
}

export function errorHandler(error, _req, res, _next) {
  const isFileTooLarge = error.code === "LIMIT_FILE_SIZE"
  const statusCode = isFileTooLarge ? 400 : error.statusCode || 500
  const message = isFileTooLarge
    ? "Uploaded file is too large (max 5MB)"
    : error.message || "Internal server error"

  res.status(statusCode).json({ message })
}
