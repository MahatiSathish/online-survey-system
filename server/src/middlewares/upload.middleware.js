import multer from "multer"

const storage = multer.memoryStorage()

function fileFilter(_req, file, callback) {
  const extension = file.originalname.split(".").pop()?.toLowerCase()
  const allowedExtensions = ["csv", "xlsx"]

  if (!allowedExtensions.includes(extension)) {
    const error = new Error("Only CSV and XLSX files are allowed")
    error.statusCode = 400
    callback(error)
    return
  }

  callback(null, true)
}

export const uploadQuestionsFile = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("file")
